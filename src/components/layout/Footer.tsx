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
        {/* Brand name — large, ultra-light, wide tracking */}
        <p className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.2em] uppercase mb-0">
          Barrett Henry
        </p>

        {/* Accent divider */}
        <div className="section-divider" />

        {/* Contact info — small uppercase, muted */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12">
          <a
            href="tel:+18137337907"
            className="text-xs tracking-[0.15em] uppercase text-white/50
                       transition-colors duration-300 hover:text-accent"
          >
            (813) 733-7907
          </a>
          <a
            href="mailto:barrett@nowtb.com"
            className="text-xs tracking-[0.15em] uppercase text-white/50
                       transition-colors duration-300 hover:text-accent"
          >
            barrett@nowtb.com
          </a>
        </div>

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
