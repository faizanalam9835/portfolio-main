/**
 * Minimal in-memory fixed-window rate limiter for the contact endpoint.
 *
 * Scope: single server instance. Enough to stop casual abuse of a
 * portfolio contact form. For multi-instance deployments swap the Map for
 * Redis (`INCR` + `EXPIRE` on the same key) — the interface stays the same.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Drop expired entries so the Map cannot grow unbounded. */
function sweep(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

export function rateLimit(
  identifier: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();

  // Cheap opportunistic cleanup; the Map only holds active windows.
  if (windows.size > 500) sweep(now);

  const existing = windows.get(identifier);

  if (!existing || existing.resetAt <= now) {
    windows.set(identifier, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      retryAfter: Math.ceil(windowMs / 1000),
    };
  }

  existing.count += 1;
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  return {
    success: existing.count <= limit,
    limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfter,
  };
}

/** Best-effort client identity from proxy headers. */
export function getClientIdentifier(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "anonymous";
}
