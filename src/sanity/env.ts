/**
 * Sanity CMS Environment & Configuration Helpers
 * Public variables are safe for client/CDN reads; write tokens are strictly server-only.
 */

export const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || '';

export const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';

export const SANITY_API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2025-02-01';

export const SANITY_STUDIO_URL =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL?.trim() ||
  (SANITY_PROJECT_ID
    ? `https://${SANITY_PROJECT_ID}.sanity.studio`
    : 'https://www.sanity.io/manage');

/**
 * Returns true when a valid Sanity projectId is configured in environment variables.
 */
export function isSanityConfigured(): boolean {
  return (
    Boolean(SANITY_PROJECT_ID) &&
    SANITY_PROJECT_ID !== 'your_sanity_project_id' &&
    /^[a-z0-9-]+$/.test(SANITY_PROJECT_ID)
  );
}

