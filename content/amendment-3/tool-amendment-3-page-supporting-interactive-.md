# Amendment 3 page — supporting interactive UI component set (nowtb-next)

Five client components (sticky scroll-spy TOC, election status/results banner, current-law vs proposed comparison table, balanced news feed with lean filter, yes/no case toggle) specified for Next.js 14 App Router + Tailwind v3 using only dependencies already in nowtb-next. Matches the site's luxury-editorial tokens (navy #0c1829, steel blue #93b4d4, Playfair headings, squared corners, no gold).

## Spec
## 0. Repo facts these are built against (verified in /Users/barretthenry/Projects/nowtb-next)

- Next.js 14.2.35, App Router, React 18. Tailwind v3 with `tailwind.config.ts` (NOT v4 — the config file IS read here).
- Tokens already defined: `primary #0c1829`, `accent #93b4d4`, `link #2563eb`, `dark #1a2332`, `light #f8f9fb`, `muted #6b7a8d`, `border #e2e6ed`. Page body background is warm cream `#F8F6F3`. No gold, no yellow.
- Fonts: `font-heading` (Playfair, used light/extralight with wide tracking), `font-body` (DM Sans).
- Existing CSS utilities to reuse, not reinvent: `.heading-section`, `.heading-label`, `.btn-primary`, `.btn-secondary`, `.card`, `.container-wide`, `.section-light`, `.section-white`, `.section-dark`, `.link-underline`, `.scrollbar-hide`, `.quick-answer`.
- `cn()` lives in `@/lib/utils` (clsx + tailwind-merge). Use it for every conditional class.
- Available deps — nothing new needed: `react`, `lucide-react`, `clsx`, `tailwind-merge`, `date-fns`.
- **Header is `fixed top-0 z-50` and 80px tall (`h-20`).** Its mega-menu uses `z-[60]`. This drives the entire offset and z-index plan below.
- `prefers-reduced-motion` is already handled globally (kills smooth scroll + transitions). Do not re-implement it per component.
- `MobileBottomBar` occupies the bottom of the viewport on phones.

### File layout

```
src/components/amendment3/
  types.ts                    // Lean, TocItem, ComparisonRow, NewsItem, CaseSide
  StickyToc.tsx               // 'use client'
  ElectionStatusBanner.tsx    // 'use client'
  CurrentVsProposedTable.tsx  // server component
  BallotNewsFeed.tsx          // 'use client'
  CaseToggle.tsx              // 'use client'
src/data/amendment3.ts        // all copy + rows + news items as typed consts
```

Every component is purely presentational and props-driven. All content lives in `src/data/amendment3.ts` so the whole factual payload is reviewable in one diff and a single file can be updated after the election.

### Required one-line global fix (do this first)

Add to `src/app/globals.css` under the existing `html { scroll-behavior: smooth }` rule:

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 6rem;            /* clears the 80px fixed header */
}
@media (min-width: 1024px) {
  html { scroll-padding-top: 7rem; }   /* header + sticky TOC breathing room */
}
```

Without this, **every** TOC jump lands with the heading hidden behind the fixed header. This fixes it site-wide, not just on this page, and costs nothing. Per-section `scroll-mt-24` also works but has to be remembered on every section forever.

### z-index ladder (do not exceed)

Header `z-50` → mobile TOC bar `z-40` → sticky `<thead>` `z-10` → everything else default. Nothing on this page gets `z-50` or higher.

---

## 1. `StickyToc` — sticky in-page nav with scroll-spy

**Path:** `src/components/amendment3/StickyToc.tsx` · `'use client'`

### Props

```ts
export interface TocItem {
  /** DOM id of the target <section>, with no leading "#" */
  id: string;
  /** Short nav label. Keep under ~28 chars or the rail wraps badly. */
  label: string;
  /** One level of nesting only. Deeper nesting is not supported by design. */
  children?: TocItem[];
}

export interface StickyTocProps {
  items: TocItem[];
  /** Eyebrow above the list. Default "On this page". Rendered as <p>, not a heading. */
  title?: string;
  /** Pixels the fixed header occupies. Default 80. */
  headerOffset?: number;
  /** Mobile renders a collapsible disclosure bar. Set false for a chip rail. Default true. */
  mobileCollapsible?: boolean;
  className?: string;
}
```

### Behavior

- Links are **real `<a href="#id">`**. Scrolling works with JS disabled and right-click / open-in-new-tab behaves. JS only adds the active highlight and focus move.
- Scroll-spy via a single `IntersectionObserver`:
  - `rootMargin: \`-${headerOffset + 8}px 0px -65% 0px\``, `threshold: 0`.
  - Keep a `Map<string, boolean>` of intersecting ids. Active = **first item in `items` document order** whose id is intersecting. If none intersect (a section taller than the band), keep the previous active — never flash to nothing.
  - Observe on mount in a `useEffect` with `items` in the dep array; `observer.disconnect()` on cleanup.
- **Click lock (required, or the highlight fights the user):** on link click, set active immediately and set `lockUntilRef.current = Date.now() + 700`. The observer callback returns early while locked. Without this, smooth-scrolling past three sections makes the highlight strobe.
- On mount, if `location.hash` matches an item, set it active.

### Tailwind layout

Page shell wraps content in:
```
grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14
```
`minmax(0,1fr)` is load-bearing — without it a wide table in column 2 blows out the grid.

**Desktop (`lg+`) nav:**
```
hidden lg:block lg:sticky lg:top-28 lg:self-start
lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto scrollbar-hide
```
- Eyebrow: `<p className="heading-label mb-4">` (reuses the existing uppercase-tracked accent label).
- `<ul className="border-l border-border">`; each link:
  - base `-ml-px block border-l-2 border-transparent py-2 pl-4 font-body text-sm leading-snug text-muted transition-colors hover:text-primary`
  - active `border-accent font-medium text-primary`
  - nested child `pl-8 text-xs`
- Squared, no pills, no background fills — matches the site's editorial restraint.

**Mobile (`<lg`) bar:**
```
lg:hidden sticky top-20 z-40 -mx-4 border-b border-border
bg-[#F8F6F3]/95 px-4 backdrop-blur
```
`top-20` sits it exactly under the 80px header. `z-40` keeps it under the header.

- Collapsed: full-width `<button>` showing `On this page · {activeLabel}` with a `ChevronDown` (lucide) rotating 180° when open.
- Expanded: `<ul className="max-h-[55vh] overflow-y-auto pb-4">`. The `55vh` cap keeps the bottom of the list clear of `MobileBottomBar`.
- Selecting an item closes the panel.
- If `mobileCollapsible={false}` and `items.length <= 5`: horizontal chip rail instead — `flex gap-2 overflow-x-auto scrollbar-hide py-3`, chips `shrink-0 border px-3 py-1.5 text-xs uppercase tracking-[0.15em]`, and `activeEl.scrollIntoView({ block: 'nearest', inline: 'center' })` on active change. Only worth it at 5 or fewer items; a rail with 9 chips is thumb-hostile.

### Accessibility

- `<nav aria-label="On this page">` — the landmark label, so no sr-only heading is needed and the page's `h2`/`h3` outline stays clean (consistent with the footer rule about not wasting heading hierarchy).
- Active link: `aria-current="location"`. **Not** `aria-current="page"` — that's for a different page, and this is a position within the current one.
- **Focus must follow the scroll.** Browsers do move focus on same-page anchors in modern engines, but React's smooth scroll + sticky header makes it unreliable. On click: `const el = document.getElementById(id); el?.focus({ preventScroll: true })`. Every target `<section>` gets `tabIndex={-1}` and `className="focus:outline-none"` so programmatic focus doesn't paint a stray ring. Without this, a keyboard user clicks "Yes case", the page scrolls, and their next Tab goes to the second TOC link instead of into the content.
- Mobile toggle: `<button aria-expanded={open} aria-controls="toc-panel">`; panel `id="toc-panel"`. `Escape` closes it and returns focus to the toggle.
- Do **not** add roving tabindex / arrow-key navigation. This is a list of links, and Tab is the expected interaction; a roving pattern here breaks user expectation and fails nothing it currently passes.
- Focus-visible rings come from the existing global `:focus-visible` rule. Do not set `outline-none` on the links.
- Contrast: `text-muted #6b7a8d` on cream `#F8F6F3` is ~4.6:1 — passes AA for the 14px body text. Do not lighten it.

---

## 2. `ElectionStatusBanner` — countdown that flips to results

**Path:** `src/components/amendment3/ElectionStatusBanner.tsx` · `'use client'`

### Props

```ts
export type ElectionPhase =
  | 'countdown'          // before election day
  | 'election-day'       // the day itself
  | 'awaiting-results'   // after, no result supplied yet
  | 'passed'
  | 'failed';

export interface ElectionResult {
  yesPercent: number;
  noPercent: number;
  /** Threshold to pass. Florida constitutional amendments need 60. Default 60. */
  thresholdPercent?: number;
  precinctsReportingPercent?: number;
  /** Attribution is mandatory for any number on this banner. */
  source: string;                 // e.g. "Florida Division of Elections"
  sourceUrl: string;
  /** ISO timestamp of the figures themselves. */
  updatedAt: string;
  /** True until the state certifies. Renders an "Unofficial results" flag. */
  unofficial?: boolean;
  /** Plain-English consequence, e.g. "Takes effect January 1, 2027." */
  effectiveNote?: string;
}

export interface ElectionStatusBannerProps {
  /** ISO date, "2026-11-03" */
  electionDate: string;
  /** IANA zone all day math runs in. Default "America/New_York". */
  timeZone?: string;
  /** Force a phase. Omit to derive. The two result phases are ALWAYS derived from `result`. */
  phase?: ElectionPhase;
  result?: ElectionResult;
  cta?: { label: string; href: string };
  className?: string;
}
```

### The hydration + timezone trap (this is the part that breaks)

Two real bugs to design around:

1. **Server/client mismatch.** `new Date()` during SSR renders a day count from the build/request machine; the client re-renders a different one and React logs a hydration error (and in prod may keep the stale server number).
2. **DST.** US DST ends Sunday Nov 1, 2026 — two days before the election. A naive `differenceInDays(new Date('2026-11-03'), new Date())` on local Dates is off by one across that boundary.

**Solution:**
- Server render: the full sentence with the date and **no number** — `Florida voters decide on <time dateTime="2026-11-03">November 3, 2026</time>.` This is what crawlers and no-JS users get, and it is complete and correct on its own.
- `useState<number | null>(null)` + `useEffect` computes the count after mount and injects the number span. No mismatch possible because the server never rendered a number.
- Day math uses calendar-day strings in the target zone, never Date arithmetic:
  ```ts
  const ymd = (d: Date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(d);                                   // "2026-10-20"
  const toUTC = (s: string) => {
    const [y, m, dd] = s.split('-').map(Number);
    return Date.UTC(y, m - 1, dd);
  };
  const daysUntil = (toUTC(electionDate) - toUTC(ymd(new Date()))) / 86_400_000;
  ```
  Whole days, DST-proof, no library.
- Set up a `setInterval` of 60s only if you want the banner to roll over at midnight without a reload. Optional; clear it on unmount.

### Phase derivation

```
if (result)            -> result.yesPercent >= (result.thresholdPercent ?? 60) ? 'passed' : 'failed'
else if (phase)        -> phase                     // manual override, e.g. force 'awaiting-results'
else if (daysUntil > 0)  -> 'countdown'
else if (daysUntil === 0)-> 'election-day'
else                     -> 'awaiting-results'
```

Note the ordering: a supplied `result` always wins, so flipping the page to results day-of is a one-object edit in `src/data/amendment3.ts` with no code change. That is the whole point of this design.

### Tailwind layout

One shell, five states. Only the eyebrow text, the hero number, and the background swap.

```
w-full border-y border-border
countdown / awaiting:  bg-light text-primary
election-day / results: bg-primary text-white
```
Inner: `mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8`

- Eyebrow: `heading-label` ("Ballot status" / "Election day" / "Unofficial results").
- Hero number: `font-heading text-3xl font-extralight tabular-nums sm:text-4xl`. `tabular-nums` stops the layout jittering as digits change.
- Supporting sentence: `font-body text-sm leading-relaxed`.
- CTA (optional): `btn-secondary` on dark states, `btn-primary` on light states, `w-full sm:w-auto`.

**Results state adds** a two-segment bar directly under the sentence:
```
relative h-1.5 w-full bg-muted/30
  <div className="h-full bg-white"        style={{ width: `${yesPercent}%` }} />   // "yes"
  <div className="absolute inset-y-[-3px] w-px bg-accent" style={{ left: `${threshold}%` }} />  // 60% tick
```
- Never colour-only: always render the literal words `Passed` / `Did not pass` plus `Yes 58.2% · No 41.8% · 60% needed`.
- No red/green. Green/red reads partisan and fails for colourblind users. White-on-navy for the yes fill and a steel-blue threshold tick fit the palette and carry no political charge.
- `unofficial` renders a small `border border-white/40 px-2 py-0.5 text-[11px] uppercase tracking-[0.15em]` tag reading "Unofficial".
- Source line, always: `{source} · updated {formatDate(updatedAt)}` with the outlet name as the link.

### Mobile

Stacks to two rows. Number and sentence on one line if they fit at 375px, otherwise number above. CTA goes full-width. **Total height must stay under ~96px on a 375px screen** — the header already costs 80px and the TOC bar another ~48px; a tall banner means the reader opens the page and sees no content.

**Do not make this sticky.** Header + TOC bar is already two stickies. A third consumes a third of a phone viewport.

### Accessibility

- `<section aria-labelledby="ballot-status-heading">` with `<h2 id="ballot-status-heading" className="sr-only">Amendment 3 ballot status</h2>`.
- Wrap **only the changing sentence** in `<p aria-live="polite" aria-atomic="true">`. Putting `aria-live` on the whole banner re-announces the CTA and the source link on every tick.
- The number must never be announced bare. Keep the digits and the words in one text node: `14 days until Florida voters decide on Amendment 3.` — not a big `14` beside separate small text, which screen readers read as "14" then a pause.
- `<time dateTime="2026-11-03">` — machine-readable, and date-attributed facts are what AI answer engines extract.
- Results bar: `role="img"` with `aria-label="Yes 58.2 percent. No 41.8 percent. 60 percent required to pass."` Do **not** use `role="progressbar"` — nothing is in progress.
- Source link stays in the same tab (site convention); if opened in a new tab, add an `ExternalLink` icon plus `<span className="sr-only">(opens in a new tab)</span>`.
- Contrast on the dark state: white on `#0c1829` is ~16:1. The `accent #93b4d4` on navy is ~6.9:1 — fine for the tick and small text.

---

## 3. `CurrentVsProposedTable` — side-by-side comparison

**Path:** `src/components/amendment3/CurrentVsProposedTable.tsx` · **server component** (no interactivity, so no `'use client'` — keeps it in the static HTML, which is the whole point for AI extraction).

### Props

```ts
export interface ComparisonRow {
  /** Row label, e.g. "Homestead exemption amount" */
  factor: string;
  /** What the law does today */
  current: string;
  /** What changes if it passes */
  proposed: string;
  /** Short note under both cells, e.g. a statute cite */
  note?: string;
  /** Drives the status tag. Text is always rendered, never colour alone. */
  impact?: 'change' | 'same' | 'unclear';
}

export interface CurrentVsProposedTableProps {
  /** Required. Renders as a visible <caption>. */
  caption: string;
  rows: ComparisonRow[];
  currentLabel?: string;    // default "Current law"
  proposedLabel?: string;   // default "If Amendment 3 passes"
  sources?: { label: string; href: string }[];
  /** sr-only per-row prose restatement. DEFAULT FALSE — see note. */
  includePlainTextSummary?: boolean;
  id?: string;
  className?: string;
}
```

### The one rule that matters: ONE table, one DOM

The common approach is `<table className="hidden md:table">` plus a stack of `<div>`s at `md:hidden`. **Do not do this.** It puts every fact in the HTML twice, which is exactly the duplicate-content pattern that hurts the extraction you are optimising for, and the two copies drift the first time someone edits one.

Instead: render a single real `<table>` and restyle it at the breakpoint.

### Tailwind layout

Outer wrapper (always present, costs nothing):
```
<div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0" role="group" tabIndex={0}
     aria-label="Current law compared with Amendment 3">
```
`tabIndex={0}` + `role="group"` on a horizontally scrollable region is a real WCAG 2.1 requirement most builds miss — without it a keyboard-only user cannot scroll the container.

**Desktop (`md+`):**
- `<table className="w-full border-collapse text-left">`
- `<caption className="caption-top mb-4 text-left font-body text-sm text-muted">` — visible, not hidden. A visible caption helps readers and is strong extraction signal.
- `<thead>`: `bg-primary text-white`; `<th scope="col" className="px-4 py-3 font-body text-xs font-medium uppercase tracking-[0.15em]">`
- Column widths: factor `w-[26%]`, the two comparison columns split the rest.
- `<th scope="row">` for the factor cell: `border border-border bg-light px-4 py-4 align-top font-body text-sm font-medium text-primary`
- `<td>`: `border border-border px-4 py-4 align-top font-body text-sm leading-relaxed text-dark`
- `note` renders inside the factor cell as `mt-2 block text-xs text-muted`.
- If `rows.length > 8`, add sticky header: `thead th { position: sticky; top: 5rem; z-index: 10 }` — `5rem` clears the 80px header, and the solid `bg-primary` keeps rows from bleeding through.

**Mobile (`<md`) — same DOM, CSS reflow to cards.** Add a scoped block to `globals.css`:

```css
@media (max-width: 767px) {
  .a3-compare, .a3-compare tbody, .a3-compare tr, .a3-compare th, .a3-compare td { display: block; }
  .a3-compare thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .a3-compare tr { @apply mb-4 border border-border p-4; }
  .a3-compare th[scope="row"] { @apply mb-3 border-0 bg-transparent p-0 text-base; }
  .a3-compare td { @apply border-0 p-0 pt-3; }
  .a3-compare td::before {
    content: attr(data-label);
    @apply mb-1 block font-body text-xs uppercase tracking-[0.15em] text-muted;
  }
}
```
Each `<td>` gets `data-label={currentLabel}` / `data-label={proposedLabel}`. Row becomes a bordered card: factor as the card title, then two labelled blocks.

**Required with this technique:** `display: block` strips implicit table semantics in several screen readers. Add explicit roles so they survive — `role="table"` on the table, `role="row"` on `<tr>`, `role="rowheader"` on the factor `<th>`, `role="cell"` on each `<td>`, `role="columnheader"` on the `<thead>` cells. Zero visual cost, and the table reads as a table at every width.

**Impact tag:** squared, text-first.
```
inline-block border px-2 py-0.5 text-[11px] uppercase tracking-[0.15em]
change  -> border-primary text-primary   label "Changes"
same    -> border-border  text-muted     label "No change"
unclear -> border-accent  text-primary   label "Unclear"
```

**Sources:** `<p className="mt-4 text-xs text-muted">` with each source as an inline link using the global `--color-link`.

### `includePlainTextSummary` — default `false`, and here's why

The sr-only prose restatement does help some extraction, but it duplicates the table's entire content inside the same page, which is the thing you are trying to avoid. The strictly better move is a **visible** two-to-three sentence "In plain English" paragraph above the table — wrap it in the existing `<QuickAnswer>` component, which already carries the `.quick-answer` class the site's speakable schema points at. Humans get it, AI gets it, nothing is hidden. Keep the prop for an escape hatch but leave it off.

### Accessibility recap

- Real `<caption>`, `scope="col"` on headers, `scope="row"` on the factor cell. The row scope is what makes a 3-column comparison navigable cell-by-cell.
- No `colspan`, no nested tables, no `role="presentation"`.
- Scroll wrapper is keyboard-focusable and labelled.
- Explicit ARIA table roles so the mobile `display:block` reflow keeps its semantics.
- Pair with `faqSchema()` / `articleSchema()` from `src/lib/schema.tsx` at the page level. Do not emit JSON-LD from inside the component.

---

## 4. `BallotNewsFeed` — balanced coverage with a lean filter

**Path:** `src/components/amendment3/BallotNewsFeed.tsx` · `'use client'`

### Props

```ts
export type Lean = 'yes' | 'no' | 'neutral';

export interface NewsItem {
  id: string;
  headline: string;
  outlet: string;                  // "Tampa Bay Times"
  url: string;
  publishedAt: string;             // ISO "2026-10-14"
  lean: Lean;
  /** Neutral one-sentence summary. Optional. */
  summary?: string;
  /** A lean tag only means something in context. Default 'news'. */
  kind?: 'news' | 'opinion' | 'analysis';
}

export interface BallotNewsFeedProps {
  items: NewsItem[];
  heading?: string;                // default "Latest news on Amendment 3"
  /** Items shown before "Show more". Default 8. */
  initialCount?: number;
  defaultFilter?: Lean | 'all';    // default 'all'
  /** Required for honesty. Explains how items are selected and tagged. */
  balanceNote: string;
  /** ISO timestamp the list was last reviewed. */
  lastUpdated?: string;
  className?: string;
}
```

### Balance logic — show the counts, don't reorder

- Compute `counts = { all, yes, no, neutral }` and **render them in the filter labels**: `All (18)`, `Favors yes (6)`, `Favors no (6)`, `Neutral (6)`. Counts are what make "balanced" verifiable rather than asserted. A reader can audit it in one glance; so can a journalist.
- **Sort strictly by `publishedAt` descending. Nothing else.**
- Explicitly rejected: interleaving by lean so the first screen looks mixed. It makes the first screen prettier, but it is an undisclosed editorial thumb on the scale, and if anyone diffs the data against the render it reads as manipulation by a licensed broker on a tax-related ballot measure. Not worth it. If the top of the list skews, the counts disclose it and the fix is to source better items, not to reorder.

### Tag wording

- Never "pro" / "anti". Labels are `Favors yes`, `Favors no`, `Neutral`.
- A lean tag on a straight news report is itself an editorial claim. Enforce in `src/data/amendment3.ts`: items with `kind: 'news'` are always `lean: 'neutral'` and render the tag as `News report`. Only `opinion` and `analysis` items carry `Favors yes` / `Favors no`, and their tag renders as `Opinion · Favors yes`. This removes nearly all of the defensibility risk.

### Tailwind layout

```
<section id="news" className="scroll-mt-28">
  h2.heading-section.text-display-sm
  p.font-body.text-sm.text-muted   -> balanceNote
  p.text-xs.text-muted             -> "Last reviewed {formatDate(lastUpdated)}"
```

**Filter control** — `mt-6 flex flex-wrap gap-2`. Each option:
```
cursor-pointer border px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.15em] transition-colors
inactive: border-border text-muted hover:border-primary hover:text-primary
active:   border-primary bg-primary text-white
```
Squared, no rounded pills. Wrap rather than a scroll rail — four ~90px chips wrap to two tidy rows at 320px, and wrapped chips are easier to hit than a rail you have to discover is scrollable.

**List** — `<ul className="mt-8 divide-y divide-border border-t border-border">`, each `<li className="py-5">`:
```
flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6
```
- Left column:
  - meta line, `id={`meta-${item.id}`}`: `font-body text-xs uppercase tracking-[0.15em] text-muted` → `{outlet} · <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>`
  - headline link: `font-heading text-lg leading-snug text-primary link-underline` (reuses the existing animated-underline utility)
  - summary: `mt-1 font-body text-sm leading-relaxed text-muted`
- Right: lean tag, `sm:shrink-0 sm:pt-1`, same squared tag styling as the comparison table's impact tag so the page has one tag language.

**Empty state** — never an empty void: `border border-border p-6 text-center text-sm text-muted` reading `No items tagged "Favors no" yet.` plus a `Show all` button that resets the filter.

**Show more** — bordered secondary button, `mt-8 w-full sm:w-auto`, increments `shownCount` by `initialCount`.

### Mobile

- Single column. The lean tag moves up to sit inline with the meta line (`order` swap in the flex column) instead of floating right — a right-floated tag on a 375px screen collides with wrapped headlines.
- **Do not truncate headlines.** Let them wrap to three lines. A truncated headline is a lost click and lost keyword text.
- Outlet + date stay on one line; if `outlet` is long, let the whole meta line wrap rather than shrinking the type.

### Accessibility — the filter is the part people get wrong

Four loose `<button>`s is the common build and it gives a screen-reader user no idea that these are mutually exclusive or which is chosen. Build it as a **native radio group**:

```tsx
<fieldset>
  <legend className="sr-only">Filter news by stance</legend>
  {options.map(o => (
    <label key={o.value} className="...peer-checked:bg-primary peer-checked:text-white...">
      <input type="radio" name="news-lean" value={o.value}
             checked={filter === o.value} onChange={...}
             className="peer sr-only" />
      {o.label} ({counts[o.value]})
    </label>
  ))}
</fieldset>
```
This buys, with zero keyboard code: arrow-key cycling between options, Space/Enter activation, correct "radio, 2 of 4, selected" announcements, and a real focus ring via `peer-focus-visible:outline`. The ARIA alternative (`role="radiogroup"` + manual roving tabindex) is more code for the same result.

Additional requirements:

- **One live region, outside the list:**
  `<p aria-live="polite" className="sr-only">Showing 6 of 18 items. Filter: favors yes.</p>`
  Never put `aria-live` on the `<ul>` — it reads out every item on every filter change.
- `<ul>` / `<li>` so the count is announced. One link per row — do not wrap the whole card in an anchor, which swallows the tag text into the link name.
- Each link gets `aria-describedby={`meta-${item.id}`}` so a screen reader's link list reads "Headline — Tampa Bay Times, October 14, 2026" instead of a wall of bare headlines.
- Lean tag is visible text, never a colour alone and never a `title` attribute.
- `<time dateTime={publishedAt}>` on every item — required for both AI extraction and `NewsArticle`-adjacent schema if added later.
- External links: `target="_blank" rel="noopener noreferrer"` with a lucide `ExternalLink` at `h-3 w-3` and `<span className="sr-only">(opens in a new tab)</span>`. Readers comparing sources shouldn't lose the page.
- "Show more": move focus to the first newly revealed headline (`ref` on the item at the old `shownCount` index) and update the live region to `8 more items shown.` Do not use `aria-expanded` — nothing is a disclosure here.

---

## 5. `CaseToggle` — yes case / no case

**Path:** `src/components/amendment3/CaseToggle.tsx` · `'use client'`

### Props

```ts
export interface CaseSide {
  /** Tab label, e.g. "The case for yes" */
  label: string;
  /** One-sentence framing under the panel heading. */
  summary?: string;
  points: { heading: string; body: string }[];
  /** Who makes this case, e.g. "Argued by Florida TaxWatch and ..." */
  attribution?: string;
  sources?: { label: string; href: string }[];
}

export interface CaseToggleProps {
  yes: CaseSide;
  no: CaseSide;
  heading?: string;                   // default "The case for and against"
  defaultSide?: 'yes' | 'no';         // default 'yes'
  /** Below md, render both sides stacked instead of tabbed. Default true. */
  stackOnMobile?: boolean;
  id?: string;
  className?: string;
}
```

### Two hard rules

**Rule 1 — never conditionally render the inactive panel.**
`{active === 'yes' && <Panel/>}` removes half the page's substance from the DOM. On a page whose entire ranking thesis is extractability, that is self-inflicted. Both panels are always mounted; the inactive one is hidden with the **`hidden` attribute** (not `opacity-0`, not `h-0`, not `sr-only`). `hidden` keeps the content in the HTML for crawlers, correctly hides it from screen readers, and lets browser Cmd-F skip it in a way users expect.

**Rule 2 — no layout jump on switch.**
Put both panels in the same grid cell so the container is always as tall as the taller side:
```
<div className="grid">
  <div className="[grid-area:1/1]" ... />   // yes panel
  <div className="[grid-area:1/1]" ... />   // no panel
</div>
```
A `min-h-[22rem]` also works but guesses wrong at some viewport. The grid-overlap trick is exact. Without either, tapping the second tab yanks the page under the reader's thumb.

### Tailwind layout

**Segmented control (`md+`):**
```
<div role="tablist" className="grid grid-cols-2 border border-primary">
```
Each tab:
```
px-6 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] transition-colors
inactive: bg-transparent text-primary hover:bg-primary/5
active:   bg-primary text-white
second tab adds: border-l border-primary
```
Matches `.btn-primary`'s uppercase/tracked/squared language exactly.

**Panel:**
```
border border-t-0 border-primary bg-white p-6 md:p-10
```
- `<h3 className="font-heading text-xl font-light tracking-wide text-primary">` — the side label as a real heading inside the panel (helps the outline and gives AI a clean section boundary).
- `summary` → `mt-2 font-body text-sm text-muted`.
- Points → `<ul className="mt-6 space-y-5">`, each `<li className="border-l-2 border-accent pl-4">` with `<h4 className="font-heading text-base text-primary">` + `<p className="mt-1 font-body text-sm leading-relaxed text-muted">`. The steel-blue left rule echoes the TOC active state and the `QuickAnswer` block — one visual language across the page.
- `attribution` → `mt-8 border-t border-border pt-4 font-body text-xs italic text-muted`.
- `sources` → inline links on the same line.

### Mobile — stack, don't tab

Below `md`, the tab pattern costs more than it gives: it hides half the argument behind an interaction on the screen size where people scroll rather than explore, and a reader who never taps leaves having read one side.

**Implementation that avoids duplicated content:**
- Extract the panel body into a local `<CasePanel side={...} />` used by both branches, so the content exists once in source.
- Render mode is chosen by a `matchMedia('(min-width: 768px)')` subscription read through `useSyncExternalStore` with a **server snapshot of `false`**. That means:
  - SSR output = the stacked, both-sides-visible version. Correct for crawlers, correct with JS off, and both arguments are in the initial HTML.
  - After hydration on a wide screen it upgrades to tabs. No hydration mismatch, because the server snapshot is deterministic.
- In stacked mode: two plain `<section>`s, each with a real `<h3>`, separated by `border-t border-border pt-8 mt-8`. No tablist, no `role="tab"`, no `hidden`. ARIA always matches what is actually visible — which is the thing a CSS-only breakpoint hack cannot guarantee.

### Accessibility — WAI-ARIA Tabs, at `md+` only

```
<div role="tablist" aria-label="Arguments for and against Amendment 3">
  <button role="tab" id="a3-tab-yes" aria-selected={active==='yes'}
          aria-controls="a3-panel-yes" tabIndex={active==='yes' ? 0 : -1} />
  ...
<div role="tabpanel" id="a3-panel-yes" aria-labelledby="a3-tab-yes" hidden={active!=='yes'} />
```

- **Roving tabindex:** only the selected tab is in the tab order. Tab enters the tablist once, then the next Tab goes into the panel content — which is the correct and expected behaviour.
- **Keyboard:** `ArrowLeft`/`ArrowRight` and `ArrowUp`/`ArrowDown` move and activate; `Home`/`End` jump to first/last. Use **automatic activation** (select on arrow) — with only two lightweight panels already in the DOM, manual activation adds a required Enter press for no benefit.
- Move DOM focus to the newly selected tab button when arrow keys change it, so the roving tabindex and actual focus stay in sync.
- **`tabIndex` on the panel:** omit it. The APG rule is that a panel gets `tabindex="0"` only when it contains no focusable children; these panels contain source links. Adding it creates a dead tab stop.
- Hidden panel uses the `hidden` attribute, so it's out of the a11y tree and out of the tab order automatically — no `aria-hidden` needed and no focus trap to manage.
- Active state is never colour-only: `aria-selected` carries it programmatically, and the solid navy fill plus white text is a ~16:1 contrast shift, not a hue shift.
- Do **not** autofocus the panel or scroll on switch. The reader's eye is already there.
- Respect `prefers-reduced-motion` — already global; just don't add a slide/fade transition between panels. A crossfade on a tab switch is a motion trigger for some users and adds nothing.

---

## 6. Page assembly order

```
Header (fixed, 80px)
Breadcrumbs (full-width white bar, + BreadcrumbList JSON-LD)
H1 + one-paragraph direct answer
<ElectionStatusBanner />          // full-bleed strip, not sticky
<QuickAnswer>  "In plain English" </QuickAnswer>
grid lg:grid-cols-[240px_minmax(0,1fr)]
  ├─ <StickyToc />                // lg:sticky top-28 | mobile bar sticky top-20 z-40
  └─ main
       <CurrentVsProposedTable />  // #comparison
       <CaseToggle />              // #arguments
       ...the two main tools...    // #calculator etc.
       <BallotNewsFeed />          // #news
       <FaqSection /> + faqSchema()
Footer
```

Every `<section>` target: `id`, `tabIndex={-1}`, `className="scroll-mt-28 focus:outline-none"`.

## 7. Verification before calling it done

```bash
cd /Users/barretthenry/Projects/nowtb-next
npx tsc --noEmit
npx next build
```
Build is the real gate — this repo has no ESLint config, so `next lint` only offers to create one.

Manual checks worth doing because they are the ones that actually fail:
1. Tab from the top of the page to the first TOC link, hit Enter, then Tab again — focus must be **inside** the target section, not back in the TOC.
2. Switch the case toggle, then Cmd-F for a phrase from the hidden side — it should not be found (confirms `hidden`, not `opacity-0`).
3. View source (not devtools) on the built page and confirm **both** case panels and all table rows are in the raw HTML.
4. Throttle to a 375px viewport and confirm header + banner + TOC bar leaves real content above the fold.
5. Set the system clock to Nov 1–3, 2026 and confirm the day count goes 2 → 1 → 0 with no off-by-one across the DST change.

## Formulas
daysUntil = (toUTC(electionDate) - toUTC(ymd(now))) / 86400000, where ymd(d) = Intl.DateTimeFormat('en-CA', {timeZone, year:'numeric', month:'2-digit', day:'2-digit'}).format(d) and toUTC('YYYY-MM-DD') = Date.UTC(y, m-1, d). Calendar-day math in the target zone — DST-proof, which matters because US DST ends Nov 1 2026, two days before the election.
phase = result ? (result.yesPercent >= (result.thresholdPercent ?? 60) ? 'passed' : 'failed') : (phaseOverride ?? (daysUntil > 0 ? 'countdown' : daysUntil === 0 ? 'election-day' : 'awaiting-results'))
Florida constitutional amendment passes when yesPercent >= 60. Default thresholdPercent = 60.
Results bar: yes segment width = `${yesPercent}%`; threshold tick positioned at left = `${thresholdPercent}%`.
Scroll-spy active id = first item in document order whose section intersects the band defined by rootMargin `-${headerOffset + 8}px 0px -65% 0px`; if none intersect, retain the previous active id.
Scroll-spy click lock: observer callback returns early while Date.now() < lockUntilRef.current, where lockUntilRef is set to Date.now() + 700 on link click.
News feed: counts[lean] = items.filter(i => i.lean === lean).length; visible = items.filter(matchesFilter).sort(by publishedAt desc).slice(0, shownCount); shownCount starts at initialCount and increments by initialCount.
Grid-overlap for zero-jump tab panels: both panels get `[grid-area:1/1]` inside a `grid` parent, so container height = max(panelHeights).

## Caveats
Political content by a licensed broker: keep the page strictly informational. No 'Yes on 3' / 'No on 3' branding, no donate links, no campaign logos, no endorsement. Florida political advertising disclaimer rules attach to advocacy, not to neutral explanation — staying neutral avoids the question entirely. The news feed's balanceNote and visible per-lean counts are the main defensibility artifact; do not ship the feed without them.
Per MEMORY: the nowtb exit-intent popup is SELLER PAGES ONLY (settled Oct 18 2026) and a guard enforces it. An Amendment 3 explainer is not a seller page — do not enable the popup here.
I specified the components only. I did not verify the factual content of Florida Amendment 3 on the Nov 3 2026 ballot, and no component hardcodes any claim about it — all copy, rows, and news items come from src/data/amendment3.ts and need independent sourcing before publish.
I found no existing Amendment 3 page or route in nowtb-next (grep for 'amendment' hit only unrelated condo posts). This is specified as a new build; if a draft exists elsewhere, reconcile the route and the two main tools before building.
Per MEMORY feedback_no_dashes_in_copy: no em/en dashes in any client-facing string in src/data/amendment3.ts. Date and percentage ranges read '2 to 4' or '58.2-41.8', not '2 — 4'. The dashes in this spec are internal prose, not copy.
The mobile comparison-table reflow uses CSS `display: block`, which strips implicit table semantics in several screen readers. The explicit role="table"/"row"/"rowheader"/"cell" attributes are not optional decoration — skip them and the table becomes an unlabelled block list on phones.
includePlainTextSummary on the comparison table defaults to false on purpose. An sr-only restatement duplicates the entire table inside the same page, which works against the extraction it is meant to help. Use a visible QuickAnswer paragraph above the table instead.
CaseToggle's responsive mode switch needs useSyncExternalStore with a server snapshot of false (stacked). A plain useEffect + useState will flash the stacked layout on desktop; a CSS-only breakpoint cannot keep the ARIA tab roles in sync with what is actually visible.
ElectionStatusBanner must not render a day count during SSR. Server-render the sentence with the date only and inject the number after mount, or you get a hydration mismatch and a number that can be stale in production.
Rejected by design, flagged so nobody re-adds it: interleaving the news feed by lean so the first screen looks balanced. It is an undisclosed editorial reorder on a tax measure by an agent with a financial interest. Strict date sort plus visible counts is the defensible version.
Everything uses dependencies already in package.json (react, lucide-react, clsx, tailwind-merge, date-fns). No new installs. Note this repo is Tailwind v3, so tailwind.config.ts IS read — the v4 '@theme inline' rule in memory applies to other sites, not this one.