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
  { href: "/buyers", label: "Buy" },
  { href: "/sellers", label: "Sell" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Pages that don't have a dark hero background behind the header
// On these pages, use dark text even when not scrolled
const LIGHT_BG_PATTERNS = ["/properties/"];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Does this page have a light background behind the header? (no dark hero)
  const hasLightBg = LIGHT_BG_PATTERNS.some((p) => pathname.startsWith(p));

  // When the page has a light bg, always use dark text (same as scrolled style)
  const useDarkText = scrolled || hasLightBg;

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
          ${scrolled || hasLightBg
            ? "bg-[#F8F6F3] shadow-[0_1px_0_rgba(0,0,0,0.05)]"
            : "bg-transparent"
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* ── Logo — REMAX branded logo, swaps between dark and light ── */}
          {/* Using <img> instead of next/image to avoid optimization proxy issues */}
          <Link href="/" className="group flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://nowtb.com/wp-content/uploads/2026/02/REMAX_Logo_Barrett_Henry__Black_.png"
              alt="Barrett Henry — REMAX Collective"
              width={180}
              height={50}
              className={`
                h-10 w-auto transition-all duration-500
                ${useDarkText ? "" : "brightness-0 invert"}
              `}
            />
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
                      ${useDarkText
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

          {/* ── Phone + Sign In — visible on desktop, right-aligned ── */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+18137337907"
              className={`
                font-body text-xs tracking-[0.15em] uppercase
                transition-colors duration-500
                ${useDarkText ? "text-primary/50 hover:text-primary" : "text-white/50 hover:text-white"}
              `}
            >
              (813) 733-7907
            </a>
            {/* Only show Sign In link when Supabase is configured */}
            {process.env.NEXT_PUBLIC_SUPABASE_URL && (
              <Link
                href="/login"
                className={`
                  font-body text-xs tracking-[0.15em] uppercase
                  transition-colors duration-500
                  ${useDarkText ? "text-primary/50 hover:text-primary" : "text-white/50 hover:text-white"}
                `}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* ── Mobile hamburger toggle ── */}
          <MobileNav scrolled={useDarkText} />
        </div>
      </nav>
    </header>
  );
}
