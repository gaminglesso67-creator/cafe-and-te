'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { getImageSlot, ImageAspect } from '@/lib/content';

/**
 * Lightweight inline SVG blurDataURL (Roasted Espresso + Warm Caramel Crema glow)
 * for instant zero-CLS blur-up placeholders while images lazy-load.
 */
export const CAFE_BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMiI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJnIiBjeD0iNTAlIiBjeT0iNDAlIiByPSI3MCUiPjxzdG9w offsetPSIwJSIgc3RvcC1jb2xvcj0iIzNBMjcxOCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzEzMEYwQyIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxMiIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==';

export interface ImageWithOverlayProps {
  slot: string;
  aspect?: ImageAspect;
  alt?: string;
  overlay?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  children?: React.ReactNode;
}

const aspectClasses: Record<ImageAspect, string> = {
  '16x9': 'aspect-video',
  '4x3': 'aspect-[4/3]',
  '1x1': 'aspect-square',
  '3x4': 'aspect-[3/4]',
};

/**
 * Lazy-loaded, blur-up placeholder-aware image box with exact aspect ratio,
 * faint gold outline, and dark overlay so text stays readable (PRD 4.1, 4.2, 5.6, 5.9).
 */
export function ImageWithOverlay({
  slot,
  aspect = '4x3',
  alt,
  overlay = true,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className,
  children,
}: ImageWithOverlayProps) {
  const resolved = getImageSlot(slot, aspect);
  const isPlaceholder = resolved.src.startsWith('/placeholders/');
  const [loaded, setLoaded] = useState(priority);

  return (
    <div
      data-image-slot={slot}
      className={clsx(
        'group relative w-full overflow-hidden rounded-md bg-surface ring-1 ring-inset ring-white/12 transition-all duration-500 hover:ring-gold/45 hover:shadow-gold-glow',
        isPlaceholder ? 'border border-gold/25' : 'border border-white/10',
        aspectClasses[aspect],
        className
      )}
    >
      <Image
        src={resolved.src}
        alt={alt ?? resolved.alt}
        fill
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        decoding="async"
        placeholder={isPlaceholder ? 'empty' : 'blur'}
        blurDataURL={isPlaceholder ? undefined : CAFE_BLUR_DATA_URL}
        onLoad={() => setLoaded(true)}
        sizes={sizes}
        className={clsx(
          'object-cover transition-all duration-700 ease-out group-hover:scale-105',
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        )}
      />
      {overlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: isPlaceholder
              ? 'var(--photo-overlay)'
              : 'linear-gradient(to top, rgba(15, 15, 16, 0.45) 0%, rgba(15, 15, 16, 0.05) 50%, rgba(15, 15, 16, 0.15) 100%)',
          }}
        />
      )}
      {isPlaceholder && (
        <span className="absolute top-2 left-2 z-10 max-w-[calc(100%-1rem)] truncate px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-bg/85 text-muted border border-gold/25 rounded-xs">
          {slot.replace(/_/g, ' ')}
        </span>
      )}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}

