/**
 * Sanity Dataset Seed Script (`npm run sanity:seed`)
 * Uploads Saanjh Viman Nagar's categories, 12 menu dishes, offers, events,
 * verified Google reviews, gallery slots, opening hours, and site settings to Sanity.
 */
import { createClient } from '@sanity/client';
import {
  SEED_CATEGORIES,
  SEED_EVENTS,
  SEED_GALLERY,
  SEED_MENU_ITEMS,
  SEED_OFFERS,
  SEED_OPENING_HOURS,
  SEED_REVIEWS,
} from '../src/lib/seed-data';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId || !token) {
  console.error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in environment.'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-01',
  token,
  useCdn: false,
});

async function seedSanity() {
  console.log(`Seeding Sanity project "${projectId}" (dataset "${dataset}")...`);
  const tx = client.transaction();

  // 1. Site Settings Singleton
  tx.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    restaurantName: 'Caffè & Tè — All Day Cafe',
    tagline: 'कैफे & ते - ऑल डे कैफे · Pasta Social · Viman Nagar, Pune',
    phoneDisplay: '097004 02040',
    whatsappNumber: '919700402040',
    address:
      'Ground Floor, Udchalo House, Plot No. 10, Clover Park, Viman Nagar, Pune, Maharashtra 411014 (HW77+HP Pune)',
    announcementBarText:
      'Pasta Social Now Air-Conditioned ✨ · ₹200–400 Per Person · Sip & Paint Open-Air Cafe · Closes 11:30 PM',
    orderingEnabled: true,
    autoConfirmReservations: true,
  });

  // 2. Categories
  for (const cat of SEED_CATEGORIES) {
    tx.createOrReplace({
      _id: `category-${cat.id}`,
      _type: 'menuCategory',
      id: cat.id,
      name: cat.name,
      slug: { _type: 'slug', current: cat.slug },
      sortOrder: cat.sortOrder,
      isActive: true,
    });
  }

  // 3. Menu Items
  for (const item of SEED_MENU_ITEMS) {
    tx.createOrReplace({
      _id: `menuItem-${item.id}`,
      _type: 'menuItem',
      id: item.id,
      categoryId: item.categoryId,
      category: { _type: 'reference', _ref: `category-${item.categoryId}` },
      name: item.name,
      slug: { _type: 'slug', current: item.slug },
      description: item.description,
      price: item.price,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      isSignature: item.isSignature,
      imageSlot: item.imageSlot,
      allergens: item.allergens,
      variants: item.variants.map((v) => ({
        _key: v.id,
        id: v.id,
        name: v.name,
        priceDelta: v.priceDelta,
      })),
      addOns: item.addOns.map((a) => ({
        _key: a.id,
        id: a.id,
        name: a.name,
        price: a.price,
      })),
    });
  }

  // 4. Offers
  for (const offer of SEED_OFFERS) {
    tx.createOrReplace({
      _id: `offer-${offer.id}`,
      _type: 'offer',
      id: offer.id,
      title: offer.title,
      description: offer.description,
      badgeText: offer.badgeText,
      code: offer.code,
      validFrom: offer.validFrom,
      validUntil: offer.validUntil,
      isHappyHour: offer.isHappyHour,
      isActive: true,
    });
  }

  // 5. Events
  for (const evt of SEED_EVENTS) {
    tx.createOrReplace({
      _id: `event-${evt.id}`,
      _type: 'event',
      id: evt.id,
      title: evt.title,
      dateLabel: evt.dateLabel,
      timeLabel: evt.timeLabel,
      description: evt.description,
      isUpcoming: evt.isUpcoming,
      imageSlot: evt.imageSlot,
    });
  }

  // 6. Reviews
  for (const rev of SEED_REVIEWS) {
    tx.createOrReplace({
      _id: `review-${rev.id}`,
      _type: 'review',
      id: rev.id,
      reviewerName: rev.reviewerName,
      rating: rev.rating,
      comment: rev.comment,
      source: rev.source,
      dateLabel: rev.dateLabel,
      isApproved: true,
    });
  }

  // 7. Gallery
  for (const gal of SEED_GALLERY) {
    tx.createOrReplace({
      _id: `gallery-${gal.id}`,
      _type: 'galleryItem',
      id: gal.id,
      title: gal.title,
      category: gal.category,
      imageSlot: gal.imageSlot,
    });
  }

  // 8. Opening Hours
  SEED_OPENING_HOURS.forEach((hr, index) => {
    tx.createOrReplace({
      _id: `openingHours-${index}`,
      _type: 'openingHours',
      dayIndex: index,
      dayLabel: hr.dayLabel,
      openTime: hr.openTime,
      closeTime: hr.closeTime,
      isClosed: hr.isClosed,
    });
  });

  await tx.commit();
  console.log('Successfully seeded all Saanjh Viman Nagar documents into Sanity!');
}

seedSanity().catch((err) => {
  console.error('Sanity seed error:', err);
  process.exit(1);
});

