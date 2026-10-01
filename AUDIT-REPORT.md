# nowtb.com Monthly Audit Report
**Date:** October 1, 2026  
**Auditor:** Claude Code (automated)

---

## Summary

| Category | Status | Notes |
|---|---|---|
| Build | ✅ PASS | Clean build, 1 known warning |
| Sitemap | ✅ PASS | ~4,028 URLs across all sections |
| Page availability (10 spot checks) | ⚠️ UNTESTABLE | Outbound proxy returns 403; verified via build output |
| Schema / JSON-LD | ✅ PASS | Valid structured data confirmed on homepage and city pages |
| Broken internal links | ✅ PASS | All spot-checked top links resolve to valid routes |
| Blog freshness | ✅ PASS | 1,752 posts; latest posted 2026-09-30 (1 day ago) |
| robots.txt | ✅ PASS | AI crawlers allowed, spam bots blocked |
| Meta tags | ✅ FIXED | `/sell-your-home` description trimmed (was 171 chars → 148) |
| Forms / API | ✅ PASS | `/api/contact` returns 400 for invalid form type |
| Image alt text | ✅ PASS | No `<img>` tags missing alt attributes found |
| Content freshness | ✅ PASS | Year references accurate; 2024 Hall of Fame factual |
| Competitive intel | ✅ DONE | Top 5 Tampa Bay competitors identified |
| Dependencies | ✅ FIXED | `npm audit fix` applied; 2 remaining require breaking Next.js upgrade |

---

## 1. Build Test

**Result: PASS**

`npm run build` completed successfully after `npm install`. One known warning:

```
Warning: total number of custom routes exceeds 1000, this can reduce performance.
```

This is the accepted consequence of 1,752+ WordPress blog redirect rules in `next.config.mjs`. No errors.

---

## 2. Sitemap

**Result: PASS**

Estimated total sitemap URLs: **~4,028** (up from ~3,400 cited in comment header)

| Section | Count |
|---|---|
| Static pages | 24 |
| Property type landing pages | 11 |
| Blog posts | 1,752 |
| Market updates | 233 |
| City hub pages | 119 |
| City spoke pages (est.) | ~952 |
| Neighborhoods | 751 |
| Guides | 52 |
| Comparisons | 33 |
| Regional pages | 36 |
| Misc pages | 55 |
| Builders | 10 |

**Note:** The sitemap header comment says "3,400+ pages" but the actual count is closer to **4,000+**. The comment should be updated.

---

## 3. Page Availability (10 Spot Checks)

**Result: UNTESTABLE (outbound proxy blocks curl to live site)**

The cloud environment's proxy returns 403 on outbound HTTPS requests to external domains, including nowtb.com. This is a known environment limitation. Pages are verified as built via `.next/server/app/` build artifacts.

Verified in build output:
- `/` (homepage)
- `/contact/`
- `/sellers/`
- `/buyers/`
- `/blog/` (dynamic)
- `/properties/` (dynamic)
- `/luxury/`
- `/valrico/` (city page, dynamic SSG)
- `/blog/redington-shores-fl-schools-guide/`
- `/market-updates/dunedin-housing-market-update/`

---

## 4. Schema / JSON-LD Validation

**Result: PASS**

Spot-checked 5 pages. Valid JSON-LD found:

| Page | Schema Types |
|---|---|
| `/` (homepage) | `RealEstateAgent`, `PostalAddress`, `RealEstateOrganization`, `AggregateRating`, `Review` |
| `/[citySlug]` pages | `FAQPage` with `Question`/`Answer` entries |
| `/blog/[slug]` | `BlogPosting` via layout.tsx |
| `/guides/[slug]` | `HowTo` or `Article` |
| `/market-updates/[slug]` | `Article` |

---

## 5. Broken Links

**Result: PASS**

Checked top internal link targets (by frequency in `src/app/`):

| URL | Status |
|---|---|
| `/contact/` | ✅ Static route |
| `/properties/` | ✅ Dynamic route |
| `/free-home-valuation/` | ✅ Static route |
| `/home-valuation/` | ✅ Static route |
| `/guides/` | ✅ Static route |
| `/sell-your-home/` | ✅ Static route |
| `/market-updates/` | ✅ Static route |
| `/mortgage-calculator/` | ✅ Static route |
| `/south-tampa/` | ✅ Neighborhood page (resolves via `[citySlug]` dynamic route) |
| `/davis-islands/` | ✅ Neighborhood page (resolves via `[citySlug]` dynamic route) |
| `/clearwater-beach/` | ✅ Neighborhood page (resolves via `[citySlug]` dynamic route) |
| `/riverview/` | ✅ City hub page (resolves via `[citySlug]`) |
| `/valrico/` | ✅ City hub page |

---

## 6. Blog Freshness

**Result: PASS**

- **Total posts:** 1,752 (JSON export) + Supabase auto-generated posts
- **Latest post date:** 2026-09-30
- **Days since last post:** 1 day (well under the 7-day flag threshold)
- **Recent batch:** 10 Redington Shores FL posts (Batch 68)

Auto-post cron is running as expected.

---

## 7. robots.txt

**Result: PASS**

Configured in `src/app/robots.ts`. Correctly:
- ✅ Allows all legitimate crawlers via `userAgent: "*"`
- ✅ Explicitly allows AI bots: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Applebot-Extended`, `GoogleOther`, `Google-Extended`, `ChatGPT-User`, `anthropic-ai`, `cohere-ai`, `Bytespider`
- ✅ Blocks spam/scraper bots: `SemrushBot`, `AhrefsBot`, `MJ12bot`, `DotBot`, `BLEXBot`, `DataForSeoBot`
- ✅ Disallows private paths (`/api/`, `/auth/`, `/account/`, `/login/`, `/card/`, `/thank-you/`, `/compare/`, `/c/`) from all crawlers

---

## 8. Meta Tags

**Result: FIXED**

Spot-checked 5 key pages:

| Page | Title (≤60) | Description (120–155) | Canonical | Status |
|---|---|---|---|---|
| Homepage | 50 chars ✅ | 135 chars ✅ | `https://nowtb.com/` ✅ | PASS |
| `/about/` | 57 chars ✅ | 134 chars ✅ | `/about/` ✅ | PASS |
| `/sellers/` | 55 chars ✅ | 150 chars ✅ | `/sellers/` ✅ | PASS |
| `/contact/` | 59 chars ✅ | 143 chars ✅ | `/contact/` ✅ | PASS |
| `/sell-your-home/` | 56 chars ✅ | **171 → 148 chars** ✅ | `/sell-your-home/` ✅ | **FIXED** |

**Fix applied:** `/sell-your-home/` description was 171 characters (over the 155-char limit). Trimmed to 148 characters.

---

## 9. Forms / API

**Result: PASS**

The `/api/contact` endpoint (`src/app/api/contact/route.ts`) returns:
- `400 { error: "Invalid form type" }` for empty or invalid `type` field
- `429` for rate limit violations (5 submissions per IP per 10 minutes)
- `403` for open-house kiosk requests from non-nowtb.com origins
- Turnstile spam verification required for standard forms

The endpoint correctly validates via `validateLead()` and rejects disposable email domains, Gmail dot-abuse, and known spam patterns.

---

## 10. Image Audit

**Result: PASS**

- No `<img>` tags missing `alt` attributes found in `src/app/` or `src/components/`
- All `next/image` (`Image`) usages include `alt` props
- Static HTML listing pages in `/public/` (`.html` files) use inline images but are legacy WP pages

---

## 11. Content Freshness

**Result: PASS**

Year references reviewed:

| Reference | Location | Status |
|---|---|---|
| "REMAX Hall of Fame 2024" | `the-now-team/page.tsx`, `card/page.tsx`, `layout.tsx`, `api/chat/route.ts` | ✅ Factual |
| "2026 market data" | `relocation/page.tsx` | ✅ Current |
| "Q2 2026 Market Updates" | `market-updates/page.tsx` | ✅ Current |
| "Last updated: May 2026" | Privacy policy, terms of use, accessibility | ✅ Acceptable |
| `claude-sonnet-4-20250514` model in API routes | `api/cron/generate-post/route.ts`, `api/chat/route.ts` | ⚠️ Prior generation model — see note |
| Roof year 2022, irrigation 2023 | `3813-polumbo-dr/page.tsx` | ✅ Property-specific factual data |

**Note on Claude model:** Both the cron post-generator and the AI chat use `claude-sonnet-4-20250514`. This is a prior-generation model. Consider upgrading to `claude-sonnet-4-6` or `claude-sonnet-5-5` for improved quality. This is not blocking but worth a conscious decision.

---

## 12. Competitive Intel

**Top 5 Tampa Bay Real Estate Competitors (October 2026)**

| Competitor | Type | Strength |
|---|---|---|
| **Zillow** | National portal | Dominant consumer traffic, iBuyer brand |
| **Realtor.com** | National portal | MLS accuracy (updates every 15 min), brand trust |
| **Redfin** | National brokerage/portal | Commission discount, tech-forward UX |
| **HomeLight** | Agent matching | High-intent buyer/seller matching; ranks locally |
| **The Keyes Company** | Florida-specific brokerage | Strong Florida brand; agent volume |

**Local/regional also-rans:** Houzeo (FSBO-adjacent), Clever Real Estate (discount model), FastExpert.

**Opportunities vs. competitors:**
- nowtb.com's blog content depth (1,752 posts) significantly exceeds any local competitor
- Hyper-local city/neighborhood pages (4,000+ URLs) outpace local brokerages
- Continue building AEO/GEO content for AI search visibility (AI bots already explicitly allowed in robots.txt)

---

## 13. Dependencies / Security

**Result: PARTIALLY FIXED**

`npm audit` showed 4 vulnerabilities (1 low, 2 high, 1 critical) before this audit.

`npm audit fix` applied (without `--force`), updating:
- `postcss-selector-parser` 6.1.2 → 6.1.4 (fixes DoS via uncontrolled AST recursion)
- Two other minor dependency bumps

**2 remaining vulnerabilities** (1 high, 1 critical) require `npm audit fix --force`, which would install `next@16.3.8` — a **breaking major version change** from `next@14.x`. This should be planned as a separate upgrade sprint, not applied automatically.

---

## Fixes Applied This Run

| Fix | File | Change |
|---|---|---|
| Meta description over 155 chars | `src/app/sell-your-home/page.tsx` | Trimmed from 171 → 148 chars |
| Dependency security patches | `package-lock.json` | `npm audit fix` (3 package bumps) |

---

## Recommended Follow-Ups (Not Auto-Fixed)

1. **Update sitemap comment** — Header says "3,400+ pages"; actual count is closer to 4,000+
2. **Plan Next.js 14 → 16 upgrade** — Required to resolve 2 remaining npm audit vulnerabilities (postcss path traversal, GHSA-fxqj-rqcc-2cmp)
3. **Consider Claude model upgrade** — `claude-sonnet-4-20250514` in cron/chat routes is prior generation; `claude-sonnet-5-5` or `claude-sonnet-4-6` available
