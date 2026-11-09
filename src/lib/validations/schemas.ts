import { z } from 'zod';

/**
 * Shared Client & Server Validation Schemas (PRD 12.4)
 */

export const reservationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '{{INVALID_DATE_FORMAT}}'),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, '{{INVALID_TIME_SLOT}}'),
  partySize: z.coerce.number().int().min(1).max(12),
  name: z.string().trim().min(2, '{{NAME_TOO_SHORT}}').max(100),
  phone: z.string().trim().min(8, '{{INVALID_PHONE}}').max(20),
  email: z.string().trim().email('{{INVALID_EMAIL}}').optional().or(z.literal('')),
  occasion: z.string().optional(),
  specialRequests: z.string().max(500).optional(),
  honeypot: z.string().optional(),
});

export const orderItemInputSchema = z.object({
  lineId: z.string().optional(),
  menuItemId: z.string(),
  name: z.string(),
  unitPrice: z.number().int().nonnegative(),
  quantity: z.number().int().min(1).max(50),
  variantName: z.string().optional(),
  addOnNames: z.array(z.string()).optional(),
  specialInstructions: z.string().max(300).optional(),
  isVeg: z.boolean().optional(),
});

export const createOrderSchema = z.object({
  orderType: z.enum(['DELIVERY', 'PICKUP']),
  customerName: z.string().trim().min(2, '{{NAME_REQUIRED}}').max(100),
  customerPhone: z.string().trim().min(8, '{{PHONE_REQUIRED}}').max(20),
  customerEmail: z.string().trim().email().optional().or(z.literal('')),
  addressLine: z.string().max(300).optional(),
  pincode: z.string().max(12).optional(),
  pickupSlot: z.string().optional(),
  paymentMethod: z.string().default('RAZORPAY_TEST'),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
  idempotencyKey: z.string().optional(),
  honeypot: z.string().optional(),
  items: z.array(orderItemInputSchema).min(1, '{{ORDER_ITEMS_REQUIRED}}'),
});

export const paymentCreateSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(),
  provider: z.enum(['razorpay', 'stripe']).default('razorpay'),
  idempotencyKey: z.string().optional(),
});

export const paymentWebhookSchema = z.object({
  eventId: z.string().min(1),
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  status: z.enum(['captured', 'failed']),
});

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, '{{NAME_REQUIRED}}').max(100),
  phone: z.string().trim().min(8, '{{PHONE_REQUIRED}}').max(20),
  email: z.string().trim().email().optional().or(z.literal('')),
  message: z.string().trim().min(5, '{{MESSAGE_REQUIRED}}').max(1500),
  honeypot: z.string().optional(),
});

export const cateringEnquirySchema = z.object({
  name: z.string().trim().min(2, '{{NAME_REQUIRED}}').max(100),
  phone: z.string().trim().min(8, '{{PHONE_REQUIRED}}').max(20),
  email: z.string().trim().email().optional().or(z.literal('')),
  eventType: z.string().min(2),
  eventDate: z.string().min(4),
  guestCount: z.coerce.number().int().min(5).max(1000).default(25),
  budgetRange: z.string().optional(),
  notes: z.string().max(1500).optional(),
  honeypot: z.string().optional(),
});

