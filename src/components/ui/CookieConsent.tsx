"use client";

/**
 * CookieConsent.tsx — Bottom banner for cookie/tracking consent.
 * Shows on first visit. Stores choice in localStorage as "cookie-consent".
 * "OK" accepts all. "Manage Preferences" lets users toggle categories.
 */

import { useState, useEffect } from "react";

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

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    setVisible(!consent);
    // Load saved preferences if they exist
    const saved = localStorage.getItem("cookie-prefs");
    if (saved) {
      try { setPrefs(JSON.parse(saved)); } catch {}
    }
  }, []);

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
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-[90] bg-[#2a2a2a] text-white shadow-[0_-2px_12px_rgba(0,0,0,0.3)]"
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
