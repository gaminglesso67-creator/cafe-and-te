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

const CAFE_IMAGE_SLOT_MAP: Record<string, string> = {
  // Hero & About slots
  hero_signboard_visual: '/images/caffe-te/garden-patio-hero.jpg',
  home_about_story: '/images/caffe-te/pasta-social-ac-lounge.jpg',
  caffe_te_patio_interiors: '/images/caffe-te/garden-patio-hero.jpg',
  specialty_espresso_bar: '/images/caffe-te/espresso-and-bakery-bar.jpg',
  lush_green_outdoor_patio: '/images/caffe-te/sip-and-paint-patio.jpg',

  // Signature Menu Dishes (Caffè & Tè + Pasta Social)
  vietnamese_iced_coffee_signature: '/images/caffe-te/vietnamese-iced-coffee.jpg',
  hazelnut_butter_cappuccino: '/images/caffe-te/hazelnut-butter-cappuccino.jpg',
  pasta_social_tagliatelle: '/images/caffe-te/pasta-social-tagliatelle.jpg',
  artisanal_dusk_mocktail: '/images/caffe-te/caramel-cold-brew-matcha.jpg',
  italian_pesto_pizza: '/images/caffe-te/butter-croissant-pesto.jpg',
  burnt_basque_cheesecake: '/images/caffe-te/burnt-basque-cheesecake.jpg',
  peri_peri_cafe_fries: '/images/caffe-te/peri-peri-cafe-fries.jpg',

  // Offers & Events
  lunch_walkin_offer: '/images/caffe-te/sip-and-paint-patio.jpg',
  partner_bank_dining_deal: '/images/caffe-te/espresso-and-bakery-bar.jpg',
  newly_opened_bar_evenings: '/images/caffe-te/espresso-and-bakery-bar.jpg',
  sunday_family_patio_lunch: '/images/caffe-te/pasta-social-ac-lounge.jpg',

  // Gallery Mosaic Slots
  gallery_vietnamese_iced_coffee: '/images/caffe-te/vietnamese-iced-coffee.jpg',
  gallery_wooden_amber_interiors: '/images/caffe-te/garden-patio-hero.jpg',
  gallery_bar_cocktails: '/images/caffe-te/caramel-cold-brew-matcha.jpg',
  gallery_family_dining: '/images/caffe-te/pasta-social-ac-lounge.jpg',
  gallery_lush_green_patio: '/images/caffe-te/sip-and-paint-patio.jpg',
  gallery_pasta_social: '/images/caffe-te/pasta-social-tagliatelle.jpg',
  gallery_1: '/images/caffe-te/garden-patio-hero.jpg',
  gallery_2: '/images/caffe-te/vietnamese-iced-coffee.jpg',
  gallery_3: '/images/caffe-te/caramel-cold-brew-matcha.jpg',
  gallery_4: '/images/caffe-te/sip-and-paint-patio.jpg',
};

/**
 * Resolves a named image slot to its curated Caffè & Tè Viman Nagar photograph
 * or a placeholder SVG matching the required aspect ratio and alt text.
 */
export function getImageSlot(slotName: string, aspect: ImageAspect = '4x3'): ImageSlot {
  if (slotName.startsWith('https://') || slotName.startsWith('http://')) {
    return {
      slot: slotName,
      aspect,
      src: slotName,
      alt: 'Caffè & Tè Viman Nagar — Sanity CMS photograph',
    };
  }
  const normalized = slotName.replace(/[._-]/g, ' ');
  const mappedSrc = CAFE_IMAGE_SLOT_MAP[slotName];
  return {
    slot: slotName,
    aspect,
    src: mappedSrc ?? `/placeholders/${aspect}.svg`,
    alt: `Caffè & Tè Viman Nagar — ${normalized}`,
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
