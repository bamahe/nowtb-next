// =============================================================================
// /buyers — Buyer Landing Page
// Guides potential buyers through the process and captures leads
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
    icon: "📊",
    title: "Market Expertise",
    description:
      "Deep knowledge of Tampa Bay's 7-county market means you get accurate pricing data, neighborhood insights, and investment-grade analysis before you make a move.",
  },
  {
    icon: "🤝",
    title: "Negotiation Skills",
    description:
      "23+ years of deal-making experience translates to stronger offers, better terms, and more money in your pocket at the closing table.",
  },
  {
    icon: "🏠",
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
      {/* ---- Hero Section ---- */}
      <HeroSection
        title="Buying a Home in Tampa Bay"
        subtitle="Your step-by-step guide with a Broker who has 23+ years of experience"
      />

      {/* ---- Why Work With Barrett ---- */}
      <section className="container-wide py-16">
        <h2 className="heading-section text-display-sm text-primary text-center mb-12">
          Why Work With Barrett
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="card p-8 text-center">
              {/* Icon */}
              <div className="text-4xl mb-4" aria-hidden="true">
                {b.icon}
              </div>
              <h3 className="heading-section text-lg text-primary mb-3">
                {b.title}
              </h3>
              <p className="font-body text-muted">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- The Buying Process ---- */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide">
          <h2 className="heading-section text-display-sm text-primary text-center mb-12">
            The Buying Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buyingSteps.map((s) => (
              <div key={s.step} className="flex gap-4">
                {/* Step number circle */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-body font-bold">
                  {s.step}
                </div>
                <div>
                  <h3 className="heading-section text-lg text-primary mb-1">
                    {s.title}
                  </h3>
                  <p className="font-body text-muted text-sm">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Search Available Homes CTA ---- */}
      <section className="container-wide py-16 text-center">
        <h2 className="heading-section text-display-sm text-primary mb-4">
          Search Available Homes
        </h2>
        <p className="font-body text-muted text-lg max-w-2xl mx-auto mb-8">
          Browse active listings across Tampa Bay — updated every 5 minutes from
          Stellar MLS.
        </p>
        <Link href="/properties" className="btn-primary inline-block">
          View All Properties
        </Link>
      </section>

      {/* ---- Buyer Registration Form ---- */}
      <section className="bg-gray-50 py-16">
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
