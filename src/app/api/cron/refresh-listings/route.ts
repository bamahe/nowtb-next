// =============================================================================
// /api/cron/refresh-listings — keeps the server-side listing cache warm
//
// Runs hourly via Vercel Cron. Pulls active inventory for every ZIP the site
// serves and writes it to Supabase, so city pages can render real homes into
// their HTML without calling Bridge on every visit.
//
// Bridge cost is fixed per run regardless of traffic. The old client-side
// approach cost one call per visitor, so this is a reduction, not an increase.
// =============================================================================

import { NextResponse } from "next/server";
import { getListingsByZip } from "@/lib/bridge";
import { writeCachedListings } from "@/lib/listing-cache";
import { cities } from "@/data/cities";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // ZIP sweeps take a while — allow the full 5 min

/** How many listings to keep per ZIP. Pages render ~12, so this leaves headroom. */
const PER_ZIP = 24;

/** Pause between Bridge calls so a sweep never trips their rate limiter. */
const THROTTLE_MS = 250;

export async function GET(request: Request) {
  // Vercel Cron sends this header; reject anything else so the endpoint
  // can't be used to burn Bridge quota from outside.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Every ZIP the site covers, de-duplicated — many cities share ZIPs
  const zips = Array.from(
    new Set(cities.flatMap((c) => c.zip_codes || []))
  ).filter(Boolean);

  let written = 0;
  let failed = 0;
  const startedAt = Date.now();

  for (const zip of zips) {
    // Leave a safety margin before Vercel's maxDuration kills the function,
    // so a partial sweep still commits what it managed to fetch.
    if (Date.now() - startedAt > 270_000) {
      console.warn(`[refresh-listings] stopping early at ${zip} — time budget`);
      break;
    }

    try {
      const listings = await getListingsByZip(zip, PER_ZIP);
      written += await writeCachedListings(zip, listings);
    } catch (err) {
      failed++;
      console.warn(`[refresh-listings] ${zip} failed:`, err);
    }

    await new Promise((r) => setTimeout(r, THROTTLE_MS));
  }

  return NextResponse.json({
    ok: true,
    zips: zips.length,
    listingsWritten: written,
    zipsFailed: failed,
    seconds: Math.round((Date.now() - startedAt) / 1000),
  });
}
