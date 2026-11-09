'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { t } from '@/lib/content';
import { Button } from '@/components/ui';

const CONSENT_STORAGE_KEY = 'saanjh_cookie_consent_v1';

/**
 * Consent-aware Cookie & Analytics Banner (PRD 7.8, 12.5, 12.6).
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const handleDecision = (decision: 'accepted' | 'declined') => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, decision);
    } catch {
      // Ignore storage write errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40 p-4 rounded-sm border border-gold/45 bg-surface text-text shadow-panel"
    >
      <p className="text-xs sm:text-sm text-muted mb-3">
        {t('global.consent.message')}{' '}
        <Link href="/privacy" className="text-gold underline underline-offset-4">
          {'{{PRIVACY_LINK}}'}
        </Link>
      </p>
      <div className="flex items-center gap-2.5">
        <Button variant="primary" size="sm" onClick={() => handleDecision('accepted')}>
          {t('global.consent.accept')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDecision('declined')}>
          {t('global.consent.decline')}
        </Button>
      </div>
    </aside>
  );
}

