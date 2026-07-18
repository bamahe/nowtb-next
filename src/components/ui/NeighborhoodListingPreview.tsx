// =============================================================================
// NeighborhoodListingPreview — Client component used inside NeighborhoodGuidePage
//
// Fetches up to 4 active listings filtered by subdivision name and renders them
// in a compact 4-column grid (2 columns on mobile). Each preview is preceded by
// a loading skeleton and handles the "no listings" empty state gracefully.
//
// Props:
//   zipCodes        — ZIP codes for the parent city (narrows the search)
//   subdivisionName — Subdivision/neighborhood name sent to the listings API
//   neighborhoodSlug — Used to build the "View all" link href
//   neighborhoodName — Used in the "View all" link label and empty-state copy
// =============================================================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ListingCard from "@/components/ui/ListingCard";
import type { Listing } from "@/lib/types";

interface NeighborhoodListingPreviewProps {
  /** Parent city ZIP codes — narrows the API search to the right area */
  zipCodes: string[];
  /** Subdivision name as stored in MLS (e.g. "Bloomingdale") */
  subdivisionName: string;
  /** URL slug for the neighborhood page (e.g. "bloomingdale") */
  neighborhoodSlug: string;
  /** Display name for labels and links */
  neighborhoodName: string;
}

export default function NeighborhoodListingPreview({
  zipCodes,
  subdivisionName,
  neighborhoodSlug,
  neighborhoodName,
}: NeighborhoodListingPreviewProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Build query params — same pattern as ClientListings
    const params = new URLSearchParams();
    if (zipCodes.length > 0) {
      params.set("zip_codes", zipCodes.join(","));
    }
    // Subdivision filter narrows results to this specific neighborhood
    params.set("subdivision", subdivisionName);
    // Only 4 cards in this preview — full listings are on the neighborhood page
    params.set("limit", "4");
    // Strip rentals from neighborhood guides
    params.set("exclude_rental", "true");

    fetch(`/api/listings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.value || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [zipCodes, subdivisionName]); // re-fetch if parent changes

  // -----------------------------------------------------------------------
  // Loading state — skeleton cards matching the listing card dimensions
  // -----------------------------------------------------------------------
  if (loading) {
    return (
      <div className="mt-4">
        {/* 4-column skeleton grid (2 on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-gray-100 h-56"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Error state — soft failure, doesn't break the page
  // -----------------------------------------------------------------------
  if (error) {
    return (
      <div className="mt-4 mb-2">
        <p className="font-body text-sm text-muted/70 italic">
          Listings temporarily unavailable — call{" "}
          <a href="tel:+18137337907" className="text-link hover:underline">
            (813) 733-7907
          </a>{" "}
          for current availability.
        </p>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Empty state — no active listings right now
  // -----------------------------------------------------------------------
  if (listings.length === 0) {
    return (
      <div className="mt-4 mb-2 flex items-center gap-3">
        {/* Subtle pill — keeps the layout tight, doesn't feel broken */}
        <span className="inline-block rounded-full bg-gray-100 px-4 py-1.5 text-xs font-body text-muted">
          No active listings right now
        </span>
        {/* Still link to the neighborhood page in case the API missed something */}
        <Link
          href={`/${neighborhoodSlug}/`}
          className="text-xs font-semibold text-link hover:underline"
        >
          Search {neighborhoodName} &rarr;
        </Link>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Listings found — render 4-card grid + "View all" link
  // -----------------------------------------------------------------------
  return (
    <div className="mt-4">
      {/* Mini listing grid — 2 columns on mobile, 4 on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {listings.map((listing) => (
          <ListingCard key={listing.ListingKey} listing={listing} />
        ))}
      </div>

      {/* "View all" link — points to the full neighborhood spoke page */}
      <Link
        href={`/${neighborhoodSlug}/`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline"
      >
        View all homes in {neighborhoodName} &rarr;
      </Link>
    </div>
  );
}
