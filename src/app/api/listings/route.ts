import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/bridge";

/**
 * GET /api/listings — Search listings with filters
 * Query params: city, zip, min_price, max_price, beds, baths, property_type, limit, offset, sort
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const result = await getListings({
      city: searchParams.get("city") || undefined,
      zip: searchParams.get("zip") || undefined,
      min_price: searchParams.get("min_price") || undefined,
      max_price: searchParams.get("max_price") || undefined,
      beds: searchParams.get("beds") || undefined,
      baths: searchParams.get("baths") || undefined,
      property_type: searchParams.get("property_type") || undefined,
      limit: searchParams.get("limit") || "24",
      offset: searchParams.get("offset") || undefined,
      sort: searchParams.get("sort") || undefined,
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
