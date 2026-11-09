# Product Requirements Document (PRD)
## Saanjh, Family Resto Bar: Restaurant Website, Ordering and Admin Platform

| Field | Value |
|---|---|
| Document version | 1.0 |
| Status | Draft for build (skeleton phase) |
| Brand | Saanjh (wordmark), tagline lockup: "Family Resto Bar" |
| Deliverable of this phase | **Content-free skeleton**: full structure, routing, components, data model, theming, integrations stubbed. All copy, images and menu data are added later. |

---

## 1. Purpose and Vision

Build a full-spec website for the restaurant that works as three things at once:

1. A **public brand site** that looks like the glowing gold signboard and makes people want to visit.
2. A **transactional platform**: table reservations, online ordering, online payments, notifications.
3. An **operations tool**: an admin panel for the owner, manager and staff, connected to the kitchen billing system (POS) the restaurant already owns.

The aim is a real-world product, not a template. Structure comes first; content is dropped in afterwards without touching code structure.

## 2. Goals and Non-Goals

### 2.1 Goals
- G1. Premium dark, gold-glow visual identity faithful to the signboard.
- G2. Every public page and every functional feature listed in this document exists as a working skeleton.
- G3. Orders and reservations flow from the website to the kitchen and billing with no double entry.
- G4. Restaurant staff can change menu, prices, availability, banners, offers and opening hours without a developer.
- G5. Mobile-first, fast, SEO-ready, secure.
- G6. Skeleton is fully content-agnostic: zero hard-coded copy, prices or images.

### 2.2 Non-Goals (this phase)
- Final copywriting, photography, real menu data, real reviews (added later).
- Native mobile apps.
- Replacing the restaurant's existing POS.
- Loyalty or points program, multi-branch support (noted as future, see section 18).

## 3. Users and Roles

| Role | Description | Key abilities |
|---|---|---|
| Guest / Customer | Visitor, optionally registered | Browse, order, reserve, pay, track order, contact |
| Staff | Floor / kitchen team | View and update orders and reservations, mark items out of stock |
| Manager | Runs day-to-day | Everything Staff can do plus menu editing, offers, content, hours, reports |
| Owner | Business owner | Everything plus user and role management, payments settings, POS integration settings, full analytics |

Role-based access control (RBAC) is enforced on both UI and API.

## 4. Scope of the Skeleton

### 4.1 Skeleton rules (important)
- No real content. Use clearly marked placeholders, e.g. `{{HERO_TAGLINE}}`, `{{MENU_ITEM_NAME}}`, grey image blocks with aspect-ratio boxes.
- All text lives in a **content layer** (CMS tables or `content/*.json`), never hard-coded in components.
- All images are referenced by slot name (`hero_image`, `gallery_1` ...) and resolve to placeholder images until replaced.
- Every section is a reusable component that accepts data props.
- Empty states, loading states and error states exist for every data-driven section.
- Brand tokens, typography, spacing and glow effects are fully implemented now, since they are not content.

### 4.2 Placeholder convention
- Text: `{{SECTION_FIELD}}` (uppercase, snake_case).
- Images: `/placeholders/{aspect}.svg` (16x9, 4x3, 1x1, 3x4) in charcoal-surface colour with a faint gold outline.
- Prices: `₹{{PRICE}}`.
- Dates/times: generated sample values only in dev seed data, never in production.

## 5. Brand and Design System

### 5.1 Colour proportions (60-30-10)
| Share | Colour | Hex | Usage |
|---|---|---|---|
| 60% | Charcoal Black | `#0F0F10` | Page backgrounds, hero, footer |
| 60% (depth) | Lighter Charcoal | `#1A1815` | Cards, alternating sections |
| 30% | Warm White / Cream | `#FFF4E0` | Body text, headings, occasional cream sections for menu or story |
| 30% | Muted Cream | `#D9C7A8` | Secondary text, captions, borders |
| 10% | Gold | `#E8B547` | The only "loud" colour; points where the eye should land |
| 10% | Deep Gold | `#C98A2B` | Gradient end-stop, pressed/hover depth |
| Accent | Crimson | `#B3202A` | Seasonal and highlight only |

### 5.2 Where gold goes
- Allowed: logo/wordmark, main CTA buttons ("Reserve a Table", "View Menu"), dividers, icons, hover states.
- Not allowed: body paragraphs, large background areas.
- Gradient `#E8B547` to `#C98A2B` on buttons and headings for a brass or backlit look rather than flat yellow.

### 5.3 Glow system
- Logo and hero heading: `text-shadow: 0 0 24px rgba(232,181,71,0.45)`.
- Hero background: `radial-gradient(circle at 50% 0%, rgba(232,181,71,0.18), transparent 60%)`.
- CTA hover: brighten the glow (increase shadow intensity and spread), **do not change the colour**.
- Glow must respect `prefers-reduced-motion` (no animated pulsing for those users).

### 5.4 Typography
- Headings: elegant high-contrast serif (Playfair Display, Cormorant or Fraunces; pick one and lock it), in gold or warm white. Matches the calligraphic "Saanjh" wordmark.
- Body and UI: clean sans-serif (Inter or DM Sans) in warm white, mirroring the modern "Family Resto Bar" lettering.
- Body text minimum 16px.
- Generous spacing, fewer words per section; the layout should feel spacious.

### 5.5 Crimson (red lantern) accent rules
- Use for: small tags ("Chef's Special", "New", festival offers), festive banners (Diwali and other occasions).
- Never for primary buttons.

### 5.6 Imagery rules
- Warm, low-light food photography with dark backgrounds and golden highlights.
- Avoid bright, flat, white-background shots.
- Overlay `rgba(15,15,16,0.6)` dark gradient on photos so text stays readable.
- Thin gold line or ornamental divider between sections.

### 5.7 Accessibility rules tied to colour
- Gold on charcoal and warm white on charcoal pass contrast.
- **Never gold text on cream.** Cream sections use charcoal text.
- Body text at least 16px.
- Visible focus rings (gold outline) on every interactive element.

### 5.8 Design tokens (starter)
```css
:root {
  --bg: #0F0F10;
  --surface: #1A1815;
  --text: #FFF4E0;
  --muted: #D9C7A8;
  --gold: #E8B547;
  --gold-deep: #C98A2B;
  --accent-red: #B3202A;

  /* additions for the skeleton */
  --gold-gradient: linear-gradient(135deg, #E8B547, #C98A2B);
  --glow-text: 0 0 24px rgba(232,181,71,0.45);
  --glow-hero: radial-gradient(circle at 50% 0%, rgba(232,181,71,0.18), transparent 60%);
  --photo-overlay: rgba(15,15,16,0.6);
}
```
Tailwind theme must mirror these tokens. Spacing scale, radii, shadows and breakpoints are defined once in the theme config.

### 5.9 Core UI components (skeleton)
Button (primary gold gradient, secondary outline, ghost), Tag/Badge (Chef's Special, New, Offer, Veg, Non-Veg, allergen), Card, Section wrapper (dark, surface, cream variants), Gold divider/ornament, Modal/Drawer, Form inputs (text, phone, email, date, time, select, textarea, stepper), Toast, Skeleton loader, Empty state, Table, Tabs, Nav bar, Footer, Image with overlay, Rating stars, Map embed, Cart drawer.

## 6. Information Architecture and Sitemap

### 6.1 Public routes
| Route | Page |
|---|---|
| `/` | Home |
| `/menu` | Menu |
| `/about` | About / Story |
| `/gallery` | Gallery |
| `/reviews` | Reviews / Testimonials (also a section on Home) |
| `/offers` | Offers and Events |
| `/contact` | Contact |
| `/reserve` | Table reservation |
| `/order` | Online ordering (menu to cart) |
| `/cart` | Cart |
| `/checkout` | Checkout and payment |
| `/order/[id]` | Order tracking |
| `/reservation/[id]` | Reservation confirmation / manage |
| `/account` | Customer account (orders, reservations), optional login |
| `/privacy` | Privacy policy |
| `/terms` | Terms and conditions |
| `/404`, `/500` | Error pages |

### 6.2 Admin routes (`/admin/*`, authenticated)
| Route | Screen |
|---|---|
| `/admin/login` | Login |
| `/admin` | Overview dashboard |
| `/admin/orders` | Order dashboard (live board and history) |
| `/admin/reservations` | Reservation dashboard (calendar and list) |
| `/admin/menu` | Menu management |
| `/admin/inventory` | Availability / out-of-stock quick toggles |
| `/admin/offers` | Offers and events management |
| `/admin/content` | Banners, hours, site content editing |
| `/admin/reviews` | Review moderation / manual add |
| `/admin/gallery` | Gallery management |
| `/admin/analytics` | Best sellers, peak hours, revenue |
| `/admin/customers` | Customer list (optional) |
| `/admin/users` | Staff accounts and roles (Owner only) |
| `/admin/settings` | Payments, POS integration, notifications, delivery zones, taxes |
| `/admin/integrations/pos` | POS connection status, logs, retry queue |

## 7. Functional Requirements: Public Pages

Each page below lists its **sections (skeleton blocks)**. All content is placeholder at this phase.

### 7.1 Home
- Header/nav with logo, links, cart icon, primary CTA.
- **Hero**: image or video slot, heading with gold glow, tagline, two CTAs (Order, Reserve), radial gold wash.
- **Opening hours** block (data-driven, shows open/closed state live).
- **Location** block (address, mini-map, directions link).
- Highlights strip (signature dishes, 3-4 card slots).
- Short About teaser with link.
- Offers teaser.
- Reviews carousel teaser.
- Gallery teaser.
- Reservation and order CTA band.
- Footer.

### 7.2 Menu
- Category tabs / sticky category nav.
- Item cards: image slot, name, description, price, veg/non-veg marker, allergen tags, badges (Chef's Special, New), out-of-stock state, add-to-cart (when ordering enabled).
- **Search** and **filters** (veg/non-veg, allergens, category, price range, availability).
- Item detail modal (variants, add-ons, quantity, special instructions).
- Print-friendly / downloadable menu option (optional).
- Cream section variant available for menu content (charcoal text on cream).

### 7.3 About / Story
- Restaurant background section.
- Chef profile section.
- Values section.
- Timeline or milestones block (optional slot).
- Image-and-text alternating blocks.
- CTA band.

### 7.4 Gallery
- Filter tabs: Food, Interiors, Events.
- Masonry/grid layout with lightbox (keyboard accessible).
- Lazy-loaded optimised images.

### 7.5 Reviews / Testimonials
- Source 1: **pulled from Google** (Google Places API or approved embed; cached server-side).
- Source 2: **added manually** via admin.
- Review card: name, rating, text, date, source badge.
- Aggregate rating display.
- Link to leave a Google review.

### 7.6 Contact
- Address, **embedded map**, phone (tap to call), **WhatsApp** (click-to-chat), email.
- **Contact form** (name, email, phone, message) with validation, spam protection, success and error states.
- Opening hours and social links.

### 7.7 Offers / Events
- **Specials** list (cards with validity dates).
- **Happy hours** block (time-based, data-driven).
- **Catering and party bookings**: enquiry form (event type, date, guests, budget, notes).
- Events listing (upcoming and past).
- Festive banner slot (crimson accent, e.g. Diwali).

### 7.8 Legal pages
- Privacy policy and Terms and conditions (placeholder text, editable).
- Cookie/consent banner (if analytics or marketing cookies are used).

### 7.9 Global elements
- Sticky header, mobile bottom action bar (Order / Reserve / Call).
- Announcement bar (festive/offers, admin-controlled).
- Floating WhatsApp button.
- Footer: links, hours, address, social, legal links, newsletter signup (optional).
- 404 and error pages in brand style.

## 8. Functional Requirements: Core Features

### 8.1 Table Reservations
- Inputs: date, time slot, party size, name, phone, email, special requests/occasion.
- Availability logic: configurable capacity per slot, slot length, lead time, max party size, blackout dates.
- States: `pending` → `confirmed` | `declined` | `cancelled` | `no_show` | `completed`.
- Confirmation by **email and/or SMS** (and optionally WhatsApp), with a manage link (modify/cancel).
- Reminder notification before the booking (configurable, e.g. 2 hours prior).
- Auto-confirm vs manual-approve toggle in settings.
- Admin: calendar and list views, status changes, notes, manual booking creation.
- Spam and abuse protection (CAPTCHA, rate limit).

### 8.2 Online Ordering
- Cart: add/remove/update, variants, add-ons, special instructions, persisted across sessions.
- Order type: **delivery** or **pickup** (dine-in QR ordering as future option).
- Delivery: address entry, zone check, delivery fee, minimum order value, estimated time.
- Pickup: slot or ASAP time selection.
- Scheduling: order now or later (optional).
- Coupons/offers application.
- Taxes (GST) and fee breakdown shown before payment.
- Guest checkout and logged-in checkout.
- **Order tracking** page: statuses `placed` → `paid` → `accepted` → `preparing` → `ready` → `out_for_delivery` / `picked_up` → `completed` (plus `rejected`, `cancelled`, `refunded`).
- Real-time status updates (websocket/SSE or polling fallback).
- Ordering can be switched on/off and paused by admin (e.g. kitchen too busy, restaurant closed).

### 8.3 Payments
- Provider: **Razorpay** (primary for India) or **Stripe**; implemented behind a payment-provider interface so either can be used.
- Methods: UPI, cards, netbanking, wallets; Cash on Delivery/Pay at counter toggle.
- Server-created payment order; client completes payment; **webhook confirms** the payment (source of truth, never the client redirect).
- Webhook signature verification, idempotent handling, replay protection.
- Failed/abandoned payment handling and retry.
- Refunds (full/partial) from admin.
- Payment records stored with provider IDs for reconciliation.
- Test mode and live mode keys managed through environment config.

### 8.4 Notifications
- Channels: email, SMS, WhatsApp (via provider such as Twilio, MSG91 or WhatsApp Business API), in-app/admin sound and push alerts.
- **Customer**: order placed, payment received, order accepted, ready/out for delivery, completed, reservation received/confirmed/reminder/cancelled.
- **Restaurant**: new order (sound plus visual alert on admin dashboard), new reservation, payment failure, low stock, contact/catering enquiry.
- Templates are editable and content-free in the skeleton (`{{TEMPLATE_BODY}}`).
- Notification log with delivery status and retry.

## 9. Functional Requirements: Admin Panel

### 9.1 Authentication and Roles
- Login with email and password (optionally OTP/2FA for Owner and Manager).
- Roles: **Owner, Manager, Staff** with permission matrix (section 9.9).
- Session management, logout, forgot/reset password, account lockout on repeated failures.
- Audit log of sensitive actions (price changes, refunds, role changes).

### 9.2 Menu Management
- CRUD for categories and items.
- Fields: name, description, price, images, veg/non-veg, allergens, tags/badges, variants/sizes, add-ons, tax class, prep time, sort order, visibility.
- **Add, edit, hide** items; **change prices**; **mark out of stock** (quick toggle, optionally auto-reset next day).
- Bulk actions and CSV import/export.
- Scheduling availability (e.g. breakfast-only items).
- POS sync status per item (see section 10).

### 9.3 Order and Reservation Dashboard
- Live order board (kanban by status) with sound alert on new orders.
- Order detail: items, customer, payment status, notes, timeline, POS push status.
- Actions: accept, reject (with reason), mark preparing/ready/dispatched/completed, refund, reprint kitchen ticket, resend to POS.
- Reservation calendar and list, with status actions and notes.
- Filters by date, status, type, channel; search by name, phone, order number.

### 9.4 Analytics
- **Best sellers** (by quantity and revenue).
- **Peak hours** (orders and reservations by hour/day heatmap).
- **Revenue** (daily/weekly/monthly, by order type, by payment method, tax summary).
- Average order value, repeat customer rate, cancellation rate, reservation no-show rate.
- Date range filters, CSV export.
- Built from real database queries, with charts.

### 9.5 Content Editing
- **Banners** (home hero, announcement bar, festive banner) with schedule start/end.
- **Offers** and events management.
- **Opening hours** (regular, holiday overrides, special closures); drives open/closed indicator and schema markup.
- Edit about/story text, contact details, social links, legal pages, SEO meta per page.
- Media library with upload, crop, alt text.
- Review moderation and manual review add.
- Gallery management.

### 9.6 Settings
- Business profile, tax (GST number, rates), invoice settings.
- Payment provider keys and methods.
- Delivery zones, fees, minimum order, pickup settings, prep time buffers.
- Reservation rules (capacity, slots, lead time).
- Notification channels and templates.
- POS integration configuration.
- Ordering on/off switch.

### 9.7 Users
- Create/invite staff, assign roles, deactivate (Owner only).

### 9.8 Customers (optional in v1)
- List with order history, contact info, notes, consent status.

### 9.9 Permission matrix
| Capability | Staff | Manager | Owner |
|---|:-:|:-:|:-:|
| View/update orders and reservations | ✔ | ✔ | ✔ |
| Mark items out of stock | ✔ | ✔ | ✔ |
| Edit menu, prices | ✖ | ✔ | ✔ |
| Edit offers, banners, hours, content | ✖ | ✔ | ✔ |
| Moderate reviews | ✖ | ✔ | ✔ |
| Refunds | ✖ | ✔ (limit configurable) | ✔ |
| View analytics | limited | ✔ | ✔ full |
| Manage users and roles | ✖ | ✖ | ✔ |
| Payment and POS settings | ✖ | ✖ | ✔ |

## 10. Kitchen Billing System (POS) Integration

The restaurant **already owns** a kitchen billing system. The website must connect to it so orders reach the kitchen and billing without manual re-entry. The exact POS product is **TBD** (see open questions); the architecture is built with an adapter layer so the integration method can be chosen once the POS is identified.

### 10.1 Integration approaches (in order of preference)
1. **Official API or partner integration** (e.g. Petpooja, Posist, UrbanPiper, Toast, Square, if applicable).
   - Website sends each paid order to the POS via API (JSON over HTTPS).
   - Order appears on kitchen screen/printer and in bill records automatically.
   - Menu, prices and stock sync back so the website never shows unavailable items.
2. **Aggregator / middleware layer** (e.g. UrbanPiper or the POS vendor's online-order module) when the POS has no public API. Paid, but saves build effort.
3. **Database or file-level bridge** for older local systems: a small bridge service on the POS machine that polls the website backend (or receives webhook/websocket pushes) and writes to the POS (DB insert, import file, or virtual printer). More fragile; needs careful testing.
4. **Manual fallback**: orders print on a separate kitchen printer or tablet from the admin panel; billing entered by hand. Legitimate starting point.

### 10.2 Adapter architecture
- Define a `PosAdapter` interface: `pushOrder(order)`, `cancelOrder(orderId)`, `fetchMenu()`, `fetchStock()`, `updateStock(item)`, `getOrderStatus(id)`, `healthCheck()`.
- Ship with: `ManualAdapter` (kitchen printer/tablet view; default), `ApiAdapter` (stub), `MiddlewareAdapter` (stub), `BridgeAdapter` (stub).
- Active adapter chosen via admin settings/env.

### 10.3 Order flow (end to end)
1. Customer places order on the website.
2. Payment is confirmed **via the payment webhook**.
3. Order is placed on a **queue** and **pushed to the POS**.
4. Kitchen ticket prints / appears on the kitchen display.
5. Status updates flow back (accepted, preparing, ready) and the customer's tracking page updates.
6. Customer and restaurant notifications are sent at each milestone.

### 10.4 Real-world requirements the integration must handle
| Requirement | Detail |
|---|---|
| Order flow | website order → payment confirmed (webhook) → push to POS → kitchen ticket printed → status updated back to customer |
| Menu sync | One source of truth, ideally the POS, so prices and availability match |
| Failure handling | Persistent queue with retries and exponential backoff, so an order is not lost if the POS or internet is briefly down; dead-letter list with alert |
| Duplicate prevention | Unique order IDs (idempotency keys) so the same order is never billed twice |
| Tax and invoice consistency | GST and invoice numbering come from the POS so the restaurant's accounts stay clean |
| Staff alerts | Sound or notification when a new web order arrives |

### 10.5 Integration admin screen
- Connection status, last sync time, queue depth, failed pushes with one-click retry, sync logs, manual "push again" per order, menu sync trigger.

## 11. Technical Requirements

### 11.1 Recommended stack
- **Frontend and server**: Next.js (App Router) with TypeScript, Tailwind CSS.
- **Database**: PostgreSQL with Prisma ORM (migrations, indexes, relations).
- **Auth**: Auth.js (NextAuth) or Lucia with RBAC.
- **Queue and background jobs**: BullMQ with Redis, or a managed job runner (for POS push retries, notifications, reminders, scheduled tasks).
- **Real-time**: Server-Sent Events or WebSocket (order board and tracking).
- **Storage**: S3-compatible bucket or Cloudinary for images, with optimisation.
- **Payments**: Razorpay or Stripe SDK behind an interface.
- **Messaging**: Email (Resend/SES), SMS/WhatsApp (MSG91/Twilio).
- **Hosting**: Vercel (app) plus managed Postgres (Neon or Supabase); Redis from Upstash or similar.
- **Monitoring**: Sentry for errors, uptime monitor, structured logs.
- **Testing and CI**: Vitest/Jest, Playwright for key flows, GitHub Actions pipeline.

### 11.2 Architecture overview
Browser → Next.js (pages and API routes) → PostgreSQL; Next.js → job queue → workers (POS adapter, notifications, reminders); Payment provider → webhook endpoint → order service; Admin panel → same API with RBAC; Optional bridge service on restaurant PC ↔ website API.

### 11.3 Data model (core entities)
`User`, `Role`, `Session`, `Customer`, `Address`, `Category`, `MenuItem`, `ItemVariant`, `AddOn`, `AllergenTag`, `Order`, `OrderItem`, `OrderStatusEvent`, `Payment`, `Refund`, `Coupon`, `Offer`, `Event`, `Reservation`, `ReservationSlotRule`, `BlackoutDate`, `Review`, `GalleryItem`, `Banner`, `OpeningHours`, `HolidayOverride`, `ContentBlock` (key/value content layer), `MediaAsset`, `Enquiry` (contact and catering), `NotificationTemplate`, `NotificationLog`, `PosSyncJob`, `PosSyncLog`, `Setting`, `AuditLog`, `DeliveryZone`.
Required: unique order numbers, idempotency keys on orders/payments/POS pushes, soft-delete for menu items, timestamps on everything, indexes on status, date and foreign keys.

### 11.4 API surface (indicative)
- Public: `GET /api/menu`, `GET /api/hours`, `GET /api/offers`, `GET /api/reviews`, `POST /api/reservations`, `GET /api/reservations/availability`, `POST /api/orders`, `GET /api/orders/:id`, `POST /api/payments/create`, `POST /api/webhooks/payment`, `POST /api/contact`, `POST /api/enquiry/catering`.
- Admin (authenticated, RBAC): CRUD for menu, offers, banners, hours, content, reviews, gallery, users; order and reservation actions; analytics endpoints; settings; POS sync endpoints.
- Bridge: authenticated endpoints for pull/ack of new orders (token-based).

### 11.5 Content layer
- Single content service reading from DB (`ContentBlock`) with JSON seed files for defaults.
- Keys namespaced by page and section (`home.hero.title`).
- Admin edits write to DB; public pages read with caching and on-demand revalidation.

## 12. Non-Functional Requirements

### 12.1 Responsive and mobile-first
- Designed from 360px upward; breakpoints at 640 / 768 / 1024 / 1280.
- Touch targets at least 44px; mobile sticky action bar.

### 12.2 Performance
- Fast loading with optimised images (modern formats, responsive sizes, lazy loading, blur placeholders).
- Targets: LCP under 2.5s, CLS under 0.1, INP under 200ms on mid-range mobile; Lighthouse performance 90+.
- Font subsetting and `font-display: swap`; code splitting; caching and CDN.

### 12.3 SEO
- **Local SEO**: NAP consistency, city/area keywords, location content slots.
- **Schema markup**: `Restaurant`, `LocalBusiness`, `Menu`, `OpeningHoursSpecification`, `AggregateRating`, `Event`, `Offer`, `BreadcrumbList`.
- **Google Business Profile linking**: GBP link, review link, map link; consistent details.
- Per-page meta title/description, Open Graph and Twitter cards, canonical URLs, `sitemap.xml`, `robots.txt`, clean URLs, alt text on all images.

### 12.4 Security
- **HTTPS** everywhere with HSTS.
- **Form validation** on client and server (schema validation, e.g. Zod); sanitised inputs.
- **Spam protection**: CAPTCHA (Turnstile/reCAPTCHA), honeypot fields, rate limiting.
- CSRF protection, secure cookies, password hashing (Argon2/bcrypt), RBAC checks server-side, secrets in environment variables only.
- Payment webhook signature verification; PCI scope minimised by using hosted payment fields.
- Audit logging, dependency scanning, backups with tested restore.

### 12.5 Legal and privacy
- **Privacy policy** and **Terms** pages.
- Consent banner, data retention rules, customer data export/deletion on request (DPDP Act awareness).
- Refund and cancellation policy page (optional), allergen disclaimer.

### 12.6 Analytics and tracking
- **Google Analytics** (GA4) or similar privacy-friendly alternative, consent-aware.
- Event tracking: CTA clicks, add to cart, checkout started, order completed, reservation submitted, contact submitted.

### 12.7 Accessibility
- WCAG 2.1 AA target; semantic HTML, keyboard navigation, focus states, ARIA where needed, alt text, reduced-motion support, contrast rules from section 5.7, minimum 16px body.

### 12.8 Reliability and operations
- Error handling with friendly messages; loading, empty and error states everywhere.
- Retry queues, idempotency, graceful degradation when POS or payment provider is down (ordering can auto-pause with notice).
- Logging, monitoring, uptime alerts, daily database backups.
- Environments: local, staging, production, with separate keys.

### 12.9 Internationalisation
- English at launch with currency ₹ (INR) and IST time zone; structure ready for extra languages (e.g. Hindi, Marathi) via content layer.

## 13. Skeleton Deliverables Checklist (this phase)

- [ ] Repository, TypeScript, lint/format, env template, CI pipeline.
- [ ] Tailwind theme and CSS tokens from section 5.8; fonts loaded.
- [ ] Core UI component library (section 5.9) with dark, surface and cream section variants.
- [ ] Layout: header, footer, announcement bar, mobile action bar, floating WhatsApp.
- [ ] All public routes (section 6.1) with placeholder sections.
- [ ] All admin routes (section 6.2) with route guards and RBAC shells.
- [ ] Database schema, migrations and seed script with dummy data (dev only).
- [ ] Content layer with namespaced keys and placeholder defaults.
- [ ] Reservation flow end to end with placeholder rules.
- [ ] Cart, checkout and order tracking flow with payment in test mode and webhook handler.
- [ ] Notification service with template stubs and logs.
- [ ] POS adapter interface, Manual adapter working, other adapters stubbed, retry queue.
- [ ] Admin: menu CRUD, order board, reservations, content editing, analytics pages with real queries on seed data.
- [ ] SEO scaffolding: meta, schema components, sitemap, robots.
- [ ] Spam protection and validation on all forms.
- [ ] Privacy and Terms pages (placeholder), consent banner.
- [ ] Analytics integration (consent-aware).
- [ ] Basic automated tests (API, webhook, key flows) and README with architecture diagram and trade-offs.
- [ ] Staging deployment on HTTPS.

## 14. Phased Delivery

| Phase | Scope |
|---|---|
| 0. Setup | Repo, tooling, design tokens, component library |
| 1. Public skeleton | All public pages and layout with placeholders |
| 2. Data and admin core | Schema, auth, RBAC, menu CRUD, content layer |
| 3. Reservations | Flow, availability rules, notifications, admin calendar |
| 4. Ordering and payments | Cart, checkout, webhooks, order board, tracking |
| 5. POS integration | Adapter layer, queue, manual adapter, then chosen adapter |
| 6. Analytics and polish | Dashboards, SEO, accessibility, performance, security review |
| 7. Content drop-in and launch | Real copy, photos, menu, reviews; UAT; go-live |

## 15. Content Hand-off Plan (after skeleton)

Content to be supplied later: logo files and wordmark, hero image/video, taglines, about/chef/values text, full menu with prices, photos, allergen info, gallery photos, reviews (Google link and manual), offers and events, contact details, map pin, WhatsApp number, opening hours, legal text, SEO copy, notification wording, delivery zones and fees, GST details.
Each item maps to a content key or admin screen so it can be entered without code changes.

## 16. Success Metrics
- Online order completion rate; share of orders reaching POS without manual intervention (target 99%+).
- Zero duplicate or lost orders.
- Reservation volume and no-show rate.
- Page speed and Lighthouse scores met.
- Time for staff to update a menu price or mark an item out of stock (under 1 minute).
- Local search impressions and Google profile actions.

## 17. Risks and Mitigations
| Risk | Mitigation |
|---|---|
| POS has no API | Middleware, bridge service or manual adapter fallback |
| POS or internet downtime | Retry queue, idempotency, order auto-pause |
| Menu mismatch between site and POS | POS as source of truth, scheduled sync |
| Payment webhook failures | Signature verification, idempotent handler, reconciliation job |
| Spam bookings and fake orders | CAPTCHA, rate limits, OTP verification for COD |
| Staff do not notice new orders | Sound alerts, push, repeat alerts until accepted |
| Gold overused, brand looks cheap | Enforce 60-30-10 and design review |
| Low contrast on cream sections | Charcoal text rule enforced in components |

## 18. Future Considerations (out of scope now)
Loyalty program, multi-branch, dine-in QR ordering, table-side payments, delivery partner integrations (Swiggy/Zomato sync), gift cards, native app, multi-language rollout, email marketing automation, waitlist management.

## 19. Open Questions
1. Which POS/billing system and version does the restaurant use, and does it have an API?
2. Razorpay or Stripe (or both)? Cash on delivery allowed?
3. Delivery in-house, third party, or pickup only at launch?
4. Number of tables, slot rules and peak capacity for reservations?
5. Notification channels: is WhatsApp Business API available?
6. Domain name, hosting preference and budget?
7. Is there an existing Google Business Profile to link and pull reviews from?
8. Final choice of heading font (Playfair Display, Cormorant or Fraunces) and body font (Inter or DM Sans)?
9. Who is the owner/manager/staff list for initial accounts?
10. GST details and invoice format requirements?

## 20. Traceability Appendix (every item from the brief)

**Public pages**: Home ✔ 7.1 · Menu ✔ 7.2 · About/Story ✔ 7.3 · Gallery ✔ 7.4 · Reviews/testimonials (Google and manual) ✔ 7.5 · Contact (address, map, phone, WhatsApp, form) ✔ 7.6 · Offers/Events (specials, happy hours, catering and party bookings) ✔ 7.7
**Functional**: Table reservations ✔ 8.1 · Online ordering (cart, checkout, delivery/pickup, tracking) ✔ 8.2 · Payments (Razorpay/Stripe, webhooks) ✔ 8.3 · Notifications (customer and restaurant) ✔ 8.4
**Admin**: Roles login ✔ 9.1 · Menu management ✔ 9.2 · Order and reservation dashboard ✔ 9.3 · Analytics ✔ 9.4 · Content editing ✔ 9.5
**Technical/business**: Mobile-first ✔ 12.1 · SEO (local, schema, GBP) ✔ 12.3 · Fast loading and image optimisation ✔ 12.2 · HTTPS, validation, spam protection ✔ 12.4 · Privacy and Terms ✔ 12.5 · Analytics ✔ 12.6
**POS integration**: Official API ✔ 10.1 · Middleware ✔ 10.1 · DB/file bridge ✔ 10.1 · Manual fallback ✔ 10.1 · Order flow, menu sync, failure handling, duplicate prevention, tax/invoice consistency, staff alerts ✔ 10.4
**Brand**: 60-30-10 ✔ 5.1 · Where gold goes ✔ 5.2 · Glow ✔ 5.3 · Typography ✔ 5.4 · Red lantern accent ✔ 5.5 · Imagery ✔ 5.6 · Accessibility ✔ 5.7 · Starter CSS tokens ✔ 5.8
**Skeleton-without-content requirement** ✔ 4.1, 4.2, 13, 15
