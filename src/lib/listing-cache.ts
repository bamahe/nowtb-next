// =============================================================================
// Listing cache — server-readable snapshot of active MLS inventory
//
// WHY THIS EXISTS
// City pages used to load listings client-side to avoid burning the Bridge API
// rate limit (one API call per visitor). That worked, but AI crawlers — GPTBot,
// ClaudeBot, PerplexityBot — don't run JavaScript, so they saw city pages with
// zero homes on them. Search Console confirmed it: property pages drew 15 of
// 43,287 AI impressions.
//
// The fix is to stop fetching per-visitor entirely. A cron job refreshes this
// cache on a fixed schedule, and every page reads from Supabase — which costs
// no Bridge quota at all. Net result is FEWER Bridge calls than before, not
// more, because the cost is now per-interval instead of per-visitor.
//
// MLS COMPLIANCE: Stellar's IDX rules require displayed data to stay fresh.
// The cron runs hourly and every row carries fetched_at, so stale rows can be
// filtered out at read time rather than silently shown. Nothing is served if
// it is older than MAX_AGE_HOURS.
// =============================================================================

import { createAdminClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types";

/** Refuse to serve cached listings older than this. Keeps IDX display honest. */
const MAX_AGE_HOURS = 12;

/**
 * Read cached active listings covering any of the given ZIP codes.
 * Returns [] on any failure — callers fall back to the client-side loader,
 * so a cache miss degrades to today's behaviour rather than an empty page.
 */
export async function getCachedListings(
  zipCodes: string[],
  limit = 12
): Promise<Listing[]> {
  if (!zipCodes.length) return [];

  try {
    const supabase = createAdminClient();
    // createAdminClient returns null when the service role key is unset
    if (!supabase) return [];
    const cutoff = new Date(Date.now() - MAX_AGE_HOURS * 3600_000).toISOString();

    const { data, error } = await supabase
      .from("listing_cache")
      .select("payload")
      .in("zip", zipCodes)
      .gte("fetched_at", cutoff)
      .order("list_price", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((r) => r.payload as Listing);
  } catch {
    // Never let a cache problem break a page render
    return [];
  }
}

/**
 * Replace the cached rows for one ZIP. Called by the refresh cron.
 * Deletes first so sold and withdrawn listings disappear rather than linger —
 * showing an off-market home is an IDX violation, not just a stale page.
 */
export async function writeCachedListings(
  zip: string,
  listings: Listing[]
): Promise<number> {
  const supabase = createAdminClient();
  if (!supabase) {
    console.warn("[listing-cache] no service role key — skipping write");
    return 0;
  }

  await supabase.from("listing_cache").delete().eq("zip", zip);
  if (!listings.length) return 0;

  const rows = listings.map((l) => ({
    listing_key: String(l.ListingKey),
    zip,
    list_price: l.ListPrice ?? 0,
    fetched_at: new Date().toISOString(),
    payload: l,
  }));

  const { error } = await supabase.from("listing_cache").upsert(rows, {
    onConflict: "listing_key,zip",
  });

  if (error) {
    console.error(`[listing-cache] write failed for ${zip}:`, error.message);
    return 0;
  }
  return rows.length;
}
