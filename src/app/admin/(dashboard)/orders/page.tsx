'use client';

import React, { useState } from 'react';
import { formatPriceToken } from '@/lib/content';
import { appendAuditLog, getStore, OrderRecord } from '@/lib/db';
import { canIssueRefund } from '@/lib/auth/rbac';
import { PermissionGuard, useAdminSession } from '@/components/admin/AdminShell';
import {
  Badge,
  Button,
  Card,
  DrawerModal,
  SelectInput,
  TextInput,
  useToast,
} from '@/components/ui';

const KANBAN_COLUMNS: OrderRecord['status'][] = [
  'paid',
  'accepted',
  'preparing',
  'ready',
  'out_for_delivery',
  'completed',
];

/**
 * Live Order Board (`/admin/orders`, PRD 6.2 & 9.3):
 * - Kanban board by status + tablet/phone responsive cards
 * - Actions: accept, reject (with reason), mark preparing/ready/dispatched/completed,
 *   refund (enforcing RBAC limit), reprint kitchen ticket (`ManualAdapter`), resend to POS
 */
export default function AdminOrdersPage() {
  const store = getStore();
  const { role, email, playNewOrderAlert } = useAdminSession();
  const { notify } = useToast();

  const [orders, setOrders] = useState<OrderRecord[]>([...store.orders]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'DELIVERY' | 'PICKUP'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [printingTicket, setPrintingTicket] = useState<OrderRecord | null>(null);

  const updateOrderStatus = (orderId: string, nextStatus: OrderRecord['status'], reason?: string) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: nextStatus, rejectionReason: reason } : o
    );
    store.orders = updated;
    setOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: nextStatus, rejectionReason: reason });
    }
    appendAuditLog({
      actorEmail: email,
      actorRole: role,
      action: `ORDER_STATUS_${nextStatus.toUpperCase()}`,
      entityType: 'Order',
      entityId: orderId,
      detail: reason ? `Reason: ${reason}` : `Updated to ${nextStatus}`,
    });
    notify(`Order ${orderId} → ${nextStatus}`, 'success');
  };

  const handleRefund = (order: OrderRecord) => {
    const check = canIssueRefund(role, order.grandTotal);
    if (!check.allowed) {
      notify(check.reason ?? '{{REFUND_NOT_PERMITTED}}', 'error');
      return;
    }
    updateOrderStatus(order.id, 'refunded');
  };

  const handleResendPos = (order: OrderRecord) => {
    appendAuditLog({
      actorEmail: email,
      actorRole: role,
      action: 'POS_MANUAL_REPUSH',
      entityType: 'Order',
      entityId: order.id,
      detail: `Re-queued order ${order.orderNumber} via ${store.activePosAdapter} adapter`,
    });
    notify(`{{POS_REPUSH_QUEUED:${order.id}}}`, 'success');
  };

  const filteredOrders = orders.filter((o) => {
    if (typeFilter !== 'ALL' && o.orderType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <PermissionGuard capability="orders_reservations:manage">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/25 pb-4">
          <div>
            <h1 className="font-serif text-3xl text-gold">{'{{LIVE_ORDER_BOARD_HEADING}}'}</h1>
            <p className="text-xs text-muted">{'{{TABLET_OPTIMIZED_KANBAN_AND_KITCHEN_TICKET}}'}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              playNewOrderAlert();
              notify('{{NEW_ORDER_AUDIO_CHIME_TESTED}}', 'info');
            }}
          >
            {'{{TRIGGER_NEW_ORDER_ALERT}}'}
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <TextInput
              id="admin-order-search"
              label={'{{SEARCH_BY_ORDER_NAME_OR_PHONE}}'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <SelectInput
            id="admin-order-type"
            label={'{{FILTER_ORDER_TYPE}}'}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            options={[
              { value: 'ALL', label: '{{ALL_TYPES}}' },
              { value: 'DELIVERY', label: '{{DELIVERY_ONLY}}' },
              { value: 'PICKUP', label: '{{PICKUP_ONLY}}' },
            ]}
          />
        </div>

        {/* Kanban Board across Statuses */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {KANBAN_COLUMNS.map((statusCol) => {
            const colOrders = filteredOrders.filter((o) => o.status === statusCol);
            return (
              <div
                key={statusCol}
                className="rounded-sm border border-gold/25 bg-surface/60 p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-gold/20 pb-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold">
                    {`{{STAGE:${statusCol.toUpperCase()}}}`}
                  </span>
                  <Badge kind="neutral" label={String(colOrders.length)} />
                </div>

                {colOrders.length === 0 ? (
                  <p className="text-xs text-muted py-6 text-center">{'{{NO_ORDERS_IN_STAGE}}'}</p>
                ) : (
                  colOrders.map((ord) => (
                    <Card key={ord.id} variant="dark" className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm text-gold font-semibold">{ord.id}</span>
                        <Badge kind="neutral" label={ord.orderType} />
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p className="text-text font-medium">{ord.customerName}</p>
                        <p className="text-muted font-mono">{ord.customerPhone}</p>
                        <p className="text-gold font-mono pt-1">
                          {formatPriceToken(ord.grandTotal)} · {ord.paymentStatus}
                        </p>
                      </div>
                      <ul className="text-xs text-muted border-t border-gold/15 pt-2 space-y-1">
                        {ord.items.map((it, idx) => (
                          <li key={idx}>
                            {it.quantity}× {it.name}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 flex flex-wrap gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedOrder(ord)}
                        >
                          {'{{MANAGE_ORDER}}'}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPrintingTicket(ord)}
                        >
                          {'{{KITCHEN_TICKET}}'}
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            );
          })}
        </div>

        {/* Order Detail & Actions Bottom Sheet / Dialog */}
        <DrawerModal
          open={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={selectedOrder ? `Order ${selectedOrder.id}` : ''}
          mode="dialog"
        >
          {selectedOrder && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/20 pb-3">
                <div>
                  <p className="text-sm text-text font-medium">{selectedOrder.customerName}</p>
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="text-xs font-mono text-gold underline"
                  >
                    {selectedOrder.customerPhone}
                  </a>
                </div>
                <Badge kind="veg" label={`POS: ${selectedOrder.posSyncStatus}`} />
              </div>

              {/* Status Progression Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase text-muted">
                  {'{{ADVANCE_ORDER_STATUS}}:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      'accepted',
                      'preparing',
                      'ready',
                      'out_for_delivery',
                      'picked_up',
                      'completed',
                    ] as const
                  ).map((st) => (
                    <Button
                      key={st}
                      variant={selectedOrder.status === st ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, st)}
                    >
                      {st.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Reject with Reason */}
              <div className="p-3 border border-gold/20 rounded-xs bg-bg space-y-2">
                <TextInput
                  id="reject-reason-input"
                  label={'{{REJECTION_REASON_INPUT}}'}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      updateOrderStatus(
                        selectedOrder.id,
                        'rejected',
                        rejectReason || '{{KITCHEN_CAPACITY_FULL}}'
                      )
                    }
                  >
                    {'{{REJECT_ORDER_CTA}}'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRefund(selectedOrder)}
                  >
                    {'{{ISSUE_REFUND_CTA}}'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResendPos(selectedOrder)}
                  >
                    {'{{RESEND_TO_POS_CTA}}'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DrawerModal>

        {/* ManualAdapter Printable Kitchen Ticket Modal (PRD 10.1 & 10.2) */}
        <DrawerModal
          open={Boolean(printingTicket)}
          onClose={() => setPrintingTicket(null)}
          title={'{{KITCHEN_ORDER_TICKET_KOT}}'}
          mode="dialog"
          footer={
            <Button variant="primary" size="sm" fullWidth onClick={() => window.print()}>
              {'{{PRINT_KITCHEN_TICKET_CTA}}'}
            </Button>
          }
        >
          {printingTicket && (
            <div className="font-mono text-xs space-y-3 p-4 bg-bg border border-gold/40 rounded-xs">
              <div className="text-center border-b border-dashed border-gold/40 pb-2">
                <p className="text-sm font-bold text-gold">{'{{SAANJH_KITCHEN_TICKET}}'}</p>
                <p>
                  {printingTicket.orderNumber} · {printingTicket.orderType}
                </p>
              </div>
              <div className="space-y-1">
                {printingTicket.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {it.quantity} x {it.name}
                    </span>
                    <span>{formatPriceToken(it.unitPrice * it.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gold/40 pt-2 flex justify-between font-bold">
                <span>{'{{TOTAL}}'}</span>
                <span>{formatPriceToken(printingTicket.grandTotal)}</span>
              </div>
            </div>
          )}
        </DrawerModal>
      </div>
    </PermissionGuard>
  );
}
