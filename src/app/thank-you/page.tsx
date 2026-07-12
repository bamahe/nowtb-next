// =============================================================================
// /thank-you — Post-submission confirmation page
// 3-step timeline, call-now box, and next-step links so the lead
// doesn't hit a dead end after submitting a form.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";

// --- SEO metadata (noindex via robots.ts — this page has no search value) ---
export const metadata: Metadata = {
  title: "Thank You | Barrett Henry, REALTOR®",
  description:
    "Your message has been received. Barrett Henry will respond within 2 hours.",
  alternates: {
    canonical: "/thank-you/",
  },
  // Prevent indexing at the page level too, belt-and-suspenders with robots.ts
  robots: { index: false, follow: true },
};

// --- 3-step timeline items ---
const timelineSteps = [
  {
    step: 1,
    title: "Barrett Reviews Your Request",
    description: "Your message lands directly in Barrett's inbox — no assistants, no runaround.",
  },
  {
    step: 2,
    title: "You'll Hear Back Within 2 Hours",
    description: "Expect a call, text, or email. If it's urgent, call the number below.",
  },
  {
    step: 3,
    title: "We'll Put Together a Plan",
    description: "Whether you're buying, selling, or just exploring — Barrett will map out your next steps.",
  },
];

// --- Recommended next-step links ---
const nextStepLinks = [
  { href: "/properties/", label: "Browse Homes" },
  { href: "/mortgage-calculator/", label: "Estimate Your Payment" },
  { href: "/guides/first-time-home-buyer-guide/", label: "First-Time Buyer Guide" },
  { href: "/free-home-valuation/", label: "Get Your Home's Value" },
  { href: "/market-updates/", label: "Market Updates" },
  { href: "/blog/", label: "Read the Blog" },
];

export default function ThankYouPage() {
  return (
    <>
      {/* BreadcrumbList schema — Home > Thank You */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Thank You", item: "https://nowtb.com/thank-you" },
            ],
          }),
        }}
      />

      {/* ---- Hero Section ---- */}
      <HeroSection
        title="Thank You"
        label="BARRETT HENRY | THE NOW TEAM"
        subtitle="Your message has been received. Here's what happens next."
      />

      {/* ---- 3-Step Timeline ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">What Happens Next</p>
            <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-primary">
              Your Next Steps
            </h2>
            <div className="section-divider" />
          </div>

          {/* Timeline — 3 columns on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {timelineSteps.map((item) => (
              <div key={item.step} className="text-center px-4">
                {/* Step number circle */}
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading text-xl text-accent font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-heading text-lg text-primary mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-muted font-light text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Call Now Box — for urgent requests ---- */}
      <section className="section-dark">
        <div className="container-wide">
          <div className="max-w-xl mx-auto text-center">
            <p className="heading-label text-white/50 mb-6">Need a Faster Response?</p>
            <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white mb-6">
              Call Barrett Directly
            </h2>
            <div className="section-divider" />
            <p className="font-body text-white/70 font-light mb-8">
              For urgent questions or time-sensitive situations, skip the inbox and call directly.
              Barrett picks up — and if he misses you, he&apos;ll call back.
            </p>
            <a
              href="tel:+18137337907"
              className="btn-primary inline-block text-lg px-10 py-4"
            >
              Call (813) 733-7907
            </a>
            <p className="font-body text-white/40 text-xs mt-4">
              Monday – Friday 9 AM – 6 PM &bull; Saturday 10 AM – 4 PM &bull; Sunday by appointment
            </p>
          </div>
        </div>
      </section>

      {/* ---- Next Steps — 6 recommended links ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">While You Wait</p>
            <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-primary">
              Explore More
            </h2>
            <div className="section-divider" />
          </div>

          {/* 6-link grid — 2 cols mobile, 3 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {nextStepLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card p-6 text-center hover:-translate-y-1 transition-all duration-300 group"
              >
                <p className="font-heading text-sm tracking-[0.1em] uppercase text-primary group-hover:text-accent transition-colors duration-300">
                  {link.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
