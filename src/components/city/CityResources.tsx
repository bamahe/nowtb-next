// =============================================================================
// CityResources — comprehensive internal linking section for city hub pages
// Server component. Renders neighborhood grid, loan guides, buyer/seller
// resources, nearby cities, related guides, and recent blog posts.
// Designed to boost internal linking density for the 10 priority cities.
// =============================================================================

import Link from "next/link";
import type { CityData } from "@/data/cities";
// getCityBySlug + getCityTopics let us verify a spoke page actually exists for a
// nearby city before we link it. Topic lists are per-city (see getCityTopics in
// src/data/cities.ts — beach cities drop horse-properties, for example), so
// emitting a spoke URL blind would manufacture 404s.
import { getCityBySlug, getCityTopics } from "@/data/cities";
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
  // Anchor text varied on purpose. The exact phrase "mortgage calculator" is
  // already used as the anchor ~48,000 times sitewide from one boilerplate
  // paragraph block, and identical exact-match anchor text at that scale looks
  // like keyword stuffing to Google rather than like a helpful link. Same URL,
  // different wording.
  { href: "/mortgage-calculator/", label: "Payment & Mortgage Calculator" },
  { href: "https://firsttimehomebuyertb.com/", label: "Down Payment Assistance", external: true },
];

// --- Related guide pages (static, useful for all city pages) ---
//
// Two things to know about these slugs:
//
// 1. They are linked below at /guides/<slug>/, NOT at /<slug>/. getGuideRedirects()
//    in next.config.mjs emits a 301 from every root-level guide slug to its
//    /guides/ form, and src/app/[citySlug]/page.tsx permanentRedirects the same
//    way as a fallback. Linking the root form therefore cost a redirect on every
//    hit — the audit measured 1,116 of them from this one block.
// 2. Every slug must exist in src/data/guides.ts. "florida-homestead-exemption-guide"
//    did not: the real page is "florida-homestead-exemption-save-our-homes", so
//    that tile was a hard 404 on all 93 city pages. Fixed below.
//
// If it breaks, check: a guide tile 404s => the slug is not in src/data/guides.ts.
// Grep that file for the slug before adding a tile here; the redirect machinery
// will happily point at a slug that was never created.
const RELATED_GUIDES = [
  { slug: "first-time-home-buyer-guide", label: "First-Time Home Buyer Guide" },
  { slug: "florida-homestead-exemption-save-our-homes", label: "Florida Homestead Exemption Guide" },
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

  // Resolve each nearby slug to real city data so we can (a) use its proper
  // display name and (b) confirm the "-homes-for-sale" spoke exists for it
  // before linking. Capped at 5 so this stays a readable set of 2-3 links per
  // area instead of a link dump — a tile with 40 links passes almost no signal
  // per link and reads as spam.
  //
  // If it breaks, check: a nearby tile disappears => that slug is not in
  // src/data/cities.ts (NEARBY_CITIES above is hand-maintained and can drift
  // out of sync with the city data). The filter below drops unknown slugs
  // silently rather than rendering a dead link.
  const nearbyCities = nearbySlugs
    .slice(0, 5)
    .map((slug) => {
      const nearby = getCityBySlug(slug);
      if (!nearby) return null;
      const topics = getCityTopics(nearby).map((t) => t.slug);
      return {
        slug: nearby.slug,
        // Prefer the display-name map (it predates this change), fall back to
        // the city record's own name.
        name: CITY_DISPLAY_NAMES[slug] || nearby.name,
        hasHomesForSale: topics.includes("homes-for-sale"),
      };
    })
    .filter((n): n is { slug: string; name: string; hasHomesForSale: boolean } => n !== null);

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
      {nearbyCities.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading font-bold text-lg text-primary mb-4">
            Nearby Cities
          </h3>
          <p className="font-body text-muted text-sm mb-4">
            Explore homes for sale, market data, and local representation in
            communities near {city.name}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {nearbyCities.map((nearby) => (
              <div
                key={nearby.slug}
                className="border border-gray-200 bg-white px-4 py-3"
              >
                {/* City hub — the overview page */}
                <Link
                  href={`/${nearby.slug}/`}
                  className="block text-sm font-semibold text-primary transition-colors hover:text-accent"
                >
                  {nearby.name}
                </Link>
                {/* The two high-intent spokes. These carry the strongest buying
                    signal of any page type on the site and, before this change,
                    nothing anywhere linked them — only the bare hub was linked,
                    which is how 1,384 pages ended up with zero inbound links.
                    Anchor text is the real keyword ("Brandon Homes for Sale"),
                    never "click here", because the anchor is what tells Google
                    and the AI answer engines what the destination page is about. */}
                <div className="mt-1 flex flex-col gap-0.5">
                  {nearby.hasHomesForSale && (
                    <Link
                      href={`/${nearby.slug}-homes-for-sale/`}
                      className="font-body text-xs text-muted transition-colors hover:text-accent"
                    >
                      {nearby.name} Homes for Sale
                    </Link>
                  )}
                  <Link
                    href={`/${nearby.slug}-realtor/`}
                    className="font-body text-xs text-muted transition-colors hover:text-accent"
                  >
                    {nearby.name} REALTOR
                  </Link>
                </div>
              </div>
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
              /* Canonical /guides/ path — the bare /<slug>/ form 301s. See the
                 RELATED_GUIDES comment at the top of this file. */
              href={`/guides/${guide.slug}/`}
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
            {/* Blog posts live at /blog/<slug>/ — that is the only real route
                (src/app/blog/[slug]/page.tsx). The bare root form "/<slug>/"
                is what WordPress used; today it is a redirect, not a page:
                src/app/[citySlug]/page.tsx matches the slug against
                posts-export.json and permanentRedirects to /blog/<slug>/, and
                154 high-traffic slugs are additionally 301'd in next.config.mjs.
                Linking the root form cost 1,116 measured redirects from this one
                block. Always link /blog/<slug>/.

                If it breaks, check: a card 404s => that slug is no longer in
                posts-export.json. That file is owned by Barrett's content
                automation, so posts can disappear from under this component;
                getAllPosts() is the source of truth and is read above. */}
            {cityPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}/`}
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
              {/* Was `/blog/?q={city}` — a dead parameter. src/app/blog/page.tsx
                  only reads `page` and `category` from searchParams, so `q` was
                  silently ignored and this link just dropped the visitor on
                  page 1 of the blog with no filter applied and a promise the
                  page did not keep.
                  Now it points at the A-Z archive index on /blog/, which is a
                  real destination that lists every article, and the anchor text
                  says what the visitor will actually get. */}
              <Link
                href="/blog/#browse-all-articles"
                className="font-body text-sm font-semibold text-accent hover:text-primary transition-colors"
              >
                Browse the full Tampa Bay real estate blog archive &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
