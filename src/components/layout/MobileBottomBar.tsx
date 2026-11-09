'use client';

import React from 'react';
import Link from 'next/link';
import { t } from '@/lib/content';

/**
 * Sticky Mobile Bottom Action Bar (PRD 7.9, 12.1 & Mobile-First Rules):
 * Lives in the thumb zone on phones (<768px) with Order, Reserve, and tap-to-call (tel:).
 * Respects iOS safe-area-inset-bottom and enforces >=44x44px touch targets with 8px+ spacing.
 */
export function MobileBottomBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-bg/95 backdrop-blur-sm border-t border-gold/35 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="grid grid-cols-3 gap-2.5">
        <Link
          href="/order"
          className="btn-gold-primary min-h-11 px-2 py-2 rounded-xs border border-gold/60 inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wider text-center"
        >
          {t('global.mobile_bar.order')}
        </Link>
        <Link
          href="/reserve"
          className="min-h-11 px-2 py-2 rounded-xs border border-gold/55 bg-surface text-text hover:border-gold inline-flex items-center justify-center text-xs font-medium uppercase tracking-wider text-center"
        >
          {t('global.mobile_bar.reserve')}
        </Link>
        <a
          href={t('brand.phone_href')}
          className="min-h-11 px-2 py-2 rounded-xs border border-gold/35 bg-bg text-gold hover:border-gold inline-flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wider text-center"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
          <span>{t('global.mobile_bar.call')}</span>
        </a>
      </div>
    </nav>
  );
}
