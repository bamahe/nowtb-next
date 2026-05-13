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

// Navigation links (same as desktop Header)
const NAV_LINKS = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface MobileNavProps {
  /** Whether the header is in scrolled (solid bg) state — controls icon color */
  scrolled?: boolean;
}

export default function MobileNav({ scrolled = false }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
          md:hidden relative z-50 p-2 -mr-2
          focus:outline-none transition-colors duration-300
          ${isOpen
            ? "text-white"
            : scrolled
              ? "text-primary hover:text-accent"
              : "text-white hover:text-accent"
          }
        `}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* ── Full-screen mobile overlay ── */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-opacity duration-500
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Full-screen dark overlay with heavy blur */}
        <div
          className={`
            absolute inset-0 bg-primary/[0.98] backdrop-blur-xl
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

          {/* ── Bottom section — contact info in small uppercase ── */}
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3">
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
