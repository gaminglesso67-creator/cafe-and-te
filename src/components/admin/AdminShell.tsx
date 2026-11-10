'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  AdminRole,
  hasPermission,
  PermissionCapability,
  SEED_ADMIN_USERS,
} from '@/lib/auth/rbac';
import { Badge, Button, Card, DrawerModal } from '@/components/ui';

interface AdminSessionContextValue {
  role: AdminRole;
  email: string;
  soundAlertsEnabled: boolean;
  setRole: (role: AdminRole) => void;
  toggleSoundAlerts: () => void;
  playNewOrderAlert: () => void;
}

const AdminSessionContext = createContext<AdminSessionContextValue>({
  role: 'OWNER',
  email: 'owner@saanjh.local',
  soundAlertsEnabled: true,
  setRole: () => {},
  toggleSoundAlerts: () => {},
  playNewOrderAlert: () => {},
});

export function useAdminSession() {
  return useContext(AdminSessionContext);
}

export interface AdminNavItem {
  href: string;
  label: string;
  capability?: PermissionCapability;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin', label: '{{ADMIN_NAV_OVERVIEW}}' },
  {
    href: '/admin/orders',
    label: '{{ADMIN_NAV_ORDERS}}',
    capability: 'orders_reservations:manage',
  },
  {
    href: '/admin/reservations',
    label: '{{ADMIN_NAV_RESERVATIONS}}',
    capability: 'orders_reservations:manage',
  },
  {
    href: '/admin/inventory',
    label: '{{ADMIN_NAV_INVENTORY_STOCK}}',
    capability: 'inventory:toggle_stock',
  },
  {
    href: '/admin/menu',
    label: '{{ADMIN_NAV_MENU_CRUD}}',
    capability: 'menu:edit',
  },
  {
    href: '/admin/offers',
    label: '{{ADMIN_NAV_OFFERS_EVENTS}}',
    capability: 'content_offers_hours:edit',
  },
  {
    href: '/admin/content',
    label: '{{ADMIN_NAV_BANNERS_HOURS_CONTENT}}',
    capability: 'content_offers_hours:edit',
  },
  {
    href: '/admin/reviews',
    label: '{{ADMIN_NAV_REVIEWS}}',
    capability: 'reviews:moderate',
  },
  {
    href: '/admin/gallery',
    label: '{{ADMIN_NAV_GALLERY}}',
    capability: 'content_offers_hours:edit',
  },
  {
    href: '/admin/analytics',
    label: '{{ADMIN_NAV_ANALYTICS}}',
    capability: 'analytics:view_basic',
  },
  {
    href: '/admin/customers',
    label: '{{ADMIN_NAV_CUSTOMERS}}',
    capability: 'orders_reservations:manage',
  },
  {
    href: '/admin/users',
    label: '{{ADMIN_NAV_USERS_ROLES}}',
    capability: 'users:manage',
  },
  {
    href: '/admin/settings',
    label: '{{ADMIN_NAV_SETTINGS}}',
    capability: 'settings_payments_pos:manage',
  },
  {
    href: '/admin/integrations/pos',
    label: '{{ADMIN_NAV_POS_INTEGRATION}}',
    capability: 'settings_payments_pos:manage',
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRoleState] = useState<AdminRole>('OWNER');
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const currentAccount =
    SEED_ADMIN_USERS.find((u) => u.role === role) ?? SEED_ADMIN_USERS[0];

  const playNewOrderAlert = useCallback(() => {
    if (!soundAlertsEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // AudioContext blocked until user gesture
    }
  }, [soundAlertsEnabled]);

  const renderNavLinks = (onNavigate?: () => void) => (
    <nav aria-label="Admin sidebar navigation" className="space-y-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const allowed = !item.capability || hasPermission(role, item.capability);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={clsx(
              'min-h-11 px-3.5 py-2 rounded-xs flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider border transition-colors',
              active
                ? 'border-gold bg-gold/15 text-gold font-semibold'
                : allowed
                  ? 'border-transparent text-text/90 hover:border-gold/30 hover:bg-white/[0.03]'
                  : 'border-transparent text-muted/45 hover:border-crimson/40'
            )}
          >
            <span className="truncate">{item.label}</span>
            {!allowed && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-crimson/30 text-cream border border-crimson">
                {'{{LOCKED}}'}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <AdminSessionContext.Provider
      value={{
        role,
        email: currentAccount.email,
        soundAlertsEnabled,
        setRole: setRoleState,
        toggleSoundAlerts: () => setSoundAlertsEnabled((v) => !v),
        playNewOrderAlert,
      }}
    >
      <div className="min-h-dvh bg-bg text-text flex flex-col">
        {/* Top Operations Bar (Works on Phone, Tablet & Desktop) */}
        <header className="sticky top-0 z-30 w-full max-w-full bg-surface border-b border-gold/30 px-3 sm:px-6 min-h-16 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open admin navigation"
              className="lg:hidden min-h-11 min-w-11 shrink-0 inline-flex items-center justify-center rounded-xs border border-gold/35 bg-bg text-gold"
            >
              ☰
            </button>
            <Link
              href="/admin"
              className="font-serif text-base sm:text-xl text-gold text-glow-gold truncate max-w-[150px] sm:max-w-none"
            >
              {'{{SAANJH_OPS_CONSOLE}}'}
            </Link>
            <Badge kind="neutral" label={`{{ROLE:${role}}}`} className="hidden md:inline-flex" />
          </div>

          {/* Sanity Studio Link + Sound Toggle + Server Logout (Client Role Switcher Removed) */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              href="https://www.sanity.io/manage"
              external
            >
              Sanity Studio ↗
            </Button>

            <button
              type="button"
              onClick={() => {
                setSoundAlertsEnabled((v) => !v);
                playNewOrderAlert();
              }}
              className={clsx(
                'hidden sm:inline-flex items-center min-h-11 px-3 text-xs font-mono rounded-xs border',
                soundAlertsEnabled
                  ? 'border-gold/45 text-gold bg-bg'
                  : 'border-muted/25 text-muted bg-bg'
              )}
            >
              {soundAlertsEnabled ? '{{SOUND:ON}}' : '{{SOUND:MUTE}}'}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await fetch('/api/admin/session', { method: 'DELETE' });
                router.push('/admin/login');
                router.refresh();
              }}
              className="hidden md:inline-flex"
            >
              {'{{LOGOUT}}'}
            </Button>
          </div>
        </header>

        {/* Body: Desktop Sidebar + Main Content */}
        <div className="flex-1 flex w-full">
          <aside className="hidden lg:block w-64 shrink-0 border-r border-gold/25 bg-surface/60 p-4">
            <div className="mb-4 pb-3 border-b border-gold/20 text-xs text-muted font-mono">
              <div className="text-text font-medium">{currentAccount.email}</div>
              <div>{`{{ACTIVE_ROLE:${role}}}`}</div>
            </div>
            {renderNavLinks()}
            <div className="mt-6 pt-4 border-t border-gold/20">
              <Link
                href="/"
                className="min-h-11 inline-flex items-center text-xs font-mono text-gold underline underline-offset-4"
              >
                ← {'{{RETURN_PUBLIC_SITE}}'}
              </Link>
            </div>
          </aside>

          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>

        {/* Tablet / Phone Collapsible Sidebar Drawer */}
        <DrawerModal
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          title={'{{ADMIN_NAVIGATION}}'}
          mode="bottom-sheet"
        >
          {renderNavLinks(() => setMobileNavOpen(false))}
          <div className="mt-4 pt-3 border-t border-gold/20 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileNavOpen(false)}
              className="min-h-11 inline-flex items-center text-xs font-mono text-gold underline"
            >
              ← {'{{RETURN_PUBLIC_SITE}}'}
            </Link>
            <Button
              variant="secondary"
              size="sm"
              href="/admin/login"
              onClick={() => setMobileNavOpen(false)}
            >
              {'{{LOGOUT}}'}
            </Button>
          </div>
        </DrawerModal>
      </div>
    </AdminSessionContext.Provider>
  );
}

/**
 * RBAC Guard enforcing the PRD Section 9.9 Permission Matrix.
 */
export function PermissionGuard({
  capability,
  children,
}: {
  capability: PermissionCapability;
  children: React.ReactNode;
}) {
  const { role } = useAdminSession();

  if (!hasPermission(role, capability)) {
    return (
      <Card variant="signboard" className="max-w-xl mx-auto my-8 text-center space-y-4 p-8">
        <Badge kind="offer" label={`{{RBAC_DENIED_FOR_${role}}}`} />
        <h2 className="font-serif text-3xl text-gold">{'{{ACCESS_RESTRICTED_HEADING}}'}</h2>
        <p className="text-sm text-muted font-mono">
          {`{{REQUIRED_CAPABILITY: ${capability}}}`}
        </p>
        <p className="text-xs text-muted">
          {'{{PRD_9_9_PERMISSION_MATRIX_ENFORCED}}'}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" size="sm" href="/admin">
            {'{{BACK_TO_OVERVIEW}}'}
          </Button>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}

