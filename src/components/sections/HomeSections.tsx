'use client';

import React from 'react';
import { formatPriceToken, t } from '@/lib/content';
import {
  GalleryItemSlot,
  getLiveOpenStatus,
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
 * 1. HERO SECTION (PRD 7.1 & Brand Rules):
 * Asymmetric signboard composition with ornamental double-hairline frame,
 * radial gold wash (`--glow-hero`), glowing serif display heading, and framed visual slot.
 */
export function HeroSignboardSection({ hours }: { hours: OpeningHourSlot[] }) {
  const { isOpen } = getLiveOpenStatus(hours);

  return (
    <Section
      variant="dark"
      className="relative overflow-hidden min-h-[calc(100dvh-6rem)] flex items-center py-10 sm:py-14 lg:py-16"
    >
      {/* Radial gold signboard wash at top (PRD 5.3) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-glow-hero animate-signboard-breathe"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left 6 Cols: Open Editorial Typography & Signboard Glow */}
        <div className="lg:col-span-6 min-w-0 space-y-6">
          <div className="animate-reveal-1 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-gold/90">
            <span>{t('home.hero.eyebrow')}</span>
            <span aria-hidden="true" className="text-gold/40">·</span>
            <span className="inline-flex items-center gap-2 text-text/80">
              <span className="relative flex h-2 w-2 shrink-0">
                {isOpen && (
                  <span
                    aria-hidden="true"
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOpen ? 'bg-emerald-400' : 'bg-crimson'
                  }`}
                />
              </span>
              <span>{isOpen ? 'Open Today · 12 PM – 12 Midnight' : t('home.hours.status_closed')}</span>
            </span>
          </div>

          <h1 className="animate-reveal-1 font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-gold text-glow-gold tracking-wide leading-[1.08] break-words">
            {t('home.hero.title')}
          </h1>

          <p className="animate-reveal-2 text-base sm:text-lg text-muted max-w-xl leading-relaxed break-words">
            {t('home.hero.tagline')}
          </p>

          {/* Primary CTAs */}
          <div className="animate-reveal-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Button variant="primary" size="lg" href="/order">
              {t('home.hero.cta_order')}
            </Button>
            <Button variant="secondary" size="lg" href="/reserve">
              {t('home.hero.cta_reserve')}
            </Button>
          </div>

          {/* Subtle Inline Concierge & Location Line */}
          <div className="animate-reveal-3 pt-4 border-t border-gold/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
            <a
              href={t('brand.phone_href')}
              className="min-h-11 inline-flex items-center gap-2 text-text hover:text-gold transition-colors"
            >
              <span className="text-gold uppercase tracking-wider">Reservations:</span>
              <span className="underline underline-offset-4">{t('brand.phone_display')}</span>
            </a>
            <span className="text-muted/80">
              Clover Park, Viman Nagar (Opp. Phoenix Marketcity)
            </span>
          </div>
        </div>

        {/* Right 6 Cols: Clean Frameless Hero Photograph */}
        <div className="animate-reveal-3 lg:col-span-6 min-w-0">
          <ImageWithOverlay
            slot="hero_signboard_visual"
            aspect="4x3"
            priority
            overlay={false}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="shadow-gold-glow"
          />
          <p className="mt-3 font-serif italic text-muted text-sm text-right">
            {t('home.hero.frame_caption')}
          </p>
        </div>
      </div>
    </Section>
  );
}

/**
 * 2. OPENING HOURS & LOCATION LEDGER BLOCK (PRD 7.1):
 * Spacious, un-boxed hours summary paired with interactive Google Map.
 */
export function HoursAndLocationSection({
  hours,
  state = 'ready',
}: {
  hours: OpeningHourSlot[];
  state?: SectionDataState;
}) {
  const { isOpen } = getLiveOpenStatus(hours);

  return (
    <Section variant="surface" className="border-y border-gold/15">
      {state === 'loading' && <SkeletonLoader lines={5} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left 5 cols: Concise Editorial Hours & Amenities */}
          <div className="lg:col-span-5 min-w-0 space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                {isOpen ? t('home.hours.status_open') : t('home.hours.status_closed')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-text">
                {t('home.hours.heading')}
              </h2>
            </div>

            <dl className="divide-y divide-gold/15 border-y border-gold/20 text-sm">
              <div className="py-4 flex items-baseline justify-between gap-4">
                <dt className="text-text font-medium">Monday – Sunday (All Days)</dt>
                <dd className="text-gold font-medium">12:00 PM – 12:00 Midnight</dd>
              </div>
              <div className="py-4 flex items-baseline justify-between gap-4">
                <dt className="text-muted">Walk-In Lunch Privilege</dt>
                <dd className="text-text">12:00 PM – 4:00 PM (Flat 10% OFF)</dd>
              </div>
              <div className="py-4 flex items-baseline justify-between gap-4">
                <dt className="text-muted">Newly Opened Bar & Patio</dt>
                <dd className="text-text">12:00 PM – 12:00 Midnight</dd>
              </div>
              <div className="py-4 flex items-baseline justify-between gap-4">
                <dt className="text-muted">Guest Facilities</dt>
                <dd className="text-text">Valet Parking · Wheelchair Accessible</dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button variant="secondary" size="sm" href={t('brand.phone_href')}>
                Call {t('brand.phone_display')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                href={`https://wa.me/${t('brand.whatsapp_number')}`}
                external
              >
                {t('global.whatsapp.label')}
              </Button>
            </div>
          </div>

          {/* Right 7 cols: Interactive Map & Directions */}
          <div className="lg:col-span-7 min-w-0 space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                Opposite Phoenix Marketcity
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-text">
                {t('home.location.heading')}
              </h2>
            </div>
            <MapEmbed slotName="Clover Park, Viman Nagar" />
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * 3. HIGHLIGHTS STRIP — SIGNATURE DISHES (PRD 7.1):
 * Open editorial printed-menu layout without heavy outer cards.
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

  const leadItem = items[0];
  const ledgerItems = items.slice(1, 5);

  return (
    <Section variant="dark">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            {t('home.highlights.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text">
            {t('home.highlights.heading')}
          </h2>
        </div>
        <Button variant="secondary" size="sm" href="/menu">
          {t('home.highlights.cta_all')}
        </Button>
      </div>

      {state === 'loading' && <SkeletonLoader lines={6} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState actionLabel={t('global.nav.menu')} actionHref="/menu" />}
      {state === 'ready' && leadItem && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left 5 Cols: Lead Signature Plate (Open Editorial Presentation) */}
          <div className="lg:col-span-5 min-w-0 space-y-4">
            <ImageWithOverlay slot={leadItem.imageSlot} aspect="4x3" overlay={false} />
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5">
                <Badge kind={leadItem.isVeg ? 'veg' : 'non_veg'} />
                {leadItem.isSignature && <Badge kind="chefs_special" />}
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl sm:text-3xl text-text">{leadItem.name}</h3>
                <span className="font-serif text-xl font-semibold text-gold shrink-0">
                  {formatPriceToken(leadItem.price)}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{leadItem.description}</p>
              <div className="pt-2">
                <Button variant="primary" size="sm" onClick={() => handleQuickAdd(leadItem)}>
                  + {t('menu.item.add_cta')}
                </Button>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Clean Fine-Dining Printed Menu Ledger */}
          <div className="lg:col-span-7 min-w-0 divide-y divide-gold/15 border-y border-gold/20">
            {ledgerItems.map((dish) => (
              <article
                key={dish.id}
                className="group py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-20 sm:w-24 shrink-0">
                    <ImageWithOverlay slot={dish.imageSlot} aspect="4x3" overlay={false} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge kind={dish.isVeg ? 'veg' : 'non_veg'} />
                      <h3 className="font-serif text-xl sm:text-2xl text-text transition-all duration-300 group-hover:text-gold group-hover:translate-x-1">
                        {dish.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pl-24 sm:pl-0">
                  <span className="font-serif text-lg font-semibold text-gold">
                    {formatPriceToken(dish.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(dish)}
                    className="min-h-10 px-3 py-1 text-xs uppercase tracking-wider text-gold border border-gold/30 hover:border-gold hover:bg-gold/10 active:scale-95 rounded-xs transition-all duration-200"
                  >
                    + {t('menu.item.add_cta')}
                  </button>
                </div>
              </article>
            ))}
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
