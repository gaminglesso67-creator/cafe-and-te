import React from 'react';
import { t } from '@/lib/content';
import { DualCtaBandSection } from '@/components/sections/HomeSections';
import { Card, GoldDivider, ImageWithOverlay, Section } from '@/components/ui';

/**
 * About / Story Page (PRD 7.3) populated with Saanjh Viman Nagar details:
 * - Restaurant background section
 * - Culinary philosophy & newly opened bar section
 * - Values section (Multi-generational warmth, Eclectic cuisine, Inclusive accessibility)
 * - Amenities & highlights block
 */
export default function AboutPage() {
  const values = [
    {
      id: 'val-1',
      number: '01',
      title: 'Warm Earthy Wood & Soft Amber Glow',
      body: 'True to the word Saanjh (dusk), our space blends rustic natural wooden textures with soft amber lantern light—offering both air-conditioned indoor dining and a lush green outdoor patio.',
    },
    {
      id: 'val-2',
      number: '02',
      title: 'An Eclectic Multi-Cuisine Table',
      body: 'From regional Maharashtrian specialties and Royal Dum Biryanis to signature Wild Mushroom Crostinis, Italian thin-crust pizzas, Oriental wok favourites, and our newly opened bar.',
    },
    {
      id: 'val-3',
      number: '03',
      title: 'Effortless Family & Group Hospitality',
      body: 'Designed for multi-generational families and large group celebrations opposite Phoenix Marketcity, complete with complimentary valet parking and full wheelchair accessibility.',
    },
  ];

  const milestones = [
    {
      year: 'Ambience',
      title: 'Indoor AC Dining & Lush Outdoor Patio',
      detail: 'Choose between our cosy wooden indoor dining room or our breezy green outdoor setup in Clover Park.',
    },
    {
      year: 'New Bar',
      title: 'Newly Opened Craft Bar & Botanical Mocktails',
      detail: 'Pouring signature cocktails, zero-proof botanical elixirs, and curated small plates till 12:00 Midnight.',
    },
    {
      year: 'Access',
      title: 'Valet Parking & Full Wheelchair Accessibility',
      detail: 'Step-free entrance, accessible seating, and dedicated valet service at Plot 4, Survey No. 206, Lane 2, Viman Nagar.',
    },
  ];

  return (
    <>
      {/* Editorial Header */}
      <Section variant="surface" className="pt-10 pb-12 border-b border-gold/25">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {t('about.header.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
            {t('about.header.heading')}
          </h1>
        </div>
      </Section>

      {/* 1. Restaurant Background Section */}
      <Section variant="dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-serif text-3xl text-text">{t('about.story.heading')}</h2>
            <p className="text-base text-muted leading-relaxed">{t('about.story.body_1')}</p>
            <p className="text-base text-muted leading-relaxed">{t('about.story.body_2')}</p>
          </div>
          <div className="lg:col-span-6">
            <ImageWithOverlay slot="saanjh_wooden_interiors" aspect="4x3" />
          </div>
        </div>
      </Section>

      {/* 2. Culinary Profile Section (Cream Variant — strictly charcoal text on cream) */}
      <Section variant="cream" className="border-y border-charcoal/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="p-2 border border-charcoal/30 bg-charcoal">
              <ImageWithOverlay slot="signature_mushroom_crostini_bar" aspect="3x4" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-charcoal/70 font-semibold">
              {t('about.chef.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
              {t('about.chef.name')}
            </h2>
            <GoldDivider onCream ornament={false} />
            <p className="text-base text-charcoal/85 leading-relaxed">{t('about.chef.bio')}</p>
            <p className="text-sm font-mono uppercase tracking-wider text-charcoal/70">
              Average Cost: ₹1,000 – ₹1,100 for two · Open Daily 12 Noon – 12 Midnight
            </p>
          </div>
        </div>
      </Section>

      {/* 3. Values Section (Numbered Editorial Ledger) */}
      <Section variant="surface">
        <h2 className="font-serif text-3xl sm:text-4xl text-text mb-8">
          {t('about.values.heading')}
        </h2>
        <div className="divide-y divide-gold/20 border-y border-gold/25">
          {values.map((v) => (
            <div
              key={v.id}
              className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline"
            >
              <span className="md:col-span-2 font-mono text-sm text-gold">{v.number}</span>
              <h3 className="md:col-span-4 font-serif text-2xl text-text">{v.title}</h3>
              <p className="md:col-span-6 text-sm text-muted leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Amenities & Facilities Block */}
      <Section variant="dark" className="border-t border-gold/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-serif text-3xl text-text">{t('about.milestones.heading')}</h2>
            <ImageWithOverlay slot="lush_green_outdoor_patio" aspect="16x9" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            {milestones.map((m) => (
              <Card key={m.year} variant="surface" className="flex flex-col sm:flex-row gap-4">
                <span className="font-mono text-xs uppercase text-gold shrink-0 px-2.5 py-1 border border-gold/30 rounded-xs self-start">
                  {m.year}
                </span>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-text">{m.title}</h3>
                  <p className="text-sm text-muted">{m.detail}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <DualCtaBandSection />
    </>
  );
}
