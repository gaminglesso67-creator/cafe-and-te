'use client';

import React from 'react';
import Link from 'next/link';
import { t } from '@/lib/content';

export function Footer() {
  const whatsappUrl = `https://wa.me/${t('brand.whatsapp_number')}?text=${encodeURIComponent(
    t('brand.whatsapp_prefill')
  )}`;

  return (
    <footer className="w-full max-w-full overflow-x-clip bg-bg text-text border-t border-white/10 pb-24 md:pb-12 pt-14 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-between min-h-[380px] sm:min-h-[460px] gap-14">
        {/* Top Metadata & Social Row (Matches Video 00:16) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-text/80">
          <div>12 PM – MIDNIGHT RESTAURANT</div>

          <Link href="/contact" className="hover:text-gold transition-colors text-center">
            CLOVER PARK, VIMAN NAGAR, PUNE
          </Link>

          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/saanjhpune/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 border border-white/15 hover:border-gold text-text/80 hover:text-gold inline-flex items-center justify-center transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 border border-white/15 hover:border-gold text-text/80 hover:text-gold inline-flex items-center justify-center transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </a>
            <a
              href={t('brand.phone_tel')}
              aria-label="Call Saanjh"
              className="w-8 h-8 border border-white/15 hover:border-gold text-text/80 hover:text-gold inline-flex items-center justify-center transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
            <a
              href={t('brand.google_maps_directions_url')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Directions"
              className="w-8 h-8 border border-white/15 hover:border-gold text-text/80 hover:text-gold inline-flex items-center justify-center transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Centerpiece Colossal Ember-Copper-Gold Gradient Wordmark (Video 00:16) */}
        <div className="my-auto py-4 text-center">
          <Link
            href="/"
            aria-label="Saanjh Home"
            className="block font-serif font-normal text-6xl sm:text-8xl md:text-9xl lg:text-[148px] leading-[0.92] tracking-[-0.03em] text-ember-gradient select-none"
          >
            The S<span className="tracking-[-0.06em]">aa</span>njh
          </Link>
        </div>

        {/* Subtle Quick Navigation & Legal Bottom Row */}
        <div className="space-y-6">
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-muted"
          >
            <Link href="/menu" className="hover:text-gold transition-colors">Menu</Link>
            <Link href="/order" className="hover:text-gold transition-colors">Order Online</Link>
            <Link href="/reserve" className="hover:text-gold transition-colors">Reserve</Link>
            <Link href="/about" className="hover:text-gold transition-colors">Story</Link>
            <Link href="/gallery" className="hover:text-gold transition-colors">Ambience</Link>
            <Link href="/offers" className="hover:text-gold transition-colors">Offers</Link>
            <Link href="/reviews" className="hover:text-gold transition-colors">Reviews (4.5★)</Link>
            <Link href="/account" className="hover:text-gold transition-colors">My Bookings</Link>
          </nav>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted/65">
            <span>© {new Date().getFullYear()} SAANJH VIMAN NAGAR™</span>
            <div className="flex flex-wrap items-center gap-6">
              <Link href="/legal/privacy" className="hover:text-text transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="hover:text-text transition-colors">
                Terms &amp; Conditions
              </Link>
              <Link href="/legal/refund" className="hover:text-text transition-colors">
                Refund Policy
              </Link>
            </div>
            <span>{t('brand.phone_display')} · Viman Nagar, Pune</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
