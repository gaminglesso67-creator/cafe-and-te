'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export type AnalyticsEventName =
  | 'cta_click'
  | 'add_to_cart'
  | 'checkout_started'
  | 'order_completed'
  | 'reservation_submitted'
  | 'contact_submitted';

/**
 * Consent-Aware Analytics Event Dispatcher (PRD Section 12.6):
 * Only dispatches GA4 / analytics events when the user has accepted cookie consent.
 */
export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  payload?: Record<string, string | number>
) {
  if (typeof window === 'undefined') return;
  try {
    const consent = window.localStorage.getItem('caffe_te_cookie_consent_v1');
    if (consent !== 'accepted') return;

    const win = window as unknown as {
      gtag?: (cmd: string, name: string, params?: Record<string, string | number>) => void;
    };
    if (typeof win.gtag === 'function') {
      win.gtag('event', eventName, payload);
    }
  } catch {
    // Ignore storage errors
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackAnalyticsEvent('cta_click', { page_path: pathname });
  }, [pathname]);

  return null;
}

