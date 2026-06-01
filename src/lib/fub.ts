// =============================================================================
// Follow Up Boss API client — pushes leads directly into FUB
// NEVER import this in client components — uses server-only API key
// =============================================================================

const FUB_API_KEY = process.env.FUB_API_KEY!;
const FUB_BASE = "https://api.followupboss.com/v1";

/**
 * Data shape for creating/updating a person (lead) in FUB.
 * The "source" tells FUB where the lead came from.
 * The "property" object attaches the listing they were looking at.
 */
interface FubLeadData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;       // e.g. "nowtb.com — Showing Request"
  /** Property details to attach to the lead's note */
  property?: {
    address?: string;
    city?: string;
    state?: string;
    price?: number;
    mlsNumber?: string;
    url?: string;
    beds?: number;
    baths?: number;
    sqft?: number;
  };
  /** Raw source identifier for internal tracking (e.g. "showing-request:MLS123") */
  sourceId?: string;
  /** Tags to apply to the lead in FUB */
  tags?: string[];
}

/**
 * Push a lead into Follow Up Boss.
 * - Creates a new person if the email doesn't exist
 * - Updates the existing person if the email already exists (FUB dedupes by email)
 * - Attaches property details as a note so you can see what they're interested in
 * - Adds an event so it shows up in the lead's activity timeline
 */
export async function pushLeadToFub(data: FubLeadData): Promise<boolean> {
  try {
    // Split name into first/last for FUB
    const nameParts = data.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // --- Step 1: Create or update the person in FUB ---
    const personPayload: Record<string, unknown> = {
      firstName,
      lastName,
      source: data.source,
      emails: [{ value: data.email }],
      tags: data.tags || [],
    };

    // Add phone if provided
    if (data.phone) {
      personPayload.phones = [{ value: data.phone }];
    }

    // FUB will create or merge based on email match
    const personRes = await fetch(`${FUB_BASE}/people`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(FUB_API_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personPayload),
    });

    if (!personRes.ok) {
      const errText = await personRes.text();
      console.error("[FUB] Failed to create/update person:", errText);
      return false;
    }

    const personData = await personRes.json();
    const personId = personData.id;

    // --- Step 2: Add a note with property details + their message ---
    const noteParts: string[] = [];

    if (data.message) {
      noteParts.push(`Message: ${data.message}`);
    }

    // Build a property summary block for the note
    if (data.property) {
      const p = data.property;
      const propLines: string[] = ["--- Property of Interest ---"];
      if (p.address) propLines.push(`Address: ${p.address}`);
      if (p.city && p.state) propLines.push(`Location: ${p.city}, ${p.state}`);
      if (p.price) propLines.push(`List Price: $${p.price.toLocaleString()}`);
      if (p.beds) propLines.push(`Beds: ${p.beds}`);
      if (p.baths) propLines.push(`Baths: ${p.baths}`);
      if (p.sqft) propLines.push(`Sq Ft: ${p.sqft.toLocaleString()}`);
      if (p.mlsNumber) propLines.push(`MLS #: ${p.mlsNumber}`);
      if (p.url) propLines.push(`View Listing: ${p.url}`);
      noteParts.push(propLines.join("\n"));
    }

    if (noteParts.length > 0) {
      await fetch(`${FUB_BASE}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(FUB_API_KEY + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personId,
          subject: data.property
            ? `Showing Request — ${data.property.address || "Property"}`
            : "Website Inquiry",
          body: noteParts.join("\n\n"),
        }),
      });
    }

    // --- Step 3: Log an event so it shows in the timeline ---
    await fetch(`${FUB_BASE}/events`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(FUB_API_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        person: { emails: [{ value: data.email }] },
        source: data.source,
        type: "Registration",
        message: data.property
          ? `Requested showing for ${data.property.address || "a property"} (MLS# ${data.property.mlsNumber || "N/A"}) — ${data.property.price ? "$" + data.property.price.toLocaleString() : "price N/A"}`
          : data.message || "Submitted contact form on nowtb.com",
        description: data.message || "",
        property: data.property
          ? {
              street: data.property.address,
              city: data.property.city,
              state: data.property.state,
              mlsNumber: data.property.mlsNumber,
              price: data.property.price,
              url: data.property.url,
              forRent: false,
              beds: data.property.beds,
              baths: data.property.baths,
              sqFt: data.property.sqft,
            }
          : undefined,
      }),
    });

    console.log(`[FUB] Lead pushed successfully: ${data.email} (personId: ${personId})`);
    return true;
  } catch (error) {
    console.error("[FUB] Error pushing lead:", error);
    return false;
  }
}
