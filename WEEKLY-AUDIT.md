# nowtb.com — Weekly Lead Audit

**Run:** 2026-10-18  
**Findings:** 19  (critical 3, high 11, medium 5, low 0)  
**Experience claim should currently read:** `23+ years of real estate experience` (23 completed years since Sept 2003; 24th year in progress)

Ranked by severity x pages affected, so the top of this list is where the money is.

---

## Priority fix list

| # | Sev | Pages | Finding |
|---|---|---|---|
| 1 | high | 3400 | 2 z-index value(s) shared by different fixed overlays |
| 2 | high | 3400 | Exit-intent popup is enabled but no longer scoped to seller pages |
| 3 | critical | 14 | 14 lead-eligible page(s) render NO lead form |
| 4 | critical | 14 | 14 page(s) with no clickable tel: link |
| 5 | high | 94 | 94 literal title(s) exceed 60 chars once the 16-char template suffix is added |
| 6 | high | 79 | 79 city/ies have no hand-written neighborhood descriptions |
| 7 | high | 25 | 25 page(s) link to no conversion page |
| 8 | high | 16 | 16 page(s) with no BreadcrumbList schema |
| 9 | medium | 133 | 133 literal description(s) outside the 120-155 character window |
| 10 | high | 12 | 12 page(s) with no detectable H1 |
| 11 | critical | 1 | 1 referenced asset path(s) do not exist in public/ |
| 12 | high | 9 | 9 route(s) missing alternates.canonical |
| 13 | high | 9 | 9 page(s) show FAQ content but emit no FAQPage schema |
| 14 | high | 4 | 4 page(s) with MORE THAN ONE H1 |
| 15 | medium | 23 | 23 literal title(s) over 60 characters |
| 16 | medium | 19 | 19 route(s) missing openGraph |
| 17 | high | 1 | 1 route(s) are noindex yet advertised in the sitemap |
| 18 | medium | 5 | 5 raw <img> tag(s) instead of next/image |
| 19 | medium | 4 | 4 image(s) with no alt attribute |

---

## Detail

### 1. 2 z-index value(s) shared by different fixed overlays

- **Severity:** high
- **Pages affected:** 3400
- **Check:** `conversion`
- **Fix:** Assign a single explicit stacking order (cookie banner < chat < mobile bar < modal). Equal z-index on fixed elements means paint order decides, and an overlay can sit on top of the mobile call button.

<details><summary>Evidence</summary>

```
z-9999 shared by: src/app/layout.tsx, src/components/layout/MobileNav.tsx
z-100 shared by: src/app/card/page.tsx, src/components/search/FilterPanel.tsx
```

</details>

### 2. Exit-intent popup is enabled but no longer scoped to seller pages

- **Severity:** high
- **Pages affected:** 3400
- **Check:** `conversion`
- **Fix:** Restore the `if (variant !== "seller") return null;` guard in ClientExitIntent.tsx. Barrett chose seller-pages-only: on a valuation or sell page the offer earns the interruption, on a restaurant blog post it is just an obstacle.

<details><summary>Evidence</summary>

```
src/components/ui/ClientExitIntent.tsx
```

</details>

### 3. 14 lead-eligible page(s) render NO lead form

- **Severity:** critical
- **Pages affected:** 14
- **Check:** `conversion`
- **Fix:** Add a compact 3-field form (name / phone / email) or at minimum a prominent CTA block linking to /free-home-valuation or /contact. Traffic with no capture is wasted spend.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/feedback/page.tsx  (route /11417-cypress-park-st/feedback)
src/app/11417-cypress-park-st/sign-in/page.tsx  (route /11417-cypress-park-st/sign-in)
src/app/2510-brimhollow-dr/feedback/page.tsx  (route /2510-brimhollow-dr/feedback)
src/app/2510-brimhollow-dr/sign-in/page.tsx  (route /2510-brimhollow-dr/sign-in)
src/app/30935-whitlock-dr/feedback/page.tsx  (route /30935-whitlock-dr/feedback)
src/app/30935-whitlock-dr/sign-in/page.tsx  (route /30935-whitlock-dr/sign-in)
src/app/3813-polumbo-dr/sign-in/page.tsx  (route /3813-polumbo-dr/sign-in)
src/app/brandon/southoak/page.tsx  (route /brandon/southoak)
src/app/compare/[slug]/page.tsx  (route /compare/[slug])
src/app/home-valuation/page.tsx  (route /home-valuation)
src/app/insurance-partners/page.tsx  (route /insurance-partners)
src/app/mortgage-calculator/page.tsx  (route /mortgage-calculator)
src/app/preferred-vendors/page.tsx  (route /preferred-vendors)
src/app/properties/search/page.tsx  (route /properties/search)
```

</details>

### 4. 14 page(s) with no clickable tel: link

- **Severity:** critical
- **Pages affected:** 14
- **Check:** `conversion`
- **Fix:** Add <a href="tel:8137337907">(813) 733-7907</a> visible on mobile. Real estate converts by phone; a page without a tappable number loses the call.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/feedback/page.tsx  (route /11417-cypress-park-st/feedback)
src/app/11417-cypress-park-st/sign-in/page.tsx  (route /11417-cypress-park-st/sign-in)
src/app/2510-brimhollow-dr/feedback/page.tsx  (route /2510-brimhollow-dr/feedback)
src/app/2510-brimhollow-dr/sign-in/page.tsx  (route /2510-brimhollow-dr/sign-in)
src/app/30935-whitlock-dr/feedback/page.tsx  (route /30935-whitlock-dr/feedback)
src/app/30935-whitlock-dr/sign-in/page.tsx  (route /30935-whitlock-dr/sign-in)
src/app/3813-polumbo-dr/sign-in/page.tsx  (route /3813-polumbo-dr/sign-in)
src/app/brandon/southoak/page.tsx  (route /brandon/southoak)
src/app/communities/page.tsx  (route /communities)
src/app/compare/[slug]/page.tsx  (route /compare/[slug])
src/app/home-valuation/page.tsx  (route /home-valuation)
src/app/investing/page.tsx  (route /investing)
src/app/properties/search/page.tsx  (route /properties/search)
src/app/sell-your-home/page.tsx  (route /sell-your-home)
```

</details>

### 5. 94 literal title(s) exceed 60 chars once the 16-char template suffix is added

- **Severity:** high
- **Pages affected:** 94
- **Check:** `metadata`
- **Fix:** Each title must be <= 44 characters so the rendered title fits in 60. Put the primary keyword first so that if it is truncated, the important words survive.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/feedback/page.tsx  53+16=69 chars: Open House Feedback | 11417 Cypress Park St, Tampa FL
src/app/11417-cypress-park-st/page.tsx  65+16=81 chars: 11417 Cypress Park St, Tampa FL 33624 | 3 Bed + Office | $514,990
src/app/11417-cypress-park-st/page.tsx  57+16=73 chars: Open House Sunday 2p–4p — 11417 Cypress Park St, Tampa FL
src/app/11417-cypress-park-st/page.tsx  57+16=73 chars: Open House Sunday 2p–4p — 11417 Cypress Park St, Tampa FL
src/app/11417-cypress-park-st/sign-in/page.tsx  52+16=68 chars: Open House Sign In | 11417 Cypress Park St, Tampa FL
src/app/2510-brimhollow-dr/feedback/page.tsx  52+16=68 chars: Open House Feedback | 2510 Brimhollow Dr, Valrico FL
src/app/2510-brimhollow-dr/page.tsx  68+16=84 chars: 2510 Brimhollow Dr, Valrico FL 33596 | Buckhorn Pool Home | $479,900
src/app/2510-brimhollow-dr/page.tsx  57+16=73 chars: Open House Sunday 2 to 4 — 2510 Brimhollow Dr, Valrico FL
src/app/2510-brimhollow-dr/page.tsx  57+16=73 chars: Open House Sunday 2 to 4 — 2510 Brimhollow Dr, Valrico FL
src/app/2510-brimhollow-dr/sign-in/page.tsx  51+16=67 chars: Open House Sign In | 2510 Brimhollow Dr, Valrico FL
src/app/30935-whitlock-dr/feedback/page.tsx  57+16=73 chars: Open House Feedback | 30935 Whitlock Dr, Wesley Chapel FL
src/app/30935-whitlock-dr/page.tsx  66+16=82 chars: 30935 Whitlock Dr, Wesley Chapel FL 33543 | 3 Bed Villa | $274,900
src/app/30935-whitlock-dr/page.tsx  64+16=80 chars: Open House Sat & Sun 2p–4p — 30935 Whitlock Dr, Wesley Chapel FL
src/app/30935-whitlock-dr/page.tsx  64+16=80 chars: Open House Sat & Sun 2p–4p — 30935 Whitlock Dr, Wesley Chapel FL
src/app/30935-whitlock-dr/sign-in/page.tsx  56+16=72 chars: Open House Sign In | 30935 Whitlock Dr, Wesley Chapel FL
src/app/3813-polumbo-dr/page.tsx  62+16=78 chars: 3813 Polumbo Dr, Valrico FL 33596 | 4 Bed Pool Home | $550,000
src/app/3813-polumbo-dr/page.tsx  56+16=72 chars: Open House Sat & Sun 2p–4p — 3813 Polumbo Dr, Valrico FL
src/app/3813-polumbo-dr/page.tsx  56+16=72 chars: Open House Sat & Sun 2p–4p — 3813 Polumbo Dr, Valrico FL
src/app/3813-polumbo-dr/sign-in/page.tsx  48+16=64 chars: Open House Sign In | 3813 Polumbo Dr, Valrico FL
src/app/55-plus-communities/page.tsx  62+16=78 chars: Tampa Bay 55+ Communities & Active Adult Homes | Barrett Henry
```

</details>

### 6. 79 city/ies have no hand-written neighborhood descriptions

- **Severity:** high
- **Pages affected:** 79
- **Check:** `coverage`
- **Fix:** Add real per-neighborhood detail (named subdivisions, build years, HOA/CDD facts, price bands). This is the single biggest differentiator between a city page that ranks and one that reads like a template.

<details><summary>Evidence</summary>

```
anna-maria
auburndale
bartow
belleair
bradenton
bradenton-beach
brooksville
carrollwood
clearwater
crystal-beach
crystal-river
dade-city
davenport
dundee
dunedin
east-lake
ellenton
englewood
floral-city
fort-meade
gibsonton
gulfport
haines-city
hernando-beach
holiday
holmes-beach
homosassa
hudson
indian-rocks-beach
indian-shores
```

</details>

### 7. 25 page(s) link to no conversion page

- **Severity:** high
- **Pages affected:** 25
- **Check:** `conversion`
- **Fix:** Add a contextual link to /free-home-valuation, /sell-your-home or /contact in the body.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/feedback/page.tsx  (route /11417-cypress-park-st/feedback)
src/app/11417-cypress-park-st/sign-in/page.tsx  (route /11417-cypress-park-st/sign-in)
src/app/2510-brimhollow-dr/feedback/page.tsx  (route /2510-brimhollow-dr/feedback)
src/app/2510-brimhollow-dr/sign-in/page.tsx  (route /2510-brimhollow-dr/sign-in)
src/app/30935-whitlock-dr/feedback/page.tsx  (route /30935-whitlock-dr/feedback)
src/app/30935-whitlock-dr/sign-in/page.tsx  (route /30935-whitlock-dr/sign-in)
src/app/3813-polumbo-dr/sign-in/page.tsx  (route /3813-polumbo-dr/sign-in)
src/app/55-plus-communities/page.tsx  (route /55-plus-communities)
src/app/beach-condo-renovation-math/page.tsx  (route /beach-condo-renovation-math)
src/app/brandon/southoak/page.tsx  (route /brandon/southoak)
src/app/buying-beach-condo-llc-florida/page.tsx  (route /buying-beach-condo-llc-florida)
src/app/compare/[slug]/page.tsx  (route /compare/[slug])
src/app/condos/page.tsx  (route /condos)
src/app/golf-homes/page.tsx  (route /golf-homes)
src/app/how-to-tell-if-condo-is-55-plus/page.tsx  (route /how-to-tell-if-condo-is-55-plus)
src/app/indian-rocks-beach-rental-rules/page.tsx  (route /indian-rocks-beach-rental-rules)
src/app/land-acreage/page.tsx  (route /land-acreage)
src/app/mortgage-calculator/page.tsx  (route /mortgage-calculator)
src/app/new-construction/page.tsx  (route /new-construction)
src/app/no-hoa/page.tsx  (route /no-hoa)
src/app/pool-homes/page.tsx  (route /pool-homes)
src/app/price-reduced/page.tsx  (route /price-reduced)
src/app/single-story/page.tsx  (route /single-story)
src/app/townhomes/page.tsx  (route /townhomes)
src/app/waterfront/page.tsx  (route /waterfront)
```

</details>

### 8. 16 page(s) with no BreadcrumbList schema

- **Severity:** high
- **Pages affected:** 16
- **Check:** `schema`
- **Fix:** Add breadcrumbSchema() from src/lib/schema.tsx. Breadcrumbs are what produce the path display in search results instead of a raw URL, which lifts click-through.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/feedback/page.tsx  (route /11417-cypress-park-st/feedback)
src/app/11417-cypress-park-st/sign-in/page.tsx  (route /11417-cypress-park-st/sign-in)
src/app/2510-brimhollow-dr/feedback/page.tsx  (route /2510-brimhollow-dr/feedback)
src/app/2510-brimhollow-dr/sign-in/page.tsx  (route /2510-brimhollow-dr/sign-in)
src/app/30935-whitlock-dr/feedback/page.tsx  (route /30935-whitlock-dr/feedback)
src/app/30935-whitlock-dr/sign-in/page.tsx  (route /30935-whitlock-dr/sign-in)
src/app/3813-polumbo-dr/sign-in/page.tsx  (route /3813-polumbo-dr/sign-in)
src/app/card/page.tsx  (route /card)
src/app/compare/[slug]/page.tsx  (route /compare/[slug])
src/app/dmca-notice/page.tsx  (route /dmca-notice)
src/app/fair-housing/page.tsx  (route /fair-housing)
src/app/home-valuation/page.tsx  (route /home-valuation)
src/app/inspectors/page.tsx  (route /inspectors)
src/app/properties/search/page.tsx  (route /properties/search)
src/app/remote-seller-process/page.tsx  (route /remote-seller-process)
src/app/seller-intake/page.tsx  (route /seller-intake)
```

</details>

### 9. 133 literal description(s) outside the 120-155 character window

- **Severity:** medium
- **Pages affected:** 133
- **Check:** `metadata`
- **Fix:** Rewrite to 120-155 chars: direct answer first, then a CTA with the phone number.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/page.tsx  174 chars: 3 bed, 2 bath, 2 car garage plus a home office at the end of a quiet Carrollwood cul-de-sa
src/app/11417-cypress-park-st/page.tsx  78 chars: 3 bed, 2 bath, 2 car garage plus office on a Carrollwood cul-de-sac. $514,990.
src/app/11417-cypress-park-st/page.tsx  118 chars: Updated single story 3 bedroom, 2 bath, 2 car garage home with a home office on a cul-de-s
src/app/2510-brimhollow-dr/page.tsx  177 chars: Buckhorn pool home. 3 bedrooms, 2.5 baths, 2 car garage, private office, and a screened la
src/app/2510-brimhollow-dr/page.tsx  92 chars: Buckhorn pool home. 3 bed, 2.5 bath, 2 car garage, private office, screened lanai. $479,90
src/app/2510-brimhollow-dr/page.tsx  103 chars: Single story 3 bedroom, 2.5 bath, 2 car garage pool home with a private office in Buckhorn
src/app/30935-whitlock-dr/page.tsx  187 chars: Lock-and-leave 3 bed, 2 bath, 2 car garage villa in gated Meadow Pointe III, backing to co
src/app/30935-whitlock-dr/page.tsx  95 chars: Gated 3 bed, 2 bath, 2 car garage villa backing to conservation in Meadow Pointe III. $274
src/app/3813-polumbo-dr/page.tsx  164 chars: 4 bed, 3 bath, 3 car garage on .64 acres with a screened pool. Fully renovated, single sto
src/app/3813-polumbo-dr/page.tsx  77 chars: 4 bed, 3 bath, 3 car garage pool home on .64 acres in Bloomingdale. $550,000.
src/app/3813-polumbo-dr/page.tsx  106 chars: Renovated single story 4 bedroom, 3 bath, 3 car garage pool home on .64 acres in Bloomingd
src/app/about/page.tsx  94 chars: 23+ years of real estate experience. Broker Associate with REMAX Collective serving Tampa 
src/app/about/page.tsx  115 chars: Licensed real estate Broker Associate with REMAX Collective serving Tampa Bay. 23+ years o
src/app/about/page.tsx  93 chars: Licensed Florida Broker Associate with REMAX Collective. 23+ years of real estate experien
src/app/account/page.tsx  102 chars: View your saved searches, favorite listings, recently viewed homes, and account settings o
```

</details>

### 10. 12 page(s) with no detectable H1

- **Severity:** high
- **Pages affected:** 12
- **Check:** `headings`
- **Fix:** Add exactly one H1 containing the primary keyword. A page with no H1 gives Google nothing to match the query against.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/feedback/page.tsx  (route /11417-cypress-park-st/feedback)
src/app/11417-cypress-park-st/sign-in/page.tsx  (route /11417-cypress-park-st/sign-in)
src/app/2510-brimhollow-dr/feedback/page.tsx  (route /2510-brimhollow-dr/feedback)
src/app/2510-brimhollow-dr/sign-in/page.tsx  (route /2510-brimhollow-dr/sign-in)
src/app/30935-whitlock-dr/feedback/page.tsx  (route /30935-whitlock-dr/feedback)
src/app/30935-whitlock-dr/sign-in/page.tsx  (route /30935-whitlock-dr/sign-in)
src/app/3813-polumbo-dr/sign-in/page.tsx  (route /3813-polumbo-dr/sign-in)
src/app/account/page.tsx  (route /account)
src/app/compare/[slug]/page.tsx  (route /compare/[slug])
src/app/home-valuation/page.tsx  (route /home-valuation)
src/app/mortgage-calculator/page.tsx  (route /mortgage-calculator)
src/app/properties/search/page.tsx  (route /properties/search)
```

</details>

### 11. 1 referenced asset path(s) do not exist in public/

- **Severity:** critical
- **Pages affected:** 1
- **Check:** `assets`
- **Fix:** Fix the paths or add the files. Define shared asset paths as a single exported constant so they cannot drift again. A broken image in schema or an author avatar weakens the entity signal that everything else depends on.

<details><summary>Evidence</summary>

```
/images/no-photo.jpg  referenced from: src/lib/utils.ts:11
```

</details>

### 12. 9 route(s) missing alternates.canonical

- **Severity:** high
- **Pages affected:** 9
- **Check:** `metadata`
- **Fix:** Add `alternates: { canonical: '/the-path' }`. Without a canonical, parameter and trailing-slash variants split ranking signals across duplicates.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/feedback/page.tsx  (route /11417-cypress-park-st/feedback)
src/app/11417-cypress-park-st/sign-in/page.tsx  (route /11417-cypress-park-st/sign-in)
src/app/2510-brimhollow-dr/feedback/page.tsx  (route /2510-brimhollow-dr/feedback)
src/app/2510-brimhollow-dr/sign-in/page.tsx  (route /2510-brimhollow-dr/sign-in)
src/app/30935-whitlock-dr/feedback/page.tsx  (route /30935-whitlock-dr/feedback)
src/app/30935-whitlock-dr/sign-in/page.tsx  (route /30935-whitlock-dr/sign-in)
src/app/3813-polumbo-dr/sign-in/page.tsx  (route /3813-polumbo-dr/sign-in)
src/app/clients/[slug]/page.tsx  (route /clients/[slug])
src/app/compare/[slug]/page.tsx  (route /compare/[slug])
```

</details>

### 13. 9 page(s) show FAQ content but emit no FAQPage schema

- **Severity:** high
- **Pages affected:** 9
- **Check:** `schema`
- **Fix:** Wrap the same questions in faqSchema(). Visible FAQs without the schema are invisible to AI answer engines and to the FAQ rich result.

<details><summary>Evidence</summary>

```
src/app/[citySlug]/page.tsx
src/app/auburndale/gapway-lakes-estates/page.tsx
src/app/brandon/southoak/page.tsx
src/app/builders/page.tsx
src/app/commercial/page.tsx
src/app/guides/[slug]/page.tsx
src/app/inspectors/page.tsx
src/app/lenders/page.tsx
src/app/relocation/page.tsx
```

</details>

### 14. 4 page(s) with MORE THAN ONE H1

- **Severity:** high
- **Pages affected:** 4
- **Check:** `headings`
- **Fix:** Keep exactly one H1; demote the rest to H2. Multiple H1s split the topic signal.

<details><summary>Evidence</summary>

```
src/app/[citySlug]/page.tsx  (4 h1 tags, route /[citySlug])
src/app/blog/[slug]/page.tsx  (9 h1 tags, route /blog/[slug])
src/app/guides/[slug]/page.tsx  (2 h1 tags, route /guides/[slug])
src/app/market-updates/[slug]/page.tsx  (2 h1 tags, route /market-updates/[slug])
```

</details>

### 15. 23 literal title(s) over 60 characters

- **Severity:** medium
- **Pages affected:** 23
- **Check:** `metadata`
- **Fix:** Trim to under 60 chars with the primary keyword FIRST, or Google truncates it mid-phrase.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/page.tsx  65 chars: 11417 Cypress Park St, Tampa FL 33624 | 3 Bed + Office | $514,990
src/app/2510-brimhollow-dr/page.tsx  68 chars: 2510 Brimhollow Dr, Valrico FL 33596 | Buckhorn Pool Home | $479,900
src/app/30935-whitlock-dr/page.tsx  66 chars: 30935 Whitlock Dr, Wesley Chapel FL 33543 | 3 Bed Villa | $274,900
src/app/30935-whitlock-dr/page.tsx  64 chars: Open House Sat & Sun 2p–4p — 30935 Whitlock Dr, Wesley Chapel FL
src/app/30935-whitlock-dr/page.tsx  64 chars: Open House Sat & Sun 2p–4p — 30935 Whitlock Dr, Wesley Chapel FL
src/app/3813-polumbo-dr/page.tsx  62 chars: 3813 Polumbo Dr, Valrico FL 33596 | 4 Bed Pool Home | $550,000
src/app/55-plus-communities/page.tsx  62 chars: Tampa Bay 55+ Communities & Active Adult Homes | Barrett Henry
src/app/55-plus-communities/page.tsx  62 chars: Tampa Bay 55+ Communities & Active Adult Homes | Barrett Henry
src/app/auburndale/gapway-lakes-estates/page.tsx  68 chars: Gapway Lakes Estates, Auburndale FL | 45 Estate Lots on Lake Juliana
src/app/auburndale/gapway-lakes-estates/page.tsx  68 chars: Gapway Lakes Estates, Auburndale FL | 45 Estate Lots on Lake Juliana
src/app/brandon/southoak/page.tsx  63 chars: Southoak Homes for Sale in Bloomingdale | Barrett Henry | REMAX
src/app/brandon/southoak/page.tsx  63 chars: Southoak Homes for Sale in Bloomingdale | Barrett Henry | REMAX
src/app/golf-homes/page.tsx  62 chars: Tampa Bay Golf Course Homes for Sale | Barrett Henry, REALTOR®
src/app/golf-homes/page.tsx  62 chars: Tampa Bay Golf Course Homes for Sale | Barrett Henry, REALTOR®
src/app/inspectors/page.tsx  61 chars: Home Inspectors Tampa Bay | Trusted Referrals | Barrett Henry
```

</details>

### 16. 19 route(s) missing openGraph

- **Severity:** medium
- **Pages affected:** 19
- **Check:** `metadata`
- **Fix:** Add openGraph with a 1200x630 image. Shared links without it look broken and get fewer clicks.

<details><summary>Evidence</summary>

```
src/app/11417-cypress-park-st/feedback/page.tsx  (route /11417-cypress-park-st/feedback)
src/app/11417-cypress-park-st/sign-in/page.tsx  (route /11417-cypress-park-st/sign-in)
src/app/2510-brimhollow-dr/feedback/page.tsx  (route /2510-brimhollow-dr/feedback)
src/app/2510-brimhollow-dr/sign-in/page.tsx  (route /2510-brimhollow-dr/sign-in)
src/app/30935-whitlock-dr/feedback/page.tsx  (route /30935-whitlock-dr/feedback)
src/app/30935-whitlock-dr/sign-in/page.tsx  (route /30935-whitlock-dr/sign-in)
src/app/3813-polumbo-dr/sign-in/page.tsx  (route /3813-polumbo-dr/sign-in)
src/app/accessibility/page.tsx  (route /accessibility)
src/app/account/page.tsx  (route /account)
src/app/builders/[slug]/page.tsx  (route /builders/[slug])
src/app/clients/[slug]/page.tsx  (route /clients/[slug])
src/app/commercial/page.tsx  (route /commercial)
src/app/compare/[slug]/page.tsx  (route /compare/[slug])
src/app/dmca-notice/page.tsx  (route /dmca-notice)
src/app/fair-housing/page.tsx  (route /fair-housing)
src/app/home-valuation/page.tsx  (route /home-valuation)
src/app/privacy-policy/page.tsx  (route /privacy-policy)
src/app/terms-of-use/page.tsx  (route /terms-of-use)
src/app/thank-you/page.tsx  (route /thank-you)
```

</details>

### 17. 1 route(s) are noindex yet advertised in the sitemap

- **Severity:** high
- **Pages affected:** 1
- **Check:** `crawl`
- **Fix:** Pick one. Either the page should rank — remove the noindex and give it real metadata, a canonical and an H1 — or it should not be in the sitemap at all. Keeping both wastes crawl budget that should be spent on pages that can actually win.

<details><summary>Evidence</summary>

```
src/app/properties/page.tsx  (route /properties/) is noindex but listed in sitemap.ts
```

</details>

### 18. 5 raw <img> tag(s) instead of next/image

- **Severity:** medium
- **Pages affected:** 5
- **Check:** `performance`
- **Fix:** Swap to next/image for automatic AVIF/WebP, sizing and lazy loading. Raw <img> hurts Largest Contentful Paint, which is a ranking factor.

<details><summary>Evidence</summary>

```
src/components/search/MapView.tsx:141  <img src="${photoUrl}" alt="${address}"
src/lib/utils.ts:231  // <img …> / <div … /> have no separate closing tag
src/lib/utils.ts:439  out = out.replace(/<img\b/i, `<img width="${width}" height="${height}"`);
src/lib/utils.ts:444  out = out.replace(/<img\b/i, '<img decoding="async"');
src/lib/utils.ts:448  out = out.replace(/<img\b/i, '<img loading="lazy"');
```

</details>

### 19. 4 image(s) with no alt attribute

- **Severity:** medium
- **Pages affected:** 4
- **Check:** `performance`
- **Fix:** Add descriptive alt text using the target keyword naturally. Also an accessibility requirement.

<details><summary>Evidence</summary>

```
src/lib/utils.ts:231  // <img …> / <div … /> have no separate closing tag
src/lib/utils.ts:439  out = out.replace(/<img\b/i, `<img width="${width}" height="${height}"`);
src/lib/utils.ts:444  out = out.replace(/<img\b/i, '<img decoding="async"');
src/lib/utils.ts:448  out = out.replace(/<img\b/i, '<img loading="lazy"');
```

</details>
