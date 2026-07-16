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
