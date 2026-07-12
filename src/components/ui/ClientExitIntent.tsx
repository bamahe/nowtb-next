// =============================================================================
// ClientExitIntent — Lazy-loaded wrapper for ExitIntentPopup.
// Uses next/dynamic with ssr:false so the popup only loads on the client.
// This avoids hydration issues with sessionStorage and keeps the initial
// page payload small (popup JS only downloads when needed).
// =============================================================================

"use client";

import dynamic from "next/dynamic";

// Dynamically import ExitIntentPopup — no SSR, no loading spinner
// (the popup only appears on exit intent, so no visible loading delay)
const ExitIntentPopup = dynamic(
  () => import("@/components/ui/ExitIntentPopup"),
  { ssr: false }
);

export default function ClientExitIntent() {
  return <ExitIntentPopup />;
}
