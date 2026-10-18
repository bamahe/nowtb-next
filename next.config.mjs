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

// Market update slugs — these live at /market-updates/slug/ but WordPress served
// them at /slug/. The [citySlug] catch-all already redirects them, but it does so
// during a static render, which Next.js can only express as a <meta http-equiv=
// "refresh"> — a visible one-second bounce that search engines don't treat as a
// 301, and that can serve a stale self-referencing redirect out of the ISR cache
// (which is what made /florida-housing-market-2026/ ping-pong). Emitting real 308s
// here fixes all of that. If it breaks, check: a slug listed here must actually
// exist in market-updates-export.json, or the redirect lands on a 404.
function getMarketUpdateRedirects() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/market-updates-export.json');
    const updates = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return updates.flatMap((u) => [
      { source: `/${u.slug}`, destination: `/market-updates/${u.slug}/`, permanent: true },
      { source: `/${u.slug}/`, destination: `/market-updates/${u.slug}/`, permanent: true },
    ]);
  } catch {
    console.warn('Could not load market updates for redirects');
    return [];
  }
}

// Blog posts that Google is actively surfacing at their OLD WordPress root URL
// (/slug/ instead of /blog/slug/). The [citySlug] catch-all is supposed to
// redirect these at runtime, but it is statically rendered, so the 404 page got
// baked into the ISR cache and these URLs return a blank page with a 200 status.
// Search Console showed 20,993 AI impressions landing on those blank pages.
// Explicit config redirects run before any route, so they always win.
// The list is deliberately narrow — only slugs with real impressions — because
// redirecting all 1,735 posts would blow Vercel's route limit.
// If it breaks, check: every slug here must exist in posts-export.json.
function getBlogRootRedirects() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/blog-root-redirects.txt');
    const slugs = fs.readFileSync(filePath, 'utf-8').split('\n').map((s) => s.trim()).filter(Boolean);
    return slugs.flatMap((slug) => [
      { source: `/${slug}`, destination: `/blog/${slug}/`, permanent: true },
      { source: `/${slug}/`, destination: `/blog/${slug}/`, permanent: true },
    ]);
  } catch {
    console.warn('Could not load blog root redirects');
    return [];
  }
}

// Community pages that live NESTED under their city (/auburndale/gapway-lakes-estates/)
// must be excluded from the ":city flatten" redirect further down, or the site
// builds an infinite 308 loop and the page becomes permanently unreachable:
//
//   1. next.config flattens /auburndale/gapway-lakes-estates/ -> /gapway-lakes-estates/
//   2. src/app/[citySlug]/page.tsx looks the bare slug up in community-pages.ts
//      and permanentRedirects it back to /auburndale/gapway-lakes-estates/
//   3. go to 1. forever.
//
// This bit the site in production on 2026-10-17 (verified with curl: six 308s
// ping-ponging between the two URLs). It is invisible in `next dev`, because
// local dev hits the filesystem route before the redirect, so it ONLY ever shows
// up on the live domain. That is why this list is generated from the data file
// instead of hand-maintained: adding a new entry to community-pages.ts now
// excludes itself automatically and cannot reintroduce the loop.
//
// If it breaks, check:
//   - A nested community 404s instead of rendering => the folder
//     src/app/{citySlug}/{slug}/page.tsx does not exist. The exclusion only stops
//     the redirect; it does not create the route.
//   - A nested community still loops => confirm its slug appears in the built
//     regex by running: node -e "import('./next.config.mjs')" and logging it, or
//     check that its `slug:` line in community-pages.ts uses double quotes.
//   - Every slug here is matched as a PREFIX of the second path segment, so a
//     slug that is a prefix of another community's slug will shadow it.
function getCommunityFlattenExclusions() {
  // "southoak" predates community-pages.ts and is not registered there, so it is
  // always included. /brandon/southoak/ is a real hand-built page.
  const always = ['southoak'];
  try {
    const filePath = path.join(process.cwd(), 'src/data/community-pages.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    // Same parse style as getGuideRedirects above: only `slug: "value"` lines
    // match, so the `slug: string;` interface declaration is skipped.
    const slugs = [...content.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
    return [...new Set([...always, ...slugs])];
  } catch {
    console.warn('Could not load community pages for flatten exclusions');
    return always;
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

    // Pipe-joined slugs for the ":neighborhood" negative lookahead below, e.g.
    // "southoak|gapway-lakes-estates". See getCommunityFlattenExclusions above
    // for why this exists — it is the fix for a live 308 redirect loop.
    const communityFlattenExclusions = getCommunityFlattenExclusions().join('|');

    return [
      // ── CURRENT OPEN HOUSE — the reusable printed QR ────────────────────────
      // The QR codes printed for the 3813 Polumbo open house are physical cards
      // and sign riders. Rather than reprint them for every new listing, those
      // two URLs act as a permanent pointer to whatever open house is running
      // now. To reuse the same printed QR at the next listing, change only the
      // two destinations below — nothing else, and no reprint.
      //
      // MUST stay `permanent: false` (307). A 308 is cached by the visitor's
      // browser indefinitely, so anyone who scanned at a previous open house
      // would be sent to the OLD listing forever and re-pointing would silently
      // stop working for them. If it breaks, check this flag first.
      //
      // Currently pointing at: 2510 Brimhollow Dr (open house Sun Oct 18, 2 to 4)
      { source: "/3813-polumbo-dr", destination: "/2510-brimhollow-dr/", permanent: false },
      { source: "/3813-polumbo-dr/", destination: "/2510-brimhollow-dr/", permanent: false },
      { source: "/3813-polumbo-dr/sign-in", destination: "/2510-brimhollow-dr/sign-in/", permanent: false },
      { source: "/3813-polumbo-dr/sign-in/", destination: "/2510-brimhollow-dr/sign-in/", permanent: false },
      { source: "/3813-polumbo-dr/feedback", destination: "/2510-brimhollow-dr/feedback/", permanent: false },
      { source: "/3813-polumbo-dr/feedback/", destination: "/2510-brimhollow-dr/feedback/", permanent: false },

      // ── /home-valuation/ → /free-home-valuation/ (CRAWLER FIX, 2026-10-17) ──
      // This used to be done by `redirect("/free-home-valuation/")` inside the
      // server component at src/app/home-valuation/page.tsx. That looked fine in
      // a browser, because the React client router quietly follows it. It was
      // badly broken for every crawler.
      //
      // WHY: `redirect()` called during a STATIC render has no real HTTP
      // response to attach a Location header to. Next.js prerenders the route,
      // the redirect throws, and what gets served to a plain HTTP client is a
      // 307 with NO Location header plus Next's __next_error__ HTML shell.
      // Verified live with curl: status 307, zero Location. A redirect with no
      // destination is a dead end — Googlebot cannot follow it, so ~1,500+
      // internal links (this is the most-linked valuation URL on the site,
      // roughly twice as many links as /free-home-valuation/ itself) all
      // terminate in nothing.
      //
      // A redirect declared HERE is handled by the platform's routing layer
      // before any React code runs, so it emits a normal HTTP response with a
      // correct Location header. Crawlers follow it; browsers follow it.
      //
      // WHY `permanent: false` (307) AND NOT `permanent: true` (308):
      // The 307-vs-308 choice is NOT what was broken — the missing Location
      // header was. So there is no reason to spend the one-way door here.
      // 308 is cached hard by browsers and tells Google "consolidate all signal
      // onto /free-home-valuation/ and drop the old URL." The site owner has
      // NOT yet decided which of the two URLs should host the real page, and
      // /home-valuation/ is arguably the better home for it: it is the shorter
      // keyword ("free" is just a modifier) and it already carries about twice
      // the internal links. If that flip ever happens, a cached 308 pointing
      // the wrong way has to be un-taught to every browser that cached it and
      // to Google's consolidated index. A 307 says "temporary, keep the source
      // URL in the index", which fixes the crawl dead end today and keeps the
      // decision reversible. Do not "upgrade" this to permanent until the
      // direction is settled. See src/app/home-valuation/page.tsx for the
      // full write-up of that open question.
      //
      // The trailing slash on the destination is REQUIRED. `trailingSlash: true`
      // is set above, so a destination of "/free-home-valuation" (no slash)
      // would 308 again to the slashed form — two hops instead of one, paid by
      // every one of those ~1,500 links.
      //
      // Safe against the other rules in this file:
      //  - The two ":city" flatten rules (further down) only match paths with
      //    TWO segments (/:city/:something). "/home-valuation/" is one segment,
      //    so it can never reach them.
      //  - /free-home-valuation/ is not the `source` of any rule here, so this
      //    cannot form a loop. (grep it: it only ever appears as a destination.)
      //  - No guide, post, or market-update slug is named "home-valuation", so
      //    none of the generated redirect lists can produce a competing rule.
      //
      // If it breaks, check:
      //  - /home-valuation/ now 404s => src/app/free-home-valuation/page.tsx was
      //    moved or renamed. The redirect only points; it does not create.
      //  - Redirect loop => something started redirecting /free-home-valuation/.
      //    Grep this file for it as a `source`.
      //  - Still seeing the old 307-with-no-Location => a CDN edge is serving a
      //    cached response from before this deploy. Purge, then re-curl.
      { source: "/home-valuation", destination: "/free-home-valuation/", permanent: false },
      { source: "/home-valuation/", destination: "/free-home-valuation/", permanent: false },

      // ── Manual redirects (all destinations end with / for trailingSlash: true) ──
      { source: "/home", destination: "/", permanent: true },
      { source: "/first-time-buyers", destination: "https://firsttimehomebuyertb.com/", permanent: true },
      { source: "/first-time-buyers/", destination: "https://firsttimehomebuyertb.com/", permanent: true },
      { source: "/st-pete-homes-for-sale", destination: "/st-petersburg-homes-for-sale/", permanent: true },
      { source: "/terms", destination: "/terms-of-use/", permanent: true },
      { source: "/privacy", destination: "/privacy-policy/", permanent: true },

      // ── Removed bad "Largo neighborhood" data → real municipalities ──
      // "Belleair Meadows" was not a real place. "Indian Rocks" was a mislabel of
      // Indian Rocks Beach, which is its own city. Both were in the sitemap, so
      // these 301s preserve the URLs instead of leaving 404s behind.
      { source: "/belleair-meadows", destination: "/belleair/", permanent: true },
      { source: "/belleair-meadows/", destination: "/belleair/", permanent: true },
      { source: "/belleair-meadows-homes-for-sale", destination: "/belleair-homes-for-sale/", permanent: true },
      { source: "/belleair-meadows-homes-for-sale/", destination: "/belleair-homes-for-sale/", permanent: true },
      { source: "/belleair-meadows-realtor", destination: "/belleair-realtor/", permanent: true },
      { source: "/belleair-meadows-realtor/", destination: "/belleair-realtor/", permanent: true },
      { source: "/indian-rocks", destination: "/indian-rocks-beach/", permanent: true },
      { source: "/indian-rocks/", destination: "/indian-rocks-beach/", permanent: true },
      { source: "/indian-rocks-homes-for-sale", destination: "/indian-rocks-beach-homes-for-sale/", permanent: true },
      { source: "/indian-rocks-homes-for-sale/", destination: "/indian-rocks-beach-homes-for-sale/", permanent: true },
      { source: "/indian-rocks-realtor", destination: "/indian-rocks-beach-realtor/", permanent: true },
      { source: "/indian-rocks-realtor/", destination: "/indian-rocks-beach-realtor/", permanent: true },

      // ── Out-of-area "neighborhood" data → nearest service-area county ──
      // These were listed in neighborhoods.ts as neighborhoods of Sarasota (and
      // Indian Harbour Beach as one of Lakeland), but they are separate cities in
      // Lee, Collier, Charlotte, and Brevard counties, all outside the 8-county
      // service area. The catch-all route auto-generated a hub, a homes-for-sale
      // page, and a REALTOR page for each one, and they reached the sitemap. These
      // 301s retire the URLs without leaving 404s behind.
      // Cape Coral is in Lee County, not a neighborhood of its listed city
      { source: "/cape-coral", destination: "/sarasota-county/", permanent: true },
      { source: "/cape-coral/", destination: "/sarasota-county/", permanent: true },
      { source: "/cape-coral-homes-for-sale", destination: "/sarasota-county/", permanent: true },
      { source: "/cape-coral-homes-for-sale/", destination: "/sarasota-county/", permanent: true },
      { source: "/cape-coral-realtor", destination: "/sarasota-county/", permanent: true },
      { source: "/cape-coral-realtor/", destination: "/sarasota-county/", permanent: true },
      // Fort Myers is in Lee County, not a neighborhood of its listed city
      { source: "/fort-myers", destination: "/sarasota-county/", permanent: true },
      { source: "/fort-myers/", destination: "/sarasota-county/", permanent: true },
      { source: "/fort-myers-homes-for-sale", destination: "/sarasota-county/", permanent: true },
      { source: "/fort-myers-homes-for-sale/", destination: "/sarasota-county/", permanent: true },
      { source: "/fort-myers-realtor", destination: "/sarasota-county/", permanent: true },
      { source: "/fort-myers-realtor/", destination: "/sarasota-county/", permanent: true },
      // Naples is in Collier County, not a neighborhood of its listed city
      { source: "/naples", destination: "/sarasota-county/", permanent: true },
      { source: "/naples/", destination: "/sarasota-county/", permanent: true },
      { source: "/naples-homes-for-sale", destination: "/sarasota-county/", permanent: true },
      { source: "/naples-homes-for-sale/", destination: "/sarasota-county/", permanent: true },
      { source: "/naples-realtor", destination: "/sarasota-county/", permanent: true },
      { source: "/naples-realtor/", destination: "/sarasota-county/", permanent: true },
      // Port Charlotte is in Charlotte County, not a neighborhood of its listed city
      { source: "/port-charlotte", destination: "/sarasota-county/", permanent: true },
      { source: "/port-charlotte/", destination: "/sarasota-county/", permanent: true },
      { source: "/port-charlotte-homes-for-sale", destination: "/sarasota-county/", permanent: true },
      { source: "/port-charlotte-homes-for-sale/", destination: "/sarasota-county/", permanent: true },
      { source: "/port-charlotte-realtor", destination: "/sarasota-county/", permanent: true },
      { source: "/port-charlotte-realtor/", destination: "/sarasota-county/", permanent: true },
      // Punta Gorda is in Charlotte County, not a neighborhood of its listed city
      { source: "/punta-gorda", destination: "/sarasota-county/", permanent: true },
      { source: "/punta-gorda/", destination: "/sarasota-county/", permanent: true },
      { source: "/punta-gorda-homes-for-sale", destination: "/sarasota-county/", permanent: true },
      { source: "/punta-gorda-homes-for-sale/", destination: "/sarasota-county/", permanent: true },
      { source: "/punta-gorda-realtor", destination: "/sarasota-county/", permanent: true },
      { source: "/punta-gorda-realtor/", destination: "/sarasota-county/", permanent: true },
      // Indian Harbour Beach is in Brevard County, not a neighborhood of its listed city
      { source: "/indian-harbour-beach", destination: "/polk-county/", permanent: true },
      { source: "/indian-harbour-beach/", destination: "/polk-county/", permanent: true },
      { source: "/indian-harbour-beach-homes-for-sale", destination: "/polk-county/", permanent: true },
      { source: "/indian-harbour-beach-homes-for-sale/", destination: "/polk-county/", permanent: true },
      { source: "/indian-harbour-beach-realtor", destination: "/polk-county/", permanent: true },
      { source: "/indian-harbour-beach-realtor/", destination: "/polk-county/", permanent: true },
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
      // These two DELIBERATELY shadow the route at src/app/new-construction/page.tsx.
      // Reviewed 2026-10-17 and kept on purpose: /new-construction-homes-tampa-bay/
      // is the established page (src/data/regional-pages.ts, rendered through the
      // [citySlug] catch-all) and holds effectively all the internal link equity —
      // the /builders/ page CTAs plus dozens of blog-post CTAs point at it. Letting
      // /new-construction/ render too would create two competing "new construction"
      // pages and cannibalize the keyword.
      //
      // If it breaks, check: src/app/new-construction/page.tsx is UNREACHABLE dead
      // code while these lines exist. Do not "fix" that page's canonical or content
      // and expect to see it live. Either delete that route or remove these two
      // redirects — but if you remove them, repoint the internal links first.
      // NOTE: /new-construction/ must also stay OUT of sitemap.ts, or the sitemap
      // advertises a URL that 308s away. See the propertyTypeLandingPages array.
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
      { source: "/:city((?!blog|api|auth|clients|properties|guides|images|wp-content|_next|compare|market-updates|builders|communities|account|sell|resources|3813-polumbo-dr|11417-cypress-park-st|30935-whitlock-dr|2510-brimhollow-dr).[^/]+)/:city-:topic", destination: "/:city-:topic/", permanent: true },

      // ── WordPress nested neighborhood pages → flat structure ──
      // The :neighborhood param excludes every slug in community-pages.ts (plus
      // "southoak") because those have real hand-built nested pages. Flattening
      // them created an infinite 308 loop with the [citySlug] catch-all, which is
      // why the list is now generated instead of typed by hand.
      //
      // DO NOT replace `${communityFlattenExclusions}` with a hardcoded slug list.
      // That is exactly how /auburndale/gapway-lakes-estates/ went dead.
      //
      // NOTE: there are TWO ":city" lookahead lists — this one and the
      // ":city-:topic" rule directly above. They are byte-identical on purpose and
      // must stay that way; if you add a path prefix to one, add it to the other.
      // Only the ":neighborhood" lookahead below carries the community slugs,
      // because the rule above only matches a second segment that starts with the
      // city name (e.g. /auburndale/auburndale-homes-for-sale) and so can never
      // match a community slug. Adding cities to the ":city" lists instead would
      // break legacy WordPress flattening for that whole city.
      { source: `/:city((?!blog|api|auth|clients|properties|guides|images|wp-content|_next|compare|market-updates|builders|communities|account|sell|resources|3813-polumbo-dr|11417-cypress-park-st|30935-whitlock-dr|2510-brimhollow-dr).[^/]+)/:neighborhood((?!${communityFlattenExclusions}).[^/]+)`, destination: "/:neighborhood/", permanent: true },

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

      // ── Blog posts Google surfaces at their old root URL → /blog/slug/ ──
      // Recovers the AI/search impressions currently landing on blank pages
      ...getBlogRootRedirects(),

      // ── Market updates: /slug → /market-updates/slug (232 posts) ──
      // Server-side 308s so these never fall back to a meta-refresh bounce
      ...getMarketUpdateRedirects(),

      // Blog post redirects (/slug → /blog/slug) now handled at runtime
      // by the [citySlug] catch-all route to stay under Vercel's 2048 route limit.
    ];
  },
  async rewrites() {
    return {
      // beforeFiles rewrites run before Next.js checks any file or route —
      // this overrides any stale CDN-cached 308s from previous deployments
      beforeFiles: [
        // Force /market-updates/[slug]/ to serve from the market-updates route
        // (fixes cached 308 loop from prior cannibalization fix deployment)
        { source: '/market-updates/:slug/', destination: '/market-updates/:slug/' },
        { source: '/market-updates/:slug', destination: '/market-updates/:slug/' },
      ],
      afterFiles: [
        // Private seller hub — static HTML (both with and without trailing slash)
        { source: '/3813-polumbo', destination: '/3813-polumbo.html' },
        { source: '/3813-polumbo/', destination: '/3813-polumbo.html' },
        { source: '/1609-lakeview-ave', destination: '/1609-lakeview-ave.html' },
        { source: '/1609-lakeview-ave/', destination: '/1609-lakeview-ave.html' },
        // Private client packets live as a folder of static files under
        // public/c/<slug>/. Files in public/ are matched by exact path, so
        // without these the bare folder URL 404s and only /index.html works.
        { source: '/c/:slug', destination: '/c/:slug/index.html' },
        { source: '/c/:slug/', destination: '/c/:slug/index.html' },
      ],
    };
  },
  // Allow Bridge API listing photos and Showcase IDX images
  images: {
    // COST CONTROL (2026-09-08). Image Optimization was $160/mo on this project
    // alone. Three settings drive that, all of them Next.js defaults:
    //
    // 1. minimumCacheTTL defaults to 60 SECONDS in Next 14. Every Bridge/Stellar
    //    listing photo was being re-optimized and re-billed about once a minute,
    //    which is why we saw 14.7M cache writes against 2M transformations.
    //    2678400 seconds = 31 days.
    // 2. Listing two formats generates a separate billable variant per format,
    //    and AVIF is the most expensive encode Vercel bills. WebP only.
    // 3. Default deviceSizes (8) + imageSizes (8) means up to 16 widths per
    //    photo. The four below cover phone / tablet / laptop / retina.
    //
    // If a listing swaps photos and a stale one sticks around, Bridge is reusing
    // the same photo URL for new images. Drop the TTL to 604800 (7 days) and run
    // `vercel cache invalidate --srcimg <url>` on the stragglers.
    minimumCacheTTL: 2678400,
    formats: ["image/webp"],
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [256, 384],
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
