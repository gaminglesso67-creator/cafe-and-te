import React from 'react';
import { t } from '@/lib/content';
import {
  SEED_EVENTS,
  SEED_MENU_ITEMS,
  SEED_OFFERS,
  SEED_OPENING_HOURS,
} from '@/lib/seed-data';

/**
 * JSON-LD Structured Data Schema Markup (PRD Section 12.3):
 * Emits `Restaurant`, `LocalBusiness`, `Menu`, `OpeningHoursSpecification`,
 * `AggregateRating`, `Event`, `Offer`, and `BreadcrumbList` schemas.
 */
export function RestaurantSchemaMarkup() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Restaurant', 'LocalBusiness'],
        '@id': `${siteUrl}/#restaurant`,
        name: t('brand.wordmark'),
        description: t('home.hero.tagline'),
        url: siteUrl,
        telephone: t('brand.phone_display'),
        email: t('brand.email'),
        priceRange: '₹₹ (₹1,000–₹1,100 for two)',
        servesCuisine: [
          'Maharashtrian',
          'North Indian',
          'Continental',
          'Italian',
          'Chinese',
          'Biryani',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: t('brand.address_line1'),
          addressLocality: 'Viman Nagar, Pune',
          addressRegion: 'Maharashtra',
          postalCode: '411014',
          addressCountry: 'IN',
        },
        openingHoursSpecification: SEED_OPENING_HOURS.filter((h) => !h.isClosed).map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.dayLabel,
          opens: h.openTime,
          closes: h.closeTime,
        })),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          reviewCount: '191',
        },
        hasMenu: `${siteUrl}/menu#menu`,
      },
      {
        '@type': 'Menu',
        '@id': `${siteUrl}/menu#menu`,
        name: `${t('brand.wordmark')} Menu`,
        hasMenuItem: SEED_MENU_ITEMS.slice(0, 4).map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          description: item.description,
          offers: {
            '@type': 'Offer',
            price: String(item.price),
            priceCurrency: 'INR',
          },
        })),
      },
      ...SEED_OFFERS.map((offer) => ({
        '@type': 'Offer',
        name: offer.title,
        description: offer.description,
        priceCurrency: 'INR',
        validFrom: offer.validFrom,
        validThrough: offer.validUntil,
      })),
      ...SEED_EVENTS.map((evt) => ({
        '@type': 'Event',
        name: evt.title,
        description: evt.description,
        startDate: evt.dateLabel,
      })),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Menu', item: `${siteUrl}/menu` },
          { '@type': 'ListItem', position: 3, name: 'Reserve', item: `${siteUrl}/reserve` },
          { '@type': 'ListItem', position: 4, name: 'Order Online', item: `${siteUrl}/order` },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}

