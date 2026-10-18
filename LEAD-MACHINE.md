# nowtb.com — Lead Machine

What was broken, what got fixed, what runs automatically from now on, and what
still needs a decision from Barrett.

Audit + repair sweep: **October 2026**. Branch: `seo/lead-machine-oct2026`.
Full evidence for every claim is in `audit/01` through `audit/06`.

---

## The five things that were quietly costing the most

### 1. The deepest-intent form on the site rejected 100% of submissions

`/seller-intake/` asks ~33 questions about a house someone wants to sell. It
contained **no Turnstile code at all** and sent no `turnstileToken`, while
`src/app/api/contact/route.ts` hard-returns **403** for any non-kiosk
submission without one. `TURNSTILE_SECRET_KEY` is set in Vercel Production, so
the gate was armed. Every seller who filled out that form got "That did not go
through."

Fixed: Turnstile wired in following the pattern the other working forms already
use.

### 2. A render-time function was deleting ~1,000,000 words of published content

`cleanWpContent()` in `src/lib/utils.ts` stripped trailing boilerplate by
finding a pattern and truncating to the end of the document. Two of its
patterns matched **real body content**: `<h2>Frequently Asked Questions</h2>`
and any late `<h2>` containing "Real Estate".

The guard was "only cut if the match falls in the last 30% of the page." That
guard is unsound by construction — an FAQ section is *always* in the last 30%,
because that is where FAQs go. So it never fired.

Measured across all 3,244 content records:

| | before | after |
|---|---|---|
| visible words rendered | 4,011,744 | **4,412,687** |
| records keeping `FAQPage` schema | 885 | **2,833** |
| records keeping a visible FAQ heading | 1,273 | **1,973** |

Boilerplate is now *excised* as a bounded block rather than truncated, with a
hard guard that refuses any excision containing FAQ content.

### 3. Three quarters of all page titles were truncated in search results

`src/app/layout.tsx` appended `" | Barrett Henry, REALTOR®"` — **26 characters
on every one of ~6,592 pages**. That pushed ~4,963 pages (75%) past Google's
60-character cutoff, chopping keyword phrases mid-word. Zero city pages exceeded
60 characters *without* the suffix, so the suffix alone was the whole problem.

Now `" | Barrett Henry"` (16 chars). Over-length titles dropped **4,913 → 2,596**;
the city family went **1,076 → 67**. `REALTOR®` moved to the Person schema,
where search engines actually read credentials from.

### 4. A live page was in an infinite redirect loop

Confirmed with `curl`, not inferred:

```
/auburndale/gapway-lakes-estates/  308 → /gapway-lakes-estates/
/gapway-lakes-estates/             308 → /auburndale/gapway-lakes-estates/
```

A 937-line page, listed in the sitemap, completely unreachable. The `:city`
flatten redirect in `next.config.mjs` excluded only `southoak`. The exclusion
list is now **generated from `community-pages.ts`**, so new community pages
exclude themselves and this cannot regress.

### 5. The sitemap was frozen at build time

`src/app/sitemap.ts` had no `revalidate` export. Next.js statically caches
`sitemap.ts` by default, so every post added by the content automation since the
last deploy was invisible to Google. Now `export const revalidate = 3600`.

---

## Also fixed

**Lead capture**
- Turnstile never recovered from an expired or failed challenge — no
  `expired-callback`, no `reset()`. Someone spending eight minutes on a long
  form submitted a stale token, got a 403, and was told to reload and lose
  everything. It now resets itself; a refresh is never required.
- The API returned `200 {success:true}` for submissions that failed validation.
  The form said "Message Sent!" and nothing reached Follow Up Boss. Rejections
  now alert Barrett so a false positive is recoverable instead of invisible.
- Validation rejected any Gmail address with 3+ dots (real addresses) and
  hard-rejected on any two "soft" signals. Loosened, with the tradeoff
  documented in code.
- `ValuationForm` was 24 fields on one screen — the destination of the seller
  CTA on all 1,760 blog posts. Now multi-step, with step 1 submittable on its
  own. Response promise reconciled to 2 hours (it said 24 while `/thank-you/`
  said 2).
- The mobile header hid the phone number behind `hidden md:flex`, so the mobile
  header had no way to contact Barrett at all.

**Pages that could not convert**
- 1,760 blog posts had no form, no above-fold CTA, and a mid-article CTA gated
  to one slug prefix — so **1,676 posts had no mid-article CTA**. All now get
  one, matched to intent (seller / buyer / local / investor) with multiple copy
  variants selected by a stable hash of the slug, so neighbouring posts differ.
- ~1,767 city hub and spoke pages and ~1,440 neighborhood pages had **no lead
  form**. All now render one, tagged with the area so Barrett can see in Follow
  Up Boss where the lead came from.
- `RegionalPage` (36 pages) had no phone number anywhere.
- The chat widget ran on ~3,400 pages and captured nothing — it handed out a URL.
  It now offers to capture name/phone/email after real intent and posts to the
  same `/api/contact` contract.
- Exit-intent popup re-enabled at Barrett's direction (gated off open-house
  kiosks and private client packets).

**Findability**
- **1,626 pages (24.4%) had zero inbound links**; 1,756 were unreachable from
  the homepage. The three related-area grids linked only bare city hubs, which
  orphaned **1,384 of the highest-commercial-intent pages** on the site.
- Blog pagination used `?page=N`, so only 24 of 1,760 posts ever received an
  index link. `/blog/` now carries a crawlable A-Z index of all 1,760.
- 93 seller pages had exactly **one** outbound link each. Now 9 woven into the
  copy.
- `LoanGuidePage` held 56,858 inbound links and passed on **zero**, with 0%
  conversion-page coverage.
- `trailingSlash: true` is set, so every slash-less internal link is a
  guaranteed 308. All 37 in the components are fixed; 1,942 in the content
  corpora are fixed by script.
- `SpokeNav` linked `/blog/sell-home-fast-{city}/` unconditionally — a hard 404
  for the 9 cities with no such post.
- All 8 builder pages linked to root slugs; 6 of those collided with existing
  regional pages, so they were cannibalizing rather than 404ing.

**Trust and correctness**
- **Three different Florida broker license numbers were published.** The correct
  one is **BK3313308**; the others are now a hard failure in the weekly audit.
- 229 pages tied the 23-year experience figure to a place
  ("23+ years of real estate experience across Tampa Bay" ×94, "23 years of
  local knowledge" ×45). Barrett has been licensed since September 2003 but has
  lived in Florida about a decade — merging those is a false statement.
- 626 pages rendered **raw CSS as visible body text**, from a prior auto-linking
  script that string-replaced inside `<img alt="...">` and destroyed the tag.
- `barrett-henry-headshot.jpg` was referenced from 8 places including the
  site-wide Person schema. **That file has never existed** (the real one is
  `barrett-headshot.png`), so the most important entity signal on the site
  pointed at a 404.
- The root layout declared the homepage as its canonical URL, which every page
  without its own canonical inherited — including every 404, each of which told
  Google it was really the homepage.
- ~1,811 pages promised `twitter:card=summary_large_image` with no `og:image`,
  so every share rendered as a blank grey box.

**Content**
- All **93 of 93 cities now have custom FAQs** (was 76). The 17 missing included
  **Tampa and Riverview** — two of the four core markets. Every answer is built
  from Stellar MLS figures already in the repo or a named external source;
  unverifiable numbers were deliberately left out rather than invented.
- A new `/sell/` cluster targets the seller searches the site ranked for
  **zero** of.

---

## What runs automatically now

### Weekly audit — `scripts/weekly_audit.py`

Deterministic, offline, ~31 seconds, no API keys and no AI. It cannot invent a
problem, so it is safe to run forever. It writes `WEEKLY-AUDIT.md` (read this)
and `weekly-audit.json` (for the fix pass), ranked by **severity × pages
affected** so the top of the list is always where the money is.

Every check below exists because the thing it looks for actually happened here:

| Check | Why it exists |
|---|---|
| boilerplate stripper targeting real content | deleted ~1M words |
| root layout canonical | made every 404 claim to be the homepage |
| title length **including** the template suffix | 75% of titles truncated |
| license number | three different numbers were live |
| experience claim tied to a location | 229 false statements |
| experience rollover warning | tells you 45 days before September |
| missing asset paths | the headshot that never existed |
| redirect loops and chains | a live page was unreachable |
| trailing slashes | 1,942 guaranteed redirects |
| noindex vs sitemap contradiction | crawl budget burned every pass |
| speakable selectors matching nothing | 891 pages |
| money-query coverage | ranked for **0 of 6** seller searches |
| CTA / form / phone coverage per template | pages that cannot convert |
| near-duplicate content | the template-swap disease |
| city FAQ and neighborhood-description gaps | the enrichment backlog |

The experience number is **computed from September 2003**, never hardcoded, so
the audit keeps telling the truth after every September rollover.

### Weekly fix pass — `scripts/weekly-lead-audit.sh`

Runs Mondays. Three phases: audit → a fenced headless Claude pass that fixes the
top findings and writes one new article → **typecheck and production build as a
hard gate** → commit and push to main so Vercel deploys from git.

Two safety properties that matter:

- It works in a **dedicated worktree hard-reset to `origin/main`**, never in
  `~/Projects/nowtb-next`. That checkout is routinely left on a feature branch
  with uncommitted edits — at audit time it held 66 files asserting
  "24+ years of real estate experience," which is false until September 2027.
- **Nothing ships unless the build passes.** On failure the changes are left in
  the worktree for inspection and nothing is pushed.

### The automation that was already broken

`scripts/daily-enrich.sh` ran nightly at 5am and failed **every single night**
with `vercel: command not found` — cron's PATH contains none of Homebrew or
`~/.local/bin` — and then printed "Deploy complete" anyway, so the failure
looked exactly like success.

Worse, it ran `vercel --prod --yes` from the dirty tree, and the CLI deploys
*local files*. The only thing that kept those 66 false-claim files off
production was the broken PATH. Fixing the PATH alone would have shipped them
the next morning.

It now sets PATH explicitly, checks every binary, reports honestly, and **does
not deploy at all** — shipping belongs to the weekly script, which gates on a
build and pushes to git.

---

## Open — needs Barrett

1. **Which social handles are real?** Two pairs are published:
   `instagram.com/thenowteam` + `facebook.com/BarrettHenryREALTOR` (schema,
   guides) versus `instagram.com/nowtampa` + `facebook.com/NOWTampaBay` (blog
   template on 1,760 pages, and llms.txt). I could not verify either —
   Instagram returns 200 for dead handles and Facebook blocks automated
   requests. A split identity splits the entity across the knowledge graph.

2. **valricoagent.com is competing with nowtb.com.** On "Valrico realtor" it
   ranks #8 and nowtb #9. On "Riverview vs Valrico": valrico.blog #4,
   valricoagent #6, nowtb #9. Three of Barrett's own domains are splitting the
   Valrico result set. One domain should own Valrico.

3. **Should `/home-valuation/` or `/free-home-valuation/` host the real page?**
   `/home-valuation/` is the better keyword and has ~2× the internal links
   (1,772 vs 708) but is currently a redirect stub. Left as a temporary redirect
   deliberately so the decision stays reversible.

4. **897 pages hardcode "Last Updated: March 2026."** Blanket-stamping today's
   date would be a false freshness signal, so they were left alone. They need a
   real refresh or an honest removal.

5. **`NEXT_PUBLIC_GA_ID` is not set in Vercel.** GA4 and the conversion events
   (phone taps, chat captures) are wired and are a complete no-op until it
   exists. Until then every change here ships blind.

6. **The builder-incentives post argues the opposite of reality.** Dated
   2024-11-22, it claims incentives are shrinking to $10–20K. NAHB, August 2026:
   63% of builders are using incentives; Del Webb advertises up to $70K, Highland
   up to $60K. Recommend rewriting in place rather than retiring the URL.

---

## The thing to understand about ranking here

Word count is not the problem and never was.

Masking city names and numerals to expose the template skeleton, **42.2% of all
content is a near-duplicate** of something else on the site, and 75.9% of
`pages-content.json` specifically. Median word counts are healthy (posts 1,223).
Only 31 of 3,277 items are under 300 words.

What is actually missing is **unique fact density**. Median unique verifiable
facts per city page: **14**. Of 1,203 city pages, **318 have fewer than 10**.

`/valrico/` is 7,628 words and ranks for nothing. A competitor ranks with 1,921
words containing **4 tables and 57 dollar figures** segmented by year, price band
and ZIP. Another outranks a more thorough statewide page simply by saying
"Hillsborough" when the searcher did.

Where nowtb.com already does this, it wins: for "Brandon vs Riverview" the site
takes 3 of 9 results and an answer engine **quoted its statistics verbatim**.

So the enrichment rule is: **do not add words. Add verified, location-specific
facts in tables.** The weekly audit measures duplication and fact gaps precisely
so this stays visible.
