import React from 'react';
import { t } from '@/lib/content';
import { Button, Card, Section } from '@/components/ui';

/**
 * Branded 404 Not Found Page (PRD 6.1 & 7.9).
 */
export default function NotFound() {
  return (
    <Section variant="dark" className="min-h-[80dvh] flex items-center justify-center">
      <Card variant="signboard" className="max-w-lg mx-auto text-center space-y-5 p-8 sm:p-12">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
          {t('error.404.code')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
          {t('error.404.heading')}
        </h1>
        <p className="text-sm text-muted">{t('error.404.body')}</p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="md" href="/">
            {t('error.404.cta')}
          </Button>
          <Button variant="secondary" size="md" href="/menu">
            {t('global.nav.menu')}
          </Button>
        </div>
      </Card>
    </Section>
  );
}

