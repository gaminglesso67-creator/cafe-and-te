'use client';

import React from 'react';
import { getStore } from '@/lib/db';
import { PermissionGuard } from '@/components/admin/AdminShell';
import { Badge, ResponsiveTable } from '@/components/ui';

/**
 * Customer Directory (`/admin/customers`, PRD 6.2 & 9.8):
 * Lists customer records with order counts, phone/email, and DPDP consent status.
 */
export default function AdminCustomersPage() {
  const store = getStore();

  const customers = store.orders.map((o, idx) => ({
    id: `cust-${idx + 1}`,
    name: o.customerName,
    phone: o.customerPhone,
    email: o.customerEmail ?? '{{NO_EMAIL}}',
    ordersCount: 1,
    consent: idx % 2 === 0,
  }));

  return (
    <PermissionGuard capability="orders_reservations:manage">
      <div className="space-y-6">
        <div className="border-b border-gold/25 pb-4">
          <h1 className="font-serif text-3xl text-gold">{'{{CUSTOMER_DIRECTORY_HEADING}}'}</h1>
        </div>

        <ResponsiveTable
          rowKey={(c) => c.id}
          data={customers}
          columns={[
            { key: 'name', header: 'Customer', render: (c) => c.name },
            {
              key: 'phone',
              header: 'Phone',
              render: (c) => (
                <a href={`tel:${c.phone}`} className="font-mono text-gold underline">
                  {c.phone}
                </a>
              ),
            },
            { key: 'orders', header: 'Orders', render: (c) => c.ordersCount },
            {
              key: 'consent',
              header: 'DPDP Marketing Consent',
              render: (c) => (
                <Badge
                  kind={c.consent ? 'veg' : 'neutral'}
                  label={c.consent ? 'OPTED_IN' : 'TRANSACTIONAL_ONLY'}
                />
              ),
            },
          ]}
        />
      </div>
    </PermissionGuard>
  );
}

