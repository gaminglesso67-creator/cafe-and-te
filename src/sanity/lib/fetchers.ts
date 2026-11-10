import {
  CategorySlot,
  EventSlot,
  GalleryItemSlot,
  MenuItemSlot,
  OfferSlot,
  OpeningHourSlot,
  ReviewSlot,
  SEED_CATEGORIES,
  SEED_EVENTS,
  SEED_GALLERY,
  SEED_MENU_ITEMS,
  SEED_OFFERS,
  SEED_OPENING_HOURS,
  SEED_REVIEWS,
} from '@/lib/seed-data';
import type { OrderRecord, ReservationRecord } from '@/lib/db';
import { getSanityReadClient, getSanityWriteClient } from './client';
import {
  GROQ_CATEGORIES,
  GROQ_EVENTS,
  GROQ_GALLERY,
  GROQ_MENU_ITEMS,
  GROQ_OFFERS,
  GROQ_OPENING_HOURS,
  GROQ_REVIEWS,
} from './queries';

/**
 * Fetches homepage datasets from Sanity CDN (when configured) with automatic fallback
 * to the curated Viman Nagar seed dataset.
 */
export async function fetchSanityHomePageData(): Promise<{
  hours: OpeningHourSlot[];
  signatureDishes: MenuItemSlot[];
  offers: OfferSlot[];
  reviews: ReviewSlot[];
  gallery: GalleryItemSlot[];
}> {
  const client = getSanityReadClient();
  if (!client) {
    return {
      hours: SEED_OPENING_HOURS,
      signatureDishes: SEED_MENU_ITEMS.filter((i) => i.isSignature),
      offers: SEED_OFFERS,
      reviews: SEED_REVIEWS,
      gallery: SEED_GALLERY,
    };
  }

  try {
    const [hours, menuItems, offers, reviews, gallery] = await Promise.all([
      client.fetch<OpeningHourSlot[]>(GROQ_OPENING_HOURS),
      client.fetch<MenuItemSlot[]>(GROQ_MENU_ITEMS),
      client.fetch<OfferSlot[]>(GROQ_OFFERS),
      client.fetch<ReviewSlot[]>(GROQ_REVIEWS),
      client.fetch<GalleryItemSlot[]>(GROQ_GALLERY),
    ]);

    const resolvedItems = menuItems?.length ? menuItems : SEED_MENU_ITEMS;
    return {
      hours: hours?.length ? hours : SEED_OPENING_HOURS,
      signatureDishes: resolvedItems.filter((i) => i.isSignature),
      offers: offers?.length ? offers : SEED_OFFERS,
      reviews: reviews?.length ? reviews : SEED_REVIEWS,
      gallery: gallery?.length ? gallery : SEED_GALLERY,
    };
  } catch {
    return {
      hours: SEED_OPENING_HOURS,
      signatureDishes: SEED_MENU_ITEMS.filter((i) => i.isSignature),
      offers: SEED_OFFERS,
      reviews: SEED_REVIEWS,
      gallery: SEED_GALLERY,
    };
  }
}

/**
 * Fetches Menu Categories and Menu Items from Sanity CDN with fallback to seed data.
 */
export async function fetchSanityMenuCatalog(): Promise<{
  categories: CategorySlot[];
  items: MenuItemSlot[];
}> {
  const client = getSanityReadClient();
  if (!client) {
    return { categories: SEED_CATEGORIES, items: SEED_MENU_ITEMS };
  }

  try {
    const [categories, items] = await Promise.all([
      client.fetch<CategorySlot[]>(GROQ_CATEGORIES),
      client.fetch<MenuItemSlot[]>(GROQ_MENU_ITEMS),
    ]);
    return {
      categories: categories?.length ? categories : SEED_CATEGORIES,
      items: items?.length ? items : SEED_MENU_ITEMS,
    };
  } catch {
    return { categories: SEED_CATEGORIES, items: SEED_MENU_ITEMS };
  }
}

/**
 * Fetches Offers and Events from Sanity CDN with fallback to seed data.
 */
export async function fetchSanityOffersAndEvents(): Promise<{
  offers: OfferSlot[];
  events: EventSlot[];
}> {
  const client = getSanityReadClient();
  if (!client) {
    return { offers: SEED_OFFERS, events: SEED_EVENTS };
  }

  try {
    const [offers, events] = await Promise.all([
      client.fetch<OfferSlot[]>(GROQ_OFFERS),
      client.fetch<EventSlot[]>(GROQ_EVENTS),
    ]);
    return {
      offers: offers?.length ? offers : SEED_OFFERS,
      events: events?.length ? events : SEED_EVENTS,
    };
  } catch {
    return { offers: SEED_OFFERS, events: SEED_EVENTS };
  }
}

/**
 * Server-side mutation: writes a newly placed Order into Sanity Studio so staff
 * can manage it in Sanity alongside POS.
 */
export async function syncOrderToSanity(order: OrderRecord): Promise<void> {
  const writeClient = getSanityWriteClient();
  if (!writeClient) return;

  try {
    await writeClient.createOrReplace({
      _id: `order-${order.id}`,
      _type: 'order',
      orderNumber: order.orderNumber,
      idempotencyKey: order.idempotencyKey,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail ?? '',
      orderType: order.orderType,
      addressLine: order.addressLine ?? '',
      pincode: order.pincode ?? '',
      pickupSlot: order.pickupSlot ?? '',
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      grandTotal: order.grandTotal,
      notes: order.notes ?? '',
      items: order.items.map((item, idx) => ({
        _key: `item-${idx}`,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        variantName: item.variantName ?? '',
      })),
      createdAt: order.createdAt,
    });
  } catch {
    // Non-blocking if Sanity write token lacks permissions or network is unreachable
  }
}

/**
 * Server-side mutation: writes a newly booked Table Reservation into Sanity Studio.
 */
export async function syncReservationToSanity(reservation: ReservationRecord): Promise<void> {
  const writeClient = getSanityWriteClient();
  if (!writeClient) return;

  try {
    await writeClient.createOrReplace({
      _id: `reservation-${reservation.id}`,
      _type: 'reservation',
      reservationCode: reservation.reservationCode,
      guestName: reservation.guestName,
      guestPhone: reservation.guestPhone,
      guestEmail: reservation.guestEmail ?? '',
      date: reservation.date,
      timeSlot: reservation.timeSlot,
      partySize: reservation.partySize,
      occasion: reservation.occasion ?? '',
      specialRequests: reservation.specialRequests ?? '',
      status: reservation.status,
      createdAt: reservation.createdAt,
    });
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Server-side mutation: writes a Private Dining / Catering Enquiry into Sanity Studio.
 */
export async function syncCateringEnquiryToSanity(payload: {
  enquiryId: string;
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate: string;
  guestCount: string | number;
  budgetRange?: string;
  notes?: string;
}): Promise<void> {
  const writeClient = getSanityWriteClient();
  if (!writeClient) return;

  try {
    await writeClient.createOrReplace({
      _id: `catering-${payload.enquiryId}`,
      _type: 'cateringEnquiry',
      enquiryId: payload.enquiryId,
      name: payload.name,
      phone: payload.phone,
      email: payload.email ?? '',
      eventType: payload.eventType,
      eventDate: payload.eventDate,
      guestCount: String(payload.guestCount),
      budgetRange: payload.budgetRange ?? '',
      notes: payload.notes ?? '',
      createdAt: new Date().toISOString(),
    });
  } catch {
    // Non-blocking fallback
  }
}

