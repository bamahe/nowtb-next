// =============================================================================
// /privacy-policy — Privacy policy page
// =============================================================================

import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Privacy Policy | Barrett Henry, REALTOR®",
  description: "Privacy policy for nowtb.com — how we collect, use, and protect your personal information. Barrett Henry, REMAX Collective.",
  alternates: {
    canonical: "/privacy-policy/",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://nowtb.com/" },
        { name: "Privacy Policy", url: "https://nowtb.com/privacy-policy/" },
      ])} />
    <section className="container-wide py-16">
      <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary">
        <h1>Privacy Policy</h1>
        <p className="text-muted">Last updated: May 2026</p>

        <h2>Information We Collect</h2>
        <p>
          When you visit nowtb.com, we may collect information you voluntarily provide
          through contact forms, including your name, email address, phone number, and
          message content. We also collect standard web analytics data such as IP address,
          browser type, and pages visited.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          We use the information you provide to respond to your inquiries, send relevant
          real estate information, and improve our website and services. We do not sell
          your personal information to third parties.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use third-party services including Google Analytics, Showcase IDX (property
          search), and Follow Up Boss (CRM) that may collect data as described in their
          respective privacy policies.
        </p>

        <h2>Cookies</h2>
        <p>
          Our website uses cookies to improve your browsing experience and provide
          analytics. You can disable cookies in your browser settings.
        </p>

        <h2>Data Security</h2>
        <p>
          We take reasonable measures to protect your personal information from
          unauthorized access, use, or disclosure.
        </p>

        <h2>Contact Us</h2>
        <p>
          For questions about this privacy policy, contact Barrett Henry at{" "}
          <a href="mailto:barrett@nowtb.com" className="text-accent">
            barrett@nowtb.com
          </a>{" "}
          or call <a href="tel:+18137337907" className="text-accent">(813) 733-7907</a>.
        </p>
      </div>
    </section>
    </>
  );
}
