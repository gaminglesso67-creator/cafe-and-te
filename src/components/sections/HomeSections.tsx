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
  Card,
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
  const { isOpen, todaySlot } = getLiveOpenStatus(hours);

  return (
    <Section variant="dark" className="relative overflow-hidden pt-8 pb-14 md:py-20">
      {/* Radial gold signboard wash at top (PRD 5.3) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-glow-hero"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left 7 Cols: Lit Signboard Frame */}
        <div className="lg:col-span-7">
          <Card variant="signboard" className="p-6 sm:p-9 md:p-11">
            {/* Top Status & Eyebrow Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-gold/25">
              <span className="text-xs uppercase tracking-[0.22em] text-gold font-medium">
                {t('home.hero.eyebrow')}
              </span>
              <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs uppercase tracking-wider rounded-xs border border-gold/35 bg-surface text-text">
                <span
                  aria-hidden="true"
                  className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-crimson'}`}
                />
                <span>
                  {isOpen ? t('home.hours.status_open') : t('home.hours.status_closed')}
                </span>
                {todaySlot && (
                  <span className="text-muted font-mono">
                    ({todaySlot.openTime}–{todaySlot.closeTime})
                  </span>
                )}
              </span>
            </div>

            {/* Glowing Calligraphic Heading (PRD 5.3) */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-gold text-glow-gold tracking-wide leading-[1.08] mb-4">
              {t('home.hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-xl mb-8 leading-relaxed">
              {t('home.hero.tagline')}
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
              <Button variant="primary" size="lg" href="/order">
                {t('home.hero.cta_order')}
              </Button>
              <Button variant="secondary" size="lg" href="/reserve">
                {t('home.hero.cta_reserve')}
              </Button>
            </div>

            {/* Direct Phone & WhatsApp Strip */}
            <div className="mt-8 pt-5 border-t border-gold/20 flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
              <a
                href={t('brand.phone_href')}
                className="min-h-11 inline-flex items-center gap-2 text-text hover:text-gold"
              >
                <span className="text-gold uppercase tracking-wider">{'{{CALL_DIRECT}}:'}</span>
                <span className="font-mono underline underline-offset-4">
                  {t('brand.phone_display')}
                </span>
              </a>
              <span className="font-mono uppercase tracking-widest text-gold/80">
                {t('brand.address_line1')}
              </span>
            </div>
          </Card>
        </div>

        {/* Right 5 Cols: Offset Editorial Visual Frame */}
        <div className="lg:col-span-5 relative">
          <div className="p-2 border border-gold/35 bg-surface rounded-xs">
            <ImageWithOverlay
              slot="hero_signboard_visual"
              aspect="4x3"
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="pt-3 px-2 pb-1 flex items-center justify-between gap-2 text-xs text-muted">
              <span className="font-serif italic text-text text-sm">
                {t('home.hero.frame_caption')}
              </span>
              <span className="font-mono text-[11px] text-gold">{'{{HERO_MEDIA_SLOT}}'}</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * 2. OPENING HOURS & LOCATION LEDGER BLOCK (PRD 7.1):
 * Data-driven live open/closed hours paired with address, tap-to-call, and mini-map.
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
    <Section variant="surface" className="border-y border-gold/25">
      {state === 'loading' && <SkeletonLoader lines={5} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left 5 cols: Opening Hours Ledger */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-gold/25 pb-3">
              <h2 className="font-serif text-2xl sm:text-3xl text-text">
                {t('home.hours.heading')}
              </h2>
              <Badge
                kind={isOpen ? 'veg' : 'out_of_stock'}
                label={isOpen ? t('home.hours.status_open') : t('home.hours.status_closed')}
              />
            </div>

            <dl className="divide-y divide-gold/15 border border-gold/25 rounded-xs bg-bg p-4">
              {hours.map((slot) => (
                <div
                  key={slot.id}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-sm"
                >
                  <dt className="text-muted font-medium">{slot.dayLabel}</dt>
                  <dd className="font-mono text-text">
                    {slot.isClosed ? '{{CLOSED}}' : `${slot.openTime} – ${slot.closeTime}`}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button variant="secondary" size="sm" href={t('brand.phone_href')}>
                {t('brand.phone_display')}
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

          {/* Right 7 cols: Location & Mini-Map */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border-b border-gold/25 pb-3 flex items-center justify-between">
              <h2 className="font-serif text-2xl sm:text-3xl text-text">
                {t('home.location.heading')}
              </h2>
              <span className="text-xs font-mono uppercase tracking-widest text-gold">
                {'{{NAP_LOCAL_SEO_SLOT}}'}
              </span>
            </div>
            <MapEmbed slotName="home_location_minimap" />
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * 3. HIGHLIGHTS STRIP — SIGNATURE DISHES (PRD 7.1):
 * Editorial printed-menu layout: 1 featured lead plate on the left + 3 horizontal menu ledger rows on the right.
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
    notify(`${item.name} — {{ADDED_TO_CART}}`, 'success');
    openSheet();
  };

  const leadItem = items[0];
  const ledgerItems = items.slice(1, 4);

  return (
    <Section variant="dark">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold mb-2">
            {t('home.highlights.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-text">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 5 Cols: Lead Signature Plate */}
          <Card variant="surface" padded={false} className="lg:col-span-5 flex flex-col overflow-hidden">
            <ImageWithOverlay slot={leadItem.imageSlot} aspect="4x3" />
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge kind={leadItem.isVeg ? 'veg' : 'non_veg'} />
                  {leadItem.isSignature && <Badge kind="chefs_special" />}
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-2xl text-text">{leadItem.name}</h3>
                  <span className="font-mono text-base font-semibold text-gold shrink-0">
                    {formatPriceToken(leadItem.price)}
                  </span>
                </div>
                <p className="text-sm text-muted">{leadItem.description}</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => handleQuickAdd(leadItem)}
              >
                + {t('menu.item.add_cta')}
              </Button>
            </div>
          </Card>

          {/* Right 7 Cols: Editorial Printed-Menu Ledger Rows */}
          <div className="lg:col-span-7 flex flex-col justify-between divide-y divide-gold/20 border-y border-gold/25">
            {ledgerItems.map((dish) => (
              <article
                key={dish.id}
                className="py-5 first:pt-4 last:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-24 sm:w-28 shrink-0">
                    <ImageWithOverlay slot={dish.imageSlot} aspect="1x1" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge kind={dish.isVeg ? 'veg' : 'non_veg'} />
                      {dish.isSignature && <Badge kind="chefs_special" />}
                      {dish.isNew && <Badge kind="new" />}
                    </div>
                    <h3 className="font-serif text-xl text-text">{dish.name}</h3>
                    <p className="text-sm text-muted line-clamp-2">{dish.description}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 border-t sm:border-t-0 border-gold/15 pt-3 sm:pt-0">
                  <span className="font-mono text-base font-semibold text-gold">
                    {formatPriceToken(dish.price)}
                  </span>
                  <Button variant="secondary" size="sm" onClick={() => handleQuickAdd(dish)}>
                    + {t('menu.item.add_cta')}
                  </Button>
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
 * Never uses gold text on cream.
 */
export function AboutTeaserSection() {
  return (
    <Section variant="cream" className="border-y border-charcoal/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-charcoal/70 font-semibold">
            {t('home.about.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal leading-tight">
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
        <div className="lg:col-span-6">
          <div className="p-2 border border-charcoal/25 bg-charcoal">
            <ImageWithOverlay slot="home_about_story" aspect="16x9" />
          </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * 5. OFFERS & HAPPY HOURS TEASER (PRD 7.1 & 5.5):
 * Uses Crimson (#B3202A) for seasonal/highlight tags.
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold mb-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} variant="dark" className="flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge kind="offer" label={offer.badgeText} />
                  <span className="font-mono text-xs text-gold border border-gold/35 px-2 py-0.5 rounded-xs">
                    {`{{CODE:${offer.code}}}`}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-text">{offer.title}</h3>
                <p className="text-sm text-muted">{offer.description}</p>
              </div>
              <div className="pt-4 border-t border-gold/20 flex items-center justify-between gap-3 text-xs text-muted">
                <span>
                  {offer.validFrom} → {offer.validUntil}
                </span>
                <Button variant="ghost" size="sm" href="/offers">
                  {t('home.offers.cta')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}

/**
 * 6. REVIEWS TEASER (PRD 7.1 & 7.5):
 * Displays Google and manually-curated testimonial slots with thin-line gold RatingStars.
 */
export function ReviewsTeaserSection({
  reviews,
  state = 'ready',
}: {
  reviews: ReviewSlot[];
  state?: SectionDataState;
}) {
  return (
    <Section variant="dark" className="border-t border-gold/20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold mb-2">
            {t('home.reviews.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-text">
            {t('home.reviews.heading')}
          </h2>
        </div>
        <Button variant="secondary" size="sm" href="/reviews">
          {t('home.reviews.cta')}
        </Button>
      </div>

      {state === 'loading' && <SkeletonLoader lines={4} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' && <EmptyState />}
      {state === 'ready' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {reviews.slice(0, 3).map((rev, index) => (
            <Card
              key={rev.id}
              variant="surface"
              className={
                index === 0
                  ? 'md:col-span-6 flex flex-col justify-between gap-4'
                  : 'md:col-span-3 flex flex-col justify-between gap-4'
              }
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <RatingStars rating={rev.rating} />
                  <Badge kind="neutral" label={`{{SOURCE_${rev.source}}}`} />
                </div>
                <blockquote className="font-serif italic text-lg text-text leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </blockquote>
              </div>
              <footer className="pt-3 border-t border-gold/15 flex items-center justify-between text-xs text-muted">
                <span className="font-medium text-text">{rev.reviewerName}</span>
                <span>{rev.dateLabel}</span>
              </footer>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}

/**
 * 7. GALLERY TEASER (PRD 7.1 & 7.4):
 * Asymmetric editorial mosaic with aspect-ratio placeholder slots.
 */
export function GalleryTeaserSection({
  items,
  state = 'ready',
}: {
  items: GalleryItemSlot[];
  state?: SectionDataState;
}) {
  return (
    <Section variant="surface" className="border-t border-gold/20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold mb-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <ImageWithOverlay slot={items[1]?.imageSlot ?? 'gallery_1'} aspect="16x9" />
          </div>
          <div className="lg:col-span-5">
            <ImageWithOverlay slot={items[0]?.imageSlot ?? 'gallery_2'} aspect="4x3" />
          </div>
          <div className="lg:col-span-4">
            <ImageWithOverlay slot={items[2]?.imageSlot ?? 'gallery_3'} aspect="1x1" />
          </div>
          <div className="lg:col-span-8">
            <ImageWithOverlay slot={items[4]?.imageSlot ?? 'gallery_4'} aspect="16x9" />
          </div>
        </div>
      )}
    </Section>
  );
}

/**
 * 8. RESERVATION & ORDER CTA BAND (PRD 7.1):
 * Framed signboard callout closing the page before the footer.
 */
export function DualCtaBandSection() {
  return (
    <Section variant="dark" className="border-t border-gold/25">
      <Card variant="signboard" className="p-6 sm:p-10 md:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-serif text-3xl sm:text-4xl text-gold text-glow-gold">
              {t('home.cta_band.heading')}
            </h2>
            <p className="text-base text-muted">{t('home.cta_band.subtext')}</p>
          </div>
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 shrink-0">
            <Button variant="primary" size="lg" href="/reserve">
              {t('home.cta_band.reserve')}
            </Button>
            <Button variant="secondary" size="lg" href="/order">
              {t('home.cta_band.order')}
            </Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}

