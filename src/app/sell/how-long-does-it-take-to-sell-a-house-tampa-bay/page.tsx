// =============================================================================
// /sell/how-long-does-it-take-to-sell-a-house-tampa-bay
//
// WHAT THIS PAGE IS: the timeline page. It pairs with
// /sell/sell-my-house-fast-tampa-bay/ but does a deliberately DIFFERENT job, so
// the two do not cannibalise each other:
//   - "sell my house fast"  = the cash-offer-versus-listing DECISION.
//   - this page             = the full stage-by-stage CALENDAR, pre-list
//                             through funding, plus the complete city table.
// Keep that split. If you add the cash-versus-listing comparison here you have
// made two pages competing for each other's query.
//
// DATA RULE: every day count and median below is read at render time from
// src/data/city-market-stats.ts, which holds fully paginated Stellar MLS
// closed-sale data. Nothing in the tables is typed by hand. The soft stage
// ranges in TIMELINE are explicitly labelled as ranges, not as measurements,
// because no dataset here supports a precise figure for them.
//
// ROUTING NOTE: nested under /sell/, already excluded in BOTH :city flatten
// redirect lookaheads in next.config.mjs. Do not create a top-level route.
//
// If it breaks, check:
//  - 404 live but 200 locally? The "sell" exclusion fell out of next.config.mjs.
//  - A city row disappeared? getCityMarketStats() returned undefined or a null
//    sfMedian for that slug and the filter dropped it on purpose. That is the
//    data file declining to publish a figure it cannot stand behind.
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

const SLUG = "sell/how-long-does-it-take-to-sell-a-house-tampa-bay";
const CANONICAL = `https://nowtb.com/${SLUG}/`;

// 43 characters + the 16-char " | Barrett Henry" suffix = 59 rendered.
const TITLE = "How Long to Sell a House in Tampa Bay? 2026";
const DESCRIPTION =
  "Median days on market for 13 Tampa Bay cities plus a stage-by-stage selling calendar, from make-ready through the closing table and funding.";

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
// City rows, sorted fastest to slowest by median single-family days on market.
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

const CITY_ROWS = CITY_SLUGS.map((c) => ({ ...c, stats: getCityMarketStats(c.slug) }))
  .filter((r) => r.stats && r.stats.sfDom !== null && r.stats.sfMedian !== null)
  .sort((a, b) => (a.stats!.sfDom as number) - (b.stats!.sfDom as number));

const DOM_VALUES = CITY_ROWS.map((r) => r.stats!.sfDom as number);
const DOM_FAST = Math.min(...DOM_VALUES);
const DOM_SLOW = Math.max(...DOM_VALUES);
const FASTEST_CITY = CITY_ROWS[0];
const SLOWEST_CITY = CITY_ROWS[CITY_ROWS.length - 1];

/** Simple median of the per-city medians. This is a median OF MEDIANS and the
 * prose says so, it is not the median days on market for the whole region,
 *  which would need every sale weighted individually. Being precise about what
 *  a statistic is is the whole reason anyone should trust the rest of them. */
function medianOf(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}
const DOM_MEDIAN_OF_MEDIANS = medianOf(DOM_VALUES);

const TOTAL_SALES = CITY_ROWS.reduce((sum, r) => sum + (r.stats?.totalSales ?? 0), 0);

/** Whole-dollar currency, e.g. $427,000 */
function usd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

// =============================================================================
// The stage-by-stage calendar.
//
// HONESTY NOTE: the only hard, sourced numbers in this table are the
// days-on-market figures, which come from the MLS data file, and the statutory
// HOA estoppel deadline, which is 10 business days under Fla. Stat.
// 720.30851. Everything else is written as a RANGE and described as typical,
// because no dataset I can verify supports a precise figure for how long a
// photographer takes to deliver or how long an underwriter sits on a file.
// Do not tighten these into single numbers.
// =============================================================================
const TIMELINE = [
  {
    stage: "1. Pricing and make-ready decisions",
    typical: "3 to 14 days",
    who: "You, with your agent",
    shorten:
      "Have the pricing conversation before you need to move, not after. The comparable-sales work takes a day; deciding what to fix is what takes two weeks.",
  },
  {
    stage: "2. Repairs, paint, deep clean, decluttering",
    typical: "0 to 30 days, entirely dependent on scope",
    who: "You and your contractors",
    shorten:
      "Limit it to the two or three items that are actively costing you buyers, each with a quote attached. A full renovation almost never returns the time it costs.",
  },
  {
    stage: "3. Photography, floor plan, MLS entry",
    typical: "3 to 7 days from booking to live",
    who: "Your agent",
    shorten:
      "Book the photographer the same day you sign the listing agreement, not after the painting is finished. Shoot and launch mid-week so your first weekend is a full one.",
  },
  {
    stage: "4. Active on the market until a signed contract",
    typical: `Median ${DOM_FAST} to ${DOM_SLOW} days by city, see the table below`,
    who: "The market, and your list price",
    shorten:
      "Price at the closed comparable sales. This is the only stage where a single decision can cut weeks, and it is the stage where most of the time is lost.",
  },
  {
    stage: "5. Inspection period",
    typical: "Commonly 7 to 15 days, set in your contract",
    who: "The buyer, within the window you negotiated",
    shorten:
      "Negotiate a shorter window up front, and have a pre-listing inspection in hand so there are no surprises to renegotiate.",
  },
  {
    stage: "6. Appraisal and loan underwriting",
    typical: "The bulk of a financed closing timeline",
    who: "The buyer's lender",
    shorten:
      "Accept offers from buyers who are fully underwritten rather than merely pre-qualified, and ask which lender. A local lender who answers the phone is worth real days.",
  },
  {
    stage: "7. HOA or condo estoppel certificate",
    typical: "Up to 10 business days by statute",
    who: "Your association or its management company",
    shorten:
      "Order it the day you go under contract. Fla. Stat. 720.30851 gives the association 10 business days, and an expedited request costs extra. This is the single most common late-stage delay in a Florida HOA community.",
  },
  {
    stage: "8. Title work, payoffs, closing and funding",
    typical: "Runs in parallel with underwriting; funding is same-day or next",
    who: "Your closing agent",
    shorten:
      "Get your mortgage payoff and any lien questions to the title company immediately. Old open permits and unreleased liens are what actually delay a Florida closing table.",
  },
];

// --- Why a listing sits longer than its city median ---
const whyItSits = [
  {
    reason: "The price was ahead of the closed comparable sales",
    detail:
      "The cause in most listings that go long. Your largest audience arrives in the first ten to fourteen days, and a price that is modestly high spends that window being skipped by the exact buyers you needed.",
  },
  {
    reason: "You are competing with new construction in your price band",
    detail:
      "In the newer south and east Hillsborough corridors a builder two miles away can offer a rate buydown and closing cost credits that a resale seller cannot match. That shows up directly in days on market.",
  },
  {
    reason: "Roof age or insurance questions went unanswered",
    detail:
      "In Florida a buyer's insurance quote can kill a deal after the inspection period. A roof nearing end of life with no documentation becomes a price negotiation at the worst possible moment.",
  },
  {
    reason: "Showing access was restricted",
    detail:
      "Tight windows, 24-hour notice, or a tenant who has to approve each visit. Friction removes buyers, and it removes the busiest buyer agents first.",
  },
  {
    reason: "The property type is thinner than the city median suggests",
    detail:
      "A city median built mostly from single-family sales says very little about a townhome or a condominium in the same ZIP, and those often carry substantially different days on market.",
  },
];

const faqs: Faq[] = [
  {
    question: "How long does it take to sell a house in Tampa Bay?",
    answer: `Over the twelve months ending October 2026, median single-family days on market ran from ${DOM_FAST} days in ${
      FASTEST_CITY?.name
    } to ${DOM_SLOW} days in ${
      SLOWEST_CITY?.name
    } across ${CITY_ROWS.length} Tampa Bay cities, from ${TOTAL_SALES.toLocaleString(
      "en-US"
    )} Stellar MLS closed sales. The midpoint of those city medians is about ${DOM_MEDIAN_OF_MEDIANS} days. That measures active listing to signed contract only. Add roughly one to six weeks of preparation before you go live, and then the contract-to-closing period, which on a financed sale is driven almost entirely by the buyer's lender.`,
  },
  {
    question: "Is days on market the same as how long selling takes?",
    answer:
      "No, and the gap surprises people. Days on market counts from the day your listing goes active in the MLS to the day it goes under contract. It does not include the pricing conversation, the make-ready work, the photography, or any of the time between a signed contract and the money hitting your account. A house with 20 days on market can easily represent a three-month project start to finish. Plan the whole calendar backwards from the date you actually need to be out.",
  },
  {
    question: "How long does it take to close after I accept an offer?",
    answer:
      "On a cash purchase, as fast as the title work allows, frequently one to three weeks, because there is no lender and no appraisal. On a financed purchase the length is set by the buyer's lender, and the closing date written into the contract is a target rather than a guarantee. Ask who the lender is and whether the buyer is fully underwritten rather than just pre-qualified, because that single question predicts more about your closing date than the contract line does.",
  },
  {
    question: "What is the most common last-minute delay in a Florida sale?",
    answer:
      "Two of them, and both are avoidable. The first is the HOA or condominium estoppel certificate: Florida Statute 720.30851 gives an association 10 business days to produce it, and if nobody orders it until week three, it lands after everything else is ready. Order it the day you go under contract. The second is an unreleased lien or an open permit from work done years ago, which surfaces in the title search and takes time to clear with the municipality.",
  },
  {
    question: "What is the fastest way to shorten my timeline?",
    answer:
      "Price at the closed comparable sales rather than above them. It is the only decision that can remove weeks by itself, and it is the stage where almost all lost time accumulates. After that, in order: book photography the day you sign the listing agreement, give unrestricted lockbox access, negotiate a shorter inspection window up front, and prefer offers from buyers who are fully underwritten. None of those is dramatic. Together they routinely beat a city median.",
  },
];

const sources: Source[] = [
  {
    name: "Stellar MLS closed sales via the Bridge API, twelve months ending October 2026",
    used: `Every median days-on-market figure, median price and closed-sale count in the city table. Fully paginated complete datasets rather than samples, with lease records excluded. Covers ${TOTAL_SALES.toLocaleString(
      "en-US"
    )} closed sales across ${CITY_ROWS.length} cities.`,
  },
  {
    name: "Florida Statute 720.30851, HOA Estoppel Certificates",
    used: "The 10-business-day deadline for an association to deliver an estoppel certificate, and the fact that expedited delivery within three business days carries an additional capped fee.",
    href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799%2F0720%2FSections%2F0720.30851.html",
  },
  {
    name: "Florida Realtors / Florida Bar AS IS Residential Contract for Sale and Purchase",
    used: "That the inspection period length and the closing date are contract terms negotiated between the parties rather than fixed by law, and that the tax proration can be readjusted after closing under Standard K.",
  },
];

export default function HowLongToSellTampaBayPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com" },
          { name: "Sell", url: "https://nowtb.com/sell-your-home/" },
          {
            name: "How Long Does It Take to Sell a House in Tampa Bay?",
            url: CANONICAL,
          },
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
          about:
            "How long it takes to sell a residential property in the Tampa Bay market",
        })}
      />

      <HeroSection
        label="Tampa Bay Selling Timeline"
        title="How Long Does It Take to Sell a House in Tampa Bay?"
        subtitle={`Median ${DOM_FAST} to ${DOM_SLOW} days on market by city, plus every stage of the calendar from make-ready to funding.`}
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+18137337907"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold px-7 py-3 rounded-lg text-sm hover:bg-light transition-colors"
          >
            Call or Text (813) 733-7907
          </a>
          <Link
            href="#my-timeline"
            className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-7 py-3 rounded-lg text-sm hover:bg-white hover:text-primary transition-colors"
          >
            Build My Timeline
          </Link>
        </div>
      </HeroSection>

      {/* === Direct answer === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              Median single-family days on market ran from{" "}
              <strong>
                {DOM_FAST} days in {FASTEST_CITY?.name} to {DOM_SLOW} days in{" "}
                {SLOWEST_CITY?.name}
              </strong>{" "}
              across {CITY_ROWS.length} Tampa Bay cities over the twelve months
              ending October 2026, from{" "}
              {TOTAL_SALES.toLocaleString("en-US")} Stellar MLS closed sales.
              The midpoint of those city medians is about{" "}
              {DOM_MEDIAN_OF_MEDIANS} days.
            </p>
            <p>
              That figure measures active listing to signed contract only. The
              full project is longer: roughly one to six weeks of pricing,
              make-ready and photography before you go live, then the
              contract-to-closing period, which on a financed sale is set almost
              entirely by the buyer&apos;s lender. Plan backwards from the date
              you need to be out, not forwards from today.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === Stage by stage === */}
      <section className="container-wide pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What does each stage of selling actually take?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Eight stages. The stage-4 figures come from Stellar MLS closed
            sales and the stage-7 deadline is set by statute. The rest are
            typical ranges from how Tampa Bay transactions actually run, written
            as ranges on purpose, because precise averages for them would be
            invented.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Typical length
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Who controls it
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    How to shorten it
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIMELINE.map((t) => (
                  <tr key={t.stage} className="border-b border-border align-top">
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                      {t.stage}
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm">
                      {t.typical}
                    </td>
                    <td className="font-body text-muted py-3 pr-4 text-sm">
                      {t.who}
                    </td>
                    <td className="font-body text-muted py-3 text-sm">
                      {t.shorten}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === City table === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            Which Tampa Bay cities sell fastest?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Sorted fastest to slowest by median single-family days on market,
            twelve months ending October 2026, Stellar MLS closed sales. Read
            the price column alongside it: the slower cities on this list are
            generally the ones where new construction competes hardest with
            resale inventory, not the ones buyers want least.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    City
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Median days on market
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Single-family median price
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    Closed sales in the window
                  </th>
                </tr>
              </thead>
              <tbody>
                {CITY_ROWS.map((r) => (
                  <tr key={r.slug} className="border-b border-border">
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm whitespace-nowrap">
                      {r.name}
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                      {r.stats!.sfDom} days
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                      {usd(r.stats!.sfMedian as number)}
                    </td>
                    <td className="font-body text-muted py-3 text-sm whitespace-nowrap">
                      {r.stats!.totalSales.toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            One caveat worth stating plainly: a median is the middle of a
            distribution, so half of the homes in every row took longer than the
            number shown. Treat your city&apos;s figure as a planning anchor, not
            a promise. City-level context for{" "}
            <Link href="/valrico/" className="text-link hover:underline">
              Valrico
            </Link>
            ,{" "}
            <Link href="/lithia/" className="text-link hover:underline">
              Lithia
            </Link>{" "}
            and{" "}
            <Link href="/plant-city/" className="text-link hover:underline">
              Plant City
            </Link>{" "}
            is on their market pages.
          </p>
        </div>
      </section>

      {/* === Why listings sit === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            Why would my house take longer than the city median?
          </h2>
          <p className="font-body text-muted mb-10 leading-relaxed">
            Five reasons, and in my experience two or three of them are usually
            happening at once.
          </p>
          <div className="space-y-6">
            {whyItSits.map((w, i) => (
              <div key={w.reason} className="border-l-4 border-accent pl-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-heading font-bold text-accent text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="heading-section text-base text-primary">
                    {w.reason}
                  </h3>
                </div>
                <p className="font-body text-dark text-sm leading-relaxed">
                  {w.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8">
            <h3 className="heading-section text-lg text-primary mb-2">
              Working backwards from a hard deadline?
            </h3>
            <p className="font-body text-muted text-sm leading-relaxed">
              If your date is not negotiable, read{" "}
              <Link
                href="/sell/sell-my-house-fast-tampa-bay/"
                className="text-link hover:underline"
              >
                selling a Tampa Bay house fast
              </Link>{" "}
              next, it compares a cash offer against a priced-right listing on
              eight dimensions. If the date has some give, the two numbers that
              set your calendar are{" "}
              <Link
                href="/sell/what-is-my-house-worth-tampa-bay/"
                className="text-link hover:underline"
              >
                what your house is worth
              </Link>{" "}
              and{" "}
              <Link
                href="/sell/how-much-does-it-cost-to-sell-a-house-in-hillsborough-county/"
                className="text-link hover:underline"
              >
                what it costs to sell in Hillsborough County
              </Link>
              . For the make-ready stage specifically, see{" "}
              <Link
                href="/blog/home-staging-tips-sell-tampa-bay-homes-faster/"
                className="text-link hover:underline"
              >
                staging tips that sell Tampa Bay homes faster
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* === Lead form === */}
      <section id="my-timeline" className="container-wide py-16">
        <div className="max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="/sell/how-long-does-it-take-to-sell-a-house-tampa-bay/"
            type="valuation"
            title="Build your selling calendar"
            submitLabel="Map Out My Timeline"
          />
          <p className="font-body text-muted text-sm text-center mt-6 leading-relaxed">
            Give me the address and the date you need to be out, and I will
            build the calendar backwards from it, stage by stage, with the
            decision points marked. Call or text{" "}
            <a
              href="tel:+18137337907"
              className="text-link hover:underline font-semibold"
            >
              (813) 733-7907
            </a>
            . Barrett Henry, Licensed Florida Real Estate Broker, REMAX Collective, license
            BK3313308, with 23+ years of real estate experience and a decade
            plus working the east Hillsborough market. More on how I run a
            listing on the{" "}
            <Link href="/sell-your-home/" className="text-link hover:underline">
              sell your home
            </Link>{" "}
            page.
          </p>
          <p className="font-body text-muted text-xs text-center mt-6 leading-relaxed">
            General information about the Florida selling process, not legal,
            tax or accounting advice. Market figures describe closed sales over
            a past window and do not predict how long any individual home will
            take. Contract deadlines are negotiated between the parties 
            confirm yours with your attorney and your closing agent.
          </p>
        </div>
      </section>

      <FaqSection heading="Tampa Bay selling timeline questions" faqs={faqs} />

      <SourcesSection sources={sources} />
    </>
  );
}
