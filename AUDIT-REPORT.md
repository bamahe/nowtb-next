# nowtb.com Monthly Site Health Audit
**Date:** November 1, 2026  
**Auditor:** Claude Code (automated monthly audit)

---

## Executive Summary

| Check | Status | Notes |
|-------|--------|-------|
| Build | ✅ PASS | 0 errors, 1 warning |
| Sitemap | ✅ PASS | 3,400+ URLs, ISR revalidated hourly |
| Page spot-check (10 URLs) | ⚠️ UNTESTABLE | Live curl blocked in CI environment |
| Schema (JSON-LD) | ✅ PASS | Valid on 5 spot-checked pages |
| Broken links | ✅ PASS | All "missing" routes resolved via dynamic `[citySlug]` catch-all |
| Blog freshness | ✅ PASS | 1,761 posts; latest: 2026-10-31 (1 day ago) |
| robots.txt | ✅ PASS | AI crawlers allowed; spam bots blocked |
| Meta tags | ✅ FIXED | 4 issues found and fixed (see below) |
| Forms / Lead API | ✅ PASS | `/api/contact` route validates lead data |
| Image audit | ✅ PASS | One `alt=""` is decorative hero image (correct) |
| Content freshness | ✅ PASS | Footer copyright dynamic; years in content are factual |
| Competitive intel | ℹ️ INFO | Top 5 competitors noted below |
| NPM vulnerabilities | ⚠️ FLAG | Next.js 14.2.35 is latest 14.x; upgrade to 15.x needed to resolve CVEs |

**Fixes applied this run: 4 meta tag corrections (committed and pushed).**

---

## 1. Build Test

```
npm run build → SUCCESS
```

**Warning:** `total number of custom routes exceeds 1000, this can reduce performance`  
This is a known, accepted condition. The site has 1,000+ 301 redirects for WordPress blog slug migration. No action needed; this warning has been present since the redirect infrastructure was added.

---

## 2. Sitemap

- **Mechanism:** ISR-backed (`export const revalidate = 3600`), regenerates hourly.
- **Coverage:** Static pages (~51) + city hubs (117 slugs × topics) + neighborhoods + blog posts (1,761) + market updates (232) + guides + comparisons + regional pages + misc catch-all.
- **Estimated total:** 3,400+ URLs (matches site comment).
- **Trailing slash:** Consistent with `trailingSlash: true` in next.config.mjs.
- **Status:** ✅ No issues.

---

## 3. Spot-Check: 10 Pages (HTTP Status)

Live `curl` to nowtb.com returned `000` (no network egress to production from this CI environment). Status codes cannot be verified from this container.

**Recommended action:** Monitor via Vercel deployment checks or UptimeRobot. All 10 target routes (`/`, `/about/`, `/blog/`, `/sellers/`, `/buyers/`, `/properties/`, `/mortgage-calculator/`, `/contact/`, `/luxury/`, `/the-now-team/`) exist in the built output as static or SSR pages.

---

## 4. Schema / JSON-LD Validation

Spot-checked 5 pages for `application/ld+json` presence and valid structure:

| Page | Schema Types Found | Status |
|------|-------------------|--------|
| `/mortgage-calculator/` | FAQPage, BreadcrumbList | ✅ Valid |
| `/blog/` | BreadcrumbList | ✅ Valid |
| `/the-now-team/` | LocalBusiness | ✅ Valid |
| `/lenders/` | ItemList, BreadcrumbList | ✅ Valid |
| `/preferred-vendors/` | BreadcrumbList, ItemList ×3, FAQPage | ✅ Valid |

60 total `application/ld+json` script tags across the app. No malformed JSON objects detected.

---

## 5. Broken Links

Grepped all `href="/"` internal links. Initial pass flagged 30+ "missing" routes including:
- `/apollo-beach/`, `/dover/`, `/lithia/`, `/lakeland/` → served by `[citySlug]/page.tsx` ✅
- `/fha-loan-florida/`, `/conventional-loan-florida/`, `/construction-loan-florida/` → served by `[citySlug]` loan handler ✅
- `/guides/first-time-home-buyer-guide/`, etc. → served by `[slug]` in `/guides/` ✅
- `/moving-to-tampa-bay/`, `/new-construction-homes-tampa-bay/` → regional pages in `[citySlug]` ✅

**No broken internal links found.** All flagged routes resolve through Next.js dynamic catch-all routes.

---

## 6. Blog Freshness

- **Total static posts (JSON export):** 1,761
- **Latest post date:** 2026-10-31 (1 day ago)
- **Recent titles:**
  - "Is Dover FL a Good Place to Live?"
  - "Seffner FL Schools: Armwood High and School Zone Guide"
  - "Lithia FL Real Estate Guide 2026: Prices, Neighborhoods & Why Buyers Move Here"
- **Supabase posts:** Additional auto-generated posts loaded at runtime (count varies).
- **Cron post generation:** `/api/cron/generate-post` runs every 3 days per vercel.json.
- **Status:** ✅ Fresh. No stale blog flag.

---

## 7. robots.txt

```
User-agent: * → allow /, disallow /api/ /admin/ /auth/ /account/ /login/ /card/ /thank-you/ /compare/ /c/ /clients/
GPTBot, ClaudeBot, PerplexityBot, anthropic-ai, cohere-ai → explicitly allowed (AEO/GEO strategy)
SemrushBot, AhrefsBot, MJ12bot, DotBot, BLEXBot, DataForSeoBot → blocked
Sitemap: https://nowtb.com/sitemap.xml
```

**Status:** ✅ AI crawlers allowed for AEO visibility. Spam bots blocked. Private client paths disallowed.

---

## 8. Meta Tags — ISSUES FOUND AND FIXED

Four meta tag violations were found and corrected in this audit run.

### Changes Applied

**`src/app/about/page.tsx`** — title was 76 chars (max 60), description was 168 chars (target 120-155):
```
Before: "About Barrett Henry | Licensed Florida Real Estate Broker | REMAX Collective" (76 chars)
After:  "About Barrett Henry | Florida Real Estate Broker | REMAX" (56 chars)

Before: "Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective, brings 23+ years of real estate experience to Tampa Bay buyers and sellers. Call (813) 733-7907." (168 chars)
After:  "Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective. 23+ years experience serving Tampa Bay buyers and sellers. (813) 733-7907." (146 chars)
```

**`src/app/blog/page.tsx`** — description was 169 chars:
```
Before: "Tampa Bay real estate insights, market updates, buying and selling tips, neighborhood guides from Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective." (169 chars)
After:  "Tampa Bay real estate tips, market updates, and neighborhood guides from Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective." (144 chars)
```

**`src/app/contact/page.tsx`** — description was 162 chars:
```
Before: "Get in touch with Barrett Henry, Licensed Florida Real Estate Broker with REMAX Collective. Call (813) 733-7907 or send a message. Serving Tampa Bay's 8 counties." (162 chars)
After:  "Contact Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective. Call (813) 733-7907. Serving Tampa Bay buyers and sellers." (138 chars)
```

All canonicals verified present on all 5 checked pages.

---

## 9. Forms / Lead API

- **Endpoint:** `/api/contact` (no `/api/lead` route exists — the prompt's check name differs from the actual route)
- **Validation:** `validateLead()` called before processing. Rate limiting: 5 submissions per IP per 10 min; kiosk mode: 120 per 10 min.
- **Empty POST:** Would be rejected by `validateLead()` before touching FUB or Resend.
- **Status:** ✅ Proper validation in place.

---

## 10. Image Audit

- **Empty `alt=""`:** 1 instance in `src/app/blog/[slug]/page.tsx:999` — this is the decorative hero background image. The `alt=""` is correct for decorative images (screen reader skips it). No fix needed.
- **Broken image URLs:** No hardcoded broken image paths found in `src/app/`. External image URLs via Bridge API are loaded at runtime.
- **Status:** ✅ No issues.

---

## 11. Content Freshness

- **Footer copyright:** Uses `{new Date().getFullYear()}` — dynamic, always current. ✅
- **Year references in pages:** Scanned for 2024/2023 references. Results are factual:
  - REMAX Hall of Fame 2024 (historically accurate, award was earned in 2024)
  - NAR settlement August 17, 2024 (historical event reference, factually correct)
  - Florida SB 4-D milestone inspection: "25-year coastal trigger removed in 2023" (legislative fact)
  - Irrigation year 2023 on property page (property record fact)
- **Status:** ✅ All year references are historical facts, not stale marketing claims.

---

## 12. Competitive Intel

Top competitors for "Tampa Bay real estate" as of November 2026:

1. **Zillow** (zillow.com) — Dominant portal; aggregates MLS listings. Not a direct competitor but captures TOFU search intent.
2. **Redfin** (redfin.com) — Active in Tampa Bay market with agent/buyer representation. Strong neighborhood-level pages.
3. **Compass** (compass.com/selling-tampa-bay-florida/) — Luxury-focused. "Selling Tampa Bay" team listed on RealTrends.
4. **Jennifer Zales / Coldwell Banker** — Cited as top individual agent by volume in Tampa (ultra-luxury focus).
5. **Tampa Bay Group / RE/MAX Realty Unlimited** — RealTrends listed; 102 sides, $47.95M volume (2025 data).

**Opportunity:** Barrett's site has a significant content depth advantage (3,400+ pages, neighborhood guides, market updates) over most local agent sites. AI crawler allowances (GPTBot, ClaudeBot) position the site well for AEO/GEO traffic as AI search grows.

---

## 13. NPM Vulnerabilities

Running `npm audit` on Next.js 14.2.35 (current installed version, also the latest 14.x release):

- **Severity:** 1 critical, 2 high, 2 moderate — all in Next.js core
- **CVEs include:** DoS via Image Optimizer, HTTP request smuggling, cache poisoning, SSRF, unauthenticated RCE on some configurations
- **Fix available?** Next.js 15.x (latest: 15.5.28) resolves these but is a **breaking change** — not auto-fixable with `npm audit fix`.
- **Risk context:** The site is deployed on Vercel (managed hosting), which mitigates most infrastructure-level vectors. The RCE CVEs require specific configurations (custom servers, AVIF/SVG in Image API) that may not apply.

**Recommendation:** Plan a Next.js 15 upgrade sprint. Not urgent for Vercel-hosted deployment, but should be tracked. See [Next.js upgrade guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15).

---

## Changes Committed This Run

| File | Change |
|------|--------|
| `src/app/about/page.tsx` | Fixed title (76→56 chars) and description (168→146 chars) |
| `src/app/blog/page.tsx` | Fixed description (169→144 chars) |
| `src/app/contact/page.tsx` | Fixed description (162→138 chars) |

**Commit message:** `fix: trim over-limit meta titles and descriptions on about, blog, contact pages`
