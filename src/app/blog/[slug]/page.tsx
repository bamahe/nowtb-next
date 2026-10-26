// =============================================================================
// /blog/[slug]: blog post page (canonical URL for all blog posts)
// The root /{slug} route 308-redirects here via [citySlug] catch-all.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPrimaryAgent } from "@/data/agents";
import { getAllPosts, getPostBySlug, getPostBySlugAsync, getPostThumbnail, getRelatedPosts } from "@/lib/posts";
import { findRelatedPosts, getRelatedPostsTitle } from "@/lib/related-posts";
import { cleanWpContent, metaDescription } from "@/lib/utils";
// Single source of truth for Barrett's author entity and for speakable
// selectors. See src/lib/schema.tsx, do not re-hardcode these values here.
import { barrettAuthorPerson, speakableSelectorsForContent } from "@/lib/schema";
import PhotoCredit from "@/components/ui/PhotoCredit";
import SearchCategoryListings from "@/components/ui/SearchCategoryListings";
import ContactForm from "@/components/ui/ContactForm";
import { cities } from "@/data/cities";

export const dynamicParams = true;

// =============================================================================
// INTENT-MATCHED CTA ENGINE
// -----------------------------------------------------------------------------
// WHY this exists: this ONE file renders ~1,760 blog posts. Before this, the
// mid-article CTA only appeared on posts whose slug started with
// "sell-home-fast" (about 84 posts), so 1,676 posts had no call to action in
// the body at all. And the CTA at the bottom was hard-coded to the headline
// "Thinking About Selling?", which is nonsense on a post about FHA loans or
// the best tacos in Brandon. A reader who feels mis-targeted does not call and
// does not fill out a form, so that one wrong headline was quietly costing
// leads on thousands of pages.
//
// The fix: look at the post's slug + title, work out what the reader is
// probably trying to DO (buy / sell / invest / learn about an area), and show
// copy that matches. Then rotate between several copy variants so neighbouring
// posts don't all repeat the same headline, repeated headlines read as
// template spam to humans and to search engines.
//
// If it breaks, check:
//   - A post showing the WRONG CTA? The keyword lists below are tested in a
//     fixed ORDER (investor -> seller -> buyer -> local -> city name).
//     First match wins. So a post that matches two lists gets whichever list
//     is checked first. Fix it by moving the KEYWORD, not by reordering the
//     blocks (reordering changes thousands of pages at once).
//   - A "hydration mismatch" error in the browser console? Something in here
//     started using Math.random() or new Date(). Those return a different
//     answer on the server than in the browser, and React treats that
//     difference as a bug. The variant picker MUST stay a pure function of the
// slug, same slug in, same CTA out, forever.
//   - A CTA link 404s on the live domain but works locally? New TOP-LEVEL
//     routes have to be excluded from both :city flatten redirects in
//     next.config. Every href used below (/free-home-valuation/, /properties/,
//     /investing/, /contact/, /guides/, /about/) already exists and already
//     works, so only worry about this if you add a new one.
// =============================================================================

/** The four reader goals we can detect from a post, plus a safe fallback. */
type PostIntent = "seller" | "buyer" | "investor" | "local" | "default";

/**
 * Turn a slug + title into one lowercase string of plain words, padded with a
 * space on each end.
 *
 * "FHA-Loans: 3.5% Down!" becomes " fha loans 3 5 down "
 *
 * WHY the padding and the single spaces: it lets us test a keyword as a whole
 * WORD by searching for " keyword " (spaces included). That stops "va" from
 * matching the middle of "value" or "Savannah", which is exactly the kind of
 * silent mis-classification that would be impossible to spot across 1,760
 * pages.
 */
function normalizeForMatching(slug: string, title: string): string {
  const combined = `${slug} ${title}`.toLowerCase();
  // Replace every run of non-alphanumeric characters (hyphens, punctuation,
  // multiple spaces) with exactly one space.
  const words = combined.replace(/[^a-z0-9]+/g, " ").trim();
  return ` ${words} `;
}

/** True if any keyword appears as a whole word/phrase in the padded haystack. */
function matchesAny(haystack: string, keywords: string[]): boolean {
  return keywords.some((keyword) => haystack.includes(` ${keyword} `));
}

// --- Keyword lists, checked in the order they appear in classifyIntent() ----

// Investor goes FIRST because it is the most specific. "rental property cash
// flow" also contains buyer-ish words, and we want the investor CTA to win.
const INVESTOR_KEYWORDS = [
  "invest", "investing", "investment", "investments", "investor", "investors",
  "rental", "rentals", "rental property", "rental properties",
  "cash flow", "cashflow", "roi", "cap rate", "cash on cash",
  // NOTE: "fixer upper" deliberately NOT here. FHA 203(k) posts are aimed at
  // owner-occupant buyers, and listing it sent them the investor CTA.
  "flip", "flipping", "house flipping",
  "portfolio", "1031", "1031 exchange", "dscr", "hard money",
  "landlord", "landlords", "tenant", "tenants",
  "airbnb", "short term rental", "vacation rental",
  "duplex", "multifamily", "multi family", "triplex", "fourplex",
];

// Seller is checked before buyer so that "for sale by owner" (a SELLER topic)
// is not swallowed by the buyer phrase "for sale".
// NOTE: bare "listing"/"listings" is deliberately NOT here, "new listings in
// Riverview" is a BUYER search, not a seller topic.
const SELLER_KEYWORDS = [
  "sell", "sells", "selling", "sold", "seller", "sellers",
  "sell my home", "sell my house", "home seller", "home sellers",
  "listing agent", "listing agents", "list your home", "listing agreement",
  "listing contract", "listing price",
  "home value", "home values", "home valuation", "valuation", "valuations",
  "what is my home worth", "appraisal", "appraised", "appraisals",
  "equity", "net proceeds", "closing costs", "seller concessions",
  "fsbo", "for sale by owner",
  "staging", "staged", "home staging", "curb appeal",
  "housing market", "real estate market", "market report", "market reports",
  "market update", "market updates", "market forecast", "market trends",
  "price your home", "pricing your home", "cma",
  "comparative market analysis", "downsize", "downsizing",
];

const BUYER_KEYWORDS = [
  "buy", "buying", "buyer", "buyers", "home buyer", "home buyers",
  "homes for sale", "houses for sale", "house for sale", "for sale",
  "new listings", "newest listings",
  "first time", "first time buyer", "first time home buyer",
  "mortgage", "mortgages", "loan", "loans", "lender", "lenders",
  "fha", "fha loan", "va loan", "va home loan", "usda", "usda loan",
  "conventional loan", "jumbo", "jumbo loan", "arm", "interest rate",
  "interest rates", "rate lock",
  "down payment", "down payments", "down payment assistance",
  "pre approval", "preapproval", "pre approved", "prequalified",
  "credit score", "home inspection", "inspection", "earnest money",
  "escrow", "closing process", "closing day",
  "new construction", "new build", "new builds", "builder", "builders",
  "move in ready", "open house", "open houses",
  "condos for sale", "townhomes for sale", "homes with pool",
];

// Local / lifestyle: someone researching an AREA, not a transaction yet.
const LOCAL_KEYWORDS = [
  "restaurant", "restaurants", "dining", "food", "eat", "places to eat",
  "breakfast", "brunch", "lunch", "coffee", "pizza", "tacos", "sushi",
  "bbq", "barbecue", "seafood", "brewery", "breweries", "nightlife", "bars",
  "school", "schools", "best schools", "elementary", "middle school",
  "high school", "school district", "charter school",
  "things to do", "what to do", "attractions", "events", "festival",
  "festivals", "parks", "park", "trails", "trail", "golf", "fishing",
  "boating", "beaches", "beach",
  "moving to", "move to", "relocating", "relocation", "relocate",
  "neighborhood", "neighborhoods", "best neighborhoods", "communities",
  "living in", "live in", "guide to living", "what is it like",
  "pros and cons", "cost of living", "zip code", "zip codes",
  "population", "demographics", "family friendly",
  "safe", "safest", "safety", "crime", "commute", "traffic",
  "weather", "hurricane", "flood zone", "flood zones",
  "retire", "retirement", "55 plus", "active adult",
  "hospitals", "gyms", "shopping", "farmers market",
];

// All city slugs we know about, longest first so "apollo-beach" is checked
// before "beach". Used as the LAST resort: a post titled "Riverview FL" with
// no other keyword is almost certainly someone researching the area.
const CITY_SLUGS_LONGEST_FIRST = [...cities]
  .map((city) => city.slug)
  .sort((a, b) => b.length - a.length);

/**
 * Decide what a post's reader is most likely trying to do.
 *
 * Order matters, see the "If it breaks" note at the top of this block.
 */
function classifyIntent(slug: string, title: string): PostIntent {
  const haystack = normalizeForMatching(slug, title);

  if (matchesAny(haystack, INVESTOR_KEYWORDS)) return "investor";
  if (matchesAny(haystack, SELLER_KEYWORDS)) return "seller";
  if (matchesAny(haystack, BUYER_KEYWORDS)) return "buyer";
  if (matchesAny(haystack, LOCAL_KEYWORDS)) return "local";

  // Last resort: does the slug name one of our Tampa Bay cities?
  if (CITY_SLUGS_LONGEST_FIRST.some((citySlug) => slug.includes(citySlug))) {
    return "local";
  }

  return "default";
}

/**
 * Stable, deterministic 32-bit hash of a string (the classic djb2 algorithm).
 *
 * WHY not Math.random(): this page is server-rendered and then "hydrated" in
 * the browser. If the server picked variant 2 and the browser picked variant 4,
 * React throws a hydration mismatch error and the page can visibly flicker or
 * break. Hashing the slug means a given post ALWAYS renders the same CTA,
 * while the post next to it gets a different one, which is the whole point.
 */
function stableHash(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    // hash * 33 + charCode, kept inside 32 bits by the | 0
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Shape of one block of CTA copy. */
interface CtaCopy {
  /** The <h2> headline. Must be unique within its list, repeats look spammy. */
  heading: string;
  /** One or two sentences of supporting copy. */
  body: string;
  /** Text on the primary button. */
  ctaLabel: string;
  /** Where the primary button goes. Must be a route that exists in src/app/. */
  ctaHref: string;
}

// --- MID-ARTICLE CTA COPY ---------------------------------------------------
// 4 variants per intent (20 total). Shown roughly halfway down, right after
// the article body, where a reader who got value is most likely to act.
const MID_CTA_VARIANTS: Record<PostIntent, CtaCopy[]> = {
  seller: [
    {
      heading: "What Could Your Home Sell For Today?",
      body: "Barrett Henry runs a free, no-obligation market analysis off live Stellar MLS comps, not an automated guess. You get a real number and the reasoning behind it.",
      ctaLabel: "Get My Free Home Valuation",
      ctaHref: "/free-home-valuation/",
    },
    {
      heading: "Curious What Buyers Would Pay Right Now?",
      body: "Price is the single decision that moves your bottom line the most. See what comparable homes near you actually closed for before you commit to a number.",
      ctaLabel: "See What My Home Is Worth",
      ctaHref: "/free-home-valuation/",
    },
    {
      heading: "Before You List, Get the Real Number",
      body: "Automated estimates miss condition, updates, and what buyers in your specific neighborhood are paying. Barrett prices from current comps and explains every line.",
      ctaLabel: "Request a Free Valuation",
      ctaHref: "/free-home-valuation/",
    },
    {
      heading: "Let's Talk About Your Equity",
      body: "Knowing what you would actually net after costs changes every plan that comes after it. Barrett will walk the numbers with you in plain English, no obligation.",
      ctaLabel: "Get Your Equity Estimate",
      ctaHref: "/free-home-valuation/",
    },
  ],
  buyer: [
    {
      heading: "See Homes That Match What You're Reading About",
      body: "Browse every active Tampa Bay listing straight from the MLS, updated throughout the day. Look around first, no sign-up wall.",
      ctaLabel: "Search Tampa Bay Homes",
      ctaHref: "/properties/",
    },
    {
      heading: "Want New Listings Before the Crowd Sees Them?",
      body: "Barrett can set up alerts so matching homes reach you the day they hit the market, which is often the difference between touring a house and reading about the sale.",
      ctaLabel: "Browse Homes for Sale",
      ctaHref: "/properties/",
    },
    {
      heading: "Ready to Walk Through a Few of These?",
      body: "Barrett Henry has 23+ years of real estate experience and will tell you straight when a house is not worth your Saturday.",
      ctaLabel: "Start Your Home Search",
      ctaHref: "/properties/",
    },
    {
      heading: "Narrow It Down to Homes You'd Actually Buy",
      body: "Filter by price, beds, schools, and commute instead of scrolling an entire county. Then call Barrett and go see the short list.",
      ctaLabel: "View Current Listings",
      ctaHref: "/properties/",
    },
  ],
  investor: [
    {
      heading: "Run the Numbers Before You Buy",
      body: "Barrett Henry works with Tampa Bay investors on rentals, value-add, and long-term holds. Bring a property and get an honest read on whether it pencils.",
      ctaLabel: "Explore Investment Properties",
      ctaHref: "/investing/",
    },
    {
      heading: "Looking for Cash Flow in Tampa Bay?",
      body: "Rent comps, realistic expense assumptions, and exit options, reviewed with an agent who also manages property day to day.",
      ctaLabel: "See Investor Resources",
      ctaHref: "/investing/",
    },
    {
      heading: "Is This Deal Actually Worth It?",
      body: "A second set of eyes costs nothing and has talked plenty of buyers out of bad numbers. No obligation either way.",
      ctaLabel: "Review a Deal With Barrett",
      ctaHref: "/investing/",
    },
    {
      heading: "Add a Rental Without Guessing",
      body: "Acquisition, rent-ready scope, and management all handled under one roof. Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective, 23+ years of real estate experience.",
      ctaLabel: "Start With Investment Options",
      ctaHref: "/investing/",
    },
  ],
  local: [
    {
      heading: "Thinking About Moving to This Area?",
      body: "Barrett Henry is a longtime Tampa Bay local and will tell you what the listing photos leave out: flood zones, commute reality, HOA quirks, all of it.",
      ctaLabel: "Ask Barrett About This Area",
      ctaHref: "/contact/",
    },
    {
      heading: "Questions Only a Local Can Answer?",
      body: "Which streets hold water, which schools families actually move for, which HOAs turn into a headache. Ask before you put money down.",
      ctaLabel: "Get Local Answers",
      ctaHref: "/contact/",
    },
    {
      heading: "Want the Unfiltered Take on This Neighborhood?",
      body: "No sales pitch. Barrett will tell you if the area fits what you described, or if you should look one exit over.",
      ctaLabel: "Start a Conversation",
      ctaHref: "/contact/",
    },
    {
      heading: "Planning a Move Around Here?",
      body: "Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective, helps buyers and sellers across Tampa Bay and has called the area home for over a decade.",
      ctaLabel: "Message Barrett Henry",
      ctaHref: "/contact/",
    },
  ],
  default: [
    {
      heading: "Have a Real Estate Question?",
      body: "Call Barrett Henry at (813) 733-7907. 23+ years of real estate experience, straight answers, and no pressure to list or buy anything.",
      ctaLabel: "Contact Barrett Henry",
      ctaHref: "/contact/",
    },
    {
      heading: "Not Sure What Your Next Step Is?",
      body: "That is usually exactly the right time to ask. One conversation, no obligation, and you will finish it knowing more than you do now.",
      ctaLabel: "Ask a Question",
      ctaHref: "/contact/",
    },
    {
      heading: "Want a Second Opinion?",
      body: "Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective, is happy to be a sounding board whether you are a year out or under contract tomorrow.",
      ctaLabel: "Talk to Barrett",
      ctaHref: "/contact/",
    },
    {
      heading: "Need Help Making Sense of This?",
      body: "General advice only goes so far. Tell Barrett your actual situation and get an answer that applies to it.",
      ctaLabel: "Get In Touch",
      ctaHref: "/contact/",
    },
  ],
};

// --- END-OF-ARTICLE CTA COPY ------------------------------------------------
// 3 variants per intent (15 total). Kept in a SEPARATE list from the mid-article
// copy so no single page ever shows the same headline twice.
const END_CTA_VARIANTS: Record<PostIntent, CtaCopy[]> = {
  seller: [
    {
      heading: "Ready to Find Out What Your Home Is Worth?",
      body: "No obligation, no pressure. Barrett Henry has 23+ years of real estate experience and will give you a straight read on your home and your timing.",
      ctaLabel: "Get Your Free Home Valuation",
      ctaHref: "/free-home-valuation/",
    },
    {
      heading: "Thinking About Selling This Year?",
      body: "Start with the number. Once you know what your home would realistically bring, every other decision gets easier to make.",
      ctaLabel: "Request My Home Value",
      ctaHref: "/free-home-valuation/",
    },
    {
      heading: "Let's Price Your Home Properly",
      body: "Overpriced homes sit and then sell for less than they should have. Barrett prices from live comps and tells you what he actually thinks.",
      ctaLabel: "Start With a Free Valuation",
      ctaHref: "/free-home-valuation/",
    },
  ],
  buyer: [
    {
      heading: "Let's Find Your Next Home",
      body: "Search live Tampa Bay listings, then call Barrett Henry to see the ones worth your time. 23+ years of real estate experience on your side of the table.",
      ctaLabel: "Search Homes for Sale",
      ctaHref: "/properties/",
    },
    {
      heading: "Ready to Start Touring Homes?",
      body: "Tell Barrett what you need and what you will not compromise on, and he will build the short list instead of sending you fifty links.",
      ctaLabel: "Browse Tampa Bay Listings",
      ctaHref: "/properties/",
    },
    {
      heading: "Your Next Home May Already Be Listed",
      body: "New homes hit the market every day across Tampa Bay. See what is available right now, updated straight from the MLS.",
      ctaLabel: "View Available Homes",
      ctaHref: "/properties/",
    },
  ],
  investor: [
    {
      heading: "Build Your Tampa Bay Rental Portfolio",
      body: "Barrett Henry helps investors buy, lease, and manage across Tampa Bay. Honest underwriting first, transaction second.",
      ctaLabel: "See Investment Properties",
      ctaHref: "/investing/",
    },
    {
      heading: "Ready to Look at Real Deals?",
      body: "Bring your criteria and your numbers. Barrett will tell you where they work in this market and where they do not. No obligation.",
      ctaLabel: "Explore Investor Resources",
      ctaHref: "/investing/",
    },
    {
      heading: "Let's Underwrite Your Next Purchase",
      body: "Rent comps, expenses, and realistic exit scenarios, reviewed by an agent who manages property as well as sells it.",
      ctaLabel: "Start With the Numbers",
      ctaHref: "/investing/",
    },
  ],
  local: [
    {
      heading: "Considering a Move to Tampa Bay?",
      body: "Barrett Henry has been a Tampa Bay local for over a decade and brings 23+ years of real estate experience to the question of where you should actually land.",
      ctaLabel: "Ask Barrett About the Area",
      ctaHref: "/contact/",
    },
    {
      heading: "Get a Local's Perspective",
      body: "Online research only takes you so far. A ten-minute conversation usually answers the questions the articles do not.",
      ctaLabel: "Talk to a Local REALTOR®",
      ctaHref: "/contact/",
    },
    {
      heading: "Know the Area Before You Commit",
      body: "Flood zones, traffic patterns, HOA rules, and which pockets hold value. Ask the questions now, not after closing. No obligation.",
      ctaLabel: "Send Barrett a Question",
      ctaHref: "/contact/",
    },
  ],
  default: [
    {
      heading: "Let's Talk About Your Situation",
      body: "Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective, with 23+ years of real estate experience. No obligation, no pressure.",
      ctaLabel: "Contact Barrett Henry",
      ctaHref: "/contact/",
    },
    {
      heading: "Still Have Questions?",
      body: "Ask them. Barrett would rather spend twenty minutes answering questions than watch someone make an expensive guess.",
      ctaLabel: "Get Your Questions Answered",
      ctaHref: "/contact/",
    },
    {
      heading: "Get Straight Answers From a Local Broker",
      body: "Whatever stage you are at, a short conversation beats another hour of searching. Barrett will tell you what he actually recommends.",
      ctaLabel: "Reach Out to Barrett",
      ctaHref: "/contact/",
    },
  ],
};

// --- HERO (above the fold) CTA ----------------------------------------------
// One short action per intent. The hero already has the title and date; this
// adds a tappable next step a phone user can see WITHOUT scrolling, which is
// where most blog traffic lands.
const HERO_CTA: Record<PostIntent, { label: string; href: string }> = {
  seller: { label: "What's My Home Worth?", href: "/free-home-valuation/" },
  buyer: { label: "Search Tampa Bay Homes", href: "/properties/" },
  investor: { label: "See Investment Properties", href: "/investing/" },
  local: { label: "Ask Barrett About the Area", href: "/contact/" },
  default: { label: "Talk to Barrett Henry", href: "/contact/" },
};

// --- IN-ARTICLE LEAD FORM copy ----------------------------------------------
// `formType` is passed straight through to ContactForm's `type` prop, which is
// what /api/contact uses to decide which n8n webhook (and which Follow Up Boss
// treatment) the lead gets. Do NOT invent new values here, only the ones
// ContactForm documents: contact | showing | valuation | newsletter | buyer-reg.
const FORM_COPY: Record<
  PostIntent,
  { heading: string; subhead: string; submitLabel: string; formType: string }
> = {
  seller: {
    heading: "Want a Free Home Valuation?",
    subhead: "Send a few details and Barrett will put together a real market analysis for your address.",
    submitLabel: "Request My Home Value",
    formType: "valuation",
  },
  buyer: {
    heading: "Looking for a Home in Tampa Bay?",
    subhead: "Tell Barrett what you are after and he will send matching listings, including ones that are not easy to find online.",
    submitLabel: "Send My Home Search",
    formType: "buyer-reg",
  },
  investor: {
    heading: "Looking at Tampa Bay Investment Property?",
    subhead: "Share your criteria and Barrett will come back with honest numbers on what is realistic right now.",
    submitLabel: "Talk Investments",
    formType: "contact",
  },
  local: {
    heading: "Questions About This Area?",
    subhead: "Ask anything about the neighborhoods, schools, commutes, or market. Barrett answers personally.",
    submitLabel: "Ask Barrett",
    formType: "contact",
  },
  default: {
    heading: "Have a Question for Barrett?",
    subhead: "Send it over. You will hear back within two hours during business hours.",
    submitLabel: "Send My Question",
    formType: "contact",
  },
};

/**
 * Pick one CTA copy block from a list, deterministically, based on the slug.
 *
 * `salt` lets us pull a DIFFERENT variant for the mid-article box than for the
 * end-of-article box on the same page, so a reader never sees the same headline
 * twice as they scroll.
 */
function pickVariant(variants: CtaCopy[], slug: string, salt: string): CtaCopy {
  return variants[stableHash(`${salt}:${slug}`) % variants.length];
}

// --- Splitting the post body so the CTA lands in the MIDDLE -----------------
// The post body is one big blob of HTML from WordPress, dropped in with
// dangerouslySetInnerHTML. To get a CTA genuinely mid-article we have to cut
// that blob in two and render it as two blocks with the CTA between them.
//
// Container tags we track when deciding where it is safe to cut the post body.
// These are the elements that WRAP other content, so cutting inside one of them
// is what breaks a layout.
const CONTAINER_TAGS = [
  "div", "blockquote", "table", "thead", "tbody", "tr", "td", "th",
  "ul", "ol", "li", "section", "figure", "details",
];

// Matches any opening OR closing tag from CONTAINER_TAGS.
// The \\b after the tag name is what stops "<div" from also matching "<divider".
const CONTAINER_TAG_PATTERN = `</?(${CONTAINER_TAGS.join("|")})\\b[^>]*>`;

/** One element that is still open at a given point in the HTML. */
interface OpenTag {
  /** Lowercase tag name, e.g. "div". */
  tag: string;
  /** The full original opening tag, e.g. `<div class="nowtb-post-content">`.
   *  We keep the whole thing so we can re-open it with the same classes and
   * inline styles, otherwise the second half of the article would lose its
   *  width constraint and padding. */
  openTag: string;
}

/**
 * Walk the HTML up to `index` and report which container elements are still
 * open at that point, outermost first.
 *
 * WHY we need this: almost every migrated WordPress post is wrapped in one
 * `<div class="nowtb-post-content" style="...">` that spans the entire body. So
 * ANY cut in the middle of the article lands *inside* that div. Knowing exactly
 * which tags are open lets us close them cleanly at the end of the first half
 * and re-open them at the start of the second half.
 */
function openContainersAt(html: string, index: number): OpenTag[] {
  const stack: OpenTag[] = [];
  const tagMatcher = new RegExp(CONTAINER_TAG_PATTERN, "gi");
  let match: RegExpExecArray | null;

  while ((match = tagMatcher.exec(html)) !== null) {
    if (match.index >= index) break; // past our cut point, stop looking
    const tag = match[1].toLowerCase();

    if (match[0].startsWith("</")) {
      // Closing tag, pop the nearest matching open tag off the stack.
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          stack.splice(i, 1);
          break;
        }
      }
    } else {
      stack.push({ tag, openTag: match[0] });
    }
  }

  return stack;
}

/**
 * Cut the post HTML in two at a paragraph break near the middle, so the
 * mid-article CTA can sit between the halves.
 *
 * Returns `after: ""` when no safe cut exists. The caller treats that as
 * "render the CTA ABOVE the body instead", so all 1,760 posts still get a
 * mid-article CTA, on a handful of posts it just sits at the top rather than
 * risking mangled HTML.
 *
 * If it breaks, check:
 *   - Second half of an article lost its padding or max-width? The wrapper div
 *     is re-opened from `openTag`, so check that the post's wrapper really is a
 *     <div> and not some tag missing from CONTAINER_TAGS above.
 *   - A CTA landed inside a dark callout box or a table? That cut should have
 *     been rejected. Only a cut where NOTHING (or just one plain wrapper) is
 * open is accepted, see the `isSafeCut` check below. If a new box element
 *     shows up in the content, add its tag to CONTAINER_TAGS.
 *   - CTA at the very top of a long post? Either the post has fewer than six
 *     </p> tags, or every paragraph break in the middle 50% sat inside a box.
 *     Not a bug, just the safe fallback.
 */
function splitContentForMidCta(html: string): { before: string; after: string } {
  const CLOSING_P = "</p>";

  // Every character index immediately AFTER a closing </p>. Those are the only
  // places we are willing to cut, so we never split a sentence in half.
  const cutPoints: number[] = [];
  let found = html.indexOf(CLOSING_P);
  while (found !== -1) {
    cutPoints.push(found + CLOSING_P.length);
    found = html.indexOf(CLOSING_P, found + CLOSING_P.length);
  }

  // Very short or list-heavy posts: don't chop them up at all.
  if (cutPoints.length < 6) return { before: html, after: "" };

  // Try cut points nearest the halfway mark first, and keep walking outward
  // until one is safe. Trying several (instead of only the closest) means a
  // callout box sitting right at the midpoint shifts the CTA by a paragraph
  // or two instead of kicking it all the way to the top of the article.
  const midpoint = html.length / 2;
  const ranked = [...cutPoints].sort(
    (a, b) => Math.abs(a - midpoint) - Math.abs(b - midpoint)
  );

  for (const cut of ranked) {
    // Keep the CTA in the middle 50% of the article. Outside that window it is
    // not really a "mid-article" CTA any more.
    if (cut <= html.length * 0.25 || cut >= html.length * 0.75) continue;

    const open = openContainersAt(html, cut);

    // A cut is safe when the only thing open is the post's outer wrapper
    // (a plain <div> or <section>). If we are inside a table, a list, a
    // blockquote, or a nested callout box, closing and re-opening it would
    // visibly split that box in two, so we skip that cut and try the next one.
    const isSafeCut =
      open.length === 0 ||
      (open.length === 1 && (open[0].tag === "div" || open[0].tag === "section"));
    if (!isSafeCut) continue;

    // Close what is open (innermost first) at the end of the first half, then
    // re-open the same tags at the start of the second half. Each half is
    // handed to its own dangerouslySetInnerHTML, so each must be valid on its
    // own, one half cannot be "repaired" by the other.
    const closers = [...open].reverse().map((o) => `</${o.tag}>`).join("");
    const reopeners = open.map((o) => o.openTag).join("");

    return {
      before: html.slice(0, cut) + closers,
      after: reopeners + html.slice(cut),
    };
  }

  // Nothing safe found, render the body whole and put the CTA above it.
  return { before: html, after: "" };
}

// Typography classes for the post body. Pulled out into a constant because the
// body is now rendered in TWO places (above and below the mid-article CTA) and
// the two halves must look identical, if these ever drift apart, the font or
// spacing visibly changes halfway down the article.
const BODY_PROSE_CLASSES = `blog-content prose prose-lg font-body text-dark max-w-none
  prose-headings:font-heading prose-headings:text-primary
  prose-a:text-link prose-a:no-underline hover:prose-a:underline
  prose-p:leading-relaxed`;

// Pre-render the 200 most recent posts at build time.
// Older posts render on-demand via ISR (dynamicParams = true above).
// This keeps us under Vercel's 2048 route limit.
export function generateStaticParams() {
  return getAllPosts().slice(0, 100).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugAsync(slug);
  if (!post) return { title: "Not Found" };
  const description = metaDescription(post.excerpt, post.title);

  // ─── TITLE: one brand suffix, not two (fixed 2026-10-17) ───────────────────
  // `title: post.title` was already correct, layout.tsx's
  // `title.template = "%s | Barrett Henry"` appends the brand once, so the
  // <title> tag on blog posts was fine.
  //
  // What was NOT fine: this function also built
  // `${post.title} | Barrett Henry, REALTOR®` and passed it to openGraph.title
  // and twitter.title. Next.js applies the SAME title template to those two
  // fields (see node_modules/next/dist/lib/metadata/resolvers/resolve-opengraph.js
  //, it calls resolveTitle(openGraph.title, titleTemplate) and the twitter
  // equivalent), so the social cards shipped a doubled suffix:
  //
  //   before:  og:title = "<post title> | Barrett Henry, REALTOR® | Barrett Henry"
  //   after:   og:title = "<post title> | Barrett Henry"
  //
  // Reusing the plain post.title for all three keeps the brand in exactly one
  // place: the template in layout.tsx. The REALTOR® credential still appears in
  // the Person/author schema below, which is where it is actually read from.
  //
  // BUDGET: suffix is 16 characters against Google's ~60-character cut, so
  // post.title needs to stay at or under 44. Post titles come from
  // src/data/posts-export.json and are written by the content automation, which
  // this file cannot police, long ones have to be shortened there.
  const title = post.title;

  // ─── og:image, a real image, or the verified site-wide card ───────────────
  // Every blog post sets twitter:card = summary_large_image, which PROMISES a
  // large image card. Until now none of them supplied openGraph.images, so the
  // promise was empty and posts shared as a blank grey rectangle everywhere.
  //
  // Why it wasn't inherited from layout.tsx: Next.js does not merge nested
  // metadata objects field-by-field. Declaring `openGraph` on a page replaces
  // the root layout's entire openGraph object, and the resolver then runs
  // `target.images = resolveImages(og.images, ...)` unconditionally, so a
  // missing `images` key becomes undefined rather than falling back.
  //
  // getPostThumbnail() is an fs.existsSync() check against
  // public/images/blog/<slug>.jpg, so a non-null result is a path proven to
  // exist on disk, never a guessed filename. Two caveats worth knowing:
  //  - Those hero files are NOT a uniform size (sampled: 1080x720, 1200x627,
  //    945x630 and others), so width/height are deliberately NOT declared for
  //    them. Stating 1200x630 over a 1080x720 file would be a false hint and
  //    would make scrapers crop badly. Social platforms read the real bytes.
  //  - On Vercel, public/ is served from the CDN and is not guaranteed to be
  //    inside the serverless function's filesystem, so for posts rendered
  //    on-demand via ISR this check can come back false. That is safe: it falls
  //    through to the site-wide card below. It never emits a broken path.
  //
  // The fallback was VERIFIED on disk before being referenced (2026-10-17):
  //   ls -la public/og-default.png  ->  exists, 41,673 bytes
  //   PNG header reports 1200 x 630 ->  matches the declared dimensions
  // Do not swap this path without repeating that check, schema on this site
  // once pointed at /images/barrett-henry-headshot.jpg, a file that has never
  // existed, and nobody noticed for months.
  const thumbnail = getPostThumbnail(post);
  const ogImage = thumbnail
    ? { url: thumbnail, alt: post.title }
    : {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Barrett Henry, REALTOR®, Tampa Bay Homes for Sale",
      };

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}/`,
      type: "article",
      publishedTime: post.date,
      // siteName/locale restated for the same non-inheritance reason as images.
      siteName: "Barrett Henry, REALTOR®, REMAX Collective",
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlugAsync(slug);
  if (!post) notFound();

  const agent = getPrimaryAgent();
  const thumbnail = getPostThumbnail(post);
  const related = getRelatedPosts(slug, 3);

  // Intelligent related posts, uses city + topic + county scoring (6-8 posts)
  const allPosts = getAllPosts();
  const smartRelated = findRelatedPosts(slug, allPosts, 8);
  const smartRelatedTitle = getRelatedPostsTitle(slug, smartRelated);

  // --- Intent-matched CTAs (see the big comment block at the top of this file) ---
  // One classification, reused by the hero button, the mid-article box, the
  // lead form, and the end-of-article box, so every CTA on the page is talking
  // to the same reader instead of contradicting itself.
  const intent = classifyIntent(slug, post.title);
  const heroCta = HERO_CTA[intent];
  // Different salts = guaranteed different copy in the mid vs. end box.
  const midCta = pickVariant(MID_CTA_VARIANTS[intent], slug, "mid");
  const endCta = pickVariant(END_CTA_VARIANTS[intent], slug, "end");
  const formCopy = FORM_COPY[intent];

  // The exact cleaned HTML the body renders, held in its own const so the
  // `speakable` selectors in the JSON-LD below can be feature-detected against
  // the SAME string that ends up in the DOM rather than an approximation of it.
  //
  // The `<h1>` demotion: 265 of 1,760 migrated posts carry an <h1> inside their
  // body HTML, left over from WordPress where the body WAS the whole page. This
  // template already renders the post title as the page's <h1> in the hero
  // below, so those posts were shipping TWO <h1> elements, which splits the
  // topic signal and leaves Google guessing which one the page is actually
  // about. Demoting the body one to <h2> keeps the visible heading and the
  // outline intact while leaving exactly one <h1> per page.
  //
  // Done here rather than in cleanWpContent() because this is the only corpus
  // affected: pages-content, market-updates and guides all have zero body <h1>
  // tags, and some templates that share cleanWpContent rely on content headings
  // differently. Narrow fix, no blast radius.
  //
  // If it breaks, check: closing tags are rewritten too, so an unbalanced
  // <h1> ... </h2> can only happen if the source HTML was already malformed.
  const cleanedBody = cleanWpContent(post.content)
    .replace(/<h1(\s[^>]*)?>/gi, (_m, attrs) => `<h2${attrs || ""}>`)
    .replace(/<\/h1>/gi, "</h2>");

  // Cut the post body in half so the mid-article CTA lands in the middle of
  // the read rather than tacked onto the end.
  const bodyParts = splitContentForMidCta(cleanedBody);

  // The mid-article CTA is defined ONCE here as a variable because the JSX
  // below renders it in one of two positions depending on whether the body
  // could be split. Building it once keeps the two branches from drifting.
  const midCtaBlock = (
    <div className="my-10 rounded-xl border-2 border-accent/40 bg-accent/10 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 md:gap-8 md:items-center">
        <div>
          <h2 className="font-heading font-bold text-xl md:text-2xl text-primary mb-2">
            {midCta.heading}
          </h2>
          <p className="font-body text-muted text-sm mb-5">{midCta.body}</p>
          {/* Mobile-first: buttons stack full-width on a phone, side by side
              from 640px up. Phone number stays a real tel: link so one tap
              dials. */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={midCta.ctaHref}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              {midCta.ctaLabel}
            </Link>
            <a
              href="tel:+18137337907"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-6 py-3 rounded-lg text-sm hover:bg-primary hover:text-white transition-colors"
            >
              Call (813) 733-7907
            </a>
          </div>
        </div>
        {/* Trust signals. Hidden on the narrowest screens would hurt
            conversion, so instead they sit under the buttons on mobile and to
            the right on desktop. */}
        <div className="md:text-right md:border-l md:border-primary/15 md:pl-8">
          <p className="font-heading font-bold text-sm text-primary">
            Barrett Henry, REALTOR&reg;
          </p>
          <p className="font-body text-muted text-xs mt-1">
            Licensed Florida Real Estate Broker, REMAX Collective
          </p>
          <p className="font-body text-muted text-xs mt-1">
            23+ years of real estate experience
          </p>
          <p className="font-body text-muted text-xs mt-1">
            No obligation, no pressure
          </p>
        </div>
      </div>
    </div>
  );

  // Strip HTML tags from excerpt for schema description
  const plainExcerpt = (post.excerpt || "").replace(/<[^>]*>/g, "").trim();
  const canonicalUrl = `https://nowtb.com/blog/${slug}/`;

  return (
    <>
      {/* === JSON-LD: BreadcrumbList structured data === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://nowtb.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://nowtb.com/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: canonicalUrl,
              },
            ],
          }),
        }}
      />

      {/* === JSON-LD: BlogPosting structured data === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            dateModified: post.date,
            description: plainExcerpt || `${post.title}, Barrett Henry, REALTOR® at REMAX Collective.`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
            // AUTHOR, now built from the shared helper in src/lib/schema.tsx
            // instead of being retyped here (fixed 2026-10-17).
            //
            // The hand-written version this replaces pointed `image` at
            // https://nowtb.com/images/barrett-henry-headshot.jpg, a file that
            // has NEVER existed in public/images/. The real headshot is
            // barrett-headshot.png. Eight files across the repo carried that
            // same phantom path, so the author image on Barrett's most
            // important authorship signal was a 404 sitewide.
            //
            // barrettAuthorPerson() emits name, jobTitle, worksFor, url,
            // telephone, the verified headshot URL, sameAs, and his three real
            // designations (e-PRO, MRP, SRS, he holds no others). One
            // definition means it cannot drift out of sync again.
            //
            // If it breaks, check: src/lib/schema.tsx owns these values now.
            // Fix them there, not here.
            author: barrettAuthorPerson(),
            publisher: {
              "@type": "RealEstateAgent",
              name: "Barrett Henry, REALTOR\u00ae",
              url: "https://nowtb.com",
              logo: {
                "@type": "ImageObject",
                url: "https://nowtb.com/images/remax-logo-white.png",
              },
            },
            ...(thumbnail ? { image: thumbnail } : {}),
            // SPEAKABLE, tells voice search and AI assistants which element on
            // the page holds the quotable answer.
            //
            // The old hardcoded list was `[".quick-answer", "article h1",
            // "article h2 + p"]` and every selector in it matched NOTHING:
            //  - this template does not render <QuickAnswer>, so there is no
            //    element with class "quick-answer". The migrated WordPress
            // content uses "bbs-quick-answer", which is a DIFFERENT class 
            //    CSS matches whole class tokens, not substrings.
            //  - "article h1" fails because the <h1> lives up in the hero
            //    <section>, outside <article> entirely.
            // A speakable spec that matches nothing is worse than none: it
            // promises assistants a quotable block the page does not have.
            //
            // speakableSelectorsForContent() feature-detects against the real
            // cleaned body HTML and only ever returns selectors that resolve,
            // falling back to the bare "h1" that every template does render.
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: speakableSelectorsForContent(cleanedBody),
            },
          }),
        }}
      />

      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background image with dark overlay (solid navy fallback if no thumbnail) */}
        {thumbnail && (
          <Image
            src={thumbnail}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className={`absolute inset-0 ${thumbnail ? 'bg-primary/85' : 'bg-primary'}`} />
        <div className="container-wide max-w-3xl text-center relative z-10">
          {/* Breadcrumb trail, Home > Blog > Post Title */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog/" className="hover:text-white transition-colors">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-accent" aria-current="page">{post.title}</span>
          </nav>

          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm font-body text-link">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          {/* === Above-the-fold CTA ===
              WHY it is here: most blog traffic arrives on a phone and a big
              share of those readers never scroll past the first screen. Before
              this, the hero was a title and a date, nothing to tap. This is a
              deliberately SLIM two-button bar (phone + one intent-matched
              action) rather than a form, because this is an article and a wall
              of fields at the top drives people straight back to Google.

              Mobile-first: `flex-col` stacks the buttons full-width on a phone
              so each one is an easy thumb target, then `sm:flex-row` puts them
              side by side from 640px up.

              If it breaks, check:
                - Buttons invisible or unclickable? The hero uses a background
                  image with an absolutely-positioned overlay. This block must
                  stay INSIDE the `relative z-10` container above it, or the
                  overlay sits on top and swallows the taps.
                - The tel: href is E.164 (+1 then 10 digits). That is the format
                  iOS and Android dial most reliably, and it matches the rest of
                  the site. */}
          <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center sm:justify-center gap-3">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center justify-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-lg text-sm hover:bg-white transition-colors"
            >
              Call or Text (813) 733-7907
            </a>
            <Link
              href={heroCta.href}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/70 text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-white hover:text-primary hover:border-white transition-colors"
            >
              {heroCta.label}
            </Link>
          </div>
          <p className="mt-3 font-body text-[11px] text-white/70">
            Barrett Henry, REALTOR&reg;, Licensed Florida Real Estate Broker, REMAX Collective
            &middot; 23+ years of real estate experience &middot; No obligation
          </p>
        </div>
      </section>

      <section className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="card p-5 bg-primary/5">
                <h3 className="font-heading font-bold text-sm text-primary mb-2">
                  About the Author
                </h3>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden">
                    <Image
                      src="/images/barrett-headshot.png"
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-primary">{agent.name}</p>
                    <p className="font-body text-muted text-[10px]">{agent.title}</p>
                  </div>
                </div>
                <a
                  href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                  className="btn-primary inline-block px-4 py-2 text-xs text-center w-full"
                >
                  {agent.phone}
                </a>
              </div>

              {related.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-heading font-bold text-sm text-primary mb-3">
                    Related Posts
                  </h3>
                  <ul className="space-y-2">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/blog/${r.slug}`}
                          className="font-body text-xs text-link hover:underline"
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Loan & financing guides, helps readers explore mortgage options */}
              <div className="card p-5">
                <h3 className="font-heading font-bold text-sm text-primary mb-3">
                  Financing Guides
                </h3>
                <ul className="space-y-2">
                  {[
                    { href: "/guides/mortgage-pre-approval-guide-florida", label: "Mortgage Pre-Approval" },
                    { href: "/guides/fha-loan-guide", label: "FHA Loans" },
                    { href: "/guides/va-home-loan-guide", label: "VA Home Loans" },
                    { href: "/guides/usda-loan-guide", label: "USDA Loans" },
                    { href: "/guides/conventional-loan-guide", label: "Conventional Loans" },
                    { href: "/guides/jumbo-loan-guide", label: "Jumbo Loans" },
                    { href: "/guides/dscr-loan-guide", label: "DSCR Loans" },
                    { href: "/guides/mortgage-rate-lock-guide", label: "Mortgage Rate Locks" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-body text-xs text-link hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/guides/"
                  className="inline-block mt-3 font-body text-xs font-semibold text-primary hover:text-accent transition-colors"
                >
                  Browse All Guides &rarr;
                </Link>
              </div>

              {/* Home valuation CTA, drives leads from blog readers */}
              <div className="card p-5 bg-accent/10 border-accent/20">
                <h3 className="font-heading font-bold text-sm text-primary mb-2">
                  What&apos;s Your Home Worth?
                </h3>
                <p className="font-body text-muted text-xs mb-3">
                  Get a free, no-obligation market analysis from Barrett Henry.
                </p>
                <Link
                  href="/free-home-valuation/"
                  className="btn-primary inline-block px-4 py-2 text-xs text-center w-full"
                >
                  Get Your Free Home Valuation
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <article className="lg:col-span-3 order-1 lg:order-2">
            {/* Photo credit, shows for Wikimedia Commons and attributed images */}
            {thumbnail && <PhotoCredit src={thumbnail} />}

            {/* === Post body, with the mid-article CTA spliced into it ===
                `bodyParts.after` is an empty string when the post was too short
                (or too tag-heavy) to cut safely. In that case we put the CTA
                ABOVE the body instead of below it, so it never ends up stacked
                against the end-of-article CTA. Either way, all 1,760 posts get
                a mid-article CTA, the old code only showed one on the ~84
                posts whose slug started with "sell-home-fast". */}
            {bodyParts.after ? (
              <>
                <div
                  className={BODY_PROSE_CLASSES}
                  dangerouslySetInnerHTML={{ __html: bodyParts.before }}
                />
                {midCtaBlock}
                <div
                  className={BODY_PROSE_CLASSES}
                  dangerouslySetInnerHTML={{ __html: bodyParts.after }}
                />
              </>
            ) : (
              <>
                {midCtaBlock}
                <div
                  className={BODY_PROSE_CLASSES}
                  dangerouslySetInnerHTML={{ __html: bodyParts.before }}
                />
              </>
            )}

            {/* === End-of-article CTA, on every post, matched to the reader ===
                This used to be hard-coded to "Thinking About Selling?", which
                was shown to buyers reading about FHA loans and to people
                reading restaurant round-ups. Now the headline and the offer
                come from the same intent classifier that drove the hero button,
                and the copy rotates between 3 variants per intent so sibling
                posts don't repeat each other. */}
            <div className="mt-10 rounded-xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8">
              <h2 className="font-heading font-bold text-xl md:text-2xl text-primary mb-2">
                {endCta.heading}
              </h2>
              <p className="font-body text-muted text-sm mb-5">{endCta.body}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={endCta.ctaHref}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                >
                  {endCta.ctaLabel}
                </Link>
                <a
                  href="tel:+18137337907"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold px-6 py-3 rounded-lg text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  Call (813) 733-7907
                </a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-body text-muted">
                <Link href="/guides/" className="text-link hover:underline">
                  Browse All Guides &rarr;
                </Link>
                <Link href="/about/" className="text-link hover:underline">
                  Meet Barrett Henry &rarr;
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* === In-article lead form ===
          WHY: before this, the template had ZERO form components. Every blog
          reader who wanted to act had to tap a phone link or click through to
          another page, and most people do neither. This puts an actual form on
          all 1,760 posts.

          We REUSE the shared ContactForm component on purpose. It already wires
          up Turnstile spam protection, the /api/contact route, and the Follow
          Up Boss hand-off. Hand-rolling a fetch() here would skip all of that
          and the leads would silently vanish.

          If it breaks, check:
            - Submit button stuck greyed out? That is Turnstile not returning a
              token (wrong domain on the site key is the usual cause). It is a
              ContactForm / TurnstileWidget problem, not a problem with this
              page.
            - Lead arrives in the wrong Follow Up Boss pipeline? The `type`
              prop below comes from FORM_COPY, and /api/contact routes on it.
              Only use the values ContactForm documents.
            - Can't tell which post a lead came from? `source` is
              "blog-<slug>", which is how you attribute leads back to content. */}
      <section className="bg-gray-50 py-14">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start max-w-5xl mx-auto">
            {/* Left: the ask plus trust signals. On mobile this stacks ABOVE
                the form, which is what we want, context first, then fields. */}
            <div>
              <h2 className="heading-display text-2xl md:text-3xl text-primary mb-3">
                {formCopy.heading}
              </h2>
              <p className="font-body text-muted text-sm mb-6">
                {formCopy.subhead}
              </p>
              <ul className="space-y-2.5 font-body text-sm text-dark">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold" aria-hidden="true">&#10003;</span>
                  <span>
                    <strong className="text-primary">Barrett Henry, REALTOR&reg;</strong>, Broker
                    Associate at REMAX Collective
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold" aria-hidden="true">&#10003;</span>
                  <span>23+ years of real estate experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold" aria-hidden="true">&#10003;</span>
                  <span>Longtime Tampa Bay local, here for over a decade</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold" aria-hidden="true">&#10003;</span>
                  <span>No obligation and nothing gets listed without your say-so</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold" aria-hidden="true">&#10003;</span>
                  <span>Replies within 2 hours during business hours</span>
                </li>
              </ul>
              <p className="font-body text-sm text-muted mt-6">
                Prefer to talk it through?{" "}
                <a
                  href="tel:+18137337907"
                  className="font-semibold text-link hover:underline"
                >
                  Call or text (813) 733-7907
                </a>
              </p>
            </div>

            {/* Right: the form itself. ContactForm has no separate "compact"
                mode, so we render it as-is with its 4 standard fields rather
                than building a second form component. */}
            <ContactForm
              webhookUrl="/api/contact"
              source={`blog-${slug}`}
              type={formCopy.formType}
              submitLabel={formCopy.submitLabel}
            />
          </div>
        </div>
      </section>

      {/* === Live listings for search category blog posts === */}
      <SearchCategoryListings slug={slug} />

      {/* === Related Reading, scored by city + topic + county matching ===
          The selection logic lives in src/lib/related-posts.ts (findRelatedPosts),
          not here, so every template that needs cross-links behaves the same way.

          The limit is 8 ON PURPOSE. 6-8 descriptive links is a healthy internal
          linking block; dumping 15-20 links at the bottom of every post reads as
          link spam to both people and search engines. If you raise the number
          above, you are undoing that. Anchor text is the real post title, which
          is already keyword-rich, never replace it with "read more". */}
      {smartRelated.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container-wide">
            <h2 className="heading-display text-2xl text-primary mb-8">
              {smartRelatedTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {smartRelated.map((rp) => {
                const rpThumb = getPostThumbnail(rp);
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}/`}
                    className="group block border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-accent hover:shadow-lg transition-all"
                  >
                    {rpThumb && (
                      <div className="h-40 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rpThumb}
                          alt={rp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-sm text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      {rp.excerpt && (
                        <p className="font-body text-muted text-xs mb-3 line-clamp-3">
                          {rp.excerpt.replace(/<[^>]*>/g, "").slice(0, 100)}
                          {rp.excerpt.replace(/<[^>]*>/g, "").length > 100 ? "…" : ""}
                        </p>
                      )}
                      <time
                        dateTime={rp.date}
                        className="font-body text-muted text-[11px]"
                      >
                        {new Date(rp.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
