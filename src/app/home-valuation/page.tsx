// =============================================================================
// /home-valuation — Redirects to /free-home-valuation (canonical page)
// =============================================================================

import { redirect } from "next/navigation";

export default function HomeValuationRedirect() {
  redirect("/free-home-valuation");
}
