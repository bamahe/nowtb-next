// =============================================================================
// /buying-beach-condo-llc-florida
// Buying a Gulf-front condo in an LLC or corporation: financing type,
// association approval, taxes without homestead, and the document checklist.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import BeachCondoInventory from "@/components/ui/BeachCondoInventory";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import BeachCondoFooterBlock from "@/components/ui/BeachCondoFooterBlock";
import { JsonLd, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/schema";
import { BEACH_CONDO_PUBLISH_DATE } from "@/data/beach-condo-pages";

const SLUG = "buying-beach-condo-llc-florida";
const CANONICAL = `https://nowtb.com/${SLUG}/`;
const TITLE = "Buying a Florida Beach Condo in an LLC";
const DESCRIPTION =
  "Buying a Gulf-front condo in an LLC means non-QM or DSCR financing, association approval, and no homestead cap. Document checklist inside.";

export const metadata: Metadata = {
  // absolute: the root layout appends a suffix to title strings, which would
  // push these past the 60 character limit
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article" },
};

// --- Documents to request early ---
const documentChecklist = [
  "Recorded declaration of condominium and all amendments",
  "Current rules and regulations, including rental minimums",
  "Structural Integrity Reserve Study (SIRS)",
  "Milestone inspection report and any Phase 2 findings",
  "Current budget and reserve balances",
  "Any current or pending special assessment, with the amount and payoff terms",
  "Master insurance policy, including the per-unit deductible",
  "Last 12 months of board minutes",
  "Association application for purchase approval, including any entity ownership rules",
  "Estoppel or fee schedule showing what the monthly fee covers",
];

// --- Entity versus personal name comparison ---
const comparison = [
  {
    item: "Typical loan type",
    personal: "Standard conventional loan",
    entity: "Non-QM, DSCR, portfolio, or commercial loan. Confirm with a lender.",
  },
  {
    item: "Building review",
    personal: "Lender reviews the project",
    entity: "Lender still reviews the project. Condo docs, SIRS, milestone, insurance, and budget are needed early.",
  },
  {
    item: "Association approval",
    personal: "Buyer approval is common",
    entity: "Buyer approval is common, and some associations restrict or set rules for entity ownership.",
  },
  {
    item: "Homestead exemption",
    personal: "Available on a primary residence",
    entity: "Not available on a second home or entity-owned unit.",
  },
  {
    item: "Property tax basis",
    personal: "Assessment cap applies to a homesteaded primary residence",
    entity: "No cap. Taxes reset based on the purchase price.",
  },
];

const faqs: Faq[] = [
  {
    question: "Can I buy a Florida beach condo in an LLC?",
    answer:
      "Yes, and plenty of buyers do. The main change is financing. Buying in an LLC or corporation generally means a non-QM, DSCR, portfolio, or commercial loan rather than a standard conventional loan, so confirm the program and terms with a lender before you shop. The second change is association approval, since many associations approve the buyer and some restrict or set rules for entity ownership.",
  },
  {
    question: "Do lenders still review the condo building when I buy in an entity?",
    answer:
      "Yes. These lenders review the building the same way, so you still need the condo docs, SIRS, milestone report, insurance, and budget early in the process. On a Gulf-front building, those documents decide whether the loan is possible at all, not just what rate you get.",
  },
  {
    question: "Will the association let an LLC own a unit?",
    answer:
      "It depends on the building. Many associations require approval of the buyer, and some restrict entity ownership or attach specific rules to it. Ask before you write an offer rather than after, because finding out during the approval window puts your deposit and your timeline at risk.",
  },
  {
    question: "What happens to property taxes on an entity-owned condo?",
    answer:
      "There is no homestead exemption and no assessment cap on a second home or an entity-owned unit, so taxes reset based on your purchase price. For planning purposes, estimate 1.5 to 1.7 percent of the purchase price per year. That is an estimate only and the actual number varies by millage rate, so verify with the county property appraiser.",
  },
  {
    question: "What documents should I collect before making an offer in an entity?",
    answer:
      "Request the recorded declaration and amendments, the current rules including rental minimums, the SIRS, the milestone inspection report, the current budget and reserves, any current or pending special assessment, the master insurance policy with its per-unit deductible, the last 12 months of board minutes, and the association purchase application with any entity ownership rules.",
  },
  {
    question: "Does buying in an LLC change how fast I can close?",
    answer:
      "Usually yes. Entity financing adds underwriting steps and the association approval process can add its own timeline, especially if the board has questions about entity ownership. Build the extra time into your contract dates instead of asking for extensions later.",
  },
];

export default function BuyingBeachCondoLlcPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com/" },
          { name: "Investing", url: "https://nowtb.com/investing/" },
          { name: "Buying a Florida Beach Condo in an LLC", url: CANONICAL },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "Buying a Florida Beach Condo in an LLC",
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: BEACH_CONDO_PUBLISH_DATE,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />

      <HeroSection
        label="ENTITY AND SECOND-HOME BUYERS"
        title="Buying a Beach Condo in an LLC"
        subtitle="Different loan, same building review, plus an association that gets a vote on your buyer entity."
      >
        <SearchBar />
      </HeroSection>

      {/* === Quick answer === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              Buying a Florida beach condo in an LLC or corporation generally
              means a non-QM, DSCR, portfolio, or commercial loan rather than a
              standard conventional loan, so confirm the program with a lender
              first. Those lenders still review the building, so the condo docs,
              SIRS, milestone report, insurance, and budget are needed early.
              Many associations require approval of the buyer and some restrict
              entity ownership, so ask before you write an offer. There is no
              homestead exemption or assessment cap on a second home or
              entity-owned unit, and taxes reset based on the purchase price.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === Financing === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            How Does Financing Change When You Buy in an Entity?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              A standard conventional loan is written to a person. Put the title
              in an LLC or corporation and you are generally in non-QM, DSCR,
              portfolio, or commercial loan territory. Terms, down payment, and
              reserve requirements are set by the individual lender, so confirm
              the program before you start making offers.
            </p>
            <p>
              What does not change is the building review. These lenders look at
              the project too, which means the condo docs, SIRS, milestone
              report, insurance, and budget need to be in hand early. On a
              Gulf-front building those documents can decide whether a loan is
              possible, not just what it costs. The{" "}
              <Link href="/florida-condo-rules-buyers-2026/" className="text-link hover:underline">
                2026 condo rules page
              </Link>{" "}
              covers what lenders are now required to look at.
            </p>
          </div>
        </div>
      </section>

      {/* === Comparison table === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-4xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Entity Purchase Versus Buying in Your Own Name
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            Side by side, here is what actually differs.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Item
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Your Own Name
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    LLC or Corporation
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.item} className="border-b border-border">
                    <td className="font-body text-primary font-medium py-4 pr-4 text-sm align-top">
                      {row.item}
                    </td>
                    <td className="font-body text-muted py-4 pr-4 text-sm align-top">
                      {row.personal}
                    </td>
                    <td className="font-body text-muted py-4 text-sm align-top">
                      {row.entity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === Association approval === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Will the Association Approve an LLC as the Owner?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Many associations require approval of the buyer, and some restrict
              entity ownership or attach their own rules to it. This is a
              question to ask before you write an offer, not during the approval
              window with a deposit already in escrow.
            </p>
            <p>
              Ask three things: does the declaration permit entity ownership,
              what does the association require in the application for an entity
              buyer, and are there rental restrictions tied to how the unit is
              owned. If you plan to rent, the{" "}
              <Link href="/indian-rocks-beach-rental-rules/" className="text-link hover:underline">
                rental rules page
              </Link>{" "}
              shows how city rules and building minimums stack.
            </p>
          </div>
        </div>
      </section>

      {/* === Taxes === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Happens to Taxes Without Homestead?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed mb-6">
            <p>
              A second home or an entity-owned unit gets no homestead exemption
              and no assessment cap. Taxes reset based on what you paid, which
              catches buyers off guard when they compare their new bill to the
              seller&apos;s old one.
            </p>
          </div>
          <div className="border border-border border-l-4 border-l-primary p-6">
            <p className="font-body text-primary font-medium mb-2">
              Planning estimate: 1.5 to 1.7 percent of the purchase price per
              year.
            </p>
            <p className="font-body text-muted text-sm leading-relaxed">
              That is an estimate for budgeting only. The real number varies by
              millage rate, so verify with the Pinellas County property
              appraiser before you finalize your numbers. Barrett is a Broker
              Associate, not a tax advisor, so run the structure past your CPA
              and attorney too.
            </p>
          </div>
        </div>
      </section>

      {/* === Document checklist === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Documents Should You Collect First?
          </h2>
          <p className="font-body text-muted mb-6 leading-relaxed">
            Request all of these at once, early. Associations with 25 or more
            units are required to keep most of them on a website or owner
            portal, so a slow response is itself worth noting.
          </p>
          <ul className="space-y-3">
            {documentChecklist.map((doc) => (
              <li key={doc} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  &#10003;
                </span>
                <span className="font-body text-muted text-sm leading-relaxed">
                  {doc}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-body text-muted text-sm mt-6 leading-relaxed">
            Want the SIRS and milestone answers before you request anything?{" "}
            <Link href="/gulf-front-condos-sirs-milestone-complete/" className="text-link hover:underline">
              Start with the building status page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === Mid-page CTA === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-white text-2xl mb-4">
            Buying Through an Entity? Start With the Building
          </h2>
          <p className="font-body text-white/70 mb-6">
            Barrett checks whether the association permits entity ownership and
            pulls the documents your lender will ask for, before you tie up a
            deposit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call or Text (813) 733-7907
            </a>
            <Link href="/investing/" className="btn-secondary inline-block">
              Investment Property Resources
            </Link>
          </div>
        </div>
      </section>

      <BeachCondoInventory
        title="Gulf Beach Condos for Sale"
        subtitle="Active condo listings on the Pinellas Gulf beaches. Ask whether the association permits entity ownership."
      />

      <FaqSection heading="LLC and Second-Home Condo Questions" faqs={faqs} />

      <BeachCondoFooterBlock
        currentSlug={SLUG}
        ctaHeadline="Get the Entity Ownership Answer on a Specific Building"
        ctaCopy="Tell Barrett the building and how you plan to hold title. He will confirm what the association allows and gather the documents your lender needs."
        submitLabel="Ask About Entity Ownership"
        sources="Current Stellar MLS listing disclosures and association documents, plus Florida homestead and property tax rules, checked October 2026. Lending terms come from individual lenders. This page is general information, not legal, lending, or tax advice."
      />
    </>
  );
}
