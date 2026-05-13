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
import CountyPage from "@/components/pages/CountyPage";
import RealtorPage from "@/components/pages/RealtorPage";
import NeighborhoodPage from "@/components/pages/NeighborhoodPage";
import SellYourHomeCityPage from "@/components/pages/SellYourHomeCityPage";
import LoanGuidePage from "@/components/pages/LoanGuidePage";
import ComparisonPage from "@/components/pages/ComparisonPage";
import RegionalPage from "@/components/pages/RegionalPage";
import MiscCatchAllPage from "@/components/pages/MiscCatchAllPage";
import {
  cities,
  getCityBySlug,
  getCityTopics,
  getTier1Cities,
  SPOKE_TOPICS,
  type CityData,
} from "@/data/cities";
import { neighborhoods, getNeighborhoodBySlug, getNeighborhoodsByCity } from "@/data/neighborhoods";
import { comparisons, getComparisonBySlug, type ComparisonData } from "@/data/comparisons";
import { regionalPages, getRegionalPageBySlug, type RegionalPageData } from "@/data/regional-pages";
import { miscPages, getMiscPageBySlug, type MiscPageData } from "@/data/misc-pages";
import { guides, type GuideData } from "@/data/guides";
import { getListings, getListingsByCity } from "@/lib/bridge";

// --- County data for county pages ---
const COUNTIES = [
  { slug: "hillsborough-county", name: "Hillsborough" },
  { slug: "pinellas-county", name: "Pinellas" },
  { slug: "pasco-county", name: "Pasco" },
  { slug: "manatee-county", name: "Manatee" },
  { slug: "polk-county", name: "Polk" },
  { slug: "sarasota-county", name: "Sarasota" },
  { slug: "hernando-county", name: "Hernando" },
  { slug: "citrus-county", name: "Citrus" },
];

// --- Loan guide data ---
const LOAN_TYPES = [
  { slug: "fha-loan-florida", loanType: "FHA Loan", label: "FHA Loans in Florida" },
  { slug: "va-loan-florida", loanType: "VA Loan", label: "VA Loans in Florida" },
  { slug: "usda-loan-florida", loanType: "USDA Loan", label: "USDA Loans in Florida" },
  { slug: "conventional-loan-florida", loanType: "Conventional Loan", label: "Conventional Loans in Florida" },
  { slug: "jumbo-loan-florida", loanType: "Jumbo Loan", label: "Jumbo Loans in Florida" },
  { slug: "renovation-loan-florida", loanType: "Renovation Loan", label: "Renovation Loans in Florida" },
  { slug: "reverse-mortgage-florida", loanType: "Reverse Mortgage", label: "Reverse Mortgages in Florida" },
  { slug: "construction-loan-florida", loanType: "Construction Loan", label: "Construction Loans in Florida" },
];

// -----------------------------------------------------------------------------
// Slug parser — determines if the URL is a hub page or a spoke page
// Returns the matched city (and optional topic), or null for 404
// -----------------------------------------------------------------------------

/** All the different page types this route can render */
type PageType =
  | { kind: "hub"; city: CityData }
  | { kind: "spoke"; city: CityData; topic: (typeof SPOKE_TOPICS)[number] }
  | { kind: "county"; countyName: string; countySlug: string }
  | { kind: "realtor"; city: CityData }
  | { kind: "sell-city"; city: CityData }
  | { kind: "loan"; loanType: string; slug: string; label: string }
  | { kind: "neighborhood"; slug: string; name: string; city: string }
  | { kind: "neighborhood-spoke"; slug: string; name: string; city: string }
  | { kind: "neighborhood-realtor"; slug: string; name: string; city: string }
  | { kind: "comparison"; comparison: ComparisonData }
  | { kind: "regional"; page: RegionalPageData }
  | { kind: "misc"; page: MiscPageData }
  | { kind: "guide"; guide: GuideData };

/**
 * Parses a URL slug into a page type.
 * Checks in priority order: county, loan, sell-your-home-{city}, {city}-realtor,
 * direct city hub, {city}-{topic} spoke, then neighborhood fallback.
 */
function parseSlug(slug: string): PageType | null {
  // 1. County pages: hillsborough-county, pinellas-county, etc.
  const county = COUNTIES.find((c) => c.slug === slug);
  if (county) return { kind: "county", countyName: county.name, countySlug: county.slug };

  // 2. Loan guide pages: fha-loan-florida, va-loan-florida, etc.
  const loan = LOAN_TYPES.find((l) => l.slug === slug);
  if (loan) return { kind: "loan", loanType: loan.loanType, slug: loan.slug, label: loan.label };

  // 3. Sell-your-home city pages: sell-your-home-valrico, sell-your-home-brandon
  if (slug.startsWith("sell-your-home-")) {
    const citySlug = slug.replace("sell-your-home-", "");
    const city = getCityBySlug(citySlug);
    if (city) return { kind: "sell-city", city };
  }

  // 4. Direct city slug match (hub page): /valrico, /brandon
  const directCity = getCityBySlug(slug);
  if (directCity) return { kind: "hub", city: directCity };

  // 5. City spoke or realtor pages — iterate longest-slug-first
  const sortedCities = [...cities].sort(
    (a, b) => b.slug.length - a.slug.length
  );

  for (const city of sortedCities) {
    // Realtor pages: valrico-realtor, brandon-realtor
    if (slug === `${city.slug}-realtor`) {
      return { kind: "realtor", city };
    }
    // Spoke pages: valrico-homes-for-sale, brandon-luxury-homes
    for (const topic of SPOKE_TOPICS) {
      if (slug === `${city.slug}-${topic.slug}`) {
        return { kind: "spoke", city, topic };
      }
    }
  }

  // 6. Neighborhood fallback — check if the slug matches a known neighborhood
  const neighborhood = getNeighborhoodBySlug(slug);
  if (neighborhood) {
    return { kind: "neighborhood", slug: neighborhood.slug, name: neighborhood.name, city: neighborhood.city };
  }

  // 7. Neighborhood spoke + realtor pages: {neighborhood}-homes-for-sale, {neighborhood}-realtor
  //    Matches ~260 neighborhoods x 2 page types = ~520 pages from WordPress
  for (const n of neighborhoods) {
    if (slug === `${n.slug}-homes-for-sale`) {
      return { kind: "neighborhood-spoke", slug: n.slug, name: n.name, city: n.city };
    }
    if (slug === `${n.slug}-realtor`) {
      return { kind: "neighborhood-realtor", slug: n.slug, name: n.name, city: n.city };
    }
  }

  // 8. Comparison pages: brandon-vs-riverview, buying-vs-renting-tampa-bay (24 pages)
  const comparison = getComparisonBySlug(slug);
  if (comparison) return { kind: "comparison", comparison };

  // 9. Tampa Bay regional and other city-prefixed pages (34 pages)
  const regional = getRegionalPageBySlug(slug);
  if (regional) return { kind: "regional", page: regional };

  // 10. Guide pages at root level (e.g., /first-time-home-buyer-guide)
  const guide = guides.find((g) => g.slug === slug);
  if (guide) return { kind: "guide", guide };

  // 11. Misc/uncategorized catch-all pages (40+ pages)
  const misc = getMiscPageBySlug(slug);
  if (misc && misc.handling === "catch-all") return { kind: "misc", page: misc };

  return null;
}

// -----------------------------------------------------------------------------
// Revalidate city pages every 5 minutes so mock/live data stays fresh
export const revalidate = 300;

// generateStaticParams — pre-render all hub + spoke URLs at build time
// Returns all city slugs AND all city-topic combos for Tier 1 cities
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const allCities = cities;
  const params: { citySlug: string }[] = [];

  // City hubs + spokes + realtor + sell-your-home per city
  for (const city of allCities) {
    params.push({ citySlug: city.slug });
    params.push({ citySlug: `${city.slug}-realtor` });
    params.push({ citySlug: `sell-your-home-${city.slug}` });

    const topics = getCityTopics(city);
    for (const topic of topics) {
      params.push({ citySlug: `${city.slug}-${topic.slug}` });
    }
  }

  // County pages
  for (const county of COUNTIES) {
    params.push({ citySlug: county.slug });
  }

  // Loan guide pages
  for (const loan of LOAN_TYPES) {
    params.push({ citySlug: loan.slug });
  }

  // Neighborhood pages (461 neighborhoods from data export)
  const { neighborhoods: allNeighborhoods } = await import("@/data/neighborhoods");
  for (const neighborhood of allNeighborhoods) {
    // Base neighborhood page: /bloomingdale
    params.push({ citySlug: neighborhood.slug });
    // Neighborhood homes-for-sale spoke: /bloomingdale-homes-for-sale
    params.push({ citySlug: `${neighborhood.slug}-homes-for-sale` });
    // Neighborhood realtor page: /bloomingdale-realtor
    params.push({ citySlug: `${neighborhood.slug}-realtor` });
  }

  // Comparison pages (24 city-vs-city and concept comparisons)
  for (const comp of comparisons) {
    params.push({ citySlug: comp.slug });
  }

  // Tampa Bay regional pages (34 pages)
  for (const rp of regionalPages) {
    params.push({ citySlug: rp.slug });
  }

  // Guide pages at root level (e.g., /first-time-home-buyer-guide)
  for (const guide of guides) {
    params.push({ citySlug: guide.slug });
  }

  // Misc catch-all pages (40+ uncategorized pages)
  for (const mp of miscPages) {
    if (mp.handling === "catch-all") {
      params.push({ citySlug: mp.slug });
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

  switch (parsed.kind) {
    case "county":
      return {
        title: `${parsed.countyName} County Real Estate`,
        description: `Search homes for sale in ${parsed.countyName} County, FL. Browse cities, listings, and market data. Barrett Henry, REALTOR® at REMAX Collective.`,
      };
    case "loan":
      return {
        title: parsed.label,
        description: `Learn about ${parsed.loanType.toLowerCase()}s in Florida. Eligibility, benefits, and how to apply. Barrett Henry, REALTOR® at REMAX Collective.`,
      };
    case "realtor":
      return {
        title: `${parsed.city.name} REALTOR® — Barrett Henry`,
        description: `Looking for a trusted REALTOR® in ${parsed.city.name}, FL? Barrett Henry has 23+ years of real estate experience. REMAX Collective.`,
      };
    case "sell-city":
      return {
        title: `Sell Your ${parsed.city.name} Home`,
        description: `Sell your ${parsed.city.name} home for top dollar. Free home valuation from Barrett Henry, Broker Associate at REMAX Collective.`,
      };
    case "neighborhood": {
      // Look up the parent city name for the metadata
      const nCity = getCityBySlug(parsed.city);
      const cityName = nCity ? nCity.name : "Tampa Bay";
      return {
        title: `${parsed.name} Real Estate — Homes for Sale`,
        description: `Explore homes for sale in ${parsed.name}, ${cityName}, FL. Updated daily from Stellar MLS. Barrett Henry, Broker Associate at REMAX Collective — 23+ years of real estate experience.`,
      };
    }
    case "neighborhood-spoke": {
      // Neighborhood homes-for-sale page (e.g. /bloomingdale-homes-for-sale)
      const nsCity = getCityBySlug(parsed.city);
      const nsCityName = nsCity ? nsCity.name : "Tampa Bay";
      return {
        title: `${parsed.name} Homes for Sale — ${nsCityName}, FL`,
        description: `Browse homes for sale in ${parsed.name}, ${nsCityName}, FL. Updated daily from Stellar MLS. Barrett Henry, Broker Associate at REMAX Collective — 23+ years of real estate experience.`,
      };
    }
    case "neighborhood-realtor": {
      // Neighborhood realtor page (e.g. /bloomingdale-realtor)
      const nrCity = getCityBySlug(parsed.city);
      const nrCityName = nrCity ? nrCity.name : "Tampa Bay";
      return {
        title: `${parsed.name} REALTOR® — Barrett Henry | ${nrCityName}, FL`,
        description: `Looking for a trusted REALTOR® in ${parsed.name}, ${nrCityName}? Barrett Henry has 23+ years of real estate experience. REMAX Collective.`,
      };
    }
    case "comparison":
      return {
        title: `${parsed.comparison.title} | Barrett Henry, REALTOR®`,
        description: parsed.comparison.excerpt,
      };
    case "regional":
      return {
        title: `${parsed.page.title} | Barrett Henry, REALTOR®`,
        description: parsed.page.excerpt,
      };
    case "misc":
      return {
        title: `${parsed.page.title} | Barrett Henry, REALTOR®`,
        description: parsed.page.excerpt,
      };
    case "guide":
      return {
        title: `${parsed.guide.title} | Barrett Henry, REALTOR®`,
        description: parsed.guide.excerpt,
      };
    default:
      break;
  }

  // Hub and spoke pages — city is guaranteed here since other kinds returned above
  const city = (parsed as { city: CityData }).city;
  const topic = parsed.kind === "spoke" ? parsed.topic : null;

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

  if (!parsed) notFound();

  // Dispatch to the correct page component based on type
  switch (parsed.kind) {
    case "hub":
      return <HubPage city={parsed.city} />;
    case "spoke":
      return <SpokePage city={parsed.city} topic={parsed.topic} slug={citySlug} />;
    case "county": {
      const countyCities = cities.filter((c) => c.county === parsed.countyName);
      return (
        <CountyPage
          countyName={parsed.countyName}
          countySlug={parsed.countySlug}
          cities={countyCities}
        />
      );
    }
    case "realtor":
      return <RealtorPage cityName={parsed.city.name} citySlug={parsed.city.slug} />;
    case "sell-city":
      return <SellYourHomeCityPage cityName={parsed.city.name} citySlug={parsed.city.slug} />;
    case "loan":
      return <LoanGuidePage loanType={parsed.loanType} slug={parsed.slug} />;
    case "neighborhood": {
      // Look up the parent city for back-links and nearby neighborhoods
      const neighborhoodCity = getCityBySlug(parsed.city) || cities[0]; // fallback to first city
      const nearbyNeighborhoods = getNeighborhoodsByCity(parsed.city)
        .filter((n) => n.slug !== parsed.slug) // exclude current neighborhood
        .map((n) => ({ name: n.name, slug: n.slug }));
      return (
        <NeighborhoodPage
          name={parsed.name}
          slug={parsed.slug}
          city={neighborhoodCity.name}
          citySlug={neighborhoodCity.slug}
          nearbyNeighborhoods={nearbyNeighborhoods}
        />
      );
    }
    case "neighborhood-spoke": {
      // Neighborhood homes-for-sale page — reuses NeighborhoodPage with listings focus
      const nsCityData = getCityBySlug(parsed.city) || cities[0];
      const nsNearby = getNeighborhoodsByCity(parsed.city)
        .filter((n) => n.slug !== parsed.slug)
        .map((n) => ({ name: n.name, slug: n.slug }));
      return (
        <NeighborhoodPage
          name={parsed.name}
          slug={parsed.slug}
          city={nsCityData.name}
          citySlug={nsCityData.slug}
          nearbyNeighborhoods={nsNearby}
        />
      );
    }
    case "neighborhood-realtor": {
      // Neighborhood realtor page — reuses RealtorPage with neighborhood name
      const nrCityData = getCityBySlug(parsed.city) || cities[0];
      return (
        <RealtorPage
          cityName={parsed.name}
          citySlug={nrCityData.slug}
        />
      );
    }
    case "comparison":
      return <ComparisonPage comparison={parsed.comparison} />;
    case "regional":
      return <RegionalPage page={parsed.page} />;
    case "misc":
      return <MiscCatchAllPage page={parsed.page} />;
    case "guide": {
      // Render guide inline — reuse the same layout as /guides/[slug]
      const g = parsed.guide;
      return (
        <>
          <HeroSection title={g.title} subtitle={g.excerpt} />
          <div className="container-wide py-12">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-muted mb-8">{g.category} · {g.readingTime}</p>
              {g.sections.map((s) => (
                <div key={s.id} className="mb-8">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-4">{s.heading}</h2>
                  <div className="blog-content" dangerouslySetInnerHTML={{ __html: s.content }} />
                </div>
              ))}
              <div className="mt-12 p-6 bg-primary rounded-xl text-center">
                <h3 className="font-heading text-xl font-bold text-white mb-2">Have Questions?</h3>
                <p className="text-accent mb-4">Barrett Henry has 23+ years of real estate experience.</p>
                <a href="/contact" className="btn-accent">Contact Barrett</a>
              </div>
            </div>
          </div>
        </>
      );
    }
    default:
      notFound();
  }
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
