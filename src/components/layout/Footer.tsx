import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

// Community links for the footer column
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

// Quick links for the footer column
const QUICK_LINKS = [
  { href: "/buy", label: "Buy a Home" },
  { href: "/sell", label: "Sell Your Home" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About Barrett" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

// Social media links — update hrefs with real profile URLs later
// lucide-react doesn't include brand icons, so we use ExternalLink as placeholder
const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://youtube.com", label: "YouTube" },
];

/**
 * Footer — server component.
 * 4-column layout: About, Quick Links, Communities, Contact Info.
 * Bottom bar with copyright, brokerage info, and MLS disclaimer.
 */
export default function Footer() {
  return (
    <footer className="bg-primary text-white font-body">
      {/* Main footer content — 4 columns */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About */}
          <div>
            <h3 className="font-heading text-lg mb-4">Barrett Henry</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              REALTOR&reg; and Broker Associate with REMAX Collective, serving
              Tampa Bay with 23+ years of real estate experience. Helping buyers
              and sellers navigate the market with expert guidance and local
              knowledge.
            </p>

            {/* Social links — swap ExternalLink for brand SVGs later */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white/50 hover:text-accent transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Communities */}
          <div>
            <h3 className="font-heading text-lg mb-4">Communities</h3>
            <ul className="space-y-2">
              {COMMUNITIES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-heading text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a
                  href="tel:+18137337907"
                  className="flex items-start gap-2 hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  (813) 733-7907
                </a>
              </li>
              <li>
                <a
                  href="mailto:barrett@nowtb.com"
                  className="flex items-start gap-2 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  barrett@nowtb.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>Tampa Bay, Florida</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar — copyright, brokerage, MLS disclaimer */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 space-y-3">
          {/* Copyright line */}
          <p className="text-white/50 text-xs text-center">
            &copy; 2026 Barrett Henry, REALTOR&reg; | REMAX Collective | Equal
            Housing Opportunity
          </p>

          {/* MLS disclaimer */}
          <p className="text-white/30 text-[0.65rem] text-center leading-relaxed max-w-3xl mx-auto">
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
