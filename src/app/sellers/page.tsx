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
    title: "Honest Pricing",
    description:
      "I pull the comps, run the numbers, and give you a price that's based on data — not ego. Overpricing kills deals. I won't let that happen to you.",
  },
  {
    step: 2,
    title: "The NOW Team Marketing Plan",
    description:
      "HDR photography, 3D tours, targeted social ads, MLS syndication, and print materials. My team and I make sure every serious buyer in the market sees your home.",
  },
  {
    step: 3,
    title: "Relentless Negotiation",
    description:
      "23+ years of deal-making means I know how to get you more at the closing table. Better terms, stronger counter-offers, and more net proceeds — that's the whole point.",
  },
  {
    step: 4,
    title: "Closing Without the Drama",
    description:
      "From accepted offer through closing day, The NOW Team coordinates inspections, appraisals, title work, and repairs. I keep things on track so you don't have to stress.",
  },
];

export default function SellersPage() {
  return (
    <>
      {/* ---- Hero Section — full viewport ---- */}
      <HeroSection
        title="Sell Your Home"
        label="BARRETT HENRY | THE NOW TEAM"
        subtitle="I don't guess on price and I don't cut corners on marketing. 23+ years of getting sellers top dollar."
        fullHeight
      />

      {/* ---- Barrett's Selling Strategy — white bg, numbered steps ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">The Strategy</p>
            <h2 className="heading-section text-display-sm text-primary">
              How I Sell Your Home
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
            I&apos;ll run the numbers on your home — no obligation, no pressure.
            Find out what buyers are actually paying in your neighborhood right now.
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
