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
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Saanjh Viman Nagar · Legal</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
          {t('legal.privacy.heading')}
        </h1>
        <GoldDivider ornament={false} />
        <Card variant="surface" className="space-y-4 text-sm text-muted leading-relaxed">
          <p>{t('legal.privacy.body')}</p>
          <h2 className="font-serif text-xl text-text pt-2">DPDP Act Data Rights & Deletion</h2>
          <p>
            Guests may request a full export or deletion of their reservation and order contact records at any time by emailing reservations@saanjhpune.com or calling +91 84858 00863.
          </p>
          <h2 className="font-serif text-xl text-text pt-2">Cookies & Session Storage</h2>
          <p>
            Essential local storage is used strictly to preserve your active dining bag and order type across sessions. Analytics cookies only run when explicitly accepted.
          </p>
        </Card>
      </div>
    </Section>
  );
}

