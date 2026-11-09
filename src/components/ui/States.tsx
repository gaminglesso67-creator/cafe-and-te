import React from 'react';
import clsx from 'clsx';
import { t } from '@/lib/content';
import { Button } from './Button';

export function SkeletonLoader({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label={t('ui.state.loading')}
      className={clsx(
        'w-full rounded-sm border border-gold/20 bg-surface p-5 space-y-3',
        className
      )}
    >
      <div className="h-5 w-2/5 bg-gold/15 rounded-xs animate-pulse" />
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className={clsx(
            'h-4 bg-white/5 rounded-xs animate-pulse',
            idx === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
      <span className="sr-only">{t('ui.state.loading')}</span>
    </div>
  );
}

export function EmptyState({
  title = t('ui.state.empty_title'),
  description = t('ui.state.empty_body'),
  actionLabel,
  actionHref,
  onAction,
  onCream = false,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  onCream?: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-sm border',
        onCream
          ? 'bg-cream text-charcoal border-charcoal/20'
          : 'bg-surface text-text border-gold/25'
      )}
    >
      <div
        aria-hidden="true"
        className={clsx(
          'w-8 h-8 rotate-45 border mb-4 flex items-center justify-center',
          onCream ? 'border-charcoal/40' : 'border-gold/50'
        )}
      >
        <span className={clsx('w-2 h-2', onCream ? 'bg-charcoal' : 'bg-gold')} />
      </div>
      <h3 className="font-serif text-xl mb-1">{title}</h3>
      <p className={clsx('text-sm max-w-md mb-5', onCream ? 'text-charcoal/80' : 'text-muted')}>
        {description}
      </p>
      {actionLabel && (actionHref || onAction) && (
        <Button
          variant={onCream ? 'charcoal' : 'secondary'}
          size="sm"
          href={actionHref}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = t('ui.state.error_title'),
  description = t('ui.state.error_body'),
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center p-8 rounded-sm border border-crimson/60 bg-surface text-text"
    >
      <span className="inline-block px-2.5 py-0.5 text-xs uppercase tracking-widest bg-crimson text-cream mb-3">
        Notice
      </span>
      <h3 className="font-serif text-xl mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-md mb-5">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {t('ui.state.retry_cta')}
        </Button>
      )}
    </div>
  );
}
