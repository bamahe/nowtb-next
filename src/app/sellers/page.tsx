// =============================================================================
// /sellers — Seller Landing Page
// Luxury minimalist: alternating sections, light-weight headings,
// accent dividers, large stat numbers, generous whitespace
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Sell Your Tampa Bay Home for Top Dollar",
  description:
    "Barrett Henry's proven selling strategy gets Tampa Bay homes sold faster and for more money. Pricing analysis, professional marketing, strategic negotiation, and smooth closings. REMAX Collective.",
  openGraph: {
    title: "Sell Your Tampa Bay Home for Top Dollar | Barrett Henry, REALTOR®",
    description:
      "Barrett Henry's proven selling strategy gets Tampa Bay homes sold faster and for more money.",
    type: "website",
  },
};

// --- Selling strategy pillars with step numbers ---
const pillars = [
  {
    step: 1,
    title: "Pricing Analysis",
    description:
      "We pull comparable sales, analyze market trends, and price your home to attract the most qualified buyers — no guessing, no overpricing traps.",
  },
  {
    step: 2,
    title: "Professional Marketing",
    description:
      "HDR photography, 3D tours, targeted social ads, MLS syndication, and print materials. Your home gets maximum exposure to serious buyers.",
  },
  {
    step: 3,
    title: "Strategic Negotiation",
    description:
      "23+ years of deal experience means stronger counter-offers, better contract terms, and more net proceeds at closing.",
  },
  {
    step: 4,
    title: "Smooth Closing",
    description:
      "From accepted offer through closing day, we coordinate inspections, appraisals, title work, and repairs so nothing derails your sale.",
  },
];

export default function SellersPage() {
  return (
    <>
      {/* ---- Hero Section — full viewport ---- */}
      <HeroSection
        title="Sell Your Home"
        label="TAMPA BAY REAL ESTATE"
        subtitle="A data-driven selling strategy backed by 23+ years of real estate experience."
        fullHeight
      />

      {/* ---- Barrett's Selling Strategy — white bg, numbered steps ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">The Strategy</p>
            <h2 className="heading-section text-display-sm text-primary">
              Barrett&apos;s Selling Strategy
            </h2>
            <div className="section-divider" />
          </div>

          {/* 2-column grid with large step numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto">
            {pillars.map((p) => (
              <div key={p.title} className="flex gap-6">
                {/* Large step number — ultra-light weight */}
                <div className="flex-shrink-0">
                  <span className="font-heading text-5xl font-extralight text-accent/40 leading-none">
                    {String(p.step).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="heading-section text-sm text-primary mb-3">
                    {p.title}
                  </h3>
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Home Valuation CTA — warm cream bg ---- */}
      <section className="section-light">
        <div className="container-wide text-center">
          <p className="heading-label mb-6">Free Valuation</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-primary">
            What Your Home Is Worth
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted font-light text-base md:text-lg max-w-2xl mx-auto mb-10">
            Get a free, no-obligation home valuation from a local expert who
            knows your neighborhood. Find out what buyers are paying right now.
          </p>
          <Link href="/sell-your-home" className="btn-primary">
            Get Your Home Value
          </Link>
        </div>
      </section>

      {/* ---- Market Stats — dark navy, large stat numbers ---- */}
      <section className="section-dark">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label text-white/50 mb-6">Market Data</p>
            <h2 className="heading-section text-display-sm text-white">
              Tampa Bay Market Snapshot
            </h2>
            <div className="section-divider" />
          </div>

          {/* Stats in large ultra-light numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center max-w-3xl mx-auto">
            <div>
              <p className="stat-number text-white">$415K</p>
              <p className="heading-label text-white/50 mt-4">Median Home Price</p>
            </div>
            <div>
              <p className="stat-number text-white">28</p>
              <p className="heading-label text-white/50 mt-4">Avg. Days on Market</p>
            </div>
            <div>
              <p className="stat-number text-white">97%</p>
              <p className="heading-label text-white/50 mt-4">List-to-Sale Ratio</p>
            </div>
          </div>

          <p className="text-center font-body text-white/40 text-xs font-light mt-12 tracking-wide">
            Market data is approximate and updated periodically. Contact Barrett
            for the latest numbers in your area.
          </p>
        </div>
      </section>

      {/* ---- Seller Lead Form — white bg ---- */}
      <section className="section-white">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="sellers-page"
            title="Thinking About Selling?"
            submitLabel="Let's Talk"
          />
        </div>
      </section>
    </>
  );
}
