// =============================================================================
// ClientListings — Fetches and displays listings CLIENT-SIDE with filter bar
// This prevents server-side API calls from burning through the Bridge rate limit.
// Pages render their static SEO content server-side, listings load after.
// =============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import ListingCard from "@/components/ui/ListingCard";
import ListingFilters from "@/components/ui/ListingFilters";
import Link from "next/link";
import type { Listing } from "@/lib/types";

interface ClientListingsProps {
  /** ZIP codes to search */
  zipCodes: string[];
  /** Optional title above the grid */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Max listings to show */
  limit?: number;
  /** Additional filter params (from spoke topic) */
  filters?: Record<string, string>;
  /** Area name for contextual CTA */
  areaName?: string;
  /** Show filter bar (default true for hub/spoke, false for homepage) */
  showFilters?: boolean;
}

export default function ClientListings({
  zipCodes,
  title,
  subtitle,
  limit = 24,
  filters = {},
  areaName,
  showFilters = true,
}: ClientListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(filters);
  const [searchSaved, setSearchSaved] = useState(false);

  const fetchListings = useCallback((filterOverrides?: Record<string, string>) => {
    setLoading(true);
    setError(false);

    const currentFilters = filterOverrides || activeFilters;
    const params = new URLSearchParams();
    if (zipCodes.length > 0) {
      params.set("zip_codes", zipCodes.join(","));
    }
    params.set("limit", String(limit));
    // Don't exclude rentals if this is a rental page
    if (!currentFilters.rental) {
      params.set("exclude_rental", "true");
    }
    // Add spoke-level filters first, then user filters override
    for (const [key, value] of Object.entries({ ...filters, ...currentFilters })) {
      if (value) params.set(key, value);
    }

    fetch(`/api/listings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.value || []);
        setTotal(data.total || data.value?.length || 0);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [zipCodes, limit, filters, activeFilters]);

  // Initial fetch
  useEffect(() => {
    fetchListings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFilterChange(newFilters: Record<string, string>) {
    setActiveFilters(newFilters);
    fetchListings(newFilters);
  }

  async function handleSaveSearch() {
    // Save to localStorage for non-logged-in users
    const searchData = {
      zipCodes,
      filters: { ...filters, ...activeFilters },
      areaName: areaName || "Tampa Bay",
      savedAt: new Date().toISOString(),
    };

    // Save locally
    const saved = JSON.parse(localStorage.getItem("nowtb-saved-searches") || "[]");
    saved.push(searchData);
    localStorage.setItem("nowtb-saved-searches", JSON.stringify(saved));

    // If logged in, also push to FUB
    try {
      const filterDesc = Object.entries({ ...filters, ...activeFilters })
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");

      await fetch("/api/fub-event/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "SearchSaved",
          message: `Saved search: ${areaName || "Tampa Bay"} — ${filterDesc || "all listings"}`,
          property: { city: areaName, state: "FL" },
        }),
      });
    } catch {
      // Non-critical — search is saved locally regardless
    }

    setSearchSaved(true);
    setTimeout(() => setSearchSaved(false), 3000);
  }

  if (loading) {
    return (
      <section className="container-wide py-12">
        {title && (
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">{title}</h2>
            {subtitle && <p className="font-body text-muted mt-2">{subtitle}</p>}
          </div>
        )}
        {showFilters && <ListingFilters onFilterChange={handleFilterChange} initialFilters={activeFilters} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-100 h-72" />
          ))}
        </div>
      </section>
    );
  }

  if (error || listings.length === 0) {
    return (
      <section className="container-wide py-12">
        {title && (
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">{title}</h2>
          </div>
        )}
        {showFilters && <ListingFilters onFilterChange={handleFilterChange} initialFilters={activeFilters} />}
        <div className="text-center max-w-lg mx-auto">
          <p className="font-body text-muted text-base leading-relaxed">
            {error
              ? "Listings are temporarily unavailable. Please try again in a few minutes."
              : "No listings match your criteria. Try adjusting your filters."}{" "}
            Call Barrett at{" "}
            <a href="tel:+18137337907" className="text-link font-semibold hover:underline">
              (813) 733-7907
            </a>{" "}
            for the latest.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-wide py-12">
      {title && (
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">{title}</h2>
          <div className="section-divider" />
          {subtitle && <p className="font-body text-muted font-light max-w-xl mx-auto">{subtitle}</p>}
        </div>
      )}

      {/* Filter bar + save search */}
      {showFilters && (
        <>
          <ListingFilters onFilterChange={handleFilterChange} initialFilters={activeFilters} />
          <div className="flex items-center justify-between mb-6">
            <p className="font-body text-sm text-primary font-semibold">
              <span className="text-link">{total.toLocaleString()}</span> homes found
            </p>
            <button
              onClick={handleSaveSearch}
              className={`text-sm font-body font-semibold px-4 py-2 rounded-lg transition-colors ${
                searchSaved
                  ? "bg-green-100 text-green-700"
                  : "border border-gray-300 text-primary hover:bg-gray-50"
              }`}
            >
              {searchSaved ? "✓ Search Saved" : "Save This Search"}
            </button>
          </div>
        </>
      )}

      {/* First 8 listings */}
      <div className="grid grid-cols-1 gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.slice(0, 8).map((listing) => (
          <ListingCard key={listing.ListingKey} listing={listing} />
        ))}
      </div>

      {/* Buyer CTA between listing rows */}
      {listings.length >= 8 && (
        <div className="my-10 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-primary p-8">
          <div>
            <p className="font-heading text-xl font-bold text-white leading-snug">
              {areaName ? `Looking for homes in ${areaName}?` : "Looking for the right home?"}
            </p>
            <p className="font-body text-white/70 text-sm mt-1">Barrett Henry — 23+ years of experience across Tampa Bay.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:+18137337907" className="inline-block rounded-lg bg-white text-primary px-6 py-3 text-sm font-semibold">
              Call (813) 733-7907
            </a>
            <Link href="/contact/" className="inline-block rounded-lg border-2 border-white/40 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              Send a Message
            </Link>
          </div>
        </div>
      )}

      {/* Remaining listings */}
      {listings.length > 8 && (
        <div className="grid grid-cols-1 gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.slice(8).map((listing) => (
            <ListingCard key={listing.ListingKey} listing={listing} />
          ))}
        </div>
      )}
      {total > listings.length && (
        <div className="text-center mt-8">
          <Link
            href={`/properties/search/?zip_codes=${zipCodes.join(",")}`}
            className="btn-primary inline-block px-10 py-4"
          >
            View All {total.toLocaleString()} Listings
          </Link>
        </div>
      )}
    </section>
  );
}
