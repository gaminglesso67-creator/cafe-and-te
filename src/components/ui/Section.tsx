import React from 'react';
import clsx from 'clsx';

export type SectionVariant = 'dark' | 'surface' | 'cream';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: SectionVariant;
  as?: 'section' | 'div' | 'article';
  container?: boolean;
  narrow?: boolean;
  noPadding?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<SectionVariant, string> = {
  // 60% Charcoal Black (#0F0F10)
  dark: 'bg-bg text-text',
  // 60% Lighter Charcoal (#1A1815)
  surface: 'bg-surface text-text',
  // 30% Warm White / Cream (#FFF4E0) with strictly charcoal text (#0F0F10) — NEVER gold text (PRD 5.7)
  cream: 'section-cream bg-cream text-charcoal',
};

export function Section({
  variant = 'dark',
  as: Component = 'section',
  container = true,
  narrow = false,
  noPadding = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      data-section-variant={variant}
      className={clsx(
        'relative w-full max-w-full overflow-x-clip',
        variantStyles[variant],
        !noPadding && 'py-10 sm:py-12 lg:py-16',
        className
      )}
      {...props}
    >
      {container ? (
        <div
          className={clsx(
            'mx-auto w-full px-4 sm:px-6 lg:px-8',
            narrow ? 'max-w-4xl' : 'max-w-7xl'
          )}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
}
