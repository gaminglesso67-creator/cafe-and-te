'use client';

import React, { useEffect, useRef, useState } from 'react';
import { t } from '@/lib/content';
import { Button } from './Button';

export interface MapEmbedProps {
  slotName?: string;
  addressLine1?: string;
  addressLine2?: string;
  directionsUrl?: string;
}

/**
 * Viewport-Lazy Framed Map Embed (`IntersectionObserver` with 250px rootMargin)
 * Defers downloading ~800KB of Google Maps iframe scripts until the user scrolls near the Location section.
 */
export function MapEmbed({
  slotName = 'Udchalo House, Clover Park, Viman Nagar',
  addressLine1 = t('brand.address_line1'),
  addressLine2 = t('brand.address_line2'),
  directionsUrl = t('brand.directions_url'),
}: MapEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    if (shouldLoadMap) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoadMap]);

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Interactive Google Map for Caffè & Tè - All Day Cafe (18.563944, 73.914267) */}
      <div className="relative h-64 sm:h-72 w-full rounded-sm overflow-hidden border border-gold/15 bg-surface flex items-center justify-center">
        {shouldLoadMap ? (
          <iframe
            title={`Map of Caffè & Tè — ${slotName}`}
            src="https://maps.google.com/maps?q=18.563944164929048,73.91426682472229&hl=en&t=&z=17&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 grayscale contrast-125 opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShouldLoadMap(true)}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-gold/85 bg-surface hover:text-gold transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            <span>Loading Interactive Map · Viman Nagar</span>
          </button>
        )}
      </div>

      {/* Clean Editorial Address & Directions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium text-text">{addressLine1}</p>
          <p className="text-xs text-muted">{addressLine2}</p>
        </div>
        <Button variant="secondary" size="sm" href={directionsUrl} external>
          {t('home.location.directions_cta')}
        </Button>
      </div>
    </div>
  );
}
