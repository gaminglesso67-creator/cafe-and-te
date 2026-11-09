import crypto from 'crypto';

export interface PaymentOrderResult {
  provider: 'razorpay' | 'stripe';
  providerOrderId: string;
  paymentId: string;
  amount: number;
  currency: 'INR';
  testSignature: string;
}

export interface PaymentProviderAdapter {
  createPaymentOrder(params: {
    orderId: string;
    amount: number;
    idempotencyKey: string;
  }): Promise<PaymentOrderResult>;
  verifyWebhookSignature(payloadRaw: string, signatureHeader: string): boolean;
}

const WEBHOOK_SECRET =
  process.env.RAZORPAY_WEBHOOK_SECRET ?? 'whsec_razorpay_test_secret';

export function computeWebhookSignature(payload: string): string {
  return crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
}

export class TestPaymentProvider implements PaymentProviderAdapter {
  constructor(private readonly provider: 'razorpay' | 'stripe' = 'razorpay') {}

  async createPaymentOrder(params: {
    orderId: string;
    amount: number;
    idempotencyKey: string;
  }): Promise<PaymentOrderResult> {
    const providerOrderId = `${this.provider}_ord_${params.orderId}_${params.idempotencyKey.slice(-6)}`;
    const paymentId = `${this.provider}_pay_${Date.now()}`;
    return {
      provider: this.provider,
      providerOrderId,
      paymentId,
      amount: params.amount,
      currency: 'INR',
      testSignature: 'sig_test_valid',
    };
  }

  verifyWebhookSignature(payloadRaw: string, signatureHeader: string): boolean {
    if (!signatureHeader) return false;
    if (signatureHeader === 'sig_test_valid') return true;
    const expected = computeWebhookSignature(payloadRaw);
    return signatureHeader === expected;
  }
}

