'use client';

import React, { useEffect } from 'react';
import clsx from 'clsx';

export interface DrawerModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  mode?: 'bottom-sheet' | 'dialog';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Mobile-first Bottom Sheet / Drawer / Modal (PRD 5.9).
 * Defaults to a thumb-zone bottom sheet on mobile and framed dialog/drawer on larger screens.
 */
export function DrawerModal({
  open,
  onClose,
  title,
  mode = 'bottom-sheet',
  children,
  footer,
}: DrawerModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col justify-end md:items-center md:justify-center"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Dialog Panel */}
      <div
        className={clsx(
          'relative z-10 w-full bg-surface text-text border-t md:border border-gold/40 shadow-panel',
          'max-h-[90dvh] flex flex-col pb-safe-b',
          mode === 'bottom-sheet'
            ? 'rounded-t-md md:rounded-sm md:max-w-lg'
            : 'rounded-t-md md:rounded-sm md:max-w-2xl'
        )}
      >
        {/* Drag handle indicator on mobile */}
        <div className="flex justify-center pt-2.5 pb-1 md:hidden" aria-hidden="true">
          <span className="h-1 w-10 rounded-xs bg-gold/35" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-gold/20">
          <h2 className="font-serif text-xl text-text tracking-wide">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center min-h-11 min-w-11 -mr-2 text-muted hover:text-gold transition-colors rounded-xs"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {/* Sticky Footer */}
        {footer && (
          <div className="border-t border-gold/20 bg-bg/90 px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}

