import { NextRequest, NextResponse } from "next/server";
import { getListing } from "@/lib/bridge";
import { getCached, setCached } from "@/lib/api-cache";
import type { Listing } from "@/lib/types";

/**
 * GET /api/listings/[id] — Single listing by ListingKey
 * CACHED: Same listing key within 5 min returns cached response.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check cache first
    const cacheKey = `listing:${id}`;
    const cached = getCached<Listing>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600", "X-Cache": "HIT" },
      });
    }

    const listing = await getListing(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    setCached(cacheKey, listing);

    return NextResponse.json(listing, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600", "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("Listing detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}
