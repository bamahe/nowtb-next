// =============================================================================
// RecentlyViewedTracker — Invisible client component
// Saves the current listing to localStorage "nowtb_recently_viewed" array
// Max 20 items, newest first, deduped by listing_key
// Drop this on the listing detail page to auto-track views
// =============================================================================

"use client";

import { useEffect } from "react";

// -- Shape of each entry stored in localStorage --
interface RecentlyViewedEntry {
  listing_key: string;
  address: string;
  city: string;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  photo: string;
  viewed_at: string; // ISO timestamp
}

// -- Props: listing data passed from the detail page --
interface RecentlyViewedTrackerProps {
  listingKey: string;
  address: string;
  city: string;
  price: number;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  photo?: string;
}

const STORAGE_KEY = "nowtb_recently_viewed";
const MAX_ITEMS = 20;

export default function RecentlyViewedTracker({
  listingKey,
  address,
  city,
  price,
  beds = null,
  baths = null,
  sqft = null,
  photo = "",
}: RecentlyViewedTrackerProps) {
  useEffect(() => {
    // Build the new entry
    const entry: RecentlyViewedEntry = {
      listing_key: listingKey,
      address,
      city,
      price,
      beds: beds ?? null,
      baths: baths ?? null,
      sqft: sqft ?? null,
      photo: photo || "",
      viewed_at: new Date().toISOString(),
    };

    try {
      // Read existing entries
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: RecentlyViewedEntry[] = raw ? JSON.parse(raw) : [];

      // Remove any existing entry with the same listing_key (dedup)
      const filtered = existing.filter((e) => e.listing_key !== listingKey);

      // Add new entry at the front (newest first)
      const updated = [entry, ...filtered].slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage unavailable or full — silently ignore
    }
  }, [listingKey, address, city, price, beds, baths, sqft, photo]);

  // Renders nothing — purely a side-effect component
  return null;
}
