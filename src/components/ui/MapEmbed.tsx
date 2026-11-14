import React from 'react';
import { t } from '@/lib/content';
import { Button } from './Button';

export interface MapEmbedProps {
  slotName?: string;
  addressLine1?: string;
  addressLine2?: string;
  directionsUrl?: string;
}

/**
 * Framed Map Embed with Caffè & Tè Viman Nagar address & Google Maps directions CTA (PRD 5.9, 7.1, 7.6).
 */
export function MapEmbed({
  slotName = 'Udchalo House, Clover Park, Viman Nagar',
  addressLine1 = t('brand.address_line1'),
  addressLine2 = t('brand.address_line2'),
  directionsUrl = t('brand.directions_url'),
}: MapEmbedProps) {
  return (
    <div className="space-y-4">
      {/* Interactive Google Map for Caffè & Tè - All Day Cafe (18.563944, 73.914267) */}
      <div className="relative h-64 sm:h-72 w-full rounded-sm overflow-hidden border border-gold/15 bg-surface">
        <iframe
          title={`Map of Caffè & Tè — ${slotName}`}
          src="https://maps.google.com/maps?q=18.563944164929048,73.91426682472229&hl=en&t=&z=17&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full border-0 grayscale contrast-125 opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
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
