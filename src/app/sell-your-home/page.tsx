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
    "Get a free, no-obligation home valuation from Barrett Henry, Broker Associate with REMAX Collective. Find out what your Tampa Bay home is worth today. Call (813) 733-7907.",
  alternates: {
    canonical: "/sell-your-home/",
  },
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
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Free Home Valuation", item: "https://nowtb.com/sell-your-home" },
            ],
          }),
        }}
      />

      {/* HowTo schema — step-by-step selling process for SEO/AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Sell Your Home in Tampa Bay",
            description:
              "A step-by-step guide to selling your Tampa Bay home — from free home valuation to closing day, with expert guidance from Barrett Henry, Broker Associate at REMAX Collective.",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Free Home Valuation",
                text: "We analyze comparable sales, market trends, and your home's unique features to determine its current market value.",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Prep and Staging",
                text: "Get recommendations on repairs, decluttering, and staging to maximize your home's appeal and selling price.",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Professional Marketing",
                text: "HDR photography, 3D virtual tours, social media ads, MLS syndication, and targeted buyer outreach.",
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "Showings and Open Houses",
                text: "We coordinate showings, host open houses, and collect buyer feedback to keep momentum going.",
              },
              {
                "@type": "HowToStep",
                position: 5,
                name: "Negotiate and Accept Offer",
                text: "Review offers, negotiate the best price and terms, and get your home under contract.",
              },
              {
                "@type": "HowToStep",
                position: 6,
                name: "Close and Celebrate",
                text: "Inspections, appraisal, title work, and final walkthrough — all coordinated so you can close with confidence.",
              },
            ],
          }),
        }}
      />

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
      <section className="section-light">
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

      {/* ---- Real Seller Testimonials ---- */}
      <section className="section-light">
        <div className="container-wide">
          <h2 className="heading-section text-display-sm text-primary text-center mb-12">
            What Sellers Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-border p-8">
              <p className="text-accent text-lg mb-4">★★★★★</p>
              <blockquote className="font-body text-muted font-light text-sm leading-relaxed mb-6">
                &ldquo;I sold my townhome in Riverview with The NOW Team and the whole process was incredibly smooth. Barrett and his team had a plan from day one. Professional photos, strategic pricing, and a marketing push that had my phone blowing up with showing requests within the first 48 hours.&rdquo;
              </blockquote>
              <p className="font-body text-primary font-medium text-sm">Kevin T.</p>
              <p className="font-body text-muted text-xs">Riverview</p>
            </div>
            <div className="border border-border p-8">
              <p className="text-accent text-lg mb-4">★★★★★</p>
              <blockquote className="font-body text-muted font-light text-sm leading-relaxed mb-6">
                &ldquo;We had a terrible experience with our previous agent and almost gave up on selling. A friend told us to call The NOW Team and it was the best decision we made. Our Valrico home sold for more than our original agent had even suggested listing it for.&rdquo;
              </blockquote>
              <p className="font-body text-primary font-medium text-sm">Danielle F.</p>
              <p className="font-body text-muted text-xs">Valrico</p>
            </div>
            <div className="border border-border p-8">
              <p className="text-accent text-lg mb-4">★★★★★</p>
              <blockquote className="font-body text-muted font-light text-sm leading-relaxed mb-6">
                &ldquo;We have bought and sold several homes over the years and The NOW Team is by far the best experience we have had. Barrett&apos;s market knowledge in South Tampa is outstanding and his team backs it up with flawless execution.&rdquo;
              </blockquote>
              <p className="font-body text-primary font-medium text-sm">Greg &amp; Pamela T.</p>
              <p className="font-body text-muted text-xs">Tampa</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="border border-border p-8">
              <p className="text-accent text-lg mb-4">★★★★★</p>
              <blockquote className="font-body text-muted font-light text-sm leading-relaxed mb-6">
                &ldquo;Barrett Sold my house and did an excellent job. The process was quick and easy. Definitely will use Barrett again in the future!&rdquo;
              </blockquote>
              <p className="font-body text-primary font-medium text-sm">Rachel Mauk</p>
              <p className="font-body text-muted text-xs">Tampa Bay — Google Review</p>
            </div>
            <div className="border border-border p-8">
              <p className="text-accent text-lg mb-4">★★★★★</p>
              <blockquote className="font-body text-muted font-light text-sm leading-relaxed mb-6">
                &ldquo;This was our third transaction with The NOW Team and we keep coming back because they keep delivering. We have referred at least six families over the years and every single one has had a great experience.&rdquo;
              </blockquote>
              <p className="font-body text-primary font-medium text-sm">Michelle &amp; Scott L.</p>
              <p className="font-body text-muted text-xs">Valrico</p>
            </div>
          </div>
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
