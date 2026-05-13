"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

// Navigation links shared with desktop Header
const NAV_LINKS = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/communities", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * MobileNav — client component that handles hamburger menu toggle.
 * Renders a full-screen overlay nav on mobile when open.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger toggle button — only visible on mobile (md:hidden) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="md:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-accent rounded"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Full-screen mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[64px] z-40 bg-primary md:hidden">
          <nav className="flex flex-col items-center gap-6 pt-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-white text-xl font-body hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA button */}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-accent text-primary font-body font-semibold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
