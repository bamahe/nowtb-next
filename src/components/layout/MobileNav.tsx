"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail } from "lucide-react";

// Navigation links (same as desktop Header)
const NAV_LINKS = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * MobileNav — client component for the hamburger menu.
 * Full-screen overlay that slides in from the right with backdrop-blur.
 * Centered nav links, contact info, and CTA at the bottom.
 */
export default function MobileNav() {
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
        className="md:hidden relative z-50 text-white p-2 -mr-2
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg
                   transition-colors duration-200 hover:text-accent"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* ── Full-screen mobile overlay ── */}
      {/* Backdrop + slide-in panel */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Dark backdrop — tap to close */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={close}
          aria-hidden="true"
        />

        {/* Slide-in panel from the right */}
        <div
          className={`
            absolute inset-y-0 right-0 w-full max-w-sm
            bg-primary/[0.98] backdrop-blur-lg
            flex flex-col
            transition-transform duration-300 ease-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Spacer for the header behind the overlay */}
          <div className="h-20" />

          {/* ── Navigation links — centered, large text, generous spacing ── */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
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
                    text-2xl font-body tracking-wide transition-colors duration-200
                    ${isActive
                      ? "text-accent font-medium"
                      : "text-white/80 hover:text-white"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Bottom section — contact info + CTA ── */}
          <div className="px-8 pb-10 space-y-5">
            {/* Contact details */}
            <div className="space-y-2.5 text-sm text-white/50">
              <a
                href="tel:+18137337907"
                className="flex items-center gap-2 hover:text-accent transition-colors duration-200"
              >
                <Phone className="h-3.5 w-3.5 text-accent/70" />
                (813) 733-7907
              </a>
              <a
                href="mailto:barrett@nowtb.com"
                className="flex items-center gap-2 hover:text-accent transition-colors duration-200"
              >
                <Mail className="h-3.5 w-3.5 text-accent/70" />
                barrett@nowtb.com
              </a>
            </div>

            {/* CTA button — full width on mobile */}
            <Link
              href="/contact"
              onClick={close}
              className="block w-full text-center rounded-lg bg-accent px-6 py-3.5
                         font-body font-semibold text-primary text-sm
                         hover:bg-accent/85 transition-colors duration-200"
            >
              Contact Barrett
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
