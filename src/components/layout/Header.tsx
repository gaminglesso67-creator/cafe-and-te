'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { t } from '@/lib/content';
import { useCart } from '@/lib/cart-context';
import { Button, DrawerModal } from '@/components/ui';

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
  { href: '/reviews', label: 'Guest Reviews (4.5★)' },
  { href: '/contact', label: 'Location & Hours' },
  { href: '/account', label: 'My Bookings' },
];

export function Header() {
  const pathname = usePathname();
  const { totalQuantity, openSheet } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-bg/85 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-[4.25rem] flex items-center justify-between gap-6">
          {/* Left: Clean Brand Wordmark */}
          <Link
            href="/"
            className="inline-flex items-baseline gap-2.5 min-h-11 py-1 shrink-0 group"
          >
            <span className="font-serif text-2xl sm:text-[28px] font-semibold tracking-wide text-gold text-glow-gold leading-none">
              {t('brand.wordmark')}
            </span>
          </Link>

          {/* Center: Minimal 5-Item Desktop Navigation with sliding gold underline */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-7 lg:gap-9"
          >
            {PRIMARY_NAV_LINKS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={clsx(
                    'link-underline-gold py-2 text-[13px] tracking-[0.06em] transition-colors duration-200 whitespace-nowrap',
                    active
                      ? 'text-gold font-medium'
                      : 'text-text/75 hover:text-text'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Streamlined Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/order"
              data-active={pathname === '/order'}
              className={clsx(
                'link-underline-gold hidden lg:inline-flex items-center px-2 py-1.5 text-[13px] tracking-[0.04em] transition-colors duration-200',
                pathname === '/order' ? 'text-gold font-medium' : 'text-text/80 hover:text-gold'
              )}
            >
              Order Online
            </Link>

            <button
              type="button"
              onClick={openSheet}
              aria-label={t('global.nav.cart')}
              className="group relative inline-flex items-center justify-center gap-1.5 min-h-10 px-2.5 rounded-full text-text/85 hover:text-gold active:scale-95 transition-all duration-200"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gold shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalQuantity > 0 && (
                <span
                  key={totalQuantity}
                  className="animate-cart-pop inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full bg-gold text-charcoal"
                >
                  {totalQuantity}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center">
              <Button variant="primary" size="sm" href="/reserve">
                Reserve
              </Button>
            </div>

            {/* Clean Hamburger Trigger (<768px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex items-center justify-center min-h-10 min-w-10 text-text hover:text-gold transition-colors"
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
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Clean Editorial Mobile Navigation Drawer (No boxy borders) */}
      <DrawerModal
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="Saanjh · Viman Nagar"
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
