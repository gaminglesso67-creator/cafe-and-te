'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * Minimal, modern top privilege bar.
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="w-full bg-surface/80 border-b border-white/5 px-4 sm:px-6 lg:px-8 h-9 flex items-center text-[11px] tracking-wide text-muted"
    >
      <div className="mx-auto max-w-7xl w-full flex items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-2 text-muted/75">
          <span>Clover Park, Viman Nagar</span>
          <span aria-hidden="true" className="text-gold/40">·</span>
          <span>Open Daily 12 PM – 12 Midnight</span>
        </div>

        <Link
          href="/offers"
          className="flex items-center gap-2 text-text/90 hover:text-gold transition-colors truncate mx-auto sm:mx-0"
        >
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
          <span className="truncate">
            Flat 10% Off Walk-In Lunch (12–4 PM) · Newly Opened Bar
          </span>
          <span className="text-gold font-medium shrink-0">Explore →</span>
        </Link>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 inline-flex items-center justify-center w-6 h-6 text-muted/60 hover:text-text transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
