// =============================================================================
// /11417-cypress-park-st/feedback — "On your way out" survey. Works on the
// door iPad or on the guest's own phone via the exit QR card. Kiosk behaviour:
// big touch targets, no site nav, clears itself after each guest.
// =============================================================================

import type { Metadata } from "next";
import FeedbackKiosk from "./FeedbackKiosk";

export const metadata: Metadata = {
  title: "Open House Feedback | 11417 Cypress Park St, Tampa FL",
  // Keep this out of search results — it is a kiosk page, not a landing page
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  return <FeedbackKiosk />;
}
