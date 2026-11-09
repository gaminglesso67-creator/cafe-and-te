import { PrismaClient } from '@prisma/client';
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
} from './seed-data';
import { AdminRole, AdminUserAccount, SEED_ADMIN_USERS } from './auth/rbac';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ============================================================================
// Seeded Runtime Store (Guarantees `npm run dev` works with zero external setup
// while mirroring all Prisma models and recording AuditLog / NotificationLog / POS jobs)
// ============================================================================

export interface OrderRecord {
  id: string;
  orderNumber: string;
  idempotencyKey: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine?: string;
  pincode?: string;
  pickupSlot?: string;
  orderType: 'DELIVERY' | 'PICKUP';
  status:
    | 'placed'
    | 'paid'
    | 'accepted'
    | 'preparing'
    | 'ready'
    | 'out_for_delivery'
    | 'picked_up'
    | 'completed'
    | 'rejected'
    | 'cancelled'
    | 'refunded';
  paymentStatus: 'PENDING' | 'CAPTURED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  grandTotal: number;
  notes?: string;
  rejectionReason?: string;
  posSyncStatus: 'PENDING' | 'SYNCED' | 'FAILED' | 'DEAD_LETTER';
  posAdapterUsed: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    variantName?: string;
  }[];
  createdAt: string;
}

export interface ReservationRecord {
  id: string;
  reservationCode: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  date: string;
  timeSlot: string;
  partySize: number;
  occasion?: string;
  specialRequests?: string;
  staffNotes?: string;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'no_show' | 'completed';
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  actorEmail: string;
  actorRole: AdminRole;
  action: string;
  entityType: string;
  entityId?: string;
  detail: string;
  createdAt: string;
}

export interface PosSyncJobRecord {
  id: string;
  idempotencyKey: string;
  orderId: string;
  adapter: 'manual' | 'api' | 'middleware' | 'bridge';
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'DEAD_LETTER';
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  updatedAt: string;
}

export interface NotificationLogRecord {
  id: string;
  eventKey: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'ADMIN_ALERT';
  recipient: string;
  templateBody: string;
  status: 'SENT' | 'FAILED';
  createdAt: string;
}

interface RuntimeStore {
  orderingEnabled: boolean;
  autoConfirmReservations: boolean;
  activePosAdapter: 'manual' | 'api' | 'middleware' | 'bridge';
  categories: CategorySlot[];
  menuItems: MenuItemSlot[];
  openingHours: OpeningHourSlot[];
  offers: OfferSlot[];
  events: EventSlot[];
  reviews: ReviewSlot[];
  gallery: GalleryItemSlot[];
  users: AdminUserAccount[];
  orders: OrderRecord[];
  reservations: ReservationRecord[];
  auditLogs: AuditLogRecord[];
  posJobs: PosSyncJobRecord[];
  notificationLogs: NotificationLogRecord[];
  processedWebhookKeys: Set<string>;
}

const globalStore = globalThis as unknown as { __saanjhStore?: RuntimeStore };

export function getStore(): RuntimeStore {
  if (!globalStore.__saanjhStore) {
    globalStore.__saanjhStore = {
      orderingEnabled: true,
      autoConfirmReservations: true,
      activePosAdapter: 'manual',
      categories: [...SEED_CATEGORIES],
      menuItems: [...SEED_MENU_ITEMS],
      openingHours: [...SEED_OPENING_HOURS],
      offers: [...SEED_OFFERS],
      events: [...SEED_EVENTS],
      reviews: [...SEED_REVIEWS],
      gallery: [...SEED_GALLERY],
      users: [...SEED_ADMIN_USERS],
      orders: [
        {
          id: 'ORD-1001',
          orderNumber: 'SJ-2026-1001',
          idempotencyKey: 'idem-ord-1001',
          customerName: '{{SAMPLE_CUSTOMER_1_NAME}}',
          customerPhone: '+919000000001',
          customerEmail: 'guest1@saanjh.local',
          addressLine: '{{SAMPLE_DELIVERY_ADDRESS_1}}',
          pincode: '400001',
          orderType: 'DELIVERY',
          status: 'preparing',
          paymentStatus: 'CAPTURED',
          paymentMethod: 'RAZORPAY_UPI',
          subtotal: 960,
          discountAmount: 0,
          taxAmount: 48,
          deliveryFee: 50,
          grandTotal: 1058,
          posSyncStatus: 'SYNCED',
          posAdapterUsed: 'manual',
          items: [
            { name: '{{MENU_ITEM_1_NAME}}', quantity: 1, unitPrice: 420 },
            { name: '{{MENU_ITEM_2_NAME}}', quantity: 1, unitPrice: 540 },
          ],
          createdAt: '2026-11-09T18:30:00+05:30',
        },
        {
          id: 'ORD-1002',
          orderNumber: 'SJ-2026-1002',
          idempotencyKey: 'idem-ord-1002',
          customerName: '{{SAMPLE_CUSTOMER_2_NAME}}',
          customerPhone: '+919000000002',
          orderType: 'PICKUP',
          pickupSlot: '20:30',
          status: 'paid',
          paymentStatus: 'CAPTURED',
          paymentMethod: 'RAZORPAY_CARD',
          subtotal: 620,
          discountAmount: 0,
          taxAmount: 31,
          deliveryFee: 0,
          grandTotal: 651,
          posSyncStatus: 'SYNCED',
          posAdapterUsed: 'manual',
          items: [{ name: '{{MENU_ITEM_4_NAME}}', quantity: 1, unitPrice: 620 }],
          createdAt: '2026-11-09T19:15:00+05:30',
        },
        {
          id: 'ORD-1003',
          orderNumber: 'SJ-2026-1003',
          idempotencyKey: 'idem-ord-1003',
          customerName: '{{SAMPLE_CUSTOMER_3_NAME}}',
          customerPhone: '+919000000003',
          orderType: 'DELIVERY',
          addressLine: '{{SAMPLE_DELIVERY_ADDRESS_3}}',
          pincode: '400001',
          status: 'completed',
          paymentStatus: 'CAPTURED',
          paymentMethod: 'COD',
          subtotal: 480,
          discountAmount: 0,
          taxAmount: 24,
          deliveryFee: 50,
          grandTotal: 554,
          posSyncStatus: 'SYNCED',
          posAdapterUsed: 'manual',
          items: [{ name: '{{MENU_ITEM_3_NAME}}', quantity: 1, unitPrice: 480 }],
          createdAt: '2026-11-08T21:00:00+05:30',
        },
      ],
      reservations: [
        {
          id: 'RES-2001',
          reservationCode: 'BK-2001',
          guestName: '{{RESERVATION_GUEST_1}}',
          guestPhone: '+919000000011',
          guestEmail: 'booking1@saanjh.local',
          date: '2026-11-15',
          timeSlot: '20:00',
          partySize: 4,
          occasion: 'ANNIVERSARY',
          specialRequests: '{{WINDOW_TABLE_REQUEST}}',
          status: 'confirmed',
          createdAt: '2026-11-09T12:00:00+05:30',
        },
        {
          id: 'RES-2002',
          reservationCode: 'BK-2002',
          guestName: '{{RESERVATION_GUEST_2}}',
          guestPhone: '+919000000012',
          date: '2026-11-15',
          timeSlot: '20:30',
          partySize: 6,
          occasion: 'BIRTHDAY',
          status: 'pending',
          createdAt: '2026-11-09T14:20:00+05:30',
        },
      ],
      auditLogs: [
        {
          id: 'aud-1',
          actorEmail: 'owner@saanjh.local',
          actorRole: 'OWNER',
          action: 'POS_ADAPTER_CONFIGURED',
          entityType: 'Setting',
          entityId: 'pos_adapter',
          detail: '{{AUDIT_MANUAL_ADAPTER_ACTIVE}}',
          createdAt: '2026-11-09T10:00:00+05:30',
        },
        {
          id: 'aud-2',
          actorEmail: 'manager@saanjh.local',
          actorRole: 'MANAGER',
          action: 'MENU_PRICE_UPDATED',
          entityType: 'MenuItem',
          entityId: 'item-1',
          detail: '{{AUDIT_ITEM_1_PRICE_SET_420}}',
          createdAt: '2026-11-09T11:30:00+05:30',
        },
      ],
      posJobs: [
        {
          id: 'pos-job-1001',
          idempotencyKey: 'pos-idem-ORD-1001',
          orderId: 'ORD-1001',
          adapter: 'manual',
          status: 'SUCCEEDED',
          attempts: 1,
          maxAttempts: 5,
          updatedAt: '2026-11-09T18:30:05+05:30',
        },
        {
          id: 'pos-job-1002',
          idempotencyKey: 'pos-idem-ORD-1002',
          orderId: 'ORD-1002',
          adapter: 'api',
          status: 'FAILED',
          attempts: 2,
          maxAttempts: 5,
          lastError: '{{POS_API_ENDPOINT_UNREACHABLE_QUEUED_FOR_RETRY}}',
          updatedAt: '2026-11-09T19:16:00+05:30',
        },
      ],
      notificationLogs: [
        {
          id: 'notif-1',
          eventKey: 'ORDER_PAID',
          channel: 'WHATSAPP',
          recipient: '+919000000001',
          templateBody: '{{TEMPLATE_BODY:ORDER_PAID_CONFIRMATION}}',
          status: 'SENT',
          createdAt: '2026-11-09T18:30:02+05:30',
        },
        {
          id: 'notif-2',
          eventKey: 'RESERVATION_CONFIRMED',
          channel: 'SMS',
          recipient: '+919000000011',
          templateBody: '{{TEMPLATE_BODY:RESERVATION_CONFIRMED_MANAGE_LINK}}',
          status: 'SENT',
          createdAt: '2026-11-09T12:00:05+05:30',
        },
      ],
      processedWebhookKeys: new Set<string>(),
    };
  }
  return globalStore.__saanjhStore;
}

export function appendAuditLog(entry: Omit<AuditLogRecord, 'id' | 'createdAt'>) {
  const store = getStore();
  store.auditLogs.unshift({
    ...entry,
    id: `aud-${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
}

