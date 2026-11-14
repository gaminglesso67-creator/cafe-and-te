'use client';

import React, { useState } from 'react';
import { formatPriceToken, t } from '@/lib/content';
import { useCart } from '@/lib/cart-context';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  QuantityStepper,
  Section,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Dedicated Cart Page (`/cart`, PRD 6.1 & 8.2):
 * Full-page cart review alongside the mobile CartBottomSheet.
 */
export default function CartPage() {
  const { notify } = useToast();
  const {
    items,
    subtotal,
    taxAmount,
    deliveryFee,
    discountAmount,
    grandTotal,
    orderType,
    couponCode,
    setOrderType,
    applyCoupon,
    updateQuantity,
    removeItem,
  } = useCart();

  const [couponInput, setCouponInput] = useState(couponCode);

  const handleCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = applyCoupon(couponInput);
    if (ok) {
      notify('Promo code applied to your Caffè & Tè order', 'success');
    } else {
      notify('Invalid promo code — try PASTASOCIAL or SIPANDPAINT', 'error');
    }
  };

  return (
    <Section variant="dark">
      <h1 className="font-serif text-4xl text-gold text-glow-gold mb-8">{t('cart.heading')}</h1>

      {items.length === 0 ? (
        <EmptyState
          title="Your Cafe Bag is Empty"
          description="Explore our Vietnamese Iced Coffee, Hazelnut Butter Cappuccinos, handmade Pasta Social bowls, and flaky croissants."
          actionLabel={t('global.nav.order')}
          actionHref="/order"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <Card key={item.lineId} variant="surface" className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge kind={item.isVeg ? 'veg' : 'non_veg'} />
                      <h2 className="font-serif text-xl text-text">{item.name}</h2>
                    </div>
                    {item.variantName && (
                      <p className="text-xs text-muted mt-1">{item.variantName}</p>
                    )}
                    {item.addOnNames && item.addOnNames.length > 0 && (
                      <p className="text-xs text-muted">{item.addOnNames.join(', ')}</p>
                    )}
                  </div>
                  <span className="font-mono text-base text-gold font-semibold">
                    {formatPriceToken(item.unitPrice * item.quantity)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gold/15">
                  <QuantityStepper
                    value={item.quantity}
                    min={0}
                    onChange={(q) => updateQuantity(item.lineId, q)}
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.lineId)}>
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary & Coupon */}
          <div className="lg:col-span-5 space-y-5">
            <Card variant="surface" className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-bg border border-gold/25 rounded-xs">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`min-h-11 text-xs font-medium uppercase tracking-wider rounded-xs ${
                    orderType === 'DELIVERY' ? 'btn-gold-primary' : 'text-muted'
                  }`}
                >
                  Home Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`min-h-11 text-xs font-medium uppercase tracking-wider rounded-xs ${
                    orderType === 'PICKUP' ? 'btn-gold-primary' : 'text-muted'
                  }`}
                >
                  Self Pickup (Viman Nagar)
                </button>
              </div>

              <form onSubmit={handleCoupon} className="flex items-end gap-2">
                <div className="flex-1">
                  <TextInput
                    id="cart-coupon"
                    label="Promo Code (PASTASOCIAL / SIPANDPAINT / CAFFETE15)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" size="md">
                  Apply
                </Button>
              </form>

              <dl className="space-y-2 text-sm border-t border-gold/20 pt-4">
                <div className="flex justify-between text-muted">
                  <dt>Item Subtotal</dt>
                  <dd className="font-mono">{formatPriceToken(subtotal)}</dd>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-gold">
                    <dt>Offer Discount</dt>
                    <dd className="font-mono">-{formatPriceToken(discountAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <dt>GST (5%)</dt>
                  <dd className="font-mono">{formatPriceToken(taxAmount)}</dd>
                </div>
                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between text-muted">
                    <dt>Delivery Fee (Viman Nagar Zone)</dt>
                    <dd className="font-mono">{formatPriceToken(deliveryFee)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold text-text pt-2 border-t border-gold/25">
                  <dt>Grand Total</dt>
                  <dd className="font-mono text-gold">{formatPriceToken(grandTotal)}</dd>
                </div>
              </dl>

              <Button variant="primary" size="lg" fullWidth href="/checkout">
                {t('cart.checkout_cta')}
              </Button>
            </Card>
          </div>
        </div>
      )}
    </Section>
  );
}

