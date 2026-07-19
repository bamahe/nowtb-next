// =============================================================================
// MobileNav — Full-screen luxury mobile menu overlay
// Client component — manages open/close state and body scroll lock
// Centered links in heading font, generous spacing, contact at bottom
// =============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Navigation links (same as desktop Header)
const NAV_LINKS = [
  { href: "/properties/", label: "Search" },
  { href: "/buyers/", label: "Buy" },
  { href: "/sellers/", label: "Sell" },
  { href: "/communities/", label: "Communities" },
  { href: "/guides/", label: "Guides" },
  { href: "/open-houses/", label: "Open Houses" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

interface MobileNavProps {
  /** Whether the header is in scrolled (solid bg) state — controls icon color */
  scrolled?: boolean;
}

export default function MobileNav({ scrolled = false }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  // Check auth state
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, [pathname]);

  // Close the menu when the route changes (user taps a link)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open to prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* ── Hamburger toggle — only visible below md breakpoint ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className={`
          md:hidden relative z-[10000] p-2 -mr-2
          focus:outline-none transition-colors duration-300
          text-white hover:text-accent
        `}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* ── Full-screen mobile overlay ── */}
      <div
        aria-hidden={!isOpen}
        className={`
          fixed inset-0 z-[9999] md:hidden
          bg-[#0c1829]
          transition-opacity duration-500
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Full-screen dark overlay — fully opaque, no bleed-through */}
        <div
          className={`
            absolute inset-0 bg-[#0c1829]
            flex flex-col items-center justify-center
            transition-all duration-500
            ${isOpen ? "scale-100" : "scale-95"}
          `}
        >
          {/* ── Navigation links — large heading font, centered, generous gaps ── */}
          <nav className="flex flex-col items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className={`
                    font-heading font-extralight text-3xl tracking-[0.15em] uppercase
                    transition-colors duration-300
                    ${isActive ? "text-accent" : "text-white/70 hover:text-white"}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Bottom section — auth + contact info ── */}
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4">
            {/* Sign In / Account link */}
            <Link
              href={isLoggedIn ? "/account/" : "/login/"}
              onClick={close}
              className="text-sm tracking-[0.15em] uppercase text-accent
                         transition-colors duration-300 hover:text-white font-medium"
            >
              {isLoggedIn ? "My Account" : "Sign In"}
            </Link>
            <a
              href="tel:+18137337907"
              className="text-xs tracking-[0.15em] uppercase text-white/40
                         transition-colors duration-300 hover:text-accent"
            >
              (813) 733-7907
            </a>
            <a
              href="mailto:barrett@nowtb.com"
              className="text-xs tracking-[0.15em] uppercase text-white/40
                         transition-colors duration-300 hover:text-accent"
            >
              barrett@nowtb.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
