import { NextResponse } from "next/server";
import { getFeaturedListings } from "@/lib/bridge";

// Force dynamic — listings depend on runtime env vars
export const dynamic = "force-dynamic";

/**
 * GET /api/featured — Featured/highlighted listings
 */
export async function GET() {
  try {
    const listings = await getFeaturedListings();

    return NextResponse.json(
      { value: listings, total: listings.length },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Featured listings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured listings" },
      { status: 500 }
    );
  }
}
