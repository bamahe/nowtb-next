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
import ListingGrid from "@/components/ui/ListingGrid";
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
import { getGuideContent } from "@/lib/guides-loader";
import { getListings, getListingsByCity, getOpenHouses } from "@/lib/bridge";

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
export const revalidate = 3600; // 1 hour, matches bridgeFetch cache
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

  // Guide pages — static content, no API
  for (const guide of guides) {
    params.push({ citySlug: guide.slug });
  }

  // Misc catch-all pages — static content
  for (const mp of miscPages) {
    if (mp.handling === "catch-all") {
      params.push({ citySlug: mp.slug });
    }
  }

  // Blog posts — no API calls
  const { getAllPosts } = await import("@/lib/posts");
  for (const post of getAllPosts()) {
    params.push({ citySlug: post.slug });
  }

  // Market update pages — static content
  const { getAllMarketUpdateSlugs } = await import("@/lib/market-updates");
  for (const muSlug of getAllMarketUpdateSlugs()) {
    params.push({ citySlug: muSlug });
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

  // Blog posts at root level
  if (parsed === "blog-post") {
    const { getPostBySlug } = await import("@/lib/posts");
    const post = getPostBySlug(citySlug);
    if (post) {
      return {
        title: post.title,
        description: post.excerpt || `${post.title} — Barrett Henry, REALTOR® at REMAX Collective.`,
        alternates: { canonical: `/${citySlug}/` },
      };
    }
    return {};
  }

  // Market updates — serve with proper metadata
  if (parsed === "market-update") {
    const { getMarketUpdateBySlug } = await import("@/lib/market-updates");
    const update = getMarketUpdateBySlug(citySlug);
    if (update) {
      // Custom OG image for florida-housing-market-2026
      const ogImage = citySlug === "florida-housing-market-2026"
        ? "/images/florida-housing-market-2026-og.png"
        : "/og-default.png";
      return {
        title: update.title,
        description: update.excerpt || `${update.title} — housing market data from Barrett Henry, REALTOR® at REMAX Collective.`,
        alternates: { canonical: `/market-updates/${citySlug}/` },
        openGraph: {
          title: update.title,
          description: update.excerpt,
          images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
          card: "summary_large_image",
          title: update.title,
          images: [ogImage],
        },
      };
    }
    return {};
  }

  // All dynamic pages get a canonical URL to prevent duplicate content
  // trailingSlash: true is set in next.config.mjs so all canonicals must end with /
  const canonical = `/${citySlug}/`;

  switch (parsed.kind) {
    case "remax-office": {
      const ofc = getRemaxOffice(citySlug);
      const cityName = ofc?.city || parsed.officeKey;
      return {
        title: `REMAX ${cityName} | Barrett Henry, Broker Associate | REMAX Collective`,
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
        title: `${parsed.countyName} County Homes for Sale | Barrett Henry`,
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
        title: `${parsed.label} | Barrett Henry, REALTOR®`,
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
        title: `${parsed.city.name} REALTOR® — Barrett Henry | REMAX Collective`,
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
      return {
        title: `${parsed.name} Homes for Sale | ${cityName}, FL`,
        description: `Explore homes for sale in ${parsed.name}, ${cityName}, FL. Updated daily from Stellar MLS. Barrett Henry, REMAX Collective. Call (813) 733-7907.`,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.name} Homes for Sale | ${cityName}, FL`,
          description: `Browse homes in ${parsed.name}, ${cityName}. Updated daily from Stellar MLS.`,
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
        title: `${parsed.name} REALTOR® — Barrett Henry | ${nrCityName}, FL`,
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
        title: `${parsed.comparison.title} | Barrett Henry, REALTOR®`,
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
        title: `${parsed.page.title} | Barrett Henry, REALTOR®`,
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
        title: `${parsed.page.title} | Barrett Henry, REALTOR®`,
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
      return {
        title: `${parsed.guide.title} | Barrett Henry, REALTOR®`,
        description: parsed.guide.excerpt,
        alternates: { canonical },
        openGraph: {
          title: `${parsed.guide.title} | Barrett Henry, REALTOR®`,
          description: parsed.guide.excerpt,
          url: canonical,
          type: "article",
          images: [{ url: "/og-default.png", width: 1200, height: 630 }],
        },
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
      title: `${topic.label} in ${city.name}, FL | Barrett Henry, REALTOR®`,
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

  // Blog posts — render at root level (same layout as /blog/[slug])
  if (parsed === "blog-post") {
    const { getPostBySlug, getPostThumbnail, getRelatedPosts } = await import("@/lib/posts");
    const { cleanWpContent } = await import("@/lib/utils");
    const { getPrimaryAgent } = await import("@/data/agents");
    const post = getPostBySlug(citySlug);
    if (!post) notFound();
    const agent = getPrimaryAgent();
    const thumbnail = getPostThumbnail(post);
    const related = getRelatedPosts(citySlug, 3);
    return (
      <>
        <section className="bg-primary pt-32 pb-16">
          <div className="container-wide max-w-3xl text-center">
            <h1 className="heading-display text-display md:text-display-lg text-white mb-4">{post.title}</h1>
            <div className="flex items-center justify-center gap-3 text-sm font-body text-accent">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            </div>
          </div>
        </section>
        <section className="container-wide py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="card p-5 bg-primary/5">
                  <h3 className="font-heading font-bold text-sm text-primary mb-2">Need Help?</h3>
                  <p className="font-body text-muted text-xs mb-3">Barrett Henry has 23+ years of real estate experience. Call or text anytime.</p>
                  <a href={`tel:${agent.phone.replace(/[^\d]/g, "")}`} className="btn-primary inline-block px-4 py-2 text-xs text-center w-full">{agent.phone}</a>
                </div>
                {related.length > 0 && (
                  <div className="card p-5">
                    <h3 className="font-heading font-bold text-sm text-primary mb-3">Related Posts</h3>
                    <ul className="space-y-2">
                      {related.map((r) => (
                        <li key={r.slug}><Link href={`/${r.slug}`} className="font-body text-xs text-link hover:underline">{r.title}</Link></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
            <article className="lg:col-span-3 order-1 lg:order-2">
              {thumbnail && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnail} alt={post.title} className="w-full h-auto" loading="eager" />
                </div>
              )}
              <div className="blog-content prose prose-lg font-body text-dark max-w-none prose-headings:font-heading prose-headings:text-primary prose-a:text-link prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cleanWpContent(post.content) }}
              />
            </article>
          </div>
        </section>
      </>
    );
  }

  // Market updates — render the same page as /market-updates/[slug]
  if (parsed === "market-update") {
    const { getMarketUpdateBySlug } = await import("@/lib/market-updates");
    const { cleanWpContent } = await import("@/lib/utils");
    const { getPrimaryAgent } = await import("@/data/agents");
    const update = getMarketUpdateBySlug(citySlug);
    if (!update) notFound();
    const agent = getPrimaryAgent();
    const city = update.title.split(" Housing Market")[0].split(" Real Estate")[0];
    return (
      <>
        <section className="bg-primary pt-32 pb-16">
          <div className="container-wide max-w-3xl text-center">
            <span className="inline-block px-4 py-1 rounded-full text-xs font-body font-semibold bg-accent/20 text-accent mb-4">Market Update</span>
            <h1 className="heading-display text-display md:text-display-lg text-white mb-4">{update.title}</h1>
            <div className="flex items-center justify-center gap-3 text-sm font-body text-accent mb-8">
              <time dateTime={update.date}>{new Date(update.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={`tel:${agent.phone.replace(/[^\d]/g, "")}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold text-sm rounded-lg">Call {agent.phone}</a>
              <Link href="/home-valuation" className="inline-block px-6 py-3 border-2 border-white/40 text-white font-bold text-sm rounded-lg">Free Home Valuation</Link>
            </div>
          </div>
        </section>
        <section className="container-wide py-12">
          <div className="blog-content prose prose-lg font-body text-dark max-w-none prose-headings:font-heading prose-headings:text-primary prose-a:text-link prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanWpContent(update.content) }}
          />
        </section>
      </>
    );
  }

  // Dispatch to the correct page component based on type
  const page = parsed as PageType;
  switch (page.kind) {
    case "hub":
      return <HubPage city={page.city} />;
    case "spoke":
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
    case "guide": {
      // Render guide inline — use real WP content when available, fall back to sections
      const g = page.guide;
      const wpContent = getGuideContent(g.slug);
      return (
        <>
          <HeroSection title={g.title} subtitle={g.excerpt} />
          <div className="container-wide py-12">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-muted mb-8">{g.category} · {g.readingTime}</p>

              {wpContent ? (
                /* Real WordPress content */
                <div
                  className="blog-content prose prose-lg font-body text-dark max-w-none
                    prose-headings:font-heading prose-headings:text-primary
                    prose-a:text-link prose-a:no-underline hover:prose-a:underline
                    prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: cleanWpContent(wpContent) }}
                />
              ) : (
                /* Fallback: placeholder sections */
                <>
                  {g.sections.map((s) => (
                    <div key={s.id} className="mb-8">
                      <h2 className="font-heading text-2xl font-bold text-primary mb-4">{s.heading}</h2>
                      <div className="blog-content" dangerouslySetInnerHTML={{ __html: cleanWpContent(s.content) }} />
                    </div>
                  ))}
                </>
              )}

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
  // Fetch active + recently sold listings by ZIP codes
  let listings: import("@/lib/types").Listing[] = [];
  let rentalListings: import("@/lib/types").Listing[] = [];
  let soldListings: import("@/lib/types").Listing[] = [];
  let totalActive = 0;
  let totalRentals = 0;
  try {
    const [activeRes, rentalRes, soldRes] = await Promise.all([
      // For-sale listings only (exclude rentals)
      getListings({ zip_codes: city.zip_codes, limit: "48", exclude_rental: true }),
      // Rentals separately
      getListings({ zip_codes: city.zip_codes, limit: "12", rental: true }),
      // Recently sold
      getListings({ zip_codes: city.zip_codes, limit: "8", status: "Closed", sort: "ClosePrice desc" }),
    ]);
    listings = activeRes.value || [];
    rentalListings = rentalRes.value || [];
    soldListings = soldRes.value || [];
    totalActive = activeRes.total || listings.length;
    totalRentals = rentalRes.total || rentalListings.length;
  } catch {
    listings = [];
    rentalListings = [];
    soldListings = [];
  }

  // Compute market stats from the listings we have
  const avgPrice = listings.length > 0
    ? Math.round(listings.reduce((sum, l) => sum + (l.ListPrice || 0), 0) / listings.length)
    : 0;
  const avgDom = listings.length > 0
    ? Math.round(listings.filter(l => l.DaysOnMarket != null).reduce((sum, l) => sum + (l.DaysOnMarket || 0), 0) / Math.max(listings.filter(l => l.DaysOnMarket != null).length, 1))
    : 0;
  const priceRange = listings.length > 0
    ? { low: Math.min(...listings.map(l => l.ListPrice)), high: Math.max(...listings.map(l => l.ListPrice)) }
    : { low: 0, high: 0 };

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
      <section className="bg-primary pt-28 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/50 mb-6 tracking-wide uppercase">
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
              href="/contact"
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
              For Sale ({totalActive.toLocaleString()})
            </a>
            {totalRentals > 0 && (
              <a href="#rentals" className="font-body text-xs tracking-[0.12em] uppercase px-5 py-4 border-b-2 border-transparent text-muted hover:text-primary transition-colors">
                Rentals ({totalRentals.toLocaleString()})
              </a>
            )}
            {soldListings.length > 0 && (
              <a href="#sold" className="font-body text-xs tracking-[0.12em] uppercase px-5 py-4 border-b-2 border-transparent text-muted hover:text-primary transition-colors">
                Recently Sold
              </a>
            )}
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

      {/* === Latest listings grid === */}
      <div id="for-sale" />
      <ListingGrid
        listings={listings}
        title={`Latest Listings in ${city.name}`}
        subtitle={`Showing ${listings.length} of ${totalActive.toLocaleString()} active homes for sale in ${city.name}, ${city.county} County.`}
      />

      {/* === View All button — when more listings exist than shown === */}
      {totalActive > listings.length && (
        <section className="container-wide py-8 text-center">
          <Link
            href={`/properties/?q=${encodeURIComponent(city.name)}`}
            className="btn-primary inline-block px-10 py-4"
          >
            View All {totalActive.toLocaleString()} Listings in {city.name}
          </Link>
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

      {/* === Spoke navigation — links to all topic pages for this city === */}
      <SpokeNav city={city} />

      {/* === About section — city overview content === */}
      <div id="about" />
      <CityContent city={city} />

      {/* === Resources & internal links — neighborhoods, loans, guides, blog posts === */}
      <CityResources city={city} />

      {/* === Recently Sold Homes — real closed listings from MLS === */}
      <div id="sold" />
      {soldListings.length > 0 && (
        <ListingGrid
          listings={soldListings}
          title={`Recently Sold Homes in ${city.name}`}
          subtitle={`See what homes recently sold for in ${city.name} to understand current market values.`}
          headingLevel="h3"
        />
      )}

      {/* === Homes for Rent — separate rental listings section === */}
      <div id="rentals" />
      {rentalListings.length > 0 && (
        <>
          <ListingGrid
            listings={rentalListings}
            title={`Homes for Rent in ${city.name}`}
            headingLevel="h3"
            subtitle={`${totalRentals > rentalListings.length ? `Showing ${rentalListings.length} of ${totalRentals.toLocaleString()}` : rentalListings.length} rental listings in ${city.name}, ${city.county} County.`}
          />
          {totalRentals > rentalListings.length && (
            <section className="container-wide pb-8 text-center">
              <Link
                href={`/properties/?q=${encodeURIComponent(city.name)}&rental=true`}
                className="btn-secondary inline-block px-8 py-3"
              >
                View All {totalRentals.toLocaleString()} Rentals in {city.name}
              </Link>
            </section>
          )}
        </>
      )}

      {/* === FAQ Section — city-specific with FAQPage schema === */}
      <section className="container-wide py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `What is the average home price in ${city.name}, FL?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Home prices in ${city.name} vary by neighborhood, property type, and condition. Browse current active listings above for the most up-to-date pricing. Contact Barrett Henry at (813) 733-7907 for a personalized market analysis.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `Is ${city.name} a good place to live?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${city.name} is located in ${city.county} County, Florida. ${city.tagline}. With access to Tampa Bay's job market, beaches, and amenities, ${city.name} is a popular choice for families, retirees, and investors.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `How do I buy a home in ${city.name}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Start by getting pre-approved for a mortgage, then work with a local REALTOR who knows the ${city.name} market. Barrett Henry and The NOW Team have 23+ years of experience helping buyers in ${city.county} County. Call (813) 733-7907 to get started.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `What ZIP codes are in ${city.name}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${city.name} covers ZIP codes ${city.zip_codes.join(", ")}. Each ZIP code may include different neighborhoods and school zones.`,
                  },
                },
              ],
            }),
          }}
        />
        <h2 id="faq" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-8">
          Frequently Asked Questions About {city.name}
        </h2>
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-6">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">
              What is the average home price in {city.name}, FL?
            </h3>
            <p className="font-body text-muted font-light leading-relaxed">
              Home prices in <strong>{city.name}</strong> vary by neighborhood, property type, and condition.
              Browse current active listings above for the most up-to-date pricing.
              Contact <strong>Barrett Henry</strong> at{" "}
              <a href="tel:+18137337907" className="text-link hover:underline"><strong>(813) 733-7907</strong></a>{" "}
              for a personalized market analysis.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-6">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">
              Is {city.name} a good place to live?
            </h3>
            <p className="font-body text-muted font-light leading-relaxed">
              {city.name} is located in {city.county} County, Florida. {city.tagline}.
              With access to Tampa Bay&apos;s job market, beaches, and amenities,{" "}
              {city.name} is a popular choice for families, retirees, and investors.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-6">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">
              How do I buy a home in {city.name}?
            </h3>
            <p className="font-body text-muted font-light leading-relaxed">
              Start by getting pre-approved for a mortgage, then work with a local <strong>REALTOR®</strong>{" "}
              who knows the {city.name} market. <strong>Barrett Henry</strong> and The NOW Team have 23+ years
              of experience helping buyers in <strong>{city.county} County</strong>. Call{" "}
              <a href="tel:+18137337907" className="text-link hover:underline"><strong>(813) 733-7907</strong></a>{" "}
              to get started.
            </p>
          </div>
          <div className="pb-6">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">
              What ZIP codes are in {city.name}?
            </h3>
            <p className="font-body text-muted font-light leading-relaxed">
              {city.name} covers ZIP codes {city.zip_codes.join(", ")}.
              Each ZIP code may include different neighborhoods and school zones.
            </p>
          </div>
        </div>
      </section>

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
              {cityNeighborhoods.slice(0, 20).map((n) => (
                <Link
                  key={n.slug}
                  href={`/${n.slug}/`}
                  className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
                >
                  {n.name}
                </Link>
              ))}
            </div>
            {cityNeighborhoods.length > 20 && (
              <p className="font-body text-xs text-muted mt-4 text-center">
                + {cityNeighborhoods.length - 20} more neighborhoods.{" "}
                <Link href={`/${city.slug}-neighborhood-guide/`} className="text-accent hover:text-primary">
                  View all →
                </Link>
              </p>
            )}
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

  try {
    if (isOpenHouse) {
      listings = await getOpenHouses(city.zip_codes);
      totalFiltered = listings.length;
    } else if (isHousingMarket) {
      // Fetch active + sold in parallel for housing market pages
      // Sold listings: last 90 days, sorted by close date
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      const [activeRes, soldRes] = await Promise.all([
        getListings({ zip_codes: city.zip_codes, limit: "48", exclude_rental: true }),
        getListings({
          zip_codes: city.zip_codes,
          status: "Closed",
          limit: "100",
          sort: "CloseDate desc",
        }),
      ]);
      listings = activeRes.value || [];
      totalFiltered = activeRes.total || listings.length;
      // Use all returned sold listings — they're already sorted by CloseDate desc
      // so the first 100 are the most recent closings. No date filter needed since
      // Bridge returns them in recency order.
      soldListings = soldRes.value || [];
    } else {
      // Build filter params: use ZIP codes (reliable) instead of city name
      // Many communities aren't MLS "cities" — Carrollwood = Tampa, Brandon = unincorporated, etc.
      const filterParams: import("@/lib/types").ListingSearchParams = {
        zip_codes: city.zip_codes,
        ...topic.filter,
        limit: "48",
      };
      const res = await getListings(filterParams);
      listings = res.value || [];
      totalFiltered = res.total || listings.length;
    }
  } catch {
    listings = [];
    soldListings = [];
  }

  // ---- Housing market stats (only computed when isHousingMarket === true) ----

  // Helper: compute median from a sorted array of numbers
  function median(sorted: number[]): number {
    if (sorted.length === 0) return 0;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }

  // Median list price from active listings
  const listPrices = listings.map(l => l.ListPrice).filter(p => p > 0).sort((a, b) => a - b);
  const medianListPrice = median(listPrices);

  // Median sale price from recently closed listings
  // Use ClosePrice if available, fall back to ListPrice (which reflects final price on closed listings)
  const closePrices = soldListings.map(l => l.ClosePrice || l.ListPrice || 0).filter(p => p > 0).sort((a, b) => a - b);
  const medianSalePrice = median(closePrices);

  // Average days on market from active listings
  const domValues = listings.filter(l => l.DaysOnMarket != null).map(l => l.DaysOnMarket as number);
  const avgDom = domValues.length > 0
    ? Math.round(domValues.reduce((s, v) => s + v, 0) / domValues.length)
    : 0;

  // Average price per sq ft from active listings (exclude listings with no sqft)
  const pricePerSqFtValues = listings
    .filter(l => l.LivingArea && l.LivingArea > 0 && l.ListPrice > 0)
    .map(l => Math.round(l.ListPrice / (l.LivingArea as number)));
  const avgPricePerSqFt = pricePerSqFtValues.length > 0
    ? Math.round(pricePerSqFtValues.reduce((s, v) => s + v, 0) / pricePerSqFtValues.length)
    : 0;

  // New listings this month — OriginalEntryTimestamp within last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const newListingsThisMonth = listings.filter(
    l => l.OriginalEntryTimestamp && l.OriginalEntryTimestamp >= thirtyDaysAgo
  ).length;

  // Price range buckets for active listings
  const priceBuckets = [
    { label: "Under $200K", min: 0, max: 200000 },
    { label: "$200K–$300K", min: 200000, max: 300000 },
    { label: "$300K–$400K", min: 300000, max: 400000 },
    { label: "$400K–$500K", min: 400000, max: 500000 },
    { label: "$500K–$750K", min: 500000, max: 750000 },
    { label: "$750K–$1M", min: 750000, max: 1000000 },
    { label: "$1M+", min: 1000000, max: Infinity },
  ].map(bucket => ({
    label: bucket.label,
    min: bucket.min,
    max: bucket.max,
    count: listings.filter(l => l.ListPrice >= bucket.min && l.ListPrice < bucket.max).length,
    href: `/properties/search/?q=${encodeURIComponent(city.name)}&min_price=${bucket.min}${bucket.max < Infinity ? `&max_price=${bucket.max}` : ''}&exclude_rental=true`,
  }));

  // Find a market update post for this city if one exists
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
      <section className="bg-primary pt-28 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/50 mb-6 tracking-wide uppercase">
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
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Schedule a Tour
            </Link>
          </div>
        </div>
      </section>

      {/* === Housing Market Stats — only shown on housing-market spoke pages === */}
      {isHousingMarket && (
        <>
          {/* Market Snapshot — 6 stat cards computed from live Bridge API data */}
          <section className="bg-white border-b border-border">
            <div className="container-wide py-10">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-primary">
                    {city.name} Market Snapshot
                  </h2>
                  <p className="font-body text-muted text-sm mt-1">
                    Computed from live MLS data — updated daily
                  </p>
                </div>
                {/* Link to full market report if one exists for this city */}
                {marketUpdateSlug && (
                  <Link
                    href={`/market-updates/${marketUpdateSlug}/`}
                    className="inline-flex items-center gap-2 border border-accent text-accent font-semibold px-5 py-2.5 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                  >
                    View Latest Market Report →
                  </Link>
                )}
              </div>

              {/* 6-card stat grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Median Sale Price — from closed listings last 90 days */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="font-heading font-bold text-xl text-primary leading-tight">
                    {medianSalePrice > 0 ? formatPrice(medianSalePrice) : "—"}
                  </p>
                  <p className="font-body text-xs tracking-wide uppercase text-muted mt-1">
                    Median Sale Price
                  </p>
                  <p className="font-body text-xs text-muted/60 mt-0.5">90-day window</p>
                </div>

                {/* Median List Price — from active listings */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="font-heading font-bold text-xl text-primary leading-tight">
                    {medianListPrice > 0 ? formatPrice(medianListPrice) : "—"}
                  </p>
                  <p className="font-body text-xs tracking-wide uppercase text-muted mt-1">
                    Median List Price
                  </p>
                  <p className="font-body text-xs text-muted/60 mt-0.5">active listings</p>
                </div>

                {/* Average Days on Market */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="font-heading font-bold text-xl text-primary leading-tight">
                    {avgDom > 0 ? `${avgDom}` : "—"}
                  </p>
                  <p className="font-body text-xs tracking-wide uppercase text-muted mt-1">
                    Avg. Days on Market
                  </p>
                  <p className="font-body text-xs text-muted/60 mt-0.5">active listings</p>
                </div>

                {/* Active Listings count */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="font-heading font-bold text-xl text-primary leading-tight">
                    {totalFiltered.toLocaleString()}
                  </p>
                  <p className="font-body text-xs tracking-wide uppercase text-muted mt-1">
                    Active Listings
                  </p>
                  <p className="font-body text-xs text-muted/60 mt-0.5">for sale now</p>
                </div>

                {/* Average Price Per Sq Ft */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="font-heading font-bold text-xl text-primary leading-tight">
                    {avgPricePerSqFt > 0 ? `$${avgPricePerSqFt}` : "—"}
                  </p>
                  <p className="font-body text-xs tracking-wide uppercase text-muted mt-1">
                    Avg. Price / Sq Ft
                  </p>
                  <p className="font-body text-xs text-muted/60 mt-0.5">active listings</p>
                </div>

                {/* New Listings This Month */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="font-heading font-bold text-xl text-primary leading-tight">
                    {newListingsThisMonth}
                  </p>
                  <p className="font-body text-xs tracking-wide uppercase text-muted mt-1">
                    New This Month
                  </p>
                  <p className="font-body text-xs text-muted/60 mt-0.5">last 30 days</p>
                </div>
              </div>
            </div>
          </section>

          {/* Price Range Breakdown — bucket counts for active listings */}
          {listings.length > 0 && (
            <section className="container-wide py-10">
              <h2 className="font-heading font-bold text-xl text-primary mb-1">
                Price Range Breakdown
              </h2>
              <p className="font-body text-muted text-sm mb-6">
                Active listings in {city.name} by price tier
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {priceBuckets.map(bucket => (
                  <Link
                    key={bucket.label}
                    href={bucket.href}
                    className="border border-gray-200 rounded-lg p-4 text-center bg-white hover:shadow-md hover:border-accent/30 transition-all no-underline"
                  >
                    <p className="font-heading font-bold text-2xl text-primary">
                      {bucket.count}
                    </p>
                    <p className="font-body text-xs text-muted mt-1 leading-tight">
                      {bucket.label}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* === Listings grid — front and center === */}
      {listings.length > 0 ? (
        <>
          <ListingGrid
            listings={listings}
            title={`${totalFiltered > listings.length ? `Showing ${listings.length} of ${totalFiltered.toLocaleString()}` : listings.length} ${topic.slug === "neighborhood-guide" || topic.slug === "housing-market" ? "Homes for Sale" : topic.label} in ${city.name}`}
            className="container-wide py-12"
          />
          {totalFiltered > listings.length && (
            <section className="container-wide pb-8 text-center">
              <Link
                href={`/properties/?q=${encodeURIComponent(city.name)}${Object.entries(topic.filter).map(([k,v]) => `&${k}=${v}`).join('')}`}
                className="btn-primary inline-block px-10 py-4"
              >
                View All {totalFiltered.toLocaleString()} {topic.slug === "neighborhood-guide" || topic.slug === "housing-market" ? "Homes for Sale" : topic.label} in {city.name}
              </Link>
            </section>
          )}
        </>
      ) : (
        <section className="container-wide py-12">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center max-w-2xl mx-auto">
            <p className="font-heading text-lg font-bold text-primary mb-2">
              No {topic.label.toLowerCase()} currently listed in {city.name}
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
