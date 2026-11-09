'use client';

import React, { useState } from 'react';
import { formatPriceToken } from '@/lib/content';
import { appendAuditLog, getStore } from '@/lib/db';
import { MenuItemSlot } from '@/lib/seed-data';
import { PermissionGuard, useAdminSession } from '@/components/admin/AdminShell';
import {
  Badge,
  Button,
  DrawerModal,
  ResponsiveTable,
  SelectInput,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Menu Management CRUD (`/admin/menu`, PRD 6.2 & 9.2):
 * Guarded by `menu:edit` (Manager and Owner only; Staff blocked per PRD 9.9).
 * Supports adding/editing items, changing prices (with audit log), CSV export, and POS sync status.
 */
export default function AdminMenuPage() {
  const store = getStore();
  const { role, email } = useAdminSession();
  const { notify } = useToast();

  const [items, setItems] = useState<MenuItemSlot[]>([...store.menuItems]);
  const [editingItem, setEditingItem] = useState<MenuItemSlot | null>(null);
  const [priceDraft, setPriceDraft] = useState<string>('');
  const [nameDraft, setNameDraft] = useState<string>('');

  const openEditor = (item: MenuItemSlot) => {
    setEditingItem(item);
    setNameDraft(item.name);
    setPriceDraft(String(item.price));
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const nextPrice = Number(priceDraft) || editingItem.price;
    const updated = items.map((i) =>
      i.id === editingItem.id ? { ...i, name: nameDraft, price: nextPrice } : i
    );
    store.menuItems = updated;
    setItems(updated);

    appendAuditLog({
      actorEmail: email,
      actorRole: role,
      action: 'MENU_ITEM_UPDATED',
      entityType: 'MenuItem',
      entityId: editingItem.id,
      detail: `${nameDraft} price set to INR ${nextPrice}`,
    });

    setEditingItem(null);
    notify('{{MENU_ITEM_SAVED_AND_LOGGED}}', 'success');
  };

  const handleExportCsv = () => {
    const header = 'id,slug,category,name,price,isVeg,isAvailable\n';
    const rows = items
      .map(
        (i) =>
          `${i.id},${i.slug},${i.categoryName},${i.name},${i.price},${i.isVeg},${i.isAvailable}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saanjh-menu-skeleton.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('{{MENU_CSV_EXPORTED}}', 'success');
  };

  const handleAddPlaceholderItem = () => {
    const newId = `item-${items.length + 1}`;
    const created: MenuItemSlot = {
      id: newId,
      slug: `dish-${items.length + 1}`,
      categoryId: store.categories[0]?.id ?? 'cat-starters',
      categoryName: store.categories[0]?.name ?? '{{CATEGORY_1_NAME}}',
      name: `{{MENU_ITEM_${items.length + 1}_NAME}}`,
      description: `{{MENU_ITEM_${items.length + 1}_DESCRIPTION}}`,
      price: 390,
      imageSlot: `menu_item_${items.length + 1}`,
      imageAspect: '4x3',
      isVeg: true,
      isSignature: false,
      isNew: true,
      isAvailable: true,
      prepTimeMins: 20,
      taxRatePercent: 5,
      allergens: [],
      variants: [{ id: `var-${newId}`, name: '{{VARIANT_REGULAR}}', priceDelta: 0 }],
      addOns: [],
    };
    const updated = [created, ...items];
    store.menuItems = updated;
    setItems(updated);
    notify('{{NEW_MENU_ITEM_SLOT_ADDED}}', 'success');
  };

  return (
    <PermissionGuard capability="menu:edit">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/25 pb-4">
          <div>
            <h1 className="font-serif text-3xl text-gold">{'{{MENU_MANAGEMENT_CRUD_HEADING}}'}</h1>
            <p className="text-xs text-muted">{'{{CATEGORIES_ITEMS_PRICES_CSV_POS_SYNC}}'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportCsv}>
              {'{{EXPORT_CSV_CTA}}'}
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddPlaceholderItem}>
              + {'{{ADD_MENU_ITEM_SLOT}}'}
            </Button>
          </div>
        </div>

        <ResponsiveTable
          rowKey={(i) => i.id}
          data={items}
          columns={[
            { key: 'name', header: 'Dish Slot', render: (i) => i.name },
            { key: 'cat', header: 'Category', render: (i) => i.categoryName },
            {
              key: 'diet',
              header: 'Diet',
              render: (i) => <Badge kind={i.isVeg ? 'veg' : 'non_veg'} />,
            },
            {
              key: 'price',
              header: 'Price',
              render: (i) => <span className="font-mono text-gold">{formatPriceToken(i.price)}</span>,
            },
            {
              key: 'pos',
              header: 'POS Sync',
              render: () => <Badge kind="neutral" label={'{{POS_SYNCED}}'} />,
            },
            {
              key: 'edit',
              header: 'Action',
              render: (i) => (
                <Button variant="secondary" size="sm" onClick={() => openEditor(i)}>
                  {'{{EDIT_PRICE_AND_DETAILS}}'}
                </Button>
              ),
            },
          ]}
        />

        <DrawerModal
          open={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title={'{{EDIT_MENU_ITEM}}'}
          mode="dialog"
        >
          {editingItem && (
            <form onSubmit={handleSaveItem} className="space-y-4">
              <TextInput
                id="edit-item-name"
                label={'{{FIELD_ITEM_NAME_TOKEN}}'}
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
              />
              <TextInput
                id="edit-item-price"
                label={'{{FIELD_PRICE_INR}}'}
                inputMode="numeric"
                value={priceDraft}
                onChange={(e) => setPriceDraft(e.target.value)}
              />
              <SelectInput
                id="edit-item-schedule"
                label={'{{FIELD_AVAILABILITY_SCHEDULE}}'}
                options={[
                  { value: 'ALL_DAY', label: '{{ALL_DAY_MENU}}' },
                  { value: 'LUNCH_ONLY', label: '{{LUNCH_12_TO_16}}' },
                  { value: 'DINNER_ONLY', label: '{{DINNER_19_TO_2330}}' },
                ]}
              />
              <Button type="submit" variant="primary" size="md" fullWidth>
                {'{{SAVE_AND_WRITE_AUDIT_LOG}}'}
              </Button>
            </form>
          )}
        </DrawerModal>
      </div>
    </PermissionGuard>
  );
}
