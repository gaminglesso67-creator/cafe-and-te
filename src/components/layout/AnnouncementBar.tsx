'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { t } from '@/lib/content';

/**
 * Admin-controlled festive/offers announcement bar (PRD 7.9 & 9.5).
 * Uses Crimson (#B3202A) strictly as a seasonal highlight tag per PRD 5.5.
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="w-full bg-surface border-b border-gold/25 px-3 py-2 text-xs sm:text-sm"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="shrink-0 inline-block px-2 py-0.5 text-[11px] uppercase tracking-widest bg-crimson text-cream border border-gold/30 rounded-xs">
            {t('global.announcement.tag')}
          </span>
          <p className="text-text truncate">{t('global.announcement.text')}</p>
          <Link
            href="/offers"
            className="shrink-0 text-gold underline underline-offset-4 hover:text-text font-medium ml-1"
          >
            {t('global.announcement.cta')}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 inline-flex items-center justify-center min-h-9 min-w-9 text-muted hover:text-gold"
        >
          ×
        </button>
      </div>
    </div>
  );
}
