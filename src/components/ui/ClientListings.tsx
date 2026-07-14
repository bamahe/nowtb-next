// =============================================================================
// ClientListings — Fetches and displays listings CLIENT-SIDE
// This prevents server-side API calls from burning through the Bridge rate limit.
// Pages render their static SEO content server-side, listings load after.
// =============================================================================

"use client";

import { useState, useEffect } from "react";
import ListingCard from "@/components/ui/ListingCard";
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
  /** Additional filter params */
  filters?: Record<string, string>;
  /** Area name for contextual CTA */
  areaName?: string;
}

export default function ClientListings({
  zipCodes,
  title,
  subtitle,
  limit = 24,
  filters = {},
  areaName,
}: ClientListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (zipCodes.length > 0) {
      params.set("zip_codes", zipCodes.join(","));
    }
    params.set("limit", String(limit));
    params.set("exclude_rental", "true");
    // Add any extra filters
    for (const [key, value] of Object.entries(filters)) {
      params.set(key, value);
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
  }, [zipCodes, limit, filters]);

  if (loading) {
    return (
      <section className="container-wide py-12">
        {title && (
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">{title}</h2>
            {subtitle && <p className="font-body text-muted mt-2">{subtitle}</p>}
          </div>
        )}
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
        <div className="text-center max-w-lg mx-auto">
          <p className="font-body text-muted text-base leading-relaxed">
            {error
              ? "Listings are temporarily unavailable. Please try again in a few minutes."
              : "No listings currently available."}{" "}
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
      <div className="grid grid-cols-1 gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing, index) => (
          <div key={listing.ListingKey}>
            <ListingCard listing={listing} />
            {/* Buyer CTA after 8th listing */}
            {index === 7 && listings.length >= 8 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-accent bg-accent/10 p-6 text-center">
                <p className="font-heading text-lg font-bold text-primary leading-snug">
                  {areaName ? `Looking for homes in ${areaName}?` : "Looking for the right home?"}
                </p>
                <a href="tel:+18137337907" className="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">
                  Call (813) 733-7907
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
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
