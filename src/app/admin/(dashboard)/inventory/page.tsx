'use client';

import React, { useState } from 'react';
import { formatPriceToken } from '@/lib/content';
import { appendAuditLog, getStore } from '@/lib/db';
import { MenuItemSlot } from '@/lib/seed-data';
import { PermissionGuard, useAdminSession } from '@/components/admin/AdminShell';
import { Badge, Button, Card, useToast } from '@/components/ui';

/**
 * Inventory & Out-of-Stock Quick Toggles (`/admin/inventory`, PRD 6.2 & 9.2):
 * Accessible to Staff, Manager, and Owner (`inventory:toggle_stock`).
 * Designed so floor/kitchen staff can mark an item out of stock in < 10 seconds on a phone/tablet.
 */
export default function AdminInventoryPage() {
  const store = getStore();
  const { role, email } = useAdminSession();
  const { notify } = useToast();
  const [items, setItems] = useState<MenuItemSlot[]>([...store.menuItems]);

  const toggleItemAvailability = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    store.menuItems = updated;
    setItems(updated);

    const target = updated.find((i) => i.id === id);
    appendAuditLog({
      actorEmail: email,
      actorRole: role,
      action: target?.isAvailable ? 'ITEM_MARKED_IN_STOCK' : 'ITEM_MARKED_OUT_OF_STOCK',
      entityType: 'MenuItem',
      entityId: id,
      detail: `${target?.name} availability set to ${target?.isAvailable}`,
    });
    notify(`${target?.name} → ${target?.isAvailable ? 'IN STOCK' : 'OUT OF STOCK'}`, 'info');
  };

  return (
    <PermissionGuard capability="inventory:toggle_stock">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/25 pb-4">
          <div>
            <h1 className="font-serif text-3xl text-gold">
              {'{{INVENTORY_QUICK_TOGGLES_HEADING}}'}
            </h1>
            <p className="text-xs text-muted">
              {'{{ONE_TAP_STOCK_TOGGLE_WITH_AUTO_NEXT_DAY_RESET}}'}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const allInStock = items.map((i) => ({ ...i, isAvailable: true }));
              store.menuItems = allInStock;
              setItems(allInStock);
              notify('{{ALL_ITEMS_RESET_TO_IN_STOCK}}', 'success');
            }}
          >
            {'{{RESET_ALL_IN_STOCK_CTA}}'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              variant="surface"
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge kind={item.isVeg ? 'veg' : 'non_veg'} />
                  <span className="font-serif text-lg text-text truncate">{item.name}</span>
                </div>
                <p className="font-mono text-xs text-muted">
                  {item.categoryName} · {formatPriceToken(item.price)}
                </p>
              </div>
              <Button
                variant={item.isAvailable ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => toggleItemAvailability(item.id)}
              >
                {item.isAvailable ? '{{IN_STOCK_TAP_TO_PAUSE}}' : '{{OUT_OF_STOCK_TAP_ENABLE}}'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
}

