import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { getImageSlot, ImageAspect } from '@/lib/content';

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
 * Placeholder-aware image box with exact aspect ratio, faint gold outline,
 * and `rgba(15,15,16,0.6)` dark overlay so text stays readable (PRD 4.1, 4.2, 5.6, 5.9).
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

  return (
    <div
      data-image-slot={slot}
      className={clsx(
        'relative w-full overflow-hidden rounded-xs bg-surface border border-gold/30',
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
        sizes={sizes}
        className="object-cover"
      />
      {overlay && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundColor: 'var(--photo-overlay)' }}
        />
      )}
      {/* Slot identifier badge in corner for content handoff clarity */}
      <span className="absolute top-2 left-2 z-10 max-w-[calc(100%-1rem)] truncate px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-bg/85 text-muted border border-gold/25 rounded-xs">
        {slot.replace(/_/g, ' ')}
      </span>
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}

