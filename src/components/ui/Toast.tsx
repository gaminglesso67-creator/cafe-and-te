'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import clsx from 'clsx';

export interface ToastMessage {
  id: string;
  text: string;
  kind?: 'info' | 'success' | 'error';
}

interface ToastContextValue {
  notify: (text: string, kind?: ToastMessage['kind']) => void;
}

const ToastContext = createContext<ToastContextValue>({
  notify: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = useCallback((text: string, kind: ToastMessage['kind'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, text, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              'pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xs border shadow-panel text-sm',
              toast.kind === 'error'
                ? 'bg-crimson text-cream border-gold/40'
                : 'bg-surface text-text border-gold/55 shadow-gold-glow'
            )}
          >
            <span>{toast.text}</span>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
              className="min-h-8 min-w-8 text-muted hover:text-text"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

