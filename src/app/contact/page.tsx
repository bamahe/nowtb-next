// =============================================================================
// /contact — Contact Page
// Luxury minimalist: full-viewport hero, spacious 2-column layout
// Left: large heading + contact details. Right: minimal contact form.
// =============================================================================

import type { Metadata } from "next";
import Image from "next/image";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";


// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Contact Barrett Henry | Tampa Bay REALTOR® | (813) 733-7907",
  description:
    "Get in touch with Barrett Henry, Broker Associate with REMAX Collective. Call (813) 733-7907 or send a message. Serving Tampa Bay's 8 counties.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Barrett Henry | Tampa Bay REALTOR®",
    description:
      "Reach Barrett Henry for buying, selling, or investing in Tampa Bay real estate. (813) 733-7907.",
    type: "website",
  },
};

// --- Tampa Bay's 8 counties ---
const counties = [
  "Hillsborough County",
  "Pinellas County",
  "Pasco County",
  "Polk County",
  "Manatee County",
  "Sarasota County",
  "Hernando County",
  "Citrus County",
];

export default function ContactPage() {
  return (
    <>
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Contact Barrett Henry", item: "https://nowtb.com/contact" },
            ],
          }),
        }}
      />
      {/* ---- Hero Section — full viewport ---- */}
      <HeroSection
        title="Let&apos;s Talk"
        label="BARRETT HENRY | THE NOW TEAM"
        subtitle="Have a question about buying, selling, or investing? I'd rather talk than text. Call me directly or drop a message below."
      />

      {/* ---- Two-Column: Contact Info (left) + Form (right) ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left column — Barrett's photo + contact details */}
            <div className="py-8">
              {/* Barrett's headshot */}
              <div className="mb-8 w-32 h-32 relative overflow-hidden">
                <Image
                  src="/images/barrett-headshot.png"
                  alt="Barrett Henry, REALTOR® and Broker Associate"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="heading-label mb-6">Barrett Henry, REALTOR®</p>
              <h2 className="font-heading font-extralight text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] uppercase text-primary leading-tight">
                Talk to Barrett Directly
              </h2>
              <div className="section-divider !mx-0 !ml-0" />

              {/* Phone — large and prominent, primary CTA */}
              <div className="mb-10">
                <p className="heading-label mb-3">Call Me</p>
                <a
                  href="tel:+18137337907"
                  className="font-heading font-extralight text-2xl md:text-3xl text-primary hover:text-accent transition-colors duration-300"
                >
                  (813) 733-7907
                </a>
                <p className="font-body text-muted text-sm font-light mt-2">
                  I pick up. If I miss you, I&apos;ll call back.
                </p>
              </div>

              {/* Email */}
              <div className="mb-10">
                <p className="heading-label mb-3">Email</p>
                <a
                  href="mailto:barrett@nowtb.com"
                  className="font-body text-lg font-light text-muted hover:text-accent transition-colors duration-300"
                >
                  barrett@nowtb.com
                </a>
              </div>

              {/* Office Locations */}
              <div className="mb-10">
                <p className="heading-label mb-3">Office Locations</p>
                <div className="space-y-4">
                  <div>
                    <p className="font-body text-dark font-medium">Tampa</p>
                    <p className="font-body text-muted font-light text-sm">
                      14310 N. Dale Mabry Hwy, Ste 100<br />Tampa, FL 33618
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-dark font-medium">Largo</p>
                    <p className="font-body text-muted font-light text-sm">
                      11200 Seminole Blvd, Ste 202<br />Largo, FL 33778
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-dark font-medium">Brandon</p>
                    <p className="font-body text-muted font-light text-sm">
                      417 Lithia Pinecrest Rd<br />Brandon, FL 33511
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div>
                <p className="heading-label mb-3">Hours</p>
                <p className="font-body text-muted font-light">
                  Monday – Friday: 9:00 AM – 6:00 PM
                  <br />
                  Saturday: 10:00 AM – 4:00 PM
                  <br />
                  Sunday: By Appointment
                </p>
              </div>
            </div>

            {/* Right column — Contact form */}
            <div className="py-8">
              <ContactForm
                webhookUrl="/api/contact"
                source="contact-page"
                title="Send a Message"
                submitLabel="Send Message"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Office Locations with Google Maps ---- */}
      <section className="section-light">
        <div className="container-wide">
          <p className="heading-label text-center mb-4">Our Offices</p>
          <h2 className="heading-section text-xl text-primary text-center mb-12">
            REMAX Collective — 3 Tampa Bay Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tampa Office */}
            <div className="bg-white overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/office-tampa.jpg"
                alt="REMAX Collective Tampa Office — 14310 N. Dale Mabry Hwy"
                className="w-full h-48 object-cover"
              />
              <iframe
                title="REMAX Collective Tampa Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2714!2d-82.508415!3d28.075781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c16b3871f5af%3A0x94e614d601928a5d!2sBarrett+Henry%2C+REALTOR%C2%AE+-+REMAX+Collective!5e0!3m2!1sen!2sus"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-6 text-center">
                <p className="font-body text-dark font-medium mb-1">Tampa Office</p>
                <p className="font-body text-muted font-light text-sm">
                  14310 N. Dale Mabry Hwy, Ste 100<br />Tampa, FL 33618
                </p>
                <a
                  href="https://www.google.com/maps/place/Barrett+Henry,+REALTOR%C2%AE+-+REMAX+Collective/@28.075781,-82.508415,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
            {/* Largo Office */}
            <div className="bg-white overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/office-largo.jpg"
                alt="REMAX Collective Largo Office — 11200 Seminole Blvd"
                className="w-full h-48 object-cover"
              />
              <iframe
                title="REMAX Collective Largo Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1762!2d-82.7873!3d27.8839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2f9a8c0d4e5f6%3A0xa1b2c3d4e5f67890!2s11200+Seminole+Blvd%2C+Largo%2C+FL+33778!5e0!3m2!1sen!2sus"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-6 text-center">
                <p className="font-body text-dark font-medium mb-1">Largo Office</p>
                <p className="font-body text-muted font-light text-sm">
                  11200 Seminole Blvd, Ste 202<br />Largo, FL 33778
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=11200+Seminole+Blvd+Ste+202+Largo+FL+33778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
            {/* Brandon Office */}
            <div className="bg-white overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/office-brandon.jpg"
                alt="REMAX Collective Brandon Office — 417 Lithia Pinecrest Rd"
                className="w-full h-48 object-cover"
              />
              <iframe
                title="REMAX Collective Brandon Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1762!2d-82.2859!3d27.9295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2d4e5f6a7b8c9%3A0x1234567890abcdef!2s417+Lithia+Pinecrest+Rd%2C+Brandon%2C+FL+33511!5e0!3m2!1sen!2sus"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-6 text-center">
                <p className="font-body text-dark font-medium mb-1">Brandon Office</p>
                <p className="font-body text-muted font-light text-sm">
                  417 Lithia Pinecrest Rd<br />Brandon, FL 33511
                </p>
                <a
                  href="https://maps.app.goo.gl/gjvqfQH6TqnuN2XA8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Serving Tampa Bay's 8 Counties — dark navy ---- */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <p className="heading-label text-white/50 mb-6">Service Area</p>
          <h2 className="heading-section text-display-sm text-white mb-16">
            Serving Tampa Bay&apos;s 8 Counties
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {counties.map((county) => (
              <div key={county} className="text-center">
                <p className="font-body text-white/70 font-light text-sm">
                  {county}
                </p>
              </div>
            ))}
          </div>
          <div className="section-divider mt-12" />
          <p className="font-body text-white/50 font-light mt-8 text-sm">
            Whether you&apos;re buying, selling, or investing anywhere in the
            Tampa Bay metro — call Barrett directly at{" "}
            <a href="tel:+18137337907" className="text-white/70 hover:text-accent transition-colors duration-300">
              (813) 733-7907
            </a>.
            The NOW Team is ready when you are.
          </p>
        </div>
      </section>
    </>
  );
}
