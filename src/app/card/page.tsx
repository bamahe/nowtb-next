// =============================================================================
// /card — Barrett Henry's digital business card
// Full-screen dark navy design, mobile-first (max-width 430px card)
// Hides site header/footer/mobile bar via CSS so the card is full-screen
// =============================================================================

"use client";

import Image from "next/image";
import { useState } from "react";

// ---------------------------------------------------------------------------
// vCard download helper — creates a .vcf file and triggers browser download
// ---------------------------------------------------------------------------
function downloadVCard() {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Henry;Barrett;;;",
    "FN:Barrett Henry",
    "ORG:REMAX Collective",
    "TITLE:Broker Associate",
    "TEL;TYPE=CELL:+18137337907",
    "EMAIL:barrett@nowtb.com",
    "URL:https://nowtb.com",
    "URL;TYPE=vCard:https://nowtb.com/card/",
    "ADR;TYPE=WORK;LABEL=Tampa Office:;;14310 N Dale Mabry Hwy, Ste 100;Tampa;FL;33618;US",
    "ADR;TYPE=WORK;LABEL=Brandon Office:;;417 Lithia Pinecrest Rd;Brandon;FL;33511;US",
    "ADR;TYPE=WORK;LABEL=Largo Office:;;11200 Seminole Blvd, Ste 202 & 204;Largo;FL;33778;US",
    "NOTE:Your REALTOR® from REMAX | Tampa Bay Area Real Estate",
    "END:VCARD",
  ].join("\n");

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Barrett-Henry.vcf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Web Share API helper — falls back to clipboard copy if unsupported
// ---------------------------------------------------------------------------
function shareCard() {
  const shareData = {
    title: "Barrett Henry - REMAX Collective",
    text: "Check out Barrett Henry, Broker Associate with REMAX Collective — Tampa Bay real estate.",
    url: "https://nowtb.com/card/",
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard
      .writeText("https://nowtb.com/card/")
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("https://nowtb.com/card/"));
  }
}

// ---------------------------------------------------------------------------
// Office data used in the modal bottom sheet
// ---------------------------------------------------------------------------
const offices = [
  {
    name: "Tampa Office",
    address: "14310 N Dale Mabry Hwy, Ste 100, Tampa, FL 33618",
    mapUrl:
      "https://maps.google.com/?q=14310+N+Dale+Mabry+Hwy+Ste+100+Tampa+FL+33618",
  },
  {
    name: "Brandon Office",
    address: "417 Lithia Pinecrest Rd, Brandon, FL 33511",
    mapUrl:
      "https://maps.google.com/?q=417+Lithia+Pinecrest+Rd+Brandon+FL+33511",
  },
  {
    name: "Largo Office",
    address: "11200 Seminole Blvd, Ste 202 & 204, Largo, FL 33778",
    mapUrl:
      "https://maps.google.com/?q=11200+Seminole+Blvd+Suite+202+Largo+FL+33778",
  },
];

// ---------------------------------------------------------------------------
// Resource links for the "Resources" section
// ---------------------------------------------------------------------------
const buyerResources = [
  {
    title: "Search Homes",
    desc: "Browse listings & set up auto-alerts",
    href: "https://nowtb.com/tampa-bay-area-homes-for-sale/",
    iconColor: "#42A5F5",
    bgClass: "bg-blue-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#42A5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "First-Time Buyers",
    desc: "Step-by-step guide to your first home",
    href: "https://nowtb.com/first-time-buyers/",
    bgClass: "bg-green-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "Down Payment Assistance",
    desc: "Programs to help you buy with less upfront",
    href: "https://nowtb.com/down-payment-assistance/",
    bgClass: "bg-amber-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FFA726" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Mortgage Lenders",
    desc: "Trusted local lenders I work with",
    href: "https://nowtb.com/lenders/",
    bgClass: "bg-purple-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#AB47BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="1" y="6" width="22" height="15" rx="2" /><path d="M1 10h22" /><path d="M6 14h4" />
      </svg>
    ),
  },
  {
    title: "Home Inspectors",
    desc: "Recommended inspection professionals",
    href: "https://nowtb.com/inspectors/",
    bgClass: "bg-teal-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#26A69A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="m9 14 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Commercial Real Estate",
    desc: "Investment, retail, multi-family & land",
    href: "https://nowtb.com/commercial/",
    bgClass: "bg-slate-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#78909C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
        <path d="M12 10h.01" /><path d="M16 10h.01" /><path d="M8 10h.01" />
        <path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 14h.01" />
      </svg>
    ),
  },
];

const sellerResources = [
  {
    title: "What's My Home Worth?",
    desc: "Get a free, instant home valuation",
    href: "https://nowtb.com/home-valuation/",
    bgClass: "bg-red-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <line x1="12" y1="10" x2="12" y2="16" />
        <path d="M14.5 12.5c0-.83-.67-1.5-1.5-1.5h-1c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h1c.83 0 1.5.67 1.5 1.5" />
      </svg>
    ),
  },
  {
    title: "Seller's Guide",
    desc: "Tips & strategy to sell for top dollar",
    href: "https://nowtb.com/sell-your-home/",
    bgClass: "bg-orange-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF7043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8" /><path d="M8 11h6" />
      </svg>
    ),
  },
  {
    title: "Market Reports",
    desc: "Tampa Bay stats, trends & insights",
    href: "https://nowtb.com/florida-housing-market-2026/",
    bgClass: "bg-indigo-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#5C6BC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

// ===========================================================================
// CardPage component
// ===========================================================================
export default function CardPage() {
  // Controls the office-picker bottom sheet modal
  const [officeOpen, setOfficeOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex justify-center bg-[#0c1829] antialiased"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ----------------------------------------------------------------- */}
      {/* Card container — max 430px wide, centered on desktop              */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#0c1829] relative overflow-hidden">
        {/* Subtle red radial glow at the top */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(220,28,46,0.05) 0%, transparent 70%)",
          }}
        />

        {/* ============================================================= */}
        {/* HEADER — avatar, name, credentials, tagline                    */}
        {/* ============================================================= */}
        <div className="pt-10 px-8 pb-9 text-center relative animate-fade-in">
          {/* Avatar circle with outer ring */}
          <div className="w-[108px] h-[108px] mx-auto mb-5 relative">
            {/* Outer decorative ring */}
            <div className="absolute -inset-[3px] rounded-full border-[1.5px] border-white/20" />
            {/* Avatar image */}
            <div className="w-[108px] h-[108px] rounded-full bg-[#132238] border-2 border-white/[0.08] overflow-hidden relative z-[1]">
              <Image
                src="/images/barrett-henry-card-pic-blue.png"
                alt="Barrett Henry"
                width={108}
                height={108}
                className="w-full h-full object-cover object-[center_20%]"
                priority
              />
            </div>
          </div>

          {/* Name */}
          <h1
            className="text-[30px] font-extrabold text-white tracking-tight mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
          >
            Barrett Henry
          </h1>

          {/* Credentials */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[13px] font-semibold text-white/60 tracking-wider">
              Broker Associate
            </span>
            {/* REMAX logo */}
            <div className="mt-2.5">
              <Image
                src="/images/remax-logo-barrett-henry-white.png"
                alt="REMAX"
                width={144}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </div>
          </div>

          {/* Tagline */}
          <p className="mt-4 text-sm font-bold text-white/60 tracking-widest uppercase">
            Move With Confidence.
          </p>
          <p className="mt-1 text-[13px] font-medium text-white/40 italic tracking-wide">
            Straight talk. Smart strategy.
          </p>
        </div>

        {/* ============================================================= */}
        {/* QUICK ACTIONS — Call, Text, Email, Offices                     */}
        {/* ============================================================= */}
        <div className="grid grid-cols-4 gap-2.5 px-6 pb-6">
          {/* Call */}
          <a
            href="tel:+18137337907"
            className="flex flex-col items-center gap-2 py-4 px-1 bg-[#132238] border border-white/[0.08] rounded-[14px] no-underline active:scale-95 active:bg-[#1a2d45] active:border-white/20 transition-all"
          >
            <div className="w-[42px] h-[42px] rounded-full bg-green-500/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              Call
            </span>
          </a>

          {/* Text */}
          <a
            href="sms:+18137337907"
            className="flex flex-col items-center gap-2 py-4 px-1 bg-[#132238] border border-white/[0.08] rounded-[14px] no-underline active:scale-95 active:bg-[#1a2d45] active:border-white/20 transition-all"
          >
            <div className="w-[42px] h-[42px] rounded-full bg-blue-400/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#42A5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              Text
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:barrett@nowtb.com"
            className="flex flex-col items-center gap-2 py-4 px-1 bg-[#132238] border border-white/[0.08] rounded-[14px] no-underline active:scale-95 active:bg-[#1a2d45] active:border-white/20 transition-all"
          >
            <div className="w-[42px] h-[42px] rounded-full bg-amber-500/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FFA726" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              Email
            </span>
          </a>

          {/* Offices — opens modal */}
          <button
            type="button"
            onClick={() => setOfficeOpen(true)}
            className="flex flex-col items-center gap-2 py-4 px-1 bg-[#132238] border border-white/[0.08] rounded-[14px] cursor-pointer active:scale-95 active:bg-[#1a2d45] active:border-white/20 transition-all"
          >
            <div className="w-[42px] h-[42px] rounded-full bg-red-600/[0.08] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#DC1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              Offices
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px mx-8 bg-white/[0.08]" />

        {/* ============================================================= */}
        {/* RESOURCES — buyer links                                        */}
        {/* ============================================================= */}
        <div className="px-7 py-5">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[2px] mb-2">
            Resources
          </p>
          {buyerResources.map((r) => (
            <a
              key={r.title}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 py-3.5 text-white no-underline border-b border-white/[0.08] last:border-b-0 active:opacity-60 transition-opacity"
            >
              <div
                className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${r.bgClass}`}
              >
                {r.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white/[0.92] mb-0.5">
                  {r.title}
                </div>
                <div className="text-xs text-white/40 font-medium">
                  {r.desc}
                </div>
              </div>
              <span className="text-white/20 text-lg font-light">
                &#8250;
              </span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px mx-8 bg-white/[0.08]" />

        {/* ============================================================= */}
        {/* SELLING — seller resource links                                */}
        {/* ============================================================= */}
        <div className="px-7 py-5">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[2px] mb-2">
            Selling
          </p>
          {sellerResources.map((r) => (
            <a
              key={r.title}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 py-3.5 text-white no-underline border-b border-white/[0.08] last:border-b-0 active:opacity-60 transition-opacity"
            >
              <div
                className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${r.bgClass}`}
              >
                {r.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white/[0.92] mb-0.5">
                  {r.title}
                </div>
                <div className="text-xs text-white/40 font-medium">
                  {r.desc}
                </div>
              </div>
              <span className="text-white/20 text-lg font-light">
                &#8250;
              </span>
            </a>
          ))}
        </div>

        {/* ============================================================= */}
        {/* SAVE / SHARE BUTTONS                                           */}
        {/* ============================================================= */}
        <div className="px-7 pt-7 pb-4">
          {/* Save Contact */}
          <button
            type="button"
            onClick={downloadVCard}
            className="flex items-center justify-center gap-2.5 w-full py-[17px] bg-white text-[#0c1829] text-sm font-bold tracking-wider rounded-[14px] border-none cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save My Contact
          </button>

          {/* Share This Card */}
          <button
            type="button"
            onClick={shareCard}
            className="flex items-center justify-center gap-2.5 w-full py-[17px] mt-2.5 bg-white text-[#0c1829] text-sm font-bold tracking-wider rounded-[14px] border-none cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share This Card
          </button>
        </div>

        {/* ============================================================= */}
        {/* FOOTER — brand + accent bar                                    */}
        {/* ============================================================= */}
        <div className="text-center py-5 pb-10">
          {/* Small red accent line */}
          <div className="w-6 h-0.5 bg-[#DC1C2E] rounded-sm mx-auto opacity-50" />
        </div>
      </div>

      {/* =================================================================== */}
      {/* OFFICE PICKER MODAL — slides up from bottom                         */}
      {/* =================================================================== */}
      {officeOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-end px-4 pb-6 animate-overlay-in"
          onClick={(e) => {
            // Close when tapping the backdrop (not the sheet itself)
            if (e.target === e.currentTarget) setOfficeOpen(false);
          }}
        >
          <div className="w-full max-w-[400px] bg-[#132238] border border-white/[0.08] rounded-[20px] p-6 animate-sheet-up">
            {/* Sheet header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-bold text-white/[0.92]">
                Our Offices
              </span>
              <button
                type="button"
                onClick={() => setOfficeOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.08] border-none flex items-center justify-center cursor-pointer active:bg-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 stroke-white/60">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Office list */}
            {offices.map((o, i) => (
              <a
                key={o.name}
                href={o.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3.5 p-4 bg-[#0c1829] border border-white/[0.08] rounded-xl no-underline active:scale-[0.98] active:border-white/20 transition-all ${
                  i < offices.length - 1 ? "mb-2.5" : ""
                }`}
              >
                {/* Red dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#DC1C2E] shrink-0 shadow-[0_0_6px_rgba(220,28,46,0.3)]" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-white/[0.92] mb-0.5">
                    {o.name}
                  </div>
                  <div className="text-xs text-white/40 font-medium">
                    {o.address}
                  </div>
                </div>
                <span className="text-white/20 text-lg">&#8250;</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* KEYFRAME ANIMATIONS — embedded via style tag for the custom anims    */}
      {/* =================================================================== */}
      <style jsx global>{`
        /* Hide ALL site chrome so the card page is full-screen.
           header/footer = semantic layout elements from root layout.
           The sibling selectors catch MobileBottomBar, BackToTop,
           ClientChatWidget, and FubPixel that render after <main>. */
        header,
        footer,
        #main-content ~ * {
          display: none !important;
        }
        /* Also hide the skip-to-content link from root layout */
        a[href="#main-content"] {
          display: none !important;
        }
        /* Remove padding/margin from root layout's <main> and <body> */
        #main-content {
          padding-bottom: 0 !important;
          min-height: auto !important;
        }
        body {
          background: #0c1829 !important;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sheet-up {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease forwards;
        }
        .animate-overlay-in {
          animation: overlay-in 0.2s ease;
        }
        .animate-sheet-up {
          animation: sheet-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
