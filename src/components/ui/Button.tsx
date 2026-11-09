import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'charcoal';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  // Gold gradient #E8B547 -> #C98A2B; hover brightens glow, does not change colour (PRD 5.2 & 5.3)
  primary: 'btn-gold-primary font-medium tracking-wide border border-gold/60',
  // Secondary outline in gold on dark backgrounds
  secondary:
    'bg-transparent text-text border border-gold/55 hover:border-gold hover:-translate-y-0.5 hover:shadow-gold-glow active:translate-y-0 active:scale-[0.98] active:bg-gold/10 transition-all duration-200',
  // Ghost button
  ghost:
    'bg-transparent text-muted hover:text-gold hover:bg-white/[0.04] active:scale-[0.98] border border-transparent transition-all duration-200',
  // Charcoal button exclusively for use inside Cream sections (PRD 5.7: never gold on cream)
  charcoal:
    'bg-charcoal text-cream border border-charcoal hover:-translate-y-0.5 hover:bg-charcoal-surface active:translate-y-0 active:scale-[0.98] transition-all duration-200',
};

const sizeClasses: Record<ButtonSize, string> = {
  // All sizes maintain >= 44px height (min-h-11) for mobile touch targets
  sm: 'min-h-11 min-w-11 px-3.5 py-2 text-xs sm:text-sm',
  md: 'min-h-11 min-w-11 px-5 py-2.5 text-sm sm:text-base',
  lg: 'min-h-12 min-w-11 px-6 py-3 text-sm sm:text-base font-medium',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  external = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 rounded-sm select-none text-center max-w-full break-words leading-snug',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
    'disabled:opacity-45 disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  if (href) {
    if (external || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) {
      return (
        <a
          href={href}
          className={classes}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
