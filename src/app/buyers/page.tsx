// =============================================================================
// /buyers — Buyer Landing Page
// Luxury minimalist: alternating sections, light-weight headings,
// large step numbers, generous spacing, accent dividers
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Buy a Home in Tampa Bay",
  description:
    "Your step-by-step guide to buying a home in Tampa Bay. Barrett Henry, Broker Associate with REMAX Collective, brings 23+ years of real estate experience to help you find and close on your perfect home.",
  openGraph: {
    title: "Buy a Home in Tampa Bay | Barrett Henry, REALTOR®",
    description:
      "Your step-by-step guide to buying a home in Tampa Bay with a Broker who has 23+ years of real estate experience.",
    type: "website",
  },
};

// --- Benefits data for "Why Work With Barrett" section ---
const benefits = [
  {
    title: "Market Expertise",
    description:
      "Deep knowledge of Tampa Bay's 7-county market means you get accurate pricing data, neighborhood insights, and investment-grade analysis before you make a move.",
  },
  {
    title: "Negotiation Skills",
    description:
      "23+ years of deal-making experience translates to stronger offers, better terms, and more money in your pocket at the closing table.",
  },
  {
    title: "Full-Service Support",
    description:
      "From pre-approval to closing day, you get hands-on guidance at every step — lender referrals, inspections, title coordination, and beyond.",
  },
];

// --- Buying process steps ---
const buyingSteps = [
  {
    step: 1,
    title: "Get Pre-Approved",
    description:
      "Connect with a lender to understand your budget. A pre-approval letter shows sellers you're a serious, qualified buyer.",
  },
  {
    step: 2,
    title: "Define Your Criteria",
    description:
      "Bedrooms, neighborhoods, school districts, commute — we'll nail down exactly what you need so we're only looking at homes that fit.",
  },
  {
    step: 3,
    title: "Tour Homes",
    description:
      "See properties in person (or virtually). We'll tour as many homes as it takes to find the one that checks your boxes.",
  },
  {
    step: 4,
    title: "Make an Offer",
    description:
      "We'll analyze comparable sales, craft a competitive offer, and negotiate terms that protect your interests.",
  },
  {
    step: 5,
    title: "Inspections & Appraisal",
    description:
      "Home inspection, appraisal, and any specialty inspections happen here. We'll handle repair negotiations if anything comes up.",
  },
  {
    step: 6,
    title: "Close & Get Keys",
    description:
      "Final walkthrough, sign the paperwork, and pick up the keys to your new home. Welcome to Tampa Bay!",
  },
];

export default function BuyersPage() {
  return (
    <>
      {/* ---- Hero Section — full viewport ---- */}
      <HeroSection
        title="Buying a Home"
        label="TAMPA BAY REAL ESTATE"
        subtitle="Your step-by-step guide with a Broker who has 23+ years of experience."
        fullHeight
      />

      {/* ---- Why Work With Barrett — white background ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Your Advantage</p>
            <h2 className="heading-section text-display-sm text-primary">
              Why Work With Barrett
            </h2>
            <div className="section-divider" />
          </div>

          {/* 3-column minimal cards — no card background, just content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                {/* Accent line above each card */}
                <div className="w-8 h-[1px] bg-accent mx-auto mb-8" />
                <h3 className="heading-section text-sm text-primary mb-4">
                  {b.title}
                </h3>
                <p className="font-body text-sm text-muted font-light leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- The Buying Process — warm cream bg, large step numbers ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Step by Step</p>
            <h2 className="heading-section text-display-sm text-primary">
              The Buying Process
            </h2>
            <div className="section-divider" />
          </div>

          {/* Steps grid — large ultra-light numbers beside content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {buyingSteps.map((s) => (
              <div key={s.step} className="flex gap-6">
                {/* Large step number — ultra-light weight */}
                <div className="flex-shrink-0">
                  <span className="font-heading text-5xl font-extralight text-accent/40 leading-none">
                    {String(s.step).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="heading-section text-sm text-primary mb-2">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Search CTA — dark navy ---- */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <p className="heading-label text-white/50 mb-6">Browse Listings</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
            Search Available Homes
          </h2>
          <div className="section-divider" />
          <p className="font-body text-white/70 font-light text-base md:text-lg max-w-2xl mx-auto mb-10">
            Browse active listings across Tampa Bay — updated every 5 minutes from
            Stellar MLS.
          </p>
          <Link href="/properties" className="btn-secondary">
            View All Properties
          </Link>
        </div>
      </section>

      {/* ---- Buyer Registration Form — white bg ---- */}
      <section className="section-white">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="buyer-reg"
            title="Register as a Buyer"
            submitLabel="Get Started"
          />
        </div>
      </section>
    </>
  );
}
