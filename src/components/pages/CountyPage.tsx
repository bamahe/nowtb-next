// =============================================================================
// CountyPage — County-level overview page component
// Rendered inside the [citySlug] route when the slug matches a county pattern
// (e.g. /hillsborough-county, /pinellas-county)
// =============================================================================

import Link from "next/link";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import type { CityData } from "@/data/cities";

interface CountyPageProps {
  /** Display name of the county (e.g. "Hillsborough") */
  countyName: string;
  /** URL slug for the county (e.g. "hillsborough-county") */
  countySlug: string;
  /** All cities within this county from the cities data */
  cities: CityData[];
}

export default async function CountyPage({
  countyName,
  countySlug,
  cities,
}: CountyPageProps) {
  // Collect all ZIP codes across every city in this county for listing search
  const allZipCodes = cities.flatMap((c) => c.zip_codes);

  // Fetch the first 12 listings across all county ZIP codes
  let listings: import("@/lib/types").Listing[] = [];
  try {
    const res = await getListings({ zip_codes: allZipCodes, limit: "12" });
    listings = res.value || [];
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
                name: `${countyName} County`,
                item: `https://nowtb.com/${countySlug}`,
              },
            ],
          }),
        }}
      />

      {/* === Hero — compact with breadcrumb + CTA (matches spoke page pattern) === */}
      <section className="bg-primary pt-12 pb-16">
        <div className="container-wide max-w-5xl">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/50 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">{countyName} County</span>
          </nav>

          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">
            {countyName} County Real Estate
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            Florida — Updated daily from Stellar MLS
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

      {/* === Cities in this county — clickable grid of city hub links === */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
          Cities in {countyName} County
        </h2>
        <p className="font-body text-muted text-center mb-8 max-w-2xl mx-auto">
          Choose a city below to browse listings, market data, and neighborhood
          info.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="block rounded-lg border border-gray-200 bg-white px-5 py-4 text-center transition-colors hover:border-accent hover:bg-accent/10"
            >
              <span className="block font-heading font-bold text-lg text-primary">
                {city.name}
              </span>
              <span className="block font-body text-sm text-muted mt-1">
                {city.zip_codes.length} ZIP code{city.zip_codes.length > 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* === Listings across the county === */}
      <ListingGrid
        listings={listings}
        title={`Recent Listings in ${countyName} County`}
        subtitle={`Browse active homes for sale across ${countyName} County, Florida.`}
      />

      {/* === MLS disclaimer — only shown when listings are displayed === */}
      {listings.length > 0 && (
        <section className="container-wide pb-4">
          <p className="font-body text-xs text-muted/60 leading-relaxed max-w-4xl">
            Listing information provided by Stellar MLS. IDX information is for personal, non-commercial use only. Data is deemed reliable but not guaranteed. All properties are subject to prior sale, change, or withdrawal.
          </p>
        </section>
      )}

      {/* === County overview content === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            About {countyName} County
          </h2>
          <div className="prose font-body text-dark max-w-none space-y-4">
            <p>
              {countyName} County is one of the most sought-after areas in the
              Tampa Bay region. With a mix of suburban neighborhoods, waterfront
              communities, and growing urban centers, {countyName} County offers
              something for every buyer — from first-time homeowners to luxury
              estate seekers.
            </p>
            <p>
              Barrett Henry, Broker Associate at REMAX Collective, has 23+ years
              of real estate experience helping buyers and sellers navigate the{" "}
              {countyName} County market. Whether you&apos;re relocating, investing,
              or selling your current home, Barrett provides data-driven guidance
              and relentless negotiation on your behalf.
            </p>
          </div>
        </div>
      </section>

      {/* === Quick stats / value props === */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="font-heading font-bold text-3xl text-accent mb-2">
              {cities.length}
            </div>
            <div className="font-body text-sm text-muted">
              Cities & Communities
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-heading font-bold text-3xl text-accent mb-2">
              23+
            </div>
            <div className="font-body text-sm text-muted">
              Years of Real Estate Experience
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-heading font-bold text-3xl text-accent mb-2">
              7
            </div>
            <div className="font-body text-sm text-muted">
              Counties Served
            </div>
          </div>
        </div>
      </section>

      {/* === CTA bar — dark bg with call + message buttons === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Buying or Selling in {countyName} County?
            </h2>
            <p className="font-body text-white/70 text-sm">
              REALTOR&reg; &amp; Broker Associate — 23+ years of real estate experience
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:+18137337907" className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors">Call Now</a>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors">Send a Message</Link>
          </div>
        </div>
      </section>
    </>
  );
}
