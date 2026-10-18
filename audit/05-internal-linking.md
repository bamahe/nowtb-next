# 05 — Internal Linking & Site Architecture Audit

**Repo:** `nowtb-leadmachine` @ `seo/lead-machine-oct2026`
**Date:** 2026-10-17
**Method:** Full internal link graph built programmatically. Every number below is
computed, not estimated, unless marked `(estimate)`.

## How the graph was built

Nodes = every URL emitted by `src/app/sitemap.ts` (6,584 unique) **plus** every
static route in `src/app/` not in the sitemap, **plus** the 50 city-spoke routes
that `parseSlug()` accepts but the sitemap omits. **6,657 real routes total.**

Edges came from seven sources, all resolved to concrete URLs:

| Source | What was parsed |
| --- | --- |
| `src/**/*.tsx` | `href=` JSX attributes **and** `href:` / `link:` object-literal entries in nav/link arrays |
| `src/data/posts-export.json` | 1,760 posts, HTML `<a href>` + markdown links in `content` |
| `src/data/pages-content.json` | 1,203 pages (city hubs, spokes, neighborhoods, regional, misc) |
| `src/data/guides-content.json` | 49 guides |
| `src/data/market-updates-export.json` | 232 market updates |
| `src/data/neighborhood-descriptions.ts` | 207 per-neighborhood HTML writeups (1,321 hrefs) |
| `*-faqs.ts` (`remaining-county-faqs`, `batch5`, `valrico`, `dover`) | 76 city FAQ sets, `answerHtml` links |

Dynamic hrefs were resolved by re-executing the real data modules through a
TypeScript require hook, then substituting per-page context. Programmatic link
arrays that a static scan cannot see were expanded from the authoritative
source: `getCityTopics()`, `getNeighborhoodsByCity()`, `findRelatedPosts()`,
`getRelatedPosts()`, `getRelatedGuides()`, `getRelatedMarketUpdates()`,
`NEARBY_CITIES`, `LOAN_GUIDES`, `RELATED_GUIDES`, and the index-page child
listings. All 1,118 `next.config.mjs` redirects were extracted by importing the
config and awaiting `redirects()`.

**Total internal link instances measured: 1,190,545.**

Two inbound counts are reported throughout:
- **total inbound** — includes the 108 sitewide Header/Footer/MobileNav links
- **contextual inbound** — excludes sitewide chrome. This is the number Google
  actually weighs; a footer link does not rescue a page.

---

## 1. Top 10 architecture problems, ranked by lead impact

### #1 — 1,384 neighborhood money pages are completely orphaned
`-homes-for-sale` and `-realtor` variants exist for all 720 neighborhoods, but
**nothing on the site links to them.**

| Template | Pages | Orphaned (0 inbound) |
| --- | --- | --- |
| `/{neighborhood}-realtor/` | 720 | **700** |
| `/{neighborhood}-homes-for-sale/` | 720 | **684** |

Cause: every neighborhood grid links the bare hub only.
- `src/components/pages/NeighborhoodPage.tsx:357` → `` href={`/${neighborhood.slug}/`} ``
- `src/components/city/CityResources.tsx:129` → `` href={`/${n.slug}/`} ``
- `src/components/pages/RealtorPage.tsx:450` → `` href={`/${n.slug}/`} ``

These are the highest commercial-intent URLs on the site (`"<neighborhood> homes
for sale"`, `"<neighborhood> realtor"`) and 21% of the whole site is invisible to
Google. **Fix in 3 lines across 3 files** — add the two sibling links next to
each hub link in the grids, or add a 3-link "In this neighborhood" row to
`NeighborhoodPage.tsx`.

### #2 — The 93 seller-intent city pages have exactly 1 outbound link each
`src/components/pages/SellYourHomeCityPage.tsx` renders **one** internal link
(`/sell-your-home/` at line 140) plus two `tel:` links. Measured: all 93
`/sell-your-home-{city}/` pages have `outbound = 1` and `body links = 0`.

No link to the city hub, no sibling city pages, no `/free-home-valuation/`, no
`/seller-intake/`, no resource grid. This is the template closest to a listing
appointment and it is a dead end. **One template edit fixes 93 pages.**

### #3 — The 8 loan pages are pure link sinks: 56,858 inbound, 0 outbound
`src/components/pages/LoanGuidePage.tsx` contains **zero** internal links (line
246 is a `tel:` link and nothing else).

| Page | Contextual inbound | Total inbound (incl. chrome) | Outbound internal |
| --- | --- | --- | --- |
| `/fha-loan-florida/` | **14,165** (3rd-highest on the site) | 27,479 | **0** |
| `/jumbo-loan-florida/` | 2,114 | 8,771 | **0** |
| `/va-loan-florida/` | 128 | 13,442 | **0** |
| `/conventional-loan-florida/` | 118 | 6,775 | **0** |
| `/renovation-loan-florida/` | 105 | 105 | **0** |
| `/usda-loan-florida/` | 98 | 98 | **0** |
| `/reverse-mortgage-florida/` | 94 | 94 | **0** |
| `/construction-loan-florida/` | 94 | 94 | **0** |
| **total** | **16,916** | **56,858** | **0** |

`/fha-loan-florida/` absorbs more internal link equity than every city hub
except Valrico and passes none of it onward. **One template edit recovers
56,858 inbound link paths.**

### #4 — 310,308 internal links are written without a trailing slash → 308 on every hit
`next.config.mjs:103` sets `trailingSlash: true`, so every slash-less link is a
308 redirect.

Measured total: **310,308 slash-less link instances.** By file:

| Location | Instances |
| --- | --- |
| `components/layout/Footer.tsx` (all 36 links × 6,657 pages) | **239,652** |
| `components/city/SpokeNav.tsx:34` (`` `/${city.slug}-${topic.slug}` ``) | **46,440** |
| `app/blog/[slug]/page.tsx:279` + `:308` financing grid | **19,360** |
| `app/[citySlug]/page.tsx` (hub/spoke links) | 1,900 |
| `posts-export.json` prose | 1,727 |
| `components/pages/RealtorPage.tsx:200` | 813 |
| `pages-content.json` / `market-updates-export.json` prose | 204 |
| `app/investing/page.tsx:102` | 96 |
| `components/pages/CountyPage.tsx:117` | 93 |
| `app/page.tsx` | 12 |
| `guides-content.json` | 11 |

`Header.tsx` and `MobileNav.tsx` are **clean** — every internal href already
carries a trailing slash. Every slash-less link above is a wasted crawl request
on a 6,657-page site. **Fixing Footer.tsx + SpokeNav.tsx:34 alone removes
286,092 of them (92%).**

### #5 — Blog pagination is a query string, so 1,736 of 1,760 posts get no index link
`src/app/blog/page.tsx:32` sets `POSTS_PER_PAGE = 24`, and pages 2–74 are
`/blog/?page=N` (lines 233, 271, 286) — query strings, not crawlable URLs, and
not in the sitemap. Only the 24 newest posts receive a link from `/blog/`.

Consequence, measured by BFS from `/`:

| | Count |
| --- | --- |
| Blog posts orphaned (0 inbound) | **204** |
| Blog posts with exactly 1 inbound | **184** |
| Blog posts unreachable from `/` | **329** |
| Blog posts at depth ≥ 4 | **1,027** |

**Fix:** real `/blog/page/2/` routes, or a crawlable archive/category index.

### #6 — 1,116 city-hub blog links point at root slugs that 301
`src/components/city/CityResources.tsx:304` → `` href={`/${post.slug}/`} `` for
up to 12 posts on each of 93 city hubs. Root slugs 301 to `/blog/{slug}/`
(`next.config.mjs:22–23`, plus the `[citySlug]` runtime `permanentRedirect`).
Should be `` `/blog/${post.slug}/` ``. Same file, lines 66–75: the 8
`RELATED_GUIDES` entries are rendered as `/{slug}/` at line 283 but guides live
at `/guides/{slug}/` — 7 of the 8 redirect, and one 404s (see #7).

### #7 — 6,550 broken internal links. The rot is back.
1,572 distinct dead targets, none covered by a redirect.

| Target | Hits | Source |
| --- | --- | --- |
| `/investment-property-tampa-bay/` | 1,085 | `pages-content.json` (944), `market-updates-export.json` (141) |
| `/tampa-bay-rents-4-year-low-rent-or-buy/` | 1,074 | `pages-content.json` (934), market updates (140) |
| `/remax-collective/` | 252 | `neighborhood-descriptions.ts` |
| `/investment-property/` | 140 | market updates, guides |
| `/florida-homestead-exemption-guide/` | **95** | `CityResources.tsx:283` (93) — wrong slug, real guide is `florida-homestead-exemption-save-our-homes` |
| `/new-listings/` | 70 | market updates |
| `/blog/sell-home-fast-{city}/` | **199** | `SpokeNav.tsx:100` — 9 of 93 cities have no such post |
| `/waterfront-homes-tampa-bay/` | 38 | pages-content |
| remaining ~1,560 targets | ~3,600 | mostly `posts-export.json` and `pages-content.json` prose |

### #8 — `/auburndale/gapway-lakes-estates/` is in an infinite redirect loop in production
The documented `:city` flatten trap, confirmed. `next.config.mjs:368` and `:372`
exclude 19 first-segment prefixes. `auburndale` is **not** one of them.

1. `/auburndale/gapway-lakes-estates/` → rule at `:368` matches `:city/:city-:topic`
   → 301 to `/gapway-lakes-estates/`
2. `/gapway-lakes-estates/` → no config redirect → `[citySlug]/page.tsx:599-612`
   `getCommunityPageBySlug()` matches → `permanentRedirect('/auburndale/gapway-lakes-estates/')`
3. back to step 1 → `ERR_TOO_MANY_REDIRECTS`

Config redirects run before routes, so this only breaks on the live domain, exactly
as the known trap predicts. `/brandon/southoak/` is safe: rule `:372` excludes
`southoak` on the neighborhood segment and `southoak` has no hyphen so rule `:368`
cannot match it. **Fix: add `auburndale` (and any future community parent city) to
BOTH lookaheads.**

### #9 — `/seller-intake/` has ZERO inbound links. So do 5 of the 11 property-type landing pages.
Lead-capture and commercial-intent pages with no inbound path at all:

| Page | Total inbound (incl. chrome) |
| --- | --- |
| `/seller-intake/` | **0** |
| `/golf-homes/`, `/no-hoa/`, `/pool-homes/`, `/price-reduced/`, `/single-story/`, `/townhomes/` | **0** each |
| `/agents/`, `/inspectors/`, `/thank-you/` | **0** each |
| `/condos/`, `/land-acreage/` | 1 each |
| `/waterfront/` | 2 |
| `/builders/` | 4 |
| `/lenders/` | 5 |
| `/55-plus-communities/` | 9 |
| — for contrast — | |
| `/privacy-policy/`, `/terms-of-use/`, `/accessibility/`, `/fair-housing/` | **6,657 each** |
| `/home-valuation/` | 1,772 |

**The privacy policy has 3.8x more inbound links than `/home-valuation/` and
infinitely more than `/seller-intake/`.** Stated loudly, as requested.

### #10 — `/builders/` index links to the wrong URL, orphaning all 8 builder pages
`src/app/builders/page.tsx:294` → `` href={`/${builder.slug}/`} `` but the real
route is `/builders/{slug}/` (`src/app/builders/[slug]/page.tsx`, and that is
what the sitemap emits at `sitemap.ts:134`). All 8 builder pages have 0 inbound
and 8 links 404. One-character class of fix.

**Runner-up:** the 11 property-type landing pages are 50–64-line stubs (hero +
`SearchBar` + client-side `ListingGrid`). Zero body copy, zero internal links
beyond chrome, zero conversion CTA. e.g. `src/app/pool-homes/page.tsx` is 64
lines with 1 `href` total.

---

## 2. Orphan and near-orphan report

### Orphans — zero inbound links from anywhere, including sitewide chrome
**1,626 pages (24.4% of the site).**

| Category | Count |
| --- | --- |
| `/{neighborhood}-realtor/` | 700 |
| `/{neighborhood}-homes-for-sale/` | 684 |
| blog posts | 204 |
| static pages | 17 |
| builder detail pages | 8 |
| misc catch-all pages | 5 |
| nested static | 4 |
| regional pages | 3 |
| comparison pages | 1 |

### Contextual orphans — zero inbound excluding Header/Footer/MobileNav
**1,631 pages (24.5%).** Same breakdown, +4 legal pages that live only in the
footer (expected) and +1 comparison page.

Full lists for the small categories:

- **static (21):** `/11417-cypress-park-st/`, `/30935-whitlock-dr/`,
  `/3813-polumbo-dr/`, `/accessibility/`, `/account/`, `/agents/`, `/card/`,
  `/dmca-notice/`, `/fair-housing/`, `/golf-homes/`, `/inspectors/`, `/login/`,
  `/no-hoa/`, `/pool-homes/`, `/price-reduced/`, `/privacy-policy/`,
  **`/seller-intake/`**, `/single-story/`, `/terms-of-use/`, `/thank-you/`,
  `/townhomes/`
- **builder (8):** `/builders/dr-horton-homes-tampa-bay/`,
  `/builders/lennar-homes-tampa-bay/`, `/builders/meritage-homes-tampa-bay/`,
  `/builders/mi-homes-tampa-bay/`, `/builders/pulte-homes-tampa-bay/`,
  `/builders/ryan-homes-tampa-bay/`, `/builders/taylor-morrison-homes-tampa-bay/`,
  `/builders/toll-brothers-homes-tampa-bay/`
- **misc (5):** `/citrus-park-housing-market/`, `/homestead-exemption-florida/`,
  `/new-tampa-housing-market/`, `/title-insurance-florida/`,
  `/understanding-hoa-documents-florida/`
- **nested static (4):** `/11417-cypress-park-st/feedback/`,
  `/30935-whitlock-dr/feedback/`, `/brandon/southoak/`,
  **`/sell/why-didnt-my-house-sell/`** (the brand-new October content page)
- **regional (3):** `/plant-city-homes-under-450k/`, `/remax-agent-tampa-bay/`,
  `/valrico-homes-under-400k/`
- **comparison (2):** `/buying-vs-renting-tampa-bay/`, `/new-construction-vs-resale/`

First 12 of each large category:
- `neigh-realtor`: `/abbey-grove-realtor/`, `/adamsville-realtor/`,
  `/alafia-estates-realtor/`, `/alafia-plantation-realtor/`,
  `/alafia-river-estates-realtor/`, `/anclote-realtor/`, `/andalucia-realtor/`,
  `/angel-run-realtor/`, `/angeline-realtor/`, `/anna-maria-downtown-realtor/`,
  `/anna-maria-east-realtor/`, `/anna-maria-island-realtor/` … +688
- `neigh-hfs`: `/abbey-grove-homes-for-sale/`, `/adamsville-homes-for-sale/`,
  `/alafia-estates-homes-for-sale/`, `/alafia-plantation-homes-for-sale/`,
  `/alafia-river-estates-homes-for-sale/`, `/anclote-homes-for-sale/`,
  `/andalucia-homes-for-sale/`, `/angel-run-homes-for-sale/`,
  `/angeline-homes-for-sale/`, `/anna-maria-downtown-homes-for-sale/`,
  `/anna-maria-east-homes-for-sale/`, `/anna-maria-island-homes-for-sale/` … +672
- `blog-post`: `/blog/apollo-beach-fl-boat-access/`,
  `/blog/apollo-beach-fl-flood-insurance/`, `/blog/apollo-beach-fl-vs-riverview/`,
  `/blog/arista-valrico-grand-opening-new-gated-community/`,
  `/blog/ayersworth-glen-riverview-fl-guide/`, `/blog/best-neighborhoods-belleair/`,
  `/blog/best-neighborhoods-brooksville-fl/`, `/blog/best-neighborhoods-dade-city/`,
  `/blog/best-neighborhoods-davenport/`, `/blog/best-neighborhoods-dundee/`,
  `/blog/best-neighborhoods-fort-meade/`, `/blog/best-neighborhoods-haines-city/` … +192

### Near-orphans — exactly 1 contextual inbound link
**326 pages.**

| Category | Count |
| --- | --- |
| blog posts | 184 |
| market updates | 52 |
| `-homes-for-sale` | 27 |
| `-realtor` | 20 |
| guides | 17 |
| regional | 11 |
| static | 6 |
| comparison | 4 |
| nested static | 3 |
| misc | 2 |

Notable near-orphans: `/condos/`, `/land-acreage/`, `/open-houses/`,
`/preferred-vendors/`, `/the-now-team/`, `/valrico-listing-agent/` (a priority
money page with 1 contextual inbound), and 17 guides including
`/guides/macdill-afb-housing-guide/` and `/guides/florida-property-tax-guide/`.

### Inbound link distribution (contextual)

| Inbound links | Pages |
| --- | --- |
| 0 | 1,631 |
| 1 | 326 |
| 2 | 175 |
| 3–4 | 230 |
| 5–9 | 224 |
| 10–24 | 1,136 |
| 25–99 | 2,490 |
| 100–499 | 258 |
| 500–1,999 | 111 |
| 2,000+ | 26 |

**Top 15 link hoarders (contextual inbound):**

| Inbound | Page |
| --- | --- |
| 41,710 | `/mortgage-calculator/` |
| 30,626 | `/contact/` |
| 14,165 | `/fha-loan-florida/` |
| 7,842 | `/free-home-valuation/` |
| 6,451 | `/` |
| 3,678 | `/guides/` |
| 3,561 | `/valrico/` |
| 3,037 | `/about/` |
| 3,014 | `/tampa/` |
| 2,991 | `/tampa-bay-real-estate-agent/` |
| 2,843 | `/brandon/` |
| 2,775 | `/riverview/` |
| 2,437 | `/wesley-chapel/` |
| 2,406 | `/clearwater/` |
| 2,343 | `/apollo-beach/` |

`/mortgage-calculator/` receives **41,710** contextual internal links (55,024
including the footer) and emits 1. It is
the single largest link sink on the site, and it is not a lead-capture page.

### Outbound distribution (distinct internal targets, chrome excluded)

| Template | Pages | Median | Min | Max | Pages with <5 |
| --- | --- | --- | --- | --- | --- |
| city-spoke | 1,993 | 48 | 18 | 70 | 0 |
| blog-post | 1,760 | 34 | 21 | 88 | 0 |
| neighborhood-realtor | 720 | 41 | 33 | 173 | 0 |
| neighborhood | 720 | 20 | 14 | 156 | 0 |
| neighborhood-homes-for-sale | 720 | 20 | 14 | 156 | 0 |
| market-update | 232 | 41 | 4 | 57 | 18 |
| city-realtor | 93 | 39 | 33 | 173 | 0 |
| city-hub | 93 | 92 | 65 | 245 | 0 |
| **sell-your-home-{city}** | **93** | **1** | **1** | **1** | **93** |
| static | 53 | 2 | 0 | 233 | 34 |
| guide | 49 | 13 | 5 | 34 | 0 |
| regional | 32 | 5 | 0 | 34 | 11 |
| comparison | 31 | 4 | 4 | 4 | 31 |
| misc | 27 | 9 | 6 | 17 | 0 |
| nested-static | 9 | 0 | 0 | 15 | 7 |
| county | 8 | 14 | 8 | 29 | 0 |
| **builder** | **8** | **1** | **1** | **1** | **8** |
| beach-condo | 7 | 4 | 4 | 6 | 5 |
| **loan** | **7** | **0** | **0** | **0** | **7** |
| home | 1 | 22 | 22 | 22 | 0 |

**215 pages (3.3%) have fewer than 5 outbound internal links**, concentrated in
4 templates: `sell-city` (93), `static` (34), `comparison` (31), `regional` (11),
`builder` (8), `loan` (7), `nested-static` (7), `beach-condo` (5).

### Body-content link density — the actual "5–10 in the content body" rule
Counting only prose/body links (content corpora + FAQ `answerHtml` +
`CityContent.tsx` prose), excluding nav grids, breadcrumbs and CTA buttons:

| Template | Pages | 0 body links | 1–4 | 5–10 | 11+ | Median |
| --- | --- | --- | --- | --- | --- | --- |
| city-spoke | 1,993 | 27 | 0 | 967 | 999 | 11 |
| blog-post | 1,760 | 36 | 187 | 423 | 1,114 | 16 |
| neighborhood | 720 | **518** | 8 | 70 | 124 | 0 |
| neigh-homes-for-sale | 720 | **518** | 8 | 70 | 124 | 0 |
| neigh-realtor | 720 | **720** | 0 | 0 | 0 | 0 |
| market-update | 232 | 0 | 66 | 0 | 166 | 38 |
| sell-city | 93 | **93** | 0 | 0 | 0 | 0 |
| city-realtor | 93 | **93** | 0 | 0 | 0 | 0 |
| city-hub | 93 | 0 | 0 | 27 | 66 | 28 |
| static | 53 | **53** | 0 | 0 | 0 | 0 |
| guide | 49 | 0 | 15 | 19 | 15 | 8 |
| comparison | 31 | **31** | 0 | 0 | 0 | 0 |
| county | 8 | **8** | 0 | 0 | 0 | 0 |
| loan | 7 | **7** | 0 | 0 | 0 | 0 |
| beach-condo | 7 | **7** | 0 | 0 | 0 | 0 |

**2,138 pages (32.1%) have ZERO body-content internal links.** Only 4,213
(63.3%) hit the 5+ standard. 1,114 blog posts and 999 city spokes are **over**
the 10-link ceiling (median 16 and 11 respectively) — the mesh is simultaneously
too dense in the content corpora and absent in the templates.

Related: **962 of 1,993 city spokes (48%) have no `pages-content.json` entry**
and fall back to `CityContent.tsx`'s generic `SpokeTopicContent`, which emits
the same 4–6 links (`/mortgage-calculator/`, `/fha-loan-florida/`, `/{city}/`,
`/contact/`) on every one. **686 of 720 neighborhoods** have no content at all.

---

## 3. Depth distribution (BFS from `/`, all links including chrome)

| Clicks from homepage | Pages |
| --- | --- |
| 0 | 1 |
| 1 | 70 |
| 2 | 1,812 |
| 3 | 1,962 |
| 4 | 606 |
| 5 | 348 |
| 6 | 67 |
| 7 | 29 |
| 8 | 6 |
| **Unreachable** | **1,756** |

**1,056 pages sit at depth ≥ 4** (1,027 of them blog posts), and **1,756 pages
(26.4%) cannot be reached from the homepage at all.**

Unreachable breakdown: 700 `-realtor`, 684 `-homes-for-sale`, 329 blog posts,
17 static, 8 builder, 7 nested static, 5 regional, 5 misc, 1 comparison.

Chrome does most of the heavy lifting: with Header/Footer/MobileNav excluded, the
depth-1 tier collapses from 70 pages to effectively the homepage's own 22 links.

---

## 4. Conversion-path linking

Conversion targets: `/contact/`, `/free-home-valuation/`, `/home-valuation/`,
`/sell-your-home/`, `/seller-intake/` ("core"), plus `/properties/` ("any").
Contextual links only — footer CTAs excluded, since a footer link is not a
conversion path.

| Template | Pages | → core CTA | % | → any | % |
| --- | --- | --- | --- | --- | --- |
| city-spoke | 1,993 | 1,993 | 100.0% | 1,993 | 100.0% |
| blog-post | 1,760 | 1,760 | 100.0% | 1,760 | 100.0% |
| neigh-homes-for-sale | 720 | 720 | 100.0% | 720 | 100.0% |
| neigh-realtor | 720 | 720 | 100.0% | 720 | 100.0% |
| neighborhood | 720 | 720 | 100.0% | 720 | 100.0% |
| market-update | 232 | 232 | 100.0% | 232 | 100.0% |
| city-hub | 93 | 93 | 100.0% | 93 | 100.0% |
| city-realtor | 93 | 93 | 100.0% | 93 | 100.0% |
| sell-city | 93 | 93 | 100.0% | 93 | 100.0% |
| comparison | 31 | 31 | 100.0% | 31 | 100.0% |
| misc | 27 | 27 | 100.0% | 27 | 100.0% |
| builder | 8 | 8 | 100.0% | 8 | 100.0% |
| county | 8 | 8 | 100.0% | 8 | 100.0% |
| regional | 32 | 26 | 81.2% | 27 | 84.4% |
| guide | 49 | 34 | 69.4% | 49 | 100.0% |
| **beach-condo** | **7** | **3** | **42.9%** | 3 | 42.9% |
| **static** | **53** | **21** | **39.6%** | 22 | 41.5% |
| **nested-static** | **9** | **1** | **11.1%** | 1 | 11.1% |
| **loan** | **8** | **0** | **0.0%** | **0** | **0.0%** |
| **SITE TOTAL** | **6,657** | **6,584** | **98.9%** | 6,601 | 99.2% |

Headline coverage is strong. The gap is 56 pages, and they are the wrong 56:

**Zero-coverage templates:**
- **`loan` (8 pages, 0%)** — `LoanGuidePage.tsx` has no CTA link at all. These
  pages hold 56,858 inbound links.
- **`nested-static` (9 pages, 11%)** — includes the brand-new
  `/sell/why-didnt-my-house-sell/` (has 9 outbound but none to a lead page),
  `/brandon/southoak/`, `/properties/search/`, the open-house sign-in/feedback
  routes.
- **`static` (53 pages, 40%)** — all 11 property-type landing pages
  (`/pool-homes/`, `/townhomes/`, `/single-story/`, `/price-reduced/`,
  `/no-hoa/`, `/golf-homes/`, `/condos/`, `/land-acreage/`, `/waterfront/`,
  `/new-construction/`, `/55-plus-communities/`), plus `/property-management/`,
  `/about/`, `/remote-seller-process/`.
- **`beach-condo` (7 pages, 43%)** — 4 of the 7 Pinellas condo cluster pages have
  no CTA link.

### Money-page inbound vs low-value-page inbound (total, including chrome)

| Page | Inbound |
| --- | --- |
| `/contact/` | 57,254 |
| `/mortgage-calculator/` | 55,024 |
| `/properties/` | 41,278 |
| `/about/` | 29,665 |
| `/free-home-valuation/` | 21,156 |
| `/sell-your-home/` | 15,434 |
| **`/privacy-policy/`** | **6,657** |
| **`/terms-of-use/`** | **6,657** |
| **`/accessibility/`** | **6,657** |
| **`/fair-housing/`** | **6,657** |
| **`/home-valuation/`** | **1,772** |
| **`/seller-intake/`** | **0** |
| `/dmca-notice/` | 0 |

> **The privacy policy, terms of use, accessibility statement and fair housing
> page each have 3.8x more inbound internal links than `/home-valuation/`, and
> `/seller-intake/` — a lead-capture form — has none at all.**

`/home-valuation/` and `/free-home-valuation/` are also a duplicate pair
competing for the same intent with a 12:1 link split. Pick one canonical
valuation page and redirect the other.

---

## 5. Broken and risky links

| Class | Instances | Distinct targets |
| --- | --- | --- |
| Resolves directly to a real route | 1,148,704 | — |
| Resolves **only via a 301/308 redirect** | **35,291** | 267 |
| **BROKEN** — no route, no redirect | **6,550** | **1,572** |
| Written without a trailing slash (308 under `trailingSlash: true`) | **310,308** | 2,783 |

### Top broken targets

| Hits | Target | Source |
| --- | --- | --- |
| 1,085 | `/investment-property-tampa-bay/` | `pages-content.json` (944), `market-updates-export.json` (141) |
| 1,074 | `/tampa-bay-rents-4-year-low-rent-or-buy/` | `pages-content.json` (934), market updates (140) |
| 252 | `/remax-collective/` | `neighborhood-descriptions.ts` |
| 199 | `/blog/sell-home-fast-{city}/` ×9 cities | `components/city/SpokeNav.tsx:100` |
| 140 | `/investment-property/` | market updates (138), guides (2) |
| 95 | `/florida-homestead-exemption-guide/` | **`components/city/CityResources.tsx:283`** (93) |
| 70 | `/new-listings/` | market updates |
| 38 | `/waterfront-homes-tampa-bay/` | pages-content (36) |
| 30 | `/blog/florida-homestead-exemption/` | posts-export |
| 29 | `/pinellas-county-real-estate-guide/` | posts-export |
| 29 | `/realtor/` | market updates (26), guides (3) |
| 26 | `/pinellas-county-homes-for-sale/` | posts-export |
| 25 | `/madeira-beach-fl-real-estate-guide/` | posts-export (24) |
| 25 | `/relocating-to-tampa-bay/` | market updates |
| 20 | `/flood-zones-pinellas-county/` | pages-content |
| 19 | `/pinellas-county-flood-zones/` | posts-export |
| 18 | `/arista-community/` | neighborhood-descriptions |

The 9 cities missing a `sell-home-fast` post: `floral-city`, `indian-shores`,
`redington-beach`, `tierra-verde`, `south-pasadena`, `east-lake`,
`crystal-beach`, `ozona`, `redington-shores`. **Fix:** guard
`SpokeNav.tsx:100` with a post-existence check.

### Top redirect-hop targets (crawl budget waste)

| Hits | Hop | Source |
| --- | --- | --- |
| 19,917 | `/first-time-home-buyer-guide/` → `/guides/first-time-home-buyer-guide/` | `Footer.tsx:18` (sitewide, 6,657), `Header.tsx:105` + `:127` (sitewide), `CityResources.tsx:283` (93) |
| 6,657 | `/florida-homestead-exemption-save-our-homes/` → `/guides/...` | `Header.tsx:122` (sitewide) |
| 3,559 | `/tampa-bay-area-homes-for-sale/` → `/properties/` | `pages-content.json` (3,074) |
| 1,169 | `/florida-homeowners-insurance-guide/` → `/blog/...` | `pages-content.json` (942) |
| 1,099 | `/closing-costs-florida-guide/` → `/blog/...` | `pages-content.json` (958) |
| 1,017 | `/first-time-home-buyer-brandon-fl/` → `/blog/...` | `pages-content.json` (935) |
| 94 | `/home-appraisal-guide/` → `/guides/...` | `CityResources.tsx:283` |
| 93 ea. | `/home-inspection-guide-florida/`, `/how-to-choose-a-realtor/`, `/new-construction-guide/`, `/relocation-guide/`, `/hoa-buyers-guide/` → `/guides/...` | `CityResources.tsx:283` |
| 42 | `/tampa-bay-55-plus-communities-guide/` → `/blog/...` | pages-content |
| ~450 | 20+ `/{city}-housing-market-q2-2026/` → `/market-updates/...` | `market-updates-export.json` |
| 17 | `/get-help/` → `/contact/` | pages-content |

Plus **1,116 city-hub → root-blog-slug links** (`CityResources.tsx:304`) which
land on the `[citySlug]` runtime `permanentRedirect` rather than a config
redirect — same crawl cost, harder to see.

### `:city` flatten redirect trap

`next.config.mjs:368` (`/:city/:city-:topic`) and `:372`
(`/:city/:neighborhood`) both exclude these 19 first segments:
`11417-cypress-park-st`, `30935-whitlock-dr`, `3813-polumbo-dr`, `_next`,
`account`, `api`, `auth`, `blog`, `builders`, `clients`, `communities`,
`compare`, `guides`, `images`, `market-updates`, `properties`, `resources`,
`sell`, `wp-content`. Rule `:372` additionally excludes `southoak` on the
second segment.

Cross-checking every nested route in `src/app/`:

| Nested route | In rule 1 | In rule 2 | Verdict |
| --- | --- | --- | --- |
| `/auburndale/gapway-lakes-estates` | **No** | **No** | **AT RISK — confirmed infinite redirect loop in production** |
| `/brandon/southoak` | No | Yes (2nd segment) | OK — no hyphen, so rule 1 cannot match |
| `/sell/why-didnt-my-house-sell` | Yes | Yes | OK |
| `/properties/search` | Yes | Yes | OK |
| `/11417-cypress-park-st/{feedback,sign-in}` | Yes | Yes | OK |
| `/30935-whitlock-dr/{feedback,sign-in}` | Yes | Yes | OK |
| `/3813-polumbo-dr/sign-in` | Yes | Yes | OK |
| all `/api/**`, `/auth/callback`, `/blog/[slug]`, `/builders/[slug]`, `/clients/[slug]`, `/compare/[slug]`, `/guides/[slug]`, `/market-updates/[slug]`, `/properties/[...slug]` | Yes | Yes | OK |

**1 at-risk route, and it is actively broken.** Any new nested community page
under a city will hit the same loop.

### Sitemap / route mismatches

- **7 duplicate sitemap entries:** `/fishhawk-housing-market/`,
  `/tarpon-springs-recently-sold/`, `/new-tampa-homes-for-sale/`,
  `/new-tampa-realtor/`, `/boyette-homes-for-sale/`,
  `/carrollwood-meadows-homes-for-sale/`, `/mango-homes-for-sale/` —
  neighborhood slugs that collide with city/spoke slugs.
- **73 routes render but are missing from `sitemap.ts`:** 50 city spokes
  (`parseSlug` accepts any topic from `getCityTopics()`, but `sitemap.ts:109`
  additionally filters on `city.topics.includes()`), 16 static, 7 nested static.
  Examples: `/englewood-condos-for-sale/`, `/floral-city-luxury-homes/`,
  `/hernando-beach-55-plus-homes/`, `/dmca-notice/`, `/accessibility/`,
  `/fair-housing/`, `/brandon/southoak/`.
- Trailing slashes are consistent between `sitemap.ts` and routes. The mismatch
  is entirely on the **link side** (310,308 slash-less hrefs).
- `src/data/batch2-city-content.json` (33 pages, 178 KB) is not imported anywhere
  in `src/` — dead content that could be feeding thin pages.

---

## 6. Anchor text report

### Non-descriptive anchors
**2,082 instances, all one phrase: `"Learn more"`** — 975 in
`posts-export.json`, 942 in `pages-content.json`, 165 elsewhere.

Zero instances of `"click here"`, `"here"`, `"read more"`, `"this page"`, or
bare `"link"`. That rule is otherwise clean.

### Top 20 most-repeated anchor strings

| Instances | Anchor |
| --- | --- |
| 48,349 | `mortgage calculator` |
| 7,973 | `contact me` |
| 6,078 | `Home` (breadcrumb) |
| 4,004 | `FHA loan options` |
| 3,997 | `FHA loans` |
| 3,993 | `FHA loan` |
| 2,503 | `Contact Barrett` |
| 2,308 | `Tampa` |
| 2,279 | `Valrico` |
| 2,221 | `contact page` |
| 2,129 | `Brandon` |
| 2,082 | `Learn more` |
| 2,080 | `Riverview` |
| 2,004 | `jumbo loan` |
| 1,993 | `fill out my contact form` |
| 1,993 | `FHA loan requirements` |
| 1,941 | `Schedule a Free Consultation` |
| 1,898 | `Clearwater` |
| 1,851 | `Wesley Chapel` |
| 1,774 | `Mortgage Calculator` |

`"mortgage calculator"` as exact-match anchor **48,349 times** is the single
most over-optimized pattern on the site. It originates almost entirely from the
`CityContent.tsx` boilerplate (lines 336, 368, 398, 430, 469, 500, 528, 564,
595, 631, 671, 705, 740, 769, 800, 833, 864, 903, 956) repeated across 1,993
spokes and 93 hubs. Combined with `FHA loan*` (11,994) and `contact me`/`contact
page`/`fill out my contact form` (12,187), the same three destinations soak up
~72,000 identical anchors. At scale this reads as templated manipulation, not
editorial linking.

### Ambiguous anchor signals
- **1,603 anchor strings point to more than one destination.** Most are
  legitimate template labels (`{topic.label} in {city.name}`, `{n.name}`,
  `{city.name} Homes for Sale`). The problematic ones are generic:
  `"Free Home Valuation"` → 98 destinations, `"mortgage calculator"` → 94,
  `"Property Management"` → 94, `"REALTOR®"` → 93, `"New Construction"` → 41,
  `"Waterfront Homes"` → 40, `"Best Neighborhoods"` → 33,
  `"First-Time Buyer Guide"` → 29, `"Learn more"` → 27, `"Schools Guide"` → 26.
- **48 destinations are reached by more than 20 different anchor strings:**
  `/contact/` (156 distinct anchors), `/sell-your-home/` (91),
  `/properties/` (55), `/blog/first-time-home-buyer-brandon-fl/` (46),
  `/brandon/` (45), `/valrico/` (42),
  `/blog/florida-homeowners-insurance-guide/` (37), `/riverview/` (36),
  `/blog/investment-property-tampa-bay/` (36),
  `/guides/condo-milestone-inspection-guide/` (35). Natural variety for the
  CTA pages; for the three over-linked blog posts it is a symptom of the same
  prose boilerplate being pasted across hundreds of `pages-content.json` records.

---

## 7. Over-linking and footer audit

### "Related" / resource block sizes vs the 6–8 cap

| Block | Pages | Median links | Max | Pages over 8 |
| --- | --- | --- | --- | --- |
| Blog "Related Posts" grid (`blog/[slug]:407`) | 1,760 | 8 | 8 | 0 |
| Blog sidebar Related Posts (`blog/[slug]:279`) | 1,760 | 3 | 3 | 0 |
| Guide Related Guides (`guides/[slug]:406`) | 48 | 3 | 3 | 0 |
| Market update Related (`market-updates/[slug]:228`) | 148 | 2 | 4 | 0 |
| City hub Helpful Guides (`CityResources:283`) | 93 | 8 | 8 | 0 |
| City hub Loan Programs (`CityResources:153`) | 93 | 8 | 8 | 0 |
| **City hub Recent Articles (`CityResources:304`)** | **93** | **12** | **12** | **93** |
| **SpokeNav topic grid (`SpokeNav:34`)** | **2,086** | **21** | **22** | **2,086** |
| **Realtor topic grid (`RealtorPage:400`)** | **813** | **21** | **22** | **813** |
| **Neighborhood nearby grid (`NeighborhoodPage:357`)** | **1,438** | **6** | **138** | **576** |
| **Realtor neighborhood grid (`RealtorPage:450`)** | **813** | **7** | **139** | **307** |
| **Hub nearby-cities, same county (`[citySlug]:768`)** | **93** | **10** | **25** | **68** |
| CityResources grids (combined) | 93 | 5 | 152 | 16 |

Blog posts carry **exactly 11 blog→blog links each** (8 in the grid + 3 in the
sidebar), against the standard of "2–3 other blog posts + a Related Reading
section with 3–4 links" = 5–7. Every one of the 1,760 posts is over.

City hubs carry **122–284 distinct internal targets** (median 138). That is far
past the point of diminishing returns and dilutes the hub's own link equity.
The `/valrico/` hub's neighborhood grid alone renders **139** links (Valrico has
139 registered neighborhoods); `/tampa/` renders 42.

### Footer audit — `src/components/layout/Footer.tsx`

| Check | Result |
| --- | --- |
| Total `href` entries | 39 |
| Internal links | **36** |
| External links | **1** (`https://firsttimehomebuyertb.com`, line 21) |
| `tel:` / `mailto:` | 2 (lines 85, 94) |
| **Heading tags (`<h1>`–`<h6>`)** | **NONE — compliant.** Column headers use `<p>` (line 106, with an explanatory comment) |
| Spammy "Our Network" block | **No.** One contextual external link labelled "Down Payment Programs" inside the Buy column |
| Site credit | Plain text "Site by Vyrabyte" (line 181), not a link — compliant |
| **Trailing slashes** | **VIOLATION — all 36 internal hrefs omit the trailing slash** (lines 14–70). 36 × 6,657 pages = 239,652 sitewide 308 redirects |
| Redirect targets in the footer | `/first-time-home-buyer-guide` → `/guides/first-time-home-buyer-guide/`; `/fsbo-vs-realtor` → `/guides/fsbo-vs-realtor/` |

`Header.tsx`: 66 hrefs, 64 internal, 0 external, **no heading tags**, and every
internal href already carries a trailing slash — fully compliant on structure.
Its one issue is three root-level guide slugs that 301 to `/guides/...`:
`/first-time-home-buyer-guide/` (lines 105 and 127),
`/fsbo-vs-realtor/` (line 114), and
`/florida-homestead-exemption-save-our-homes/` (line 122) — 6,657 × 4 = 26,628
sitewide 301 hops.

`MobileNav.tsx`: 10 hrefs, 8 internal, no heading tags — compliant.

### Cross-site links to Barrett's other domains

Occurrence counts by file. **Zero are in the footer, header, or mobile nav** —
the "contextual body content only" rule is being followed.

| Domain | Occurrences | Primary locations |
| --- | --- | --- |
| `valricopropertymgmt.com` | 121 | `src/data/neighborhood-descriptions.ts` (117), `app/about/page.tsx` (2), `components/city/CityContent.tsx` (1), `lib/schema.tsx` (1) |
| `bestbayservices.com` | 40 | `market-updates-export.json` (24), `posts-export.json` (4), `pages-content.json` (4), `app/layout.tsx` (1 — `sameAs`) |
| `vivipm.com` | 19 | `posts-export.json` (3), `app/about` (2), `app/the-now-team` (2), `RemaxOfficePage.tsx` (2) |
| `flforeclosurehelp.com` | 12 | `posts-export.json` (6), `layout.tsx`, `app/page.tsx`, `app/investing` |
| `barretthenry.remax.com` | 11 | `lib/schema.tsx` (2), `posts-export.json` (2), `layout.tsx`, `app/page.tsx` |
| `valoantb.com` | 10 | `posts-export.json` (6), `about`, `buyers`, `CityContent.tsx` |
| `tampabaydownpayment.com` | 10 | `posts-export.json` (7), `about`, `CityContent.tsx`, `schema.tsx` |
| `hencre.com` | 9 | `about` (2), `commercial` (2), `layout.tsx`, `app/page.tsx` |
| `firsttimehomebuyertb.com` | 8 | `posts-export.json` (2), `about`, `buyers`, `CityContent.tsx`, **`Footer.tsx:21`** |
| `valricoagent.com` | 7 | `posts-export.json` (2), `pages-content.json` (2), `about`, `CityContent.tsx` |
| `valrico.blog` | 3 | `layout.tsx` (`sameAs`), `app/page.tsx`, `CityContent.tsx` |
| `vyrabyte.com` | 2 | `layout.tsx` (`sameAs`), `app/page.tsx` |
| `fastselleasy.com` | 2 | `layout.tsx` (`sameAs`), `app/page.tsx` |
| `buildtb.com` | 2 | `layout.tsx` (`sameAs`), `app/page.tsx` |

**One pattern to flag:** `src/components/city/CityContent.tsx:171–267` renders a
"Helpful Resources for {city} Home Buyers" `<ul>` with **8 external links on
every city hub and spoke** — 3 authoritative third-party (school district,
DBPR, FEMA) and **5 of Barrett's own domains** (`flforeclosurehelp.com`,
`firsttimehomebuyertb.com`, `valricopropertymgmt.com`, `valoantb.com`,
`tampabaydownpayment.com`), rising to 7 on the Valrico hub
(`valricoagent.com`, `valrico.blog` at lines 250–265). That is a 5–7-link
self-network block replicated across ~2,086 pages. It is not in the footer, so
it passes the letter of the rule, but structurally it is the "Our Network"
pattern the rule exists to prevent. Also note none of these carry
`rel="nofollow"` and only the 3 third-party links carry `target="_blank"`.

Separately, `src/data/neighborhood-descriptions.ts` links
`valricopropertymgmt.com` **117 times** across 207 neighborhood writeups —
roughly every other neighborhood page. That density on one external domain is
worth reviewing.

---

## 8. Silo health

### Hub ↔ spoke completeness, 10-city sample

| City | Spokes | Hub → spoke | Spoke → hub | Spoke → siblings (avg) | Hub contextual inbound |
| --- | --- | --- | --- | --- | --- |
| valrico | 21 | 21 / 21 | 21 / 21 | 20.0 | 3,561 |
| brandon | 21 | 21 / 21 | 21 / 21 | 20.0 | 2,843 |
| riverview | 21 | 21 / 21 | 21 / 21 | 20.0 | 2,775 |
| tampa | 21 | 21 / 21 | 21 / 21 | 20.0 | 3,014 |
| lithia | 22 | 22 / 22 | 22 / 22 | 21.0 | 2,329 |
| plant-city | 22 | 22 / 22 | 22 / 22 | 21.0 | 2,297 |
| clearwater | 21 | 21 / 21 | 21 / 21 | 20.0 | 2,406 |
| st-petersburg | 21 | 21 / 21 | 21 / 21 | 20.0 | 2,288 |
| wesley-chapel | 21 | 21 / 21 | 21 / 21 | 20.0 | 2,437 |
| sarasota | 21 | 21 / 21 | 21 / 21 | 20.0 | 596 |

**Verdict: the city silos are structurally perfect.** Every hub links every
spoke, every spoke links back to the hub, and every spoke links every sibling —
`SpokeNav.tsx` renders the complete grid on both hub and spoke. This is the
healthiest part of the architecture. The two defects are cosmetic-but-costly:
the links are slash-less (46,440 × 308) and the grid is 21–22 links, well over
the 6–8 cap for a related-links block.

### Valrico domination — confirmed

| City | Hub contextual inbound | Rank | × average |
| --- | --- | --- | --- |
| **valrico** | **3,561** | **1 of 93** | **3.94×** |
| tampa | 3,014 | 2 | 3.34× |
| brandon | 2,843 | 3 | 3.15× |
| riverview | 2,775 | 4 | 3.07× |
| lithia | 2,329 | 8 | 2.58× |
| plant-city | 2,297 | 9 | 2.54× |
| seffner | 677 | 22 | 0.75× |
| dover | 613 | 36 | 0.68× |
| *average city hub* | *903* | — | 1.00× |

Full-cluster inbound (hub + all spokes + `-realtor` + `sell-your-home-`):

| City | Cluster inbound | Rank |
| --- | --- | --- |
| **valrico** | **10,629** | **1 of 93** |
| tampa | 5,501 | 2 |
| brandon | 4,630 | 3 |
| riverview | 4,404 | 4 |
| wesley-chapel | 3,887 | 5 |
| st-petersburg | 3,795 | 6 |
| apollo-beach | 3,574 | 7 |
| lithia | 3,507 | 8 |
| *average* | *1,982* | — |

**Valrico is the single best-linked city on the site at both hub level (3.94×
average) and cluster level (5.36× average), and Brandon, Riverview and Tampa
occupy ranks 2–4.** The priority-area goal is being met. Dover (rank 36) and
Seffner (rank 22) are the laggards among the footer-featured cities — they are
in `NEARBY_CITIES` but have few neighborhoods and little blog coverage.

Weakest city hubs (all around 0.55× average, all Pinellas/Sarasota beach
communities): `nokomis` (487), `osprey` (491), `siesta-key` (506), `ozona` (517),
`crystal-beach` (520), `north-port` (520), `redington-shores` (523),
`floral-city` (523), `east-lake` (524), `indian-shores` (524).

### Topic clusters with no hub page

| Cluster | Pages | Hub? |
| --- | --- | --- |
| Neighborhood `-homes-for-sale` / `-realtor` (1,440 pages) | 1,440 | **None.** No `/neighborhoods/` index exists; the only entry points are the per-city grids, which link the bare hub only |
| Builder detail pages (8) | 8 | `/builders/` exists but links to the **wrong URLs** — functionally no hub |
| Property-type landings (11) | 11 | **None.** No `/property-types/` index; 6 of 11 have zero inbound. Header has no property-type menu |
| Loan guides (8) | 8 | **None.** `/lenders/` exists (5 inbound) but does not link the loan guides; the only hub-like source is `CityResources.tsx:153` |
| Beach-condo cluster (7) | 7 | **None.** No index page; 4 of 7 have no CTA link |
| Comparison pages (31) | 31 | **None.** `/compare/[slug]` route exists but there is no `/compare/` index; entry is only via `CityResources.tsx:262` when a city name matches |
| Regional pages (34) | 34 | **None.** 3 orphaned, 11 near-orphaned |
| Market updates (232) | 232 | `/market-updates/` **works** — lists all 232 |
| Guides (49) | 49 | `/guides/` **works** — lists all 49 |
| Blog (1,760) | 1,760 | `/blog/` **broken** — query-string pagination surfaces only 24 |
| City hubs (93) | 93 | `/communities/` **works** — lists all 93 + 8 counties |

---

## 9. Exact fix list, ranked by pages fixed per edit

| # | File : line | Change | Pages fixed | Links fixed |
| --- | --- | --- | --- | --- |
| 1 | `src/components/pages/NeighborhoodPage.tsx:357` + `src/components/city/CityResources.tsx:129` + `src/components/pages/RealtorPage.tsx:450` | In each neighborhood grid, emit all three variants (`/{slug}/`, `/{slug}-homes-for-sale/`, `/{slug}-realtor/}`) instead of the hub only | **1,384 orphans → linked** | +2,880 |
| 2 | `src/components/layout/Footer.tsx:14–70` | Add trailing slashes to all 36 hrefs; point `/first-time-home-buyer-guide` and `/fsbo-vs-realtor` at `/guides/...` | all 6,657 | **−239,652 308s, −19,917 301s** |
| 3 | `src/components/city/SpokeNav.tsx:34` | `const href = \`/${city.slug}-${topic.slug}/\`` (add the slash) | 2,086 | **−46,440 308s** |
| 4 | `src/components/pages/SellYourHomeCityPage.tsx` | Add a resource block: city hub, `/free-home-valuation/`, `/seller-intake/`, `/{city}-housing-market/`, `/{city}-realtor/`, 3–4 sibling `sell-your-home-{nearby}` links | 93 | +650 |
| 5 | `src/components/pages/LoanGuidePage.tsx` | Add a CTA + related-links block: `/free-home-valuation/`, `/contact/`, `/mortgage-calculator/`, `/buyers/`, the other 7 loan guides | 8 | +80 (unlocks 56,858 trapped inbound) |
| 6 | `src/components/city/CityResources.tsx:304` | `href={\`/blog/${post.slug}/\`}` | 93 | **−1,116 301s** |
| 7 | `src/components/city/CityResources.tsx:68` | Fix `florida-homestead-exemption-guide` → `florida-homestead-exemption-save-our-homes`; prefix lines 66–75 with `/guides/` | 93 | **−93 404s, −558 301s** |
| 8 | `src/app/blog/page.tsx:233,271,286` | Replace `?page=N` with real `/blog/page/[n]/` routes; add them to `sitemap.ts` | 1,736 blog posts reachable | +1,736 |
| 9 | `next.config.mjs:368,372` | Add `auburndale` to both `(?!...)` lookaheads | 1 (fixes a production redirect loop) | — |
| 10 | `src/app/builders/page.tsx:294` | `href={\`/builders/${builder.slug}/\`}` | 8 orphans | +8, −8 404s |
| 11 | `src/components/city/SpokeNav.tsx:100` | Guard with `getPostBySlug(\`sell-home-fast-${city.slug}\`)` before rendering | 199 links | −199 404s |
| 12 | `src/app/{pool-homes,townhomes,single-story,price-reduced,no-hoa,golf-homes,condos,land-acreage,waterfront,new-construction,55-plus-communities}/page.tsx` | Add body copy, a `/free-home-valuation/` + `/contact/` CTA, and a city resource grid. Add a property-type menu to `Header.tsx` | 11 (6 orphans) | +250 |
| 13 | `src/components/layout/Header.tsx` | Add a single link to `/seller-intake/` (currently 0 inbound) in the Sellers menu | 1 | +6,657 |
| 14 | `src/data/pages-content.json` | Global find/replace the 4 broken targets accounting for 3,300 hits: `/investment-property-tampa-bay/`, `/tampa-bay-rents-4-year-low-rent-or-buy/`, `/tampa-bay-area-homes-for-sale/` → `/properties/`, `/waterfront-homes-tampa-bay/` → `/waterfront/` | up to 1,203 | **−2,100 404s, −3,559 301s** |
| 15 | `src/data/neighborhood-descriptions.ts` | Fix `/remax-collective/` (252 hits) → `/about/` or `/the-now-team/`; thin the 117 `valricopropertymgmt.com` links | 207 | −270 404s |
| 16 | `src/app/blog/[slug]/page.tsx:308` | Add trailing slashes to the 8 financing-guide hrefs | 1,760 | **−14,080 308s** |
| 17 | `src/app/blog/[slug]/page.tsx:279` | `href={\`/blog/${r.slug}/\`}` | 1,760 | −1,760 308s |
| 18 | `src/app/sitemap.ts:109` | Drop the extra `city.topics.includes()` filter so the 50 renderable spokes are listed; dedupe the 7 neighborhood/city slug collisions | 57 | — |
| 19 | `src/components/city/CityContent.tsx:336–956` | Replace the 19 repeated `"mortgage calculator"` anchors with varied, contextual anchor text; thin the 5–7 own-domain links at lines 209–265 to 2 contextual ones | 2,086 | −46,000 duplicate anchors |
| 20 | `src/components/pages/ComparisonPage.tsx` | Comparison pages have exactly 4 outbound links and no body links — add a related-comparisons block and a `/compare/` index route | 31 | +180 |
| 21 | `src/components/pages/CountyPage.tsx:117` + `RealtorPage.tsx:200` + `app/[citySlug]/page.tsx` + `investing/page.tsx:102` | Add trailing slashes | 8 + 813 + 2,086 + 1 | −2,902 308s |
| 22 | `src/data/batch2-city-content.json` | Unreferenced (33 pages, 178 KB). Either wire it in or move it out of `src/data/` | — | — |

**Single highest-leverage edit:** `Footer.tsx` lines 14–70. One file, 36
one-character changes, eliminates 239,652 308 redirect requests and 19,917 301
hops across every page on the site.

**Single highest-leverage for rankings:** fix #1. Three lines across three files
moves 1,384 commercial-intent pages (21% of the site) from invisible to indexed.
