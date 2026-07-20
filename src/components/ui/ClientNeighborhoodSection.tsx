"use client";

// ClientNeighborhoodSection — Client-side listings for neighborhood pages.
// Fetches and displays active listings in the neighborhood area without
// blocking the server render or burning Bridge API rate limits at build time.

import { useState, useEffect } from "react";
import ListingCard from "@/components/ui/ListingCard";
import Link from "next/link";
import type { Listing } from "@/lib/types";

interface ClientNeighborhoodSectionProps {
  /** Display name of the neighborhood (e.g. "Bloomingdale") */
  name: string;
  /** Parent city slug (e.g. "brandon") */
  city: string;
  /** ZIP codes to search */
  zipCodes: string[];
  /** Short search name used for display (e.g. "Bloomingdale homes") */
  searchName: string;
  /** Max listings to display */
  limit?: number;
}

export default function ClientNeighborhoodSection({
  name,
  city,
  zipCodes,
  searchName,
  limit = 24,
}: ClientNeighborhoodSectionProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!zipCodes || zipCodes.length === 0) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams({
      zip_codes: zipCodes.join(","),
      limit: String(limit),
      exclude_rental: "true",
    });
    fetch(`/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setListings(data.value || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [zipCodes, limit]);

  if (loading) {
    return (
      <section className="container-wide py-10">
        <p className="text-gray-400 text-sm">Loading listings...</p>
      </section>
    );
  }

  if (listings.length === 0) return null;

  return (
    <section className="container-wide py-12 border-t border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Homes for Sale in {name}
        </h2>
        <p className="text-gray-600 mt-1">
          {listings.length} active listing{listings.length !== 1 ? "s" : ""} in the {name} area.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.slice(0, limit).map((listing) => (
          <ListingCard key={listing.ListingKey} listing={listing} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href={`/${city}-homes-for-sale/`}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          View all {name} homes &rarr;
        </Link>
      </div>
    </section>
  );
}
