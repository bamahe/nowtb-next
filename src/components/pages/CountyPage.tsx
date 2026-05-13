// =============================================================================
// CountyPage — County-level overview page component
// Rendered inside the [citySlug] route when the slug matches a county pattern
// (e.g. /hillsborough-county, /pinellas-county)
// =============================================================================

import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import type { CityData } from "@/data/cities";

interface CountyPageProps {
  /** Display name of the county (e.g. "Hillsborough") */
  countyName: string;
  /** URL slug for the county (e.g. "hillsborough-county") */
  countySlug: string;
  /** All cities within this county from the cities data */
  cities: CityData[];
}

export default function CountyPage({
  countyName,
  countySlug,
  cities,
}: CountyPageProps) {
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
                name: `${countyName} County Real Estate`,
                item: `https://nowtb.com/${countySlug}`,
              },
            ],
          }),
        }}
      />

      {/* === Hero section === */}
      <HeroSection
        title={`${countyName} County Real Estate`}
        subtitle={`Explore homes for sale across ${countyName} County, Florida. Browse cities, neighborhoods, and listings with Barrett Henry, REALTOR® at REMAX Collective.`}
      />

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

      {/* === Contact form === */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Buying or Selling in {countyName} County?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Connect with Barrett Henry for expert guidance on {countyName} County
            real estate.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`${countySlug}`}
          />
        </div>
      </section>
    </>
  );
}
