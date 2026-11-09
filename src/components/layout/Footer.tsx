'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { t } from '@/lib/content';
import { SEED_OPENING_HOURS } from '@/lib/seed-data';
import { Button, EmailInput, GoldDivider, useToast } from '@/components/ui';

export function Footer() {
  const { notify } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const whatsappUrl = `https://wa.me/${t('brand.whatsapp_number')}?text=${encodeURIComponent(
    t('brand.whatsapp_prefill')
  )}`;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    notify('{{NEWSLETTER_SUBSCRIBED_TOAST}}', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-bg text-text border-t border-gold/30 pb-24 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <Link
                href="/"
                className="font-serif text-3xl font-semibold text-gold text-glow-gold tracking-wider block"
              >
                {t('brand.wordmark')}
              </Link>
              <p className="text-xs uppercase tracking-[0.22em] text-muted mt-1">
                {t('brand.tagline')}
              </p>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              {t('global.footer.about_blurb')}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 px-3 inline-flex items-center border border-gold/30 rounded-xs text-muted hover:text-gold hover:border-gold"
              >
                {'{{SOCIAL_INSTAGRAM}}'}
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 px-3 inline-flex items-center border border-gold/30 rounded-xs text-muted hover:text-gold hover:border-gold"
              >
                {'{{SOCIAL_FACEBOOK}}'}
              </a>
              <a
                href={t('brand.google_review_url')}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 px-3 inline-flex items-center border border-gold/30 rounded-xs text-muted hover:text-gold hover:border-gold"
              >
                {'{{SOCIAL_GOOGLE_PROFILE}}'}
              </a>
            </div>
          </div>

          {/* Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-serif text-lg text-gold tracking-wide">
              {t('global.footer.links_heading')}
            </h2>
            <ul className="space-y-1 text-sm">
              {[
                { href: '/menu', label: t('global.nav.menu') },
                { href: '/order', label: t('global.nav.order') },
                { href: '/reserve', label: t('global.nav.reserve') },
                { href: '/about', label: t('global.nav.about') },
                { href: '/gallery', label: t('global.nav.gallery') },
                { href: '/reviews', label: t('global.nav.reviews') },
                { href: '/offers', label: t('global.nav.offers') },
                { href: '/contact', label: t('global.nav.contact') },
                { href: '/account', label: t('global.nav.account') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center min-h-9 text-muted hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours Summary (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="font-serif text-lg text-gold tracking-wide">
              {t('global.footer.hours_heading')}
            </h2>
            <dl className="space-y-1.5 text-xs sm:text-sm">
              {SEED_OPENING_HOURS.slice(0, 4).map((slot) => (
                <div key={slot.id} className="flex justify-between gap-2 text-muted">
                  <dt>{slot.dayLabel}</dt>
                  <dd className="text-text font-mono">
                    {slot.openTime} – {slot.closeTime}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="pt-2 space-y-1 text-sm">
              <p className="text-text">{t('brand.address_line1')}</p>
              <p className="text-xs text-muted">{t('brand.address_line2')}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={t('brand.phone_href')}
                  className="min-h-11 inline-flex items-center text-gold underline underline-offset-4 text-sm"
                >
                  {t('brand.phone_display')}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-11 inline-flex items-center text-gold underline underline-offset-4 text-sm"
                >
                  {t('global.whatsapp.label')}
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter & Legal (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="font-serif text-lg text-gold tracking-wide">
              {t('global.footer.newsletter_heading')}
            </h2>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
              {/* Honeypot field for spam protection */}
              <input
                type="text"
                name="company_website_hp"
                tabIndex={-1}
                autoComplete="off"
                className="sr-only"
                aria-hidden="true"
              />
              <EmailInput
                id="footer-newsletter-email"
                label={t('global.footer.newsletter_placeholder')}
                placeholder={t('global.footer.newsletter_placeholder')}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <Button type="submit" variant="secondary" size="sm" fullWidth>
                {t('global.footer.newsletter_cta')}
              </Button>
            </form>
            <p className="text-xs text-muted pt-1">
              {'GSTIN: '}
              {t('brand.gstin')}
            </p>
          </div>
        </div>

        <GoldDivider ornament={false} />

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>{t('global.footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="min-h-11 inline-flex items-center hover:text-gold">
              {'{{NAV_PRIVACY_POLICY}}'}
            </Link>
            <Link href="/terms" className="min-h-11 inline-flex items-center hover:text-gold">
              {'{{NAV_TERMS_CONDITIONS}}'}
            </Link>
            <Link href="/admin" className="min-h-11 inline-flex items-center hover:text-gold">
              {'{{NAV_STAFF_ADMIN}}'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
