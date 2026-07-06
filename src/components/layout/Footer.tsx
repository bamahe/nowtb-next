// =============================================================================
// Footer — Refined, minimal luxury footer
// Server component
// Centered layout, generous whitespace, restrained typography
// =============================================================================

import Link from "next/link";

// Quick links for the single nav row
const NAV_LINKS = [
  { href: "/buyers", label: "Buy" },
  { href: "/sellers", label: "Sell" },
  { href: "/properties", label: "Properties" },
  { href: "/communities", label: "Communities" },
  { href: "/sell-your-home", label: "Home Valuation" },
  { href: "/investing", label: "Invest" },
  { href: "/luxury", label: "Luxury" },
  { href: "/property-management", label: "PM" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white font-body">
      {/* ── Main footer content — centered, generous vertical padding ── */}
      <div className="container-wide py-24 text-center">
        {/* Accent divider */}
        <div className="section-divider" />

        {/* Phone number — prominent, larger than email */}
        <a
          href="tel:+18137337907"
          className="block font-heading font-extralight text-xl md:text-2xl tracking-wide text-white/70
                     transition-colors duration-300 hover:text-accent mb-4"
        >
          (813) 733-7907
        </a>

        {/* Email — smaller, muted */}
        <a
          href="mailto:barrett@nowtb.com"
          className="block text-xs tracking-[0.15em] uppercase text-white/40
                     transition-colors duration-300 hover:text-accent mb-12"
        >
          barrett@nowtb.com
        </a>

        {/* Nav links — single row separated by pipes */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 mb-16">
          {NAV_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-white/30 text-xs" aria-hidden="true">|</span>
              )}
              <Link
                href={link.href}
                className="link-underline text-xs tracking-[0.15em] uppercase text-white/60
                           transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom bar — copyright, license, MLS/IDX disclaimer ── */}
      <div className="border-t border-white/5">
        <div className="container-wide py-8 text-center space-y-4">
          {/* Copyright + license */}
          <p className="text-[10px] tracking-[0.1em] uppercase text-white/40">
            &copy; 2026 Barrett Henry, REALTOR&reg; &nbsp;|&nbsp; Broker Associate, REMAX Collective
          </p>
          <p className="text-[10px] tracking-[0.1em] text-white/35">
            Florida Real Estate Broker License #BK3313308 &nbsp;|&nbsp; Designations: e-PRO, MRP, SRS
          </p>
          <p className="text-[10px] tracking-[0.1em] text-white/35">
            REMAX Collective &nbsp;|&nbsp; 14310 N. Dale Mabry Hwy, Ste 100, Tampa, FL 33618
          </p>

          {/* MLS/IDX disclaimer — required by MFRMLS/Stellar MLS */}
          <p className="text-[10px] text-white/30 leading-relaxed max-w-3xl mx-auto">
            Copyright © MFRMLS.com. All information deemed reliable but not guaranteed.
            All properties are subject to prior sale, change or withdrawal. Neither
            listing broker(s) or information provider(s) shall be responsible for any
            typographical errors, misinformation, misprints and shall be held totally
            harmless. Listing(s) information is provided for consumers&apos; personal,
            non-commercial use and may not be used for any purpose other than to
            identify prospective properties consumers may be interested in purchasing.
            The data relating to real estate for sale on this website comes in part
            from the Internet Data Exchange program of MFR MLS.
          </p>

          {/* Equal Housing + site credit */}
          <p className="text-[10px] tracking-[0.1em] uppercase text-white/30">
            Equal Housing Opportunity &nbsp;|&nbsp; Site by Vyrabyte
          </p>
        </div>
      </div>
    </footer>
  );
}
