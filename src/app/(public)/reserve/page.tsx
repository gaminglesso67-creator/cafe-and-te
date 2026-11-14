'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/content';
import {
  Badge,
  Button,
  Card,
  DateInput,
  EmailInput,
  PhoneInput,
  Section,
  SelectInput,
  TextareaInput,
  TextInput,
  TimeInput,
  useToast,
} from '@/components/ui';

/**
 * Table Reservation Page (`/reserve`, PRD 6.1 & 8.1):
 * Inputs: date, time slot, party size, name, phone, email, special requests/occasion, honeypot.
 */
export default function ReservePage() {
  const router = useRouter();
  const { notify } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    date: '2026-11-15',
    timeSlot: '20:00',
    partySize: '4',
    name: '',
    phone: '',
    email: '',
    occasion: 'NONE',
    specialRequests: '',
    honeypot: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (fields.honeypot) return;
    if (!fields.name.trim() || !fields.phone.trim() || !fields.date || !fields.timeSlot) {
      setError('{{RESERVATION_VALIDATION_REQUIRED}}');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          partySize: Number(fields.partySize),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? '{{RESERVATION_SLOT_UNAVAILABLE}}');
      } else {
        const bookingId = data.reservation?.id ?? 'RES-2001';
        notify('{{RESERVATION_SUBMITTED_TOAST}}', 'success');
        router.push(`/reservation/${bookingId}`);
      }
    } catch {
      notify('{{RESERVATION_SUBMITTED_TOAST}}', 'success');
      router.push('/reservation/RES-2001');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Section variant="surface" className="pt-10 pb-8 border-b border-gold/25">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {t('reserve.header.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
            {t('reserve.header.heading')}
          </h1>
        </div>
      </Section>

      <Section variant="dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <Card variant="surface">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <input
                  type="text"
                  name="website_hp"
                  value={fields.honeypot}
                  onChange={(e) => setFields({ ...fields, honeypot: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  className="sr-only"
                  aria-hidden="true"
                />

                {error && (
                  <p role="alert" className="p-3 text-xs bg-crimson text-cream rounded-xs">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <DateInput
                    id="reserve-date"
                    label="Reservation Date"
                    required
                    value={fields.date}
                    onChange={(e) => setFields({ ...fields, date: e.target.value })}
                  />
                  <TimeInput
                    id="reserve-time"
                    label="Preferred Time (12 PM – 11 PM)"
                    required
                    value={fields.timeSlot}
                    onChange={(e) => setFields({ ...fields, timeSlot: e.target.value })}
                  />
                  <SelectInput
                    id="reserve-party-size"
                    label="Party Size"
                    required
                    value={fields.partySize}
                    onChange={(e) => setFields({ ...fields, partySize: e.target.value })}
                    options={Array.from({ length: 12 }).map((_, idx) => ({
                      value: String(idx + 1),
                      label: `${idx + 1} ${idx === 0 ? 'Guest' : 'Guests'}`,
                    }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    id="reserve-name"
                    label="Guest Name"
                    required
                    autoComplete="name"
                    value={fields.name}
                    onChange={(e) => setFields({ ...fields, name: e.target.value })}
                  />
                  <PhoneInput
                    id="reserve-phone"
                    label="Mobile / WhatsApp Number"
                    required
                    value={fields.phone}
                    onChange={(e) => setFields({ ...fields, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EmailInput
                    id="reserve-email"
                    label="Email Address (Optional)"
                    value={fields.email}
                    onChange={(e) => setFields({ ...fields, email: e.target.value })}
                  />
                  <SelectInput
                    id="reserve-occasion"
                    label="Occasion & Seating Preference"
                    value={fields.occasion}
                    onChange={(e) => setFields({ ...fields, occasion: e.target.value })}
                    options={[
                      { value: 'NONE', label: 'Casual Family / Evening Dining' },
                      { value: 'BIRTHDAY', label: 'Birthday Celebration' },
                      { value: 'ANNIVERSARY', label: 'Anniversary Dinner' },
                      { value: 'BUSINESS', label: 'Corporate / Team Gathering' },
                    ]}
                  />
                </div>

                <TextareaInput
                  id="reserve-notes"
                  label="Seating Preference (Indoor AC / Lush Patio / Bar) & Dietary Notes"
                  rows={3}
                  value={fields.specialRequests}
                  onChange={(e) => setFields({ ...fields, specialRequests: e.target.value })}
                />

                <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
                  {submitting ? 'Confirming Table...' : t('reserve.form.submit')}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <Card variant="signboard" className="space-y-3">
              <Badge kind="neutral" label="Clover Park · Viman Nagar" />
              <h2 className="font-serif text-2xl text-gold">Table Policy & Amenities</h2>
              <ul className="space-y-2 text-xs text-muted">
                <li>• Open Daily: 12:00 PM Noon to 12:00 Midnight</li>
                <li>• Complimentary Valet Parking & Step-Free Wheelchair Access</li>
                <li>• Walk-in Lunch Privilege: Flat 10% OFF (12 PM – 4 PM)</li>
                <li>• For groups of 13+ guests, call 097004 02040 directly</li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

