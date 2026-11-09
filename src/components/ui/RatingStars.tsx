import React from 'react';
import clsx from 'clsx';

export interface RatingStarsProps {
  rating?: number;
  max?: number;
  label?: string;
  onCream?: boolean;
  className?: string;
}

/**
 * Thin-line rating stars in gold (or charcoal on cream sections per PRD 5.7).
 */
export function RatingStars({
  rating = 5,
  max = 5,
  label,
  onCream = false,
  className,
}: RatingStarsProps) {
  const clamped = Math.max(0, Math.min(max, Math.round(rating)));

  return (
    <div
      className={clsx('inline-flex items-center gap-1.5', className)}
      aria-label={label ?? `Rating ${clamped} out of ${max}`}
    >
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: max }).map((_, idx) => {
          const filled = idx < clamped;
          return (
            <svg
              key={idx}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              className={clsx(
                onCream
                  ? filled
                    ? 'text-charcoal'
                    : 'text-charcoal/35'
                  : filled
                    ? 'text-gold'
                    : 'text-gold/35'
              )}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        })}
      </div>
      {label && (
        <span className={clsx('text-xs font-medium', onCream ? 'text-charcoal' : 'text-muted')}>
          {label}
        </span>
      )}
    </div>
  );
}

