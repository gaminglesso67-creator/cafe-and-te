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
 * ContentBlock value or the default dictionary from `src/content/defaults.json`.
 */
export function t(key: ContentKey): string {
  if (runtimeOverrides.has(key)) {
    return runtimeOverrides.get(key)!;
  }
  const dict = defaults as Record<string, string>;
  if (key in dict) {
    return dict[key];
  }
  const token = key.replace(/[.-]/g, '_').toUpperCase();
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

const SAANJH_IMAGE_SLOT_MAP: Record<string, string> = {
  // Hero & About slots
  hero_signboard_visual: '/images/saanjh/hero-signboard.jpg',
  home_about_story: '/images/saanjh/family-dining-room.jpg',
  saanjh_wooden_interiors: '/images/saanjh/hero-signboard.jpg',
  signature_mushroom_crostini_bar: '/images/saanjh/newly-opened-bar.jpg',
  lush_green_outdoor_patio: '/images/saanjh/lush-outdoor-patio.jpg',

  // Signature Menu Dishes
  mushroom_crostini_signature: '/images/saanjh/mushroom-crostini.jpg',
  maharashtrian_kala_masala_handi: '/images/saanjh/khandeshi-mutton-handi.jpg',
  saanjh_royal_dum_biryani: '/images/saanjh/royal-dum-biryani.jpg',
  artisanal_dusk_mocktail: '/images/saanjh/dusk-botanical-mocktail.jpg',
  italian_pesto_pizza: '/images/saanjh/wood-fired-pesto-pizza.jpg',
  thecha_paneer_fusion: '/images/saanjh/thecha-paneer-tikka.jpg',
  crispy_lotus_stem_wok: '/images/saanjh/crispy-lotus-stem.jpg',

  // Offers & Events
  lunch_walkin_offer: '/images/saanjh/lush-outdoor-patio.jpg',
  partner_bank_dining_deal: '/images/saanjh/newly-opened-bar.jpg',
  newly_opened_bar_evenings: '/images/saanjh/newly-opened-bar.jpg',
  sunday_family_patio_lunch: '/images/saanjh/family-dining-room.jpg',

  // Gallery Mosaic Slots
  gallery_mushroom_crostini: '/images/saanjh/mushroom-crostini.jpg',
  gallery_wooden_amber_interiors: '/images/saanjh/hero-signboard.jpg',
  gallery_bar_cocktails: '/images/saanjh/dusk-botanical-mocktail.jpg',
  gallery_family_dining: '/images/saanjh/family-dining-room.jpg',
  gallery_lush_green_patio: '/images/saanjh/lush-outdoor-patio.jpg',
  gallery_dum_biryani: '/images/saanjh/royal-dum-biryani.jpg',
  gallery_1: '/images/saanjh/hero-signboard.jpg',
  gallery_2: '/images/saanjh/mushroom-crostini.jpg',
  gallery_3: '/images/saanjh/dusk-botanical-mocktail.jpg',
  gallery_4: '/images/saanjh/lush-outdoor-patio.jpg',
};

/**
 * Resolves a named image slot to its curated Saanjh Viman Nagar photograph
 * or a placeholder SVG matching the required aspect ratio and alt text.
 */
export function getImageSlot(slotName: string, aspect: ImageAspect = '4x3'): ImageSlot {
  const normalized = slotName.replace(/[._-]/g, ' ');
  const mappedSrc = SAANJH_IMAGE_SLOT_MAP[slotName];
  return {
    slot: slotName,
    aspect,
    src: mappedSrc ?? `/placeholders/${aspect}.svg`,
    alt: `Saanjh Viman Nagar — ${normalized}`,
  };
}

/**
 * Formats an INR price cleanly (`₹420`), or falls back to `₹{{PRICE}}` when no price is supplied.
 */
export function formatPriceToken(price?: number | string | null): string {
  if (price === undefined || price === null || price === '{{PRICE}}') {
    return '₹{{PRICE}}';
  }
  if (typeof price === 'string' && price.startsWith('{{')) {
    return `₹${price}`;
  }
  return `₹${Number(price).toLocaleString('en-IN')}`;
}
