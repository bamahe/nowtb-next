// =============================================================================
// /sell/sell-my-house-fast-tampa-bay
//
// WHAT THIS PAGE IS: the page that competes with cash-buyer sites for
// "sell my house fast Tampa Bay." Those sites own the query today because
// nowtb.com had nothing. The angle is NOT "never take a cash offer" — that is
// transparently self-serving and readers smell it. The angle is: here is the
// real speed data, here is what speed costs, get both numbers in writing and
// choose. A seller who genuinely needs a cash sale should get an honest answer.
//
// WHAT THIS PAGE DELIBERATELY DOES NOT DO: invent a cash-offer discount
// percentage. The commonly quoted "cash buyers pay 50-70% of market" figures
// are marketing numbers from competing sites with no methodology behind them.
// Publishing a fabricated spread on a licensed broker's site is a professional
// liability. Instead the page tells the reader how to generate the real number
// for their own house: two written offers, two net sheets, side by side.
//
// ROUTING NOTE: nested under /sell/, already excluded in BOTH :city flatten
// redirect lookaheads in next.config.mjs. Do not create a top-level route.
//
// If it breaks, check:
//  - 404 live but 200 locally? The "sell" exclusion fell out of next.config.mjs.
//  - Days-on-market numbers look off? They are computed from
//    src/data/city-market-stats.ts. Fix the data file, not this page.
//  - TITLE contains "22-69 Days" — those are DOM_FAST and DOM_SLOW below. If
//    the market data file is refreshed and those change, update the title too.
//    A title tag cannot be computed, so this is the one number that can drift.
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

const SLUG = "sell/sell-my-house-fast-tampa-bay";
const CANONICAL = `https://nowtb.com/${SLUG}/`;

// 40 characters + the 16-char " | Barrett Henry" suffix = 56 rendered.
// The "22-69" is the DOM_FAST/DOM_SLOW spread computed below — see the header
// note about keeping it in sync.
const TITLE = "Sell My House Fast Tampa Bay: 22-69 Days";
const DESCRIPTION =
  "Tampa Bay single-family homes went under contract in a median 22 to 69 days by city. What a cash offer really costs, and how to compare both numbers.";

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

// --- Pull the speed spread straight from the verified market data ---
const BRANDON = getCityMarketStats("brandon");
const VALRICO = getCityMarketStats("valrico");
const RIVERVIEW = getCityMarketStats("riverview");
const APOLLO_BEACH = getCityMarketStats("apollo-beach");
const SUN_CITY = getCityMarketStats("sun-city-center");
const TAMPA = getCityMarketStats("tampa");

/** Fastest and slowest median single-family days on market across the cities
 *  this page talks about. Computed, not remembered. */
const SPEED_SET = [
  BRANDON,
  VALRICO,
  RIVERVIEW,
  APOLLO_BEACH,
  SUN_CITY,
  TAMPA,
]
  .map((s) => s?.sfDom)
  .filter((d): d is number => typeof d === "number");
const DOM_FAST = Math.min(...SPEED_SET);
const DOM_SLOW = Math.max(...SPEED_SET);

/** Whole-dollar currency, e.g. $390,000 */
function usd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

// --- Cash offer versus a priced-right listing, dimension by dimension ---
const pathComparison = [
  {
    dimension: "Time to a signed contract",
    cash: "Often 24 to 72 hours after a walkthrough.",
    listing: `A median of ${DOM_FAST} to ${DOM_SLOW} days by city for Tampa Bay single-family closings over the twelve months ending October 2026. A correctly priced home frequently beats its city median.`,
  },
  {
    dimension: "Time from contract to closing",
    cash: "As fast as the title work allows — commonly 7 to 21 days, because there is no lender and no appraisal.",
    listing:
      "Driven by the buyer's loan. A cash buyer on the open market closes on the same short timeline; a financed buyer takes longer.",
  },
  {
    dimension: "Price",
    cash: "A discount to market. The discount is the fee for speed and certainty, and it is specific to your house and the buyer's resale plan.",
    listing:
      "Market price, set by what has actually closed nearby in the last 60 to 90 days.",
  },
  {
    dimension: "Repairs",
    cash: "Usually none. The condition is already priced into the offer.",
    listing:
      "Negotiated after the inspection period. Can be money, a credit, or nothing.",
  },
  {
    dimension: "Appraisal risk",
    cash: "None. No lender means no appraisal contingency.",
    listing:
      "Real on a financed sale. A low appraisal means a renegotiation or a cash shortfall.",
  },
  {
    dimension: "Certainty of closing",
    cash: "High on a genuine cash buyer with proof of funds. Lower if the 'buyer' is assigning the contract to somebody else.",
    listing:
      "Good with a pre-approved buyer and a verified lender, and the contract terms give you remedies.",
  },
  {
    dimension: "Who sees the house",
    cash: "One party.",
    listing:
      "Everybody actively shopping your price band, which is the entire mechanism that produces competing offers.",
  },
  {
    dimension: "Closing costs",
    cash: "Some cash buyers absorb seller closing costs; many quote 'no fees' and simply price it in. Read the net sheet, not the headline.",
    listing:
      "Itemized and predictable — doc stamps, title, recording, prorations.",
  },
];

// --- Levers that genuinely move speed, with the honest cost of each ---
const speedLevers = [
  {
    lever: "Price at the number, not above it",
    effect:
      "By far the biggest lever, and the only one that works on its own. The first ten to fourteen days are when your listing gets its largest audience; a price that is 5 percent high spends that window being skipped.",
    cost: "The difference between your hoped-for price and the real one, which you were not going to get anyway.",
  },
  {
    lever: "Professional photography and a floor plan before day one",
    effect:
      "Nearly every buyer sees the home online first, so the photos are the showing. A relaunch with better photos does not recover the buyers who already scrolled past.",
    cost: "A few hundred dollars and a two or three day delay to the launch.",
  },
  {
    lever: "Unrestricted showing access",
    effect:
      "Lockbox, wide windows, no 24-hour notice. Every piece of friction removes buyers, and it removes the busiest agents first.",
    cost: "Disruption to your routine for two to three weeks.",
  },
  {
    lever: "Pre-listing inspection and a roof document package",
    effect:
      "In Florida the roof age drives the buyer's insurance quote, and an unanswered question becomes a price cut. Documentation beats a discount.",
    cost: "The inspection fee, plus disclosing what it finds — which you are obligated to do anyway.",
  },
  {
    lever: "Make-ready work targeted at the two or three items buyers mention",
    effect:
      "Not a renovation. The short list of things that are actively costing you buyers, each with a quote attached so you can decide.",
    cost: "Varies. Sometimes paint and a deep clean; sometimes it is not worth doing.",
  },
  {
    lever: "Launch timing",
    effect:
      "Going live mid-week before a weekend captures a full weekend of showings in the first-impression window.",
    cost: "A few days of patience, which is the cheapest lever on this list.",
  },
];

const faqs: Faq[] = [
  {
    question: "How fast can I sell my house in Tampa Bay?",
    answer: `Over the twelve months ending October 2026, single-family homes across Tampa Bay went under contract in a median of ${DOM_FAST} to ${DOM_SLOW} days depending on the city — ${DOM_FAST} days in Brandon at one end and ${DOM_SLOW} days in Apollo Beach at the other, per Stellar MLS closed sales. A correctly priced, well-photographed home with open showing access frequently beats its city median. A genuine cash sale can produce a signed contract in 24 to 72 hours and close in roughly one to three weeks, because there is no lender and no appraisal in the way.`,
  },
  {
    question: "How much less will a cash buyer pay?",
    answer:
      "Less than the open market, because you are buying speed and certainty and that has a price. I am not going to publish a percentage, because the honest answer is that the discount depends on your condition, your location and that specific buyer's resale plan — and most of the percentages floating around online come from companies that benefit from the number they chose. Here is how to find your real number: get the cash offer in writing, ask me for a current pricing opinion and a net sheet on the same house, and put the two net figures side by side. The gap is the cost of speed for your house specifically. Then you can decide whether it is worth it, which it sometimes genuinely is.",
  },
  {
    question: "Is a cash offer actually faster than listing?",
    answer:
      "To a signed contract, almost always yes — days instead of weeks. To closing, the gap narrows, because a cash buyer found on the open market closes on the same short timeline as an off-market one. The real comparison is not cash versus listing, it is cash-today versus market-price-in-a-few-weeks. If your deadline is three months out, listing usually wins on net proceeds by a wide margin. If your deadline is next Friday, it does not.",
  },
  {
    question: "What makes a house sell in the first two weeks?",
    answer:
      "Price first, photography second, access third. Your listing gets its largest audience in the first ten to fourteen days, when it hits every saved search as a new listing. A price that is even modestly above the closed comparable sales spends that window being skipped, and no amount of marketing later recovers the buyers who already scrolled past. Everything else — staging, make-ready, launch timing — amplifies a correct price and cannot rescue a wrong one.",
  },
  {
    question: "When is selling to a cash buyer the right call?",
    answer:
      "When the certainty is worth more to you than the spread. That is a real situation: a foreclosure sale date, a probate estate with heirs who need the proceeds split, an inherited house in another state, a divorce with a court deadline, a home needing repairs you cannot fund, or a relocation where carrying two mortgages costs more than the discount. In those cases I will tell you so, and I will help you compare the offers you are getting rather than talk you out of it. What I will not do is let you take a cash discount when you had the time to get market price.",
  },
];

const sources: Source[] = [
  {
    name: "Stellar MLS closed sales via the Bridge API, twelve months ending October 2026",
    used: `Every days-on-market and median price figure on this page, including the ${DOM_FAST}-to-${DOM_SLOW} day median spread. Fully paginated complete datasets rather than samples, with lease records excluded.`,
  },
  {
    name: "Florida Statute 201.02 — Documentary Stamp Tax",
    used: "The $0.70 per $100 deed tax referenced in the closing-cost comparison, which applies whether the buyer is paying cash or financing.",
    href: "https://floridarevenue.com/taxes/taxesfees/pages/doc_stamp.aspx",
  },
  {
    name: "Florida Administrative Code R. 69O-186.003 — Title Insurance Rates",
    used: "The point that the owner's title policy premium is promulgated by the state and is therefore identical regardless of which buyer you sell to.",
    href: "https://www.law.cornell.edu/regulations/florida/Fla-Admin-Code-Ann-R-69O-186-003",
  },
];

export default function SellMyHouseFastTampaBayPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com" },
          { name: "Sell", url: "https://nowtb.com/sell-your-home/" },
          { name: "Sell My House Fast in Tampa Bay", url: CANONICAL },
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
            "Selling a Tampa Bay home quickly, cash offers versus an open-market listing",
        })}
      />

      <HeroSection
        label="Tampa Bay Sellers on a Deadline"
        title="Sell My House Fast in Tampa Bay"
        subtitle={`Median ${DOM_FAST} to ${DOM_SLOW} days to contract by city. What speed actually costs, and how to get both numbers in writing before you decide.`}
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+18137337907"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold px-7 py-3 rounded-lg text-sm hover:bg-light transition-colors"
          >
            Call or Text (813) 733-7907
          </a>
          <Link
            href="#both-numbers"
            className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-7 py-3 rounded-lg text-sm hover:bg-white hover:text-primary transition-colors"
          >
            Show Me Both Numbers
          </Link>
        </div>
      </HeroSection>

      {/* === Direct answer === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              Tampa Bay single-family homes went under contract in a{" "}
              <strong>
                median of {DOM_FAST} to {DOM_SLOW} days
              </strong>{" "}
              depending on the city over the twelve months ending October 2026 —{" "}
              {DOM_FAST} days in Brandon at the fast end, {DOM_SLOW} days in
              Apollo Beach at the slow end, from Stellar MLS closed sales. A
              correctly priced home with real photography and open showing
              access routinely beats its city median.
            </p>
            <p>
              A genuine cash buyer can sign in 24 to 72 hours and close in
              roughly one to three weeks, because there is no lender and no
              appraisal. That speed has a price, and the only way to know what
              it is for <em>your</em> house is to put a written cash offer and a
              written market net sheet side by side. I will run the second one
              for you even if you end up taking the first.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === Comparison table === */}
      <section className="container-wide pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            Cash offer or open-market listing: which is actually faster?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Eight dimensions that matter, with no thumb on the scale. Read the
            price row and the certainty row together — those two are where the
            real decision lives.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    What you are comparing
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Cash buyer
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    Priced-right listing
                  </th>
                </tr>
              </thead>
              <tbody>
                {pathComparison.map((r) => (
                  <tr
                    key={r.dimension}
                    className="border-b border-border align-top"
                  >
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                      {r.dimension}
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm">
                      {r.cash}
                    </td>
                    <td className="font-body text-muted py-3 text-sm">
                      {r.listing}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            For the full city-by-city breakdown of how long each stage takes,
            see{" "}
            <Link
              href="/sell/how-long-does-it-take-to-sell-a-house-tampa-bay/"
              className="text-link hover:underline"
            >
              how long it takes to sell a house in Tampa Bay
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === What speed costs === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What does a cash offer really cost you?
          </h2>
          <p className="font-body text-dark mb-4 leading-relaxed">
            A discount to market, and I am not going to put a percentage on it
            here. Every number you will find on a cash-buyer site was chosen by
            a company that profits from how it looks, and I would be doing the
            same thing in reverse. The real spread depends on your condition,
            your location, what that buyer plans to do with the house, and how
            many of them are competing for it.
          </p>
          <p className="font-body text-dark mb-4 leading-relaxed">
            Here is the method that gives you a number you can actually trust,
            and it takes about a week:
          </p>
          <ol className="font-body text-dark space-y-3 mb-6 list-decimal pl-6 leading-relaxed">
            <li>
              Get the cash offer <strong>in writing</strong>, with proof of
              funds and the closing date spelled out. An offer that will not go
              on paper is not an offer.
            </li>
            <li>
              Ask whether the buyer intends to close themselves or assign the
              contract to somebody else. An assignable contract is a very
              different level of certainty.
            </li>
            <li>
              Ask me for a pricing opinion and a full net sheet on the same
              house, built from closed comparable sales in the last 60 to 90
              days.
            </li>
            <li>
              Compare the two <em>net</em> figures, not the two headline prices.
              Several of the lines are identical either way: the deed
              documentary stamp tax is $0.70 per $100 under Florida Statute
              201.02 regardless of who buys, and the owner&apos;s title policy
              premium is promulgated by the state, so it does not change either.
              Every line is itemized in the{" "}
              <Link
                href="/sell/how-much-does-it-cost-to-sell-a-house-in-hillsborough-county/"
                className="text-link hover:underline"
              >
                Hillsborough County cost-to-sell breakdown
              </Link>
              .
            </li>
            <li>
              Subtract your carrying cost for the extra weeks a listing would
              take — mortgage, taxes, insurance, utilities. That is the honest
              offset in the cash buyer&apos;s favor, and sometimes it closes most
              of the gap.
            </li>
          </ol>
          <p className="font-body text-dark leading-relaxed">
            Watch the words &ldquo;no fees&rdquo; and &ldquo;we pay all closing
            costs.&rdquo; Those costs exist either way. A buyer who absorbs them
            has priced them into the offer, which is fine — just make sure you
            are comparing nets, not slogans.
          </p>
        </div>
      </section>

      {/* === Speed levers table === */}
      <section className="container-wide py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What makes a house sell in the first two weeks?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Six levers, in order of how much they move the clock. Every one has
            a cost, and I have written the cost down so you can decide which are
            worth it on your house.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[740px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Lever
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Why it moves the clock
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    What it costs you
                  </th>
                </tr>
              </thead>
              <tbody>
                {speedLevers.map((l) => (
                  <tr key={l.lever} className="border-b border-border align-top">
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                      {l.lever}
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm">
                      {l.effect}
                    </td>
                    <td className="font-body text-muted py-3 text-sm">
                      {l.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            More detail on the second lever in{" "}
            <Link
              href="/blog/home-staging-tips-sell-tampa-bay-homes-faster/"
              className="text-link hover:underline"
            >
              home staging tips that sell Tampa Bay homes faster
            </Link>
            . If your home was already listed once and came off the market,
            start instead with{" "}
            <Link
              href="/sell/why-didnt-my-house-sell/"
              className="text-link hover:underline"
            >
              why your house did not sell
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === Context: price matters too === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            Does my city change how fast I can sell?
          </h2>
          <p className="font-body text-dark mb-4 leading-relaxed">
            Considerably. Over the twelve months ending October 2026,{" "}
            <Link href="/brandon/" className="text-link hover:underline">
              Brandon
            </Link>{" "}
            single-family homes closed at a {usd(BRANDON?.sfMedian ?? 0)} median
            with a median {BRANDON?.sfDom} days on market, while{" "}
            <Link href="/riverview/" className="text-link hover:underline">
              Riverview
            </Link>{" "}
            closed at {usd(RIVERVIEW?.sfMedian ?? 0)} with a median{" "}
            {RIVERVIEW?.sfDom} days. Apollo Beach, where new construction
            competes directly with resale inventory, ran{" "}
            {APOLLO_BEACH?.sfDom} days at a{" "}
            {usd(APOLLO_BEACH?.sfMedian ?? 0)} median.
          </p>
          <p className="font-body text-dark leading-relaxed">
            That spread is not about desirability. It is mostly about how much
            competing inventory sits in your price band, and whether a builder
            down the road is discounting and buying down rates. Knowing which of
            those you are up against is the difference between pricing to sell
            and pricing to sit. Start with{" "}
            <Link
              href="/sell/what-is-my-house-worth-tampa-bay/"
              className="text-link hover:underline"
            >
              what your house is worth in Tampa Bay
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === Lead form === */}
      <section id="both-numbers" className="container-wide py-16">
        <div className="max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="/sell/sell-my-house-fast-tampa-bay/"
            type="valuation"
            title="Get both numbers side by side"
            submitLabel="Compare My Options"
          />
          <p className="font-body text-muted text-sm text-center mt-6 leading-relaxed">
            Tell me your deadline and the address. I will send a market net
            sheet you can hold up against any cash offer you are considering,
            and if the cash offer wins I will tell you that. Call or text{" "}
            <a
              href="tel:+18137337907"
              className="text-link hover:underline font-semibold"
            >
              (813) 733-7907
            </a>
            . Barrett Henry, Broker Associate, REMAX Collective, license
            BK3313308, with 23+ years of real estate experience. You can also
            start with a{" "}
            <Link href="/free-home-valuation/" className="text-link hover:underline">
              free home valuation
            </Link>
            .
          </p>
          <p className="font-body text-muted text-xs text-center mt-6 leading-relaxed">
            General information about selling a Florida home, not legal, tax or
            accounting advice. Market figures describe closed sales over a past
            window and do not predict what any individual home will sell for or
            how long it will take. Consult your own attorney and CPA.
          </p>
        </div>
      </section>

      <FaqSection
        heading="Questions from sellers who need to move quickly"
        faqs={faqs}
      />

      <SourcesSection sources={sources} />
    </>
  );
}
