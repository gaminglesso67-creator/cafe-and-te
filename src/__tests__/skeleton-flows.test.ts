import { describe, expect, it } from 'vitest';
import { formatPriceToken, getImageSlot, t } from '@/lib/content';
import { canIssueRefund, hasPermission } from '@/lib/auth/rbac';
import {
  contactFormSchema,
  createOrderSchema,
  paymentWebhookSchema,
  reservationSchema,
} from '@/lib/validations/schemas';
import { checkRateLimit, isHoneypotTriggered } from '@/lib/security/spam-guard';
import { computeWebhookSignature, TestPaymentProvider } from '@/lib/payments/provider';
import { enqueueAndPushOrderToPos, ManualPosAdapter } from '@/lib/pos/adapter';
import { getStore } from '@/lib/db';

describe('Saanjh Skeleton Core Flows (PRD Section 13)', () => {
  it('resolves content keys to {{SECTION_FIELD}} tokens and never leaks raw strings', () => {
    expect(t('home.hero.title')).toBe('{{HERO_HEADING}}');
    expect(t('unmapped.custom.field')).toBe('{{UNMAPPED_CUSTOM_FIELD}}');
    expect(formatPriceToken()).toBe('₹{{PRICE}}');
    const slot = getImageSlot('hero_banner', '16x9');
    expect(slot.src).toBe('/placeholders/16x9.svg');
    expect(slot.alt).toBe('{{ALT_HERO_BANNER}}');
  });

  it('enforces the PRD 9.9 Role Permission Matrix across STAFF, MANAGER, and OWNER', () => {
    // Staff permissions
    expect(hasPermission('STAFF', 'orders_reservations:manage')).toBe(true);
    expect(hasPermission('STAFF', 'inventory:toggle_stock')).toBe(true);
    expect(hasPermission('STAFF', 'menu:edit')).toBe(false);
    expect(hasPermission('STAFF', 'users:manage')).toBe(false);

    // Manager permissions
    expect(hasPermission('MANAGER', 'menu:edit')).toBe(true);
    expect(hasPermission('MANAGER', 'reviews:moderate')).toBe(true);
    expect(hasPermission('MANAGER', 'users:manage')).toBe(false);
    expect(hasPermission('MANAGER', 'settings_payments_pos:manage')).toBe(false);
    expect(canIssueRefund('MANAGER', 1500).allowed).toBe(true);
    expect(canIssueRefund('MANAGER', 5000).allowed).toBe(false);

    // Owner permissions
    expect(hasPermission('OWNER', 'users:manage')).toBe(true);
    expect(hasPermission('OWNER', 'settings_payments_pos:manage')).toBe(true);
    expect(canIssueRefund('OWNER', 10000).allowed).toBe(true);
  });

  it('validates Reservation, Order, and Contact payloads via Zod and catches honeypots', () => {
    expect(isHoneypotTriggered('')).toBe(false);
    expect(isHoneypotTriggered('http://spam.bot')).toBe(true);

    const validRes = reservationSchema.safeParse({
      date: '2026-11-20',
      timeSlot: '20:00',
      partySize: 4,
      name: 'Guest Token',
      phone: '+919876543210',
    });
    expect(validRes.success).toBe(true);

    const invalidOrder = createOrderSchema.safeParse({
      orderType: 'DELIVERY',
      customerName: 'A',
      customerPhone: '123',
      items: [],
    });
    expect(invalidOrder.success).toBe(false);

    const validContact = contactFormSchema.safeParse({
      name: 'Visitor',
      phone: '+919876543210',
      message: 'Enquiry about table booking',
    });
    expect(validContact.success).toBe(true);

    const rl = checkRateLimit('test-ip-bucket', 2, 60_000);
    expect(rl.allowed).toBe(true);
  });

  it('verifies payment webhook signatures and enforces idempotent POS queue pushes', async () => {
    const provider = new TestPaymentProvider('razorpay');
    const rawPayload = JSON.stringify({
      eventId: 'evt_test_1',
      orderId: 'ORD-1001',
      paymentId: 'pay_test_1',
      status: 'captured',
    });

    const validHmac = computeWebhookSignature(rawPayload);
    expect(provider.verifyWebhookSignature(rawPayload, validHmac)).toBe(true);
    expect(provider.verifyWebhookSignature(rawPayload, 'invalid_sig')).toBe(false);
    expect(paymentWebhookSchema.safeParse(JSON.parse(rawPayload)).success).toBe(true);

    const store = getStore();
    const order = store.orders[0]!;
    const job1 = await enqueueAndPushOrderToPos(order);
    const job2 = await enqueueAndPushOrderToPos(order);
    // Idempotency key guarantees the same order is not pushed/billed twice
    expect(job1.idempotencyKey).toBe(`pos-idem-${order.id}`);
    expect(job2.id).toBe(job1.id);

    const manualAdapter = new ManualPosAdapter();
    const health = await manualAdapter.healthCheck();
    expect(health.healthy).toBe(true);
  });
});

