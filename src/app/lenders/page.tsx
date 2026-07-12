// =============================================================================
// /lenders — Mortgage lenders resource page
// Full content: lender types, loan programs, choosing a lender, pre-approval
// checklist, Barrett's lender network, and FAQ
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Mortgage Lenders Tampa Bay | Barrett Henry, REALTOR",
  description:
    "Find the right mortgage lender for your Tampa Bay home purchase. Barrett Henry connects buyers with trusted local lenders for conventional, FHA, VA, USDA, and jumbo loans. Call (813) 733-7907.",
  alternates: {
    canonical: "/lenders/",
  },
  openGraph: {
    title: "Mortgage Lenders Tampa Bay | Barrett Henry, REALTOR",
    description:
      "Trusted mortgage lender referrals from a Broker Associate with 23+ years of real estate experience. No kickbacks, no conflicts of interest.",
    type: "website",
  },
};

// --- Types of lenders data ---
const lenderTypes = [
  {
    title: "Banks",
    description:
      "Traditional banks offer mortgage products alongside checking, savings, and other financial services. They tend to have strict underwriting guidelines but may offer rate discounts to existing customers. Best for buyers who want an all-in-one banking relationship.",
  },
  {
    title: "Credit Unions",
    description:
      "Member-owned credit unions often provide lower interest rates and reduced closing costs compared to large banks. Membership requirements vary, but many Tampa Bay credit unions are open to anyone who lives or works in the area. Worth exploring if you qualify.",
  },
  {
    title: "Mortgage Brokers",
    description:
      "Brokers shop your loan across multiple wholesale lenders to find the best rate and terms for your situation. They do not lend their own money. This comparison shopping can save you thousands over the life of the loan, especially if your profile does not fit a single lender's sweet spot.",
  },
  {
    title: "Direct Lenders",
    description:
      "Companies that originate and fund mortgages using their own capital. Direct lenders control the entire process from application to closing, which can mean faster underwriting and fewer surprises. Many of the lenders Barrett refers buyers to fall into this category.",
  },
];

// --- Loan types data ---
const loanTypes = [
  {
    name: "Conventional",
    minDown: "3%",
    creditFloor: "620+",
    highlight: "No upfront mortgage insurance with 20% down. Flexible terms from 10 to 30 years.",
    link: "/guides/fha-loan-guide",
  },
  {
    name: "FHA",
    minDown: "3.5%",
    creditFloor: "580+",
    highlight: "Government-backed with lower credit requirements. Popular with first-time buyers.",
    link: "/guides/fha-loan-guide",
  },
  {
    name: "VA",
    minDown: "0%",
    creditFloor: "No minimum (most lenders want 620+)",
    highlight: "Zero down payment for eligible veterans and active-duty service members. No PMI.",
    link: "/guides/va-home-loan-guide",
  },
  {
    name: "USDA",
    minDown: "0%",
    creditFloor: "640+",
    highlight: "Zero down payment in eligible rural and suburban areas. Income limits apply.",
    link: null,
  },
  {
    name: "Jumbo",
    minDown: "10-20%",
    creditFloor: "700+",
    highlight: "For loan amounts exceeding conforming limits. Requires strong credit and reserves.",
    link: null,
  },
  {
    name: "DSCR",
    minDown: "20-25%",
    creditFloor: "Varies",
    highlight: "Investor loans qualified by property cash flow, not personal income. No W-2s or tax returns required.",
    link: null,
  },
];

// --- Pre-approval checklist items ---
const preApprovalDocs = [
  "Government-issued photo ID (driver's license or passport)",
  "Social Security number for credit check authorization",
  "Pay stubs from the last 30 days",
  "W-2s and/or 1099s from the past two years",
  "Federal tax returns from the past two years",
  "Bank statements from the last two to three months (all pages)",
  "Proof of any additional income (rental income, alimony, disability, etc.)",
  "Documentation of debts: car loans, student loans, credit cards, child support",
  "Gift letter if using gifted funds for the down payment",
  "Divorce decree or separation agreement, if applicable",
];

// --- FAQ data ---
const faqs = [
  {
    question: "How do I know which type of lender is right for me?",
    answer:
      "It depends on your financial profile and goals. A mortgage broker can shop multiple lenders on your behalf, while a direct lender may close faster. Barrett helps you narrow the field by connecting you with a lender whose strengths match your situation — whether that is a first-time buyer needing FHA flexibility, a veteran qualifying for a VA loan, or an investor using DSCR financing.",
  },
  {
    question: "Does Barrett receive referral fees or kickbacks from lenders?",
    answer:
      "No. Barrett does not receive compensation of any kind from the lenders he recommends. His referrals are based entirely on track record, communication, and the lender's ability to close on time. The goal is to put you in the best position at the closing table.",
  },
  {
    question: "What credit score do I need to buy a home in Florida?",
    answer:
      "Most conventional loans require a minimum 620 credit score. FHA loans allow scores as low as 580 with a 3.5% down payment. VA loans have no official minimum, though most lenders look for 620 or higher. If your score needs work, Barrett can connect you with a credit repair specialist before you apply.",
  },
  {
    question: "How long does mortgage pre-approval take?",
    answer:
      "With all documentation ready, many lenders can issue a pre-approval letter within 24 to 48 hours. Some offer same-day pre-approvals for straightforward applications. Getting your documents organized ahead of time — tax returns, pay stubs, bank statements — makes the process significantly faster.",
  },
  {
    question: "Should I get pre-approved before looking at homes?",
    answer:
      "Absolutely. Pre-approval tells you exactly how much you can afford, strengthens your offer in a competitive market, and shows sellers you are a serious buyer. In Tampa Bay's market, many listing agents will not schedule a showing without a pre-approval letter on file.",
  },
];

export default function LendersPage() {
  return (
    <>
      {/* === Structured data: BreadcrumbList === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Mortgage Lenders", item: "https://nowtb.com/lenders" },
            ],
          }),
        }}
      />

      {/* === Structured data: FAQPage === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* === Hero === */}
      <HeroSection
        title="Mortgage Lenders"
        subtitle="Find the right lender, lock in the best rate, and close with confidence."
      />

      {/* === Intro section === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-6">
            Why Your Lender Matters as Much as Your Home
          </h2>
          <div className="font-body text-muted space-y-4 text-lg">
            <p>
              Choosing the right mortgage lender can save you tens of thousands of
              dollars over the life of your loan. Interest rates, closing costs,
              lender fees, and communication quality vary dramatically from one
              company to the next. A lender who is slow to respond or sloppy with
              paperwork can cost you the home you want — especially in a competitive
              market where sellers expect fast, clean closings.
            </p>
            <p>
              With 23+ years of real estate experience, Barrett Henry has worked with
              every type of lender and knows which ones deliver. He connects buyers
              with mortgage professionals who have proven track records for competitive
              rates, responsive communication, and on-time closings. Call{" "}
              <a href="tel:+18137337907" className="text-accent font-medium">
                (813) 733-7907
              </a>{" "}
              for a personalized lender referral based on your specific situation.
            </p>
          </div>
        </div>
      </section>

      {/* === Types of Lenders === */}
      <section className="section-light py-16">
        <div className="container-wide">
          <h2 className="heading-section text-display-sm text-primary text-center mb-12">
            What Types of Mortgage Lenders Are There?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {lenderTypes.map((lender) => (
              <div key={lender.title} className="border border-border p-8">
                <h3 className="heading-section text-lg text-primary mb-3">
                  {lender.title}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {lender.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Loan Types Overview === */}
      <section className="container-wide py-16">
        <h2 className="heading-section text-display-sm text-primary text-center mb-4">
          Which Loan Program Is Right for You?
        </h2>
        <p className="font-body text-muted text-center max-w-2xl mx-auto mb-12">
          Each loan program has different requirements and benefits. Here is a
          quick comparison to help you start the conversation with your lender.
        </p>
        {/* Responsive table wrapper */}
        <div className="overflow-x-auto max-w-5xl mx-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                  Loan Type
                </th>
                <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                  Min. Down Payment
                </th>
                <th className="font-heading text-primary py-3 pr-4 text-sm uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="font-heading text-primary py-3 text-sm uppercase tracking-wider">
                  Key Benefit
                </th>
              </tr>
            </thead>
            <tbody>
              {loanTypes.map((loan) => (
                <tr key={loan.name} className="border-b border-border">
                  <td className="font-body text-primary font-medium py-4 pr-4 text-sm">
                    {loan.link ? (
                      <Link href={loan.link} className="text-link hover:underline">
                        {loan.name}
                      </Link>
                    ) : (
                      loan.name
                    )}
                  </td>
                  <td className="font-body text-muted py-4 pr-4 text-sm">
                    {loan.minDown}
                  </td>
                  <td className="font-body text-muted py-4 pr-4 text-sm">
                    {loan.creditFloor}
                  </td>
                  <td className="font-body text-muted py-4 text-sm">
                    {loan.highlight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-8 space-x-4">
          <Link href="/mortgage-calculator" className="btn-primary inline-block">
            Mortgage Calculator
          </Link>
          <Link href="/guides/florida-hometown-heroes-program" className="btn-outline inline-block">
            Hometown Heroes Program
          </Link>
        </div>
      </section>

      {/* === How to Choose the Right Lender === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-8">
            How Do You Choose the Right Mortgage Lender?
          </h2>
          <div className="font-body text-muted space-y-4 text-lg">
            <p>
              Start by getting quotes from at least two or three lenders. Compare
              the Loan Estimate documents side by side — not just the interest
              rate, but the full picture: origination fees, discount points,
              third-party charges, and estimated closing costs. A lender with a
              slightly higher rate but lower fees may actually cost you less.
            </p>
            <p>
              Beyond the numbers, pay attention to responsiveness. Does the loan
              officer return calls the same day? Do they explain things clearly
              without industry jargon? Are they available on evenings and weekends
              when deals happen? In Tampa Bay&apos;s competitive market, a slow
              lender can torpedo an otherwise solid offer.
            </p>
            <p>
              Ask about their average time from application to clear-to-close.
              Most lenders should be able to close a purchase loan in 30 days or
              less. If they are quoting 45 to 60 days, that is a red flag — and
              it may make your offer less attractive to sellers.
            </p>
            <p>
              Finally, ask your REALTOR for recommendations. Barrett has closed
              hundreds of transactions and knows which lenders perform
              consistently. His referrals are based on results, not commissions.
            </p>
          </div>
        </div>
      </section>

      {/* === What to Bring to Pre-Approval === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-4">
            What Should You Bring to Pre-Approval?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Getting pre-approved before you start house hunting gives you a
            clear budget, strengthens your offer, and speeds up closing. Here is
            what most lenders will ask for on day one.
          </p>
          <ul className="space-y-3 max-w-2xl mx-auto">
            {preApprovalDocs.map((doc) => (
              <li key={doc} className="flex items-start gap-3">
                {/* Checkmark bullet */}
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold mt-0.5">
                  &#10003;
                </span>
                <span className="font-body text-muted text-sm">{doc}</span>
              </li>
            ))}
          </ul>
          <p className="font-body text-muted text-center mt-8 text-sm">
            Self-employed? You may also need a profit and loss statement and
            business tax returns. Ask your lender for their specific checklist.
          </p>
        </div>
      </section>

      {/* === Mid-article CTA === */}
      <section className="bg-primary py-12">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-white text-2xl mb-4">
            Need a Lender Referral?
          </h2>
          <p className="font-body text-white/70 mb-6">
            Barrett connects buyers with mortgage professionals who close on
            time, communicate clearly, and fight for the best rates. No
            kickbacks, no conflicts of interest — just trusted referrals from
            23+ years of real estate experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18137337907" className="btn-primary bg-accent hover:bg-accent/90 inline-block">
              Call (813) 733-7907
            </a>
            <Link href="/contact" className="btn-outline border-white text-white hover:bg-white/10 inline-block">
              Send a Message
            </Link>
          </div>
        </div>
      </section>

      {/* === Barrett's Lender Network === */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-8">
            How Does Barrett&apos;s Lender Network Work?
          </h2>
          <div className="font-body text-muted space-y-4 text-lg">
            <p>
              Over 23+ years in real estate, Barrett Henry has built relationships
              with mortgage professionals across every loan category —
              conventional, FHA, VA, USDA, jumbo, construction, and investor
              DSCR loans. These are not paid partnerships. Barrett does not
              receive referral fees, kickbacks, or any form of compensation from
              the lenders he recommends.
            </p>
            <p>
              When you ask Barrett for a lender referral, he matches you with a
              mortgage professional based on your specific needs. A first-time
              buyer with a 620 credit score has very different needs than a
              real estate investor purchasing a multi-unit property. Barrett
              considers your loan type, timeline, financial complexity, and
              communication preferences before making a recommendation.
            </p>
            <p>
              Every lender in Barrett&apos;s network has earned their spot through
              consistent performance: competitive rates, clear communication,
              and a track record of closing on time. If a lender drops the ball
              on a transaction, they lose their spot. It is that simple.
            </p>
          </div>
        </div>
      </section>

      {/* === FAQ Section === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-12">
            Frequently Asked Questions About Mortgage Lenders
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border border-border p-6">
                <h3 className="heading-section text-lg text-primary mb-3">
                  {faq.question}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Related Guides === */}
      <section className="container-wide py-16">
        <h2 className="heading-section text-display-sm text-primary text-center mb-8">
          Mortgage Guides and Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { href: "/mortgage-calculator", label: "Mortgage Calculator" },
            { href: "/guides/fha-loan-guide", label: "FHA Loan Guide" },
            { href: "/guides/va-home-loan-guide", label: "VA Home Loan Guide" },
            { href: "/guides/florida-hometown-heroes-program", label: "Hometown Heroes Program" },
            { href: "/contact", label: "Contact Barrett" },
            { href: "/sell-your-home", label: "Free Home Valuation" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card p-4 text-center hover:shadow-lg transition-shadow"
            >
              <span className="font-heading font-bold text-sm text-primary">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* === Contact Form === */}
      <section className="section-light py-16">
        <div className="container-wide max-w-2xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-2">
            Get a Lender Referral
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Tell Barrett about your financing needs and he will connect you with
            the right mortgage professional for your situation.
          </p>
          <ContactForm webhookUrl="/api/contact" source="lenders" />
        </div>
      </section>
    </>
  );
}
