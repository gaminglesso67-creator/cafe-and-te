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
  CAFE_BLUR_DATA_URL,
  EmptyState,
  ErrorState,
  GoldDivider,
  ImageWithOverlay,
  MapEmbed,
  RatingStars,
  Section,
  SkeletonLoader,
  useTactileSound,
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
 * 1. HERO SECTION ("Caffè & Tè — All Day Cafe" Layout with Self-Rotating Display Heading):
 * Full-bleed atmospheric dusk photography fading into warm espresso,
 * vertical ritual/experience list with hollow circles on the left,
 * giant offset self-rotating serif display title on the right,
 * poetic paragraph, and "BOOK A TABLE (→)" circular CTA.
 */
export function HeroSignboardSection({ hours: _hours }: { hours: OpeningHourSlot[] }) {
  const heroSlides = [
    {
      line1: 'Caffè & Tè',
      line2: 'All Day Cafe',
      tag: 'Udchalo House · Clover Park, Viman Nagar',
      copy: 'Specialty Vietnamese iced coffee, hazelnut butter cappuccinos, flaky French croissants, and handcrafted pastas in an open-air garden setting.',
      slot: 'hero_signboard_visual',
    },
    {
      line1: 'Pasta Social',
      line2: 'By Caffè & Tè',
      tag: 'Newly Air-Conditioned Indoor Pasta Room',
      copy: 'A little more progress, a little more comfort! Step into our warm, air-conditioned Pasta Social lounge for fresh tagliatelle, penne, and cold brews.',
      slot: 'pasta_social_tagliatelle',
    },
    {
      line1: 'Sip & Paint',
      line2: 'Garden Patio',
      tag: 'Open-Air Vibe & Tabletop Canvas Painting',
      copy: 'Unwind under the Clover Park foliage with a canvas, brushes, and a tall glass of Vietnamese Iced Coffee or Caramel Cold Brew.',
      slot: 'lush_green_outdoor_patio',
    },
    {
      line1: 'Brews, Bakes',
      line2: '& Cheesecake',
      tag: '₹200–400 Per Person · Closes 11:30 PM',
      copy: 'From Madagascar vanilla cappuccinos and buttery croissants to crispy peri-peri fries and creamy Basque cheesecake.',
      slot: 'hazelnut_butter_cappuccino',
    },
  ];

  const [activeSlide, setActiveSlide] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const touchStartXRef = React.useRef<number | null>(null);
  const { playTactile } = useTactileSound();

  React.useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, heroSlides.length]);

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) > 42) {
      playTactile('tick');
      if (deltaX < 0) {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      } else {
        setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      }
    }
  };

  const currentSlide = heroSlides[activeSlide] ?? heroSlides[0]!;
  const heroVisual = getImageSlot(currentSlide.slot, '16x9');

  const rituals = [
    { label: 'Vietnamese Iced Coffee', href: '/order', slideIdx: 0 },
    { label: 'Hazelnut Butter Cappuccino', href: '/order', slideIdx: 3 },
    { label: 'Pasta Social (AC Lounge)', href: '/menu', slideIdx: 1 },
    { label: 'Sip & Paint Garden Patio', href: '/gallery', slideIdx: 2 },
    { label: 'Buttery Croissants & Bakes', href: '/menu', slideIdx: 3 },
    { label: 'Crispy Peri-Peri Fries', href: '/order', slideIdx: 0 },
    { label: 'Burnt Basque Cheesecake', href: '/menu', slideIdx: 3 },
  ];

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleHeroTouchStart}
      onTouchEnd={handleHeroTouchEnd}
      className="relative w-full min-h-[calc(100dvh-4rem)] bg-bg overflow-hidden flex items-center py-8 sm:py-14 lg:py-20"
    >
      {/* Full-Bleed Atmospheric Bokeh Background Image with Warm Amber Glow Fades */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          key={heroVisual.src}
          src={heroVisual.src}
          alt={heroVisual.alt}
          fill
          priority
          placeholder="blur"
          blurDataURL={CAFE_BLUR_DATA_URL}
          sizes="100vw"
          className="object-cover object-center opacity-75 scale-105 animate-signboard-breathe transition-opacity duration-700"
        />
        {/* Warm Amber Radial Lantern Glow & Soft Espresso Edge Vignettes */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 55% 42%, rgba(232, 165, 75, 0.32) 0%, rgba(196, 110, 42, 0.18) 42%, rgba(18, 13, 9, 0.72) 78%, #0E0B09 98%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(14, 11, 9, 0.45) 0%, transparent 45%, rgba(14, 11, 9, 0.88) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 items-center lg:min-h-[68dvh]">
          {/* Left 4 Cols: Floating Smoked-Glass Rituals Dock ("○ Intimate Tastings" style) */}
          <div className="lg:col-span-4 order-2 lg:order-1 animate-reveal-2">
            <div className="glass-card glass-card-interactive rounded-md p-5 sm:p-7 w-full lg:max-w-sm">
              <p className="text-[10px] uppercase tracking-[0.26em] text-gold/80 mb-3.5 sm:mb-5">
                All-Day Cafe Highlights
              </p>
              <ul className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 lg:gap-3.5 pl-1">
                {/* Faint vertical connecting hairline (desktop) */}
                <span
                  aria-hidden="true"
                  className="hidden lg:block pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/45 via-white/15 to-transparent"
                />
                {rituals.map((item) => (
                  <li key={item.label} className="relative">
                    <Link
                      href={item.href}
                      data-tactile="tick"
                      onMouseEnter={() => setActiveSlide(item.slideIdx)}
                      className="group min-h-10 lg:min-h-0 flex items-center justify-between gap-3 text-xs sm:text-[13px] tracking-wide text-text/85 hover:text-text transition-colors py-1"
                    >
                      <span className="inline-flex items-center gap-3.5">
                        <span
                          aria-hidden="true"
                          className="w-2 h-2 rounded-full border border-white/60 bg-bg group-hover:border-gold group-hover:bg-gold group-hover:scale-125 group-hover:shadow-gold-glow transition-all duration-300 shrink-0"
                        />
                        <span className="font-serif text-sm sm:text-base tracking-wide group-hover:translate-x-1.5 group-hover:text-gold transition-all duration-300">
                          {item.label}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-gold/60 lg:text-gold/0 group-hover:text-gold lg:-translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-xs"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right 8 Cols: Giant Offset Rotating Serif Title + Floating Glass Summary Card */}
          <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-start lg:items-end justify-between lg:min-h-[54dvh] gap-6 sm:gap-10">
            {/* Giant Stacked Offset Rotating Display Heading */}
            <div className="lg:text-right w-full space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill animate-float-slow max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.24em] text-gold/95 truncate">
                  {currentSlide.tag} · 4.4 ★ (85)
                </span>
              </div>

              <div key={activeSlide} aria-live="polite" className="animate-hero-rotate">
                <h1 className="font-serif font-normal text-[2.6rem] sm:text-7xl lg:text-[86px] text-text leading-[0.98] tracking-[-0.02em] drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)]">
                  <span className="block">{currentSlide.line1}</span>
                  <span className="block pl-6 sm:pl-20 lg:pl-0 text-ember-gradient">
                    {currentSlide.line2}
                  </span>
                </h1>
              </div>

              {/* Interactive Rotation Pills (Thumb-friendly hit area) */}
              <div className="flex items-center lg:justify-end gap-1.5 pt-1">
                {heroSlides.map((slide, idx) => {
                  const isCurrent = idx === activeSlide;
                  return (
                    <button
                      key={slide.line1}
                      type="button"
                      data-tactile="tick"
                      aria-label={`Show hero slide: ${slide.line1} ${slide.line2}`}
                      aria-current={isCurrent}
                      onClick={() => setActiveSlide(idx)}
                      className="min-h-8 px-1 inline-flex items-center justify-center"
                    >
                      <span
                        className={`block h-1.5 rounded-full transition-all duration-500 ${
                          isCurrent
                            ? 'w-9 bg-gold shadow-gold-glow'
                            : 'w-2.5 bg-white/25 hover:bg-gold/50'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom-Right Floating Glass Card with Rotating Poetic Copy & Circular Arrow CTA */}
            <div className="animate-reveal-3 w-full lg:max-w-sm glass-card glass-card-interactive rounded-md p-5 sm:p-6 space-y-4 sm:space-y-5 lg:mr-2">
              <p
                key={`copy-${activeSlide}`}
                className="animate-menu-switch text-xs sm:text-[13px] text-text/85 leading-relaxed relative z-10 min-h-[3.75rem]"
              >
                {currentSlide.copy}
              </p>
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-white/10">
                <NocturneArrowCta href="/reserve" label="BOOK A TABLE" />
                <Link
                  href="/order"
                  className="text-[11px] uppercase tracking-[0.22em] text-muted hover:text-gold transition-colors link-underline-gold py-1"
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
      {/* Header Row: Offset Caramel-Sage "Caffè & Tè / Specials" + Side Description */}
      <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-14 mb-14">
        <h2 className="font-serif font-normal text-5xl sm:text-6xl lg:text-[74px] leading-[0.95] tracking-[-0.02em] text-ember-gradient shrink-0">
          <span className="block">Barista&apos;s</span>
          <span className="block pl-12 sm:pl-20">Specials</span>
        </h2>

        <p className="text-xs sm:text-[13px] text-muted/85 max-w-[280px] leading-relaxed pb-1">
          Vietnamese iced coffee, hazelnut butter cappuccinos, flaky croissants, and handmade Pasta Social bowls — crafted fresh all day for ₹200–400 per person.
        </p>
      </div>

      {state === 'loading' && <SkeletonLoader lines={6} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState actionLabel={t('global.nav.menu')} actionHref="/menu" />}
      {state === 'ready' && (
        <>
          {/* 4-Column Glassmorphic Portrait Cards Grid (2x2 on mobile, 4-col on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {portraitDishes.map((dish, idx) => {
              const img = getImageSlot(dish.imageSlot, '3x4');
              const staggerClass =
                idx === 0
                  ? 'animate-stagger-1'
                  : idx === 1
                    ? 'animate-stagger-2'
                    : 'animate-stagger-3';
              return (
                <div
                  key={dish.id}
                  data-tactile="confirm"
                  onClick={() => handleQuickAdd(dish)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleQuickAdd(dish);
                    }
                  }}
                  className={`${staggerClass} glass-card glass-card-interactive group relative aspect-[3/4] rounded-md overflow-hidden flex flex-col justify-between p-2.5 sm:p-4 cursor-pointer`}
                >
                  {/* Dish Image Emerging from Deep Nocturnal Vignette (Lazy-Loaded with Blur-Up) */}
                  <Image
                    src={img.src}
                    alt={dish.name}
                    fill
                    loading="lazy"
                    decoding="async"
                    placeholder="blur"
                    blurDataURL={CAFE_BLUR_DATA_URL}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center opacity-80 group-hover:opacity-95 group-hover:scale-110 transition-all duration-700 ease-out"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/30 to-bg/95 transition-opacity duration-500 group-hover:opacity-80"
                  />

                  {/* Top Frosted Glass Price & Quick-Add Pill */}
                  <div className="relative z-10 flex items-center justify-between gap-1.5">
                    <span className="glass-pill px-2.5 sm:px-3 py-1 rounded-full font-mono text-[11px] sm:text-xs text-gold">
                      {formatPriceToken(dish.price)}
                    </span>
                    <span className="glass-pill px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider sm:tracking-widest text-[9px] sm:text-[10px] text-text/95 group-hover:bg-gold group-hover:text-bg group-hover:border-gold transition-all duration-300">
                      + Add
                    </span>
                  </div>

                  {/* Bottom Frosted Glass Dock (Visible on mobile, hover-expanded on desktop) */}
                  <div className="relative z-10 rounded-sm bg-black/60 backdrop-blur-md border border-white/12 p-2.5 sm:p-4 text-center transition-all duration-500 group-hover:border-gold/40 group-hover:-translate-y-1">
                    <h3 className="font-serif text-sm sm:text-lg text-text leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {dish.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-muted/90 line-clamp-2 mt-1 max-h-10 opacity-90 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-14 sm:group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                      {dish.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* 4th Card: "Pasta Social & Cold Brew — Barista's Secret Pour" with Fluted Amber Glass */}
            {secretPlate && (
              <div
                data-tactile="confirm"
                onClick={() => handleQuickAdd(secretPlate)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleQuickAdd(secretPlate);
                  }
                }}
                className="animate-stagger-4 glass-card-interactive group relative aspect-[3/4] rounded-md border border-gold/35 hover:border-gold/70 bg-ember-fluted overflow-hidden flex flex-col justify-between p-2.5 sm:p-4 cursor-pointer"
              >
                {/* Top-Left Frosted Glass Lock Indicator ("✦ Pasta Social · All Day") */}
                <div className="relative z-10 inline-flex items-center gap-1.5 self-start glass-pill px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] text-text/95">
                  <span aria-hidden="true" className="text-gold text-xs animate-pulse">
                    ✦
                  </span>
                  <span className="truncate">Pasta Social · All Day</span>
                </div>

                {/* Living Vertical Amber Light Core */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 inset-y-12 rounded-full bg-gold/15 blur-2xl group-hover:bg-gold/30 group-hover:scale-110 transition-all duration-700"
                />

                {/* Bottom Frosted Glass Dock */}
                <div className="relative z-10 rounded-sm bg-black/65 backdrop-blur-md border border-gold/25 p-2.5 sm:p-4 text-center space-y-1 transition-all duration-500 group-hover:border-gold/60 group-hover:-translate-y-1">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-gold/90">
                    {formatPriceToken(secretPlate.price)} · Roastery Pick
                  </p>
                  <h3 className="font-serif text-sm sm:text-lg text-text leading-snug group-hover:text-gold transition-colors">
                    Barista&apos;s Secret Pour
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-muted/90 line-clamp-2 pt-0.5 max-h-10 opacity-90 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-14 sm:group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    {secretPlate.name} — {secretPlate.description}
                  </p>
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
  const [realTimeText, setRealTimeText] = React.useState('--:--:--');
  const [periodText, setPeriodText] = React.useState('');
  const [angles, setAngles] = React.useState({ hour: 0, minute: 0, second: 0 });
  const [activeHourIndex, setActiveHourIndex] = React.useState(0);

  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const rawHours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      const displayHour12 = rawHours % 12 || 12;
      const period = rawHours >= 12 ? 'PM' : 'AM';

      const hrs = String(displayHour12).padStart(2, '0');
      const mins = String(minutes).padStart(2, '0');
      const secs = String(seconds).padStart(2, '0');

      setRealTimeText(`${hrs}:${mins}:${secs}`);
      setPeriodText(period);

      const h12 = rawHours % 12;
      setActiveHourIndex(h12);
      setAngles({
        hour: h12 * 30 + minutes * 0.5 + seconds * (0.5 / 60),
        minute: minutes * 6 + seconds * 0.1,
        second: seconds * 6 + milliseconds * 0.006,
      });
    };

    updateClock();
    const timer = window.setInterval(updateClock, 200);
    return () => window.clearInterval(timer);
  }, []);

  const patioVisual = getImageSlot('lush_green_outdoor_patio', '3x4');

  return (
    <Section variant="dark" className="border-t border-white/[0.07]">
      {state === 'loading' && <SkeletonLoader lines={5} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left 5 Cols: "THE NOCTURNE — No Rush. All Day Is Ours." Glassmorphic Showcase Card */}
          <div className="lg:col-span-5 min-w-0">
            <div className="glass-panel-deep glass-card-interactive relative rounded-[24px] sm:rounded-[28px] overflow-hidden p-5 sm:p-8 min-h-[430px] sm:min-h-[550px] flex flex-col justify-between">
              {/* Warm Bokeh Lounge / Patio Background (Lazy-Loaded with Blur-Up) */}
              <Image
                src={patioVisual.src}
                alt="Caffè & Tè Garden Patio Ambience"
                fill
                loading="lazy"
                decoding="async"
                placeholder="blur"
                blurDataURL={CAFE_BLUR_DATA_URL}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center opacity-50 transition-transform duration-1000 hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/40 to-bg/95"
              />

              {/* Top Mini Header inside the Nocturne Frame */}
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 text-[11px] uppercase tracking-[0.22em] text-text/85">
                  <Link href="/menu" className="hover:text-gold transition-colors link-underline-gold py-0.5">
                    MENU
                  </Link>
                  <Link
                    href="/reserve"
                    className="inline-flex items-center gap-1.5 glass-pill px-3 py-1 rounded-full hover:border-gold/50 hover:text-gold transition-all"
                  >
                    <span aria-hidden="true" className="text-gold">
                      🛎
                    </span>
                    <span>RESERVE</span>
                  </Link>
                </div>

                {/* Live Real-Time Digital & Analog Clock Glass Card */}
                <div className="glass-card glass-card-interactive rounded-md p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1.5 relative z-10">
                    <p className="text-xs text-muted/90">Live Pune Time · Closes 11:30 PM</p>
                    <p className="font-sans font-light text-2xl sm:text-3xl tracking-wider text-text tabular-nums drop-shadow-[0_2px_10px_rgba(223,141,68,0.25)] flex items-baseline gap-1.5">
                      <span>{realTimeText}</span>
                      {periodText && (
                        <span className="text-xs font-mono tracking-widest text-gold">
                          {periodText}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gold/90 pt-1">Brewing fresh all day!</p>
                  </div>

                  {/* Minimalist 12-Dot Analog Clock SVG with Ambient Copper Halo */}
                  <div className="relative w-24 h-24 shrink-0 z-10" aria-hidden="true">
                    <span className="pointer-events-none absolute inset-2 rounded-full bg-gold/10 blur-md animate-pulse" />
                    <svg viewBox="0 0 100 100" className="w-full h-full relative">
                      {/* 12 Perimeter Dots */}
                      {Array.from({ length: 12 }).map((_, idx) => {
                        const rad = ((idx * 30 - 90) * Math.PI) / 180;
                        const cx = 50 + 40 * Math.cos(rad);
                        const cy = 50 + 40 * Math.sin(rad);
                        const isPassedOrCurrent = idx <= activeHourIndex;
                        const isCurrentHourDot = idx === activeHourIndex;
                        return (
                          <circle
                            key={idx}
                            cx={cx}
                            cy={cy}
                            r={isCurrentHourDot ? 2.8 : isPassedOrCurrent ? 2.1 : 1.5}
                            fill={isPassedOrCurrent ? '#DF8D44' : 'rgba(255,244,224,0.22)'}
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
                      <circle cx="50" cy="50" r="2.2" fill="#DF8D44" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Centered "No Rush. All Day Is Ours." & Circular Arrow CTA */}
              <div className="relative z-10 text-center space-y-5 sm:space-y-6 pt-10 sm:pt-16 pb-2">
                <h2 className="font-serif font-normal text-3xl sm:text-5xl text-text leading-[1.05] drop-shadow-[0_6px_24px_rgba(0,0,0,0.85)]">
                  <span className="block">No Rush.</span>
                  <span className="block text-ember-gradient">All Day Is Ours.</span>
                </h2>
                <div className="flex justify-center">
                  <NocturneArrowCta href="/reserve" label="BOOK A TABLE" size="lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Viman Nagar Location, 4 Glass Bento Info Cards & Interactive Google Map */}
          <div className="lg:col-span-7 min-w-0 space-y-6 sm:space-y-7">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.26em] text-gold">
                CAFFÈ &amp; TÈ · UDCHALO HOUSE, VIMAN NAGAR
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl text-text leading-tight">
                {t('home.location.heading')}
              </h2>
              <p className="text-sm text-muted max-w-xl leading-relaxed">
                Located at Ground Floor, Udchalo House, Plot No. 10, Clover Park, Viman Nagar, Pune 411014. Enjoy our open-air garden seating, tabletop canvas painting, and our newly air-conditioned Pasta Social indoor lounge.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="glass-card glass-card-interactive rounded-md p-3.5 sm:p-4">
                <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted">Hours (All Days)</dt>
                <dd className="font-serif text-base sm:text-lg text-gold mt-1">Open · Closes 11:30 PM</dd>
              </div>
              <div className="glass-card glass-card-interactive rounded-md p-3.5 sm:p-4">
                <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted">Service Options</dt>
                <dd className="font-serif text-base sm:text-lg text-text mt-1">Dine-in · Kerbside · Delivery</dd>
              </div>
              <div className="glass-card glass-card-interactive rounded-md p-3.5 sm:p-4">
                <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted">Direct Cafe Desk</dt>
                <dd className="font-mono text-xs sm:text-sm text-text mt-1">{t('brand.phone_display')}</dd>
              </div>
              <div className="glass-card glass-card-interactive rounded-md p-3.5 sm:p-4">
                <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted">Price Per Person</dt>
                <dd className="text-xs sm:text-sm text-text mt-1">₹200 – ₹400 (26+ reports)</dd>
              </div>
            </dl>

            <div className="glass-card rounded-md p-2">
              <MapEmbed slotName="Udchalo House, Clover Park, Viman Nagar" />
            </div>
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
 * Two-column glassmorphic privilege cards with frosted code pills and hover lift.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {offers.map((offer, idx) => (
            <div
              key={offer.id}
              className={`${
                idx === 0 ? 'animate-stagger-1' : 'animate-stagger-2'
              } glass-card glass-card-interactive rounded-md p-6 sm:p-8 flex flex-col justify-between gap-6`}
            >
              <div className="space-y-4 relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge kind="offer" label={offer.badgeText} />
                  <span className="glass-pill px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-gold">
                    Code: {offer.code}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-text">{offer.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{offer.description}</p>
              </div>
              <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
                <span>
                  {offer.validFrom} — {offer.validUntil}
                </span>
                <NocturneArrowCta href="/offers" label="CLAIM OFFER" size="sm" />
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
 * Self-rotating glassmorphic testimonial card carousel with auto-advance,
 * animated 4.5s progress bar pill, pause-on-hover, and "Up Next" glass preview card.
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
  const reviewTouchStartXRef = React.useRef<number | null>(null);
  const { playTactile } = useTactileSound();

  const total = reviews.length;

  React.useEffect(() => {
    if (paused || total <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [paused, total]);

  const handleReviewTouchStart = (e: React.TouchEvent) => {
    reviewTouchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleReviewTouchEnd = (e: React.TouchEvent) => {
    if (reviewTouchStartXRef.current === null || total <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? reviewTouchStartXRef.current;
    const deltaX = endX - reviewTouchStartXRef.current;
    reviewTouchStartXRef.current = null;
    if (Math.abs(deltaX) > 42) {
      playTactile('tick');
      if (deltaX < 0) {
        setActiveIndex((prev) => (prev + 1) % total);
      } else {
        setActiveIndex((prev) => (prev - 1 + total) % total);
      }
    }
  };

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
          onTouchStart={handleReviewTouchStart}
          onTouchEnd={handleReviewTouchEnd}
          aria-roledescription="carousel"
          aria-label="Guest testimonials"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Primary Self-Rotating Glassmorphic Testimonial Card */}
            <div
              key={activeReview.id}
              aria-live="polite"
              className="lg:col-span-8 animate-menu-switch glass-panel-deep glass-card-interactive rounded-md p-6 sm:p-9 flex flex-col justify-between gap-6"
            >
              {/* Decorative Quote Watermark */}
              <span
                aria-hidden="true"
                className="pointer-events-none select-none absolute -top-4 right-5 font-serif text-8xl text-gold/12 leading-none"
              >
                &ldquo;
              </span>

              <div className="space-y-4 relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <RatingStars rating={activeReview.rating} />
                  <span className="glass-pill px-3 py-1 text-[11px] uppercase tracking-widest rounded-full text-gold">
                    {activeReview.source === 'GOOGLE' ? 'Google Verified · 4.4★ (85)' : 'Verified Regular'}
                  </span>
                </div>

                <blockquote className="font-serif italic text-xl sm:text-2xl lg:text-[26px] text-text leading-relaxed">
                  &ldquo;{activeReview.comment}&rdquo;
                </blockquote>
              </div>

              <footer className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full glass-pill text-gold font-serif text-base font-semibold inline-flex items-center justify-center">
                    {activeReview.reviewerName.charAt(0)}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-text">{activeReview.reviewerName}</div>
                    <div className="text-xs text-muted">{activeReview.dateLabel}</div>
                  </div>
                </div>

                {/* Prev / Next Controls (>=44x44px touch targets) */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-tactile="tick"
                    aria-label="Previous testimonial"
                    onClick={() => setActiveIndex((prev) => (prev - 1 + total) % total)}
                    className="w-11 h-11 rounded-full glass-pill text-gold hover:border-gold hover:bg-gold/15 inline-flex items-center justify-center transition-all"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    data-tactile="tick"
                    aria-label="Next testimonial"
                    onClick={() => setActiveIndex((prev) => (prev + 1) % total)}
                    className="w-11 h-11 rounded-full glass-pill text-gold hover:border-gold hover:bg-gold/15 inline-flex items-center justify-center transition-all"
                  >
                    →
                  </button>
                </div>
              </footer>
            </div>

            {/* Secondary Up-Next Glass Preview Card (Desktop) */}
            {nextReview && (
              <button
                type="button"
                onClick={() => setActiveIndex((activeIndex + 1) % total)}
                className="hidden lg:flex lg:col-span-4 text-left glass-card glass-card-interactive rounded-md p-6 flex-col justify-between gap-4 opacity-80 hover:opacity-100"
              >
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gold/85">
                    <span>Up Next</span>
                    <span>{(activeIndex + 2) > total ? 1 : activeIndex + 2} / {total}</span>
                  </div>
                  <RatingStars rating={nextReview.rating} />
                  <p className="font-serif italic text-lg text-text/85 line-clamp-4 leading-relaxed">
                    &ldquo;{nextReview.comment}&rdquo;
                  </p>
                </div>
                <div className="relative z-10 pt-3 border-t border-white/10 text-xs text-muted">
                  <span className="text-text font-medium block">{nextReview.reviewerName}</span>
                  <span>{nextReview.dateLabel}</span>
                </div>
              </button>
            )}
          </div>

          {/* Interactive Rotation Progress Pills with Animated Fill */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1">
            {reviews.map((rev, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={rev.id}
                  type="button"
                  aria-label={`Show review by ${rev.reviewerName}`}
                  aria-current={isCurrent}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ${
                    isCurrent ? 'w-10 bg-white/15' : 'w-2.5 bg-gold/25 hover:bg-gold/50'
                  }`}
                >
                  {isCurrent && (
                    <span
                      key={`${activeIndex}-${paused ? 'paused' : 'playing'}`}
                      className={`block h-full w-full origin-left bg-gold rounded-full ${
                        paused ? 'scale-x-100' : 'animate-carousel-progress'
                      }`}
                    />
                  )}
                </button>
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
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-5">
          <div className="col-span-2 lg:col-span-7 min-w-0">
            <ImageWithOverlay slot={items[1]?.imageSlot ?? 'gallery_1'} aspect="16x9" overlay={false} />
          </div>
          <div className="col-span-1 lg:col-span-5 min-w-0">
            <ImageWithOverlay slot={items[0]?.imageSlot ?? 'gallery_2'} aspect="4x3" overlay={false} />
          </div>
          <div className="col-span-1 lg:col-span-4 min-w-0">
            <ImageWithOverlay slot={items[2]?.imageSlot ?? 'gallery_3'} aspect="4x3" overlay={false} />
          </div>
          <div className="col-span-2 lg:col-span-8 min-w-0">
            <ImageWithOverlay slot={items[4]?.imageSlot ?? 'gallery_4'} aspect="16x9" overlay={false} />
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * 8. RESERVATION & ORDER CTA BAND (PRD 7.1):
 * Glassmorphic Nocturne callout card before the footer.
 */
export function DualCtaBandSection() {
  return (
    <Section variant="dark" className="border-t border-gold/20">
      <div className="glass-panel-deep glass-card-interactive rounded-md p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl min-w-0 relative z-10">
          <p className="text-[11px] uppercase tracking-[0.26em] text-gold">
            RESERVE OR ORDER DIRECT
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ember-gradient">
            {t('home.cta_band.heading')}
          </h2>
          <p className="text-base text-muted leading-relaxed">{t('home.cta_band.subtext')}</p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 shrink-0">
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
