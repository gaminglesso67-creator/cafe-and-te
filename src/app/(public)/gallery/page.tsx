'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { t } from '@/lib/content';
import { GalleryItemSlot, SEED_GALLERY } from '@/lib/seed-data';
import {
  Button,
  DrawerModal,
  EmptyState,
  ErrorState,
  ImageWithOverlay,
  Section,
  SkeletonLoader,
  Tabs,
} from '@/components/ui';

/**
 * Gallery Page (PRD 7.4):
 * - Filter tabs: All, Food, Interiors, Events
 * - Asymmetric masonry/editorial grid with lazy-loaded images
 * - Keyboard-accessible Lightbox (ArrowLeft / ArrowRight / Escape)
 */
export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'FOOD' | 'INTERIORS' | 'EVENTS'>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dataState] = useState<'ready' | 'loading' | 'empty' | 'error'>('ready');

  const filteredItems = useMemo(() => {
    if (activeTab === 'ALL') return SEED_GALLERY;
    return SEED_GALLERY.filter((item) => item.category === activeTab);
  }, [activeTab]);

  const currentItem: GalleryItemSlot | null =
    lightboxIndex !== null ? filteredItems[lightboxIndex] ?? null : null;

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredItems.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, filteredItems.length]);

  const tabs = [
    { id: 'ALL', label: t('gallery.tab.all'), count: SEED_GALLERY.length },
    {
      id: 'FOOD',
      label: t('gallery.tab.food'),
      count: SEED_GALLERY.filter((i) => i.category === 'FOOD').length,
    },
    {
      id: 'INTERIORS',
      label: t('gallery.tab.interiors'),
      count: SEED_GALLERY.filter((i) => i.category === 'INTERIORS').length,
    },
    {
      id: 'EVENTS',
      label: t('gallery.tab.events'),
      count: SEED_GALLERY.filter((i) => i.category === 'EVENTS').length,
    },
  ];

  return (
    <>
      <Section variant="surface" className="pt-10 pb-8 border-b border-gold/25">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {t('gallery.header.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
            {t('gallery.header.heading')}
          </h1>
        </div>
      </Section>

      <Section variant="dark">
        <Tabs
          items={tabs}
          activeId={activeTab}
          onChange={(id) => {
            setActiveTab(id as typeof activeTab);
            setLightboxIndex(null);
          }}
          ariaLabel="Gallery category filter"
          className="mb-8"
        />

        {dataState === 'loading' && <SkeletonLoader lines={6} />}
        {dataState === 'error' && <ErrorState />}
        {filteredItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
            {filteredItems.map((item, idx) => {
              const spanClass =
                idx % 3 === 0
                  ? 'lg:col-span-7'
                  : idx % 3 === 1
                    ? 'lg:col-span-5'
                    : 'lg:col-span-6';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`${spanClass} text-left group rounded-xs border border-gold/25 bg-surface p-2 hover:border-gold transition-colors`}
                >
                  <ImageWithOverlay slot={item.imageSlot} aspect={item.aspect} />
                  <div className="pt-2.5 px-1 flex items-center justify-between gap-2">
                    <span className="font-serif text-lg text-text group-hover:text-gold">
                      {item.title}
                    </span>
                    <span className="font-mono text-xs text-muted uppercase">
                      {`{{CAT_${item.category}}}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Section>

      {/* Accessible Lightbox Modal */}
      <DrawerModal
        open={Boolean(currentItem)}
        onClose={() => setLightboxIndex(null)}
        title={currentItem?.title ?? ''}
        mode="dialog"
        footer={
          currentItem ? (
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null
                      ? null
                      : (prev - 1 + filteredItems.length) % filteredItems.length
                  )
                }
              >
                ← {'{{PREV_IMAGE}}'}
              </Button>
              <span className="font-mono text-xs text-muted">
                {(lightboxIndex ?? 0) + 1} / {filteredItems.length}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null ? null : (prev + 1) % filteredItems.length
                  )
                }
              >
                {'{{NEXT_IMAGE}}'} →
              </Button>
            </div>
          ) : undefined
        }
      >
        {currentItem && (
          <div className="space-y-3">
            <ImageWithOverlay
              slot={currentItem.imageSlot}
              aspect={currentItem.aspect}
              overlay={false}
            />
            <p className="text-xs font-mono text-muted">
              {`{{LIGHTBOX_ALT_TEXT:${currentItem.imageSlot.toUpperCase()}}}`}
            </p>
          </div>
        )}
      </DrawerModal>
    </>
  );
}

