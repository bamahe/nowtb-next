// =============================================================================
// Properties Search Page — Browse all Tampa Bay listings with filters
// Server component: reads URL search params and fetches listings server-side
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";

import { Suspense } from "react";

import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import PropertyFilters from "@/components/ui/PropertyFilters";
import SaveSearchButton from "@/components/ui/SaveSearchButton";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import type { ListingSearchParams } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Tampa Bay Homes for Sale | Search Properties | MLS Listings",
  description:
    "Browse homes for sale across Tampa Bay. Filter by city, price, bedrooms, and more. Updated daily from Stellar MLS. Barrett Henry, REMAX Collective. Call (813) 733-7907.",
  alternates: {
    canonical: "/properties",
  },
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
  if (params.property_type) parts.push(params.property_type);
  if (params.pool) parts.push("Pool");
  if (params.waterfront) parts.push("Waterfront");
  if (params.new_construction) parts.push("New Construction");
  if (params.senior) parts.push("55+");
  if (params.single_story) parts.push("Single Story");
  if (params.open_house) parts.push("Open Houses");

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

  // Parse the free-text "q" param from SearchBar — could be a city name or ZIP code
  const qRaw = typeof rawParams.q === "string" ? rawParams.q.trim() : "";
  const qIsZip = /^\d{5}$/.test(qRaw); // 5-digit number = ZIP code

  // Build the typed search params object from URL query strings
  // Explicit city/zip params override the free-text q param
  const filters: ListingSearchParams = {
    city:
      typeof rawParams.city === "string"
        ? rawParams.city
        : !qIsZip && qRaw
          ? qRaw
          : undefined,
    zip:
      typeof rawParams.zip === "string"
        ? rawParams.zip
        : qIsZip
          ? qRaw
          : undefined,
    min_price:
      typeof rawParams.min_price === "string" ? rawParams.min_price : undefined,
    max_price:
      typeof rawParams.max_price === "string" ? rawParams.max_price : undefined,
    beds: typeof rawParams.beds === "string" ? rawParams.beds : undefined,
    baths: typeof rawParams.baths === "string" ? rawParams.baths : undefined,
    property_type:
      typeof rawParams.property_type === "string" ? rawParams.property_type : undefined,
    sort: typeof rawParams.sort === "string" ? rawParams.sort : undefined,
    // Topic filters — boolean flags from URL params
    pool: rawParams.pool === "true" || undefined,
    waterfront: rawParams.waterfront === "true" || undefined,
    new_construction: rawParams.new_construction === "true" || undefined,
    senior: rawParams.senior === "true" || undefined,
    single_story: rawParams.single_story === "true" || undefined,
    open_house: rawParams.open_house === "true" || undefined,
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
    // Preserve the original q param if it was used (not the parsed city/zip)
    if (qRaw) params.set("q", qRaw);
    if (rawParams.city && typeof rawParams.city === "string") params.set("city", rawParams.city);
    if (rawParams.zip && typeof rawParams.zip === "string") params.set("zip", rawParams.zip);
    if (filters.min_price) params.set("min_price", filters.min_price);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.beds) params.set("beds", filters.beds);
    if (filters.baths) params.set("baths", filters.baths);
    if (filters.property_type) params.set("property_type", filters.property_type);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.pool) params.set("pool", "true");
    if (filters.waterfront) params.set("waterfront", "true");
    if (filters.new_construction) params.set("new_construction", "true");
    if (filters.senior) params.set("senior", "true");
    if (filters.single_story) params.set("single_story", "true");
    if (filters.open_house) params.set("open_house", "true");
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/properties?${qs}` : "/properties";
  }

  return (
    <>
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Properties", item: "https://nowtb.com/properties" },
            ],
          }),
        }}
      />

      {/* =================================================================
          SECTION 1: Hero — shorter 50vh with search bar
          ================================================================= */}
      <HeroSection
        title="Properties"
        label="TAMPA BAY REAL ESTATE"
        subtitle="Updated daily from the Stellar MLS."
        fullHeight={false}
      >
        <SearchBar />
      </HeroSection>

      {/* =================================================================
          SECTION 2: Interactive filter bar — sort, type, features
          Wrapped in Suspense because PropertyFilters uses useSearchParams
          ================================================================= */}
      <Suspense fallback={<div className="container-wide py-5 border-b border-black/5" />}>
        <PropertyFilters />
      </Suspense>

      {/* Filter summary + count + save search */}
      <div className="container-wide py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="font-body text-muted text-xs font-light tracking-wide">{filterSummary}</p>
          <div className="flex items-center gap-4">
            <Suspense fallback={null}>
              <SaveSearchButton />
            </Suspense>
            <p className="font-body text-muted text-xs font-light tracking-wide">
              {total.toLocaleString()} {total === 1 ? "listing" : "listings"}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================
          SECTION 3: Listing grid
          ================================================================= */}
      {listings.length > 0 ? (
        <ListingGrid listings={listings} />
      ) : (
        /* Empty state — minimal luxury styling */
        <section className="container-wide py-24 md:py-32 text-center">
          <p className="heading-label mb-6">No Results</p>
          <h2 className="heading-section text-xl text-primary mb-4">
            No Listings Found
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted font-light mb-10">
            Try adjusting your search criteria or browse all available properties.
          </p>
          <Link href="/properties" className="btn-primary">
            View All Listings
          </Link>
        </section>
      )}

      {/* =================================================================
          SECTION 4: Pagination — prev/next links
          ================================================================= */}
      {/* =================================================================
          SECTION 4: Pagination — minimal prev/next with page indicator
          ================================================================= */}
      {totalPages > 1 && (
        <nav
          className="container-wide py-16 flex items-center justify-center gap-8"
          aria-label="Listing pagination"
        >
          {/* Previous page link */}
          {currentPage > 1 ? (
            <Link
              href={paginationHref(currentPage - 1)}
              className="text-xs font-body font-medium tracking-[0.2em] uppercase text-primary hover:text-accent transition-colors duration-300"
            >
              &larr; Previous
            </Link>
          ) : (
            <span className="text-xs font-body font-medium tracking-[0.2em] uppercase text-muted/30 cursor-not-allowed">
              &larr; Previous
            </span>
          )}

          {/* Page indicator */}
          <span className="font-body text-xs text-muted font-light tracking-wide">
            {currentPage} / {totalPages}
          </span>

          {/* Next page link */}
          {currentPage < totalPages ? (
            <Link
              href={paginationHref(currentPage + 1)}
              className="text-xs font-body font-medium tracking-[0.2em] uppercase text-primary hover:text-accent transition-colors duration-300"
            >
              Next &rarr;
            </Link>
          ) : (
            <span className="text-xs font-body font-medium tracking-[0.2em] uppercase text-muted/30 cursor-not-allowed">
              Next &rarr;
            </span>
          )}
        </nav>
      )}
    </>
  );
}
