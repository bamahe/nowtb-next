// =============================================================================
// /home-valuation — Home valuation page (alternate URL for free-home-valuation)
// =============================================================================

import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Home Valuation Tampa Bay | What Is Your Home Worth?",
  description: "Request a free home valuation for your Tampa Bay property from Barrett Henry, Broker Associate at REMAX Collective. Professional CMA within 24 hours. Call (813) 733-7907.",
  alternates: {
    canonical: "/home-valuation",
  },
};

export default function HomeValuationPage() {
  return (
    <>
      <HeroSection
        title="What Is Your Home Worth?"
        subtitle="Get a professional market analysis from Barrett Henry — free, fast, and accurate."
      />
      <section className="container-wide py-12">
        <div className="max-w-2xl mx-auto">
          <ContactForm webhookUrl="/api/contact" source="home-valuation" />
        </div>
      </section>
    </>
  );
}
