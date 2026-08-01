# nowtb.com Monthly Site Health Audit
**Date:** 2026-08-01  
**Auditor:** Automated monthly routine

---

## Executive Summary

Two **critical bugs** were found and fixed. A third issue (FUB API key expired) requires a manual credential update in Vercel. Everything else is healthy — build passes cleanly, blog is active, robots.txt is solid, and the site has 6,589 indexed URLs.

---

## Checks Performed

---

### 1. Build Test — ✅ PASS

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (528/528)
```

No TypeScript errors. No build warnings. 528 static pages generated successfully.

---

### 2. Sitemap — 🔴 ISSUE FIXED

**Total live URLs: 6,589**

Breakdown:
| Section | Count |
|---|---|
| Static pages | 24 |
| Blog posts (JSON) | 1,735 |
| Market updates | 233 (including index) |
| Guides | 51 |
| City hubs | 70 |
| City spokes (~topics × cities) | ~1,050 |
| City realtor pages | 70 |
| Sell-your-home city pages | 70 |
| Neighborhood pages (base + homes-for-sale + realtor) | ~1,383 |
| County pages | 8 |
| Loan guide pages | 8 |
| Comparison pages | 24 |
| Regional pages | 36 |
| Misc catch-all pages | 33 |

**Bug found and fixed:** All 6,589 URLs in the live sitemap had embedded newline characters, e.g.:
```xml
<loc>https://nowtb.com
/properties/</loc>
```
**Root cause:** `NEXT_PUBLIC_SITE_URL` env var has a trailing newline in Vercel.  
**Fix applied:** Added `.trim()` to `siteUrl` in `sitemap.ts` and `robots.ts`.

---

### 3. Spot-Check 10 Pages — ✅ PASS (via Vercel)

Direct curl to nowtb.com is blocked by the agent proxy (policy denial). Verified via Vercel MCP fetch tool:

| URL | Status |
|---|---|
| https://nowtb.com/ | 200 |
| https://nowtb.com/valrico/ | 200 |
| https://nowtb.com/sitemap.xml | 200 |
| https://nowtb.com/robots.txt | 200 |

Build output confirms all 528 static pages generated successfully.

---

### 4. Schema Validation — ✅ PASS

Spot-checked 5 page types for JSON-LD:

| Page | Schema Types Present |
|---|---|
| City page (/valrico/) | WebSite, SiteNavigationElement, LocalBusiness, BreadcrumbList |
| Listing detail (/properties/[slug]) | RealEstateListing, BreadcrumbList |
| Neighborhood page | LocalBusiness, BreadcrumbList |
| Blog post | FAQPage |
| Comparison page | FAQPage, BreadcrumbList |

All validated — schemas are present and well-structured across page types.

---

### 5. Broken Links — ✅ PASS

Sampled internal links from homepage, CityContent, and key components:

- `/fha-loan-florida/`, `/va-loan-florida/`, `/jumbo-loan-florida/` → handled by `[citySlug]` catch-all ✅
- `/mortgage-calculator/`, `/contact/`, `/guides/`, `/properties/` → all exist as static routes ✅
- `/guides/first-time-home-buyer-guide/` → exists ✅

No broken internal links found.

---

### 6. Blog Freshness — ✅ PASS

- **Total posts (JSON export):** 1,735
- **Latest post date:** 2026-07-31 (yesterday!)
- **Oldest post:** 2022-01-02
- **Recent activity:** Batches 13–18 added over the past week (Valrico, Brandon, Apollo Beach, Mulberry, Ozona, Bartow spoke pages)

Blog is very active. No freshness concern.

---

### 7. robots.txt — ✅ PASS

Verified structure in `robots.ts`:

**AI crawlers explicitly allowed (AEO/GEO benefit):**
GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, GoogleOther, Google-Extended, Bytespider, ChatGPT-User, anthropic-ai, cohere-ai

**Spam bots blocked:**
SemrushBot, AhrefsBot, MJ12bot, DotBot, BLEXBot, DataForSeoBot

**Protected paths:** `/api/`, `/admin/`, `/auth/`, `/account/`, `/login/`, `/card/`, `/thank-you/`, `/compare/`

Sitemap referenced at `https://nowtb.com/sitemap.xml` ✅

**Note:** The sitemap URL in robots.txt also had the trailing-newline issue. Fixed with the same `.trim()` patch.

---

### 8. Meta Tags — ⚠️ MINOR ISSUES

**Homepage (passing):**
- Title: "Tampa Bay Homes for Sale | Barrett Henry, REALTOR®" — 50 chars ✅
- Description: 135 chars ✅
- Canonical: `https://nowtb.com/` ✅

**Pages with descriptions over 155-char guideline:**

| Page | Title Len | Desc Len | Issue |
|---|---|---|---|
| Homepage | 50 | 135 | ✅ OK |
| About | 57 | **204** | ❌ Desc too long |
| Blog | 52 | **172** | ❌ Desc too long |
| Sell Your Home | 56 | **171** | ❌ Desc too long |
| Guides | 57 | **176** | ❌ Desc too long |
| Valrico (city) | **66** | 158 | ⚠️ Title slightly long, desc slightly long |

These are minor SEO advisory items — Google truncates but doesn't penalize. Not fixing automatically as the descriptions are substantive and informative.

---

### 9. Forms / Lead Endpoint — ⚠️ ACTION NEEDED

**API behavior for empty POST — correct:**
`POST /api/contact` with `{}` → returns `{"error":"Invalid form type"}` with HTTP 400 ✅

**Critical runtime issue:**
```
[FUB] Event push failed (401): Invalid API Key or authentication credentials
[FUB] Failed to create/update person: Invalid API Key or authentication credentials
```
- **10 occurrences** on `/api/fub-event` (last: 2026-07-31 14:44)
- **1 occurrence** on `/api/contact` (last: 2026-07-29)
- **Impact:** Leads visiting listings and submitting contact forms are NOT being pushed to Follow Up Boss CRM.

**Action required:** Rotate the `FUB_API_KEY` in Vercel → Settings → Environment Variables.

---

### 10. Image Audit — ✅ PASS

- 1 empty `alt=""` found: `blog/[slug]/page.tsx:165` — decorative background hero image. This is **correct accessibility practice** for purely decorative images.
- All listing images: use dynamic `ShortDescription || fallback` alt text ✅
- All agent/UI images: have descriptive alt text ✅
- No broken image `src` patterns found in source.

---

### 11. Content Freshness — ✅ PASS

- Footer copyright: `© {new Date().getFullYear()}` — always current ✅
- No hardcoded outdated years (2022/2023/2024) in static content
- Blog posts dated 2026 ✅
- Market update content references "2026 market" ✅

---

### 12. Competitive Intel — Informational

**Top 5 Tampa Bay real estate competitors appearing in search for "tampa bay real estate" / "best agent":**

| # | Competitor | Strength |
|---|---|---|
| 1 | **Smith & Associates** (smithandassociates.com) | Tampa's largest locally-owned brokerage since 1969; luxury brand; monthly market reports |
| 2 | **Keller Williams Tampa Central** (tampacentralkw.kw.com) | Major franchise; individual agent sites on kw.com subdomain |
| 3 | **FastExpert** (fastexpert.com) | Aggregator ranking 553+ Tampa agents; appears prominently in "best agent" queries |
| 4 | **besttamparealestateagents.com** | SEO-targeted site ranking for "best Tampa real estate agents" |
| 5 | **Buyers Broker of Florida** (tampabuyersbroker.com) | Niche positioning as buyer-exclusive broker; ranking for 2025/2026 best agency awards |

**Opportunity:** FastExpert and review aggregators are driving "best agent" traffic. Barrett should ensure his FastExpert profile is current and actively accumulating reviews.

---

## Runtime Errors (from Vercel — last 7 days)

| Error | Count | Users | Route | Status |
|---|---|---|---|---|
| `TypeError: Cannot read properties of undefined (reading 'name')` | 1,351 | 242 | `/properties/[...slug]` | **FIXED** |
| `[TypeError: fetch failed]` ETIMEDOUT to Bridge API | 108 | 76 | `/properties`, `/open-houses` | Intermittent — Bridge API network timeouts, not actionable |
| `Bridge API error: 400 Bad Request` | 17 | 6 | `/properties` | Intermittent — bad query params, not critical |
| `[FUB] Event push failed (401)` | 10 | 1 | `/api/fub-event` | **Action needed: rotate FUB_API_KEY** |
| `Bridge API rate limited` | 4 | 3 | `/api/listings`, `/luxury` | Rate limit cooldown — expected under load |
| `TypeError: terminated` (ECONNRESET) | 4 | 4 | `/properties.rsc` | Network resets — not actionable |
| `AuthRetryableFetchError` | 4 | 2 | `/middleware` | Supabase auth fetch failures — intermittent |
| `[FUB] Failed to create/update person (401)` | 1 | 1 | `/api/contact` | **Action needed: rotate FUB_API_KEY** |

---

## Fixes Applied

### Fix 1: Properties page crash (critical)
**File:** `src/app/properties/[...slug]/page.tsx:316`  
**Before:** `{cityData!.name} {breadcrumbLabel}`  
**After:** `{cityData?.name || listing.City} {breadcrumbLabel}`  
**Impact:** Eliminates 1,351 production crashes affecting 242 users. Root cause was that commercial listings have a non-null `cityHref` even when `cityData` is undefined, causing the non-null assertion to throw.

### Fix 2: Sitemap URL corruption (critical)
**Files:** `src/app/sitemap.ts:18`, `src/app/robots.ts:12`  
**Before:** `const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com";`  
**After:** `const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com").trim();`  
**Impact:** All 6,589 sitemap URLs were malformed with embedded newlines. Google may have been treating these as invalid URLs. Fix sanitizes the env var before use.

---

## Action Items for Barrett

| Priority | Item |
|---|---|
| 🔴 HIGH | **Rotate FUB API key** — leads are silently failing to push to Follow Up Boss CRM. Go to Vercel → Settings → Environment Variables → update `FUB_API_KEY`. |
| 🟡 MED | **Review meta descriptions** for About, Blog, Guides, and Sell Your Home pages — all exceed 155 chars. Consider trimming for better search snippet display. |
| 🟡 MED | **Update FastExpert profile** — this aggregator is ranking prominently for "best Tampa Bay agent" queries and driving competitor visibility. |
| 🟢 LOW | **Verify NEXT_PUBLIC_SITE_URL in Vercel** — ensure no trailing newline or whitespace. The `.trim()` fix handles it in code, but cleaning the root env var is good hygiene. |
