// =============================================================================
// Header — Professional real estate navigation with mega-menu dropdowns
// Client component (scroll detection + hover dropdowns + active link)
// Transparent on hero, transitions to warm cream on scroll
// Mega menus on desktop (md+), hamburger on mobile
// =============================================================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MobileNav from "@/components/layout/MobileNav";

// ---------------------------------------------------------------------------
// Dropdown menu data — each top-level nav item and its children
// ---------------------------------------------------------------------------

// Simple link type used in dropdown menus
interface NavLink {
  href: string;
  label: string;
}

// A dropdown section can be a flat list or a multi-column grid (Communities)
interface NavItem {
  label: string;
  href?: string;            // Direct link (no dropdown) — used by Contact
  links?: NavLink[];        // Single-column dropdown links
  columns?: NavLink[][];    // Multi-column grid (Communities mega menu)
  columnHeader?: string;    // Optional header above columns (e.g. "Top Cities")
  topLinks?: NavLink[];     // Links shown above the columns (e.g. "All Communities")
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Search",
    links: [
      { href: "/properties/search/", label: "Advanced Search" },
      { href: "/properties/search/", label: "Search by Map" },
      { href: "/properties/", label: "Browse Properties" },
      { href: "/properties/?sort=ListPrice+desc", label: "Featured Listings" },
      { href: "/communities/", label: "Browse by City" },
      { href: "/properties/?sort=ModificationTimestamp+desc", label: "Newest Listings" },
    ],
  },
  {
    label: "Communities",
    topLinks: [
      { href: "/communities/", label: "All Communities" },
    ],
    columns: [
      // Column 1
      [
        { href: "/tampa/", label: "Tampa" },
        { href: "/brandon/", label: "Brandon" },
        { href: "/riverview/", label: "Riverview" },
        { href: "/valrico/", label: "Valrico" },
        { href: "/apollo-beach/", label: "Apollo Beach" },
        { href: "/clearwater/", label: "Clearwater" },
        { href: "/st-petersburg/", label: "St. Petersburg" },
        { href: "/largo/", label: "Largo" },
        { href: "/wesley-chapel/", label: "Wesley Chapel" },
        { href: "/trinity/", label: "Trinity" },
      ],
      // Column 2
      [
        { href: "/lakeland/", label: "Lakeland" },
        { href: "/sarasota/", label: "Sarasota" },
        { href: "/bradenton/", label: "Bradenton" },
        { href: "/new-port-richey/", label: "New Port Richey" },
        { href: "/plant-city/", label: "Plant City" },
        { href: "/lutz/", label: "Lutz" },
        { href: "/westchase/", label: "Westchase" },
        { href: "/carrollwood/", label: "Carrollwood" },
        { href: "/palm-harbor/", label: "Palm Harbor" },
        { href: "/dunedin/", label: "Dunedin" },
      ],
      // Column 3
      [
        { href: "/winter-haven/", label: "Winter Haven" },
        { href: "/safety-harbor/", label: "Safety Harbor" },
        { href: "/seminole/", label: "Seminole" },
        { href: "/land-o-lakes/", label: "Land O' Lakes" },
        { href: "/temple-terrace/", label: "Temple Terrace" },
        { href: "/sun-city-center/", label: "Sun City Center" },
        { href: "/spring-hill/", label: "Spring Hill" },
        { href: "/brooksville/", label: "Brooksville" },
        { href: "/crystal-river/", label: "Crystal River" },
        { href: "/north-port/", label: "North Port" },
      ],
    ],
  },
  {
    label: "Buyers",
    links: [
      { href: "/buyers/", label: "Info for Buyers" },
      { href: "/properties/", label: "Browse Homes" },
      { href: "/mortgage-calculator/", label: "Mortgage Calculator" },
      { href: "/open-houses/", label: "Open Houses" },
      { href: "/first-time-home-buyer-guide/", label: "First-Time Buyer Guide" },
      { href: "/relocation/", label: "Relocating to Tampa Bay" },
    ],
  },
  {
    label: "Sellers",
    links: [
      { href: "/sellers/", label: "Selling Your Home" },
      { href: "/free-home-valuation/", label: "Free Home Valuation" },
      { href: "/fsbo-vs-realtor/", label: "FSBO vs. Hiring a REALTOR" },
      { href: "/sell-your-home/", label: "Sell Your Home Fast" },
    ],
  },
  {
    label: "Guides",
    links: [
      { href: "/guides/", label: "All Guides" },
      { href: "/florida-homestead-exemption-save-our-homes/", label: "Homestead & Save Our Homes" },
      { href: "/fha-loan-florida/", label: "FHA Loans" },
      { href: "/va-loan-florida/", label: "VA Loans" },
      { href: "/conventional-loan-florida/", label: "Conventional Loans" },
      { href: "/jumbo-loan-florida/", label: "Jumbo Loans" },
      { href: "/first-time-home-buyer-guide/", label: "First-Time Buyer Guide" },
      { href: "/new-construction-vs-resale/", label: "New Build vs. Resale" },
      { href: "/renting-vs-buying/", label: "Renting vs. Buying" },
    ],
  },
  {
    label: "About",
    links: [
      { href: "/about/", label: "About Barrett" },
      { href: "/the-now-team/", label: "The NOW Team" },
      { href: "/about/#testimonials", label: "Reviews & Testimonials" },
      { href: "/blog/", label: "Blog" },
      { href: "/market-updates/", label: "Market Updates" },
      { href: "/contact/", label: "Contact" },
    ],
  },
  {
    // Contact — direct link, no dropdown
    label: "Contact",
    href: "/contact/",
  },
];

// Pages that don't have a dark hero background behind the header
// On these pages, use dark text even when not scrolled
const LIGHT_BG_PATTERNS = ["/properties/"];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Which dropdown is currently open (by index), or null if none
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Timeout ref for delayed close — gives user time to move mouse into dropdown
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Does this page have a light background behind the header? (no dark hero)
  const hasLightBg = LIGHT_BG_PATTERNS.some((p) => pathname.startsWith(p));

  // When the page has a light bg, always use dark text (same as scrolled style)
  const useDarkText = scrolled || hasLightBg;

  // Close dropdown when navigating to a new page
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  // Clear any pending close timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  // Open a dropdown immediately, canceling any pending close
  const handleMouseEnter = useCallback((index: number) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpenDropdown(index);
  }, []);

  // Delay closing so user can move mouse from nav item into the dropdown panel
  const handleMouseLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  // When mouse enters the dropdown panel, cancel the close
  const handleDropdownEnter = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  // When mouse leaves the dropdown panel, start the close timer
  const handleDropdownLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  // Check auth state
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, [pathname]);

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
            ? "bg-primary shadow-[0_1px_0_rgba(0,0,0,0.2)]"
            : "bg-primary/80 backdrop-blur-sm"
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* ── Logo — REMAX branded logo, swaps between dark and light ── */}
          {/* Using <img> instead of next/image to avoid optimization proxy issues */}
          <Link href="/" className="group flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/remax-logo-color.png"
              alt="Barrett Henry — REMAX Collective"
              width={200}
              height={55}
              className="h-11 w-auto"
            />
          </Link>

          {/* ── Desktop nav links with mega-menu dropdowns ── */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item, index) => {
              // Check if this nav item is "active" based on current path
              const hasDropdown = !!(item.links || item.columns);
              const itemHref = item.href || "";
              const isActive =
                (itemHref && pathname.startsWith(itemHref)) ||
                (item.links?.some((l) => pathname.startsWith(l.href)) ?? false) ||
                (item.columns?.some((col) =>
                  col.some((l) => pathname.startsWith(l.href))
                ) ?? false) ||
                (item.topLinks?.some((l) => pathname.startsWith(l.href)) ?? false);

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Nav item label — link if no dropdown, button-like if dropdown */}
                  {hasDropdown ? (
                    <button
                      type="button"
                      className={`
                        font-body text-xs tracking-[0.15em] uppercase
                        transition-colors duration-300 flex items-center gap-1
                        ${isActive
                          ? "text-white"
                          : "text-white/60 hover:text-white"
                        }
                      `}
                      aria-expanded={openDropdown === index}
                      aria-haspopup="true"
                    >
                      {item.label}
                      {/* Small chevron indicator */}
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${
                          openDropdown === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href || "/"}
                      className={`
                        font-body text-xs tracking-[0.15em] uppercase
                        transition-colors duration-300
                        ${isActive
                          ? "text-white"
                          : "text-white/60 hover:text-white"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ── Phone + Blog + Sign In — visible on desktop, right-aligned ── */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+18137337907"
              className={`
                font-body text-xs tracking-[0.15em] uppercase
                transition-colors duration-500
                text-white hover:text-accent
              `}
            >
              (813) 733-7907
            </a>
            {/* Auth link — Login/Register or Account */}
            {process.env.NEXT_PUBLIC_SUPABASE_URL && (
              <Link
                href={isLoggedIn ? "/account/" : "/login/"}
                className={`
                  font-body text-xs tracking-[0.15em] uppercase
                  transition-colors duration-500
                  text-white/50 hover:text-white
                `}
              >
                {isLoggedIn ? "My Account" : "Login / Register"}
              </Link>
            )}
            {/* Language switcher */}
          </div>

          {/* ── Mobile hamburger toggle ── */}
          <MobileNav scrolled={useDarkText} />
        </div>
      </nav>

      {/* ── Mega-menu dropdown panels (desktop only) ── */}
      {/* Rendered outside the nav bar so they can span full width */}
      {NAV_ITEMS.map((item, index) => {
        const hasDropdown = !!(item.links || item.columns);
        if (!hasDropdown) return null;

        const isOpen = openDropdown === index;

        return (
          <div
            key={item.label}
            className={`
              hidden md:block absolute left-0 right-0 z-[60]
              transition-all duration-200 ease-out
              ${isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
              }
            `}
            style={{ top: "80px" }} // Matches the h-20 header height
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            {/* Dark navy dropdown background */}
            <div className="bg-[#0c1829] border-t border-white/10 shadow-2xl">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Single-column dropdown (Search, Buyers, Sellers, About) ── */}
                {item.links && !item.columns && (
                  <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                    {item.links.map((link) => (
                      <Link
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        onClick={() => setOpenDropdown(null)}
                        className="
                          text-white/70 hover:text-white text-sm font-body
                          transition-colors duration-200
                          py-1.5 border-b border-white/5 hover:border-white/20
                        "
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* ── Multi-column mega menu (Communities) ── */}
                {item.columns && (
                  <div>
                    {/* Top links above the columns (e.g. "All Communities") */}
                    {item.topLinks && (
                      <div className="mb-6 pb-4 border-b border-white/10">
                        {item.topLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpenDropdown(null)}
                            className="
                              text-white font-body text-sm font-semibold uppercase
                              tracking-[0.1em] hover:text-white/80
                              transition-colors duration-200
                            "
                          >
                            {link.label} &rarr;
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* 3-column city grid */}
                    <div className="grid grid-cols-3 gap-x-12 gap-y-0">
                      {item.columns.map((column, colIndex) => (
                        <div key={colIndex} className="space-y-1">
                          {column.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpenDropdown(null)}
                              className="
                                block text-white/70 hover:text-white text-sm font-body
                                transition-colors duration-200
                                py-1.5 border-b border-white/5 hover:border-white/20
                              "
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </header>
  );
}
