// =============================================================================
// /how-to-tell-if-condo-is-55-plus
// How to verify whether a Florida condo is actually age restricted, and why the
// building name is not evidence either way. No building is named on this page.
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

const SLUG = "how-to-tell-if-condo-is-55-plus";
const CANONICAL = `https://nowtb.com/${SLUG}/`;
const TITLE = "How to Tell if a Florida Condo Is 55+";
const DESCRIPTION =
  "An adult name in a condo's legal title does not mean it is age restricted. Check the recorded declaration and current rules. Step by step.";

export const metadata: Metadata = {
  // absolute: the root layout appends a suffix to title strings, which would
  // push these past the 60 character limit
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article" },
};

// --- The verification sequence ---
const steps = [
  {
    title: "Pull the recorded declaration",
    detail:
      "The declaration of condominium and its amendments are the controlling documents. If an age restriction exists, it lives here. A listing remark, a sign at the entrance, or a building name is not the restriction.",
  },
  {
    title: "Read the current rules and regulations",
    detail:
      "Rules get amended over the life of a building. Read the current set alongside the declaration so you are looking at what applies today, not what applied when the building opened.",
  },
  {
    title: "Ask the association directly",
    detail:
      "Ask whether the community is operated as housing for older persons, and if so, how the age requirement is written and whether the association enforces it. Put the question in writing so you have the answer in writing.",
  },
  {
    title: "Match the answer to who will live there",
    detail:
      "If the building is age restricted, confirm how the requirement applies to every occupant, not just the person on the deed. Then confirm the same for guests and for tenants if you plan to rent.",
  },
];

const faqs: Faq[] = [
  {
    question: "How do I tell if a Florida condo is really 55+?",
    answer:
      "Read the recorded declaration of condominium and the current rules and regulations, then ask the association directly whether the community is operated as housing for older persons. Those are the only reliable sources. A building name, a listing remark, or what a neighbor says is not verification.",
  },
  {
    question: "Does the word adult in a condo's name mean it is age restricted?",
    answer:
      "No. Some older buildings carry the word adult in their legal name without an active age restriction, which is a leftover from how the project was originally marketed or recorded. The name tells you nothing about current status. Only the recorded declaration and current rules do.",
  },
  {
    question: "Are any Pinellas beach condo buildings age restricted?",
    answer:
      "Some beach buildings are age restricted under housing-for-older-persons rules and some are not. Because status depends on recorded documents that can be amended, no building should be labeled 55+ based on a website. Verify the specific building you are considering through its declaration, its current rules, and the association.",
  },
  {
    question: "Why does it matter whether a condo is 55+?",
    answer:
      "It affects who can live in the unit, who can stay as a guest, and whether you can rent it to the tenants you had in mind. It can also affect your resale pool later. All of that is worth confirming before your inspection period closes rather than after.",
  },
  {
    question: "Can my REALTOR just tell me if a building is 55+?",
    answer:
      "Your agent can request and review the documents with you, which is the right way to get the answer. What no one should do is answer from memory or from the building name. Barrett pulls the declaration and current rules on the specific building and gets the association to confirm in writing.",
  },
];

export default function HowToTellIfCondoIs55PlusPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com/" },
          { name: "55+ Communities", url: "https://nowtb.com/55-plus-communities/" },
          { name: "How to Tell if a Florida Condo Is 55+", url: CANONICAL },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "How to Tell if a Florida Condo Is 55+",
          description: DESCRIPTION,
          url: CANONICAL,
          datePublished: BEACH_CONDO_PUBLISH_DATE,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />

      <HeroSection
        label="FLORIDA CONDO BUYERS"
        title="Is the Condo Actually 55+?"
        subtitle="The building name will not tell you. The recorded declaration will."
      >
        <SearchBar />
      </HeroSection>

      {/* === Quick answer === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              Some Florida beach condo buildings are age restricted under
              housing-for-older-persons rules and some are not, and some older
              buildings carry the word adult in their legal name without any
              active age restriction. The only reliable check is the recorded
              declaration of condominium plus the current rules, confirmed by
              asking the association directly. Do not rely on the building name,
              a listing remark, or a website, including this one, to tell you
              whether a specific building is 55+.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === Why the name misleads === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Why Does the Building Name Mislead Buyers?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Beach buildings here date back decades, and a lot of them were
              named and recorded in an era when the word adult in a project name
              was ordinary marketing. That name stays on the legal documents
              long after any age restriction stops being enforced, or in cases
              where one never applied the way buyers assume.
            </p>
            <p>
              It runs the other direction too. A building with a perfectly
              neutral name can be operated as housing for older persons under a
              properly recorded restriction. Nothing about the name, the sign
              out front, or the age of the people at the pool is evidence.
            </p>
          </div>
        </div>
      </section>

      {/* === The step by step === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            How Do You Verify It, Step by Step?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Four steps, in this order. Each one is cheap. Finding out after
            closing is not.
          </p>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="border border-border p-6">
                <p className="font-body text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2">
                  Step {index + 1}
                </p>
                <h3 className="heading-section text-lg text-primary mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Where to get documents === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Where Do You Get the Documents?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Associations with 25 or more units are required to maintain a
              website or owner portal carrying governing documents, budgets,
              financials, insurance policies, contracts, and 12 months of
              minutes. That portal is the fastest route to the declaration and
              the current rules.
            </p>
            <p>
              Request them during your inspection period, in writing, and ask
              the association to confirm current age-restriction status in the
              same message. While you are in there, pull the rental minimum and
              the reserve picture too, since you are already asking. The{" "}
              <Link href="/buying-beach-condo-llc-florida/" className="text-link hover:underline">
                document checklist
              </Link>{" "}
              covers everything worth requesting in one go.
            </p>
            <p>
              Age restriction and rental restriction are separate questions with
              separate answers. A building can be age restricted and allow
              rentals, or be open to all ages and restrict rentals hard. See how
              rental minimums stack on the{" "}
              <Link href="/indian-rocks-beach-rental-rules/" className="text-link hover:underline">
                rental rules page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* === What this page will not do === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            Why Does This Page Not Name Any 55+ Buildings?
          </h2>
          <div className="border border-border border-l-4 border-l-primary p-6">
            <p className="font-body text-primary font-medium mb-2">
              Because age-restriction status comes from recorded documents that
              can be amended.
            </p>
            <p className="font-body text-muted text-sm leading-relaxed">
              A list of 55+ buildings published on a website goes stale quietly
              and sends buyers down the wrong road. The right answer for one
              specific building, verified in its documents and confirmed by its
              association, beats a list every time. Barrett will pull that for
              any building you are considering.
            </p>
          </div>
        </div>
      </section>

      {/* === Mid-page CTA === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-white text-2xl mb-4">
            Get the Age Restriction Answer in Writing
          </h2>
          <p className="font-body text-white/70 mb-6">
            Barrett requests the declaration and the current rules, reads them
            with you, and gets the association to confirm current status before
            your inspection period runs out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary inline-block">
              Call or Text (813) 733-7907
            </a>
            <Link href="/55-plus-communities/" className="btn-secondary inline-block">
              55+ Communities
            </Link>
          </div>
        </div>
      </section>

      <BeachCondoInventory
        title="Gulf Beach Condos for Sale"
        subtitle="Active condo listings on the Pinellas Gulf beaches. Age restriction has to be verified building by building."
      />

      <FaqSection heading="55+ Condo Questions" faqs={faqs} />

      <BeachCondoFooterBlock
        currentSlug={SLUG}
        ctaHeadline="Verify Age Restriction on a Specific Building"
        ctaCopy="Send Barrett the building and he will pull the recorded declaration and current rules, then get the association to confirm status in writing."
        submitLabel="Verify a Building"
        sources="Recorded condominium declarations and current association rules, Florida housing-for-older-persons requirements, and association document portal requirements, checked October 2026. This page is general information, not legal advice."
      />
    </>
  );
}
