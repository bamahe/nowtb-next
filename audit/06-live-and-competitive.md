# 06 — Live Site + Competitive Intelligence Audit

**Auditor scope:** what the public internet actually sees at nowtb.com, and who outranks it.
**Date observed:** 2026-10-17 / 2026-10-18 UTC
**Method:** direct HTTP fetches (`curl`, real browser UA) + HTML/JSON-LD parsing for the live-site
sections; `WebSearch` for the ranking sections; repo read-only cross-reference.

### How to read confidence levels in this report
- **[OBSERVED]** — I fetched it and parsed it myself. Reproducible.
- **[SOURCE]** — a third party asserts it (search result snippet, competitor page copy).
- **[INFERENCE]** — my conclusion drawn from the above. Not a measurement.

### Stated limitations — do not over-read these sections
- **I did not query ChatGPT, Perplexity, Claude, or Google AI Overviews directly.** Part 5 uses
  conversational-phrasing web searches as a *proxy* for which sources AI engines would retrieve.
  Treat it as directional, not as measured AI citation share.
- **Rank positions are ordinal positions in a `WebSearch` result list**, not logged-in Google SERP
  positions, and carry no personalization/geo-targeting. Treat them as "appears / does not appear,
  roughly where" — not as tracked rank.
- **Word counts** are visible-text approximations after stripping script/style/comments. City-page
  counts are inflated by MLS listing-card text.
- `atchleyrealty.com` blocked both `curl` and WebFetch with HTTP 403 — **not torn down, unverified.**

---

## 1. Live site defects

### 1a. Core URL table

All core URLs return **HTTP 200**. nowtb.com canonicalizes to a **trailing slash** (`/valrico` →
308 → `/valrico/`), which is consistent and correct. [OBSERVED]

| URL | Status | `<title>` (len) | H1 | Form? | Phone? | Words | Verdict |
|---|---|---|---|---|---|---|---|
| `/` | 200 | Tampa Bay Homes for Sale \| Barrett Henry, REALTOR® (50) | Tampa Bay Homes for Sale | 2 forms / 5 inputs | yes | ~1,096 | OK |
| `/robots.txt` | 200 | — | — | — | — | — | **Good** — AI crawlers allowed, spam bots blocked |
| `/sitemap.xml` | 200 | — | — | — | — | 6,591 URLs | **Defect** — see 1b |
| `/llms.txt` | 200 | — | — | — | — | — | Good, one factual conflict (1f) |
| `/valrico/` | 200 | Valrico Real Estate & Homes for Sale \| Barrett Henry, REALTOR® (62) | Homes for Sale in Valrico | **0 forms** / 2 inputs | yes | ~7,628 | **Defect** — no lead form |
| `/brandon/` | 200 | Brandon Real Estate & Homes for Sale \| … (62) | Homes for Sale in Brandon | **0 forms** / 2 inputs | yes | ~7,011 | **Defect** — no lead form |
| `/riverview/` | 200 | Riverview Real Estate & Homes for Sale \| … (64) | Homes for Sale in Riverview | **0 forms** / 2 inputs | yes | ~7,491 | **Defect** — no lead form |
| `/tampa/` | 200 | Tampa Real Estate & Homes for Sale \| … (60) | Homes for Sale in Tampa | **0 forms** / 2 inputs | yes | ~7,828 | **Defect** — no lead form |
| `/free-home-valuation/` | 200 | Free Home Valuation Tampa Bay \| Barrett Henry, REALTOR \| Barrett Henry, REALTOR® (80) | Free Home Valuation | 1 form / 10 inputs | yes | ~1,412 | **Defect** — doubled brand suffix; no og:image |
| `/sell-your-home/` | 200 | What Is Your Tampa Bay Home Worth? \| Free Home Valuation \| … (82) | What Is Your Tampa Bay Home Worth? | 1 form / 10 inputs | yes | ~1,162 | OK; no og:image |
| `/contact/` | 200 | Contact Barrett Henry \| Tampa Bay REALTOR® \| (813) 733-7907 \| … (85) | Let's Talk | 1 form / 4 inputs | yes | ~829 | OK; no og:image |
| `/blog/` | 200 | Tampa Bay Real Estate Blog \| Barrett Henry, REALTOR® \| Barrett Henry, REALTOR® (78) | Tampa Bay Real Estate Blog | 0 | yes | ~1,450 | **Defect** — doubled suffix; no og:image |
| `/properties/` | 200 | Tampa Bay Homes for Sale \| Search Properties \| MLS Listings \| … (85) | **"Properties"** | 1 form / 1 input | yes | ~930 | **Defect** — H1 has zero keyword value |
| `/mortgage-calculator/` | 200 | Mortgage Calculator \| Estimate Your Monthly Payment \| … (77) | Mortgage Calculator | 0 forms / 3 inputs | yes | ~755 | **Defect** — meta desc 211 chars |

### 1b. BROKEN THINGS FIRST

**[B-1] `/home-valuation/` serves HTTP 307 with NO `Location` header.** 🔴 *Highest severity.*
[OBSERVED]
```
HTTP/2 307
x-matched-path: /home-valuation
(no location: header)
body: <!DOCTYPE html><html id="__next_error__">…
```
Cause, confirmed in repo at `/Users/barretthenry/Projects/nowtb-leadmachine/src/app/home-valuation/page.tsx`:
```tsx
import { redirect } from "next/navigation";
export default function HomeValuationRedirect() {
  redirect("/free-home-valuation");
}
```
A runtime `redirect()` inside a server component emits the destination through the RSC payload. On a
plain document request — i.e. **every crawler** — there is no `Location` header, and the HTML served
is Next's `__next_error__` shell. Browsers recover via the client router; **Googlebot, GPTBot, and
ClaudeBot get a dead 307.** Aggravating factor: `/home-valuation/` **is listed in sitemap.xml**, so
the site actively submits this URL for crawling. Fix = move it to a `redirects()` entry in
`next.config.mjs` (real 308) and drop it from the sitemap.

**[B-2] Open-house pages redirect OFF the brand domain to a raw Vercel subdomain.** [OBSERVED]
- `/3813-polumbo-dr/` → 307 → `https://nowtb-open-house.vercel.app/`
- `/11417-cypress-park-st/` → 307 → `https://nowtb-open-house.vercel.app/`
- `/30935-whitlock-dr/` → **200 on nowtb.com** (not redirected)

The destination does render the correct current listing — `<title>Open House | 30935 Whitlock Drive,
Wesley Chapel`, H1 `30935 Whitlock Drive`, a working 5-field check-in form, phone present — so the
printed-QR repoint is *functionally* fine. [OBSERVED] Two real problems:
1. `https://nowtb-open-house.vercel.app/robots.txt` → **404 / NOT_FOUND**, so the subdomain is fully
   crawlable, has **no canonical tag and zero JSON-LD**, and duplicates the content of
   `nowtb.com/30935-whitlock-dr/`. That is an indexable off-brand duplicate. [OBSERVED]
2. The redirect drops the path and lands on the subdomain **apex**, so all three printed QR addresses
   collapse to one page. [OBSERVED]

Per project memory the dashboard route is deliberate and the printed QRs must never be reprinted —
so **do not change the redirect target.** Fix the destination instead: add `robots.txt`, a canonical
pointing at `nowtb.com`, and schema. Note `/3813-polumbo-dr/sign-in/` → `/30935-whitlock-dr/sign-in/`
*does* correctly repoint on-domain, so the sub-routes and the bare path behave inconsistently.

**[B-3] 404 pages self-canonicalize to the homepage.** [OBSERVED] A deliberate bad URL
(`/blog/is-brooksville-fl-a-good-place-to-live/`) returns a correct **404 status**, but the HTML
declares:
```
<title>Barrett Henry, REALTOR® | Tampa Bay Homes for Sale</title>
<link rel="canonical" href="https://nowtb.com/" />
```
with 0 H1s, 0 words, 0 JSON-LD. The status code is right, so this is not an emergency, but every
error page telling Google "I am the homepage" is a soft-404 signal worth removing.

**[B-4] A live page argues the opposite of current market reality.** [OBSERVED + SOURCE]
`/blog/tampa-bay-builder-incentives-are-disappearing-act-now/` → 200, titled *"Tampa Bay Builder
Incentives Are Shrinking — Here Is Why"*, **dated 2024-11-22**. Current conditions are the inverse:
NAHB's August 2026 builder survey reports 63% of builders using sales incentives and 35% cutting
prices by an average of 6%; live Tampa Bay offers include Del Webb up to $70,000 and Highland Homes
up to $60,000. [SOURCE] A two-year-old page asserting the opposite of today's market is an active
credibility liability on a high-intent topic.

### 1c. No live-only 404s found — the nested-route trap is currently clean

This was the highest-priority thing to hunt. Result: **no live-only 404s detected.** [OBSERVED]
- 180 URLs sampled from sitemap.xml across blog / guides / market-updates / flat paths → **180/180 = 200**.
- All 96 internal links on `/blog/` → **96/96 = 200**.
- All 60 top-level repo routes with a `page.tsx` live-tested → all resolve.
- All 9 static nested repo routes live-tested → all resolve, including
  `/sell/why-didnt-my-house-sell/` and `/brandon/southoak/`, the two shapes the documented trap
  historically broke.

One **false alarm worth recording so nobody re-chases it**: `/sell/` returns 404 with
`x-matched-path: /[citySlug]`, which looks exactly like the trap. It is not —
`src/app/sell/` contains no `page.tsx`, only the `why-didnt-my-house-sell/` child. The 404 is
correct. The `next.config.mjs` lookahead already excludes `sell`, `market-updates`, `builders`,
`communities`, and the three open-house address slugs, which is why the nested routes survive.
`/auburndale/gapway-lakes-estates/` correctly 308s to the flattened `/gapway-lakes-estates/`.

### 1d. Sitemap health [OBSERVED]

| Metric | Value | Verdict |
|---|---|---|
| Format | single flat file, **not** a sitemapindex | 6,591 URLs in one file — works, but near the point where splitting helps |
| Total `<loc>` | 6,591 | — |
| Duplicate URLs | **7** | Minor defect, trivial fix |
| `<lastmod>` present | 6,591 / 6,591 | Good |
| Distinct lastmod dates | 416 | — |
| **`lastmod` = 2026-10-17 (today)** | **4,599 (70%)** | **Defect — see below** |
| `lastmod` = 2026-03-28 | 526 (8%) | Frozen cluster |

**70% of the sitemap is stamped with today's date.** [OBSERVED] 4,599 pages did not change today.
[INFERENCE] `lastmod` is being derived from build time rather than content modification time. Google
discounts `lastmod` once it proves unreliable, so the 10 genuinely-fresh pages/day lose their
freshness signal to the noise. The 526 URLs frozen at 2026-03-28 are the opposite problem — content
untouched for ~7 months.

Bucket composition: `blog` 1,761 · `market-updates` 233 · `guides` 50 · `builders` 9 · remainder flat
city/neighborhood/spoke pages.

### 1e. Systematic template defects (quantified on a random 48-URL sample) [OBSERVED]

| Defect | Hit rate | Detail |
|---|---|---|
| **Doubled brand suffix in `<title>`** | **12 / 48** | **100% of sampled `/guides/` pages.** Pattern: `Title \| Barrett Henry, REALTOR® \| Barrett Henry, REALTOR®`. Also on `/blog/`, `/free-home-valuation/`, `/55-plus-communities/`, `/waterfront/`. The page sets a title that already contains the suffix, then the layout `template` appends it again. |
| **Missing `og:image`** | **24 / 48** | **Every `/blog/` and every `/guides/` page sampled.** Confirmed by direct meta inspection: these pages emit `og:title`, `og:description`, `og:url`, and `twitter:card=summary_large_image` — but **no `og:image` and no `twitter:image`**. A `summary_large_image` card with no image renders as a blank box. Scope ≈ 1,761 blog posts + 50 guides. |
| `<title>` > 60 chars | 41 / 48 | Worst: 96 chars (`/market-updates/clearwater-housing-market-update/`), 94, 91, 91, 85. |
| Meta description > 155 chars | 9 / 48 | Worst: 226 (`/market-updates/plant-city-fl-real-estate-market/`), 211 (`/mortgage-calculator/`), 186. |
| Meta description < 120 chars | 15 / 48 | Concentrated in `/guides/` (88–111 chars) — leaving snippet space unused. |
| Missing `BreadcrumbList` | 0 / 48 | **Good.** Only exception found anywhere: `/fsbo-vs-realtor/`. |
| Missing H1 / multiple H1 | 0 / 48 | **Good.** |

Also observed: blog-post meta descriptions truncate mid-sentence without an ellipsis — e.g. the
Florida closing-costs post ends `"…every fee, who pays"`. And `og:type=article` is set on `/guides/`
pages but absent on `/blog/` posts.

### 1f. Smaller findings

- **County count contradicts itself across the live site.** [OBSERVED] `/llms.txt` says *"23+ years"*
  (correct per the standing guardrail) and names **7 counties**; `/contact/` has an H2 reading
  *"Serving Tampa Bay's 8 Counties"*; `/llms.txt` body elsewhere says *"Tampa Bay's 8 counties"*
  in the description meta. Project memory records **5 counties**. Three different numbers are live.
  Pick one and propagate — entity consistency is an AEO ranking input.
- **Experience claim is correct everywhere I sampled** — "23+ years of real estate experience", never
  attached to Tampa Bay or Florida. No violations found. ✅
- **Three different OG image values in use:** `og-default.png`, `og-image.png`, and absent. Both
  images return 200.
- **City pages carry no lead form at all** (0 `<form>`; the 2 inputs are the MLS search box) — on the
  four highest-traffic, highest-word-count pages on the site. See §4.
- `/properties/` H1 is literally `"Properties"`.
- No render-blocking problems or broken images observed; TTFB on sampled fetches was 0.16–0.31s with
  `x-vercel-cache: HIT`. `/blog/` was the outlier at 1.62s.

---

## 2. Ranking reality

Per-query ordinal position in `WebSearch` results. **nowtb.com appears for 5 of 14 money queries.**
Portals (Zillow/Redfin/Realtor/Trulia) and directories are noted but excluded from "beatable".

### Seller intent — the highest commercial value, and our weakest area

| Query | Top results (domain, in order) | nowtb.com | Beatable local competitors ahead of us |
|---|---|---|---|
| **sell my house fast Valrico FL** | speedysalebuyers · homerehabpartners · prudenthomebuyers · floridaluxrealestate · helloreeve · homeoptions · tampafasthomebuyer · byowner · 3stephomesale | **ABSENT** | floridaluxrealestate.com, helloreeve.com |
| **Valrico realtor** | homelight · homes.com · fastexpert · yelp · usnews · yelp · cartercompanyrealtors · **valricoagent.com** · **nowtb.com/valrico-realtor/** | **#9 (last)** | cartercompanyrealtors.com — **and valricoagent.com at #8, which is Barrett's own site (see §4a)** |
| **best realtor Brandon FL** | homelight · yelp · yelp · yelp · fastexpert · effectiveagents · usnews · expertise · bestrealestateagentnear.me | **ABSENT** | **None — this SERP is 100% directories.** No agent site ranks. |
| **what is my home worth Riverview FL** | zillow · zillow · redfin · forsalebyowner · homelight · redfin · homefinder · **movewithmomentum** · **movewithmomentum** | **ABSENT** | **movewithmomentum.com holds 2 of 9 slots** |
| **Tampa listing agent commission** | opendoor · houzeo · listwithclever · realestatewitch · fivewalls · flatfeegroup · **thelewkowiczgroup** · listingbidder · revivalhomebuyer | **ABSENT** | thelewkowiczgroup.com (an agent blog, #7) |
| **sell house without realtor Tampa** | webuyuglyhouses · **tampabaylivingexperience** · fairoffer · **stpetehomeguide** · tampafasthomebuyer ×3 · finesthomebuyers · tampafasthomebuyer | **ABSENT** despite owning `/fsbo-vs-realtor/` | tampabaylivingexperience.com, stpetehomeguide.com, **tampafasthomebuyer.com holds 4 of 9 slots** via city/county permutation |

**0 of 6 seller-intent queries place nowtb.com in a useful position.** Root cause is partly a flat
content gap — grepping sitemap.xml returns **zero** URLs containing `sell-my-house`, `cost-to-sell`,
`commission`, or `home-worth`. [OBSERVED] The site has 6,591 pages and not one targets the phrases
sellers actually type.

### Buyer intent

| Query | Top results | nowtb.com | Beatable local competitors ahead |
|---|---|---|---|
| **homes for sale Valrico FL** | zillow · redfin · coldwellbanker · zillow · compass · zillow · **palmparadiserealty** · movoto · **sarasotaone** | **ABSENT** | palmparadiserealty.com, sarasotaone.com |
| **Valrico FL neighborhoods** | neighborhoodscout · homes.com · city-data ×2 · zipdatamaps · **2collegebrothers** · **besttamparealestateagents** · **movewithmomentum** · **atchleyrealty** | **ABSENT** | **Four beatable agent/local sites ahead of us** |
| **best neighborhoods Brandon FL** | nextdoor · **2collegebrothers** · **frankalbertrealty** · **2collegebrothers** · **besttamparealestateagents** · **brandonandbeyond** · **tampafloridaliving** · premiumqmoving · **nowtb.com/blog/is-brandon-fl-safe/** | **#9** | 2collegebrothers (2 slots), frankalbertrealty, besttamparealestateagents, brandonandbeyond, tampafloridaliving |
| **moving to Tampa Bay guide** | movebuddha · pods · lemonade · moveadvisor · racinecountyeye · einsteinmoving · movingtofloridaguide · movingtotampa.net ×2 | **ABSENT** despite owning `/relocation/` | All movers/national — **no local agent ranks, so this is open** |
| **Riverview FL vs Valrico FL** | city-data · distance-cities ×2 · **valrico.blog** · nextburb · **valricoagent.com** · bestplaces ×2 · **nowtb.com/brandon-vs-riverview-vs-valrico/** | **#9** | **Both sites ahead of us are Barrett's own** (§4a) |

**`/valrico/` is a 7,628-word page that ranks for neither "homes for sale Valrico FL" nor "Valrico FL
neighborhoods."** [OBSERVED]

### Investor / niche

| Query | Top results | nowtb.com | Beatable local competitors ahead |
|---|---|---|---|
| **Tampa Bay investment property** | loopnet · redfin · mashvisor ×2 · ark7 · **sarasotaone** · **graystoneig** · **tampapropertymanagement** · **turnkeytampa** | **ABSENT** despite owning `/investing/` | sarasotaone, graystoneig, tampapropertymanagement, turnkeytampa |
| **55+ communities Tampa Bay** | 55places · newhomesource · retirenet ×2 · **2collegebrothers** · **stpetehomeguide** · **tbrelo** · **nova55living** · **nowtb.com/tampa-bay-55-plus-communities-guide/** | **#9** | 2collegebrothers, stpetehomeguide, tbrelo.com, nova55living.com |
| **Tampa Bay waterfront homes** | zillow · trulia · zillow · **palmparadiserealty** · **tampabuyersbroker** · **mikeandmichelleteam** · **sellingtampabay** · **smithandassociates** · **centralfloridaprimerealestate** | **ABSENT** despite owning `/waterfront/` | **Six agent IDX sites ahead of us**, all using a `{city}/{feature}-homes` URL pattern |

### Recurring beatable competitors, by frequency across all 14 queries

| Rank | Domain | Appearances | What they are |
|---|---|---|---|
| 1 | **movewithmomentum.com** | 3 (+5 more on market-data queries) | Agent site built entirely on data pages |
| 2 | **2collegebrothers.com** | 3 | **A moving company**, not a brokerage |
| 3 | **besttamparealestateagents.com** | 2 | Agent blog |
| 4 | **tampafasthomebuyer.com** | 4 slots on one query | Cash buyer, city/county permutation |
| 5 | **stpetehomeguide.com** | 2 | Agent Q&A site |
| 6 | **palmparadiserealty.com** | 2 | IDX landing pages |
| — | atlantictitlefirm.com | 3 slots on closing costs | Title company (see §3) |

---

## 3. Competitor teardowns

Five pages that outrank us, fetched and parsed directly. **`atchleyrealty.com` returned HTTP 403 to
both `curl` and WebFetch and is therefore NOT torn down** — it ranked #9 for "Valrico FL
neighborhoods" and remains unexamined.

### 3.1 movewithmomentum.com — `/home-value/riverview-fl/` 🥇 most instructive page in this audit
Beats us on **"what is my home worth Riverview FL"**, where we are absent. [OBSERVED]

- **Word count: 1,921** — *one quarter* of our 7,628-word `/valrico/` page, and it wins.
- **Title:** `Riverview, FL Home Values 2026: Median $362K, $186/sq ft, 41 Days to Contract`
  — three hard numbers in the title tag.
- **H1:** `Riverview Home Values (2026): What Houses Are Actually Selling For`
- **All H2s, verbatim:**
  1. Riverview home values year by year
  2. Where the Riverview market is tight, by price band
  3. Riverview home values by ZIP code
  4. Home values by community in Riverview
  5. Communities moving fastest in Riverview
  6. What moves the sale price in Riverview beyond the medians
  7. What is my house worth in Riverview?
  8. Selling in Riverview: next steps
  9. Frequently asked questions
  10. A valuation from the records, not an algorithm.
- **Local data:** **4 tables**, **57 dollar figures**, **49 percentages**. Segmented by year, by
  price band, by ZIP code, and by named community. Sale count cited (1,994 recorded sales / 12 mo).
- **Lead capture:** 1 form, 12 inputs + 1 select. CTA: **"Get my home value →"**
- **Schema:** `Article`, `FAQPage`, `BreadcrumbList`, `Place`, `AdministrativeArea`, `PostalAddress`,
  `Person`, **`SpeakableSpecification`**
- **What they do better, specifically:** every H2 is a *data cut*, not a topic. They answer "what is
  my home worth" by segmenting the same dataset six ways; we answer it with prose. Their closing
  line — *"A valuation from the records, not an algorithm"* — is the exact anti-Zillow positioning
  our own `/free-home-valuation/` page uses in body copy but never puts in a title or H2.

### 3.2 movewithmomentum.com — `/best-neighborhoods-valrico`
Beats us on **"Valrico FL neighborhoods"** (#8), where we are absent. [OBSERVED]

- **Word count: 1,273.** Our `/valrico/` page is 6× longer and does not rank.
- **Title:** `Best Neighborhoods in Valrico, FL (2026) | Momentum Realty`
- **H1:** `The Best Neighborhoods in Valrico, FL (2026)`
- **All H2s, verbatim:** Fastest-selling neighborhoods in Valrico · Most affordable neighborhoods in
  Valrico (price per sq ft) · Top neighborhoods in Valrico by Momentum Score · **How we ranked
  these** · Explore Valrico further · Common questions · Everything we publish about Valrico · Find
  the right Valrico neighborhood for you. · Common questions
- **Local data:** 22 dollar figures — named neighborhoods with median price *and* price/sq ft
  ($435,000 · $572,000 · $478,000 @ $196/sqft · $322,000 · $371,000 @ $182 · $259,000 @ $186 …).
- **Lead capture:** 1 form, 10 inputs + select. CTA: **"Match me with neighborhoods →"**
- **Schema:** `Article`, `FAQPage`, **`ItemList`**, `BreadcrumbList`, `Place`, `GeoCoordinates`,
  `AdministrativeArea`, `PostalAddress`, `Organization`, `State`, `Thing`
- **What they do better:** a **proprietary ranked metric ("Momentum Score")** plus a *"How we ranked
  these"* methodology section. That combination is why this gets cited — it is a citable primary
  source rather than a summary. `ItemList` schema makes the ranking machine-readable. We publish
  neighborhood *descriptions*; they publish neighborhood *rankings*.

### 3.3 atlantictitlefirm.com — `/hillsborough-county-closing-cost-calculator`
Holds **3 of 9 slots** for "closing costs for sellers in Hillsborough County" (#4, #6, #8 as
Hillsborough / Tampa / Florida calculator variants). We sit at #9. [OBSERVED]

- **Word count: 2,327**
- **Title:** `Hillsborough County Closing Cost Calculator 2026 (Tampa)`
- **H1:** `Hillsborough County Closing Cost Calculator`
- **All H2s, verbatim:** Hillsborough County Closing Cost Calculator · What Percentage Are Closing
  Costs in Hillsborough County? · Who Pays for Title Insurance in Hillsborough County? · Property
  Taxes Vary Widely Across Hillsborough · **What This Estimate Does Not Include** · Trusted for
  Florida Closings · How to Lower Your Closing Costs in Hillsborough County · What a Title Search
  Covers in Hillsborough County · How Long a Hillsborough County Closing Takes · Hillsborough
  Closing Cost FAQ · Open & Move Your File Online · Ready to close? Work with a Florida title company
- **Local data:** **a working interactive calculator** (9 inputs + select), 1 table, every taxing
  district's millage, doc-stamp math, worked examples ($450,000 → $7,937 / $7,813 / $7,317 / $7,301
  by district).
- **Lead capture:** 1 form, 9 inputs + select + textarea. CTAs: **"Get My Exact Hillsborough County
  Quote →"**, **"Request My Quote →"**
- **Schema:** `LocalBusiness`, **`Service`**, `FAQPage`, `BreadcrumbList`, `AdministrativeArea`, `State`
- **What they do better:** a **tool, not an article**, replicated per county and per city. Our
  closing-cost content is state-level only (`/guides/closing-costs-guide-florida/`,
  `/blog/closing-costs-florida-guide/`) — which is exactly why we rank #9 on a *county* query. They
  also beat us on trust with *"What This Estimate Does Not Include."*

### 3.4 2collegebrothers.com — `/blog/living-in-moving-to-valrico-fl/`
Ranks #6 for "Valrico FL neighborhoods". **This is a moving company outranking the local REALTOR on
his own home town.** [OBSERVED title/H2s via WebFetch]

- **Word count: ~2,200–2,400**
- **Title & H1 (identical):** `Valrico, FL ULTIMATE Guide (2025) | Living In & Moving To Valrico, FL`
- **All H2s, verbatim:** People of Valrico, FL – Population & Demographics · Top Things to Do in
  Valrico · Restaurants in Valrico · Valrico, FL Cost of Living · Comfortable Valrico Neighborhoods
  All Over Town · Great Schools in Valrico · Surrounded By Job Opportunities Near Valrico · Classic
  Florida Weather in Valrico · Tips for Moving to Valrico
- **Local data:** population 37,546 (vs ~6,500 in 2000) · median age 41 · ZIPs 33527/33594/33596 ·
  subdivisions Featherock, Valrico Grove, Castle Key, Heritage Crest, Duncan Groves · schools Lithia
  Springs Elem, Alafia Elem, Valrico Elem, Mulrennan Middle, Bloomingdale HS (~2,300 students) ·
  median household income $72,772 · named employers (Publix, BayCare, Driscoll's, Cyprexx,
  USHEALTH) · rents $1,274 2BR / $1,689 4BR · 82% homeownership · ~7,329 children 5–17 · weather and
  rainfall · named parks and restaurants
- **Lead capture:** form appears **twice**, 5 fields, incl. a **"Estimated Move Date"** date field.
  CTA: **"Request a Quote!"**
- **🔴 Their data is badly stale and we can beat them on accuracy alone:** they list Valrico average
  home price at **$259,700** with ~2.2% appreciation. Current figures from the same search round are
  a **$479,999 median list** and a **$451,007 median home price**. [SOURCE] They are off by ~$190K
  and still outranking us.
- **What they do better:** *topical completeness for the relocation decision* — jobs, weather,
  employers, restaurants, childcare demographics. They answer the whole "should I move here" question
  in one URL. Our `/valrico/` page is listings-first.

### 3.5 besttamparealestateagents.com — `/blog/best-neighborhoods-places-to-live-in-valrico-fl/`
Ranks #7 for "Valrico FL neighborhoods". [OBSERVED]

- **Word count: 1,931**
- **Title (155 chars, heavily keyword-stacked):** `3 BEST Neighborhoods in Valrico, FL (Best Places to
  Live in Valrico) Valrico Neighborhoods - Where to Live in Valrico FL - Is Valrico FL a Good Place
  to Live?`
- **H1:** `Best Neighborhoods to Live in Valrico, FL`
- **All H2s, verbatim:** Top 3 Best Places To Live in Valrico, FL · **TL;DR Summary Best Places to
  Live in Valrico, FL:** · List of the Best Neighborhoods in Valrico, FL · Living in Valrico, FL ·
  Review of Best Valrico Neighborhoods Realtors® · Contact Us · More Best Neighborhoods Blog Posts ·
  We're Here to Help · Have a Question or Want a Free Market Report? · We're Here to Help · Have a
  Question or Want a Free Market Report?
- **Local data:** **9 tables** — but only 4 dollar figures. They win on *structure*, not data depth.
- **Lead capture:** 1 form, **18 inputs**, 2 selects, 2 textareas; CTA blocks repeated twice. Buttons:
  "Submit", "Search Homes"
- **Schema:** `BlogPosting`, **`Product`**, **`Review`**, **`AggregateRating`**, `AggregateOffer`,
  `Organization`, `Person`, `WebSite`
- **What they do better:** (a) an explicit **`TL;DR Summary` H2** — a direct extraction target for AI
  answers; (b) **9 tables** in under 2,000 words; (c) `Product`/`Review`/`AggregateRating` schema to
  chase star ratings in the SERP. Their title is keyword-stuffed past any sane length and still wins,
  which suggests title *keyword coverage* is outweighing title *elegance* in this niche.

### 3.6 Bonus — eatonrealty.com, because of what it proves
Ranks **#2** for "closing costs for sellers in Hillsborough County" with a page titled
**"Seller Closing Costs in Florida: How Much Will You Pay? (2023 Numbers)"**. [OBSERVED]
1,716 words, 2 tables, 14 dollar figures, 11 percentages, `BlogPosting` + `RealEstateAgent` +
`Service` + `Place` schema, and **no lead form at all**.

[INFERENCE] A page that openly advertises **three-year-old data** in its own title outranks our
3,147-word 2026 guide. That is the clearest evidence in this audit that our problem on this topic is
**not content quality or freshness — it is geo-targeting and topical authority.** They own
"Hillsborough"; we wrote about "Florida".

---

## 4. The gap analysis — ranked by how directly each drives leads

### 4a. 🔴 #1 — We are losing to ourselves. Barrett's own satellite sites outrank nowtb.com.

The single most consequential finding in Part 2. [OBSERVED]

`valricoagent.com` is **Barrett's own property**, not a competitor: Next.js on Vercel
(`server: Vercel`, `x-vercel-cache: HIT`), "Barrett Henry REALTOR® · REMAX Collective" in the header,
the same phone **(813) 733-7907** (13 occurrences), 47 "Barrett" / 28 "REMAX" mentions, and 11 links
back to nowtb. Its meta description reads *"…from a local REALTOR® with 23+ years of real estate
experience"* and claims **38 neighborhoods**. It is **not in the five-site list** in the project
instructions (nowtb.com, bestbayservices.com, vivipm.com, vyrabyte.com, valrico.blog) — **flagging
for confirmation rather than assuming.**

Head-to-head on Valrico queries:

| Query | valrico.blog | valricoagent.com | **nowtb.com** |
|---|---|---|---|
| Valrico realtor | — | **#8** | #9 |
| Riverview FL vs Valrico FL | **#4** | **#6** | #9 |
| is Valrico FL a good place to live | **#5 and #7** | — | **ABSENT** |

On all three, a leaner Barrett site beats the flagship. The satellites are tightly-scoped
~1,300-word pages; `/valrico/` is a 7,628-word omnibus. [INFERENCE] nowtb.com's Valrico pages are
competing against Barrett's own better-targeted content and losing — and the satellites capture the
click but (per the §1f form audit) nowtb's city pages are where the brokerage CTAs live. Decide
deliberately which domain owns Valrico head terms, then cross-canonical or differentiate. This needs
a human decision before any content work.

### 4b. 🔴 #2 — The four highest-traffic city pages have no lead form

`/valrico/`, `/brandon/`, `/riverview/`, `/tampa/` each contain **0 `<form>` elements** — the only
inputs are the MLS search box. [OBSERVED] Combined, these are ~30,000 words of our best-ranked
content with no capture mechanism. Every competitor torn down above has a form: momentum 12 inputs,
atlantictitle 9, besttampa 18, 2collegebrothers 5 (twice on the page). **This is the cheapest
lead-volume fix available** and requires no new content.

### 4c. 🟠 #3 — Zero pages target the phrases sellers actually type

sitemap.xml contains **no URL** matching `sell-my-house`, `cost-to-sell`, `commission`, or
`home-worth`. [OBSERVED] We are absent from all 6 seller-intent queries. The competitors filling that
void are cash buyers and discount brokers — i.e. the lowest-margin, most adversarial players in the
market are defining the seller conversation unopposed.

### 4d. 🟠 #4 — We publish state-level content for county-level queries

Our closing-cost pages say "Florida"; the queries say "Hillsborough" and "Tampa". atlantictitlefirm
takes 3 slots with county/city variants and eatonrealty takes #2 with 2023 data. [OBSERVED] Same
pattern on `/waterfront/` (6 agent sites use `{city}/{feature}-homes` URLs; we use one generic
`/waterfront/`) and `/investing/`.

### 4e. 🟠 #5 — Tools beat articles, and we only have one tool

atlantictitlefirm wins closing costs with a **calculator**, replicated per county. movewithmomentum
wins home values with **ranked data tables**. We have `/mortgage-calculator/` and nothing else — no
closing-cost calculator, no net-proceeds calculator, no county property-tax estimator. [OBSERVED]

### 4f. 🟡 #6 — Data density and segmentation, not word count, is what wins

The scoreboard, measured: momentum home-value page **1,921 words / 4 tables / 57 $-figures / 49
percentages** ranks; our `/valrico/` page at **7,628 words / 0 ranked data cuts** does not. momentum
neighborhoods at **1,273 words** ranks; `/valrico/` at 6× the length does not. [OBSERVED]
[INFERENCE] More words will not fix these pages — *segmented, sourced, tabulated local numbers* will.
This is the same failure mode recorded in project memory for programmatic location pages.

### 4g. 🟡 #7 — Missing AEO structural furniture
What the winners have and we do not: a **`TL;DR Summary`** H2 (besttampa), a **"How we ranked these"**
methodology block (momentum), **`ItemList`** schema for rankings (momentum), **`Product`/`Review`/
`AggregateRating`** (besttampa), **`Service`** + **`LocalBusiness`** (atlantictitle), and a
**"What This Estimate Does Not Include"** limitations section (atlantictitle). We do already ship
`FAQPage`, `BreadcrumbList`, and `SpeakableSpecification` broadly — that part is solid. [OBSERVED]

### 4h. 🟡 #8 — Social and AI preview cards are blank on ~1,811 pages
Every `/blog/` and `/guides/` page declares `twitter:card=summary_large_image` with **no `og:image`
and no `twitter:image`**. [OBSERVED] Every share and every AI preview of our best long-form content
renders an empty box.

---

## 5. AI citation patterns

**⚠️ Methodology caveat, stated again because it matters:** I did **not** query ChatGPT, Perplexity,
Claude, or Google AI Overviews. What follows is which sources a *search* engine surfaces for
conversational phrasings — a reasonable proxy for retrieval, **not** measured AI citation share. Do
not report these as AI citations.

### 5a. Results per conversational query

| Query | Domains surfaced | nowtb.com |
|---|---|---|
| who is the best realtor in Valrico Florida | angi · homelight · yelp ×4 · fastexpert · usnews · realestateagents.com · iondocs | **ABSENT** — and note the keyword version ("Valrico realtor") *did* include us at #9. The conversational phrasing drops us entirely. |
| how much does it cost to sell a house in Tampa Bay | opendoor · markspain · opendoor · listwithclever ×2 · homelight ×2 · stpetehomeguide · revivalhomebuyer | **ABSENT** — despite two 3,000-word closing-cost pages |
| is Valrico FL a good place to live | niche ×2 · areavibes ×2 · thekkg · **valrico.blog #5 and #7** · covenantrealtyfl · localobserverdaily | **ABSENT** — but Barrett's valrico.blog takes 2 slots |
| Brandon FL vs Riverview FL which is better | city-data · lisakirkpatrick · nextburb · bestplaces ×2 · **nowtb #5** · **nowtb #7** · indexyard · **nowtb #9** | **🏆 3 of 9 slots** |
| what are closing costs for sellers in Hillsborough County | barneswalker ×2 · eatonrealty · **atlantictitlefirm ×3** · benlaubehomes · homefinancialgroup · **nowtb #9** | **#9** |

### 5b. 🏆 Proof that our comparison content gets cited

Our best result anywhere in this audit. For "Brandon FL vs Riverview FL which is better", nowtb.com
took **3 of 9 slots** (`/brandon-vs-riverview-vs-valrico/` #5, `/brandon-vs-riverview/` #7,
`/blog/is-brandon-fl-safe/` #9) — and the generated answer **quoted our specific statistics**:
*"From 2020-2024, Riverview saw 1,536 new units versus 417 in Brandon"* and *"In 2022, Brandon
recorded $5.03 billion in total retail sales, compared with $1.25 billion in Riverview."* [OBSERVED]

[INFERENCE] Those are unusual, sourced, verifiable numbers that exist on our page and essentially
nowhere else — so the answer engine had to come to us for them. This is the single clearest
instruction in the whole audit: **proprietary, specific, sourced statistics in a comparison frame get
cited.** It matches the pattern already recorded in project memory for buildtb's builder-comparison
content.

### 5c. What the citable sources have structurally in common

Across all five conversational queries, the surfaced pages share:
1. **Numbers in the title tag** — `Median $362K, $186/sq ft, 41 Days to Contract`;
   `Median $400K, +0.6% YoY`. Titles function as the answer, not as a label.
2. **Geographic specificity at the level asked** — "Hillsborough County", not "Florida". Every
   county-level query was won by county-level pages.
3. **Tables.** Tabular data is what gets extracted. The winners ran 1–9 tables each.
4. **A direct-answer H2 phrased as the user's question** — "What is my house worth in Riverview?",
   "What Percentage Are Closing Costs in Hillsborough County?"
5. **Stated methodology or limitations** — "How we ranked these", "What This Estimate Does Not
   Include". Transparency appears to function as a trust signal for retrieval.
6. **FAQPage schema** — near-universal among winners. We already have this broadly. ✅
7. **Comparison framing** (`X vs Y`) — our one proven winner.
8. **Directories dominate anything phrased "best [profession]"** — "who is the best realtor in
   Valrico" returned *zero* agent-owned pages. [INFERENCE] That query class is won through
   directory/review presence (Yelp, HomeLight, Angi, FastExpert, Niche), not through owned content.
   Do not spend content budget trying to rank a page for "best realtor".

---

## 6. 15 trending topic opportunities (October 2026)

"Do we have it?" = checked against `src/data/posts-export.json` (1,760 posts, grepped for slug and
mention) plus live fetches. [OBSERVED]

| # | Topic | Why it has lead intent | Do we have it already? |
|---|---|---|---|
| **1** | **🔴 Amendment 3: you must establish FL residency by Dec 31, 2026 or lose up to $200K of homestead exemption** | **Highest-urgency topic available.** Ballot is **Nov 3, 2026 — 17 days out**; exemption goes to $150K (2027) / $250K (2028); residency after Dec 31 2026 starts at $50K with a **5-year wait**. Every relocation buyer has a hard financial deadline to close. Realtor.com projects FL values +7–9% if it passes. [SOURCE] | **PARTIAL — content exists, cannot rank.** `/blog/florida-property-tax-amendment-2026/` (dated 2026-10-06) is live and accurate ($150K/$250K, Nov 3, Dec 31, 10%→5% all present). **It did not appear in either Amendment 3 search.** This is a promotion/internal-linking/geo-framing problem, not a writing problem. Add a Tampa-Bay-buyer-framed companion + homepage link. |
| **2** | **🔴 Condo milestone + SIRS hard deadline: Dec 31, 2026** | 30-year-old buildings must complete milestone inspection and initial SIRS by Dec 31 2026; **$500/day fines**, code referrals, possible evacuation orders. [SOURCE] Owners and buyers in every Pinellas/Hillsborough condo are searching this *now*. | **PARTIAL.** `/florida-condo-rules-buyers-2026/` is live, 2,557 words, covers HB 913 + SIRS + milestone + Citizens, with `Article`+`FAQPage`+`SpeakableSpecification`. **Zero blog slugs** contain `sirs` or `milestone`. No "deadline countdown" page and no seller-side angle. |
| **3** | **Florida insurance rates are FALLING — Citizens −8.8% statewide, 51 of 67 counties** | Counter-narrative that removes the #1 objection to buying in Florida. Sept 2026 OIR approvals: One Alliance −10.4%, Vyrd −10.4%, Safe Harbor −4.1%, Unique −3.2%; commissioner signalling more cuts into 2027. [SOURCE] | **NO dedicated page.** 11 insurance slugs exist but all are flood/city-level; `insurance rate` appears 99× as mentions only. Nothing on the 2026 downturn. **Open.** |
| **4** | **Hillsborough County closing-cost calculator (seller net proceeds)** | Directly monetizable; atlantictitlefirm owns 3 of 9 slots with exactly this. Seller customarily pays owner's title policy in Hillsborough — an unusual county quirk worth owning. [SOURCE] | **NO.** Only `/mortgage-calculator/`. Closing-cost content is state-level and ranks #9. **Highest-ROI build.** |
| **5** | **"Sell my house fast in {Valrico/Brandon/Riverview}" — the honest alternative to cash buyers** | We are absent from all 6 seller queries; cash buyers own the space. A REALTOR-authored "cash offer vs. listing, with real net numbers" page intercepts sellers before they discount. | **NO — zero slugs** matching `sell-my-house` or `cost-to-sell`. **Biggest flat content gap on the site.** |
| **6** | **What it costs to sell a house in Tampa Bay / Hillsborough (net-proceeds breakdown)** | Absent from "how much does it cost to sell a house in Tampa Bay" despite owning the data. Doc stamps $0.70/$100, 6–10% all-in, Hillsborough title custom. [SOURCE] | **PARTIAL/MISTARGETED.** Two strong pages exist (`/guides/closing-costs-guide-florida/` 3,147 w; `/blog/closing-costs-florida-what-buyers-sellers-actually-pay/` 3,000 w) but both target "Florida". Needs a Tampa Bay / Hillsborough cut. |
| **7** | **Builder incentives are AGGRESSIVE right now (Del Webb $70K, Highland $60K, M/I 2.875% buydown)** | High buyer intent, immediately actionable. NAHB Aug 2026: 63% of builders using incentives, 35% cutting prices ~6%. [SOURCE] | **🔴 WE HAVE THE OPPOSITE.** `/blog/tampa-bay-builder-incentives-are-disappearing-act-now/` is live, titled *"…Are Shrinking"*, **dated 2024-11-22**. Must be rewritten or retired — see [B-4]. Also note `buildtb.com/new-construction-incentives-tampa` ranks **#4** for this query while that project is frozen per memory. |
| **8** | **Non-homestead assessment cap dropping 10% → 5% (Amendment 3 investor angle)** | Directly changes rental/second-home carrying cost math. Distinct searcher (investor) from topic #1. | **NO.** `assessed value cap` appears 4× as mentions; no dedicated page. **Open.** |
| **9** | **FinCEN Residential Real Estate Reporting Rule (effective Mar 1, 2026) — LLC and trust purchases** | Affects every non-financed entity/trust purchase; high-value investor and luxury buyers who need guidance. [SOURCE] | **NO — zero occurrences of `FinCEN`** anywhere in 1,760 posts. Completely open, and we have a matching page (`/buying-beach-condo-llc-florida/`) to link from. |
| **10** | **Hillsborough market reality check: median $399,900 (+0.6% YoY), 4.0–4.4 months supply, 95.6% of ask** | The "is now a good time" query. Numbers-in-title is the proven format. movewithmomentum holds **5 of 9** slots on these with ZIP-level pages. [SOURCE] | **PARTIAL.** 233 `/market-updates/` pages exist but titles are generic ("Clearwater Housing Market Update", 96 chars) with **no numbers in the title tag** — the exact thing momentum beats us with. Rewrite titles before writing anything new. |
| **11** | **Florida Live Local Act 4th update (HB 1389, effective Jul 1 2026) — height/density limits** | Land, infill, and multifamily investors; also "what can be built next to me" for homeowners. [SOURCE] | **NO dedicated page** (`Live Local` 5 mentions, 0 slugs). Niche but low competition. |
| **12** | **Capital gains on a Florida home sale (no state tax, federal exclusion, 1031 for rentals)** | High-intent seller question tied to net proceeds; pairs with #6. | **NO — `capital-gains` returns 0 slugs**; only 8 mentions. Surprising gap for a seller-focused site. **Open.** |
| **13** | **Buyer-broker written agreement requirements in 2026** | Post-NAR-settlement confusion is still live; builds trust at first contact and intercepts "do I have to sign this?" | **NO — 0 slugs** (`buyer broker` 2 mentions). **Open.** |
| **14** | **Valrico / Brandon / Riverview neighborhood RANKINGS with price-per-sq-ft tables** | Directly attacks our worst loss: we are absent for "Valrico FL neighborhoods" while a **moving company** ranks #6 with home-price data that is **~$190K out of date** ($259,700 vs ~$451K actual). Accuracy alone wins this. | **NO ranked data pages.** Neighborhood content is descriptive, not ranked — no ItemList, no methodology, no price/sq-ft tables. Needs the momentum treatment (§3.2). |
| **15** | **Rental fraud felony law (SB 1293) + landlord fast-removal** | Landlord/investor intent; natural ViVi PM property-management funnel. [SOURCE] | **NO dedicated page.** Lowest priority of the fifteen, but it is a clean PM lead magnet. |

### Priority order if only a few get built
**1 → 2 → 4 → 5 → 7 (fix) → 14 → 6 → 10 (retitle).** Topics 1, 2, and 7 are **time-boxed**: #1 and #2
expire Dec 31 2026, and #7 is actively publishing wrong information every day it stays up.

---

## 7. Appendix — what I could NOT verify

- **`atchleyrealty.com/valrico/valrico-neighborhoods/`** — HTTP 403 to both `curl` and WebFetch. Ranked
  #9 for "Valrico FL neighborhoods". Not torn down.
- **`2collegebrothers.com`** — `curl` 403; title/H1/H2/data obtained via WebFetch, so its word count
  (~2,200–2,400) and schema types are **unverified by direct parse**.
- **No AI engine was queried directly.** See §5 caveat.
- **Rank positions are `WebSearch` ordinal positions**, not tracked Google SERP ranks.
- **`valricoagent.com` ownership is inferred** from branding, phone, and hosting — strongly indicated,
  but it is not in the documented site list, so **confirm with Barrett before acting on §4a.**
- Whether the 7 duplicate sitemap URLs and the 2026-03-28 frozen cluster are intentional.
- Core Web Vitals / Lighthouse — not measured. TTFB only.
