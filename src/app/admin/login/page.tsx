'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { schemaTypes } from '@/sanity/schemaTypes';
import {
  Badge,
  Button,
  Card,
  Section,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Sanity Studio Security Gateway (`/admin/login`):
 * - Replaces the legacy insecure client-side password login & preset buttons.
 * - Directs editors and managers to Sanity Studio (protected by Sanity Cloud SSO & 2FA).
 * - Allows server-side verification via `SANITY_API_WRITE_TOKEN` (HttpOnly cookie) for POS/Ops telemetry.
 */
export default function AdminSanityGatewayPage() {
  const router = useRouter();
  const { notify } = useToast();

  const [token, setToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    sanityConfigured: boolean;
    projectId: string | null;
    studioUrl: string;
    serverTokenConfigured: boolean;
  }>({
    sanityConfigured: false,
    projectId: null,
    studioUrl: 'https://www.sanity.io/manage',
    serverTokenConfigured: false,
  });

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((data) => {
        if (data) setStatus(data);
      })
      .catch(() => {});
  }, []);

  const handleTokenUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token.trim()) {
      setError('Please enter your server SANITY_API_WRITE_TOKEN.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload.error ?? 'Authentication failed.');
      } else {
        notify('Sanity Write Token verified — Operations Console unlocked', 'success');
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Unable to verify token at this time.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section variant="dark" className="min-h-dvh flex items-center justify-center py-12">
      <div className="w-full max-w-4xl space-y-8">
        {/* Top Security Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs text-gold">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span>Protected by Sanity Cloud Identity &amp; Server Middleware</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-ember-gradient">
            Caffè &amp; Tè × Sanity Studio CMS
          </h1>
          <p className="text-sm text-muted max-w-xl mx-auto">
            All hardcoded client credentials have been removed. Menu CRUD, Pricing, Stock Toggles, Offers, Reviews, Gallery, and Live Orders are managed through Sanity Studio with SSO &amp; 2FA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 7 Cols: Launch Sanity Studio & Active Schemas */}
          <Card variant="dark" className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="space-y-5 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge
                  kind={status.sanityConfigured ? 'veg' : 'offer'}
                  label={
                    status.sanityConfigured
                      ? `Sanity Connected (${status.projectId})`
                      : 'Awaiting NEXT_PUBLIC_SANITY_PROJECT_ID'
                  }
                />
                <span className="text-xs font-mono text-muted">
                  {schemaTypes.length} Document Schemas Ready
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-2xl text-text">
                  1. Open Sanity Studio (Recommended)
                </h2>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Sign in with your invited Google, GitHub, or Sanity 2FA account to edit dishes, toggle stock availability, publish offers, and review incoming table bookings.
                </p>
              </div>

              {/* Active Sanity Document Schemas Grid */}
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold">
                  Registered Sanity Schemas (`src/sanity/schemaTypes`)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {schemaTypes.map((schema) => (
                    <div
                      key={schema.name}
                      className="glass-pill px-3 py-2 rounded-sm text-xs flex flex-col gap-0.5"
                    >
                      <span className="font-medium text-text truncate">{schema.title}</span>
                      <span className="font-mono text-[10px] text-gold/80">{schema.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="primary"
                size="md"
                href={status.studioUrl}
                external
              >
                Launch Sanity Studio ↗
              </Button>
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.2em] text-muted hover:text-gold transition-colors"
              >
                ← Back to Caffè &amp; Tè Website
              </Link>
            </div>
          </Card>

          {/* Right 5 Cols: Server-Verified Token Unlock for Local POS Monitor */}
          <Card variant="surface" className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-4 relative z-10">
              <Badge kind="neutral" label="Server-Side HttpOnly Session" />
              <h2 className="font-serif text-2xl text-text">
                2. Unlock Local POS Monitor
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                To access the local POS queue &amp; operations monitor at <code className="text-gold">/admin</code>, enter the private <code className="text-gold">SANITY_API_WRITE_TOKEN</code> configured in your server environment.
              </p>

              {error && (
                <p role="alert" className="p-3 text-xs bg-crimson/90 text-cream rounded-sm border border-white/15">
                  {error}
                </p>
              )}

              <form onSubmit={handleTokenUnlock} className="space-y-4" noValidate>
                <TextInput
                  id="sanity-write-token-input"
                  label="Sanity API Write Token"
                  type="password"
                  placeholder="sk..."
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  fullWidth
                  disabled={submitting}
                >
                  {submitting ? 'Verifying on Server...' : 'Verify Token & Unlock'}
                </Button>
              </form>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 space-y-1.5 text-[11px] font-mono text-muted">
              <p className="text-gold">Quick Setup (.env.local):</p>
              <p>NEXT_PUBLIC_SANITY_PROJECT_ID=&quot;your_id&quot;</p>
              <p>NEXT_PUBLIC_SANITY_DATASET=&quot;production&quot;</p>
              <p>SANITY_API_WRITE_TOKEN=&quot;sk_your_token&quot;</p>
              <p className="pt-1 text-text/80">Seed data: npm run sanity:seed</p>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
