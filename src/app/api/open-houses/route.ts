import { NextResponse } from "next/server";
import { getOpenHouses } from "@/lib/bridge";

/**
 * GET /api/open-houses — Open houses in the next 7 days
 */
export async function GET() {
  try {
    const listings = await getOpenHouses();

    return NextResponse.json(
      { value: listings, total: listings.length },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Open houses API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch open houses" },
      { status: 500 }
    );
  }
}
