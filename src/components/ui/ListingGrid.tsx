// =============================================================================
// ListingGrid — Responsive grid that renders a list of ListingCard components
// Server component (no "use client" directive)
// =============================================================================

import type { Listing } from "@/lib/types";
import ListingCard from "@/components/ui/ListingCard";

interface ListingGridProps {
  /** Array of listing objects to display */
  listings: Listing[];
  /** Optional section heading above the grid */
  title?: string;
  /** Optional subtitle / description below the heading */
  subtitle?: string;
}

export default function ListingGrid({
  listings,
  title,
  subtitle,
}: ListingGridProps) {
  // Don't render anything if there are no listings
  if (!listings || listings.length === 0) return null;

  return (
    <section className="container-wide py-12">
      {/* --- Section Heading (optional) --- */}
      {title && (
        <div className="mb-8 text-center">
          <h2 className="heading-section text-display-sm text-primary">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 font-body text-muted text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* --- Responsive Grid ---
           1 col on mobile, 2 on sm, 3 on lg, 4 on xl */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.ListingKey} listing={listing} />
        ))}
      </div>
    </section>
  );
}
