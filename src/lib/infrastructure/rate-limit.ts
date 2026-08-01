import { RATE_LIMIT } from "@/lib/domain/contact";
import { logger } from "@/lib/logger";

interface RateEntry {
  count: number;
  resetAt: number;
}

/**
 * In-memory per-IP rate limit store.
 *
 * Limitations (accepted for this single-instance portfolio):
 * - State lives in the Node process: a restart (or serverless cold start)
 *   resets every counter.
 * - Per-IP only. Behind a proxy the client IP must be forwarded by the
 *   hosting platform, otherwise all traffic shares one bucket. See
 *   `app/api/contact/route.ts` for how the IP is derived.
 * - Not shared across multiple instances.
 *
 * Upgrade path if this ever needs to be durable/shared:
 * - Swap `store` for a Redis-backed fixed-window counter
 *   (SET key value EX window NX + INCR), keeping the same
 *   `checkRateLimit`/`resetRateLimit` API so callers don't change.
 * - Add a per-route namespace to the key (e.g. `rl:contact:{ip}`).
 */

const store = new Map<string, RateEntry>();

export interface RateCheckResult {
  allowed: boolean;
  retryAfter?: number;
}

export function checkRateLimit(ip: string): RateCheckResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + RATE_LIMIT.WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT.MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    logger.warn("Rate limit exceeded", { ip, retryAfter });
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

export function resetRateLimit(ip: string): void {
  store.delete(ip);
}

const CLEANUP_INTERVAL = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    logger.debug("Rate limit store cleaned", { entriesRemoved: cleaned, remaining: store.size });
  }
}, CLEANUP_INTERVAL).unref();
