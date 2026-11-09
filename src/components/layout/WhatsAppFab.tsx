import React from 'react';
import { t } from '@/lib/content';

/**
 * Floating WhatsApp click-to-chat button (PRD 7.9 & Mobile-First Rules).
 * Positioned above the mobile sticky action bar on phones and at bottom-right on desktop.
 */
export function WhatsAppFab() {
  const number = t('brand.whatsapp_number');
  const prefill = encodeURIComponent(t('brand.whatsapp_prefill'));
  const whatsappUrl = `https://wa.me/${number}?text=${prefill}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('global.whatsapp.label')}
      className="fixed right-4 bottom-20 md:bottom-6 z-30 min-h-11 min-w-11 px-3.5 py-2.5 rounded-xs border border-gold/60 bg-surface text-gold shadow-gold-glow hover:shadow-gold-glow-strong inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase transition-shadow"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
      <span className="hidden sm:inline">{t('global.whatsapp.label')}</span>
    </a>
  );
}

