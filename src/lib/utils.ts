// =============================================================================
// Utility functions used across the app
// =============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import type { Listing } from './types';

// Fallback image when a listing has no photos
const PLACEHOLDER_IMAGE = '/images/no-photo.jpg';

// -----------------------------------------------------------------------------
// Styling
// -----------------------------------------------------------------------------

/**
 * Merge Tailwind classes without conflicts.
 * Combines clsx (conditional classes) + tailwind-merge (deduplication).
 * Usage: cn('px-4 py-2', isActive && 'bg-blue-500', className)
 */
// NOTE: TITLE_SUFFIX / TITLE_BUDGET deliberately live in src/app/layout.tsx,
// next to the Metadata `title.template` they describe — not here. Do not add a
// second copy in this file; two definitions of the same budget is how the
// realtor-page title bug happened in the first place.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

/**
 * Format a number as a USD price string.
 * Example: 450000 -> "$450,000"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format an ISO date string to a readable date.
 * Example: "2026-05-12T14:30:00Z" -> "May 12, 2026"
 */
export function formatDate(date: string): string {
  try {
    return format(parseISO(date), 'MMMM d, yyyy');
  } catch {
    // If the date string is invalid, return it as-is
    return date;
  }
}

/**
 * Format square footage with commas.
 * Example: 2450 -> "2,450 sq ft"
 */
export function formatSqFt(sqft: number): string {
  return `${sqft.toLocaleString('en-US')} sq ft`;
}

// -----------------------------------------------------------------------------
// WordPress content cleanup
// -----------------------------------------------------------------------------

// =============================================================================
// Boilerplate removal — read this before touching anything below
// =============================================================================
//
// WHAT WENT WRONG BEFORE (so nobody re-introduces it):
//
// The old version removed boilerplate with `cleaned.substring(0, idx)` — find a
// pattern, then throw away EVERYTHING from the match to the end of the document.
// Two problems compounded each other:
//
//   1. TRUNCATION IS THE WRONG TOOL. Boilerplate is not always the last thing
//      in the file. On 1,640 of our 3,244 records the trailing
//      <script type="application/ld+json"> FAQPage block sits AFTER the footer
//      boilerplate. Truncating at the footer therefore deleted the FAQ schema
//      too. Measured: FAQPage schema survived on only 885 of the 2,833 records
//      that actually have it.
//
//   2. THE "LAST 30%" GUARD WAS UNSOUND BY CONSTRUCTION. Some patterns only
//      fired when the match sat past 70% of the document, on the theory that
//      "late = boilerplate". But an FAQ section is ALWAYS near the end — that is
//      where FAQs belong. So the guard fired on essentially every page with
//      FAQs instead of protecting them. The same held for a pattern matching any
//      <h2> containing "Real Estate" or "Explore": on a real estate site a late
//      <h2>Frequently Asked Questions About Lutz FL Real Estate</h2> is normal
//      prose, and it got the whole tail of the article deleted.
//      Total damage measured across all four corpora: ~1,052,000 words.
//
// A position percentage is NOT a safety property. It is a guess about where
// content lives, and it is wrong whenever the content legitimately lives there.
//
// WHAT WE DO INSTEAD — three rules, each with a real safety property:
//
//   Rule 1 (structure):  Boilerplate is identified by the wrapper CLASS the old
//                        WordPress template emitted (nowtb-footer-section,
//                        nowtb-related, …). Those classes were machine-written,
//                        never typed by a human, so they are reliable. We then
//                        EXCISE that one element (matched open tag → matched
//                        close tag, by depth counting) instead of truncating.
//                        Everything after it survives.
//   Rule 2 (structure):  A heading may only mark boilerplate when the thing
//                        immediately after it is a pure link directory — a
//                        <ul>/<ol>/<div> whose entire contents are three or more
//                        <a> tags and nothing else. Prose can never satisfy
//                        that, so this cannot eat an article. We excise the
//                        heading + that list only.
//   Rule 3 (structure):  Orphaned IDX widget stubs — a heading followed by one
//                        of the generated placeholder paragraphs that used to
//                        introduce a listings widget we no longer render.
//                        Matched as a bounded heading+paragraph pair.
//
// Plus two hard invariants that make FAQ loss impossible rather than unlikely:
//
//   - FAQ_CONTENT_GUARD: any candidate excision whose removed span contains a
//     "Frequently Asked Questions" heading or a FAQPage schema is REFUSED. The
//     block stays. Worst case we keep some boilerplate; we never lose an FAQ.
//   - JSON-LD RESCUE: any <script type="application/ld+json"> found inside a
//     removed span is re-inserted in its place. JSON-LD renders nothing visible,
//     so moving it is free, and it is the single highest-value thing on the page
//     for AI answer engines.
//
// If it breaks, check:
//   - Boilerplate suddenly showing up on pages → the wrapper class changed in
//     src/data/*.json, or FAQ_CONTENT_GUARD is refusing the excision because
//     real FAQ content got nested inside the footer div. Log the refusal count.
//   - Content disappearing again → somebody added a heading-TEXT pattern
//     without a structural requirement. Don't. Add a class or a shape instead.
//   - A whole page rendering blank → findElementSpan returned a span starting
//     at 0. It returns null on unbalanced HTML precisely to avoid that.
// =============================================================================

/**
 * Wrapper classes the legacy WordPress template emitted around its duplicated
 * footer furniture. These are the ONLY reliable boilerplate markers we have:
 * they were generated by a template, so no human ever typed them into an
 * article body. Heading text, by contrast, is written by hand and overlaps with
 * real content — which is exactly how the old truncation bug happened.
 */
const BOILERPLATE_WRAPPER_CLASSES = [
  'nowtb-footer-section', // outermost wrapper around the whole footer block
  'nowtb-related',        // "Related Articles" thumbnail grid
  'nowtb-communities',    // "Explore Tampa Bay Communities" chip grid
  'nowtb-resources',      // "Helpful Resources" pill row
  'nowtb-about',          // duplicated agent bio
  'nowtb-disclaimer',     // duplicated legal disclaimer + "Last Updated"
];

/**
 * Matches `class="… nowtb-related …"` with word boundaries, so a wrapper that
 * carries extra classes still matches. Not global — we re-search after each
 * excision because indexes shift.
 */
const BOILERPLATE_WRAPPER_RE = new RegExp(
  `class="[^"]*\\b(?:${BOILERPLATE_WRAPPER_CLASSES.join('|')})\\b[^"]*"`,
  'i'
);

/**
 * Headings that MIGHT introduce a link directory. On their own these prove
 * nothing — we only act when the next element is verified to be a pure list of
 * links (see isPureLinkDirectory). Note "Frequently Asked Questions" is
 * deliberately absent and must never be added here.
 */
const LINK_DIRECTORY_HEADING_RE =
  /<h2[^>]*>\s*(?:Related (?:Resources|Articles)|More [^<]{0,80}?Resources|Helpful Resources|Explore (?:Tampa Bay )?Communities)\s*<\/h2>/gi;

/**
 * Dead IDX widget stubs. The `[showcaseidx]` shortcode is stripped earlier in
 * this function, which leaves behind a heading plus a generated placeholder
 * paragraph introducing listings that no longer render. We match the exact
 * generated sentences, so this can only ever hit the generator's own output —
 * that specificity is what replaces the old, far too loose
 * `<h2>…Homes for Sale</h2>` / `<h2>…Real Estate|Explore…</h2>` patterns.
 */
const DEAD_WIDGET_STUB_RE =
  /<h2[^>]*>[^<]{0,160}<\/h2>\s*<p[^>]*>\s*(?:Browse current listings in|See what homes recently sold for in)[^<]{0,200}<\/p>/gi;

/**
 * The hard invariant. If a span we are about to delete contains an FAQ heading
 * or FAQPage structured data, we refuse to delete it. FAQs are the highest-value
 * content on the site for AI answer engines, so the failure mode is biased
 * entirely toward keeping too much rather than losing any.
 */
const FAQ_CONTENT_GUARD =
  /<h[1-6][^>]*>[^<]{0,200}Frequently Asked Questions|"@type"\s*:\s*"FAQPage"/i;

/** Structured data blocks, rescued out of anything we remove. */
const JSON_LD_RE =
  /<script[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi;

/** HTML elements that never have a closing tag, so they can't be depth-matched. */
const VOID_TAGS = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source']);

/**
 * Given an index that falls INSIDE an element's opening tag, return the
 * [start, end) span of that whole element — its `<` through its matching
 * closing tag — by counting nesting depth of same-named tags.
 *
 * Returns null when the HTML is unbalanced. That is deliberate: guessing
 * (e.g. "cut to the end of the document") is what caused the original bug.
 * Refusing to act leaves boilerplate on the page, which is survivable.
 *
 * If it breaks, check: WP content occasionally contains an unclosed <div>.
 * Those come back as null and the block is simply left alone.
 */
function findElementSpan(
  html: string,
  indexInsideOpenTag: number
): { start: number; end: number } | null {
  const start = html.lastIndexOf('<', indexInsideOpenTag);
  if (start < 0) return null;

  const nameMatch = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec(html.slice(start, start + 24));
  if (!nameMatch) return null;
  const tag = nameMatch[1].toLowerCase();

  const openEnd = html.indexOf('>', indexInsideOpenTag);
  if (openEnd < 0) return null;

  // <img …> / <div … /> have no separate closing tag
  if (VOID_TAGS.has(tag) || html[openEnd - 1] === '/') {
    return { start, end: openEnd + 1 };
  }

  const scanner = new RegExp(`<${tag}\\b|<\\/${tag}\\s*>`, 'gi');
  scanner.lastIndex = openEnd + 1;
  let depth = 1;
  let m: RegExpExecArray | null;
  while ((m = scanner.exec(html)) !== null) {
    if (m[0][1] === '/') {
      depth--;
      if (depth === 0) return { start, end: m.index + m[0].length };
    } else {
      depth++;
    }
  }
  return null; // unbalanced — refuse to guess
}

/**
 * Remove html[start, end) unless it holds protected content, re-inserting any
 * JSON-LD that lived inside it. Returns null when the removal was refused, so
 * callers can skip that block instead of silently dropping content.
 */
function exciseBlock(html: string, start: number, end: number): string | null {
  const removed = html.slice(start, end);
  if (FAQ_CONTENT_GUARD.test(removed)) return null; // hard invariant — keep it
  const rescued = (removed.match(JSON_LD_RE) || []).join('\n');
  return html.slice(0, start) + (rescued ? `\n${rescued}\n` : '') + html.slice(end);
}

/**
 * True when `block` is nothing but a list of links — three or more <a> tags and
 * no other text at all once tags and punctuation are removed.
 *
 * THIS is the safety property that makes the heading patterns safe. A real
 * article section always leaves prose behind after anchors are stripped, so it
 * can never be mistaken for a link directory. Compare that to "is this heading
 * in the last 30% of the page?", which tells you nothing about whether the
 * thing under the heading is content or navigation.
 */
function isPureLinkDirectory(block: string): boolean {
  const linkCount = (block.match(/<a\b[^>]*href=/gi) || []).length;
  if (linkCount < 3) return false;
  const residue = block
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '') // drop whole anchors
    .replace(/<[^>]*>/g, '')                  // drop remaining tags
    .replace(/&\w+;|&#\d+;/g, '')             // drop entities (&rarr; etc.)
    .replace(/[\s,.:;|>→-]/g, '');            // drop separator punctuation
  return residue.length === 0;
}

/**
 * Strip the legacy WordPress footer boilerplate from a content body.
 * Excises bounded blocks only — never truncates to end-of-document.
 */
function stripBoilerplateBlocks(input: string): string {
  let cleaned = input;

  // --- Rule 1: class-anchored wrapper elements -------------------------------
  // Loop because a page can carry several, and indexes shift after each cut.
  // The counter is only a runaway guard; real pages have fewer than 10.
  for (let pass = 0; pass < 60; pass++) {
    const idx = cleaned.search(BOILERPLATE_WRAPPER_RE);
    if (idx < 0) break;

    const span = findElementSpan(cleaned, idx);
    const next = span ? exciseBlock(cleaned, span.start, span.end) : null;

    if (next === null) {
      // Either unbalanced HTML or the FAQ guard refused. Keep the block, but
      // rename its class attribute so the next search() moves past it instead
      // of matching the same spot forever.
      const attr = cleaned.slice(idx).match(/^class="[^"]*"/);
      if (!attr) break;
      cleaned =
        cleaned.slice(0, idx) + 'data-kept-boilerplate="1"' + cleaned.slice(idx + attr[0].length);
      continue;
    }
    cleaned = next;
  }

  // --- Rule 2: heading + verified pure link directory -----------------------
  // Collect every qualifying span first, then excise right-to-left so earlier
  // indexes stay valid.
  {
    const spans: Array<{ start: number; end: number }> = [];
    LINK_DIRECTORY_HEADING_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = LINK_DIRECTORY_HEADING_RE.exec(cleaned)) !== null) {
      const afterHeading = m.index + m[0].length;
      const offset = cleaned.slice(afterHeading).search(/\S/);
      if (offset < 0) continue;
      const listStart = afterHeading + offset;
      // The next element must be a list/grid container, not a paragraph.
      if (!/^<(?:ul|ol|div)\b/i.test(cleaned.slice(listStart, listStart + 6))) continue;
      const span = findElementSpan(cleaned, listStart + 1);
      if (!span) continue;
      if (!isPureLinkDirectory(cleaned.slice(span.start, span.end))) continue;
      spans.push({ start: m.index, end: span.end });
    }
    for (let i = spans.length - 1; i >= 0; i--) {
      const next = exciseBlock(cleaned, spans[i].start, spans[i].end);
      if (next !== null) cleaned = next;
    }
  }

  // --- Rule 3: orphaned IDX widget stubs ------------------------------------
  {
    const spans: Array<{ start: number; end: number }> = [];
    DEAD_WIDGET_STUB_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = DEAD_WIDGET_STUB_RE.exec(cleaned)) !== null) {
      spans.push({ start: m.index, end: m.index + m[0].length });
    }
    for (let i = spans.length - 1; i >= 0; i--) {
      const next = exciseBlock(cleaned, spans[i].start, spans[i].end);
      if (next !== null) cleaned = next;
    }
  }

  return cleaned;
}

// =============================================================================
// Image dimensions (Cumulative Layout Shift)
// =============================================================================
//
// ~7,143 <img> tags in the content corpora ship with no width/height. The
// browser can't reserve space for them, so the page jumps as each one loads.
// That is Cumulative Layout Shift, one of the Core Web Vitals Google ranks on,
// and it is also just unpleasant to read.
//
// WHY WE DO NOT INVENT NUMBERS: a wrong width/height sets a wrong aspect ratio
// and visibly squashes or stretches the photo. So we only ever write dimensions
// we can read off the asset itself. Two sources are trustworthy:
//
//   1. WordPress resize suffix — `pexels-8314415-1679-300x158.jpg`. WP puts the
//      real pixel size of the generated file in the filename. 6,585 images.
//   2. Image-CDN query params — `…?w=800&h=500&fit=crop`. Unsplash and similar
//      are being asked to return exactly that size, so that IS the size. ~493.
//
// That covers 7,078 of 7,143 (99.1%). The remaining ~65 are hand-uploaded files
// with no size anywhere in the markup or the URL, so we leave their dimensions
// alone rather than guess — a CSS `aspect-ratio` would be just as much of a
// fabrication as a width/height pair, and getting it wrong distorts the photo.
// Fixing that last 1% needs the real files measured at build time, which is a
// data-pipeline job, not something a render-time string function should do.
//
// Everything below the first image also gets loading="lazy"; every image gets
// decoding="async". The first image is left eager because it is the most likely
// Largest Contentful Paint element and lazy-loading the LCP image makes LCP
// worse. We deliberately do NOT add fetchpriority="high" — templates may render
// their own hero above this content, so we don't know that this really is LCP.
//
// If it breaks, check:
//   - An image looks squashed → something matched the `-WxH` pattern that isn't
//     actually a resize suffix (e.g. a filename ending "-2024x2026"). Tighten
//     the extension list in WP_RESIZE_SUFFIX_RE.
//   - Dimensions ignored → the tag has an inline `style` with an explicit
//     height. CSS always beats HTML attributes; that's fine, the attributes are
//     only there to reserve space when CSS doesn't already pin the box.
// =============================================================================

/** `…-300x158.jpg` → WordPress' own record of the file's real pixel size. */
const WP_RESIZE_SUFFIX_RE = /-(\d{2,4})x(\d{2,4})\.(?:jpe?g|png|webp|avif|gif)(?:$|[?#"])/i;

/** `?w=800&h=500` → the size we are asking the image CDN to return. */
const CDN_WIDTH_PARAM_RE = /[?&]w=(\d{2,4})\b/i;
const CDN_HEIGHT_PARAM_RE = /[?&]h=(\d{2,4})\b/i;

/**
 * Add width/height (only where the real size is knowable), plus lazy loading
 * and async decoding, to every <img> in a content body.
 */
function addImageDimensions(html: string): string {
  let isFirstImage = true;

  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const isHero = isFirstImage;
    isFirstImage = false;
    let out = tag;

    // Only touch dimensions when BOTH are missing. If the export already set
    // one of them, somebody had a reason and we shouldn't half-override it.
    const hasWidth = /\swidth\s*=/i.test(out);
    const hasHeight = /\sheight\s*=/i.test(out);
    if (!hasWidth && !hasHeight) {
      const src = out.match(/\ssrc="([^"]*)"/i)?.[1] ?? '';
      let width: string | undefined;
      let height: string | undefined;

      const wpSize = src.match(WP_RESIZE_SUFFIX_RE);
      if (wpSize) {
        width = wpSize[1];
        height = wpSize[2];
      } else {
        const cdnW = src.match(CDN_WIDTH_PARAM_RE);
        const cdnH = src.match(CDN_HEIGHT_PARAM_RE);
        if (cdnW && cdnH) {
          width = cdnW[1];
          height = cdnH[1];
        }
      }

      // No trustworthy size available → leave it alone. Guessing distorts.
      if (width && height) {
        out = out.replace(/<img\b/i, `<img width="${width}" height="${height}"`);
      }
    }

    if (!/\sdecoding\s*=/i.test(out)) {
      out = out.replace(/<img\b/i, '<img decoding="async"');
    }
    // Never lazy-load the first image — it is the likely LCP element.
    if (!isHero && !/\sloading\s*=/i.test(out)) {
      out = out.replace(/<img\b/i, '<img loading="lazy"');
    }

    return out;
  });
}

/**
 * Clean WordPress post_content HTML for rendering in Next.js.
 * Preserves layout classes (nowtb-*, bbs-*) and inline styles so that
 * stat grids, CTA boxes, FAQ sections, and highlight boxes render properly.
 * Strips WP boilerplate <style> blocks, shortcodes, and comments.
 */
export function cleanWpContent(html: string): string {
  let cleaned = html
    // 1. Strip entire <style> blocks (WP theme CSS — we define styles in globals.css)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // 2. Strip HTML comments (<!-- wp:html --> etc.)
    .replace(/<!--[\s\S]*?-->/g, '')
    // 3. Strip WordPress shortcodes
    .replace(/\[showcaseidx[^\]]*\]/g, '')
    .replace(/\[nowtb_[^\]]*\]/g, '')
    .replace(/\[last_updated\]/g, 'July 2026')
    // 3b. Strip inline CTA divs (Schedule a Buyer Strategy Call / Calculate Your Payment)
    //     These are now rendered as proper buttons in the page header component
    .replace(/<div[^>]*>(?:<a[^>]*>(?:Schedule a (?:Buyer )?Strategy Call|Calculate Your Payment|Talk to a Tampa Bay Expert|Search All Homes|Talk to Barrett About Investing|See Investment Properties)<\/a>\s*)+<\/div>/gi, '')
    // 3c. (highlight-box dark backgrounds handled by CSS !important override in globals.css)
    // 4. WP image paths — rewrite to local public/ folder
    .replace(/https?:\/\/nowtb\.com\/wp-content\/uploads\//g, '/wp-content/uploads/')
    .replace(/src="\/wp-content\/uploads\//g, 'src="/wp-content/uploads/')
    .replace(/srcset="([^"]*)"/g, (_match, srcset: string) =>
      `srcset="${srcset.replace(
        /https?:\/\/nowtb\.com\/wp-content\/uploads\//g,
        '/wp-content/uploads/'
      )}"`
    )
    .replace(/href="\/wp-content\/uploads\//g, 'href="/wp-content/uploads/')
    // 5. Fix MySQL newline corruption
    .replace(/>nn</g, '><')
    .replace(/>nn/g, '>\n')
    // 6. Strip width-constraining inline styles from WP content
    .replace(/\s*max-width:\s*\d+px;?/gi, '')
    .replace(/\s*width:\s*\d{4,}px;?/gi, '') // Strip fixed widths over 999px (e.g., width:1200px)
    // `[^;"<]*` instead of `[^;]*` on purpose. The old `[^;]*` was greedy and
    // only stopped at a semicolon, so on markup like
    //   <div style="margin:0 auto">\n<div style="display:flex;…
    // (which has no semicolon after `auto`) it ran straight through the quote,
    // the `>` and the NEXT opening <div> tag until it found the first `;`
    // inside the following style attribute — silently deleting a whole element
    // and leaving an orphaned </div> behind. Excluding `"` and `<` stops the
    // match at the end of the attribute value, which is where it belongs.
    // If it breaks, check: count `<div` vs `</div>` in the output; they should
    // match the input. 17 records were corrupted this way.
    .replace(/\s*margin:\s*\d+px\s+auto[^;"<]*;?/gi, '')
    .replace(/\s*margin:\s*0\s+auto[^;"<]*;?/gi, '')
    // 6b. Fix CTA button colors from WP content:
    //     - Gold buttons (#c8a84b, #e8a020) → white with dark text (on dark bg sections)
    //     - White buttons (#fff) on light backgrounds → blue (#2563eb) with white text
    .replace(/(<a[^>]*style="[^"]*?)background:\s*#c8a84b\b/gi, '$1background:#fff')
    .replace(/(<a[^>]*style="[^"]*?)background:\s*#e8a020\b/gi, '$1background:#fff')
    .replace(/(<a[^>]*style="[^"]*?background:\s*#fff[^"]*?)color:\s*#fff\b/gi, '$1color:#0f172a')
    .replace(/(<a[^>]*style="[^"]*?)background:\s*white\b/gi, '$1background:#2563eb')
    // 7. Strip useless WP inline styles: font-family overrides, empty styles
    .replace(/style="\s*font-family:[^"]*"/gi, '')
    .replace(/style="\s*"/gi, '')
    // 8. Strip WP wrapper divs that only add spacing/width constraints
    .replace(/<div style="[^"]*margin:\s*\d+px auto[^"]*">/gi, '<div>')
    // 9. Clean up truly empty divs (no class, no content)
    .replace(/<div>\s*<\/div>/gi, '');

  // 9. Remove the legacy WordPress footer boilerplate.
  //
  //    This used to truncate the document at the first boilerplate marker and
  //    at any late-looking heading, which deleted roughly 1,052,000 words of
  //    real published content and the FAQPage schema on 1,948 pages. See the
  //    long comment block above stripBoilerplateBlocks for the full post-mortem
  //    and for why a "last 30% of the page" check can never be a safety check.
  //
  //    Boilerplate is now EXCISED as a bounded block (matched open tag to
  //    matched close tag), identified by the template-generated wrapper class or
  //    by a verified pure-link-directory shape. Nothing is ever truncated to the
  //    end of the document, FAQ content is protected by a hard guard, and any
  //    JSON-LD that lived inside a removed block is re-inserted.
  //
  //    Note on the trailing "Need Help With Tampa Bay Real Estate?" CTA box
  //    (1,616 records): it is now RESTORED, because the old truncation was
  //    taking it out as collateral. It is kept on purpose — the market-updates,
  //    guides, regional and neighborhood templates render no phone CTA of their
  //    own, so stripping it would leave those pages with no call-to-action at
  //    all. A duplicated CTA is a much smaller problem than a missing one.
  cleaned = stripBoilerplateBlocks(cleaned);

  // 10. Reserve space for images so the page doesn't jump while it loads.
  //     Runs AFTER boilerplate removal so that "the first image" means the
  //     first image a reader actually sees, not a thumbnail in a footer grid
  //     that we just deleted.
  cleaned = addImageDimensions(cleaned);

  // 11. Clean up leftovers: wrapper divs emptied by an excision, plus
  //     excessive whitespace.
  cleaned = cleaned
    .replace(/<div[^>]*>\s*<\/div>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

// -----------------------------------------------------------------------------
// URL helpers
// -----------------------------------------------------------------------------

/**
 * Convert any text to a URL-safe slug.
 * Example: "Tampa Bay Area" -> "tampa-bay-area"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special characters
    .replace(/[\s_]+/g, '-')     // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')         // Collapse multiple hyphens
    .replace(/^-|-$/g, '');      // Trim leading/trailing hyphens
}

/**
 * Build an SEO-friendly URL for a listing detail page.
 * Format: /properties/StellarMLS/{MlsId}/{city-slug}/{address-slug}
 * Example: /properties/StellarMLS/TB8526478/tampa/5120-n-matanzas-avenue
 */
export function getListingUrl(listing: Listing): string {
  const citySlug = slugify(listing.City || 'florida');
  const addressSlug = slugify(listing.UnparsedAddress || 'listing');
  const mlsId = listing.ListingId || listing.ListingKey;
  return `/properties/StellarMLS/${mlsId}/${citySlug}/${addressSlug}`;
}

/**
 * Parse the new SEO-friendly listing URL segments.
 * Expected: ["StellarMLS", "TB8526478", "tampa", "5120-n-matanzas-avenue"]
 * Returns the MLS ID for API lookup.
 */
export function extractMlsId(segments: string[]): string | null {
  // New format: /properties/StellarMLS/{mlsId}/{city}/{address}
  if (segments.length >= 2 && segments[0] === 'StellarMLS') {
    return segments[1];
  }
  return null;
}

/**
 * Extract the ListingKey from an old-format listing URL slug.
 * Used for backward compatibility redirects from old URLs.
 * Old format: /properties/{address-slug}-{listingKey}
 */
export function extractListingKey(slug: string): string {
  // If the slug IS just a raw ListingKey (32 hex chars), use as-is
  if (/^[a-f0-9]{20,}$/i.test(slug)) return slug;
  // Look for a 32-char hex key at the end of the slug
  const match = slug.match(/([a-f0-9]{32})$/i);
  if (match) return match[1];
  // Try the last hyphen-separated segment if it looks like a key
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  if (/^[a-f0-9]{16,}$/i.test(lastPart)) return lastPart;
  // Fallback: use the whole slug as the key
  return slug;
}

/**
 * Get the primary photo URL for a listing.
 * Returns the first Media item sorted by Order, or a placeholder if no photos.
 */
export function getListingPhotoUrl(listing: Listing): string {
  // If there are media items, grab the one with the lowest Order value
  if (listing.Media && listing.Media.length > 0) {
    const sorted = [...listing.Media].sort((a, b) => a.Order - b.Order);
    return sorted[0].MediaURL;
  }
  // No photos — return placeholder
  return PLACEHOLDER_IMAGE;
}

/**
 * Build a search-friendly meta description from a post excerpt.
 *
 * Excerpts were written for on-page display, so they run in both directions:
 * 314 posts ran past Google's ~155 char cutoff and got truncated mid-sentence,
 * 561 came in under 120 and left result space unused. This caps the long end
 * without touching the excerpt itself, which the blog cards still render.
 * It does NOT fix the short end — see the comment on MIN/MAX below.
 *
 * Long excerpts are cut at a sentence end where possible, then a word boundary.
 * Short ones get the agent CTA appended, but only when it actually fits.
 * If it breaks, check: the result should always land at or under 155 chars.
 */
export function metaDescription(excerpt: string | undefined, title: string): string {
  const CTA = "Call Barrett Henry, REALTOR® at (813) 733-7907.";

  // House standard is 120-155 characters. MAX was 160, which is why the long
  // tail of descriptions ran over: Google renders roughly 155 characters on
  // desktop, so anything above that gets clipped with an ellipsis and the CTA
  // at the end of the sentence never gets read.
  //
  // IMPORTANT — this constant only fixes the TOP of the window. It caps long
  // descriptions; it cannot lengthen short ones. Many comparison, regional,
  // guide and misc pages have excerpts under 120 characters, and for those the
  // only real fix is writing better excerpts in the source content. The CTA
  // append below helps where there is room, but a 40-character excerpt plus a
  // 46-character CTA still lands at 87 — under the window. Do not read a
  // passing build as "descriptions are now all 120-155".
  const MAX = 155;
  const MIN = 120;

  // Excerpts can carry HTML from the WordPress export — strip it for meta use
  let text = (excerpt || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) text = `${title} — Barrett Henry, REALTOR® at REMAX Collective.`;

  if (text.length > MAX) {
    const cut = text.slice(0, MAX);
    // Prefer ending on a complete sentence, otherwise the last whole word
    const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
    if (sentence > MIN) return cut.slice(0, sentence + 1).trim();
    const word = cut.lastIndexOf(" ");
    return (word > MIN ? cut.slice(0, word) : cut).trim();
  }

  if (text.length < MIN && text.length + CTA.length + 1 <= MAX) {
    return `${text} ${CTA}`;
  }

  return text;
}
