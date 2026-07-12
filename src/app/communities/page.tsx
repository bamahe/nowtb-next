// =============================================================================
// /communities — Communities index page listing all cities by county
// =============================================================================

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import { cities } from "@/data/cities";

// Leaflet requires window/DOM — load client-side only
const TampaBayMap = dynamic(() => import("@/components/ui/TampaBayMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 flex items-center justify-center">
      <p className="font-body text-muted text-sm">Loading map...</p>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Tampa Bay Communities | 78+ Cities | Barrett Henry, REALTOR®",
  description:
    "Explore all Tampa Bay communities by county — Hillsborough, Pinellas, Pasco, Manatee, Polk, Sarasota, Hernando, and Citrus. Browse homes for sale with Barrett Henry at REMAX Collective.",
  alternates: {
    canonical: "/communities/",
  },
  openGraph: {
    title: "Tampa Bay Communities | 78+ Cities | Barrett Henry, REALTOR®",
    description:
      "Explore all Tampa Bay communities by county — Hillsborough, Pinellas, Pasco, Manatee, Polk, Sarasota, Hernando, and Citrus. Browse homes for sale with Barrett Henry.",
    url: "/communities/",
    type: "website",
  },
};

// BreadcrumbList JSON-LD for communities index
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
    { "@type": "ListItem", position: 2, name: "Tampa Bay Communities", item: "https://nowtb.com/communities" },
  ],
};

export default function CommunitiesPage() {
  // Group cities by county
  const counties = Array.from(new Set(cities.map((c) => c.county)));
  const citiesByCounty = counties.map((county) => ({
    county,
    cities: cities.filter((c) => c.county === county),
  }));

  return (
    <>
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* === Hero === */}
      <HeroSection
        title="Tampa Bay Communities"
        subtitle="Explore homes for sale across 8 counties and 78+ cities in the Tampa Bay metro area."
      >
        <SearchBar />
      </HeroSection>

      {/* === Interactive Tampa Bay Area Map — click cities to explore === */}
      <section className="container-wide pt-12 pb-6">
        <p className="heading-label text-center mb-6">Tampa Bay Service Area</p>
        <TampaBayMap
          markers={cities.map((c) => ({
            name: c.name,
            lat: c.lat,
            lng: c.lng,
            href: `/${c.slug}`,
            label: `${c.name} — ${c.county} County`,
            type: "city" as const,
          }))}
        />
        <p className="font-body text-muted text-xs text-center mt-3">
          Click any city marker to explore homes for sale in that area.
        </p>
      </section>

      {/* === Cities by county === */}
      <section className="container-wide py-12">
        {citiesByCounty.map(({ county, cities: countyCities }) => (
          <div key={county} className="mb-12">
            {/* County heading with link */}
            <h2 className="heading-section text-xl text-primary mb-2">
              <Link
                href={`/${county.toLowerCase()}-county`}
                className="hover:text-accent transition-colors"
              >
                {county} County
              </Link>
            </h2>
            <p className="font-body text-muted mb-6">
              {countyCities.length} communities in {county} County
            </p>

            {/* City grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {countyCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="group card p-4 text-center hover:shadow-lg transition-shadow"
                >
                  <span className="font-heading font-bold text-sm text-primary group-hover:text-accent transition-colors">
                    {city.name}
                  </span>
                  <span className="block font-body text-xs text-muted mt-1">
                    {city.zip_codes.length} ZIP{city.zip_codes.length > 1 ? "s" : ""}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* === CTA === */}
      <section className="section-light">
        <div className="container-wide text-center max-w-2xl">
          <h2 className="heading-section text-xl text-primary mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="font-body text-muted mb-6">
            Barrett Henry knows every corner of Tampa Bay after 23+ years of
            real estate experience. Tell him your priorities and he will match
            you with the perfect community.
          </p>
          <Link href="/contact" className="btn-primary inline-block px-8 py-3">
            Get Barrett&apos;s Recommendation
          </Link>
        </div>
      </section>
    </>
  );
}
