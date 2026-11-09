import { NextRequest, NextResponse } from 'next/server';
import { paymentCreateSchema } from '@/lib/validations/schemas';
import { TestPaymentProvider } from '@/lib/payments/provider';

/**
 * Server-Created Payment Order (`POST /api/payments/create`, PRD 8.3 & 11.4).
 * Payment status is NEVER confirmed here; only `/api/webhooks/payment` confirms payment.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: '{{INVALID_JSON_PAYLOAD}}' }, { status: 400 });
  }

  const parsed = paymentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '{{PAYMENT_CREATE_VALIDATION_FAILED}}', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { orderId, amount, provider, idempotencyKey } = parsed.data;
  const adapter = new TestPaymentProvider(provider);
  const created = await adapter.createPaymentOrder({
    orderId,
    amount,
    idempotencyKey: idempotencyKey ?? `pay-idem-${orderId}`,
  });

  return NextResponse.json(created, { status: 201 });
}
