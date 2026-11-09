import React from 'react';
import { t } from '@/lib/content';
import { DualCtaBandSection } from '@/components/sections/HomeSections';
import { Card, GoldDivider, ImageWithOverlay, Section } from '@/components/ui';

/**
 * About / Story Page (PRD 7.3):
 * - Restaurant background section
 * - Chef profile section
 * - Values section (editorial ledger, no emoji cards)
 * - Timeline / milestones block
 * - Image-and-text alternating blocks (including Cream variant)
 * - CTA band
 */
export default function AboutPage() {
  const values = [
    { id: 'val-1', number: '01', title: '{{VALUE_1_TITLE}}', body: '{{VALUE_1_DESCRIPTION}}' },
    { id: 'val-2', number: '02', title: '{{VALUE_2_TITLE}}', body: '{{VALUE_2_DESCRIPTION}}' },
    { id: 'val-3', number: '03', title: '{{VALUE_3_TITLE}}', body: '{{VALUE_3_DESCRIPTION}}' },
  ];

  const milestones = [
    { year: '{{YEAR_1}}', title: '{{MILESTONE_1_TITLE}}', detail: '{{MILESTONE_1_DETAIL}}' },
    { year: '{{YEAR_2}}', title: '{{MILESTONE_2_TITLE}}', detail: '{{MILESTONE_2_DETAIL}}' },
    { year: '{{YEAR_3}}', title: '{{MILESTONE_3_TITLE}}', detail: '{{MILESTONE_3_DETAIL}}' },
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

      {/* 1. Restaurant Background Section (Alternating Block 1) */}
      <Section variant="dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-serif text-3xl text-text">{t('about.story.heading')}</h2>
            <p className="text-base text-muted leading-relaxed">{t('about.story.body_1')}</p>
            <p className="text-base text-muted leading-relaxed">{t('about.story.body_2')}</p>
          </div>
          <div className="lg:col-span-6">
            <ImageWithOverlay slot="about_origin_story" aspect="4x3" />
          </div>
        </div>
      </Section>

      {/* 2. Chef Profile Section (Cream Variant — strictly charcoal text on cream) */}
      <Section variant="cream" className="border-y border-charcoal/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="p-2 border border-charcoal/30 bg-charcoal">
              <ImageWithOverlay slot="about_chef_portrait" aspect="3x4" />
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
              {'{{CHEF_SIGNATURE_QUOTE_SLOT}}'}
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

      {/* 4. Timeline / Milestones Block */}
      <Section variant="dark" className="border-t border-gold/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-serif text-3xl text-text">{t('about.milestones.heading')}</h2>
            <ImageWithOverlay slot="about_ambience_detail" aspect="16x9" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            {milestones.map((m) => (
              <Card key={m.year} variant="surface" className="flex flex-col sm:flex-row gap-4">
                <span className="font-mono text-sm text-gold shrink-0 px-2.5 py-1 border border-gold/30 rounded-xs self-start">
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

