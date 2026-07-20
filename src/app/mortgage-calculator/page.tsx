// =============================================================================
// /mortgage-calculator — Server component with metadata
// Renders the client-side MortgageCalc component for interactive calculators
// =============================================================================

import type { Metadata } from "next";
import MortgageCalc from "@/components/ui/MortgageCalc";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Mortgage Calculator | Estimate Your Monthly Payment",
  description:
    "Use our free mortgage calculator to estimate your monthly payment or find out how much home you can afford in Tampa Bay. Includes property tax, insurance, and PMI estimates. Call Barrett Henry at (813) 733-7907.",
  alternates: {
    canonical: "/mortgage-calculator/",
  },
  openGraph: {
    title: "Mortgage Calculator | Estimate Your Monthly Payment",
    description:
      "Free mortgage calculator with monthly payment and affordability tools. Estimate your Tampa Bay home payment instantly.",
    type: "website",
  },
};

export default function MortgageCalculatorPage() {
  return (
    <>
      {/* FAQPage schema — common mortgage questions for SEO/AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much house can I afford?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A common guideline is the 28% front-end debt-to-income (DTI) rule: your monthly housing payment — including principal, interest, taxes, and insurance — should not exceed 28% of your gross monthly income. For example, if your household earns $7,000 per month, aim for a total housing payment of $1,960 or less. Lenders also look at your total DTI (all debts), which should generally stay below 36-43%.",
                },
              },
              {
                "@type": "Question",
                name: "What is PMI and when can I remove it?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Private Mortgage Insurance (PMI) is required on conventional loans when you put down less than 20%. It protects the lender — not you — if you default. PMI typically costs 0.5% to 1% of the loan amount per year. You can request PMI removal once you reach 20% equity in your home, and your lender is required to automatically cancel it when you reach 22% equity based on the original purchase price.",
                },
              },
              {
                "@type": "Question",
                name: "What's the difference between fixed and adjustable rate mortgages?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A fixed-rate mortgage locks your interest rate for the entire loan term (typically 15 or 30 years), so your principal and interest payment never changes. An adjustable-rate mortgage (ARM) starts with a lower introductory rate for a set period (commonly 5 or 7 years), then adjusts periodically based on market indexes. Fixed rates offer predictability; ARMs offer lower initial payments but carry the risk of higher payments after the introductory period ends.",
                },
              },
              {
                "@type": "Question",
                name: "How much should I put down on a house in Florida?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Down payment requirements in Florida depend on the loan type. FHA loans require as little as 3.5% down. VA loans (for eligible veterans and active military) require 0% down. Conventional loans start at 3% down for first-time buyers. Putting 20% or more down eliminates the need for private mortgage insurance (PMI) and gives you instant equity. Your ideal down payment depends on your savings, monthly budget, and loan program.",
                },
              },
              {
                "@type": "Question",
                name: "What closing costs should I expect in Florida?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Closing costs in Florida typically range from 2% to 5% of the purchase price. For buyers, this includes lender fees, appraisal, title insurance, title search, recording fees, prepaid property taxes, and homeowners insurance. On a $400,000 home, expect $8,000 to $20,000 in closing costs. Florida does not have a state transfer tax for buyers, but sellers pay documentary stamp taxes. Your lender will provide a Loan Estimate within three days of your application with itemized closing cost projections.",
                },
              },
            ],
          }),
        }}
      />

      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Mortgage Calculator", item: "https://nowtb.com/mortgage-calculator" },
            ],
          }),
        }}
      />

      <MortgageCalc />

      {/* CTA */}
      <section className="bg-[#003da5] py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-heading font-bold mb-4">Ready to Get Pre-Approved?</h2>
          <p className="text-blue-100 mb-6 font-body">Barrett Henry works with trusted local lenders who can get you pre-approved quickly. Know exactly what you can afford before you start looking.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="tel:8137500926" className="inline-block bg-white text-[#003da5] font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">(813) 750-0926</a>
            <a href="/lenders/" className="inline-block border-2 border-white/40 text-white font-bold py-3 px-8 rounded-lg hover:border-white transition-colors">See Preferred Lenders</a>
          </div>
        </div>
      </section>
    </>
  );
}
