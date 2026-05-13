// =============================================================================
// ListingGrid — Clean responsive grid of ListingCard components
// Server component (no "use client" directive)
// Minimal heading treatment, generous gaps, let the cards breathe
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
    <section className={className ?? "container-wide py-24 md:py-32"}>
      {/* --- Section Heading — clean, minimal --- */}
      {title && (
        <div className="text-center mb-16">
          <h2 className="heading-section text-3xl md:text-4xl text-primary">
            {title}
          </h2>
          <div className="section-divider" />
          {subtitle && (
            <p className="font-body text-muted text-base font-light max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* --- Responsive Grid — generous gaps for breathing room ---
           1 col on mobile, 2 on sm, 3 on lg, 4 on xl */}
      <div className="grid grid-cols-1 gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.ListingKey} listing={listing} />
        ))}
      </div>
    </section>
  );
}
