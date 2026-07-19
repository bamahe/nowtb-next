// =============================================================================
// CityResources — comprehensive internal linking section for city hub pages
// Server component. Renders neighborhood grid, loan guides, buyer/seller
// resources, nearby cities, related guides, and recent blog posts.
// Designed to boost internal linking density for the 10 priority cities.
// =============================================================================

import Link from "next/link";
import type { CityData } from "@/data/cities";
import { getNeighborhoodsByCity } from "@/data/neighborhoods";
import { getAllPosts } from "@/lib/posts";
import { comparisons } from "@/data/comparisons";

// --- Nearby cities map for the 10 priority cities ---
// Each priority city links to its geographic neighbors
const NEARBY_CITIES: Record<string, string[]> = {
  valrico: ["brandon", "riverview", "lithia", "dover", "seffner", "plant-city", "thonotosassa"],
  brandon: ["valrico", "riverview", "seffner", "dover", "plant-city"],
  riverview: ["brandon", "valrico", "lithia", "apollo-beach", "ruskin"],
  lithia: ["valrico", "riverview", "dover", "plant-city"],
  "apollo-beach": ["riverview", "ruskin", "brandon"],
  ruskin: ["apollo-beach", "riverview"],
  dover: ["valrico", "brandon", "seffner", "plant-city", "thonotosassa"],
  seffner: ["brandon", "valrico", "dover", "thonotosassa", "plant-city"],
  "plant-city": ["valrico", "brandon", "dover", "seffner"],
  thonotosassa: ["seffner", "dover", "brandon", "valrico"],
};

// --- Display names for city slugs (used in nearby cities section) ---
const CITY_DISPLAY_NAMES: Record<string, string> = {
  valrico: "Valrico",
  brandon: "Brandon",
  riverview: "Riverview",
  lithia: "Lithia",
  "apollo-beach": "Apollo Beach",
  ruskin: "Ruskin",
  dover: "Dover",
  seffner: "Seffner",
  "plant-city": "Plant City",
  thonotosassa: "Thonotosassa",
};

// --- All 8 loan guide pages ---
const LOAN_GUIDES = [
  { slug: "fha-loan-florida", label: "FHA Loans" },
  { slug: "va-loan-florida", label: "VA Loans" },
  { slug: "usda-loan-florida", label: "USDA Loans" },
  { slug: "conventional-loan-florida", label: "Conventional Loans" },
  { slug: "jumbo-loan-florida", label: "Jumbo Loans" },
  { slug: "renovation-loan-florida", label: "Renovation Loans" },
  { slug: "reverse-mortgage-florida", label: "Reverse Mortgages" },
  { slug: "construction-loan-florida", label: "Construction Loans" },
];

// --- Buyer and seller resource links ---
const BUYER_SELLER_RESOURCES = [
  { href: "/buyers/", label: "Home Buyer Resources" },
  { href: "/sellers/", label: "Home Seller Resources" },
  { href: "/sell-your-home/", label: "Sell Your Home" },
  { href: "/free-home-valuation/", label: "Free Home Valuation" },
  { href: "/mortgage-calculator/", label: "Mortgage Calculator" },
  { href: "https://firsttimehomebuyertb.com/", label: "Down Payment Assistance", external: true },
];

// --- Related guide pages (static, useful for all city pages) ---
const RELATED_GUIDES = [
  { slug: "first-time-home-buyer-guide", label: "First-Time Home Buyer Guide" },
  { slug: "florida-homestead-exemption-guide", label: "Florida Homestead Exemption Guide" },
  { slug: "home-inspection-guide-florida", label: "Florida Home Inspection Guide" },
  { slug: "home-appraisal-guide", label: "Home Appraisal Guide" },
  { slug: "how-to-choose-a-realtor", label: "How to Choose a REALTOR" },
  { slug: "new-construction-guide", label: "New Construction Guide" },
  { slug: "relocation-guide", label: "Relocation Guide" },
  { slug: "hoa-buyers-guide", label: "HOA Buyer's Guide" },
];

interface CityResourcesProps {
  /** The city to render resources for */
  city: CityData;
}

export default function CityResources({ city }: CityResourcesProps) {
  // --- Neighborhoods in this city ---
  const cityNeighborhoods = getNeighborhoodsByCity(city.slug);

  // --- Nearby cities from the priority map ---
  const nearbySlugs = NEARBY_CITIES[city.slug] || [];

  // --- Comparison pages that mention this city (check slugA and slugB fields) ---
  // The sideA/sideB display names are title-case; we do a case-insensitive match against city.name
  const cityComparisons = comparisons.filter((c) => {
    const cityName = city.name.toLowerCase();
    return c.sideA.toLowerCase() === cityName || c.sideB.toLowerCase() === cityName;
  });

  // --- Recent blog posts mentioning this city ---
  // Filter by city slug appearing in the post slug (e.g. "valrico" in "best-neighborhoods-valrico")
  const allPosts = getAllPosts();
  const allCityPosts = allPosts.filter((p) => p.slug.includes(city.slug));
  const cityPosts = allCityPosts.slice(0, 12);

  // If no nearby cities and no neighborhoods, this isn't a priority city — skip rendering
  if (nearbySlugs.length === 0 && cityNeighborhoods.length === 0 && allCityPosts.length === 0) {
    return null;
  }

  return (
    <section className="container-wide py-12 border-t border-gray-100">
      {/* Section heading */}
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">
        {city.name} Resources & Guides
      </h2>
      <p className="font-body text-muted font-light mb-10">
        Everything you need to buy, sell, or invest in {city.name}, {city.county} County real estate.
      </p>

      {/* ================================================================= */}
      {/* NEIGHBORHOOD GRID — all neighborhoods in this city                 */}
      {/* ================================================================= */}
      {cityNeighborhoods.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading font-bold text-lg text-primary mb-4">
            Neighborhoods in {city.name}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cityNeighborhoods.map((n) => (
              <Link
                key={n.slug}
                href={`/${n.slug}/`}
                className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {n.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* LOAN GUIDE LINKS — all 8 Florida loan types                        */}
      {/* ================================================================= */}
      <div className="mb-10">
        <h3 className="font-heading font-bold text-lg text-primary mb-4">
          Florida Loan Programs
        </h3>
        <p className="font-body text-muted text-sm mb-4">
          Compare mortgage options available to {city.name} home buyers.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {LOAN_GUIDES.map((loan) => (
            <Link
              key={loan.slug}
              href={`/${loan.slug}/`}
              className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
            >
              {loan.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* BUYER & SELLER RESOURCES                                           */}
      {/* ================================================================= */}
      <div className="mb-10">
        <h3 className="font-heading font-bold text-lg text-primary mb-4">
          Buyer & Seller Resources
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {BUYER_SELLER_RESOURCES.map((resource) => (
            /* External links open in new tab; internal links use Next.js routing */
            "external" in resource && resource.external ? (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {resource.label}
              </a>
            ) : (
              <Link
                key={resource.href}
                href={resource.href}
                className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {resource.label}
              </Link>
            )
          ))}
        </div>
        {/* City-specific sell/realtor links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
          <Link
            href={`/sell-your-home-${city.slug}/`}
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            Sell Your {city.name} Home
          </Link>
          <Link
            href={`/${city.slug}-realtor/`}
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {city.name} REALTOR
          </Link>
          <Link
            href={`/${city.slug}-housing-market/`}
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {city.name} Housing Market
          </Link>
          <Link
            href={`/${city.slug}-neighborhood-guide/`}
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {city.name} Neighborhood Guide
          </Link>
        </div>
      </div>

      {/* ================================================================= */}
      {/* NEARBY CITIES — cross-links to neighboring priority cities          */}
      {/* ================================================================= */}
      {nearbySlugs.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading font-bold text-lg text-primary mb-4">
            Nearby Cities
          </h3>
          <p className="font-body text-muted text-sm mb-4">
            Explore homes for sale in communities near {city.name}.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {nearbySlugs.map((slug) => (
              <Link
                key={slug}
                href={`/${slug}/`}
                className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {CITY_DISPLAY_NAMES[slug] || slug} Homes for Sale
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* COMPARE CITIES — links to comparison pages featuring this city      */}
      {/* ================================================================= */}
      {cityComparisons.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading font-bold text-lg text-primary mb-4">
            Compare {city.name}
          </h3>
          <p className="font-body text-muted text-sm mb-4">
            See how {city.name} stacks up against nearby communities.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {cityComparisons.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/`}
                className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {c.sideA} vs {c.sideB}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* RELATED GUIDES — helpful guides for buyers and sellers              */}
      {/* ================================================================= */}
      <div className="mb-10">
        <h3 className="font-heading font-bold text-lg text-primary mb-4">
          Helpful Guides
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {RELATED_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/${guide.slug}/`}
              className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
            >
              {guide.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* RECENT BLOG POSTS — city-specific articles                          */}
      {/* ================================================================= */}
      {cityPosts.length > 0 && (
        <div>
          <h3 className="font-heading font-bold text-lg text-primary mb-4">
            Recent Articles About {city.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cityPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.slug}/`}
                className="block border border-gray-200 bg-white rounded-lg p-5 transition-colors hover:border-accent hover:shadow-sm group"
              >
                <p className="font-heading font-bold text-sm text-primary group-hover:text-accent transition-colors leading-snug mb-2">
                  {post.title}
                </p>
                <p className="font-body text-xs text-muted line-clamp-2">
                  {post.excerpt
                    ? post.excerpt.replace(/<[^>]+>/g, "").slice(0, 120)
                    : `Read about ${post.title.toLowerCase()}.`}
                </p>
                <p className="font-body text-xs text-muted/60 mt-2">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
          {/* "View all" link when there are more posts than shown */}
          {allCityPosts.length > cityPosts.length && (
            <div className="text-center mt-6">
              <Link
                href={`/blog/?q=${encodeURIComponent(city.name)}`}
                className="font-body text-sm font-semibold text-accent hover:text-primary transition-colors"
              >
                View All {allCityPosts.length} {city.name} Articles &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
