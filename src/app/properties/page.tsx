// =============================================================================
// Properties Search Page — Browse all Tampa Bay listings with filters
// Server component: reads URL search params and fetches listings server-side
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";

import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import type { ListingSearchParams } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Search Tampa Bay Properties",
  description:
    "Browse homes for sale across Tampa Bay. Filter by city, price, bedrooms, and more. Updated daily from the Stellar MLS.",
  openGraph: {
    title: "Search Tampa Bay Properties | Barrett Henry, REALTOR®",
    description:
      "Browse homes for sale across Tampa Bay. Filter by city, price, bedrooms, and more.",
    url: "/properties",
  },
};

// -----------------------------------------------------------------------------
// Helper: build a human-readable filter summary from search params
// -----------------------------------------------------------------------------

function buildFilterSummary(params: ListingSearchParams): string {
  const parts: string[] = [];

  if (params.city) parts.push(`in ${params.city}`);
  if (params.zip) parts.push(`ZIP ${params.zip}`);
  if (params.min_price && params.max_price) {
    parts.push(
      `${formatPrice(Number(params.min_price))} – ${formatPrice(Number(params.max_price))}`
    );
  } else if (params.min_price) {
    parts.push(`${formatPrice(Number(params.min_price))}+`);
  } else if (params.max_price) {
    parts.push(`up to ${formatPrice(Number(params.max_price))}`);
  }
  if (params.beds) parts.push(`${params.beds}+ beds`);
  if (params.baths) parts.push(`${params.baths}+ baths`);

  // If no filters applied, show a generic message
  if (parts.length === 0) return "Showing all active listings";

  return `Filtered: ${parts.join(", ")}`;
}

// -----------------------------------------------------------------------------
// Page component
// -----------------------------------------------------------------------------

/** Next.js passes searchParams as a Promise in the App Router */
interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** Items per page for pagination */
const PAGE_SIZE = 24;

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  // Await and extract search params from the URL
  const rawParams = await searchParams;

  // Build the typed search params object from URL query strings
  const filters: ListingSearchParams = {
    city: typeof rawParams.city === "string" ? rawParams.city : undefined,
    zip: typeof rawParams.zip === "string" ? rawParams.zip : undefined,
    min_price:
      typeof rawParams.min_price === "string" ? rawParams.min_price : undefined,
    max_price:
      typeof rawParams.max_price === "string" ? rawParams.max_price : undefined,
    beds: typeof rawParams.beds === "string" ? rawParams.beds : undefined,
    baths: typeof rawParams.baths === "string" ? rawParams.baths : undefined,
    limit: String(PAGE_SIZE),
    offset:
      typeof rawParams.page === "string"
        ? String((Number(rawParams.page) - 1) * PAGE_SIZE)
        : "0",
  };

  // Fetch listings from Bridge API with these filters
  const response = await getListings(filters);
  const listings = response.value || [];
  const total = response.total || 0;

  // Figure out current page number for pagination
  const currentPage =
    typeof rawParams.page === "string" ? Number(rawParams.page) : 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Build a human-readable summary of the active filters
  const filterSummary = buildFilterSummary(filters);

  // Build base URL for pagination links (preserves current filters)
  function paginationHref(page: number): string {
    const params = new URLSearchParams();
    if (filters.city) params.set("city", filters.city);
    if (filters.zip) params.set("zip", filters.zip);
    if (filters.min_price) params.set("min_price", filters.min_price);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.beds) params.set("beds", filters.beds);
    if (filters.baths) params.set("baths", filters.baths);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/properties?${qs}` : "/properties";
  }

  return (
    <>
      {/* =================================================================
          SECTION 1: Hero — compact hero with search bar
          ================================================================= */}
      <HeroSection
        title="Search Tampa Bay Properties"
        subtitle="Updated daily from the Stellar MLS. Find your next home today."
      >
        <SearchBar />
      </HeroSection>

      {/* =================================================================
          SECTION 2: Filter summary bar
          ================================================================= */}
      <div className="container-wide py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <p className="font-body text-muted text-sm">{filterSummary}</p>
          <p className="font-body text-muted text-sm">
            {total.toLocaleString()} {total === 1 ? "listing" : "listings"} found
          </p>
        </div>
      </div>

      {/* =================================================================
          SECTION 3: Listing grid
          ================================================================= */}
      {listings.length > 0 ? (
        <ListingGrid listings={listings} />
      ) : (
        /* Empty state when no listings match the filters */
        <section className="container-wide py-16 text-center">
          <h2 className="heading-section text-xl text-primary mb-4">
            No Listings Found
          </h2>
          <p className="font-body text-muted mb-6">
            Try adjusting your search criteria or browse all available properties.
          </p>
          <Link href="/properties" className="btn-primary px-8 py-3">
            View All Listings
          </Link>
        </section>
      )}

      {/* =================================================================
          SECTION 4: Pagination — prev/next links
          ================================================================= */}
      {totalPages > 1 && (
        <nav
          className="container-wide py-8 flex items-center justify-center gap-4"
          aria-label="Listing pagination"
        >
          {/* Previous page link */}
          {currentPage > 1 ? (
            <Link
              href={paginationHref(currentPage - 1)}
              className="btn-outline px-6 py-2 text-sm"
            >
              Previous
            </Link>
          ) : (
            <span className="px-6 py-2 text-sm text-muted opacity-50 cursor-not-allowed">
              Previous
            </span>
          )}

          {/* Page indicator */}
          <span className="font-body text-sm text-muted">
            Page {currentPage} of {totalPages}
          </span>

          {/* Next page link */}
          {currentPage < totalPages ? (
            <Link
              href={paginationHref(currentPage + 1)}
              className="btn-outline px-6 py-2 text-sm"
            >
              Next
            </Link>
          ) : (
            <span className="px-6 py-2 text-sm text-muted opacity-50 cursor-not-allowed">
              Next
            </span>
          )}
        </nav>
      )}
    </>
  );
}
