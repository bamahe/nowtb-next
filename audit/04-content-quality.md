# 04 — Content Quality Audit: nowtb.com

**Date:** 2026-10-17
**Repo:** `/Users/barretthenry/Projects/nowtb-leadmachine` (branch `seo/lead-machine-oct2026`)
**Corpora measured:** 3,277 content items (1,760 posts, 1,203 pages, 232 market updates, 49 guides, 33 batch2-city)
**Method:** 5-gram word shingles → MinHash (K=160) → Jaccard similarity, validated against exact Jaccard (agreement within ±0.05 on sampled pairs). All analysis scripts were throwaway; no repo source or data file was modified.

---

## 1. Verdict

**Yes. nowtb.com has the template-swap disease, and it is concentrated in the `pages` corpus (the city spoke pages).**

The headline number depends on how you measure, and the gap between the two measurements *is* the finding:

| Measurement | Docs in a ≥0.90 near-duplicate relationship | Docs in a ≥0.95 relationship |
|---|---|---|
| **Raw verbatim** text | 296 / 3,277 (9.0%) | 270 (8.2%) |
| **City name + numbers masked** ("template skeleton") | **1,383 / 3,277 (42.2%)** | **1,086 (33.1%)** |

Raw 5-gram Jaccard *understates* template-swap, because substituting the city name breaks every shingle that contains it. Masking city/county names and numerals reveals the real structure. The verdict is in that second row: **42% of all content on the site is the same skeleton with the location swapped.**

Per corpus, docs in ≥0.85 template-skeleton clusters:

| Corpus | n | Docs in ≥0.85 masked cluster | Diagnosis |
|---|---|---|---|
| **`pages-content.json`** | 1,203 | **913 (75.9%)** | **THE CANCER.** 8,618 page-pairs are ≥0.95 identical once the city name is masked. |
| `market-updates-export.json` | 232 | 205 (88.4%) | Second worst, but **148 pairs are ≥0.85 identical even verbatim** — the numbers barely differ either. |
| `posts-export.json` | 1,760 | 405 (23.0%) | Mixed. Specific generated families are clones; the hand-written core is genuinely good. |
| `guides-content.json` | 49 | **0 (0.0%)** | **Healthiest corpus on the site.** Median 3,047 body words, 47 unique facts. |
| `batch2-city-content.json` | 33 | **0 (0.0%)** | Healthy per-page uniqueness (47 facts/1k words — best density on the site). |

### The root cause is in code, not just data

`src/components/city/CityContent.tsx` (lines 936–968) contains a `default:` fallback that renders a **~130-word paragraph with only `city.name`, `city.county`, `zip_codes`, and `city.tagline` interpolated**, and zero unique facts. This is the sister-site failure mode implemented literally:

```
Looking for {topic} in {city.name}? You are in the right place. {city.name} is
located in {city.county} County, Florida, and covers ZIP codes {zipList}. {city.tagline}.
```

And it fires far more often than intended, because of a second bug:

**`city.topics` in `src/data/cities.ts` is dead data — it is never read anywhere in the codebase.** `getCityTopics()` (cities.ts:1160) ignores the per-city curated `topics` array and returns all 22 `SPOKE_TOPICS` for every city (minus `horse-properties` for non-rural). `generateStaticParams()` iterates that, so **all 93 cities × ~21 topics ≈ 1,953 spoke URLs are pre-rendered and live** regardless of whether any content exists for them.

Of 1,903 declared city×topic combinations, only **1,031 have a content entry — 872 (45.8%) render the generic fallback.** Those 872 are not "missing pages." They are live, indexable, near-identical thin pages.

A third code-level issue on the same component (CityContent.tsx:90–96): every one of those ~1,953 spoke pages opens with the hardcoded sentence *"I've helped dozens of families find {topic} in {city.name}."* That claim is applied uniformly to Ozona, Weeki Wachee, Crystal Beach and 90 other cities. It is an unverifiable first-person experience claim at scale and an E-E-A-T liability.

### What is NOT the problem

**Word count is not the problem**, exactly as the sister-site post-mortem predicted. Median body length is healthy everywhere (posts 1,223; pages 869; market updates 1,410; guides 3,064). Only 31 of 3,277 items are under 300 words. Do not fix this by adding words.

**Fabricated Unsplash URLs are not a problem here.** See §7 — this known generator failure mode did not occur in this repo.

---

## 2. Similarity distribution tables

Pair counts, MinHash Jaccard over 5-gram shingles. Only same-corpus pairs are shown; **cross-corpus pairs above 0.60 were effectively zero**, meaning the corpora don't duplicate each other — each is internally cloned.

### 2a. Raw verbatim text

| Corpus | ≥0.95 | ≥0.90 | ≥0.85 | ≥0.80 | ≥0.70 | ≥0.60 |
|---|---|---|---|---|---|---|
| posts | 245 | 376 | 668 | 2,110 | 7,859 | 13,348 |
| pages | 3 | 3 | 220 | 1,838 | 11,999 | 17,396 |
| market-updates | 97 | 132 | 148 | 148 | 148 | 245 |
| guides | 0 | 0 | 0 | 0 | 0 | 0 |
| batch2-city | 0 | 0 | 0 | 0 | 0 | 0 |

### 2b. City + number masked (template skeleton) — the real picture

| Corpus | ≥0.95 | ≥0.90 | ≥0.85 | ≥0.80 | ≥0.70 | ≥0.60 |
|---|---|---|---|---|---|---|
| **pages** | **8,618** | **13,891** | **16,149** | 16,932 | 17,918 | 18,566 |
| **posts** | 2,562 | 6,760 | 12,218 | 14,117 | 14,314 | 14,328 |
| market-updates | 1,012 | 1,012 | 1,078 | 1,520 | 2,851 | 3,664 |
| guides | 0 | 0 | 0 | 0 | 0 | 0 |
| batch2-city | 0 | 0 | 0 | 0 | 0 | 0 |

Read the `pages` row: moving the threshold from 0.95 all the way down to 0.60 barely changes the pair count (8,618 → 18,566). That flatness is the signature of a single template stamped out ~60 times, not a gradient of similar-but-distinct pages.

### 2c. Cross-city literal diff — same topic, 10 different cities

For each spoke topic, the 10 alphabetically-first cities were compared sentence-by-sentence. "% identical" = share of the average page's words contained in sentences present in **all 10** cities.

| Topic | avg words | verbatim identical across all 10 | city-masked identical |
|---|---|---|---|
| **new-construction** | 916 | 61.2% | **78.1%** |
| **neighborhood-guide** | 797 | 44.9% | **77.0%** |
| **waterfront-homes** | 914 | 55.9% | **72.3%** |
| **luxury-homes** | 819 | 40.5% | **71.2%** |
| land-for-sale | 546 | 31.8% | 30.7% |
| investment-property | 569 | 30.6% | 29.5% |
| open-houses | 557 | 29.4% | 28.3% |
| single-story-homes | 561 | 28.3% | 27.3% |
| **homes-with-pool** | 1,985 | 7.5% | **7.2%** ✅ |
| **housing-market** | 903 | 0.0% | **0.0%** ✅ |

**This table is the roadmap.** `new-construction`, `neighborhood-guide`, `waterfront-homes` and `luxury-homes` are 71–78% the same page across all 10 cities. Meanwhile `homes-with-pool` (7.2%) and `housing-market` (0.0%) are already correctly built on per-location data. **The fix pattern already exists in this repo** — the enrichment that was applied to pool and market pages simply was never applied to the other topics.

---

## 3. Worst duplicate clusters

Union-find clustering, components of size ≥3.

- **Raw verbatim, ≥0.85:** 54 clusters / 329 docs
- **Masked, ≥0.85:** 74 clusters / **1,437 docs**
- **Masked, ≥0.95:** 73 clusters / **990 docs**

### Largest masked ≥0.95 clusters (literally one page each)

| Size | Corpus | Pattern | Example slugs |
|---|---|---|---|
| **81** | posts | `sell-home-fast-{city}` | sell-home-fast-largo, -wimauma, -westchase, -town-n-country, -temple-terrace, -sun-city-center, -ruskin, -lutz, -carrollwood, -apollo-beach, -plant-city, -lithia, -riverview, -brandon … |
| **60** | posts | `new-construction-{city}-guide` | new-construction-lakeland-guide, -holiday-, -san-antonio-, -dade-city-, -zephyrhills-, -hudson-, -port-richey-, -odessa-, -trinity-, -land-o-lakes-, -wesley-chapel-, -kenneth-city-, -belleair-, -gulfport- … |
| **60** | pages | `{city}-new-construction` | anna-maria-, apollo-beach-, auburndale-, bartow-, belleair-, bradenton-beach-, bradenton-, carrollwood-, clearwater-, dade-city-, davenport-, dover-, dundee-, dunedin- … |
| **59** | pages | `{city}-luxury-homes` | apollo-beach-, auburndale-, bartow-, belleair-, bradenton-beach-, bradenton-, carrollwood-, clearwater-, dade-city-, davenport-, dover-, dundee-, dunedin-, ellenton- … |
| **49** | pages | `{city}-investment-property` | apollo-beach-, auburndale-, bartow-, belleair-, bradenton-, carrollwood-, clearwater-, dade-city-, dover-, dundee-, dunedin-, fort-meade-, gibsonton-, gulfport- … |
| **49** | pages | `{city}-open-houses` | apollo-beach-, auburndale-, bartow-, belleair-, bradenton-, carrollwood-, clearwater-, dade-city-, dover-, dundee-, dunedin-, fort-meade-, gibsonton-, gulfport- … |
| **43** | pages | `{city}-neighborhood-guide` | anna-maria-, auburndale-, bartow-, belleair-, bradenton-beach-, bradenton-, clearwater-, dade-city-, davenport-, dover-, dundee-, ellenton-, fort-meade-, gibsonton- … |
| **42** | pages | `{city}-housing-market` | anna-maria-, auburndale-, bartow-, belleair-, bradenton-beach-, bradenton-, clearwater-, dade-city-, davenport-, dover-, dundee-, ellenton-, fort-meade-, gulfport- … |
| **41** | pages | `{city}-waterfront-homes` | anna-maria-, auburndale-, bartow-, belleair-, bradenton-beach-, dade-city-, davenport-, dover-, ellenton-, fort-meade-, gibsonton-, holmes-beach-, hudson-, lake-wales- … |
| **36** | market-updates | `{city}-housing-market-q2-2026` | brooksville-, crystal-river-, englewood-, hernando-beach-, homosassa-, inverness-, lakeland-, lecanto-, nokomis-, north-port-, osprey-, ridge-manor-, san-antonio-fl-, sarasota- … |
| **32** | pages | `{city}-homes-for-sale` | bartow-, dundee-, fort-meade-, lake-wales-, mulberry-, polk-city-, venice-, north-port-, osprey-, nokomis-, siesta-key-, brooksville-, spring-hill-, weeki-wachee- … |

### The worst raw-verbatim cluster: `{city}-fl-{topic}` post families

These are ~230-word bodies with **1–2 unique facts**, shipped 9–10 times per city with only the topic word changed. The topic is in the slug and the title but the body is the same text:

```
safety-harbor-fl-homes-for-sale-guide   (body 245 words, 2 facts)
safety-harbor-fl-schools-guide          (body 247 words, 2 facts)
safety-harbor-fl-commute-guide          (body 244 words, 2 facts)
is-safety-harbor-fl-good-place-to-live  (body 243 words, 2 facts)
safety-harbor-fl-real-estate-guide      (body 244 words, 2 facts)
safety-harbor-fl-cost-of-living         (body 245 words, 2 facts)
safety-harbor-fl-property-taxes         (body 245 words, 2 facts)
safety-harbor-fl-new-construction       (body 244 words, 2 facts)
safety-harbor-fl-investment-property    (body 245 words, 2 facts)
```

The same 9–10 page family exists verbatim for **seminole, belleair, st-pete-beach, indian-rocks-beach, treasure-island, dunedin, palm-harbor, tarpon-springs, san-antonio**. A page claiming to be about *property taxes* that contains the same 240 words as the page about *schools* and the page about *commuting* cannot rank for any of them. ~94 URLs.

### Shared boilerplate quoted — `new-construction`, identical across all 10 cities

> "New homes in CITY also offer energy efficiency advantages - impact-rated windows, modern insulation, high-efficiency HVAC systems, and ENERGY STAR appliances can significantly reduce your monthly utility and insurance costs compared to older homes."

> "While builders may not negotiate significantly on base price, they often offer closing cost contributions, upgrade packages, and rate buydowns - especially on inventory homes."

> "What to Know Before Buying Builder warranties: Most new homes come with a 1-year comprehensive warranty, 2-year systems warranty, and 10-year structural warranty."

> "Customization timeline: If you are buying pre-construction, expect a build timeline of 6-12 months depending on the builder and level of customization."

> "You also get the peace of mind that comes with a builder warranty, brand-new mechanical systems, and current building codes designed for Florida's climate."

Every sentence is true of new construction *anywhere in Florida*. Not one is true of Valrico specifically. There is no named builder, no named community, no price, no school.

### Shared boilerplate quoted — `luxury-homes`, identical across all 10 cities

> "These homes often include gourmet kitchens with premium appliances, spa-inspired bathrooms, custom millwork, impact-rated windows, and resort-style outdoor living with pools, summer kitchens, and covered lanais."

> "Features Buyers Look For Pool and outdoor living - screened pools, summer kitchens, covered lanais, and fire pits Gourmet kitchens - Sub-Zero, Wolf, or Viking appliances, quartz or marble counters, large islands"

> "Luxury homes in desirable CITY locations have historically appreciated well, and the market continues to attract high-income buyers and relocators to the CITY Bay area."

> "Whether you are looking for a golf-course estate, a waterfront property, or a custom-built home on acreage, CITY's luxury market has options to match."

---

## 4. Word count distributions

Measured two ways: **total** body words after HTML stripping, and **unique body** words after removing sentences that appear on ≥60 other pages (the shared footer/CTA/disclaimer blocks).

| Corpus | n | min | p25 | median | p75 | max | <300 | <500 | <800 | median unique body | median boilerplate share |
|---|---|---|---|---|---|---|---|---|---|---|---|
| posts | 1,760 | 253 | 966 | 1,223 | 1,552 | 7,408 | 6 | 112 | 172 | 1,208 | 1.3% |
| pages | 1,203 | 57 | 585 | 869 | 2,085 | 8,379 | 25 | 147 | 465 | 534 | 10.3% |
| market-updates | 232 | 317 | 813 | 1,410 | 1,449 | 5,250 | 0 | 22 | 38 | 774 | **35.8%** |
| guides | 49 | 1,394 | 2,709 | 3,064 | 3,711 | 8,572 | 0 | 0 | 0 | 3,047 | 0.4% |
| batch2-city | 33 | 559 | 616 | 638 | 677 | 727 | 0 | 0 | 33 | 638 | 0.0% |

Market updates are **35.8% boilerplate by median** — over a third of each page is text shared with 60+ other pages.

### 30 thinnest by unique body words

| body | total | facts | corpus | slug |
|---|---|---|---|---|
| 57 | 57 | 4 | pages | valrico-homes-under-400k |
| 58 | 58 | **0** | pages | tarpon-springs-recently-sold |
| 59 | 59 | 4 | pages | riverview-high-school-homes |
| 60 | 60 | 3 | pages | plant-city-homes-under-450k |
| 69 | 69 | **0** | pages | tampa-bay-real-estate-agent |
| 96 | 96 | 3 | pages | homestead-exemption-florida |
| 132 | 132 | 9 | pages | tampa-bay-luxury-homes |
| 143 | 143 | 7 | pages | va-loans-tampa |
| 145 | 145 | 10 | pages | fha-loans-tampa |
| 146 | 166 | **0** | pages | remax-largo |
| 153 | 153 | 4 | pages | tampa-bay-relocation-guide |
| 161 | 161 | 8 | pages | tampa-bay-waterfront-homes |
| 163 | 166 | **0** | pages | tampa-bay-real-estate-expert |
| 164 | 184 | 7 | pages | tampa-bay-market-report |
| 164 | 184 | 4 | pages | tampa-bay-school-zones |
| 167 | 167 | 8 | pages | tampa-bay-real-estate-market-2026 |
| 167 | 167 | 3 | pages | tampa-bay-investment-property-guide |
| 187 | 187 | 3 | pages | tampa-bay-schools-guide |
| 209 | 317 | 10 | market-updates | dover-housing-market-update |
| 209 | 317 | 10 | market-updates | dover-fl-real-estate-market |
| 229 | 456 | 2 | posts | is-seminole-fl-good-place-to-live |
| 230 | 453 | 2 | posts | seminole-fl-homes-for-sale-guide |
| 230 | 456 | 2 | posts | seminole-fl-commute-guide |
| 230 | 453 | 2 | posts | seminole-fl-real-estate-guide |
| 230 | 453 | 2 | posts | seminole-fl-new-construction |
| 231 | 454 | 2 | posts | seminole-fl-cost-of-living |
| 231 | 454 | 2 | posts | seminole-fl-property-taxes |
| 231 | 231 | 6 | pages | brandon-brook |
| 231 | 231 | 6 | pages | brandon-east |
| 231 | 231 | 6 | pages | brandon-ridgeland |

Note the cluster of thin, high-value *Tampa Bay* head-term pages: `tampa-bay-luxury-homes` (132 words), `tampa-bay-waterfront-homes` (161), `tampa-bay-real-estate-market-2026` (167), `tampa-bay-schools-guide` (187). These target the most competitive and most valuable terms on the site with the least content.

---

## 5. Unique-fact-density scorecard

A "unique fact" = a distinct named subdivision, named school, dollar figure, named street, named route (I-75/US-301/SR-60), named builder, percentage, countable statistic, HOA/CDD reference, ZIP, year, or named landmark. Counted **after** removing shared boilerplate sentences, so footer disclaimers and the phone number don't inflate the score. Generic phrasing ("great schools", "convenient location") scores zero by construction.

| Corpus | n | median body words | **median unique facts** | p25 | p75 | pages <5 facts | pages <10 facts | facts / 1k words |
|---|---|---|---|---|---|---|---|---|
| **pages** | 1,203 | 534 | **14** | 9 | 30 | 24 | **318 (26.4%)** | 20.6 |
| posts | 1,760 | 1,208 | 35 | 18 | 60 | 83 | 131 (7.4%) | 28.6 |
| market-updates | 232 | 776 | 29 | 23 | 60 | 0 | 0 | 39.7 |
| guides | 49 | 3,047 | 47 | 28 | 65 | 0 | 1 | 14.3 |
| **batch2-city** | 33 | 638 | 30 | 28 | 34 | 0 | 0 | **47.1** ← best |

**318 of 1,203 city pages (26.4%) carry fewer than 10 unique facts.** That is the number that decides whether they rank, and it is the number to move.

Note `batch2-city` — 33 pages, median 638 words, 30 facts, **zero** near-duplicates, highest fact density on the site. Someone built these correctly. They are the template to copy.

### Sampled 40 city spoke pages — the fact-density gradient

The sample makes the two-tier structure obvious. Low-fact pages share an identical fingerprint of `subdivision:5, street:1, year_date:1, landmark:2` — the same five subdivision names and two landmarks pulled from a shared list, not the city's own:

```
facts=  3  body= 445  short-sales-tampa-bay
facts=  5  body= 364  siesta-key-homes-for-sale
facts=  5  body= 366  redington-shores-homes-for-sale
facts=  6  body= 418  holiday-homes-for-sale
facts=  6  body= 231  brandon-woodlands
facts=  9  body= 671  clearwater-housing-market          <- subdivision:5,street:1,year:1,landmark:2
facts=  9  body= 551  safety-harbor-neighborhood-guide   <- identical fingerprint
facts=  9  body= 487  winter-haven-investment-property   <- identical fingerprint
facts=  9  body= 402  longboat-key-investment-property   <- identical fingerprint
facts=  9  body= 515  davenport-neighborhood-guide       <- identical fingerprint
facts=  9  body= 653  fort-meade                         <- identical fingerprint
facts=  9  body= 604  tampa-investment-property          <- identical fingerprint
facts= 11  body= 469  belleair-single-story-homes
facts= 11  body= 465  oldsmar-single-story-homes
facts= 15  body= 358  brandon-luxury-homes
facts= 20  body= 539  st-pete-beach-luxury-homes
facts= 25  body=1262  land-o-lakes-gated-community-homes
facts= 29  body=2244  dover-55-plus-homes
facts= 31  body=2229  gibsonton-homes-for-sale
facts= 43  body=2155  tampa-homes-with-pool              <- enriched
facts= 46  body=1694  bradenton-homes-with-pool          <- enriched
facts= 53  body=2042  largo-homes-with-pool              <- enriched
facts= 58  body=2098  st-pete-beach-homes-with-pool      <- enriched
facts= 74  body=1830  plant-city-housing-market          <- enriched
facts= 84  body=4403  carrollwood                        <- hub, enriched
facts= 85  body=4509  largo                              <- hub, enriched
```

### Sampled 40 blog posts

```
facts=  3  body= 241  indian-rocks-beach-fl-new-construction
facts=  6  body= 244  pinellas-park-fl-homes-for-sale-guide
facts= 11  body= 441  luxury-homes-auburndale-guide
facts= 16  body= 690  new-construction-oldsmar-guide
facts= 17  body= 694  new-construction-gibsonton-guide
facts= 18  body= 694  new-construction-auburndale-guide
facts= 19  body= 376  sell-home-fast-winter-haven
facts= 20  body= 543  waterfront-homes-temple-terrace-guide
...
facts= 72  body=2594  buying-home-brandon-guide
facts= 85  body=1326  north-port-fl-property-taxes
facts=100  body=1333  lakewood-ranch-fl-cost-of-living
facts=105  body=4189  riverview-fl-new-construction-communities
facts=113  body=4967  apollo-beach-flood-insurance-guide
```

### Near-zero-fact pages (<5 unique facts) — 107 total

```
facts=0  body=1799  [posts] dover-fl-zoning-guide          <- 1,799 words, zero specifics
facts=0  body= 146  [pages] remax-largo
facts=0  body=  69  [pages] tampa-bay-real-estate-agent
facts=0  body= 163  [pages] tampa-bay-real-estate-expert
facts=0  body=  58  [pages] tarpon-springs-recently-sold
facts=1  body= 344  [posts] is-san-antonio-fl-good-place-to-live
facts=1  body= 344  [posts] best-neighborhoods-san-antonio-fl
facts=1  body= 344  [posts] moving-to-san-antonio-fl
facts=1  body= 344  [posts] things-to-do-san-antonio-fl
facts=1  body= 561  [pages] dade-city
facts=1  body= 515  [pages] holiday
facts=1  body= 584  [pages] wimauma-housing-market
facts=1  body= 557  [pages] zephyrhills-housing-market
facts=2  body= 867  [posts] short-sale-vs-foreclosure-florida
facts=2  body=~245  [posts] safety-harbor-fl-* (9 pages)
facts=2  body=~230  [posts] seminole-fl-* (8 pages)
facts=2  body=~236  [posts] belleair-fl-* (9 pages)
facts=2  body=~311  [posts] st-pete-beach-fl-* (9 pages)
... (remaining 107 are predominantly the {city}-fl-{topic} families)
```

`dover-fl-zoning-guide` is the standout anomaly: 1,799 body words containing **zero** verifiable specifics — no zoning code designation, no parcel size minimum, no ordinance number, no county contact. A zoning guide with no zoning codes in it.

---

## 6. Top 40 boilerplate strings

Sentences ≥45 chars, city names → `{CITY}` and numerals → `{N}`, counted once per page.

| Pages | Corpora | Boilerplate string (truncated to 120 chars) |
|---|---|---|
| 1,638 | mu, pages, posts | "Learn more Disclosure: This article is for informational purposes only and does not constitute financial or legal advice" |
| 1,530 | mu, pages, posts | "Whether you are buying, selling, investing, or exploring commercial opportunities - Barrett and The NOW Team are the REM…" |
| 1,441 | mu, pages, posts | "Barrett Henry is a licensed real estate broker, not a mortgage lender." |
| 1,416 | mu, pages, posts | "Barrett Henry is a licensed REALTOR® and Broker Associate with REMAX Collective, serving the entire {CITY} Bay market." |
| 1,340 | mu, pages, posts | "Loan program details, rates, and limits change regularly - verify all information with a licensed mortgage lender before…" |
| 1,328 | mu, pages, posts | "With deep local knowledge and an honest, data-driven approach, Barrett helps buyers and sellers make confident real esta…" |
| 1,228 | mu, pages, posts | "Schedule a Free Consultation Call ({N}) {N}-{N}" |
| 984 | mu, pages, posts | "Petersburg {CITY} {CITY} {CITY} Davis Islands View All Communities → Helpful Resources First-Time Buyers Sell Your …" |
| 949 | mu, pages, posts | "Florida Homeowners Insurance Guide Closing Costs in Florida Investment Property {CITY} Bay Explore {CITY} Bay Communitie…" |
| **897** | pages | **"Last Updated: March {N} Need Help With {CITY} Bay Real Estate?"** ← stale, see §7 |
| 673 | guides, pages, posts | "Contact Barrett Henry at ({N}) {N}-{N} to schedule a showing." |
| **556** | mu, posts | **"Last Updated: Need Help With {CITY} Bay Real Estate?"** ← empty date, see §7 |
| 460 | mu, pages, posts | "Related Articles Florida Housing Market {N} First-Time Buyer Guide {CITY} Bay Rents: Rent or Buy?" |
| 346 | posts | "About Barrett Henry : Licensed REALTOR and Broker Associate with REMAX Collective." |
| 311 | pages | "Schedule a Free Consultation Call ({N}) {N}-{N} &#{N}; {CITY} Real Estate Overview" |
| **286** | mu, posts | **"Related Articles Housing Market {N}" style="width:{N};height:{N}px;object-fit:cover;display:block;opacity:{N};" loading=…"** ← corrupted markup, see §7 |
| 183 | mu, pages, posts | "Leading The NOW Team at REMAX Collective, Barrett is a trusted REMAX agent with experience in both residential and REMAX…" |
| 183 | mu, pages, posts | "He brings deep local knowledge, honest data-driven advice, and a client-first approach to every deal." |
| 171 | mu, pages, posts | "Petersburg {CITY} {CITY} {CITY} Davis Islands View All Communities → About Barrett Henry - Barrett Henry is a licen…" |
| 146 | mu, pages, posts | "Market data is approximate and subject to change." |
| 141 | mu, pages, posts | "Always consult with a qualified real estate agent, lender, or attorney for your specific situation." |
| 140 | posts | "Barrett Henry, Broker Associate at REMAX Collective." |
| 137 | posts | "Barrett Henry — {N}+ years of real estate experience." |
| 134 | pages | "Find Your Perfect Home in {CITY} Barrett Henry helps buyers find the right home in {CITY} and throughout {CITY} Bay." |
| 117 | guides, mu, pages, posts | "Barrett Henry is a Broker Associate at REMAX Collective with {N}+ years of real estate experience." |
| 109 | posts | "Barrett Henry — {N}+ years of real estate experience across {CITY} Bay." ← guardrail violation, see §7 |
| 107 | posts | "Call Barrett at ({N}) {N}-{N} for personalized guidance." |
| 103 | mu, pages, posts | "Barrett Henry is a licensed Broker Associate with REMAX Collective, serving the entire {CITY} Bay market." |
| 95 | pages | "Contact Barrett at ({N}) {N}-{N} or visit the contact page to schedule a consultation." |
| 94 | posts | "What Buyers Need to Know {CITY} County is the most densely populated county in Florida, which means land is scarce and d…" |
| 94 | posts | "The trade-off is that prices per square foot are generally higher than comparable communities in {CITY} or {CITY} counti…" |
| 94 | posts | "Flood insurance is a real consideration in {CITY} County." |
| 94 | posts | "Many properties — especially those near the Gulf, on barrier islands, or along bayfront areas — fall in FEMA flood zones…" |
| 94 | posts | "Check the FEMA flood map for any property you're considering." |
| 94 | posts | "Use the mortgage calculator to estimate your full monthly payment including insurance." |
| 94 | posts | "The {CITY} Trail runs through much of the county, providing miles of paved trail for cycling and walking." |
| 94 | posts | "Beach access is measured in minutes, not hours." |
| 94 | posts | "Petersburg and {CITY} Beach are both accessible for dining, entertainment, and nightlife." |
| 94 | posts | "Schools are served by {CITY} County Schools." |
| 94 | posts | "Property taxes include both county and municipal levies where applicable." |

The block of ten rows at exactly **94 pages** is the Pinellas County `{city}-fl-{topic}` body — the entire "unique" content of those 94 pages is these ten sentences. Rewriting those ten sentences per city is the single highest-leverage text edit available.

The top nine rows (900–1,638 pages each) are legal/CTA/footer blocks **baked into the content JSON** rather than rendered by a component. They should be moved into the template so the stored content is only the unique body — this won't change what Google sees, but it makes every future similarity audit honest and prevents the word count from masking thin pages.

---

## 7. Accuracy and staleness findings

### 7a. Stale dates and placeholders

| Finding | Pages | Detail |
|---|---|---|
| **"Last Updated: March 2026"** | **897** | Hardcoded, 7 months stale. All in `pages`. |
| **"Last Updated:" with no date** | **556** | Renders a bare, empty label. posts 486 / market-updates 71. |
| "in 2025" | 56 | posts 39, pages 16, guides 1 |
| "in 2024" | 41 | posts 29, guides 6, pages 5 |
| "as of 2024/2025" | 25 | e.g. boyette-riverview-fl, apollo-beach-flood-insurance-guide |
| "2025's market" as current year | 2 | south-pasadena-fl-market-trends, apollo-beach-real-estate-market |
| **"coming soon"** | **45** | pages 41 — e.g. anna-maria-new-listings, hillsborough-county-school-zones-guide |
| "TBD" | 4 | luxury-condos-tampa-bay-guide, best-gated-communities-brandon-fl, first-time-home-buyer-guide |
| "placeholder" | 1 | winter-haven-homes-for-sale |
| lorem ipsum / TODO / XXX | 0 | clean ✅ |

Stale-dated titles: `fishhawk-ranch-community-guide-2026` is dated **2023-12-31**; `seffner-fl-real-estate-guide-2026` is dated **2023-12-01**. Title says 2026, date says 2023.

### 7b. Date sanity

- Range: 2022-01-02 → 2026-10-16. **No future-dated posts** ✅
- Year histogram: 2022=47, 2023=67, 2024=56, 2025=53, **2026=1,769**
- 114 items dated before 2024 — these predate the current site and several carry "2026" in the slug while being dated 2023.

### 7c. Unsplash URLs — known issue did NOT occur here

Every `images.unsplash.com` URL in all five corpora was extracted and pattern-checked.

- **Distinct photo IDs: 12** (not 12 thousand — twelve)
- Matching the strict `photo-{13 digits}-{12 hex}` rule: **8**
- Failing that rule: **4** — `photo-1545324418-cc1a3fa10c00`, `photo-1559827260-dc66d52bef19`, `photo-1560518883-ce09059eeffa`, `photo-1560520653-9e0e4c89eb11`

**I do not believe these four are fabricated.** All four are `photo-{10 digits}-{12 hex}`, which is Unsplash's genuine older ID format (the 13-digit form is used for newer uploads). The strict 13-digit heuristic produces false positives against them. **Conclusion: no evidence of fabricated Unsplash URLs in this repo.** This known generator failure mode did not happen here. (Caveat: this is a structural check only — I could not make network requests to confirm the images resolve.)

**The real image problem is repetition, not fabrication.** Twelve distinct images across 3,277 pages:

| Pages using it | Photo ID |
|---|---|
| 144 | photo-1600585154340-be6161a56a0c |
| 101 | photo-1564013799919-ab600027ffc6 |
| 81 | photo-1600596542815-ffad4c1539a9 |
| 70 | photo-1559827260-dc66d52bef19 |
| 69 | photo-1504307651254-35680f356dfd |
| 14 | photo-1592595896616-c37162298647 |

One generic stock house photo appears on 144 pages. This reinforces the sameness signal and violates the standing rule that property-specific posts use real MLS photos from the Bridge CDN.

### 7d. ⚠️ Content corruption — 626 pages render visible CSS

**This is a live, user-visible rendering bug and the most urgent item in this report.**

An auto-internal-linking script performed a naive string replace on keyword phrases **without excluding `<img alt="…">` attribute values**. When the target phrase sat inside an alt attribute, the replacement destroyed the `<img>` tag and left its tail as visible text. Confirmed with Python's `html.parser` (not a regex artifact) — the stored HTML is genuinely malformed.

- **626 pages render raw CSS as body text** (posts 487, market-updates 139)
- 623 match the specific corruption signature
- 1,202 orphaned attribute fragments

Example from `posts/best-neighborhoods-lithia` (line 190 of the stored content):

```html
<a href="/blog/investment-property-tampa-bay/" style="...">Investment Property</a> Tampa Bay" style="width:100%;height:140px;object-fit:cover;display:block;opacity:0.8;" loading="lazy"><div style="...">
```

The visitor sees: `… Investment Property Tampa Bay" style="width:100%;height:140px;object-fit:cover;display:block;opacity:0.8;" loading="lazy"> Investment Property Tampa Bay Explore Tampa Bay Communities …`

Orphan fragment frequency: `Tampa Bay"` ×586, `2026"` ×442, `"` ×113, `Buyer's Guide (0K+)"` ×23, `Luxury 2026"` ×21, `&amp; Belleair"` ×14, `FL"` ×3.

Affected pages include high-value ones: `best-neighborhoods-lithia`, `guide-to-living-in-largo-fl`, `guide-to-living-in-clearwater-fl`, `guide-to-living-in-st-petersburg-fl`, `ultimate-tampa-bay-relocation-guide`, `brandon-vs-riverview-vs-valrico`, `pool-homes-brandon-fl`, `buying-home-largo-guide`.

Side effect: the related-articles thumbnail images on these 626 pages are destroyed, not merely mis-rendered.

### 7e. A second regex accident — mangled dollar figures

**25 posts contain the literal string `(0K+)`** — the residue of `($500K+)` after a number-rewriting regex ate the `$50`. This is the same class of bug as the documented `23+ → 24+` regex that broke statutory building ages. Examples: `guide-to-living-in-largo-fl`, `one-tampa-residences`, `treasure-island-pass-a-grille-real-estate`.

### 7f. ⚠️ Experience-claim guardrail violations — 229 pages

The standing rule: the 23+ year number is **real estate experience generally** and must **never** be tied to Tampa Bay, Florida, or local tenure (local tenure is "over a decade" / "longtime local", never a year count).

**249 occurrences across 229 pages tie the number to a geography.** Verified phrasings:

| Count | Phrasing | Example page |
|---|---|---|
| 94 | "Barrett Henry — 23+ years of real estate experience **across Tampa Bay**" | is-st-petersburg-fl-good-place-to-live |
| 20 | "23+ years of real estate experience **across Florida and central Florida**" | lake-wales-fl-homes-for-sale-guide |
| 17 | "23+ years of real estate experience **serving Pinellas, Hillsborough, Pasco**, and surrounding counties" | redington-beach-fl-real-estate-guide |
| 14 | "23+ years … **serving buyers and sellers across Central Florida**" | inverness-fl-homes-for-sale-guide |
| — | "23+ years of **Pinellas Beach market** experience" | best-neighborhoods-madeira-beach |
| — | "23 years **in the Tampa Bay market**" | selling-home-largo-fl |
| — | "23 years of **Pinellas County experience**" | best-realtor-largo |
| — | "23 years of experience **in the Tampa Bay market**" | tampa-dining-guide-locals-recommend |

Plus **45 occurrences** of the explicitly forbidden local-tenure framing: **"23 years of local knowledge"** (`selling-home-largo-fl`, `history-of-largo-fl`, `things-to-do-largo-fl`), "23 years of experience and deep local knowledge" (`best-neighborhoods-pinellas-park-fl`).

Clean on the related rules: **"24+ years" = 0** ✅, **"master suite" = 0** ✅, "RE/MAX" with slash = 1 page (`redington-beach-fl-investment-property`).

### 7g. ⚠️ Two conflicting license numbers

| License | Pages | Context |
|---|---|---|
| **BK3246537** | 35 | "License #BK3246537 \| Hillsborough County" / "\| Pinellas County" |
| **BK3010265** | 20 | "Broker Associate, REMAX Collective \| License #BK3010265" |

Only one can be correct. Publishing a wrong license number on 20–35 pages is both an E-E-A-T problem and a real-estate advertising compliance exposure. **Needs Barrett to confirm which is right before anything else is touched.**

### 7h. Other rule violations

- **Mobile/manufactured homes mentioned on 32 pages** (posts 18, pages 11, guides 3) — violates the standing never-mention rule. Examples: `gibsonton-fl-new-construction`, `buying-home-sun-city-center-guide`, `living-in-seffner-fl`.
- **Stock photos on property-specific pages:** the 12-image library means property-specific posts necessarily use generic stock. `valrico-forest-final-phase-last-chance-new-construction` and the `one-tampa-residences` / `altura-bayshore-luxury-condos` style posts are property-specific and should be on Bridge CDN MLS photos.

### 7i. Keyword cannibalization — 251 clusters, 898 URLs

**251 (city, intent) pairs have 3+ URLs competing for the same keyword, tying up 898 URLs.**

Worst 25 overall:

| URLs | City / intent | Competing slugs |
|---|---|---|
| **10** | tampa / living-in | military-relocation-tampa, moving-to-tampa-bay, moving-to-tampa-bay-checklist, tampa-bay-relocation-guide, living-in-new-tampa-fl, military-relocation-tampa-macdill-guide, moving-to-tampa-bay-cost-of-living-guide, moving-to-tampa-bay-from-up-north, tampa-bay-beaches-relocation-guide, + 1 |
| **8** | tampa / housing-market | tampa-bay-housing-market-2025, tampa-fl-real-estate-market, tampa-housing-market-q2-2026, tampa-housing-market-update, tampa-real-estate-market-q1-2026, tampa-bay-real-estate-market-2026, tampa-housing-market, tampa-bay-real-estate-market-update-november-2024 |
| **7** | tampa / waterfront | tampa-bay-waterfront-homes, tampa-waterfront-homes, tampa-bay-waterfront-estates-guide, tampa-bay-waterfront-homes-types-prices-where-to-look, tampa-waterfront-condos, waterfront-homes-tampa-bay, waterfront-homes-tampa-guide |
| **7** | apollo-beach / housing-market | apollo-beach-fl-real-estate-market, -housing-market-q2-2026, -housing-market-update, -real-estate-market, -real-estate-market-q1-2026, apollo-beach-housing-market, apollo-beach-fl-market-trends |
| **7** | **valrico / housing-market** | valrico-fl-real-estate-market, valrico-housing-market-q2-2026, valrico-housing-market-update, valrico-real-estate-market-2026, valrico-real-estate-market-q1-2026, valrico-housing-market, valrico-fl-market-trends-history |
| 6 | seffner / housing-market | 6 URLs |
| 6 | plant-city / housing-market | 6 URLs |
| 6 | lithia / housing-market | 6 URLs |
| 6 | carrollwood / housing-market | 6 URLs |
| 5 | tampa / new-construction | new-construction-homes-tampa-bay (×2 — page AND post), tampa-new-construction, new-construction-luxury-tampa-bay-2026, new-construction-tampa-guide |
| 5 | tampa / luxury | tampa-bay-luxury-homes, tampa-luxury-homes, luxury-condos-tampa-bay-guide, luxury-homes-tampa-guide, tampa-bay-luxury-homes-guide |
| 5 | **valrico / neighborhoods** | valrico-neighborhood-guide, bent-tree-valrico-neighborhoods, best-neighborhoods-valrico, best-neighborhoods-valrico-fl-families, buckhorn-valrico-neighborhoods-guide |
| 5 | tampa / neighborhoods | 5 URLs |
| 5 | tampa / homes-for-sale | 5 URLs |
| 5 | **brandon / things-to-do** | best-family-activities-brandon-fl, best-restaurants-brandon-fl, best-restaurants-things-to-do-brandon-fl, brandon-fl-shopping-dining, things-to-do-brandon-fl |
| 5 | tierra-verde / homes-for-sale | 5 URLs |
| 5 | venice / homes-for-sale | 5 URLs |
| 5 | thonotosassa / housing-market | 5 URLs |
| 5 | brooksville / homes-for-sale | 5 URLs |
| 5 | spring-hill / homes-for-sale | 5 URLs |
| 5 | fishhawk / housing-market | 5 URLs |
| 5 | ruskin / housing-market | 5 URLs |
| 5 | anna-maria / housing-market | 5 URLs |
| 5 | bradenton / housing-market | 5 URLs |
| 5 | **brandon / housing-market** | brandon-fl-real-estate-market, brandon-housing-market, brandon-housing-market-q2-2026, brandon-housing-market-update, brandon-real-estate-market-q1-2026 |

Priority-area cannibalization (the ones that cost money): **valrico/housing-market ×7**, **valrico/neighborhoods ×5**, **valrico/new-construction ×4**, **valrico/luxury ×3**, **brandon/housing-market ×5**, **brandon/things-to-do ×5**, **brandon/new-construction ×4**, **brandon/neighborhoods ×4**, **brandon/luxury ×3**, **brandon/pool-homes ×3**, **riverview/housing-market ×5**, **riverview/new-construction ×4**, **riverview/neighborhoods ×3**, **riverview/waterfront ×3**, **riverview/luxury ×3**, **tampa** (8 separate intents cannibalized).

### 7j. Exact duplicate slugs across corpora — 38

The same slug exists in two different content files. Whichever route wins, the other is dead weight; where both render, they are literal duplicate URLs.

- `new-construction-homes-tampa-bay` — posts + pages
- `san-antonio-fl-new-construction`, `san-antonio-fl-investment-property`, `san-antonio-fl-waterfront-homes` — posts + pages
- `florida-housing-market-2026` — pages + market-updates
- **22 `{city}-homes-for-sale` slugs exist in BOTH `pages` and `batch2-city`** — bartow, dundee, fort-meade, lake-wales, mulberry, polk-city, venice, north-port, englewood, osprey, nokomis, siesta-key, brooksville, spring-hill, weeki-wachee, hernando-beach, ridge-manor, crystal-river, inverness, homosassa, …

That last group matters: `batch2-city` is the **healthiest** content on the site (30 facts, zero duplication) and it is colliding with the thin `pages` version of the same URL. Resolving the collision in favour of `batch2-city` is a free quality win for 22 URLs.

---

## 8. Coverage holes

### 8a. The declared-vs-real gap

| Metric | Count |
|---|---|
| Cities in `cities.ts` | 93 |
| `SPOKE_TOPICS` defined | 22 |
| Declared city×topic combos (per-city `topics` arrays) | 1,903 |
| Combos with a content entry | 1,031 |
| **Combos with NO content → generic fallback** | **872 (45.8%)** |
| Spoke URLs actually pre-rendered (`getCityTopics` ignores `city.topics`) | **~1,953** |

**Reframe:** these are not missing pages. Because `city.topics` is dead code, all ~1,953 spoke URLs render and are indexable. 872 of them serve the 130-word generic fallback. The coverage problem and the duplication problem are the same problem.

### 8b. Priority cores — all four identical

| City | Tier | Content present | Missing (renders fallback) |
|---|---|---|---|
| **Valrico** | 1 | 15/21 | condos-for-sale, townhomes-for-sale, recently-sold, rentals, home-valuation, property-management |
| **Brandon** | 1 | 15/21 | *same six* |
| **Riverview** | 1 | 15/21 | *same six* |
| **Tampa** | 1 | 15/21 | *same six* |

### 8c. The biggest priority-area hole: FishHawk

**FishHawk is tier 1 with content for 2 of 21 topics** — 19 fallback pages. FishHawk/Lithia sits directly adjacent to Valrico and is among the highest-value search targets in the Valrico-domination radius. Missing: homes-with-pool, new-construction, luxury-homes, waterfront-homes, 55-plus-homes, open-houses, investment-property, new-listings, single-story-homes, land-for-sale, condos-townhomes, gated-community-homes, neighborhood-guide, housing-market, recently-sold, rentals, home-valuation, property-management, + 1.

All other Hillsborough cities (Apollo Beach, Brandon, Carrollwood, Dover, Gibsonton, Lithia, Lutz, Plant City, Riverview, Ruskin, Seffner, Sun City Center, Tampa, Temple Terrace, Thonotosassa, Town 'n' Country, Valrico, Westchase, Wimauma) sit at 15/21 with the same six gaps.

### 8d. Topics missing site-wide

| Cities missing it | Topic |
|---|---|
| **93 (all)** | **rentals** |
| **93 (all)** | **home-valuation** ← highest-intent lead-capture topic on the site |
| **93 (all)** | **property-management** ← direct ViVi PM feeder |
| 92 | recently-sold |
| 84 | condos-for-sale |
| 84 | townhomes-for-sale |
| 27 | neighborhood-guide |
| 26 | homes-with-pool / open-houses / investment-property / new-listings / housing-market |
| 25 | new-construction / single-story-homes / land-for-sale |
| 23 | waterfront-homes |
| 21 | luxury-homes / 55-plus-homes |

**`home-valuation` and `property-management` have zero real content for all 93 cities.** These are the two highest-commercial-intent topics in the matrix — seller lead capture and the ViVi PM funnel — and both are 100% fallback. Note the template *does* have a dedicated valuation component (`[citySlug]/page.tsx` line 655, `HOME VALUATION SPOKE PAGE`), so the form exists; the supporting content does not.

### 8e. Worst coverage anywhere (1/21)

Sarasota, Venice, North Port, Brooksville, Spring Hill, Weeki Wachee, Crystal River, Indian Shores, Redington Beach, Tierra Verde, South Pasadena, East Lake, Crystal Beach, Ozona, Redington Shores — all **1 of 21**, 20 fallback pages each. Sarasota and Spring Hill in particular are large real markets being represented by a 130-word template.

---

## 9. The 20 pages that would gain most from enrichment

Ranked by `priority_geo × commercial_intent × fixability`, where fixability combines current duplication count (pages ≥0.90 masked-similar), fact gap below 30, and thinness below 900 body words. These are high-intent URLs in core geography that are currently near-clones — maximum upside, minimum work.

| # | Page | Body words | Unique facts | Near-dupes @0.90 | Why |
|---|---|---|---|---|---|
| 1 | **valrico-new-construction** | 300 | 17 | 39 | Core goal + highest-intent topic; 78% identical to 9 other cities |
| 2 | **valrico-luxury-homes** | 358 | 15 | 53 | Core; 71% cross-city identical |
| 3 | **riverview-luxury-homes** | 357 | 16 | 43 | Core |
| 4 | **tampa-new-construction** | 304 | 18 | 62 | Biggest market, 62 near-clones |
| 5 | **brandon-new-construction** | 304 | 18 | 23 | Core |
| 6 | **riverview-new-construction** | 308 | 19 | 23 | Core |
| 7 | **tampa-neighborhood-guide** | 534 | 9 | 51 | 77% cross-city identical; 9 facts |
| 8 | **tampa-luxury-homes** | 362 | 15 | 60 | Head term, 60 near-clones |
| 9 | **dover-new-construction** | 290 | 14 | 63 | Valrico radius; worst dup count |
| 10 | **seffner-new-construction** | 304 | 14 | 58 | Valrico radius |
| 11 | **fishhawk-homes-for-sale** | 414 | **6** | 18 | Tier-1 city with 2/21 coverage; 6 facts |
| 12 | **lithia-new-construction** | 292 | 16 | 60 | Valrico radius |
| 13 | **brandon-luxury-homes** | 358 | 15 | 18 | Core |
| 14 | **dover-neighborhood-guide** | 515 | 9 | 53 | Valrico radius |
| 15 | **lithia-neighborhood-guide** | 528 | 9 | 44 | Valrico radius |
| 16 | **dover-luxury-homes** | 351 | 14 | 62 | Valrico radius |
| 17 | **seffner-luxury-homes** | 352 | 14 | 62 | Valrico radius |
| 18 | **seffner-neighborhood-guide** | 535 | 9 | 50 | Valrico radius |
| 19 | **lithia-luxury-homes** | 355 | 15 | 60 | Valrico radius |
| 20 | **dover-housing-market** | 685 | 9 | 42 | Only housing-market page that stayed thin |

Runners-up: sun-city-center-new-construction, wimauma-new-construction, ruskin-new-construction, apollo-beach-new-construction, seffner-waterfront-homes.

### Copy these exemplars — the fix pattern is already in the repo

Zero near-duplicates, high fact density, same site:

| Facts | Body | Page |
|---|---|---|
| 242 | 4,706 | market-updates / florida-housing-market-2026 |
| 233 | 3,570 | posts / renting-vs-buying-tampa-bay |
| 214 | 3,024 | posts / apollo-beach-fl-investment-guide |
| 206 | 5,225 | market-updates / carrollwood-real-estate-market-2026 |
| 197 | 3,166 | posts / tampa-bay-rents-4-year-low-rent-or-buy |
| 192 | 3,495 | posts / cost-of-living-brandon-fl |
| 168 | 5,408 | posts / best-neighborhoods-carrollwood |

Plus the two healthy topic templates: **`{city}-housing-market`** (0.0% cross-city identical) and **`{city}-homes-with-pool`** (7.2%), and the **`batch2-city`** corpus (47 facts/1k words, zero duplication).

---

## Recommended order of operations

1. **Fix the 626 corrupted pages** (§7d) — live visible-CSS rendering bug, destroyed thumbnails. Highest urgency, mechanical fix. Also clean the 25 `(0K+)` strings (§7e).
2. **Confirm the correct license number** (§7g) and correct the other 20–35 pages. Compliance before SEO.
3. **Fix the 229 geo-tied experience claims and 45 "23 years of local knowledge" instances** (§7f) — hard standing guardrail, mechanical find/replace.
4. **Make `city.topics` load-bearing** in `getCityTopics()` so cities stop pre-rendering spoke URLs they have no content for, and stop the generic fallback in `CityContent.tsx:936` from being reachable at scale. Removing the hardcoded "I've helped dozens of families…" opener belongs here too. **This single code change de-indexes ~872 thin clones** and is far cheaper than writing content for them.
5. **Resolve the 38 duplicate slugs** (§7j), favouring `batch2-city` over `pages` for the 22 colliding `{city}-homes-for-sale` URLs.
6. **Consolidate the worst cannibalization clusters** (§7i), starting with valrico/housing-market (7→1), tampa/living-in (10→1), tampa/housing-market (8→1), brandon/things-to-do (5→1). Pick a canonical, 301 the rest.
7. **Enrich the top-20 list** (§9) using the `housing-market` / `batch2-city` pattern — verified per-location facts, not more words. Target: **30+ unique facts per page**, with FAQs generated from those facts.
8. **Refresh the 897 "Last Updated: March 2026" and 556 empty-date labels**, clear the 45 "coming soon" blocks, remove the 32 mobile/manufactured-home mentions.
9. **Move the top-nine footer/legal boilerplate blocks** (§6, 900–1,638 pages each) out of the content JSON into components so stored content is unique body only.
10. **Build `home-valuation` and `property-management` content** for the priority cores (§8d) — currently 0/93, and they are the seller-lead and ViVi PM funnels.

### Measurement to re-run after the work

Re-run masked-MinHash and the fact-density count. Targets: `pages` docs in ≥0.85 masked clusters from **913 → under 150**; `pages` median unique facts from **14 → 30+**; pages under 10 facts from **318 → under 50**. Word count is explicitly *not* a target.
