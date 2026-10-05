// =============================================================================
// /pinellas-beach-condo-market-report
// Q4 2026 market report for Gulf-front condos from Belleair Beach to Madeira
// Beach: inventory, price per square foot, days on market, and buyer leverage.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import BeachCondoInventory from "@/components/ui/BeachCondoInventory";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import BeachCondoFooterBlock from "@/components/ui/BeachCondoFooterBlock";
import SourcesSection, { type Source } from "@/components/ui/SourcesSection";
import { JsonLd, breadcrumbSchema, articleSchema, faqSchema, webPageSchema } from "@/lib/schema";
import { BEACH_CONDO_PUBLISH_DATE } from "@/data/beach-condo-pages";

const SLUG = "pinellas-beach-condo-market-report";
const CANONICAL = `https://nowtb.com/${SLUG}/`;
const TITLE = "Pinellas Gulf Beach Condo Market Report, Q4 2026";
const DESCRIPTION =
  "About 73 Gulf-front condos listed under $900K. Most 2 bed units closed at $520 to $690 per square foot. Buyers have leverage in Q4 2026.";

export const metadata: Metadata = {
  // absolute: the root layout appends a suffix to title strings, which would
  // push these past the 60 character limit
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// --- Headline numbers for the snapshot grid ---
const snapshot = [
  {
    figure: "About 73",
    label: "Active or pending condos",
    detail: "2 bed and up, under $900K, in zips 33785, 33708, and 33786.",
  },
  {
    figure: "$520 to $690",
    label: "Price per square foot",
    detail: "Where most 2 bed, 2 bath Gulf-front units closed over the last 24 months.",
  },
  {
    figure: "150 to 500",
    label: "Days on market",
    detail: "How long many of the current listings have been sitting.",
  },
  {
    figure: "Flat to down",
    label: "Price direction",
    detail: "Price reductions are common and buyers have negotiating leverage.",
  },
];

// --- Reflections on the Gulf building profile ---
const reflectionsFacts = [
  { label: "Address", value: "900 Gulf Blvd, Indian Rocks Beach" },
  { label: "Units", value: "84" },
  { label: "Buildings", value: "Twin 11-story towers" },
  { label: "Year built", value: "1981" },
  { label: "Amenities", value: "Pool, spa, tennis and pickleball court, direct beach access" },
  { label: "24-month average", value: "About $635 per square foot" },
  { label: "Most recent sale", value: "About $569 per square foot (July 2026)" },
  { label: "January 2025 comparison", value: "About $686 per square foot" },
  { label: "Monthly fees", value: "Roughly $900 to $1,000 depending on the unit" },
  { label: "Reports", value: "SIRS filed and milestone completed" },
];

// --- Sources cited on this page (GEO: name the sources on-page) ---
const sources: Source[] = [
  {
    name: 'Stellar MLS active, pending, and closed sales, zips 33785, 33708, and 33786',
    used: 'Inventory count, price per square foot ranges, days on market, and the building level sales history.',
  },
  {
    name: 'Florida DBPR SIRS reporting database',
    used: 'SIRS status for the buildings named in this report.',
    href: "https://www.myfloridalicense.com/",
  },
  {
    name: 'Current listing disclosures',
    used: 'Monthly fee ranges, insurance inclusion, and special assessment notes.',
  },
];

const faqs: Faq[] = [
  {
    question: "How many Gulf-front condos are for sale on the Pinellas beaches right now?",
    answer:
      "As of October 2026 there are about 73 active or pending condos listed at 2 bedrooms and up under $900,000 across zip codes 33785, 33708, and 33786. That covers Indian Rocks Beach, Indian Shores, Redington Shores, North Redington Beach, Redington Beach, Belleair Beach, and Madeira Beach.",
  },
  {
    question: "What do Gulf-front condos sell for per square foot?",
    answer:
      "Over the last 24 months, most 2 bedroom, 2 bath Gulf-front units closed between $520 and $690 per square foot. The spread is wide because it reflects building condition, floor, view, and whether the unit has been updated, so the price per foot on any single listing only means something next to the closed sales inside that same building.",
  },
  {
    question: "Is now a good time to buy a Pinellas beach condo?",
    answer:
      "Prices are flat to slightly down and many listings have sat on the market 150 to 500 days with price reductions along the way. That gives buyers real negotiating leverage on price, closing costs, and repairs. The tradeoff is that you have to do the homework on the building, because the same conditions that created the leverage also mean more buildings carry assessments and insurance questions.",
  },
  {
    question: "Why are some beach condos sitting on the market so long?",
    answer:
      "Buyers are underwriting the building, not just the unit. Condo law changes, insurance costs, special assessments, and tighter lender project review all slow deals down. Units in buildings with a filed SIRS, a completed milestone inspection, and a clear budget tend to move faster than units in buildings where those answers are still unclear.",
  },
  {
    question: "Are monthly condo fees on the Pinellas beaches including insurance?",
    answer:
      "Not always. Some buildings do not include building insurance in the monthly fee, and some carry storm-related special assessments on top of the regular fee. Both change your real monthly cost. Ask for the current budget and the master policy before you compare two buildings on fees alone.",
  },
];

export default function PinellasBeachCondoMarketReportPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com/" },
          { name: "Pinellas County", url: "https://nowtb.com/pinellas-county/" },
          { name: "Gulf Beach Condo Market Report", url: CANONICAL },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "Pinellas Gulf Beach Condo Market Report, Q4 2026",
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: BEACH_CONDO_PUBLISH_DATE,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={webPageSchema({
          name: TITLE,
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: BEACH_CONDO_PUBLISH_DATE,
        })}
      />

      <HeroSection
        label="MARKET REPORT | Q4 2026"
        title="Gulf Beach Condo Market Report"
        subtitle="Indian Rocks Beach to Madeira Beach. What is listed, what is closing, and where buyers have leverage."
      >
        <SearchBar />
      </HeroSection>

      {/* === Quick answer === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              As of October 2026 there are about 73 active or pending Gulf-area
              condos at 2 bedrooms and up under $900,000 in zips 33785, 33708,
              and 33786. Over the last 24 months most 2 bed, 2 bath Gulf-front
              units closed between $520 and $690 per square foot. Prices are
              flat to slightly down, many listings have sat 150 to 500 days, and
              price reductions are common, so buyers have negotiating leverage
              heading into the end of the year.
            </p>
          </QuickAnswer>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            According to Stellar MLS active, pending, and closed sales data for zip codes 33785, 33708, and 33786, checked October 2026.
          </p>
          <p className="font-body text-muted text-sm mt-3 leading-relaxed">
            Keep reading:
              <Link href="/gulf-front-condos-sirs-milestone-complete/" className="text-link hover:underline">
                which buildings have the SIRS and milestone done
              </Link>,{" "}
              <Link href="/beach-condo-renovation-math/" className="text-link hover:underline">
                the dated versus updated renovation math
              </Link>, and{" "}
              <Link href="/florida-condo-rules-buyers-2026/" className="text-link hover:underline">
                the 2026 condo rules that slow these deals down
              </Link>.
          </p>
        </div>
      </section>

      {/* === Snapshot grid === */}
      <section className="container-wide pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {snapshot.map((item) => (
            <div key={item.label} className="border border-border p-6">
              <p className="font-heading text-primary text-2xl mb-1">
                {item.figure}
              </p>
              <p className="font-body text-primary font-medium text-sm mb-2">
                {item.label}
              </p>
              <p className="font-body text-muted text-xs leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* === What the numbers say === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Is Happening in the Gulf-Front Condo Market?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Inventory is workable rather than scarce. About 73 active or
              pending condos at 2 bedrooms and up under $900,000 spread across
              seven beach towns is enough to compare buildings side by side
              instead of taking whatever comes up.
            </p>
            <p>
              Pricing is the part buyers misread. Most 2 bed, 2 bath Gulf-front
              closings over the last 24 months landed between $520 and $690 per
              square foot. That is a $170 spread on the same bedroom count, and
              it is driven by condition, floor, view, and the health of the
              association. A list price inside that range is not automatically
              fair, and a list price above it is not automatically high.
            </p>
            <p>
              Days on market is where your leverage comes from. Plenty of the
              current listings have been sitting 150 to 500 days, and reductions
              along the way are common. A seller 300 days in has a different
              tolerance for your offer than a seller 30 days in.
            </p>
            <p>
              Two cost items do not show up in the price. Some buildings carry
              storm-related special assessments, and some monthly fees do not
              include building insurance. Check both before you compare one
              building to another, because either one can swing your real
              monthly number by hundreds of dollars.
            </p>
          </div>
        </div>
      </section>

      {/* === Building profile === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Does a Real Building Look Like Up Close?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            Reflections on the Gulf in Indian Rocks Beach is a useful example
            because it has both reports done and enough recent sales to read a
            trend inside one building.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[480px]">
              <tbody>
                {reflectionsFacts.map((fact) => (
                  <tr key={fact.label} className="border-b border-border">
                    <td className="font-body text-primary font-medium py-4 pr-6 text-sm align-top whitespace-nowrap">
                      {fact.label}
                    </td>
                    <td className="font-body text-muted py-4 text-sm">
                      {fact.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="font-body text-muted space-y-4 leading-relaxed mt-6">
            <p>
              The trend inside that one building tells the story of the whole
              stretch of beach. The 24-month average is about $635 per square
              foot. The most recent sale was about $569 per square foot in July
              2026, down from about $686 per square foot in January 2025. Same
              building, same beach, softer number.
            </p>
            <p>
              That is why a building-level report beats a market-level average.
              You are not buying the Pinellas beaches. You are buying one
              association, one budget, and one stack of closed sales.{" "}
              <Link href="/gulf-front-condos-sirs-milestone-complete/" className="text-link hover:underline">
                See which buildings have the SIRS and milestone done
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* === How to use the leverage === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            How Do Buyers Use This Leverage?
          </h2>
          <ul className="space-y-4">
            {[
              "Shortlist by building health first, then by unit. A great unit in a building with unanswered structural questions is a financing problem waiting to happen.",
              "Pull closed sales inside the building, not just the zip code. The per-foot spread between buildings is wider than the spread between beach towns.",
              "Use days on market in the offer. A listing 300 days in with two reductions behind it is a different conversation than a fresh listing.",
              "Price the real monthly cost: fee, whether insurance is inside the fee, any current assessment, taxes at your purchase price, and flood and wind coverage.",
              "Ask the dated versus updated question on purpose. Buying dated and renovating can land at or below the price of an updated unit, with finishes you picked.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  &#10003;
                </span>
                <span className="font-body text-muted text-sm leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-body text-muted text-sm mt-6 leading-relaxed">
            Running the dated versus updated comparison?{" "}
            <Link href="/beach-condo-renovation-math/" className="text-link hover:underline">
              The renovation math page
            </Link>{" "}
            breaks down the estimated costs line by line.
          </p>
        </div>
      </section>

      {/* === Mid-page CTA === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-white text-2xl mb-4">
            Get the Building-by-Building Report
          </h2>
          <p className="font-body text-white/70 mb-6">
            A free report covering the Gulf-front buildings from Belleair Beach
            to Madeira Beach: SIRS and milestone status, fee ranges, insurance
            notes, rental minimums, and closed sales per building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call or Text (813) 733-7907
            </a>
            <Link href="/contact/" className="btn-secondary inline-block">
              Request the Report
            </Link>
          </div>
        </div>
      </section>

      <BeachCondoInventory
        title="The 73 Listings Behind This Report"
        subtitle="Active condo inventory in zips 33785, 33708, and 33786, the same ZIPs the numbers above are drawn from."
      />

      <FaqSection
        heading="Pinellas Beach Condo Market Questions"
        faqs={faqs}
      />

      <SourcesSection sources={sources} />

      <BeachCondoFooterBlock
        currentSlug={SLUG}
        ctaHeadline="Get the Building-by-Building Report"
        ctaCopy="Tell Barrett which beach towns you are shopping and he will send the building-level report with SIRS and milestone status, fees, and closed sales."
        submitLabel="Request the Report"
        sources="Stellar MLS active, pending, and closed data for zips 33785, 33708, and 33786, plus the Florida DBPR SIRS reporting database and listing disclosures, checked October 2026."
      />
    </>
  );
}
