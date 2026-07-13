// =============================================================================
// Quarterly Market Update Cron — /api/cron/market-update
// Triggered by Vercel Cron on the 1st of each quarter (Jan, Apr, Jul, Oct)
// Updates all generic market update pages with the latest quarter's data
// =============================================================================

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // This endpoint just confirms the cron is set up.
  // The actual data update runs via the Python script (scripts/update-market-quarters.py)
  // which needs to be run locally or via a GitHub Action since it modifies the JSON data files.
  //
  // To fully automate:
  // 1. Set up a GitHub Action that runs on the 1st of Jan/Apr/Jul/Oct
  // 2. The action runs: python3 scripts/update-market-quarters.py
  // 3. Then commits and pushes the changes
  //
  // Or use n8n to run the script on Barrett's server.

  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  const year = now.getFullYear();

  return NextResponse.json({
    status: "ok",
    currentQuarter: `Q${quarter} ${year}`,
    message: "Market update cron endpoint active. Run scripts/update-market-quarters.py to update data.",
    timestamp: now.toISOString(),
  });
}
