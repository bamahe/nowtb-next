// =============================================================================
// /florida-condo-rules-buyers-2026
// What the current condo rules mean for a buyer: HB 913, SIRS and milestone
// deadlines, Fannie Mae project review changes, and Citizens insurance.
// Includes a dated timeline of what changes when.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import BeachCondoFooterBlock from "@/components/ui/BeachCondoFooterBlock";
import { JsonLd, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/schema";
import { BEACH_CONDO_PUBLISH_DATE } from "@/data/beach-condo-pages";

const SLUG = "florida-condo-rules-buyers-2026";
const CANONICAL = `https://nowtb.com/${SLUG}/`;
const TITLE = "Florida Condo Rules for Buyers in 2026";
const DESCRIPTION =
  "No new condo laws passed in 2026. Here is what HB 913, the SIRS deadlines, Fannie Mae changes, and Citizens insurance mean for buyers.";

export const metadata: Metadata = {
  // absolute: the root layout appends a suffix to title strings, which would
  // push these past the 60 character limit
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article" },
};

// --- Dated timeline of what changes when ---
const timeline = [
  {
    date: "July 1, 2026",
    change: "Fannie Mae deductible cap",
    detail:
      "For loan applications dated on or after this date, the master policy per-unit deductible is capped at $50,000. A higher deductible can make the project ineligible, so ask for the master policy early.",
  },
  {
    date: "August 3, 2026",
    change: "Limited Review retired",
    detail:
      "For loan applications dated on or after this date, Fannie Mae retired Limited Review for established projects over 10 units. Expect full project review and more association documents on most condo loans.",
  },
  {
    date: "December 31, 2026",
    change: "Paired SIRS deadline",
    detail:
      "Buildings that paired their SIRS with a milestone inspection due in this window have until this date. The original SIRS deadline was December 31, 2025.",
  },
  {
    date: "January 1, 2027",
    change: "Citizens commercial clearinghouses",
    detail:
      "Under SB 1028, Citizens must have commercial clearinghouses set up. Condo master policies get routed through them, and a comparable private or surplus lines offer within 15 percent of the Citizens price ends the association's Citizens eligibility.",
  },
  {
    date: "January 4, 2027",
    change: "Reserve minimum rises",
    detail:
      "Fannie Mae raises the reserve minimum from 10 percent to 15 percent of annual budgeted assessment income. Budgets that qualify today may not qualify in January.",
  },
];

const faqs: Faq[] = [
  {
    question: "Did Florida pass new condo laws in 2026?",
    answer:
      "No. The regular 2026 session ended March 13, 2026, and the major HOA and condo bills, including HB 657, died. The rules in force for buyers right now come from HB 913, passed in 2025.",
  },
  {
    question: "When was the SIRS deadline?",
    answer:
      "The Structural Integrity Reserve Study deadline was December 31, 2025. Buildings that paired the SIRS with a milestone inspection due in that window have until December 31, 2026. Under HB 913, SIRS reserves cannot be waived.",
  },
  {
    question: "When does a Florida condo building need a milestone inspection?",
    answer:
      "Condo buildings three or more habitable stories need a milestone inspection by December 31 of the year the building turns 30, then every 10 years. A local building official can require it at 25 years when conditions like salt water exposure warrant it. The automatic coastal 25-year trigger was removed in 2023.",
  },
  {
    question: "How can an association pay for SIRS items?",
    answer:
      "HB 913 allows associations to fund SIRS items with loans, lines of credit, or special assessments approved by a majority of owners. If a proposed budget exceeds 115 percent of the prior year, the board must prepare a substitute budget that excludes discretionary spending.",
  },
  {
    question: "What changed with condo financing in 2026?",
    answer:
      "Fannie Mae Lender Letter LL-2026-03, issued March 18, 2026, retired Limited Review for established projects over 10 units for applications dated on or after August 3, 2026, capped the master policy per-unit deductible at $50,000 for applications dated on or after July 1, 2026, eliminated the 50 percent investor concentration cap, and retired the Florida PERS requirement for new attached projects. The reserve minimum rises from 10 percent to 15 percent of annual budgeted assessment income on January 4, 2027.",
  },
  {
    question: "Where do I find a building's condo documents?",
    answer:
      "Associations with 25 or more units must maintain a website or owner portal with governing documents, budgets, financials, insurance policies, contracts, and 12 months of minutes. The Florida DBPR also keeps a public SIRS reporting database, which is self-reported. There is no public statewide milestone inspection database.",
  },
];

export default function FloridaCondoRulesBuyersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com/" },
          { name: "Condos", url: "https://nowtb.com/condos/" },
          { name: "Florida Condo Rules for Buyers in 2026", url: CANONICAL },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "Florida Condo Rules for Buyers in 2026",
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: BEACH_CONDO_PUBLISH_DATE,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />

      <HeroSection
        label="FLORIDA CONDO LAW | 2026"
        title="Condo Rules for Buyers in 2026"
        subtitle="No new condo laws passed this year. The rules that affect your purchase came earlier, and the lending and insurance changes are the ones with dates on them."
      />

      {/* === Quick answer === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              No new condo laws passed in the 2026 Florida session, which ended
              March 13, 2026, and the major HOA and condo bills including HB 657
              died. HB 913 from 2025 still governs: the SIRS deadline was
              December 31, 2025, or December 31, 2026 for buildings pairing the
              SIRS with a milestone inspection due in that window, and SIRS
              reserves cannot be waived. The changes buyers feel in 2026 are
              coming from lenders and insurers instead, including Fannie Mae
              retiring Limited Review on August 3, 2026 and Citizens routing
              condo master policies through commercial clearinghouses by January
              1, 2027.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === Timeline === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Changes and When?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            These are the dates that change what a condo purchase looks like.
            Two of them are already behind us and apply to any loan application
            dated after them.
          </p>
          <div className="space-y-6">
            {timeline.map((item) => (
              <div
                key={item.date}
                className="border border-border border-l-4 border-l-primary p-6"
              >
                <p className="font-body text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2">
                  {item.date}
                </p>
                <h3 className="heading-section text-lg text-primary mb-2">
                  {item.change}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === HB 913 === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Does HB 913 Require?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              HB 913 passed in 2025 and it is the law your purchase runs into.
              The SIRS deadline was December 31, 2025, with December 31, 2026 for
              buildings pairing the SIRS with a milestone inspection due in that
              window. SIRS reserves cannot be waived, which removes the old
              workaround where owners voted to skip funding.
            </p>
            <p>
              Associations can fund SIRS items with loans, lines of credit, or
              special assessments approved by a majority of owners. All three
              are legitimate, and all three can land on your owner statement
              after closing, so the question is not whether the association has
              a plan but which plan it chose.
            </p>
            <p>
              Phase 2 milestone repairs must begin within 365 days. If a
              building is in Phase 2, there is a clock running and a cost
              attached to it.
            </p>
            <p>
              There is also a budget guardrail worth knowing: if a proposed
              budget exceeds 115 percent of the prior year, the board must
              prepare a substitute budget that excludes discretionary spending.
              When you see that substitute budget in the records, it is a signal
              that required work is driving the increase.
            </p>
          </div>
        </div>
      </section>

      {/* === SIRS and milestone === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Do the SIRS and Milestone Inspection Cover?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed mb-6">
            <p>
              A SIRS is required for condo buildings three or more habitable
              stories. It covers the roof, structure, fireproofing and fire
              protection, plumbing, electrical, waterproofing and exterior
              painting, windows and exterior doors, and other items over $25,000,
              with that threshold adjusting annually.
            </p>
            <p>
              A milestone inspection is a structural inspection by a licensed
              engineer or architect, required by December 31 of the year a
              building three or more habitable stories turns 30, then every 10
              years. Local building officials can require it at 25 years when
              conditions such as salt water exposure warrant it. The automatic
              coastal 25-year trigger was removed in 2023.
            </p>
            <p>
              You can look up a SIRS yourself in the public DBPR SIRS reporting
              database, keeping in mind the entries are self-reported by
              associations. There is no public statewide milestone inspection
              database, so milestone status comes from the association, the
              disclosure, or the building official.{" "}
              <Link href="/gulf-front-condos-sirs-milestone-complete/" className="text-link hover:underline">
                See where Pinellas Gulf-front buildings stand
              </Link>
              .
            </p>
          </div>
          <div className="border border-border border-l-4 border-l-primary p-6">
            <p className="font-body text-primary font-medium mb-2">
              Associations with 25 or more units owe you a document portal.
            </p>
            <p className="font-body text-muted text-sm leading-relaxed">
              Governing documents, budgets, financials, insurance policies,
              contracts, and 12 months of minutes have to be kept on a website
              or owner portal. If you are being told those are hard to get, that
              is information too.
            </p>
          </div>
        </div>
      </section>

      {/* === Lending === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            How Did Condo Lending Change in 2026?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Fannie Mae Lender Letter LL-2026-03, issued March 18, 2026, is the
              document that changed condo financing this year, and not all of it
              is bad news for buyers.
            </p>
            <p>
              Tighter: Limited Review was retired for loan applications dated on
              or after August 3, 2026 for established projects over 10 units, so
              expect a full project review. The master policy per-unit deductible
              is capped at $50,000 for applications dated on or after July 1,
              2026. And on January 4, 2027 the reserve minimum rises from 10
              percent to 15 percent of annual budgeted assessment income.
            </p>
            <p>
              Looser: the 50 percent investor concentration cap was eliminated,
              and the Florida PERS requirement for new attached projects was
              retired. Both of those had been killing otherwise good deals in
              beach buildings with heavy rental ownership.
            </p>
            <p>
              The practical move is to get the building documents to your lender
              before you are under contract, not after. If you are buying in an
              entity, the loan type changes too, which is covered on the{" "}
              <Link href="/buying-beach-condo-llc-florida/" className="text-link hover:underline">
                buying in an LLC
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      </section>

      {/* === Insurance === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Is Changing With Citizens and Condo Insurance?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              SB 1028 took effect June 16, 2026. It requires Citizens Property
              Insurance to set up commercial clearinghouses by January 1, 2027.
              Condo master policies will be routed through those clearinghouses.
            </p>
            <p>
              Here is the part that hits owners: if a private or surplus lines
              insurer offers comparable coverage within 15 percent of the
              Citizens price, the association loses Citizens eligibility. An
              association sitting on a Citizens master policy today could be
              shopping the private market in 2027, and the master policy premium
              flows straight into the monthly fee.
            </p>
            <p>
              Ask two questions on any building you are serious about: who
              writes the master policy right now, and is building insurance
              inside the monthly fee or billed separately. On these beaches the
              answer is not consistent from building to building.
            </p>
          </div>
        </div>
      </section>

      {/* === Mid-page CTA === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-white text-2xl mb-4">
            Have the Rules Checked Against a Real Building
          </h2>
          <p className="font-body text-white/70 mb-6">
            Rules on a page are easy. Applying them to one association, one
            budget, and one insurance policy is the work. Barrett does that part
            before you write an offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call or Text (813) 733-7907
            </a>
            <Link href="/contact/" className="btn-secondary inline-block">
              Ask a Condo Question
            </Link>
          </div>
        </div>
      </section>

      <FaqSection heading="Florida Condo Rule Questions" faqs={faqs} />

      <BeachCondoFooterBlock
        currentSlug={SLUG}
        ctaHeadline="Get These Rules Applied to Your Building"
        ctaCopy="Send Barrett the building you are considering and he will check the SIRS status, milestone status, budget, and insurance setup against what the current rules require."
        submitLabel="Ask About a Building"
        sources="Florida HB 913 (2025), the 2026 regular session record, Fannie Mae Lender Letter LL-2026-03 dated March 18, 2026, Florida SB 1028 effective June 16, 2026, and the Florida DBPR SIRS reporting database, checked October 2026. This page is general information, not legal advice."
      />
    </>
  );
}
