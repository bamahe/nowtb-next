import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import MobileNav from "@/components/layout/MobileNav";

// Desktop navigation links
const NAV_LINKS = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Header — server component.
 * Renders a sticky top bar with contact info and main navigation.
 * Mobile hamburger menu is handled by the client-side MobileNav component.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar — phone + email, hidden on mobile */}
      <div className="hidden md:block bg-dark border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex justify-end gap-6 text-sm text-white/70 font-body">
          <a
            href="tel:+18137337907"
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            (813) 733-7907
          </a>
          <a
            href="mailto:barrett@nowtb.com"
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            barrett@nowtb.com
          </a>
        </div>
      </div>

      {/* Main navigation bar */}
      <nav className="bg-primary shadow-md">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          {/* Logo / Brand name */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-white font-heading text-xl tracking-tight">
              Barrett Henry
            </span>
            <span className="text-accent text-[0.65rem] font-body tracking-widest uppercase">
              REALTOR&reg; &middot; REMAX Collective
            </span>
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white font-body text-sm tracking-wide hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger toggle (client component) */}
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
