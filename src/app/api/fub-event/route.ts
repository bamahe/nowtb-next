// =============================================================================
// POST /api/fub-event — Receives front-end events and pushes them to FUB
// Used for: PropertyViewed, PropertyFavorited, SearchSaved
// Fire-and-forget from the client — never blocks the UI.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { pushEventToFub, pushNoteToFub } from "@/lib/fub";

// Shape of the request body from the client
interface FubEventBody {
  email: string;
  event: "PropertyViewed" | "PropertyFavorited" | "SearchSaved";
  /** Property details (for PropertyViewed and PropertyFavorited) */
  property?: {
    address?: string;
    city?: string;
    state?: string;
    price?: number;
    mlsNumber?: string;
    url?: string;
  };
  /** Search criteria (for SearchSaved) */
  search?: {
    name?: string;
    filters?: Record<string, string>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: FubEventBody = await request.json();

    // --- Validate required fields ---
    if (!body.email || !body.event) {
      return NextResponse.json(
        { error: "Missing required fields: email and event" },
        { status: 400 }
      );
    }

    // --- Route to the right FUB action based on event type ---
    switch (body.event) {
      case "PropertyViewed": {
        // Push a timeline event showing which listing they viewed
        const addr = body.property?.address || "a property";
        const price = body.property?.price
          ? ` ($${body.property.price.toLocaleString()})`
          : "";

        await pushEventToFub({
          email: body.email,
          type: "PropertyViewed",
          message: `Viewed ${addr}${price}`,
          property: body.property
            ? {
                street: body.property.address,
                city: body.property.city,
                state: body.property.state || "FL",
                mlsNumber: body.property.mlsNumber,
                price: body.property.price,
                url: body.property.url,
              }
            : undefined,
        });
        break;
      }

      case "PropertyFavorited": {
        // Push a timeline event when they save/favorite a listing
        const addr = body.property?.address || "a property";
        const price = body.property?.price
          ? ` ($${body.property.price.toLocaleString()})`
          : "";
        const mls = body.property?.mlsNumber
          ? ` — MLS# ${body.property.mlsNumber}`
          : "";

        await pushEventToFub({
          email: body.email,
          type: "PropertyFavorited",
          message: `Saved ${addr}${price}${mls} to favorites`,
          property: body.property
            ? {
                street: body.property.address,
                city: body.property.city,
                state: body.property.state || "FL",
                mlsNumber: body.property.mlsNumber,
                price: body.property.price,
                url: body.property.url,
              }
            : undefined,
        });
        break;
      }

      case "SearchSaved": {
        // Push a note with the saved search criteria so Barrett sees what they want
        const searchName = body.search?.name || "Unnamed Search";
        const filters = body.search?.filters || {};

        // Build a readable summary of the filters
        const filterLines: string[] = [];
        if (filters.city) filterLines.push(`City: ${filters.city}`);
        if (filters.zip) filterLines.push(`ZIP: ${filters.zip}`);
        if (filters.property_type) filterLines.push(`Type: ${filters.property_type}`);
        if (filters.min_price || filters.max_price) {
          const min = filters.min_price ? `$${Number(filters.min_price).toLocaleString()}` : "Any";
          const max = filters.max_price ? `$${Number(filters.max_price).toLocaleString()}` : "Any";
          filterLines.push(`Price: ${min} — ${max}`);
        }
        if (filters.beds) filterLines.push(`Beds: ${filters.beds}+`);
        if (filters.baths) filterLines.push(`Baths: ${filters.baths}+`);
        if (filters.pool === "true") filterLines.push(`Pool: Yes`);
        if (filters.waterfront === "true") filterLines.push(`Waterfront: Yes`);
        if (filters.new_construction === "true") filterLines.push(`New Construction: Yes`);
        if (filters.senior === "true") filterLines.push(`55+ Community: Yes`);

        const noteBody = filterLines.length > 0
          ? `Search Name: ${searchName}\n\n--- Filters ---\n${filterLines.join("\n")}`
          : `Search Name: ${searchName}\nNo specific filters applied.`;

        // Push as both a note (for detailed criteria) and an event (for timeline)
        await Promise.all([
          pushNoteToFub({
            email: body.email,
            subject: `Saved Search: ${searchName}`,
            body: noteBody,
          }),
          pushEventToFub({
            email: body.email,
            type: "SearchSaved",
            message: `Saved a search: "${searchName}"`,
          }),
        ]);
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown event type: ${body.event}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FUB Event API] Error:", error);
    return NextResponse.json(
      { error: "Failed to process FUB event" },
      { status: 500 }
    );
  }
}
