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
 * Framed Map Embed with Saanjh Viman Nagar address & Google Maps directions CTA (PRD 5.9, 7.1, 7.6).
 */
export function MapEmbed({
  slotName = 'Clover Park, Viman Nagar',
  addressLine1 = t('brand.address_line1'),
  addressLine2 = t('brand.address_line2'),
  directionsUrl = t('brand.directions_url'),
}: MapEmbedProps) {
  return (
    <div className="rounded-sm border border-gold/30 bg-surface overflow-hidden">
      {/* Map Canvas */}
      <div className="relative h-56 sm:h-64 w-full bg-bg flex flex-col items-center justify-center p-6 text-center border-b border-gold/20">
        {/* Subtle coordinate grid lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, #E8B547 1px, transparent 1px), linear-gradient(to bottom, #E8B547 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <span className="w-3.5 h-3.5 rotate-45 bg-gold shadow-gold-glow border border-cream" />
          <span className="font-serif text-lg text-gold px-3 py-1 bg-surface/90 border border-gold/30 rounded-xs">
            Saanjh · {slotName}
          </span>
          <p className="text-xs text-muted max-w-sm">
            Lane 2, near Paper Craft, Clover Park (Opposite Phoenix Marketcity) · Viman Nagar, Pune 411014
          </p>
        </div>
      </div>

      {/* Address & Directions Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5 min-w-0">
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
