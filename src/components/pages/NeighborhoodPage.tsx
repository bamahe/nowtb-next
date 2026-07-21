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
import ClientNeighborhoodSection from "@/components/ui/ClientNeighborhoodSection";
import SpokeNav from "@/components/city/SpokeNav";
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

  // Empty arrays — server-side listing fetch disabled to protect Bridge API rate limits
  const soldListings: never[] = [];

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

      {/* === Market Stats + Listings — both load client-side from same fetch === */}
      <ClientNeighborhoodSection
        name={name}
        city={city}
        zipCodes={parentCity?.zip_codes || []}
        searchName={searchName}
        limit={24}
      />

      {/* === Recently Sold — shows recent closed sales in this neighborhood === */}
      {soldListings.length > 0 && (
        <ListingGrid
          listings={soldListings}
          title={`Recently Sold in ${name}`}
          subtitle={`Recent sales in the ${city} area.`}
          className="container-wide py-12 border-t border-gray-100"
        />
      )}

      {/* === Structured Neighborhood Data — stats, schools, commute, HOA, comparison, FAQ === */}
      {NEIGHBORHOOD_STATS[slug] && (
        <NeighborhoodStatsSection stats={NEIGHBORHOOD_STATS[slug]} name={name} city={city} county={county} />
      )}

      {/* === About the neighborhood — SEO content === */}
      <section className="container-wide py-12">
        <div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            About {name}
          </h2>
          {NEIGHBORHOOD_DESCRIPTIONS[slug] ? (
            // Curated neighborhood description takes priority — real, useful info
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

// =============================================================================
// NeighborhoodStatsSection — Rich structured data blocks
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
                  {/* Current neighborhood row — highlighted */}
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
