// =============================================================================
// /terms-of-use — Terms of use page
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Barrett Henry, REALTOR®",
  description: "Terms of use for nowtb.com — website usage terms and conditions.",
};

export default function TermsOfUsePage() {
  return (
    <section className="container-wide py-16">
      <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary">
        <h1>Terms of Use</h1>
        <p className="text-muted">Last updated: May 2026</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using nowtb.com, you agree to be bound by these terms
          of use. If you do not agree to these terms, please do not use this website.
        </p>

        <h2>Property Listings</h2>
        <p>
          Property listing data on this website is provided by Stellar MLS and is
          deemed reliable but not guaranteed. All listing information should be verified
          independently. Listings may be subject to prior sale, price changes, or withdrawal.
        </p>

        <h2>Professional Advice</h2>
        <p>
          Content on this website is for informational purposes only and does not
          constitute legal, financial, or professional advice. Consult appropriate
          professionals before making real estate decisions.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on nowtb.com, including text, images, and design, is the property
          of Barrett Henry and The NOW Team unless otherwise noted. Unauthorized
          reproduction is prohibited.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          Barrett Henry and The NOW Team are not liable for any damages arising from
          the use of this website or reliance on information provided herein.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Contact Barrett Henry at{" "}
          <a href="mailto:barrett@nowtb.com" className="text-accent">
            barrett@nowtb.com
          </a>.
        </p>
      </div>
    </section>
  );
}
