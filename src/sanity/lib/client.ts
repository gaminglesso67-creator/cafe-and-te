import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import {
  isSanityConfigured,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from '../env';

let cachedReadClient: SanityClient | null = null;

/**
 * Public read-only Sanity client (uses Sanity Edge CDN for fast public page loads).
 * Returns null if `NEXT_PUBLIC_SANITY_PROJECT_ID` is not yet configured.
 */
export function getSanityReadClient(): SanityClient | null {
  if (!isSanityConfigured()) return null;
  if (!cachedReadClient) {
    cachedReadClient = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: true,
      perspective: 'published',
    });
  }
  return cachedReadClient;
}

/**
 * Server-only authenticated Sanity write client for creating Orders, Reservations,
 * Catering Enquiries, or running administrative mutations.
 * Never expose `SANITY_API_WRITE_TOKEN` to client components.
 */
export function getSanityWriteClient(): SanityClient | null {
  if (typeof window !== 'undefined') {
    throw new Error('getSanityWriteClient() can only be called on the server.');
  }
  const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!isSanityConfigured() || !writeToken || writeToken === 'your_sanity_write_token') {
    return null;
  }
  return createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    token: writeToken,
    useCdn: false,
  });
}

/**
 * Builds an optimized Sanity CDN URL from a Sanity image reference.
 */
export function urlForSanityImage(source: unknown): string | null {
  const client = getSanityReadClient();
  if (!client || !source) return null;
  try {
    return imageUrlBuilder(client).image(source).auto('format').fit('max').url();
  } catch {
    return null;
  }
}

