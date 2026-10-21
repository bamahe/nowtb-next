// =============================================================================
// analytics.ts, one tiny, crash-proof wrapper around Google Analytics 4 (GA4)
//
// WHY THIS FILE EXISTS:
// The site had Vercel Analytics (pageviews) but ZERO conversion tracking. So we
// could see that 10,000 people visited, but not that 14 of them tapped the
// phone number. Without that, every change we ship is a guess.
//
// WHAT "gtag" IS:
// Google's analytics script creates a single global function on the page called
// `gtag`. You call it like gtag("event", "some_name", { extra: "data" }) and
// Google records it. That function only exists if the GA script actually loaded.
//
// THE IMPORTANT RULE:
// GA4 only loads when the NEXT_PUBLIC_GA_ID environment variable is set in
// Vercel. It is NOT set today. So `window.gtag` will be undefined on every page
// and every call below must do nothing at all, no crash, no console error.
// That is why every function here checks before it calls.
//
// REMAINING MANUAL STEP FOR BARRETT:
// Nothing in this file reports anything until NEXT_PUBLIC_GA_ID is added in the
// Vercel dashboard (Project → Settings → Environment Variables) with your GA4
// Measurement ID, which looks like "G-ABC1234XYZ". Add it, redeploy, done.
//
// If it breaks, check:
//  1. Is NEXT_PUBLIC_GA_ID set in Vercel for the Production environment?
//  2. Does the value start with "G-"? A "UA-" id is old Universal Analytics and
// is deliberately rejected by isGaConfigured() below, it no longer works.
//  3. Did the value get saved with a trailing newline? Vercel env values ending
//     in a literal "\n" have silently broken keys on this project before. The
//     .trim() below defends against it.
// 4. In the browser console on the live site, type `window.gtag`, if it says
//     "undefined", the script never loaded and no events are being sent.
// =============================================================================

/**
 * The GA4 Measurement ID, read from the environment at BUILD time.
 *
 * Next.js replaces `process.env.NEXT_PUBLIC_*` with the literal string when it
 * builds, which is why this works in browser code. If the variable is missing
 * it becomes an empty string rather than throwing.
 */
export const GA_MEASUREMENT_ID = (process.env.NEXT_PUBLIC_GA_ID || "").trim();

/**
 * True only when we have something that actually looks like a GA4 ID.
 *
 * We validate the shape instead of just checking "is it non-empty" for two
 * reasons: a typo'd value would otherwise inject junk into the page, and the
 * ID is interpolated into a <script> tag in layout.tsx, so restricting it to
 * letters, numbers and dashes also means it can never carry anything
 * executable into that script.
 */
export function isGaConfigured(): boolean {
  return /^G-[A-Z0-9]{4,20}$/i.test(GA_MEASUREMENT_ID);
}

// Tell TypeScript that these two globals may exist on `window`. Without this,
// `window.gtag` is a compile error. `?` means "might not be there", which is
// the normal case on this site right now.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * The conversion event names, in one place so a typo can't split one metric
 * into two in the GA4 reports. These are the events that represent money:
 * someone tapping the phone number, and someone handing over their details.
 */
export const CONVERSION_EVENTS = {
  /** Visitor tapped a tel: link anywhere on the site. */
  phoneTap: "phone_call_tap",
  /** Visitor gave name/phone/email in the chat widget and it reached FUB. */
  chatLeadCaptured: "chat_lead_captured",
} as const;

/**
 * Send one event to GA4. Does nothing (silently, safely) if GA isn't loaded.
 *
 * Everything is wrapped in try/catch on purpose. A third-party script throwing
 * inside a React click handler has broken client-side navigation on this site
 * before, an analytics call must never be able to take a page down.
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  try {
    // Server-side render has no window at all.
    if (typeof window === "undefined") return;

    const gtag = window.gtag;
    // GA script not loaded (the normal case until NEXT_PUBLIC_GA_ID is set).
    if (typeof gtag !== "function") return;

    gtag("event", name, params ?? {});
  } catch (err) {
    // Never rethrow. Only whisper about it while developing.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[analytics] trackEvent failed (ignored):", err);
    }
  }
}

/**
 * Convenience wrapper for a phone tap.
 *
 * @param location where on the site they tapped, "header-mobile",
 *   "mobile-bottom-bar", "chat-widget". Lets Barrett see WHICH call button
 *   earns its keep, which is the whole point of tracking it.
 */
export function trackPhoneTap(location: string): void {
  trackEvent(CONVERSION_EVENTS.phoneTap, {
    location,
    // A static label so the GA4 report groups all taps on the one number.
    phone_number: "813-733-7907",
  });
}

/**
 * Convenience wrapper for a captured chat lead.
 *
 * Deliberately records NO personal information, GA4's terms forbid sending
 * names, emails or phone numbers to Google, and the lead itself already went
 * to Follow Up Boss where it belongs. We only record that it happened.
 */
export function trackChatLeadCaptured(pagePath: string): void {
  trackEvent(CONVERSION_EVENTS.chatLeadCaptured, {
    location: "chat-widget",
    page_path: pagePath,
  });
}
