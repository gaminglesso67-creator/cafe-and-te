'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SEED_ADMIN_USERS } from '@/lib/auth/rbac';
import {
  Badge,
  Button,
  Card,
  EmailInput,
  Section,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Admin Login Screen (`/admin/login`, PRD 6.2 & 9.1):
 * - Email and password login
 * - Optional OTP/2FA field for Owner and Manager
 * - Account lockout after 5 repeated failed attempts
 * - Quick-fill dev credentials for Owner / Manager / Staff testing
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [email, setEmail] = useState('owner@saanjh.local');
  const [password, setPassword] = useState('saanjh-dev-pass');
  const [otpCode, setOtpCode] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedOut) return;

    const matchedUser = SEED_ADMIN_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedUser || password !== 'saanjh-dev-pass') {
      const nextCount = failedAttempts + 1;
      setFailedAttempts(nextCount);
      if (nextCount >= 5) {
        setLockedOut(true);
        setError('{{ACCOUNT_LOCKED_TOO_MANY_FAILED_ATTEMPTS}}');
      } else {
        setError(`{{INVALID_CREDENTIALS_ATTEMPT_${nextCount}_OF_5}}`);
      }
      return;
    }

    notify(`{{SIGNED_IN_AS_${matchedUser.role}}}`, 'success');
    router.push('/admin');
  };

  return (
    <Section variant="dark" className="min-h-dvh flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <Card variant="signboard" className="space-y-5 p-6 sm:p-8">
          <div className="space-y-1 text-center">
            <Badge kind="neutral" label={'{{RBAC_PROTECTED_CONSOLE}}'} />
            <h1 className="font-serif text-3xl text-gold text-glow-gold pt-2">
              {'{{ADMIN_LOGIN_HEADING}}'}
            </h1>
            <p className="text-xs text-muted">{'{{ADMIN_LOGIN_SUBTEXT}}'}</p>
          </div>

          {error && (
            <p role="alert" className="p-3 text-xs bg-crimson text-cream rounded-xs">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <EmailInput
              id="admin-login-email"
              label={'{{FIELD_STAFF_EMAIL}}'}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              id="admin-login-password"
              label={'{{FIELD_PASSWORD}}'}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextInput
              id="admin-login-otp"
              label={'{{FIELD_OPTIONAL_2FA_OTP_OWNER_MANAGER}}'}
              inputMode="numeric"
              placeholder={'{{OPTIONAL_OTP_TOKEN}}'}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={lockedOut}>
              {lockedOut ? '{{ACCOUNT_LOCKED}}' : '{{SIGN_IN_TO_ADMIN_CTA}}'}
            </Button>
          </form>

          {/* Dev Credential Presets */}
          <div className="pt-4 border-t border-gold/20 space-y-2">
            <p className="text-xs font-mono text-muted uppercase">
              {'{{DEV_SEED_ACCOUNTS_CLICK_TO_FILL}}:'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SEED_ADMIN_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setEmail(u.email);
                    setPassword('saanjh-dev-pass');
                    setError(null);
                  }}
                  className="min-h-11 px-2 py-1.5 text-xs font-mono rounded-xs border border-gold/30 bg-surface text-gold hover:border-gold"
                >
                  {u.role}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

