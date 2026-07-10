import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/bridge";

/**
 * GET /api/listings — Search listings with filters
 * Query params: city, zip, min_price, max_price, beds, baths, property_type, limit, offset, sort
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse the free-text "q" param — could be a city name, ZIP code, or multi-city like "Brandon / Riverview"
    let q = searchParams.get("q")?.trim() || "";
    const qIsZip = /^\d{5}$/.test(q);

    // Handle multi-city queries: "Brandon / Riverview" → use first city name
    // The slash separator from the area search links needs to be parsed
    let cityQuery = searchParams.get("city") || undefined;
    let zipQuery = searchParams.get("zip") || undefined;
    if (!cityQuery && !zipQuery && q) {
      if (qIsZip) {
        zipQuery = q;
      } else if (q.includes("/")) {
        // Multi-city: take the first city name for the OData filter
        cityQuery = q.split("/")[0].trim();
      } else {
        cityQuery = q;
      }
    }

    // Don't exclude rentals when searching commercial or land
    const propType = searchParams.get("property_type") || "";
    const isCommercialSearch = propType.includes("Commercial") || propType === "Land" || propType === "Business Opportunity";

    const result = await getListings({
      city: cityQuery,
      zip: zipQuery,
      // Support comma-separated ZIP codes for area searches
      zip_codes: searchParams.get("zip_codes")?.split(",").filter(Boolean) || undefined,
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
      // Exclude rentals by default unless requesting rentals or commercial/land
      exclude_rental: (searchParams.get("rental") === "true" || isCommercialSearch) ? undefined : true,
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
