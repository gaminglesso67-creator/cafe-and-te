'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPriceToken, getImageSlot, t } from '@/lib/content';
import {
  GalleryItemSlot,
  MenuItemSlot,
  OfferSlot,
  OpeningHourSlot,
  ReviewSlot,
} from '@/lib/seed-data';
import { useCart } from '@/lib/cart-context';
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  GoldDivider,
  ImageWithOverlay,
  MapEmbed,
  RatingStars,
  Section,
  SkeletonLoader,
  useToast,
} from '@/components/ui';

export type SectionDataState = 'ready' | 'loading' | 'empty' | 'error';

/**
 * Signature Nocturne Action Link ("BOOK A ROOM (→)", "LEARN MORE (→)", "BOOK A TABLE (→)")
 * Matches the uploaded reference layout: tracked uppercase text + white/cream circular arrow button.
 */
function NocturneArrowCta({
  href,
  label,
  size = 'md',
}: {
  href: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const circleSize =
    size === 'lg' ? 'w-11 h-11' : size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const textSize =
    size === 'lg'
      ? 'text-xs sm:text-sm tracking-[0.22em]'
      : 'text-[11px] tracking-[0.22em]';

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3.5 text-text hover:text-gold transition-colors py-1"
    >
      <span className={`uppercase font-normal ${textSize}`}>{label}</span>
      <span
        aria-hidden="true"
        className={`${circleSize} rounded-full bg-text text-bg inline-flex items-center justify-center transition-all duration-300 group-hover:bg-gold group-hover:scale-105 group-hover:translate-x-0.5 shadow-gold-glow`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

/**
 * 1. HERO SECTION ("The Ember Room" -> "The Saanjh Room" Nocturne Layout):
 * Full-bleed atmospheric dusk photography fading into pitch-black,
 * vertical ritual/experience list with hollow circles on the left,
 * giant offset high-contrast serif display title ("The Saanjh / Room") on the right,
 * poetic paragraph, and "BOOK A TABLE (→)" circular CTA.
 */
export function HeroSignboardSection({ hours: _hours }: { hours: OpeningHourSlot[] }) {
  const heroVisual = getImageSlot('hero_signboard_visual', '16x9');

  const rituals = [
    { label: 'Lush Garden Patio', href: '/gallery' },
    { label: 'Artisanal Bar & Cocktails', href: '/menu' },
    { label: 'Wild Mushroom Crostinis', href: '/order' },
    { label: 'Khandeshi Heritage Handis', href: '/order' },
    { label: 'Wood-Fired Pizzas & Wok', href: '/menu' },
    { label: 'Private Family Dinners', href: '/offers' },
    { label: "The Chef's Tasting Course", href: '/menu' },
  ];

  return (
    <section className="relative w-full min-h-[calc(100dvh-4rem)] bg-bg overflow-hidden flex items-center py-12 sm:py-16 lg:py-20">
      {/* Full-Bleed Atmospheric Bokeh Background Image with Deep Black Vignette Fades */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={heroVisual.src}
          alt={heroVisual.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55 scale-105 animate-signboard-breathe"
        />
        {/* Radial & Linear Vignettes so edges dissolve seamlessly into #070708 black */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 52% 42%, rgba(223, 141, 68, 0.14) 0%, rgba(7, 7, 8, 0.58) 52%, #070708 92%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg/85"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[68dvh]">
          {/* Left 4 Cols: Vertical Hollow-Circle Rituals List ("○ Intimate Tastings" style) */}
          <div className="lg:col-span-4 order-2 lg:order-1 animate-reveal-2">
            <ul className="relative space-y-5 pl-1">
              {/* Faint vertical connecting hairline */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-white/10"
              />
              {rituals.map((item) => (
                <li key={item.label} className="relative">
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-4 text-xs sm:text-[13px] tracking-wide text-text/80 hover:text-text transition-colors"
                  >
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-full border border-white/55 bg-bg group-hover:border-gold group-hover:bg-gold transition-colors shrink-0"
                    />
                    <span className="font-serif text-sm sm:text-base tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right 8 Cols: Giant Offset Serif Title ("The Saanjh / Room") + Bottom-Right Copy & CTA */}
          <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-start lg:items-end justify-between min-h-[54dvh] gap-12">
            {/* Giant Stacked Offset Display Heading */}
            <div className="animate-reveal-1 lg:text-right w-full">
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/85 mb-3">
                Viman Nagar, Pune · 4.5 ★ (191 Reviews)
              </p>
              <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[88px] text-text leading-[0.94] tracking-[-0.02em]">
                <span className="block">The Saanjh</span>
                <span className="block pl-16 sm:pl-28 lg:pl-0 text-text/95">
                  R<span className=" tracking-[-0.06em]">oo</span>m
                </span>
              </h1>
            </div>

            {/* Bottom-Right Poetic Copy & Circular Arrow CTA */}
            <div className="animate-reveal-3 lg:max-w-xs space-y-6 lg:mr-6">
              <p className="text-xs sm:text-[13px] text-text/80 leading-relaxed">
                Here, guests gather for unhurried evenings — warm teakwood interiors, lush patio air, artisanal cocktails, and flavours crafted for the whole family.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <NocturneArrowCta href="/reserve" label="BOOK A TABLE" />
                <Link
                  href="/order"
                  className="text-[11px] uppercase tracking-[0.22em] text-muted hover:text-gold transition-colors"
                >
                  ORDER ONLINE →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 2. TONIGHT'S SPECIAL — 4-CARD PORTRAIT SHOWCASE (Matches bottom-left of reference image):
 * - Giant offset ember-gradient serif title ("Tonight's / Special") + side paragraph
 * - 4 tall portrait cards (`aspect-[3/4]`) with dark top vignette & dish name at bottom
 * - 4th card is the fluted amber "Unlocked after 6:00pm — Chef's Secret Plate"
 * - Centered "LEARN MORE / EXPLORE MENU (→)" CTA below
 */
export function SignatureHighlightsSection({
  items,
  state = 'ready',
}: {
  items: MenuItemSlot[];
  state?: SectionDataState;
}) {
  const { addItem, openSheet } = useCart();
  const { notify } = useToast();

  const handleQuickAdd = (item: MenuItemSlot) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      unitPrice: item.price,
      quantity: 1,
      isVeg: item.isVeg,
    });
    notify(`${item.name} added to bag`, 'success');
    openSheet();
  };

  const portraitDishes = items.slice(0, 3);
  const secretPlate = items[3] ?? items[0];

  return (
    <Section variant="dark" className="py-16 sm:py-24">
      {/* Header Row: Offset Ember-Gradient "Tonight's / Special" + Side Description */}
      <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-14 mb-14">
        <h2 className="font-serif font-normal text-5xl sm:text-6xl lg:text-[74px] leading-[0.95] tracking-[-0.02em] text-ember-gradient shrink-0">
          <span className="block">Tonight&apos;s</span>
          <span className="block pl-12 sm:pl-20">Special</span>
        </h2>

        <p className="text-xs sm:text-[13px] text-muted/85 max-w-[260px] leading-relaxed pb-1">
          Small plates and heritage mains designed to awaken the senses. Each dish combines warmth, contrast, and texture, setting the tone for the evening ahead.
        </p>
      </div>

      {state === 'loading' && <SkeletonLoader lines={6} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState actionLabel={t('global.nav.menu')} actionHref="/menu" />}
      {state === 'ready' && (
        <>
          {/* 4-Column Portrait Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {portraitDishes.map((dish) => {
              const img = getImageSlot(dish.imageSlot, '3x4');
              return (
                <div
                  key={dish.id}
                  onClick={() => handleQuickAdd(dish)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleQuickAdd(dish);
                    }
                  }}
                  className="group relative aspect-[3/4] rounded-sm border border-white/10 hover:border-gold/45 bg-bg overflow-hidden flex flex-col justify-between p-5 cursor-pointer transition-all duration-500"
                >
                  {/* Dish Image Emerging from Deep Nocturnal Vignette */}
                  <Image
                    src={img.src}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-bg via-bg/45 to-bg/95"
                  />

                  {/* Top Price & Quick-Add Pill */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] text-muted/85 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="font-mono text-gold">{formatPriceToken(dish.price)}</span>
                    <span className="uppercase tracking-widest text-[10px] text-text/75 group-hover:text-gold">
                      + Add
                    </span>
                  </div>

                  {/* Bottom Centered Serif Title */}
                  <div className="relative z-10 text-center pt-4">
                    <h3 className="font-serif text-base sm:text-lg text-text group-hover:text-gold transition-colors">
                      {dish.name}
                    </h3>
                  </div>
                </div>
              );
            })}

            {/* 4th Card: "Unlocked after 6:00pm — Chef's Secret Plate" with Fluted Amber Ribs */}
            {secretPlate && (
              <div
                onClick={() => handleQuickAdd(secretPlate)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleQuickAdd(secretPlate);
                  }
                }}
                className="group relative aspect-[3/4] rounded-sm border border-gold/25 hover:border-gold/60 bg-ember-fluted overflow-hidden flex flex-col justify-between p-5 cursor-pointer transition-all duration-500"
              >
                {/* Top-Left Lock/Diamond Indicator ("♦ Unlocked after 6:00pm") */}
                <div className="relative z-10 flex items-center gap-2 text-[11px] text-text/90">
                  <span aria-hidden="true" className="text-gold text-xs">
                    ✦
                  </span>
                  <span>Unlocked after 6:00pm</span>
                </div>

                {/* Subtle Vertical Light Glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 inset-y-12 rounded-full bg-gold/10 blur-2xl group-hover:bg-gold/20 transition-all duration-700"
                />

                {/* Bottom Centered Title */}
                <div className="relative z-10 text-center space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold/85">
                    {formatPriceToken(secretPlate.price)} · Dusk Bar
                  </p>
                  <h3 className="font-serif text-base sm:text-lg text-text group-hover:text-gold transition-colors">
                    Chef&apos;s Secret Plate
                  </h3>
                </div>
              </div>
            )}
          </div>

          {/* Centered "LEARN MORE / EXPLORE MENU (→)" CTA */}
          <div className="mt-12 flex justify-center">
            <NocturneArrowCta href="/menu" label="EXPLORE MENU" />
          </div>
        </>
      )}
    </Section>
  );
}

/**
 * 3. THE NOCTURNE EXPERIENCE & LIVE CLOCK SECTION (Matches right half of reference image):
 * - Interactive Nocturne Card with live digital countdown ("05:59:59"),
 *   minimalist 12-dot analog clock with copper hands, warm fireplace/patio ambience,
 *   "No Rush. Evening Is Ours." display serif typography, and "BOOK A TABLE (→)" CTA.
 * - Paired with Viman Nagar Location, Hours & Interactive Google Map on the right.
 */
export function HoursAndLocationSection({
  hours: _hours,
  state = 'ready',
}: {
  hours: OpeningHourSlot[];
  state?: SectionDataState;
}) {
  const [countdown, setCountdown] = React.useState('05:59:59');
  const [angles, setAngles] = React.useState({ hour: 65, minute: 15, second: 210 });

  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Countdown until 12:00 Midnight closing
      const midnight = new Date(now);
      midnight.setHours(23, 59, 59, 999);
      const diffSec = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
      const hrs = String(Math.floor(diffSec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
      const secs = String(diffSec % 60).padStart(2, '0');
      setCountdown(`${hrs}:${mins}:${secs}`);

      const h = now.getHours() % 12;
      const m = now.getMinutes();
      const s = now.getSeconds();
      setAngles({
        hour: h * 30 + m * 0.5,
        minute: m * 6,
        second: s * 6,
      });
    };

    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const patioVisual = getImageSlot('lush_green_outdoor_patio', '3x4');

  return (
    <Section variant="dark" className="border-t border-white/[0.07]">
      {state === 'loading' && <SkeletonLoader lines={5} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left 5 Cols: "THE NOCTURNE — No Rush. Evening Is Ours." Showcase Card */}
          <div className="lg:col-span-5 min-w-0">
            <div className="relative rounded-[28px] border border-white/15 bg-bg overflow-hidden shadow-panel p-6 sm:p-8 min-h-[540px] flex flex-col justify-between">
              {/* Warm Bokeh Lounge / Patio Background */}
              <Image
                src={patioVisual.src}
                alt="Saanjh Evening Ambience"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center opacity-50"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/45 to-bg/95"
              />

              {/* Top Mini Header inside the Nocturne Frame */}
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] uppercase tracking-[0.22em] text-text/85">
                  <Link href="/menu" className="hover:text-gold transition-colors">
                    MENU
                  </Link>
                  <Link
                    href="/reserve"
                    className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                  >
                    <span aria-hidden="true" className="text-gold">
                      🛎
                    </span>
                    <span>RESERVE</span>
                  </Link>
                </div>

                {/* Live Evening Privilege Countdown & Analog Clock Box */}
                <div className="rounded-sm border border-white/10 bg-black/55 backdrop-blur-md p-5 flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-muted/90">Enjoy evening &amp; bar menu</p>
                    <p className="font-sans font-light text-2xl sm:text-3xl tracking-wider text-text tabular-nums">
                      {countdown}
                    </p>
                    <p className="text-xs text-text/80 pt-1">Evening is ours!</p>
                  </div>

                  {/* Minimalist 12-Dot Analog Clock SVG */}
                  <div className="relative w-24 h-24 shrink-0" aria-hidden="true">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* 12 Perimeter Dots */}
                      {Array.from({ length: 12 }).map((_, idx) => {
                        const rad = ((idx * 30 - 90) * Math.PI) / 180;
                        const cx = 50 + 40 * Math.cos(rad);
                        const cy = 50 + 40 * Math.sin(rad);
                        const isEveningArc = idx >= 0 && idx <= 5;
                        return (
                          <circle
                            key={idx}
                            cx={cx}
                            cy={cy}
                            r={isEveningArc ? 2.2 : 1.5}
                            fill={isEveningArc ? '#DF8D44' : 'rgba(255,244,224,0.22)'}
                          />
                        );
                      })}
                      {/* Hour hand */}
                      <line
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="26"
                        stroke="#FFF4E0"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        transform={`rotate(${angles.hour} 50 50)`}
                      />
                      {/* Minute hand */}
                      <line
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="18"
                        stroke="rgba(255,244,224,0.75)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        transform={`rotate(${angles.minute} 50 50)`}
                      />
                      {/* Copper Second hand */}
                      <line
                        x1="50"
                        y1="54"
                        x2="50"
                        y2="16"
                        stroke="#DF8D44"
                        strokeWidth="1"
                        strokeLinecap="round"
                        transform={`rotate(${angles.second} 50 50)`}
                      />
                      <circle cx="50" cy="50" r="2" fill="#DF8D44" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Centered "No Rush. Evening Is Ours." & Circular Arrow CTA */}
              <div className="relative z-10 text-center space-y-6 pt-16 pb-2">
                <h2 className="font-serif font-normal text-4xl sm:text-5xl text-text leading-[1.05]">
                  <span className="block">No Rush.</span>
                  <span className="block">Evening Is Ours.</span>
                </h2>
                <div className="flex justify-center">
                  <NocturneArrowCta href="/reserve" label="BOOK A TABLE" size="lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Viman Nagar Location, Hours & Interactive Google Map */}
          <div className="lg:col-span-7 min-w-0 space-y-8">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.26em] text-gold">
                THE SAANJH SANCTUARY · VIMAN NAGAR
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl text-text leading-tight">
                {t('home.location.heading')}
              </h2>
              <p className="text-sm text-muted max-w-xl leading-relaxed">
                Located in Clover Park opposite Phoenix Marketcity, featuring air-conditioned wooden interiors, a lush green outdoor patio, our newly opened bar section, complimentary valet parking, and full wheelchair accessibility.
              </p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-white/10 py-5 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted">Hours (All Days)</dt>
                <dd className="font-serif text-lg text-gold mt-1">12:00 PM – 12:00 Midnight</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted">Walk-In Lunch Deal</dt>
                <dd className="font-serif text-lg text-text mt-1">Flat 10% OFF (12 PM – 4 PM)</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted">Direct Desk</dt>
                <dd className="font-mono text-sm text-text mt-1">{t('brand.phone_display')}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted">Average Cost</dt>
                <dd className="text-sm text-text mt-1">₹1,000 – ₹1,100 for two</dd>
              </div>
            </dl>

            <MapEmbed slotName="Clover Park, Viman Nagar" />
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * 4. SHORT ABOUT TEASER (PRD 7.1 & 5.7):
 * Uses the `cream` section variant (#FFF4E0) with strictly charcoal text (#0F0F10).
 */
export function AboutTeaserSection() {
  return (
    <Section variant="cream">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-6 min-w-0 space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] text-charcoal/70 font-semibold">
            {t('home.about.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal leading-tight">
            {t('home.about.heading')}
          </h2>
          <GoldDivider onCream ornament={false} className="my-2" />
          <p className="text-base text-charcoal/85 leading-relaxed">{t('home.about.body')}</p>
          <div className="pt-2">
            <Button variant="charcoal" size="md" href="/about">
              {t('home.about.cta')}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-6 min-w-0">
          <ImageWithOverlay slot="home_about_story" aspect="16x9" overlay={false} />
        </div>
      </div>
    </Section>
  );
}

/**
 * 5. OFFERS & HAPPY HOURS TEASER (PRD 7.1 & 5.5):
 * Editorial two-column split with top gold hairlines instead of heavy boxes.
 */
export function OffersTeaserSection({
  offers,
  state = 'ready',
}: {
  offers: OfferSlot[];
  state?: SectionDataState;
}) {
  return (
    <Section variant="surface">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            {t('home.offers.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-text">
            {t('home.offers.heading')}
          </h2>
        </div>
        <Button variant="secondary" size="sm" href="/offers">
          {t('home.offers.cta')}
        </Button>
      </div>

      {state === 'loading' && <SkeletonLoader lines={4} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="min-w-0 pt-6 border-t border-gold/30 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge kind="offer" label={offer.badgeText} />
                  <span className="text-xs uppercase tracking-widest text-gold">
                    Code: {offer.code}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-text">{offer.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{offer.description}</p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
                <span>
                  {offer.validFrom} — {offer.validUntil}
                </span>
                <Button variant="ghost" size="sm" href="/offers">
                  {t('home.offers.cta')} →
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/**
 * 6. REVIEWS TEASER (PRD 7.1 & 7.5):
 * Self-rotating testimonial card carousel with auto-advance, pause-on-hover,
 * smooth transitions, and manual prev/next & dot controls.
 */
export function ReviewsTeaserSection({
  reviews,
  state = 'ready',
}: {
  reviews: ReviewSlot[];
  state?: SectionDataState;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const total = reviews.length;

  React.useEffect(() => {
    if (paused || total <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [paused, total]);

  const activeReview = reviews[activeIndex] ?? reviews[0];
  const nextReview = reviews[(activeIndex + 1) % total];

  return (
    <Section variant="dark" className="border-t border-gold/15">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            {t('home.reviews.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-text">
            {t('home.reviews.heading')}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" href="/reviews">
            {t('home.reviews.cta')}
          </Button>
        </div>
      </div>

      {state === 'loading' && <SkeletonLoader lines={4} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && activeReview && (
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Guest testimonials"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Primary Self-Rotating Testimonial Card */}
            <div
              key={activeReview.id}
              aria-live="polite"
              className="lg:col-span-8 animate-menu-switch relative rounded-sm bg-surface/90 border border-gold/30 p-6 sm:p-9 shadow-gold-glow flex flex-col justify-between gap-6 overflow-hidden"
            >
              {/* Decorative Quote Watermark */}
              <span
                aria-hidden="true"
                className="pointer-events-none select-none absolute -top-4 right-5 font-serif text-8xl text-gold/10 leading-none"
              >
                &ldquo;
              </span>

              <div className="space-y-4 relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <RatingStars rating={activeReview.rating} />
                  <span className="px-2.5 py-0.5 text-[11px] uppercase tracking-widest rounded-full border border-gold/25 bg-bg/70 text-gold">
                    {activeReview.source === 'GOOGLE' ? 'Google Verified · 4.5★' : 'Verified Diner'}
                  </span>
                </div>

                <blockquote className="font-serif italic text-xl sm:text-2xl lg:text-[26px] text-text leading-relaxed">
                  &ldquo;{activeReview.comment}&rdquo;
                </blockquote>
              </div>

              <footer className="relative z-10 pt-4 border-t border-gold/15 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 text-gold font-serif text-base font-semibold inline-flex items-center justify-center">
                    {activeReview.reviewerName.charAt(0)}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-text">{activeReview.reviewerName}</div>
                    <div className="text-xs text-muted">{activeReview.dateLabel}</div>
                  </div>
                </div>

                {/* Prev / Next Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous testimonial"
                    onClick={() => setActiveIndex((prev) => (prev - 1 + total) % total)}
                    className="w-9 h-9 rounded-full border border-gold/30 text-gold hover:border-gold hover:bg-gold/10 active:scale-95 inline-flex items-center justify-center transition-all"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next testimonial"
                    onClick={() => setActiveIndex((prev) => (prev + 1) % total)}
                    className="w-9 h-9 rounded-full border border-gold/30 text-gold hover:border-gold hover:bg-gold/10 active:scale-95 inline-flex items-center justify-center transition-all"
                  >
                    →
                  </button>
                </div>
              </footer>
            </div>

            {/* Secondary Up-Next Preview Card (Desktop) */}
            {nextReview && (
              <button
                type="button"
                onClick={() => setActiveIndex((activeIndex + 1) % total)}
                className="hidden lg:flex lg:col-span-4 text-left rounded-sm bg-surface/40 border border-gold/15 hover:border-gold/35 p-6 flex-col justify-between gap-4 opacity-75 hover:opacity-100 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gold/80">
                    <span>Up Next</span>
                    <span>{(activeIndex + 2) > total ? 1 : activeIndex + 2} / {total}</span>
                  </div>
                  <RatingStars rating={nextReview.rating} />
                  <p className="font-serif italic text-lg text-text/85 line-clamp-4 leading-relaxed">
                    &ldquo;{nextReview.comment}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 text-xs text-muted">
                  <span className="text-text font-medium block">{nextReview.reviewerName}</span>
                  <span>{nextReview.dateLabel}</span>
                </div>
              </button>
            )}
          </div>

          {/* Interactive Rotation Progress Pills */}
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
            {reviews.map((rev, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={rev.id}
                  type="button"
                  aria-label={`Show review by ${rev.reviewerName}`}
                  aria-current={isCurrent}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isCurrent
                      ? 'w-8 bg-gold shadow-gold-glow'
                      : 'w-2 bg-gold/25 hover:bg-gold/50'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * 7. GALLERY TEASER (PRD 7.1 & 7.4):
 * Asymmetric editorial photography mosaic.
 */
export function GalleryTeaserSection({
  items,
  state = 'ready',
}: {
  items: GalleryItemSlot[];
  state?: SectionDataState;
}) {
  return (
    <Section variant="surface" className="border-t border-gold/15">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            {t('home.gallery.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-text">
            {t('home.gallery.heading')}
          </h2>
        </div>
        <Button variant="secondary" size="sm" href="/gallery">
          {t('home.gallery.cta')}
        </Button>
      </div>

      {state === 'loading' && <SkeletonLoader lines={5} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 min-w-0">
            <ImageWithOverlay slot={items[1]?.imageSlot ?? 'gallery_1'} aspect="16x9" overlay={false} />
          </div>
          <div className="lg:col-span-5 min-w-0">
            <ImageWithOverlay slot={items[0]?.imageSlot ?? 'gallery_2'} aspect="4x3" overlay={false} />
          </div>
          <div className="lg:col-span-4 min-w-0">
            <ImageWithOverlay slot={items[2]?.imageSlot ?? 'gallery_3'} aspect="4x3" overlay={false} />
          </div>
          <div className="lg:col-span-8 min-w-0">
            <ImageWithOverlay slot={items[4]?.imageSlot ?? 'gallery_4'} aspect="16x9" overlay={false} />
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * 8. RESERVATION & ORDER CTA BAND (PRD 7.1):
 * Open editorial callout band before the footer.
 */
export function DualCtaBandSection() {
  return (
    <Section variant="dark" className="border-t border-gold/20">
      <div className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl min-w-0">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gold text-glow-gold">
            {t('home.cta_band.heading')}
          </h2>
          <p className="text-base text-muted leading-relaxed">{t('home.cta_band.subtext')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          <Button variant="primary" size="lg" href="/reserve">
            {t('home.cta_band.reserve')}
          </Button>
          <Button variant="secondary" size="lg" href="/order">
            {t('home.cta_band.order')}
          </Button>
        </div>
      </div>
    </Section>
  );
}
