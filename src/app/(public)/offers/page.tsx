'use client';

import React, { useState } from 'react';
import { t } from '@/lib/content';
import { SEED_EVENTS, SEED_OFFERS } from '@/lib/seed-data';
import {
  Badge,
  Button,
  Card,
  DateInput,
  EmailInput,
  ImageWithOverlay,
  PhoneInput,
  Section,
  SelectInput,
  TextareaInput,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Offers and Events Page (PRD 7.7):
 * - Festive banner slot (Crimson #B3202A accent per PRD 5.5)
 * - Specials list (cards with validity dates)
 * - Happy hours block (time-based, data-driven)
 * - Events listing (upcoming and past)
 * - Catering and party bookings enquiry form with validation & honeypot
 */
export default function OffersAndEventsPage() {
  const { notify } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'BIRTHDAY_ANNIVERSARY',
    eventDate: '',
    guestCount: '25',
    budgetRange: 'STANDARD',
    notes: '',
    honeypot: '',
  });

  const handleCateringSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (formData.honeypot) return; // Honeypot spam trap
    if (!formData.name.trim() || !formData.phone.trim() || !formData.eventDate) {
      setFormError('{{VALIDATION_REQUIRED_FIELDS_ERROR}}');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiry/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(payload.error ?? '{{FORM_SUBMISSION_ERROR}}');
      } else {
        setSubmittedRef(payload.enquiryId ?? 'ENQ-DEV-001');
        notify('{{CATERING_ENQUIRY_RECEIVED_TOAST}}', 'success');
      }
    } catch {
      setSubmittedRef('ENQ-LOCAL-001');
      notify('{{CATERING_ENQUIRY_RECEIVED_TOAST}}', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  const happyHoursOffers = SEED_OFFERS.filter((o) => o.isHappyHour);

  return (
    <>
      <Section variant="surface" className="pt-10 pb-8 border-b border-gold/25">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {t('offers.header.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
            {t('offers.header.heading')}
          </h1>
        </div>
      </Section>

      {/* 1. Crimson Festive Banner Slot (PRD 5.5 & 7.7) */}
      <Section variant="dark" className="pb-6">
        <div className="rounded-sm bg-crimson text-cream border border-gold/55 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest bg-bg/40 border border-gold/40 rounded-xs">
              {t('offers.festive.tag')}
            </span>
            <h2 className="font-serif text-3xl text-cream">{t('offers.festive.heading')}</h2>
            <p className="text-sm text-cream/90">{t('offers.festive.body')}</p>
          </div>
          <Button variant="primary" size="md" href="/reserve">
            {t('global.nav.reserve')}
          </Button>
        </div>
      </Section>

      {/* 2. Specials List & Time-Based Happy Hours Block */}
      <Section variant="dark" className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Specials Cards */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="font-serif text-3xl text-text">Current Dining Deals & Privileges</h2>
            {SEED_OFFERS.map((offer) => (
              <Card key={offer.id} variant="surface" className="space-y-4">
                <ImageWithOverlay slot={offer.imageSlot} aspect="16x9" />
                <div className="flex items-center justify-between gap-2">
                  <Badge kind="offer" label={offer.badgeText} />
                  <span className="font-mono text-xs text-gold border border-gold/30 px-2.5 py-1 rounded-xs">
                    {`CODE: ${offer.code}`}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-text">{offer.title}</h3>
                <p className="text-sm text-muted">{offer.description}</p>
                <div className="pt-3 border-t border-gold/20 flex items-center justify-between text-xs text-muted">
                  <span>
                    {offer.validFrom} — {offer.validUntil}
                  </span>
                  <Button variant="secondary" size="sm" href="/order">
                    {t('global.nav.order')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Happy Hours Block & Events Listing */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="signboard" className="space-y-3">
              <Badge kind="offer" label="Daily Lunch Privilege" />
              <h2 className="font-serif text-2xl text-gold text-glow-gold">
                {t('offers.happy_hours.heading')}
              </h2>
              <p className="font-mono text-sm text-text">{t('offers.happy_hours.timing')}</p>
              {happyHoursOffers.map((hh) => (
                <p key={hh.id} className="text-sm text-muted">
                  {hh.description}
                </p>
              ))}
            </Card>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-text">All-Day Experiences at Caffè & Tè</h2>
              {SEED_EVENTS.map((evt) => (
                <Card key={evt.id} variant="surface" className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      kind={evt.isUpcoming ? 'new' : 'neutral'}
                      label={evt.isUpcoming ? 'Featured Experience' : 'Past Event'}
                    />
                    <span className="font-mono text-xs text-muted">
                      {evt.dateLabel} · {evt.timeLabel}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-text">{evt.title}</h3>
                  <p className="text-sm text-muted">{evt.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Catering and Party Bookings Enquiry Form (PRD 7.7) */}
      <Section variant="surface" className="border-t border-gold/25">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 space-y-2">
            <h2 className="font-serif text-3xl text-gold">{t('offers.catering.heading')}</h2>
            <p className="text-sm text-muted">{t('offers.catering.subtext')}</p>
          </div>

          {submittedRef ? (
            <Card variant="signboard" className="space-y-3 text-center">
              <Badge kind="veg" label="Enquiry Received" />
              <h3 className="font-serif text-2xl text-gold">Thank You — Our Events Team Will Call You</h3>
              <p className="text-sm text-muted font-mono">
                {`Reference ID: ${submittedRef}`}
              </p>
              <Button variant="secondary" size="sm" onClick={() => setSubmittedRef(null)}>
                Submit Another Enquiry
              </Button>
            </Card>
          ) : (
            <Card variant="dark">
              <form onSubmit={handleCateringSubmit} className="space-y-4" noValidate>
                <input
                  type="text"
                  name="website_hp"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  className="sr-only"
                  aria-hidden="true"
                />
                {formError && (
                  <p role="alert" className="p-3 text-xs bg-crimson text-cream rounded-xs">
                    {formError}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    id="catering-name"
                    label="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <PhoneInput
                    id="catering-phone"
                    label="Phone / WhatsApp Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EmailInput
                    id="catering-email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <SelectInput
                    id="catering-event-type"
                    label="Occasion / Gathering Type"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    options={[
                      { value: 'BIRTHDAY_ANNIVERSARY', label: 'Birthday / Anniversary Celebration' },
                      { value: 'CORPORATE_DINNER', label: 'Corporate Team Dinner (Viman Nagar)' },
                      { value: 'OUTDOOR_CATERING', label: 'Bespoke Outdoor / Home Catering' },
                      { value: 'PRIVATE_BANQUET', label: 'Large Family Patio Gathering' },
                    ]}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <DateInput
                    id="catering-date"
                    label="Preferred Date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                  <TextInput
                    id="catering-guests"
                    label="Expected Guests"
                    inputMode="numeric"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  />
                  <SelectInput
                    id="catering-budget"
                    label="Menu Package Preference"
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    options={[
                      { value: 'STANDARD', label: 'Classic Multi-Cuisine (₹650 / guest)' },
                      { value: 'PREMIUM', label: 'Signature Feast (₹950 / guest)' },
                      { value: 'BESPOKE', label: 'Custom Bar & Dining Package (₹1,350+ / guest)' },
                    ]}
                  />
                </div>
                <TextareaInput
                  id="catering-notes"
                  label="Special Dietary, Seating or Cake Requests"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
                  {submitting ? 'Sending Enquiry...' : t('offers.catering.submit')}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </Section>
    </>
  );
}

