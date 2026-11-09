'use client';

import React, { useState } from 'react';
import { getStore } from '@/lib/db';
import { GalleryItemSlot } from '@/lib/seed-data';
import { PermissionGuard } from '@/components/admin/AdminShell';
import {
  Button,
  Card,
  ImageWithOverlay,
  SelectInput,
  TextInput,
  useToast,
} from '@/components/ui';

/**
 * Gallery & Media Asset Management (`/admin/gallery`, PRD 6.2 & 9.5):
 * Guarded by `content_offers_hours:edit` (Manager & Owner).
 */
export default function AdminGalleryPage() {
  const store = getStore();
  const { notify } = useToast();
  const [items, setItems] = useState<GalleryItemSlot[]>([...store.gallery]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'FOOD' | 'INTERIORS' | 'EVENTS'>('FOOD');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created: GalleryItemSlot = {
      id: `gal-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      imageSlot: `gallery_${newCategory.toLowerCase()}_${items.length + 1}`,
      aspect: '4x3',
    };
    const updated = [created, ...items];
    store.gallery = updated;
    setItems(updated);
    setNewTitle('');
    notify('{{GALLERY_SLOT_ADDED}}', 'success');
  };

  return (
    <PermissionGuard capability="content_offers_hours:edit">
      <div className="space-y-6">
        <div className="border-b border-gold/25 pb-4">
          <h1 className="font-serif text-3xl text-gold">{'{{GALLERY_AND_MEDIA_LIBRARY}}'}</h1>
        </div>

        <Card variant="surface">
          <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <TextInput
                id="gallery-new-title"
                label={'{{MEDIA_SLOT_CAPTION_TOKEN}}'}
                placeholder="{{GALLERY_NEW_CAPTION}}"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="sm:col-span-4">
              <SelectInput
                id="gallery-new-cat"
                label={'{{CATEGORY}}'}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
                options={[
                  { value: 'FOOD', label: '{{FOOD}}' },
                  { value: 'INTERIORS', label: '{{INTERIORS}}' },
                  { value: 'EVENTS', label: '{{EVENTS}}' },
                ]}
              />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" variant="primary" size="md" fullWidth>
                + {'{{ADD_SLOT}}'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} variant="surface" className="space-y-2 p-3">
              <ImageWithOverlay slot={item.imageSlot} aspect={item.aspect} />
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-text font-medium">{item.title}</span>
                <span className="font-mono text-gold">{item.category}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
}

