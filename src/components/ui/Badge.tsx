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
          'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs uppercase tracking-wider border rounded-xs',
          onCream
            ? 'border-charcoal/30 text-charcoal bg-charcoal/5'
            : 'border-muted/30 text-muted bg-bg/60',
          className
        )}
        title={textLabel}
      >
        <span
          aria-hidden="true"
          className={clsx(
            'inline-flex items-center justify-center w-3.5 h-3.5 border',
            isVeg ? 'border-emerald-500' : 'border-crimson'
          )}
        >
          <span
            className={clsx('w-2 h-2 rounded-full', isVeg ? 'bg-emerald-500' : 'bg-crimson')}
          />
        </span>
        <span>{textLabel}</span>
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
          'inline-flex items-center px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider rounded-xs max-w-full break-words',
          'bg-crimson text-cream border border-gold/35',
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
          'inline-flex items-center px-2.5 py-0.5 text-xs uppercase tracking-wider rounded-xs',
          onCream
            ? 'bg-charcoal/15 text-charcoal/80 border border-charcoal/30'
            : 'bg-bg/90 text-muted border border-muted/30',
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
          'inline-flex items-center px-2 py-0.5 text-xs tracking-wide rounded-xs border',
          onCream
            ? 'border-charcoal/25 text-charcoal/80 bg-transparent'
            : 'border-muted/25 text-muted bg-transparent',
          className
        )}
      >
        {label ?? '{{ALLERGEN_TAG}}'}
      </span>
    );
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 text-xs uppercase tracking-widest rounded-xs border',
        onCream
          ? 'border-charcoal/30 text-charcoal bg-charcoal/5'
          : 'border-gold/35 text-gold bg-surface',
        className
      )}
    >
      {label ?? '{{TAG_LABEL}}'}
    </span>
  );
}

