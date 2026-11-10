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
  MapEmbed,
  RatingStars,
  Section,
  SkeletonLoader,
  useToast,
} from '@/components/ui';

export type SectionDataState = 'ready' | 'loading' | 'empty' | 'error';

/**
 * Signature Nocturne Action Link ("BOOK A TABLE (→)", "BOOK A ROOM (→)", "LEARN MORE (→)")
 * Matches the reference video: tracked uppercase text + white/cream circular arrow button.
 */
export function NocturneArrowCta({
  href,
  label,
  size = 'md',
}: {
  href: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const circleSize =
    size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const textSize =
    size === 'lg'
      ? 'text-xs tracking-[0.22em]'
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
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

/**
 *Glowing Warm Amber Orb (used in Section 2 "Where Time Slows" and Section 6 "Real Experience" per video 00:03 & 00:13)
 */
function NocturneAmberOrb({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative pointer-events-none select-none ${className}`}
    >
      {/* Outer wide atmospheric amber halo */}
      <div
        className="w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-2xl opacity-85"
        style={{
          background:
            'radial-gradient(circle, rgba(223,141,68,0.55) 0%, rgba(164,80,35,0.28) 48%, rgba(7,7,8,0) 76%)',
        }}
      />
      {/* Inner luminous golden-yellow core */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full blur-[3px]"
        style={{
          background:
            'radial-gradient(circle at 38% 38%, #FFF4C2 0%, #E7B257 52%, rgba(201,106,43,0.15) 85%, transparent 100%)',
        }}
      />
    </div>
  );
}

/**
 * 1. FULL-SCREEN NOCTURNE HERO (Video 00:00 – 00:02):
 * - Transitions from "Where The City / Whispers" (soft bokeh blur + 3s countdown)
 *   into "No Rush. / Night Is Ours." (crisp bar focus + live night countdown & lit copper dots).
 * - Centered "BOOK A TABLE (→)" CTA.
 * - Bottom-left floating glass clock widget with 12-dot analog SVG clock.
 * - Bottom-center location label + bottom-right 4 square-bordered social/contact icons.
 */
export function HeroSignboardSection({ hours: _hours }: { hours: OpeningHourSlot[] }) {
  const heroVisual = getImageSlot('newly_opened_bar', '16x9');
  const [nightUnlocked, setNightUnlocked] = React.useState(false);
  const [introSecs, setIntroSecs] = React.useState(3);
  const [nightTimer, setNightTimer] = React.useState('05:59:59');
  const [angles, setAngles] = React.useState({ hour: 60, minute: 15, second: 210 });

  // 3-second intro countdown ("00:00:03" -> "00:00:00") then unlocks "No Rush. Night Is Ours." (just like video 00:00 -> 00:02)
  React.useEffect(() => {
    if (nightUnlocked) return;
    if (introSecs <= 0) {
      setNightUnlocked(true);
      return;
    }
    const tId = window.setTimeout(() => {
      setIntroSecs((prev) => prev - 1);
    }, 1000);
    return () => window.clearTimeout(tId);
  }, [introSecs, nightUnlocked]);

  // Live analog hands + night countdown
  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(23, 59, 59, 999);
      const diffSec = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
      const hrs = String(Math.floor(diffSec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
      const secs = String(diffSec % 60).padStart(2, '0');
      setNightTimer(`${hrs}:${mins}:${secs}`);

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
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const whatsappUrl = `https://wa.me/${t('brand.whatsapp_number')}?text=${encodeURIComponent(
    t('brand.whatsapp_prefill')
  )}`;

  return (
    <section className="relative w-full min-h-[calc(100dvh-4rem)] bg-bg overflow-hidden flex flex-col justify-between py-8 sm:py-10">
      {/* Full-Screen Atmospheric Bar & Lounge Backdrop (Soft Blur during Whisper Intro -> Crisp Focus on Night Unlock) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src={heroVisual.src}
          alt={heroVisual.alt}
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-all duration-1000 ease-out ${
            nightUnlocked
              ? 'scale-100 blur-0 opacity-65'
              : 'scale-110 blur-[6px] opacity-55'
          }`}
        />
        {/* Warm amber dusk radial wash + deep pitch-black edge vignettes */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(223, 141, 68, 0.14) 0%, rgba(7, 7, 8, 0.52) 58%, #070708 96%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-bg/75 via-transparent to-bg"
        />
      </div>

      {/* Top Spacer */}
      <div className="relative z-10" />

      {/* Centerpiece Display Serif Heading + BOOK A TABLE (→) CTA */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center my-auto py-12">
        <div
          key={nightUnlocked ? 'night-ours' : 'city-whispers'}
          className="animate-menu-switch space-y-8"
        >
          {nightUnlocked ? (
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[86px] text-text leading-[0.98] tracking-[-0.02em]">
              <span className="block">No Rush.</span>
              <span className="block">Night Is Ours.</span>
            </h1>
          ) : (
            <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[86px] text-text leading-[0.98] tracking-[-0.02em]">
              <span className="block">Where The City</span>
              <span className="block">Whispers</span>
            </h1>
          )}

          <div className="flex justify-center pt-1">
            <NocturneArrowCta href="/reserve" label="BOOK A TABLE" size="lg" />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Floating Glass Clock Widget (Left) · Location Label (Center) · 4 Square Social Icons (Right) */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Bottom-Left Floating Glass Clock Widget (Click to toggle Whisper / Night state) */}
          <button
            type="button"
            onClick={() => {
              setNightUnlocked((prev) => !prev);
              setIntroSecs(3);
            }}
            title="Toggle Dusk / Night mood"
            className="text-left group w-full sm:w-[295px] rounded-xs border border-white/15 hover:border-gold/45 bg-black/60 backdrop-blur-md p-4 flex items-center justify-between gap-4 transition-all duration-300 shadow-panel"
          >
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted/90">
                {nightUnlocked ? 'Enjoy night menu' : 'Left to night menu'}
              </p>
              <p className="font-sans font-light text-2xl tracking-wider text-text tabular-nums">
                {nightUnlocked
                  ? nightTimer
                  : `00:00:0${Math.max(0, introSecs)}`}
              </p>
              <p className="text-[11px] text-text/80 pt-1">
                {nightUnlocked ? 'Night is ours!' : "We're almost there!"}
              </p>
            </div>

            {/* Minimalist 12-Dot Analog Clock SVG */}
            <div className="relative w-20 h-20 shrink-0" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {Array.from({ length: 12 }).map((_, idx) => {
                  const rad = ((idx * 30 - 90) * Math.PI) / 180;
                  const cx = 50 + 40 * Math.cos(rad);
                  const cy = 50 + 40 * Math.sin(rad);
                  const isLitArc = nightUnlocked && idx >= 0 && idx <= 5;
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r={isLitArc ? 2.3 : 1.5}
                      fill={isLitArc ? '#DF8D44' : 'rgba(255,244,224,0.22)'}
                    />
                  );
                })}
                {/* Hour hand */}
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="27"
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
          </button>

          {/* Bottom-Center Location Coordinate Label */}
          <div className="text-center md:pb-1">
            <Link
              href="/contact"
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-text/80 hover:text-gold transition-colors"
            >
              CLOVER PARK, VIMAN NAGAR, PUNE
            </Link>
          </div>

          {/* Bottom-Right 4 Square-Bordered Social / Quick Action Icons */}
          <div className="flex items-center justify-center md:justify-end gap-2 md:pb-1">
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
              aria-label="WhatsApp Concierge"
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
              aria-label="Google Maps Directions"
              className="w-8 h-8 border border-white/15 hover:border-gold text-text/80 hover:text-gold inline-flex items-center justify-center transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 2. "WHERE TIME SLOWS. AND SENSES WAKE." + 4 STAGGERED NUMBERED PILLARS (Video 00:03 – 00:05):
 * - Top: Glowing warm amber orb on the left + 3-line display serif heading & 2-column copy on the right.
 * - Bottom: 4 diagonally staggered vertical cards (`1`, `2`, `3`, `4`) with giant copper-gold watermark numerals.
 */
export function AboutTeaserSection() {
  const pillars = [
    {
      num: '1',
      title: 'Night is ours',
      copy: 'Time slows. Conversations soften, music hums, every plate moves to its own quiet rhythm.',
      offsetClass: 'lg:mt-0',
    },
    {
      num: '2',
      title: 'Heat First',
      copy: 'The flame decides everything — sear, scent, smoke. What begins with fire ends in flavour.',
      offsetClass: 'lg:mt-10',
    },
    {
      num: '3',
      title: 'Silence Matters',
      copy: 'The hush between courses is part of the ritual — the pause before the toast, the warmth after.',
      offsetClass: 'lg:mt-20',
    },
    {
      num: '4',
      title: 'Craft Is Honest',
      copy: 'Spice is truth, sweetness is rare — honesty is the craft of the midnight kitchen.',
      offsetClass: 'lg:mt-32',
    },
  ];

  return (
    <Section variant="dark" className="py-20 sm:py-28 overflow-hidden">
      {/* Part A: Glowing Amber Orb + "Where Time Slows. And Senses Wake." */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-20 sm:mb-28">
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <NocturneAmberOrb />
        </div>

        <div className="lg:col-span-7 space-y-10">
          <h2 className="font-serif font-normal text-4xl sm:text-6xl lg:text-[68px] text-text leading-[1.02] tracking-[-0.02em]">
            <span className="block">Where Time</span>
            <span className="block">Slows. And</span>
            <span className="block">Senses Wake.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            <p className="text-xs sm:text-[13px] text-muted/85 leading-relaxed">
              Dining after dark is a ritual — a balance of mood, flavor, and light. Every detail moves like a scene: the clink of glasses, the warm teakwood glow, the slow drift of spices across our Viman Nagar patio.
            </p>
            <p className="text-xs sm:text-[13px] text-muted/85 leading-relaxed">
              Each evening is crafted to awaken the senses. Light and shadow, warmth and unhurried conversation — forming a multi-generational sanctuary that breathes until midnight.
            </p>
          </div>
        </div>
      </div>

      {/* Part B: 4 Staggered Pillars with Giant Watermark Numerals 1, 2, 3, 4 (Video 00:05) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {pillars.map((pillar) => (
          <div
            key={pillar.num}
            className={`${pillar.offsetClass} group relative aspect-[3/4] rounded-xs border border-white/10 hover:border-gold/40 bg-gradient-to-b from-[#1A130E] via-[#0E0C0A] to-[#080809] p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-500`}
          >
            {/* Giant Translucent Copper-Amber Numeral Watermark */}
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-2 right-4 font-serif text-[120px] sm:text-[140px] leading-none text-gold/15 group-hover:text-gold/25 transition-colors duration-500"
            >
              {pillar.num}
            </span>

            {/* Top-Left Title */}
            <h3 className="relative z-10 font-serif text-lg sm:text-xl text-text">
              {pillar.title}
            </h3>

            {/* Bottom Description */}
            <p className="relative z-10 text-xs text-muted/85 leading-relaxed max-w-[230px]">
              {pillar.copy}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/**
 * 3. "THE EMBER ROOM" / "THE SAANJH ROOM" (Video 00:06 – 00:07):
 * - Full-bleed warm bokeh background image dissolving into pitch black.
 * - Left vertical list of 7 rituals with hollow circle markers (`○`) and vertical line.
 * - Right giant stacked offset serif title ("The Ember / Room") + bottom-right paragraph & "BOOK A ROOM (→)".
 */
export function GalleryTeaserSection({
  items: _items,
  state: _state = 'ready',
}: {
  items: GalleryItemSlot[];
  state?: SectionDataState;
}) {
  const emberVisual = getImageSlot('hero_signboard_visual', '16x9');
  const [activeRitual, setActiveRitual] = React.useState(0);

  const rituals = [
    {
      label: 'Intimate Tastings',
      blurb:
        'Here, guests gather for quiet rituals — private tastings, artisanal pours, and whispered conversations under warm amber light.',
    },
    {
      label: 'Artisanal Cocktails',
      blurb:
        'Botanical infusions, smoked spices, and signature evening pours crafted at our newly opened Viman Nagar bar.',
    },
    {
      label: 'Moonlit Dessert Pairings',
      blurb:
        'Indulgent late-evening desserts paired with espresso infusions and warm outdoor patio breezes.',
    },
    {
      label: 'Private Family Dinners',
      blurb:
        'Long teakwood tables reserved for multi-generational celebrations, complete with valet parking and bespoke menus.',
    },
    {
      label: 'Vinyl & Acoustic Evenings',
      blurb:
        'Curated acoustic soundscapes that let conversation linger effortlessly from dusk until midnight.',
    },
    {
      label: 'Candle Ceremonies',
      blurb:
        'Soft amber table lamps and warm shadows that transform dinner into an unhurried nocturnal sanctuary.',
    },
    {
      label: "The Chef's Course",
      blurb:
        'A multi-cuisine tasting journey spanning Maharashtrian heritage handis, mushroom crostinis, and wood-fired classics.',
    },
  ];

  return (
    <section className="relative w-full min-h-[82dvh] bg-bg overflow-hidden flex items-center py-20 sm:py-28">
      {/* Full-Bleed Bokeh Portrait/Interior Photo Fading into Pitch Black */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={emberVisual.src}
          alt={emberVisual.alt}
          fill
          sizes="100vw"
          className="object-cover object-center opacity-55 scale-105 animate-signboard-breathe"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 48% 45%, rgba(223, 141, 68, 0.16) 0%, rgba(7, 7, 8, 0.62) 54%, #070708 92%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg/90"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[60dvh]">
          {/* Left 4 Cols: Vertical Hollow-Circle Rituals List */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <ul className="relative space-y-5 pl-1">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-white/10"
              />
              {rituals.map((item, idx) => {
                const isSelected = idx === activeRitual;
                return (
                  <li key={item.label} className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveRitual(idx)}
                      onClick={() => setActiveRitual(idx)}
                      className={`group inline-flex items-center gap-4 text-left transition-colors ${
                        isSelected ? 'text-text' : 'text-text/65 hover:text-text'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`w-2 h-2 rounded-full border transition-colors shrink-0 ${
                          isSelected
                            ? 'border-gold bg-gold shadow-gold-glow'
                            : 'border-white/55 bg-bg group-hover:border-gold'
                        }`}
                      />
                      <span className="font-serif text-sm sm:text-base tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right 8 Cols: Giant Offset Serif Title ("The Ember / Room") + Bottom-Right Copy & CTA */}
          <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-start lg:items-end justify-between min-h-[52dvh] gap-12">
            <div className="lg:text-right w-full">
              <h2 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[88px] text-text leading-[0.94] tracking-[-0.02em]">
                <span className="block">The Ember</span>
                <span className="block pl-16 sm:pl-28 lg:pl-0">
                  R<span className="tracking-[-0.06em]">oo</span>m
                </span>
              </h2>
            </div>

            <div className="lg:max-w-xs space-y-6 lg:mr-6">
              <p
                key={activeRitual}
                className="animate-menu-switch text-xs sm:text-[13px] text-text/80 leading-relaxed"
              >
                {rituals[activeRitual]?.blurb}
              </p>
              <NocturneArrowCta href="/reserve" label="BOOK A ROOM" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 4. "TONIGHT'S SPECIAL" — HOVER-REVEAL PORTRAIT CARDS (Video 00:08 – 00:10):
 * - Giant offset ember-copper-gold gradient serif heading ("Tonight's / Special") + compact side paragraph.
 * - 4 tall portrait cards (`aspect-[3/4]`):
 *   - Cards 1–3 are sleek dark monoliths where hovering/focusing reveals the circular plated dish in the center!
 *   - Card 4 is the fluted amber "✦ Unlocked after 12:00pm — Chef's Secret Plate".
 * - Centered "LEARN MORE (→)" CTA underneath.
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
  const [hoveredId, setHoveredId] = React.useState<string | null>(items[0]?.id ?? null);

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
        <h2 className="font-serif font-normal text-5xl sm:text-6xl lg:text-[76px] leading-[0.95] tracking-[-0.02em] text-ember-gradient shrink-0">
          <span className="block">Tonight&apos;s</span>
          <span className="block pl-12 sm:pl-20">Special</span>
        </h2>

        <p className="text-xs sm:text-[13px] text-muted/85 max-w-[260px] leading-relaxed pb-1">
          Small plates designed to awaken the senses. Each dish combines warmth, contrast, and texture, setting the tone for the meal ahead.
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
              const img = getImageSlot(dish.imageSlot, '1x1');
              const isRevealed = hoveredId === dish.id;
              return (
                <div
                  key={dish.id}
                  onMouseEnter={() => setHoveredId(dish.id)}
                  onFocus={() => setHoveredId(dish.id)}
                  onClick={() => handleQuickAdd(dish)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleQuickAdd(dish);
                    }
                  }}
                  className="group relative aspect-[3/4] rounded-xs border border-white/10 hover:border-white/25 bg-[#0A0A0B] overflow-hidden flex flex-col justify-between p-6 cursor-pointer transition-all duration-500"
                >
                  {/* Top Subtle Price & Quick Add on Hover */}
                  <div
                    className={`relative z-10 flex items-center justify-between text-[11px] transition-opacity duration-500 ${
                      isRevealed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <span className="font-mono text-gold">{formatPriceToken(dish.price)}</span>
                    <span className="uppercase tracking-widest text-[10px] text-text/75 group-hover:text-gold">
                      + Add to Bag
                    </span>
                  </div>

                  {/* Center Circular Plated Dish Photo — Materializes Smoothly on Hover (Video 00:08 -> 00:10) */}
                  <div className="relative z-10 my-auto flex items-center justify-center">
                    <div
                      className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 ease-out ${
                        isRevealed
                          ? 'opacity-100 scale-100 translate-y-0'
                          : 'opacity-0 scale-90 translate-y-3 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={dish.name}
                        fill
                        sizes="220px"
                        className="object-cover object-center"
                      />
                    </div>
                  </div>

                  {/* Bottom Centered Serif Dish Title */}
                  <div className="relative z-10 text-center">
                    <h3 className="font-serif text-sm sm:text-base text-text group-hover:text-gold transition-colors">
                      {dish.name}
                    </h3>
                  </div>
                </div>
              );
            })}

            {/* 4th Card: "♦ Unlocked after 12:00pm — Chef's Secret Plate" with Fluted Amber Ribs */}
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
                className="group relative aspect-[3/4] rounded-xs border border-gold/25 hover:border-gold/60 bg-ember-fluted overflow-hidden flex flex-col justify-between p-6 cursor-pointer transition-all duration-500"
              >
                <div className="relative z-10 flex items-center gap-2 text-[11px] text-text/90">
                  <span aria-hidden="true" className="text-gold text-xs">
                    ✦
                  </span>
                  <span>Unlocked after 12:00pm</span>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 inset-y-12 rounded-full bg-gold/10 blur-2xl group-hover:bg-gold/20 transition-all duration-700"
                />

                <div className="relative z-10 text-center">
                  <h3 className="font-serif text-sm sm:text-base text-text group-hover:text-gold transition-colors">
                    Chef&apos;s Secret Plate
                  </h3>
                </div>
              </div>
            )}
          </div>

          {/* Centered "LEARN MORE (→)" CTA */}
          <div className="mt-12 flex justify-center">
            <NocturneArrowCta href="/menu" label="LEARN MORE" />
          </div>
        </>
      )}
    </Section>
  );
}

/**
 * 5. "BOOK A TABLE" CINEMATIC FLAME BANNER + 4-COLUMN HORIZONTAL RESERVATION BAR (Video 00:11 – 00:12):
 * - Wide dramatic culinary banner with "Book A Table" display serif heading at top-left.
 * - Directly attached 4-column interactive horizontal booking bar (`Seats`, `Date`, `Time`, `BOOK A TABLE (→)`).
 */
export function HoursAndLocationSection({
  hours: _hours,
  state = 'ready',
}: {
  hours: OpeningHourSlot[];
  state?: SectionDataState;
}) {
  const bannerVisual = getImageSlot('khandeshi_mutton_handi', '16x9');
  const [guests, setGuests] = React.useState('2 PERSONS');
  const [dateVal, setDateVal] = React.useState('2026-11-10');
  const [timeSlot, setTimeSlot] = React.useState('08:00 PM');

  return (
    <Section variant="dark" className="py-12 sm:py-20">
      {state === 'loading' && <SkeletonLoader lines={5} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && (
        <div className="space-y-16">
          {/* Cinematic "Book A Table" Banner + Attached 4-Column Booking Strip (Video 00:11–00:12) */}
          <div className="border border-white/10 bg-[#09090A] overflow-hidden">
            {/* Top Culinary Flame Banner */}
            <div className="relative min-h-[300px] sm:min-h-[400px] w-full overflow-hidden flex items-start p-6 sm:p-12">
              <Image
                src={bannerVisual.src}
                alt="Flame-seared culinary craft at Saanjh"
                fill
                sizes="100vw"
                className="object-cover object-center opacity-65"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/35 to-bg/80"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#09090A] via-transparent to-bg/60"
              />

              <h2 className="relative z-10 font-serif font-normal text-4xl sm:text-6xl lg:text-7xl text-text tracking-[-0.02em]">
                Book A Table
              </h2>
            </div>

            {/* Attached 4-Column Horizontal Reservation Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/15 divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-[#09090A]">
              {/* Col 1: Guests */}
              <label className="p-5 sm:px-7 flex flex-col justify-center gap-1.5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                <span className="text-[11px] text-muted">Seats</span>
                <div className="flex items-center justify-between gap-2">
                  <select
                    aria-label="Select number of guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm uppercase tracking-wider text-text focus:outline-none cursor-pointer"
                  >
                    <option value="1 PERSON" className="bg-bg text-text">1 PERSON</option>
                    <option value="2 PERSONS" className="bg-bg text-text">2 PERSONS</option>
                    <option value="4 PERSONS" className="bg-bg text-text">4 PERSONS</option>
                    <option value="6 PERSONS" className="bg-bg text-text">6 PERSONS</option>
                    <option value="8+ GROUP" className="bg-bg text-text">8+ GROUP</option>
                  </select>
                </div>
              </label>

              {/* Col 2: Date */}
              <label className="p-5 sm:px-7 flex flex-col justify-center gap-1.5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                <span className="text-[11px] text-muted">Date</span>
                <input
                  type="date"
                  aria-label="Select reservation date"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm uppercase tracking-wider text-text focus:outline-none cursor-pointer"
                />
              </label>

              {/* Col 3: Time */}
              <label className="p-5 sm:px-7 flex flex-col justify-center gap-1.5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                <span className="text-[11px] text-muted">Time</span>
                <select
                  aria-label="Select reservation time"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm uppercase tracking-wider text-text focus:outline-none cursor-pointer"
                >
                  <option value="12:30 PM" className="bg-bg text-text">12:30 PM (LUNCH 10% OFF)</option>
                  <option value="02:00 PM" className="bg-bg text-text">02:00 PM (LUNCH 10% OFF)</option>
                  <option value="07:30 PM" className="bg-bg text-text">07:30 PM</option>
                  <option value="08:00 PM" className="bg-bg text-text">08:00 PM</option>
                  <option value="09:00 PM" className="bg-bg text-text">09:00 PM</option>
                  <option value="10:30 PM" className="bg-bg text-text">10:30 PM</option>
                </select>
              </label>

              {/* Col 4: BOOK A TABLE (→) */}
              <div className="p-5 sm:px-7 flex items-center justify-between sm:justify-center bg-white/[0.01]">
                <NocturneArrowCta href="/reserve" label="BOOK A TABLE" />
              </div>
            </div>
          </div>

          {/* Compact Viman Nagar Sanctuary Map & Directions Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
                CLOVER PARK · OPPOSITE PHOENIX MARKETCITY
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-text">
                {t('home.location.heading')}
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Open daily 12:00 PM – 12:00 Midnight · Flat 10% Off Walk-In Lunch (12–4 PM) · Valet Parking · Direct Desk: {t('brand.phone_display')}
              </p>
            </div>
            <div className="lg:col-span-7">
              <MapEmbed slotName="Clover Park, Viman Nagar" />
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * 6. "REAL EXPERIENCE" — EDITORIAL SPLIT PORTRAIT TESTIMONIAL CAROUSEL (Video 00:13 – 00:15):
 * - Left: Glowing amber orb at top-left, "5:" above 5 stars, large editorial quote, author attribution,
 *   and bottom circular `( ← )` `( → )` navigation buttons + auto-rotation.
 * - Right: Giant stacked offset serif heading ("Real / Experience") overlapping the top-right of a tall candlelit portrait photo.
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

  const portraitSlots = [
    'warm_wooden_family_dining',
    'newly_opened_bar',
    'lush_green_outdoor_patio',
    'hero_signboard_visual',
  ];

  React.useEffect(() => {
    if (paused || total <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [paused, total]);

  const activeReview = reviews[activeIndex] ?? reviews[0];
  const activePortrait = getImageSlot(
    portraitSlots[activeIndex % portraitSlots.length] ?? 'warm_wooden_family_dining',
    '3x4'
  );

  return (
    <Section variant="dark" className="py-20 sm:py-28 overflow-hidden">
      {state === 'loading' && <SkeletonLoader lines={4} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && activeReview && (
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Real Guest Experiences"
          className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center"
        >
          {/* Left 6 Cols: Glowing Orb + Rating + Quote + Circular Prev/Next Buttons */}
          <div className="lg:col-span-6 relative space-y-8">
            {/* Top-Left Glowing Warm Amber Orb (Video 00:13) */}
            <div className="-ml-10 -mt-10 mb-2">
              <NocturneAmberOrb />
            </div>

            <div key={activeReview.id} className="animate-menu-switch space-y-6 max-w-lg">
              <div className="space-y-1.5">
                <p className="text-sm font-sans text-text">{activeReview.rating}:</p>
                <RatingStars rating={activeReview.rating} />
              </div>

              <blockquote className="font-sans font-light text-lg sm:text-xl lg:text-[22px] text-text leading-relaxed">
                &ldquo;{activeReview.comment}&rdquo;
              </blockquote>

              <p className="text-xs text-muted tracking-wide pt-1">
                — {activeReview.reviewerName} · {activeReview.dateLabel}
              </p>
            </div>

            {/* Bottom-Left Circular Prev / Next Arrow Buttons (Video 00:13–00:15) */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                aria-label="Previous experience"
                onClick={() => setActiveIndex((prev) => (prev - 1 + total) % total)}
                className="w-10 h-10 rounded-full border border-white/15 hover:border-gold text-text/80 hover:text-gold inline-flex items-center justify-center transition-all active:scale-95"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next experience"
                onClick={() => setActiveIndex((prev) => (prev + 1) % total)}
                className="w-10 h-10 rounded-full border border-white/15 hover:border-gold text-text/80 hover:text-gold inline-flex items-center justify-center transition-all active:scale-95"
              >
                →
              </button>
            </div>
          </div>

          {/* Right 6 Cols: Overlapping "Real / Experience" Serif Heading + Tall Candlelit Portrait Image */}
          <div className="lg:col-span-6 relative pt-10 sm:pt-14">
            {/* Overlapping Giant Stacked Serif Heading (Top-Right) */}
            <h2 className="relative z-20 font-serif font-normal text-5xl sm:text-6xl lg:text-[76px] text-text leading-[0.94] tracking-[-0.02em] text-right mb-[-28px] sm:mb-[-38px] pr-2">
              <span className="block">Real</span>
              <span className="block">Experience</span>
            </h2>

            {/* Tall Portrait Image Frame */}
            <div
              key={activePortrait.src}
              className="animate-menu-switch relative aspect-[4/5] w-full max-w-md ml-auto overflow-hidden rounded-xs border border-white/10 bg-surface"
            >
              <Image
                src={activePortrait.src}
                alt={activePortrait.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-bg/30"
              />
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * 7. OFFERS & HAPPY HOURS TEASER (Preserved for Offers / Inner flows):
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
 * 8. DUAL CTA BAND
 */
export function DualCtaBandSection() {
  return (
    <Section variant="dark" className="border-t border-white/10">
      <div className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl min-w-0">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ember-gradient">
            {t('home.cta_band.heading')}
          </h2>
          <p className="text-sm text-muted leading-relaxed">{t('home.cta_band.subtext')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 shrink-0">
          <NocturneArrowCta href="/reserve" label="BOOK A TABLE" size="lg" />
          <NocturneArrowCta href="/order" label="ORDER ONLINE" size="lg" />
        </div>
      </div>
    </Section>
  );
}
