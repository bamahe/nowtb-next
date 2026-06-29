// =============================================================================
// NeighborhoodPage — Neighborhood-level page within a city
// Rendered inside the [citySlug] route for slugs like /valrico-bloomingdale
// (452 neighborhood pages)
//
// Design pattern: matches the SpokePage compact hero + listings-first layout
// =============================================================================

import Link from "next/link";
import ListingGrid from "@/components/ui/ListingGrid";
import SpokeNav from "@/components/city/SpokeNav";
import { getListings } from "@/lib/bridge";
import { getCityBySlug } from "@/data/cities";

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

  // Fetch listings by parent city's zip codes (more reliable than city name)
  let listings: import("@/lib/types").Listing[] = [];
  try {
    if (parentCity?.zip_codes?.length) {
      const res = await getListings({
        zip_codes: parentCity.zip_codes,
        limit: "24",
      });
      listings = res.value || [];
    }
  } catch {
    // If the API call fails, render the page with an empty listing grid
    listings = [];
  }

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
      <section className="bg-primary pt-12 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/50 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${citySlug}`} className="hover:text-white/80 transition-colors">{city}</Link>
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
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Schedule a Tour
            </Link>
          </div>
        </div>
      </section>

      {/* === Listings grid — front and center === */}
      {listings.length > 0 ? (
        <ListingGrid
          listings={listings}
          title={`${listings.length} Homes for Sale Near ${name}`}
          className="container-wide py-12"
        />
      ) : (
        <section className="container-wide py-12">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center max-w-2xl mx-auto">
            <p className="font-heading text-lg font-bold text-primary mb-2">
              No homes currently listed near {name}
            </p>
            <p className="font-body text-muted text-sm mb-4">
              New listings hit the MLS daily. Barrett can set up alerts so you are first to know.
            </p>
            <a
              href="tel:+18137337907"
              className="btn-primary inline-block px-6 py-2 text-sm"
            >
              Call (813) 733-7907
            </a>
          </div>
        </section>
      )}

      {/* === MLS disclaimer — only shown when listings are displayed === */}
      {listings.length > 0 && (
        <section className="container-wide pb-4">
          <p className="font-body text-xs text-muted/60 leading-relaxed max-w-4xl">
            Listing information provided by Stellar MLS. IDX information is for personal, non-commercial use only. Data is deemed reliable but not guaranteed. All properties are subject to prior sale, change, or withdrawal.
          </p>
        </section>
      )}

      {/* === About the neighborhood — SEO content === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            About {name}
          </h2>
          <div className="prose font-body text-dark max-w-none space-y-4">
            <p>
              {name} is a popular neighborhood in {city}, Florida, known for its
              welcoming community, convenient location, and quality housing
              options. Residents enjoy easy access to local schools, parks,
              shopping, and dining.
            </p>
            <p>
              Whether you&apos;re looking for a single-family home with a pool,
              a low-maintenance townhome, or a property with acreage, {name} has
              options to fit a range of budgets and lifestyles. Barrett Henry,
              Broker Associate at REMAX Collective, can help you find the right
              fit in {name}.
            </p>
          </div>
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
                  href={`/${neighborhood.slug}`}
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
              href="/contact"
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
