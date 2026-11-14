'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { t } from '@/lib/content';
import { useCart } from '@/lib/cart-context';
import { DrawerModal } from '@/components/ui';

const PRIMARY_NAV_LINKS = [
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'Story' },
  { href: '/gallery', label: 'Ambience' },
  { href: '/offers', label: 'Offers' },
  { href: '/contact', label: 'Visit' },
];

const MOBILE_DRAWER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/order', label: 'Order Online' },
  { href: '/reserve', label: 'Reserve a Table' },
  { href: '/about', label: 'Our Story' },
  { href: '/gallery', label: 'Ambience & Gallery' },
  { href: '/offers', label: 'Offers & Private Events' },
  { href: '/reviews', label: 'Guest Reviews (4.4★)' },
  { href: '/contact', label: 'Location & Hours' },
  { href: '/account', label: 'My Bookings' },
];

export function Header() {
  const pathname = usePathname();
  const { totalQuantity, openSheet } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-bg/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Left: Mobile Drawer Trigger (< md) & Desktop Editorial Links (md+) */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-text/90 hover:text-gold transition-colors"
            >
              <span aria-hidden="true" className="text-gold">
                ☰
              </span>
              <span>MENU</span>
            </button>

            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center gap-6 lg:gap-7"
            >
              {PRIMARY_NAV_LINKS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={active}
                    className={clsx(
                      'link-underline-gold py-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 whitespace-nowrap',
                      active ? 'text-gold font-medium' : 'text-text/65 hover:text-text'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center: Clean Tracked Uppercase Serif Wordmark ("THE NOCTURNE" / "THE SAANJH" style) */}
          <Link
            href="/"
            className="inline-flex items-center justify-center py-1 shrink-0 group"
          >
            <span className="font-serif text-lg sm:text-xl tracking-[0.28em] uppercase text-text group-hover:text-gold transition-colors">
              {t('brand.wordmark')}
            </span>
          </Link>

          {/* Right: Bag + Concierge Bell + RESERVE */}
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            <button
              type="button"
              onClick={openSheet}
              aria-label={t('global.nav.cart')}
              className="group relative inline-flex items-center justify-center gap-1.5 min-h-10 px-1.5 text-text/80 hover:text-gold active:scale-95 transition-all duration-200"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gold/90 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalQuantity > 0 && (
                <span
                  key={totalQuantity}
                  className="animate-cart-pop inline-flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-semibold rounded-full bg-gold text-charcoal"
                >
                  {totalQuantity}
                </span>
              )}
            </button>

            <Link
              href="/reserve"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-text/90 hover:text-gold transition-colors"
            >
              {/* Concierge Service Bell Icon matching the reference image */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-text/85 group-hover:text-gold transition-colors"
                aria-hidden="true"
              >
                <path d="M12 5a1.5 1.5 0 0 1 1.415 1.002A8.003 8.003 0 0 1 20 13.874V15H4v-1.126a8.003 8.003 0 0 1 6.585-7.872A1.5 1.5 0 0 1 12 5Zm-9 12h18v1.5H3V17Z" />
              </svg>
              <span>RESERVE</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Clean Editorial Mobile Navigation Drawer (No boxy borders) */}
      <DrawerModal
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="Caffè & Tè · Viman Nagar"
        mode="bottom-sheet"
      >
        <nav aria-label="Mobile navigation" className="divide-y divide-white/[0.07]">
          {MOBILE_DRAWER_LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'py-3.5 flex items-center justify-between text-base transition-colors',
                  active ? 'text-gold font-medium' : 'text-text/90 hover:text-gold'
                )}
              >
                <span className="font-serif text-xl">{item.label}</span>
                <span aria-hidden="true" className="text-gold/60 text-sm">
                  →
                </span>
              </Link>
            );
          })}
        </nav>
      </DrawerModal>
    </>
  );
}
