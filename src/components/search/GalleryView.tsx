// src/components/search/GalleryView.tsx
// Responsive card grid (1 col mobile → 2 tablet → 3-4 desktop) with top + bottom pagination.
// Shows loading skeletons while fetching, and an empty state when no results.
"use client";

import type { Listing } from "@/lib/types";
import SearchListingCard from "./ListingCard";
import Pagination from "./Pagination";

interface GalleryViewProps {
  listings: Listing[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function GalleryView({
  listings, loading, total, currentPage, pageSize, onPageChange,
}: GalleryViewProps) {
  return (
    <div className="min-h-screen bg-light">
      {/* ── Top bar: result count + pagination ── */}
      <div className="px-4 py-3 border-b border-border bg-white flex items-center justify-between">
        <p className="font-body text-xs text-muted">
          {loading ? "Searching..." : `${total.toLocaleString()} Properties`}
        </p>
        {/* Top pagination — only renders if there's more than 1 page */}
        <Pagination
          currentPage={currentPage}
          totalResults={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </div>

      {/* ── Loading skeleton — 12 placeholder cards ── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 w-24 rounded" />
                <div className="h-3 bg-gray-200 w-full rounded" />
                <div className="h-3 bg-gray-200 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Card grid — rendered when listings are loaded ── */}
      {!loading && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {listings.map((listing) => (
            <SearchListingCard key={listing.ListingKey} listing={listing} />
          ))}
        </div>
      )}

      {/* ── Empty state — no results for current filters ── */}
      {!loading && listings.length === 0 && (
        <div className="p-12 text-center">
          <p className="font-heading text-xl text-primary mb-2">No Properties Found</p>
          <p className="font-body text-sm text-muted mb-4">
            Try adjusting your filters or expanding your search area.
          </p>
        </div>
      )}

      {/* ── Bottom pagination ── */}
      {!loading && listings.length > 0 && (
        <div className="bg-white border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalResults={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
