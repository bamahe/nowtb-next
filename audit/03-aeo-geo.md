# nowtb.com — AEO / GEO Audit

**Repo:** `/Users/barretthenry/Projects/nowtb-leadmachine` · branch `seo/lead-machine-oct2026`
**Date:** 2026-10-17 · **Scope:** read-only. No source file was modified.
**Method:** static analysis of every route + template, plus a byte-exact JS port of
`cleanWpContent()` run against all 3,244 content records to measure what actually
reaches the rendered HTML (not just what sits in the JSON).

## Verified page inventory

| Surface | Route / template | Pages |
|---|---|---|
| Blog posts | `src/app/blog/[slug]/page.tsx` | 1,760 |
| City hubs + spokes | `src/app/[citySlug]/page.tsx` → `src/components/city/CityContent.tsx` | 1,118 content-backed (67 hubs + 1,051 spokes) |
| Market updates | `src/app/market-updates/[slug]/page.tsx` | 232 |
| Neighborhoods | `src/components/pages/NeighborhoodPage.tsx` | 742 defined / 35 content-backed |
| Guides | `src/app/guides/[slug]/page.tsx` | 49 |
| Regional | `src/components/pages/RegionalPage.tsx` | 36 (32 content-backed) |
| Comparisons | `src/components/pages/ComparisonPage.tsx` | 33 |
| Misc catch-all | `src/components/pages/MiscCatchAllPage.tsx` | 32 |
| Builders | `src/app/builders/[slug]/page.tsx` | 10 |
| Hand-built routes | `src/app/**/page.tsx` | ~95 |

All 1,203 records in `pages-content.json` resolve to a live route — zero orphans.
All 93 city objects in `cities.ts` carry real, distinct `lat`/`lng`.

---

## 1. Top 10 AEO/GEO gaps (ranked by pages affected × citation value)

### 1. `cleanWpContent()` silently truncates content and deletes 1,948 pages' FAQPage schema
**`src/lib/utils.ts:126-172`** — affects **3,244 pages** (every content-backed page on the site).

The function cuts the content string at the *first* match of an "always cut" pattern and
at the *last* match of a "late cut" pattern. Two of those patterns match legitimate body
content on a real estate site, and the FAQ block plus its JSON-LD sit *after* the cut point:

```
src/lib/utils.ts:153   /<h2[^>]*>[^<]*(?:Real Estate|Explore)[^<]*<\/h2>/i
src/lib/utils.ts:154   /<h2[^>]*>\s*Frequently Asked Questions\s*<\/h2>/i
src/lib/utils.ts:127   /<h2[^>]*>\s*Related (?:Resources|Articles)\s*<\/h2>/i
```

Measured by running the exact ported function over every record:

| Content set | FAQPage in source | FAQPage after cleaning | **Destroyed** | Words lost |
|---|---|---|---|---|
| Blog posts (1,760) | 1,563 | 816 | **747** | 468,156 (15.4%) |
| City/neighborhood/regional/misc (1,203) | 1,057 | 29 | **1,028** | 442,474 (25.5%) |
| Market updates (232) | 166 | 0 | **166** | 135,083 (41.4%) |
| Guides (49) | 47 | 40 | **7** | 5,202 (3.1%) |
| **Total** | **2,833** | **885** | **1,948** | **1,050,915** |

Visible FAQ sections die with the schema: blog 1,300 → 831, market updates **229 → 38**.
Cut-pattern frequency: `Related Resources/Articles` 1,677 · `nowtb-footer-section` 1,183 ·
`Frequently Asked Questions` 551 · `H2 containing "Real Estate"/"Explore"` 511.

Confirmed call sites: `src/app/blog/[slug]/page.tsx:351`,
`src/app/market-updates/[slug]/page.tsx:251`, `src/app/guides/[slug]/page.tsx:232,323`,
`src/components/city/CityContent.tsx:72`, `src/components/pages/NeighborhoodPage.tsx:77`,
`src/components/pages/MiscCatchAllPage.tsx:24`, `src/components/pages/RegionalPage.tsx:48`.

**Fix:** delete patterns on lines 153 and 154 outright. Replace the substring-truncation
approach with targeted removal of the boilerplate `<div class="nowtb-*">` wrappers only —
never `substring(0, idx)`, which discards everything downstream including `<script>` JSON-LD.
Then re-emit FAQPage from the *template* (gap #4) so content edits can never break schema again.

### 2. Author image 404s in the Person/Article schema on every page of the site
**`src/app/layout.tsx:119`** — affects **all ~3,300 pages**.

```
"image": "https://nowtb.com/images/barrett-henry-headshot.jpg",
```

`public/images/` contains `barrett-headshot.png`, `barrett-henry.jpg`,
`barrett-agent-photo.png`, `barrett-henry-pro.png`, `barrett-henry-card-pic-blue.png` —
there is **no `barrett-henry-headshot.jpg`**. The site-wide `Person` entity in
`layout.tsx` therefore points `image` at a 404, which is the single strongest
Knowledge-Graph signal Barrett has. 8 references total:

| File:line | Pages affected |
|---|---|
| `src/app/layout.tsx:119` | all pages (global Person schema) |
| `src/app/blog/[slug]/page.tsx:128` | 1,760 |
| `src/app/market-updates/[slug]/page.tsx:118` | 232 |
| `src/lib/schema.tsx:265` (`articleSchema`) | 8 beach-condo/pillar pages |
| `src/app/valrico-listing-agent/page.tsx:238,275` | 1 |
| `src/app/brandon-listing-agent/page.tsx:238,275` | 1 |

**Fix:** one find/replace to `https://nowtb.com/images/barrett-headshot.png` (or add the
`.jpg` file). Note `src/app/guides/[slug]/page.tsx:106` already uses the valid
`barrett-henry.jpg` — align all of them on one URL.

### 3. No FAQPage schema is emitted by any high-volume template
Affects **1,760 blog + 232 market updates + 49 guides = 2,041 pages**.

Every FAQ on these pages comes from JSON-LD *baked inside the content HTML string* and
injected via `dangerouslySetInnerHTML`. Consequences: the template cannot validate it,
a content edit silently breaks it, and `cleanWpContent` deletes it (gap #1). Even before
truncation, pages with visible Q&A and **no** FAQPage schema at all:

- Blog posts: **195** (of 1,300 with a visible FAQ heading)
- Market updates: **66** (229 of 232 show a visible FAQ heading)
- Misc/city pages: **42**
- Guides: **2**

`faqSchema()` exists at `src/lib/schema.tsx:297` and is only used by 10 hand-built pages.
`src/components/ui/FaqSection.tsx` exists and is documented to pair with it.

**Fix:** parse the FAQ pairs out of content once at build time into a `faqs` field, render
with `FaqSection`, and emit `faqSchema(faqs)` from the template. Guarantees JSON-LD and
visible markup can never diverge.

### 4. Market updates — the highest-citation-value content — are the worst-served template
**`src/app/market-updates/[slug]/page.tsx`** — **232 pages**.

Emits only `Article` (line 107) + `BreadcrumbList` (line 91). Missing: FAQPage (229/232
have visible FAQ headings), `WebPage`, `QuickAnswer` component, `SourcesSection`,
`Dataset`/`speakable` targeting the stats. After `cleanWpContent` these pages lose **41.4%
of their words** and **100% of their FAQ schema** (166 → 0). Median-price/DOM tables are
exactly what AI Overviews extract, and 205/232 have a `<table>` — much of it in the
truncated tail.

### 5. Two templates emit zero structured data
- **`src/components/pages/MiscCatchAllPage.tsx`** — 105 lines, **0** JSON-LD blocks, **32 pages**
- **`src/components/pages/RegionalPage.tsx`** — 207 lines, **0** JSON-LD blocks, **36 pages**

No `BreadcrumbList`, no `WebPage`, no `FAQPage`, no `speakable` — 68 pages invisible to
answer engines as entities. `MiscCatchAllPage.tsx:45-48` also hardcodes a fallback bio.

### 6. `speakable` points at a CSS class that isn't on the page
Three templates declare `cssSelector: [".quick-answer", ...]` —
`src/app/blog/[slug]/page.tsx:153`, `src/app/market-updates/[slug]/page.tsx:137`,
`src/app/guides/[slug]/page.tsx:121` — but the `QuickAnswer` component
(`src/components/ui/QuickAnswer.tsx`, which supplies `class="quick-answer"`) is used by
**zero** of them. The class only exists where it happens to be baked into content HTML:

| Template | has `class="quick-answer"` | **broken selector** |
|---|---|---|
| Guides (49) | 2 | **47** |
| Market updates (232) | 165 | **67** |
| Blog posts (1,760) | 983 | **777** |
| City/misc (1,203) | 605 | **598** (moot — no schema emitted) |

**891 pages** declare a speakable block whose primary selector matches nothing.

### 7. `QuickAnswer` and `SourcesSection` have zero template adoption
Both components exist and are good. Usage is confined to 10–11 hand-built pages
(the beach-condo cluster plus `valrico-listing-agent` / `brandon-listing-agent`).

| Template | Pages | QuickAnswer | SourcesSection |
|---|---|---|---|
| Blog posts | 1,760 | 0 | 0 |
| City hubs + spokes | 1,118 | 0 | 0 |
| Market updates | 232 | 0 | 0 |
| Guides (pillar content) | 49 | 0 | 0 |
| Comparisons | 33 | 0 | 0 |

The 49 guides are the site's pillar pages and cite **no statutes or sources** — the exact
signal that makes a page quotable. Openings are actually decent (many city spokes and
market updates lead with literal "Quick Answer" prose), so this is a wrapper/schema gap,
not a writing gap.

### 8. City pages carry no `LocalBusiness` and no `WebPage`/`speakable`
**`src/app/[citySlug]/page.tsx:799,1307`** — **1,118 pages**.

`cityPlaceSchema()` (`src/lib/schema.tsx:160`) emits `City` + real `GeoCoordinates` +
`containedInPlace`, and all 93 cities have distinct coordinates — that part is correct and
better than most sites. But the standard requires `LocalBusiness` (with geo) + `FAQPage` +
`WebPage` with `speakable`. Only `BreadcrumbList` + `City` + `ItemList` are present on the
hub; `FAQPage` appears on some spoke branches (lines 1064, 1814) but not hubs.
`localBusinessSchema()` and `realEstateAgentSchema()` exist in `src/lib/schema.tsx:20,81`
and are **dead code** — never imported anywhere (the file's own comment at lines 14-19
admits it).

### 9. Split entity identity — two competing social-profile sets
Barrett's `sameAs` arrays disagree with each other, which actively prevents answer engines
from consolidating one entity:

| Profile set | Used in |
|---|---|
| `instagram.com/nowtampa/` + `facebook.com/NOWTampaBay` | `src/app/blog/[slug]/page.tsx:131-132` (**1,760 pages**), `public/llms.txt`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/market-updates/[slug]/page.tsx` |
| `instagram.com/thenowteam` + `facebook.com/BarrettHenryREALTOR` | `src/lib/schema.tsx:73-74`, `src/app/guides/[slug]/page.tsx:110` |

Site lists also disagree: `src/lib/schema.tsx:58-76` includes `valricopropertymgmt.com`,
`valricoagent.com`, `valoantb.com`, `tampabaydownpayment.com`, `fastexpert.com` — all
absent from `llms.txt`; `llms.txt` lists `vyrabyte.com`, `valrico.blog`, `buildtb.com`,
`flpermithelp.com`, `fastselleasy.com`, `firsttimehomebuyertb.com` — all absent from
`schema.tsx`. **Fix:** one exported `SAME_AS` constant, imported everywhere, matching `llms.txt`.

### 10. `BreadcrumbList` missing on 18 public routes + 101 template-driven pages
18 non-homepage routes emit neither `BreadcrumbList` nor `breadcrumbSchema()`. Public ones
that matter: `src/app/brandon/southoak/page.tsx`, `src/app/compare/[slug]/page.tsx`,
`src/app/home-valuation/page.tsx`, `src/app/inspectors/page.tsx`,
`src/app/remote-seller-process/page.tsx`, `src/app/fair-housing/page.tsx`,
`src/app/dmca-notice/page.tsx`, `src/app/properties/search/page.tsx`.
Plus templates: `ComparisonPage.tsx` (33), `MiscCatchAllPage.tsx` (32),
`RegionalPage.tsx` (36) = **101 pages**.
(Auth/kiosk routes — `login`, `account`, `*/sign-in`, `*/feedback`, `card`,
`clients/[slug]` — are correctly excluded from indexing concerns.)

---

## 2. Schema coverage matrix

Required per the standard; ✅ present, ⚠️ partial, ❌ missing.

| Route / template | Pages | Present | Required | Missing |
|---|---|---|---|---|
| `src/app/page.tsx` (homepage) | 1 | RealEstateAgent, AggregateRating, Review; WebSite + Person + SiteNavigationElement via `layout.tsx` | WebSite + Organization + LocalBusiness + FAQPage | ❌ LocalBusiness, ❌ FAQPage, ⚠️ Organization (RealEstateAgent used) |
| `src/app/blog/[slug]/page.tsx` | 1,760 | BlogPosting (full author), BreadcrumbList, speakable | Article (full author) + FAQPage | ❌ FAQPage (template); ⚠️ speakable selector broken on 777 |
| `src/app/[citySlug]/page.tsx` (hub) | 67 | BreadcrumbList, City+geo, ItemList | LocalBusiness+geo + FAQPage + WebPage/speakable | ❌ LocalBusiness, ❌ FAQPage, ❌ WebPage/speakable |
| `src/app/[citySlug]/page.tsx` (spoke) | 1,051 | BreadcrumbList, City+geo, ItemList, FAQPage (some branches) | LocalBusiness+geo + FAQPage + WebPage/speakable | ❌ LocalBusiness, ❌ WebPage/speakable, ⚠️ FAQPage |
| `src/app/market-updates/[slug]/page.tsx` | 232 | Article, BreadcrumbList, speakable | Article + FAQPage | ❌ FAQPage, ❌ WebPage; author.image 404 |
| `src/app/guides/[slug]/page.tsx` | 49 | Article, BreadcrumbList, speakable | Article + FAQPage + QuickAnswer + Sources | ❌ FAQPage, ❌ QuickAnswer, ❌ SourcesSection; author lacks `hasCredential` |
| `src/components/pages/NeighborhoodPage.tsx` | 742 / 35 | BreadcrumbList, FAQPage | LocalBusiness+geo + FAQPage + WebPage | ❌ LocalBusiness/geo, ❌ WebPage/speakable |
| `src/components/pages/ComparisonPage.tsx` | 33 | FAQPage | WebPage + BreadcrumbList | ❌ WebPage, ❌ BreadcrumbList |
| `src/components/pages/MiscCatchAllPage.tsx` | 32 | **none** | WebPage + BreadcrumbList | ❌ everything |
| `src/components/pages/RegionalPage.tsx` | 36 | **none** | WebPage + BreadcrumbList + FAQPage | ❌ everything |
| `src/components/pages/CountyPage.tsx` | ~8 | BreadcrumbList | LocalBusiness+geo + FAQPage + WebPage | ❌ LocalBusiness, ❌ FAQPage, ❌ WebPage |
| `src/components/pages/SellYourHomeCityPage.tsx` | 93 | BreadcrumbList | Service + WebPage | ❌ Service, ❌ WebPage |
| `src/components/pages/LoanGuidePage.tsx` | ~8 | BreadcrumbList, FAQPage | Service + WebPage | ❌ Service, ❌ WebPage |
| `src/components/pages/RealtorPage.tsx` | 93 | BreadcrumbList, FAQPage, RealEstateAgent, City | LocalBusiness + FAQPage + WebPage | ⚠️ good; ❌ WebPage/speakable |
| `src/components/pages/RemaxOfficePage.tsx` | ~3 | BreadcrumbList, FAQPage, Person, Place+geo, RealEstateAgent | — | ✅ strongest template on the site |
| `src/app/about/page.tsx` | 1 | LocalBusiness, Person+hasCredential, BreadcrumbList | Organization + Person+hasCredential | ✅ |
| `src/app/builders/[slug]/page.tsx` | 10 | BreadcrumbList | WebPage | ❌ WebPage |
| Service pages (`buyers`, `sellers`, `investing`, `luxury`, `commercial`, `sell-your-home`, `free-home-valuation`, `home-valuation`, `new-construction`) | 9 | BreadcrumbList + FAQPage (most) | Service + WebPage | ❌ Service on 7 of 9 (only `property-management:47` and `relocation:131` emit it), ❌ WebPage |
| Beach-condo pillar cluster | 8 | Article, FAQPage, WebPage+speakable, BreadcrumbList, QuickAnswer, SourcesSection | — | ✅ reference implementation |

**Templates rendering >50 pages with missing required schema: 6** — blog (1,760),
city spokes (1,051), city hubs (67), market updates (232), neighborhoods (742 defined),
`SellYourHomeCityPage` (93), `RealtorPage` (93).

---

## 3. Schema validity defects

| Defect | Location | Pages | Detail |
|---|---|---|---|
| `author.image` 404 | `layout.tsx:119`, `blog/[slug]:128`, `market-updates/[slug]:118`, `schema.tsx:265`, `valrico-listing-agent:238,275`, `brandon-listing-agent:238,275` | ~3,300 | `barrett-henry-headshot.jpg` does not exist in `public/images/` |
| FAQ JSON-LD deleted at render | `src/lib/utils.ts:126-172` | 1,948 | Present in source JSON, stripped before HTML output |
| Visible Q&A with no FAQPage | blog / market-updates / misc / guides | 305 | Even pre-truncation |
| `speakable` selector matches nothing | `blog/[slug]:153`, `market-updates/[slug]:137`, `guides/[slug]:121` | 891 | `.quick-answer` class absent; `QuickAnswer` component unused in all three |
| `dateModified` === `datePublished` | `blog/[slug]/page.tsx:116-117` | 1,760 | `dateModified: post.date` — no freshness signal despite ongoing edits |
| Conflicting `sameAs` sets | `blog/[slug]:131-132` vs `schema.tsx:73-74` vs `guides/[slug]:110` | 1,760+ | Two Instagram handles, two Facebook pages |
| Author missing `hasCredential` | `guides/[slug]/page.tsx:103-113` | 49 | Blog template has it; guides don't |
| `publisher` type inconsistent | `guides/[slug]:115` uses `Organization`; `blog/[slug]:141` and `schema.tsx:279` use `RealEstateAgent` | 1,809 | Same publisher, two `@type`s |
| `webPageSchema` hardcodes unrelated `about` | `src/lib/schema.tsx:337-340` | 8 | `about: { name: "Florida condominium purchases" }` is baked in — wrong for any non-condo page reusing the helper |
| Dead schema helpers | `src/lib/schema.tsx:20` (`realEstateAgentSchema`), `:81` (`localBusinessSchema`) | 0 | Never imported; the file's comment (lines 14-19) confirms it. The most complete `sameAs` array on the site ships to nobody |
| `ComparisonPage` has FAQPage but no BreadcrumbList | `src/components/pages/ComparisonPage.tsx` | 33 | — |
| No LocalBusiness anywhere except `/about` and `/preferred-vendors` | — | 1,118 city pages | Required on every area page |

**Clean / no defect found:** city `lat`/`lng` — all 93 city objects have real distinct
coordinates (92 unique latitudes), no placeholders. Dates — 0 future-dated records; posts
span 2022-01-02 → 2026-10-16, market updates all 2026; no backdating before the domain existed.

---

## 4. AI-extractability scorecard

| Signal | Coverage | Verdict |
|---|---|---|
| `QuickAnswer` component | 10 files / ~10 pages of ~3,300 (**0.3%**) | Zero template adoption |
| `SourcesSection` component | 11 files / ~11 pages (**0.3%**) | 0 of 49 pillar guides cite sources |
| `speakable` declared | 2,041 pages (3 templates) | Declared but selector broken on 891 |
| `speakable` actually resolvable | ~1,150 pages | — |
| FAQPage served (post-truncation) | 885 of 2,833 authored (**31%**) | 1,948 destroyed at render |
| Comparison tables in content | posts 1,234/1,760 · misc 447/1,203 · guides 31/49 · market updates 205/232 | Good authoring; much of it sits in the truncated tail |
| Direct-answer openings | Strong | See below |

**Page-opening sample (first 2 sentences, 10 templates):**

1. Blog `how-to-check-permit-history-hillsborough-county` — "Quick Answer How do I check building permits on a Hillsborough County home? Use HillsGovHub at hcfl.gov for permits issued after January 2021." → **direct answer ✅**
2. Blog `how-to-find-cdd-fees-florida-home` — "Quick Answer How do I find CDD fees on a Florida property? Go to hillstax.org..." → **✅**
3. Blog `southern-fresh-safety-harbor-best-fried-chicken-tampa-bay` — "I sell real estate all over Tampa Bay, but I go out of my way to list and show homes in Safety Harbor." → **narrative, no answer ❌**
4. City spoke `anna-maria-55-plus-homes` — "QUICK ANSWER Are there 55+ communities in Anna Maria? Yes - Anna Maria has active adult 55+ communities..." → **✅**
5. City hub `anna-maria` — "Anna Maria is the northernmost city on Anna Maria Island, sitting at the northern tip..." → **definitional, acceptable ✅**
6. Market update `dunedin-housing-market-update` — "Quick Answer The Dunedin housing market in Q3 2026 shows a median sale price of approximately $442,000, up 2.8%..." → **✅ excellent, and the FAQ beneath it is deleted at render**
7. Guide `first-time-home-buyer-guide` — "Schedule a Buyer Strategy Call Calculate Your Payment First-Time Homebuyer Guide... can feel overwhelming." → **CTA chrome ahead of the answer ⚠️**
8. Guide `home-appraisal-guide` — "Home Appraisal Guide Florida 2026 What Buyers & Sellers Need to Know — Understand the appraisal process..." → **no direct answer ❌**
9. Service `src/app/buyers/page.tsx:204` — "I've helped hundreds of buyers find the right home at the right price. Here's how we do it." → **marketing fluff ❌**
10. Service `src/app/investing/page.tsx:48` — "Build wealth through rental properties, fix-and-flip, and long-term appreciation in one of Florida's hottest markets." → **marketing fluff ❌**

**Verdict:** the generated content (blog, city spokes, market updates) already opens with
quotable direct answers — the authoring is genuinely good. The failures are the hand-built
service pages and guides, which open with slogans, and the fact that none of the good
openings are wrapped in `QuickAnswer`, so `speakable` can't point at them.

---

## 5. Entity consistency violations

Counts are unique files/documents after filtering false positives (building ages, roof/HVAC
lifespans, and the two prompt files that *instruct* the correct usage).

| Violation | Count | Examples (file + sentence) |
|---|---|---|
| **Experience claim tied to a location** (FALSE) | **32 docs** | `posts-export.json [town-n-country-fl-real-estate-guide]` — "Barrett Henry is a Broker Associate at REMAX Collective with 23+ years of real estate experience **in Tampa Bay**."<br>`posts-export.json [wimauma-fl-schools-guide]` — "…has 23+ years of real estate experience **in Hillsborough County**."<br>`posts-export.json [selling-home-largo-fl]` — "With over **23 years of local knowledge** and an honest, data-driven approach…" (also in `history-of-largo-fl`, `things-to-do-largo-fl`)<br>`posts-export.json [davenport-fl-new-construction]` — "…with **23+ years of Florida real estate experience**." (also `davenport-fl-investment-property`, `davenport-fl-waterfront-homes`, `floral-city-fl-schools-guide`)<br>`posts-export.json [best-neighborhoods-tampa]` — "**After 23 years selling homes across Tampa Bay**, I have watched neighborhoods transform…" (also `refinance-mortgage-florida-2026`, `carrollwood-fl-real-estate-guide`, `tampa-bay-waterfront-estates-guide`, `carrollwood-village-vs-carrollwood`)<br>`posts-export.json [first-time-homebuyer-checklist-tampa-bay]` — "…from a **23+ year local REALTOR**." |
| **"24 years of real estate experience"** (FALSE until Sept 2027) | **2 pages** | `pages-content.json [valrico-realtor]` — "…serving buyers and sellers across the Tampa Bay area with **more than 24 years** of real estate experience." and "With **over 24 years** of real estate experience and deep knowledge of eastern Hillsborough County…"<br>`pages-content.json [valrico-homes-for-sale]` — "With **over 24 years** of real estate experience, Barrett knows every pocket of this market…" |
| **"co-run" / "co-ownership" of Best Bay Services** | **4 docs** | `posts-export.json [best-realtor-brandon]` — "Barrett **co-runs** Best Bay Services, a handyman and home services company."<br>`pages-content.json [brandon-realtor]` — "Barrett **co-runs** Best Bay Services… serving the Tampa Bay area."<br>`pages-content.json [largo-realtor]` — "Barrett **co-runs** Best Bay Services, a licensed handyman and home services company."<br>`pages-content.json [plant-city-realtor]` — "Barrett **co-runs** Best Bay Services…" + "…**co-ownership** of Best Bay Services (in-house repair and maintenance coordination)…" |
| **"RE/MAX" with slash** | **1 doc** (3 sentences) | `posts-export.json [redington-beach-fl-investment-property]` — "ViVi Property Management operates under **RE/MAX** Collective and handles tenant placement…" (repeats twice more, once inside embedded FAQ JSON-LD). Note: `src/app/api/cron/generate-post/route.ts:129` and `src/app/api/chat/route.ts` contain the string only as a correct negative instruction — not violations. |
| **Mobile / manufactured homes mentioned** | **35 docs** | `posts-export.json [living-in-seffner-fl]` — "**Mobile and manufactured homes**: Seffner has a higher concentration of mobile and manufactured homes than Brandon or Valrico." + "…others are in **mobile home parks** with lot rent."<br>`posts-export.json [gibsonton-fl-new-construction]` — "The US-41 corridor… contains older neighborhoods, **manufactured home parks**, commercial strips…"<br>`posts-export.json [buying-home-sun-city-center-guide]` — "There are also **manufactured homes** within certain sections of the community…"<br>`src/data/batch5-faqs.ts:293` — "Zephyrhills has a strong 55+ community presence, with several active adult neighborhoods and **mobile home parks** catering to retirees."<br>`src/data/loan-content.ts:442` — "Eligible property types include… and some **manufactured homes** built after June 1976 on a permanent foundation" |
| **"master suite" / "master bedroom"** | **0 real** | Only 2 hits, both correct negative instructions: `src/app/api/chat/route.ts:67` and `src/app/api/cron/generate-post/route.ts:128`. ✅ clean |
| **"AC in attic"** | **0** | Strict pattern (`a/c\|air handler\|hvac … in the attic`) returns zero. The 15 loose hits were all generic inspection-checklist mentions of attics. ✅ clean |
| **CRE designation claim** | **0** | No `hasCredential` anywhere lists CRE. All three credential blocks (`layout.tsx:125-147`, `about/page.tsx:80-82`, `blog/[slug]:135-137`, `schema.tsx:272-276`) list exactly e-PRO, MRP, SRS. The only "CRE" string is `hencre.com` described as a commercial-real-estate site in `llms.txt` — not a designation. ✅ clean |
| **"TB" abbreviation in titles/schema** | **0** | ✅ clean |
| **Future-dated / pre-domain content** | **0** | ✅ clean |

**Note on "24th year":** 9 hits across `src/app/about/page.tsx:128`,
`src/app/valrico-listing-agent/page.tsx:90,100,144,336`, and
`src/app/brandon-listing-agent/page.tsx:90,100,144,336` all read "Entering his **24th year**
in real estate" / "puts him in his 24th year." This is the **correct** preferred phrasing
(23 completed years, currently in the 24th) — **not** a violation. Only "24+ years" and
"over/more than 24 years" are false, and those appear solely in the 2 `pages-content.json`
pages above.

**Note on the regex trap:** `src/data/neighborhood-descriptions.ts` lines 3603, 5756, 6028,
7329, 7533 contain "2001-2002 homes are **24+ years old**" — these are statutory building
ages, **not** experience claims. Any bulk find/replace on "24+ years" must exclude this
file, which is the exact failure mode recorded in prior cleanup.

---

## 6. llms.txt verdict

**Which file serves:** `public/llms.txt` (4,865 bytes). There is **no**
`src/app/llms.txt/route.ts` — `find src/app -path "*llms*"` returns nothing, so the known
route-shadowing gotcha does **not** apply here. The static file is served. ✅

**Requirement coverage:**

| Requirement | Status |
|---|---|
| Purpose | ✅ clear, names Barrett + REMAX Collective + The NOW Team |
| Authority | ✅ strong — license **#BK3313308**, REMAX Hall of Fame (2024), 10-Year Award, 7 counties |
| Credentials | ✅ e-PRO, MRP, SRS — exactly right, no CRE |
| Experience claim | ✅ "23+ years of real estate experience" — correct, and correctly **not** tied to a location |
| Content areas | ✅ 14 areas listed |
| Contact | ✅ phone, email, site, brokerage address |
| Key URLs | ✅ 24 key pages + 7 beach-condo guides |
| Related sites | ✅ 11 cross-properties |
| Social profiles | ⚠️ present but conflicts with `schema.tsx` (gap #9) |

**Defects to fix:**

1. **Stale counts understate the site by ~60%.** "City and neighborhood guides (**69+ cities, 460+ neighborhoods**)" and "/communities — Browse all **69+ cities** by county" vs the actual 93 cities and 742 neighborhoods in `src/data/cities.ts` / `src/data/neighborhoods.ts`. Also omits the 1,760-post blog scale and 232 market updates. Understating authority to the exact audience that reads this file.
2. **Social handles contradict `src/lib/schema.tsx:73-74`** — `llms.txt` says `instagram.com/nowtampa/` + `facebook.com/NOWTampaBay`; `schema.tsx` says `instagram.com/thenowteam` + `facebook.com/BarrettHenryREALTOR`. Pick one set.
3. **Related-sites list diverges from `sameAs`** — `llms.txt` omits `valricopropertymgmt.com`, `valricoagent.com`, `valoantb.com`, `tampabaydownpayment.com`, and the FastExpert profile; `schema.tsx` omits `vyrabyte.com`, `valrico.blog`, `buildtb.com`, `flpermithelp.com`, `fastselleasy.com`, `firsttimehomebuyertb.com`.
4. **No last-updated date.** The beach-condo section says "updated October 2026" but the file has no top-level freshness stamp.
5. Minor: "Best Bay Services (handyman/maintenance)" is correctly neutral — no co-run claim. ✅ Keep it that way.

**Overall:** the best AEO asset in the repo. Content and framing are right; it just needs
the counts refreshed and the identity URLs reconciled with `schema.tsx`.

---

## Recommended fix order (highest leverage first)

1. **`src/lib/utils.ts:153-154`** — delete the `Real Estate|Explore` and
   `Frequently Asked Questions` late-cut patterns; replace `substring(0, idx)` truncation
   with targeted wrapper-div removal. Recovers 1,948 FAQPage blocks and ~1.05M words. One file.
2. **Global find/replace** `barrett-henry-headshot.jpg` → `barrett-headshot.png` (8 sites).
   Fixes the author entity on ~3,300 pages. One command.
3. **Emit `faqSchema()` from the blog, market-update, and guide templates** off a parsed
   `faqs` field; render with `FaqSection`. Makes 2,041 pages' FAQ schema edit-proof.
4. **Wrap existing opening answers in `QuickAnswer`** in those same three templates so the
   `.quick-answer` speakable selector resolves on 891 pages.
5. **Add `BreadcrumbList` + `WebPage`** to `MiscCatchAllPage`, `RegionalPage`,
   `ComparisonPage` (101 pages, currently 68 with zero schema).
6. **Add `LocalBusiness` + geo + `WebPage`/speakable** to the city hub/spoke branches
   (1,118 pages) — wire up the already-written `localBusinessSchema()`.
7. **One exported `SAME_AS` constant** in `src/lib/schema.tsx`, imported everywhere,
   matching `llms.txt`.
8. **Content fixes:** 32 docs with location-tied experience claims, 2 pages saying
   "24 years", 4 docs saying "co-run", 1 post with "RE/MAX", 35 docs mentioning
   mobile/manufactured homes. Exclude `src/data/neighborhood-descriptions.ts` from any
   "24+ years" replace.
9. **Refresh `public/llms.txt`** counts to 93 cities / 742 neighborhoods / 1,760 posts.
10. **Rewrite service-page and guide openings** to lead with a direct answer instead of a slogan.
