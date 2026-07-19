import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/bridge";
import { getCached, setCached, makeCacheKey } from "@/lib/api-cache";
import type { BridgeResponse } from "@/lib/types";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/listings — Search listings with filters
 * CACHED: Same query within 5 min returns cached response — zero Bridge API calls.
 * This is the #1 fix for Bridge API throttling.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse the free-text "q" param
    let q = searchParams.get("q")?.trim() || "";
    const qIsZip = /^\d{5}$/.test(q);
    // Detect address searches: starts with a number (e.g. "11214 sailbrooke dr")
    const qIsAddress = /^\d+\s+\w/.test(q);

    let cityQuery = searchParams.get("city") || undefined;
    let zipQuery = searchParams.get("zip") || undefined;
    let addressQuery: string | undefined = undefined;
    if (!cityQuery && !zipQuery && q) {
      if (qIsZip) {
        zipQuery = q;
      } else if (qIsAddress) {
        // Address search: use UnparsedAddress contains filter
        addressQuery = q;
      } else if (q.includes("/")) {
        cityQuery = q.split("/")[0].trim();
      } else {
        cityQuery = q;
      }
    }

    const propType = searchParams.get("property_type") || "";
    const isCommercialSearch = propType.includes("Commercial") || propType === "Land" || propType === "Business Opportunity";

    // Build the params object
    const params = {
      city: cityQuery,
      zip: zipQuery,
      address: addressQuery,
      zip_codes: searchParams.get("zip_codes")?.split(",").filter(Boolean) || undefined,
      min_price: searchParams.get("min_price") || undefined,
      max_price: searchParams.get("max_price") || undefined,
      beds: searchParams.get("beds") || undefined,
      baths: searchParams.get("baths") || undefined,
      property_type: searchParams.get("property_type") || undefined,
      property_sub_type: searchParams.get("property_sub_type") || undefined,
      subdivision: searchParams.get("subdivision") || undefined,
      status: searchParams.get("status") || undefined,
      limit: searchParams.get("limit") || "24",
      offset: searchParams.get("offset") || undefined,
      sort: searchParams.get("sort") || undefined,
      pool: searchParams.get("pool") === "true" || undefined,
      waterfront: searchParams.get("waterfront") === "true" || undefined,
      new_construction: searchParams.get("new_construction") === "true" || undefined,
      senior: searchParams.get("senior") === "true" || undefined,
      single_story: searchParams.get("single_story") === "true" || undefined,
      open_house: searchParams.get("open_house") === "true" || undefined,
      rental: searchParams.get("rental") === "true" || undefined,
      exclude_rental: (searchParams.get("rental") === "true" || isCommercialSearch) ? undefined : true,
      min_sqft: searchParams.get("min_sqft") || undefined,
      max_sqft: searchParams.get("max_sqft") || undefined,
      min_year: searchParams.get("min_year") || undefined,
      price_reduced: searchParams.get("price_reduced") === "true" || undefined,
      garage: searchParams.get("garage") === "true" || undefined,
    };

    // CHECK CACHE FIRST — same query within 5 min returns cached data
    const cacheKey = makeCacheKey("listings", params as Record<string, string | undefined>);
    const cached = getCached<BridgeResponse<Listing>>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
          "X-Cache": "HIT",
        },
      });
    }

    // CACHE MISS — call Bridge API
    const result = await getListings(params);

    // Only cache successful non-empty responses
    // Don't cache empty results from rate limiting
    if (result.value && result.value.length > 0) {
      setCached(cacheKey, result);
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Listings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
