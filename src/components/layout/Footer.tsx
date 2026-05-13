import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

// Community links — top cities linking to their hub pages
const COMMUNITIES = [
  { href: "/communities/valrico", label: "Valrico" },
  { href: "/communities/brandon", label: "Brandon" },
  { href: "/communities/riverview", label: "Riverview" },
  { href: "/communities/tampa", label: "Tampa" },
  { href: "/communities/lithia", label: "Lithia" },
  { href: "/communities/fishhawk", label: "FishHawk" },
  { href: "/communities/plant-city", label: "Plant City" },
  { href: "/communities/seffner", label: "Seffner" },
];

// Quick links for footer navigation
const QUICK_LINKS = [
  { href: "/buy", label: "Buy a Home" },
  { href: "/sell", label: "Sell Your Home" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About Barrett" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

// Social media links — update hrefs with real profile URLs later
const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", abbr: "Fb" },
  { href: "https://instagram.com", label: "Instagram", abbr: "Ig" },
  { href: "https://linkedin.com", label: "LinkedIn", abbr: "Li" },
  { href: "https://youtube.com", label: "YouTube", abbr: "Yt" },
];

/**
 * Footer — server component.
 * Premium 4-column layout with generous spacing, accent hover states,
 * and a subtle bottom bar with copyright + MLS disclaimer.
 */
export default function Footer() {
  return (
    <footer className="bg-primary text-white font-body">
      {/* ── Main footer content — 4-column grid ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

          {/* ── Column 1: About + Contact Info ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Brand name in heading font */}
            <h3 className="font-heading text-xl font-bold mb-1">Barrett Henry</h3>
            <p className="text-accent text-xs tracking-widest uppercase mb-4">
              REALTOR&reg; | REMAX Collective
            </p>
            {/* Short bio — 2-3 sentences max */}
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Broker Associate with 23+ years of real estate experience, helping
              Tampa Bay buyers and sellers navigate the market with expert
              guidance and genuine care.
            </p>

            {/* Contact details with icons */}
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a
                  href="tel:+18137337907"
                  className="flex items-center gap-2.5 hover:text-accent transition-colors duration-200"
                >
                  <Phone className="h-3.5 w-3.5 text-accent/70 shrink-0" />
                  (813) 733-7907
                </a>
              </li>
              <li>
                <a
                  href="mailto:barrett@nowtb.com"
                  className="flex items-center gap-2.5 hover:text-accent transition-colors duration-200"
                >
                  <Mail className="h-3.5 w-3.5 text-accent/70 shrink-0" />
                  barrett@nowtb.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-accent/70 shrink-0" />
                <span>Tampa Bay, Florida</span>
              </li>
            </ul>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-accent hover:translate-x-0.5 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Communities ── */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-5">Communities</h3>
            <ul className="space-y-2.5">
              {COMMUNITIES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-accent hover:translate-x-0.5 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Connect — social links + CTA button ── */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-5">Connect</h3>

            {/* Social media icon circles — swap for real brand SVGs later */}
            <div className="flex gap-3 mb-8">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center
                             text-white/50 text-xs font-body font-medium
                             hover:border-accent hover:text-accent hover:bg-accent/10
                             transition-all duration-200"
                >
                  {/* Placeholder abbreviation — replace with brand icon SVGs */}
                  {social.abbr}
                </a>
              ))}
            </div>

            {/* CTA button */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3
                         font-body font-semibold text-sm text-primary
                         hover:bg-accent/85 hover:shadow-lg hover:shadow-accent/20
                         transition-all duration-300"
            >
              Contact Barrett
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar — divider + copyright + MLS disclaimer ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-2">
          {/* Copyright line */}
          <p className="text-white/40 text-xs text-center">
            &copy; 2026 Barrett Henry, REALTOR&reg; | REMAX Collective | Equal
            Housing Opportunity
          </p>

          {/* MLS disclaimer — intentionally very small and subdued */}
          <p className="text-white/25 text-[0.6rem] text-center leading-relaxed max-w-2xl mx-auto">
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
