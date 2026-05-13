// =============================================================================
// LoanGuidePage — Loan type information pages
// Rendered inside the [citySlug] route for slugs like /fha-loan-florida,
// /va-loan-florida, /usda-loan-florida, etc. (8 loan type pages)
// =============================================================================

import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";

interface LoanGuidePageProps {
  /** Display name of the loan type (e.g. "FHA Loan") */
  loanType: string;
  /** URL slug for the page (e.g. "fha-loan-florida") */
  slug: string;
  /** Short description of the loan program */
  description?: string;
  /** Eligibility requirements as bullet points */
  requirements?: string[];
  /** Key benefits as bullet points */
  benefits?: string[];
}

export default function LoanGuidePage({
  loanType,
  slug,
  description,
  requirements = [],
  benefits = [],
}: LoanGuidePageProps) {
  const agent = getPrimaryAgent();

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
                item: `https://nowtb.com/${slug}`,
              },
            ],
          }),
        }}
      />

      {/* === Hero section === */}
      <HeroSection
        title={`${loanType} in Florida`}
        subtitle={`Everything you need to know about using a ${loanType} to buy a home in Florida. Expert guidance from Barrett Henry, REALTOR® at REMAX Collective.`}
      />

      {/* === How this loan works === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            How a {loanType} Works
          </h2>
          <div className="prose font-body text-dark max-w-none space-y-4">
            <p>{description || defaultDescription}</p>
            <p>
              With 23+ years of real estate experience, Barrett has guided
              hundreds of buyers through the financing process. He works with a
              network of lenders who can get you the best rate and terms for
              your {loanType}.
            </p>
          </div>
        </div>
      </section>

      {/* === Eligibility requirements === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide max-w-3xl">
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
        <div className="max-w-3xl mx-auto">
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

      {/* === CTA — Contact Barrett === */}
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
