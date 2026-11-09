import React from 'react';
import clsx from 'clsx';
import { t } from '@/lib/content';

export type BadgeKind =
  | 'chefs_special'
  | 'new'
  | 'offer'
  | 'veg'
  | 'non_veg'
  | 'allergen'
  | 'out_of_stock'
  | 'neutral';

export interface BadgeProps {
  kind?: BadgeKind;
  label?: string;
  onCream?: boolean;
  className?: string;
}

export function Badge({ kind = 'neutral', label, onCream = false, className }: BadgeProps) {
  if (kind === 'veg' || kind === 'non_veg') {
    const isVeg = kind === 'veg';
    const textLabel = label ?? (isVeg ? t('ui.badge.veg') : t('ui.badge.non_veg'));
    return (
      <span
        className={clsx(
          'inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider',
          onCream ? 'text-charcoal/80' : 'text-muted',
          className
        )}
        title={textLabel}
      >
        <span
          aria-hidden="true"
          className={clsx(
            'inline-flex items-center justify-center w-3.5 h-3.5 border rounded-[2px] shrink-0',
            isVeg ? 'border-emerald-500' : 'border-crimson'
          )}
        >
          <span
            className={clsx('w-1.5 h-1.5 rounded-full', isVeg ? 'bg-emerald-500' : 'bg-crimson')}
          />
        </span>
        {label && <span>{textLabel}</span>}
      </span>
    );
  }

  // Crimson (#B3202A) used ONLY for seasonal/highlight tags per PRD 5.5
  if (kind === 'chefs_special' || kind === 'new' || kind === 'offer') {
    const defaultKey =
      kind === 'chefs_special'
        ? 'ui.badge.chefs_special'
        : kind === 'new'
          ? 'ui.badge.new'
          : 'ui.badge.offer';
    return (
      <span
        className={clsx(
          'inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] rounded-xs max-w-full break-words',
          'bg-crimson/90 text-cream',
          className
        )}
      >
        {label ?? t(defaultKey)}
      </span>
    );
  }

  if (kind === 'out_of_stock') {
    return (
      <span
        className={clsx(
          'inline-flex items-center text-[11px] uppercase tracking-wider',
          onCream ? 'text-charcoal/60' : 'text-muted/70',
          className
        )}
      >
        {label ?? t('ui.badge.out_of_stock')}
      </span>
    );
  }

  if (kind === 'allergen') {
    return (
      <span
        className={clsx(
          'inline-flex items-center text-[11px] tracking-wide',
          onCream ? 'text-charcoal/65' : 'text-muted/75',
          className
        )}
      >
        {label ?? 'Allergen'}
      </span>
    );
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center text-[11px] uppercase tracking-[0.16em]',
        onCream ? 'text-charcoal/75' : 'text-gold/90',
        className
      )}
    >
      {label ?? ''}
    </span>
  );
}

