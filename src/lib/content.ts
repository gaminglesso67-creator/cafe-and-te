import defaults from '@/content/defaults.json';

export type ContentKey = keyof typeof defaults | (string & {});

export type ImageAspect = '16x9' | '4x3' | '1x1' | '3x4';

export interface ImageSlot {
  slot: string;
  aspect: ImageAspect;
  src: string;
  alt: string;
}

const runtimeOverrides = new Map<string, string>();

/**
 * Resolves a namespaced content key (e.g. `home.hero.title`) to its stored
 * ContentBlock value or the placeholder token from `src/content/defaults.json`.
 * Never returns hard-coded copy: unmapped keys automatically format as `{{SECTION_FIELD}}`.
 */
export function t(key: ContentKey): string {
  if (runtimeOverrides.has(key)) {
    return runtimeOverrides.get(key)!;
  }
  const dict = defaults as Record<string, string>;
  if (key in dict) {
    return dict[key];
  }
  const token = key
    .replace(/[.-]/g, '_')
    .toUpperCase();
  return `{{${token}}}`;
}

/**
 * Updates an in-memory content key (used by Admin Content Editor in dev/fallback mode).
 */
export function setContentOverride(key: string, value: string): void {
  runtimeOverrides.set(key, value);
}

/**
 * Returns all content entries (defaults merged with runtime overrides).
 */
export function getAllContentEntries(): Record<string, string> {
  const merged: Record<string, string> = { ...(defaults as Record<string, string>) };
  runtimeOverrides.forEach((val, key) => {
    merged[key] = val;
  });
  return merged;
}

/**
 * Resolves a named image slot (`hero_image`, `gallery_1`, etc.) to a placeholder SVG
 * matching the required aspect ratio and alt token (PRD 4.1 & 4.2).
 */
export function getImageSlot(slotName: string, aspect: ImageAspect = '4x3'): ImageSlot {
  const normalized = slotName.replace(/[.-]/g, '_').toUpperCase();
  return {
    slot: slotName,
    aspect,
    src: `/placeholders/${aspect}.svg`,
    alt: `{{ALT_${normalized}}}`,
  };
}

/**
 * Formats a price value or placeholder token according to PRD 4.2 (`₹{{PRICE}}`).
 */
export function formatPriceToken(price?: number | string | null): string {
  if (price === undefined || price === null || price === '{{PRICE}}') {
    return '₹{{PRICE}}';
  }
  if (typeof price === 'string' && price.startsWith('{{')) {
    return `₹${price}`;
  }
  return `₹${Number(price).toLocaleString('en-IN')} ({{PRICE}})`;
}

