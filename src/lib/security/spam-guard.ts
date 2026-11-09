/**
 * Spam & Abuse Protection (PRD 8.1 & 12.4):
 * - Honeypot field check
 * - Sliding-window rate limiter per IP + endpoint bucket
 */

interface RateBucket {
  timestamps: number[];
}

const buckets = new Map<string, RateBucket>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 15,
  windowMs = 60_000
): { allowed: boolean; retryAfterSecs?: number } {
  const now = Date.now();
  const bucket = buckets.get(identifier) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= maxRequests) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSecs = Math.ceil((windowMs - (now - oldest)) / 1000);
    return { allowed: false, retryAfterSecs };
  }

  bucket.timestamps.push(now);
  buckets.set(identifier, bucket);
  return { allowed: true };
}

export function isHoneypotTriggered(honeypotValue?: string | null): boolean {
  return Boolean(honeypotValue && honeypotValue.trim().length > 0);
}
