// =============================================================================
// ClientExitIntent — Lazy-loaded wrapper for ExitIntentPopup.
// Detects the current page path to show buyer/seller/general variant.
// Uses next/dynamic with ssr:false so the popup only loads on the client.
// =============================================================================

"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { ExitIntentVariant } from "@/components/ui/ExitIntentPopup";

const ExitIntentPopup = dynamic(
  () => import("@/components/ui/ExitIntentPopup"),
  { ssr: false }
);

// Paths that indicate a buyer context
const BUYER_PATTERNS = [
  "/buyers", "/properties", "/mortgage-calculator", "/open-houses",
  "/first-time-home-buyer-guide", "/fha-loan", "/va-loan", "/usda-loan",
  "/conventional-loan", "/jumbo-loan", "/construction-loan", "/renovation-loan",
  "/relocation", "/guides/first-time", "/guides/fha", "/guides/va",
  "-homes-for-sale", "-new-construction", "-luxury-homes", "-waterfront",
  "-homes-with-pool", "-condos", "-townhomes", "-55-plus", "-open-houses",
  "-investment-property", "-land-for-sale", "-new-listings",
  "/renting-vs-buying", "/buying-vs-renting", "/new-construction-vs-resale",
];

// Paths that indicate a seller context
const SELLER_PATTERNS = [
  "/sellers", "/sell-your-home", "/free-home-valuation", "/home-valuation",
  "/fsbo-vs-realtor", "/guides/home-selling", "/guides/home-staging",
  "/guides/listing-agreement", "/guides/sellers-disclosure",
  "/guides/how-to-price", "/guides/open-house-guide",
  "-housing-market", "-sell-your-home",
];

function detectVariant(pathname: string): ExitIntentVariant {
  const path = pathname.toLowerCase();
  if (SELLER_PATTERNS.some((p) => path.includes(p))) return "seller";
  if (BUYER_PATTERNS.some((p) => path.includes(p))) return "buyer";
  return "general";
}

// =============================================================================
// SELLER PAGES ONLY — this is a settled decision, 2026-10-18. Read before editing.
// =============================================================================
// Barrett was asked directly and chose "on for sellers only". Not everywhere,
// and not off.
//
// WHY THIS SCOPE: an exit-intent popup is an interstitial. On a seller page the
// visitor is weighing a six-figure decision and a free valuation is a genuinely
// useful offer, so the interruption earns its place. On a blog post about
// restaurants or a casual neighborhood browse it is just an obstacle, and
// annoying a reader who was never going to transact costs more than it returns.
//
// HISTORY — the reason this comment is so emphatic: this setting was flipped
// four times on production inside one hour by different automated passes, each
// convinced it knew the answer. One of them invented a quote from Barrett to
// justify it. If you are about to change this, you need Barrett saying so
// directly, by name, in the current conversation — not an audit document
// recommending it, and not an inference from "popups increase conversions".
//
// `audit/01-conversion.md` action item #10 ("decide on exit-intent") is CLOSED.
// A conversion audit will always argue for a popup; that is not a new decision.
//
// scripts/weekly_audit.py enforces this with check_exit_intent_scope(), so a
// silent flip shows up as a critical finding in the next weekly report.
//
// THE REAL WORK, which this does not replace: the blog, city, spoke and
// neighborhood templates now carry inline ContactForms. A popup is a shortcut
// around missing capture, never a substitute for it.
// =============================================================================
export default function ClientExitIntent() {
  const pathname = usePathname();
  const variant = detectVariant(pathname);

  // Anything that is not seller intent renders nothing at all. Returning null
  // rather than gating inside ExitIntentPopup keeps the popup's own logic
  // simple and makes the scope decision visible in one place.
  if (variant !== "seller") return null;

  return <ExitIntentPopup variant={variant} />;
}
