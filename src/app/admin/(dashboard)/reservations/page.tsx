'use client';

import React, { useState } from 'react';
import { getStore, ReservationRecord } from '@/lib/db';
import { PermissionGuard } from '@/components/admin/AdminShell';
import {
  Badge,
  Button,
  Card,
  DateInput,
  DrawerModal,
  PhoneInput,
  ResponsiveTable,
  TextInput,
  TimeInput,
  useToast,
} from '@/components/ui';

/**
 * Admin Reservation Dashboard (`/admin/reservations`, PRD 6.2, 8.1 & 9.3):
 * - Calendar and list views
 * - Status changes (`pending` -> `confirmed` | `declined` | `cancelled` | `no_show` | `completed`)
 * - Manual booking creation modal
 */
export default function AdminReservationsPage() {
  const store = getStore();
  const { notify } = useToast();
  const [reservations, setReservations] = useState<ReservationRecord[]>([...store.reservations]);
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [modalOpen, setModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    guestName: '',
    guestPhone: '',
    date: '2026-11-15',
    timeSlot: '20:00',
    partySize: '4',
  });

  const handleStatusChange = (id: string, status: ReservationRecord['status']) => {
    const updated = reservations.map((r) => (r.id === id ? { ...r, status } : r));
    store.reservations = updated;
    setReservations(updated);
    notify(`Reservation ${id} → ${status}`, 'success');
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.guestName.trim() || !newBooking.guestPhone.trim()) return;
    const created: ReservationRecord = {
      id: `RES-${Date.now().toString().slice(-4)}`,
      reservationCode: `BK-${Date.now().toString().slice(-4)}`,
      guestName: newBooking.guestName,
      guestPhone: newBooking.guestPhone,
      date: newBooking.date,
      timeSlot: newBooking.timeSlot,
      partySize: Number(newBooking.partySize) || 2,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    const updated = [created, ...reservations];
    store.reservations = updated;
    setReservations(updated);
    setModalOpen(false);
    notify('{{MANUAL_RESERVATION_CREATED}}', 'success');
  };

  return (
    <PermissionGuard capability="orders_reservations:manage">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/25 pb-4">
          <h1 className="font-serif text-3xl text-gold">{'{{RESERVATION_DASHBOARD_HEADING}}'}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={viewMode === 'LIST' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('LIST')}
            >
              {'{{LIST_VIEW}}'}
            </Button>
            <Button
              variant={viewMode === 'CALENDAR' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('CALENDAR')}
            >
              {'{{CALENDAR_SLOT_VIEW}}'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
              + {'{{NEW_MANUAL_BOOKING}}'}
            </Button>
          </div>
        </div>

        {viewMode === 'CALENDAR' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map((slot) => {
              const bookingsInSlot = reservations.filter((r) => r.timeSlot === slot);
              const totalGuests = bookingsInSlot.reduce((s, b) => s + b.partySize, 0);
              return (
                <Card key={slot} variant="surface" className="space-y-2">
                  <div className="flex items-center justify-between border-b border-gold/20 pb-2">
                    <span className="font-mono text-base text-gold">{slot} IST</span>
                    <Badge kind="neutral" label={`${totalGuests}/40 Guests`} />
                  </div>
                  {bookingsInSlot.length === 0 ? (
                    <p className="text-xs text-muted py-3">{'{{SLOT_AVAILABLE}}'}</p>
                  ) : (
                    bookingsInSlot.map((b) => (
                      <div key={b.id} className="p-2 bg-bg rounded-xs text-xs space-y-1">
                        <div className="flex justify-between font-medium text-text">
                          <span>{b.guestName}</span>
                          <span>{b.partySize}p</span>
                        </div>
                        <Badge kind="veg" label={b.status} />
                      </div>
                    ))
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <ResponsiveTable
            rowKey={(r) => r.id}
            data={reservations}
            columns={[
              { key: 'id', header: 'Ref', render: (r) => <span className="font-mono text-gold">{r.id}</span> },
              { key: 'guest', header: 'Guest', render: (r) => `${r.guestName} (${r.guestPhone})` },
              { key: 'slot', header: 'Date & Slot', render: (r) => `${r.date} @ ${r.timeSlot}` },
              { key: 'party', header: 'Guests', render: (r) => r.partySize },
              { key: 'status', header: 'Status', render: (r) => <Badge kind="neutral" label={r.status} /> },
              {
                key: 'actions',
                header: 'Actions',
                render: (r) => (
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {(
                      ['confirmed', 'declined', 'no_show', 'completed'] as ReservationRecord['status'][]
                    ).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(r.id, st)}
                        className="min-h-9 px-2 text-[11px] font-mono uppercase border border-gold/30 rounded-xs hover:border-gold text-muted hover:text-gold"
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        )}

        <DrawerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={'{{CREATE_MANUAL_RESERVATION}}'}
          mode="dialog"
        >
          <form onSubmit={handleCreateManual} className="space-y-4">
            <TextInput
              id="manual-res-name"
              label={'{{FIELD_GUEST_NAME}}'}
              required
              value={newBooking.guestName}
              onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
            />
            <PhoneInput
              id="manual-res-phone"
              label={'{{FIELD_GUEST_PHONE}}'}
              required
              value={newBooking.guestPhone}
              onChange={(e) => setNewBooking({ ...newBooking, guestPhone: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DateInput
                id="manual-res-date"
                label={'{{FIELD_DATE}}'}
                value={newBooking.date}
                onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
              />
              <TimeInput
                id="manual-res-time"
                label={'{{FIELD_TIME}}'}
                value={newBooking.timeSlot}
                onChange={(e) => setNewBooking({ ...newBooking, timeSlot: e.target.value })}
              />
              <TextInput
                id="manual-res-party"
                label={'{{FIELD_PARTY_SIZE}}'}
                inputMode="numeric"
                value={newBooking.partySize}
                onChange={(e) => setNewBooking({ ...newBooking, partySize: e.target.value })}
              />
            </div>
            <Button type="submit" variant="primary" size="md" fullWidth>
              {'{{SAVE_MANUAL_BOOKING_CTA}}'}
            </Button>
          </form>
        </DrawerModal>
      </div>
    </PermissionGuard>
  );
}
