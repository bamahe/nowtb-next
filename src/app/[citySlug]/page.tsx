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
import { notFound, permanentRedirect } from "next/navigation";

import HeroSection from "@/components/ui/HeroSection";
import ListingGrid from "@/components/ui/ListingGrid";
import ClientListings from "@/components/ui/ClientListings";
import ClientMarketSnapshot from "@/components/ui/ClientMarketSnapshot";
import ValuationForm from "@/components/ui/ValuationForm";
import SpokeNav from "@/components/city/SpokeNav";
import CityContent from "@/components/city/CityContent";
import CityResources from "@/components/city/CityResources";
import { cleanWpContent, formatPrice } from "@/lib/utils";
import CountyPage from "@/components/pages/CountyPage";
import RealtorPage from "@/components/pages/RealtorPage";
import NeighborhoodPage from "@/components/pages/NeighborhoodPage";
import SellYourHomeCityPage from "@/components/pages/SellYourHomeCityPage";
import LoanGuidePage from "@/components/pages/LoanGuidePage";
import { getLoanContent } from "@/data/loan-content";
import ComparisonPage from "@/components/pages/ComparisonPage";
import RegionalPage from "@/components/pages/RegionalPage";
import MiscCatchAllPage from "@/components/pages/MiscCatchAllPage";
import NeighborhoodGuidePage from "@/components/pages/NeighborhoodGuidePage";
import RemaxOfficePage, { getRemaxOffice } from "@/components/pages/RemaxOfficePage";
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
import { getListings, getListingsByCity, getOpenHouses } from "@/lib/bridge";
import { CITY_FAQS } from "@/data/valrico-faqs";
import { NEIGHBORHOOD_DESCRIPTIONS } from "@/data/neighborhood-descriptions";

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
  | { kind: "guide"; guide: GuideData }
  | { kind: "remax-office"; officeKey: string };

/**
 * Parses a URL slug into a page type.
 */
function parseSlug(slug: string): PageType | "market-update" | "blog-post" | null {
  // 0a. Market update slugs — check directly against market updates data
  if (/housing-market|real-estate-market/.test(slug)) {
    const { getMarketUpdateBySlug } = require("@/lib/market-updates");
    if (getMarketUpdateBySlug(slug)) {
      return "market-update";
    }
  }

  // 0. REMAX office pages: remax-largo, largo-remax, remax-tampa, etc.
  const remaxOffice = getRemaxOffice(slug);
  if (remaxOffice) {
    // Extract the city key from the slug
    const key = slug.replace(/^remax-/, '').replace(/-remax$/, '');
    return { kind: "remax-office", officeKey: key };
  }

  // 1. County pages: hillsborough-county, pinellas-county, etc.
  const county = COUNTIES.find((c) => c.slug === slug);
  if (county) return { kind: "county", countyName: county.name, countySlug: county.slug };

  // 2. Loan guide pages: fha-loan-florida, va-loan-florida, etc.
  const loan = LOAN_TYPES.find((l) => l.slug === slug);
  if (loan) return { kind: "loan", loanType: loan.loanType, slug: loan.slug, label: loan.label };

  // 3. Sell-your-home city pages: both formats supported
  //    sell-your-home-brandon OR brandon-sell-your-home
  if (slug.startsWith("sell-your-home-")) {
    const citySlug = slug.replace("sell-your-home-", "");
    const city = getCityBySlug(citySlug);
    if (city) return { kind: "sell-city", city };
  }
  if (slug.endsWith("-sell-your-home")) {
    const citySlug = slug.replace("-sell-your-home", "");
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

  // 12. Blog posts — checked LAST so they don't interfere with other routes
  const { getPostBySlug } = require("@/lib/posts");
  if (getPostBySlug(slug)) {
    return "blog-post";
  }

  return null;
}

// -----------------------------------------------------------------------------
// ISR: revalidate every 1 hour. This caches rendered pages so only 1 request
// per page per hour hits the Bridge API. With force-dynamic, EVERY visitor
// request triggered a fresh API call — ~3,000 unique pages × crawlers = rate limit.
// After deploy, the first visitor to each page triggers a fresh API call (build
// returns empty via IS_BUILD_TIME), then the result is cached for subsequent visitors.
export const revalidate = 300; // 1 hour, matches bridgeFetch cache
// Allow pages not in generateStaticParams to render on-demand (ISR)
export const dynamicParams = true;

// generateStaticParams — pre-render all hub + spoke URLs at build time
// Returns all city slugs AND all city-topic combos for Tier 1 cities
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const params: { citySlug: string }[] = [];

  // ⚠️ ONLY pre-render pages that DON'T call Bridge API at build time.
  // Pages with listings (hubs, spokes, neighborhoods, counties) render on-demand
  // via ISR — first visitor triggers the API call, result is cached 15 min.
  // This prevents every deploy from flooding Bridge with 3,000+ API calls.

  // Loan guide pages — no API calls, just static content
  for (const loan of LOAN_TYPES) {
    params.push({ citySlug: loan.slug });
  }

  // Comparison pages — concept comparisons don't call API
  for (const comp of comparisons) {
    if (comp.category === "concept") {
      params.push({ citySlug: comp.slug });
    }
  }

  // Tampa Bay regional pages — mostly static content
  for (const rp of regionalPages) {
    params.push({ citySlug: rp.slug });
  }

  // Guide pages — skipped. Config redirects in next.config.mjs redirect
  // /{slug}/ → /guides/{slug}/ before this route is reached. No need to
  // pre-render pages that will never be served.

  // Misc catch-all pages — static content
  for (const mp of miscPages) {
    if (mp.handling === "catch-all") {
      params.push({ citySlug: mp.slug });
    }
  }

  // Blog posts render on-demand via ISR — they have their own /blog/[slug]/ route.
  // Pre-rendering 870+ blog slugs here hits the Vercel route limit (2048).
  // Market updates also render on-demand.
  // Both are still handled by this route's runtime logic (redirect to /blog/ or render).

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

  // Blog posts — redirect metadata points to canonical /blog/ URL
  if (parsed === "blog-post") {
    return {
      alternates: { canonical: `/blog/${citySlug}/` },
      robots: { index: false, follow: true },
    };
  }

  // Market updates — redirect metadata points to canonical /market-updates/ URL
  // Matches the blog-post pattern: noindex + canonical to prevent Google from
  // indexing this duplicate URL alongside /market-updates/{slug}/
  if (parsed === "market-update") {
    return {
      alternates: { canonical: `/market-updates/${citySlug}/` },
      robots: { index: false, follow: true },
    };
  }

  // All dynamic pages get a canonical URL to prevent duplicate content
  // trailingSlash: true is set in next.config.mjs so all canonicals must end with /
  const canonical = `/${citySlug}/`;

  switch (parsed.kind) {
    case "remax-office": {
      const ofc = getRemaxOffice(citySlug);
      const cityName = ofc?.city || parsed.officeKey;
      return {
        title: `REMAX ${cityName} | REMAX Collective`,
        description: `Barrett Henry, Broker Associate at REMAX Collective ${cityName}. 23+ years experience. Search homes, get market data. Call (813) 733-7907.`,
        alternates: { canonical },
        openGraph: {
          title: `REMAX ${cityName} — Barrett Henry, REALTOR®`,
          description: `Your REMAX expert in ${cityName}. 23+ years, FL Broker #BK3313308.`,
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    }
    case "county":
      return {
        title: `${parsed.countyName} County Homes for Sale`,
        description: `Search homes for sale in ${parsed.countyName} County, FL. Browse cities, listings, and market data. Barrett Henry, REALTOR at REMAX Collective. Call (813) 733-7907.`,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.countyName} County Homes for Sale | Barrett Henry, REALTOR®`,
          description: `Search ${parsed.countyName} County real estate. Updated daily from Stellar MLS.`,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    case "loan":
      return {
        title: `${parsed.label}`,
        description: `Learn about ${parsed.loanType.toLowerCase()}s in Florida. Eligibility, benefits, and how to apply. Barrett Henry, REALTOR at REMAX Collective. Call (813) 733-7907.`,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.label} | Barrett Henry, REALTOR®`,
          description: `${parsed.loanType} eligibility, benefits, and how to apply in Florida.`,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    case "realtor":
      return {
        title: `${parsed.city.name} REALTOR® | REMAX Collective`,
        description: `Looking for a trusted REALTOR in ${parsed.city.name}, FL? Barrett Henry has 23+ years of real estate experience. REMAX Collective. Call (813) 733-7907.`,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.city.name} REALTOR® — Barrett Henry | REMAX Collective`,
          description: `Your trusted REALTOR in ${parsed.city.name}, FL. 23+ years of real estate experience.`,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    case "sell-city":
      return {
        title: `Sell Your ${parsed.city.name} Home | Free Valuation`,
        description: `Sell your ${parsed.city.name} home for top dollar. Free home valuation from Barrett Henry, Broker Associate at REMAX Collective. Call (813) 733-7907.`,
        alternates: { canonical },
        openGraph: {
          title: `Sell Your ${parsed.city.name} Home | Free Valuation`,
          description: `Get a free home valuation for your ${parsed.city.name} property. Barrett Henry, REMAX Collective.`,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    case "neighborhood": {
      // Look up the parent city name for the metadata
      const nCity = getCityBySlug(parsed.city);
      const cityName = nCity ? nCity.name : "Tampa Bay";
      // Use curated summary if available, otherwise generic
      const nDesc = NEIGHBORHOOD_DESCRIPTIONS[parsed.slug];
      const metaDesc = nDesc
        ? `${parsed.name} in ${cityName}, FL — ${nDesc.summary} Browse homes for sale. Barrett Henry, REMAX Collective.`
        : `Explore homes for sale in ${parsed.name}, ${cityName}, FL. Updated daily from Stellar MLS. Barrett Henry, REMAX Collective. Call (813) 733-7907.`;
      return {
        title: `${parsed.name} Homes for Sale | ${cityName}, FL`,
        description: metaDesc,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.name} Homes for Sale | ${cityName}, FL`,
          description: nDesc ? nDesc.summary : `Browse homes in ${parsed.name}, ${cityName}. Updated daily from Stellar MLS.`,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    }
    case "neighborhood-spoke": {
      // Neighborhood homes-for-sale page (e.g. /bloomingdale-homes-for-sale)
      const nsCity = getCityBySlug(parsed.city);
      const nsCityName = nsCity ? nsCity.name : "Tampa Bay";
      return {
        title: `${parsed.name} Homes for Sale — ${nsCityName}, FL`,
        description: `Browse homes for sale in ${parsed.name}, ${nsCityName}, FL. Updated daily from Stellar MLS. Barrett Henry, REMAX Collective. Call (813) 733-7907.`,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.name} Homes for Sale — ${nsCityName}, FL`,
          description: `Current listings in ${parsed.name}, ${nsCityName}. Updated daily from Stellar MLS.`,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    }
    case "neighborhood-realtor": {
      // Neighborhood realtor page (e.g. /bloomingdale-realtor)
      const nrCity = getCityBySlug(parsed.city);
      const nrCityName = nrCity ? nrCity.name : "Tampa Bay";
      return {
        title: `${parsed.name} REALTOR® | ${nrCityName}, FL`,
        description: `Looking for a trusted REALTOR in ${parsed.name}, ${nrCityName}? Barrett Henry has 23+ years of real estate experience. REMAX Collective. Call (813) 733-7907.`,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.name} REALTOR® — Barrett Henry | ${nrCityName}, FL`,
          description: `Your local REALTOR in ${parsed.name}, ${nrCityName}. 23+ years of experience.`,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    }
    case "comparison":
      return {
        title: `${parsed.comparison.title}`,
        description: parsed.comparison.excerpt,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.comparison.title} | Barrett Henry, REALTOR®`,
          description: parsed.comparison.excerpt,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    case "regional":
      return {
        title: `${parsed.page.title}`,
        description: parsed.page.excerpt,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.page.title} | Barrett Henry, REALTOR®`,
          description: parsed.page.excerpt,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    case "misc":
      return {
        title: `${parsed.page.title}`,
        description: parsed.page.excerpt,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.page.title} | Barrett Henry, REALTOR®`,
          description: parsed.page.excerpt,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    case "guide":
      // Redirect metadata — noindex + canonical to prevent Google from
      // indexing /{slug}/ alongside /guides/{slug}/ (URL cannibalization)
      return {
        alternates: { canonical: `/guides/${parsed.guide.slug}/` },
        robots: { index: false, follow: true },
      };
    default:
      break;
  }

  // Hub and spoke pages — city is guaranteed here since other kinds returned above
  const city = (parsed as { city: CityData }).city;
  const topic = parsed.kind === "spoke" ? parsed.topic : null;

  if (topic) {
    // Home valuation spoke pages get custom metadata
    if (topic.slug === "home-valuation") {
      return {
        title: `Free Home Valuation in ${city.name}, FL`,
        description: `Find out what your ${city.name} home is worth. Get a free Comparative Market Analysis from Barrett Henry, Broker Associate at REMAX Collective. Call (813) 733-7907.`,
        alternates: { canonical },
        robots: { index: true, follow: true },
        openGraph: {
          title: `Free Home Valuation in ${city.name}, FL | Barrett Henry`,
          description: `Get a professional CMA for your ${city.name} property. Barrett Henry, REMAX Collective.`,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    }

    // Property management spoke pages get custom metadata for ViVi PM
    if (topic.slug === "property-management") {
      return {
        title: `${city.name} Property Management | ViVi PM`,
        description: `Professional property management in ${city.name}, FL. Tenant screening, rent collection, maintenance, and inspections by ViVi PM. Call (813) 733-7907.`,
        alternates: { canonical },
        robots: { index: true, follow: true },
        openGraph: {
          title: `${city.name} Property Management | ViVi PM`,
          description: `Full-service property management in ${city.name}, FL by ViVi PM. Barrett Henry, Broker Associate at REMAX Collective.`,
          url: canonical,
          type: "website",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
      };
    }

    // Spoke page metadata
    return {
      title: `${topic.label} in ${city.name}, FL`,
      description: `Browse ${topic.label.toLowerCase()} in ${city.name}, FL. Updated daily from Stellar MLS. Barrett Henry, REMAX Collective. Call (813) 733-7907.`,
      alternates: { canonical },
      openGraph: {
        title: `${topic.label} in ${city.name} | Barrett Henry, REALTOR®`,
        description: `Search ${topic.label.toLowerCase()} in ${city.name}, FL. Expert guidance from Barrett Henry at REMAX Collective.`,
        url: canonical,
        type: "website",
        images: [{ url: "/og-default.png", width: 1200, height: 630 }],
      },
    };
  }

  // Hub page metadata
  return {
    title: `${city.name} Real Estate & Homes for Sale`,
    description: `Search ${city.name} real estate and homes for sale in FL. Updated daily from Stellar MLS. Barrett Henry, Broker Associate at REMAX Collective. Call (813) 733-7907.`,
    alternates: { canonical },
    openGraph: {
      title: `${city.name} Homes for Sale | Barrett Henry, REALTOR®`,
      description: `Explore ${city.name} real estate with Barrett Henry at REMAX Collective. Browse listings, market data, and neighborhood info.`,
      url: canonical,
      type: "website",
      images: [{ url: "/og-default.png", width: 1200, height: 630 }],
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

  // Blog posts — 308 permanent redirect to canonical /blog/{slug}/ URL
  // Must be permanentRedirect (308) not redirect (307) so Google consolidates
  // both URLs. Using temporary 307 caused GSC to keep indexing /{slug}/ AND
  // /blog/{slug}/ separately (URL cannibalization).
  if (parsed === "blog-post") {
    permanentRedirect(`/blog/${citySlug}/`);
  }

  // Market updates — 308 permanent redirect to canonical /market-updates/{slug}/ URL
  // Must be permanentRedirect (308) not redirect (307) so Google consolidates
  // both URLs. Previously this rendered the full page here, creating duplicate
  // content with /market-updates/{slug}/ (URL cannibalization).
  if (parsed === "market-update") {
    permanentRedirect(`/market-updates/${citySlug}/`);
  }

  // Southoak — redirect to nested /brandon/southoak/ canonical URL
  // The standalone page at /brandon/southoak/ has custom content and schema.
  if (citySlug === "southoak") {
    permanentRedirect("/brandon/southoak/");
  }

  // Dispatch to the correct page component based on type
  const page = parsed as PageType;
  switch (page.kind) {
    case "hub":
      return <HubPage city={page.city} />;
    case "spoke":
      // Neighborhood guide gets its own dedicated scrollable page component
      if (page.topic.slug === "neighborhood-guide") {
        return <NeighborhoodGuidePage city={page.city} />;
      }
      // Property management spoke pages get a dedicated ViVi PM page
      if (page.topic.slug === "property-management") {
        return <PropertyManagementSpokePage city={page.city} />;
      }
      // Home valuation spoke pages — HomeValuationSpokePage not yet built, falls through to SpokePage
      // TODO: replace SpokePage with HomeValuationSpokePage once component is created
      return <SpokePage city={page.city} topic={page.topic} slug={citySlug} />;
    case "remax-office":
      return <RemaxOfficePage officeKey={page.officeKey} />;
    case "county": {
      const countyCities = cities.filter((c) => c.county === page.countyName);
      return (
        <CountyPage
          countyName={page.countyName}
          countySlug={page.countySlug}
          cities={countyCities}
        />
      );
    }
    case "realtor":
      return <RealtorPage city={page.city} />;
    case "sell-city":
      return <SellYourHomeCityPage cityName={page.city.name} citySlug={page.city.slug} zipCodes={page.city.zip_codes} />;
    case "loan": {
      // Look up authoritative loan content from data file (falls back to defaults if not found)
      const content = getLoanContent(page.slug);
      return (
        <LoanGuidePage
          loanType={page.loanType}
          slug={page.slug}
          description={content?.description}
          requirements={content?.requirements}
          benefits={content?.benefits}
          faq={content?.faq}
          proTips={content?.proTips}
        />
      );
    }
    case "neighborhood": {
      // Look up the parent city for back-links and nearby neighborhoods
      const neighborhoodCity = getCityBySlug(page.city) || cities[0]; // fallback to first city
      const nearbyNeighborhoods = getNeighborhoodsByCity(page.city)
        .filter((n) => n.slug !== page.slug) // exclude current neighborhood
        .map((n) => ({ name: n.name, slug: n.slug }));
      return (
        <NeighborhoodPage
          name={page.name}
          slug={page.slug}
          city={neighborhoodCity.name}
          citySlug={neighborhoodCity.slug}
          nearbyNeighborhoods={nearbyNeighborhoods}
        />
      );
    }
    case "neighborhood-spoke": {
      // Neighborhood homes-for-sale page — reuses NeighborhoodPage with listings focus
      const nsCityData = getCityBySlug(page.city) || cities[0];
      const nsNearby = getNeighborhoodsByCity(page.city)
        .filter((n) => n.slug !== page.slug)
        .map((n) => ({ name: n.name, slug: n.slug }));
      return (
        <NeighborhoodPage
          name={page.name}
          slug={page.slug}
          city={nsCityData.name}
          citySlug={nsCityData.slug}
          nearbyNeighborhoods={nsNearby}
        />
      );
    }
    case "neighborhood-realtor": {
      // Neighborhood realtor page — reuses RealtorPage with neighborhood name
      // Spread the parent city data but override the display name with the neighborhood name
      const nrCityData = getCityBySlug(page.city) || cities[0];
      return (
        <RealtorPage
          city={{ ...nrCityData, name: page.name }}
        />
      );
    }
    case "comparison":
      return <ComparisonPage comparison={page.comparison} />;
    case "regional":
      return <RegionalPage page={page.page} />;
    case "misc":
      return <MiscCatchAllPage page={page.page} />;
    case "guide":
      // 308 permanent redirect to canonical /guides/{slug}/ URL
      // Prevents duplicate content — the dedicated /guides/[slug] route
      // has the full layout with sidebar, schema, related guides, etc.
      // Config redirects in next.config.mjs also handle this, but this
      // serves as a belt-and-suspenders fallback for runtime requests.
      permanentRedirect(`/guides/${page.guide.slug}/`);
    default:
      notFound();
  }
}

// =============================================================================
// HUB PAGE — city overview with spoke links, listings, and about section
// =============================================================================

async function HubPage({ city }: { city: CityData }) {
  // LISTINGS NOW LOAD CLIENT-SIDE to prevent server-side API calls from
  // burning through the Bridge rate limit. Pages render static SEO content
  // server-side, listings appear after page load via /api/listings.
  // This means: deploys = 0 API calls, crawlers = 0 API calls,
  // only real user visits trigger listing fetches.

  // No server-side market stats — listings load client-side now
  const listings: never[] = [];
  const rentalListings: never[] = [];
  const soldListings: never[] = [];
  const totalActive = 0;
  const totalRentals = 0;
  const avgPrice = 0;
  const avgDom = 0;
  const priceRange = { low: 0, high: 0 };

  // Get neighboring cities (same county, excluding current)
  const neighbors = cities.filter(
    (c) => c.county === city.county && c.slug !== city.slug
  );

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
            ],
          }),
        }}
      />

      {/* === Compact hero with breadcrumb + CTA (matches spoke pattern) === */}
      <section className="bg-primary pt-36 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">{city.name}</span>
          </nav>

          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">
            Homes for Sale in {city.name}
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            {city.county} County, Florida — Updated daily from Stellar MLS
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

      {/* === Quick Nav Tabs — jump to For Sale / Rentals / Sold === */}
      <section className="bg-white border-b border-border sticky top-16 z-20">
        <div className="container-wide">
          <nav className="flex items-center gap-0" aria-label="Listing sections">
            <a href="#for-sale" className="font-body text-xs tracking-[0.12em] uppercase px-5 py-4 border-b-2 border-primary text-primary font-medium">
              For Sale
            </a>
            <a href="#sold" className="font-body text-xs tracking-[0.12em] uppercase px-5 py-4 border-b-2 border-transparent text-muted hover:text-primary transition-colors">
              Recently Sold
            </a>
            <Link href={`/${city.slug}-rentals/`} className="font-body text-xs tracking-[0.12em] uppercase px-5 py-4 border-b-2 border-transparent text-muted hover:text-primary transition-colors">
              Rentals
            </Link>
            <a href="#neighborhoods" className="font-body text-xs tracking-[0.12em] uppercase px-5 py-4 border-b-2 border-transparent text-muted hover:text-primary transition-colors">
              Neighborhoods
            </a>
            <a href="#about" className="font-body text-xs tracking-[0.12em] uppercase px-5 py-4 border-b-2 border-transparent text-muted hover:text-primary transition-colors">
              About {city.name}
            </a>
            <a href="#faq" className="font-body text-xs tracking-[0.12em] uppercase px-5 py-4 border-b-2 border-transparent text-muted hover:text-primary transition-colors">
              FAQ
            </a>
          </nav>
        </div>
      </section>

      {/* === Market Stats Bar === */}
      {listings.length > 0 && (
        <section className="bg-white border-b border-border">
          <div className="container-wide py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="font-heading font-bold text-2xl md:text-3xl text-primary">
                  {totalActive.toLocaleString()}
                </p>
                <p className="font-body text-xs tracking-[0.15em] uppercase text-muted mt-1">
                  Active Listings
                </p>
              </div>
              <div>
                <p className="font-heading font-bold text-2xl md:text-3xl text-primary">
                  {formatPrice(avgPrice)}
                </p>
                <p className="font-body text-xs tracking-[0.15em] uppercase text-muted mt-1">
                  Avg. List Price
                </p>
              </div>
              <div>
                <p className="font-heading font-bold text-2xl md:text-3xl text-primary">
                  {formatPrice(priceRange.low)} – {formatPrice(priceRange.high)}
                </p>
                <p className="font-body text-xs tracking-[0.15em] uppercase text-muted mt-1">
                  Price Range
                </p>
              </div>
              <div>
                <p className="font-heading font-bold text-2xl md:text-3xl text-primary">
                  {avgDom}
                </p>
                <p className="font-body text-xs tracking-[0.15em] uppercase text-muted mt-1">
                  Avg. Days on Market
                </p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link
                href={`/properties/?q=${encodeURIComponent(city.name)}`}
                className="font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors"
              >
                View All {totalActive.toLocaleString()} Listings in {city.name} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* === Latest listings — loads CLIENT-SIDE to avoid server API calls === */}
      <div id="for-sale" />
      <ClientListings
        zipCodes={city.zip_codes}
        title={`Homes for Sale in ${city.name}`}
        subtitle={`Active listings in ${city.name}, ${city.county} County — updated from Stellar MLS.`}
        limit={24}
        areaName={city.name}
      />

      {/* === MLS disclaimer — only shown when listings are displayed === */}
      {listings.length > 0 && (
        <section className="container-wide pb-4">
          <p className="font-body text-xs text-muted/60 leading-relaxed max-w-4xl">
            Listing information provided by Stellar MLS. IDX information is for personal, non-commercial use only. Data is deemed reliable but not guaranteed. All properties are subject to prior sale, change, or withdrawal.
          </p>
        </section>
      )}

      {/* === Spoke navigation — links to all topic pages for this city === */}
      <SpokeNav city={city} />

      {/* === About section — city overview content === */}
      <div id="about" />
      <CityContent city={city} />

      {/* === Resources & internal links — neighborhoods, loans, guides, blog posts === */}
      <CityResources city={city} />

      {/* === Recently Sold — client-side === */}
      <div id="sold" />
      <ClientListings
        zipCodes={city.zip_codes}
        title={`Recently Sold in ${city.name}`}
        subtitle={`Recent sales in ${city.name} — see what homes are selling for.`}
        limit={8}
        filters={{ status: "Closed", sort: "ClosePrice desc" }}
        showFilters={false}
      />

      {/* === Rentals link === */}
      <section className="container-wide py-8 text-center">
        <Link
          href={`/${city.slug}-rentals/`}
          className="btn-secondary inline-block px-8 py-3"
        >
          Browse Rentals in {city.name}
        </Link>
      </section>

      {/* === FAQ Section — uses city-specific FAQs when available, generic fallback otherwise === */}
      {(() => {
        // Check for city-specific FAQs (e.g. Valrico has detailed, useful answers)
        const specificFaqs = CITY_FAQS[city.slug];
        const faqs = specificFaqs
          ? specificFaqs.map((f) => ({
              question: f.question,
              answerText: f.answer,
              answerHtml: f.answerHtml,
            }))
          : [
              {
                question: `What is the average home price in ${city.name}, FL?`,
                answerText: `Home prices in ${city.name} vary by neighborhood, property type, and condition. Browse current active listings above for the most up-to-date pricing. Contact Barrett Henry at (813) 733-7907 for a personalized market analysis.`,
                answerHtml: `Home prices in <strong>${city.name}</strong> vary by neighborhood, property type, and condition. Browse current active listings above for the most up-to-date pricing. Contact <strong>Barrett Henry</strong> at <a href="tel:+18137337907" class="text-link hover:underline"><strong>(813) 733-7907</strong></a> for a personalized market analysis.`,
              },
              {
                question: `Is ${city.name} a good place to live?`,
                answerText: `${city.name} is located in ${city.county} County, Florida. ${city.tagline}. With access to Tampa Bay's job market, beaches, and amenities, ${city.name} is a popular choice for families, retirees, and investors.`,
                answerHtml: `${city.name} is located in ${city.county} County, Florida. ${city.tagline}. With access to Tampa Bay's job market, beaches, and amenities, ${city.name} is a popular choice for families, retirees, and investors.`,
              },
              {
                question: `How do I buy a home in ${city.name}?`,
                answerText: `Start by getting pre-approved for a mortgage, then work with a local REALTOR who knows the ${city.name} market. Barrett Henry and The NOW Team have 23+ years of experience helping buyers in ${city.county} County. Call (813) 733-7907 to get started.`,
                answerHtml: `Start by getting pre-approved for a mortgage, then work with a local <strong>REALTOR®</strong> who knows the ${city.name} market. <strong>Barrett Henry</strong> and The NOW Team have 23+ years of experience helping buyers in <strong>${city.county} County</strong>. Call <a href="tel:+18137337907" class="text-link hover:underline"><strong>(813) 733-7907</strong></a> to get started.`,
              },
              {
                question: `What ZIP codes are in ${city.name}?`,
                answerText: `${city.name} covers ZIP codes ${city.zip_codes.join(", ")}. Each ZIP code may include different neighborhoods and school zones.`,
                answerHtml: `${city.name} covers ZIP codes ${city.zip_codes.join(", ")}. Each ZIP code may include different neighborhoods and school zones.`,
              },
            ];

        return (
          <section className="container-wide py-12">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: f.answerText,
                    },
                  })),
                }),
              }}
            />
            <h2 id="faq" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-8">
              Frequently Asked Questions About {city.name}
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className={i < faqs.length - 1 ? "border-b border-gray-100 pb-6" : "pb-6"}>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    {faq.question}
                  </h3>
                  <p
                    className="font-body text-muted font-light leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* === Neighborhoods in this city === */}
      {(() => {
        const cityNeighborhoods = getNeighborhoodsByCity(city.slug);
        if (cityNeighborhoods.length === 0) return null;
        return (
          <section id="neighborhoods" className="container-wide py-12">
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">
              Neighborhoods in {city.name}
            </h3>
            <p className="font-body text-muted font-light mb-6">
              Explore {cityNeighborhoods.length} neighborhoods and communities in {city.name}, {city.county} County.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cityNeighborhoods.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${n.slug}/`}
                  className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
                >
                  {n.name}
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* === Nearby cities in the same county === */}
      {neighbors.length > 0 && (
        <section className="container-wide py-12">
          <h3 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            Nearby Communities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {neighbors.map((neighbor) => (
              <Link
                key={neighbor.slug}
                href={`/${neighbor.slug}/`}
                className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
              >
                {neighbor.name} Homes
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* === ViVi PM callout — rental property management === */}
      <section className="container-wide py-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-lg md:text-xl text-primary mb-1">
              Own rental property in {city.name}?
            </p>
            <p className="font-body text-muted text-sm">
              Let ViVi PM handle the management. Tenant screening, maintenance, rent collection, and more.
            </p>
          </div>
          <Link
            href="/property-management/"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded text-sm hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            Learn About ViVi PM
          </Link>
        </div>
      </section>

      {/* === CTA bar (matches spoke pattern) === */}
      <section className="bg-primary py-12">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Looking for homes in {city.name}?
            </p>
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
  // Fetch filtered listings from Bridge API
  let listings: import("@/lib/types").Listing[] = [];
  let totalFiltered = 0;

  // Open house pages use the dedicated getOpenHouses function which handles
  // the OpenHouseStartTime date range filter correctly
  const isOpenHouse = topic.slug === "open-houses";

  // Housing market pages get extra sold listings for computing real stats
  const isHousingMarket = topic.slug === "housing-market";
  let soldListings: import("@/lib/types").Listing[] = [];

  // LISTINGS NOW LOAD CLIENT-SIDE — no server-side API calls on spoke pages.
  // This prevents Bridge API rate limiting from deploys and crawlers.

  // Find a market update post for this city if one exists
  // (passed to ClientMarketSnapshot so it can render the "View Report" link)
  // Market update slugs follow pattern: "{city-slug}-housing-market-update"
  const { getAllMarketUpdates } = await import("@/lib/market-updates");
  const allUpdates = getAllMarketUpdates();
  const marketUpdateSlug = allUpdates.find(u =>
    u.slug.startsWith(city.slug + "-housing-market") ||
    u.slug.startsWith(city.slug + "-real-estate-market")
  )?.slug;

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

      {/* === Hero — compact with breadcrumb + CTA === */}
      <section className="bg-primary pt-36 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${city.slug}`} className="hover:text-white/80 transition-colors">{city.name}</Link>
            <span>/</span>
            <span className="text-accent">{topic.label}</span>
          </nav>

          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">
            {topic.label} in {city.name}
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            {city.county} County, Florida — Updated daily from Stellar MLS
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

      {/* === Housing Market Stats — CLIENT-SIDE only on housing-market spoke pages === */}
      {/* Uses ClientMarketSnapshot so data fetches in the browser (not at build time). */}
      {/* The old server-side version always showed "—" because listings=[] at build. */}
      {isHousingMarket && (
        <ClientMarketSnapshot
          cityName={city.name}
          zipCodes={city.zip_codes}
          marketUpdateSlug={marketUpdateSlug}
        />
      )}

      {/* === Listings — loads CLIENT-SIDE to avoid API rate limits === */}
      <ClientListings
        zipCodes={city.zip_codes}
        title={`${topic.label} in ${city.name}`}
        subtitle={topic.slug === "recently-sold"
          ? `Recent sales in ${city.name}, ${city.county} County — see what homes are selling for.`
          : `Active ${topic.label.toLowerCase()} in ${city.name}, ${city.county} County.`}
        limit={48}
        filters={topic.filter as Record<string, string>}
        areaName={city.name}
        showFilters={topic.slug !== "recently-sold"}
      />

      {/* keeping this hidden to avoid breaking the JSX below */}
      {false && (
        <section className="container-wide py-12">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center max-w-2xl mx-auto">
            <p className="font-heading text-lg font-bold text-primary mb-2">
              placeholder
            </p>
            <p className="font-body text-muted text-sm mb-4">
              placeholder
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

      {/* === SEO content — clean single column, no boilerplate === */}
      <CityContent city={city} topic={topic} />

      {/* === Explore more — spoke nav === */}
      <SpokeNav city={city} currentTopic={topic.slug} />

      {/* === Contact — single clean CTA bar, no full form === */}
      <section className="bg-primary py-12">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Looking for {topic.label.toLowerCase()} in {city.name}?
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
// HOME VALUATION SPOKE PAGE — city-specific valuation form + CMA content
// Renders at /{city}-home-valuation/ for every city in the system
// =============================================================================

function HomeValuationSpokePage({ city }: { city: CityData }) {
  return (
    <>
      {/* === BreadcrumbList JSON-LD === */}
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
                name: `Free Home Valuation in ${city.name}`,
                item: `https://nowtb.com/${city.slug}-home-valuation`,
              },
            ],
          }),
        }}
      />

      {/* === Compact navy hero === */}
      <section className="bg-primary pt-36 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${city.slug}`} className="hover:text-white/80 transition-colors">{city.name}</Link>
            <span>/</span>
            <span className="text-accent">Free Home Valuation</span>
          </nav>

          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">
            Free Home Valuation in {city.name}, FL
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            Find out what your {city.name} home is worth with a professional Comparative Market Analysis from Barrett Henry, Broker Associate at REMAX Collective.
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
              href="/free-home-valuation/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Learn About Our CMA Process
            </Link>
          </div>
        </div>
      </section>

      {/* === Valuation form section === */}
      <section className="container-wide py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-bold text-2xl text-primary mb-2 text-center">
            Request Your Free {city.name} Home Valuation
          </h2>
          <p className="font-body text-muted text-sm text-center mb-8">
            Fill out the details below and Barrett will prepare a personalized CMA for your {city.name} property within 24 hours.
          </p>
          <ValuationForm initialCity={city.name} />
        </div>
      </section>

      {/* === Why get a professional valuation === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            Why Get a Professional Home Valuation in {city.name}?
          </h2>
          <div className="space-y-4 font-body text-muted leading-relaxed">
            <p>
              Online home value estimates can be off by tens of thousands of dollars because they rely on algorithms that
              don&apos;t account for your home&apos;s unique features, condition, or the {city.name} micro-market. A professional
              Comparative Market Analysis (CMA) from a local REALTOR gives you an accurate picture of what buyers in
              {" "}{city.name} are actually paying right now.
            </p>
            <p>
              Barrett Henry has 23+ years of real estate experience and deep knowledge of {city.county} County
              neighborhoods. His CMA compares your home to recently sold properties in {city.name} that match your home&apos;s
              size, condition, and features. This gives you a reliable price range backed by real transaction data from
              Stellar MLS.
            </p>
            <p>
              Whether you are planning to sell soon or just want to know where you stand, a free home valuation is the
              smart first step. There is no obligation and no pressure. Just honest numbers from someone who knows the
              {" "}{city.name} market.
            </p>
          </div>
        </div>
      </section>

      {/* === What affects home values === */}
      <section className="container-wide py-12 max-w-3xl">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
          What Affects Home Values in {city.name}?
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-body text-muted">
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">&#8226;</span>
            <span>Location within {city.name} and proximity to schools, shopping, and major roads</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">&#8226;</span>
            <span>School zones and district ratings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">&#8226;</span>
            <span>Lot size and usable outdoor space</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">&#8226;</span>
            <span>Kitchen, bathroom, and flooring upgrades</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">&#8226;</span>
            <span>Pool, screened lanai, or outdoor kitchen</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">&#8226;</span>
            <span>Waterfront or water-view access</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">&#8226;</span>
            <span>HOA fees, CDD assessments, and deed restrictions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">&#8226;</span>
            <span>Roof age, HVAC condition, and major systems</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">&#8226;</span>
            <span>Current {city.name} market conditions (supply, demand, days on market)</span>
          </li>
        </ul>
      </section>

      {/* === How Barrett's CMA works === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-8">
            How Barrett&apos;s CMA Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white font-heading font-bold text-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Submit Your Details</h3>
              <p className="font-body text-muted text-sm">
                Fill out the form above with your property address, features, and condition. The more details you provide, the more accurate your valuation.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white font-heading font-bold text-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Barrett Runs the Numbers</h3>
              <p className="font-body text-muted text-sm">
                Barrett analyzes recent sales, active listings, and pending contracts in {city.name} to build a detailed comparison of homes similar to yours.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white font-heading font-bold text-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Get Your Report</h3>
              <p className="font-body text-muted text-sm">
                Within 24 hours you will receive a professional CMA report with your estimated home value, comparable sales data, and pricing recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === Internal links === */}
      <section className="container-wide py-12 max-w-3xl">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={`/${city.slug}/`}
            className="inline-flex items-center gap-2 border border-gray-200 text-primary font-semibold px-6 py-3 rounded text-sm hover:border-accent hover:bg-accent/10 transition-colors"
          >
            {city.name} Homes for Sale
          </Link>
          <Link
            href="/free-home-valuation/"
            className="inline-flex items-center gap-2 border border-gray-200 text-primary font-semibold px-6 py-3 rounded text-sm hover:border-accent hover:bg-accent/10 transition-colors"
          >
            Free Home Valuation
          </Link>
          <Link
            href={`/sell-your-home-${city.slug}/`}
            className="inline-flex items-center gap-2 border border-gray-200 text-primary font-semibold px-6 py-3 rounded text-sm hover:border-accent hover:bg-accent/10 transition-colors"
          >
            Sell Your {city.name} Home
          </Link>
        </div>
      </section>

      {/* === Spoke nav === */}
      <SpokeNav city={city} currentTopic="home-valuation" />

      {/* === Bottom CTA bar === */}
      <section className="bg-primary py-12">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Thinking about selling in {city.name}?
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
// PROPERTY MANAGEMENT SPOKE PAGE — city-specific ViVi PM page
// Renders at /{city}-property-management/ for every city in the system.
// Highlights ViVi PM services, links to the main /property-management/ page,
// and mentions Best Bay Services (run by James Evans) for maintenance.
// =============================================================================

function PropertyManagementSpokePage({ city }: { city: CityData }) {
  // Get neighboring cities for the hub-to-spoke nav at the bottom
  const neighbors = cities.filter(
    (c) => c.county === city.county && c.slug !== city.slug
  );

  // FAQs for this city's property management page
  const faqs = [
    {
      question: `How much does property management cost in ${city.name}?`,
      answerText: `ViVi PM offers competitive management fees for ${city.name} rental properties. Pricing depends on property type, number of units, and services needed. Contact Barrett Henry at (813) 733-7907 for a free rental analysis and custom quote.`,
      answerHtml: `ViVi PM offers competitive management fees for <strong>${city.name}</strong> rental properties. Pricing depends on property type, number of units, and services needed. Contact <strong>Barrett Henry</strong> at <a href="tel:+18137337907" class="text-link hover:underline"><strong>(813) 733-7907</strong></a> for a free rental analysis and custom quote.`,
    },
    {
      question: `What does a property manager do in ${city.name}?`,
      answerText: `A property manager handles the day-to-day operations of your rental property so you do not have to. ViVi PM covers tenant screening, lease preparation, rent collection, maintenance coordination, property inspections, and financial reporting for ${city.name} rental owners.`,
      answerHtml: `A property manager handles the day-to-day operations of your rental property so you do not have to. <strong>ViVi PM</strong> covers tenant screening, lease preparation, rent collection, maintenance coordination, property inspections, and financial reporting for <strong>${city.name}</strong> rental owners.`,
    },
    {
      question: `How does ViVi PM screen tenants in ${city.name}?`,
      answerText: `ViVi PM runs full background checks including credit reports, criminal history, eviction records, income verification, and rental history review. Every applicant goes through the same thorough process before any lease is signed.`,
      answerHtml: `ViVi PM runs full background checks including credit reports, criminal history, eviction records, income verification, and rental history review. Every applicant goes through the same thorough process before any lease is signed.`,
    },
    {
      question: `Who handles maintenance for ViVi PM properties in ${city.name}?`,
      answerText: `Maintenance is coordinated through Best Bay Services, a trusted local handyman and home services company run by James Evans. They handle repairs, turnovers, and routine maintenance for ViVi PM properties across Tampa Bay, including ${city.name}.`,
      answerHtml: `Maintenance is coordinated through <strong>Best Bay Services</strong>, a trusted local handyman and home services company run by <strong>James Evans</strong>. They handle repairs, turnovers, and routine maintenance for ViVi PM properties across Tampa Bay, including <strong>${city.name}</strong>.`,
    },
    {
      question: `Can I still sell my ${city.name} rental property while it is managed by ViVi PM?`,
      answerText: `Yes. Barrett Henry is both a Broker Associate at REMAX Collective and the owner of ViVi PM. If you decide to sell your ${city.name} investment property, Barrett can handle the sale while managing the tenant relationship through closing.`,
      answerHtml: `Yes. <strong>Barrett Henry</strong> is both a Broker Associate at REMAX Collective and the owner of ViVi PM. If you decide to sell your <strong>${city.name}</strong> investment property, Barrett can handle the sale while managing the tenant relationship through closing.`,
    },
  ];

  return (
    <>
      {/* === BreadcrumbList JSON-LD === */}
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
                name: `Property Management in ${city.name}`,
                item: `https://nowtb.com/${city.slug}-property-management`,
              },
            ],
          }),
        }}
      />

      {/* === FAQPage JSON-LD structured data === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answerText,
              },
            })),
          }),
        }}
      />

      {/* === Navy hero === */}
      <section className="bg-primary pt-36 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${city.slug}`} className="hover:text-white/80 transition-colors">{city.name}</Link>
            <span>/</span>
            <span className="text-accent">Property Management</span>
          </nav>

          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">
            Property Management in {city.name}, FL
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            Full-service rental property management by ViVi PM. Tenant screening, rent collection, maintenance, inspections, and financial reporting for {city.name} property owners.
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
              href="/property-management/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Learn About ViVi PM
            </Link>
          </div>
        </div>
      </section>

      {/* === Why hire a property manager === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            Why Hire a Property Manager in {city.name}?
          </h2>
          <div className="space-y-4 font-body text-muted leading-relaxed">
            <p>
              Owning a rental property in {city.name} can generate strong monthly income, but managing it yourself takes real
              time and effort. Between finding qualified tenants, handling maintenance calls, tracking rent payments, and staying
              compliant with Florida landlord-tenant law, most owners spend 10 to 20 hours per month on management tasks alone.
            </p>
            <p>
              A professional property manager takes all of that off your plate. ViVi PM handles every aspect of your {city.name}{" "}
              rental property so you can collect passive income without the headaches. Whether you own a single-family home, a
              condo, or a small multifamily building in {city.county} County, ViVi PM has the systems and local knowledge to
              protect your investment and maximize your returns.
            </p>
            <p>
              Barrett Henry, Broker Associate at REMAX Collective, founded ViVi PM to give Tampa Bay rental owners a management
              option backed by 23+ years of real estate experience. That means your property manager is also a licensed broker
              who understands {city.name} property values, rental comps, and the local market inside and out.
            </p>
          </div>
        </div>
      </section>

      {/* === What ViVi PM handles === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-8">
            What Does ViVi PM Handle for {city.name} Owners?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tenant screening */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Tenant Screening</h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                Full background checks, credit reports, income verification, eviction history, and rental references. Every
                applicant goes through the same rigorous process before a lease is signed.
              </p>
            </div>
            {/* Maintenance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Maintenance Coordination</h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                24/7 maintenance requests handled through{" "}
                <a href="https://bestbayservices.com" target="_blank" rel="noopener noreferrer" className="text-link hover:underline">Best Bay Services</a>,
                a trusted local handyman and home services company run by James Evans. Fast response, fair pricing, quality work.
              </p>
            </div>
            {/* Rent collection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Rent Collection</h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                On-time rent collection with online payment portals for tenants and direct deposit to your account. Late fees
                enforced per the lease terms.
              </p>
            </div>
            {/* Inspections */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Property Inspections</h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                Regular move-in, move-out, and periodic inspections with photo documentation. Catch problems early before
                they become expensive repairs.
              </p>
            </div>
            {/* Financial reporting */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Financial Reporting</h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                Monthly owner statements, year-end tax documents, and full transparency on every dollar. You always know
                exactly where your money is going.
              </p>
            </div>
            {/* Lease + legal */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Lease Preparation and Compliance</h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                Legally compliant lease agreements tailored to Florida landlord-tenant law. If eviction is necessary, ViVi PM
                handles the process from notice to court filing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === Rental market overview === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            {city.name} Rental Market Overview
          </h2>
          <div className="space-y-4 font-body text-muted leading-relaxed">
            <p>
              {city.name} sits in {city.county} County, one of the fastest-growing regions in Florida. {city.tagline}. Strong
              population growth, a healthy job market, and proximity to Tampa Bay&apos;s employment centers make {city.name} a
              solid market for rental property owners.
            </p>
            <p>
              Whether you own a long-term rental or are considering converting your property to a rental, having a local property
              manager who understands {city.name}&apos;s rental comps, tenant expectations, and neighborhood dynamics makes a
              real difference. ViVi PM prices your rental competitively, markets it to qualified tenants, and keeps your vacancy
              rate low.
            </p>
            <p>
              Looking to invest in {city.name} rental property? Barrett Henry can help you find the right investment property
              and transition it into professional management with ViVi PM from day one.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${city.slug}-investment-property/`}
              className="inline-flex items-center gap-2 border border-gray-200 text-primary font-semibold px-6 py-3 rounded text-sm hover:border-accent hover:bg-accent/10 transition-colors"
            >
              {city.name} Investment Properties
            </Link>
            <Link
              href={`/${city.slug}-rentals/`}
              className="inline-flex items-center gap-2 border border-gray-200 text-primary font-semibold px-6 py-3 rounded text-sm hover:border-accent hover:bg-accent/10 transition-colors"
            >
              {city.name} Rentals
            </Link>
          </div>
        </div>
      </section>

      {/* === FAQ section === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-8">
            Frequently Asked Questions About Property Management in {city.name}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className={i < faqs.length - 1 ? "border-b border-gray-200 pb-6" : "pb-6"}>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  {faq.question}
                </h3>
                <p
                  className="font-body text-muted font-light leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Link to main property management page === */}
      <section className="container-wide py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-lg md:text-xl text-primary mb-1">
              Learn more about ViVi PM
            </p>
            <p className="font-body text-muted text-sm">
              Full details on services, pricing, and how to get started with professional property management.
            </p>
          </div>
          <Link
            href="/property-management/"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded text-sm hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            ViVi PM Details
          </Link>
        </div>
      </section>

      {/* === Hub-to-spoke nav: sibling property management pages in the same county === */}
      {neighbors.length > 0 && (
        <section className="container-wide py-12">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            Property Management in {city.county} County
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {neighbors.map((neighbor) => (
              <Link
                key={neighbor.slug}
                href={`/${neighbor.slug}-property-management/`}
                className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
              >
                {neighbor.name} PM
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* === Spoke nav — all topic pages for this city === */}
      <SpokeNav city={city} currentTopic="property-management" />

      {/* === Bottom CTA bar === */}
      <section className="bg-primary py-12">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Own rental property in {city.name}?
            </h2>
            <p className="font-body text-white/70 text-sm">
              Barrett Henry, REALTOR® and ViVi PM owner. Call for a free rental analysis.
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
