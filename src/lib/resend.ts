// =============================================================================
// Resend email client — alert emails to Barrett when a lead comes in
// NEVER import this in client components — uses server-only API key
//
// If RESEND_API_KEY is not set, all functions are no-ops (won't crash the form)
// =============================================================================

import { Resend } from "resend";

// Lazily init Resend so a missing key doesn't crash the import
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// Shape of data passed to alert + auto-responder
interface LeadEmailData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  /** Form type (contact, showing, valuation, etc.) */
  type?: string;
  /** Property the lead was looking at (showing requests) */
  propertyAddress?: string;
  /** Extra question/answer pairs (seller intake). Rendered as a table in the
   *  alert — without this the answers only ever reach n8n. */
  details?: { label: string; value: string }[];
}

/**
 * Send a new-lead alert to barretthenry@gmail.com.
 * No-op if RESEND_API_KEY is not configured.
 */
export async function sendBarrettAlert(lead: LeadEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    // Resend not configured — n8n handles email alerts instead
    return;
  }

  const formTypeLabel = lead.type ? lead.type.replace(/-/g, " ") : "contact form";

  try {
    await resend.emails.send({
      from: "nowtb.com Leads <leads@nowtb.com>",
      to: ["barretthenry@gmail.com"],
      subject: `New lead from nowtb.com: ${lead.name} (${formTypeLabel})`,
      html: `
        <h2>New Lead — nowtb.com</h2>
        <p><strong>Form:</strong> ${formTypeLabel}</p>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone || "Not provided"}</p>
        ${lead.propertyAddress ? `<p><strong>Property:</strong> ${lead.propertyAddress}</p>` : ""}
        ${lead.message ? `<p><strong>Message:</strong><br>${lead.message}</p>` : ""}
        ${
          lead.details?.length
            ? `<h3 style="margin-bottom:6px;">Seller Intake</h3>
        <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;font-size:14px;">
          ${lead.details
            .filter((d) => d.value)
            .map(
              (d) =>
                `<tr><td style="border-bottom:1px solid #eee;color:#666;">${d.label}</td><td style="border-bottom:1px solid #eee;"><strong>${d.value}</strong></td></tr>`
            )
            .join("")}
        </table>`
            : ""
        }
        <hr>
        <p><a href="https://app.followupboss.com">Open in Follow Up Boss →</a></p>
        <p style="color:#666;font-size:12px;">Submitted via nowtb.com</p>
      `,
    });
  } catch (err) {
    // Log but never block — FUB already has the lead
    console.warn("[Resend] Alert email failed:", err);
  }
}

/**
 * Send an auto-responder to the lead confirming we received their message.
 * No-op if RESEND_API_KEY is not configured.
 */
export async function sendLeadAutoResponder(lead: LeadEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const firstName = lead.name.split(" ")[0];

  try {
    await resend.emails.send({
      from: "Barrett Henry <barrett@nowtb.com>",
      to: [lead.email],
      subject: `${firstName}, I got your message — here's what's next`,
      html: `
        <h2>Thanks for reaching out, ${firstName}.</h2>
        <p>I received your message and I'll get back to you within 2 hours.</p>
        <p><strong>What happens next:</strong></p>
        <ol>
          <li>I'll review your request (usually done before you finish reading this)</li>
          <li>I'll reach out within 2 hours by phone or text</li>
          <li>We'll find exactly what you're looking for in Tampa Bay</li>
        </ol>
        <p>Need a faster answer? Call me directly:</p>
        <p><a href="tel:+18137337907"><strong>(813) 733-7907</strong></a></p>
        <hr>
        <p>Talk soon,<br>
        <strong>Barrett Henry, REALTOR®</strong><br>
        REMAX Collective<br>
        FL License #BK3313308 | e-PRO | MRP | SRS<br>
        <a href="https://nowtb.com">nowtb.com</a>
        </p>
      `,
    });
  } catch (err) {
    // Log but never block — not critical
    console.warn("[Resend] Auto-responder email failed:", err);
  }
}

/**
 * Emergency alert: a lead came in but did NOT make it into Follow Up Boss.
 *
 * This exists because of a real incident. The Follow Up Boss API key in
 * production was invalid, pushLeadToFub failed on every submission, the route
 * caught the error and returned {"success":true} anyway — so visitors saw a
 * thank-you page and the leads went nowhere. Nobody noticed for months.
 *
 * Now a failed push emails the full lead immediately. Even with every
 * downstream system broken, the lead itself still reaches Barrett's inbox and
 * can be re-entered by hand. Failure becomes loud instead of silent.
 */
export async function sendLeadFailureAlert(
  lead: LeadEmailData,
  reason: string
): Promise<void> {
  const resend = getResend();
  if (!resend) return; // Nothing more we can do — already logged by the caller

  try {
    await resend.emails.send({
      from: "nowtb.com Alerts <leads@nowtb.com>",
      to: ["barretthenry@gmail.com"],
      subject: `⚠️ LEAD NOT SAVED TO FUB — ${lead.name} — action needed`,
      html: `
        <h2 style="color:#b91c1c;">A lead did not reach Follow Up Boss</h2>
        <p>The website captured this lead, but writing it to Follow Up Boss failed.
           <strong>Add it manually so it isn't lost.</strong></p>
        <table cellpadding="6" style="border-collapse:collapse;">
          <tr><td><strong>Name</strong></td><td>${lead.name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${lead.email || "Not provided"}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${lead.phone || "Not provided"}</td></tr>
          <tr><td><strong>Form</strong></td><td>${lead.type || "contact"}</td></tr>
          ${lead.propertyAddress ? `<tr><td><strong>Property</strong></td><td>${lead.propertyAddress}</td></tr>` : ""}
        </table>
        ${lead.message ? `<p><strong>Message:</strong><br>${lead.message}</p>` : ""}
        <hr>
        <p style="color:#b91c1c;"><strong>Failure reason:</strong> ${reason}</p>
        <p style="color:#666;font-size:12px;">
          Usually a bad or expired FUB_API_KEY in Vercel. Check the key, then send a
          test lead to confirm the pipe is working again.
        </p>
      `,
    });
  } catch (err) {
    // Last resort — if even the alert can't send, make sure it's in the logs
    console.error("[Resend] FAILED TO SEND LEAD-FAILURE ALERT:", err, lead);
  }
}

/**
 * Schedule the "how was it?" email to an open house guest.
 *
 * Sent a short while AFTER they sign in, so it lands while the house is still
 * fresh in their mind but they are no longer standing in the doorway. Resend
 * queues it server-side via `scheduledAt` — verified against the live API,
 * which reports the message as status "scheduled" until it fires. That means
 * no cron job, no queue, and no function kept alive waiting.
 *
 * Only ever called when the guest actually gave us an email address.
 *
 * NOTE on timing: the delay is measured from SIGN-IN, which happens on the way
 * in. Too short and the email arrives while they are still walking the house.
 * FEEDBACK_DELAY_MINUTES is the single place to change it.
 */
export async function scheduleFeedbackRequest(opts: {
  name: string;
  email: string;
  propertyAddress: string;
  feedbackUrl: string;
  delayMinutes: number;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const firstName = opts.name.split(" ")[0] || "there";
  const when = new Date(Date.now() + opts.delayMinutes * 60 * 1000).toISOString();

  try {
    await resend.emails.send({
      from: "Barrett Henry <barrett@nowtb.com>",
      to: [opts.email],
      subject: `${firstName}, what did you think of ${opts.propertyAddress}?`,
      scheduledAt: when,
      html: `
        <h2>Thanks for stopping by, ${firstName}.</h2>
        <p>It was good meeting you at <strong>${opts.propertyAddress}</strong> today.</p>
        <p>Would you take about 30 seconds and tell me what you thought? I pass
        every note straight to the seller, and honest answers help them more
        than polite ones.</p>
        <p style="margin:28px 0;">
          <a href="${opts.feedbackUrl}"
             style="background:#101a2e;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">
            Share your feedback
          </a>
        </p>
        <p>And if it is not the one, tell me what was missing — that is usually
        the fastest way for me to find the house that is.</p>
        <hr>
        <p>Talk soon,<br>
        <strong>Barrett Henry, REALTOR®</strong><br>
        REMAX Collective<br>
        <a href="tel:+18137337907">(813) 733-7907</a><br>
        <a href="https://nowtb.com">nowtb.com</a>
        </p>
      `,
    });
  } catch (err) {
    // Log but never block — the guest is already signed in and in FUB.
    console.warn("[Resend] Feedback request scheduling failed:", err);
  }
}
