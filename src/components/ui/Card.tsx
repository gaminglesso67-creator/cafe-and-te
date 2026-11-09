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
        'relative rounded-sm border transition-colors',
        variant === 'surface' && 'bg-surface text-text border-gold/25',
        variant === 'dark' && 'bg-bg text-text border-gold/25',
        variant === 'cream' && 'bg-cream text-charcoal border-charcoal/20',
        variant === 'signboard' &&
          'bg-bg text-text border-gold/50 shadow-signboard-frame before:pointer-events-none before:absolute before:inset-1.5 before:border before:border-gold/20',
        padded && 'p-5 md:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

