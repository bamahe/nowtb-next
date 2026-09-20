// =============================================================================
// /11417-cypress-park-st/sign-in — Open house sign-in sheet, built for an iPad
// on a stand at the front door. Kiosk behaviour: big touch targets, no site nav,
// and the form clears itself after each guest so the next person can sign in.
// =============================================================================

import type { Metadata } from "next";
import SignInKiosk from "./SignInKiosk";

export const metadata: Metadata = {
  title: "Open House Sign In | 11417 Cypress Park St, Tampa FL",
  // Keep this out of search results — it is a kiosk page, not a landing page
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <SignInKiosk />;
}
