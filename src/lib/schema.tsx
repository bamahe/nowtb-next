/**
 * JSON-LD schema generators for SEO.
 * Used in generateMetadata() or inline <script> tags.
 */

import React from "react";

import { Listing } from "./types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com";
const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "(813) 733-7907";
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "barrett@nowtb.com";

// -----------------------------------------------------------------------------
// SHARED ENTITY CONSTANTS
// Everything below is published inside structured data, which is how Google and
// the AI answer engines (ChatGPT, Perplexity, Google AI Overviews) decide that
// "Barrett Henry" on this site is the SAME person they've seen elsewhere. If two
// pages describe him differently, the engines split him into two weak entities
// instead of one strong one. So these values live here ONCE and get imported —
// never retyped inline in a template.
// -----------------------------------------------------------------------------

/**
 * Barrett's headshot, as a site-root path.
 *
 * WHY THIS IS A CONSTANT: until October 2026 eight different files hardcoded
 * `/images/barrett-henry-headshot.jpg`, which has never existed in public/images.
 * A 404 image on the author Person node weakens the single most important
 * trust/authorship signal on the site. One constant means it can't drift again.
 *
 * If it breaks, check: the file really must exist on disk. Run
 * `ls public/images/barrett-headshot.png`. If you rename the file, change it
 * HERE and nowhere else.
 */
export const BARRETT_HEADSHOT_PATH = "/images/barrett-headshot.png";

/** Absolute URL version — schema.org requires absolute URLs for images. */
export const BARRETT_HEADSHOT_URL = `${SITE_URL}${BARRETT_HEADSHOT_PATH}`;

/**
 * Barrett's social profiles.
 *
 * ANSWERED 2026-10-18 — Barrett confirmed the live pair is:
 *     instagram.com/thenowteam  +  facebook.com/BarrettHenryREALTOR
 *
 * The other pair that used to be hardcoded in layout.tsx and page.tsx
 * (instagram.com/nowtampa + facebook.com/NOWTampaBay) is NOT live and has been
 * removed from both. A dead profile in `sameAs` is worse than no profile at
 * all: it asks an answer engine to resolve Barrett's entity against a URL that
 * does not come back, which weakens the entity graph instead of confirming it.
 *
 * This constant is the single source of truth. Any JSON-LD needing social
 * profiles must import BARRETT_SOCIAL_PROFILES rather than inlining handles —
 * inlining is exactly how the two pairs drifted apart in the first place.
 */
export const BARRETT_SOCIAL_PROFILES = [
  "https://www.facebook.com/BarrettHenryREALTOR",
  "https://www.instagram.com/thenowteam",
  "https://www.linkedin.com/in/barretthenry",
];

/**
 * The full `sameAs` set for Barrett as a Person/RealEstateAgent entity:
 * his own domains plus third-party authority profiles.
 *
 * Barrett's other sites are included because answer engines treat a shared
 * `sameAs` set as proof that all of these properties describe one operator.
 */
export const BARRETT_SAME_AS = [
  SITE_URL,
  "https://barretthenry.remax.com",
  // Barrett's other domains — one operator across all of them
  "https://vivipm.com",
  "https://hencre.com",
  "https://valrico.blog",
  "https://bestbayservices.com",
  "https://vyrabyte.com",
  // Third-party authority profiles. These matter because answer engines cite
  // agent directories directly, so sameAs is what tells them the directory
  // profile and this site are the same entity.
  "https://www.fastexpert.com/agents/barrett-henry-135533/",
  ...BARRETT_SOCIAL_PROFILES,
];

/**
 * Barrett's designations, as schema.org credential objects.
 * He holds e-PRO, MRP and SRS — and NO others. Never add a credential here
 * without a certificate to back it up; a fabricated credential in structured
 * data is a trust violation.
 */
export const BARRETT_CREDENTIALS = [
  { "@type": "EducationalOccupationalCredential", credentialCategory: "Designation", name: "e-PRO" },
  { "@type": "EducationalOccupationalCredential", credentialCategory: "Designation", name: "MRP (Military Relocation Professional)" },
  { "@type": "EducationalOccupationalCredential", credentialCategory: "Designation", name: "SRS (Seller Representative Specialist)" },
];

/**
 * The default `speakable` CSS selectors.
 *
 * `speakable` tells voice search and AI assistants which element on the page
 * holds the quotable answer. A selector that matches NO element is worse than
 * useless — it is a promise the page doesn't keep.
 *
 * If it breaks, check: before you point a template at `.quick-answer`, make
 * sure that template actually renders <QuickAnswer> (components/ui/QuickAnswer.tsx
 * is what emits `class="quick-answer"`). Note that the WordPress content export
 * uses a DIFFERENT class, `bbs-quick-answer`, which `.quick-answer` does NOT
 * match — CSS class selectors match whole tokens, not substrings.
 */
export const DEFAULT_SPEAKABLE_SELECTORS = [".quick-answer", "h1"];

/** The class name QuickAnswer renders. Use this when you need to feature-detect. */
export const QUICK_ANSWER_CLASS = "quick-answer";

/**
 * The equivalent classes inside exported WordPress content HTML.
 *
 * The export is inconsistent, which is why there are two. Measured across the
 * 232 market updates: 71 pages have the full wrapper + label + text structure,
 * 94 have only the `bbs-quick-answer` wrapper, and 67 use an inline-styled div
 * with NO class at all (those can only offer `h1`).
 */
export const WP_QUICK_ANSWER_CLASS = "bbs-quick-answer";
export const WP_QUICK_ANSWER_TEXT_CLASS = "bbs-quick-answer-text";

/**
 * The full author `Person` node for Barrett.
 *
 * Article schema requires an author. A bare string ("Barrett Henry") gives the
 * engines nothing to resolve; a full Person with jobTitle, image, sameAs and
 * credentials is what makes him a citable expert rather than a byline.
 */
export function barrettAuthorPerson() {
  return {
    "@type": "Person",
    name: "Barrett Henry",
    jobTitle: "Broker Associate",
    worksFor: {
      "@type": "RealEstateAgent",
      name: "REMAX Collective",
    },
    url: `${SITE_URL}/about/`,
    image: BARRETT_HEADSHOT_URL,
    telephone: PHONE,
    sameAs: BARRETT_SAME_AS,
    hasCredential: BARRETT_CREDENTIALS,
  };
}

/** RealEstateAgent schema.
 *  NOTE: currently unused. The homepage, /about, and layout.tsx each build
 *  their own RealEstateAgent / Person JSON-LD inline, so editing this function
 *  changes nothing on the live site. Update those three files instead, or
 *  refactor them onto this helper. Kept because the shape here is the most
 *  complete of the four. */
export function realEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Barrett Henry, REALTOR®",
    description:
      "Licensed real estate Broker Associate with REMAX Collective serving Tampa Bay. 23+ years of real estate experience, licensed since September 2003.",
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    // Same headshot everywhere — see BARRETT_HEADSHOT_PATH for why this is a constant
    image: BARRETT_HEADSHOT_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tampa",
      addressRegion: "FL",
      addressCountry: "US",
    },
    parentOrganization: {
      "@type": "RealEstateAgent",
      name: "REMAX Collective",
    },
    areaServed: [
      "Hillsborough County, FL",
      "Pinellas County, FL",
      "Pasco County, FL",
      "Manatee County, FL",
      "Polk County, FL",
      "Sarasota County, FL",
      "Hernando County, FL",
      "Citrus County, FL",
    ],
    knowsAbout: [
      "Residential Real Estate",
      "Investment Properties",
      "New Construction",
      "Military Relocation",
      "First-Time Home Buyers",
    ],
    // Shared entity set (see BARRETT_SAME_AS) plus the extra niche domains that
    // only apply to him as an agent. Array spread + Set removes duplicates so
    // the same URL is never published twice in one node.
    sameAs: Array.from(
      new Set([
        ...BARRETT_SAME_AS,
        "https://valricopropertymgmt.com",
        "https://flforeclosurehelp.com",
        "https://valricoagent.com",
        "https://firsttimehomebuyertb.com",
        "https://valoantb.com",
        "https://tampabaydownpayment.com",
      ])
    ),
  };
}

/**
 * LocalBusiness schema — for about/contact pages and for county/area pages.
 *
 * Every argument is OPTIONAL and every default reproduces the original
 * zero-argument output exactly, so existing callers (and the previous
 * behaviour) are unchanged.
 *
 * NOTE ON `geo`: a LocalBusiness `geo` is supposed to be where the business
 * physically sits. We do NOT have verified coordinates for the REMAX Collective
 * street address, and inventing lat/lng would be fabricating data — so the
 * business node carries no `geo` by default. Area pages instead pass
 * `areaServed`, whose geo comes from real coordinates in src/data/cities.ts.
 */
export function localBusinessSchema(options?: {
  /** Override the business name (e.g. to scope it to a county) */
  name?: string;
  /** One-sentence description of what this page's business coverage is */
  description?: string;
  /** Canonical URL of the page this node is published on */
  url?: string;
  /** The place(s) this page says Barrett serves — carry real geo here */
  areaServed?: Record<string, unknown> | Record<string, unknown>[];
  /** Only pass this if you have VERIFIED coordinates for the office itself */
  geo?: { latitude: number; longitude: number };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: options?.name || "Barrett Henry, REALTOR® — REMAX Collective",
    ...(options?.description ? { description: options.description } : {}),
    telephone: PHONE,
    email: EMAIL,
    url: options?.url || SITE_URL,
    image: BARRETT_HEADSHOT_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tampa",
      addressRegion: "FL",
      addressCountry: "US",
    },
    ...(options?.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: options.geo.latitude,
            longitude: options.geo.longitude,
          },
        }
      : {}),
    ...(options?.areaServed ? { areaServed: options.areaServed } : {}),
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "$$",
  };
}

/** RealEstateListing schema — for individual listing pages */
export function realEstateListingSchema(listing: Listing) {
  const photos = listing.Media?.map((m) => m.MediaURL).filter(Boolean) || [];
  const address = [
    listing.StreetNumber,
    listing.StreetName,
    listing.StreetSuffix,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${address}, ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`,
    description: listing.PublicRemarks?.substring(0, 300),
    url: `${SITE_URL}/properties/${listing.ListingKey}`,
    image: photos,
    datePosted: listing.OriginalEntryTimestamp,
    dateModified: listing.ModificationTimestamp,
    offers: {
      "@type": "Offer",
      price: listing.ListPrice,
      priceCurrency: "USD",
      availability: listing.StandardStatus === "Active"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: listing.City,
      addressRegion: listing.StateOrProvince,
      postalCode: listing.PostalCode,
      addressCountry: "US",
    },
    geo: listing.Latitude && listing.Longitude
      ? {
          "@type": "GeoCoordinates",
          latitude: listing.Latitude,
          longitude: listing.Longitude,
        }
      : undefined,
    numberOfRooms: listing.BedroomsTotal,
    floorSize: listing.LivingArea
      ? {
          "@type": "QuantitativeValue",
          value: listing.LivingArea,
          unitCode: "SQF",
        }
      : undefined,
  };
}

/**
 * Place schema for a city — the factual entity behind every city hub and spoke
 * page. Gives Google and the AI crawlers real coordinates, the county it sits
 * in, and the ZIPs it covers, so "homes for sale in X" resolves to a real
 * location rather than just a page title.
 */
export function cityPlaceSchema(city: {
  name: string;
  slug: string;
  county: string;
  lat: number;
  lng: number;
  zip_codes?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "City",
    name: `${city.name}, Florida`,
    url: `${SITE_URL}/${city.slug}/`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: "FL",
      addressCountry: "US",
      ...(city.zip_codes?.length ? { postalCode: city.zip_codes[0] } : {}),
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.lat,
      longitude: city.lng,
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: `${city.county} County, Florida`,
    },
  };
}

/**
 * ItemList of property listings shown on a page. Search engines and LLMs read
 * this to understand that the page is a real inventory of homes, not just prose
 * — which is what makes it eligible to be cited for "homes for sale in X".
 * Pass only the listings actually rendered, so the markup matches the page.
 */
export function listingItemListSchema(
  listings: Listing[],
  listName: string
) {
  if (!listings.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: realEstateListingSchema(l),
    })),
  };
}

/** BreadcrumbList schema — for spoke pages */
export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article schema for editorial content pages (market reports, rules guides).
 * Author is always Barrett Henry, Broker Associate at REMAX Collective, and the
 * publisher reuses the site's RealEstateAgent entity so Google and the AI
 * crawlers tie the page back to one consistent author.
 */
export function articleSchema(article: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  /** Absolute URL(s) of the article's lead image, if the page has one */
  image?: string | string[];
  /**
   * Override the speakable selectors. Only pass selectors you have CONFIRMED
   * match a real element in this template — see DEFAULT_SPEAKABLE_SELECTORS.
   */
  speakableSelectors?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    ...(article.image ? { image: article.image } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    // Full Person node, not a bare string — see barrettAuthorPerson()
    author: barrettAuthorPerson(),
    publisher: {
      "@type": "RealEstateAgent",
      name: "Barrett Henry, REALTOR®",
      url: SITE_URL,
      telephone: PHONE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/remax-logo-white.png`,
      },
    },
    // Tells AI assistants and voice search which part of the page to read aloud.
    // Defaults preserved for existing callers; templates that don't render
    // <QuickAnswer> MUST pass their own selectors instead of shipping a
    // selector that matches nothing.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: article.speakableSelectors || DEFAULT_SPEAKABLE_SELECTORS,
    },
  };
}

/** FAQPage schema — pass the same questions rendered on the page */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * WebPage schema with a speakable specification. Required alongside the
 * page-specific type so AI answer engines and voice search know which block on
 * the page is the quotable answer.
 */
export function webPageSchema(page: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  /**
   * What this page is actually ABOUT, in plain words.
   *
   * WARNING: the default is "Florida condominium purchases" because this helper was
   * originally written for the seven Gulf-beach condo pages and they still rely
   * on it. That default is WRONG for every other kind of page, so ALWAYS pass
   * `about` on a new caller. It is only optional to avoid changing what those
   * seven pages already publish.
   */
  about?: string;
  /**
   * Override the speakable selectors. Only pass selectors you have CONFIRMED
   * match a real element in this template \u2014 see DEFAULT_SPEAKABLE_SELECTORS.
   */
  speakableSelectors?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url: page.url,
    ...(page.datePublished ? { datePublished: page.datePublished } : {}),
    ...(page.dateModified ? { dateModified: page.dateModified } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: "Barrett Henry, REALTOR\u00ae",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: page.about || "Florida condominium purchases",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: page.speakableSelectors || DEFAULT_SPEAKABLE_SELECTORS,
    },
    publisher: {
      "@type": "RealEstateAgent",
      name: "Barrett Henry, REALTOR\u00ae",
      url: SITE_URL,
      telephone: PHONE,
    },
  };
}

/**
 * AdministrativeArea schema for a county — the county-level twin of
 * cityPlaceSchema(). Gives the answer engines a real, resolvable place instead
 * of just a page title, so "homes for sale in Hillsborough County" can match.
 *
 * `lat`/`lng` must come from real data. CountyPage computes the centroid of the
 * county's cities from the verified coordinates in src/data/cities.ts — it does
 * not guess.
 */
export function countyAreaSchema(county: {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  /** Names of the cities this page lists inside the county */
  cityNames?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AdministrativeArea",
    name: `${county.name} County, Florida`,
    url: `${SITE_URL}/${county.slug}/`,
    address: {
      "@type": "PostalAddress",
      addressRegion: "FL",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: county.lat,
      longitude: county.lng,
    },
    containedInPlace: {
      "@type": "State",
      name: "Florida",
    },
    ...(county.cityNames?.length
      ? {
          containsPlace: county.cityNames.map((n) => ({
            "@type": "City",
            name: `${n}, Florida`,
          })),
        }
      : {}),
  };
}

// -----------------------------------------------------------------------------
// FAQ EXTRACTION
// -----------------------------------------------------------------------------

/** Turn the handful of HTML entities the WordPress export uses back into text. */
function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#8217;|&rsquo;/gi, "’")
    .replace(/&#8216;|&lsquo;/gi, "‘")
    .replace(/&#8220;|&ldquo;/gi, "“")
    .replace(/&#8221;|&rdquo;/gi, "”")
    .replace(/&#8211;|&ndash;/gi, "–")
    .replace(/&#8212;|&mdash;/gi, "—")
    .replace(/&#0?39;|&apos;/gi, "'")
    // &amp; must come last, otherwise "&amp;quot;" double-decodes
    .replace(/&amp;/gi, "&");
}

/** Strip every tag and collapse whitespace, leaving the plain text a human reads. */
function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pull the question/answer pairs out of a page's rendered content HTML.
 *
 * WHY THIS EXISTS: Google requires FAQPage structured data to describe FAQs the
 * visitor can actually SEE. Hand-writing a separate FAQ list for a template
 * would drift from the content and become a structured-data violation (and a
 * manual-action risk). Instead, pass the EXACT SAME html string you hand to
 * dangerouslySetInnerHTML. Then the schema can only ever describe what rendered:
 *   - content truncated / FAQ section missing  -> returns []  -> no schema emitted
 *   - FAQ section visible                      -> returns pairs -> schema matches
 *
 * Handles both shapes present in the WordPress export:
 *   1. <h2>Frequently Asked Questions</h2> then bare <h3>Q</h3><p>A</p> pairs
 *   2. <h2>Frequently Asked Questions About X</h2> then
 *      <div class="nowtb-faq-item"><h3>Q</h3><p>A</p></div> blocks
 *
 * Shape 2 is scoped to the `nowtb-faq-item` wrapper on purpose: those pages end
 * with a `nowtb-cta-box` that also contains an <h3>, and that is a call to
 * action, not a question.
 *
 * Returns [] when fewer than 3 pairs are found, because Google wants a real FAQ
 * list rather than one stray question. Caps at 12 (the house limit); nothing in
 * the current data exceeds 10, so nothing is actually dropped today.
 *
 * If it breaks, check: run this against the CLEANED html (after cleanWpContent),
 * never the raw export — otherwise the schema can describe FAQs that the page
 * trimmed off, which is the exact violation this function exists to prevent.
 */
export function extractFaqsFromHtml(
  html: string | null | undefined
): { question: string; answer: string }[] {
  if (!html) return [];

  // Find the FAQ heading. The {0,80} tail allows "... About Brandon Real Estate".
  const heading = html.match(
    /<h2[^>]*>\s*(?:<[^>]+>\s*)*frequently\s+asked\s+questions[\s\S]{0,80}?<\/h2>/i
  );
  if (!heading || heading.index === undefined) return [];

  // Everything from the heading up to the next <h2> is the FAQ section.
  let section = html.slice(heading.index + heading[0].length);
  const nextH2 = section.search(/<h2[\s>]/i);
  if (nextH2 !== -1) section = section.slice(0, nextH2);

  const faqs: { question: string; answer: string }[] = [];

  if (/nowtb-faq-item/.test(section)) {
    // --- Shape 2: each Q&A wrapped in its own div ---
    const itemRe =
      /<div[^>]*class="[^"]*\bnowtb-faq-item\b[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    let m: RegExpExecArray | null;
    while ((m = itemRe.exec(section)) !== null) {
      const inner = m[1];
      const q = inner.match(/<h[34][^>]*>([\s\S]*?)<\/h[34]>/i);
      if (!q || q.index === undefined) continue;
      const question = stripTags(q[1]);
      const answer = stripTags(inner.slice(q.index + q[0].length));
      if (question && answer) faqs.push({ question, answer });
    }
  } else {
    // --- Shape 1: <h3> question followed by one or more block answers ---
    const pairRe =
      /<h3[^>]*>([\s\S]*?)<\/h3>\s*((?:<(?:p|ul|ol)[^>]*>[\s\S]*?<\/(?:p|ul|ol)>\s*)+)/gi;
    let m: RegExpExecArray | null;
    while ((m = pairRe.exec(section)) !== null) {
      const question = stripTags(m[1]);
      const answer = stripTags(m[2]);
      if (question && answer) faqs.push({ question, answer });
    }
  }

  // Drop anything that clearly isn't a real Q&A (empty, or a heading fragment)
  const clean = faqs.filter(
    (f) =>
      f.question.length > 5 && f.question.length < 300 && f.answer.length > 20
  );

  if (clean.length < 3) return [];
  return clean.slice(0, 12);
}

/**
 * True when the HTML contains an element carrying exactly this class token.
 *
 * WHY NOT A SIMPLE REGEX: `/\bquick-answer\b/` looks right and is WRONG. In
 * `class="bbs-quick-answer"` the hyphen counts as a word boundary, so `\b`
 * happily matches the tail of a completely different class and you end up
 * publishing a selector that matches nothing. A CSS class selector matches
 * whole space-separated tokens, so that is what we compare here.
 *
 * If it breaks, check: `hasClassToken('<i class="bbs-quick-answer">', 'quick-answer')`
 * must be FALSE.
 */
function hasClassToken(html: string, className: string): boolean {
  // Pull every class attribute value, then compare whole tokens.
  const attrRe = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(html)) !== null) {
    const value = m[1] ?? m[2] ?? "";
    if (value.split(/\s+/).includes(className)) return true;
  }
  return false;
}

/**
 * Build a speakable selector list containing ONLY selectors that match a real
 * element in the given content HTML.
 *
 * A speakable spec whose selectors match nothing is worse than no spec at all:
 * it promises voice assistants a quotable block the page does not have. So we
 * feature-detect instead of assuming.
 *
 * NOTE the WordPress export wraps its answer block in `bbs-quick-answer` /
 * `bbs-quick-answer-text`, which are DIFFERENT classes from the `quick-answer`
 * that components/ui/QuickAnswer.tsx renders. Both are checked separately.
 */
export function speakableSelectorsForContent(html: string | null | undefined) {
  const selectors: string[] = [];

  if (html) {
    // The <QuickAnswer> component, if this template renders one.
    if (hasClassToken(html, QUICK_ANSWER_CLASS)) {
      selectors.push(`.${QUICK_ANSWER_CLASS}`);
    }
    // WordPress export: prefer the inner text node when it exists, otherwise
    // fall back to the wrapper (which is itself a clean, quotable paragraph).
    // Never list both — the wrapper already contains the text node.
    if (hasClassToken(html, WP_QUICK_ANSWER_TEXT_CLASS)) {
      selectors.push(`.${WP_QUICK_ANSWER_TEXT_CLASS}`);
    } else if (hasClassToken(html, WP_QUICK_ANSWER_CLASS)) {
      selectors.push(`.${WP_QUICK_ANSWER_CLASS}`);
    }
  }

  // "h1" always resolves — every template renders exactly one — so it is the
  // guaranteed floor. It goes last because it is the least specific.
  selectors.push("h1");
  return selectors;
}

/** Helper to render JSON-LD as a script tag */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
