// =============================================================================
// ExitIntentPopup — Offers a free CMA when user is about to leave the site.
// Desktop: triggers when mouse leaves the viewport (mouseout near top).
// Mobile: triggers after 45 seconds on the page.
// Only shows once per session (sessionStorage flag).
// Submits to /api/contact with type="valuation" and source="exit-intent".
// =============================================================================

"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

// Possible form states
type FormStatus = "idle" | "loading" | "success" | "error";

// sessionStorage key — prevents showing popup more than once per session
const STORAGE_KEY = "exit-intent-shown";

export type ExitIntentVariant = "buyer" | "seller" | "general";

interface ExitIntentPopupProps {
  /** Controls headline and CTA copy. Defaults to "general" (home valuation). */
  variant?: ExitIntentVariant;
}

// Copy for each variant
const VARIANT_COPY: Record<ExitIntentVariant, { headline: string; subtitle: string; submitLabel: string; successMessage: string; source: string; type: string; formMessage: string }> = {
  buyer: {
    headline: "Looking for Homes in Tampa Bay?",
    subtitle: "Tell Barrett what you're looking for — he'll send you a curated list of matching properties within 24 hours.",
    submitLabel: "Send My Criteria",
    successMessage: "Barrett will send your personalized home matches within 24 hours.",
    source: "exit-intent-buyer",
    type: "buyer",
    formMessage: "Exit-intent buyer inquiry",
  },
  seller: {
    headline: "Thinking About Selling?",
    subtitle: "Get a free Comparative Market Analysis (CMA) for your home — Barrett will prepare it within 24 hours.",
    submitLabel: "Get My Free CMA",
    successMessage: "Barrett will prepare your personalized CMA and reach out within 24 hours.",
    source: "exit-intent-seller",
    type: "valuation",
    formMessage: "Exit-intent seller CMA request",
  },
  general: {
    headline: "Before You Go — Get Your Free Home Value Report",
    subtitle: "Barrett Henry will prepare a personalized CMA for your property within 24 hours.",
    submitLabel: "Get My Free Report",
    successMessage: "Barrett will prepare your personalized CMA and reach out within 24 hours.",
    source: "exit-intent",
    type: "valuation",
    formMessage: "Exit-intent CMA request",
  },
};

export default function ExitIntentPopup({ variant = "general" }: ExitIntentPopupProps) {
  const copy = VARIANT_COPY[variant];
  // --- Visibility state ---
  const [visible, setVisible] = useState(false);

  // --- Form field state ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // --- Submission state ---
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Turnstile spam protection token ---
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  /** Show the popup (only if not already shown this session) */
  const showPopup = useCallback(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(true);
  }, []);

  /** Close the popup */
  const closePopup = useCallback(() => {
    setVisible(false);
  }, []);

  // --- Desktop: mouse leaves viewport (exits toward top of page) ---
  useEffect(() => {
    // Only attach on devices that have a fine pointer (desktop/laptop)
    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (!isDesktop) return;

    function handleMouseOut(e: MouseEvent) {
      // Trigger when cursor leaves viewport near the top edge
      if (e.clientY <= 5 && e.relatedTarget === null) {
        showPopup();
      }
    }

    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, [showPopup]);

  // --- Mobile: show after 45 seconds on the page ---
  useEffect(() => {
    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (isDesktop) return;

    const timer = setTimeout(() => {
      showPopup();
    }, 45_000);

    return () => clearTimeout(timer);
  }, [showPopup]);

  // --- Ref for the popup container (used for focus trapping) ---
  const popupRef = useRef<HTMLDivElement>(null);

  // --- Close on Escape key ---
  useEffect(() => {
    if (!visible) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setVisible(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible]);

  // --- Focus trap: keep Tab/Shift+Tab within the popup while visible ---
  useEffect(() => {
    if (!visible || !popupRef.current) return;

    // Move focus into the popup when it opens
    const firstFocusable = popupRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    function handleTrapKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || !popupRef.current) return;

      // Find all focusable elements inside the popup
      const focusableEls = popupRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      // Shift+Tab on first element → wrap to last
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
      // Tab on last element → wrap to first
      else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", handleTrapKeyDown);
    return () => document.removeEventListener("keydown", handleTrapKeyDown);
  }, [visible]);

  /** Handle form submission — POST to /api/contact */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: copy.formMessage,
          source: copy.source,
          type: copy.type,
          turnstileToken,
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      // Clear fields on success
      setName("");
      setEmail("");
      setPhone("");
      setStatus("success");
    } catch (err) {
      console.error("Exit-intent form submission failed:", err);
      setErrorMessage(
        "Something went wrong. Please try again or call us at (813) 733-7907."
      );
      setStatus("error");
    }
  }

  // Don't render anything if popup isn't visible
  if (!visible) return null;

  return (
    // --- Backdrop overlay ---
    <div
      className="fixed inset-0 z-[9998] bg-black/60 flex items-center justify-center p-4"
      onClick={closePopup}
      role="dialog"
      aria-modal="true"
      aria-label="Free home value report offer"
    >
      {/* --- Popup card — stop clicks inside from closing the overlay --- */}
      <div
        ref={popupRef}
        className="relative bg-primary text-white rounded-xl shadow-2xl max-w-md w-full p-8 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button (top-right corner) */}
        <button
          type="button"
          onClick={closePopup}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* --- Success state — replaces form after submission --- */}
        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-heading text-xl mb-2">Request Received!</h3>
            <p className="font-body text-white/80 text-sm mb-4">
              {copy.successMessage}
            </p>
            <button
              type="button"
              onClick={closePopup}
              className="font-body text-xs text-white/60 hover:text-white underline transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* --- Headline + subtitle --- */}
            <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-wide mb-2">
              {copy.headline}
            </h2>
            <p className="font-body text-white/80 text-sm mb-6">
              {copy.subtitle}
            </p>

            {/* --- Error message --- */}
            {status === "error" && errorMessage && (
              <div className="rounded-lg bg-red-500/20 border border-red-300/30 p-3 mb-4 text-white font-body text-sm">
                {errorMessage}
              </div>
            )}

            {/* --- Compact 3-field form --- */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div>
                <label
                  htmlFor="exit-name"
                  className="block text-xs font-body font-medium text-white/70 mb-1"
                >
                  Name <span className="text-red-300">*</span>
                </label>
                <input
                  id="exit-name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="exit-email"
                  className="block text-xs font-body font-medium text-white/70 mb-1"
                >
                  Email <span className="text-red-300">*</span>
                </label>
                <input
                  id="exit-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="exit-phone"
                  className="block text-xs font-body font-medium text-white/70 mb-1"
                >
                  Phone <span className="text-red-300">*</span>
                </label>
                <input
                  id="exit-phone"
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              {/* Turnstile spam protection */}
              <TurnstileWidget onVerify={handleTurnstileVerify} />

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading" || !turnstileToken}
                className={cn(
                  "w-full bg-accent text-primary font-body text-xs font-medium tracking-[0.2em] uppercase",
                  "px-6 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-accent/90 hover:shadow-lg",
                  (status === "loading" || !turnstileToken) &&
                    "opacity-60 cursor-not-allowed"
                )}
              >
                {status === "loading"
                  ? "Submitting..."
                  : copy.submitLabel}
              </button>
            </form>

            {/* Privacy note */}
            <p className="font-body text-[10px] text-white/50 text-center mt-3">
              Your information is confidential and never shared with third
              parties.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
