'use client';

import React from 'react';
import Link from 'next/link';
import { t } from '@/lib/content';
import { useCart } from '@/lib/cart-context';

/**
 * Sticky Mobile Bottom Action Bar (PRD 7.9, 12.1 & Mobile-First Rules):
 * Lives in the thumb zone on phones (<768px) with Order, Reserve, Bag/Menu, and tap-to-call (tel:).
 * Respects iOS safe-area-inset-bottom and enforces >=44x44px touch targets with tactile feedback.
 */
export function MobileBottomBar() {
  const { totalQuantity, openSheet } = useCart();

  return (
    <nav
      aria-label="Quick actions"
      className="fixed bottom-0 inset-x-0 z-30 md:hidden w-full max-w-full bg-bg/92 backdrop-blur-xl border-t border-gold/30 shadow-[0_-10px_30px_rgba(0,0,0,0.65)] px-2.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="grid grid-cols-4 gap-1.5">
        <Link
          href="/order"
          data-tactile="confirm"
          className="btn-gold-primary min-h-11 px-2 py-1.5 rounded-sm border border-gold/60 inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-center min-w-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          </svg>
          <span className="truncate">{t('global.mobile_bar.order')}</span>
        </Link>

        <Link
          href="/reserve"
          data-tactile="confirm"
          className="glass-pill min-h-11 px-2 py-1.5 rounded-sm border border-gold/45 text-text hover:border-gold inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium uppercase tracking-wider text-center min-w-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-gold"
            aria-hidden="true"
          >
            <path d="M12 5a1.5 1.5 0 0 1 1.415 1.002A8.003 8.003 0 0 1 20 13.874V15H4v-1.126a8.003 8.003 0 0 1 6.585-7.872A1.5 1.5 0 0 1 12 5Zm-9 12h18v1.5H3V17Z" />
          </svg>
          <span className="truncate">{t('global.mobile_bar.reserve')}</span>
        </Link>

        <button
          type="button"
          data-tactile="tap"
          onClick={openSheet}
          className="glass-pill relative min-h-11 px-2 py-1.5 rounded-sm border border-white/15 text-text hover:border-gold inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium uppercase tracking-wider text-center min-w-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="text-gold"
            aria-hidden="true"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span className="truncate">
            Bag{totalQuantity > 0 ? ` (${totalQuantity})` : ''}
          </span>
        </button>

        <a
          href={t('brand.phone_href')}
          data-tactile="tap"
          className="glass-pill min-h-11 px-2 py-1.5 rounded-sm border border-gold/30 text-gold hover:border-gold inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium uppercase tracking-wider text-center min-w-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="shrink-0"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
          <span className="truncate">{t('global.mobile_bar.call')}</span>
        </a>
      </div>
    </nav>
  );
}
