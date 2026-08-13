/** @type {import('next').NextConfig} */

// Blog post slugs from WordPress — these lived at /slug/ on WP but now live at /blog/slug
// We load them at build time to generate individual 301 redirects
import fs from 'fs';
import path from 'path';

function getBlogRedirects() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/posts-export.json');
    const posts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Slugs that match city hub pages — these should NOT redirect to /blog/
    // because the city page at /{slug}/ takes priority
    const citiesPath = path.join(process.cwd(), 'src/data/cities.ts');
    const citiesContent = fs.readFileSync(citiesPath, 'utf-8');
    const citySlugs = new Set([...citiesContent.matchAll(/slug: "([^"]+)"/g)].map(m => m[1]));

    return posts
      .filter((post) => !citySlugs.has(post.slug))
      .flatMap((post) => [
        { source: `/${post.slug}`, destination: `/blog/${post.slug}/`, permanent: true },
        { source: `/${post.slug}/`, destination: `/blog/${post.slug}/`, permanent: true },
      ]);
  } catch {
    console.warn('Could not load posts for redirects');
    return [];
  }
}

// Guide slugs — WordPress served at /slug/ but new site uses /guides/slug
// Parse guide slugs from the TS data file at build time
function getGuideRedirects() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/guides.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    const slugMatches = content.match(/slug:\s*"([^"]+)"/g) || [];
    const slugs = slugMatches
      .map((m) => m.match(/"([^"]+)"/)?.[1])
      .filter(Boolean);
    // Generate both with and without trailing slash to avoid 2-hop chains
    return slugs.flatMap((slug) => [
      { source: `/${slug}`, destination: `/guides/${slug}/`, permanent: true },
      { source: `/${slug}/`, destination: `/guides/${slug}/`, permanent: true },
    ]);
  } catch {
    console.warn('Could not load guides for redirects');
    return [];
  }
}

const nextConfig = {
  // Don't expose "X-Powered-By: Next.js" header
  poweredByHeader: false,

  // Remove trailing slashes to match Next.js conventions
  // WordPress uses /slug/ but Next.js uses /slug
  trailingSlash: true,

  async redirects() {
    // Blog redirects removed — the [citySlug] catch-all route handles
    // blog post slugs at runtime and returns 308 redirects to /blog/{slug}/.
    // This keeps us under Vercel's 2048 route limit.
    const guideRedirects = getGuideRedirects();

    return [
      // ── Manual redirects (all destinations end with / for trailingSlash: true) ──
      { source: "/home", destination: "/", permanent: true },
      { source: "/first-time-buyers", destination: "https://firsttimehomebuyertb.com/", permanent: true },
      { source: "/first-time-buyers/", destination: "https://firsttimehomebuyertb.com/", permanent: true },
      { source: "/st-pete-homes-for-sale", destination: "/st-petersburg-homes-for-sale/", permanent: true },
      { source: "/terms", destination: "/terms-of-use/", permanent: true },
      { source: "/privacy", destination: "/privacy-policy/", permanent: true },

      // ── Duplicate neighborhood slugs → canonical versions ──
      { source: "/brentwood-hills-community", destination: "/brentwood-hills/", permanent: true },
      { source: "/brentwood-hills-community/", destination: "/brentwood-hills/", permanent: true },
      { source: "/copper-ridge-community", destination: "/copper-ridge/", permanent: true },
      { source: "/copper-ridge-community/", destination: "/copper-ridge/", permanent: true },
      { source: "/copper-ridge-community-realtor", destination: "/copper-ridge/", permanent: true },
      { source: "/copper-ridge-community-realtor/", destination: "/copper-ridge/", permanent: true },
      { source: "/bloomingdale-oaks-community", destination: "/bloomingdale-oaks/", permanent: true },
      { source: "/bloomingdale-oaks-community/", destination: "/bloomingdale-oaks/", permanent: true },
      { source: "/canterbury-oaks-community", destination: "/canterbury-oaks/", permanent: true },
      { source: "/canterbury-oaks-community/", destination: "/canterbury-oaks/", permanent: true },
      { source: "/kings-point-sun-city-center", destination: "/kings-point/", permanent: true },
      { source: "/kings-point-sun-city-center/", destination: "/kings-point/", permanent: true },
      { source: "/lake-magdalene-carrollwood", destination: "/lake-magdalene/", permanent: true },
      { source: "/lake-magdalene-carrollwood/", destination: "/lake-magdalene/", permanent: true },
      { source: "/northdale-carrollwood", destination: "/northdale/", permanent: true },
      { source: "/northdale-carrollwood/", destination: "/northdale/", permanent: true },

      // ── Fix URL cannibalization: root slugs → /blog/ canonical ──
      { source: "/garage-conversion-florida-guide", destination: "/blog/garage-conversion-florida-guide/", permanent: true },
      { source: "/garage-conversion-florida-guide/", destination: "/blog/garage-conversion-florida-guide/", permanent: true },
      { source: "/tampa-bay-traffic-guide", destination: "/blog/tampa-bay-traffic-guide/", permanent: true },
      { source: "/tampa-bay-traffic-guide/", destination: "/blog/tampa-bay-traffic-guide/", permanent: true },

      // ── Reverse word order REMAX pages → canonical ──
      { source: "/largo-remax", destination: "/remax-largo/", permanent: true },
      { source: "/largo-remax/", destination: "/remax-largo/", permanent: true },
      { source: "/tampa-remax", destination: "/remax-tampa/", permanent: true },
      { source: "/tampa-remax/", destination: "/remax-tampa/", permanent: true },
      { source: "/brandon-remax", destination: "/remax-brandon/", permanent: true },
      { source: "/brandon-remax/", destination: "/remax-brandon/", permanent: true },

      // ── Duplicate guide consolidation — redirect to canonical version ──
      { source: "/guides/first-time-homebuyer-guide", destination: "/guides/first-time-home-buyer-guide/", permanent: true },
      { source: "/guides/first-time-homebuyer-guide/", destination: "/guides/first-time-home-buyer-guide/", permanent: true },
      { source: "/guides/first-time-homebuyer-guide-tampa-bay", destination: "/guides/first-time-home-buyer-guide/", permanent: true },
      { source: "/guides/first-time-homebuyer-guide-tampa-bay/", destination: "/guides/first-time-home-buyer-guide/", permanent: true },
      { source: "/guides/home-inspection-guide", destination: "/guides/home-inspection-guide-florida/", permanent: true },
      { source: "/guides/home-inspection-guide/", destination: "/guides/home-inspection-guide-florida/", permanent: true },
      { source: "/guides/mortgage-pre-approval-guide", destination: "/guides/mortgage-pre-approval-guide-florida/", permanent: true },
      { source: "/guides/mortgage-pre-approval-guide/", destination: "/guides/mortgage-pre-approval-guide-florida/", permanent: true },
      { source: "/guides/florida-homestead-exemption-guide", destination: "/guides/florida-homestead-exemption-save-our-homes/", permanent: true },
      { source: "/guides/florida-homestead-exemption-guide/", destination: "/guides/florida-homestead-exemption-save-our-homes/", permanent: true },
      { source: "/guides/short-term-rental-guide", destination: "/guides/short-term-rental-guide-tampa-bay/", permanent: true },
      { source: "/guides/short-term-rental-guide/", destination: "/guides/short-term-rental-guide-tampa-bay/", permanent: true },

      // ── Stub market update pages → spoke pages with real content ──

      { source: "/largo-housing-market-update", destination: "/largo-housing-market/", permanent: true },
      { source: "/largo-housing-market-update/", destination: "/largo-housing-market/", permanent: true },
      { source: "/dover-housing-market-update", destination: "/dover-housing-market/", permanent: true },
      { source: "/dover-housing-market-update/", destination: "/dover-housing-market/", permanent: true },
      { source: "/tampa-housing-market-update", destination: "/tampa-housing-market/", permanent: true },
      { source: "/tampa-housing-market-update/", destination: "/tampa-housing-market/", permanent: true },
      { source: "/brooksville-housing-market-q2-2026", destination: "/brooksville-housing-market/", permanent: true },
      { source: "/brooksville-housing-market-q2-2026/", destination: "/brooksville-housing-market/", permanent: true },
      { source: "/crystal-river-housing-market-q2-2026", destination: "/crystal-river-housing-market/", permanent: true },
      { source: "/crystal-river-housing-market-q2-2026/", destination: "/crystal-river-housing-market/", permanent: true },
      { source: "/englewood-housing-market-q2-2026", destination: "/englewood-housing-market/", permanent: true },
      { source: "/englewood-housing-market-q2-2026/", destination: "/englewood-housing-market/", permanent: true },
      { source: "/hernando-beach-housing-market-q2-2026", destination: "/hernando-beach-housing-market/", permanent: true },
      { source: "/hernando-beach-housing-market-q2-2026/", destination: "/hernando-beach-housing-market/", permanent: true },
      { source: "/homosassa-housing-market-q2-2026", destination: "/homosassa-housing-market/", permanent: true },
      { source: "/homosassa-housing-market-q2-2026/", destination: "/homosassa-housing-market/", permanent: true },
      { source: "/inverness-housing-market-q2-2026", destination: "/inverness-housing-market/", permanent: true },
      { source: "/inverness-housing-market-q2-2026/", destination: "/inverness-housing-market/", permanent: true },
      { source: "/lakeland-housing-market-q2-2026", destination: "/lakeland-housing-market/", permanent: true },
      { source: "/lakeland-housing-market-q2-2026/", destination: "/lakeland-housing-market/", permanent: true },
      { source: "/lecanto-housing-market-q2-2026", destination: "/lecanto-housing-market/", permanent: true },
      { source: "/lecanto-housing-market-q2-2026/", destination: "/lecanto-housing-market/", permanent: true },
      { source: "/nokomis-housing-market-q2-2026", destination: "/nokomis-housing-market/", permanent: true },
      { source: "/nokomis-housing-market-q2-2026/", destination: "/nokomis-housing-market/", permanent: true },
      { source: "/north-port-housing-market-q2-2026", destination: "/north-port-housing-market/", permanent: true },
      { source: "/north-port-housing-market-q2-2026/", destination: "/north-port-housing-market/", permanent: true },
      { source: "/osprey-housing-market-q2-2026", destination: "/osprey-housing-market/", permanent: true },
      { source: "/osprey-housing-market-q2-2026/", destination: "/osprey-housing-market/", permanent: true },
      { source: "/ridge-manor-housing-market-q2-2026", destination: "/ridge-manor-housing-market/", permanent: true },
      { source: "/ridge-manor-housing-market-q2-2026/", destination: "/ridge-manor-housing-market/", permanent: true },
      { source: "/san-antonio-fl-housing-market-q2-2026", destination: "/san-antonio-fl-housing-market/", permanent: true },
      { source: "/san-antonio-fl-housing-market-q2-2026/", destination: "/san-antonio-fl-housing-market/", permanent: true },
      { source: "/sarasota-housing-market-q2-2026", destination: "/sarasota-housing-market/", permanent: true },
      { source: "/sarasota-housing-market-q2-2026/", destination: "/sarasota-housing-market/", permanent: true },
      { source: "/siesta-key-housing-market-q2-2026", destination: "/siesta-key-housing-market/", permanent: true },
      { source: "/siesta-key-housing-market-q2-2026/", destination: "/siesta-key-housing-market/", permanent: true },
      { source: "/spring-hill-housing-market-q2-2026", destination: "/spring-hill-housing-market/", permanent: true },
      { source: "/spring-hill-housing-market-q2-2026/", destination: "/spring-hill-housing-market/", permanent: true },
      { source: "/venice-housing-market-q2-2026", destination: "/venice-housing-market/", permanent: true },
      { source: "/venice-housing-market-q2-2026/", destination: "/venice-housing-market/", permanent: true },
      { source: "/weeki-wachee-housing-market-q2-2026", destination: "/weeki-wachee-housing-market/", permanent: true },
      { source: "/weeki-wachee-housing-market-q2-2026/", destination: "/weeki-wachee-housing-market/", permanent: true },
      { source: "/dover-fl-real-estate-market", destination: "/dover-housing-market/", permanent: true },
      { source: "/dover-fl-real-estate-market/", destination: "/dover-housing-market/", permanent: true },
      { source: "/san-antonio-fl-fl-real-estate-market", destination: "/san-antonio-fl-housing-market/", permanent: true },
      { source: "/san-antonio-fl-fl-real-estate-market/", destination: "/san-antonio-fl-housing-market/", permanent: true },
      { source: "/lakeland-fl-real-estate-market", destination: "/lakeland-housing-market/", permanent: true },
      { source: "/lakeland-fl-real-estate-market/", destination: "/lakeland-housing-market/", permanent: true },
      { source: "/sarasota-fl-real-estate-market", destination: "/sarasota-housing-market/", permanent: true },
      { source: "/sarasota-fl-real-estate-market/", destination: "/sarasota-housing-market/", permanent: true },
      { source: "/venice-fl-real-estate-market", destination: "/venice-housing-market/", permanent: true },
      { source: "/venice-fl-real-estate-market/", destination: "/venice-housing-market/", permanent: true },
      { source: "/north-port-fl-real-estate-market", destination: "/north-port-housing-market/", permanent: true },
      { source: "/north-port-fl-real-estate-market/", destination: "/north-port-housing-market/", permanent: true },
      { source: "/englewood-fl-real-estate-market", destination: "/englewood-housing-market/", permanent: true },
      { source: "/englewood-fl-real-estate-market/", destination: "/englewood-housing-market/", permanent: true },
      { source: "/osprey-fl-real-estate-market", destination: "/osprey-housing-market/", permanent: true },
      { source: "/osprey-fl-real-estate-market/", destination: "/osprey-housing-market/", permanent: true },
      { source: "/nokomis-fl-real-estate-market", destination: "/nokomis-housing-market/", permanent: true },
      { source: "/nokomis-fl-real-estate-market/", destination: "/nokomis-housing-market/", permanent: true },
      { source: "/siesta-key-fl-real-estate-market", destination: "/siesta-key-housing-market/", permanent: true },
      { source: "/siesta-key-fl-real-estate-market/", destination: "/siesta-key-housing-market/", permanent: true },
      { source: "/brooksville-fl-real-estate-market", destination: "/brooksville-housing-market/", permanent: true },
      { source: "/brooksville-fl-real-estate-market/", destination: "/brooksville-housing-market/", permanent: true },
      { source: "/spring-hill-fl-real-estate-market", destination: "/spring-hill-housing-market/", permanent: true },
      { source: "/spring-hill-fl-real-estate-market/", destination: "/spring-hill-housing-market/", permanent: true },
      { source: "/weeki-wachee-fl-real-estate-market", destination: "/weeki-wachee-housing-market/", permanent: true },
      { source: "/weeki-wachee-fl-real-estate-market/", destination: "/weeki-wachee-housing-market/", permanent: true },
      { source: "/hernando-beach-fl-real-estate-market", destination: "/hernando-beach-housing-market/", permanent: true },
      { source: "/hernando-beach-fl-real-estate-market/", destination: "/hernando-beach-housing-market/", permanent: true },
      { source: "/ridge-manor-fl-real-estate-market", destination: "/ridge-manor-housing-market/", permanent: true },
      { source: "/ridge-manor-fl-real-estate-market/", destination: "/ridge-manor-housing-market/", permanent: true },
      { source: "/crystal-river-fl-real-estate-market", destination: "/crystal-river-housing-market/", permanent: true },
      { source: "/crystal-river-fl-real-estate-market/", destination: "/crystal-river-housing-market/", permanent: true },
      { source: "/inverness-fl-real-estate-market", destination: "/inverness-housing-market/", permanent: true },
      { source: "/inverness-fl-real-estate-market/", destination: "/inverness-housing-market/", permanent: true },
      { source: "/homosassa-fl-real-estate-market", destination: "/homosassa-housing-market/", permanent: true },
      { source: "/homosassa-fl-real-estate-market/", destination: "/homosassa-housing-market/", permanent: true },
      { source: "/lecanto-fl-real-estate-market", destination: "/lecanto-housing-market/", permanent: true },
      { source: "/lecanto-fl-real-estate-market/", destination: "/lecanto-housing-market/", permanent: true },

      // ── Duplicate blog post redirects ──
      { source: "/blog/best-neighborhoods-lithia-fl", destination: "/blog/best-neighborhoods-lithia/", permanent: true },
      { source: "/blog/best-neighborhoods-lithia-fl/", destination: "/blog/best-neighborhoods-lithia/", permanent: true },

      // ── Bidirectional comparison redirects ──
      { source: "/riverview-vs-brandon", destination: "/brandon-vs-riverview/", permanent: true },
      { source: "/riverview-vs-brandon/", destination: "/brandon-vs-riverview/", permanent: true },
      { source: "/lutz-vs-land-o-lakes", destination: "/land-o-lakes-vs-lutz/", permanent: true },
      { source: "/lutz-vs-land-o-lakes/", destination: "/land-o-lakes-vs-lutz/", permanent: true },

      // ── Common broken URLs — redirect to correct pages ──
      { source: "/neighborhoods", destination: "/communities/", permanent: true },
      { source: "/neighborhoods/", destination: "/communities/", permanent: true },
      { source: "/new-construction", destination: "/new-construction-homes-tampa-bay/", permanent: true },
      { source: "/new-construction/", destination: "/new-construction-homes-tampa-bay/", permanent: true },
      { source: "/market-reports", destination: "/market-updates/", permanent: true },
      { source: "/market-reports/", destination: "/market-updates/", permanent: true },
      { source: "/buyer-resources", destination: "/buyers/", permanent: true },
      { source: "/buyer-resources/", destination: "/buyers/", permanent: true },
      { source: "/seller-resources", destination: "/sellers/", permanent: true },
      { source: "/seller-resources/", destination: "/sellers/", permanent: true },

      // ── GSC indexed URLs with no exact match ──
      { source: "/luxury/belleair", destination: "/belleair-luxury-homes/", permanent: true },
      { source: "/luxury/belleair/", destination: "/belleair-luxury-homes/", permanent: true },
      { source: "/snell-isle-homes", destination: "/snell-isle/", permanent: true },
      { source: "/snell-isle-homes/", destination: "/snell-isle/", permanent: true },
      { source: "/blog/page/:num(\\d+)", destination: "/blog/", permanent: true },
      { source: "/blog/page/:num(\\d+)/", destination: "/blog/", permanent: true },
      { source: "/properties/listing/:path*", destination: "/properties/", permanent: true },
      { source: "/properties/listing", destination: "/properties/", permanent: true },

      // ── WordPress nested city spoke pages → flat structure ──
      { source: "/:city((?!blog|api|auth|properties|guides|images|wp-content|_next|compare|3813-polumbo-dr).[^/]+)/:city-:topic", destination: "/:city-:topic/", permanent: true },

      // ── WordPress nested neighborhood pages → flat structure ──
      // The :neighborhood param excludes "southoak" because /brandon/southoak/ has a dedicated page
      { source: "/:city((?!blog|api|auth|properties|guides|images|wp-content|_next|compare|3813-polumbo-dr).[^/]+)/:neighborhood((?!southoak).[^/]+)", destination: "/:neighborhood/", permanent: true },

      // ── WordPress Showcase IDX property pages ──
      // Old IDX used /properties/slug-name format. Bridge uses /properties/ListingKey.
      // Don't redirect — let the [id] route handle it. Old Showcase URLs will 404
      // naturally since they won't match a Bridge ListingKey.

      // ── Audit fix Phase 1 (2026-08-13): broken internal links ──
      // /get-help/ returns 404 — point to /contact/
      { source: "/get-help", destination: "/contact/", permanent: true },
      { source: "/get-help/", destination: "/contact/", permanent: true },
      // 825 broken links to /tampa-bay-real-estate-agent
      { source: "/tampa-bay-real-estate-agent", destination: "/about/", permanent: true },
      { source: "/tampa-bay-real-estate-agent/", destination: "/about/", permanent: true },
      // 531 broken links — market update page, not a blog post
      // /blog/ version goes to market-updates; the bare /florida-housing-market-2026/
      // is handled by [citySlug] which already permanentRedirects to /market-updates/
      { source: "/blog/florida-housing-market-2026", destination: "/market-updates/florida-housing-market-2026/", permanent: true },
      { source: "/blog/florida-housing-market-2026/", destination: "/market-updates/florida-housing-market-2026/", permanent: true },
      // 451 broken links — investing page lives at /investing/
      { source: "/blog/investment-property", destination: "/investing/", permanent: true },
      { source: "/blog/investment-property/", destination: "/investing/", permanent: true },
      // 303 broken links — valuation page lives at /free-home-valuation/
      { source: "/blog/home-valuation", destination: "/free-home-valuation/", permanent: true },
      { source: "/blog/home-valuation/", destination: "/free-home-valuation/", permanent: true },
      // 5 broken links — guide lives under /guides/
      { source: "/closing-costs-florida-guide", destination: "/guides/closing-costs-guide-florida/", permanent: true },
      { source: "/closing-costs-florida-guide/", destination: "/guides/closing-costs-guide-florida/", permanent: true },
      // Blog prefix URLs → standalone section pages
      { source: "/blog/waterfront-homes", destination: "/waterfront/", permanent: true },
      { source: "/blog/waterfront-homes/", destination: "/waterfront/", permanent: true },
      { source: "/blog/luxury-homes", destination: "/luxury/", permanent: true },
      { source: "/blog/luxury-homes/", destination: "/luxury/", permanent: true },
      { source: "/blog/realtor", destination: "/about/", permanent: true },
      { source: "/blog/realtor/", destination: "/about/", permanent: true },
      // Blog prefix city URLs → city hub pages
      { source: "/blog/brandon-fl-homes-for-sale", destination: "/brandon/", permanent: true },
      { source: "/blog/brandon-fl-homes-for-sale/", destination: "/brandon/", permanent: true },
      { source: "/blog/valrico-fl-homes-for-sale", destination: "/valrico/", permanent: true },
      { source: "/blog/valrico-fl-homes-for-sale/", destination: "/valrico/", permanent: true },
      { source: "/blog/plant-city-fl-homes-for-sale", destination: "/plant-city/", permanent: true },
      { source: "/blog/plant-city-fl-homes-for-sale/", destination: "/plant-city/", permanent: true },
      { source: "/blog/seffner-fl-homes-for-sale", destination: "/seffner/", permanent: true },
      { source: "/blog/seffner-fl-homes-for-sale/", destination: "/seffner/", permanent: true },
      { source: "/blog/riverview-fl-homes-for-sale", destination: "/riverview/", permanent: true },
      { source: "/blog/riverview-fl-homes-for-sale/", destination: "/riverview/", permanent: true },

      // ── WordPress sitemap URLs — redirect to new sitemap ──
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-home.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-posts.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-pages.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-categories.xml", destination: "/sitemap.xml", permanent: true },

      // ── WordPress legacy URL patterns — redirect to relevant pages ──
      { source: "/category/:slug*", destination: "/blog/", permanent: true },
      { source: "/tag/:slug*", destination: "/blog/", permanent: true },
      { source: "/author/:slug*", destination: "/about/", permanent: true },
      { source: "/page/:num(\\d+)", destination: "/blog/", permanent: true },
      { source: "/feed/:slug*", destination: "/", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
      { source: "/comments/feed", destination: "/", permanent: true },
      { source: "/wp-admin/:slug*", destination: "/", permanent: false },
      { source: "/wp-login.php", destination: "/", permanent: false },
      // wp-content redirect removed — static files in public/wp-content/ need to serve
      // (e.g. headshot image used in email signature)
      { source: "/tampa-bay-area-homes-for-sale", destination: "/properties/", permanent: true },
      { source: "/tampa-bay-area-homes-for-sale/:slug*", destination: "/properties/", permanent: true },

      // ── Guide pages: /slug → /guides/slug (51 individual redirects) ──
      // WordPress served guides at root, new site nests under /guides/
      ...getGuideRedirects(),

      // Blog post redirects (/slug → /blog/slug) now handled at runtime
      // by the [citySlug] catch-all route to stay under Vercel's 2048 route limit.
    ];
  },
  async rewrites() {
    return [
      // Private seller hub — static HTML (both with and without trailing slash)
      { source: '/3813-polumbo', destination: '/3813-polumbo.html' },
      { source: '/3813-polumbo/', destination: '/3813-polumbo.html' },
      { source: '/1609-lakeview-ave', destination: '/1609-lakeview-ave.html' },
      { source: '/1609-lakeview-ave/', destination: '/1609-lakeview-ave.html' },
    ];
  },
  // Allow Bridge API listing photos and Showcase IDX images
  images: {
    // Prefer modern image formats — avif first, then webp
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.bridgedataoutput.com",
      },
      {
        protocol: "https",
        hostname: "images.showcaseidx.com",
      },
      {
        protocol: "https",
        hostname: "photos.stellarmls.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
