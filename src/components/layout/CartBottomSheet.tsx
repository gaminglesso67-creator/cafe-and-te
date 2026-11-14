'use client';

import React from 'react';
import { formatPriceToken, t } from '@/lib/content';
import { useCart } from '@/lib/cart-context';
import { Badge, Button, DrawerModal, EmptyState, QuantityStepper } from '@/components/ui';

export function CartBottomSheet() {
  const {
    items,
    subtotal,
    taxAmount,
    deliveryFee,
    discountAmount,
    grandTotal,
    orderType,
    isSheetOpen,
    closeSheet,
    setOrderType,
    updateQuantity,
    removeItem,
  } = useCart();

  return (
    <DrawerModal
      open={isSheetOpen}
      onClose={closeSheet}
      title={t('cart.heading')}
      mode="bottom-sheet"
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <div className="space-y-1 text-xs text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPriceToken(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Offer Discount</span>
                  <span>-{formatPriceToken(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatPriceToken(taxAmount)}</span>
              </div>
              {orderType === 'DELIVERY' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{formatPriceToken(deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-text pt-1.5 border-t border-gold/20">
                <span>Total</span>
                <span className="text-gold">{formatPriceToken(grandTotal)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="secondary" size="sm" href="/cart" onClick={closeSheet}>
                Full Bag & Promo
              </Button>
              <Button variant="primary" size="sm" href="/checkout" onClick={closeSheet}>
                {t('cart.checkout_cta')}
              </Button>
            </div>
          </div>
        ) : undefined
      }
    >
      {/* Order Type Toggle: Delivery vs Pickup */}
      <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-bg border border-gold/25 rounded-xs">
        <button
          type="button"
          onClick={() => setOrderType('DELIVERY')}
          className={`min-h-11 text-xs font-medium uppercase tracking-wider rounded-xs transition-colors ${
            orderType === 'DELIVERY'
              ? 'btn-gold-primary'
              : 'text-muted hover:text-text'
          }`}
        >
          Delivery
        </button>
        <button
          type="button"
          onClick={() => setOrderType('PICKUP')}
          className={`min-h-11 text-xs font-medium uppercase tracking-wider rounded-xs transition-colors ${
            orderType === 'PICKUP'
              ? 'btn-gold-primary'
              : 'text-muted hover:text-text'
          }`}
        >
          Pickup
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your Cafe Bag is Empty"
          description="Add Vietnamese Iced Coffee, Hazelnut Butter Cappuccinos, Pasta Social bowls, or flaky croissants to begin."
          actionLabel={t('global.nav.menu')}
          actionHref="/order"
          onAction={closeSheet}
        />
      ) : (
        <div className="divide-y divide-gold/15">
          {items.map((item) => (
            <div key={item.lineId} className="py-3.5 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge kind={item.isVeg ? 'veg' : 'non_veg'} />
                    <span className="font-serif text-lg text-text">{item.name}</span>
                  </div>
                  {item.variantName && (
                    <p className="text-xs text-muted">{item.variantName}</p>
                  )}
                  {item.addOnNames && item.addOnNames.length > 0 && (
                    <p className="text-xs text-muted">{item.addOnNames.join(', ')}</p>
                  )}
                </div>
                <span className="text-sm font-medium text-gold shrink-0">
                  {formatPriceToken(item.unitPrice * item.quantity)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <QuantityStepper
                  value={item.quantity}
                  min={0}
                  onChange={(next) => updateQuantity(item.lineId, next)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.lineId)}
                  className="min-h-11 px-2 text-xs text-muted hover:text-crimson uppercase tracking-wider"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DrawerModal>
  );
}

