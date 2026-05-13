"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
 * Header — client component (needs scroll detection + active link highlighting).
 * Two-tier layout:
 *   1. Slim utility bar with phone/email (hidden on mobile)
 *   2. Main nav bar — gains backdrop-blur glass effect on scroll
 */
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position to toggle glass-effect nav background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    // Set initial state in case page loads already scrolled
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Top utility bar — phone + email, desktop only ── */}
      <div className="hidden md:block bg-primary/95 backdrop-blur-sm border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-1 flex justify-end gap-6 text-xs text-white/60 font-body">
          <a
            href="tel:+18137337907"
            className="flex items-center gap-1.5 hover:text-accent transition-colors duration-200"
          >
            <Phone className="h-3 w-3" />
            (813) 733-7907
          </a>
          <a
            href="mailto:barrett@nowtb.com"
            className="flex items-center gap-1.5 hover:text-accent transition-colors duration-200"
          >
            <Mail className="h-3 w-3" />
            barrett@nowtb.com
          </a>
        </div>
      </div>

      {/* ── Main navigation bar ── */}
      {/* Gains a backdrop-blur glass effect once the user scrolls past 20px */}
      <nav
        className={`
          transition-all duration-300
          ${scrolled
            ? "bg-primary/90 backdrop-blur-md shadow-lg shadow-black/10"
            : "bg-primary"
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* ── Logo / Brand ── */}
          <Link href="/" className="group flex flex-col leading-tight">
            <span className="text-white font-heading text-xl font-bold tracking-tight group-hover:text-accent transition-colors duration-200">
              Barrett Henry
            </span>
            <span className="text-white/60 text-[0.6rem] font-body tracking-widest uppercase">
              REALTOR&reg; | REMAX Collective
            </span>
          </Link>

          {/* ── Desktop nav links — hidden on mobile ── */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              // Highlight the active link by matching the current pathname
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`
                      relative font-body text-sm tracking-wide transition-colors duration-200
                      ${isActive
                        ? "text-white font-medium"
                        : "text-white/80 hover:text-white"
                      }
                    `}
                  >
                    {link.label}
                    {/* Active indicator — accent underline bar */}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Mobile hamburger toggle (client component) ── */}
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
