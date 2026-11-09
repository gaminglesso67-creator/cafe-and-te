'use client';

import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { formatPriceToken, t } from '@/lib/content';
import { CategorySlot, MenuItemSlot } from '@/lib/seed-data';
import { useCart } from '@/lib/cart-context';
import {
  Badge,
  Button,
  Card,
  DrawerModal,
  EmptyState,
  ErrorState,
  ImageWithOverlay,
  QuantityStepper,
  Section,
  SelectInput,
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

  const allAllergens = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.allergens.forEach((a) => set.add(a)));
    return Array.from(set);
  }, [items]);

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
    notify(`${selectedItem.name} — {{ADDED_TO_CART}}`, 'success');
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
      {/* Search, Dietary Filters & Surface Toggle Bar */}
      <div
        className={clsx(
          'p-4 sm:p-5 rounded-sm border mb-6 space-y-4',
          useCreamVariant
            ? 'bg-cream border-charcoal/25 text-charcoal'
            : 'bg-surface border-gold/25 text-text'
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-5 min-w-0">
            <TextInput
              id="menu-search-input"
              label={t('menu.search.placeholder')}
              placeholder={t('menu.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onCream={useCreamVariant}
            />
          </div>
          <div className="lg:col-span-4 min-w-0">
            <SelectInput
              id="menu-exclude-allergen"
              label={'{{FILTER_EXCLUDE_ALLERGEN}}'}
              value={allergenFilter}
              onChange={(e) => setAllergenFilter(e.target.value)}
              onCream={useCreamVariant}
              options={[
                { value: 'ALL', label: '{{ALL_ALLERGENS_NONE_EXCLUDED}}' },
                ...allAllergens.map((a) => ({ value: a, label: `Exclude ${a}` })),
              ]}
            />
          </div>
          <div className="lg:col-span-3 min-w-0 flex items-center gap-2">
            <Button
              variant={useCreamVariant ? 'charcoal' : 'secondary'}
              size="sm"
              fullWidth
              onClick={() => window.print()}
            >
              {t('menu.print.cta')}
            </Button>
          </div>
        </div>

        {/* Filter Chips Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-current/10">
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
                    'min-h-11 px-3.5 py-1.5 text-xs uppercase tracking-wider rounded-xs border transition-colors',
                    useCreamVariant
                      ? active
                        ? 'bg-charcoal text-cream border-charcoal'
                        : 'border-charcoal/30 text-charcoal'
                      : active
                        ? 'btn-gold-primary border-gold font-semibold'
                        : 'border-gold/30 text-muted hover:text-text'
                  )}
                >
                  {label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setAvailableOnly((v) => !v)}
              aria-pressed={availableOnly}
              className={clsx(
                'min-h-11 px-3.5 py-1.5 text-xs uppercase tracking-wider rounded-xs border transition-colors',
                useCreamVariant
                  ? availableOnly
                    ? 'bg-charcoal text-cream border-charcoal'
                    : 'border-charcoal/30 text-charcoal'
                  : availableOnly
                    ? 'btn-gold-primary border-gold font-semibold'
                    : 'border-gold/30 text-muted hover:text-text'
              )}
            >
              {t('menu.filter.available_only')}
            </button>
          </div>

          {/* Toggle Dark vs Cream Menu Surface (PRD 7.2) */}
          <button
            type="button"
            onClick={() => setUseCreamVariant((v) => !v)}
            className={clsx(
              'min-h-11 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-xs border',
              useCreamVariant
                ? 'border-charcoal text-charcoal bg-charcoal/5'
                : 'border-gold/35 text-gold bg-bg'
            )}
          >
            {useCreamVariant ? '{{SURFACE:CREAM_PAPER}}' : '{{SURFACE:DARK_SIGNBOARD}}'}
          </button>
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

      {/* Single-Column Cards on Mobile, 2-Column Editorial Grid on Desktop */}
      {state === 'ready' && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              variant={useCreamVariant ? 'cream' : 'surface'}
              className="flex flex-col sm:flex-row gap-4 justify-between"
            >
              {/* Dish Image Slot */}
              <div className="w-full sm:w-36 shrink-0">
                <ImageWithOverlay
                  slot={item.imageSlot}
                  aspect={item.imageAspect}
                  overlay={!useCreamVariant}
                />
              </div>

              {/* Dish Details & Thumb-Zone Action */}
              <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge kind={item.isVeg ? 'veg' : 'non_veg'} onCream={useCreamVariant} />
                    {item.isSignature && <Badge kind="chefs_special" />}
                    {item.isNew && <Badge kind="new" />}
                    {!item.isAvailable && (
                      <Badge kind="out_of_stock" onCream={useCreamVariant} />
                    )}
                  </div>

                  <div className="flex items-baseline justify-between gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => openItemModal(item)}
                      className="text-left font-serif text-xl font-semibold hover:underline underline-offset-4"
                    >
                      {item.name}
                    </button>
                    <span
                      className={clsx(
                        'font-mono text-base font-semibold shrink-0',
                        useCreamVariant ? 'text-charcoal' : 'text-gold'
                      )}
                    >
                      {formatPriceToken(item.price)}
                    </span>
                  </div>

                  <p
                    className={clsx(
                      'text-sm',
                      useCreamVariant ? 'text-charcoal/80' : 'text-muted'
                    )}
                  >
                    {item.description}
                  </p>

                  {item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.allergens.map((alg) => (
                        <Badge
                          key={alg}
                          kind="allergen"
                          label={alg}
                          onCream={useCreamVariant}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Reachable with one thumb on mobile */}
                <div className="pt-2 border-t border-current/10 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openItemModal(item)}
                    className={clsx(
                      'min-h-11 px-2 text-xs uppercase tracking-wider underline underline-offset-4',
                      useCreamVariant ? 'text-charcoal/80' : 'text-muted hover:text-gold'
                    )}
                  >
                    {t('menu.item.customise_cta')}
                  </button>
                  {orderingEnabled && (
                    <Button
                      variant={useCreamVariant ? 'charcoal' : 'primary'}
                      size="sm"
                      disabled={!item.isAvailable}
                      onClick={() => openItemModal(item)}
                    >
                      {item.isAvailable ? `+ ${t('menu.item.add_cta')}` : t('ui.badge.out_of_stock')}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
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
                <h3 className="font-serif text-lg text-gold">{'{{SELECT_VARIANT_HEADING}}'}</h3>
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
                <h3 className="font-serif text-lg text-gold">{'{{SELECT_ADDONS_HEADING}}'}</h3>
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
              label={'{{SPECIAL_INSTRUCTIONS_LABEL}}'}
              placeholder={'{{SPECIAL_INSTRUCTIONS_PLACEHOLDER}}'}
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

