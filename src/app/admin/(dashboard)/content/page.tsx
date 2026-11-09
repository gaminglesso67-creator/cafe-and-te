'use client';

import React, { useState } from 'react';
import { getAllContentEntries, setContentOverride } from '@/lib/content';
import { getStore } from '@/lib/db';
import { PermissionGuard } from '@/components/admin/AdminShell';
import {
  Button,
  Card,
  ResponsiveTable,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Content, Banners & Opening Hours Editor (`/admin/content`, PRD 6.2, 9.5 & 11.5):
 * Allows editing namespaced ContentBlock keys (`home.hero.title`, etc.) and Opening Hours
 * without touching code structure.
 */
export default function AdminContentPage() {
  const store = getStore();
  const { notify } = useToast();
  const [entries, setEntries] = useState<Record<string, string>>(() => getAllContentEntries());
  const [filterKey, setFilterKey] = useState('home.');
  const [editingKey, setEditingKey] = useState<string>('home.hero.title');
  const [editingValue, setEditingValue] = useState<string>(entries['home.hero.title'] ?? '');
  const [hours, setHours] = useState([...store.openingHours]);

  const handleSaveContentKey = (e: React.FormEvent) => {
    e.preventDefault();
    setContentOverride(editingKey, editingValue);
    setEntries(getAllContentEntries());
    notify(`Updated content key: ${editingKey}`, 'success');
  };

  const toggleDayClosed = (dayOfWeek: number) => {
    const updated = hours.map((h) =>
      h.dayOfWeek === dayOfWeek ? { ...h, isClosed: !h.isClosed } : h
    );
    store.openingHours = updated;
    setHours(updated);
    notify('{{OPENING_HOURS_UPDATED}}', 'success');
  };

  const matchingKeys = Object.entries(entries)
    .filter(([k]) => k.toLowerCase().includes(filterKey.toLowerCase()))
    .slice(0, 15);

  return (
    <PermissionGuard capability="content_offers_hours:edit">
      <div className="space-y-8">
        <div className="border-b border-gold/25 pb-4">
          <h1 className="font-serif text-3xl text-gold">
            {'{{BANNERS_HOURS_AND_CONTENT_BLOCKS_EDITOR}}'}
          </h1>
          <p className="text-xs text-muted">{'{{PRD_11_5_NAMESPACED_CONTENT_LAYER}}'}</p>
        </div>

        {/* 1. Opening Hours Live Control */}
        <Card variant="surface" className="space-y-4">
          <h2 className="font-serif text-2xl text-gold">{'{{OPENING_HOURS_SCHEDULE}}'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {hours.map((h) => (
              <div
                key={h.id}
                className="p-3 rounded-xs border border-gold/20 bg-bg flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <p className="text-text font-medium">{h.dayLabel}</p>
                  <p className="font-mono text-muted">
                    {h.isClosed ? 'CLOSED' : `${h.openTime}–${h.closeTime}`}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleDayClosed(h.dayOfWeek)}
                >
                  {h.isClosed ? '{{OPEN}}' : '{{CLOSE}}'}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* 2. ContentBlock Key/Value Editor */}
        <Card variant="surface" className="space-y-4">
          <h2 className="font-serif text-2xl text-gold">{'{{CONTENT_BLOCK_KEY_VALUE_EDITOR}}'}</h2>
          <form onSubmit={handleSaveContentKey} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <TextInput
                id="content-key-input"
                label={'{{CONTENT_KEY}}'}
                value={editingKey}
                onChange={(e) => setEditingKey(e.target.value)}
              />
            </div>
            <div className="md:col-span-5">
              <TextInput
                id="content-val-input"
                label={'{{PLACEHOLDER_OR_FINAL_VALUE}}'}
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <Button type="submit" variant="primary" size="md" fullWidth>
                {'{{SAVE_CONTENT_KEY}}'}
              </Button>
            </div>
          </form>

          <TextInput
            id="filter-content-keys"
            label={'{{FILTER_NAMESPACE}} (home., menu., global., offers.)'}
            value={filterKey}
            onChange={(e) => setFilterKey(e.target.value)}
          />

          <ResponsiveTable
            rowKey={([k]) => k}
            data={matchingKeys}
            columns={[
              {
                key: 'k',
                header: 'Key',
                render: ([k]) => <span className="font-mono text-xs text-gold">{k}</span>,
              },
              { key: 'v', header: 'Current Value', render: ([, v]) => v },
              {
                key: 'act',
                header: 'Select',
                render: ([k, v]) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingKey(k);
                      setEditingValue(v);
                    }}
                  >
                    {'{{LOAD_INTO_EDITOR}}'}
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </PermissionGuard>
  );
}

