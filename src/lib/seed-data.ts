import { ImageAspect } from './content';

export interface OpeningHourSlot {
  id: string;
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  dayLabel: string;
  openTime: string; // "09:00"
  closeTime: string; // "23:30" (11:30 PM)
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
    slug: 'specialty-coffee-cappuccinos',
    name: 'Specialty Coffee & Cappuccinos',
    description:
      'Signature Vietnamese Iced Coffee, Hazelnut Butter Cappuccino, Vanilla Cappuccino, and slow-steeped cold brews',
    sortOrder: 1,
  },
  {
    id: 'cat-mains',
    slug: 'pasta-social',
    name: 'Pasta Social by Caffè & Tè',
    description:
      'Handcrafted Italian pastas tossed in sun-dried tomato rosé, truffle mushroom cream, and basil pesto',
    sortOrder: 2,
  },
  {
    id: 'cat-breads-rice',
    slug: 'croissants-sandwiches',
    name: 'Croissants & Cafe Sandwiches',
    description:
      'Flaky French butter croissants, grilled pesto focaccia, and loaded continental cafe sandwiches',
    sortOrder: 3,
  },
  {
    id: 'cat-continental-asian',
    slug: 'peri-peri-bites',
    name: 'Peri-Peri Fries & Quick Bites',
    description:
      'Crowd-favourite crispy peri-peri fries, garlic herb wedges, and hand-tossed cafe flat-breads',
    sortOrder: 4,
  },
  {
    id: 'cat-bar-beverages',
    slug: 'cheesecakes-teas',
    name: 'Cheesecakes & Artisanal Teas',
    description:
      'Creamy Basque & New York cheesecakes paired with botanical iced teas and refreshers',
    sortOrder: 5,
  },
];

export const SEED_MENU_ITEMS: MenuItemSlot[] = [
  {
    id: 'item-1',
    slug: 'vietnamese-iced-coffee',
    categoryId: 'cat-starters',
    categoryName: 'Specialty Coffee & Cappuccinos',
    name: 'Vietnamese Iced Coffee',
    description:
      'Caffè & Tè signature slow-dripped dark roast espresso swirled over velvety sweetened condensed milk and crystal-clear ice.',
    price: 220,
    imageSlot: 'mushroom_crostini_signature',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 6,
    taxRatePercent: 5,
    allergens: ['Dairy'],
    variants: [
      { id: 'var-1a', name: 'Regular Tall Glass', priceDelta: 0 },
      { id: 'var-1b', name: 'Double Espresso Shot', priceDelta: 45 },
    ],
    addOns: [
      { id: 'add-1a', name: 'Hazelnut Cream Cold Foam', price: 40 },
      { id: 'add-1b', name: 'Sub Oat Milk', price: 50 },
    ],
  },
  {
    id: 'item-2',
    slug: 'hazelnut-butter-cappuccino',
    categoryId: 'cat-starters',
    categoryName: 'Specialty Coffee & Cappuccinos',
    name: 'Hazelnut Butter Cappuccino',
    description:
      'Silky micro-foam cappuccino infused with house-roasted brown-butter hazelnut reduction and dusted with praline.',
    price: 210,
    imageSlot: 'maharashtrian_kala_masala_handi',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 6,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Nuts'],
    variants: [
      { id: 'var-2a', name: 'Regular Cup (8 oz)', priceDelta: 0 },
      { id: 'var-2b', name: 'Large Mug (12 oz)', priceDelta: 40 },
    ],
    addOns: [{ id: 'add-2a', name: 'Pair with Mini Butter Croissant', price: 110 }],
  },
  {
    id: 'item-3',
    slug: 'pasta-social-sundried-tomato-tagliatelle',
    categoryId: 'cat-mains',
    categoryName: 'Pasta Social by Caffè & Tè',
    name: 'Pasta Social Rosé & Parmesan Tagliatelle',
    description:
      'Freshly rolled ribbon pasta simmered in a velvety San Marzano tomato & mascarpone blush sauce with sun-dried tomatoes, sweet basil, and aged parmigiano.',
    price: 340,
    imageSlot: 'saanjh_royal_dum_biryani',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: true,
    isAvailable: true,
    prepTimeMins: 16,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Gluten'],
    variants: [
      { id: 'var-3a', name: 'Tagliatelle', priceDelta: 0 },
      { id: 'var-3b', name: 'Penne / Rigatoni', priceDelta: 0 },
    ],
    addOns: [
      { id: 'add-3a', name: 'Toasted Garlic Sourdough (2 pcs)', price: 60 },
      { id: 'add-3b', name: 'Extra Burrata / Parmesan', price: 75 },
    ],
  },
  {
    id: 'item-4',
    slug: 'caramel-iced-cold-brew',
    categoryId: 'cat-starters',
    categoryName: 'Specialty Coffee & Cappuccinos',
    name: 'Salted Caramel & Vanilla Cold Brew',
    description:
      '18-hour slow-steeped Arabica cold brew layered with Madagascar vanilla bean syrup and a ribbon of salted caramel crema.',
    price: 230,
    imageSlot: 'artisanal_dusk_mocktail',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 5,
    taxRatePercent: 5,
    allergens: ['Dairy'],
    variants: [
      { id: 'var-4a', name: 'Classic Over Ice', priceDelta: 0 },
      { id: 'var-4b', name: 'With Vanilla Sweet Cream Foam', priceDelta: 45 },
    ],
    addOns: [],
  },
  {
    id: 'item-5',
    slug: 'flaky-butter-croissant-pesto-melt',
    categoryId: 'cat-breads-rice',
    categoryName: 'Croissants & Cafe Sandwiches',
    name: 'Flaky French Butter Croissant & Pesto Melt',
    description:
      'Golden laminated all-butter croissant baked fresh daily — served warm as a classic pastry or filled with basil pesto, bocconcini, and slow-roasted cherry tomatoes.',
    price: 240,
    imageSlot: 'italian_pesto_pizza',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: false,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 10,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Gluten'],
    variants: [
      { id: 'var-5a', name: 'Classic Butter Croissant + Jam', priceDelta: -60 },
      { id: 'var-5b', name: 'Loaded Pesto & Bocconcini Croissant Sandwich', priceDelta: 0 },
    ],
    addOns: [{ id: 'add-5a', name: 'Side of Peri-Peri Fries', price: 95 }],
  },
  {
    id: 'item-6',
    slug: 'burnt-basque-berry-cheesecake',
    categoryId: 'cat-bar-beverages',
    categoryName: 'Cheesecakes & Artisanal Teas',
    name: 'Creamy Burnt Basque Cheesecake',
    description:
      'Caramelized crust with a cloud-like creamy mascarpone & cream cheese centre, served with house wild-berry compote or warm Belgian chocolate pour.',
    price: 260,
    imageSlot: 'thecha_paneer_fusion',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: true,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 5,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Gluten'],
    variants: [
      { id: 'var-6a', name: 'Berry Compote Topping', priceDelta: 0 },
      { id: 'var-6b', name: 'Warm Hazelnut Nutella Pour', priceDelta: 35 },
    ],
    addOns: [],
  },
  {
    id: 'item-7',
    slug: 'crispy-peri-peri-cafe-fries',
    categoryId: 'cat-continental-asian',
    categoryName: 'Peri-Peri Fries & Quick Bites',
    name: 'Crispy Peri-Peri Cafe Fries & Chipotle Dip',
    description:
      'Viman Nagar crowd-favourite — double-cooked golden skin-on fries tossed in zesty African bird’s-eye peri-peri spice and served with smoky chipotle garlic aioli.',
    price: 190,
    imageSlot: 'crispy_lotus_stem_wok',
    imageAspect: '1x1',
    isVeg: true,
    isSignature: false,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 10,
    taxRatePercent: 5,
    allergens: [],
    variants: [
      { id: 'var-7a', name: 'Regular Bowl', priceDelta: 0 },
      { id: 'var-7b', name: 'Loaded Cheese & Jalapeño Overloaded', priceDelta: 70 },
    ],
    addOns: [],
  },
  {
    id: 'item-8',
    slug: 'vanilla-bean-cappuccino',
    categoryId: 'cat-starters',
    categoryName: 'Specialty Coffee & Cappuccinos',
    name: 'Madagascar Vanilla Bean Cappuccino',
    description:
      'Double shot of medium-dark Arabica espresso balanced with velvety steamed milk and pure Madagascar vanilla bean.',
    price: 195,
    imageSlot: 'maharashtrian_kala_masala_handi',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: false,
    isNew: false,
    isAvailable: true,
    prepTimeMins: 6,
    taxRatePercent: 5,
    allergens: ['Dairy'],
    variants: [
      { id: 'var-8a', name: 'Hot Cappuccino', priceDelta: 0 },
      { id: 'var-8b', name: 'Iced Frappe Style', priceDelta: 25 },
    ],
    addOns: [{ id: 'add-8a', name: 'Oat Milk Upgrade', price: 50 }],
  },
  {
    id: 'item-9',
    slug: 'truffle-mushroom-alfredo-pasta-social',
    categoryId: 'cat-mains',
    categoryName: 'Pasta Social by Caffè & Tè',
    name: 'Truffle & Wild Mushroom Alfredo Penne',
    description:
      'Pasta Social signature — al dente penne folded into roasted button & shiitake mushrooms, garlic cream, fresh thyme, and white truffle drizzle.',
    price: 360,
    imageSlot: 'saanjh_royal_dum_biryani',
    imageAspect: '4x3',
    isVeg: true,
    isSignature: false,
    isNew: true,
    isAvailable: true,
    prepTimeMins: 16,
    taxRatePercent: 5,
    allergens: ['Dairy', 'Gluten'],
    variants: [{ id: 'var-9a', name: 'With Garlic Bread', priceDelta: 0 }],
    addOns: [],
  },
];

// Open daily · Closes 11:30 PM
export const SEED_OPENING_HOURS: OpeningHourSlot[] = [
  { id: 'oh-0', dayOfWeek: 0, dayLabel: 'Sunday', openTime: '09:00', closeTime: '23:30', isClosed: false },
  { id: 'oh-1', dayOfWeek: 1, dayLabel: 'Monday', openTime: '09:00', closeTime: '23:30', isClosed: false },
  { id: 'oh-2', dayOfWeek: 2, dayLabel: 'Tuesday', openTime: '09:00', closeTime: '23:30', isClosed: false },
  { id: 'oh-3', dayOfWeek: 3, dayLabel: 'Wednesday', openTime: '09:00', closeTime: '23:30', isClosed: false },
  { id: 'oh-4', dayOfWeek: 4, dayLabel: 'Thursday', openTime: '09:00', closeTime: '23:30', isClosed: false },
  { id: 'oh-5', dayOfWeek: 5, dayLabel: 'Friday', openTime: '09:00', closeTime: '23:30', isClosed: false },
  { id: 'oh-6', dayOfWeek: 6, dayLabel: 'Saturday', openTime: '09:00', closeTime: '23:30', isClosed: false },
];

export const SEED_OFFERS: OfferSlot[] = [
  {
    id: 'offer-1',
    code: 'PASTASOCIAL',
    title: 'Pasta Social + Iced Coffee Duo — ₹499 All Day',
    description:
      'Celebrate the launch of our newly air-conditioned Pasta Social indoor lounge: enjoy any handcrafted pasta bowl paired with a Vietnamese Iced Coffee or Cold Brew.',
    badgeText: 'Pasta Social Launch',
    validFrom: 'All Day Daily',
    validUntil: '11:30 PM',
    discountPercent: 15,
    minOrderAmount: 450,
    isHappyHour: true,
    isActive: true,
    imageSlot: 'lunch_walkin_offer',
  },
  {
    id: 'offer-2',
    code: 'SIPPAINT10',
    title: 'Sip & Paint Garden Canvas Session + Any Cappuccino',
    description:
      'Unwind in our open-air garden patio at Udchalo House with a mini canvas, acrylic paints, brushes, and your choice of Hazelnut Butter or Vanilla Cappuccino.',
    badgeText: 'Art & Coffee Combo',
    validFrom: 'All Week',
    validUntil: '11:30 PM',
    discountPercent: 10,
    minOrderAmount: 350,
    isHappyHour: false,
    isActive: true,
    imageSlot: 'partner_bank_dining_deal',
  },
];

export const SEED_EVENTS: EventSlot[] = [
  {
    id: 'evt-1',
    title: 'Pasta Social by Caffè & Tè — Newly Air-Conditioned Indoor Lounge',
    dateLabel: 'Now Open Daily',
    timeLabel: '12:00 PM – 11:30 PM',
    description:
      "From warm ambient lighting to our newly installed AC, every detail at Pasta Social by Caffè & Tè is crafted for cosy pasta dinners and coffee dates.",
    isUpcoming: true,
    imageSlot: 'newly_opened_bar_evenings',
  },
  {
    id: 'evt-2',
    title: 'Weekend Sip & Paint in the Open-Air Garden Patio',
    dateLabel: 'Saturdays & Sundays',
    timeLabel: '4:00 PM – 9:00 PM',
    description:
      'Pick up a canvas and brush at your table while sipping Vietnamese Iced Coffee, cold brews, and snacking on croissants and peri-peri fries.',
    isUpcoming: true,
    imageSlot: 'sunday_family_patio_lunch',
  },
];

export const SEED_REVIEWS: ReviewSlot[] = [
  {
    id: 'rev-1',
    reviewerName: 'Hardhik Jain (Local Guide)',
    rating: 5,
    comment:
      'I had a fantastic time! The food was delicious, and the ambience was absolutely amazing. A special thanks to Tushar for the friendly and excellent service.',
    dateLabel: 'Google Review · 3 weeks ago · New',
    source: 'GOOGLE',
    isPublished: true,
  },
  {
    id: 'rev-2',
    reviewerName: 'Viman Nagar Visitor Update',
    rating: 5,
    comment:
      'It was my first experience here and it was really fascinating — the food, view, everything was marvellous!',
    dateLabel: 'Google Maps Visitor Update · 4.4★ (85)',
    source: 'GOOGLE',
    isPublished: true,
  },
  {
    id: 'rev-3',
    reviewerName: 'Gemini Review Summary (85 Diners)',
    rating: 5,
    comment:
      'People say this cafe offers delicious coffee, including vanilla cappuccino, cold coffee, and cold brews, along with tasty croissants and pasta dishes. Guests also highlight the pleasant open-air ambiance, the opportunity to engage in painting, and the sweet, attentive staff.',
    dateLabel: 'Google Maps · 4.4★ across 85 Reviews',
    source: 'GOOGLE',
    isPublished: true,
  },
  {
    id: 'rev-4',
    reviewerName: 'Raso (Local Guide · 192 Reviews)',
    rating: 4,
    comment:
      'The café has a lovely natural setting with outdoor seating in Clover Park, making it a really nice, peaceful place to sit and unwind over iced coffee.',
    dateLabel: 'Google Review · a month ago',
    source: 'GOOGLE',
    isPublished: true,
  },
  {
    id: 'rev-5',
    reviewerName: 'Aarav & Meera Kulkarni',
    rating: 5,
    comment:
      'The Vietnamese Iced Coffee, Hazelnut Butter Cappuccino, and Cheesecake are top-tier, and at ₹200–400 per person it is easily the coziest spot in Udchalo House, Viman Nagar.',
    dateLabel: 'Verified Regular · Clover Park',
    source: 'MANUAL',
    isPublished: true,
  },
];

export const SEED_GALLERY: GalleryItemSlot[] = [
  {
    id: 'gal-1',
    title: 'Signature Vietnamese Iced Coffee & Cold Brews',
    category: 'FOOD',
    imageSlot: 'gallery_mushroom_crostini',
    aspect: '4x3',
  },
  {
    id: 'gal-2',
    title: 'Open-Air Garden Patio & Sip-and-Paint Canvases at Dusk',
    category: 'INTERIORS',
    imageSlot: 'gallery_wooden_amber_interiors',
    aspect: '16x9',
  },
  {
    id: 'gal-3',
    title: 'Caramel Iced Cold Brew & Matcha Refreshers',
    category: 'FOOD',
    imageSlot: 'gallery_bar_cocktails',
    aspect: '1x1',
  },
  {
    id: 'gal-4',
    title: 'Newly Air-Conditioned Pasta Social Dining Room',
    category: 'EVENTS',
    imageSlot: 'gallery_family_dining',
    aspect: '3x4',
  },
  {
    id: 'gal-5',
    title: 'Tabletop Canvas Painting & Garden Seating at Udchalo House',
    category: 'INTERIORS',
    imageSlot: 'gallery_lush_green_patio',
    aspect: '16x9',
  },
  {
    id: 'gal-6',
    title: 'Pasta Social Handmade Tagliatelle & Hazelnut Cappuccino',
    category: 'FOOD',
    imageSlot: 'gallery_dum_biryani',
    aspect: '1x1',
  },
];

/**
 * Computes whether Caffè & Tè is currently open in IST (`Asia/Kolkata`)
 * based on `SEED_OPENING_HOURS` (Open daily 9:00 AM to 11:30 PM).
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
