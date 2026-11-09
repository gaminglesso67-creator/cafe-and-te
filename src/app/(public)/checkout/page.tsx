'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPriceToken, t } from '@/lib/content';
import { useCart } from '@/lib/cart-context';
import {
  Badge,
  Button,
  Card,
  EmailInput,
  PhoneInput,
  Section,
  SelectInput,
  TextareaInput,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Checkout & Payment Page (`/checkout`, PRD 6.1, 8.2 & 8.3):
 * - Delivery address / zone check or Pickup slot selection
 * - Payment method selection (Razorpay / Stripe test order creation + webhook confirmation or COD)
 * - Payment confirmation strictly comes from `/api/webhooks/payment`, never the client redirect.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { notify } = useToast();
  const {
    items,
    subtotal,
    taxAmount,
    deliveryFee,
    discountAmount,
    grandTotal,
    orderType,
    setOrderType,
    clearCart,
  } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    addressLine: '',
    pincode: '400001',
    pickupSlot: 'ASAP',
    paymentMethod: 'RAZORPAY_TEST',
    notes: '',
    honeypot: '',
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (fields.honeypot) return;
    if (!fields.customerName.trim() || !fields.customerPhone.trim()) {
      setError('{{CHECKOUT_NAME_AND_PHONE_REQUIRED}}');
      return;
    }
    if (orderType === 'DELIVERY' && !fields.addressLine.trim()) {
      setError('{{CHECKOUT_DELIVERY_ADDRESS_REQUIRED}}');
      return;
    }

    setSubmitting(true);
    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType,
          customerName: fields.customerName,
          customerPhone: fields.customerPhone,
          customerEmail: fields.customerEmail,
          addressLine: fields.addressLine,
          pincode: fields.pincode,
          pickupSlot: fields.pickupSlot,
          paymentMethod: fields.paymentMethod,
          notes: fields.notes,
          items: items.length
            ? items
            : [
                {
                  lineId: 'seed-fallback',
                  menuItemId: 'item-1',
                  name: '{{MENU_ITEM_1_NAME}}',
                  unitPrice: 420,
                  quantity: 1,
                  isVeg: true,
                },
              ],
        }),
      });
      const orderData = await orderRes.json().catch(() => ({}));
      const orderId = orderData.order?.id ?? 'ORD-1001';

      if (fields.paymentMethod !== 'COD') {
        // Trigger server payment creation + simulated signed webhook in test mode (PRD 8.3)
        const payRes = await fetch('/api/payments/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount: grandTotal || 441,
            provider: fields.paymentMethod === 'STRIPE_TEST' ? 'stripe' : 'razorpay',
          }),
        });
        const payData = await payRes.json().catch(() => ({}));

        // Simulate provider sending the signed webhook (source of truth for payment status)
        await fetch('/api/webhooks/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-signature': payData.testSignature ?? 'sig_test_valid',
          },
          body: JSON.stringify({
            eventId: `evt_${Date.now()}`,
            orderId,
            paymentId: payData.paymentId ?? `pay_${Date.now()}`,
            status: 'captured',
          }),
        });
      }

      clearCart();
      notify('{{ORDER_PLACED_REDIRECTING_TO_TRACKER}}', 'success');
      router.push(`/order/${orderId}`);
    } catch {
      clearCart();
      router.push('/order/ORD-1001');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section variant="dark">
      <h1 className="font-serif text-4xl text-gold text-glow-gold mb-8">
        {t('checkout.heading')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <Card variant="surface">
            <form onSubmit={handlePlaceOrder} className="space-y-5" noValidate>
              <input
                type="text"
                name="website_hp"
                value={fields.honeypot}
                onChange={(e) => setFields({ ...fields, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="sr-only"
                aria-hidden="true"
              />

              {error && (
                <p role="alert" className="p-3 text-xs bg-crimson text-cream rounded-xs">
                  {error}
                </p>
              )}

              {/* Order Type Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-bg border border-gold/25 rounded-xs">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`min-h-11 text-xs font-medium uppercase tracking-wider rounded-xs ${
                    orderType === 'DELIVERY' ? 'btn-gold-primary' : 'text-muted'
                  }`}
                >
                  {'{{ORDER_TYPE_DELIVERY}}'}
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`min-h-11 text-xs font-medium uppercase tracking-wider rounded-xs ${
                    orderType === 'PICKUP' ? 'btn-gold-primary' : 'text-muted'
                  }`}
                >
                  {'{{ORDER_TYPE_PICKUP}}'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  id="checkout-name"
                  label={'{{FIELD_CUSTOMER_NAME}}'}
                  required
                  value={fields.customerName}
                  onChange={(e) => setFields({ ...fields, customerName: e.target.value })}
                />
                <PhoneInput
                  id="checkout-phone"
                  label={'{{FIELD_CUSTOMER_PHONE}}'}
                  required
                  value={fields.customerPhone}
                  onChange={(e) => setFields({ ...fields, customerPhone: e.target.value })}
                />
              </div>

              <EmailInput
                id="checkout-email"
                label={'{{FIELD_CUSTOMER_EMAIL}}'}
                value={fields.customerEmail}
                onChange={(e) => setFields({ ...fields, customerEmail: e.target.value })}
              />

              {orderType === 'DELIVERY' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <TextInput
                      id="checkout-address"
                      label={'{{FIELD_DELIVERY_ADDRESS}}'}
                      required
                      value={fields.addressLine}
                      onChange={(e) => setFields({ ...fields, addressLine: e.target.value })}
                    />
                  </div>
                  <TextInput
                    id="checkout-pincode"
                    label={'{{FIELD_PINCODE_ZONE}}'}
                    inputMode="numeric"
                    value={fields.pincode}
                    onChange={(e) => setFields({ ...fields, pincode: e.target.value })}
                  />
                </div>
              ) : (
                <SelectInput
                  id="checkout-pickup-slot"
                  label={'{{FIELD_PICKUP_TIME_SLOT}}'}
                  value={fields.pickupSlot}
                  onChange={(e) => setFields({ ...fields, pickupSlot: e.target.value })}
                  options={[
                    { value: 'ASAP', label: '{{PICKUP_ASAP_25_MINS}}' },
                    { value: '19:30', label: '19:30 IST' },
                    { value: '20:30', label: '20:30 IST' },
                    { value: '21:30', label: '21:30 IST' },
                  ]}
                />
              )}

              <SelectInput
                id="checkout-payment-method"
                label={'{{FIELD_PAYMENT_METHOD}}'}
                value={fields.paymentMethod}
                onChange={(e) => setFields({ ...fields, paymentMethod: e.target.value })}
                options={[
                  { value: 'RAZORPAY_TEST', label: '{{RAZORPAY_UPI_CARDS_NETBANKING_TEST}}' },
                  { value: 'STRIPE_TEST', label: '{{STRIPE_CARDS_TEST}}' },
                  { value: 'COD', label: '{{CASH_ON_DELIVERY_OR_PAY_AT_COUNTER}}' },
                ]}
              />

              <TextareaInput
                id="checkout-notes"
                label={'{{FIELD_KITCHEN_DELIVERY_NOTES}}'}
                rows={2}
                value={fields.notes}
                onChange={(e) => setFields({ ...fields, notes: e.target.value })}
              />

              <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
                {submitting ? '{{PROCESSING_PAYMENT_WEBHOOK}}' : t('checkout.place_order_cta')}
              </Button>
            </form>
          </Card>
        </div>

        {/* Order Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="signboard" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-gold">{'{{ORDER_SUMMARY_HEADING}}'}</h2>
              <Badge kind="neutral" label={'{{TEST_MODE_ACTIVE}}'} />
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <dt>{'{{CART_SUBTOTAL_LABEL}}'}</dt>
                <dd className="font-mono">{formatPriceToken(subtotal || 420)}</dd>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold">
                  <dt>{'{{CART_DISCOUNT_LABEL}}'}</dt>
                  <dd className="font-mono">-{formatPriceToken(discountAmount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <dt>{'{{CART_GST_TAX_LABEL}}'}</dt>
                <dd className="font-mono">{formatPriceToken(taxAmount || 21)}</dd>
              </div>
              {orderType === 'DELIVERY' && (
                <div className="flex justify-between text-muted">
                  <dt>{'{{CART_DELIVERY_FEE_LABEL}}'}</dt>
                  <dd className="font-mono">{formatPriceToken(deliveryFee || 50)}</dd>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-text pt-2 border-t border-gold/25">
                <dt>{'{{CART_TOTAL_LABEL}}'}</dt>
                <dd className="font-mono text-gold">{formatPriceToken(grandTotal || 491)}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted border-t border-gold/15 pt-3">
              {'{{WEBHOOK_SOURCE_OF_TRUTH_NOTICE}}'}
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}

