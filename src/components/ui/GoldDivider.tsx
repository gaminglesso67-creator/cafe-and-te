import React from 'react';
import clsx from 'clsx';

export interface GoldDividerProps {
  onCream?: boolean;
  ornament?: boolean;
  className?: string;
}

/**
 * Thin gold line or ornamental divider between sections (PRD 5.6 & 5.9).
 * Uses charcoal rules when rendered inside a cream section (PRD 5.7).
 */
export function GoldDivider({ onCream = false, ornament = true, className }: GoldDividerProps) {
  const lineClass = onCream ? 'bg-charcoal/20' : 'bg-gold/30';
  const diamondClass = onCream ? 'border-charcoal/45' : 'border-gold/65';

  if (!ornament) {
    return <hr className={clsx('w-full h-px border-0', lineClass, className)} />;
  }

  return (
    <div
      role="separator"
      aria-hidden="true"
      className={clsx('flex items-center justify-center gap-3 w-full py-2', className)}
    >
      <span className={clsx('h-px flex-1 max-w-[180px]', lineClass)} />
      <span className={clsx('w-2 h-2 rotate-45 border', diamondClass)} />
      <span
        className={clsx(
          'w-2.5 h-2.5 rotate-45 border',
          onCream ? 'border-charcoal/70 bg-charcoal/10' : 'border-gold bg-gold/15'
        )}
      />
      <span className={clsx('w-2 h-2 rotate-45 border', diamondClass)} />
      <span className={clsx('h-px flex-1 max-w-[180px]', lineClass)} />
    </div>
  );
}

