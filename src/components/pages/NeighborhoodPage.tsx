// =============================================================================
// NeighborhoodPage, Neighborhood-level page within a city
// Rendered inside the [citySlug] route for slugs like /valrico-bloomingdale
// (452 neighborhood pages)
//
// Design pattern: matches the SpokePage compact hero + listings-first layout
// =============================================================================

import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import ListingGrid from "@/components/ui/ListingGrid";
import ClientNeighborhoodSection from "@/components/ui/ClientNeighborhoodSection";
import SpokeNav from "@/components/city/SpokeNav";
import CityResources from "@/components/city/CityResources";
// Lead capture + slug-keyed CTA copy. These ~1,440 neighborhood pages had no
// form at all, only tel: and /contact/ links, so a visitor searching
// "Bloomingdale homes for sale" had to click away to convert. AreaCta wraps the
// existing ContactForm (Turnstile + /api/contact + Follow Up Boss) and varies
// its headline per neighborhood slug so the copy is not identical 1,440 times.
// Full explanation lives in src/components/city/AreaCta.tsx.
import {
  AreaHeroCtaButtons,
  AreaLeadCapture,
  AreaCtaBar,
} from "@/components/city/AreaCta";
import { getCityBySlug } from "@/data/cities";
import { getPageContent } from "@/lib/page-content";
import { cleanWpContent } from "@/lib/utils";

import { NEIGHBORHOOD_DESCRIPTIONS } from "@/data/neighborhood-descriptions";
import { NEIGHBORHOOD_STATS, type NeighborhoodStat } from "@/data/neighborhood-stats";

interface NeighborhoodPageProps {
  /** Display name of the neighborhood (e.g. "Bloomingdale") */
  name: string;
  /** URL slug for the neighborhood (e.g. "bloomingdale") */
  slug: string;
  /** Parent city name (e.g. "Valrico") */
  city: string;
  /** Parent city slug for back-links (e.g. "valrico") */
  citySlug: string;
  /** Optional list of nearby neighborhood names for cross-linking */
  nearbyNeighborhoods?: { name: string; slug: string }[];
  /** Optional H1 override (defaults to "{name} Homes for Sale") */
  h1Override?: string;
  /** Override MLS subdivision search when MLS uses a different name than the neighborhood */
  subdivisionOverride?: string;
}

export default async function NeighborhoodPage({
  name,
  slug,
  city,
  citySlug,
  nearbyNeighborhoods = [],
  h1Override,
  subdivisionOverride,
}: NeighborhoodPageProps) {
  // Look up parent city data for zip codes and county info
  const parentCity = getCityBySlug(citySlug);
  const county = parentCity?.county ?? "Hillsborough";

  // Check for neighborhood photos in /public/images/neighborhoods/{slug}/
  const photosDir = path.join(process.cwd(), "public", "images", "neighborhoods", slug);
  let neighborhoodPhotos: { src: string; alt: string }[] = [];
  try {
    if (fs.existsSync(photosDir)) {
      neighborhoodPhotos = fs
        .readdirSync(photosDir)
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map((f) => ({
          src: `/images/neighborhoods/${slug}/${f}`,
          // Convert filename to readable alt text: "aerial-view.jpg" → "Aerial view of Broadway Centre Townhomes"
          alt: `${f.replace(/\.[^.]+$/, "").replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())}, ${name}, ${city} FL`,
        }));
    }
  } catch {
    // No photos directory, that's fine, most neighborhoods won't have one
  }

  // Try to load real WordPress content for this neighborhood page.
  // The neighborhood slug (e.g. "valrico-bloomingdale") is what WP exports use.
  const rawWpContent = getPageContent(slug);
  // Clean WP artifacts: strip shortcodes, fix image URLs, demote H2→H3 so
  // the existing "About {name}" H2 above doesn't compete with WP headings.
  const neighborhoodContent = rawWpContent
    ? cleanWpContent(rawWpContent)
        .replace(/<h2([^>]*)>/gi, '<h3$1>')
        .replace(/<\/h2>/gi, '</h3>')
    : null;

  // LISTINGS LOAD CLIENT-SIDE, no server-side API calls.
  // This prevents Bridge API rate limiting from deploys and crawlers.
  // Compute the subdivision search name for the client-side component
  const parentCityName = parentCity?.name || "";
  const searchName = name
    .replace(new RegExp(`\\s+${parentCityName}$`, 'i'), '')
    .replace(/,?\s*(FL|Florida)$/i, '')
    .trim();

  // Empty arrays, server-side listing fetch disabled to protect Bridge API rate limits
  const soldListings: never[] = [];

  // ------------------------------------------------------------------
  // Which sibling neighborhoods get the full three-link treatment.
  //
  // THE PROBLEM THIS SOLVES: every neighborhood has three real pages 
  // /bloomingdale/, /bloomingdale-homes-for-sale/ and /bloomingdale-realtor/
  // (all served by src/app/[citySlug]/page.tsx). The "Nearby Neighborhoods"
  // grid below only ever linked the first one, so the other two had zero
  // inbound links anywhere on the site: 1,384 orphaned pages, and the two
  // page types with the strongest buying intent at that.
  //
  // WHY A ROTATING WINDOW instead of just linking all of them: Valrico has 139
  // neighborhoods and Tampa has 42. Three links each would put 417 links in one
  // section, a link dump that passes almost no signal per link and reads as
  // spam. Instead each page spotlights a window of SPOTLIGHT_COUNT siblings,
  // and the window STARTS at this neighborhood's own position in the list. So
  // the windows overlap across the city's pages and every sibling lands in
  // roughly SPOTLIGHT_COUNT of them, full coverage of all the spoke pages,
  // with only ~27 extra links on any single page.
  //
  // It is deterministic (the order of src/data/neighborhoods.ts is fixed), so
  // the same page renders the same links on every build and crawl. That matters:
  // links that shuffle per request look unstable to a crawler.
  //
  // If it breaks, check:
  //   - A neighborhood's spoke pages look orphaned again => confirm this city
  //     actually has more than one neighborhood. A city with a single
  //     neighborhood has no siblings to link it, so its spokes depend on the
  //     RealtorPage and CityResources grids instead.
  //   - indexOf returns -1 when the current slug is not in the sibling list
  //     (the [citySlug] route filters the current neighborhood out before
  //     passing the array). We normalise that to 0 below rather than slicing
  //     from -1, which would silently return the tail of the array.
  const SPOTLIGHT_COUNT = 9;
  const ownIndex = Math.max(0, nearbyNeighborhoods.findIndex((n) => n.slug === slug));
  const spotlightNeighborhoods = Array.from(
    { length: Math.min(SPOTLIGHT_COUNT, nearbyNeighborhoods.length) },
    (_, i) => nearbyNeighborhoods[(ownIndex + i) % nearbyNeighborhoods.length]
  );
  // Everything not spotlighted keeps the plain hub tile it already had, so this
  // change only ADDS links, no neighborhood loses an inbound link it has today.
  const spotlightSlugs = new Set(spotlightNeighborhoods.map((n) => n.slug));
  const remainingNeighborhoods = nearbyNeighborhoods.filter(
    (n) => !spotlightSlugs.has(n.slug)
  );

  return (
    <>
      {/* --- JSON-LD BreadcrumbList for SEO --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://nowtb.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: `${city} Homes for Sale`,
                item: `https://nowtb.com/${citySlug}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${name} Homes for Sale`,
                item: `https://nowtb.com/${slug}`,
              },
            ],
          }),
        }}
      />

      {/* === Hero, compact with breadcrumb + CTA (matches SpokePage pattern) === */}
      <section className="bg-primary pt-36 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${citySlug}/`} className="hover:text-white/80 transition-colors">{city}</Link>
            <span>/</span>
            <span className="text-accent">{name}</span>
          </nav>

          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">
            {h1Override || `${name} Homes for Sale`}
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            {county} County, Florida, Updated daily from Stellar MLS
          </p>

          {/* CTA row, above the fold. The phone number is plain visible text
              at every breakpoint (NOT hidden on mobile), and the middle button
              scrolls to the lead form further down this same page rather than
              shipping the visitor off to /contact/ and losing them. */}
          <AreaHeroCtaButtons />
        </div>
      </section>

      {/* === Search/Filter Links, quick property type filters === */}
      <section className="container-wide py-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${citySlug}-homes-with-pool/`}
            className="inline-block border border-gray-300 rounded-full px-4 py-1.5 text-xs font-semibold text-primary hover:border-accent hover:text-accent transition-colors"
          >
            Pool Homes in {city}
          </Link>
          <Link
            href={`/${citySlug}-new-construction/`}
            className="inline-block border border-gray-300 rounded-full px-4 py-1.5 text-xs font-semibold text-primary hover:border-accent hover:text-accent transition-colors"
          >
            New Construction in {city}
          </Link>
          <Link
            href={`/${citySlug}-luxury-homes/`}
            className="inline-block border border-gray-300 rounded-full px-4 py-1.5 text-xs font-semibold text-primary hover:border-accent hover:text-accent transition-colors"
          >
            Luxury Homes in {city}
          </Link>
          <Link
            href={`/${citySlug}-open-houses/`}
            className="inline-block border border-gray-300 rounded-full px-4 py-1.5 text-xs font-semibold text-primary hover:border-accent hover:text-accent transition-colors"
          >
            Open Houses in {city}
          </Link>
        </div>
      </section>

      {/* === Market Stats + Listings, both load client-side from same fetch === */}
      <ClientNeighborhoodSection
        name={name}
        city={city}
        zipCodes={parentCity?.zip_codes || []}
        searchName={searchName}
        subdivisionOverride={subdivisionOverride}
        limit={24}
      />

      {/* === Recently Sold, shows recent closed sales in this neighborhood === */}
      {soldListings.length > 0 && (
        <ListingGrid
          listings={soldListings}
          title={`Recently Sold in ${name}`}
          subtitle={`Recent sales in the ${city} area.`}
          className="container-wide py-12 border-t border-gray-100"
        />
      )}

      {/* === Structured Neighborhood Data, stats, schools, commute, HOA, comparison, FAQ === */}
      {NEIGHBORHOOD_STATS[slug] && (
        <NeighborhoodStatsSection stats={NEIGHBORHOOD_STATS[slug]} name={name} city={city} county={county} />
      )}

      {/* === About the neighborhood, SEO content === */}
      <section className="container-wide py-12">
        <div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            About {name}
          </h2>
          {NEIGHBORHOOD_DESCRIPTIONS[slug] ? (
            // Curated neighborhood description takes priority, real, useful info
            <div
              className="blog-content prose prose-lg max-w-none text-muted font-body"
              dangerouslySetInnerHTML={{ __html: NEIGHBORHOOD_DESCRIPTIONS[slug].contentHtml }}
            />
          ) : neighborhoodContent ? (
            // WordPress content as fallback when no curated description exists
            <div
              className="blog-content prose prose-lg max-w-none text-muted font-body"
              dangerouslySetInnerHTML={{ __html: neighborhoodContent }}
            />
          ) : (
            // No content at all, show a brief, honest fallback
            <div className="prose font-body text-dark max-w-none space-y-4">
              <p>
                {name} is a residential neighborhood in {city}, {county} County,
                Florida. Like most established communities in the area, it offers
                a mix of single-family homes, convenient access to major roads,
                and proximity to schools, parks, and local shopping.
              </p>
              <p>
                Barrett Henry, Broker Associate at REMAX Collective, knows the
                {" "}{city} market well and can walk you through everything currently
                available in {name}, active listings, recent sales, and what
                comparable homes are fetching right now.
              </p>
            </div>
          )}

          {/* === Silo links, back to the parent city hub and across to
               conversion pages. Keyword anchor text, never "click here", because
               the anchor text tells Google and the AI answer engines what the
               destination is about. All single-segment routes, which keeps them
               clear of the `:city` flatten redirects in next.config.mjs that
               break nested paths on the live domain only. === */}
          <p className="font-body text-muted font-light leading-relaxed mt-6 max-w-3xl">
            Want the wider picture? See every{" "}
            <Link href={`/${citySlug}/`} className="text-link hover:underline font-semibold">
              {city} home for sale
            </Link>{" "}
            across {county} County, check the{" "}
            <Link href={`/${citySlug}-housing-market/`} className="text-link hover:underline">
              {city} housing market
            </Link>
            , or if you already own in {name}, get a{" "}
            <Link href="/free-home-valuation/" className="text-link hover:underline">
              free home valuation
            </Link>
            . Thinking about listing? Start with{" "}
            <Link href="/sell-your-home/" className="text-link hover:underline">
              how to sell your home
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === LEAD FORM, the piece these pages were missing entirely ===
           Mid-page, straight after the neighborhood write-up, which is where
           intent peaks. `source` carries the neighborhood slug into Follow Up
           Boss so Barrett can see the lead came from this specific community
           rather than from "the website" generically. */}
      <AreaLeadCapture areaName={name} slug={slug} source={`${slug}-neighborhood`} />

      {/* === Photo gallery, only shown when neighborhood has photos === */}
      {neighborhoodPhotos.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container-wide">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
              Photos of {name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {neighborhoodPhotos.map((photo) => (
                <div key={photo.src} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === Navigation Links, resources and parent pages === */}
      <section className="container-wide py-12 border-t border-gray-100">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">
          {city} Resources & Quick Links
        </h2>
        <p className="font-body text-muted font-light mb-6">
          Explore more about {city}, {county} County real estate.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <Link
            href={`/${county.toLowerCase()}-county/`}
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {county} County
          </Link>
          <Link
            href={`/${citySlug}/`}
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {city} Overview
          </Link>
          <Link
            href={`/${citySlug}-homes-for-sale/`}
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {city} Homes for Sale
          </Link>
          <Link
            href={`/${citySlug}-housing-market/`}
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {city} Housing Market
          </Link>
          <Link
            href={`/${citySlug}-neighborhood-guide/`}
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            {city} Neighborhood Guide
          </Link>
          <Link
            href="/mortgage-calculator/"
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            Mortgage Calculator
          </Link>
          <Link
            href="/buyers/"
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            Buyer Resources
          </Link>
          <Link
            href="/free-home-valuation/"
            className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            Free Home Valuation
          </Link>
        </div>
      </section>

      {/* === Spoke nav, explore more in the parent city === */}
      {parentCity && <SpokeNav city={parentCity} />}

      {/* === Sibling-area resource grid ===
           Standing rule: every page gets a resource grid linking sibling areas.
           Neighborhood pages had only the eight hand-written tiles above, so
           they never linked to NEARBY CITIES at all. CityResources already
           builds that grid with descriptive keyword anchors ("Brandon Homes for
           Sale"), plus sibling neighborhoods, loan guides and city articles.
           It returns null on its own for cities with nothing to show, so this
           is safe to render on all of them. */}
      {parentCity && <CityResources city={parentCity} />}

      {/* === Nearby neighborhoods, cross-linking ===
           Two tiers on purpose:

           1. `spotlightNeighborhoods` (computed above) get three links each:
              the neighborhood page plus its "-homes-for-sale" and "-realtor"
              spokes. Those two spoke page types are the highest commercial
              intent pages on the whole site and NOTHING linked them before 
              this grid only ever emitted the bare hub URL, which is how 1,384
              pages (21% of the site) ended up with zero inbound links.
           2. Every remaining sibling keeps the plain hub tile it already had,
              so no neighborhood loses the inbound link it has today. */}
      {nearbyNeighborhoods.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container-wide">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6 text-center">
              Nearby Neighborhoods
            </h2>

            {/* Tier 1, spotlight cards with keyword anchors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {spotlightNeighborhoods.map((n) => (
                <div
                  key={n.slug}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-3"
                >
                  <Link
                    href={`/${n.slug}/`}
                    className="block text-sm font-semibold text-primary transition-colors hover:text-accent"
                  >
                    {n.name}
                  </Link>
                  {/* Descriptive keyword anchors, never "read more", the anchor
                      text is the single strongest signal of what the destination
                      page is about, for Google and for AI answer engines alike. */}
                  <div className="mt-1 flex flex-col gap-0.5">
                    <Link
                      href={`/${n.slug}-homes-for-sale/`}
                      className="font-body text-xs text-muted transition-colors hover:text-accent"
                    >
                      {n.name} Homes for Sale
                    </Link>
                    <Link
                      href={`/${n.slug}-realtor/`}
                      className="font-body text-xs text-muted transition-colors hover:text-accent"
                    >
                      {n.name} REALTOR
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Tier 2, the rest of the city's neighborhoods, hub links only */}
            {remainingNeighborhoods.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {remainingNeighborhoods.map((neighborhood) => (
                  <Link
                    key={neighborhood.slug}
                    href={`/${neighborhood.slug}/`}
                    className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
                  >
                    {neighborhood.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* === CTA bar ===
           Was a hard-coded "Looking for homes in {name}?" on all ~1,440 of
           these pages, exactly the repeated boilerplate that reads as
           near-duplicate content. Now slug-keyed, so adjacent neighborhoods get
           different copy and each page stays consistent across crawls. */}
      <AreaCtaBar areaName={name} slug={slug} />
    </>
  );
}

// =============================================================================
// NeighborhoodStatsSection, Rich structured data blocks
// Only renders when NEIGHBORHOOD_STATS has data for this neighborhood.
// Combines the best of valricoagent's structured data with nowtb's luxury aesthetic.
// =============================================================================

function NeighborhoodStatsSection({
  stats,
  name,
  city,
  county,
}: {
  stats: NeighborhoodStat;
  name: string;
  city: string;
  county: string;
}) {
  return (
    <>
      {/* ── Key Stats Strip ── */}
      <section className="bg-light border-y border-border">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatBox label="Price Range" value={stats.priceRange} />
            <StatBox label="ZIP Code" value={stats.zip} />
            {stats.totalHomes && <StatBox label="Total Homes" value={stats.totalHomes} />}
            <StatBox label="High School" value={stats.highSchool} />
            {stats.hoaRequired === "yes" && <StatBox label="HOA" value={stats.hoaRange || "Required"} />}
            {stats.hoaRequired === "no" && <StatBox label="HOA" value="None" />}
            {stats.hoaRequired === "varies" && <StatBox label="HOA" value="Varies" />}
            {stats.gated && <StatBox label="Gated" value="Yes" />}
            {stats.golf && <StatBox label="Golf" value="Yes" />}
            {stats.communityPool && <StatBox label="Pool" value="Community" />}
            {stats.yearBuilt && <StatBox label="Built" value={stats.yearBuilt} />}
          </div>
        </div>
      </section>

      {/* ── Schools ── */}
      <section className="container-wide py-10">
        <h2 className="font-heading font-bold text-2xl text-primary mb-5">
          Schools Serving {name}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-light rounded-xl p-5 border border-border">
            <p className="font-body text-xs text-muted uppercase tracking-wider mb-1">High School</p>
            <p className="font-heading font-bold text-lg text-primary">{stats.highSchool}</p>
            {stats.highSchoolRating && (
              <p className="font-body text-sm text-muted mt-1">{stats.highSchoolRating}</p>
            )}
          </div>
          {stats.middleSchool && (
            <div className="bg-light rounded-xl p-5 border border-border">
              <p className="font-body text-xs text-muted uppercase tracking-wider mb-1">Middle School</p>
              <p className="font-heading font-bold text-lg text-primary">{stats.middleSchool}</p>
            </div>
          )}
          {stats.elementarySchools && stats.elementarySchools.length > 0 && (
            <div className="bg-light rounded-xl p-5 border border-border">
              <p className="font-body text-xs text-muted uppercase tracking-wider mb-1">Elementary</p>
              <p className="font-heading font-bold text-lg text-primary">
                {stats.elementarySchools.join(", ")}
              </p>
            </div>
          )}
        </div>
        {stats.schoolNote && (
          <p className="font-body text-sm text-muted mt-3 italic">{stats.schoolNote}</p>
        )}
      </section>

      {/* ── Commute Times ── */}
      {stats.commutes.length > 0 && (
        <section className="bg-light border-y border-border">
          <div className="container-wide py-10">
            <h2 className="font-heading font-bold text-2xl text-primary mb-5">
              Commute Times from {name}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="text-left py-3 pr-4 font-semibold text-primary">Destination</th>
                    <th className="text-left py-3 pr-4 font-semibold text-primary">Distance</th>
                    <th className="text-left py-3 font-semibold text-primary">Drive Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.commutes.map((c) => (
                    <tr key={c.destination} className="border-b border-border">
                      <td className="py-3 pr-4 text-dark">{c.destination}</td>
                      <td className="py-3 pr-4 text-muted">{c.distance}</td>
                      <td className="py-3 text-muted">{c.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── HOA & Community Fees ── */}
      {stats.hoaNote && (
        <section className="container-wide py-10">
          <h2 className="font-heading font-bold text-2xl text-primary mb-4">
            HOA &amp; Community Fees
          </h2>
          <div className="bg-light rounded-xl p-6 border border-border">
            <p className="font-body text-dark leading-relaxed">{stats.hoaNote}</p>
            {stats.cdd && (
              <p className="font-body text-sm text-muted mt-3">
                <strong>Note:</strong> A Community Development District (CDD) assessment may apply. CDD fees appear on your property tax bill and typically range from $1,500 to $4,000+ per year.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Neighborhood Comparison ── */}
      {stats.comparisons.length > 0 && (
        <section className="bg-light border-y border-border">
          <div className="container-wide py-10">
            <h2 className="font-heading font-bold text-2xl text-primary mb-5">
              How {name} Compares
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="text-left py-3 pr-4 font-semibold text-primary">Neighborhood</th>
                    <th className="text-left py-3 pr-4 font-semibold text-primary">Price Range</th>
                    <th className="text-left py-3 font-semibold text-primary">Key Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Current neighborhood row, highlighted */}
                  <tr className="border-b border-border bg-primary/5">
                    <td className="py-3 pr-4 font-semibold text-primary">{name}</td>
                    <td className="py-3 pr-4 text-dark">{stats.priceRange}</td>
                    <td className="py-3 text-muted italic">This neighborhood</td>
                  </tr>
                  {stats.comparisons.map((c) => (
                    <tr key={c.slug} className="border-b border-border">
                      <td className="py-3 pr-4">
                        <Link href={`/${c.slug}/`} className="text-link font-semibold hover:underline">
                          {c.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-dark">{c.price}</td>
                      <td className="py-3 text-muted">{c.distinction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Ideal For ── */}
      {stats.idealFor.length > 0 && (
        <section className="container-wide py-10">
          <h2 className="font-heading font-bold text-2xl text-primary mb-5">
            Who {name} Is Best For
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {stats.idealFor.map((profile) => (
              <div key={profile} className="flex items-start gap-3 bg-light rounded-xl p-4 border border-border">
                <span className="text-accent text-lg mt-0.5">✓</span>
                <p className="font-body text-dark text-sm">{profile}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Amenities ── */}
      {stats.amenities && stats.amenities.length > 0 && (
        <section className="bg-light border-y border-border">
          <div className="container-wide py-10">
            <h2 className="font-heading font-bold text-2xl text-primary mb-5">
              Amenities &amp; Nearby
            </h2>
            <div className="flex flex-wrap gap-3">
              {stats.amenities.map((a) => (
                <span key={a} className="bg-white border border-border rounded-full px-4 py-2 font-body text-sm text-dark">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {stats.faqs.length > 0 && (
        <section className="container-wide py-10">
          <h2 className="font-heading font-bold text-2xl text-primary mb-6">
            {name} FAQ
          </h2>
          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: stats.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              }),
            }}
          />
          <div className="space-y-4">
            {stats.faqs.map((faq) => (
              <div key={faq.question} className="border border-border rounded-xl p-5">
                <h3 className="font-heading font-bold text-base text-primary mb-2">
                  {faq.question}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

// Small reusable stat box for the key stats strip
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-border text-center">
      <p className="font-body text-xs text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="font-heading font-bold text-base text-primary">{value}</p>
    </div>
  );
}
