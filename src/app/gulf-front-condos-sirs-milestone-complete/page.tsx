// =============================================================================
// /gulf-front-condos-sirs-milestone-complete
// Which Pinellas Gulf-front condo buildings have a filed SIRS and a completed
// milestone inspection, what each report is, and why "filed" is not "funded".
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import BeachCondoFooterBlock from "@/components/ui/BeachCondoFooterBlock";
import { JsonLd, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/schema";
import { BEACH_CONDO_PUBLISH_DATE } from "@/data/beach-condo-pages";

const SLUG = "gulf-front-condos-sirs-milestone-complete";
const CANONICAL = `https://nowtb.com/${SLUG}/`;
const TITLE = "Gulf-Front Condos With SIRS and Milestone Done | 2026";
const DESCRIPTION =
  "Four Pinellas Gulf-front condo buildings have a filed SIRS and a completed milestone inspection. Updated October 2026 by Barrett Henry.";

export const metadata: Metadata = {
  // absolute: the root layout appends a suffix to title strings, which would
  // push these past the 60 character limit
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article" },
};

// --- Buildings with both reports complete per listing disclosures ---
const bothComplete = [
  { building: "Redington Place", city: "Redington Beach" },
  { building: "Reflections on the Gulf", city: "Indian Rocks Beach" },
  { building: "Surfside Tower", city: "Madeira Beach" },
  { building: "Emerald Isle", city: "North Redington Beach" },
];

// --- SIRS on file, milestone status not yet confirmed ---
const sirsFiledOnly = [
  { building: "Redington Towers 1", city: "Redington Shores" },
  { building: "Redington Towers 2", city: "Redington Shores" },
  { building: "Redington Towers 3", city: "Redington Shores" },
  { building: "The Breakers", city: "Redington Beach" },
  { building: "Beach Palms", city: "Indian Shores" },
  { building: "Gulf Shores", city: "Indian Shores" },
  { building: "Gulf Belleair Beach", city: "Belleair Beach" },
  { building: "Montmartre", city: "Belleair Beach" },
  { building: "Gulf Mariner", city: "Redington Shores" },
  { building: "Tides Beach Club", city: "North Redington Beach" },
];

// --- What a SIRS has to cover under Florida law ---
const sirsComponents = [
  "Roof",
  "Structure, including load-bearing walls",
  "Fireproofing and fire protection systems",
  "Plumbing",
  "Electrical systems",
  "Waterproofing and exterior painting",
  "Windows and exterior doors",
  "Any other item with a replacement cost over $25,000 (the threshold adjusts annually)",
];

const faqs: Faq[] = [
  {
    question: "Which Gulf-front condo buildings have both a SIRS and a milestone inspection done?",
    answer:
      "As of October 2026, four buildings show a filed SIRS and a completed milestone inspection: Redington Place in Redington Beach, Reflections on the Gulf in Indian Rocks Beach, Surfside Tower in Madeira Beach, and Emerald Isle in North Redington Beach. That comes from the DBPR SIRS reporting database combined with listing disclosures, so confirm it with the association before you rely on it.",
  },
  {
    question: "Does a filed SIRS mean the reserves are funded?",
    answer:
      "No. Filing a Structural Integrity Reserve Study tells you the association studied the building and reported the study. Funding is a separate question answered by the budget. Read the study next to the current budget to see whether the association is actually collecting what the study says it needs, and ask whether any items are being funded by a loan, a line of credit, or a special assessment instead.",
  },
  {
    question: "Can I look up a building's SIRS myself?",
    answer:
      "Yes, for the SIRS. The Florida Department of Business and Professional Regulation keeps a public SIRS reporting database, though the entries are self-reported by associations. There is no public statewide database of milestone inspections, so milestone status has to come from the association, the listing disclosure, or the local building official.",
  },
  {
    question: "What should I ask for before making an offer on a Gulf-front condo?",
    answer:
      "Ask for the SIRS, the milestone inspection report and any Phase 2 findings, the current budget and reserve balances, the master insurance policy with the per-unit deductible, the recorded declaration and current rules, and the last 12 months of board minutes. Associations with 25 or more units are required to keep these on a website or owner portal.",
  },
  {
    question: "Why do lenders care about SIRS and milestone reports?",
    answer:
      "A lender is underwriting the building as well as the buyer. Unfunded structural work, pending special assessments, or an incomplete milestone inspection can make a project ineligible for financing. Fannie Mae also retired Limited Review for established projects over 10 units for loan applications dated on or after August 3, 2026, which means full project review and more building documents on most condo loans.",
  },
];

export default function GulfFrontSirsMilestonePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com/" },
          { name: "Condos", url: "https://nowtb.com/condos/" },
          { name: "Gulf-Front Condos With SIRS and Milestone Done", url: CANONICAL },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "Gulf-Front Condos With SIRS and Milestone Inspections Done (Pinellas Beaches, 2026)",
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: BEACH_CONDO_PUBLISH_DATE,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />

      <HeroSection
        label="PINELLAS GULF BEACHES"
        title="Condos With SIRS and Milestone Done"
        subtitle="Two reports matter more than the view. Here is where they stand, building by building, as of October 2026."
      />

      {/* === Quick answer === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              As of October 2026, four Pinellas Gulf-front buildings show both a
              filed Structural Integrity Reserve Study (SIRS) and a completed
              milestone inspection: Redington Place in Redington Beach,
              Reflections on the Gulf in Indian Rocks Beach, Surfside Tower in
              Madeira Beach, and Emerald Isle in North Redington Beach. Several
              more have a SIRS on file with milestone status not yet confirmed.
              A filed SIRS is not the same as a funded one, so read the study
              next to the budget before you write an offer.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === Both reports complete === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Which Buildings Have Both Reports Complete?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            These four buildings show a SIRS filed with the state and a
            completed milestone inspection per current listing disclosures.
            That combination usually means fewer surprises for you, your
            lender, and your insurer.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[480px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Building
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Beach Town
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bothComplete.map((item) => (
                  <tr key={item.building} className="border-b border-border">
                    <td className="font-body text-primary font-medium py-4 pr-4 text-sm">
                      {item.building}
                    </td>
                    <td className="font-body text-muted py-4 pr-4 text-sm">
                      {item.city}
                    </td>
                    <td className="font-body text-muted py-4 text-sm">
                      SIRS filed, milestone completed
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === SIRS filed only === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Which Buildings Have a SIRS Filed but No Confirmed Milestone?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            These buildings show a SIRS in the state database. Milestone status
            was not confirmed as of October 2026, which does not mean the
            inspection is missing. It means nobody has published it where a
            buyer can see it, so you have to ask the association.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[420px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Building
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    Beach Town
                  </th>
                </tr>
              </thead>
              <tbody>
                {sirsFiledOnly.map((item) => (
                  <tr key={item.building} className="border-b border-border">
                    <td className="font-body text-primary font-medium py-4 pr-4 text-sm">
                      {item.building}
                    </td>
                    <td className="font-body text-muted py-4 text-sm">
                      {item.city}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-6 leading-relaxed">
            This page does not list buildings as missing a SIRS. The state
            database is self-reported, a blank entry is not proof of anything,
            and you deserve a real answer from the association rather than a
            guess from a website.
          </p>
        </div>
      </section>

      {/* === What is a SIRS === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Is a SIRS?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            A Structural Integrity Reserve Study is a reserve study Florida law
            requires for condo buildings three or more habitable stories. It
            prices out the big-ticket parts of the building and says how much
            the association should be setting aside, so owners are not hit with
            a surprise special assessment. Under HB 913 (2025), SIRS reserves
            cannot be waived.
          </p>
          <ul className="space-y-3">
            {sirsComponents.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  &#10003;
                </span>
                <span className="font-body text-muted text-sm">{item}</span>
              </li>
            ))}
          </ul>
          <p className="font-body text-muted mt-6 leading-relaxed">
            The original SIRS deadline was December 31, 2025. Buildings pairing
            the SIRS with a milestone inspection due in that window have until
            December 31, 2026. Full detail on the deadlines is on the{" "}
            <Link href="/florida-condo-rules-buyers-2026/" className="text-link hover:underline">
              Florida condo rules for buyers
            </Link>{" "}
            page.
          </p>
        </div>
      </section>

      {/* === What is a milestone inspection === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Is a Milestone Inspection?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              A milestone inspection is a structural inspection performed by a
              licensed engineer or architect. Florida requires it for condo
              buildings of three or more habitable stories by December 31 of the
              year the building turns 30, and then every 10 years after that.
            </p>
            <p>
              A local building official can require the inspection at 25 years
              when conditions warrant it, and salt water exposure is exactly the
              kind of condition they look at on the Gulf. The automatic coastal
              25-year trigger that used to apply statewide was removed in 2023,
              so on these beaches the answer now depends on the building and the
              local official.
            </p>
            <p>
              If a milestone inspection moves to Phase 2, the repairs it
              identifies must begin within 365 days. That is the sentence that
              turns an inspection report into a funding question, and it is the
              one to look for in the board minutes.
            </p>
          </div>
        </div>
      </section>

      {/* === Filed is not funded === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Why Is a Filed SIRS Not the Same as a Funded One?
          </h2>
          <div className="border border-border border-l-4 border-l-primary p-6 md:p-8 mb-6">
            <p className="font-body text-primary font-medium mb-3">
              Filed means studied and reported. Funded means the money is being
              collected.
            </p>
            <p className="font-body text-muted text-sm leading-relaxed">
              An association can have a clean SIRS on file and still be
              underfunded for the work in it. HB 913 lets associations pay for
              SIRS items with loans, lines of credit, or special assessments
              approved by a majority of owners. Any of those three can land on
              your statement after closing.
            </p>
          </div>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Read the study against the budget. If a proposed budget exceeds
              115 percent of the prior year, the board has to prepare a
              substitute budget that strips out discretionary spending, which
              tells you the increase is being driven by required items.
            </p>
            <p>
              Then pull the last 12 months of board minutes. Assessments get
              discussed for months before they get voted on, and the minutes are
              where you see it coming. Associations with 25 or more units must
              keep governing documents, budgets, financials, insurance policies,
              contracts, and 12 months of minutes on a website or owner portal.
            </p>
            <p>
              Two more things worth checking on these beaches: some buildings
              carry storm-related special assessments, and some monthly fees do
              not include building insurance. Both change your real monthly cost
              and neither one shows up in the listing price. The{" "}
              <Link href="/pinellas-beach-condo-market-report/" className="text-link hover:underline">
                Gulf beach condo market report
              </Link>{" "}
              covers what fees and pricing look like right now.
            </p>
          </div>
        </div>
      </section>

      {/* === Mid-page CTA === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-white text-2xl mb-4">
            Get the Full Report on Any Building
          </h2>
          <p className="font-body text-white/70 mb-6">
            Before you write an offer, Barrett pulls the condo docs, the SIRS,
            the milestone report, the insurance, and recent sales for the
            building you are looking at, then walks you through what the numbers
            actually say.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call or Text (813) 733-7907
            </a>
            <Link href="/contact/" className="btn-secondary inline-block">
              Request a Building Report
            </Link>
          </div>
        </div>
      </section>

      <FaqSection
        heading="SIRS and Milestone Questions Buyers Ask"
        faqs={faqs}
      />

      <BeachCondoFooterBlock
        currentSlug={SLUG}
        ctaHeadline="Get the Full Report on Any Gulf-Front Building"
        ctaCopy="Tell Barrett which building you are considering and he will send the SIRS status, milestone status, fees, insurance notes, and recent closed sales."
        submitLabel="Request Building Report"
        sources="Florida DBPR SIRS reporting database, current listing disclosures, and Stellar MLS, checked October 2026."
      />
    </>
  );
}
