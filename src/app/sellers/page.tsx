// =============================================================================
// /sellers — Seller Landing Page
// Highlights Barrett's selling strategy and captures seller leads
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

// --- Selling strategy pillars ---
const pillars = [
  {
    icon: "📈",
    title: "Pricing Analysis",
    description:
      "We pull comparable sales, analyze market trends, and price your home to attract the most qualified buyers — no guessing, no overpricing traps.",
  },
  {
    icon: "📸",
    title: "Professional Marketing",
    description:
      "HDR photography, 3D tours, targeted social ads, MLS syndication, and print materials. Your home gets maximum exposure to serious buyers.",
  },
  {
    icon: "🎯",
    title: "Strategic Negotiation",
    description:
      "23+ years of deal experience means stronger counter-offers, better contract terms, and more net proceeds at closing.",
  },
  {
    icon: "✅",
    title: "Smooth Closing",
    description:
      "From accepted offer through closing day, we coordinate inspections, appraisals, title work, and repairs so nothing derails your sale.",
  },
];

export default function SellersPage() {
  return (
    <>
      {/* ---- Hero Section ---- */}
      <HeroSection
        title="Sell Your Tampa Bay Home for Top Dollar"
        subtitle="A data-driven selling strategy backed by 23+ years of real estate experience"
      />

      {/* ---- Barrett's Selling Strategy ---- */}
      <section className="container-wide py-16">
        <h2 className="heading-section text-display-sm text-primary text-center mb-12">
          Barrett&apos;s Selling Strategy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p) => (
            <div key={p.title} className="card p-8 flex gap-4">
              {/* Icon */}
              <div className="text-3xl flex-shrink-0" aria-hidden="true">
                {p.icon}
              </div>
              <div>
                <h3 className="heading-section text-lg text-primary mb-2">
                  {p.title}
                </h3>
                <p className="font-body text-muted">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- What Your Home Is Worth CTA ---- */}
      <section className="bg-accent/10 py-16">
        <div className="container-wide text-center">
          <h2 className="heading-section text-display-sm text-primary mb-4">
            What Your Home Is Worth
          </h2>
          <p className="font-body text-muted text-lg max-w-2xl mx-auto mb-8">
            Get a free, no-obligation home valuation from a local expert who
            knows your neighborhood. Find out what buyers are paying right now.
          </p>
          <Link href="/sell-your-home" className="btn-primary inline-block">
            Get Your Home Value
          </Link>
        </div>
      </section>

      {/* ---- Market Stats Placeholder ---- */}
      <section className="container-wide py-16">
        <h2 className="heading-section text-display-sm text-primary text-center mb-8">
          Tampa Bay Market Snapshot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {/* Static placeholder stats — will be replaced with live data */}
          <div className="card p-6">
            <p className="text-3xl font-heading font-bold text-accent">$415K</p>
            <p className="font-body text-muted mt-1">Median Home Price</p>
          </div>
          <div className="card p-6">
            <p className="text-3xl font-heading font-bold text-accent">28</p>
            <p className="font-body text-muted mt-1">Avg. Days on Market</p>
          </div>
          <div className="card p-6">
            <p className="text-3xl font-heading font-bold text-accent">97%</p>
            <p className="font-body text-muted mt-1">List-to-Sale Ratio</p>
          </div>
        </div>
        <p className="text-center font-body text-muted text-sm mt-4">
          Market data is approximate and updated periodically. Contact Barrett
          for the latest numbers in your area.
        </p>
      </section>

      {/* ---- Seller Lead Form ---- */}
      <section className="bg-gray-50 py-16">
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
