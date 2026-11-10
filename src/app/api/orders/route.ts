import { NextRequest, NextResponse } from 'next/server';
import { getStore, OrderRecord } from '@/lib/db';
import { createOrderSchema } from '@/lib/validations/schemas';
import { checkRateLimit, isHoneypotTriggered } from '@/lib/security/spam-guard';
import { dispatchNotification } from '@/lib/notifications/service';
import { enqueueAndPushOrderToPos } from '@/lib/pos/adapter';
import { syncOrderToSanity } from '@/sanity/lib/fetchers';

export async function GET() {
  return NextResponse.json({ orders: getStore().orders });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const rate = checkRateLimit(`orders:${ip}`, 15, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: '{{RATE_LIMIT_EXCEEDED}}' }, { status: 429 });
  }

  const store = getStore();
  if (!store.orderingEnabled) {
    return NextResponse.json(
      { error: '{{ONLINE_ORDERING_CURRENTLY_PAUSED_BY_RESTAURANT}}' },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: '{{INVALID_JSON_PAYLOAD}}' }, { status: 400 });
  }

  if (isHoneypotTriggered(body.honeypot)) {
    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '{{ORDER_VALIDATION_FAILED}}', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const idempotencyKey =
    data.idempotencyKey ?? `idem-${data.customerPhone}-${Date.now()}`;

  // Idempotency check so the same order is never created twice (PRD 10.4 & 11.3)
  const existing = store.orders.find((o) => o.idempotencyKey === idempotencyKey);
  if (existing) {
    return NextResponse.json({ order: existing, deduplicated: true }, { status: 200 });
  }

  const subtotal = data.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const taxAmount = Math.round(subtotal * 0.05);
  const deliveryFee = data.orderType === 'DELIVERY' ? 50 : 0;
  const grandTotal = subtotal + taxAmount + deliveryFee;

  const isCod = data.paymentMethod === 'COD';
  const orderId = `ORD-${Date.now().toString().slice(-4)}`;

  const record: OrderRecord = {
    id: orderId,
    orderNumber: `SJ-2026-${orderId.slice(-4)}`,
    idempotencyKey,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail || undefined,
    addressLine: data.addressLine,
    pincode: data.pincode,
    pickupSlot: data.pickupSlot,
    orderType: data.orderType,
    // Online payment orders start as `placed` and only transition to `paid` via `/api/webhooks/payment`!
    status: isCod ? 'accepted' : 'placed',
    paymentStatus: 'PENDING',
    paymentMethod: data.paymentMethod,
    subtotal,
    discountAmount: 0,
    taxAmount,
    deliveryFee,
    grandTotal,
    notes: data.notes,
    posSyncStatus: 'PENDING',
    posAdapterUsed: store.activePosAdapter,
    items: data.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      variantName: i.variantName,
    })),
    createdAt: new Date().toISOString(),
  };

  store.orders.unshift(record);
  await syncOrderToSanity(record);

  await dispatchNotification({
    eventKey: 'ORDER_PLACED',
    channel: 'WHATSAPP',
    recipient: record.customerPhone,
    variables: { orderId: record.id, total: record.grandTotal },
  });

  if (isCod) {
    await enqueueAndPushOrderToPos(record);
    await dispatchNotification({
      eventKey: 'ADMIN_NEW_ORDER_ALERT',
      channel: 'ADMIN_ALERT',
      recipient: 'admin@saanjh.local',
      variables: { orderId: record.id },
    });
  }

  return NextResponse.json({ order: record }, { status: 201 });
}

