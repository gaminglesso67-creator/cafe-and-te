'use client';

import React from 'react';
import clsx from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
  onCream?: boolean;
  sticky?: boolean;
  className?: string;
}

/**
 * Horizontally-scrollable category/filter chip strip with >=44px touch targets
 * and at least 8px spacing between targets (Mobile-First Rules & PRD 5.9).
 */
export function Tabs({
  items,
  activeId,
  onChange,
  ariaLabel = 'Categories',
  onCream = false,
  sticky = false,
  className,
}: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={clsx(
        'flex items-center gap-6 overflow-x-auto no-scrollbar border-b w-full max-w-full',
        onCream ? 'border-charcoal/15' : 'border-gold/15',
        sticky &&
          (onCream
            ? 'sticky top-16 z-20 bg-cream/95 backdrop-blur-sm'
            : 'sticky top-16 z-20 bg-bg/95 backdrop-blur-sm'),
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={clsx(
              'min-h-11 py-3 text-xs sm:text-sm uppercase tracking-[0.14em] whitespace-nowrap shrink-0 border-b-2 -mb-px transition-colors',
              onCream
                ? isActive
                  ? 'border-charcoal text-charcoal font-semibold'
                  : 'border-transparent text-charcoal/65 hover:text-charcoal'
                : isActive
                  ? 'border-gold text-gold font-medium'
                  : 'border-transparent text-muted hover:text-text'
            )}
          >
            <span>{item.label}</span>
            {typeof item.count === 'number' && (
              <span className="ml-1.5 text-[11px] opacity-60">({item.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
