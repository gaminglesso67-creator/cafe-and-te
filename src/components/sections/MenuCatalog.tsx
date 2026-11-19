'use client';

import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { formatPriceToken, t } from '@/lib/content';
import { CategorySlot, MenuItemSlot } from '@/lib/seed-data';
import { useCart } from '@/lib/cart-context';
import {
  Badge,
  Button,
  DrawerModal,
  EmptyState,
  ErrorState,
  ImageWithOverlay,
  QuantityStepper,
  Section,
  SkeletonLoader,
  Tabs,
  TextareaInput,
  TextInput,
  useToast,
} from '@/components/ui';
import { SectionDataState } from './HomeSections';

export interface MenuCatalogProps {
  categories: CategorySlot[];
  items: MenuItemSlot[];
  orderingEnabled?: boolean;
  defaultCreamSurface?: boolean;
  state?: SectionDataState;
}

/**
 * Full Menu & Online Ordering Catalog (PRD 7.2 & 8.2):
 * - Sticky horizontally-scrollable category chips on mobile
 * - Search, Veg/Non-Veg filter, allergen filter, availability toggle
 * - Cream section variant option (charcoal text on cream, never gold on cream)
 * - Item detail bottom-sheet modal with variants, add-ons, quantity & special instructions
 * - Print-friendly / downloadable menu trigger
 */
export function MenuCatalog({
  categories,
  items,
  orderingEnabled = true,
  defaultCreamSurface = false,
  state = 'ready',
}: MenuCatalogProps) {
  const { addItem, openSheet } = useCart();
  const { notify } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietFilter, setDietFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [allergenFilter, setAllergenFilter] = useState<string>('ALL');
  const [useCreamVariant, setUseCreamVariant] = useState<boolean>(defaultCreamSurface);

  // Item customization bottom sheet state
  const [selectedItem, setSelectedItem] = useState<MenuItemSlot | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [customQty, setCustomQty] = useState<number>(1);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory !== 'ALL' && item.categoryId !== activeCategory) return false;
      if (dietFilter === 'VEG' && !item.isVeg) return false;
      if (dietFilter === 'NON_VEG' && item.isVeg) return false;
      if (availableOnly && !item.isAvailable) return false;
      if (allergenFilter !== 'ALL' && item.allergens.includes(allergenFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !item.name.toLowerCase().includes(q) &&
          !item.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [items, activeCategory, dietFilter, availableOnly, allergenFilter, searchQuery]);

  const tabItems = useMemo(
    () => [
      { id: 'ALL', label: t('menu.filter.all'), count: items.length },
      ...categories.map((cat) => ({
        id: cat.id,
        label: cat.name,
        count: items.filter((i) => i.categoryId === cat.id).length,
      })),
    ],
    [categories, items]
  );

  const openItemModal = (item: MenuItemSlot) => {
    setSelectedItem(item);
    setSelectedVariantId(item.variants[0]?.id ?? '');
    setSelectedAddOnIds([]);
    setCustomQty(1);
    setSpecialNotes('');
  };

  const handleConfirmCustomItem = () => {
    if (!selectedItem) return;
    const chosenVariant = selectedItem.variants.find((v) => v.id === selectedVariantId);
    const chosenAddOns = selectedItem.addOns.filter((a) => selectedAddOnIds.includes(a.id));
    const addOnTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = selectedItem.price + (chosenVariant?.priceDelta ?? 0) + addOnTotal;

    addItem({
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      unitPrice,
      quantity: customQty,
      variantName: chosenVariant?.name,
      addOnNames: chosenAddOns.map((a) => a.name),
      specialInstructions: specialNotes.trim() || undefined,
      isVeg: selectedItem.isVeg,
    });
    notify(`${selectedItem.name} added to bag`, 'success');
    setSelectedItem(null);
    openSheet();
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Section variant={useCreamVariant ? 'cream' : 'dark'}>
      {/* Streamlined Search & Dietary Toolbar (No heavy outer box) */}
      <div
        className={clsx(
          'pb-6 mb-6 border-b space-y-4',
          useCreamVariant ? 'border-charcoal/15 text-charcoal' : 'border-gold/15 text-text'
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="w-full lg:max-w-md">
            <TextInput
              id="menu-search-input"
              label="Search Menu"
              placeholder={t('menu.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onCream={useCreamVariant}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'VEG', 'NON_VEG'] as const).map((mode) => {
              const active = dietFilter === mode;
              const label =
                mode === 'ALL'
                  ? t('menu.filter.all')
                  : mode === 'VEG'
                    ? t('menu.filter.veg_only')
                    : t('menu.filter.non_veg');
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDietFilter(mode)}
                  className={clsx(
                    'min-h-10 px-3.5 py-1.5 text-xs uppercase tracking-wider rounded-xs border transition-colors',
                    useCreamVariant
                      ? active
                        ? 'bg-charcoal text-cream border-charcoal'
                        : 'border-charcoal/25 text-charcoal'
                      : active
                        ? 'btn-gold-primary border-gold font-semibold'
                        : 'border-gold/25 text-muted hover:text-text'
                  )}
                >
                  {label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setUseCreamVariant((v) => !v)}
              className={clsx(
                'min-h-10 px-3 py-1.5 text-xs uppercase tracking-wider rounded-xs border',
                useCreamVariant
                  ? 'border-charcoal/30 text-charcoal'
                  : 'border-gold/25 text-gold'
              )}
            >
              {useCreamVariant ? 'Dark Menu' : 'Cream Menu'}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className={clsx(
                'min-h-10 px-3 py-1.5 text-xs uppercase tracking-wider underline underline-offset-4',
                useCreamVariant ? 'text-charcoal/80' : 'text-muted hover:text-gold'
              )}
            >
              {t('menu.print.cta')}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Horizontally-Scrollable Category Chip Bar (PRD 7.2 & Mobile Rules) */}
      <Tabs
        items={tabItems}
        activeId={activeCategory}
        onChange={setActiveCategory}
        onCream={useCreamVariant}
        sticky
        className="mb-8"
      />

      {state === 'loading' && <SkeletonLoader lines={6} />}
      {state === 'error' && <ErrorState />}
      {state === 'empty' || (state === 'ready' && filteredItems.length === 0) ? (
        <EmptyState
          onCream={useCreamVariant}
          actionLabel={t('menu.filter.all')}
          onAction={() => {
            setActiveCategory('ALL');
            setDietFilter('ALL');
            setAvailableOnly(false);
            setAllergenFilter('ALL');
            setSearchQuery('');
          }}
        />
      ) : null}

      {/* Glassmorphic Menu Cards with smooth category switch transition & hover micro-interactions */}
      {state === 'ready' && filteredItems.length > 0 && (
        <div
          key={`${activeCategory}-${dietFilter}`}
          className="animate-menu-switch grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className={clsx(
                'group rounded-md p-4 sm:p-5 flex flex-row gap-3.5 sm:gap-5 justify-between items-start',
                useCreamVariant
                  ? 'bg-cream/90 backdrop-blur-md border border-charcoal/15 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-charcoal/40 hover:shadow-md'
                  : 'glass-card glass-card-interactive'
              )}
            >
              {/* Dish Thumbnail (Compact 104px on mobile, 128px on desktop) */}
              <button
                type="button"
                data-tactile="tap"
                onClick={() => openItemModal(item)}
                className="relative z-10 w-24 sm:w-32 shrink-0 text-left overflow-hidden rounded-md"
              >
                <ImageWithOverlay
                  slot={item.imageSlot}
                  aspect="4x3"
                  overlay={false}
                />
              </button>

              {/* Dish Details & Thumb-Zone Action */}
              <div className="relative z-10 flex-1 flex flex-col justify-between gap-2 min-w-0 w-full">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-1.5 min-w-0">
                      <span className="mt-1 shrink-0">
                        <Badge kind={item.isVeg ? 'veg' : 'non_veg'} onCream={useCreamVariant} />
                      </span>
                      <button
                        type="button"
                        data-tactile="tap"
                        onClick={() => openItemModal(item)}
                        className="text-left font-serif text-lg sm:text-2xl font-semibold leading-snug transition-all duration-300 group-hover:text-gold group-hover:translate-x-0.5"
                      >
                        {item.name}
                      </button>
                    </div>
                    <span
                      className={clsx(
                        'font-serif text-base sm:text-lg font-semibold shrink-0',
                        useCreamVariant
                          ? 'text-charcoal'
                          : 'glass-pill px-2.5 py-0.5 rounded-full text-xs sm:text-sm text-gold'
                      )}
                    >
                      {formatPriceToken(item.price)}
                    </span>
                  </div>

                  <p
                    className={clsx(
                      'text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3',
                      useCreamVariant ? 'text-charcoal/80' : 'text-muted'
                    )}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Subtle Action Row */}
                <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {item.isSignature && <Badge kind="chefs_special" />}
                    {item.allergens.length > 0 && (
                      <span
                        className={clsx(
                          'text-[10px] sm:text-[11px] truncate max-w-[110px] sm:max-w-none',
                          useCreamVariant ? 'text-charcoal/60' : 'text-muted/70'
                        )}
                      >
                        {item.allergens.join(', ')}
                      </span>
                    )}
                  </div>
                  {orderingEnabled && (
                    <button
                      type="button"
                      data-tactile="confirm"
                      disabled={!item.isAvailable}
                      onClick={() => openItemModal(item)}
                      className={clsx(
                        'min-h-10 px-3.5 py-1.5 text-[11px] sm:text-xs uppercase tracking-wider rounded-full transition-all duration-200',
                        useCreamVariant
                          ? 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream'
                          : 'glass-pill text-gold hover:border-gold hover:bg-gold hover:text-bg'
                      )}
                    >
                      {item.isAvailable ? `+ ${t('menu.item.add_cta')}` : t('ui.badge.out_of_stock')}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Allergen Disclaimer Footer */}
      <p
        className={clsx(
          'mt-10 text-xs border-t pt-4',
          useCreamVariant
            ? 'border-charcoal/20 text-charcoal/75'
            : 'border-gold/20 text-muted'
        )}
      >
        {t('menu.allergen.disclaimer')}
      </p>

      {/* Item Detail & Customization Bottom-Sheet Modal (PRD 7.2) */}
      <DrawerModal
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name ?? ''}
        mode="bottom-sheet"
        footer={
          selectedItem ? (
            <div className="flex items-center justify-between gap-4">
              <QuantityStepper value={customQty} min={1} max={20} onChange={setCustomQty} />
              <Button
                variant="primary"
                size="md"
                disabled={!selectedItem.isAvailable}
                onClick={handleConfirmCustomItem}
              >
                {t('menu.item.add_cta')} · {formatPriceToken(selectedItem.price * customQty)}
              </Button>
            </div>
          ) : undefined
        }
      >
        {selectedItem && (
          <div className="space-y-5">
            <ImageWithOverlay slot={selectedItem.imageSlot} aspect="16x9" />
            <p className="text-sm text-muted">{selectedItem.description}</p>

            {/* Variants Selection */}
            {selectedItem.variants.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-gold">Choose Portion / Base</h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedItem.variants.map((v) => {
                    const active = selectedVariantId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={clsx(
                          'min-h-11 px-4 py-2.5 rounded-xs border flex items-center justify-between text-sm',
                          active
                            ? 'border-gold bg-gold/10 text-text font-medium'
                            : 'border-gold/25 bg-bg text-muted'
                        )}
                      >
                        <span>{v.name}</span>
                        <span className="font-mono text-gold">
                          +{formatPriceToken(v.priceDelta)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-Ons Selection */}
            {selectedItem.addOns.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-gold">Recommended Accompaniments</h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedItem.addOns.map((addon) => {
                    const checked = selectedAddOnIds.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddOn(addon.id)}
                        className={clsx(
                          'min-h-11 px-4 py-2.5 rounded-xs border flex items-center justify-between text-sm',
                          checked
                            ? 'border-gold bg-gold/10 text-text font-medium'
                            : 'border-gold/25 bg-bg text-muted'
                        )}
                      >
                        <span>{addon.name}</span>
                        <span className="font-mono text-gold">
                          +{formatPriceToken(addon.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <TextareaInput
              id="item-special-instructions"
              label="Kitchen / Spice Instructions (Optional)"
              placeholder="E.g., medium spicy, Jain preparation, serve starter with mains..."
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            />
          </div>
        )}
      </DrawerModal>
    </Section>
  );
}

