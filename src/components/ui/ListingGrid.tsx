// =============================================================================
// ListingGrid — Responsive grid that renders a list of ListingCard components
// Server component (no "use client" directive)
// Enhanced: larger section titles with accent divider, wider grid gaps
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
  /** Optional className override for the outer wrapper (e.g. remove padding when nested) */
  className?: string;
}

export default function ListingGrid({
  listings,
  title,
  subtitle,
  className,
}: ListingGridProps) {
  // Don't render anything if there are no listings
  if (!listings || listings.length === 0) return null;

  return (
    <section className={className ?? "container-wide py-16 md:py-20"}>
      {/* --- Section Heading with accent bar divider --- */}
      {title && (
        <div className="text-center">
          <h2 className="heading-section text-3xl md:text-4xl text-primary">
            {title}
          </h2>
          <div className="section-divider" />
          {subtitle && (
            <p className="font-body text-muted text-lg max-w-2xl mx-auto mb-10">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* --- Responsive Grid ---
           1 col on mobile, 2 on sm, 3 on lg, 4 on xl
           Wider gaps for breathing room */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.ListingKey} listing={listing} />
        ))}
      </div>
    </section>
  );
}
