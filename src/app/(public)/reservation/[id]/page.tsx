'use client';

import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Section,
  useToast,
} from '@/components/ui';

/**
 * Reservation Confirmation & Manage Page (`/reservation/[id]`, PRD 6.1 & 8.1):
 * Displays booking state (`pending` -> `confirmed` | `declined` | `cancelled` | `no_show` | `completed`)
 * and allows guest modification or cancellation.
 */
export default function ReservationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { notify } = useToast();
  const [status, setStatus] = useState<
    'pending' | 'confirmed' | 'declined' | 'cancelled' | 'no_show' | 'completed'
  >('confirmed');

  const handleCancel = async () => {
    try {
      await fetch(`/api/reservations/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
    } catch {
      // Fallback in dev
    }
    setStatus('cancelled');
    notify('{{RESERVATION_CANCELLED_TOAST}}', 'info');
  };

  return (
    <Section variant="dark" narrow>
      <Card variant="signboard" className="space-y-6 p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/25 pb-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-gold">
              {`Booking Reference: ${params.id}`}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-text mt-1">
              Your Table at Saanjh Viman Nagar
            </h1>
          </div>
          <Badge
            kind={status === 'confirmed' ? 'veg' : status === 'cancelled' ? 'out_of_stock' : 'offer'}
            label={status.toUpperCase()}
          />
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border border-gold/20 bg-surface p-4 rounded-xs">
          <div>
            <dt className="text-xs text-muted uppercase">Location</dt>
            <dd className="font-mono text-text mt-0.5">Clover Park, Viman Nagar (Opp. Phoenix Marketcity)</dd>
          </div>
          <div>
            <dt className="text-xs text-muted uppercase">Party Size & Seating</dt>
            <dd className="font-mono text-text mt-0.5">4 Guests · Indoor AC / Patio</dd>
          </div>
          <div>
            <dt className="text-xs text-muted uppercase">Facilities</dt>
            <dd className="text-text mt-0.5">Valet Parking & Wheelchair Accessible</dd>
          </div>
          <div>
            <dt className="text-xs text-muted uppercase">Direct Desk</dt>
            <dd className="text-text mt-0.5">+91 84858 00863 (WhatsApp & SMS Active)</dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button variant="secondary" size="sm" href="/reserve">
            Modify Booking
          </Button>
          {status !== 'cancelled' && (
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel Reservation
            </Button>
          )}
        </div>
      </Card>
    </Section>
  );
}

