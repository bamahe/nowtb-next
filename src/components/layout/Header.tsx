// =============================================================================
// Header — Ultra-minimal luxury navigation
// Client component (scroll detection + active link highlighting)
// Transparent on hero, transitions to warm cream on scroll
// No utility bar — clean single-tier nav like a luxury fashion brand
// =============================================================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/layout/MobileNav";

// Desktop navigation links
const NAV_LINKS = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position to toggle between transparent and solid backgrounds
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll(); // Set initial state in case page loads already scrolled
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <nav
        className={`
          transition-all duration-500 ease-in-out
          ${scrolled
            ? "bg-[#F8F6F3] shadow-[0_1px_0_rgba(0,0,0,0.05)]"
            : "bg-transparent"
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* ── Logo / Brand — Barrett Henry with NOW Team subtitle ── */}
          <Link href="/" className="group flex flex-col">
            <span
              className={`
                font-heading font-light text-lg tracking-[0.25em] uppercase leading-tight
                transition-colors duration-500
                ${scrolled ? "text-primary" : "text-white"}
              `}
            >
              Barrett Henry
            </span>
            <span
              className={`
                font-body text-[9px] tracking-[0.2em] uppercase leading-tight
                transition-colors duration-500
                ${scrolled ? "text-primary/40" : "text-white/40"}
              `}
            >
              The NOW Team &nbsp;|&nbsp; REMAX
            </span>
          </Link>

          {/* ── Desktop nav links + phone number ── */}
          <ul className="hidden md:flex items-center gap-10">
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
                      link-underline font-body text-xs tracking-[0.15em] uppercase
                      transition-colors duration-300
                      ${scrolled
                        ? isActive
                          ? "text-primary"
                          : "text-primary/60 hover:text-primary"
                        : isActive
                          ? "text-white"
                          : "text-white/60 hover:text-white"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Phone number — visible on desktop, right-aligned ── */}
          <a
            href="tel:+18137337907"
            className={`
              hidden md:block font-body text-xs tracking-[0.15em] uppercase
              transition-colors duration-500
              ${scrolled ? "text-primary/50 hover:text-primary" : "text-white/50 hover:text-white"}
            `}
          >
            (813) 733-7907
          </a>

          {/* ── Mobile hamburger toggle ── */}
          <MobileNav scrolled={scrolled} />
        </div>
      </nav>
    </header>
  );
}
