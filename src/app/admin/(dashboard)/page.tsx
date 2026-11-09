'use client';

import React, { useState } from 'react';
import { formatPriceToken } from '@/lib/content';
import { getStore } from '@/lib/db';
import { ROLE_PERMISSIONS } from '@/lib/auth/rbac';
import { useAdminSession } from '@/components/admin/AdminShell';
import {
  Badge,
  Button,
  Card,
  ResponsiveTable,
  useToast,
} from '@/components/ui';

/**
 * Admin Overview Dashboard (`/admin`, PRD 6.2 & 9):
 * Live KPIs, global Online Ordering On/Off switch, recent orders, audit log feed,
 * and interactive RBAC Permission Matrix table (PRD 9.9).
 */
export default function AdminOverviewPage() {
  const store = getStore();
  const { role, playNewOrderAlert } = useAdminSession();
  const { notify } = useToast();
  const [orderingActive, setOrderingActive] = useState(store.orderingEnabled);

  const totalRevenue = store.orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const outOfStockCount = store.menuItems.filter((i) => !i.isAvailable).length;

  const matrixRows = [
    {
      cap: 'orders_reservations:manage',
      label: 'View/update orders and reservations',
      staff: '✔',
      manager: '✔',
      owner: '✔',
    },
    {
      cap: 'inventory:toggle_stock',
      label: 'Mark items out of stock',
      staff: '✔',
      manager: '✔',
      owner: '✔',
    },
    {
      cap: 'menu:edit',
      label: 'Edit menu, prices',
      staff: '✖',
      manager: '✔',
      owner: '✔',
    },
    {
      cap: 'content_offers_hours:edit',
      label: 'Edit offers, banners, hours, content',
      staff: '✖',
      manager: '✔',
      owner: '✔',
    },
    {
      cap: 'reviews:moderate',
      label: 'Moderate reviews',
      staff: '✖',
      manager: '✔',
      owner: '✔',
    },
    {
      cap: 'payments:refund',
      label: 'Refunds',
      staff: '✖',
      manager: '✔ (limit)',
      owner: '✔',
    },
    {
      cap: 'analytics:view_full',
      label: 'View analytics',
      staff: 'limited',
      manager: '✔',
      owner: '✔ full',
    },
    {
      cap: 'users:manage',
      label: 'Manage users and roles',
      staff: '✖',
      manager: '✖',
      owner: '✔',
    },
    {
      cap: 'settings_payments_pos:manage',
      label: 'Payment and POS settings',
      staff: '✖',
      manager: '✖',
      owner: '✔',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Global Ordering Pause Switch (PRD 8.2 & 9.6) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/25 pb-5">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-gold">
            {`{{ACTIVE_SESSION_ROLE: ${role}}}`}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-text mt-1">
            {'{{ADMIN_OVERVIEW_HEADING}}'}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={orderingActive ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              const next = !orderingActive;
              store.orderingEnabled = next;
              setOrderingActive(next);
              notify(
                next ? '{{ONLINE_ORDERING_ENABLED}}' : '{{ONLINE_ORDERING_PAUSED}}',
                'info'
              );
            }}
          >
            {orderingActive ? '{{ORDERING_STATUS:ONLINE}}' : '{{ORDERING_STATUS:PAUSED}}'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              playNewOrderAlert();
              notify('{{SIMULATED_NEW_ORDER_ALERT_BEEP}}', 'info');
            }}
          >
            {'{{TEST_NEW_ORDER_CHIME}}'}
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="surface" className="space-y-1">
          <span className="text-xs font-mono text-muted uppercase">{'{{KPI_ACTIVE_ORDERS}}'}</span>
          <p className="font-serif text-3xl text-gold">{store.orders.length}</p>
        </Card>
        <Card variant="surface" className="space-y-1">
          <span className="text-xs font-mono text-muted uppercase">
            {'{{KPI_UPCOMING_RESERVATIONS}}'}
          </span>
          <p className="font-serif text-3xl text-gold">{store.reservations.length}</p>
        </Card>
        <Card variant="surface" className="space-y-1">
          <span className="text-xs font-mono text-muted uppercase">{'{{KPI_SEED_REVENUE}}'}</span>
          <p className="font-serif text-3xl text-gold">{formatPriceToken(totalRevenue)}</p>
        </Card>
        <Card variant="surface" className="space-y-1">
          <span className="text-xs font-mono text-muted uppercase">
            {'{{KPI_OUT_OF_STOCK_ITEMS}}'}
          </span>
          <p className="font-serif text-3xl text-crimson">{outOfStockCount}</p>
        </Card>
      </div>

      {/* PRD 9.9 Role Permission Matrix Verification Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-gold">
            {'{{PRD_9_9_RBAC_PERMISSION_MATRIX}}'}
          </h2>
          <span className="text-xs font-mono text-muted">
            {`{{ACTIVE_CAPABILITIES: ${ROLE_PERMISSIONS[role].length}}}`}
          </span>
        </div>
        <ResponsiveTable
          rowKey={(r) => r.cap}
          data={matrixRows}
          columns={[
            { key: 'label', header: 'Capability', render: (r) => r.label },
            { key: 'staff', header: 'Staff', render: (r) => r.staff },
            { key: 'manager', header: 'Manager', render: (r) => r.manager },
            { key: 'owner', header: 'Owner', render: (r) => r.owner },
          ]}
        />
      </div>

      {/* Audit Log Feed (PRD 9.1) */}
      <div className="space-y-3">
        <h2 className="font-serif text-2xl text-gold">{'{{RECENT_AUDIT_LOG_FEED}}'}</h2>
        <ResponsiveTable
          rowKey={(a) => a.id}
          data={store.auditLogs}
          columns={[
            { key: 'action', header: 'Action', render: (a) => <Badge kind="neutral" label={a.action} /> },
            { key: 'actor', header: 'Actor', render: (a) => `${a.actorEmail} (${a.actorRole})` },
            { key: 'detail', header: 'Detail', render: (a) => a.detail },
            { key: 'time', header: 'Timestamp', render: (a) => a.createdAt },
          ]}
        />
      </div>
    </div>
  );
}

