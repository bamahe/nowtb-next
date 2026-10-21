// =============================================================================
// Sitemap: includes ALL 3,400+ pages for complete Google indexing
// Static pages + blog posts + guides + city hubs + city spokes + neighborhoods
// + counties + loan guides + comparisons + regional + misc catch-all pages
// =============================================================================

import { MetadataRoute } from "next";
import { cities, SPOKE_TOPICS, getCityTopics } from "@/data/cities";
import { neighborhoods } from "@/data/neighborhoods";
import { builders } from "@/data/builders";
import { communityPages } from "@/data/community-pages";
import { getAllComparisonSlugs } from "@/data/comparisons";
import { getAllRegionalSlugs } from "@/data/regional-pages";
import { getCatchAllMiscSlugs } from "@/data/misc-pages";
import { getAllPosts } from "@/lib/posts";
import { getAllGuideSlugs } from "@/data/guides";
import { getAllMarketUpdates } from "@/lib/market-updates";
import { getBeachCondoSlugs } from "@/data/beach-condo-pages";

// =============================================================================
// DO NOT DELETE THIS EXPORT. IT IS NOT DEAD CODE.
// -----------------------------------------------------------------------------
// WHY: Next.js treats `sitemap.ts` as a static route by default. Without a
// `revalidate` (or `dynamic`) export, Next renders this file ONCE at build time
// and bakes the result into a static sitemap.xml file. Google then fetches that
// frozen snapshot forever, every page the content automation adds after the
// last deploy is invisible to Google until somebody happens to redeploy.
//
// This site has a cron (see vercel.json: /api/cron/generate-post every 3 days,
// /api/cron/market-update quarterly) that writes new posts between deploys. So a
// build-time-frozen sitemap is guaranteed to be stale and under-report pages.
//
// `revalidate = 3600` turns the sitemap into an ISR route: the first request
// after an hour regenerates it in the background, so newly generated posts show
// up in sitemap.xml within an hour with no deploy needed.
//
// 3600 is deliberately the same number the homepage uses (src/app/page.tsx) so
// the whole site has one cache horizon instead of several.
//
// If it breaks, check:
//  - Sitemap looks stale? Fetch https://nowtb.com/sitemap.xml twice ~1h apart
//    and diff the <loc> count. If identical after a new post went live, this
//    export got removed or something above it is throwing at module load.
//  - Need it truly live on every request instead? Use
// `export const dynamic = "force-dynamic";`, but that re-reads every data
//    file and the Bridge-backed helpers on every crawl, which is expensive and
//    not worth it for a file Google fetches a few times a day.
// =============================================================================
export const revalidate = 3600; // 1 hour, see the block comment above

export default function sitemap(): MetadataRoute.Sitemap {
  // Strip any trailing slash(es) off the env value before building URLs.
  // WHY: every template below is written as `${siteUrl}/some-path/`. If
  // NEXT_PUBLIC_SITE_URL is ever set to "https://nowtb.com/" (easy to do by
  // accident in the Vercel dashboard), the concatenation produces
  // "https://nowtb.com//some-path/" and Google treats the double slash as a
  // different, 404-ing URL across all ~3,400 entries. The .trim() already here
  // catches stray whitespace/newlines; this catches the trailing slash.
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com")
    .trim()
    .replace(/\/+$/, "");
  const now = new Date();

  // ── Static pages (manually curated) ──
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage. The trailing slash is deliberate: next.config.mjs sets
    // `trailingSlash: true`, and src/app/page.tsx declares its canonical as
    // "https://nowtb.com/". A bare "https://nowtb.com" in the sitemap would not
    // match that canonical string exactly, which is a needless mismatch for
    // Google to resolve. (It resolves to the same resource either way, the
    // root path is always at least "/", so this is tidiness, not a bug fix.)
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/properties/`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/buyers/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/sellers/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/sell-your-home/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/open-houses/`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/agents/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/luxury/`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/communities/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/investing/`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/blog/`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/guides/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/mortgage-calculator/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // NOTE: /home-valuation/ is deliberately NOT listed here.
    // WHY: src/app/home-valuation/page.tsx is a redirect stub, it calls
    // redirect("/free-home-valuation/") and never returns HTML. Google's sitemap
    // guidelines say a sitemap should only contain canonical URLs that return
    // 200. Listing a redirecting URL wastes crawl budget on ~3,400 pages worth
    // of competition for attention and makes Search Console report the URL as
    // "Page with redirect" rather than indexed.
    // If /home-valuation/ is ever converted into a real page (see the long note
    // in that file about the internal-link imbalance), add it back here.
    { url: `${siteUrl}/free-home-valuation/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/property-management/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/the-now-team/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/relocation/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/commercial/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/lenders/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/builders/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/inspectors/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/brandon-listing-agent/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/valrico-listing-agent/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // October 2026 content batch. /sell/ is a nested route, so it is also listed
    // in both :city flatten redirect lookaheads in next.config.mjs.
    { url: `${siteUrl}/sell/why-didnt-my-house-sell/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Seller-intent batch, October 2026. Same /sell/ parent, same next.config
    // caveat as the line above: these only resolve on the live domain because
    // "sell" is excluded in BOTH :city flatten redirect lookaheads.
    { url: `${siteUrl}/sell/how-much-does-it-cost-to-sell-a-house-in-hillsborough-county/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/sell/what-is-my-house-worth-tampa-bay/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/sell/realtor-commission-tampa-bay/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/sell/sell-my-house-fast-tampa-bay/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/sell/how-long-does-it-take-to-sell-a-house-tampa-bay/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // ── Property type landing pages (11 pages) ──
  const propertyTypeLandingPages: MetadataRoute.Sitemap = [
    // "new-construction" is deliberately NOT in this list. next.config.mjs
    // 308-redirects /new-construction/ to /new-construction-homes-tampa-bay/,
    // which is the page that actually holds the internal link equity. Listing
    // the redirecting URL here just told Google to crawl a URL that bounces,
    // wasting a crawl on every pass. src/app/new-construction/page.tsx is now
    // dead code behind that redirect, left in place, not deleted.
    // If it breaks, check: if that redirect is ever removed, add the slug back.
    "55-plus-communities", "condos", "golf-homes", "land-acreage",
    "no-hoa", "pool-homes", "price-reduced",
    "single-story", "townhomes", "waterfront",
  ].map((slug) => ({
    url: `${siteUrl}/${slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // ── Blog posts (624 posts), canonical URL is /blog/{slug} ──
  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}/`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Market updates ──
  const marketUpdatePages: MetadataRoute.Sitemap = [
    // Market updates index page
    { url: `${siteUrl}/market-updates/`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    // Individual market update posts
    ...getAllMarketUpdates().map((update) => ({
      url: `${siteUrl}/market-updates/${update.slug}/`,
      lastModified: update.date ? new Date(update.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  // ── Guides (51 guides) ──
  const guidesPages: MetadataRoute.Sitemap = getAllGuideSlugs().map((slug) => ({
    url: `${siteUrl}/guides/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── City hub pages (ALL 70 cities, not just Tier 1) ──
  const cityHubs: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${siteUrl}/${city.slug}/`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: city.tier === 1 ? 0.9 : city.tier === 2 ? 0.7 : 0.6,
  }));

  // ── City spoke pages (city + topic combos, ~1,050+ pages) ──
  // Uses getCityTopics() to include horse-properties for rural/semi-rural cities
  const citySpokes: MetadataRoute.Sitemap = cities.flatMap((city) =>
    getCityTopics(city).filter((t) => city.topics.includes(t.slug) || t.slug === "horse-properties").map((topic) => ({
      url: `${siteUrl}/${city.slug}-${topic.slug}/`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: city.tier === 1 ? 0.7 : 0.5,
    }))
  );

  // ── City realtor pages (70 pages) ──
  const cityRealtorPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${siteUrl}/${city.slug}-realtor/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ── Sell-your-home city pages (70 pages) ──
  const sellCityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${siteUrl}/sell-your-home-${city.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // ── Builder detail pages ──
  const builderPages: MetadataRoute.Sitemap = builders.map((b) => ({
    url: `${siteUrl}/builders/${b.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Neighborhood pages, filter out neighborhoods whose slug matches a city slug ──
  // City routes take priority, so these neighborhood base pages are unreachable
  const citySlugs = new Set(cities.map((c) => c.slug));
  const filteredNeighborhoods = neighborhoods.filter((n) => !citySlugs.has(n.slug));
  const neighborhoodPages: MetadataRoute.Sitemap = filteredNeighborhoods.flatMap((n) => [
    {
      url: `${siteUrl}/${n.slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/${n.slug}-homes-for-sale/`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/${n.slug}-realtor/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ]);

  // ── Hand-built community pages nested under a city ──
  // e.g. /auburndale/gapway-lakes-estates/. Only the one real page per community
  // goes in, not the -homes-for-sale / -realtor variants, because these
  // communities have no MLS inventory to put on those pages.
  const communityPagesList: MetadataRoute.Sitemap = communityPages.map((c) => ({
    url: `${siteUrl}${c.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // ── County pages (8 pages) ──
  const countyPages: MetadataRoute.Sitemap = [
    "hillsborough-county", "pinellas-county", "pasco-county", "manatee-county",
    "polk-county", "sarasota-county", "hernando-county", "citrus-county",
  ].map((slug) => ({
    url: `${siteUrl}/${slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // ── Loan guide pages (8 pages) ──
  const loanPages: MetadataRoute.Sitemap = [
    "fha-loan-florida", "va-loan-florida", "usda-loan-florida",
    "conventional-loan-florida", "jumbo-loan-florida", "renovation-loan-florida",
    "reverse-mortgage-florida", "construction-loan-florida",
  ].map((slug) => ({
    url: `${siteUrl}/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Comparison pages (24 pages) ──
  const comparisonPages: MetadataRoute.Sitemap = getAllComparisonSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ── Regional pages (36 pages) ──
  const regionalPagesList: MetadataRoute.Sitemap = getAllRegionalSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ── Misc catch-all pages (33 pages) ──
  const miscPagesList: MetadataRoute.Sitemap = getCatchAllMiscSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  // ── Pinellas Gulf beach condo content cluster (7 pages) ──
  const beachCondoPages: MetadataRoute.Sitemap = getBeachCondoSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...propertyTypeLandingPages,
    ...beachCondoPages,
    ...blogPosts,
    ...marketUpdatePages,
    ...guidesPages,
    ...cityHubs,
    ...citySpokes,
    ...cityRealtorPages,
    ...sellCityPages,
    ...builderPages,
    ...neighborhoodPages,
    ...communityPagesList,
    ...countyPages,
    ...loanPages,
    ...comparisonPages,
    ...regionalPagesList,
    ...miscPagesList,
  ];
}
