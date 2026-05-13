// =============================================================================
// /contact — Contact Page
// Two-column layout: form on left, contact info on right + map placeholder
// =============================================================================

import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Contact Barrett Henry | Tampa Bay REALTOR®",
  description:
    "Get in touch with Barrett Henry, Broker Associate with REMAX Collective. Call (813) 733-7907 or send a message. Serving Tampa Bay's 7 counties.",
  openGraph: {
    title: "Contact Barrett Henry | Tampa Bay REALTOR®",
    description:
      "Reach Barrett Henry for buying, selling, or investing in Tampa Bay real estate. (813) 733-7907.",
    type: "website",
  },
};

// --- Tampa Bay's 7 counties ---
const counties = [
  "Hillsborough County",
  "Pinellas County",
  "Pasco County",
  "Polk County",
  "Manatee County",
  "Sarasota County",
  "Hernando County",
];

export default function ContactPage() {
  return (
    <>
      {/* ---- Hero Section ---- */}
      <HeroSection
        title="Get in Touch"
        subtitle="Have a question about buying, selling, or investing? Let's talk."
      />

      {/* ---- Two-Column: Form + Contact Info ---- */}
      <section className="container-wide py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column — Contact form */}
          <ContactForm
            webhookUrl="/api/contact"
            source="contact-page"
            title="Send a Message"
            submitLabel="Send Message"
          />

          {/* Right column — Contact info card */}
          <div className="space-y-6">
            <div className="card p-6 sm:p-8">
              <h3 className="heading-section text-xl text-primary mb-6">
                Contact Information
              </h3>

              {/* Phone */}
              <div className="mb-4">
                <p className="font-body text-sm font-medium text-dark mb-1">
                  Phone
                </p>
                <a
                  href="tel:+18137337907"
                  className="font-body text-accent hover:underline text-lg"
                >
                  (813) 733-7907
                </a>
              </div>

              {/* Email */}
              <div className="mb-4">
                <p className="font-body text-sm font-medium text-dark mb-1">
                  Email
                </p>
                <a
                  href="mailto:barrett@nowtb.com"
                  className="font-body text-accent hover:underline text-lg"
                >
                  barrett@nowtb.com
                </a>
              </div>

              {/* Office address placeholder */}
              <div className="mb-4">
                <p className="font-body text-sm font-medium text-dark mb-1">
                  Office
                </p>
                <p className="font-body text-muted">
                  REMAX Collective
                  <br />
                  Tampa Bay, FL
                </p>
              </div>

              {/* Business hours */}
              <div>
                <p className="font-body text-sm font-medium text-dark mb-1">
                  Hours
                </p>
                <p className="font-body text-muted">
                  Monday – Friday: 9:00 AM – 6:00 PM
                  <br />
                  Saturday: 10:00 AM – 4:00 PM
                  <br />
                  Sunday: By Appointment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Map Placeholder ---- */}
      <section className="container-wide pb-16">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-200 rounded-lg flex items-center justify-center">
          {/* Replace with Google Maps embed once API key is configured */}
          <p className="font-body text-muted text-sm">
            Google Maps embed coming soon
          </p>
        </div>
      </section>

      {/* ---- Serving Tampa Bay's 7 Counties ---- */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide text-center">
          <h2 className="heading-section text-display-sm text-primary mb-8">
            Serving Tampa Bay&apos;s 7 Counties
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {counties.map((county) => (
              <div key={county} className="card p-4 text-center">
                <p className="font-body text-primary font-medium text-sm">
                  {county}
                </p>
              </div>
            ))}
          </div>
          <p className="font-body text-muted mt-6">
            Whether you&apos;re buying, selling, or investing anywhere in the
            Tampa Bay metro, Barrett and The NOW Team are ready to help.
          </p>
        </div>
      </section>
    </>
  );
}
