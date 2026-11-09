'use client';

import React, { useMemo, useState } from 'react';
import { t } from '@/lib/content';
import { SEED_REVIEWS } from '@/lib/seed-data';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  RatingStars,
  Section,
  Tabs,
} from '@/components/ui';

/**
 * Reviews / Testimonials Page (PRD 7.5):
 * - Source 1: pulled from Google (cached server-side slot)
 * - Source 2: added manually via admin
 * - Aggregate rating display + link to leave a Google review
 */
export default function ReviewsPage() {
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'GOOGLE' | 'MANUAL'>('ALL');

  const filtered = useMemo(() => {
    if (sourceFilter === 'ALL') return SEED_REVIEWS;
    return SEED_REVIEWS.filter((r) => r.source === sourceFilter);
  }, [sourceFilter]);

  const aggregateScore = useMemo(() => {
    if (SEED_REVIEWS.length === 0) return 5;
    const sum = SEED_REVIEWS.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / SEED_REVIEWS.length).toFixed(1));
  }, []);

  return (
    <>
      <Section variant="surface" className="pt-10 pb-10 border-b border-gold/25">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              {t('reviews.header.eyebrow')}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
              {t('reviews.header.heading')}
            </h1>
          </div>

          {/* Aggregate Rating Box */}
          <Card variant="dark" className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif text-3xl text-gold font-semibold">
                  {aggregateScore}
                </span>
                <RatingStars rating={Math.round(aggregateScore)} />
              </div>
              <p className="text-xs text-muted">{t('reviews.aggregate.label')}</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              href={t('brand.google_review_url')}
              external
            >
              {t('reviews.google.cta')}
            </Button>
          </Card>
        </div>
      </Section>

      <Section variant="dark">
        <Tabs
          items={[
            { id: 'ALL', label: t('menu.filter.all'), count: SEED_REVIEWS.length },
            {
              id: 'GOOGLE',
              label: '{{SOURCE_GOOGLE_PLACES}}',
              count: SEED_REVIEWS.filter((r) => r.source === 'GOOGLE').length,
            },
            {
              id: 'MANUAL',
              label: '{{SOURCE_CURATED_GUESTBOOK}}',
              count: SEED_REVIEWS.filter((r) => r.source === 'MANUAL').length,
            },
          ]}
          activeId={sourceFilter}
          onChange={(id) => setSourceFilter(id as typeof sourceFilter)}
          className="mb-8"
        />

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((rev) => (
              <Card
                key={rev.id}
                variant="surface"
                className="flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <RatingStars rating={rev.rating} />
                    <Badge kind="neutral" label={`{{SOURCE_${rev.source}}}`} />
                  </div>
                  <blockquote className="font-serif italic text-xl text-text leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </blockquote>
                </div>
                <footer className="pt-3 border-t border-gold/20 flex items-center justify-between text-xs text-muted">
                  <span className="font-medium text-text">{rev.reviewerName}</span>
                  <span>{rev.dateLabel}</span>
                </footer>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

