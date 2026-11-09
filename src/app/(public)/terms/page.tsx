import React from 'react';
import { t } from '@/lib/content';
import { Card, GoldDivider, Section } from '@/components/ui';

/**
 * Terms and Conditions Page (`/terms`, PRD 7.8 & 12.5).
 */
export default function TermsPage() {
  return (
    <Section variant="dark" narrow>
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Saanjh Viman Nagar · Legal</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
          {t('legal.terms.heading')}
        </h1>
        <GoldDivider ornament={false} />
        <Card variant="surface" className="space-y-4 text-sm text-muted leading-relaxed">
          <p>{t('legal.terms.body')}</p>
          <h2 className="font-serif text-xl text-text pt-2">
            Cancellation & Refund Policy
          </h2>
          <p>
            Table reservations may be modified or cancelled free of charge up to 1 hour prior to your slot. Online orders cancelled before kitchen preparation begins are eligible for a full refund to the original payment source within 5–7 business days.
          </p>
          <h2 className="font-serif text-xl text-text pt-2">
            Allergen & Dietary Notice
          </h2>
          <p>{t('menu.allergen.disclaimer')}</p>
        </Card>
      </div>
    </Section>
  );
}

