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
      total: 1085,
      date: 'Today · 8:15 PM',
      type: 'DELIVERY',
    },
    {
      id: 'ORD-1000',
      status: 'completed',
      total: 880,
      date: 'Last Sunday · 1:30 PM',
      type: 'PICKUP',
    },
  ];

  const sampleReservations = [
    {
      id: 'RES-2001',
      date: 'Upcoming Saturday',
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
              Saanjh Viman Nagar Guest Portal
            </p>
            <h1 className="font-serif text-4xl text-gold text-glow-gold">
              My Bookings & Orders
            </h1>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSignedIn((v) => !v)}
          >
            {signedIn ? 'Switch to Phone OTP Login' : 'View Guest Dashboard'}
          </Button>
        </div>
      </Section>

      <Section variant="dark">
        {!signedIn ? (
          <div className="max-w-md mx-auto">
            <Card variant="surface" className="space-y-4">
              <h2 className="font-serif text-2xl text-text">Sign In with Mobile OTP</h2>
              <PhoneInput
                id="account-phone"
                label="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextInput
                id="account-otp"
                label="One-Time Passcode (OTP)"
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
                  notify('Signed in to Saanjh Guest Portal', 'success');
                }}
              >
                Verify & Sign In
              </Button>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Orders Column */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-2xl text-gold">Recent Online Orders</h2>
              {sampleOrders.map((ord) => (
                <Card
                  key={ord.id}
                  variant="surface"
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-gold font-semibold">{ord.id}</span>
                      <Badge kind="neutral" label={ord.status.toUpperCase()} />
                    </div>
                    <p className="text-xs text-muted">
                      {ord.date} · {ord.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-text">
                      {formatPriceToken(ord.total)}
                    </span>
                    <Button variant="secondary" size="sm" href={`/order/${ord.id}`}>
                      Track Order
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Reservations Column */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif text-2xl text-gold">Table Reservations</h2>
              {sampleReservations.map((res) => (
                <Card key={res.id} variant="surface" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gold">{res.id}</span>
                    <Badge kind="veg" label={res.status.toUpperCase()} />
                  </div>
                  <p className="text-sm text-text">
                    {res.date} · {res.time} · {res.guests} Guests
                  </p>
                  <Link
                    href={`/reservation/${res.id}`}
                    className="min-h-11 inline-flex items-center text-xs uppercase tracking-wider text-gold underline underline-offset-4"
                  >
                    Manage Reservation →
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

