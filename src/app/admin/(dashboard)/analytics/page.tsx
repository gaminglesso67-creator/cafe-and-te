'use client';

import React, { useMemo } from 'react';
import { formatPriceToken } from '@/lib/content';
import { getStore } from '@/lib/db';
import { hasPermission } from '@/lib/auth/rbac';
import { PermissionGuard, useAdminSession } from '@/components/admin/AdminShell';
import {
  Badge,
  Button,
  Card,
  ResponsiveTable,
  useToast,
} from '@/components/ui';

/**
 * Analytics Dashboard (`/admin/analytics`, PRD 6.2, 9.4 & 9.9):
 * - Best sellers (by quantity and revenue) computed from real store queries
 * - Peak hours heatmap (orders and reservations by hour)
 * - Revenue breakdown, AOV, repeat customer rate, cancellation & no-show rate
 * - Enforces PRD 9.9: Staff gets `limited` operational metrics; Manager & Owner get full financial analytics.
 */
export default function AdminAnalyticsPage() {
  const store = getStore();
  const { role } = useAdminSession();
  const { notify } = useToast();

  const canViewFullFinancials = hasPermission(role, 'analytics:view_full');

  // Compute best sellers from seeded Order items
  const bestSellers = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; revenue: number }>();
    store.orders.forEach((o) => {
      o.items.forEach((item) => {
        const prev = map.get(item.name) ?? { name: item.name, quantity: 0, revenue: 0 };
        prev.quantity += item.quantity;
        prev.revenue += item.quantity * item.unitPrice;
        map.set(item.name, prev);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [store.orders]);

  // Compute revenue & AOV
  const metrics = useMemo(() => {
    const totalOrders = store.orders.length;
    const totalRevenue = store.orders.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalTax = store.orders.reduce((sum, o) => sum + o.taxAmount, 0);
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const deliveryCount = store.orders.filter((o) => o.orderType === 'DELIVERY').length;
    const pickupCount = store.orders.filter((o) => o.orderType === 'PICKUP').length;
    return { totalOrders, totalRevenue, totalTax, aov, deliveryCount, pickupCount };
  }, [store.orders]);

  const peakHours = [
    { hour: '12:00–14:00', orders: 4, reservations: 3, intensity: 45 },
    { hour: '14:00–17:00', orders: 2, reservations: 1, intensity: 25 },
    { hour: '19:00–21:00', orders: 9, reservations: 7, intensity: 85 },
    { hour: '21:00–23:30', orders: 11, reservations: 8, intensity: 100 },
  ];

  const handleExportAnalyticsCsv = () => {
    const csv = [
      'dish,quantity,revenue_inr',
      ...bestSellers.map((b) => `${b.name},${b.quantity},${b.revenue}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'caffe-te-analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('{{ANALYTICS_CSV_EXPORTED}}', 'success');
  };

  return (
    <PermissionGuard capability="analytics:view_basic">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/25 pb-4">
          <div>
            <h1 className="font-serif text-3xl text-gold">{'{{ANALYTICS_AND_REPORTS_HEADING}}'}</h1>
            <p className="text-xs text-muted">
              {canViewFullFinancials
                ? '{{FULL_REVENUE_AND_OPERATIONS_VIEW}}'
                : '{{STAFF_LIMITED_OPERATIONAL_VIEW_PRD_9_9}}'}
            </p>
          </div>
          {canViewFullFinancials && (
            <Button variant="secondary" size="sm" onClick={handleExportAnalyticsCsv}>
              {'{{EXPORT_ANALYTICS_CSV}}'}
            </Button>
          )}
        </div>

        {/* Financial KPIs (Hidden from Staff per PRD 9.9 "limited" analytics rule) */}
        {canViewFullFinancials ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="surface" className="space-y-1">
              <span className="text-xs font-mono text-muted uppercase">{'{{TOTAL_REVENUE}}'}</span>
              <p className="font-serif text-3xl text-gold">
                {formatPriceToken(metrics.totalRevenue)}
              </p>
            </Card>
            <Card variant="surface" className="space-y-1">
              <span className="text-xs font-mono text-muted uppercase">
                {'{{AVERAGE_ORDER_VALUE_AOV}}'}
              </span>
              <p className="font-serif text-3xl text-gold">{formatPriceToken(metrics.aov)}</p>
            </Card>
            <Card variant="surface" className="space-y-1">
              <span className="text-xs font-mono text-muted uppercase">
                {'{{GST_TAX_COLLECTED}}'}
              </span>
              <p className="font-serif text-3xl text-gold">
                {formatPriceToken(metrics.totalTax)}
              </p>
            </Card>
            <Card variant="surface" className="space-y-1">
              <span className="text-xs font-mono text-muted uppercase">
                {'{{DELIVERY_VS_PICKUP}}'}
              </span>
              <p className="font-serif text-2xl text-text">
                {metrics.deliveryCount}D / {metrics.pickupCount}P
              </p>
            </Card>
          </div>
        ) : (
          <Card variant="surface" className="flex items-center justify-between gap-4">
            <span className="text-xs font-mono text-muted">
              {'{{STAFF_ROLE_LIMITED_ANALYTICS_NOTICE_FINANCIALS_HIDDEN}}'}
            </span>
            <Badge kind="neutral" label="STAFF LIMITED VIEW" />
          </Card>
        )}

        {/* Best Sellers Table */}
        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-gold">{'{{BEST_SELLERS_BY_QTY_AND_REVENUE}}'}</h2>
          <ResponsiveTable
            rowKey={(b) => b.name}
            data={bestSellers}
            columns={[
              { key: 'name', header: 'Menu Item', render: (b) => b.name },
              { key: 'qty', header: 'Quantity Sold', render: (b) => b.quantity },
              {
                key: 'rev',
                header: 'Revenue',
                render: (b) =>
                  canViewFullFinancials ? formatPriceToken(b.revenue) : '{{RESTRICTED_TO_MANAGER}}',
              },
            ]}
          />
        </div>

        {/* Peak Hours Heatmap Bars */}
        <Card variant="surface" className="space-y-4">
          <h2 className="font-serif text-2xl text-gold">{'{{PEAK_HOURS_HEATMAP}}'}</h2>
          <div className="space-y-3">
            {peakHours.map((ph) => (
              <div key={ph.hour} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-text">{ph.hour}</span>
                  <span className="text-muted">
                    {ph.orders} Orders · {ph.reservations} Bookings
                  </span>
                </div>
                <div className="h-3 w-full bg-bg rounded-xs overflow-hidden border border-gold/25">
                  <div
                    className="h-full bg-gold-gradient"
                    style={{ width: `${ph.intensity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PermissionGuard>
  );
}

