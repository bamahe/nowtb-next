// Cloudflare Turnstile spam protection widget
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TurnstileProps {
  onVerify: (token: string) => void;
}

// How many times we re-run a FAILED challenge before giving up and falling back
// to the sentinel. Two is enough to ride out a blip on Cloudflare's end without
// putting the browser in a retry loop that never ends.
const MAX_ERROR_RETRIES = 2;

/**
 * Is this Turnstile error code worth retrying?
 *
 * Cloudflare's error codes are grouped by first digits:
 * 1xxxxx / 4xxxxx, configuration problems. Wrong sitekey, or the sitekey is
 *                     real but this hostname isn't on it (400020 / 110200).
 *                     Retrying is pointless; it will fail identically forever.
 * 3xxxxx / 6xxxxx, network hiccup, challenge timed out, visitor failed the
 *                     interactive challenge. A fresh challenge can succeed.
 *
 * If it breaks, check: Cloudflare dashboard → Turnstile → the widget's allowed
 * hostnames. nowtb.com has historically returned 400020 here, which means the
 * challenge cannot run on this domain at all and every form falls through to
 * the sentinel path below.
 */
function isRetryableError(code: string): boolean {
  return !(code.startsWith("1") || code.startsWith("4"));
}

export default function TurnstileWidget({ onVerify }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const widgetIdRef = useRef<string | null>(null);
  // Counts failed challenges in this page view. A ref, not state, because
  // changing it must not re-render (a re-render would re-run the render effect).
  const errorRetriesRef = useRef(0);
  const stableOnVerify = useCallback(onVerify, [onVerify]);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // If no site key configured, skip turnstile entirely and auto-verify
  useEffect(() => {
    if (!siteKey) {
      stableOnVerify("no-turnstile-key-configured");
    }
  }, [siteKey, stableOnVerify]);

  /**
   * Throw away the current token and ask Cloudflare for a fresh challenge on
   * the SAME widget. This is the whole fix for the "expired token" bug: a
   * Turnstile token only lives about five minutes, and the seller intake form
   * takes longer than that to fill in, so by submit time the token was dead and
   * the API returned 403. Resetting in place means the visitor never has to
   * reload the page and never loses what they typed.
   */
  const resetWidget = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = (window as any).turnstile as Record<string, Function> | undefined;
    if (!w?.reset || widgetIdRef.current === null) return false;
    try {
      w.reset(widgetIdRef.current);
      return true;
    } catch (err) {
      console.warn("Turnstile reset failed:", err);
      return false;
    }
  }, []);

  // Load the Turnstile script
  useEffect(() => {
    if (!siteKey) return;
    if (document.getElementById("cf-turnstile-script")) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "cf-turnstile-script";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => {
      // If script fails to load, auto-verify so form isn't permanently locked
      stableOnVerify("turnstile-script-failed");
    };
    document.head.appendChild(script);
  }, [siteKey, stableOnVerify]);

  // Render the widget
  useEffect(() => {
    if (!loaded || !containerRef.current || !siteKey) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = (window as any).turnstile as Record<string, Function> | undefined;
      if (w?.render && widgetIdRef.current === null) {
        widgetIdRef.current = w.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            // A good token arrived, so the retry budget is spent fairly and can
            // be handed back for the NEXT failure (e.g. after an expiry).
            errorRetriesRef.current = 0;
            stableOnVerify(token);
          },
          theme: "light",

          // We own the refresh, Cloudflare does not. With the default ("auto")
          // Cloudflare refreshes on its own schedule, which raced our reset
          // below and made the behaviour impossible to reason about. "manual"
          // hands expiry to our expired-callback; the worst case if our reset
          // somehow doesn't fire is a refresh button inside the widget, still
          // recoverable without reloading the page.
          "refresh-expired": "manual",
          "refresh-timeout": "manual",

          // --- Token went stale while they were still typing ---
          // Clear the parent's token FIRST (so a dead token can never be
          // POSTed, that is a guaranteed 403), then start a fresh challenge.
          // The callback above re-enables the submit button a moment later.
          "expired-callback": () => {
            stableOnVerify("");
            if (!resetWidget()) {
              // Couldn't reset, don't leave the visitor with a permanently
              // dead submit button. Fall through to the sentinel the API
              // already allows, same as a render failure.
              stableOnVerify("turnstile-render-failed");
            }
          },

          // --- Challenge timed out before the visitor interacted with it ---
          // Same treatment as an expiry: get a new one, silently.
          "timeout-callback": () => {
            stableOnVerify("");
            if (!resetWidget()) {
              stableOnVerify("turnstile-render-failed");
            }
          },

          // Cloudflare reports render/validation problems through this callback
          // rather than by throwing. Without it, a bad sitekey (error 400020,
          // which is what nowtb.com currently returns) means no token is ever
          // emitted and every gated submit button stays disabled forever.
          //
          // Retryable errors get a fresh challenge first. Everything else, and
          // anything still failing after MAX_ERROR_RETRIES, fails OPEN with a
          // sentinel so forms stay usable; the API-side validation in
          // lib/lead-validation.ts is the real backstop.
          "error-callback": (code: string) => {
            console.warn("Turnstile error-callback:", code);
            const retryable = isRetryableError(String(code || ""));
            if (retryable && errorRetriesRef.current < MAX_ERROR_RETRIES) {
              errorRetriesRef.current += 1;
              stableOnVerify("");
              if (resetWidget()) return;
            }
            stableOnVerify("turnstile-render-failed");
          },
        }) as string;
      }
    } catch (err) {
      console.error("Turnstile render error:", err);
      stableOnVerify("turnstile-render-failed");
    }
  }, [loaded, stableOnVerify, siteKey, resetWidget]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="mt-2" />;
}
