# nowtb.com — Technical SEO Audit

**Repo:** `/Users/barretthenry/Projects/nowtb-leadmachine` · branch `seo/lead-machine-oct2026`
**Date:** 2026-10-17 · **Method:** static analysis + data-driven generation of every page's actual title/description from the real templates and data files. No build, no dev server.

---

# ⚠️ RE-VERIFICATION (2026-10-18) — READ THIS FIRST

**The working tree was NOT clean, and most of this report's fix list was implemented while the audit was running.** Everything below this section is a snapshot of a tree state that no longer exists. Line citations are stale for every file listed as modified.

`git status --short` shows **41 modified files plus 9 untracked**, including the exact files this report targets: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/lib/utils.ts`, `next.config.mjs`, `public/llms.txt`, `src/app/properties/page.tsx`, `src/data/regional-pages.ts`, and most of `src/components/pages/`. `next.config.mjs` grew 527 → **603 lines**; `sitemap.ts` 252 → **313**. Nothing is committed.

**This is Barrett's known failure mode** — the content automation deploys from git and silently reverts uncommitted work, and a previous large uncommitted pile turned out to be an abandoned edit. **Commit and push this work before the next automation run, or it is lost.**

## Blocker status against the current tree

| # | Blocker | Status | Evidence (current line numbers) |
|---|---|---|---|
| 1 | Title template too long | **FIXED** | `src/app/layout.tsx:111` → `template: "%s \| Barrett Henry"` — 16 chars, was 26 |
| 2 | 2,160 thin neighborhood pages | **OPEN** | `src/app/sitemap.ts:206-219` still emits 3 URLs per neighborhood |
| 3 | Sitemap frozen at build | **FIXED** | `src/app/sitemap.ts:49` → `export const revalidate = 3600;` + a "DO NOT DELETE THIS EXPORT" comment at `:21` |
| 4 | `/properties/` noindex + in sitemap | **OPEN** | still at `src/app/sitemap.ts:73`, priority 0.9 hourly. A comment at `:52` acknowledges it but the URL was not removed |
| 5 | `/auburndale/…` 308 loop | **FIXED, better than recommended** | `next.config.mjs:156` derives `communityFlattenExclusions` from `getCommunityFlattenExclusions()`; applied at `:448`. Data-driven, so new community pages self-register — no hand-maintained deny-list |
| 6 | 265 double-h1 blog posts | **OPEN** | no h1 handling in `cleanWpContent` (`src/lib/utils.ts`) |
| 7 | Description length window | **FIXED** | `src/lib/utils.ts:655` → `const MAX = 155;` |
| 8 | 166 dup market-update descriptions | **OPEN** | unchanged |
| 9 | 186 duplicate condo pages | **OPEN** | `src/data/cities.ts:37-38` still share `{property_sub_type:"Condominium"}` |
| 10 | Missing BreadcrumbList | **PARTIAL** | `ComparisonPage.tsx` now 3, `MiscCatchAllPage.tsx` now 1, **`RegionalPage.tsx` still 0** (34 pages) |
| — | `llms.txt` stale counts | **FIXED** | `public/llms.txt:25` → "93 cities, 740 neighborhoods" |
| — | GA4 missing | **FIXED** | new `src/lib/analytics.ts` + conditional gtag at `src/app/layout.tsx:363-374`. Still a no-op until `NEXT_PUBLIC_GA_ID` is set in Vercel — **it is not set today** |
| — | `:focus-visible` missing | **OPEN** | no match in `src/app/globals.css` |
| — | `/new-construction/` shadowing | **RESOLVED — I was wrong** | `new-construction-homes-tampa-bay` **is** a real slug (`src/data/regional-pages.ts:84`). It is not a 404. `next.config.mjs:395-410` now documents the shadowing as deliberate ("Reviewed 2026-10-17"). My §6 claim that it redirects to a probable 404 was incorrect — I only checked `cities.ts` |

## Recomputed headline number

Over-length titles (>60 chars) across the four big families, before vs. after the `layout.tsx` fix:

| Family | Before | After | Total |
|---|---|---|---|
| City hub/spoke/realtor/sell | 1,076 | **67** | 2,272 |
| Neighborhood | 2,024 | **987** | 2,160 |
| Blog | 1,607 | **1,379** | 1,760 |
| Market updates | 206 | **163** | 232 |
| **TOTAL** | **4,913** | **2,596** | |

**The template fix resolved ~2,317 pages (47%).** The remaining 2,596 are too long on their own and need per-title truncation — blog (1,379) and neighborhood (987) are the whole problem now. Note the city family went to 67, not 0, because the fix shortened the suffix by 10 chars while the longest city titles (`Horse & Equestrian Properties in …`) were 16 over.

## New regression introduced by the fix

**`src/app/[citySlug]/page.tsx:382-392`** still measures the **old** suffix:
```ts
withReloc.length + " | Barrett Henry, REALTOR®".length <= 60
```
`layout.tsx` now appends 16 chars, not 26, but this hardcoded string was not updated. The realtor case is now over-conservative and strips `| Relocation` from **23 cities where it would now fit** — Sun City Center (53 chars), Temple Terrace (52), Town 'n' Country (54), Bradenton Beach (53), Lakewood Ranch (52), Land O' Lakes (51), New Port Richey (53), Wesley Chapel (51), Indian Rocks Beach (56), Madeira Beach (51), Pinellas Park (51), Safety Harbor (51), St. Pete Beach (52), St. Petersburg (52), +9 more. The stale comment at `:383` still says "(26 chars)". Fix: replace the literal with a shared constant exported from `layout.tsx`, so the two can never drift again.

## Revised next actions

1. **Commit and push** the 41 modified files — highest priority, this work is at risk.
2. Fix the realtor regression above (one string, recovers 23 titles).
3. Remove `/properties/` from `src/app/sitemap.ts:73` (blocker #4 — the comment was added, the line was not deleted).
4. Add BreadcrumbList to `RegionalPage.tsx` (34 pages — the only one of the three still missing).
5. Truncate the 1,379 blog + 987 neighborhood titles that remain over 60.
6. Then the still-open structural items: #2, #6, #8, #9.

---

## Scale corrections to the brief

The brief's page counts were off. Measured from the data files:

| Brief said | Actual | Source |
|---|---|---|
| 119 cities | **93** | `src/data/cities.ts` |
| 1,203 misc catch-all pages | **32** | `src/data/misc-pages.ts` (`handling: "catch-all"`) |
| ~3,400 total pages | **6,592 sitemap URLs** | computed from `src/app/sitemap.ts` |
| `[citySlug]/page.tsx` ~1,481 lines | **2,086 lines** | `wc -l` |
| Next.js 16 | **14.2.35** | `package.json:24` |

The single biggest surprise: **720 neighborhoods × 3 page types = 2,160 URLs, 32.8% of the entire sitemap**, and they are the thinnest pages on the site.

---

## 1. Top 10 ranking-blockers

Ranked by (pages affected × severity).

### #1 — The root layout title template pushes ~4,963 pages past 60 characters
**`src/app/layout.tsx:35`**
```
template: "%s | Barrett Henry, REALTOR®",
```
That suffix is **26 characters** and is appended to every page title in the site. Only ONE code path in the entire repo accounts for it — the realtor case at `src/app/[citySlug]/page.tsx:371-381`, which explicitly measures `withReloc.length + " | Barrett Henry, REALTOR®".length <= 60`. Every other template writes a title that already uses 40–60 chars and then silently gets 26 more bolted on.

Measured over-length titles (>60 chars including the suffix):

| Page family | Over 60 | Total | % | Over 60 *without* the suffix |
|---|---|---|---|---|
| Blog posts | **1,607** | 1,760 | 91.3% | 404 |
| Neighborhood pages | **2,024** | 2,160 | 93.7% | 38 |
| City hub/spoke/realtor/sell | **1,076** | 2,272 | 47.4% | **0** |
| Market updates | **206** | 232 | 88.8% | — |
| Comparisons | **31** | 31 | 100% | — |
| Regional | 11 | 34 | 32% | — |
| Misc catch-all | 5 | 32 | 16% | — |
| Guides | 3 | 49 | 6% | — |
| **TOTAL** | **~4,963** | 6,592 | **~75%** | |

Worst offenders:
- 132 chars — `/blog/arista-valrico-grand-opening-new-gated-community/` → `"Arista and Valrico FL Gated Communities 2026: Complete Guide to Diamond Hill, River Hills, and New Options | Barrett Henry, REALTOR®"`
- 96 chars — `/estancia-at-wiregrass/` → `"Estancia at Wiregrass Wesley Chapel Homes for Sale | Wesley Chapel, FL | Barrett Henry, REALTOR®"`
- 76 chars — `/land-o-lakes-horse-properties/` → `"Horse & Equestrian Properties in Land O' Lakes, FL | Barrett Henry, REALTOR®"`

**Fix:** change `src/app/layout.tsx:35` to a short template (`"%s | Barrett Henry"` = 19 chars, or drop the template entirely and let each page own its full title). For the city family this one edit alone brings all 1,076 back under 60, because zero of them exceed 60 on their own. Then separately truncate the 404 blog titles that are too long by themselves.

### #2 — 2,160 neighborhood pages (32.8% of the sitemap) are pure template-swap boilerplate
**`src/app/sitemap.ts:142-166`** emits three URLs per neighborhood:
```ts
const filteredNeighborhoods = neighborhoods.filter((n) => !citySlugs.has(n.slug));
const neighborhoodPages: MetadataRoute.Sitemap = filteredNeighborhoods.flatMap((n) => [
  { url: `${siteUrl}/${n.slug}/`, ... },
  { url: `${siteUrl}/${n.slug}-homes-for-sale/`, ... },
  { url: `${siteUrl}/${n.slug}-realtor/`, ... },
]);
```
720 neighborhoods survive the city-slug filter (740 total, 20 dropped) → **2,160 URLs**.

- **529 of 720** base pages have NO curated description — `NEIGHBORHOOD_DESCRIPTIONS` in `src/data/neighborhood-descriptions.ts` only has **192** keys, so 73% fall through to the generic string at `src/app/[citySlug]/page.tsx:414`.
- **1,969 of 2,160** descriptions come from exactly 3 boilerplate skeletons (`src/app/[citySlug]/page.tsx:413-415`, `:433`, `:450`).
- `/{slug}/` and `/{slug}-homes-for-sale/` titles differ **only by `|` vs `—`**:
  - `/andalucia/` → `"Andalucia Homes for Sale | Apollo Beach, FL"` (`:419`)
  - `/andalucia-homes-for-sale/` → `"Andalucia Homes for Sale — Apollo Beach, FL"` (`:434`)

That is 720 pairs of self-cannibalizing near-identical pages. This is the documented "programmatic thin pages" failure — 1,567 pages → 5 leads/mo. **Fix:** consolidate `/{slug}-homes-for-sale/` into `/{slug}/` with a 308, and cut the sitemap to the 192 neighborhoods that have real curated facts.

### #3 — `src/app/sitemap.ts` has NO `revalidate` export; it is frozen at build time
`grep -n "revalidate\|dynamic" src/app/sitemap.ts` → **zero matches** across all 252 lines.

Next.js caches `sitemap.ts` by default. Every new blog post from the 3-day cron (`vercel.json` → `/api/cron/generate-post`, `0 8 */3 * *`) and every Supabase-sourced post loaded at `src/lib/posts.ts:54` is invisible to Google until the next deploy. `getAllPosts()` merges a Supabase fetch, so the sitemap is explicitly dynamic data being served from a build-time snapshot.

**Fix:** add `export const revalidate = 3600;` to `src/app/sitemap.ts`.

### #4 — `/properties/` is `noindex` but sits in the sitemap at priority 0.9, `changeFrequency: hourly`
`src/app/properties/page.tsx:33-36`
```ts
robots: {
  index: false,
  follow: true, // still follow links to individual listing pages
},
```
`src/app/sitemap.ts:27`
```ts
{ url: `${siteUrl}/properties/`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
```
The sitemap tells Google this is the second-most-important URL on the site and to recrawl it hourly; the page tells Google never to index it. That burns crawl budget on the highest-priority entry and emits a contradictory signal. The `noindex` itself is correct reasoning (filtered search results). **Fix:** remove the URL from `staticPages`.

### #5 — Live 308 redirect LOOP on a sitemap-submitted URL
`/auburndale/gapway-lakes-estates/` is in the sitemap (`src/app/sitemap.ts:170`, via `communityPages.map(c => ({ url: ... c.href }))`).

`auburndale` is absent from both `:city` flatten lookaheads, so **`next.config.mjs:368`** matches:
```
{ source: "/:city((?!blog|api|auth|clients|properties|guides|images|wp-content|_next|compare|market-updates|builders|communities|account|sell|resources|3813-polumbo-dr|11417-cypress-park-st|30935-whitlock-dr).[^/]+)/:city-:topic", destination: "/:city-:topic/", permanent: true },
```
`/auburndale/gapway-lakes-estates` → params `{city: "gapway", topic: "lakes-estates"}` → `/gapway-lakes-estates/`. That then hits the catch-all, which sends it right back:

`src/app/[citySlug]/page.tsx:599-602`
```tsx
const communityPage = getCommunityPageBySlug(citySlug);
if (communityPage) {
  permanentRedirect(communityPage.href);
}
```
`src/data/community-pages.ts:41-46` — `slug: "gapway-lakes-estates"`, `href: "/auburndale/gapway-lakes-estates/"`.

Result: `ERR_TOO_MANY_REDIRECTS`. The 937-line page at `src/app/auburndale/gapway-lakes-estates/page.tsx` is unreachable. Reproduces locally too (config redirects run in dev). **Fix:** add `auburndale` to both lookaheads (`:368`, `:372`). Add `brandon` at the same time — see §6.

### #6 — 265 blog posts render TWO `<h1>` elements
`src/app/blog/[slug]/page.tsx:185` emits the template h1, and `:351` injects the body:
```tsx
dangerouslySetInnerHTML={{ __html: cleanWpContent(post.content) }}
```
**265 of 1,760 posts have an `<h1>` inside `post.content`** in `src/data/posts-export.json`, so those pages ship two competing h1s. Examples:
- `/blog/riverview-fl-new-communities-2026/` — body h1 `"Newest Master-Planned Communities in Riverview FL (2026)"`
- `/blog/riverview-fl-vs-brandon/` — body h1 `"Riverview vs Brandon FL: Which Tampa Bay Suburb Is Right for You?"`

`src/data/pages-content.json`, `src/data/guides-content.json` and `src/data/market-updates-export.json` are clean (0 `<h1>` each). **Fix:** demote `<h1>` → `<h2>` inside `cleanWpContent()` (`src/lib/utils.ts:74`) — one function, 265 pages fixed.

### #7 — 1,302 pages have meta descriptions outside the 120–155 range
The helper itself targets the wrong window. `src/lib/utils.ts:272-273`:
```ts
const CTA = "Call Barrett Henry, REALTOR® at (813) 733-7907.";
const MAX = 160;
const MIN = 120;
```
`MAX = 160`, not 155 — so it legitimately produces 156–160 char descriptions, and it only appends the CTA when it fits, leaving short ones short.

| Page family | <120 | >155 | Out of range | Total |
|---|---|---|---|---|
| Blog posts | 100 | 361 | **461** | 1,760 |
| Neighborhood (boilerplate) | 0 | 340 | **340** | 1,969 |
| City hub/spoke/realtor/sell | 48 | 189 | **237** | 2,272 |
| Market updates | 48 | 77 | **125** | 232 |
| Guides | 46 | 2 | **48** | 49 |
| Regional | 31 | 0 | **31** | 34 |
| Misc catch-all | 31 | 0 | **31** | 32 |
| Comparisons | 29 | 0 | **29** | 31 |
| **TOTAL** | | | **~1,302** | |

Worst: 178 chars `/estancia-at-wiregrass-realtor/`; 170 chars `/indian-rocks-beach-home-valuation/`. Shortest: 85 chars `/florida-homestead-exemption/` → `"How to file for homestead exemption in Florida — eligibility, savings, and deadlines."`

Note: **comparisons (29/31), regional (31/34), guides (46/49) and misc (31/32) are almost entirely under 120** — those excerpts in `src/data/*.ts` were written as on-page blurbs and reused as meta descriptions.

### #8 — 166 market-update pages share duplicate descriptions
83 duplicate-description groups covering **166 of 232** market updates in `src/data/market-updates-export.json`. Each city has both a `-housing-market-update` and a `-fl-real-estate-market` slug with a byte-identical excerpt:
- `longboat-key-housing-market-update` + `longboat-key-fl-real-estate-market`
- `bradenton-beach-housing-market-update` + `bradenton-beach-fl-real-estate-market`
- `holmes-beach-…`, `anna-maria-…`, `ellenton-…` (+78 more pairs)

All start with the literal string `"QUICK ANSWER What's happening in the … housing market right now?"`. Titles are unique (0 dup groups), descriptions are not. These are two URLs per city competing on one piece of content. **Fix:** 308 one slug of each pair to the other.

### #9 — Internal cannibalization: 186 city pages with identical MLS filters
`src/data/cities.ts:37-38`
```ts
{ slug: "condos-townhomes", label: "Condos & Townhomes", filter: { property_sub_type: "Condominium" } },
{ slug: "condos-for-sale", label: "Condos for Sale", filter: { property_sub_type: "Condominium" } },
```
Byte-identical filter → identical listing results on `/{city}-condos-townhomes/` and `/{city}-condos-for-sale/` across **93 cities = 186 pages**. Five more topics share an empty filter `{}` (`homes-for-sale`, `neighborhood-guide`, `housing-market`, `home-valuation`, `property-management`) though those four have distinct page components, so only the condo pair is true duplication.

### #10 — ~134 indexable pages have no BreadcrumbList schema
Only **28 of 78** `page.tsx` files contain `BreadcrumbList`. Missing on three high-volume templates:

| Template | Pages affected |
|---|---|
| `src/components/pages/ComparisonPage.tsx` | 31 |
| `src/components/pages/RegionalPage.tsx` | 34 |
| `src/components/pages/MiscCatchAllPage.tsx` | 32 |
| static app routes (indexable only) | ~37 |
| **TOTAL** | **~134** |

Present and correct on: `CountyPage`, `LoanGuidePage`, `NeighborhoodGuidePage`, `NeighborhoodPage`, `RealtorPage`, `RemaxOfficePage`, `SellYourHomeCityPage`, plus all four branches in `src/app/[citySlug]/page.tsx` (`:779`, `:1281`, `:1485`, `:1783`). There is **no reusable `Breadcrumbs` component** in the repo (`find src -iname "*readcrumb*"` → nothing) — the JSON-LD is hand-copied into each template, which is why it drifted.

---

## 2. Route metadata matrix

All 78 `page.tsx` files. `metadata` = static export or `generateMetadata`. "(L)" = supplied by a nested `layout.tsx`.

| Route | meta | title | desc | canonical | OG | h1 | Notes |
|---|---|---|---|---|---|---|---|
| `/` (`page.tsx`) | PASS | PASS | PASS | PASS | PASS | PASS | HeroSection; no breadcrumb (correct — homepage) |
| `[citySlug]` | PASS (gen) | **FAIL** | **FAIL** | PASS | PASS | PASS | 2,086 lines; 1,076 titles >60; see #1 |
| `blog/[slug]` | PASS (gen) | **FAIL** | **FAIL** | PASS | PASS | **FAIL** | 1,607 titles >60; 265 double-h1 |
| `blog` | PASS | PASS | PASS | PASS | PASS | PASS | |
| `market-updates/[slug]` | PASS (gen) | **FAIL** | **FAIL** | PASS | PASS | PASS | 206/232 >60; 166 dup descriptions |
| `market-updates` | PASS | PASS | PASS | PASS | PASS | PASS | no BreadcrumbList |
| `guides/[slug]` | PASS (gen) | PASS | **FAIL** | PASS | PASS | PASS | 46/49 descriptions <120 |
| `guides` | PASS | PASS | PASS | PASS | **FAIL** | PASS | no openGraph |
| `properties/[...slug]` | PASS (gen) | PASS | PASS | PASS | PASS | PASS | |
| `properties` | PASS | PASS | PASS | PASS | PASS | PASS | **noindex + in sitemap @0.9** — see #4 |
| `properties/search` | PASS (L) | PASS | PASS | PASS | PASS | **FAIL** | metadata in `layout.tsx`; h1 via `GalleryView` |
| `mortgage-calculator` | PASS | PASS | PASS | PASS | **FAIL** | PASS | meta in page + layout; h1 via `MortgageCalc`; no OG |
| `card` | PASS (L) | PASS | PASS | PASS | PASS | PASS | noindex via robots.ts disallow |
| `login` | PASS (L) | PASS | PASS | PASS | n/a | PASS | noindex (correct) |
| `account` | PASS | PASS | — | PASS | **FAIL** | PASS | noindex (correct); h1 via `AccountDashboard` |
| `compare/[slug]` | PASS (gen) | PASS | — | **FAIL** | **FAIL** | PASS | noindex; no canonical; `compare/layout.tsx` has no metadata |
| `clients/[slug]` | PASS (gen) | PASS | — | **FAIL** | **FAIL** | PASS | noindex (correct) |
| `home-valuation` | **FAIL** | — | — | — | — | — | 9-line `redirect("/free-home-valuation")`; **still listed in sitemap:46** |
| `builders/[slug]` | PASS (gen) | PASS | PASS | PASS | **FAIL** | PASS | no openGraph; no BreadcrumbList |
| `builders` | PASS | PASS | PASS | PASS | PASS | PASS | |
| `55-plus-communities`, `condos`, `golf-homes`, `land-acreage`, `new-construction`, `no-hoa`, `pool-homes`, `price-reduced`, `single-story`, `townhomes`, `waterfront` (11) | PASS | PASS | PASS | PASS | PASS | PASS | all h1 via HeroSection; **none has BreadcrumbList** |
| `about`, `agents`, `buyers`, `sellers`, `sell-your-home`, `contact`, `communities`, `investing`, `luxury`, `lenders`, `inspectors`, `relocation`, `the-now-team`, `property-management`, `open-houses`, `preferred-vendors`, `insurance-partners`, `free-home-valuation` | PASS | PASS | PASS | PASS | PASS | PASS | mixed BreadcrumbList coverage |
| `commercial` | PASS | PASS | PASS | PASS | **FAIL** | PASS | no openGraph |
| `accessibility`, `dmca-notice`, `fair-housing`, `privacy-policy`, `terms-of-use` | PASS | PASS | PASS | PASS | **FAIL** | PASS | legal pages, no OG, no breadcrumb |
| `thank-you` | PASS | PASS | PASS | PASS | **FAIL** | PASS | noindex (correct) |
| `seller-intake` | PASS | PASS | PASS | PASS | PASS | PASS | noindex (correct) |
| `brandon-listing-agent`, `valrico-listing-agent` | PASS | PASS | PASS | PASS | PASS | PASS | no BreadcrumbList |
| `sell/why-didnt-my-house-sell` | PASS | PASS | PASS | PASS | PASS | PASS | no BreadcrumbList |
| `brandon/southoak` | PASS | PASS | PASS | PASS | PASS | PASS | no BreadcrumbList; **redirect-fragile, see §6** |
| `auburndale/gapway-lakes-estates` | PASS | PASS | PASS | PASS | PASS | PASS | **UNREACHABLE — 308 loop, see #5** |
| `beach-condo-renovation-math`, `buying-beach-condo-llc-florida`, `florida-condo-rules-buyers-2026`, `gulf-front-condos-sirs-milestone-complete`, `how-to-tell-if-condo-is-55-plus`, `indian-rocks-beach-rental-rules`, `pinellas-beach-condo-market-report`, `remote-seller-process` (8) | PASS | PASS | PASS | PASS | PASS | PASS | no BreadcrumbList |
| `11417-cypress-park-st`, `30935-whitlock-dr`, `3813-polumbo-dr` (3 landing) | PASS | PASS | PASS | PASS | PASS | PASS | no BreadcrumbList |
| `*/sign-in`, `*/feedback` (7 kiosk) | PASS | PASS | **FAIL** | **FAIL** | **FAIL** | **FAIL** | noindex kiosks — acceptable, no action |

**The four "known-missing" routes from the brief are actually covered** — `mortgage-calculator`, `properties/search`, `login` and `card` each have metadata in a sibling `layout.tsx` (`src/app/*/layout.tsx`) because the page is `"use client"`. The real no-metadata route is **`src/app/home-valuation/page.tsx`** (a bare `redirect()` that is still in the sitemap at `src/app/sitemap.ts:46`), and `src/app/compare/layout.tsx` which has no metadata export at all.

---

## 3. Duplication — hard numbers

Generated from the real templates + real data (`src/data/posts-export.json`, `cities.ts`, `neighborhoods.ts`, `market-updates-export.json`, etc.).

### Exact duplicate titles
| Family | Dup groups | Pages | Detail |
|---|---|---|---|
| Blog (1,760) | **0** | 0 | all unique; 0 duplicate slugs |
| City family (2,272) | **0** | 0 | city name interpolation keeps them unique |
| Neighborhood (2,160) | **6** | **12** | `/downtown-bartow/` vs `/bartow-downtown/`, `/downtown-dade-city/` vs `/dade-city-downtown/` — same neighborhood registered twice under reversed slugs, ×3 page types |
| Market updates (232) | **0** | 0 | |

### Exact duplicate descriptions
| Family | Dup groups | Pages |
|---|---|---|
| **Market updates** | **83** | **166** ← biggest |
| Neighborhood | 6 | 12 |
| Blog | 0 | 0 |
| City family | 0 | 0 |

### Near-duplicate boilerplate (the real problem)
Exact-match counts look clean because every template interpolates a city or neighborhood name. The substance is near-identical:

| Skeleton | Pages sharing it | Source |
|---|---|---|
| `"Browse {topic} in {city}, FL. Updated daily from Stellar MLS…"` | **1,807** | `src/app/[citySlug]/page.tsx:554` |
| `"Explore homes for sale in {nb}, {city}, FL. Updated daily…"` | 529 | `:415` |
| `"Browse homes for sale in {nb}, {city}, FL. Updated daily…"` | 720 | `:433` |
| `"Looking for a trusted REALTOR in {nb}, {city}?…"` | 720 | `:450` |
| `"Search {city} real estate and homes for sale in FL…"` | 93 | `:569` |
| `"Find out what your {city} home is worth…"` | 93 | `:522` |
| `"Professional property management in {city}, FL…"` | 93 | `:538` |
| `"Buying, selling, or relocating to {city}, FL?…"` | 93 | `:383` |
| `"Sell your {city} home for top dollar…"` | 93 | `:396` |

**4,241 of 6,592 pages (64%) carry a description that is one of nine sentences with a place name swapped in.**

### Over-length titles
**~4,963 of 6,592 (75%)** — full breakdown in blocker #1. Length distribution for the city family: 21 pages at 40–49 chars, 1,000 at 50–59, 1,152 at 60–69, 99 at 70+.

### Out-of-range descriptions
**~1,302 of 6,592 (~20%)** — full breakdown in blocker #7.

### Concatenation / doubled-phrase bugs
Hunted for a repeated 2–5 word phrase (the `"of rent collected of rent collected"` pattern) across all 1,760 blog titles and descriptions: **0 found** in titles, **0** in descriptions. No template concatenation bug exists.

---

## 4. Heading hierarchy violations

| Issue | Pages | Location | Detail |
|---|---|---|---|
| **TWO h1s** | **265** | `src/app/blog/[slug]/page.tsx:185` + `:351` | template h1 + body h1 from `posts-export.json`. See #6 |
| h2 → h4 skip | 27 | `src/data/posts-export.json` bodies | `/blog/buying-home-wimauma-guide/`, `/blog/best-realtor-wimauma/`, `/blog/buying-home-westchase-guide/`, `/blog/best-realtor-westchase/`, `/blog/buying-home-town-n-country-guide/`, `/blog/best-realtor-temple-terrace/`, +21 |
| h1 is bare `{city.name}`-derived / keyword-thin | 93 hubs | HeroSection via `src/app/[citySlug]/page.tsx` | hub h1 is the city name + stock phrase |
| h1 is the generic page title | 32 | `src/components/pages/MiscCatchAllPage.tsx:29` | `<HeroSection title={page.title}>` where titles are e.g. `"Credit Score for Home Buying"` |
| ZERO h1 (no HeroSection, no page component) | 7 | kiosk `sign-in`/`feedback` routes | noindex — **no action needed** |
| h1 present but only via injected content | 0 | — | `pages-content.json`, `guides-content.json`, `market-updates-export.json` all have 0 `<h1>` |

**Non-violations — these came back clean:**
- **`src/components/layout/Footer.tsx` is CORRECT.** Column headers use `<p>` with an explicit guard comment at `:105`: `{/* p tag for column header — NOT h2/h3, footer headings waste SEO hierarchy */}`. Zero heading tags in the whole 187-line file. Bottom-bar legal/MLS text is all `<p>`.
- **`src/components/pages/ComparisonPage.tsx`** has `<h1>` at `:208` and `:419` but they are in **mutually exclusive branches** (`if (category === "concept" && conceptData)` at `:195` vs the city layout return at `:407`). One h1 per render — correct. Note: `HeroSection` is imported at `:7` and never used (dead import).
- Every page reporting `h1=0` in a naive grep gets its h1 from `src/components/ui/HeroSection.tsx:94` — 49 app routes plus 5 page templates import it.

**Question-format H2s:** 5,500 of 13,987 blog h2s (**39.3%**) are question-format. 0 posts have zero h2s.

---

## 5. Crawl and index

### Sitemap: 6,592 URLs (brief assumed ~3,400)
`src/app/sitemap.ts`, computed per source:

| Block | URLs | | Block | URLs |
|---|---|---|---|---|
| **neighborhood** | **2,160** | | guides | 49 |
| **city spokes** | **1,943** | | regional | 34 |
| **blog posts** | **1,760** | | misc catch-all | 32 |
| market updates | 233 | | comparisons | 31 |
| city hubs | 93 | | propertyType landing | 11 |
| city realtor | 93 | | counties | 8 |
| sell-your-home-city | 93 | | loans | 8 |
| static | 28 | | builders | 8 |
| beach condo | 7 | | community | 1 |
| | | | **TOTAL** | **6,592** |

The code comments are badly stale and mask the true scale: `:98` says "ALL 70 cities" (actual 93), `:107` "~1,050+ pages" (actual 1,943), `:72` "624 posts" (actual 1,760), `:90` "51 guides" (actual 49), `:214` "33 pages" (actual 32).

### `revalidate`: MISSING → sitemap frozen at build time (blocker #3)

### Orphans — 50 live spoke URLs not in the sitemap
`src/app/sitemap.ts:109` filters spokes with `city.topics.includes(t.slug) || t.slug === "horse-properties"`, but `parseSlug` at `src/app/[citySlug]/page.tsx:164` accepts **everything** `getCityTopics(city)` returns, regardless of `city.topics`. parseSlug is more permissive than the sitemap:

- spoke URLs **in sitemap**: 1,943
- spoke URLs that **resolve**: 1,993
- **orphaned: 50** — `/englewood-condos-for-sale/`, `/englewood-townhomes-for-sale/`, `/englewood-gated-community-homes/`, `/osprey-55-plus-homes/`, `/osprey-condos-townhomes/`, `/osprey-condos-for-sale/`, `/osprey-townhomes-for-sale/`, `/osprey-gated-community-homes/`, `/nokomis-luxury-homes/`, `/nokomis-55-plus-homes/`, `/nokomis-condos-townhomes/`, +39 more

These are live, indexable, zero-internal-link pages. Either add them to the sitemap or `notFound()` them.

Inverse direction: **`horse-properties` is listed in 0 of 93 cities' `topics` arrays** yet the sitemap force-includes it via `|| t.slug === "horse-properties"` for all 40 `HORSE_PROPERTY_CITIES`. Those 40 URLs *do* resolve (parseSlug uses the same `getCityTopics`), so they are not 404s — but they are the single worst title-length offenders (76 chars).

### Sitemap URLs that do NOT resolve
- **`/auburndale/gapway-lakes-estates/`** (`:170`) — infinite 308 loop, blocker #5. The only genuinely broken sitemap URL.
- **`/home-valuation/`** (`:46`) — resolves to a bare `redirect()` (`src/app/home-valuation/page.tsx:8`), so the sitemap submits a URL that always 307s to `/free-home-valuation/`, which is *also* in the sitemap at `:47`. Remove `:46`.

### Trailing slash: CONSISTENT
`next.config.mjs:103` → `trailingSlash: true`. Every sitemap URL is built with a trailing `/` and every `alternates.canonical` ends in `/`. Root is `{ url: siteUrl }` with no slash, which is correct. **No redirect-chain-on-every-crawl problem.** Note the comment at `next.config.mjs:101-102` says the opposite of the value (`// Remove trailing slashes to match Next.js conventions`) — harmless but misleading.

### `noindex` audit — all 16 occurrences are intentional except one
`/properties/` (blocker #4) is the only wrong one. The rest are correct: 7 kiosk routes, `/thank-you/`, `/account/`, `/login/`, `/compare/[slug]`, `/clients/[slug]`, `/seller-intake/`, plus three deliberate URL-cannibalization guards in `src/app/[citySlug]/page.tsx:290` (blog-post root), `:314` (market-update), `:507` (guide) that noindex the duplicate root-level copy and canonical to the real URL. That last pattern is correct and worth preserving.

### `robots.ts` verdict: **PASS**
`src/app/robots.ts` — all 9 required AI crawlers explicitly allowed (`GPTBot` `:28`, `ClaudeBot` `:29`, `PerplexityBot` `:30`, `Applebot-Extended` `:31`, `GoogleOther` `:32`, `Google-Extended` `:33`, `ChatGPT-User` `:35`, `anthropic-ai` `:36`, `cohere-ai` `:37`), plus `Bytespider` `:34`. All 4 required spam bots blocked (`SemrushBot` `:39`, `AhrefsBot` `:40`, `MJ12bot` `:41`, `DotBot` `:42`), plus `BLEXBot`, `DataForSeoBot`. Sitemap declared at `:46`.

One structural flaw: `/c/` and `/clients/` are in `disallow` (`:23`, repeated per-crawler) **and** carry `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` in `vercel.json`. A compliant crawler blocked by `robots.txt` never fetches the response, so it never reads the header — the two mechanisms cancel and the URLs stay eligible for URL-only indexing from external links. For truly private packets the stronger config is the `noindex` header **without** the `Disallow`. Low urgency (unlinked private content).

### `llms.txt` verdict: serves correctly, content is STALE
- `public/llms.txt` exists (4,865 bytes).
- **No `src/app/llms.txt/route.ts`** (`find src/app -path "*llms*"` → empty). The known route-shadowing gotcha is **not** present; the public file serves.
- **Content is out of date:** it claims `"City and neighborhood guides (69+ cities, 460+ neighborhoods)"` — actual is **93 cities** and **740 neighborhoods**. Experience claim `"23+ years of real estate experience"` is correct for Oct 2026.

---

## 6. Redirect risks

`next.config.mjs` = **527 lines, 1,118 total redirect entries** (248 literal + 98 guide + 308 blog-root + 464 market-update), ~55% of Vercel's 2,048-route limit.

### The two `:city` flatten rules
`next.config.mjs:368` and `:372`. **The feared asymmetry does NOT exist** — both first-segment lookaheads are byte-identical, 19 entries each:
```
blog, api, auth, clients, properties, guides, images, wp-content, _next,
compare, market-updates, builders, communities, account, sell, resources,
3813-polumbo-dr, 11417-cypress-park-st, 30935-whitlock-dr
```
Rule 2 carries an extra second-segment `(?!southoak)`; Rule 1 does not need it because `:city-:topic` compiles to require a hyphen and `southoak` has none.

Two behaviours worth knowing:
- The alternatives are **prefix matches, not whole-segment**. `sell` also shields `/sellers/*`, `/sell-your-home/*`, `/seller-intake/*`; `account` also shields `/accountants/*`.
- The `.` after each lookahead requires a first segment of **≥2 chars** — that is the only reason `/c/:slug` (private client packets, rewritten at `:476-477`) survives. Accidental, not declared.

### Routes at risk
Both rules match **exactly two segments**, so no top-level route can be swallowed. Only nested routes are exposed. Of 16 nested routes, 14 are explicitly excluded. The exceptions:

| Route | Status |
|---|---|
| **`src/app/auburndale/gapway-lakes-estates/page.tsx`** | **BROKEN NOW** — `auburndale` not excluded → 308 loop. Blocker #5 |
| `src/app/brandon/southoak/page.tsx` | **FRAGILE** — `brandon` not excluded; survives only on `(?!southoak)` + the hyphen requirement. Any future hyphenated child of `/brandon/` (e.g. `/brandon/bloomingdale-oaks/`) is swallowed immediately → `/bloomingdale-oaks/`. And if `southoak` were ever dropped from `:372`, `src/app/[citySlug]/page.tsx:626-627` (`permanentRedirect("/brandon/southoak/")`) creates a second infinite loop |

**Fix: add `auburndale` and `brandon` to both lookaheads at `:368` and `:372`.** Better long-term: invert the rule to an allow-list of known city slugs rather than a deny-list that must be hand-maintained every time a nested page ships.

### Chains and loops
Machine-checked all 1,118 entries in both directions: **zero config-level chains, zero config-level loops.** The only loop is the cross-layer one in blocker #5, invisible to a config-only scan because the second hop lives in `src/app/[citySlug]/page.tsx:601`.

### Redirects shadowing real route files
Config redirects run before the filesystem, so these `page.tsx` files are dead:
- `:125-130` — `/3813-polumbo-dr`, `/sign-in`, `/feedback` shadow `src/app/3813-polumbo-dr/**`. **Intentional** (reusable printed-QR pointer, documented `:112-124`). Correctly `permanent: false` so the QR stays repointable — do not "fix" these to 308.
- **`:348-349`** — `{ source: "/new-construction", destination: "/new-construction-homes-tampa-bay/", permanent: true }` shadows **`src/app/new-construction/page.tsx`**, making it unreachable. `new-construction-homes-tampa-bay` is neither an app route nor a slug in `cities.ts`. Meanwhile `/new-construction/` **is in the sitemap** (`src/app/sitemap.ts:63`, propertyType landing block). So the sitemap submits a URL that 301s to a probable 404. **Needs resolution — one of the two is wrong.**

### 307s that should be 308s
- `next.config.mjs:434` — `{ source: "/wp-admin/:slug*", destination: "/", permanent: false }`
- `next.config.mjs:435` — `{ source: "/wp-login.php", destination: "/", permanent: false }`

Legacy WordPress admin is permanently gone; 307 tells Google to keep re-crawling. Flip both to `permanent: true`.

### Dead code
- `getBlogRedirects()` defined `:8-29`, never called.
- `:109` — `const guideRedirects = getGuideRedirects();` assigned, never used, and re-parses `guides.ts` a second time (`:443` calls it again).
- `:464-465` — rewrite `/market-updates/:slug/` → `/market-updates/:slug/` is an identity no-op. The comment at `:459-460` claims `beforeFiles` rewrites "override any stale CDN-cached 308s", but Next.js order is headers → redirects → `beforeFiles` → filesystem, so a `beforeFiles` rewrite cannot override a redirect. Both lines are inert.

### `vercel.json`
No redirects, no rewrites. 3 crons (`generate-post` every 3 days, `market-update` quarterly, `refresh-listings` hourly) and the two `X-Robots-Tag` header rules discussed in §5.

---

## 7. Performance and file size

### Largest files
| Lines | File | Type |
|---|---|---|
| 7,824 | `src/data/neighborhood-descriptions.ts` | data |
| 2,418 | `src/data/remaining-county-faqs.ts` | data |
| **2,086** | `src/app/[citySlug]/page.tsx` | **server** |
| **2,036** | `src/components/pages/RemaxOfficePage.tsx` | **server** |
| 1,166 | `src/data/cities.ts` | data |
| **1,040** | `src/components/ui/AccountDashboard.tsx` | **CLIENT** (`:7`) |
| 970 | `src/components/city/CityContent.tsx` | server |
| 937 | `src/app/auburndale/gapway-lakes-estates/page.tsx` | server |
| 875 | `src/app/properties/[...slug]/page.tsx` | server |
| 867 | `src/components/pages/RealtorPage.tsx` | server |
| 832 | `src/components/comparison/ComparisonTool.tsx` | **CLIENT** |
| 822 | `src/data/city-market-stats.ts` | data |
| 795 | `src/data/guides.ts` | data |
| 787 | `src/data/neighborhoods.ts` | data |
| 768 | `src/app/clients/[slug]/page.tsx` | server |

`src/components/pages/` totals 5,750 lines across 10 files and **contains no client components at all**. `MiscCatchAllPage.tsx` is **105 lines**, not large.

**Verdict: file size is NOT a ranking problem here.** The two 2,000-line monsters are server components — their JSX never reaches the client bundle. The only >1,000-line client component (`AccountDashboard.tsx`) sits behind auth on a `noindex` route. Largest client code on indexable pages is `ComparisonTool.tsx` (832) and `MortgageCalc.tsx` (683), both reasonable. Do not spend refactor budget here expecting a ranking lift — it is a maintainability concern only.

### Images
**Raw `<img>` in code: 10** (9 actionable; all but one already carry `eslint-disable @next/next/no-img-element`).

| file:line | note |
|---|---|
| `src/app/not-found.tsx:47` | static local PNG, fixed 80×80 — **cleanest `next/image` win** |
| `src/app/market-updates/[slug]/page.tsx:150` | `loading="eager"` |
| `src/app/blog/page.tsx:184` | `loading="lazy"` |
| `src/app/blog/[slug]/page.tsx:413` | `loading="lazy"` |
| `src/components/ui/PhotoGallery.tsx:138`, `:186`, `:223` | lightbox/thumbs |
| `src/components/ui/AccountDashboard.tsx:549`, `:742` | behind auth |
| `src/components/search/MapView.tsx:141` | inside a template-literal HTML string for a Maps InfoWindow — **cannot** be `next/image` |

**The real image problem is in injected content — ~7,200 `<img>` with no intrinsic dimensions:**

| Source | `<img>` count | with `width` attr | rendered at |
|---|---|---|---|
| `src/data/pages-content.json` | **5,748** | **0** | `MiscCatchAllPage.tsx:39`, `RegionalPage.tsx:42` |
| `src/data/market-updates-export.json` | 917 | 72 | `market-updates/[slug]/page.tsx:251` |
| `src/data/posts-export.json` | 553 | 3 | `blog/[slug]/page.tsx:351` |

All ship to the browser as unoptimized `<img>` with no width/height → direct CLS and LCP penalty on the blog, market-update, misc and regional pages. `cleanWpContent` (`src/lib/utils.ts:74`) already rewrites these image *paths* at `:89-97` and actively **strips `max-width` inline styles** at `:102` — so the transform hook exists. **Adding width/height there is the single highest-leverage perf fix on the site.**

### Alt text — good shape
34 `<Image>` + 10 `<img>` in code. **0 missing `alt`. 0 generic alt literals.** One `alt=""`: `src/app/blog/[slug]/page.tsx:164`, on the `priority fill` hero `<Image>` — the LCP element of every blog post. Arguably correct (decorative, behind an 85% navy scrim at `:171`) but it carries zero alt signal on 1,760 pages. Borderline-thin: `card/page.tsx:104` `alt="REMAX"`, `ListingCard.tsx:85` and `MapView.tsx:257` `alt={... || "Property"}`, `AccountDashboard.tsx:551`/`:744` `alt={... || "Listing photo"}`.

### next.config.mjs settings
| Setting | Value | Verdict |
|---|---|---|
| `poweredByHeader` (`:99`) | `false` | **PASS** |
| `trailingSlash` (`:103`) | `true` | PASS (consistent with sitemap) |
| `images.formats` (`:499`) | `["image/webp"]` | **Deviates from the day-1 rule** (`['image/avif','image/webp']`) — but **deliberate and documented** at `:483-497`: *"Image Optimization was $160/mo on this project alone… AVIF is the most expensive encode Vercel bills. WebP only."* Not a ranking factor at this margin. **Leave it.** |
| `images.minimumCacheTTL` (`:498`) | `2678400` (31 days) | cost control |
| `images.deviceSizes` (`:500`) | `[640, 828, 1200, 1920]` | cost control |

### globals.css (490 lines)
- **`* { max-width: 100% }` — NOT PRESENT. No violation.** All `*` rules are scoped inside media queries: `:224-231` inside `@media (prefers-reduced-motion: reduce)` (animation/transition only), `:465-468` inside `@media print` (box-shadow/text-shadow only). All `max-width` declarations are class- or media-scoped (`:241` `.nowtb-post-content`, `:128` `.blog-content table`, `:470` print `img`). Tailwind `max-w-*` utilities are intact.
- **`:focus-visible` outlines — ABSENT.** The only focus-related rule is `:111` → `focus:border-accent focus:outline-none` on form inputs, which **removes** the focus ring and replaces it with a border-color change. No global `:focus-visible` rule exists in any CSS file; the only usage repo-wide is the skip link's Tailwind utilities at `src/app/layout.tsx:226`. **Genuine accessibility gap and a day-1 rule miss.**
- `prefers-reduced-motion` — **PRESENT** (`:220-232`), correctly neutralizes the `scroll-behavior: smooth` at `:38`.
- Print stylesheet — **PRESENT** (`:423-473`), thorough.

### Fonts and scripts — clean
- `src/app/layout.tsx:17-22` `Playfair_Display` and `:25-30` `DM_Sans`, both `next/font/google` with **`display: "swap"`**, self-hosted, subset. 7 weights total is slightly heavy; trimming unused weights is a minor win.
- Only one `next/script` in the repo: `src/components/tracking/FubPixel.tsx:74` with `strategy="afterInteractive"`. Correct.
- `src/app/layout.tsx:250` `<Analytics />`, `:251` `<SpeedInsights />`. **No GA4 script found in layout** despite the day-1 rule — worth confirming whether `NEXT_PUBLIC_GA_ID` is wired anywhere. No Microsoft Clarity (correct — Barrett does not use it).
- All ~70 raw `<script>` tags in `src/` are `type="application/ld+json"`. **Nothing render-blocking anywhere.**

### Render config — the crawl-budget problem is already fixed
| file:line | value |
|---|---|
| `src/app/[citySlug]/page.tsx:219` | `export const revalidate = 3600;` |
| `src/app/[citySlug]/page.tsx:221` | `export const dynamicParams = true;` |
| `src/app/blog/[slug]/page.tsx:17` | `export const dynamicParams = true;` (static via `generateStaticParams`) |
| `src/app/properties/[...slug]/page.tsx:17` | `export const revalidate = 1800;` |

**No `force-dynamic` on any high-volume route.** The fix is documented in place at `src/app/[citySlug]/page.tsx:214-218`: *"With force-dynamic, EVERY visitor request triggered a fresh API call — ~3,000 unique pages × crawlers = rate limit."* `force-dynamic` survives only on `src/app/open-houses/page.tsx:17` (single time-sensitive page, acceptable) and 6 API route handlers.

Remaining nuance: `generateStaticParams` at `:227-269` deliberately pre-renders almost nothing — hub/spoke/neighborhood/county pages are excluded (`:230-233`) to avoid 3,000+ build-time Bridge calls, and blog slugs are excluded because *"Pre-rendering 870+ blog slugs here hits the Vercel route limit (2048)"* (`:264`). Consequence: the first crawler to hit each of ~3,000 city URLs pays a cold ISR render plus a live Bridge API call. A real crawl-efficiency cost, but a deliberate trade against an API rate limit.

---

## Fix order

**Ship today (one-line edits, enormous blast radius):**
1. `src/app/layout.tsx:35` — shorten the title template → fixes ~4,963 over-length titles, 1,076 of them completely.
2. `src/app/sitemap.ts` — add `export const revalidate = 3600;` → unfreezes the sitemap.
3. `next.config.mjs:368` + `:372` — add `auburndale` and `brandon` to both lookaheads → kills the live 308 loop.
4. `src/app/sitemap.ts:27` — drop `/properties/` (noindex); `:46` — drop `/home-valuation/` (bare redirect).
5. `src/lib/utils.ts:273` — `MAX = 160` → `155`.

**This week (template fixes, hundreds-to-thousands of pages):**
6. `src/lib/utils.ts:74` `cleanWpContent()` — demote injected `<h1>` → `<h2>` (265 posts) and add `width`/`height` to injected `<img>` (~7,200 images).
7. 308 one slug of each market-update pair → recovers 166 duplicate-description pages.
8. Consolidate `/{nb}-homes-for-sale/` into `/{nb}/` (720 pairs) and cut the sitemap to the 192 neighborhoods with curated facts.
9. Merge `condos-for-sale` into `condos-townhomes` in `src/data/cities.ts:37-38` → 93 duplicate pages gone.
10. Build a shared `Breadcrumbs` component + BreadcrumbList schema; add to `ComparisonPage`, `RegionalPage`, `MiscCatchAllPage` (97 pages) and the ~37 indexable static routes.
11. Rewrite the sub-120-char excerpts in `comparisons.ts` (29), `regional-pages.ts` (31), `guides.ts` (46), `misc-pages.ts` (31).
12. Resolve `next.config.mjs:348-349` vs `src/app/new-construction/page.tsx` — one is dead.
13. Add a global `:focus-visible` outline to `src/app/globals.css`.
14. Decide on the 50 orphaned spoke URLs: sitemap them or `notFound()` them.
15. Refresh `public/llms.txt` (says 69 cities / 460 neighborhoods; actual 93 / 740).
16. `next.config.mjs:434-435` — flip the two `wp-admin`/`wp-login` redirects to `permanent: true`.
