// =============================================================================
// API Response Cache — prevents Bridge API from getting hammered
//
// Problem: Every client-side listing fetch goes through /api/listings which
// calls Bridge with zero caching. 10 visitors = 10 identical API calls.
//
// Solution: In-memory cache with 5-minute TTL per unique query.
// Same ZIP code + filter combo within 5 min = cached response, zero API calls.
//
// On Vercel, this cache lives in the serverless function's memory.
// It persists across requests within the same function instance (typically
// 5-15 minutes in Fluid Compute mode). Cold starts get a fresh cache.
// =============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get a cached value by key. Returns undefined if expired or missing.
 */
export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.timestamp > DEFAULT_TTL) {
    cache.delete(key);
    return undefined;
  }
  return entry.data as T;
}

/**
 * Set a cached value with automatic TTL.
 */
export function setCached<T>(key: string, data: T): void {
  // Prevent cache from growing unbounded — evict old entries if over 500
  if (cache.size > 500) {
    const now = Date.now();
    const keysToDelete: string[] = [];
    cache.forEach((v, k) => {
      if (now - v.timestamp > DEFAULT_TTL) keysToDelete.push(k);
    });
    keysToDelete.forEach((k) => cache.delete(k));
    // If still over 500, clear everything (nuclear option, rare)
    if (cache.size > 500) cache.clear();
  }
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Generate a cache key from API parameters.
 */
export function makeCacheKey(prefix: string, params: Record<string, string | undefined>): string {
  const sorted = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return `${prefix}:${sorted}`;
}
