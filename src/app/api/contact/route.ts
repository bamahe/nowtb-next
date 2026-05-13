import { NextRequest, NextResponse } from "next/server";

const N8N_BASE = process.env.N8N_WEBHOOK_BASE!;

/**
 * POST /api/contact — Proxy form submissions to n8n webhooks.
 * Body: { type: "contact"|"showing"|"valuation"|"newsletter"|"buyer-reg", ...formData }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...formData } = body;

    // Map form type to the correct n8n webhook
    const webhookMap: Record<string, string> = {
      contact: `${N8N_BASE}/nowtb-contact`,
      showing: `${N8N_BASE}/nowtb-showing`,
      valuation: `${N8N_BASE}/nowtb-valuation`,
      newsletter: `${N8N_BASE}/nowtb-newsletter`,
      "buyer-reg": `${N8N_BASE}/nowtb-buyer-reg`,
    };

    const webhookUrl = webhookMap[type];
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Invalid form type" },
        { status: 400 }
      );
    }

    // Forward to n8n
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        submitted_at: new Date().toISOString(),
        source_url: request.headers.get("referer") || "unknown",
      }),
    });

    if (!res.ok) {
      throw new Error(`n8n webhook returned ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
