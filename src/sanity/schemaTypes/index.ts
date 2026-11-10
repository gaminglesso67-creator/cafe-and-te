/**
 * Complete Sanity Studio v3 Schema Definitions for Saanjh — Family Resto Bar (Viman Nagar, Pune).
 * Replaces the legacy insecure client-side admin CRUD with Sanity's cloud-authenticated CMS.
 */

export interface SanityFieldDefinition {
  name: string;
  title: string;
  type: string;
  description?: string;
  options?: Record<string, unknown>;
  of?: Array<Record<string, unknown>>;
  to?: Array<{ type: string }>;
  fields?: SanityFieldDefinition[];
  initialValue?: unknown;
  readOnly?: boolean;
}

export interface SanityDocumentSchema {
  name: string;
  title: string;
  type: 'document';
  fields: SanityFieldDefinition[];
}

export const menuCategorySchema: SanityDocumentSchema = {
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  fields: [
    { name: 'id', title: 'Category ID', type: 'string' },
    { name: 'name', title: 'Category Name', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    },
    { name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 1 },
    { name: 'isActive', title: 'Active on Menu', type: 'boolean', initialValue: true },
  ],
};

export const menuItemSchema: SanityDocumentSchema = {
  name: 'menuItem',
  title: 'Menu Dish / Drink',
  type: 'document',
  fields: [
    { name: 'id', title: 'Dish ID', type: 'string' },
    { name: 'name', title: 'Dish Name', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    },
    {
      name: 'categoryId',
      title: 'Category ID',
      type: 'string',
      description: 'Links to menuCategory.id (e.g. cat-starters, cat-mains, cat-breads-rice, cat-bar-desserts)',
    },
    {
      name: 'category',
      title: 'Category Reference',
      type: 'reference',
      to: [{ type: 'menuCategory' }],
    },
    { name: 'description', title: 'Tasting Notes / Description', type: 'text' },
    { name: 'price', title: 'Base Price (INR)', type: 'number' },
    { name: 'isVeg', title: 'Vegetarian', type: 'boolean', initialValue: true },
    {
      name: 'isAvailable',
      title: 'In Stock / Available to Order',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'isSignature',
      title: "Feature in Tonight's Special (Signature Highlight)",
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'image',
      title: 'Dish Photography (Sanity Asset)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'imageSlot',
      title: 'Fallback Local Image Slot Key',
      type: 'string',
    },
    {
      name: 'allergens',
      title: 'Allergens',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'variants',
      title: 'Portion / Preparation Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', title: 'Variant ID', type: 'string' },
            { name: 'name', title: 'Variant Label', type: 'string' },
            { name: 'priceDelta', title: 'Additional Price (INR)', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'addOns',
      title: 'Optional Add-Ons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', title: 'Add-On ID', type: 'string' },
            { name: 'name', title: 'Add-On Label', type: 'string' },
            { name: 'price', title: 'Price (INR)', type: 'number' },
          ],
        },
      ],
    },
  ],
};

export const offerSchema: SanityDocumentSchema = {
  name: 'offer',
  title: 'Dining Offer & Happy Hour',
  type: 'document',
  fields: [
    { name: 'id', title: 'Offer ID', type: 'string' },
    { name: 'title', title: 'Offer Headline', type: 'string' },
    { name: 'description', title: 'Terms & Description', type: 'text' },
    { name: 'badgeText', title: 'Badge Label (e.g. FLAT 10% OFF)', type: 'string' },
    { name: 'code', title: 'Promo Code (e.g. LUNCH10)', type: 'string' },
    { name: 'validFrom', title: 'Valid From', type: 'string' },
    { name: 'validUntil', title: 'Valid Until', type: 'string' },
    { name: 'isHappyHour', title: 'Happy Hour / Walk-In Deal', type: 'boolean', initialValue: false },
    { name: 'isActive', title: 'Active', type: 'boolean', initialValue: true },
  ],
};

export const eventSchema: SanityDocumentSchema = {
  name: 'event',
  title: 'Evening Event & Gathering',
  type: 'document',
  fields: [
    { name: 'id', title: 'Event ID', type: 'string' },
    { name: 'title', title: 'Event Title', type: 'string' },
    { name: 'dateLabel', title: 'Schedule / Date Label', type: 'string' },
    { name: 'timeLabel', title: 'Time Window', type: 'string' },
    { name: 'description', title: 'Event Description', type: 'text' },
    { name: 'isUpcoming', title: 'Upcoming / Active', type: 'boolean', initialValue: true },
    { name: 'image', title: 'Event Poster / Photo', type: 'image', options: { hotspot: true } },
    { name: 'imageSlot', title: 'Fallback Image Slot Key', type: 'string' },
  ],
};

export const reviewSchema: SanityDocumentSchema = {
  name: 'review',
  title: 'Guest Review & Testimonial',
  type: 'document',
  fields: [
    { name: 'id', title: 'Review ID', type: 'string' },
    { name: 'reviewerName', title: 'Guest Name', type: 'string' },
    { name: 'rating', title: 'Star Rating (1–5)', type: 'number', initialValue: 5 },
    { name: 'comment', title: 'Review Quote', type: 'text' },
    {
      name: 'source',
      title: 'Review Source',
      type: 'string',
      options: { list: ['GOOGLE', 'MANUAL'] },
      initialValue: 'GOOGLE',
    },
    { name: 'dateLabel', title: 'Display Subtitle / Date', type: 'string' },
    { name: 'isApproved', title: 'Approved for Public Display', type: 'boolean', initialValue: true },
  ],
};

export const galleryItemSchema: SanityDocumentSchema = {
  name: 'galleryItem',
  title: 'Gallery Photograph',
  type: 'document',
  fields: [
    { name: 'id', title: 'Gallery Item ID', type: 'string' },
    { name: 'title', title: 'Caption / Title', type: 'string' },
    {
      name: 'category',
      title: 'Gallery Filter Category',
      type: 'string',
      options: { list: ['FOOD', 'AMBIENCE', 'DRINKS', 'EVENTS'] },
    },
    { name: 'image', title: 'Photograph (Sanity Asset)', type: 'image', options: { hotspot: true } },
    { name: 'imageSlot', title: 'Fallback Local Image Slot Key', type: 'string' },
  ],
};

export const openingHoursSchema: SanityDocumentSchema = {
  name: 'openingHours',
  title: 'Opening Hours',
  type: 'document',
  fields: [
    { name: 'dayIndex', title: 'Day Index (0=Mon .. 6=Sun)', type: 'number' },
    { name: 'dayLabel', title: 'Day Name', type: 'string' },
    { name: 'openTime', title: 'Opening Time', type: 'string', initialValue: '12:00 PM' },
    { name: 'closeTime', title: 'Closing Time', type: 'string', initialValue: '12:00 Midnight' },
    { name: 'isClosed', title: 'Closed on this Day', type: 'boolean', initialValue: false },
  ],
};

export const reservationSchemaDoc: SanityDocumentSchema = {
  name: 'reservation',
  title: 'Table Reservation',
  type: 'document',
  fields: [
    { name: 'reservationCode', title: 'Booking Reference Code', type: 'string', readOnly: true },
    { name: 'guestName', title: 'Guest Name', type: 'string' },
    { name: 'guestPhone', title: 'Guest Phone', type: 'string' },
    { name: 'guestEmail', title: 'Guest Email', type: 'string' },
    { name: 'date', title: 'Reservation Date (YYYY-MM-DD)', type: 'string' },
    { name: 'timeSlot', title: 'Time Slot', type: 'string' },
    { name: 'partySize', title: 'Party Size (Guests)', type: 'number' },
    { name: 'occasion', title: 'Special Occasion', type: 'string' },
    { name: 'specialRequests', title: 'Seating / Dietary Notes', type: 'text' },
    {
      name: 'status',
      title: 'Booking Status',
      type: 'string',
      options: { list: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'] },
      initialValue: 'confirmed',
    },
    { name: 'createdAt', title: 'Created Timestamp', type: 'datetime', readOnly: true },
  ],
};

export const orderSchemaDoc: SanityDocumentSchema = {
  name: 'order',
  title: 'Online Order',
  type: 'document',
  fields: [
    { name: 'orderNumber', title: 'Order Number', type: 'string', readOnly: true },
    { name: 'idempotencyKey', title: 'Idempotency Key', type: 'string', readOnly: true },
    { name: 'customerName', title: 'Customer Name', type: 'string' },
    { name: 'customerPhone', title: 'Customer Phone', type: 'string' },
    { name: 'customerEmail', title: 'Customer Email', type: 'string' },
    {
      name: 'orderType',
      title: 'Fulfilment Type',
      type: 'string',
      options: { list: ['DELIVERY', 'PICKUP'] },
    },
    { name: 'addressLine', title: 'Delivery Address', type: 'text' },
    { name: 'pincode', title: 'Pincode', type: 'string' },
    { name: 'pickupSlot', title: 'Pickup Time Slot', type: 'string' },
    {
      name: 'status',
      title: 'Kitchen Status',
      type: 'string',
      options: {
        list: ['placed', 'paid', 'accepted', 'preparing', 'ready', 'dispatched', 'completed', 'cancelled', 'refunded'],
      },
    },
    {
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: { list: ['PENDING', 'CAPTURED', 'FAILED', 'REFUNDED'] },
    },
    { name: 'paymentMethod', title: 'Payment Method', type: 'string' },
    { name: 'grandTotal', title: 'Grand Total (INR)', type: 'number' },
    { name: 'notes', title: 'Kitchen / Delivery Notes', type: 'text' },
    {
      name: 'items',
      title: 'Ordered Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Dish Name', type: 'string' },
            { name: 'quantity', title: 'Qty', type: 'number' },
            { name: 'unitPrice', title: 'Unit Price (INR)', type: 'number' },
            { name: 'variantName', title: 'Variant', type: 'string' },
          ],
        },
      ],
    },
    { name: 'createdAt', title: 'Placed At', type: 'datetime', readOnly: true },
  ],
};

export const cateringEnquirySchemaDoc: SanityDocumentSchema = {
  name: 'cateringEnquiry',
  title: 'Private Dining & Catering Enquiry',
  type: 'document',
  fields: [
    { name: 'enquiryId', title: 'Enquiry Reference', type: 'string', readOnly: true },
    { name: 'name', title: 'Contact Name', type: 'string' },
    { name: 'phone', title: 'Phone Number', type: 'string' },
    { name: 'email', title: 'Email Address', type: 'string' },
    { name: 'eventType', title: 'Event Type', type: 'string' },
    { name: 'eventDate', title: 'Requested Date', type: 'string' },
    { name: 'guestCount', title: 'Estimated Guests', type: 'string' },
    { name: 'budgetRange', title: 'Package Tier', type: 'string' },
    { name: 'notes', title: 'Event Requirements', type: 'text' },
    { name: 'createdAt', title: 'Submitted At', type: 'datetime', readOnly: true },
  ],
};

export const siteSettingsSchemaDoc: SanityDocumentSchema = {
  name: 'siteSettings',
  title: 'Restaurant Site Settings',
  type: 'document',
  fields: [
    { name: 'restaurantName', title: 'Restaurant Name', type: 'string' },
    { name: 'tagline', title: 'Tagline', type: 'string' },
    { name: 'phoneDisplay', title: 'Reservation Desk Phone', type: 'string' },
    { name: 'whatsappNumber', title: 'WhatsApp Concierge Number', type: 'string' },
    { name: 'address', title: 'Physical Address', type: 'text' },
    { name: 'announcementBarText', title: 'Top Announcement Bar Text', type: 'string' },
    { name: 'orderingEnabled', title: 'Accept Online Orders', type: 'boolean', initialValue: true },
    {
      name: 'autoConfirmReservations',
      title: 'Auto-Confirm Table Reservations',
      type: 'boolean',
      initialValue: true,
    },
  ],
};

export const schemaTypes: SanityDocumentSchema[] = [
  siteSettingsSchemaDoc,
  menuCategorySchema,
  menuItemSchema,
  offerSchema,
  eventSchema,
  reviewSchema,
  galleryItemSchema,
  openingHoursSchema,
  reservationSchemaDoc,
  orderSchemaDoc,
  cateringEnquirySchemaDoc,
];

