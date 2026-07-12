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

export default function ClientExitIntent() {
  const pathname = usePathname();
  const variant = detectVariant(pathname);
  return <ExitIntentPopup variant={variant} />;
}
