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
  // Warm Nocturne Espresso with translucent ambient amber glow
  dark: 'bg-transparent text-text',
  // Warm Lighter Espresso Surface with ambient amber glow
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
      {variant !== 'cream' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            background:
              variant === 'dark'
                ? 'radial-gradient(ellipse 75% 60% at 50% 30%, rgba(217, 155, 82, 0.16) 0%, rgba(92, 133, 103, 0.08) 45%, transparent 78%)'
                : 'radial-gradient(ellipse 80% 65% at 50% 35%, rgba(217, 155, 82, 0.18) 0%, rgba(92, 133, 103, 0.09) 48%, transparent 80%)',
          }}
        />
      )}
      {container ? (
        <div
          className={clsx(
            'relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8',
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
