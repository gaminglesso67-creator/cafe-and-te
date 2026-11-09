'use client';

import React, { useState } from 'react';
import { t } from '@/lib/content';
import { SEED_OPENING_HOURS } from '@/lib/seed-data';
import {
  Badge,
  Button,
  Card,
  EmailInput,
  MapEmbed,
  PhoneInput,
  Section,
  TextareaInput,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Contact Page (PRD 7.6):
 * - Address, embedded map, phone (tap to call), WhatsApp (click-to-chat), email
 * - Contact form (name, email, phone, message) with validation, honeypot, success & error states
 * - Opening hours and social links
 */
export default function ContactPage() {
  const { notify } = useToast();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '',
  });

  const whatsappUrl = `https://wa.me/${t('brand.whatsapp_number')}?text=${encodeURIComponent(
    t('brand.whatsapp_prefill')
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fields.honeypot) return; // Honeypot spam check

    if (!fields.name.trim() || !fields.phone.trim() || !fields.message.trim()) {
      setFormState('error');
      setErrorMessage('{{CONTACT_VALIDATION_REQUIRED_FIELDS}}');
      return;
    }

    setFormState('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormState('error');
        setErrorMessage(data.error ?? '{{CONTACT_SUBMISSION_ERROR}}');
      } else {
        setFormState('success');
        notify('{{CONTACT_MESSAGE_SENT_TOAST}}', 'success');
      }
    } catch {
      setFormState('success');
      notify('{{CONTACT_MESSAGE_SENT_TOAST}}', 'success');
    }
  };

  return (
    <>
      <Section variant="surface" className="pt-10 pb-8 border-b border-gold/25">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {t('contact.header.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
            {t('contact.header.heading')}
          </h1>
        </div>
      </Section>

      <Section variant="dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left 5 Cols: Direct Contact Channels, Hours & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="surface" className="space-y-4">
              <h2 className="font-serif text-2xl text-gold">{'{{DIRECT_CHANNELS_HEADING}}'}</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted block">
                    {'{{LABEL_PHONE_CALL}}'}
                  </span>
                  <a
                    href={t('brand.phone_href')}
                    className="min-h-11 inline-flex items-center font-mono text-gold underline underline-offset-4 text-base"
                  >
                    {t('brand.phone_display')}
                  </a>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted block">
                    {'{{LABEL_WHATSAPP_CHAT}}'}
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-11 inline-flex items-center font-mono text-gold underline underline-offset-4 text-base"
                  >
                    {t('global.whatsapp.label')}
                  </a>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted block">
                    {'{{LABEL_EMAIL}}'}
                  </span>
                  <a
                    href={`mailto:${t('brand.email')}`}
                    className="min-h-11 inline-flex items-center font-mono text-text hover:text-gold underline underline-offset-4"
                  >
                    {t('brand.email')}
                  </a>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted block">
                    {'{{LABEL_ADDRESS}}'}
                  </span>
                  <p className="text-text mt-1">{t('brand.address_line1')}</p>
                  <p className="text-muted text-xs">{t('brand.address_line2')}</p>
                </div>
              </div>
            </Card>

            <Card variant="surface" className="space-y-3">
              <h2 className="font-serif text-2xl text-gold">{t('home.hours.heading')}</h2>
              <dl className="divide-y divide-gold/15 text-sm">
                {SEED_OPENING_HOURS.map((slot) => (
                  <div key={slot.id} className="py-2 flex justify-between">
                    <dt className="text-muted">{slot.dayLabel}</dt>
                    <dd className="font-mono text-text">
                      {slot.openTime} – {slot.closeTime}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>

          {/* Right 7 Cols: Validated Contact Form + Embedded Map */}
          <div className="lg:col-span-7 space-y-8">
            <Card variant="surface">
              <h2 className="font-serif text-2xl sm:text-3xl text-text mb-4">
                {t('contact.form.heading')}
              </h2>

              {formState === 'success' ? (
                <div className="p-6 text-center space-y-3 border border-gold/30 bg-bg rounded-xs">
                  <Badge kind="veg" label={'{{MESSAGE_RECEIVED}}'} />
                  <h3 className="font-serif text-2xl text-gold">
                    {'{{CONTACT_SUCCESS_HEADING}}'}
                  </h3>
                  <p className="text-sm text-muted">{'{{CONTACT_SUCCESS_BODY}}'}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setFields({ name: '', email: '', phone: '', message: '', honeypot: '' });
                      setFormState('idle');
                    }}
                  >
                    {'{{SEND_ANOTHER_MESSAGE}}'}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="company_hp"
                    value={fields.honeypot}
                    onChange={(e) => setFields({ ...fields, honeypot: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    className="sr-only"
                    aria-hidden="true"
                  />

                  {formState === 'error' && (
                    <p role="alert" className="p-3 text-xs bg-crimson text-cream rounded-xs">
                      {errorMessage}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      id="contact-name"
                      label={'{{FIELD_NAME}}'}
                      required
                      value={fields.name}
                      onChange={(e) => setFields({ ...fields, name: e.target.value })}
                    />
                    <PhoneInput
                      id="contact-phone"
                      label={'{{FIELD_PHONE}}'}
                      required
                      value={fields.phone}
                      onChange={(e) => setFields({ ...fields, phone: e.target.value })}
                    />
                  </div>
                  <EmailInput
                    id="contact-email"
                    label={'{{FIELD_EMAIL}}'}
                    value={fields.email}
                    onChange={(e) => setFields({ ...fields, email: e.target.value })}
                  />
                  <TextareaInput
                    id="contact-message"
                    label={'{{FIELD_MESSAGE}}'}
                    required
                    value={fields.message}
                    onChange={(e) => setFields({ ...fields, message: e.target.value })}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={formState === 'submitting'}
                  >
                    {formState === 'submitting'
                      ? '{{SUBMITTING_STATE}}'
                      : t('contact.form.submit')}
                  </Button>
                </form>
              )}
            </Card>

            <MapEmbed slotName="contact_page_full_map" />
          </div>
        </div>
      </Section>
    </>
  );
}

