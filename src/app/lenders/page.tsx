// =============================================================================
// /lenders — Recommended lenders page
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Recommended Lenders | Barrett Henry, REALTOR®",
  description: "Barrett Henry's recommended mortgage lenders in Tampa Bay — trusted partners for conventional, FHA, VA, and specialty loans.",
};

export default function LendersPage() {
  return (
    <>
      <HeroSection
        title="Recommended Lenders"
        subtitle="Trusted mortgage professionals Barrett works with to get you the best rates and terms."
      />

      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">
          <p>
            Choosing the right lender is just as important as choosing the right home.
            Barrett Henry has built relationships with top mortgage professionals who
            deliver competitive rates, fast closings, and excellent communication.
          </p>
          <p>
            Contact Barrett at <a href="tel:8137337907">(813) 733-7907</a> for a
            personalized lender referral based on your specific situation — whether
            you need conventional, FHA, VA, USDA, or specialty financing.
          </p>
        </div>
      </section>

      {/* === Related guides === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <h2 className="font-heading font-bold text-2xl text-primary mb-6 text-center">
            Mortgage Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { href: "/guides/mortgage-pre-approval-guide", label: "Pre-Approval Guide" },
              { href: "/guides/fha-loan-guide", label: "FHA Loan Guide" },
              { href: "/guides/va-home-loan-guide", label: "VA Loan Guide" },
              { href: "/guides/conventional-loan-guide", label: "Conventional Loan Guide" },
              { href: "/guides/jumbo-loan-guide", label: "Jumbo Loan Guide" },
              { href: "/guides/usda-loan-guide", label: "USDA Loan Guide" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="card p-4 text-center hover:shadow-lg transition-shadow">
                <span className="font-heading font-bold text-sm text-primary">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Get a Lender Referral
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Tell Barrett about your financing needs and he will connect you with
            the right lender.
          </p>
          <ContactForm webhookUrl="/api/contact" source="lenders" />
        </div>
      </section>
    </>
  );
}
