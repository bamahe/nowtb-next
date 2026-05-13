// =============================================================================
// NeighborhoodPage — Neighborhood-level page within a city
// Rendered inside the [citySlug] route for slugs like /valrico-bloomingdale
// (452 neighborhood pages)
// =============================================================================

import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListingsByCity } from "@/lib/bridge";

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
  // Fetch listings for the parent city (filtered by neighborhood later when
  // the Bridge API supports it; for now we pull city-level data)
  const listings = await getListingsByCity(city, 12);

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
                name: `${name} Real Estate`,
                item: `https://nowtb.com/${slug}`,
              },
            ],
          }),
        }}
      />

      {/* === Hero section === */}
      <HeroSection
        title={`${name} Real Estate`}
        subtitle={`Explore homes for sale in ${name}, ${city}, Florida. Updated daily from Stellar MLS.`}
      >
        {/* Back link to parent city hub */}
        <Link
          href={`/${citySlug}`}
          className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors mt-4 text-sm font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All {city} Homes
        </Link>
      </HeroSection>

      {/* === About the neighborhood === */}
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

      {/* === Active listings === */}
      <ListingGrid
        listings={listings}
        title={`Homes for Sale Near ${name}`}
        subtitle={`Active listings in and around ${name}, ${city}.`}
      />

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

      {/* === Contact form === */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Interested in {name}?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry can help you buy or sell in {name}, {city}. Reach out
            today.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`${slug}-neighborhood`}
          />
        </div>
      </section>
    </>
  );
}
