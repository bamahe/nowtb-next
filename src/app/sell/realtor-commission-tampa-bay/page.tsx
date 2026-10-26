// =============================================================================
// /sell/realtor-commission-tampa-bay
//
// WHAT THIS PAGE IS: the commission page. nowtb.com appeared nowhere for
// "Tampa listing agent commission" because the page did not exist.
//
// *** READ THIS BEFORE EDITING ***
// This is the single most legally sensitive page on the site. Barrett is a
// licensed Florida real estate broker. Commission rates are an antitrust topic.
// The rules for this file are absolute:
//
//   1. NEVER print a specific rate as "standard," "typical," "average," "the
//      going rate," or anything that reads as a norm. Not 5%. Not 6%. Not a
//      range. Not "most sellers pay." A broker publishing a going rate is how
//      price-fixing allegations start.
//   2. ALWAYS say compensation is negotiable and is not set by law, by the
//      brokerage, or by any association.
//   3. Buyer-broker compensation is negotiated SEPARATELY and is no longer
//      communicated through the MLS. Do not describe it as bundled or standard.
//   4. The disclaimer block near the form is not optional. Leave it in.
//
// If a future editor wants a number on this page, the correct answer is a link
// to a written proposal, not a figure in the HTML.
//
// ROUTING NOTE: nested under /sell/, already excluded in BOTH :city flatten
// redirect lookaheads in next.config.mjs. Do not create a top-level route.
//
// If it breaks, check:
//  - 404 live but 200 locally? The "sell" exclusion fell out of next.config.mjs.
//  - Lead not arriving? That is /api/contact and Turnstile. Do not hand-roll a
// fetch in this file, a bespoke form bypasses validation and Follow Up Boss.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import QuickAnswer from "@/components/ui/QuickAnswer";
import FaqSection, { type Faq } from "@/components/ui/FaqSection";
import ContactForm from "@/components/ui/ContactForm";
import SourcesSection, { type Source } from "@/components/ui/SourcesSection";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
} from "@/lib/schema";

const SLUG = "sell/realtor-commission-tampa-bay";
const CANONICAL = `https://nowtb.com/${SLUG}/`;

// 41 characters + the 16-char " | Barrett Henry" suffix = 57 rendered.
const TITLE = "Realtor Commission in Tampa Bay Explained";
const DESCRIPTION =
  "Commission in Florida is negotiable and set by no law. What the 2024 NAR changes did, how fee structures differ, and how to compare two proposals.";

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

// --- What the August 17, 2024 NAR practice changes actually did ---
const beforeAfter = [
  {
    topic: "Where buyer-broker compensation was published",
    before:
      "An offer of compensation to the buyer's broker appeared in the MLS listing record.",
    after:
      "Offers of compensation cannot be communicated through the MLS at all, not in a field, not in public remarks, not in private remarks.",
    seller:
      "You decide separately whether to offer anything, and it is a negotiation rather than a default.",
  },
  {
    topic: "Written agreement with a buyer",
    before:
      "A buyer could tour homes with an agent with nothing signed.",
    after:
      "An MLS participant working with a buyer must have a written agreement in place before touring a home.",
    seller:
      "Buyers walking your house have committed to their agent in writing, which generally means a more qualified showing.",
  },
  {
    topic: "Whether compensation is negotiable",
    before: "Negotiable, and always has been.",
    after: "Negotiable, and NAR restated it explicitly.",
    seller:
      "Nothing changed here. There was never a required rate and there is not one now.",
  },
  {
    topic: "How a buyer's agent gets paid",
    before:
      "Commonly paid from the listing side's compensation as published in the MLS.",
    after:
      "Paid under the buyer's own written agreement. The buyer may ask the seller to contribute, which becomes a contract negotiation like any other concession.",
    seller:
      "It shows up as a term in the offer you are evaluating, alongside price, closing date and repairs.",
  },
];

// --- Fee structures a Tampa Bay seller may actually be offered ---
const feeStructures = [
  {
    structure: "Percentage of the sale price",
    how: "The listing fee is a negotiated percentage of what the home sells for.",
    watch:
      "Confirm whether the percentage is of gross sale price or of some other figure, and get the number in the listing agreement rather than in conversation.",
  },
  {
    structure: "Flat fee",
    how: "A fixed dollar amount regardless of sale price.",
    watch:
      "Ask exactly which services are inside the flat fee and which are billed separately. Photography, floor plans and a sign are often add-ons.",
  },
  {
    structure: "Tiered or performance-based",
    how: "One rate up to a threshold price, a different rate above it.",
    watch:
      "Make sure the threshold is realistic against actual closed comparable sales, not a number chosen to look generous.",
  },
  {
    structure: "Entry-only or limited-service listing",
    how: "The home is entered into the MLS for a fee and the seller handles the rest.",
    watch:
      "Find out in writing who fields showing requests, who holds and delivers the escrow deposit, who handles inspection negotiation and who is liable for disclosure errors. Those are the jobs, and if nobody is doing them they do not disappear.",
  },
  {
    structure: "Seller contribution to the buyer's broker",
    how: "A separate decision from your listing fee. You may offer, decline, or negotiate it on a per-offer basis.",
    watch:
      "Since August 17, 2024 this cannot be advertised in the MLS. Treat it like any other concession: something you evaluate inside a specific offer, against price and terms.",
  },
];

// --- What to ask, and what a straight answer sounds like ---
const proposalQuestions = [
  {
    ask: "What is your fee, in writing, before I sign anything?",
    good: "A number in the listing agreement, with the calculation basis spelled out.",
  },
  {
    ask: "What is included, itemized?",
    good: "Professional photography, floor plan, measured square footage, MLS entry, syndication, sign, lockbox, showing management, feedback collection, weekly pricing review, inspection and appraisal negotiation, closing coordination.",
  },
  {
    ask: "What is the term, and how do I cancel?",
    good: "A stated length and a clear cancellation provision. A listing you cannot exit is a red flag.",
  },
  {
    ask: "Is there a protection period after expiration, and how long?",
    good: "A specific number of days and a named-buyer limitation, not an open-ended claim on any future sale.",
  },
  {
    ask: "Who actually handles my listing day to day?",
    good: "A name and a direct number. Mine is (813) 733-7907.",
  },
  {
    ask: "What is my estimated net at your recommended list price?",
    good: "A written net sheet with every closing cost line itemized, not a verbal estimate.",
  },
];

const faqs: Faq[] = [
  {
    question: "What is the standard realtor commission in Tampa Bay?",
    answer:
      "There is no standard commission in Tampa Bay or anywhere in Florida. Real estate compensation is negotiable in every transaction and is not set by statute, by any brokerage, or by any REALTOR association. Any page, agent or calculator that quotes you a standard rate is describing something that does not legally exist. What is real is your listing agreement: the fee is whatever you and your broker agree to in writing before the home goes on the market.",
  },
  {
    question: "What changed about commissions after the 2024 NAR settlement?",
    answer:
      "Two practice changes took effect on August 17, 2024. First, offers of compensation to a buyer's broker can no longer be communicated through the MLS in any field or remark. Second, an MLS participant working with a buyer must have a written agreement with that buyer before touring a home. Compensation remained negotiable before and after, the change is where it is discussed and documented, not whether it can be negotiated. For a seller, the practical effect is that any contribution to the buyer's side is now a term you evaluate inside a specific offer.",
  },
  {
    question: "Do I have to pay the buyer's agent?",
    answer:
      "No. Since the August 2024 practice changes, a buyer's agent is compensated under that buyer's own written agreement with their broker. A buyer may ask you to contribute toward it, and that request arrives as a term in their offer, the same way a request for a closing cost credit or a repair allowance does. You can accept it, counter it, or decline it, and you weigh it against the price and the rest of the terms. It is a negotiation, not an obligation.",
  },
  {
    question: "Is a cheaper listing fee a better deal?",
    answer:
      "It depends entirely on what comes with it, and the only way to know is to make both sides itemize. A lower fee on a listing that sits for 90 days and takes two price reductions can net you less than a higher fee on a listing that sells in three weeks at the first number. Compare net proceeds at a realistic sale price and a realistic timeline, not fee percentages in isolation. Ask both agents for a written net sheet at the same list price and put them side by side.",
  },
  {
    question: "What if I sell my house myself?",
    answer:
      "You can, and you keep whatever you would have paid a listing broker. According to the National Association of REALTORS 2025 Profile of Home Buyers and Sellers, for-sale-by-owner transactions fell to 5 percent of sales, an all-time low, while a record 91 percent of sellers used an agent. NAR reported a FSBO median price of $360,000 against $425,000 for agent-assisted sales, though NAR itself cautions that FSBO sales skew toward lower-cost property types and rural locations, so that gap is not a like-for-like comparison. The real work you are taking on is pricing, disclosure liability, showing management, escrow handling and inspection negotiation.",
  },
];

const sources: Source[] = [
  {
    name: "National Association of REALTORS, settlement practice changes effective August 17, 2024",
    used: "That offers of compensation were removed from the MLS, that a written buyer agreement is required before touring, and NAR's restatement that compensation remains negotiable.",
    href: "https://www.nar.realtor/sites/default/files/2024-10/nar-settlement-faq-2024-10-29.pdf",
  },
  {
    name: "National Association of REALTORS, 2025 Profile of Home Buyers and Sellers",
    used: "The 5 percent for-sale-by-owner share, the record 91 percent agent-assisted share, the $360,000 versus $425,000 median price figures, and NAR's own caveat about the comparison not being like-for-like.",
    href: "https://www.nar.realtor/news/real-estate-news/fsbos-reach-all-time-low-more-sellers-rely-on-agents",
  },
  {
    name: "Florida Statute 201.02 and Florida Administrative Code R. 69O-186.003",
    used: "The distinction drawn on this page between costs that are fixed by law, the deed documentary stamp tax and the promulgated title insurance premium, and compensation, which is not.",
    href: "https://floridarevenue.com/taxes/taxesfees/pages/doc_stamp.aspx",
  },
];

export default function RealtorCommissionTampaBayPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com" },
          { name: "Sell", url: "https://nowtb.com/sell-your-home/" },
          { name: "Realtor Commission in Tampa Bay", url: CANONICAL },
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
            "Real estate brokerage compensation for home sellers in Tampa Bay, Florida",
        })}
      />

      <HeroSection
        label="Tampa Bay Listing Agreements"
        title="Realtor Commission in Tampa Bay: How It Actually Works"
        subtitle="There is no standard rate in Florida. Here is what is negotiable, what the 2024 practice changes did, and how to compare two proposals honestly."
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+18137337907"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold px-7 py-3 rounded-lg text-sm hover:bg-light transition-colors"
          >
            Call or Text (813) 733-7907
          </a>
          <Link
            href="#written-proposal"
            className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-7 py-3 rounded-lg text-sm hover:bg-white hover:text-primary transition-colors"
          >
            Ask Me for a Written Proposal
          </Link>
        </div>
      </HeroSection>

      {/* === Direct answer === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              <strong>
                There is no standard real estate commission in Florida.
              </strong>{" "}
              Compensation is negotiable in every single transaction and is not
              set by statute, by any brokerage, or by any REALTOR&reg;
              association. Two costs on your closing statement <em>are</em> fixed
              by law, the deed documentary stamp tax at $0.70 per $100 under
              Florida Statute 201.02, and the owner&apos;s title insurance
              premium, which Florida promulgates by rule. Compensation is not one
              of them.
            </p>
            <p>
              Since the National Association of REALTORS&reg; practice changes
              took effect on <strong>August 17, 2024</strong>, offers of
              compensation to a buyer&apos;s broker cannot be published through
              the MLS, and buyers must have a written agreement with their agent
              before touring a home. Anything you contribute toward the
              buyer&apos;s side is now a term you evaluate inside a specific
              offer, like any other concession.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === No standard rate, expanded === */}
      <section className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            Is there a standard real estate commission in Florida?
          </h2>
          <p className="font-body text-dark mb-4 leading-relaxed">
            No, and I am not being cagey. Setting or suggesting a uniform rate
            across brokerages is exactly the conduct antitrust law exists to
            prevent, which is why no Florida statute, no multiple listing
            service and no association publishes one. If a site hands you a
            confident percentage and calls it the going rate, it is either
            repeating a figure it has no authority to set, or it is selling you
            something.
          </p>
          <p className="font-body text-dark mb-4 leading-relaxed">
            What that means practically is that your number is whatever appears
            in your listing agreement, agreed before the home goes live. I will
            tell you mine when we talk, in writing, with what it covers itemized
            next to it. What I will not do is publish a figure here and let you
            treat it as the market rate, because it is not one.
          </p>
          <p className="font-body text-dark leading-relaxed">
            The useful question is not &ldquo;what is the rate.&rdquo; It is
            &ldquo;what is my net at a realistic sale price, on a realistic
            timeline, from this specific agent.&rdquo; That question has an
            answer, and you can make two agents compete on it. The{" "}
            <Link
              href="/sell/how-much-does-it-cost-to-sell-a-house-in-hillsborough-county/"
              className="text-link hover:underline"
            >
              Hillsborough County cost-to-sell breakdown
            </Link>{" "}
            gives you every other line on that net sheet so compensation is the
            only variable left.
          </p>
        </div>
      </section>

      {/* === Before / after table === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What changed after the 2024 NAR settlement?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Four things, effective August 17, 2024. Most seller-facing coverage
            overstated this. Compensation was negotiable before and it is
            negotiable now; what moved is where it is discussed and documented.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Before Aug 17, 2024
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    After
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    What it means for you
                  </th>
                </tr>
              </thead>
              <tbody>
                {beforeAfter.map((r) => (
                  <tr key={r.topic} className="border-b border-border align-top">
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                      {r.topic}
                    </td>
                    <td className="font-body text-muted py-3 pr-4 text-sm">
                      {r.before}
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm">
                      {r.after}
                    </td>
                    <td className="font-body text-muted py-3 text-sm">
                      {r.seller}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === Fee structures table === */}
      <section className="container-wide py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            How are listing fees structured?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Five structures you are likely to be offered in Tampa Bay. None of
            them is inherently better. The column that matters is the last one,
            because that is where proposals hide their differences.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Structure
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    How it works
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    What to pin down in writing
                  </th>
                </tr>
              </thead>
              <tbody>
                {feeStructures.map((f) => (
                  <tr
                    key={f.structure}
                    className="border-b border-border align-top"
                  >
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                      {f.structure}
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm">
                      {f.how}
                    </td>
                    <td className="font-body text-muted py-3 text-sm">
                      {f.watch}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === Comparing proposals === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            How do I compare two listing proposals?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Ask both agents the same six questions and write the answers down.
            The difference between proposals is almost never the headline number
             it is what is in column two.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[660px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Ask this
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    A straight answer looks like
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposalQuestions.map((q) => (
                  <tr key={q.ask} className="border-b border-border align-top">
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                      {q.ask}
                    </td>
                    <td className="font-body text-muted py-3 text-sm">
                      {q.good}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            One more test that costs nothing: ask each agent what they would
            change about your house before it goes live, and whether they would
            tell you not to list. An agent who will only agree with you is not
            giving you information. That is also most of why listings expire 
            see{" "}
            <Link
              href="/sell/why-didnt-my-house-sell/"
              className="text-link hover:underline"
            >
              why a Tampa Bay listing does not sell
            </Link>
            .
          </p>
        </div>
      </section>

      {/* === FSBO === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What happens if I sell without an agent?
          </h2>
          <p className="font-body text-dark mb-4 leading-relaxed">
            You keep whatever you would have paid a listing broker, and you take
            on the work. According to the National Association of
            REALTORS&reg; 2025 Profile of Home Buyers and Sellers,
            for-sale-by-owner transactions fell to 5 percent of all sales, an
            all-time low, while a record 91 percent of sellers used an agent.
            NAR reported a FSBO median price of $360,000 against $425,000 for
            agent-assisted sales, but NAR itself cautions that FSBO sales skew
            toward lower-cost property types and rural locations, so that gap is
            not evidence of a $65,000 agent premium and I am not going to
            present it as one.
          </p>
          <p className="font-body text-dark leading-relaxed">
            The honest case for representation is not the price gap. It is that
            pricing, Florida seller disclosure liability, escrow handling,
            inspection renegotiation and appraisal defense are five specialized
            jobs, and if you do not do them, nobody does. If you want to see what
            that work looks like before you decide, read how I run a listing on
            the{" "}
            <Link href="/sell-your-home/" className="text-link hover:underline">
              sell your home
            </Link>{" "}
            page or in{" "}
            <Link
              href="/brandon-listing-agent/"
              className="text-link hover:underline"
            >
              Brandon
            </Link>
            .
          </p>
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8 mt-8">
            <h3 className="heading-section text-base text-primary mb-2">
              The two numbers that make the fee question answerable
            </h3>
            <p className="font-body text-muted text-sm leading-relaxed">
              A fee is meaningless without a price and a timeline. Get both:{" "}
              <Link
                href="/sell/what-is-my-house-worth-tampa-bay/"
                className="text-link hover:underline"
              >
                what your house is worth in Tampa Bay
              </Link>{" "}
              and{" "}
              <Link
                href="/sell/sell-my-house-fast-tampa-bay/"
                className="text-link hover:underline"
              >
                what selling fast actually costs you
              </Link>
              . Then the comparison is apples to apples.
            </p>
          </div>
        </div>
      </section>

      {/* === Lead form === */}
      <section id="written-proposal" className="container-wide py-16">
        <div className="max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="/sell/realtor-commission-tampa-bay/"
            type="valuation"
            title="Ask me for a written listing proposal"
            submitLabel="Send Me a Proposal"
          />
          <p className="font-body text-muted text-sm text-center mt-6 leading-relaxed">
            You will get the fee in writing, itemized against what it covers,
            plus a net sheet at a realistic price. Call or text{" "}
            <a
              href="tel:+18137337907"
              className="text-link hover:underline font-semibold"
            >
              (813) 733-7907
            </a>
            . Barrett Henry, Licensed Florida Real Estate Broker, REMAX Collective, license
            BK3313308, with 23+ years of real estate experience and the e-PRO,
            MRP and SRS designations. More background{" "}
            <Link href="/about/" className="text-link hover:underline">
              about Barrett
            </Link>
            .
          </p>
          <p className="font-body text-muted text-xs text-center mt-6 leading-relaxed">
            Real estate commissions and all brokerage compensation are fully
            negotiable and are not set by law, by any brokerage, or by any
            REALTOR&reg; association. Nothing on this page is legal, tax or
            accounting advice, and nothing here states or implies a standard,
            customary or recommended rate. Consult your own attorney and CPA
            before signing a listing agreement.
          </p>
        </div>
      </section>

      <FaqSection
        heading="Tampa Bay commission questions sellers ask"
        faqs={faqs}
      />

      <SourcesSection sources={sources} />
    </>
  );
}
