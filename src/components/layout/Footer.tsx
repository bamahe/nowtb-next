// =============================================================================
// Footer — Refined, minimal luxury footer
// Server component
// Centered layout, generous whitespace, restrained typography
// =============================================================================

import Link from "next/link";

// Quick links for the single nav row
const NAV_LINKS = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white font-body">
      {/* ── Main footer content — centered, generous vertical padding ── */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Brand name — Barrett Henry with NOW Team + brokerage underneath */}
        <p className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.2em] uppercase mb-1">
          Barrett Henry
        </p>
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/30 mb-0">
          The NOW Team &nbsp;|&nbsp; REMAX Collective
        </p>

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
                <span className="text-white/20 text-xs" aria-hidden="true">|</span>
              )}
              <Link
                href={link.href}
                className="link-underline text-xs tracking-[0.15em] uppercase text-white/40
                           transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom bar — copyright + MLS disclaimer, very subdued ── */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 text-center space-y-3">
          {/* Hashtags — subtle brand identifiers */}
          <p className="text-[10px] tracking-[0.15em] uppercase text-white/15 mb-2">
            #TNT &nbsp; #BHRE &nbsp; #REMAX &nbsp; #nowtb
          </p>

          {/* Copyright */}
          <p className="text-[10px] tracking-[0.1em] uppercase text-white/20">
            &copy; 2026 Barrett Henry, REALTOR&reg; &nbsp;|&nbsp; REMAX Collective &nbsp;|&nbsp; Equal Housing Opportunity
          </p>

          {/* MLS disclaimer — intentionally very small and subdued */}
          <p className="text-[10px] text-white/15 leading-relaxed max-w-2xl mx-auto">
            Listing information provided by Stellar MLS. IDX information is for
            personal, non-commercial use only. Data is deemed reliable but not
            guaranteed. All properties are subject to prior sale, change, or
            withdrawal.
          </p>
        </div>
      </div>
    </footer>
  );
}
