"use client";

/**
 * CookieConsent.tsx — Bottom banner for cookie/tracking consent.
 * Shows on first visit. Stores choice in localStorage as "cookie-consent".
 * "OK" accepts all. "Manage Preferences" lets users toggle categories.
 */

import { useState, useEffect, useRef, type CSSProperties } from "react";

// The CSS custom property this banner publishes on <html> while it is visible.
// Floating buttons (BackToTop, the chat bubble) add it to their bottom margin
// so they lift clear of the banner instead of being buried under it. Declared
// here as a constant so the name can't drift out of sync between files — grep
// for it to find every consumer.
const LIFT_VAR = "--cookie-banner-lift";

// Breathing room between the top of the banner and whatever floats above it.
const LIFT_GAP_PX = 8;

export default function CookieConsent() {
  // null = checking localStorage, true = show banner, false = already answered
  const [visible, setVisible] = useState<boolean | null>(null);
  // Whether the preferences panel is open
  const [prefsOpen, setPrefsOpen] = useState(false);
  // Individual preference toggles
  const [prefs, setPrefs] = useState({
    analytics: true,
    advertising: false,
  });

  // The banner element itself, so we can measure how tall it actually is.
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    setVisible(!consent);
    // Load saved preferences if they exist
    const saved = localStorage.getItem("cookie-prefs");
    if (saved) {
      try { setPrefs(JSON.parse(saved)); } catch {}
    }
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // Publish this banner's height so the floating buttons can get out of its way
  //
  // THE BUG THIS FIXES: this banner used to be z-[90] while the chat bubble was
  // z-50 and BackToTop was z-40, so on a first visit the banner covered both of
  // them — on mobile, for the one visitor most worth converting. Raising or
  // lowering z-index alone cannot fix it, because the banner and the buttons
  // occupy the same strip of screen: one of them has to physically move.
  //
  // So the banner measures itself and writes its height onto <html> as a CSS
  // variable. BackToTop and the chat bubble add that variable to their bottom
  // margin — which, on a `fixed` element, stacks on top of its `bottom` value
  // and pushes it up. Using margin (not `bottom`, not `transform`) is
  // deliberate: it leaves their responsive `bottom-*` classes and their
  // show/hide translate animations completely untouched.
  //
  // Measured rather than hard-coded because the banner's height changes with
  // the viewport (the text wraps to 2-3 lines on a phone) and grows a lot when
  // "Manage Preferences" is expanded.
  //
  // If it breaks, check:
  //  - In DevTools, inspect <html> and look for the `--cookie-banner-lift`
  //    style. It should be a pixel value while the banner shows, "0px" after.
  //  - If the buttons stay lifted after dismissing the banner, the cleanup
  //    below didn't run — the variable is only reset here and on unmount.
  //  - ResizeObserver is guarded because it doesn't exist in very old browsers;
  //    without it we still measure once and on window resize.
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    const el = bannerRef.current;

    // Not showing (or not mounted yet) — make sure nothing stays lifted.
    if (!visible || !el) {
      root.style.setProperty(LIFT_VAR, "0px");
      return;
    }

    const publish = () => {
      root.style.setProperty(LIFT_VAR, `${el.offsetHeight + LIFT_GAP_PX}px`);
    };

    publish();

    // Re-measure when the banner changes size (preferences panel opening,
    // text re-wrapping, phone rotating).
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(publish);
      observer.observe(el);
    }
    window.addEventListener("resize", publish);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", publish);
      root.style.setProperty(LIFT_VAR, "0px");
    };
  }, [visible]);

  /** Accept all cookies */
  function handleOk() {
    const allOn = { analytics: true, advertising: true };
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-prefs", JSON.stringify(allOn));
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  }

  /** Save selected preferences */
  function handleSavePrefs() {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-prefs", JSON.stringify(prefs));
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  }

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-label="Cookie consent"
      // POSITION: on mobile the banner sits ABOVE the MobileBottomBar so it can
      // never cover the Call button — the primary mobile conversion. It used to
      // be a flat `bottom-16` (64px), which is taller than the bar on most
      // phones but NOT on a notched iPhone, where the bar grows by the
      // safe-area inset (~34px) and poked out from under the banner. The
      // variable below adds that inset back in, so the gap is always correct.
      //
      // The inline style sets only a CSS variable, so the `md:bottom-0`
      // override still wins on desktop where there is no bottom bar at all.
      //
      // Z-INDEX: z-[70] is the "CookieConsent" tier of the scale documented in
      // src/app/layout.tsx. It was z-[90], above everything including the chat
      // panel. Now it sits above the header (z-[60]) but below an open chat
      // dialog (z-[80]) — a conversation the visitor deliberately started
      // outranks a banner they have not answered yet.
      style={
        // Cast needed because TypeScript's style object doesn't know about
        // custom CSS properties (anything starting with "--").
        { "--cc-bottom": "calc(4rem + env(safe-area-inset-bottom, 0px))" } as CSSProperties
      }
      className="fixed bottom-[var(--cc-bottom)] md:bottom-0 left-0 right-0 z-[70] bg-[#2a2a2a] text-white shadow-[0_-2px_12px_rgba(0,0,0,0.3)]"
    >
      {/* Main banner */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="text-center sm:text-left text-white/90 leading-relaxed">
          This site uses cookies and related technologies, as described in our{" "}
          <a href="/privacy-policy/" className="underline hover:text-white">
            privacy notice
          </a>
          , for purposes that may include site operation, analytics, enhanced
          user experience, or advertising.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setPrefsOpen(!prefsOpen)}
            className="text-white/80 text-sm font-semibold hover:text-white transition-colors whitespace-nowrap"
          >
            Manage Preferences
          </button>
          <button
            onClick={handleOk}
            className="bg-[#5b6abf] text-white px-6 py-2 rounded font-semibold hover:bg-[#4a59ae] transition-colors whitespace-nowrap"
          >
            OK
          </button>
        </div>
      </div>

      {/* Preferences panel — slides open when "Manage Preferences" is clicked */}
      {prefsOpen && (
        <div className="border-t border-white/10 bg-[#333] px-4 py-4">
          <div className="max-w-5xl mx-auto space-y-3">
            {/* Essential — always on */}
            <label className="flex items-center justify-between text-sm">
              <div>
                <span className="font-semibold">Essential</span>
                <span className="text-white/50 ml-2">— Required for site operation</span>
              </div>
              <span className="text-white/40 text-xs">Always on</span>
            </label>

            {/* Analytics */}
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <div>
                <span className="font-semibold">Analytics</span>
                <span className="text-white/50 ml-2">— Usage data to improve the site</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                className="w-4 h-4 accent-[#5b6abf]"
              />
            </label>

            {/* Advertising */}
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <div>
                <span className="font-semibold">Advertising</span>
                <span className="text-white/50 ml-2">— Personalized ads and retargeting</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.advertising}
                onChange={(e) => setPrefs({ ...prefs, advertising: e.target.checked })}
                className="w-4 h-4 accent-[#5b6abf]"
              />
            </label>

            <div className="pt-2">
              <button
                onClick={handleSavePrefs}
                className="bg-[#5b6abf] text-white px-5 py-1.5 rounded text-sm font-semibold hover:bg-[#4a59ae] transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
