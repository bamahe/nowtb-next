// =============================================================================
// /free-home-valuation — Free home valuation landing page
// =============================================================================

import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Free Home Valuation | Barrett Henry, REALTOR®",
  description: "Get a free home valuation from Barrett Henry. Find out what your Tampa Bay home is worth today.",
};

export default function FreeHomeValuationPage() {
  return (
    <>
      <HeroSection
        title="Free Home Valuation"
        subtitle="Find out what your Tampa Bay home is worth — no obligation, no cost."
      />

      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">
          <h2>How Barrett Determines Your Home&apos;s Value</h2>
          <p>
            Barrett Henry uses a data-driven Comparative Market Analysis (CMA) that
            considers recent sales, active competition, market trends, and your home&apos;s
            unique features. This is not an automated estimate — it is a professional
            analysis from a Broker Associate with 23+ years of real estate experience.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Request Your Free Valuation
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Tell Barrett about your property and he will prepare a detailed
            market analysis within 24 hours.
          </p>
          <ContactForm webhookUrl="/api/contact" source="free-home-valuation" />
        </div>
      </section>
    </>
  );
}
