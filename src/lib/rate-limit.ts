// =============================================================================
// Rate Limiting — caps how often one IP address can submit a form
//
// WHY: even with Turnstile and validation, a determined bot can grind away at
// a form. Rate limiting stops the volume, which is what actually damages our
// email sending reputation.
//
// HOW IT WORKS: an in-memory Map holding a list of recent timestamps per IP.
// On each request we drop timestamps older than the window and count what's
// left. If the count is over the limit, we reject.
//
// IF IT BREAKS, CHECK THIS:
// This is per-server-instance memory. Vercel may run several instances of the
// function at once, so the real-world limit is roughly (limit x instances).
// That's fine for stopping spam floods. If you ever need exact global limits,
// swap this for Upstash Redis (@upstash/ratelimit) — same function signature.
// Memory is NOT shared between instances and resets on redeploy; that's OK
// because the window here is only minutes long.
// =============================================================================

/** Timestamps (ms) of recent requests, keyed by identifier (usually an IP). */
const hits = new Map<string, number[]>();

/** Stop the Map growing forever if a lot of unique IPs come through. */
const MAX_TRACKED_KEYS = 10_000;

export interface RateLimitResult {
  /** true = allow the request through */
  ok: boolean;
  /** How many requests remain in the current window */
  remaining: number;
  /** Seconds until the window resets (only meaningful when ok is false) */
  retryAfter: number;
}

/**
 * Checks and records one request against the limit.
 *
 * @param key       identifier to limit on — normally the client IP
 * @param limit     max requests allowed inside the window
 * @param windowMs  size of the rolling window, in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Housekeeping: if we're tracking too many keys, drop the ones that are
  // fully expired. Cheap way to keep memory bounded.
  // (forEach rather than for...of — this project's TS target predates
  // downlevel Map iteration.)
  if (hits.size > MAX_TRACKED_KEYS) {
    const expired: string[] = [];
    hits.forEach((times: number[], k: string) => {
      if (times.every((t: number) => t <= windowStart)) expired.push(k);
    });
    expired.forEach((k) => hits.delete(k));
  }

  // Keep only the timestamps still inside the rolling window.
  const recent = (hits.get(key) || []).filter((t) => t > windowStart);

  if (recent.length >= limit) {
    // Over the limit. Work out when the oldest hit falls out of the window.
    const oldest = Math.min(...recent);
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    // Store the trimmed list back so it doesn't keep growing while blocked.
    hits.set(key, recent);
    return { ok: false, remaining: 0, retryAfter };
  }

  // Under the limit — record this request and allow it.
  recent.push(now);
  hits.set(key, recent);
  return { ok: true, remaining: limit - recent.length, retryAfter: 0 };
}

/**
 * Pulls the client IP out of the request headers.
 *
 * Vercel sets x-forwarded-for. It can hold a comma-separated chain of proxies
 * ("client, proxy1, proxy2"), and the FIRST entry is the real client.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
