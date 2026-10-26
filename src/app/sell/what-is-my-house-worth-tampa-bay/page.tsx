// =============================================================================
// /sell/what-is-my-house-worth-tampa-bay
//
// WHAT THIS PAGE IS: the home-value page for Tampa Bay sellers. The query
// "what is my home worth" is owned by national AVM sites and cash buyers
// because nowtb.com had no page for it at all.
//
// THE STRATEGY: do not out-write the AVMs, out-DATA them. Every median and
// days-on-market figure below is read at render time from
// src/data/city-market-stats.ts, which holds fully paginated Stellar MLS
// closed-sale counts, not samples. That is a real proprietary data cut and it
// is the kind of thing answer engines quote verbatim.
//
// IMPORTANT: the figures are NOT hardcoded here. They come from the data file,
// so when that file is refreshed this page updates with it. Do not paste
// numbers into the prose, read them from CITY_ROWS below.
//
// ROUTING NOTE: nested under /sell/, which is already excluded in BOTH :city
// flatten redirect lookaheads in next.config.mjs. Do not add a top-level route.
//
// If it breaks, check:
//  - A city shows blank or the page throws? getCityMarketStats() returned
//    undefined for a slug in CITY_SLUGS. Either the slug is misspelled or that
//    community fell below the 20-sale publishing floor. Remove it from the list.
//  - A median looks stale? AS_OF in the data file tells you the window. Refresh
//    the data file, not this page.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import ContactForm from "@/components/ui/ContactForm";
import SourcesSection, { type Source } from "@/components/ui/SourcesSection";
import { getCityMarketStats } from "@/data/city-market-stats";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
} from "@/lib/schema";

const SLUG = "sell/what-is-my-house-worth-tampa-bay";
const CANONICAL = `https://nowtb.com/${SLUG}/`;

// 43 characters. layout.tsx appends " | Barrett Henry" (16), so the rendered
// title is 59, inside the ~60 character SERP limit.
const TITLE = "What Is My House Worth? Tampa Bay 2026 Data";
const DESCRIPTION =
  "Median closed-sale prices and days on market for 13 Tampa Bay cities, why a Zestimate misses, and how to get a real number on your house.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Barrett Henry` },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    // Verified present at public/og-image.png.
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// =============================================================================
// The city table. Slugs are looked up against the verified stats file, so if a
// row is missing here it is because the data file does not publish it.
// =============================================================================
const CITY_SLUGS: { slug: string; name: string }[] = [
  { slug: "tampa", name: "Tampa" },
  { slug: "st-petersburg", name: "St. Petersburg" },
  { slug: "brandon", name: "Brandon" },
  { slug: "riverview", name: "Riverview" },
  { slug: "valrico", name: "Valrico" },
  { slug: "lithia", name: "Lithia" },
  { slug: "plant-city", name: "Plant City" },
  { slug: "seffner", name: "Seffner" },
  { slug: "apollo-beach", name: "Apollo Beach" },
  { slug: "ruskin", name: "Ruskin" },
  { slug: "sun-city-center", name: "Sun City Center" },
  { slug: "clearwater", name: "Clearwater" },
  { slug: "wesley-chapel", name: "Wesley Chapel" },
];

/** Rows that actually have a published single-family median. Anything the data
 *  file declines to publish is silently dropped rather than shown as a zero. */
const CITY_ROWS = CITY_SLUGS.map((c) => ({
  ...c,
  stats: getCityMarketStats(c.slug),
})).filter((r) => r.stats && r.stats.sfMedian !== null);

/** Whole-dollar currency, e.g. $427,000 */
function usd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

// Pulled out so the prose and the table can never drift apart.
const TAMPA = getCityMarketStats("tampa");
const VALRICO = getCityMarketStats("valrico");
const BRANDON = getCityMarketStats("brandon");
const LITHIA = getCityMarketStats("lithia");

/** Total closed sales represented by the table, a credibility number. */
const TOTAL_SALES = CITY_ROWS.reduce(
  (sum, r) => sum + (r.stats?.totalSales ?? 0),
  0
);

/** The spread between the cheapest and priciest single-family median in the
 *  table, computed rather than remembered. */
const SF_MEDIANS = CITY_ROWS.map((r) => r.stats!.sfMedian as number);
const SF_LOW = Math.min(...SF_MEDIANS);
const SF_HIGH = Math.max(...SF_MEDIANS);

// --- What actually moves a specific home's value, in order of impact ---
const valueDrivers = [
  {
    driver: "Location down to the street, not the city",
    detail:
      "Two Valrico addresses a mile apart can sit in different school zones, different flood zones and different HOA or CDD structures. A city median is an average of all of them, which means it describes none of them.",
  },
  {
    driver: "Living area and how it is laid out",
    detail:
      "Price per square foot is the crudest useful tool there is, and buyers do not actually pay by the foot. A 2,400 square foot plan with four real bedrooms and a three-way split appraises differently than 2,400 feet with a bonus room counted generously.",
  },
  {
    driver: "Condition against what else is on the market right now",
    detail:
      "Your home is not being compared to its former self. It is being compared to the renovated one the buyer toured an hour earlier. Original kitchens and 20-year-old roofs get priced, and in Florida the roof age gets priced twice because it drives the buyer's insurance quote.",
  },
  {
    driver: "Insurability",
    detail:
      "Roof age, a past claim, a prior sinkhole or water loss, polybutylene plumbing, and a four-point inspection outcome all affect what a buyer can get covered and at what premium. In this market that is a value input, not a footnote.",
  },
  {
    driver: "What has actually closed in the last 60 to 90 days",
    detail:
      "Not what is listed, not what is pending, and not what your neighbor turned down. Appraisers work from closed sales, and so does any pricing opinion worth acting on.",
  },
];

const faqs: Faq[] = [
  {
    question: "What is my house worth in Tampa Bay?",
    answer: `Across ${CITY_ROWS.length} Tampa Bay cities, single-family closed-sale medians for the twelve months ending October 2026 ran from ${usd(
      SF_LOW
    )} to ${usd(
      SF_HIGH
    )}, ${usd(TAMPA?.sfMedian ?? 0)} in Tampa, ${usd(
      BRANDON?.sfMedian ?? 0
    )} in Brandon, ${usd(VALRICO?.sfMedian ?? 0)} in Valrico and ${usd(
      LITHIA?.sfMedian ?? 0
    )} in Lithia, from ${TOTAL_SALES.toLocaleString(
      "en-US"
    )} Stellar MLS closed sales. A median tells you the market, not your house. Your number comes from closed comparable sales on your street in the last 60 to 90 days, adjusted for your condition, your lot and your roof age.`,
  },
  {
    question: "How accurate is a Zestimate or an online home value estimate?",
    answer:
      "Automated valuation models are far more accurate on homes that are actively listed, because the asking price is an input, than on off-market homes where the model is guessing. Zillow publishes a median error rate for the Zestimate and the off-market figure has run in the range of roughly 7 percent, check Zillow's own Zestimate page for the current number, since it moves. On a $420,000 house a 7 percent miss is around $29,000 in either direction, and because that figure is a median, half of all homes are off by more than it. AVMs cannot see your renovation, your roof age, your view, your flood zone or the fact that the comparable sale three doors down was a family transfer.",
  },
  {
    question: "What is the difference between a CMA and an appraisal?",
    answer:
      "A comparative market analysis is a licensed agent's pricing opinion built from recent closed comparable sales, current competing inventory and local absorption. It is free, it is fast, and it is forward-looking because it accounts for what you are competing against today. An appraisal is an independent licensed appraiser's opinion of value, ordered and paid for by a lender, built almost entirely from closed sales. Lenders lend against the appraisal, so a CMA that ignores what will appraise is not doing you a favor.",
  },
  {
    question: "Why is my neighbor's sale price not my price?",
    answer:
      "Because a sale price is the end of a negotiation, not a measurement. You cannot see from the outside whether that number included a seller-paid rate buydown, a repair credit, new appliances, a leaseback, or a buyer paying over market because they needed that school zone. Closed price alone is one data point. What it took to get there is the rest of the story, and that part is in the MLS record and in the agent-to-agent conversation, not on the public portals.",
  },
  {
    question: "Does a home valuation obligate me to list?",
    answer:
      "No. A pricing opinion is information, and plenty of the ones I run end with me telling someone that waiting, renting or fixing one specific thing first is the better move. If the number says do not sell right now, that is the number I will give you. You are not signing anything to find out.",
  },
];

const sources: Source[] = [
  {
    name: "Stellar MLS closed sales via the Bridge API, twelve months ending October 2026",
    used: `Every median price, closed-sale count and days-on-market figure in the city table. Fully paginated complete datasets rather than samples, with lease records excluded. Covers ${TOTAL_SALES.toLocaleString(
      "en-US"
    )} closed sales across ${CITY_ROWS.length} cities.`,
  },
  {
    name: "Zillow, Zestimate accuracy disclosures",
    used: "The on-market versus off-market median error rate comparison. Quoted as an approximate range rather than a fixed figure because Zillow revises the published number; verify on Zillow's Zestimate page before relying on it.",
    href: "https://www.zillow.com/z/zestimate/",
  },
  {
    name: "National Association of REALTORS, 2025 Profile of Home Buyers and Sellers",
    used: "The finding that 91 percent of sellers used an agent and that for-sale-by-owner transactions fell to 5 percent of sales, an all-time low.",
    href: "https://www.nar.realtor/news/real-estate-news/fsbos-reach-all-time-low-more-sellers-rely-on-agents",
  },
];

export default function WhatIsMyHouseWorthPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com" },
          { name: "Sell", url: "https://nowtb.com/sell-your-home/" },
          { name: "What Is My House Worth in Tampa Bay?", url: CANONICAL },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={webPageSchema({
          name: TITLE,
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: "2026-10-18",
          dateModified: "2026-10-18",
          about: "Residential home values and pricing in the Tampa Bay market",
        })}
      />

      <HeroSection
        label="Tampa Bay Home Values"
        title="What Is My House Worth in Tampa Bay?"
        subtitle={`${TOTAL_SALES.toLocaleString(
          "en-US"
        )} Stellar MLS closed sales across ${
          CITY_ROWS.length
        } cities, and what the median does not tell you about your address.`}
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+18137337907"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold px-7 py-3 rounded-lg text-sm hover:bg-light transition-colors"
          >
            Call or Text (813) 733-7907
          </a>
          <Link
            href="#price-my-house"
            className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-7 py-3 rounded-lg text-sm hover:bg-white hover:text-primary transition-colors"
          >
            Price My House
          </Link>
        </div>
      </HeroSection>

      {/* === Direct answer, number in the first sentence === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              Single-family closed-sale medians across {CITY_ROWS.length} Tampa
              Bay cities ran from <strong>{usd(SF_LOW)} to {usd(SF_HIGH)}</strong>{" "}
              over the twelve months ending October 2026, {" "}
              {usd(TAMPA?.sfMedian ?? 0)} in Tampa, {usd(BRANDON?.sfMedian ?? 0)}{" "}
              in Brandon, {usd(VALRICO?.sfMedian ?? 0)} in Valrico and{" "}
              {usd(LITHIA?.sfMedian ?? 0)} in Lithia, drawn from{" "}
              {TOTAL_SALES.toLocaleString("en-US")} Stellar MLS closed sales.
            </p>
            <p>
              That is the market, not your house. Your number comes from closed
              comparable sales on your street in the last 60 to 90 days,
              adjusted for condition, lot, roof age and insurability. A median
              is where the conversation starts.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === The city data table === */}
      <section className="container-wide pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What is the median home value in each Tampa Bay city?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            These are closed sales, not asking prices, over the twelve months
            ending October 2026, pulled from Stellar MLS through the Bridge API.
            Every row is a complete dataset for that city rather than a sample,
            and lease records are excluded. The days column is the median days on
            market for the single-family sales in that city, which is the single
            most useful column here because it tells you how much pricing
            tolerance the market is giving sellers.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    City
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Closed sales
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Single-family median
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Median days on market
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    All property types
                  </th>
                </tr>
              </thead>
              <tbody>
                {CITY_ROWS.map((r) => (
                  <tr key={r.slug} className="border-b border-border">
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm whitespace-nowrap">
                      {r.name}
                    </td>
                    <td className="font-body text-muted py-3 pr-4 text-sm whitespace-nowrap">
                      {r.stats!.totalSales.toLocaleString("en-US")}
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                      {usd(r.stats!.sfMedian as number)}
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                      {r.stats!.sfDom !== null ? `${r.stats!.sfDom} days` : ", "}
                    </td>
                    <td className="font-body text-muted py-3 text-sm whitespace-nowrap">
                      {r.stats!.allMedian !== null
                        ? usd(r.stats!.allMedian)
                        : ", "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            The &ldquo;all property types&rdquo; column is usually lower than the
            single-family column, and that gap is not a discount, it is
            townhomes and condominiums pulling the number down. If you own a
            single-family home, the middle column is your market and the right
            column is a mix you are not competing in.
          </p>
        </div>
      </section>

      {/* === AVM accuracy comparison table === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            How accurate is a Zestimate on my house?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Honest answer: more accurate than people think on listed homes, less
            accurate than people think on off-market homes, and structurally
            blind to the five things that most affect a Tampa Bay sale. An
            automated valuation model is a statistical estimate built from public
            records and prior sales. It has never been inside your house.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Method
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Who produces it
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Cost to you
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Sees inside the home?
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    Best used for
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border align-top">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Online estimate (AVM)
                  </td>
                  <td className="font-body text-muted py-3 pr-4 text-sm">
                    An algorithm, from public records
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">Free</td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">No</td>
                  <td className="font-body text-muted py-3 text-sm">
                    A rough bracket, and tracking a trend over time
                  </td>
                </tr>
                <tr className="border-b border-border align-top">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Comparative market analysis
                  </td>
                  <td className="font-body text-muted py-3 pr-4 text-sm">
                    A licensed agent, from MLS closed sales
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">Free</td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">
                    Yes, if the agent walks it
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    Setting a list price and a net sheet
                  </td>
                </tr>
                <tr className="border-b border-border align-top">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Lender appraisal
                  </td>
                  <td className="font-body text-muted py-3 pr-4 text-sm">
                    A state-licensed appraiser, ordered by the lender
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">
                    Typically paid by the buyer
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">Yes</td>
                  <td className="font-body text-muted py-3 text-sm">
                    What the loan will actually be written against
                  </td>
                </tr>
                <tr className="border-b border-border align-top">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Cash-buyer offer
                  </td>
                  <td className="font-body text-muted py-3 pr-4 text-sm">
                    An investor pricing their own risk and resale
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">Free</td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">
                    Usually a walkthrough
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    A speed-and-certainty floor, not a market value
                  </td>
                </tr>
                <tr className="border-b border-border align-top">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Property Appraiser assessed value
                  </td>
                  <td className="font-body text-muted py-3 pr-4 text-sm">
                    The county, for tax purposes
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">Free</td>
                  <td className="font-body text-dark py-3 pr-4 text-sm">No</td>
                  <td className="font-body text-muted py-3 text-sm">
                    Nothing related to market value, it is a tax figure
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            The last row is the one that costs people money. A Save Our Homes
            capped assessed value on a long-held Florida homestead can be far
            below market, and sellers anchor to it. It is a tax number. It is not
            what a buyer will pay.
          </p>
        </div>
      </section>

      {/* === What actually drives value === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What actually sets the value of a specific house?
          </h2>
          <p className="font-body text-muted mb-10 leading-relaxed">
            In the order they move the number, for a Tampa Bay single-family
            home in 2026.
          </p>
          <div className="space-y-6">
            {valueDrivers.map((d, i) => (
              <div key={d.driver} className="border border-border p-6">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-heading font-bold text-accent text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="heading-section text-lg text-primary">
                    {d.driver}
                  </h3>
                </div>
                <p className="font-body text-dark leading-relaxed">{d.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === How to get a real number === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            How do I get a real number on my house?
          </h2>
          <p className="font-body text-dark mb-4 leading-relaxed">
            Start with the free automated estimate so you have a bracket, then
            get a pricing opinion from somebody who will walk the house. I will
            bring closed comparable sales from the last 60 to 90 days in your
            immediate area, including the homes that beat yours, because those
            are the ones that tell you the truth, plus what is actively
            competing with you right now and how long it is taking to go under
            contract.
          </p>
          <p className="font-body text-dark mb-4 leading-relaxed">
            Then the part most valuations skip: the net. A price is not a number
            until you subtract what it costs to get there, which is why I pair
            every pricing opinion with a line-by-line{" "}
            <Link
              href="/sell/how-much-does-it-cost-to-sell-a-house-in-hillsborough-county/"
              className="text-link hover:underline"
            >
              Hillsborough County cost-to-sell breakdown
            </Link>{" "}
            and a realistic{" "}
            <Link
              href="/sell/how-long-does-it-take-to-sell-a-house-tampa-bay/"
              className="text-link hover:underline"
            >
              timeline for how long the sale will take
            </Link>
            .
          </p>
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8 mt-8">
            <h3 className="heading-section text-base text-primary mb-2">
              Useful background before you price
            </h3>
            <p className="font-body text-muted text-sm leading-relaxed">
              If your sale will involve financing, the{" "}
              <Link
                href="/blog/home-appraisal-florida-guide/"
                className="text-link hover:underline"
              >
                Florida home appraisal guide
              </Link>{" "}
              explains what the appraiser is actually measuring. For
              neighborhood-level context, see the market pages for{" "}
              <Link href="/valrico/" className="text-link hover:underline">
                Valrico
              </Link>{" "}
              and{" "}
              <Link href="/riverview/" className="text-link hover:underline">
                Riverview
              </Link>
              , or how I price and position a listing in{" "}
              <Link
                href="/valrico-listing-agent/"
                className="text-link hover:underline"
              >
                Valrico
              </Link>{" "}
              and{" "}
              <Link
                href="/brandon-listing-agent/"
                className="text-link hover:underline"
              >
                Brandon
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* === Lead form === */}
      <section id="price-my-house" className="container-wide py-16">
        <div className="max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="/sell/what-is-my-house-worth-tampa-bay/"
            type="valuation"
            title="What is your address worth?"
            submitLabel="Run My Numbers"
          />
          <p className="font-body text-muted text-sm text-center mt-6 leading-relaxed">
            Send the address and I will come back with closed comparable sales,
            a price range and a net sheet. No obligation, and if the answer is
            &ldquo;do not sell yet,&rdquo; that is the answer you will get. Call
            or text{" "}
            <a
              href="tel:+18137337907"
              className="text-link hover:underline font-semibold"
            >
              (813) 733-7907
            </a>
            . Barrett Henry, Licensed Florida Real Estate Broker, REMAX Collective, license
            BK3313308, with 23+ years of real estate experience. You can also use
            the{" "}
            <Link href="/free-home-valuation/" className="text-link hover:underline">
              free home valuation
            </Link>{" "}
            tool.
          </p>
          {/* Required disclaimer: this page discusses value and cost figures. */}
          <p className="font-body text-muted text-xs text-center mt-6 leading-relaxed">
            General market information, not an appraisal and not legal, tax or
            accounting advice. Median figures describe closed sales over a past
            window and are not a valuation of any individual property. Consult a
            licensed appraiser, your attorney and your CPA before relying on any
            number here.
          </p>
        </div>
      </section>

      <FaqSection heading="Tampa Bay home value questions" faqs={faqs} />

      <SourcesSection sources={sources} />
    </>
  );
}
