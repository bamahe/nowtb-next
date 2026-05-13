// =============================================================================
// /communities — Communities index page listing all cities by county
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import { cities } from "@/data/cities";

export const metadata: Metadata = {
  title: "Tampa Bay Communities | Barrett Henry, REALTOR®",
  description:
    "Explore all Tampa Bay communities by county — Hillsborough, Pinellas, Pasco, Manatee, Polk, and Sarasota. Barrett Henry, Broker Associate at REMAX Collective.",
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
      {/* === Hero === */}
      <HeroSection
        title="Tampa Bay Communities"
        subtitle="Explore homes for sale across 7 counties and 69+ cities in the Tampa Bay metro area."
      >
        <SearchBar />
      </HeroSection>

      {/* === Cities by county === */}
      <section className="container-wide py-12">
        {citiesByCounty.map(({ county, cities: countyCities }) => (
          <div key={county} className="mb-12">
            {/* County heading with link */}
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">
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
      <section className="bg-gray-50 py-16">
        <div className="container-wide text-center max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
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
