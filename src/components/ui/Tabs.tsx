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
        'flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2',
        sticky &&
          (onCream
            ? 'sticky top-16 z-20 bg-cream/95 border-b border-charcoal/15 px-4 -mx-4 sm:mx-0 sm:px-0'
            : 'sticky top-16 z-20 bg-bg/95 border-b border-gold/20 px-4 -mx-4 sm:mx-0 sm:px-0'),
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
              'min-h-11 px-4 py-2 rounded-xs text-sm font-medium whitespace-nowrap shrink-0 border transition-all',
              onCream
                ? isActive
                  ? 'bg-charcoal text-cream border-charcoal'
                  : 'bg-transparent text-charcoal border-charcoal/30 hover:border-charcoal'
                : isActive
                  ? 'btn-gold-primary border-gold font-medium'
                  : 'bg-surface text-muted border-gold/25 hover:border-gold/60 hover:text-text'
            )}
          >
            <span>{item.label}</span>
            {typeof item.count === 'number' && (
              <span className="ml-1.5 text-xs opacity-75">({item.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

