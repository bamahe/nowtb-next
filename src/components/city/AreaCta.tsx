// =============================================================================
// AreaCta, lead capture + varied CTA copy for the big location templates
//
// WHY THIS FILE EXISTS
// --------------------
// The city hub pages (/valrico/), the city spoke pages (/valrico-homes-for-sale/)
// and the neighborhood pages (/bloomingdale/) are ~3,200 pages between them, and
// until now none of them had a lead form at all. Someone searching "Valrico homes
// for sale" landed on a page whose only conversion path was a link to a DIFFERENT
// page. That is a leak: every extra click loses people.
//
// Two problems had to be solved at once:
//
//   1. Put a REAL form on those pages. "Real" means the existing ContactForm
// component in src/components/ui/ContactForm.tsx, the one wired into
//      Turnstile spam protection, /api/contact, lead validation and Follow Up
//      Boss. A hand-rolled <form> with its own fetch() would look identical and
//      silently drop every lead, because it would skip all of that plumbing.
//
//   2. Stop repeating the same CTA sentence 3,200 times. Barrett has a standing
//      rule against "Ready to Make [City] Home?" style boilerplate, and Google
//      reads thousands of pages whose only difference is a place name as
//      near-duplicate content. So the headline, the supporting sentence, the
//      submit button label AND the in-body conversion link are all chosen from a
//      bank of variants, keyed off the page slug.
//
// THE "DETERMINISTIC" PART MATTERS
// --------------------------------
// We must NOT use Math.random(). These pages are server-rendered and then
// hydrated in the browser. If the server picked variant 3 and the browser picked
// variant 7, React would throw a hydration mismatch and the page would flash or
// break. Instead we hash the slug, a pure function of the URL, so the server
// and the browser always land on the same variant, and /valrico/ keeps the same
// copy on every single visit while /brandon/ gets different copy.
//
// If it breaks, check:
//   - Form submits but nothing shows in Follow Up Boss → not this file. Check
//     src/app/api/contact/route.ts and src/lib/fub.ts.
//   - Submit button stays greyed out → Turnstile never returned a token. Check
//     src/components/ui/TurnstileWidget.tsx and the Turnstile site key env var.
//   - Every page shows the SAME headline → the `slug` being passed in is empty
//     or identical. Log it; it must be the real page slug, not the city name.
//   - React hydration warning in the console → someone introduced randomness or
//     a Date() into the variant picker. It has to stay a pure function of slug.
// =============================================================================

import Link from "next/link";
import ContactForm from "@/components/ui/ContactForm";

// -----------------------------------------------------------------------------
// Conversion destinations
//
// Every variant points at one of these. They are all real, already-shipped,
// SINGLE-SEGMENT routes (verified present under src/app/): /free-home-valuation/,
// /sell-your-home/, /contact/, /buyers/, /sellers/.
//
// IMPORTANT ROUTING NOTE, do not "improve" these into nested paths.
// next.config.mjs has `:city` flatten redirects. A nested route (two or more
// path segments, e.g. /valrico/sell/) 404s or redirect-loops on the LIVE domain
// unless it is excluded from BOTH redirect lookaheads, while working perfectly in
// local dev. Known live casualty: /auburndale/gapway-lakes-estates/. Single
// top-level segments like the ones below are unaffected.
// -----------------------------------------------------------------------------
const CONVERSION_LINKS = {
  valuation: "/free-home-valuation/",
  sell: "/sell-your-home/",
  contact: "/contact/",
  buyers: "/buyers/",
  sellers: "/sellers/",
} as const;

/** Shape of one CTA copy variant. The functions take the area name
 *  ("Valrico", "Bloomingdale") so the copy reads naturally for any page. */
interface CtaVariant {
  /** H2 above the form. Must NOT be the banned "Ready to Make X Home?" pattern. */
  heading: (area: string) => string;
  /** One or two supporting sentences. Plain text, no stats, no invented numbers. */
  blurb: (area: string) => string;
  /** Label on the submit button. */
  submitLabel: string;
  /** Short headline for the dark CTA bar at the very bottom of the page. */
  barHeading: (area: string) => string;
  /** The in-body conversion link this variant pushes, with keyword anchor text.
   * Never "click here", the anchor text is a ranking signal. */
  link: { href: string; label: (area: string) => string };
}

// -----------------------------------------------------------------------------
// THE VARIANT BANK, 10 distinct sets of copy
//
// Rules baked into this copy, so nobody has to remember them while editing:
// - "23+ years of real estate experience", never a higher number, and NEVER
//     attached to a place. Barrett has been licensed since September 2003 but has
//     only been in Florida about a decade, so "23 years in Tampa Bay" / "23 years
//     of local knowledge" / "after 23 years here" would all be FALSE. Local
//     tenure is "longtime local" or "over a decade" with no year count.
//   - "REMAX" with no slash (the slash hurts SEO/AEO).
//   - "owners suite", never "master suite".
//   - No mobile/manufactured homes. No invented medians, school ratings or stats.
//
// Adding an 11th variant? Just append it. The picker uses the array length, so
// nothing else needs to change.
// -----------------------------------------------------------------------------
const CTA_VARIANTS: CtaVariant[] = [
  {
    heading: (a) => `Let's Find Your Place in ${a}`,
    blurb: (a) =>
      `Tell me what you're after and I'll send back the ${a} homes that actually fit, not a dump of every listing in the ZIP code. Barrett Henry, Broker Associate with REMAX Collective, 23+ years of real estate experience.`,
    submitLabel: "Send My Criteria",
    barHeading: (a) => `Start Your ${a} Home Search`,
    link: { href: CONVERSION_LINKS.buyers, label: (a) => `${a} home buyer resources` },
  },
  {
    heading: (a) => `Talk to a Local ${a} Expert`,
    blurb: (a) =>
      `Questions about a specific street, an HOA, a CDD assessment, or a home you drove past in ${a}? Ask me directly, no sign-up wall, no drip campaign you can't get out of.`,
    submitLabel: "Ask Barrett",
    barHeading: (a) => `Get Answers About ${a} Real Estate`,
    link: { href: CONVERSION_LINKS.contact, label: () => `contact Barrett Henry directly` },
  },
  {
    heading: (a) => `Tour ${a} Homes on Your Schedule`,
    blurb: (a) =>
      `Pick the homes you want to see in ${a} and I'll line up the showings around your week, evenings and weekends included. Out of state? Video walkthroughs on request.`,
    submitLabel: "Request a Showing",
    barHeading: (a) => `Schedule a Showing in ${a}`,
    link: { href: CONVERSION_LINKS.buyers, label: (a) => `how to buy a home in ${a}` },
  },
  {
    heading: (a) => `What Is Your ${a} Home Worth Today?`,
    blurb: (a) =>
      `Automated estimates miss the things that move a price, condition, updates, which side of the street you're on. I'll pull the real comparable sales for your ${a} block and walk you through them.`,
    submitLabel: "Get My Home Value",
    barHeading: (a) => `Find Out What Your ${a} Home Is Worth`,
    link: { href: CONVERSION_LINKS.valuation, label: (a) => `free ${a} home valuation` },
  },
  {
    heading: (a) => `Get First Look at New ${a} Listings`,
    blurb: (a) =>
      `New listings in ${a} move fast. Tell me your must-haves and your ceiling, and you'll hear from me when something matching hits the MLS instead of finding it a week late.`,
    submitLabel: "Set Up My Alerts",
    barHeading: (a) => `See New ${a} Listings First`,
    link: { href: CONVERSION_LINKS.buyers, label: (a) => `${a} buyer guides and checklists` },
  },
  {
    heading: (a) => `Thinking About Selling in ${a}?`,
    blurb: (a) =>
      `Before you spend a dollar on repairs, let's talk about what ${a} buyers are actually paying for right now and what they ignore. Straight answer, no listing-presentation pressure.`,
    submitLabel: "Talk About Selling",
    barHeading: (a) => `Selling a Home in ${a}?`,
    link: { href: CONVERSION_LINKS.sell, label: (a) => `sell your ${a} home` },
  },
  {
    heading: (a) => `Narrow Down ${a} Homes in One Call`,
    blurb: (a) =>
      `Scrolling listings for hours rarely gets anyone closer. Twenty minutes on the phone usually does. Send your details and I'll call with a shortlist for ${a}.`,
    submitLabel: "Request a Call",
    barHeading: (a) => `Get a ${a} Shortlist`,
    link: { href: CONVERSION_LINKS.contact, label: () => `schedule a call with Barrett` },
  },
  {
    heading: (a) => `Your ${a} Home Search Starts Here`,
    blurb: (a) =>
      `Pre-approval, inspections, insurance quotes, closing, I run buyers through all of it in ${a} every month and can tell you where the delays usually show up.`,
    submitLabel: "Get Started",
    barHeading: (a) => `Buying in ${a}?`,
    link: { href: CONVERSION_LINKS.buyers, label: () => `first-time home buyer resources` },
  },
  {
    heading: (a) => `Have a Question About ${a}? Ask It.`,
    blurb: (a) =>
      `Schools, flood zones, HOA rules, which ${a} streets are worth the premium, send the question and you'll get a real answer back, not a brochure.`,
    submitLabel: "Send My Question",
    barHeading: (a) => `Ask About Living in ${a}`,
    link: { href: CONVERSION_LINKS.contact, label: (a) => `ask about ${a} real estate` },
  },
  {
    heading: (a) => `Buying and Selling in ${a} at the Same Time?`,
    blurb: (a) =>
      `Lining up a sale and a purchase is the hardest timing problem in real estate. I do it constantly in ${a}, contingencies, bridge options, and a realistic closing calendar.`,
    submitLabel: "Plan My Move",
    barHeading: (a) => `Moving Within ${a}?`,
    link: { href: CONVERSION_LINKS.sellers, label: () => `home seller resources` },
  },
];

// -----------------------------------------------------------------------------
// hashSlug, turn a URL slug into a stable number
//
// This is the classic djb2 string hash. Walk the characters, and for each one do
// `hash = hash * 33 + charCode`. The `| 0` forces the result back into a 32-bit
// signed integer on every step so the number never balloons into float territory
// and the result is identical on every machine (server and browser).
//
// Why a hash instead of, say, "first letter of the slug"? Because we want
// NEIGHBOURING pages to differ. Alphabetical bucketing would hand "brandon",
// "brandon-condos" and "brandon-luxury-homes" the same copy. A hash scatters
// similar strings into different buckets, which is exactly what we want.
//
// Math.abs because djb2 overflows into negative numbers and `%` on a negative
// number in JavaScript returns a negative index, which would blow up the lookup.
// -----------------------------------------------------------------------------
function hashSlug(slug: string): number {
  let hash = 5381;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) + hash + slug.charCodeAt(i)) | 0; // hash * 33 + char
  }
  return Math.abs(hash);
}

/**
 * Pick the CTA copy for a page. Pure function of the slug: same slug in, same
 * copy out, forever, which is what keeps server render and client hydration in
 * agreement and keeps the page stable for Google between crawls.
 *
 * Exported so other templates in this folder can reuse the same copy bank.
 */
export function getAreaCtaVariant(slug: string): CtaVariant {
  return CTA_VARIANTS[hashSlug(slug) % CTA_VARIANTS.length];
}

// =============================================================================
// AreaHeroCtaButtons, the above-the-fold buttons
//
// These sit in the dark hero on every city, spoke and neighborhood page, so they
// are visible WITHOUT scrolling, which is where most of this traffic converts
// because most of it is on a phone.
//
// The phone number is rendered as plain, always-visible text. It is deliberately
// NOT wrapped in `hidden md:block`, hiding Barrett's phone number on mobile is
// an explicit rule violation on this project, and mobile is the majority of this
// traffic. tel: makes it one tap to dial.
// =============================================================================
export function AreaHeroCtaButtons({
  /** Anchor id of the on-page lead form, so the second button scrolls to it
   *  instead of sending the visitor off to another page and losing them. */
  formAnchor = "talk-to-barrett",
}: {
  formAnchor?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Tap-to-call. Visible at every breakpoint. */}
      <a
        href="tel:+18137337907"
        className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
        aria-label="Call or text Barrett Henry at (813) 733-7907"
      >
        Call or Text (813) 733-7907
      </a>

      {/* Same-page jump to the form below. A plain <a href="#..."> is correct
          here, next/link is for route changes, not in-page anchors. */}
      <a
        href={`#${formAnchor}`}
        className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
      >
        Get Help From Barrett
      </a>

      {/* Secondary route for sellers, who are a different visitor than a buyer
          scrolling listings. Single-segment route, safe under the :city
          flatten redirects (see the routing note at the top of this file). */}
      <Link
        href={CONVERSION_LINKS.valuation}
        className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
      >
        What&apos;s My Home Worth?
      </Link>
    </div>
  );
}

// =============================================================================
// AreaLeadCapture, the actual lead form block
//
// Reuses ContactForm, which already owns:
//   - Turnstile spam protection (submit stays disabled until it passes)
//   - POST to /api/contact
//   - Follow Up Boss push + n8n automations
//   - the legal consent text and trust signals
//
// The only thing we add is area context so Barrett can tell in FUB WHICH page
// produced the lead, a Riverview buyer and a Bloomingdale seller need different
// follow-up, and that routing information is the whole point.
// =============================================================================
export function AreaLeadCapture({
  areaName,
  slug,
  source,
  anchorId = "talk-to-barrett",
}: {
  /** Display name used in the copy: "Valrico", "Bloomingdale". */
  areaName: string;
  /** Page slug, drives which CTA variant this page gets. */
  slug: string;
  /** Goes to Follow Up Boss as the lead source, e.g. "valrico-city-hub".
   *  Keep these readable: Barrett filters smart lists on them. */
  source: string;
  /** Id the hero button scrolls to. Override only if a page needs two forms. */
  anchorId?: string;
}) {
  const variant = getAreaCtaVariant(slug);

  return (
    // scroll-mt-24 keeps the heading clear of the sticky site header when the
    // hero button jumps down to this anchor. Without it the heading hides behind
    // the header and the page looks like it did nothing.
    <section
      id={anchorId}
      className="scroll-mt-24 bg-light border-y border-border py-14"
      aria-labelledby={`${anchorId}-heading`}
    >
      <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* ---- Left column: the pitch, the phone number, the body links ---- */}
        <div>
          <h2
            id={`${anchorId}-heading`}
            className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4"
          >
            {variant.heading(areaName)}
          </h2>

          <p className="font-body text-muted font-light leading-relaxed mb-6">
            {variant.blurb(areaName)}
          </p>

          {/* Tap-to-call again, next to the form. Plenty of people will not fill
              in a form but will happily call, so the number has to be here too
              and has to stay visible on mobile. */}
          <a
            href="tel:+18137337907"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded text-sm hover:bg-primary/90 transition-colors mb-6"
            aria-label="Call or text Barrett Henry at (813) 733-7907"
          >
            Call or Text (813) 733-7907
          </a>

          {/* ---- In-body conversion links ----
              Required on every page: at least one link to a conversion page.
              Anchor text is keyword-bearing ("free Valrico home valuation"),
              never "click here", the anchor text is what Google and the AI
              answer engines read as the topic of the destination. */}
          <ul className="font-body text-sm text-muted space-y-2">
            <li>
              {/* Variant-specific primary link, so 3,200 pages are not all
                  pointing at the same page with the same anchor text. */}
              <Link href={variant.link.href} className="text-link hover:underline font-semibold">
                {variant.link.label(areaName)}
              </Link>
            </li>
            <li>
              <Link href={CONVERSION_LINKS.valuation} className="text-link hover:underline">
                Free home valuation for {areaName} owners
              </Link>
            </li>
            <li>
              <Link href={CONVERSION_LINKS.sell} className="text-link hover:underline">
                Selling a home in {areaName}
              </Link>
            </li>
            <li>
              <Link href={CONVERSION_LINKS.contact} className="text-link hover:underline">
                Contact Barrett Henry, REALTOR&reg;
              </Link>
            </li>
          </ul>

          <p className="font-body text-xs text-muted/70 mt-6 leading-relaxed">
            Barrett Henry &bull; Broker Associate, REMAX Collective &bull; 23+ years of
            real estate experience &bull; FL License #BK3313308
          </p>
        </div>

        {/* ---- Right column: the real form ----
            `source` is the field Barrett reads in Follow Up Boss to know which
            area page the lead came from. `property.city` carries the area name in
            the structured payload as well, which is what FUB displays alongside
            the enquiry. Both are optional pass-throughs on /api/contact, so this
            cannot break the pipeline, it only adds context. */}
        <div>
          <ContactForm
            webhookUrl="/api/contact"
            source={source}
            type="contact"
            property={{ city: areaName, state: "FL" }}
            title={`Message Barrett About ${areaName}`}
            submitLabel={variant.submitLabel}
          />
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// AreaCtaBar, the dark bar at the very bottom of the page
//
// This replaces the old hard-coded "Looking for homes in {city}?" bar. That one
// sentence was rendering on ~3,200 pages with nothing but the place name
// changing, which is both the boilerplate Barrett has banned and a textbook
// near-duplicate-content signal. Same slug-keyed variant as the form above, so
// the bottom bar and the form read as one consistent message per page.
// =============================================================================
export function AreaCtaBar({
  areaName,
  slug,
  formAnchor = "talk-to-barrett",
}: {
  areaName: string;
  slug: string;
  formAnchor?: string;
}) {
  const variant = getAreaCtaVariant(slug);

  return (
    <section className="bg-primary py-12">
      <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
            {variant.barHeading(areaName)}
          </p>
          <p className="font-body text-white/70 text-sm">
            Barrett Henry, REALTOR&reg;, 23+ years of real estate experience
          </p>
        </div>
        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <a
            href="tel:+18137337907"
            className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
            aria-label="Call or text Barrett Henry at (813) 733-7907"
          >
            Call or Text (813) 733-7907
          </a>
          {/* Jump back up to the on-page form rather than shipping the visitor
              to /contact/ and making them start over. */}
          <a
            href={`#${formAnchor}`}
            className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
          >
            {variant.submitLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
