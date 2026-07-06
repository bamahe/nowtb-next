// =============================================================================
// SimilarListings — Shows 4 listings in the same ZIP with a similar price
// Server component — fetches from Bridge API at render time (ISR cached)
// =============================================================================

import { getListings } from "@/lib/bridge";
import { getListingUrl } from "@/lib/utils";
import ListingCard from "@/components/ui/ListingCard";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SimilarListingsProps {
  /** ListingKey of the current listing (excluded from results) */
  currentListingKey: string;
  /** ZIP code to search in — same neighborhood feel */
  zipCode: string;
  /** Current listing price — used to build a +/-20% price range */
  price: number;
  /** City name for the section heading */
  city: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default async function SimilarListings({
  currentListingKey,
  zipCode,
  price,
  city,
}: SimilarListingsProps) {
  // Calculate a +/-20% price window around the current listing
  const minPrice = Math.round(price * 0.8);
  const maxPrice = Math.round(price * 1.2);

  // Fetch up to 5 listings so we can drop the current one and still have 4
  const res = await getListings({
    zip: zipCode,
    min_price: String(minPrice),
    max_price: String(maxPrice),
    limit: "5",
    sort: "ModificationTimestamp desc",
  });

  // Filter out the current listing and cap at 4 results
  const similar = (res.value || [])
    .filter((l) => l.ListingKey !== currentListingKey)
    .slice(0, 4);

  // Don't render the section if there's nothing to show
  if (similar.length === 0) return null;

  return (
    <section className="container-wide pb-12">
      <h2 className="heading-section text-xl text-primary mb-6">
        Similar Homes in {city}
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {similar.map((listing) => (
          <ListingCard key={listing.ListingKey} listing={listing} />
        ))}
      </div>
    </section>
  );
}
