// =============================================================================
// /sell/how-much-does-it-cost-to-sell-a-house-in-hillsborough-county
//
// WHAT THIS PAGE IS: the seller closing-cost page for Hillsborough County.
// It exists because nowtb.com had nothing matching "cost to sell a house" and
// cash-buyer sites owned the query. The thing that wins here is NOT word count
//, it is itemized dollar figures tied to a statute or a promulgated rate.
//
// WHY COUNTY-LEVEL: a competitor outranks a more thorough statewide page simply
// because its page says "Hillsborough" and ours said "Florida." Specificity is
// the lever.
//
// MATH RULE FOR THIS FILE: every dollar figure below is either (a) computed at
// render time from a rate that is set by statute or by the Florida
// Administrative Code, or (b) printed as an explicit range with the words
// "varies" nearby. Nothing is a remembered number. If you change a rate,
// change the constant, not the prose.
//
// ROUTING NOTE: this route is nested under /sell/. It MUST stay listed in BOTH
// :city flatten redirect lookaheads in next.config.mjs or it returns 200 in
// local dev and 404s on the live domain only.
//
// If it breaks, check:
//  - Page 404s on nowtb.com but works locally? The "sell" exclusion fell out of
//    one of the two lookaheads in next.config.mjs.
//  - A dollar figure looks wrong? Check RATES below first. The tables are
//    generated, so a wrong number almost always means a wrong constant.
//  - Form submits but no lead arrives? That is /api/contact + Turnstile, not
//    this file. Do not hand-roll a fetch here.
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

const SLUG = "sell/how-much-does-it-cost-to-sell-a-house-in-hillsborough-county";
const CANONICAL = `https://nowtb.com/${SLUG}/`;

// Title is capped at 44 characters on purpose: layout.tsx appends the 16-char
// " | Barrett Henry" suffix, and 44 + 16 = 60, the practical SERP limit.
const TITLE = "Cost to Sell a House in Hillsborough County";
const DESCRIPTION =
  "Every Hillsborough County seller cost itemized: $0.70 per $100 doc stamps, promulgated title rates, estoppel caps, plus a worked $400,000 example.";

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
// RATES, the only hand-entered numbers in this file. Everything else is math.
// =============================================================================
const RATES = {
  /** Fla. Stat. 201.02(1)(a): 70 cents per $100 "or portion thereof" of
   *  consideration, in every county EXCEPT Miami-Dade (Fla. Stat. 201.031). */
  DOC_STAMP_PER_100: 0.7,

  /** Fla. Admin. Code R. 69O-186.003, original owner's policy.
   *  $5.75 per thousand of liability on the first $100,000 ... */
  TITLE_FIRST_TIER_PER_1000: 5.75,
  TITLE_FIRST_TIER_CEILING: 100_000,
  /** ... then $5.00 per thousand from $100,000 up to $1 million. */
  TITLE_SECOND_TIER_PER_1000: 5.0,
  /** Minimum premium for all conveyances except multiple conveyances. */
  TITLE_MINIMUM_PREMIUM: 100,

  /** Fla. Stat. 28.24(13): clerk's recording charge. */
  RECORDING_FIRST_PAGE: 10.0,
  RECORDING_ADDITIONAL_PAGE: 8.5,

  /** Fla. Stat. 720.30851(6) base statutory caps for an HOA estoppel
   *  certificate. DBPR adjusts these for CPI every five years and publishes
   *  the adjusted figures, so treat these as the floor of the range. */
  ESTOPPEL_BASE_CAP: 250,
  ESTOPPEL_EXPEDITED_ADDITIONAL: 100,
  ESTOPPEL_DELINQUENT_ADDITIONAL: 150,
};

/** The sale price the worked example runs on. Chosen because it sits between
 *  the Brandon ($390,000) and Valrico ($427,000) single-family medians for the
 *  twelve months ending October 2026, so it is a realistic east Hillsborough
 *  number rather than a convenient round one. */
const EXAMPLE_PRICE = 400_000;

// --- Small helpers so the tables and the prose can never disagree ---

/** Doc stamps on the deed. The statute taxes each $100 "or portion thereof,"
 *  so a $400,050 price is taxed on 4,001 units, not 4,000.5. */
function docStamps(price: number): number {
  return Math.ceil(price / 100) * RATES.DOC_STAMP_PER_100;
}

/** Promulgated owner's title policy premium at a given liability amount.
 *  Rates are per thousand "or fraction thereof," hence the Math.ceil. */
function ownersTitlePremium(liability: number): number {
  if (liability <= RATES.TITLE_FIRST_TIER_CEILING) {
    const p = Math.ceil(liability / 1000) * RATES.TITLE_FIRST_TIER_PER_1000;
    return Math.max(RATES.TITLE_MINIMUM_PREMIUM, p);
  }
  const firstTier =
    (RATES.TITLE_FIRST_TIER_CEILING / 1000) * RATES.TITLE_FIRST_TIER_PER_1000;
  const remainder = liability - RATES.TITLE_FIRST_TIER_CEILING;
  return (
    firstTier + Math.ceil(remainder / 1000) * RATES.TITLE_SECOND_TIER_PER_1000
  );
}

/** Whole-dollar currency, e.g. $2,800 */
function usd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/** Currency with cents, used where the statute produces a half-dollar. */
function usdCents(n: number): string {
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Price points for the rate tables. Each one is a real Tampa Bay median or a
// round number bracketing them, so the table is useful rather than decorative.
const PRICE_POINTS = [300_000, 350_000, 400_000, 427_000, 500_000, 609_000];

// Precomputed so both the table and the prose read from the same values.
const EX_DOC_STAMPS = docStamps(EXAMPLE_PRICE);
const EX_TITLE = ownersTitlePremium(EXAMPLE_PRICE);
const EX_RECORDING =
  RATES.RECORDING_FIRST_PAGE + RATES.RECORDING_ADDITIONAL_PAGE; // 2-page deed
const EX_FIXED_TOTAL = EX_DOC_STAMPS + EX_TITLE + EX_RECORDING;
const EX_SERVICE_LOW = 450; // closing/settlement fee + lien search, low end
const EX_SERVICE_HIGH = 1_100; // same two services, high end

// --- The master line-item table ---
const costLines = [
  {
    item: "Documentary stamp tax on the deed",
    amount: `${RATES.DOC_STAMP_PER_100.toFixed(2)} per $100 of price`,
    setBy: "Fla. Stat. 201.02(1)(a)",
    negotiable: "No, it is a tax. Who pays it is contractual.",
  },
  {
    item: "Owner's title insurance policy",
    amount: "$5.75 / $1,000 to $100K, then $5.00 / $1,000",
    setBy: "Fla. Admin. Code R. 69O-186.003",
    negotiable: "Rate no, payer yes",
  },
  {
    item: "Title search and closing (settlement) fee",
    amount: "Roughly $350 to $900, varies by closing agent",
    setBy: "The title company or closing attorney",
    negotiable: "Yes, shop it",
  },
  {
    item: "Municipal lien / estoppel search",
    amount: "Roughly $100 to $200, varies by vendor",
    setBy: "The search vendor",
    negotiable: "Yes",
  },
  {
    item: "Recording the deed",
    amount: `${usdCents(RATES.RECORDING_FIRST_PAGE)} first page, ${usdCents(
      RATES.RECORDING_ADDITIONAL_PAGE
    )} each additional`,
    setBy: "Fla. Stat. 28.24(13)",
    negotiable: "No",
  },
  {
    item: "HOA or condo estoppel certificate",
    amount: `Capped, ${usd(RATES.ESTOPPEL_BASE_CAP)} base, plus up to ${usd(
      RATES.ESTOPPEL_EXPEDITED_ADDITIONAL
    )} expedited`,
    setBy: "Fla. Stat. 720.30851(6) / 718.116(8)",
    negotiable: "No, but the cap protects you",
  },
  {
    item: "Prorated property taxes",
    amount: "Your actual annual bill, divided by day, see below",
    setBy: "Fla. Stat. 197.162 and your closing agent",
    negotiable: "No, but it is calculable",
  },
  {
    item: "Repairs or repair credits after inspection",
    amount: "Varies entirely, $0 on some sales, five figures on others",
    setBy: "Negotiated after the inspection period",
    negotiable: "Yes",
  },
  {
    item: "Brokerage compensation",
    amount: "Negotiated. No standard rate exists in Florida.",
    setBy: "Your listing agreement",
    negotiable: "Yes, always",
  },
  {
    item: "Payoff of your mortgage and any liens",
    amount: "Your payoff statement, including per-diem interest",
    setBy: "Your lender",
    negotiable: "No",
  },
];

const faqs: Faq[] = [
  {
    question: "How much does it cost to sell a house in Hillsborough County?",
    answer: `On a ${usd(
      EXAMPLE_PRICE
    )} Hillsborough County sale the costs that are fixed by statute or by promulgated rate come to about ${usd(
      EX_FIXED_TOTAL
    )}: ${usd(EX_DOC_STAMPS)} in documentary stamp tax on the deed, ${usd(
      EX_TITLE
    )} for the owner's title insurance policy, and ${usdCents(
      EX_RECORDING
    )} to record a two-page deed. Add a closing agent's settlement fee and a municipal lien search, usually ${usd(
      EX_SERVICE_LOW
    )} to ${usd(
      EX_SERVICE_HIGH
    )} together, and you are at roughly ${usd(
      EX_FIXED_TOTAL + EX_SERVICE_LOW
    )} to ${usd(
      EX_FIXED_TOTAL + EX_SERVICE_HIGH
    )}. On top of that sit your prorated property taxes, any HOA estoppel fee, any repair credits you agree to, and whatever brokerage compensation you negotiate.`,
  },
  {
    question: "What is the documentary stamp tax on a Florida deed?",
    answer:
      "Florida Statute 201.02(1)(a) sets the deed tax at 70 cents on each $100, or portion thereof, of the total consideration. Hillsborough, Pinellas, Pasco, Polk, Manatee and every other Florida county use that rate. Miami-Dade is the single exception: Florida Statute 201.031 charges 60 cents per $100 there, plus a 45-cent surtax that does not apply to single-family dwellings. By long-standing custom in Hillsborough County the seller pays the deed stamps, but that is custom, not law, and the contract controls.",
  },
  {
    question: "Who pays for title insurance in Hillsborough County?",
    answer:
      "In Hillsborough County the seller customarily pays for the owner's title insurance policy and generally selects the closing agent. That is a county custom, not a statute, nothing in the Florida Statutes says who must pay, and the purchase contract can assign it either way. The custom differs elsewhere in the state: Sarasota County, for example, customarily puts the owner's policy on the buyer. The premium itself is identical at every underwriter because Florida promulgates title rates by rule.",
  },
  {
    question: "How are Florida property taxes prorated when I sell?",
    answer:
      "Florida property taxes are assessed as of January 1 and cover that calendar year, but they are paid in arrears, the bill does not go out until on or about November 1. So at closing the seller is debited for January 1 through the day before closing and the buyer takes it from there. If you close before the current bill exists, the closing agent estimates from the prior year's bill, and Standard K of the FAR/BAR AS IS contract lets either party demand a re-proration once the real bill arrives. Florida Statute 197.162 also gives a 4 percent discount for paying in November, so ask your closing agent whether your estimate used the gross or the discounted figure.",
  },
  {
    question: "Can an HOA charge me whatever it wants for an estoppel letter?",
    answer:
      "No. Florida Statute 720.30851(6) caps the preparation and delivery fee for a homeowners association estoppel certificate at $250 when nothing is delinquent, with up to $100 more for expedited delivery within three business days and up to $150 more if the account is delinquent. The statute directs the Department of Business and Professional Regulation to adjust those caps for inflation every five years and publish the current figures, so budget a little above the statutory base. The association has 10 business days to deliver the certificate, and it stays valid for 30 days when delivered by hand or email.",
  },
];

const sources: Source[] = [
  {
    name: "Florida Statute 201.02(1)(a) and 201.031, Documentary Stamp Tax",
    used: "The 70 cents per $100 deed rate used in every table on this page, and the Miami-Dade exception.",
    href: "https://floridarevenue.com/taxes/taxesfees/pages/doc_stamp.aspx",
  },
  {
    name: "Florida Administrative Code R. 69O-186.003, Title Insurance Rates",
    used: "The promulgated owner's policy premium brackets ($5.75 per thousand to $100,000, then $5.00 per thousand), the $100 minimum premium, and the $25 minimum simultaneous-issue lender's policy charge.",
    href: "https://www.law.cornell.edu/regulations/florida/Fla-Admin-Code-Ann-R-69O-186-003",
  },
  {
    name: "Florida Statute 28.24(13), Clerk's Recording Charges",
    used: "The $10.00 first page and $8.50 each additional page recording charge for the deed.",
    href: "https://www.flsenate.gov/Laws/Statutes/2026/28.24",
  },
  {
    name: "Florida Statute 720.30851, HOA Estoppel Certificates",
    used: "The $250 base fee cap, the $100 expedited and $150 delinquent additions, the 10-business-day delivery deadline, the 30/35 day validity window, and the five-year CPI adjustment published by DBPR.",
    href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799%2F0720%2FSections%2F0720.30851.html",
  },
  {
    name: "Florida Statute 197.162, Discounts for Early Payment of Taxes",
    used: "The 4 percent November, 3 percent December, 2 percent January and 1 percent February discount schedule referenced in the proration section.",
    href: "https://www.flsenate.gov/Laws/Statutes/2026/197.162",
  },
  {
    name: "Stellar MLS closed sales via the Bridge API, twelve months ending October 2026",
    used: "The Brandon ($390,000) and Valrico ($427,000) single-family medians that set the $400,000 worked example. Rentals excluded.",
  },
];

export default function CostToSellHillsboroughPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com" },
          { name: "Sell", url: "https://nowtb.com/sell-your-home/" },
          { name: "Cost to Sell a House in Hillsborough County", url: CANONICAL },
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
          about: "Seller closing costs in Hillsborough County, Florida",
        })}
      />

      <HeroSection
        label="Hillsborough County Sellers"
        title="How Much Does It Cost to Sell a House in Hillsborough County?"
        subtitle="Every line item, with the statute or promulgated rate behind it, and a worked example on a $400,000 sale."
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+18137337907"
            className="inline-flex items-center justify-center bg-white text-primary font-semibold px-7 py-3 rounded-lg text-sm hover:bg-light transition-colors"
          >
            Call or Text (813) 733-7907
          </a>
          <Link
            href="#your-net-sheet"
            className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-7 py-3 rounded-lg text-sm hover:bg-white hover:text-primary transition-colors"
          >
            Get Your Net Sheet
          </Link>
        </div>
      </HeroSection>

      {/* === Direct answer with a real number in the first sentence === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          <QuickAnswer>
            <p>
              Selling a {usd(EXAMPLE_PRICE)} house in Hillsborough County costs
              about <strong>{usd(EX_FIXED_TOTAL)} in charges that are fixed by
              statute or by promulgated rate</strong> {usd(EX_DOC_STAMPS)} in
              documentary stamp tax on the deed, {usd(EX_TITLE)} for the owner&apos;s
              title insurance policy, and {usdCents(EX_RECORDING)} to record a
              two-page deed. Add a closing agent&apos;s settlement fee and a
              municipal lien search and most sellers land between{" "}
              {usd(EX_FIXED_TOTAL + EX_SERVICE_LOW)} and{" "}
              {usd(EX_FIXED_TOTAL + EX_SERVICE_HIGH)}.
            </p>
            <p>
              Four more items sit on top and none of them have a fixed number:
              prorated property taxes, an HOA or condo estoppel fee, any repair
              credits you agree to after inspection, and whatever brokerage
              compensation you negotiate. Florida has no standard commission
              rate, so no honest page can put a figure there for you.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* === Master line-item table === */}
      <section className="container-wide pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            Which closing costs does a Hillsborough County seller actually pay?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            Ten lines show up on a Hillsborough seller&apos;s closing statement.
            Three of them are set by law and cannot be shopped. Four are service
            fees you can absolutely shop. Three depend entirely on your house and
            your contract. Knowing which is which is most of the job.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Who sets it
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    Can you move it?
                  </th>
                </tr>
              </thead>
              <tbody>
                {costLines.map((c) => (
                  <tr key={c.item} className="border-b border-border align-top">
                    <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                      {c.item}
                    </td>
                    <td className="font-body text-dark py-3 pr-4 text-sm">
                      {c.amount}
                    </td>
                    <td className="font-body text-muted py-3 pr-4 text-sm">
                      {c.setBy}
                    </td>
                    <td className="font-body text-muted py-3 text-sm">
                      {c.negotiable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === Doc stamps + title by price point === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-4xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What do doc stamps and title insurance cost at my price?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            These two are the biggest fixed costs and both are pure arithmetic,
            so you can check my math. Documentary stamp tax is{" "}
            {RATES.DOC_STAMP_PER_100.toFixed(2)} per $100 of price under Florida
            Statute 201.02(1)(a). The owner&apos;s title policy premium is
            promulgated by the state under Rule 69O-186.003 at $5.75 per thousand
            on the first $100,000 of coverage and $5.00 per thousand after that,
            which is why every title company in Florida quotes you the identical
            premium. The price points below are the Tampa Bay medians plus round
            numbers bracketing them.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Sale price
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Deed doc stamps
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Owner&apos;s title policy
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    These two combined
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICE_POINTS.map((p) => {
                  const ds = docStamps(p);
                  const t = ownersTitlePremium(p);
                  return (
                    <tr key={p} className="border-b border-border">
                      <td className="font-body text-primary font-medium py-3 pr-4 text-sm whitespace-nowrap">
                        {usd(p)}
                      </td>
                      <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                        {usd(ds)}
                      </td>
                      <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                        {usd(t)}
                      </td>
                      <td className="font-body text-dark py-3 text-sm whitespace-nowrap">
                        {usd(ds + t)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            Two notes most pages skip. First, the statute taxes each $100 &ldquo;or
            portion thereof,&rdquo; so a $400,050 contract is taxed on 4,001
            increments, not 4,000.5. Second, when a buyer is financing, a
            lender&apos;s policy issued at the same time as the owner&apos;s
            policy costs a minimum of $25 rather than a second full premium 
            that simultaneous-issue rate is in the same rule.
          </p>
        </div>
      </section>

      {/* === Property tax proration, the differentiator === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            How are Florida property taxes prorated at closing?
          </h2>
          <p className="font-body text-dark mb-4 leading-relaxed">
            Florida real property taxes are assessed as of January 1 and cover
            that calendar year, but you pay them <strong>in arrears</strong> 
            the Tax Collector&apos;s bill does not go out until on or about
            November 1 for a year that is already almost over. That one fact
            drives the whole proration, and it is where most sellers get
            surprised.
          </p>
          <p className="font-body text-dark mb-4 leading-relaxed">
            At closing, the seller is debited for January 1 through the day
            before closing and the buyer picks it up from there. If you close in
            May, nobody has the current bill yet, so the closing agent estimates
            from the prior year&apos;s bill. Standard K of the FAR/BAR AS IS
            Residential Contract then lets either party demand a re-proration
            once the real bill shows up, and that provision survives closing. If
            your assessment jumped, new construction, a lost homestead cap, a
            big reassessment after a sale, that survival clause is the thing
            that protects you, and it is worth asking your closing agent to walk
            you through it in writing.
          </p>
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8 my-8">
            <h3 className="heading-section text-base text-primary mb-2">
              The question to ask your closing agent
            </h3>
            <p className="font-body text-dark text-sm leading-relaxed">
              Florida Statute 197.162 gives a 4 percent discount for paying in
              November, 3 percent in December, 2 percent in January and 1 percent
              in February, with no discount in March and delinquency on April 1.
              Ask whether your proration was figured on the gross tax or on the
              discounted November amount. On a four-figure tax bill the
              difference is real money, and it is a coin-flip which convention
              your closing agent used unless you ask.
            </p>
          </div>
          <p className="font-body text-dark leading-relaxed">
            I am deliberately not printing a Hillsborough County millage rate
            here. Published county millage figures disagree with each other
            depending on whether they include the school board, the city, and
            which special districts your parcel sits in, and a number that is
            wrong by two mills is worse than no number at all. Pull your actual
            annual tax amount off your most recent Hillsborough County Tax
            Collector bill, that is the figure your proration will be built
            from, and it is the only one that matters.
          </p>
        </div>
      </section>

      {/* === Worked example === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-4xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What does this add up to on a {usd(EXAMPLE_PRICE)} sale?
          </h2>
          <p className="font-body text-muted mb-8 leading-relaxed">
            {usd(EXAMPLE_PRICE)} is not a random round number. It sits between
            the Brandon single-family median of $390,000 and the Valrico median
            of $427,000 for closed sales over the twelve months ending October
            2026, so it is a realistic east Hillsborough sale.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    Line
                  </th>
                  <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                    On {usd(EXAMPLE_PRICE)}
                  </th>
                  <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                    Where the number comes from
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Deed documentary stamps
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                    {usd(EX_DOC_STAMPS)}
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    4,000 increments of $100 &times; $0.70 (Fla. Stat. 201.02)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Owner&apos;s title insurance policy
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                    {usd(EX_TITLE)}
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    $575 on the first $100,000, then 300 &times; $5.00 (Rule
                    69O-186.003)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Recording a two-page deed
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                    {usdCents(EX_RECORDING)}
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    $10.00 + $8.50 (Fla. Stat. 28.24)
                  </td>
                </tr>
                <tr className="border-b-2 border-primary bg-white">
                  <td className="font-body text-primary font-bold py-3 pr-4 text-sm">
                    Subtotal, fixed by law
                  </td>
                  <td className="font-body text-primary font-bold py-3 pr-4 text-sm whitespace-nowrap">
                    {usd(EX_FIXED_TOTAL)}
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    {((EX_FIXED_TOTAL / EXAMPLE_PRICE) * 100).toFixed(2)} percent
                    of the sale price
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Settlement fee + municipal lien search
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                    {usd(EX_SERVICE_LOW)}, {usd(EX_SERVICE_HIGH)}
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    Set by the closing agent. Shop this.
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Prorated property taxes
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                    Varies
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    Your annual bill &divide; 365 &times; days you owned it this
                    year
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    HOA or condo estoppel
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                    $0, {usd(RATES.ESTOPPEL_BASE_CAP)}+
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    $0 with no association; statutory cap applies if you have one
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Repairs or repair credits
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                    Varies
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    Negotiated after the inspection period
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="font-body text-primary font-medium py-3 pr-4 text-sm">
                    Brokerage compensation
                  </td>
                  <td className="font-body text-dark py-3 pr-4 text-sm whitespace-nowrap">
                    Negotiated
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    No standard rate exists in Florida. Your listing agreement
                    sets it.
                  </td>
                </tr>
                <tr className="border-b-2 border-primary bg-white">
                  <td className="font-body text-primary font-bold py-3 pr-4 text-sm">
                    Running total before taxes, HOA, repairs and compensation
                  </td>
                  <td className="font-body text-primary font-bold py-3 pr-4 text-sm whitespace-nowrap">
                    {usd(EX_FIXED_TOTAL + EX_SERVICE_LOW)}
                    {usd(EX_FIXED_TOTAL + EX_SERVICE_HIGH)}
                  </td>
                  <td className="font-body text-muted py-3 text-sm">
                    {(
                      ((EX_FIXED_TOTAL + EX_SERVICE_LOW) / EXAMPLE_PRICE) *
                      100
                    ).toFixed(2)}
                    
                    {(
                      ((EX_FIXED_TOTAL + EX_SERVICE_HIGH) / EXAMPLE_PRICE) *
                      100
                    ).toFixed(2)}{" "}
                    percent of the sale price
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-body text-muted text-sm mt-4 leading-relaxed">
            Note what this total does <em>not</em> include: your mortgage payoff.
            That is not a cost of selling, it is a debt you already owe, but it
            is the biggest number on the closing statement and it is the one
            sellers forget when they estimate their walk-away.
          </p>
        </div>
      </section>

      {/* === Commission, handled carefully === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            What about the commission?
          </h2>
          <p className="font-body text-dark mb-4 leading-relaxed">
            Brokerage compensation in Florida is negotiable and is not fixed by
            law, by my brokerage, or by any association. There is no standard
            rate, and any page that prints one as if it were the going number is
            telling you something that is not true. Since the National
            Association of REALTORS&reg; practice changes took effect on August
            17, 2024, compensation to a buyer&apos;s broker is also negotiated
            separately rather than published through the MLS, which means it is a
            second conversation rather than an assumption baked into your list
            price.
          </p>
          <p className="font-body text-dark mb-6 leading-relaxed">
            What I will do is put your actual number in writing before you sign
            anything, and show you what it does to your net at your likely sale
            price. I break the whole topic down on the{" "}
            <Link
              href="/sell/realtor-commission-tampa-bay/"
              className="text-link hover:underline"
            >
              Tampa Bay realtor commission
            </Link>{" "}
            page, including how to compare two listing proposals that are
            structured differently.
          </p>
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 md:p-8">
            <h3 className="heading-section text-base text-primary mb-2">
              Three things worth reading next
            </h3>
            <p className="font-body text-muted text-sm leading-relaxed">
              Costs only matter against a price, so start with{" "}
              <Link
                href="/sell/what-is-my-house-worth-tampa-bay/"
                className="text-link hover:underline"
              >
                what your house is worth in Tampa Bay
              </Link>
              . If you are trying to work out your calendar, see{" "}
              <Link
                href="/sell/how-long-does-it-take-to-sell-a-house-tampa-bay/"
                className="text-link hover:underline"
              >
                how long it takes to sell a house in Tampa Bay
              </Link>
              . And for the buyer&apos;s side of the same closing statement,
              there is a full walkthrough of{" "}
              <Link
                href="/blog/closing-costs-florida-what-buyers-sellers-actually-pay/"
                className="text-link hover:underline"
              >
                what buyers and sellers actually pay in Florida closing costs
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* === Local context + service area links === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-3">
            Does the number change by city inside Hillsborough County?
          </h2>
          <p className="font-body text-dark mb-4 leading-relaxed">
            The rates do not. Doc stamps, title premiums and recording charges
            are identical in{" "}
            <Link href="/valrico/" className="text-link hover:underline">
              Valrico
            </Link>
            ,{" "}
            <Link href="/brandon/" className="text-link hover:underline">
              Brandon
            </Link>{" "}
            and everywhere else in the county, because they are set at the state
            level. What changes is the price they are applied to, and that moves
            a lot: $390,000 in Brandon, $427,000 in Valrico, $392,500 in
            Riverview and $609,000 in Lithia for single-family closed sales over
            the twelve months ending October 2026. The same 1.2 percent of fixed
            cost is a different dollar amount in each.
          </p>
          <p className="font-body text-dark leading-relaxed">
            The other local variable is your association. A no-HOA sale skips the
            estoppel line entirely. A CDD community in Riverview or FishHawk adds
            a bond balance the buyer needs disclosed, which is a disclosure issue
            rather than a cost, but it is one that kills contracts late when
            nobody raised it early.
          </p>
        </div>
      </section>

      {/* === Lead form === */}
      <section id="your-net-sheet" className="container-wide py-16">
        <div className="max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="/sell/how-much-does-it-cost-to-sell-a-house-in-hillsborough-county/"
            type="valuation"
            title="Get your Hillsborough County net sheet"
            submitLabel="Send Me My Net Sheet"
          />
          <p className="font-body text-muted text-sm text-center mt-6 leading-relaxed">
            Tell me the address and I will run every line above against your
            actual tax bill, your actual association and a current price. Or call
            or text me directly at{" "}
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
            </Link>{" "}
            or read how I approach a listing on my{" "}
            <Link href="/sell-your-home/" className="text-link hover:underline">
              sell your home
            </Link>{" "}
            page.
          </p>
          <p className="font-body text-muted text-xs text-center mt-6 leading-relaxed">
            This page is general information about Florida closing costs, not
            legal, tax or accounting advice. Statutes, promulgated rates and
            county customs change. Confirm your own figures with your closing
            agent, your attorney and your CPA before you rely on them.
          </p>
        </div>
      </section>

      <FaqSection
        heading="Hillsborough County seller cost questions"
        faqs={faqs}
      />

      <SourcesSection sources={sources} />
    </>
  );
}
