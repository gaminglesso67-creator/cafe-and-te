'use client';

import React, { useState } from 'react';
import { getStore } from '@/lib/db';
import { OfferSlot } from '@/lib/seed-data';
import { PermissionGuard } from '@/components/admin/AdminShell';
import {
  Badge,
  Button,
  Card,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Offers & Events Management (`/admin/offers`, PRD 6.2 & 9.5):
 * Guarded by `content_offers_hours:edit` (Manager & Owner).
 */
export default function AdminOffersPage() {
  const store = getStore();
  const { notify } = useToast();
  const [offers, setOffers] = useState<OfferSlot[]>([...store.offers]);
  const [newCode, setNewCode] = useState('');

  const toggleOffer = (id: string) => {
    const updated = offers.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o));
    store.offers = updated;
    setOffers(updated);
    notify('{{OFFER_STATUS_UPDATED}}', 'success');
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    const created: OfferSlot = {
      id: `offer-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      title: `{{OFFER_${offers.length + 1}_TITLE}}`,
      description: `{{OFFER_${offers.length + 1}_DESCRIPTION}}`,
      badgeText: '{{BADGE_OFFER}}',
      validFrom: '{{VALID_FROM_DATE}}',
      validUntil: '{{VALID_UNTIL_DATE}}',
      discountPercent: 15,
      minOrderAmount: 600,
      isHappyHour: false,
      isActive: true,
      imageSlot: `offer_banner_${offers.length + 1}`,
    };
    const updated = [created, ...offers];
    store.offers = updated;
    setOffers(updated);
    setNewCode('');
    notify('{{NEW_OFFER_CREATED}}', 'success');
  };

  return (
    <PermissionGuard capability="content_offers_hours:edit">
      <div className="space-y-6">
        <div className="border-b border-gold/25 pb-4">
          <h1 className="font-serif text-3xl text-gold">{'{{OFFERS_AND_EVENTS_MANAGER}}'}</h1>
        </div>

        <Card variant="surface">
          <form onSubmit={handleAddOffer} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <TextInput
                id="new-offer-code"
                label={'{{CREATE_PROMO_CODE_SLOT}}'}
                placeholder="FESTIVE20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              + {'{{CREATE_OFFER_SLOT}}'}
            </Button>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((o) => (
            <Card key={o.id} variant="surface" className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge kind="offer" label={o.code} />
                <Badge kind={o.isActive ? 'veg' : 'out_of_stock'} label={o.isActive ? 'ACTIVE' : 'PAUSED'} />
              </div>
              <h2 className="font-serif text-xl text-text">{o.title}</h2>
              <p className="text-xs text-muted">{o.description}</p>
              <Button variant="secondary" size="sm" onClick={() => toggleOffer(o.id)}>
                {o.isActive ? '{{PAUSE_OFFER}}' : '{{ACTIVATE_OFFER}}'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
}

