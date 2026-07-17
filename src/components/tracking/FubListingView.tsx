// =============================================================================
// FubListingView — Invisible tracker that pushes "PropertyViewed" events to FUB
// Only fires for logged-in Supabase users.
// Debounced: only pushes ONCE per listing per browser session to avoid spam.
// Drop this on listing detail pages alongside RecentlyViewedTracker.
// =============================================================================

"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface FubListingViewProps {
  listingKey: string;
  address: string;
  city: string;
  price: number;
  mlsNumber?: string;
  state?: string;
}

// Session-level dedup set — tracks which listings we already pushed this session.
// Uses a module-level Set so it persists across re-renders but resets on page refresh.
const pushedThisSession = new Set<string>();

export default function FubListingView({
  listingKey,
  address,
  city,
  price,
  mlsNumber = "",
  state = "FL",
}: FubListingViewProps) {
  useEffect(() => {
    // Already pushed this listing in this browser session — skip
    if (pushedThisSession.has(listingKey)) return;

    const supabase = createClient();
    if (!supabase) return;

    (async () => {
      // Only push for logged-in users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return;

      // Mark as pushed BEFORE the fetch to prevent race-condition duplicates
      pushedThisSession.add(listingKey);

      // Fire-and-forget push to FUB via our API route
      fetch("/api/fub-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          event: "PropertyViewed",
          property: {
            address,
            city,
            state,
            price,
            mlsNumber,
            url: window.location.href,
          },
        }),
      }).catch(() => {
        // FUB push failed — remove from dedup set so it can retry next navigation
        pushedThisSession.delete(listingKey);
      });
    })();
  }, [listingKey, address, city, price, mlsNumber, state]);

  // Renders nothing — purely a side-effect component
  return null;
}
