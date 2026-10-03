// =============================================================================
// /beach-condo-renovation-math
// The buy-dated-and-renovate math on a Gulf-front condo: estimated costs by
// line item, what the association controls, and how the cash works.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import BeachCondoFooterBlock from "@/components/ui/BeachCondoFooterBlock";
import { JsonLd, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/schema";
import { BEACH_CONDO_PUBLISH_DATE } from "@/data/beach-condo-pages";

const SLUG = "beach-condo-renovation-math";
const CANONICAL = `https://nowtb.com/${SLUG}/`;
const TITLE = "Buy the Dated Beach Condo: The Renovation Math";
const DESCRIPTION =
  "Renovating a dated 2 bed Gulf-front condo runs about $56K to $93K in estimates. Here is how that compares to buying an updated unit.";

export const metadata: Metadata = {
  // absolute: the root layout appends a suffix to title strings, which would
  // push these past the 60 character limit
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article" },
};

// --- Estimated renovation line items for the example unit ---
const renovationLines = [
  { item: "Interior paint", low: "$4,000", high: "$6,000" },
  { item: "LVP flooring with sound underlayment", low: "$8,000", high: "$12,000" },
  { item: "Kitchen", low: "$20,000", high: "$35,000" },
  { item: "Two bathrooms", low: "$24,000", high: "$40,000" },
];

// --- What the association typically controls ---
const associationRules = [
  "Written approval of the renovation scope before work starts",
  "Licensed and insured contractors only",
  "Limits on work hours, and often on which days work is allowed",
  "Sound underlayment required under any hard flooring",
];

const faqs: Faq[] = [
  {
    question: "What does it cost to renovate a dated Gulf-front condo?",
    answer:
      "For a dated 2 bedroom, 2 bathroom unit of about 1,275 square feet, rough estimates are $4,000 to $6,000 for paint, $8,000 to $12,000 for LVP flooring with sound underlayment, $20,000 to $35,000 for the kitchen, and $24,000 to $40,000 for two bathrooms. That totals roughly $56,000 to $93,000. These are estimates for planning only, not quotes.",
  },
  {
    question: "Is buying dated and renovating cheaper than buying updated?",
    answer:
      "It can be. Buying a dated unit priced below its building average and renovating it can land you at or below the price of an already updated unit, with the difference being that you choose the finishes. The catch is that renovation cash comes on top of the loan, because lenders finance the as-is price.",
  },
  {
    question: "Can I finance the renovation into my condo loan?",
    answer:
      "Plan on paying for it separately. Lenders finance the as-is purchase price, so renovation money has to come from cash or a separate facility you arrange yourself. Budget it as a line item next to your down payment and closing costs, not as part of the mortgage.",
  },
  {
    question: "Does the condo association have to approve my renovation?",
    answer:
      "Usually yes. Associations commonly require written approval of the work, licensed and insured contractors, limits on work hours and days, and sound underlayment under any hard flooring. Get the approval requirements in writing before you close so your timeline and your bids match the rules.",
  },
  {
    question: "Who can do the work on a beach condo renovation?",
    answer:
      "Paint, flooring, and finish work can be handled by a home services company. Best Bay Services is a local home services company, a handyman company and not a contractor, that handles paint, flooring, and finish work. Any plumbing or electrical work in the kitchen or bathrooms goes to licensed trades, and the association may require licensed and insured vendors for everything.",
  },
  {
    question: "Should I renovate before or after I move in?",
    answer:
      "On a second home or rental, most owners do the work before occupancy, because association work-hour limits make a lived-in renovation slow and disruptive. Line up approval, bids, and a schedule during your inspection period so work can start soon after closing.",
  },
];

export default function BeachCondoRenovationMathPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com/" },
          { name: "Condos", url: "https://nowtb.com/condos/" },
          { name: "Beach Condo Renovation Math", url: CANONICAL },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "Buy the Dated Beach Condo: The Renovation Math",
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: BEACH_CONDO_PUBLISH_DATE,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />

      <HeroSection
        label="GULF-FRONT CONDOS"
        title="The Renovation Math"
        subtitle="What it takes to turn a dated Gulf-front condo into the one you actually wanted, and whether the numbers work."
      />

      {/* === Quick answer === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              On a dated 2 bed, 2 bath Gulf-front condo of about 1,275 square
              feet priced below its building average, estimated renovation costs
              run about $56,000 to $93,000: paint $4,000 to $6,000, LVP floors
              with sound underlayment $8,000 to $12,000, kitchen $20,000 to
              $35,000, and two bathrooms $24,000 to $40,000. Those are estimates
              for planning, not quotes. Buying dated and renovating can land at
              or below the price of an already updated unit, with finishes you
              choose, as long as you plan for the renovation cash on top of the
              loan.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === The line items === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Does the Renovation Actually Cost?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            The example below is a dated 2 bedroom, 2 bathroom, 1,275 square
            foot Gulf-front condo priced below its building average. Every
            number here is an estimate for planning purposes. Get real bids
            before you commit to a purchase price based on them.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[520px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Line Item
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Low Estimate
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    High Estimate
                  </th>
                </tr>
              </thead>
              <tbody>
                {renovationLines.map((line) => (
                  <tr key={line.item} className="border-b border-border">
                    <td className="font-body text-primary font-medium py-4 pr-4 text-sm">
                      {line.item}
                    </td>
                    <td className="font-body text-muted py-4 pr-4 text-sm">
                      {line.low}
                    </td>
                    <td className="font-body text-muted py-4 text-sm">
                      {line.high}
                    </td>
                  </tr>
                ))}
                <tr className="border-b-2 border-primary">
                  <td className="font-body text-primary font-bold py-4 pr-4 text-sm">
                    Total estimate
                  </td>
                  <td className="font-body text-primary font-bold py-4 pr-4 text-sm">
                    About $56,000
                  </td>
                  <td className="font-body text-primary font-bold py-4 text-sm">
                    About $93,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-6 leading-relaxed">
            Spread across 1,275 square feet, that estimate works out to roughly
            $44 to $73 per square foot of renovation. Hold that number next to
            the closed sales inside the same building, where most 2 bed, 2 bath
            Gulf-front units sold between $520 and $690 per square foot over the
            last 24 months. Full pricing detail is on the{" "}
            <Link href="/pinellas-beach-condo-market-report/" className="text-link hover:underline">
              Gulf beach condo market report
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === Dated versus updated === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Does Buying Dated Beat Buying Updated?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Often, yes. A dated unit priced below its building average plus a
              renovation can total at or below what an already updated unit in
              the same building costs. You end up in the same building, with the
              same view, holding finishes you picked instead of finishes someone
              else picked five years ago.
            </p>
            <p>
              The comparison only works inside one building. Compare a dated
              unit to updated closed sales in that same association, not to a
              market-wide average, because the per-foot spread between buildings
              is wider than the spread between finish levels.
            </p>
            <p>
              Where it stops working: if the dated unit is not actually
              discounted, if the building has structural or assessment questions
              that will eat your renovation budget, or if you do not have the
              cash on hand. Check the{" "}
              <Link href="/gulf-front-condos-sirs-milestone-complete/" className="text-link hover:underline">
                SIRS and milestone status
              </Link>{" "}
              before you spend a dollar on finishes.
            </p>
          </div>
        </div>
      </section>

      {/* === The cash reality === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            How Does the Renovation Cash Work?
          </h2>
          <div className="border border-border border-l-4 border-l-primary p-6 mb-6">
            <p className="font-body text-primary font-medium mb-2">
              Lenders finance the as-is price. Renovation money comes on top of
              the loan.
            </p>
            <p className="font-body text-muted text-sm leading-relaxed">
              Budget the renovation as its own line next to your down payment,
              closing costs, and the first year of fees, taxes, and insurance.
              An estimate of $56,000 to $93,000 is real money that has to exist
              outside the mortgage.
            </p>
          </div>
          <p className="font-body text-muted leading-relaxed">
            Buying in an entity changes the loan type and can change the cash
            requirement as well. That is covered on the{" "}
            <Link href="/buying-beach-condo-llc-florida/" className="text-link hover:underline">
              LLC purchase page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === Association rules === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Will the Association Require?
          </h2>
          <ul className="space-y-3 mb-6">
            {associationRules.map((rule) => (
              <li key={rule} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  &#10003;
                </span>
                <span className="font-body text-muted text-sm leading-relaxed">
                  {rule}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-body text-muted leading-relaxed">
            Get those requirements in writing during your inspection period.
            Work-hour limits in particular change your schedule and your bids,
            and a crew that can only work weekday mid-mornings costs more than
            one that can work straight through.
          </p>
        </div>
      </section>

      {/* === Who does the work === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Who Should Do the Work?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Split the scope by trade. Paint, flooring, and finish work are
              handyman scope. Best Bay Services is a local home services company
              that handles paint, flooring, and finish work. It is a handyman
              company, not a contractor.
            </p>
            <p>
              Any plumbing or electrical work in the kitchen or bathrooms goes
              to licensed trades. That is not a preference, it is how the work
              gets permitted and how the association approval holds up. Expect
              the association to require licensed and insured vendors across the
              board.
            </p>
          </div>
        </div>
      </section>

      {/* === Mid-page CTA === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-white text-2xl mb-4">
            Run the Dated Versus Updated Math on a Real Unit
          </h2>
          <p className="font-body text-white/70 mb-6">
            Barrett pulls the updated closed sales inside the same building and
            lines them up against the dated unit plus your renovation estimate,
            so you can see which side actually wins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call or Text (813) 733-7907
            </a>
            <Link href="/condos/" className="btn-secondary inline-block">
              Browse Condos
            </Link>
          </div>
        </div>
      </section>

      <FaqSection heading="Condo Renovation Questions" faqs={faqs} />

      <BeachCondoFooterBlock
        currentSlug={SLUG}
        ctaHeadline="Get the Renovation Comparison for a Specific Unit"
        ctaCopy="Send Barrett the unit you are looking at and he will pull the updated closed sales in that building so you can compare dated plus renovation against updated."
        submitLabel="Run My Numbers"
        sources="Stellar MLS closed sales and current listings for the Pinellas Gulf beaches, plus local renovation cost ranges, checked October 2026. All renovation figures on this page are planning estimates, not quotes."
      />
    </>
  );
}
