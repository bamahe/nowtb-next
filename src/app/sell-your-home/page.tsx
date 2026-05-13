// =============================================================================
// /sell-your-home — Home Valuation Pillar Page
// Server component — the interactive form is extracted into ValuationForm
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ValuationForm from "@/components/ui/ValuationForm";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "What Is Your Tampa Bay Home Worth? | Free Home Valuation",
  description:
    "Get a free, no-obligation home valuation from Barrett Henry, Broker Associate with REMAX Collective. Find out what your Tampa Bay home is worth in today's market.",
  openGraph: {
    title:
      "What Is Your Tampa Bay Home Worth? | Barrett Henry, REALTOR®",
    description:
      "Free home valuation from a local expert with 23+ years of real estate experience. No obligation.",
    type: "website",
  },
};

// --- Selling process timeline steps ---
const sellingSteps = [
  {
    step: 1,
    title: "Free Home Valuation",
    description:
      "We analyze comparable sales, market trends, and your home's unique features to determine its current market value.",
  },
  {
    step: 2,
    title: "Prep & Staging",
    description:
      "Get recommendations on repairs, decluttering, and staging to maximize your home's appeal and selling price.",
  },
  {
    step: 3,
    title: "Professional Marketing",
    description:
      "HDR photography, 3D virtual tours, social media ads, MLS syndication, and targeted buyer outreach.",
  },
  {
    step: 4,
    title: "Showings & Open Houses",
    description:
      "We coordinate showings, host open houses, and collect buyer feedback to keep momentum going.",
  },
  {
    step: 5,
    title: "Negotiate & Accept Offer",
    description:
      "Review offers, negotiate the best price and terms, and get your home under contract.",
  },
  {
    step: 6,
    title: "Close & Celebrate",
    description:
      "Inspections, appraisal, title work, and final walkthrough — all coordinated so you can close with confidence.",
  },
];

export default function SellYourHomePage() {
  return (
    <>
      {/* ---- Hero Section ---- */}
      <HeroSection
        title="What Is Your Tampa Bay Home Worth?"
        subtitle="Get a free, no-obligation home valuation from a local expert"
      />

      {/* ---- Why Accurate Pricing Matters ---- */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-6">
            Why Accurate Pricing Matters
          </h2>
          <div className="font-body text-muted space-y-4 text-lg">
            <p>
              Price too high and your home sits on the market, collecting
              &quot;days on market&quot; that make buyers suspicious. Price too
              low and you leave money on the table.
            </p>
            <p>
              The sweet spot? A data-driven price based on comparable sales,
              current inventory, buyer demand, and your home&apos;s unique
              features. That&apos;s exactly what you get with Barrett
              Henry&apos;s Comparative Market Analysis (CMA).
            </p>
          </div>
        </div>
      </section>

      {/* ---- Valuation Request Form ---- */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-xl mx-auto">
          <ValuationForm />
        </div>
      </section>

      {/* ---- The Selling Process Timeline ---- */}
      <section className="container-wide py-16">
        <h2 className="heading-section text-display-sm text-primary text-center mb-12">
          The Selling Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sellingSteps.map((s) => (
            <div key={s.step} className="flex gap-4">
              {/* Step number circle */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-body font-bold">
                {s.step}
              </div>
              <div>
                <h3 className="heading-section text-lg text-primary mb-1">
                  {s.title}
                </h3>
                <p className="font-body text-muted text-sm">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Testimonial Placeholder ---- */}
      <section className="bg-accent/10 py-16">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-8">
            What Sellers Are Saying
          </h2>
          <blockquote className="font-body text-lg text-muted italic">
            &ldquo;Barrett made selling our home effortless. His pricing
            strategy was spot-on — we had multiple offers in the first weekend
            and closed above asking price.&rdquo;
          </blockquote>
          <p className="font-body text-primary font-medium mt-4">
            — Happy Seller, Tampa Bay
          </p>
          <p className="font-body text-muted text-sm mt-2">
            More testimonials coming soon.
          </p>
        </div>
      </section>

      {/* ---- Not Ready CTA ---- */}
      <section className="container-wide py-16 text-center">
        <p className="font-body text-muted text-lg mb-4">
          Not ready to sell? Browse what&apos;s on the market instead.
        </p>
        <Link href="/properties" className="btn-primary inline-block">
          Search Homes
        </Link>
      </section>
    </>
  );
}
