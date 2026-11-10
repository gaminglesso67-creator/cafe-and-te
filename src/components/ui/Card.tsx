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
        'relative rounded-md',
        variant === 'surface' &&
          'glass-card glass-card-interactive text-text',
        variant === 'dark' &&
          'glass-panel-deep glass-card-interactive text-text',
        variant === 'cream' &&
          'bg-cream/90 backdrop-blur-md text-charcoal border border-charcoal/15 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
        variant === 'signboard' &&
          'glass-card glass-card-interactive text-text border-y border-gold/40',
        padded && 'p-5 md:p-7',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

