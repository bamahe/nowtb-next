// =============================================================================
// MobileBottomBar — Sticky bottom bar on mobile with Call + Contact buttons
// Only visible on small screens (md:hidden). Uses safe-area inset padding
// so it doesn't overlap the iPhone home indicator.
// =============================================================================

"use client";

import { Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function MobileBottomBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden
                 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch">
        {/* Call button — takes 2/3 of the width, green/accent background */}
        <a
          href="tel:+18137337907"
          className="flex-[2] flex items-center justify-center gap-2
                     bg-green-600 text-white font-body text-sm font-semibold
                     py-3.5 active:bg-green-700 transition-colors"
          aria-label="Call Barrett Henry at (813) 733-7907"
        >
          <Phone size={18} strokeWidth={2.5} />
          Call (813) 733-7907
        </a>

        {/* Contact/Chat button — takes 1/3 of the width */}
        <Link
          href="/contact"
          className="flex-[1] flex items-center justify-center gap-2
                     bg-primary text-white font-body text-sm font-semibold
                     py-3.5 active:bg-primary/90 transition-colors
                     border-l border-white/10"
          aria-label="Contact Barrett Henry"
        >
          <MessageCircle size={18} strokeWidth={2.5} />
          Contact
        </Link>
      </div>
    </div>
  );
}
