import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { paymentWebhookSchema } from '@/lib/validations/schemas';
import { TestPaymentProvider } from '@/lib/payments/provider';
import { enqueueAndPushOrderToPos } from '@/lib/pos/adapter';
import { dispatchNotification } from '@/lib/notifications/service';

/**
 * Payment Webhook Endpoint (`POST /api/webhooks/payment`, PRD 8.3, 10.3 & 11.4):
 * - Single source of truth for payment confirmation (never the client redirect)
 * - Verifies webhook signature
 * - Enforces idempotency / replay protection via `eventId`
 * - Marks order `paid` -> pushes order to POS queue -> triggers Customer & Restaurant notifications
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-webhook-signature') ?? '';
  const rawBody = await req.text();

  const verifier = new TestPaymentProvider('razorpay');
  if (!verifier.verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { error: '{{INVALID_WEBHOOK_SIGNATURE}}' },
      { status: 401 }
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: '{{INVALID_WEBHOOK_JSON}}' }, { status: 400 });
  }

  const parsed = paymentWebhookSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '{{INVALID_WEBHOOK_SCHEMA}}', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { eventId, orderId, paymentId, status } = parsed.data;
  const store = getStore();

  // Replay / Idempotency protection (PRD 8.3)
  if (store.processedWebhookKeys.has(eventId)) {
    return NextResponse.json({
      received: true,
      idempotentReplay: true,
      eventId,
    });
  }
  store.processedWebhookKeys.add(eventId);

  const order = store.orders.find((o) => o.id === orderId);
  if (!order) {
    return NextResponse.json({ error: '{{ORDER_NOT_FOUND_FOR_WEBHOOK}}' }, { status: 404 });
  }

  if (status === 'captured') {
    order.paymentStatus = 'CAPTURED';
    order.status = 'paid';

    // Step 3 of PRD 10.3: Push paid order to POS queue with idempotency key
    const posJob = await enqueueAndPushOrderToPos(order);

    // Step 6 of PRD 10.3: Send Customer & Restaurant notifications
    await dispatchNotification({
      eventKey: 'PAYMENT_RECEIVED',
      channel: 'WHATSAPP',
      recipient: order.customerPhone,
      variables: { orderId: order.id, paymentId },
    });

    await dispatchNotification({
      eventKey: 'ADMIN_NEW_ORDER_ALERT',
      channel: 'ADMIN_ALERT',
      recipient: 'admin@saanjh.local',
      variables: { orderId: order.id, posJobStatus: posJob.status },
    });

    return NextResponse.json({
      received: true,
      orderId: order.id,
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      posJobId: posJob.id,
      posSyncStatus: order.posSyncStatus,
    });
  }

  // Failed payment handling (PRD 8.3 & 8.4)
  order.paymentStatus = 'FAILED';
  await dispatchNotification({
    eventKey: 'ADMIN_PAYMENT_FAILURE_ALERT',
    channel: 'ADMIN_ALERT',
    recipient: 'admin@saanjh.local',
    variables: { orderId: order.id, paymentId },
  });

  return NextResponse.json({
    received: true,
    orderId: order.id,
    paymentStatus: 'FAILED',
  });
}

