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
        <p className="text-xs uppercase tracking-[0.22em] text-gold">{'{{LEGAL_DOCUMENT_SLOT}}'}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
          {t('legal.terms.heading')}
        </h1>
        <GoldDivider ornament={false} />
        <Card variant="surface" className="space-y-4 text-sm text-muted leading-relaxed">
          <p>{t('legal.terms.body')}</p>
          <h2 className="font-serif text-xl text-text pt-2">
            {'{{REFUND_AND_CANCELLATION_HEADING}}'}
          </h2>
          <p>{'{{REFUND_AND_CANCELLATION_POLICY_SLOT}}'}</p>
          <h2 className="font-serif text-xl text-text pt-2">
            {'{{ALLERGEN_AND_DIETARY_DISCLAIMER_HEADING}}'}
          </h2>
          <p>{t('menu.allergen.disclaimer')}</p>
        </Card>
      </div>
    </Section>
  );
}

