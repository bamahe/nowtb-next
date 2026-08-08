// =============================================================================
// Follow Up Boss API client — pushes leads directly into FUB
// NEVER import this in client components — uses server-only API key
// =============================================================================

const FUB_API_KEY = process.env.FUB_API_KEY || "";
const FUB_BASE = "https://api.followupboss.com/v1";

// Shared auth header builder — keeps it DRY
function fubAuthHeader(): string {
  return `Basic ${Buffer.from(FUB_API_KEY + ":").toString("base64")}`;
}

/**
 * Data shape for creating/updating a person (lead) in FUB.
 * The "source" tells FUB where the lead came from.
 * The "property" object attaches the listing they were looking at.
 */
interface FubLeadData {
  name: string;
  /** Optional — open-house walk-ins often give a phone but no email */
  email?: string;
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
      tags: data.tags || [],
    };

    // Include whatever contact info we have. FUB needs at least one of
    // email/phone to create a person — so phone-only walk-ins still land.
    if (data.email) {
      personPayload.emails = [{ value: data.email }];
    }
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
      const p = data.property as Record<string, unknown>;
      const propLines: string[] = ["--- Property of Interest ---"];
      if (p.address) propLines.push(`Address: ${p.address}`);
      if (p.city && p.state) propLines.push(`Location: ${p.city}, ${p.state}`);
      if (p.price) propLines.push(`List Price: $${Number(p.price).toLocaleString()}`);
      if (p.beds) propLines.push(`Beds: ${p.beds}`);
      if (p.baths) propLines.push(`Baths: ${p.baths}`);
      if (p.sqft) propLines.push(`Sq Ft: ${Number(p.sqft).toLocaleString()}`);
      if (p.mlsNumber) propLines.push(`MLS #: ${p.mlsNumber}`);
      if (p.url) propLines.push(`View Listing: ${p.url}`);
      // Tour scheduling details
      if (p.preferredDate) propLines.push(`\n--- Tour Details ---`);
      if (p.preferredDate) propLines.push(`Requested Date: ${p.preferredDate}`);
      if (p.preferredTime) propLines.push(`Requested Time: ${p.preferredTime}`);
      if (p.tourType) propLines.push(`Tour Type: ${p.tourType === "video" ? "Video Chat" : "In-Person"}`);
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
        person: {
          ...(data.email ? { emails: [{ value: data.email }] } : {}),
          ...(data.phone ? { phones: [{ value: data.phone }] } : {}),
        },
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

    console.log(`[FUB] Lead pushed successfully: ${data.email || data.phone} (personId: ${personId})`);
    return true;
  } catch (error) {
    console.error("[FUB] Error pushing lead:", error);
    return false;
  }
}

// =============================================================================
// pushEventToFub — Logs an event to a contact's FUB timeline
// Used for property views, favorites, saved searches, etc.
// FUB matches the person by email — creates them if they don't exist.
// =============================================================================

interface FubEventData {
  email: string;
  /** Event type: "PropertyViewed", "PropertyFavorited", "SearchSaved", etc. */
  type: string;
  /** Human-readable message shown in the FUB timeline */
  message: string;
  /** Optional property details to attach to the event */
  property?: {
    street?: string;
    city?: string;
    state?: string;
    mlsNumber?: string;
    price?: number;
    url?: string;
  };
}

export async function pushEventToFub(data: FubEventData): Promise<boolean> {
  if (!FUB_API_KEY) {
    console.warn("[FUB] No API key — skipping event push");
    return false;
  }

  try {
    const res = await fetch(`${FUB_BASE}/events`, {
      method: "POST",
      headers: {
        Authorization: fubAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "nowtb.com",
        type: data.type,
        message: data.message,
        person: { emails: [{ value: data.email }] },
        property: data.property || undefined,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[FUB] Event push failed (${res.status}):`, errText);
      return false;
    }

    console.log(`[FUB] Event pushed: ${data.type} for ${data.email}`);
    return true;
  } catch (error) {
    console.error("[FUB] Event push error:", error);
    return false;
  }
}

// =============================================================================
// pushNoteToFub — Adds a note to a contact in FUB (matched by email)
// Used for saved search criteria, detailed property notes, etc.
// Creates the person first if they don't exist, then attaches the note.
// =============================================================================

interface FubNoteData {
  email: string;
  subject: string;
  body: string;
}

export async function pushNoteToFub(data: FubNoteData): Promise<boolean> {
  if (!FUB_API_KEY) {
    console.warn("[FUB] No API key — skipping note push");
    return false;
  }

  try {
    // Step 1: Ensure the person exists (FUB dedupes by email)
    const personRes = await fetch(`${FUB_BASE}/people`, {
      method: "POST",
      headers: {
        Authorization: fubAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "nowtb.com",
        emails: [{ value: data.email }],
      }),
    });

    if (!personRes.ok) {
      console.error("[FUB] Failed to find/create person for note");
      return false;
    }

    const personData = await personRes.json();
    const personId = personData.id;

    // Step 2: Attach the note to the person
    const noteRes = await fetch(`${FUB_BASE}/notes`, {
      method: "POST",
      headers: {
        Authorization: fubAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personId,
        subject: data.subject,
        body: data.body,
      }),
    });

    if (!noteRes.ok) {
      console.error("[FUB] Failed to create note");
      return false;
    }

    console.log(`[FUB] Note added for ${data.email}: ${data.subject}`);
    return true;
  } catch (error) {
    console.error("[FUB] Note push error:", error);
    return false;
  }
}
