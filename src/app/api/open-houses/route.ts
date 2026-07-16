import { NextResponse } from "next/server";
import { getOpenHouses } from "@/lib/bridge";
import { getCached, setCached } from "@/lib/api-cache";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/open-houses — Open houses in the next 7 days
 * CACHED: Same request within 5 min returns cached response.
 */
export async function GET() {
  try {
    // Check cache
    const cacheKey = "open-houses:all";
    const cached = getCached<Listing[]>(cacheKey);
    if (cached) {
      return NextResponse.json(
        { value: cached, total: cached.length },
        { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600", "X-Cache": "HIT" } }
      );
    }

    const listings = await getOpenHouses();

    if (listings.length > 0) {
      setCached(cacheKey, listings);
    }

    return NextResponse.json(
      { value: listings, total: listings.length },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600", "X-Cache": "MISS" } }
    );
  } catch (error) {
    console.error("Open houses API error:", error);
    return NextResponse.json({ error: "Failed to fetch open houses" }, { status: 500 });
  }
}
