import { NextRequest, NextResponse } from "next/server";
import { pushLeadToFub } from "@/lib/fub";
import { sendBarrettAlert, sendLeadAutoResponder, sendLeadFailureAlert } from "@/lib/resend";
import { validateLead } from "@/lib/lead-validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const N8N_BASE = process.env.N8N_WEBHOOK_BASE || "";

// Max form submissions allowed from one IP address per 10 minutes.
// Set generously — a real person comparing a few listings might legitimately
// send 2-3 showing requests in a sitting. Bots send dozens.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// Map form type → FUB source label (shows up in FUB's "Source" column)
const fubSourceMap: Record<string, string> = {
  contact: "nowtb.com — Contact Form",
  showing: "nowtb.com — Showing Request",
  "open-house": "nowtb.com — Open House Sign In",
  valuation: "nowtb.com — Home Valuation",
  "seller-intake": "nowtb.com — Seller Intake",
  newsletter: "nowtb.com — Newsletter",
  "buyer-reg": "nowtb.com — Buyer Registration",
};

// Map form type → FUB tags (for smart lists and automations)
const fubTagMap: Record<string, string[]> = {
  contact: ["Website Lead", "Contact Form"],
  showing: ["Website Lead", "Showing Request", "Buyer"],
  "open-house": ["Website Lead", "Open House", "Buyer"],
  valuation: ["Website Lead", "Home Valuation", "Seller"],
  "seller-intake": ["Website Lead", "Seller Intake", "Seller"],
  newsletter: ["Website Lead", "Newsletter"],
  "buyer-reg": ["Website Lead", "Buyer Registration", "Buyer"],
};

/**
 * POST /api/contact — Handles all form submissions from the site.
 * 1. Verifies Cloudflare Turnstile (spam protection)
 * 2. Pushes the lead to Follow Up Boss with property details + tags
 * 3. Forwards to n8n webhook for automations (email alerts, drip campaigns)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, turnstileToken, honeypot, ...formData } = body;

    // --- Rate limit by IP ---
    // First gate, before any work. Stops floods regardless of how clever the
    // bot is about the other checks.
    const ip = getClientIp(request);
    const limit = rateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (!limit.ok) {
      console.warn(`[SPAM] Rate limit hit for IP ${ip} on "${type}" form`);
      return NextResponse.json(
        { error: "Too many submissions. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    // --- Turnstile spam verification (Cloudflare) ---
    // This BLOCKS on failure. It used to only log a warning and let the
    // submission through, which meant every bot passed and we were pushing
    // junk leads into Follow Up Boss and emailing fake addresses.
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      // A missing token means the request didn't come from our form at all —
      // a bot POSTing straight to this endpoint. Reject it.
      if (!turnstileToken) {
        console.warn(`[SPAM] Missing Turnstile token from IP ${ip} on "${type}" form`);
        return NextResponse.json(
          { error: "Spam verification required. Please reload the page and try again." },
          { status: 403 }
        );
      }

      // These sentinel values are emitted by TurnstileWidget when the challenge
      // could not run (script blocked, render failed). A real browser with an
      // ad-blocker can hit this, so we let it through rather than lose the lead —
      // the validation checks below are the safety net for these.
      const widgetFallback =
        turnstileToken === "no-turnstile-key-configured" ||
        turnstileToken === "turnstile-script-failed" ||
        turnstileToken === "turnstile-render-failed";

      if (!widgetFallback) {
        try {
          const verifyRes = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                secret: turnstileSecret,
                response: turnstileToken,
                remoteip: ip,
              }),
            }
          );
          const verification = await verifyRes.json();

          if (!verification.success) {
            console.warn(
              `[SPAM] Turnstile REJECTED submission from IP ${ip}:`,
              verification["error-codes"]
            );
            return NextResponse.json(
              { error: "Spam verification failed. Please reload the page and try again." },
              { status: 403 }
            );
          }
        } catch (err) {
          // Cloudflare itself is unreachable. Don't punish real users for an
          // outage on their end — allow through and lean on validation below.
          console.warn("Turnstile verification error (allowing, validation still applies):", err);
        }
      }
    }

    // --- Content validation ---
    // Catches the junk that gets past Turnstile: fake emails, impossible phone
    // numbers, gibberish names, and the hidden honeypot field.
    const verdict = validateLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      honeypot,
    });

    if (verdict.reject) {
      console.warn(
        `[SPAM] Rejected "${type}" submission from IP ${ip} —`,
        verdict.reasons.join("; "),
        { name: formData.name, email: formData.email, phone: formData.phone }
      );
      // Return 200 with success:true on purpose. If we told the bot it was
      // blocked, whoever runs it would tune it until it got through. Letting it
      // think it worked means it keeps sending junk we silently discard.
      return NextResponse.json({ success: true });
    }

    if (verdict.suspect) {
      // Not confident enough to throw the lead away — Barrett still gets it in
      // Follow Up Boss — but we will NOT email this address. That is what
      // protects our sending reputation from bounces.
      console.warn(
        `[SUSPECT] Accepting "${type}" lead but skipping auto-responder —`,
        verdict.reasons.join("; ")
      );
    }

    // Validate form type
    const webhookMap: Record<string, string> = {
      contact: `${N8N_BASE}/nowtb-contact`,
      showing: `${N8N_BASE}/nowtb-showing`,
      "open-house": `${N8N_BASE}/nowtb-open-house`,
      valuation: `${N8N_BASE}/nowtb-valuation`,
      "seller-intake": `${N8N_BASE}/nowtb-seller-intake`,
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

    // --- Push lead to Follow Up Boss ---
    // FUB dedupes by email, so repeat submissions update the existing contact
    // Property details are attached as a note so Barrett sees what they want.
    // Push whenever we have any way to reach them — open-house walk-ins often
    // give a name + phone but no email, and those must still land in FUB.
    if (formData.email || formData.phone) {
      try {
        const fubOk = await pushLeadToFub({
          name: formData.name || "Unknown",
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          source: fubSourceMap[type] || "nowtb.com",
          sourceId: formData.source,
          tags: fubTagMap[type] || ["Website Lead"],
          property: formData.property || undefined,
          details: formData.details || undefined,
        });
        // pushLeadToFub RETURNS false on an API rejection rather than throwing,
        // so the catch below never fires for the most common failure — a bad or
        // expired API key. That is exactly how an invalid FUB_API_KEY silently
        // dropped every website lead for months. Check the return value.
        if (!fubOk) {
          console.error("[LEAD AT RISK] FUB push returned false —", formData.email || formData.phone);
          await sendLeadFailureAlert(
            {
              name: formData.name || "Unknown",
              email: formData.email || "",
              phone: formData.phone,
              message: formData.message,
              type,
              propertyAddress: formData.property?.address,
            },
            "Follow Up Boss rejected the request (most often an invalid or expired FUB_API_KEY)."
          );
        }
      } catch (fubError) {
        console.error("[LEAD AT RISK] FUB push threw —", fubError);
        await sendLeadFailureAlert(
          {
            name: formData.name || "Unknown",
            email: formData.email || "",
            phone: formData.phone,
            message: formData.message,
            type,
            propertyAddress: formData.property?.address,
          },
          `Follow Up Boss request threw: ${fubError instanceof Error ? fubError.message : String(fubError)}`
        );
      }
    }

    // --- Send Resend alert email to Barrett + auto-responder to lead ---
    // Both are no-ops if RESEND_API_KEY is not configured — won't block the form
    if (formData.email || formData.phone) {
      // Always alert Barrett so he sees the walk-in; only auto-respond when we
      // actually have an email address to reply to.
      const emailTasks: Promise<void>[] = [
        sendBarrettAlert({
          name: formData.name || "Unknown",
          email: formData.email || "",
          phone: formData.phone,
          message: formData.message,
          type,
          propertyAddress: formData.property?.address,
          details: formData.details || undefined,
        }),
      ];
      // Only auto-respond when we have an email AND it passed validation.
      // Emailing a suspect address is how bounces pile up and get our sending
      // privileges restricted — Barrett still gets the lead either way.
      if (formData.email && !verdict.suspect) {
        emailTasks.push(
          sendLeadAutoResponder({
            name: formData.name || "Unknown",
            email: formData.email,
          })
        );
      }
      // Fire in parallel — neither blocks the response if they fail
      Promise.all(emailTasks).catch((err) => console.warn("[Resend] Email batch failed:", err));
    }

    // --- Forward to n8n for additional automations ---
    // n8n handles: email/SMS notifications, drip sequences, etc.
    // This is fire-and-forget — don't block the response if n8n is slow
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          submitted_at: new Date().toISOString(),
          source_url: request.headers.get("referer") || "unknown",
        }),
      });
    } catch (n8nError) {
      // Log but don't fail — FUB already has the lead, n8n is a bonus
      console.warn("n8n webhook failed (non-critical):", n8nError);
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
