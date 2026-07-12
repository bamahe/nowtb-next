// =============================================================================
// Footer — Refined, minimal luxury footer
// Server component
// Centered layout, generous whitespace, restrained typography
// =============================================================================

import Link from "next/link";

// Footer navigation organized into themed columns
const FOOTER_COLUMNS = [
  {
    title: "Buy",
    links: [
      { href: "/buyers", label: "Buyer's Guide" },
      { href: "/properties", label: "Search Properties" },
      { href: "/mortgage-calculator", label: "Mortgage Calculator" },
      { href: "/open-houses", label: "Open Houses" },
      { href: "/first-time-home-buyer-guide", label: "First-Time Buyers" },
      { href: "/fha-loan-florida", label: "FHA Loans" },
      { href: "/va-loan-florida", label: "VA Loans" },
    ],
  },
  {
    title: "Sell",
    links: [
      { href: "/sellers", label: "Seller's Guide" },
      { href: "/free-home-valuation", label: "Free Home Valuation" },
      { href: "/sell-your-home", label: "Sell Your Home" },
      { href: "/fsbo-vs-realtor", label: "FSBO vs. REALTOR" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/communities", label: "Communities" },
      { href: "/market-updates", label: "Market Updates" },
      { href: "/guides", label: "Guides" },
      { href: "/investing", label: "Investing" },
      { href: "/luxury", label: "Luxury Homes" },
      { href: "/commercial", label: "Commercial" },
    ],
  },
  {
    title: "Cities",
    links: [
      { href: "/valrico", label: "Valrico" },
      { href: "/brandon", label: "Brandon" },
      { href: "/riverview", label: "Riverview" },
      { href: "/lithia", label: "Lithia" },
      { href: "/apollo-beach", label: "Apollo Beach" },
      { href: "/seffner", label: "Seffner" },
      { href: "/plant-city", label: "Plant City" },
      { href: "/dover", label: "Dover" },
      { href: "/thonotosassa", label: "Thonotosassa" },
      { href: "/ruskin", label: "Ruskin" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Blog" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-use", label: "Terms of Use" },
      { href: "/fair-housing", label: "Fair Housing" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white font-body">
      {/* ── Main footer content — centered, generous vertical padding ── */}
      <div className="container-wide py-24 text-center">
        {/* Accent divider */}
        <div className="section-divider" />

        {/* Phone number — prominent, larger than email */}
        <a
          href="tel:+18137337907"
          className="block font-heading font-extralight text-xl md:text-2xl tracking-wide text-white/70
                     transition-colors duration-300 hover:text-accent mb-4"
        >
          (813) 733-7907
        </a>

        {/* Email — smaller, muted */}
        <a
          href="mailto:barrett@nowtb.com"
          className="block text-xs tracking-[0.15em] uppercase text-white/40
                     transition-colors duration-300 hover:text-accent mb-12"
        >
          barrett@nowtb.com
        </a>

        {/* Nav links — organized into themed columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-left mb-16">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              {/* p tag for column header — NOT h2/h3, footer headings waste SEO hierarchy */}
              <p className="text-xs tracking-[0.2em] uppercase text-white/80 font-semibold mb-4">
                {column.title}
              </p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs tracking-[0.1em] text-white/50
                                 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar — copyright, license, MLS/IDX disclaimer ── */}
      <div className="border-t border-white/5">
        <div className="container-wide py-8 text-center space-y-4">
          {/* Copyright + license */}
          <p className="text-[10px] tracking-[0.1em] uppercase text-white/40">
            &copy; 2026 Barrett Henry, REALTOR&reg; &nbsp;|&nbsp; Broker Associate, REMAX Collective
          </p>
          <p className="text-[10px] tracking-[0.1em] text-white/35">
            Florida Real Estate Broker License #BK3313308 &nbsp;|&nbsp; Designations: e-PRO, MRP, SRS
          </p>
          <p className="text-[10px] tracking-[0.1em] text-white/35">
            REMAX Collective &nbsp;|&nbsp; 14310 N. Dale Mabry Hwy, Ste 100, Tampa, FL 33618
          </p>

          {/* MLS/IDX disclaimer — required by MFRMLS/Stellar MLS */}
          <p className="text-[10px] text-white/30 leading-relaxed max-w-3xl mx-auto">
            Copyright © MFRMLS.com. All information deemed reliable but not guaranteed.
            All properties are subject to prior sale, change or withdrawal. Neither
            listing broker(s) or information provider(s) shall be responsible for any
            typographical errors, misinformation, misprints and shall be held totally
            harmless. Listing(s) information is provided for consumers&apos; personal,
            non-commercial use and may not be used for any purpose other than to
            identify prospective properties consumers may be interested in purchasing.
            The data relating to real estate for sale on this website comes in part
            from the Internet Data Exchange program of MFR MLS.
          </p>

          {/* Equal Housing + site credit */}
          <p className="text-[10px] tracking-[0.1em] uppercase text-white/30">
            Equal Housing Opportunity &nbsp;|&nbsp; Site by Vyrabyte
          </p>
        </div>
      </div>
    </footer>
  );
}
