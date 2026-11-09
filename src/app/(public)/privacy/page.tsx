import React from 'react';
import { t } from '@/lib/content';
import { Card, GoldDivider, Section } from '@/components/ui';

/**
 * Privacy Policy Page (`/privacy`, PRD 7.8 & 12.5).
 */
export default function PrivacyPolicyPage() {
  return (
    <Section variant="dark" narrow>
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">{'{{LEGAL_DOCUMENT_SLOT}}'}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
          {t('legal.privacy.heading')}
        </h1>
        <GoldDivider ornament={false} />
        <Card variant="surface" className="space-y-4 text-sm text-muted leading-relaxed">
          <p>{t('legal.privacy.body')}</p>
          <h2 className="font-serif text-xl text-text pt-2">{'{{DPDP_DATA_RIGHTS_HEADING}}'}</h2>
          <p>{'{{DPDP_DATA_EXPORT_AND_DELETION_CLAUSE}}'}</p>
          <h2 className="font-serif text-xl text-text pt-2">{'{{COOKIE_RETENTION_HEADING}}'}</h2>
          <p>{'{{COOKIE_RETENTION_CLAUSE}}'}</p>
        </Card>
      </div>
    </Section>
  );
}

