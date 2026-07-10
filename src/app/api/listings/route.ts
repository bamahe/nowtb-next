import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/bridge";

/**
 * GET /api/listings — Search listings with filters
 * Query params: city, zip, min_price, max_price, beds, baths, property_type, limit, offset, sort
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse the free-text "q" param — could be a city name or ZIP code
    const q = searchParams.get("q")?.trim() || "";
    const qIsZip = /^\d{5}$/.test(q);

    const result = await getListings({
      city: searchParams.get("city") || (!qIsZip && q ? q : undefined),
      zip: searchParams.get("zip") || (qIsZip ? q : undefined),
      min_price: searchParams.get("min_price") || undefined,
      max_price: searchParams.get("max_price") || undefined,
      beds: searchParams.get("beds") || undefined,
      baths: searchParams.get("baths") || undefined,
      property_type: searchParams.get("property_type") || undefined,
      limit: searchParams.get("limit") || "24",
      offset: searchParams.get("offset") || undefined,
      sort: searchParams.get("sort") || undefined,
      // Boolean feature filters
      pool: searchParams.get("pool") === "true" || undefined,
      waterfront: searchParams.get("waterfront") === "true" || undefined,
      new_construction: searchParams.get("new_construction") === "true" || undefined,
      senior: searchParams.get("senior") === "true" || undefined,
      single_story: searchParams.get("single_story") === "true" || undefined,
      open_house: searchParams.get("open_house") === "true" || undefined,
      rental: searchParams.get("rental") === "true" || undefined,
      // Exclude rentals by default unless explicitly requesting rentals
      exclude_rental: searchParams.get("rental") === "true" ? undefined : true,
      // Advanced FilterPanel filters
      min_sqft: searchParams.get("min_sqft") || undefined,
      max_sqft: searchParams.get("max_sqft") || undefined,
      min_year: searchParams.get("min_year") || undefined,
      price_reduced: searchParams.get("price_reduced") === "true" || undefined,
      garage: searchParams.get("garage") === "true" || undefined,
      // keyword is not forwarded to Bridge (OData doesn't support PublicRemarks text search)
      // It could be applied as a client-side filter here if needed in the future
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
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
