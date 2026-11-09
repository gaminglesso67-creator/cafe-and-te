'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatPriceToken } from '@/lib/content';
import {
  Badge,
  Button,
  Card,
  PhoneInput,
  Section,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Customer Account Page (`/account`, PRD 6.1):
 * Optional guest/customer login + order history and reservation history slots.
 */
export default function CustomerAccountPage() {
  const { notify } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [signedIn, setSignedIn] = useState(true);

  const sampleOrders = [
    {
      id: 'ORD-1001',
      status: 'preparing',
      total: 1180,
      date: '{{SAMPLE_ORDER_DATE_1}}',
      type: 'DELIVERY',
    },
    {
      id: 'ORD-1000',
      status: 'completed',
      total: 840,
      date: '{{SAMPLE_ORDER_DATE_2}}',
      type: 'PICKUP',
    },
  ];

  const sampleReservations = [
    {
      id: 'RES-2001',
      date: '{{SAMPLE_RES_DATE_1}}',
      time: '20:00',
      guests: 4,
      status: 'confirmed',
    },
  ];

  return (
    <>
      <Section variant="surface" className="pt-10 pb-8 border-b border-gold/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              {'{{ACCOUNT_EYEBROW}}'}
            </p>
            <h1 className="font-serif text-4xl text-gold text-glow-gold">
              {'{{CUSTOMER_ACCOUNT_HEADING}}'}
            </h1>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSignedIn((v) => !v)}
          >
            {signedIn ? '{{SWITCH_TO_GUEST_LOGIN_VIEW}}' : '{{VIEW_SEEDED_CUSTOMER_PORTAL}}'}
          </Button>
        </div>
      </Section>

      <Section variant="dark">
        {!signedIn ? (
          <div className="max-w-md mx-auto">
            <Card variant="surface" className="space-y-4">
              <h2 className="font-serif text-2xl text-text">{'{{CUSTOMER_SIGN_IN_HEADING}}'}</h2>
              <PhoneInput
                id="account-phone"
                label={'{{FIELD_PHONE_NUMBER}}'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextInput
                id="account-otp"
                label={'{{FIELD_OTP_CODE}}'}
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  setSignedIn(true);
                  notify('{{SIGNED_IN_SUCCESS}}', 'success');
                }}
              >
                {'{{VERIFY_AND_SIGN_IN_CTA}}'}
              </Button>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Orders Column */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-2xl text-gold">{'{{MY_ORDERS_HEADING}}'}</h2>
              {sampleOrders.map((ord) => (
                <Card
                  key={ord.id}
                  variant="surface"
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-gold font-semibold">{ord.id}</span>
                      <Badge kind="neutral" label={`{{STATUS_${ord.status.toUpperCase()}}}`} />
                    </div>
                    <p className="text-xs text-muted">
                      {ord.date} · {`{{TYPE_${ord.type}}}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-text">
                      {formatPriceToken(ord.total)}
                    </span>
                    <Button variant="secondary" size="sm" href={`/order/${ord.id}`}>
                      {'{{TRACK_ORDER_CTA}}'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Reservations Column */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif text-2xl text-gold">{'{{MY_RESERVATIONS_HEADING}}'}</h2>
              {sampleReservations.map((res) => (
                <Card key={res.id} variant="surface" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gold">{res.id}</span>
                    <Badge kind="veg" label={`{{STATUS_${res.status.toUpperCase()}}}`} />
                  </div>
                  <p className="text-sm text-text">
                    {res.date} · {res.time} · {res.guests} {'{{GUESTS_LABEL}}'}
                  </p>
                  <Link
                    href={`/reservation/${res.id}`}
                    className="min-h-11 inline-flex items-center text-xs uppercase tracking-wider text-gold underline underline-offset-4"
                  >
                    {'{{MANAGE_RESERVATION_LINK}}'} →
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

