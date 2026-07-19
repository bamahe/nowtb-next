// =============================================================================
// /card — Barrett Henry's digital business card
// Professional business card design with headshot, REMAX branding, and contact.
// Full-screen, mobile-first (max-width 430px). Hides site header/footer.
// =============================================================================

"use client";

import Image from "next/image";
import { useState } from "react";

// ---------------------------------------------------------------------------
// vCard download — creates a .vcf and triggers browser download
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
    "NOTE:Your REALTOR® from REMAX Collective — Tampa Bay Real Estate",
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
// Web Share API — falls back to clipboard copy
// ---------------------------------------------------------------------------
function shareCard() {
  const shareData = {
    title: "Barrett Henry — REMAX Collective",
    text: "Barrett Henry, Broker Associate at REMAX Collective — Tampa Bay real estate.",
    url: "https://nowtb.com/card/",
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard
      .writeText("https://nowtb.com/card/")
      .then(() => alert("Link copied!"))
      .catch(() => alert("https://nowtb.com/card/"));
  }
}

// ---------------------------------------------------------------------------
// Office data
// ---------------------------------------------------------------------------
const offices = [
  { name: "Tampa", address: "14310 N Dale Mabry Hwy, Ste 100, Tampa, FL 33618", mapUrl: "https://maps.google.com/?q=14310+N+Dale+Mabry+Hwy+Ste+100+Tampa+FL+33618" },
  { name: "Brandon", address: "417 Lithia Pinecrest Rd, Brandon, FL 33511", mapUrl: "https://maps.google.com/?q=417+Lithia+Pinecrest+Rd+Brandon+FL+33511" },
  { name: "Largo", address: "11200 Seminole Blvd, Ste 202 & 204, Largo, FL 33778", mapUrl: "https://maps.google.com/?q=11200+Seminole+Blvd+Suite+202+Largo+FL+33778" },
];

// ===========================================================================
// CardPage
// ===========================================================================
export default function CardPage() {
  const [officeOpen, setOfficeOpen] = useState(false);

  return (
    <div className="min-h-screen flex justify-center bg-[#0a1628] antialiased">
      <div className="w-full max-w-[430px] min-h-screen relative overflow-hidden">

        {/* ================================================================= */}
        {/* CARD FRONT — the business card look                               */}
        {/* ================================================================= */}
        <div className="relative">
          {/* Pro headshot — full width, top half of card */}
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src="/images/barrett-henry-pro.png"
              alt="Barrett Henry, Broker Associate at REMAX Collective"
              fill
              priority
              className="object-cover object-top"
              sizes="430px"
            />
            {/* Gradient fade to navy at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />

            {/* REMAX balloon — top right corner */}
            <div className="absolute top-5 right-5">
              <Image
                src="/images/remax-balloon.png"
                alt="REMAX"
                width={44}
                height={44}
                className="drop-shadow-lg"
              />
            </div>
          </div>

          {/* Name and title — overlaid on gradient */}
          <div className="relative -mt-24 px-7 pb-6 z-10">
            <h1 className="text-[34px] font-extrabold text-white tracking-tight leading-tight">
              Barrett Henry
            </h1>
            <p className="text-[15px] font-semibold text-white/70 mt-1">
              Broker Associate &bull; REALTOR&reg;
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Image
                src="/images/remax-logo-barrett-henry-white.png"
                alt="REMAX Collective"
                width={120}
                height={30}
                className="h-7 w-auto opacity-80"
              />
            </div>
            <p className="text-xs text-white/40 mt-3 tracking-widest uppercase font-bold">
              Move With Confidence.
            </p>
          </div>
        </div>

        {/* Thin accent line */}
        <div className="h-[2px] mx-7 bg-gradient-to-r from-[#DC1C2E] via-[#DC1C2E]/60 to-transparent" />

        {/* ================================================================= */}
        {/* CONTACT INFO — phone, email, website                              */}
        {/* ================================================================= */}
        <div className="px-7 py-6">
          {/* Phone */}
          <a href="tel:+18137337907" className="flex items-center gap-4 py-3 no-underline group">
            <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-[15px] font-bold group-active:text-green-400 transition-colors">(813) 733-7907</p>
              <p className="text-white/40 text-xs">Call or text anytime</p>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:barrett@nowtb.com" className="flex items-center gap-4 py-3 no-underline group">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#42A5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div>
              <p className="text-white text-[15px] font-bold group-active:text-blue-400 transition-colors">barrett@nowtb.com</p>
              <p className="text-white/40 text-xs">Email me directly</p>
            </div>
          </a>

          {/* Website */}
          <a href="https://nowtb.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-3 no-underline group">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#AB47BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-[15px] font-bold group-active:text-purple-400 transition-colors">nowtb.com</p>
              <p className="text-white/40 text-xs">Search Tampa Bay homes</p>
            </div>
          </a>

          {/* Offices */}
          <button
            type="button"
            onClick={() => setOfficeOpen(true)}
            className="flex items-center gap-4 py-3 w-full text-left cursor-pointer bg-transparent border-none group"
          >
            <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#DC1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-white text-[15px] font-bold group-active:text-red-400 transition-colors">3 Tampa Bay Offices</p>
              <p className="text-white/40 text-xs">Tampa &bull; Brandon &bull; Largo</p>
            </div>
          </button>
        </div>

        {/* ================================================================= */}
        {/* CREDENTIALS — trust badges                                        */}
        {/* ================================================================= */}
        <div className="px-7 pb-5">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] bg-white/[0.06] text-white/50 px-3 py-1.5 rounded-full font-semibold tracking-wide">23+ Years Experience</span>
            <span className="text-[10px] bg-white/[0.06] text-white/50 px-3 py-1.5 rounded-full font-semibold tracking-wide">FL License #3313308</span>
            <span className="text-[10px] bg-white/[0.06] text-white/50 px-3 py-1.5 rounded-full font-semibold tracking-wide">e-PRO</span>
            <span className="text-[10px] bg-white/[0.06] text-white/50 px-3 py-1.5 rounded-full font-semibold tracking-wide">MRP</span>
            <span className="text-[10px] bg-white/[0.06] text-white/50 px-3 py-1.5 rounded-full font-semibold tracking-wide">SRS</span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400/70 px-3 py-1.5 rounded-full font-semibold tracking-wide">REMAX Hall of Fame 2024</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ACTION BUTTONS — Save Contact & Share                             */}
        {/* ================================================================= */}
        <div className="px-7 pb-4">
          <button
            type="button"
            onClick={downloadVCard}
            className="flex items-center justify-center gap-2.5 w-full py-4 bg-white text-[#0a1628] text-sm font-bold tracking-wider rounded-xl border-none cursor-pointer active:scale-[0.98] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <path d="M17 21H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h7l5 5v9a4 4 0 0 1-4 4z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save My Contact
          </button>

          <button
            type="button"
            onClick={shareCard}
            className="flex items-center justify-center gap-2.5 w-full py-4 mt-2.5 bg-white/[0.08] text-white/70 text-sm font-bold tracking-wider rounded-xl border border-white/[0.08] cursor-pointer active:scale-[0.98] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share This Card
          </button>
        </div>

        {/* ================================================================= */}
        {/* QUICK LINKS — search homes, valuation, contact                    */}
        {/* ================================================================= */}
        <div className="px-7 py-4">
          <div className="grid grid-cols-3 gap-2.5">
            <a href="https://nowtb.com/tampa-bay-area-homes-for-sale/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 py-4 bg-white/[0.04] border border-white/[0.06] rounded-xl no-underline active:scale-95 transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="#42A5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Search</span>
            </a>
            <a href="https://nowtb.com/home-valuation/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 py-4 bg-white/[0.04] border border-white/[0.06] rounded-xl no-underline active:scale-95 transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><line x1="12" y1="10" x2="12" y2="16" /></svg>
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Value</span>
            </a>
            <a href="https://nowtb.com/contact/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 py-4 bg-white/[0.04] border border-white/[0.06] rounded-xl no-underline active:scale-95 transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Contact</span>
            </a>
          </div>
        </div>

        {/* Footer accent */}
        <div className="text-center py-6 pb-10">
          <div className="w-8 h-[2px] bg-[#DC1C2E] rounded-sm mx-auto opacity-40" />
        </div>
      </div>

      {/* =================================================================== */}
      {/* OFFICE PICKER MODAL                                                 */}
      {/* =================================================================== */}
      {officeOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-end px-4 pb-6 animate-overlay-in"
          onClick={(e) => { if (e.target === e.currentTarget) setOfficeOpen(false); }}
        >
          <div className="w-full max-w-[400px] bg-[#132238] border border-white/[0.08] rounded-[20px] p-6 animate-sheet-up">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-bold text-white/90">Our Offices</span>
              <button type="button" onClick={() => setOfficeOpen(false)} className="w-8 h-8 rounded-full bg-white/[0.08] border-none flex items-center justify-center cursor-pointer active:bg-white/20 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 stroke-white/60">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {offices.map((o, i) => (
              <a
                key={o.name}
                href={o.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3.5 p-4 bg-[#0a1628] border border-white/[0.08] rounded-xl no-underline active:scale-[0.98] transition-all ${i < offices.length - 1 ? "mb-2.5" : ""}`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#DC1C2E] shrink-0 shadow-[0_0_6px_rgba(220,28,46,0.3)]" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-white/90 mb-0.5">{o.name}</div>
                  <div className="text-xs text-white/40">{o.address}</div>
                </div>
                <span className="text-white/20 text-lg">&#8250;</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Keyframe animations + hide site chrome */}
      <style jsx global>{`
        header, footer, #main-content ~ * { display: none !important; }
        a[href="#main-content"] { display: none !important; }
        #main-content { padding-bottom: 0 !important; min-height: auto !important; }
        body { background: #0a1628 !important; }
        @keyframes overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sheet-up { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-overlay-in { animation: overlay-in 0.2s ease; }
        .animate-sheet-up { animation: sheet-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
