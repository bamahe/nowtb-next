// =============================================================================
// NeighborhoodPage — Neighborhood-level page within a city
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
import ClientListings from "@/components/ui/ClientListings";
import SpokeNav from "@/components/city/SpokeNav";
import { getListings } from "@/lib/bridge";
import { getCityBySlug } from "@/data/cities";
import { getPageContent } from "@/lib/page-content";
import { cleanWpContent, formatPrice } from "@/lib/utils";
import type { Listing } from "@/lib/types";
import { NEIGHBORHOOD_DESCRIPTIONS } from "@/data/neighborhood-descriptions";

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
}

export default async function NeighborhoodPage({
  name,
  slug,
  city,
  citySlug,
  nearbyNeighborhoods = [],
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
          alt: `${f.replace(/\.[^.]+$/, "").replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())} — ${name}, ${city} FL`,
        }));
    }
  } catch {
    // No photos directory — that's fine, most neighborhoods won't have one
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

  // LISTINGS LOAD CLIENT-SIDE — no server-side API calls.
  // This prevents Bridge API rate limiting from deploys and crawlers.
  // Compute the subdivision search name for the client-side component
  const parentCityName = parentCity?.name || "";
  const searchName = name
    .replace(new RegExp(`\\s+${parentCityName}$`, 'i'), '')
    .replace(/,?\s*(FL|Florida)$/i, '')
    .trim();

  // Empty arrays for stats sections (stats will be hidden without data)
  const listings: never[] = [];
  const soldListings: never[] = [];
  const activeCount = 0;
  const avgDom = null;
  const avgPricePerSqft = null;
  const medianPrice = null;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

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

      {/* === Hero — compact with breadcrumb + CTA (matches SpokePage pattern) === */}
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
            {name} Homes for Sale
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            {county} County, Florida — Updated daily from Stellar MLS
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
            >
              (813) 733-7907
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Schedule a Tour
            </Link>
          </div>
        </div>
      </section>

      {/* === Market Stats Bar — key metrics at a glance === */}
      <section className="bg-gray-100 border-b border-gray-200">
        <div className="container-wide py-6">
          {/* Header with neighborhood name and date */}
          <p className="font-body text-xs text-muted uppercase tracking-widest mb-4">
            Active Listings in {name} — {today}
          </p>
          {/* 4-column stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="font-heading text-2xl md:text-3xl font-bold text-primary">
                {activeCount > 0 ? activeCount : "—"}
              </p>
              <p className="font-body text-sm text-muted">Listed</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl font-bold text-primary">
                {avgDom !== null ? avgDom : "—"}
              </p>
              <p className="font-body text-sm text-muted">Avg. DOM</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl font-bold text-primary">
                {avgPricePerSqft !== null ? `$${avgPricePerSqft}` : "—"}
              </p>
              <p className="font-body text-sm text-muted">Avg. $/Sq.Ft.</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl font-bold text-primary">
                {medianPrice !== null ? formatPrice(medianPrice) : "—"}
              </p>
              <p className="font-body text-sm text-muted">Med. List Price</p>
            </div>
          </div>
        </div>
      </section>

      {/* === Search/Filter Links — quick property type filters === */}
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

      {/* === Listings — loads CLIENT-SIDE to avoid API rate limits === */}
      <ClientListings
        zipCodes={parentCity?.zip_codes || []}
        title={`Homes for Sale in ${name}`}
        subtitle={`Active listings in the ${name} area, ${city} FL.`}
        limit={24}
        filters={{ subdivision: searchName }}
        areaName={name}
      />
      {/* Empty state is handled by ClientListings component */}

      {/* === MLS disclaimer — only shown when listings are displayed === */}
      {listings.length > 0 && (
        <section className="container-wide pb-4">
          <p className="font-body text-xs text-muted/60 leading-relaxed max-w-4xl">
            Listing information provided by Stellar MLS. IDX information is for personal, non-commercial use only. Data is deemed reliable but not guaranteed. All properties are subject to prior sale, change, or withdrawal.
          </p>
        </section>
      )}

      {/* === Recently Sold — shows recent closed sales in this neighborhood === */}
      {soldListings.length > 0 && (
        <ListingGrid
          listings={soldListings}
          title={`Recently Sold in ${name}`}
          subtitle={`Recent sales in the ${city} area.`}
          className="container-wide py-12 border-t border-gray-100"
        />
      )}

      {/* === About the neighborhood — SEO content === */}
      <section className="container-wide py-12">
        <div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            About {name}
          </h2>
          {neighborhoodContent ? (
            // Real WordPress content found — render it with proper styling
            <div
              className="blog-content prose prose-lg max-w-none text-muted font-body"
              dangerouslySetInnerHTML={{ __html: neighborhoodContent }}
            />
          ) : NEIGHBORHOOD_DESCRIPTIONS[slug] ? (
            // Curated neighborhood description — real, useful info
            <div
              className="blog-content prose prose-lg max-w-none text-muted font-body"
              dangerouslySetInnerHTML={{ __html: NEIGHBORHOOD_DESCRIPTIONS[slug].contentHtml }}
            />
          ) : (
            // No content at all — show a brief, honest fallback
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
                available in {name} — active listings, recent sales, and what
                comparable homes are fetching right now.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* === Photo gallery — only shown when neighborhood has photos === */}
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

      {/* === Navigation Links — resources and parent pages === */}
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

      {/* === Spoke nav — explore more in the parent city === */}
      {parentCity && <SpokeNav city={parentCity} />}

      {/* === Nearby neighborhoods — cross-linking === */}
      {nearbyNeighborhoods.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container-wide">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6 text-center">
              Nearby Neighborhoods
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {nearbyNeighborhoods.map((neighborhood) => (
                <Link
                  key={neighborhood.slug}
                  href={`/${neighborhood.slug}/`}
                  className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
                >
                  {neighborhood.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === CTA bar — clean dark bar, no full form (matches SpokePage) === */}
      <section className="bg-primary py-12">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Looking for homes in {name}?
            </h2>
            <p className="font-body text-white/70 text-sm">
              Barrett Henry, REALTOR® — 23+ years of real estate experience
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
            >
              Call Now
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
