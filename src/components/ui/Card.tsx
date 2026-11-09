import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'dark' | 'cream' | 'signboard';
  padded?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = 'surface',
  padded = true,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'relative rounded-sm transition-colors',
        variant === 'surface' && 'bg-surface/70 text-text border border-gold/15',
        variant === 'dark' && 'bg-bg/80 text-text border border-gold/15',
        variant === 'cream' && 'bg-cream text-charcoal border border-charcoal/15',
        variant === 'signboard' &&
          'bg-surface/50 text-text border-y border-gold/35',
        padded && 'p-5 md:p-7',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

