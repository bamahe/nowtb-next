// =============================================================================
// POST /api/webhooks/fub — Receives webhook events FROM Follow Up Boss
// FUB fires webhooks when things happen in the CRM:
//   - Lead status changes, tags added/removed, deals updated, etc.
// This endpoint logs all incoming events for now. Later we can build:
//   - Suppress saved search alerts when Barrett tags someone "Inactive"
//   - Show deal properties in the user's website dashboard
//   - Sync FUB stage changes to Supabase for dashboard updates
// =============================================================================

import { NextRequest, NextResponse } from "next/server";

// Secret key to verify webhook requests are really from FUB
// Set FUB_WEBHOOK_SECRET in .env.local — FUB sends this in the request headers
const WEBHOOK_SECRET = process.env.FUB_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    // --- Optional: Verify the webhook is really from FUB ---
    // FUB can send a secret token in the query string or headers.
    // If you've configured FUB_WEBHOOK_SECRET, we verify it here.
    if (WEBHOOK_SECRET) {
      const authHeader = request.headers.get("x-fub-webhook-secret") || "";
      const querySecret = new URL(request.url).searchParams.get("secret") || "";

      if (authHeader !== WEBHOOK_SECRET && querySecret !== WEBHOOK_SECRET) {
        console.warn("[FUB Webhook] Unauthorized request — bad secret");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // --- Parse the webhook payload ---
    const payload = await request.json();

    // Log the full payload for debugging and future development
    console.log("[FUB Webhook] Received event:", JSON.stringify({
      type: payload.type || payload.event || "unknown",
      personId: payload.personId || payload.person?.id,
      email: payload.person?.emails?.[0]?.value || "unknown",
      timestamp: new Date().toISOString(),
      // Don't log the full payload in production — just the key fields
    }));

    // --- Handle specific event types (expand as needed) ---
    const eventType = payload.type || payload.event || "";

    switch (eventType) {
      case "personTagAdded":
        // Example: when Barrett tags someone "Inactive" in FUB
        // Future: suppress their saved search email alerts in Supabase
        console.log(`[FUB Webhook] Tag added to person ${payload.personId}: ${payload.tag}`);
        break;

      case "personTagRemoved":
        // Example: when Barrett removes the "Inactive" tag
        // Future: re-enable their saved search alerts
        console.log(`[FUB Webhook] Tag removed from person ${payload.personId}: ${payload.tag}`);
        break;

      case "dealCreated":
      case "dealUpdated":
        // Example: when Barrett adds a property to someone's deals
        // Future: show the deal property in their website dashboard
        console.log(`[FUB Webhook] Deal event for person ${payload.personId}`);
        break;

      case "personStageChanged":
        // Example: lead moved from "New" to "Active Buyer"
        // Future: customize their website experience based on stage
        console.log(`[FUB Webhook] Stage changed for person ${payload.personId}: ${payload.stage}`);
        break;

      default:
        // Log unknown events so we can add handlers later
        console.log(`[FUB Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    // Always return 200 so FUB doesn't retry the webhook
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[FUB Webhook] Error processing webhook:", error);
    // Still return 200 to avoid FUB retrying a broken payload
    return NextResponse.json({ received: true, error: "Processing failed" });
  }
}
