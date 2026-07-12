// =============================================================================
// CityContent — "About {City}" content section
// Server component. Tries to load REAL WordPress content first. If none found,
// falls back to auto-generated placeholder paragraphs.
// Includes Barrett's phone number and a CTA.
// =============================================================================

import Image from "next/image";
import type { CityData } from "@/data/cities";
import type { SPOKE_TOPICS } from "@/data/cities";
import { getPageContent } from "@/lib/page-content";
import { cleanWpContent } from "@/lib/utils";

interface CityContentProps {
  /** The city to generate content about */
  city: CityData;
  /** If set, tailor the content to this specific topic (spoke page) */
  topic?: (typeof SPOKE_TOPICS)[number];
}

// Maps each county to its school district name and website URL.
// Used to show the correct school district link in the outbound resources box.
const SCHOOL_DISTRICT_LINKS: Record<string, { name: string; url: string }> = {
  Hillsborough: {
    name: "Hillsborough County Public Schools",
    url: "https://www.hillsboroughschools.org",
  },
  Pinellas: {
    name: "Pinellas County Schools",
    url: "https://www.pcsb.org",
  },
  Pasco: {
    name: "Pasco County Schools",
    url: "https://www.pasco.k12.fl.us",
  },
  Manatee: {
    name: "Manatee County School District",
    url: "https://www.manateeschools.net",
  },
  Polk: {
    name: "Polk County Public Schools",
    url: "https://www.polk-fl.net",
  },
  Sarasota: {
    name: "Sarasota County Schools",
    url: "https://www.sarasotacountyschools.net",
  },
  Hernando: {
    name: "Hernando County School District",
    url: "https://www.hernandoschools.org",
  },
  Citrus: {
    name: "Citrus County School District",
    url: "https://www.citrusschools.org",
  },
};

export default function CityContent({ city, topic }: CityContentProps) {
  // Build the slug to look up: hub = "valrico", spoke = "valrico-homes-for-sale"
  const pageSlug = topic ? `${city.slug}-${topic.slug}` : city.slug;

  // Try to load real WordPress content for this page
  const wpContent = getPageContent(pageSlug);

  // Format zip codes as a readable list (used in placeholder fallback)
  const zipList = formatZipList(city.zip_codes);

  // Clean WordPress artifacts: strip shortcodes, fix image URLs
  // Also demote H2→H3 since CityContent already has an H2 wrapper —
  // prevents duplicate H2 headings that hurt SEO
  const cleanContent = wpContent
    ? cleanWpContent(wpContent)
        .replace(/<h2([^>]*)>/gi, '<h3$1>')
        .replace(/<\/h2>/gi, '</h3>')
    : null;

  return (
    <section className="container-wide py-12">
      {/* First-person intro — demonstrates EEAT first-hand experience */}
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <Image
          src="/images/barrett-headshot.png"
          alt="Barrett Henry, REALTOR® and Broker Associate at REMAX Collective"
          width={160}
          height={160}
          className="rounded-lg flex-shrink-0"
        />
        <div className="prose prose-lg max-w-none text-muted font-body">
          <p>
            {topic ? (
              <>
                I&apos;ve helped dozens of families find {topic.label.toLowerCase()} in{" "}
                <strong>{city.name}</strong>. Here&apos;s what I tell every client: start with
                the neighborhoods, understand the pricing trends, and always get a local
                expert who knows the <strong>{city.county} County</strong> market inside and out.
                My name is <strong>Barrett Henry</strong>, and I&apos;m a licensed Broker Associate
                with <strong>REMAX Collective</strong>. Call me at{" "}
                <strong><a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a></strong>{" "}
                and I&apos;ll walk you through every option.
              </>
            ) : (
              <>
                I&apos;ve helped dozens of families buy and sell in <strong>{city.name}</strong>.
                Here&apos;s what I tell every client: know the neighborhoods, understand the
                pricing, and work with someone who knows <strong>{city.county} County</strong>{" "}
                inside and out. My name is <strong>Barrett Henry</strong>, and I&apos;m a licensed
                Broker Associate with <strong>REMAX Collective</strong> with 23+ years of real
                estate experience. Call me at{" "}
                <strong><a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a></strong>{" "}
                — I&apos;d love to help you find your next home.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Section heading */}
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
        {topic
          ? `${topic.label} in ${city.name}, Florida`
          : `About ${city.name}, Florida`}
      </h2>

      {cleanContent ? (
        // ---- REAL WordPress content found — render it (shortcodes stripped) ----
        <div
          className="blog-content prose prose-lg max-w-none text-muted font-body"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      ) : (
        // ---- No WP content — fall back to generated placeholder ----
        <div className="prose prose-lg max-w-none text-muted font-body space-y-4">
          {topic ? (
            // ---- Spoke page placeholder: topic-specific rich content ----
            <SpokeTopicContent city={city} topic={topic} zipList={zipList} />
          ) : (
            // ---- Hub page placeholder: general city overview ----
            <>
              <p>
                <strong>{city.name}</strong> is a sought-after community in{" "}
                <strong>{city.county} County</strong>,
                Florida, spanning ZIP codes {zipList}. {city.tagline}. From
                first-time buyers to seasoned investors, {city.name} offers
                something for everyone.
              </p>
              <p>
                I bring 23+ years of real estate experience to every
                transaction. As a local market expert, I help buyers and
                sellers in {city.name} navigate pricing, negotiations, and
                inspections with confidence. My goal is to make your home search
                straightforward — we will find the right fit and close on your terms.
              </p>
              <p>
                Ready to explore homes in {city.name}? Call{" "}
                <a
                  href="tel:+18137337907"
                  className="text-link font-semibold hover:underline"
                >
                  <strong>(813) 733-7907</strong>
                </a>{" "}
                or use the contact form to get started. I&apos;ll send
                you a curated list of {city.name} properties that match your
                criteria.
              </p>
            </>
          )}
        </div>
      )}

      {/* Outbound links — authoritative external resources for SEO credibility */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-heading font-bold text-lg text-primary mb-3">
          Helpful Resources for {city.name} Home Buyers
        </h3>
        <ul className="space-y-2 font-body text-sm text-muted">
          <li>
            <a
              href={SCHOOL_DISTRICT_LINKS[city.county]?.url ?? "https://www.hillsboroughschools.org"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              {SCHOOL_DISTRICT_LINKS[city.county]?.name ?? "Hillsborough County Public Schools"}
            </a>{" "}
            — School zones, ratings, and enrollment info
          </li>
          <li>
            <a
              href="https://www.myfloridalicense.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              Florida DBPR License Verification
            </a>{" "}
            — Verify any Florida real estate license
          </li>
          <li>
            <a
              href="https://msc.fema.gov/portal/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              FEMA Flood Map Service Center
            </a>{" "}
            — Check flood zones before you buy
          </li>
        </ul>
      </div>

    </section>
  );
}

// -----------------------------------------------------------------------------
// Helper: format a list of ZIP codes into a readable string
// ["33594", "33596"] -> "33594 and 33596"
// ["33510", "33511", "33512"] -> "33510, 33511, and 33512"
// -----------------------------------------------------------------------------
function formatZipList(zips: string[]): string {
  if (zips.length === 0) return "";
  if (zips.length === 1) return zips[0];
  if (zips.length === 2) return `${zips[0]} and ${zips[1]}`;
  // 3+ zips: use Oxford comma
  return `${zips.slice(0, -1).join(", ")}, and ${zips[zips.length - 1]}`;
}

// =============================================================================
// SpokeTopicContent — renders topic-specific placeholder paragraphs
// Each spoke topic gets its own rich content template with internal links,
// genuinely useful info, and city/county interpolation.
// =============================================================================

/** Reusable phone link JSX */
const PhoneLink = () => (
  <a href="tel:+18137337907" className="text-link font-semibold hover:underline">
    <strong>(813) 733-7907</strong>
  </a>
);

function SpokeTopicContent({
  city,
  topic,
  zipList,
}: {
  city: CityData;
  topic: (typeof SPOKE_TOPICS)[number];
  zipList: string;
}) {
  // Common CTA paragraph reused across most topics
  const ctaParagraph = (
    <p>
      Ready to take the next step? Call <PhoneLink /> or{" "}
      <a href="/contact/" className="text-link font-semibold hover:underline">fill out my contact form</a>{" "}
      to get a personalized list of {topic.label.toLowerCase()} in {city.name} sent straight
      to your inbox. I bring 23+ years of real estate experience to every transaction and
      will guide you from first showing to closing day.
    </p>
  );

  switch (topic.slug) {
    // ---- HOMES FOR SALE (general market overview) ----
    case "homes-for-sale":
      return (
        <>
          <p>
            The <strong>{city.name}</strong> real estate market in{" "}
            <strong>{city.county} County</strong> offers a wide range of properties across
            ZIP codes {zipList}. {city.tagline}. Whether you are a first-time buyer
            exploring <a href="/fha-loan-florida/" className="text-link hover:underline">FHA loan options</a>,
            a move-up buyer looking for more space, or an investor analyzing cap rates,
            {city.name} has inventory worth exploring.
          </p>
          <p>
            When you work with me, you get direct MLS access with real-time alerts — not
            the delayed data from third-party portals. I analyze comparable sales, review
            price history, and negotiate aggressively so you buy at the right number. Use
            my <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to estimate monthly payments, then browse all available listings right here
            on this page. For a broader look at the area, visit
            the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>.
          </p>
          {ctaParagraph}
        </>
      );

    // ---- POOL HOMES ----
    case "homes-with-pool":
      return (
        <>
          <p>
            Florida and pools go together, and <strong>{city.name}</strong> is no exception.
            Pool homes in <strong>{city.county} County</strong> range from modest screened-in
            splash pools to resort-style saltwater setups with spas and outdoor kitchens.
            Screened enclosures (also called &ldquo;lanais&rdquo;) are the standard in Florida — they
            keep out bugs and debris while letting you enjoy the pool year-round. If you
            find a home with an open (unscreened) pool, budget $8,000 to $15,000 to add a
            cage later.
          </p>
          <p>
            Pool maintenance in the Tampa Bay area typically runs $100 to $200 per month for
            professional service, and resurfacing costs $5,000 to $15,000 depending on size
            and finish. During the buying process, I always recommend a dedicated{" "}
            <strong>pool inspection</strong> separate from the general home inspection — it
            checks the pump, heater, surface condition, and deck drainage. I will connect
            you with trusted local inspectors in {city.name} who specialize in pool systems.
            Explore all property types in the{" "}
            <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            or estimate your monthly costs with
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>.
          </p>
          {ctaParagraph}
        </>
      );

    // ---- NEW CONSTRUCTION ----
    case "new-construction":
      return (
        <>
          <p>
            New construction in <strong>{city.name}</strong> means a brand-new home with
            modern floor plans, energy-efficient systems, and a builder warranty that
            typically covers structural components for 10 years, major systems for 2 years,
            and workmanship for 1 year. Several national and regional builders are active
            in <strong>{city.county} County</strong>, offering everything from starter homes
            in the low $300s to fully customized estates.
          </p>
          <p>
            One important cost to understand is the <strong>CDD (Community Development
            District) fee</strong>. Many new communities in Florida use CDDs to fund
            infrastructure — roads, utilities, amenity centers — and those fees appear as
            a separate line item on your tax bill, often $1,500 to $4,000 per year. I help
            you compare the total cost of ownership, including CDD, HOA, and property
            taxes, so there are no surprises. And here is something most buyers do not
            know: the builder&apos;s sales agent represents the builder, not you. Having your
            own Broker Associate costs you nothing and ensures someone is reviewing
            contracts, upgrades, and inspection timelines on your behalf.
          </p>
          <p>
            Use the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to estimate payments on new builds, or check
            out <a href="/fha-loan-florida/" className="text-link hover:underline">FHA loan</a> and
            conventional financing options. Visit the{" "}
            <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for a full overview of the area. Call <PhoneLink /> and I will walk you through
            every active new-construction community in {city.name}.
          </p>
        </>
      );

    // ---- LUXURY HOMES ($750K+) ----
    case "luxury-homes":
      return (
        <>
          <p>
            The luxury market in <strong>{city.name}</strong> starts around $750,000 and
            includes properties with premium features like gourmet kitchens, wine rooms,
            home theaters, multi-car garages, resort-style pools, and smart-home
            automation. Many luxury homes in <strong>{city.county} County</strong> sit on
            oversized lots or within gated communities that offer golf, tennis, and
            private clubhouses. The lifestyle component — proximity to top-rated schools,
            waterfront access, and walkability — is just as important as the home itself.
          </p>
          <p>
            Financing a luxury home often means a{" "}
            <a href="/jumbo-loan-florida/" className="text-link hover:underline">jumbo loan</a>,
            which exceeds the conforming loan limit (currently $766,550 in most Florida
            counties). Jumbo loans typically require a larger down payment (10 to 20
            percent), higher credit scores, and more extensive income documentation. I
            work with lenders who specialize in jumbo and portfolio products to get you
            competitive rates. For an estimate, try
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>.
          </p>
          <p>
            Luxury transactions also require extra discretion and targeted marketing
            when selling. Whether you are buying or selling a high-end property
            in {city.name}, call <PhoneLink /> or visit
            my <a href="/contact/" className="text-link hover:underline">contact page</a> to
            discuss your goals. Start with the{" "}
            <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for neighborhood-level detail.
          </p>
        </>
      );

    // ---- WATERFRONT HOMES ----
    case "waterfront-homes":
      return (
        <>
          <p>
            Waterfront living in <strong>{city.name}</strong> comes in many forms — lakefront
            lots, canal-front homes with Gulf access, riverfront properties, and bayfront
            estates. In <strong>{city.county} County</strong>, waterfront homes command a
            premium, but the lifestyle is hard to beat: fishing from your backyard, kayaking
            at sunrise, and unobstructed water views. If boat access matters to you, verify
            whether the property includes a private dock or boat lift, and check bridge
            clearances and channel depths to open water.
          </p>
          <p>
            Two things every waterfront buyer must address: <strong>flood insurance</strong>{" "}
            and <strong>seawall condition</strong>. Florida requires flood insurance on
            properties in FEMA-designated flood zones, and premiums vary significantly
            based on elevation, zone rating, and whether the home has been elevated. Seawall
            inspections are critical — replacing a deteriorated seawall can cost $300 to
            $800 per linear foot. I coordinate these specialized inspections so you know
            exactly what you are buying. Check your flood zone on the{" "}
            <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="text-link hover:underline">FEMA Flood Map Service Center</a>{" "}
            before you start your search.
          </p>
          <p>
            Use the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to estimate payments, and visit the{" "}
            <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for more about the area. Call <PhoneLink /> to tour waterfront properties
            in {city.name} this week.
          </p>
        </>
      );

    // ---- 55+ COMMUNITIES ----
    case "55-plus-homes":
      return (
        <>
          <p>
            Active adult communities in <strong>{city.name}</strong> are designed for
            residents 55 and older who want a low-maintenance lifestyle with built-in
            social activities. These communities in <strong>{city.county} County</strong>{" "}
            typically feature clubhouses, fitness centers, pools, pickleball and tennis
            courts, walking trails, and organized events. Under the federal Housing for
            Older Persons Act (HOPA), at least 80 percent of occupied units must have one
            resident who is 55 or older — so age verification is part of the buying
            process.
          </p>
          <p>
            HOA fees in 55+ communities usually cover exterior maintenance, landscaping,
            roof insurance, and amenity access, making them a turnkey option for buyers
            who want to enjoy retirement without yard work. Monthly HOA fees typically range
            from $200 to $600 depending on the community and what is included. Some
            communities also carry CDD assessments. I will break down the total monthly
            cost — mortgage, taxes, insurance, HOA, and CDD — so you can compare
            communities accurately. Try the{" "}
            <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            for a quick estimate.
          </p>
          <p>
            Explore the full{" "}
            <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for neighborhood details, or call <PhoneLink /> to schedule tours of 55+
            communities in {city.name}. I will match you with communities that fit your
            lifestyle and budget.
          </p>
        </>
      );

    // ---- OPEN HOUSES ----
    case "open-houses":
      return (
        <>
          <p>
            Open houses in <strong>{city.name}</strong> are the fastest way to tour multiple
            properties in a single day without scheduling individual appointments. Most open
            houses in <strong>{city.county} County</strong> are held on Saturdays and Sundays
            from 12 PM to 3 PM, though weekday twilight events are becoming more common.
            You can walk through at your own pace, check the neighborhood in person, and
            ask the hosting agent questions about the property.
          </p>
          <p>
            Here is how to get the most out of open houses: bring a pre-approval letter
            (or at least know your budget — use
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a> to
            estimate), take photos and notes at each home, and pay attention to things
            photos do not show — street noise, natural light, and the condition of
            neighboring properties. If you find a home you love, having a Broker Associate
            on your side means you can write an offer the same day with confidence.
          </p>
          <p>
            I host open houses regularly and also track every upcoming open house
            in {city.name} through the MLS. Call <PhoneLink /> or{" "}
            <a href="/contact/" className="text-link hover:underline">contact me</a> to
            get my weekend open house schedule, or browse
            the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            to explore all property types.
          </p>
        </>
      );

    // ---- INVESTMENT PROPERTY ----
    case "investment-property":
      return (
        <>
          <p>
            <strong>{city.name}</strong> in <strong>{city.county} County</strong> is a
            strong market for real estate investors. Tampa Bay&apos;s population growth,
            job market, and year-round rental demand create favorable conditions for
            long-term buy-and-hold strategies. When evaluating investment properties, I
            help you analyze cap rate, cash-on-cash return, projected rent, vacancy rates,
            and total operating expenses so you buy based on numbers — not emotion.
          </p>
          <p>
            Financing options for investors include conventional loans (typically 20 to
            25 percent down for non-owner-occupied), <strong>DSCR loans</strong> (Debt
            Service Coverage Ratio — qualified based on the property&apos;s rental income
            rather than your personal income), and portfolio loans for buyers building a
            larger portfolio. I work with lenders who specialize in investor products
            and can close quickly. Use the{" "}
            <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to run payment scenarios at different down payment levels.
          </p>
          <p>
            Need help managing your rental after closing? I can connect you with trusted
            local property management services in {city.county} County. Visit
            the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for area details, or call <PhoneLink /> to review current investment
            opportunities in {city.name}.
          </p>
        </>
      );

    // ---- NEW LISTINGS ----
    case "new-listings":
      return (
        <>
          <p>
            In a competitive market like <strong>{city.name}</strong>, the newest listings
            often receive offers within the first week. Getting early access to new listings
            in <strong>{city.county} County</strong> can mean the difference between landing
            your dream home and losing out to another buyer. The listings on this page
            update directly from the MLS, so you are seeing the most current inventory
            available in ZIP codes {zipList}.
          </p>
          <p>
            Speed matters, but so does preparation. Before you start touring new listings,
            get pre-approved with a lender so you can make strong offers immediately. Not
            sure where to start? Check out{" "}
            <a href="/fha-loan-florida/" className="text-link hover:underline">FHA loans</a> for
            low down payment options, or use
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to see what fits your budget. I set up custom MLS alerts for my clients so
            you get notified the moment a matching property hits the market — before it
            shows up on Zillow or Realtor.com.
          </p>
          <p>
            Call <PhoneLink /> or{" "}
            <a href="/contact/" className="text-link hover:underline">contact me</a> to
            set up your personalized listing alerts. You can also explore the{" "}
            <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for a full overview of neighborhoods, schools, and lifestyle.
          </p>
        </>
      );

    // ---- SINGLE-STORY HOMES ----
    case "single-story-homes":
      return (
        <>
          <p>
            Single-story homes (also called ranch-style or one-level homes) are among the
            most popular property types in <strong>{city.name}</strong>. Florida&apos;s flat
            terrain makes single-story construction practical and cost-effective, and
            buyers love the convenience of having everything on one floor — no stairs to
            navigate, easier maintenance, and better accessibility for all ages. In{" "}
            <strong>{city.county} County</strong>, single-story homes range from cozy
            3-bedroom starters to sprawling 5-bedroom estates on half-acre lots.
          </p>
          <p>
            Single-story living is especially appealing for aging-in-place planning.
            Features like wider doorways, walk-in showers, and open floor plans are
            not just comfortable now — they add long-term value and make the home
            adaptable as your needs change. First-time buyers also appreciate single-story
            homes for their lower insurance costs (no second-floor wind exposure) and
            simpler roof maintenance. Explore financing options like{" "}
            <a href="/fha-loan-florida/" className="text-link hover:underline">FHA loans</a> or
            use the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to estimate your monthly payment.
          </p>
          <p>
            Browse the {city.name} single-story listings above, or visit
            the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for a complete neighborhood breakdown. Call <PhoneLink /> to tour single-story
            homes in {city.name} this week.
          </p>
        </>
      );

    // ---- LAND FOR SALE ----
    case "land-for-sale":
      return (
        <>
          <p>
            Buying land in <strong>{city.name}</strong> gives you the freedom to build
            exactly the home you want — your floor plan, your finishes, your timeline.
            Vacant lots in <strong>{city.county} County</strong> range from quarter-acre
            infill parcels in established neighborhoods to multi-acre tracts in rural
            areas. Before purchasing, you need to verify several things: zoning (residential
            vs. agricultural vs. commercial), whether the lot has access to{" "}
            <strong>city water and sewer</strong> or requires a well and septic system,
            and what the county&apos;s <strong>impact fees</strong> will add to your
            building costs.
          </p>
          <p>
            Impact fees in {city.county} County cover schools, transportation, parks, and
            utilities — and they can add $15,000 to $30,000 or more to a new build. I
            help you research these costs upfront so your budget is realistic. The
            building timeline from land purchase to move-in is typically 8 to 14 months
            depending on permitting, site work (clearing, fill, grading), and
            construction. If you are financing the land purchase separately from
            construction, land loans typically require 20 to 30 percent down and
            carry higher interest rates than traditional mortgages.
          </p>
          <p>
            Visit the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for area info, or use
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to plan your construction financing. Call <PhoneLink /> and I will help you
            find the right lot in {city.name} and connect you with reputable local builders.
          </p>
        </>
      );

    // ---- CONDOS & TOWNHOMES (combined) ----
    case "condos-townhomes":
      return (
        <>
          <p>
            Condos and townhomes in <strong>{city.name}</strong> offer a lower-maintenance
            alternative to single-family homes. In <strong>{city.county} County</strong>,
            you will find everything from affordable starter condos to luxury waterfront
            units. Condo living means the association handles exterior maintenance, roofing,
            landscaping, and often insurance on the building structure — you focus on the
            interior. Townhomes give you a bit more space and typically include a small
            private yard or patio.
          </p>
          <p>
            One Florida-specific requirement every condo buyer should know: the{" "}
            <strong>milestone inspection</strong>. Under Florida law (SB 4-D, passed after
            the Surfside tragedy), condo buildings 3 stories or taller must undergo
            structural inspections at 25 years (or 20 years if within 3 miles of the
            coast) and every 10 years after. Associations must also maintain funded
            reserves for structural maintenance. I review HOA financials, reserve studies,
            and recent inspection reports so you know the true health of any building
            before you buy. Be aware that some condo projects are{" "}
            <strong>not FHA-approved</strong>, which limits financing options — I will
            verify approval status early in the process.
          </p>
          <p>
            Estimate your monthly costs with
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>,
            and explore the full{" "}
            <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>.
            Call <PhoneLink /> to tour condos and townhomes in {city.name}.
          </p>
        </>
      );

    // ---- CONDOS FOR SALE ----
    case "condos-for-sale":
      return (
        <>
          <p>
            Condominiums in <strong>{city.name}</strong> are an excellent option for
            buyers who want a lock-and-leave lifestyle with community amenities. Condos
            in <strong>{city.county} County</strong> range from updated units in smaller
            complexes to high-rise buildings with pools, fitness centers, and concierge
            services. Monthly HOA fees typically cover water, sewer, trash, building
            insurance, exterior maintenance, and shared amenity upkeep — so your out-of-pocket
            beyond the mortgage is predictable.
          </p>
          <p>
            Florida&apos;s <strong>milestone inspection law</strong> requires structural
            inspections for buildings 3+ stories at 25 years of age (20 years near the
            coast). Associations must also fund reserves for major structural components
            — no more deferring roof or concrete repairs. Before making an offer, I
            request and review the HOA&apos;s budget, reserve study, meeting minutes, and
            any pending special assessments. Financing a condo can be trickier than a
            house: FHA and VA loans require the project to be on an approved list, and
            some lenders have restrictions on investor-owned unit ratios. I will navigate
            these details so the deal does not fall apart at underwriting. Check out{" "}
            <a href="/fha-loan-florida/" className="text-link hover:underline">FHA loan requirements</a>{" "}
            to see if you qualify.
          </p>
          <p>
            Use the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to estimate total monthly costs including HOA, and browse
            the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for neighborhood details. Call <PhoneLink /> to tour available condos in {city.name}.
          </p>
        </>
      );

    // ---- TOWNHOMES FOR SALE ----
    case "townhomes-for-sale":
      return (
        <>
          <p>
            Townhomes in <strong>{city.name}</strong> blend the space and privacy of a
            single-family home with the low-maintenance benefits of condo living. Most
            townhomes in <strong>{city.county} County</strong> include 2 to 3 bedrooms,
            an attached garage, and a small private yard or patio — ideal for first-time
            buyers, young families, and downsizers. Exterior maintenance and landscaping
            are typically handled by the HOA, so you can spend weekends enjoying{" "}
            {city.name} instead of mowing the lawn.
          </p>
          <p>
            Townhome HOA fees in the Tampa Bay area generally range from $150 to $400 per
            month and cover exterior paint, roof maintenance, landscaping, and community
            amenities. First-time buyers often find townhomes more affordable than
            detached homes in the same neighborhood, making them a smart entry point into
            homeownership. Explore{" "}
            <a href="/fha-loan-florida/" className="text-link hover:underline">FHA loan options</a>{" "}
            for low down payment financing, or use
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to compare townhome payments to rent.
          </p>
          <p>
            Visit the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for more about the area, or call <PhoneLink /> to schedule townhome tours
            in {city.name}. I will help you compare communities and HOA costs side by side.
          </p>
        </>
      );

    // ---- GATED COMMUNITIES ----
    case "gated-community-homes":
      return (
        <>
          <p>
            Gated communities in <strong>{city.name}</strong> provide an added layer of
            security and privacy with controlled access points, and many include resort-style
            amenities like pools, fitness centers, playgrounds, tennis courts, and walking
            trails. In <strong>{city.county} County</strong>, gated neighborhoods range from
            intimate enclaves of 50 homes to master-planned communities with thousands of
            residences, on-site schools, and commercial centers.
          </p>
          <p>
            Living in a gated community means you will have both <strong>HOA fees</strong>{" "}
            (covering amenities, common area maintenance, and gate staffing) and
            potentially <strong>CDD fees</strong> (if the community was built with
            Community Development District financing for infrastructure). Monthly HOA
            fees typically range from $200 to $800 depending on the level of amenities.
            I break down every recurring cost — HOA, CDD, property taxes, insurance —
            so you know the true monthly expense before you make an offer. Use
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to estimate total costs.
          </p>
          <p>
            Check out the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for a full list of neighborhoods, or call <PhoneLink /> to tour gated
            communities in {city.name}. I will get you past the gate and into the homes
            that match your wish list.
          </p>
        </>
      );

    // ---- NEIGHBORHOOD GUIDE ----
    case "neighborhood-guide":
      return (
        <>
          <p>
            Choosing a neighborhood in <strong>{city.name}</strong> is just as important
            as choosing a home. Each community in <strong>{city.county} County</strong>{" "}
            has its own personality — from established neighborhoods with mature trees
            and larger lots to newer developments with modern amenities and HOA-maintained
            common areas. School zones, commute times, walkability, and proximity to
            shopping and dining all factor into the decision.
          </p>
          <p>
            I have spent years studying {city.name}&apos;s neighborhoods and can match you
            with the right fit based on your priorities. Want top-rated schools? I will
            show you which zones consistently perform best. Need a short commute to
            downtown Tampa or MacDill AFB? I know which neighborhoods offer the
            easiest routes. Looking for a quiet, established street? I will steer you
            away from the high-traffic corridors. Visit the{" "}
            <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for an overview, and use
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to see what neighborhoods fit your budget.
          </p>
          <p>
            Call <PhoneLink /> or{" "}
            <a href="/contact/" className="text-link hover:underline">contact me</a> for
            a personalized neighborhood tour in {city.name}. I will build a custom route
            based on what matters most to you.
          </p>
        </>
      );

    // ---- HOUSING MARKET ----
    case "housing-market":
      return (
        <>
          <p>
            Understanding the <strong>{city.name}</strong> housing market helps you make
            smarter buying and selling decisions. Key metrics to watch in{" "}
            <strong>{city.county} County</strong> include median sale price, average days
            on market, list-to-sale price ratio, and active inventory levels. When
            inventory is low and demand is high, expect multiple offers and faster
            closings. When inventory rises, buyers gain more negotiating power and
            sellers need stronger pricing strategies.
          </p>
          <p>
            I track these numbers weekly and share market updates with my clients so you
            are never guessing. Whether you are buying your first home with
            an <a href="/fha-loan-florida/" className="text-link hover:underline">FHA loan</a>,
            upgrading to a larger property, or selling your current home in {city.name},
            data-driven decisions lead to better outcomes. Use
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to see how current interest rates affect your buying power.
          </p>
          <p>
            For a neighborhood-by-neighborhood breakdown, visit
            the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>.
            Call <PhoneLink /> for a free, no-obligation market analysis — whether you are
            buying, selling, or just curious about your home&apos;s current value.
          </p>
        </>
      );

    // ---- HORSE & EQUESTRIAN PROPERTIES ----
    case "horse-properties":
      return (
        <>
          <p>
            Horse properties in <strong>{city.name}</strong> and the surrounding areas
            of <strong>{city.county} County</strong> cater to equestrian enthusiasts who
            need acreage, proper zoning, and infrastructure for horses. A true horse
            property typically sits on 2 or more acres with agricultural or
            residential-agricultural zoning that permits livestock. Key features to look
            for include barns or stables, paddocks with proper fencing, tack rooms,
            wash racks, and riding arenas.
          </p>
          <p>
            Zoning is the most critical factor — not every large lot in Florida allows
            horses, and some HOAs restrict livestock even when county zoning permits it.
            I verify zoning, deed restrictions, and HOA rules before you waste time on
            a property that will not work. You should also consider water access for
            animals, pasture drainage (Florida&apos;s flat terrain can create standing
            water issues), and proximity to equestrian trails and veterinary services.
            Financing for horse properties sometimes requires a farm or agricultural
            loan rather than a traditional mortgage, depending on acreage and
            improvements.
          </p>
          <p>
            Visit the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for area details, or use
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to estimate payments. Call <PhoneLink /> and I will help you find properties
            in {city.name} with the acreage and zoning you need for your horses.
          </p>
        </>
      );

    // ---- DEFAULT FALLBACK (catches any future topics not yet templated) ----
    default: {
      // Cast to any to handle future topic slugs that aren't in the switch yet
      const fallbackTopic = topic as { slug: string; label: string };
      return (
        <>
          <p>
            Looking for <strong>{fallbackTopic.label.toLowerCase()}</strong> in{" "}
            <strong>{city.name}</strong>? You are in
            the right place. {city.name} is located in <strong>{city.county} County</strong>,
            Florida, and covers ZIP codes {zipList}. {city.tagline}.
          </p>
          <p>
            I bring 23+ years of real estate experience to every transaction.
            Whether you are searching for {fallbackTopic.label.toLowerCase()} or exploring other
            options in {city.name}, I provide expert guidance from
            first showing to closing day. We will review comparable sales,
            negotiate the best terms, and make sure your interests are protected.
            Visit the <a href={`/${city.slug}/`} className="text-link hover:underline">{city.name} city guide</a>{" "}
            for a full area overview, or use
            the <a href="/mortgage-calculator/" className="text-link hover:underline">mortgage calculator</a>{" "}
            to estimate your monthly payment.
          </p>
          <p>
            Call <PhoneLink /> or{" "}
            <a href="/contact/" className="text-link hover:underline">contact me</a> to
            schedule a showing or get a personalized list of{" "}
            {fallbackTopic.label.toLowerCase()} in {city.name} delivered straight to
            your inbox.
          </p>
        </>
      );
    }
  }
}
