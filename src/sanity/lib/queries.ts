/**
 * GROQ Queries for Caffè & Tè — All Day Cafe (Viman Nagar, Pune)
 */

export const GROQ_CATEGORIES = `*[_type == "menuCategory" && isActive != false] | order(sortOrder asc) {
  "id": coalesce(id, _id),
  name,
  "slug": coalesce(slug.current, id),
  sortOrder
}`;

export const GROQ_MENU_ITEMS = `*[_type == "menuItem"] | order(name asc) {
  "id": coalesce(id, _id),
  categoryId,
  name,
  "slug": coalesce(slug.current, id),
  description,
  price,
  isVeg,
  isAvailable,
  isSignature,
  "imageSlot": coalesce(image.asset->url, imageSlot, "dish_signature_1"),
  "allergens": coalesce(allergens, []),
  "variants": coalesce(variants, []),
  "addOns": coalesce(addOns, [])
}`;

export const GROQ_OFFERS = `*[_type == "offer" && isActive != false] | order(_createdAt desc) {
  "id": coalesce(id, _id),
  title,
  description,
  badgeText,
  code,
  validFrom,
  validUntil,
  isHappyHour
}`;

export const GROQ_EVENTS = `*[_type == "event"] | order(isUpcoming desc, _createdAt desc) {
  "id": coalesce(id, _id),
  title,
  dateLabel,
  timeLabel,
  description,
  isUpcoming,
  "imageSlot": coalesce(image.asset->url, imageSlot, "event_banner_1")
}`;

export const GROQ_REVIEWS = `*[_type == "review" && isApproved != false] | order(_createdAt desc) {
  "id": coalesce(id, _id),
  reviewerName,
  rating,
  comment,
  source,
  dateLabel
}`;

export const GROQ_GALLERY = `*[_type == "galleryItem"] | order(_createdAt asc) {
  "id": coalesce(id, _id),
  title,
  category,
  "imageSlot": coalesce(image.asset->url, imageSlot, "gallery_1")
}`;

export const GROQ_OPENING_HOURS = `*[_type == "openingHours"] | order(dayIndex asc) {
  dayLabel,
  openTime,
  closeTime,
  isClosed
}`;

