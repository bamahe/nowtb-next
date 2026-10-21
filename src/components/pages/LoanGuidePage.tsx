// =============================================================================
// LoanGuidePage, Loan type information pages
// Rendered inside the [citySlug] route for slugs like /fha-loan-florida,
// /va-loan-florida, /usda-loan-florida, etc. (8 loan type pages)
// =============================================================================

// next/link is needed for the new hero CTA. Internal navigation must use
// <Link>, not a bare <a>, so Next can client-side route and prefetch.
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";
import type { LoanFAQ } from "@/data/loan-content";

interface LoanGuidePageProps {
  /** Display name of the loan type (e.g. "FHA Loan") */
  loanType: string;
  /** URL slug for the page (e.g. "fha-loan-florida") */
  slug: string;
  /** Short description of the loan program (supports multiple paragraphs separated by \n\n) */
  description?: string;
  /** Eligibility requirements as bullet points */
  requirements?: string[];
  /** Key benefits as bullet points */
  benefits?: string[];
  /** Frequently asked questions with answers */
  faq?: LoanFAQ[];
  /** Insider tips from a broker's perspective */
  proTips?: string[];
}

// --- The other 7 loan guide pages, for sibling cross-linking ---
//
// These slugs are served by src/app/[citySlug]/page.tsx (its LOAN_TYPES array,
// parseSlug step 2). Keep this list in sync with that one, if a slug here is
// not in that array, the link is a hard 404.
//
// Every href is written with a trailing slash. next.config.mjs sets
// `trailingSlash: true`, so "/fha-loan-florida" is never served: it is answered
// with a 308 redirect to "/fha-loan-florida/".
const ALL_LOAN_GUIDES = [
  { slug: "fha-loan-florida", label: "FHA Loans in Florida" },
  { slug: "va-loan-florida", label: "VA Loans in Florida" },
  { slug: "usda-loan-florida", label: "USDA Loans in Florida" },
  { slug: "conventional-loan-florida", label: "Conventional Loans in Florida" },
  { slug: "jumbo-loan-florida", label: "Jumbo Loans in Florida" },
  { slug: "renovation-loan-florida", label: "Renovation Loans in Florida" },
  { slug: "reverse-mortgage-florida", label: "Reverse Mortgages in Florida" },
  { slug: "construction-loan-florida", label: "Construction Loans in Florida" },
];

// --- Three Tier 1 cities where this financing gets used most ---
// Hand-picked rather than generated: these are Barrett's core markets and all
// three have a "-homes-for-sale" spoke in src/data/cities.ts.
const CORE_MARKET_LINKS = [
  { href: "/brandon-homes-for-sale/", label: "Brandon Homes for Sale" },
  { href: "/riverview-homes-for-sale/", label: "Riverview Homes for Sale" },
  { href: "/valrico-homes-for-sale/", label: "Valrico Homes for Sale" },
];

export default function LoanGuidePage({
  loanType,
  slug,
  description,
  requirements = [],
  benefits = [],
  faq = [],
  proTips = [],
}: LoanGuidePageProps) {
  const agent = getPrimaryAgent();

  // ------------------------------------------------------------------
  // OUTBOUND LINKS, why this page needed them badly.
  //
  // These 8 loan guides were a link SINK. They hold roughly 56,858 contextual
  // inbound links between them (/fha-loan-florida/ alone has ~14,165) and
  // passed exactly none of it onward: zero outbound contextual links and zero
  // links to any lead-capture page. All that accumulated authority stopped
  // here instead of flowing to the pages that actually convert.
  //
  // Fixed below with: sibling loan guides (a buyer comparing FHA vs
  // conventional is the single most common journey on these pages), the
  // pre-approval guide, the property search, and real conversion pages.
  //
  // If it breaks, check: a sibling tile 404s => its slug is missing from the
  // LOAN_TYPES array in src/app/[citySlug]/page.tsx. That array, not this one,
  // is what decides whether the URL resolves.
  const siblingLoanGuides = ALL_LOAN_GUIDES.filter((l) => l.slug !== slug).slice(0, 4);

  // Default content when specific loan data isn't provided yet
  const defaultDescription = `A ${loanType} is a popular mortgage option for Florida homebuyers. Barrett Henry, Broker Associate at REMAX Collective, can connect you with trusted lenders who specialize in ${loanType}s and help you navigate the home-buying process from pre-approval to closing.`;

  const defaultRequirements = [
    "Meet minimum credit score requirements set by the program",
    "Provide proof of stable income and employment",
    "Meet debt-to-income ratio guidelines",
    "Complete any program-specific education or certification requirements",
    "Property must meet program appraisal standards",
  ];

  const defaultBenefits = [
    "Competitive interest rates compared to conventional loans",
    "Lower down payment requirements for qualified buyers",
    "More flexible credit score guidelines",
    "Available at most major lenders and credit unions in Florida",
    "Can be combined with down payment assistance programs",
  ];

  const displayRequirements =
    requirements.length > 0 ? requirements : defaultRequirements;
  const displayBenefits = benefits.length > 0 ? benefits : defaultBenefits;

  return (
    <>
      {/* --- JSON-LD BreadcrumbList for SEO --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://nowtb.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: `${loanType} in Florida`,
                // Trailing slash: with `trailingSlash: true` the canonical URL
                // ends in "/", so the slash-less form in a schema `item` points
                // at a 308 redirect instead of at the page itself.
                item: `https://nowtb.com/${slug}/`,
              },
            ],
          }),
        }}
      />

      {/* === Hero section ===
           HeroSection takes a `children` slot for CTA buttons (see its props in
           src/components/ui/HeroSection.tsx). This template previously passed
           nothing, so all 8 loan guide pages rendered with no above-the-fold
           call to action at all, the only phone number was in the final
           section, past ~1,000 words of loan requirements and FAQs.

           Note on `hidden md:block`: deliberately NOT used on the phone link.
           A mortgage question is exactly the kind of thing someone taps to ask
           about from a phone, so the number has to be visible on small screens.
           Buttons stack full-width on mobile, sit side by side from `sm:` up. */}
      <HeroSection
        title={`${loanType} in Florida`}
        subtitle={`Everything you need to know about using a ${loanType} to buy a home in Florida. Expert guidance from Barrett Henry, REALTOR® at REMAX Collective.`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          {/* tel: hrefs must be bare digits, the stripping regex turns
              "(813) 733-7907" into "8137337907". Spaces and parens in a tel:
              href stop iOS/Android recognising it as a number. The readable
              formatting stays in the link text. */}
          <a
            href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
            className="inline-flex items-center justify-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors"
          >
            Call {agent.phone}
          </a>
          {/* /buyers/ is the conversion page for loan traffic: someone reading
              about an FHA loan is a buyer, not a seller. Route confirmed to
              exist at src/app/buyers/page.tsx. */}
          <Link
            href="/buyers/"
            className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors"
          >
            Start Your Home Search
          </Link>
        </div>
      </HeroSection>

      {/* === How this loan works === */}
      <section className="container-wide py-12">
        <div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            How a {loanType} Works
          </h2>
          <div className="prose font-body text-dark max-w-none space-y-4">
            {/* Render multi-paragraph descriptions (split on double newlines) */}
            {(description || defaultDescription).split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {/* Only show generic filler paragraph when no specific description is provided */}
            {!description && (
              <p>
                With 23+ years of real estate experience, Barrett has guided
                hundreds of buyers through the financing process. He works with a
                network of lenders who can get you the best rate and terms for
                your {loanType}.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* === Eligibility requirements === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            {loanType} Eligibility Requirements
          </h2>
          <ul className="space-y-3">
            {displayRequirements.map((req, index) => (
              <li key={index} className="flex items-start gap-3">
                {/* Checkmark icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-accent flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-body text-dark">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* === Benefits === */}
      <section className="container-wide py-12">
        <div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            Benefits of a {loanType}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayBenefits.map((benefit, index) => (
              <div key={index} className="card p-5 flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-accent text-sm">
                    {index + 1}
                  </span>
                </div>
                <span className="font-body text-dark text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FAQ section (only rendered when FAQ data is provided) === */}
      {faq.length > 0 && (
        <>
          <section className="bg-gray-50 py-12">
            <div className="container-wide">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
                Frequently Asked Questions About {loanType}s in Florida
              </h2>
              <div className="space-y-6">
                {faq.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="font-heading font-semibold text-lg text-dark mb-2">
                      {item.question}
                    </h3>
                    <p className="font-body text-muted leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- FAQPage JSON-LD schema for SEO/AEO --- */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faq.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                  },
                })),
              }),
            }}
          />
        </>
      )}

      {/* === Next steps, contextual outbound links ===
           Placed straight after the benefits, which is where a reader has
           decided this program might fit and wants to do something about it.
           Keyword anchors only, never "click here". */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
          Your Next Step With a {loanType}
        </h2>
        <div className="prose font-body text-dark max-w-none space-y-4">
          <p>
            Before you shop, get the two numbers that decide everything: what
            you can borrow and what the payment actually costs. Barrett&apos;s{" "}
            {/* Anchor text deliberately avoids the bare phrase "mortgage
                calculator". That exact anchor already fires ~48,000 times
                sitewide from one boilerplate block, and identical exact-match
                anchor text at that volume reads as manipulation. Same page,
                honest wording. */}
            <Link href="/mortgage-calculator/" className="text-link hover:underline">
              monthly payment estimator
            </Link>{" "}
            runs principal, interest, taxes, and insurance together, and the{" "}
            <Link
              href="/guides/mortgage-pre-approval-guide-florida/"
              className="text-link hover:underline"
            >
              Florida mortgage pre-approval guide
            </Link>{" "}
            covers what a lender will ask for and how long it takes.
          </p>
          <p>
            Once you have a number, start looking:{" "}
            <Link href="/properties/" className="text-link hover:underline">
              search Tampa Bay homes for sale
            </Link>{" "}
            by price, area, and features, or go straight to{" "}
            <Link href="/buyers/" className="text-link hover:underline">
              Barrett&apos;s home buyer resources
            </Link>{" "}
            for the full purchase timeline. Already own and want to know where
            you stand before you move up, refinance, or renovate? Get a{" "}
            <Link href="/free-home-valuation/" className="text-link hover:underline">
              free home valuation
            </Link>{" "}
            first, or{" "}
            <Link href="/contact/" className="text-link hover:underline">
              contact Barrett Henry
            </Link>{" "}
            to talk it through.
          </p>
        </div>

        {/* Sibling loan guides, the comparison journey.
            Capped at 4 (plus the 3 market links below) so this stays a useful
            related-links block rather than the 15-link spam pattern. */}
        <h3 className="font-heading font-bold text-lg text-primary mt-10 mb-4">
          Compare Other Florida Loan Programs
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {siblingLoanGuides.map((loan) => (
            <Link
              key={loan.slug}
              href={`/${loan.slug}/`}
              className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
            >
              {loan.label}
            </Link>
          ))}
        </div>

        {/* Where this financing actually gets used, hands some of this page's
            considerable inbound authority down to the city spoke pages. */}
        <h3 className="font-heading font-bold text-lg text-primary mt-8 mb-4">
          Where Buyers Use a {loanType} in Tampa Bay
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CORE_MARKET_LINKS.map((market) => (
            <Link
              key={market.href}
              href={market.href}
              className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
            >
              {market.label}
            </Link>
          ))}
        </div>
      </section>

      {/* === Pro Tips from Barrett (only rendered when tips are provided) === */}
      {proTips.length > 0 && (
        <section className="container-wide py-12">
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
              Insider Tips from Barrett Henry
            </h2>
            <div className="space-y-4">
              {proTips.map((tip, index) => (
                <div key={index} className="card p-5 border-l-4 border-accent">
                  <p className="font-body text-dark text-sm leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === CTA, Contact Barrett === */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Questions About {loanType}s in Florida?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry can connect you with trusted lenders and guide you
            through every step. Call{" "}
            <a
              href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
              className="text-accent font-semibold hover:underline"
            >
              {agent.phone}
            </a>{" "}
            or fill out the form below.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={slug}
          />
        </div>
      </section>
    </>
  );
}
