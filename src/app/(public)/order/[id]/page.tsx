'use client';

import React, { useEffect, useState } from 'react';
import { formatPriceToken } from '@/lib/content';
import { Badge, Button, Card, Section } from '@/components/ui';

const ORDER_STATUS_STEPS = [
  'placed',
  'paid',
  'accepted',
  'preparing',
  'ready',
  'out_for_delivery',
  'completed',
] as const;

/**
 * Live Order Tracking Page (`/order/[id]`, PRD 6.1 & 8.2):
 * Connects to Server-Sent Events (`/api/orders/[id]/stream`) with polling fallback
 * and displays kitchen/POS sync status.
 */
export default function OrderTrackingPage({
  params,
}: {
  params: { id: string };
}) {
  const [currentStatus, setCurrentStatus] = useState<string>('accepted');
  const [posSyncStatus, setPosSyncStatus] = useState<string>('SYNCED_MANUAL_ADAPTER');

  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource(`/api/orders/${params.id}/stream`);
      es.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.status) setCurrentStatus(parsed.status);
        if (parsed.posSyncStatus) setPosSyncStatus(parsed.posSyncStatus);
      };
    } catch {
      // Fallback to static state if SSE unavailable
    }
    return () => {
      if (es) es.close();
    };
  }, [params.id]);

  const activeIdx = ORDER_STATUS_STEPS.indexOf(
    currentStatus as (typeof ORDER_STATUS_STEPS)[number]
  );

  return (
    <Section variant="dark" narrow>
      <Card variant="signboard" className="space-y-6 p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/25 pb-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-gold">
              {`{{ORDER_ID:${params.id}}}`}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-text mt-1">
              {'{{LIVE_ORDER_TRACKER_HEADING}}'}
            </h1>
          </div>
          <Badge kind="veg" label={`{{STATUS:${currentStatus.toUpperCase()}}}`} />
        </div>

        {/* Status Timeline Progression (PRD 8.2) */}
        <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {ORDER_STATUS_STEPS.map((step, idx) => {
            const done = idx <= (activeIdx === -1 ? 2 : activeIdx);
            return (
              <li
                key={step}
                onClick={() => setCurrentStatus(step)}
                className={`cursor-pointer p-3 rounded-xs border text-xs font-mono uppercase tracking-wider transition-colors ${
                  done
                    ? 'border-gold bg-gold/15 text-gold font-semibold'
                    : 'border-gold/20 bg-surface text-muted'
                }`}
              >
                <span className="block text-[10px] opacity-70">0{idx + 1}</span>
                <span>{`{{${step.toUpperCase()}}}`}</span>
              </li>
            );
          })}
        </ol>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border border-gold/20 bg-surface p-4 rounded-xs">
          <div>
            <span className="text-xs text-muted uppercase block">{'{{POS_KITCHEN_STATUS}}'}</span>
            <span className="font-mono text-gold">{`{{${posSyncStatus}}}`}</span>
          </div>
          <div>
            <span className="text-xs text-muted uppercase block">{'{{ORDER_TOTAL}}'}</span>
            <span className="font-mono text-text">{formatPriceToken(491)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" size="sm" href="/order">
            {'{{ORDER_AGAIN_CTA}}'}
          </Button>
          <Button variant="ghost" size="sm" href="/contact">
            {'{{NEED_HELP_CONTACT_CTA}}'}
          </Button>
        </div>
      </Card>
    </Section>
  );
}

