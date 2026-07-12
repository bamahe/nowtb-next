// =============================================================================
// /free-home-valuation — Free CMA / home valuation landing page
// Full content page: hero, CMA vs online estimates, what's included,
// process steps, trust signals, and lead form
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// --- SEO metadata + Open Graph ---
export const metadata: Metadata = {
  title: "Free Home Valuation Tampa Bay | Barrett Henry, REALTOR",
  description:
    "Get a free, professional home valuation from Barrett Henry, Broker Associate at REMAX Collective. Accurate CMA — not a Zillow guess. Call (813) 733-7907.",
  alternates: {
    canonical: "/free-home-valuation/",
  },
  openGraph: {
    title: "Free Home Valuation | Barrett Henry, Broker Associate",
    description:
      "Find out what your Tampa Bay home is actually worth with a professional Comparative Market Analysis — free and no obligation.",
    type: "website",
  },
};

// --- What Barrett's CMA includes ---
const cmaIncludes = [
  {
    title: "Recent Comparable Sales",
    description:
      "Verified closed sales within your neighborhood and price range, pulled directly from Stellar MLS — not scraped from the internet.",
  },
  {
    title: "Active Competition Analysis",
    description:
      "Every home currently listed that a buyer would compare to yours. Pricing strategy starts with knowing what you are up against.",
  },
  {
    title: "Market Trend Data",
    description:
      "Days on market, price-per-square-foot trends, and list-to-sale ratios for your specific area so you can see where the market is heading.",
  },
  {
    title: "Property-Specific Adjustments",
    description:
      "Upgrades, lot size, condition, and unique features your home has that algorithms cannot account for. This is where human expertise matters most.",
  },
  {
    title: "Net Proceeds Estimate",
    description:
      "A realistic breakdown of what you can expect to walk away with after commissions, title fees, and closing costs.",
  },
];

// --- Steps to get your CMA ---
const steps = [
  {
    step: 1,
    title: "Submit Your Address",
    description:
      "Fill out the short form below with your property address and any details about upgrades or recent improvements.",
  },
  {
    step: 2,
    title: "Barrett Runs the Numbers",
    description:
      "Within 24 hours, Barrett pulls MLS data, reviews comps, and builds a detailed CMA tailored to your home.",
  },
  {
    step: 3,
    title: "Review Your Report",
    description:
      "You receive a clear, easy-to-read valuation report with a recommended price range and net proceeds estimate.",
  },
];

export default function FreeHomeValuationPage() {
  return (
    <>
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Free Home Valuation", item: "https://nowtb.com/free-home-valuation" },
            ],
          }),
        }}
      />

      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is a Comparative Market Analysis (CMA)?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A CMA is a professional home valuation prepared by a licensed REALTOR using recent comparable sales, active listings, and market data from the MLS. It gives you an accurate price range based on what buyers are actually paying in your area.",
                },
              },
              {
                "@type": "Question",
                name: "How is a CMA different from a Zillow Zestimate?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A Zestimate is an automated algorithm that uses public records and tax data. It cannot see inside your home or account for upgrades, condition, or neighborhood nuances. A CMA is prepared by a local expert who factors in all of these details for a more accurate valuation.",
                },
              },
              {
                "@type": "Question",
                name: "Is the home valuation really free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Barrett Henry provides CMAs at no cost and with no obligation. You are not required to list your home or sign any agreement to receive your valuation.",
                },
              },
              {
                "@type": "Question",
                name: "How long does it take to get my CMA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most CMAs are delivered within 24 hours of submitting your request. Barrett will contact you if he needs any additional details about your property.",
                },
              },
            ],
          }),
        }}
      />

      {/* ---- Hero ---- */}
      <HeroSection
        title="Free Home Valuation"
        label="NO COST | NO OBLIGATION"
        subtitle="Find out what your Tampa Bay home is actually worth — with a professional analysis from a Broker Associate with 23+ years of real estate experience."
      />

      {/* ---- Why Online Estimates Fall Short ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">The Problem</p>
            <h2 className="heading-section text-display-sm text-primary">
              Why Zillow and Redfin Estimates Miss the Mark
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-link">
            <p>
              Online home value tools like Zillow&apos;s Zestimate and Redfin&apos;s
              estimate use algorithms built on public tax records and limited data
              feeds. They have never walked through your home. They do not know about
              the kitchen renovation you finished last year, the new roof, or the
              fact that your lot backs up to a preserve with no rear neighbors.
            </p>
            <p>
              According to Zillow&apos;s own published data, the Zestimate has a
              national median error rate of roughly 6-7% for off-market homes. On a
              $400,000 property, that could mean a swing of $24,000 to $28,000 in
              either direction. That is a significant amount of money to leave on the
              table — or to overprice and sit on the market for weeks.
            </p>
            <p>
              A Comparative Market Analysis from a local REALTOR eliminates the
              guesswork. It uses verified MLS data, accounts for your home&apos;s
              condition and upgrades, and reflects what buyers are actually paying in
              your neighborhood right now.
            </p>
          </div>
        </div>
      </section>

      {/* ---- What Barrett's CMA Includes ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">What You Get</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Is Included in Your Free CMA?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto">
            {cmaIncludes.map((item, i) => (
              <div key={item.title} className="flex gap-6">
                <div className="flex-shrink-0">
                  <span className="font-heading text-5xl font-extralight text-accent/40 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="heading-section text-sm text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How It Works — numbered steps ---- */}
      <section className="section-dark">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label text-white/50 mb-6">How It Works</p>
            <h2 className="heading-section text-display-sm text-white">
              Three Steps to Your Home&apos;s Value
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center max-w-3xl mx-auto">
            {steps.map((s) => (
              <div key={s.step}>
                <p className="stat-number text-white">{s.step}</p>
                <h3 className="heading-label text-white/80 mt-4 mb-3">
                  {s.title}
                </h3>
                <p className="font-body text-sm text-white/60 font-light leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Why Barrett ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Why Barrett</p>
            <h2 className="heading-section text-display-sm text-primary">
              Who Is Preparing Your Valuation?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-link">
            <p>
              Barrett Henry is a Broker Associate at REMAX Collective with 23+ years
              of real estate experience. He holds the MRP (Military Relocation
              Professional), e-PRO, and SRS (Seller Representative Specialist)
              designations. Barrett and{" "}
              <Link href="/the-now-team">The NOW Team</Link> serve buyers and
              sellers across Hillsborough, Pinellas, Pasco, Polk, and Manatee
              counties.
            </p>
            <p>
              When Barrett prepares your CMA, he personally reviews every comparable
              sale, adjusts for differences between properties, and delivers a report
              you can actually understand — not a spreadsheet full of jargon. Whether
              you are thinking about selling soon or just want to know where you
              stand, this report gives you a clear picture of your home&apos;s value
              in today&apos;s market.
            </p>
          </div>

          <div className="text-center mt-10">
            <Link href="tel:8137337907" className="btn-primary">
              Call (813) 733-7907
            </Link>
          </div>
        </div>
      </section>

      {/* ---- FAQ Section ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Common Questions</p>
            <h2 className="heading-section text-display-sm text-primary">
              Frequently Asked Questions About Home Valuations
            </h2>
            <div className="section-divider" />
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="font-heading text-lg text-primary font-semibold mb-2">
                What is a Comparative Market Analysis (CMA)?
              </h3>
              <p className="font-body text-muted font-light leading-relaxed">
                A CMA is a professional home valuation prepared by a licensed REALTOR
                using recent comparable sales, active listings, and market data from
                the MLS. It gives you an accurate price range based on what buyers
                are actually paying in your area — not what an algorithm guesses.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg text-primary font-semibold mb-2">
                How is a CMA different from a Zillow Zestimate?
              </h3>
              <p className="font-body text-muted font-light leading-relaxed">
                A Zestimate uses automated algorithms and public records. It cannot
                see your upgrades, assess your home&apos;s condition, or factor in
                neighborhood-level nuances. A CMA is built by a local expert who
                walks the data and accounts for everything an algorithm misses.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg text-primary font-semibold mb-2">
                Is the home valuation really free?
              </h3>
              <p className="font-body text-muted font-light leading-relaxed">
                Yes. Barrett provides CMAs at no cost and with no obligation. You are
                not required to list your home or sign any agreement to receive your
                valuation.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg text-primary font-semibold mb-2">
                How long does it take to get my CMA?
              </h3>
              <p className="font-body text-muted font-light leading-relaxed">
                Most CMAs are delivered within 24 hours of submitting your request.
                Barrett will reach out if he needs any additional details about your
                property to ensure accuracy.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg text-primary font-semibold mb-2">
                Do I have to sell my home after getting a CMA?
              </h3>
              <p className="font-body text-muted font-light leading-relaxed">
                Not at all. Many homeowners request a CMA simply to understand their
                equity position, plan for the future, or settle a curiosity. There is
                zero pressure to list.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Lead Form ---- */}
      <section className="section-white">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="free-home-valuation"
            title="Request Your Free Valuation"
            submitLabel="Get My Home Value"
          />
          <p className="font-body text-muted text-center text-sm mt-4">
            Barrett will prepare your CMA within 24 hours. No obligation, no cost.
          </p>
        </div>
      </section>
    </>
  );
}
