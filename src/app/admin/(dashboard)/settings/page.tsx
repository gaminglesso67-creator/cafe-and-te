'use client';

import React, { useState } from 'react';
import { appendAuditLog, getStore } from '@/lib/db';
import { PermissionGuard, useAdminSession } from '@/components/admin/AdminShell';
import {
  Badge,
  Button,
  Card,
  ResponsiveTable,
  SelectInput,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Platform Settings (`/admin/settings`, PRD 6.2, 9.6 & 9.9):
 * Strictly OWNER only (`settings_payments_pos:manage`).
 * Configures Business Profile, GST, Payment Provider, Delivery Zones, Reservation Rules, and Notification Templates.
 */
export default function AdminSettingsPage() {
  const store = getStore();
  const { email, role } = useAdminSession();
  const { notify } = useToast();

  const [gstNumber, setGstNumber] = useState('{{BRAND_GSTIN}}');
  const [paymentProvider, setPaymentProvider] = useState('razorpay');
  const [slotCapacity, setSlotCapacity] = useState('40');
  const [autoConfirm, setAutoConfirm] = useState(store.autoConfirmReservations);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.autoConfirmReservations = autoConfirm;
    appendAuditLog({
      actorEmail: email,
      actorRole: role,
      action: 'SETTINGS_UPDATED',
      entityType: 'Setting',
      detail: `Provider=${paymentProvider}, SlotCapacity=${slotCapacity}, AutoConfirm=${autoConfirm}`,
    });
    notify('{{SETTINGS_SAVED_AND_AUDITED}}', 'success');
  };

  return (
    <PermissionGuard capability="settings_payments_pos:manage">
      <div className="space-y-8">
        <div className="border-b border-gold/25 pb-4">
          <h1 className="font-serif text-3xl text-gold">{'{{SYSTEM_SETTINGS_OWNER_ONLY}}'}</h1>
        </div>

        <Card variant="surface">
          <form onSubmit={handleSaveSettings} className="space-y-5">
            <h2 className="font-serif text-2xl text-gold">
              {'{{PAYMENTS_TAX_AND_RESERVATION_RULES}}'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextInput
                id="settings-gst"
                label={'{{GSTIN_TAX_NUMBER}}'}
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
              />
              <SelectInput
                id="settings-payment-provider"
                label={'{{ACTIVE_PAYMENT_PROVIDER}}'}
                value={paymentProvider}
                onChange={(e) => setPaymentProvider(e.target.value)}
                options={[
                  { value: 'razorpay', label: 'Razorpay (India Primary — Test Mode)' },
                  { value: 'stripe', label: 'Stripe (Cards — Test Mode)' },
                ]}
              />
              <TextInput
                id="settings-slot-capacity"
                label={'{{RESERVATION_CAPACITY_PER_SLOT}}'}
                inputMode="numeric"
                value={slotCapacity}
                onChange={(e) => setSlotCapacity(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-bg border border-gold/25 rounded-xs">
              <span className="text-sm text-text">
                {'{{AUTO_CONFIRM_ONLINE_RESERVATIONS}}'}
              </span>
              <Button
                variant={autoConfirm ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setAutoConfirm((v) => !v)}
              >
                {autoConfirm ? '{{AUTO_CONFIRM:ON}}' : '{{MANUAL_APPROVAL_ONLY}}'}
              </Button>
            </div>

            <Button type="submit" variant="primary" size="md">
              {'{{SAVE_SETTINGS_CTA}}'}
            </Button>
          </form>
        </Card>

        {/* Notification Logs & Template Stubs (PRD 8.4) */}
        <Card variant="surface" className="space-y-4">
          <h2 className="font-serif text-2xl text-gold">
            {'{{NOTIFICATION_TEMPLATES_AND_DELIVERY_LOGS}}'}
          </h2>
          <ResponsiveTable
            rowKey={(n) => n.id}
            data={store.notificationLogs}
            columns={[
              { key: 'evt', header: 'Event', render: (n) => n.eventKey },
              { key: 'ch', header: 'Channel', render: (n) => <Badge kind="neutral" label={n.channel} /> },
              { key: 'rec', header: 'Recipient', render: (n) => n.recipient },
              { key: 'body', header: 'Template Stub', render: (n) => <span className="font-mono text-xs">{n.templateBody}</span> },
              { key: 'st', header: 'Status', render: (n) => <Badge kind="veg" label={n.status} /> },
            ]}
          />
        </Card>
      </div>
    </PermissionGuard>
  );
}

