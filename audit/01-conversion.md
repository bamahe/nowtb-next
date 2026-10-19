# nowtb.com — Conversion Rate Optimization Audit
**Branch:** `seo/lead-machine-oct2026` · **Date:** 2026-10-17 · **Scope:** read-only
**Question answered:** where does a visitor land, engage, and leave without becoming a lead?

---

## 0. Corrected page-count baseline

The brief's numbers were off in two places. Counts below are computed from the data files and are what every page count in this report uses.

| Template / route | Pages rendered | How counted |
|---|---|---|
| `src/app/blog/[slug]/page.tsx` | **1,760** | `posts-export.json` array length |
| `SpokePage` (inline, `[citySlug]/page.tsx:1234`) | **~1,674** | 93 cities × 18 generic topics (21 topics from `getCityTopics`, minus `neighborhood-guide`, `home-valuation`, `property-management` which dispatch elsewhere) |
| `NeighborhoodPage.tsx` | **1,440** | 720 sitemap-eligible neighborhoods × 2 shapes (`/{slug}/`, `/{slug}-homes-for-sale/`) — `sitemap.ts:144` |
| `RealtorPage.tsx` | **813** | 93 city-realtor + 720 neighborhood-realtor |
| `market-updates/[slug]/page.tsx` | **232** | `market-updates-export.json` length |
| `SellYourHomeCityPage.tsx` | **93** (186 URLs) | 93 cities × 2 accepted slug formats (`[citySlug]/page.tsx:135-145`) |
| `HubPage` (inline, `[citySlug]/page.tsx:744`) | **93** | `cities.ts` |
| `NeighborhoodGuidePage.tsx` | **93** | one `neighborhood-guide` spoke per city |
| `HomeValuationSpokePage` (inline, `:1476`) | **93** | one per city |
| `PropertyManagementSpokePage` (inline, `:1740`) | **93** | one per city |
| `guides/[slug]/page.tsx` | **50** | `guides.ts` |
| `RegionalPage.tsx` | **36** | `regional-pages.ts` |
| `ComparisonPage.tsx` | **33** | `comparisons.ts` |
| `MiscCatchAllPage.tsx` | **32** | `misc-pages.ts`, entries with `handling: "catch-all"` |
| `CountyPage.tsx` | **8** | `COUNTIES` at `[citySlug]/page.tsx:61` |
| `LoanGuidePage.tsx` | **8** | `LOAN_TYPES` at `[citySlug]/page.tsx:73` |
| `RemaxOfficePage.tsx` | **7** | `OFFICES` at `RemaxOfficePage.tsx:83` |
| `properties/[...slug]/page.tsx` | MLS-driven (thousands) | Bridge API |

**Two corrections to the brief:**
1. `MiscCatchAllPage.tsx` renders **32** pages, not 1,203. The 1,203 figure is the entry count in `src/data/pages-content.json` — a shared WordPress content store also read by `NeighborhoodPage.tsx:73`, `RegionalPage.tsx:24` and `CityContent.tsx:63` (`src/lib/page-content.ts:45`). It is not a page count for one template.
2. `cities.ts` contains **93–94** cities, not 119.

---

## 1. Top 10 lead-killers (ranked by pages affected × severity)

### #1 — `/seller-intake/` submits no Turnstile token, so the API 403s every submission
**Pages affected: 1 — but it is the highest-intent form on the site and loses 100% of submissions.**

`SellerIntakeForm.tsx` is the only lead form in the repo that imports no `TurnstileWidget` and sends no `turnstileToken` or `honeypot` in its request body:

```
src/components/ui/SellerIntakeForm.tsx:210-221
        body: JSON.stringify({
          type: "seller-intake",
          name, email, phone,
          source: "/seller-intake/",
          message: `Seller intake submitted for ${values.address || "an unspecified address"}.`,
          details,
          ...values,
          property: values.address ? { address: values.address } : undefined,
        }),
```

The API hard-rejects exactly this shape. `type: "seller-intake"` is not a kiosk type (`route.ts:119` only exempts `open-house` and `open-house-feedback`), so the missing-token gate fires:

```
src/app/api/contact/route.ts:166-175
    if (turnstileSecret && !isOpenHouseKiosk) {
      if (!turnstileToken) {
        console.warn(`[SPAM] Missing Turnstile token from IP ${ip} on "${type}" form`);
        return NextResponse.json(
          { error: "Spam verification required. Please reload the page and try again." },
          { status: 403 }
        );
```

The form then shows its generic failure copy (`SellerIntakeForm.tsx:226-231`): *"That did not go through. Call or text (813) 733-7907 and I will take it down directly."* A seller who just filled out 33 optional fields plus name/email/phone is told to start over by phone.

Severity: this is the deepest-intent form on the site (33 fields of seller detail) and **every** submission fails whenever `TURNSTILE_SECRET_KEY` is set in Vercel. Nothing reaches FUB, nothing reaches Resend.

**Fix:** add `<TurnstileWidget onVerify={...} />` plus a honeypot and send both fields, matching `ContactForm.tsx:230` / `ValuationForm.tsx:637`. Belt-and-braces: add `"seller-intake"` to a same-origin-check allowlist like the kiosks use (`route.ts:144-154`) so a token failure never zeroes the form again.

---

### #2 — 1,760 blog posts have no lead form, no above-the-fold CTA, and a hard-coded seller CTA regardless of topic
**Pages affected: 1,760 (the single largest template on the site).**

`src/app/blog/[slug]/page.tsx` contains **zero form components** — no `ContactForm`, no `ValuationForm`, nothing. The only conversion surfaces are links:

- Hero (`:159-198`) is breadcrumb + `<h1>` + date. **No CTA above the fold on any of the 1,760 posts.**
- Mid-article CTA exists but is gated to one slug prefix: `blog/[slug]/page.tsx:201` — `{slug.startsWith("sell-home-fast") && (`. That matches **84** posts. **1,676 posts have no mid-article CTA at all.**
- End CTA (`:355-386`) is hard-coded seller copy on every post: `"Thinking About Selling?"` → `/free-home-valuation/` + `tel:`.
- Sidebar CTA (`:325-338`) is also seller-only: `"What's Your Home Worth?"`.

So a reader who arrives on an FHA-limits post, a buyer-guide post, or a market-data post is offered only *"Thinking About Selling?"*. Every buyer-intent blog visitor gets a seller offer or nothing.

**Fix:** (a) put a 3-field `ContactForm` in the sidebar so the 1,760 posts have an on-page capture, not just a link-out; (b) branch the CTA off post category/topic so buyer posts offer a buyer action (listing alerts / tour) and financing posts offer pre-approval; (c) insert a mid-article CTA unconditionally rather than only for `sell-home-fast*`.

---

### #3 — ~1,767 city hub + spoke pages have no lead form, only links
**Pages affected: 1,674 spoke + 93 hub = ~1,767.**

`HubPage` (`[citySlug]/page.tsx:744-1233`) and `SpokePage` (`:1234-1475`) are the site's biggest city-template surface and neither renders a form component. Grep for form imports inside those ranges returns nothing; the only conversion elements are `tel:` and `/contact/` links:

- `HubPage` hero: `[citySlug]/page.tsx:831` (`tel:+18137337907`) and `:837` (`/contact/`)
- `HubPage` end CTA: `:1200` / `:1206`
- `SpokePage` hero: `:1366` / `:1372`; mid: `:1416`; end: `:1453` / `:1459`

Compare `RealtorPage.tsx:838`, which *does* embed `<ContactForm webhookUrl="/api/contact" source={...} />`. The hub/spoke pages — which carry the MLS inventory and the commercial search intent — require the visitor to make a second navigation to `/contact/` before any form appears. Every extra click is drop-off.

**Fix:** drop the same `<ContactForm ... source={`${city.slug}-hub`} />` block into `HubPage` and `SpokePage` right after `<CityContent />`. One edit in each inline component covers ~1,767 pages.

---

### #4 — 1,440 neighborhood pages have no lead form
**Pages affected: 1,440.**

`src/components/pages/NeighborhoodPage.tsx` imports no form (only `getPageContent` at `:17`). Its conversion surfaces are three link clusters:

- Hero: `NeighborhoodPage.tsx:150` (`tel:`), `:156` (`/contact/`)
- Mid: `:335` → `/free-home-valuation/`
- End: `:381` (`tel:`), `:387` (`/contact/`)

These are long-tail pages pulling specific-neighborhood search traffic — the highest-intent organic visitor the site gets — and none of them can capture a lead without an extra page load.

**Fix:** add `<ContactForm source={`neighborhood-${slug}`} />` before the end CTA block. One edit, 1,440 pages.

---

### #5 — `/free-home-valuation/` asks 24 questions for a top-of-funnel offer
**Pages affected: 4 templates covering 190 URLs — `/free-home-valuation/`, `/sell-your-home/`, 93 `HomeValuationSpokePage` URLs, 93 `SellYourHomeCityPage` URLs (186 with both slug formats).**

`ValuationForm.tsx` is a **single-screen, 24-input form** (`grep -c "<input\|<select\|<textarea"` = 24) with no step wizard and no progressive disclosure — there is no `step`/`setStep`/`currentStep` state in the file. It asks, in one scroll: address, city, zip, beds, baths, sqft, year built, lot size, property type, stories, garage, pool, overall condition, kitchen updated, baths updated, roof age, HVAC age, recent upgrades, name, email, phone, timeline, notes.

Required fields are only 5 (`:207, :224, :238, :535, :552` — address, city, zip, name, email), but a visitor sees 24 before deciding to start. This is the destination of the seller CTA on all 1,760 blog posts (`blog/[slug]/page.tsx:333, :366`), so the highest-volume CTA on the site points at the highest-friction form on the site.

It also makes a worse promise than every other form on the site: `ValuationForm.tsx:164` — *"Barrett will prepare your CMA and get back to you within 24 hours"* — while `ContactForm.tsx:125`, `TourScheduler.tsx:195`, the homepage (`page.tsx:394`) and `/thank-you/` (`thank-you/page.tsx:31`) all promise **2 hours**. The lead is then redirected to `/thank-you/` (`ValuationForm.tsx:141`) which contradicts what they just read.

**Fix:** split into step 1 = address + name + email + phone (4 fields, submit here and the lead is captured), step 2 = optional property detail shown *after* submission on the thank-you path. Capture first, enrich second. Align the response promise to 2 hours.

---

### #6 — Exit-intent lead capture is fully built and switched off site-wide
**Pages affected: all ~3,400.**

`ExitIntentPopup.tsx` is a complete, working 3-variant capture (buyer / seller / market report — `:29-52`, with per-variant submit labels `"Send My Criteria"`, `"Get My Free CMA"`, `"Get My Free Report"`), posting to `/api/contact` at `:182` with Turnstile at `:359`. `ClientExitIntent` is still imported at `layout.tsx:10` — but the render is commented out:

```
src/app/layout.tsx:244-246
        {/* Exit-intent popup — DISABLED per Barrett's request
        <ClientExitIntent />
        */}
```

The cost is real: the abandoning-visitor capture layer is zero across every page, including the 1,676 blog posts that have no other on-page form (#2) and the ~1,767 hub/spoke pages that have none either (#3).

## ⛔ RESOLVED 2026-10-18 — SELLER PAGES ONLY. DO NOT RE-OPEN THIS

**Barrett's decision: the exit-intent popup runs on SELLER PAGES ONLY.** Not site-wide, and not off.

He first asked for it off, twice, and he was right to. Verbatim: *"turn the pop up back off on nowtb.com i dont like it"* / *"its too much"*, and when it reappeared, *"We were supposed to fix the fucking pop-up. It's still popping up."*

The setting was then flipped on and off **four times on production inside one hour** by different automated passes, each certain it knew the answer. He was finally asked with the conflict laid out plainly and a third option on the table, and chose **on for sellers only**.

That is not a reversal of his complaint — it answers it. *"Too much"* was true because the popup fired **everywhere**, including on people reading restaurant posts. `ClientExitIntent` now returns `null` unless the path matches `SELLER_PATTERNS`, so it only ever interrupts someone already weighing a six-figure decision, where a free valuation is a useful offer rather than an obstacle.

This item is **closed**. Do not widen the scope and do not switch it off on the strength of this document. A conversion audit will always argue for a popup and a UX pass will always argue against one; neither is a new decision. Change it only if Barrett tells you himself, in the current conversation.

Enforced by `scripts/weekly_audit.py::check_exit_intent_scope`, which fails on **both** a disable and a scope widening.

**The remaining valid finding stands, and it is the real work:** with exit-intent permanently off, #2 / #3 / #4 are **non-optional**. The 1,676 blog posts and ~1,767 hub/spoke pages need real inline forms, because there is now no fallback capture layer behind them. Fix those templates — do not reach for the popup as a shortcut.

---

### #7 — `ChatWidget` runs on every page and captures no contact information
**Pages affected: all ~3,400 (rendered via `layout.tsx:243`).**

`ChatWidget.tsx` is a pure Q&A surface. Grep for `api/contact`, `fub`, `email`, `phone`, `lead` across the 452-line file returns no capture logic. `src/app/api/chat/route.ts` proxies to the Anthropic Messages API (`:130-141`) and its only lead mechanic is a line of system-prompt text:

```
src/app/api/chat/route.ts:44
- Contact Barrett: /contact/
```

There is no `pushLeadToFub` call anywhere in the chat path. A visitor can ask five questions about a Valrico listing, signal real intent, and leave with nothing recorded — no name, no email, no FUB note, no transcript.

**Fix:** after 2–3 exchanges, inject an inline name + phone/email capture into the chat thread and POST it to `/api/contact` with `type: "contact"` and `source: "chat-widget"`. Attach the transcript as `message` so FUB shows what they asked.

---

### #8 — `/auburndale/gapway-lakes-estates/` is very likely in a permanent-redirect loop, taking its lead form offline
**Pages affected: 1 — the only hand-built pre-development community page, and it owns the `CommunityInterestForm`.**

Two rules point at each other:

```
next.config.mjs:372
{ source: "/:city((?!blog|api|auth|clients|properties|guides|images|wp-content|_next|compare|market-updates|builders|communities|account|sell|resources|3813-polumbo-dr|11417-cypress-park-st|30935-whitlock-dr).[^/]+)/:neighborhood((?!southoak).[^/]+)", destination: "/:neighborhood/", permanent: true }
```

`auburndale` is not in the first exclusion list, and the second lookahead excludes only `southoak` — so `/auburndale/gapway-lakes-estates/` matches and 308s to `/gapway-lakes-estates/`. That bare slug hits the catch-all, which sends it straight back:

```
src/app/[citySlug]/page.tsx:599-601
  const communityPage = getCommunityPageBySlug(citySlug);
  if (communityPage) {
    permanentRedirect(communityPage.href);
  }
```

`community-pages.ts:45` sets `href: "/auburndale/gapway-lakes-estates/"` — the URL the config rule just redirected away from. The presence of the `(?!southoak)` carve-out is strong evidence this rule does match nested two-segment paths; `southoak` was exempted for exactly this reason and `gapway-lakes-estates` never was. This matches the known pattern that new nested routes must be excluded from **both** `:city` flatten rules.

Collateral: the page at `src/app/auburndale/gapway-lakes-estates/page.tsx` holds the only `<CommunityInterestForm>` on the site (`:829`), is linked twice from components, and is referenced from the Auburndale hub and Polk county page via `getCommunityPagesByCity` / `getCommunityPagesByCounty`.

**Fix:** add `gapway-lakes-estates` to the `:neighborhood` lookahead at `next.config.mjs:372` alongside `southoak` (and to the `:city-:topic` rule at `:368` if a `-topic` variant is ever added). Verify live with `curl -I https://nowtb.com/auburndale/gapway-lakes-estates/` before and after — this one only breaks on the live domain, not locally.

---

### #9 — Every listing detail page buries its only form below ~190 lines of content on mobile, and never sticks it on desktop
**Pages affected: every `/properties/[...slug]` page (MLS-driven, thousands).**

`TourScheduler` (`properties/[...slug]/page.tsx:718`) is the only form on a listing page. It lives in the right-hand column of:

```
src/app/properties/[...slug]/page.tsx:530
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
src/app/properties/[...slug]/page.tsx:532
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
```

Two problems, both verifiable by grep:
- **No `order-` class anywhere in the file.** On mobile (`grid-cols-1`) the DOM order wins: the entire left column — description, property details, features, and the Google Maps iframe (`:660-676`) — renders before `TourScheduler`. That is ~190 lines of content between the price and the only form.
- **No `sticky` class anywhere in the file.** On desktop the form scrolls out of view and never comes back.

The only above-the-fold `tel:` on the page (`:387`, *"Schedule a Visit"*) is inside a conditional open-house block, so it is absent on most listings.

Contrast `blog/[slug]/page.tsx:241-242`, which does this correctly: `<aside className="lg:col-span-1 order-2 lg:order-1">` with `lg:sticky lg:top-24`.

**Fix:** wrap the form column in `order-1 lg:order-2` (form first on mobile) and add `lg:sticky lg:top-24` so it stays on screen while the buyer reads photos and details.

---

### #10 — No GA4 / GTM anywhere, so no lead is attributable to a page
**Pages affected: all ~3,400.**

`grep -rn "gtag\|dataLayer\|GA_ID\|GTM" src/` returns **zero** matches outside of the FUB pixel. `layout.tsx` loads only `@vercel/analytics` (`:250`) and `@vercel/speed-insights` (`:251`). There is no `NEXT_PUBLIC_GA_ID` reference in the codebase.

Consequence: `/thank-you/` fires no conversion event (`thank-you/page.tsx` has no tracking code), so there is no way to answer "which of the 1,760 blog posts produced a lead?" or "did the hub pages convert after we added a form?" Every fix in this report ships blind, and A/B testing is impossible.

**Fix:** add GA4 via `@next/third-parties/google` in `layout.tsx` behind `NEXT_PUBLIC_GA_ID`, fire a `generate_lead` event on `/thank-you/`, and pass the form `source` through as an event param — `source` is already threaded into every submission (`ContactForm.tsx:83`).

---

### Also serious, just below the top 10

**Silent-discard path returns a fake success.** `route.ts:231-241` returns `200 {success: true}` for rejected submissions by design (so bots don't tune around it). That logic is correct for bots but the rejection rules can catch real people: `lead-validation.ts:66-68` hard-rejects any Gmail local part with 3+ dots (`first.middle.last.jr@gmail.com` is rejected), and `:202-206` escalates to a hard reject whenever **two** soft flags co-occur — e.g. a mistyped phone *plus* a short vowel-less surname. When that fires, `ContactForm` shows *"Message Sent! Barrett will get back to you within 2 hours"* (`ContactForm.tsx:123-125`) and redirects to `/thank-you/`, and nothing reaches FUB. Recommend logging rejected payloads to a review queue (or emailing Barrett a digest) instead of discarding them outright.

**Phone number hidden on mobile in the header.** `Header.tsx:325` — `<div className="hidden md:flex items-center gap-6">` wraps the `tel:+18137337907` link at `:327`. This is the documented "phone visible on mobile, not hidden" rule being violated. Partly mitigated by `MobileBottomBar`, but the mobile header has **no CTA at all** — not a call button, not a contact button. `MobileNav.tsx:143` has the only mobile header-area `tel:` and it requires opening the drawer first.

**36 regional pages have no phone number anywhere.** `grep "tel:\|733-7907" src/components/pages/RegionalPage.tsx` returns **nothing**. The template is `HeroSection` + `SearchBar` + body + `ContactForm` (`:199`). "Phone number visible on every page" fails on all 36.

**8 loan guide pages have no above-the-fold CTA.** `LoanGuidePage.tsx:88-93` calls `<HeroSection title subtitle />` with **no children**, and `HeroSection.tsx:109` only renders the CTA slot when `children` is passed. First phone appears at `:246`, bottom of page.

**Rate limit can 429 a real household.** `route.ts:12` — `RATE_LIMIT_MAX = 5` per 10 minutes per IP. A couple comparing listings from one home or office IP can hit this; the 429 at `:130-136` surfaces to `ContactForm` as the generic *"Something went wrong"* (`ContactForm.tsx:101-103`) with no mention of waiting or of the phone fallback being the faster route.

**Turnstile never resets and has no expiry handler.** `TurnstileWidget.tsx` registers `callback` (`:53`) and `error-callback` (`:61`) but **no `expired-callback`** and never calls `turnstile.reset()`. Turnstile tokens expire after ~300s. A visitor who spends six minutes on `ValuationForm`'s 24 fields submits a stale token, which Cloudflare `siteverify` rejects at `route.ts:202-211` → 403 → the user sees *"Spam verification failed. Please reload the page and try again."* That is the documented "must auto-reset, never require a refresh" rule being violated, and it bites hardest on the longest form. Note the widget otherwise **fails open** correctly (`:37-40`, `:61-64`, `:67-70` emit sentinels that `route.ts:181-184` honors), and the in-code comment at `TurnstileWidget.tsx:56-58` states nowtb.com currently returns error `400020` (bad sitekey) — meaning **Turnstile is installed but enforcing nothing today**. Fixing the sitekey without first adding `expired-callback` + `reset()` would turn a silent no-op into an active lead blocker.

**`/preferred-vendors/` dead end.** `VendorCard.tsx:88` renders *"Contact details coming soon"* when a vendor has no phone — a referral page that terminates with nothing actionable.

---

## 2. CTA coverage matrix

Form = an actual form component rendered on the page. Link-only CTAs are counted in the CTA columns, not the form column.

| Template | Pages | Lead form | `tel:` link | Above-fold CTA | Mid CTA | End CTA |
|---|---|---|---|---|---|---|
| `blog/[slug]/page.tsx` | **1,760** | ❌ **none** | ✅ `:221, :263, :372` | ❌ **none** (`:159-198` title/date only) | ⚠️ **84 of 1,760** (`:201` gated to `sell-home-fast*`) | ✅ `:355` (seller-only copy) |
| `SpokePage` (`[citySlug]:1234`) | **~1,674** | ❌ **none** | ✅ `:1366, :1416, :1453` | ✅ `:1366/:1372` | ✅ `:1416` | ✅ `:1453/:1459` |
| `NeighborhoodPage.tsx` | **1,440** | ❌ **none** | ✅ `:150, :381` | ✅ `:150/:156` | ✅ `:335` → valuation | ✅ `:381/:387` |
| `RealtorPage.tsx` | **813** | ✅ `ContactForm :838` | ✅ `:220, :736, :835` | ✅ `:220/:226` | ✅ `:266, :736` | ✅ `:856/:859` |
| `market-updates/[slug]` | **232** | ✅ `ContactForm :270` | ✅ `:174, :209` | ✅ `:174` | ✅ `:180, :209` | ✅ `:270` |
| `SellYourHomeCityPage.tsx` | **93** (186 URLs) | ✅ `ValuationForm :307` | ✅ `:322, :335` | ⚠️ link-only `:140` → `/sell-your-home/`, **no phone in hero** | ✅ `:307` | ✅ `:332/:335` |
| `HubPage` (`[citySlug]:744`) | **93** | ❌ **none** | ✅ `:831, :1200` | ✅ `:831/:837` | ⚠️ FAQ prose only `:1038, :1048` | ✅ `:1200/:1206` |
| `NeighborhoodGuidePage.tsx` | **93** | ❌ **none** | ✅ `:119, :170, :243, :281, :321` | ✅ `:119/:125` | ✅ `:170, :281` | ✅ `:321/:327` |
| `HomeValuationSpokePage` (`:1476`) | **93** | ✅ `ValuationForm :1557` | ✅ `:1533, :1715` | ✅ `:1533/:1539` | ✅ `:1557` | ✅ `:1715/:1721` |
| `PropertyManagementSpokePage` (`:1740`) | **93** | ❌ **none** | ✅ `:1850, :2070` | ✅ `:1850` | ⚠️ FAQ prose only `:1751` | ✅ `:2070/:2076` |
| `guides/[slug]/page.tsx` | **50** | ✅ `ContactForm :388` | ✅ `:166, :211, :302, :333` | ✅ `:166` | ✅ `:211, :302` | ✅ `:388` |
| `RegionalPage.tsx` | **36** | ✅ `ContactForm :199` | ❌ **no phone anywhere on page** | ✅ `SearchBar :30` | ❌ none | ✅ `:199` |
| `ComparisonPage.tsx` | **33** | ✅ `ContactForm :395, :690` | ✅ `:332, :602, :607, :627` | ✅ `:332/:338` | ✅ `:395` | ✅ `:627/:633, :690` |
| `MiscCatchAllPage.tsx` | **32** | ✅ `ContactForm :97` | ✅ `:51` (fallback branch only) | ✅ `SearchBar :30` | ❌ none | ✅ `:97` |
| `CountyPage.tsx` | **8** | ❌ **none** | ✅ `:88, :249` | ✅ `:88/:94` | ❌ none | ✅ `:249/:250` |
| `LoanGuidePage.tsx` | **8** | ✅ `ContactForm :253` | ✅ `:246` only | ❌ **none** (`:88-93` HeroSection, no children) | ❌ none | ✅ `:253` |
| `RemaxOfficePage.tsx` | **7** | ✅ `ContactForm :2001` | ✅ `:1141, :1199, :1554, :1689, :1999` | ✅ `:1141/:1144` | ✅ `:1554, :1689` | ✅ `:2001, :2020/:2026` |
| `properties/[...slug]` | MLS (thousands) | ⚠️ `TourScheduler :718` — below ~190 lines on mobile, never sticky | ⚠️ `:387` conditional (open-house only), `:710` | ❌ **none** on most listings | ❌ none | ⚠️ `:718` |
| `compare/[slug]` | buyer-tool set | ❌ none | ❌ none | ❌ none | ❌ none | ❌ none (noindex private tool — `:26` — acceptable) |
| `builders/[slug]` | `builders.ts` | ❌ none | ✅ `:182` (`tel:8137337907`, no `+1`) | ✅ `:182` | ❌ none | ⚠️ `:188` link to `/contact/` |

### Templates rendering >50 pages with NO form — the money line

| Template | Pages with no on-page form |
|---|---|
| `blog/[slug]/page.tsx` | **1,760** |
| `SpokePage` | **~1,674** |
| `NeighborhoodPage.tsx` | **1,440** |
| `HubPage` | **93** |
| `NeighborhoodGuidePage.tsx` | **93** |
| `PropertyManagementSpokePage` | **93** |
| **Total** | **~5,153 page-renders** (counting both neighborhood URL shapes) |

Templates rendering >50 pages with **no above-the-fold CTA**: `blog/[slug]` — **1,760 pages**.

---

## 3. Form-by-form friction table

| Form | File | Required fields | Total visible fields | Submit label | Trust signals | Turnstile | Friction verdict |
|---|---|---|---|---|---|---|---|
| `ContactForm` | `ui/ContactForm.tsx` | **3** — name `:165`, email `:179`, message `:220` | 4 (phone optional `:200`) | `"Send Message"` default (`:51`) — generic, callers can override via `submitLabel` | ✅ license + years + brokerage + designations `:251-259`; 2-hour promise only in the *success* state `:125`, not next to the button | ✅ `:230`, gates submit `:235` | Good shape. Two issues: generic default label, and the response-time promise is invisible *before* submitting — it should sit under the button where it reduces hesitation. |
| `ValuationForm` | `ui/ValuationForm.tsx` | **5** — address `:207`, city `:224`, zip `:238`, name `:535`, email `:552` | **24** inputs/selects/textareas, single screen, no steps | `"Get My Free Valuation"` `:649` ✅ benefit-framed | ✅ `:658-666`; ✅ honeypot `:622-631` | ✅ `:637`, gates submit `:642` | **Worst friction on the site.** 24 fields for a top-of-funnel offer. Also promises 24 hours (`:164`) while `/thank-you/` promises 2. See #5. |
| `SellerIntakeForm` | `ui/SellerIntakeForm.tsx` | **2** — name `:266`, email `:276` | **33** optional fields + 3 contact (`:181 ALL_FIELDS`) | `type="submit"` at `:370` — **no benefit label found**; disabled only while submitting `:371` | ⚠️ "The only required section…" note `:258-261` is good friction-reduction copy; no credentials block | ❌ **NONE** | **Broken — 100% loss.** See #1. Separately: no honeypot, so if the Turnstile gate is bypassed it has no spam defense at all. |
| `CommunityInterestForm` | `ui/CommunityInterestForm.tsx` | **4** — name `:170`, phone `:189`, email `:208`, interest `:226` (pre-selected) | 5 (notes optional `:250`) | `"Get Updates"` `:44` ✅ | ✅ `:293`; ✅ honeypot `:259-265` | ✅ `:271`, gates submit `:275` | Well built. Only reachable page is the one in a likely redirect loop (#8). |
| `TourScheduler` | `ui/TourScheduler.tsx` | **3** — name `:323`, email `:342`, phone `:361` | 3 + date/time selection | `"Request Tour"` `:382` — functional, not benefit-framed | ✅ 2-hour confirm promise `:195` | ✅ `:370`, gates submit `:375` | Form is fine; **placement** is the problem (#9). No honeypot. |
| `ExitIntentPopup` | `ui/ExitIntentPopup.tsx` | **3** — name `:312`, email `:331`, phone `:350` | 3 | Per-variant: `"Send My Criteria"` / `"Get My Free CMA"` / `"Get My Free Report"` `:33/:42/:51` ✅ best labels on the site | variant-specific copy `:29-52` | ✅ `:359`, gates submit `:364` | **Never rendered** — `layout.tsx:244-246`. See #6. |
| `SearchBar` | `ui/SearchBar.tsx` | 1 (query) | 1 | `"Search"` `:47` | n/a | n/a | Not a lead form. Minor: pushes `/properties?q=` without a trailing slash (`:23`) while `next.config.mjs` sets `trailingSlash: true` → one extra 308 hop per search. |
| `ChatWidget` | `ui/ChatWidget.tsx` | — | — | — | — | — | **Captures nothing.** See #7. |

**No form on the site asks a creepy/personal question** (no kids' ages, income, or similar). `ValuationForm`'s property-detail questions are all about the house, not the household. That rule is clean.

---

## 4. Z-index / overlap conflicts

| Component | z-index | File:line | Position |
|---|---|---|---|
| MobileNav hamburger | `z-[10000]` | `layout/MobileNav.tsx:80` | `relative`, `md:hidden` |
| MobileNav drawer | `z-[9999]` | `layout/MobileNav.tsx:92` | `fixed inset-0` |
| Skip link (focus-visible) | `z-[9999]` | `app/layout.tsx:226` | `fixed top-4 left-4` |
| ExitIntentPopup overlay | `z-[9998]` | `ui/ExitIntentPopup.tsx:218` | `fixed inset-0` — **never rendered** |
| PhotoGallery lightbox | `z-[9990]` | `ui/PhotoGallery.tsx:152` | `fixed inset-0` |
| FilterPanel drawer | `z-[101]` | `search/FilterPanel.tsx:106` | `fixed right-0` |
| FilterPanel overlay | `z-[100]` | `search/FilterPanel.tsx:102` | `fixed inset-0` |
| Digital card modal | `z-[100]` | `app/card/page.tsx:274` | `fixed inset-0` |
| **CookieConsent** | **`z-[90]`** | **`ui/CookieConsent.tsx:55`** | **`fixed bottom-16 md:bottom-0`** |
| Header mega-dropdown | `z-[60]` | `layout/Header.tsx:369` | `absolute`, `hidden md:block` |
| Header (site) | `z-50` | `layout/Header.tsx:231` | `fixed top-0` |
| **ChatWidget panel** | **`z-50`** | **`ui/ChatWidget.tsx:286`** | `fixed` |
| **ChatWidget bubble** | **`z-50`** | **`ui/ChatWidget.tsx:410, :437`** | **`fixed right-4 bottom-28 sm:bottom-32 md:bottom-20`** |
| **MobileBottomBar** | **`z-40`** | **`ui/MobileBottomBar.tsx:15`** | **`fixed bottom-0`, `md:hidden`** |
| **BackToTop** | **`z-40`** | **`ui/BackToTop.tsx:31`** | **`fixed right-4 bottom-[7.5rem] sm:bottom-36 md:bottom-24`** |
| **properties/search filter bar** | **`z-40`** | **`app/properties/search/page.tsx:265`** | **`sticky top-0`** |
| AccountDashboard tabs | `z-30` | `ui/AccountDashboard.tsx:417` | `sticky top-16` |
| preferred-vendors sticky bar | `z-30` | `app/preferred-vendors/page.tsx:253` | `sticky top-0` |
| City spoke sub-nav | `z-20` | `app/[citySlug]/page.tsx:847` | `sticky top-16` |

### Conflicts found

**C1 — CookieConsent (`z-[90]`) buries both floating CTAs on mobile until dismissed.**
`CookieConsent.tsx:55` is `fixed bottom-16 … z-[90]` and on mobile its inner row is `flex-col` (`:58`) with three lines of body copy plus two buttons — roughly 140–200px tall, so it occupies ~64px → ~260px from the bottom of the viewport. Sitting inside that band, with **lower** z-index and therefore hidden behind it:
- ChatWidget bubble — `bottom-28` (112px), `z-50` → `ChatWidget.tsx:410`
- BackToTop — `bottom-[7.5rem]` (120px), `z-40` → `BackToTop.tsx:31`

First-visit mobile users (the entire paid/organic cold cohort) cannot see or tap the chat bubble until they dismiss the cookie banner. **Fix:** while the banner is visible, shift the chat bubble and BackToTop up, or drop the banner's z-index below the floating CTAs.

**C2 — ChatWidget bubble covers BackToTop at every breakpoint.** Both are `fixed right-4`. Bubble: `bottom-28 sm:bottom-32 md:bottom-20` with `z-50` (`ChatWidget.tsx:410`). BackToTop: `bottom-[7.5rem] sm:bottom-36 md:bottom-24` with `z-40` (`BackToTop.tsx:31`). The offsets differ by only 8–16px while a bubble is ~48–56px tall, so they overlap and the chat bubble (higher z) wins. Not a direct lead loss, but it makes long pages feel broken and it puts two competing controls in the thumb zone.

**C3 — The main search page's filter bar sticks *behind* the site header.** `properties/search/page.tsx:265` is `sticky top-0 z-40` and its own comment says *"STICKY FILTER BAR — pinned below the site header"*. But `Header.tsx:231` is `fixed top-0 … z-50`. Same top band, lower z-index — so once the bar sticks it is covered by the header. Compare the patterns that get this right: `AccountDashboard.tsx:417` and `[citySlug]/page.tsx:847` both use `sticky top-16`. **Fix:** `sticky top-16 z-30` on the filter bar. Needs a quick browser confirm, since Header's rendered height determines how much is hidden.

**C4 — No conflict between CookieConsent and MobileBottomBar.** `bottom-16` (64px) clears the `z-40` bottom bar exactly, and `layout.tsx:234` adds `pb-16 md:pb-0` to `<main>`. This pair is correct — noted so it isn't "fixed" by mistake.

---

## 5. Broken conversion paths

| Path | Evidence | Status |
|---|---|---|
| `/seller-intake/` form → FUB | `SellerIntakeForm.tsx:210-221` sends no `turnstileToken`; `api/contact/route.ts:166-175` returns 403 for non-kiosk types with no token | **BROKEN — 100% of submissions lost** whenever `TURNSTILE_SECRET_KEY` is set. User sees `:229` "That did not go through." |
| `/auburndale/gapway-lakes-estates/` | `next.config.mjs:372` flattens it to `/gapway-lakes-estates/`; `[citySlug]/page.tsx:599-601` + `community-pages.ts:45` redirect back | **LIKELY REDIRECT LOOP** — takes the only `CommunityInterestForm` offline. Verify with `curl -I` on the live domain. |
| Real lead fails `validateLead` | `lead-validation.ts:66-68` (3+ Gmail dots → hard reject), `:202-206` (2 soft flags → hard reject); `route.ts:231-241` returns `200 {success:true}` | **SILENT DISCARD** — form shows "Message Sent!" (`ContactForm.tsx:123`) and redirects to `/thank-you/`. Nothing in FUB, no alert to Barrett. |
| Stale Turnstile token on a long form | `TurnstileWidget.tsx` has no `expired-callback` and never calls `reset()`; `route.ts:202-211` rejects expired tokens with 403 | **BROKEN for slow fills.** Highest risk on `ValuationForm`'s 24 fields. Error text tells the user to reload — the documented no-refresh rule, violated. |
| Shared-IP household / office | `route.ts:12` `RATE_LIMIT_MAX = 5` per 10 min; 429 at `:130-136` | **FRAGILE** — 6th submission from one IP is blocked and surfaces as `ContactForm.tsx:101` "Something went wrong." No wait-time or phone fallback shown. |
| `ExitIntentPopup` → `/api/contact` | `layout.tsx:244-246` comments out the render | **DISABLED site-wide** (comment says deliberate). Working code, zero traffic. |
| `ChatWidget` → FUB | No `api/contact`, `fub`, or lead capture in `ChatWidget.tsx` (452 lines); `api/chat/route.ts` only proxies Anthropic (`:130-141`) | **NO CAPTURE PATH EXISTS** on all ~3,400 pages. |
| `TourScheduler` on listing pages | `properties/[...slug]/page.tsx:718` inside `grid-cols-1 lg:grid-cols-3` (`:530`) with no `order-` and no `sticky` class in the file | **REACHABLE BUT BURIED** — below ~190 lines on mobile; scrolls away on desktop. |
| `/preferred-vendors/` vendor with no phone | `VendorCard.tsx:88` "Contact details coming soon" | **DEAD END** on a referral page. |
| `builders/[slug]` CTA | `builders/[slug]/page.tsx:182` `tel:8137337907` (no `+1`), `:188` link to `/contact/`, no form | Works; inconsistent `tel:` format vs the site-wide `tel:+18137337907`. |

**Verified clean:**
- **No `href="#"` on any CTA** — `grep -rn 'href="#"' src/ --include='*.tsx'` returns zero. (`#updates` anchors on the Gapway page at `:363`/`:475` are real in-page jumps to the form.)
- **No placeholder/TODO/lorem copy** in any CTA.
- **All 95 distinct internal `href` values resolve** to a route in `src/app/` or a redirect in `next.config.mjs`.
- **`/thank-you/` is not a dead end.** `thank-you/page.tsx` has the 3-step timeline (`:23-38`), a Call Now block (`:118-131`), and 6 next-step links (`:41-48`). Its only gap is the missing conversion event (#10) and the 2h/24h promise mismatch with `ValuationForm` (#5).
- **Lead path to FUB is well instrumented.** `route.ts:314-327` checks `pushLeadToFub`'s **return value** (not just exceptions) and fires `sendLeadFailureAlert` when FUB rejects — this is the right design and should not be regressed.

---

## 6. Duplicated CTA copy

Template-level strings, so each one is literally identical across every page the template renders.

| CTA string | File:line | Pages sharing identical copy |
|---|---|---|
| `"Thinking About Selling?"` (end-of-post block) | `app/blog/[slug]/page.tsx:357` | **1,760** — on buyer, financing, and market posts too |
| `"What's Your Home Worth?"` (sidebar) | `app/blog/[slug]/page.tsx:327` | **1,760** |
| `"Get Your Free Home Valuation"` (button) | `app/blog/[slug]/page.tsx:336, :369` | **1,760** (twice per page = 3,520 instances) |
| `"Ready to explore homes in {city.name}?"` | `components/city/CityContent.tsx:154` | **~1,767** (HubPage + SpokePage both render `CityContent`) |
| `"Ready to take the next step? Call …"` | `components/city/CityContent.tsx:311` | **~1,767** |
| `"contact me to …"` (identical prose CTA, 4 copies in one file) | `city/CityContent.tsx:537, :602, :838, :961` | **~1,767** each |
| `"What's Your Home Worth?"` (mid-article) | `app/blog/[slug]/page.tsx:207` | **84** (`sell-home-fast*` only) |
| `"Ready to sell your {cityName} home?"` | `pages/SellYourHomeCityPage.tsx:332` | **93** (186 URLs) |
| `"Ready to explore {city.name} neighborhoods in person?"` | `pages/NeighborhoodGuidePage.tsx:313` | **93** |
| `"Questions? Barrett Can Help."` | `pages/MiscCatchAllPage.tsx:92` | **32** |
| `"Ready to Work with REMAX {office.city}?"` | `pages/RemaxOfficePage.tsx:2012` | **7** |
| `"Work With Barrett"` / `"Why Work With Barrett?"` | `app/buyers/page.tsx:28, :246, :252` | 1 page, 3 instances |
| `"Let's Talk"` | `app/contact/page.tsx:62`; `app/sellers/page.tsx:197` (as `submitLabel`) | 2 pages |
| `"Thinking About Selling in {City}?"` | `app/valrico-listing-agent/page.tsx:564`; `app/brandon-listing-agent/page.tsx:562` | 2 pages — near-identical hand-built variants |

**The `"Ready to [verb]…?"` formula in full** — `app/investing/page.tsx:142`, `app/builders/page.tsx:455`, `app/agents/page.tsx:144`, `app/mortgage-calculator/page.tsx:101`, `app/sellers/page.tsx:196`, `city/CityContent.tsx:154`, `city/CityContent.tsx:311`, `pages/RemaxOfficePage.tsx:2012`, `pages/SellYourHomeCityPage.tsx:332`, `pages/NeighborhoodGuidePage.tsx:313`. **10 distinct "Ready to…?" headings across ~3,760 page-renders.** The exact `"Ready to Make [City] Home?"` string Barrett banned is not present — but the pattern it was banned for is the dominant CTA shape on the site.

**Severity note:** duplicated CTA copy is a conversion problem before it is an SEO problem. Four near-identical "what's your home worth" asks on a single blog post (`:207`, `:327`, `:336`, `:369`) read as a template, not a person, and the repetition trains readers to scroll past the block.

**Fix:** rotate CTA copy by page type. Highest leverage, in order: (1) branch the blog CTA off post topic — that single change re-writes 1,760 pages; (2) vary `CityContent.tsx:154` / `:311` by city tier or topic — ~1,767 pages; (3) vary the `SellYourHomeCityPage` and `NeighborhoodGuidePage` closers.

---

## 7. Fix order (highest return first)

1. **Add `TurnstileWidget` + honeypot to `SellerIntakeForm.tsx`** — one file, recovers 100% of the site's deepest-intent form. *(#1)*
2. **Add `expired-callback` + `turnstile.reset()` to `TurnstileWidget.tsx`** — one file, protects every form; must land *before* the sitekey is repaired. *(#10-adjacent)*
3. **Exclude `gapway-lakes-estates` at `next.config.mjs:372`** — one line, restores a community lead page. *(#8)*
4. **Add `ContactForm` to `blog/[slug]`, `HubPage`, `SpokePage`, `NeighborhoodPage`** — four edits, puts an on-page form on **~5,153 page-renders** that have none. *(#2, #3, #4)*
5. **Split `ValuationForm` into capture-then-enrich** — one file, de-frictions the destination of the site's highest-volume CTA. *(#5)*
6. **Fix `properties/[...slug]` form placement** (`order-1 lg:order-2` + `lg:sticky lg:top-24`) — one edit, every listing page. *(#9)*
7. **Add GA4 + a `generate_lead` event on `/thank-you/`** — without this, items 1-6 ship unmeasured. *(#10)*
8. **Resolve z-index conflicts C1 and C3**, unhide the mobile header phone (`Header.tsx:325`), add a phone to `RegionalPage.tsx`, add hero children to `LoanGuidePage.tsx:88`.
9. **Add chat lead capture** after 2-3 exchanges. *(#7)*
10. ~~Decide on exit-intent~~ — **CLOSED, popup stays off permanently (see #6).** The follow-on work is that #2/#3/#4 inline forms are now mandatory. Rotate the duplicated CTA copy. *(#6, §6)*
