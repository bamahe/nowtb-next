// =============================================================================
// Dynamic City Hub + Spoke Route
// Handles BOTH city hub pages (e.g. /valrico) and spoke pages
// (e.g. /valrico-homes-for-sale, /valrico-pool-homes) via a single
// dynamic [citySlug] segment.
//
// Logic:
//   1. Parse the slug to determine if it's a hub or spoke page
//   2. Hub: city overview + spoke links + listings + about section
//   3. Spoke: filtered listings for city+topic + breadcrumbs + about section
//   4. If slug doesn't match anything, return 404
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import ContactForm from "@/components/ui/ContactForm";
import SpokeNav from "@/components/city/SpokeNav";
import CityContent from "@/components/city/CityContent";
import {
  cities,
  getCityBySlug,
  getCityTopics,
  getTier1Cities,
  SPOKE_TOPICS,
  type CityData,
} from "@/data/cities";
import { getListings, getListingsByCity } from "@/lib/bridge";

// -----------------------------------------------------------------------------
// Slug parser — determines if the URL is a hub page or a spoke page
// Returns the matched city (and optional topic), or null for 404
// -----------------------------------------------------------------------------

/** Result of parsing a [citySlug] value */
interface ParsedSlug {
  city: CityData;
  topic?: (typeof SPOKE_TOPICS)[number];
}

/**
 * Parses a URL slug into a city + optional topic.
 *
 * Examples:
 *   "valrico"                -> { city: Valrico }
 *   "valrico-homes-for-sale" -> { city: Valrico, topic: homes-for-sale }
 *   "brandon-pool-homes"     -> { city: Brandon, topic: pool-homes }
 *   "nonsense"               -> null (404)
 */
function parseSlug(slug: string): ParsedSlug | null {
  // First: check if it's a direct city slug match (hub page)
  const directCity = getCityBySlug(slug);
  if (directCity) return { city: directCity };

  // Second: check if it matches a {city}-{topic} pattern (spoke page)
  // We iterate cities longest-slug-first so "apollo-beach" matches before "apollo"
  const sortedCities = [...cities].sort(
    (a, b) => b.slug.length - a.slug.length
  );

  for (const city of sortedCities) {
    for (const topic of SPOKE_TOPICS) {
      if (slug === `${city.slug}-${topic.slug}`) {
        // Only allow topics that are actually enabled for this city
        if (city.topics.includes(topic.slug)) {
          return { city, topic };
        }
      }
    }
  }

  // No match — this slug doesn't correspond to any city or spoke page
  return null;
}

// -----------------------------------------------------------------------------
// Revalidate city pages every 5 minutes so mock/live data stays fresh
export const revalidate = 300;

// generateStaticParams — pre-render all hub + spoke URLs at build time
// Returns all city slugs AND all city-topic combos for Tier 1 cities
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const tier1 = getTier1Cities();
  const params: { citySlug: string }[] = [];

  for (const city of tier1) {
    // Hub page: e.g. { citySlug: "valrico" }
    params.push({ citySlug: city.slug });

    // Spoke pages: e.g. { citySlug: "valrico-homes-for-sale" }
    const topics = getCityTopics(city);
    for (const topic of topics) {
      params.push({ citySlug: `${city.slug}-${topic.slug}` });
    }
  }

  return params;
}

// -----------------------------------------------------------------------------
// generateMetadata — dynamic SEO title + description for hub/spoke pages
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}): Promise<Metadata> {
  const { citySlug } = await params;
  const parsed = parseSlug(citySlug);

  // If the slug doesn't resolve, Next.js will render notFound() in the page
  if (!parsed) return {};

  const { city, topic } = parsed;

  if (topic) {
    // Spoke page metadata
    return {
      title: `${topic.label} in ${city.name}`,
      description: `Browse ${topic.label.toLowerCase()} in ${city.name}, ${city.county} County, FL. Updated daily from Stellar MLS. Barrett Henry, Broker Associate at REMAX Collective — 23+ years of real estate experience.`,
      openGraph: {
        title: `${topic.label} in ${city.name} | Barrett Henry, REALTOR®`,
        description: `Search ${topic.label.toLowerCase()} in ${city.name}, FL. Expert guidance from Barrett Henry at REMAX Collective.`,
        url: `/${citySlug}`,
        type: "website",
      },
    };
  }

  // Hub page metadata
  return {
    title: `${city.name} Homes for Sale`,
    description: `Search homes for sale in ${city.name}, ${city.county} County, FL. Updated daily from Stellar MLS. Barrett Henry, Broker Associate at REMAX Collective — 23+ years of real estate experience.`,
    openGraph: {
      title: `${city.name} Homes for Sale | Barrett Henry, REALTOR®`,
      description: `Explore ${city.name} real estate with Barrett Henry at REMAX Collective. Browse listings, market data, and neighborhood info.`,
      url: `/${citySlug}`,
      type: "website",
    },
  };
}

// -----------------------------------------------------------------------------
// Page component — renders either a Hub or Spoke page based on the slug
// -----------------------------------------------------------------------------

export default async function CityPage({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}) {
  const { citySlug } = await params;
  const parsed = parseSlug(citySlug);

  // Slug doesn't match any city or spoke page — show 404
  if (!parsed) notFound();

  const { city, topic } = parsed;

  // Decide if this is a hub page or a spoke page
  if (topic) {
    return <SpokePage city={city} topic={topic} slug={citySlug} />;
  }

  return <HubPage city={city} />;
}

// =============================================================================
// HUB PAGE — city overview with spoke links, listings, and about section
// =============================================================================

async function HubPage({ city }: { city: CityData }) {
  // Fetch the latest listings for this city from Bridge API
  const listings = await getListingsByCity(city.name, 12);

  // Get neighboring cities (same county, excluding current)
  const neighbors = cities.filter(
    (c) => c.county === city.county && c.slug !== city.slug
  );

  return (
    <>
      {/* === Hero section with city name and search bar === */}
      <HeroSection
        title={`${city.name} Homes for Sale`}
        subtitle={city.tagline}
      >
        <SearchBar />
      </HeroSection>

      {/* === Latest listings grid === */}
      <ListingGrid
        listings={listings}
        title={`Latest Listings in ${city.name}`}
        subtitle={`Active homes for sale in ${city.name}, ${city.county} County.`}
      />

      {/* "View all" link if listings were returned */}
      {listings.length > 0 && (
        <div className="container-wide pb-8 text-center">
          <Link
            href={`/${city.slug}-homes-for-sale`}
            className="btn-primary inline-block px-8 py-3"
          >
            View All {city.name} Listings
          </Link>
        </div>
      )}

      {/* === Spoke navigation — links to all topic pages for this city === */}
      <SpokeNav city={city} />

      {/* === About section — city overview content === */}
      <CityContent city={city} />

      {/* === Neighboring cities === */}
      {neighbors.length > 0 && (
        <section className="container-wide py-12">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            Nearby Communities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {neighbors.map((neighbor) => (
              <Link
                key={neighbor.slug}
                href={`/${neighbor.slug}`}
                className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
              >
                {neighbor.name} Homes
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* === Contact form === */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Get Expert Help in {city.name}
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Have questions about {city.name} real estate? Barrett Henry is ready
            to help.
          </p>
          <ContactForm webhookUrl="/api/contact" source={`${city.slug}-hub`} />
        </div>
      </section>
    </>
  );
}

// =============================================================================
// SPOKE PAGE — filtered listings for a specific city + topic
// =============================================================================

async function SpokePage({
  city,
  topic,
  slug,
}: {
  city: CityData;
  topic: (typeof SPOKE_TOPICS)[number];
  slug: string;
}) {
  // Build filter params from the topic's filter config + the city name
  const filterParams = {
    city: city.name,
    ...topic.filter,
    limit: "24",
  } as Record<string, string>;

  // Fetch filtered listings from Bridge API
  let listings: import("@/lib/types").Listing[] = [];
  try {
    const res = await getListings(filterParams);
    listings = res.value || [];
  } catch {
    // If the API call fails, render the page with an empty listing grid
    listings = [];
  }

  return (
    <>
      {/* === BreadcrumbList JSON-LD structured data === */}
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
                name: `${city.name} Homes for Sale`,
                item: `https://nowtb.com/${city.slug}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${topic.label} in ${city.name}`,
                item: `https://nowtb.com/${slug}`,
              },
            ],
          }),
        }}
      />

      {/* === Hero section with topic + city name === */}
      <HeroSection
        title={`${topic.label} in ${city.name}`}
        subtitle={`Browse ${topic.label.toLowerCase()} in ${city.name}, ${city.county} County, Florida.`}
      >
        {/* Back link to city hub */}
        <Link
          href={`/${city.slug}`}
          className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors mt-4 text-sm font-semibold"
        >
          {/* Left arrow */}
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
          All {city.name} Homes
        </Link>
      </HeroSection>

      {/* === Filtered listings grid === */}
      <ListingGrid
        listings={listings}
        title={`${topic.label} in ${city.name}`}
        subtitle={
          listings.length > 0
            ? `Showing ${listings.length} ${topic.label.toLowerCase()} in ${city.name}.`
            : `No ${topic.label.toLowerCase()} are currently listed in ${city.name}. Check back soon or contact Barrett for off-market options.`
        }
      />

      {/* === About section — topic-specific content for this city === */}
      <CityContent city={city} topic={topic} />

      {/* === Other spoke links for this city (highlights current topic) === */}
      <SpokeNav city={city} currentTopic={topic.slug} />

      {/* === Contact form === */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Find {topic.label} in {city.name}
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry can help you find the perfect{" "}
            {topic.label.toLowerCase()} in {city.name}. Reach out today.
          </p>
          <ContactForm webhookUrl="/api/contact" source={`${city.slug}-${topic.slug}`} />
        </div>
      </section>
    </>
  );
}
