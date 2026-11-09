import { ImageAspect } from './content';

export interface OpeningHourSlot {
  id: string;
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  dayLabel: string;
  openTime: string; // "12:00"
  closeTime: string; // "23:30"
  isClosed: boolean;
}

export interface MenuVariantSlot {
  id: string;
  name: string;
  priceDelta: number;
}

export interface MenuAddOnSlot {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemSlot {
  id: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  imageSlot: string;
  imageAspect: ImageAspect;
  isVeg: boolean;
  isSignature: boolean;
  isNew: boolean;
  isAvailable: boolean;
  prepTimeMins: number;
  taxRatePercent: number;
  allergens: string[];
  variants: MenuVariantSlot[];
  addOns: MenuAddOnSlot[];
}

export interface CategorySlot {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface OfferSlot {
  id: string;
  code: string;
  title: string;
  description: string;
  badgeText: string;
  validFrom: string;
  validUntil: string;
  discountPercent: number;
  minOrderAmount: number;
  isHappyHour: boolean;
  isActive: boolean;
  imageSlot: string;
}

export interface EventSlot {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  description: string;
  isUpcoming: boolean;
  imageSlot: string;
}

export interface ReviewSlot {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  dateLabel: string;
  source: 'GOOGLE' | 'MANUAL';
  isPublished: boolean;
}

export interface GalleryItemSlot {
  id: string;
  title: string;
  category: 'FOOD' | 'INTERIORS' | 'EVENTS';
  imageSlot: string;
  aspect: ImageAspect;
}

export const SEED_CATEGORIES: CategorySlot[] = [
  {
    id: 'cat-starters',
    slug: 'starters',
    name: '{{CATEGORY_1_NAME}}',
    description: '{{CATEGORY_1_DESCRIPTION}}',
    sortOrder: 1,
  },
  {
    id: 'cat-mains',
    slug: 'mains',
    name: '{{CATEGORY_2_NAME}}',
    description: '{{CATEGORY_2_DESCRIPTION}}',
    sortOrder: 2,
  },
  {
    id: 'cat-breads-rice',
    slug: 'breads-rice',
    name: '{{CATEGORY_3_NAME}}',
    description: '{{CATEGORY_3_DESCRIPTION}}',
    sortOrder: 3,
  },
  {
    id: 'cat-bar-beverages',
    slug: 'bar-beverages',
    name: '{{CATEGORY_4_NAME}}',
    description: '{{CATEGORY_4_DESCRIPTION}}',
    sortOrder: 4,
  },
  {
    id: 'cat-desserts',
    slug: 'desserts',
    name: '{{CATEGORY_5_NAME}}',
    description: '{{CATEGORY_5_DESCRIPTION}}',
    sortOrder: 5,
  },
];

export const SEED_MENU_ITEMS: MenuItemSlot[] = [
  {
    id: 'item-1',
    slug: 'signature-dish-1',
    categoryId: 'cat-starters',
    categoryName: '{{CATEGORY_1_NAME}}',
    name: '{{MENU_ITEM_1_NAME}}',
    description: '{{MENU_ITEM_1_DESCRIPTION}}',
    price: 420,
    imageSlot: 'menu_item_1',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 20,
    taxRatePercent: 5,
    allergens: ['{{ALLERGEN_DAIRY}}', '{{ALLERGEN_NUTS}}'],
    variants: [
      { id: 'var-1a', name: '{{VARIANT_REGULAR}}', priceDelta: 0 },
      { id: 'var-1b', name: '{{VARIANT_LARGE}}', priceDelta: 120 },
    ],
    addOns: [
      { id: 'add-1a', name: '{{ADDON_EXTRA_DIP}}', price: 45 },
      { id: 'add-1b', name: '{{ADDON_GARNISH}}', price: 60 },
    ],
  },
  {
    id: 'item-2',
    slug: 'signature-dish-2',
    categoryId: 'cat-starters',
    categoryName: '{{CATEGORY_1_NAME}}',
    name: '{{MENU_ITEM_2_NAME}}',
    description: '{{MENU_ITEM_2_DESCRIPTION}}',
    price: 540,
    imageSlot: 'menu_item_2',
    imageAspect: '4x3',
    isVeg: false,
    isSignature: true,
    isNew: true,
    isAvailable: true,
    prepTimeMins: 25,
    taxRatePercent: 5,
    allergens: ['{{ALLERGEN_MUSTARD}}'],
    variants: [
      { id: 'var-2a', name: '{{VARIANT_REGULAR}}', priceDelta: 0 },
      { id: 'var-2b', name: '{{VARIANT_PLATTER}}', priceDelta: 180 },
    ],
    addOns: [{ id: 'add-2a', name: '{{ADDON_MINT_CHUTNEY}}', price: 35 }],
  },
  {
    id: 'item-3',
    slug: 'signature-dish-3',
    categoryId: 'cat-mains',
    categoryName: '{{CATEGORY_2_NAME}}',
    name: '{{MENU_ITEM_3_NAME}}',
    description: '{{MENU_ITEM_3_DESCRIPTION}}',
    price: 480,
    imageSlot: 'menu_item_3',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 25,
    taxRatePercent: 5,
    allergens: ['{{ALLERGEN_DAIRY}}'],
    variants: [{ id: 'var-3a', name: '{{VARIANT_STANDARD}}', priceDelta: 0 }],
    addOns: [{ id: 'add-3a', name: '{{ADDON_BUTTER_TOPPING}}', price: 40 }],
  },
  {
    id: 'item-4',
    slug: 'signature-dish-4',
    categoryId: 'cat-mains',
    categoryName: '{{CATEGORY_2_NAME}}',
    name: '{{MENU_ITEM_4_NAME}}',
    description: '{{MENU_ITEM_4_DESCRIPTION}}',
    price: 620,
    imageSlot: 'menu_item_4',
    imageAspect: '4x3',
    isVeg: false,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 30,
    taxRatePercent: 5,
    allergens: ['{{ALLERGEN_DAIRY}}', '{{ALLERGEN_GLUTEN}}'],
    variants: [
      { id: 'var-4a', name: '{{VARIANT_HALF}}', priceDelta: 0 },
      { id: 'var-4b', name: '{{VARIANT_FULL}}', priceDelta: 240 },
    ],
    addOns: [],
  },
  {
    id: 'item-5',
    slug: 'breads-dish-5',
    categoryId: 'cat-breads-rice',
    categoryName: '{{CATEGORY_3_NAME}}',
    name: '{{MENU_ITEM_5_NAME}}',
    description: '{{MENU_ITEM_5_DESCRIPTION}}',
    price: 110,
    imageSlot: 'menu_item_5',
    imageAspect: '1x1',
    isVeg: true,
    isSignature: false,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 10,
    taxRatePercent: 5,
    allergens: ['{{ALLERGEN_GLUTEN}}'],
    variants: [{ id: 'var-5a', name: '{{VARIANT_PLAIN}}', priceDelta: 0 }],
    addOns: [],
  },
  {
    id: 'item-6',
    slug: 'beverage-dish-6',
    categoryId: 'cat-bar-beverages',
    categoryName: '{{CATEGORY_4_NAME}}',
    name: '{{MENU_ITEM_6_NAME}}',
    description: '{{MENU_ITEM_6_DESCRIPTION}}',
    price: 290,
    imageSlot: 'menu_item_6',
    imageAspect: '3x4',
    isVeg: true,
    isSignature: false,
    isNew: true,
    isAvailable: true,
    prepTimeMins: 8,
    taxRatePercent: 5,
    allergens: [],
    variants: [{ id: 'var-6a', name: '{{VARIANT_TALL}}', priceDelta: 0 }],
    addOns: [],
  },
  {
    id: 'item-7',
    slug: 'dessert-dish-7',
    categoryId: 'cat-desserts',
    categoryName: '{{CATEGORY_5_NAME}}',
    name: '{{MENU_ITEM_7_NAME}}',
    description: '{{MENU_ITEM_7_DESCRIPTION}}',
    price: 240,
    imageSlot: 'menu_item_7',
    imageAspect: '1x1',
    isVeg: true,
    isSignature: false,
    isNew: false,
    isAvailable: false, // Demonstrates out-of-stock state
    prepTimeMins: 12,
    taxRatePercent: 5,
    allergens: ['{{ALLERGEN_DAIRY}}', '{{ALLERGEN_NUTS}}'],
    variants: [{ id: 'var-7a', name: '{{VARIANT_PORTION}}', priceDelta: 0 }],
    addOns: [],
  },
];

export const SEED_OPENING_HOURS: OpeningHourSlot[] = [
  { id: 'oh-0', dayOfWeek: 0, dayLabel: '{{DAY_SUNDAY}}', openTime: '12:00', closeTime: '23:30', isClosed: false },
  { id: 'oh-1', dayOfWeek: 1, dayLabel: '{{DAY_MONDAY}}', openTime: '12:00', closeTime: '23:00', isClosed: false },
  { id: 'oh-2', dayOfWeek: 2, dayLabel: '{{DAY_TUESDAY}}', openTime: '12:00', closeTime: '23:00', isClosed: false },
  { id: 'oh-3', dayOfWeek: 3, dayLabel: '{{DAY_WEDNESDAY}}', openTime: '12:00', closeTime: '23:00', isClosed: false },
  { id: 'oh-4', dayOfWeek: 4, dayLabel: '{{DAY_THURSDAY}}', openTime: '12:00', closeTime: '23:30', isClosed: false },
  { id: 'oh-5', dayOfWeek: 5, dayLabel: '{{DAY_FRIDAY}}', openTime: '12:00', closeTime: '23:59', isClosed: false },
  { id: 'oh-6', dayOfWeek: 6, dayLabel: '{{DAY_SATURDAY}}', openTime: '12:00', closeTime: '23:59', isClosed: false },
];

export const SEED_OFFERS: OfferSlot[] = [
  {
    id: 'offer-1',
    code: 'SAANJH15',
    title: '{{OFFER_1_TITLE}}',
    description: '{{OFFER_1_DESCRIPTION}}',
    badgeText: '{{BADGE_OFFER}}',
    validFrom: '{{OFFER_1_VALID_FROM}}',
    validUntil: '{{OFFER_1_VALID_UNTIL}}',
    discountPercent: 15,
    minOrderAmount: 800,
    isHappyHour: false,
    isActive: true,
    imageSlot: 'offer_banner_1',
  },
  {
    id: 'offer-2',
    code: 'HAPPYHOUR',
    title: '{{OFFER_2_HAPPY_HOUR_TITLE}}',
    description: '{{OFFER_2_HAPPY_HOUR_DESCRIPTION}}',
    badgeText: '{{BADGE_HAPPY_HOURS}}',
    validFrom: '{{HAPPY_HOURS_START_TIME}}',
    validUntil: '{{HAPPY_HOURS_END_TIME}}',
    discountPercent: 20,
    minOrderAmount: 500,
    isHappyHour: true,
    isActive: true,
    imageSlot: 'offer_banner_2',
  },
];

export const SEED_EVENTS: EventSlot[] = [
  {
    id: 'evt-1',
    title: '{{EVENT_1_TITLE}}',
    dateLabel: '{{EVENT_1_DATE}}',
    timeLabel: '{{EVENT_1_TIME}}',
    description: '{{EVENT_1_DESCRIPTION}}',
    isUpcoming: true,
    imageSlot: 'event_slot_1',
  },
  {
    id: 'evt-2',
    title: '{{EVENT_2_TITLE}}',
    dateLabel: '{{EVENT_2_DATE}}',
    timeLabel: '{{EVENT_2_TIME}}',
    description: '{{EVENT_2_DESCRIPTION}}',
    isUpcoming: false,
    imageSlot: 'event_slot_2',
  },
];

export const SEED_REVIEWS: ReviewSlot[] = [
  {
    id: 'rev-1',
    reviewerName: '{{REVIEWER_1_NAME}}',
    rating: 5,
    comment: '{{REVIEW_1_TEXT}}',
    dateLabel: '{{REVIEW_1_DATE}}',
    source: 'GOOGLE',
    isPublished: true,
  },
  {
    id: 'rev-2',
    reviewerName: '{{REVIEWER_2_NAME}}',
    rating: 5,
    comment: '{{REVIEW_2_TEXT}}',
    dateLabel: '{{REVIEW_2_DATE}}',
    source: 'MANUAL',
    isPublished: true,
  },
  {
    id: 'rev-3',
    reviewerName: '{{REVIEWER_3_NAME}}',
    rating: 4,
    comment: '{{REVIEW_3_TEXT}}',
    dateLabel: '{{REVIEW_3_DATE}}',
    source: 'GOOGLE',
    isPublished: true,
  },
];

export const SEED_GALLERY: GalleryItemSlot[] = [
  { id: 'gal-1', title: '{{GALLERY_ITEM_1_TITLE}}', category: 'FOOD', imageSlot: 'gallery_food_1', aspect: '4x3' },
  { id: 'gal-2', title: '{{GALLERY_ITEM_2_TITLE}}', category: 'INTERIORS', imageSlot: 'gallery_interior_1', aspect: '16x9' },
  { id: 'gal-3', title: '{{GALLERY_ITEM_3_TITLE}}', category: 'FOOD', imageSlot: 'gallery_food_2', aspect: '1x1' },
  { id: 'gal-4', title: '{{GALLERY_ITEM_4_TITLE}}', category: 'EVENTS', imageSlot: 'gallery_event_1', aspect: '3x4' },
  { id: 'gal-5', title: '{{GALLERY_ITEM_5_TITLE}}', category: 'INTERIORS', imageSlot: 'gallery_interior_2', aspect: '4x3' },
  { id: 'gal-6', title: '{{GALLERY_ITEM_6_TITLE}}', category: 'FOOD', imageSlot: 'gallery_food_3', aspect: '1x1' },
];

/**
 * Computes whether the restaurant is currently open in IST (`Asia/Kolkata`)
 * based on `SEED_OPENING_HOURS` (PRD 7.1).
 */
export function getLiveOpenStatus(hours: OpeningHourSlot[] = SEED_OPENING_HOURS): {
  isOpen: boolean;
  todaySlot: OpeningHourSlot;
} {
  const now = new Date();
  const day = now.getDay();
  const todaySlot = hours.find((h) => h.dayOfWeek === day) ?? hours[0];
  if (!todaySlot || todaySlot.isClosed) {
    return { isOpen: false, todaySlot };
  }
  const [openH, openM] = todaySlot.openTime.split(':').map(Number);
  const [closeH, closeM] = todaySlot.closeTime.split(':').map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return {
    isOpen: currentMinutes >= openMinutes && currentMinutes <= closeMinutes,
    todaySlot,
  };
}

