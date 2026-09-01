// =============================================================================
// /seller-intake — Seller property questionnaire
// Collects the details that otherwise get chased down by phone before a
// listing appointment: utilities, HOA, roof and system ages, updates.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SellerIntakeForm from "@/components/ui/SellerIntakeForm";

export const metadata: Metadata = {
  title: "Seller Intake Form | Barrett Henry, REALTOR®",
  description:
    "Tell me about your Tampa Bay home before we meet: utilities and average bills, HOA and CDD fees, roof and A/C age, updates, and condition. Takes about ten minutes.",
  alternates: {
    canonical: "/seller-intake/",
  },
  robots: {
    // A questionnaire has no search value and should not compete with
    // /sellers/ or /free-home-valuation/ in the index.
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Seller Intake Form | Barrett Henry, REALTOR®",
    description:
      "The details I need before your listing appointment, in one place.",
    type: "website",
  },
};

export default function SellerIntakePage() {
  return (
    <>
      <HeroSection
        title="Seller Intake"
        label="BEFORE YOUR LISTING APPOINTMENT"
        subtitle="Ten minutes here saves an hour of phone tag later."
      />

      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <p className="font-body text-dark leading-relaxed mb-4">
            The more of this I have before we meet, the sharper your pricing and net
            sheet will be. Two things matter most in Florida right now: the age of your
            roof and systems, because they decide whether a buyer can even get insured,
            and your real monthly costs, because a bill that surprises a buyer late in
            the deal costs you leverage.
          </p>
          <p className="font-body text-dark leading-relaxed mb-10">
            Nothing here is required except your name and email. Estimates are fine.
            &quot;Not sure&quot; is a perfectly good answer, and it tells me where to
            dig.
          </p>

          <SellerIntakeForm />

          <p className="font-body text-sm text-muted mt-10">
            Would rather talk it through? Call or text{" "}
            <a href="tel:+18137337907" className="font-semibold underline">
              (813) 733-7907
            </a>
            . If you are selling from out of state or deployed, start with{" "}
            <Link href="/remote-seller-process/" className="font-semibold underline">
              selling from where you are
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
