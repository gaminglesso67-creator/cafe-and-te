'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { t } from '@/lib/content';
import { useCart } from '@/lib/cart-context';
import { Button, DrawerModal } from '@/components/ui';

const NAV_LINKS = [
  { href: '/', labelKey: 'global.nav.home' },
  { href: '/menu', labelKey: 'global.nav.menu' },
  { href: '/about', labelKey: 'global.nav.about' },
  { href: '/gallery', labelKey: 'global.nav.gallery' },
  { href: '/reviews', labelKey: 'global.nav.reviews' },
  { href: '/offers', labelKey: 'global.nav.offers' },
  { href: '/contact', labelKey: 'global.nav.contact' },
];

export function Header() {
  const pathname = usePathname();
  const { totalQuantity, openSheet } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-bg/95 backdrop-blur-sm border-b border-gold/25">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Brand Wordmark & Tagline Lockup (PRD 5.3, 5.4) */}
          <Link
            href="/"
            className="flex flex-col justify-center min-h-11 py-1 pr-2 group shrink-0"
          >
            <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wider text-gold text-glow-gold leading-none">
              {t('brand.wordmark')}
            </span>
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted mt-0.5">
              {t('brand.tagline')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'min-h-11 inline-flex items-center px-3 text-sm tracking-wide transition-colors border-b-2',
                    active
                      ? 'text-gold border-gold font-medium'
                      : 'text-text/90 border-transparent hover:text-gold'
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart bottom-sheet trigger, Primary CTA, Mobile menu button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openSheet}
              aria-label={t('global.nav.cart')}
              className="relative inline-flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-3 rounded-xs border border-gold/35 bg-surface text-text hover:border-gold transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gold"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="hidden sm:inline text-xs uppercase tracking-wider">
                {t('global.nav.cart')}
              </span>
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-semibold rounded-xs bg-gold text-charcoal">
                {totalQuantity}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2">
              <Button variant="secondary" size="sm" href="/order">
                {t('global.nav.order')}
              </Button>
              <Button variant="primary" size="sm" href="/reserve">
                {t('global.nav.reserve')}
              </Button>
            </div>

            {/* Mobile Hamburger Trigger (>=44x44px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-xs border border-gold/35 bg-surface text-gold"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <DrawerModal
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title={t('brand.wordmark')}
        mode="bottom-sheet"
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'min-h-11 flex items-center justify-between px-4 py-2.5 rounded-xs border text-base',
                  active
                    ? 'border-gold bg-gold/10 text-gold font-medium'
                    : 'border-gold/20 bg-bg/60 text-text'
                )}
              >
                <span>{t(item.labelKey)}</span>
                <span aria-hidden="true" className="text-gold text-sm">
                  →
                </span>
              </Link>
            );
          })}
          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-11 flex items-center justify-between px-4 py-2.5 rounded-xs border border-gold/20 bg-bg/60 text-muted text-base"
          >
            <span>{t('global.nav.account')}</span>
            <span aria-hidden="true" className="text-gold text-sm">
              →
            </span>
          </Link>
        </nav>
      </DrawerModal>
    </>
  );
}

