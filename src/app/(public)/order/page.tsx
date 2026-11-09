import React from 'react';
import { t } from '@/lib/content';
import { SEED_CATEGORIES, SEED_MENU_ITEMS } from '@/lib/seed-data';
import { MenuCatalog } from '@/components/sections/MenuCatalog';
import { Button, Section } from '@/components/ui';

/**
 * Online Ordering Page (`/order`, PRD 6.1 & 8.2):
 * Menu-to-cart flow with Delivery/Pickup support and quick checkout link.
 */
export default function OnlineOrderPage() {
  return (
    <>
      <Section variant="surface" className="pt-10 pb-8 border-b border-gold/25">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              {t('order.header.eyebrow')}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
              {t('order.header.heading')}
            </h1>
          </div>
          <Button variant="primary" size="md" href="/checkout">
            {t('cart.checkout_cta')}
          </Button>
        </div>
      </Section>

      <MenuCatalog
        categories={SEED_CATEGORIES}
        items={SEED_MENU_ITEMS}
        orderingEnabled
      />
    </>
  );
}

