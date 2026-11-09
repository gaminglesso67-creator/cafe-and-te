import { ImageAspect } from './content';

export interface OpeningHourSlot {
  id: string;
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  dayLabel: string;
  openTime: string; // "12:00"
  closeTime: string; // "23:59" (12:00 Midnight)
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
    name: 'Small Plates & Crostinis',
    description: 'Continental bruschettas, mushroom crostinis, and modern Indian fusion starters',
    sortOrder: 1,
  },
  {
    id: 'cat-mains',
    slug: 'mains',
    name: 'Maharashtrian & Indian Mains',
    description: 'Regional Maharashtrian specialties and slow-simmered North Indian gravies',
    sortOrder: 2,
  },
  {
    id: 'cat-breads-rice',
    slug: 'breads-rice',
    name: 'Rich Biryanis & Tandoor',
    description: 'Fragrant Dum Biryanis, artisanal kulchas, and tandoori breads',
    sortOrder: 3,
  },
  {
    id: 'cat-continental-asian',
    slug: 'continental-asian',
    name: 'Italian Pizzas & Oriental Wok',
    description: 'Hand-stretched pizzas, Continental plates, and pan-Asian wok tossed favourites',
    sortOrder: 4,
  },
  {
    id: 'cat-bar-beverages',
    slug: 'bar-beverages',
    name: 'Artisanal Mocktails & Bar',
    description: 'Botanical zero-proof mocktails and craft pours from our newly opened bar section',
    sortOrder: 5,
  },
];

export const SEED_MENU_ITEMS: MenuItemSlot[] = [
  {
    id: 'item-1',
    slug: 'truffle-mushroom-crostini',
    categoryId: 'cat-starters',
    categoryName: 'Small Plates & Crostinis',
    name: 'Creamy Wild Mushroom & Herb Crostini',
    description:
      'Saanjh signature toasted sourdough topped with sautéed wild mushrooms, garlic confit, thyme cream, and shaved parmesan.',
    price: 385,
    imageSlot: 'mushroom_crostini_signature',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 15,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Gluten'],
    variants: [
      { id: 'var-1a', name: '4 Pieces (Regular)', priceDelta: 0 },
      { id: 'var-1b', name: '6 Pieces (Sharing Platter)', priceDelta: 140 },
    ],
    addOns: [
      { id: 'add-1a', name: 'Truffle Oil Drizzle', price: 65 },
      { id: 'add-1b', name: 'Extra Parmesan Shavings', price: 50 },
    ],
  },
  {
    id: 'item-2',
    slug: 'kala-masala-mutton-rassa',
    categoryId: 'cat-mains',
    categoryName: 'Maharashtrian & Indian Mains',
    name: 'Khandeshi Kala Masala Mutton Handi',
    description:
      'Authentic Maharashtrian specialty slow-braised in hand-roasted black stone flower, charred coconut, and heirloom spices.',
    price: 560,
    imageSlot: 'maharashtrian_kala_masala_handi',
    imageAspect: '4x3',
    isVeg: false,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 25,
    taxRatePercent: 5,
    allergens: ['Coconut'],
    variants: [
      { id: 'var-2a', name: 'Regular Handi', priceDelta: 0 },
      { id: 'var-2b', name: 'Family Handi (Serves 3–4)', priceDelta: 320 },
    ],
    addOns: [{ id: 'add-2a', name: 'Pair of Jawar Bhakri', price: 80 }],
  },
  {
    id: 'item-3',
    slug: 'awadhi-dum-murgh-biryani',
    categoryId: 'cat-breads-rice',
    categoryName: 'Rich Biryanis & Tandoor',
    name: 'Saanjh Royal Dum Chicken Biryani',
    description:
      'Long-grain aged basmati layered with saffron, caramelized onions, mint, and succulent marinated chicken sealed in a clay handi; served with burhani raita.',
    price: 495,
    imageSlot: 'saanjh_royal_dum_biryani',
    imageAspect: '4x3',
    isVeg: false,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 25,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Nuts'],
    variants: [
      { id: 'var-3a', name: 'Individual Dum Pot', priceDelta: 0 },
      { id: 'var-3b', name: 'Large Family Pot', priceDelta: 240 },
    ],
    addOns: [{ id: 'add-3a', name: 'Extra Mirchi Ka Salan', price: 45 }],
  },
  {
    id: 'item-4',
    slug: 'saanjh-botanical-sunset-elixir',
    categoryId: 'cat-bar-beverages',
    categoryName: 'Artisanal Mocktails & Bar',
    name: 'Saanjh Dusk Botanical Mocktail',
    description:
      'Handcrafted signature cooler with smoked kokum, kaffir lime leaves, elderflower tonic, and pomegranate pearls from our newly opened bar.',
    price: 275,
    imageSlot: 'artisanal_dusk_mocktail',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: true,
    isAvailable: true,
    prepTimeMins: 8,
    taxRatePercent: 5,
    allergens: [],
    variants: [
      { id: 'var-4a', name: 'Zero-Proof Artisanal Mocktail', priceDelta: 0 },
      { id: 'var-4b', name: 'Pitcher (Serves 4)', priceDelta: 520 },
    ],
    addOns: [],
  },
  {
    id: 'item-5',
    slug: 'burrata-pesto-woodfired-pizza',
    categoryId: 'cat-continental-asian',
    categoryName: 'Italian Pizzas & Oriental Wok',
    name: 'Sun-Dried Tomato, Basil Pesto & Bocconcini Pizza',
    description:
      '11-inch thin-crust Italian pizza baked crisp with San Marzano tomato sauce, house walnut-free basil pesto, and fresh bocconcini.',
    price: 520,
    imageSlot: 'italian_pesto_pizza',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: false,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 20,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Gluten'],
    variants: [{ id: 'var-5a', name: '11-Inch Thin Crust', priceDelta: 0 }],
    addOns: [{ id: 'add-5a', name: 'Extra Olives & Jalapeños', price: 60 }],
  },
  {
    id: 'item-6',
    slug: 'modern-indian-thecha-paneer-tikka',
    categoryId: 'cat-starters',
    categoryName: 'Small Plates & Crostinis',
    name: 'Kolhapuri Green Thecha Paneer Tikka',
    description:
      'Modern Indian fusion of malai cottage cheese char-grilled with pounded green chilli, roasted peanut, and garlic thecha.',
    price: 410,
    imageSlot: 'thecha_paneer_fusion',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: false,
    isNew: true,
    isAvailable: true,
    prepTimeMins: 18,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Peanuts'],
    variants: [{ id: 'var-6a', name: '6 Pieces', priceDelta: 0 }],
    addOns: [],
  },
  {
    id: 'item-7',
    slug: 'lotus-stem-honey-chilli-wok',
    categoryId: 'cat-continental-asian',
    categoryName: 'Italian Pizzas & Oriental Wok',
    name: 'Crispy Schezwan & Plum Glazed Lotus Stem',
    description:
      'Wok-tossed crispy lotus stem chips glazed in smoky chilli-plum reduction and toasted white sesame.',
    price: 390,
    imageSlot: 'crispy_lotus_stem_wok',
    imageAspect: '1x1',
    isVeg: true,
    isSignature: false,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 15,
    taxRatePercent: 5,
    allergens: ['Sesame', 'Soy'],
    variants: [{ id: 'var-7a', name: 'Regular Portion', priceDelta: 0 }],
    addOns: [],
  },
  {
    id: 'item-8',
    slug: 'mushroom-truffle-veloute-soup',
    categoryId: 'cat-starters',
    categoryName: 'Small Plates & Crostinis',
    name: 'Mushroom Truffle Soup',
    description:
      'Viman Nagar diner favourite — slow-simmered wild forest mushroom velouté finished with aromatic white truffle oil and herb garlic croutons.',
    price: 275,
    imageSlot: 'mushroom_crostini_signature',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 12,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Gluten'],
    variants: [{ id: 'var-8a', name: 'By the Bowl', priceDelta: 0 }],
    addOns: [{ id: 'add-8a', name: 'Toasted Garlic Brioche', price: 55 }],
  },
  {
    id: 'item-9',
    slug: 'wok-tossed-cottage-cheese',
    categoryId: 'cat-continental-asian',
    categoryName: 'Italian Pizzas & Oriental Wok',
    name: 'Wok-Tossed Smoked Chilli Cottage Cheese',
    description:
      'Silky malai paneer cubes flash-tossed in a high-flame wok with roasted garlic, burnt red chillies, crunchy bell peppers, and scallion soy glaze.',
    price: 365,
    imageSlot: 'thecha_paneer_fusion',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 15,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Soy'],
    variants: [{ id: 'var-9a', name: 'Regular Platter', priceDelta: 0 }],
    addOns: [],
  },
];

// Open daily from 12:00 PM to 12:00 Midnight
export const SEED_OPENING_HOURS: OpeningHourSlot[] = [
  { id: 'oh-0', dayOfWeek: 0, dayLabel: 'Sunday', openTime: '12:00', closeTime: '23:59', isClosed: false },
  { id: 'oh-1', dayOfWeek: 1, dayLabel: 'Monday', openTime: '12:00', closeTime: '23:59', isClosed: false },
  { id: 'oh-2', dayOfWeek: 2, dayLabel: 'Tuesday', openTime: '12:00', closeTime: '23:59', isClosed: false },
  { id: 'oh-3', dayOfWeek: 3, dayLabel: 'Wednesday', openTime: '12:00', closeTime: '23:59', isClosed: false },
  { id: 'oh-4', dayOfWeek: 4, dayLabel: 'Thursday', openTime: '12:00', closeTime: '23:59', isClosed: false },
  { id: 'oh-5', dayOfWeek: 5, dayLabel: 'Friday', openTime: '12:00', closeTime: '23:59', isClosed: false },
  { id: 'oh-6', dayOfWeek: 6, dayLabel: 'Saturday', openTime: '12:00', closeTime: '23:59', isClosed: false },
];

export const SEED_OFFERS: OfferSlot[] = [
  {
    id: 'offer-1',
    code: 'LUNCH10',
    title: 'Walk-In Lunch Privilege — Flat 10% OFF',
    description:
      'Enjoy a flat 10% off on your total food & soft beverage bill for walk-in and online lunch orders between 12:00 PM and 4:00 PM daily.',
    badgeText: 'Lunch Deal (12 PM – 4 PM)',
    validFrom: '12:00 PM Daily',
    validUntil: '04:00 PM Daily',
    discountPercent: 10,
    minOrderAmount: 600,
    isHappyHour: true,
    isActive: true,
    imageSlot: 'lunch_walkin_offer',
  },
  {
    id: 'offer-2',
    code: 'SAANJH25',
    title: 'Partner Bank & Dining Privileges — Up to 25%–30% OFF',
    description:
      'Save up to 25%–30% when paying via select partner bank cards on EazyDiner or Zomato, or apply SAANJH15 on direct online orders above ₹800.',
    badgeText: 'Partner Card Privilege',
    validFrom: 'All Week',
    validUntil: '12:00 Midnight',
    discountPercent: 25,
    minOrderAmount: 1000,
    isHappyHour: false,
    isActive: true,
    imageSlot: 'partner_bank_dining_deal',
  },
];

export const SEED_EVENTS: EventSlot[] = [
  {
    id: 'evt-1',
    title: 'Newly Opened Bar Section — Dusk Botanical & Craft Pours',
    dateLabel: 'Every Evening',
    timeLabel: '6:00 PM – 12:00 Midnight',
    description:
      'Experience our newly launched bar in Viman Nagar featuring botanical cocktails, artisanal mocktails, and small-plate pairings.',
    isUpcoming: true,
    imageSlot: 'newly_opened_bar_evenings',
  },
  {
    id: 'evt-2',
    title: 'Multi-Generational Sunday Family Lunch on the Patio',
    dateLabel: 'Sundays',
    timeLabel: '12:00 PM – 4:00 PM',
    description:
      'Gather the whole family in our lush green outdoor patio or AC dining hall with valet parking and step-free wheelchair access.',
    isUpcoming: true,
    imageSlot: 'sunday_family_patio_lunch',
  },
];

export const SEED_REVIEWS: ReviewSlot[] = [
  {
    id: 'rev-1',
    reviewerName: 'Rohan Deshmukh (Viman Nagar)',
    rating: 5,
    comment:
      'True to its name, Saanjh has such a warm, earthy wooden ambience with soft amber lighting. The Mushroom Crostinis and Artisanal Mocktails are outstanding!',
    dateLabel: 'Google Review · 4.5★ (191)',
    source: 'GOOGLE',
    isPublished: true,
  },
  {
    id: 'rev-2',
    reviewerName: 'Priya & Kulkarni Family',
    rating: 5,
    comment:
      'Brought my parents and kids here for a family dinner opposite Phoenix Marketcity. Having valet parking, wheelchair accessibility, and both Maharashtrian mains and Italian pizzas made everyone happy.',
    dateLabel: 'Verified Diner · Clover Park',
    source: 'MANUAL',
    isPublished: true,
  },
  {
    id: 'rev-3',
    reviewerName: 'Siddharth Mehta',
    rating: 5,
    comment:
      'Love the lush green outdoor patio in the evening and the newly opened bar section. Great value at around ₹1,000 for two!',
    dateLabel: 'Google Review · Viman Nagar',
    source: 'GOOGLE',
    isPublished: true,
  },
  {
    id: 'rev-4',
    reviewerName: 'Ananya Joshi',
    rating: 5,
    comment:
      'The Mushroom Truffle Soup and Wok-Tossed Smoked Chilli Cottage Cheese are must-tries. Super warm service and the 10% walk-in lunch deal is a great bonus.',
    dateLabel: 'EazyDiner Verified · Viman Nagar',
    source: 'GOOGLE',
    isPublished: true,
  },
  {
    id: 'rev-5',
    reviewerName: 'Vikramaditya & Neha Patil',
    rating: 5,
    comment:
      'Celebrated our anniversary on the patio under the amber lanterns. The Khandeshi Kala Masala Mutton Handi and Royal Dum Biryani tasted truly authentic.',
    dateLabel: 'Verified Guest · Clover Park',
    source: 'MANUAL',
    isPublished: true,
  },
];

export const SEED_GALLERY: GalleryItemSlot[] = [
  {
    id: 'gal-1',
    title: 'Creamy Wild Mushroom Crostinis & Small Plates',
    category: 'FOOD',
    imageSlot: 'gallery_mushroom_crostini',
    aspect: '4x3',
  },
  {
    id: 'gal-2',
    title: 'Earthy Wooden Interiors & Soft Amber Lighting',
    category: 'INTERIORS',
    imageSlot: 'gallery_wooden_amber_interiors',
    aspect: '16x9',
  },
  {
    id: 'gal-3',
    title: 'Artisanal Cocktails & Botanical Mocktails at the New Bar',
    category: 'FOOD',
    imageSlot: 'gallery_bar_cocktails',
    aspect: '1x1',
  },
  {
    id: 'gal-4',
    title: 'Multi-Generational Family Celebrations in Clover Park',
    category: 'EVENTS',
    imageSlot: 'gallery_family_dining',
    aspect: '3x4',
  },
  {
    id: 'gal-5',
    title: 'Lush Green Outdoor Patio Setup at Dusk',
    category: 'INTERIORS',
    imageSlot: 'gallery_lush_green_patio',
    aspect: '16x9',
  },
  {
    id: 'gal-6',
    title: 'Royal Dum Biryani & Maharashtrian Specialties',
    category: 'FOOD',
    imageSlot: 'gallery_dum_biryani',
    aspect: '1x1',
  },
];

/**
 * Computes whether the restaurant is currently open in IST (`Asia/Kolkata`)
 * based on `SEED_OPENING_HOURS` (Open daily 12:00 PM to 12:00 Midnight).
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
