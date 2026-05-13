// =============================================================================
// TurnstileWidget — Cloudflare Turnstile spam protection widget
// "use client" because it loads an external script and manages widget state
// Renders an invisible/visible CAPTCHA challenge from Cloudflare
// =============================================================================

"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TurnstileProps {
  /** Called with the verification token when the user passes the challenge */
  onVerify: (token: string) => void;
}

export default function TurnstileWidget({ onVerify }: TurnstileProps) {
  // Ref to the container div where Turnstile renders its widget
  const containerRef = useRef<HTMLDivElement>(null);
  // Track whether the Turnstile script has finished loading
  const [loaded, setLoaded] = useState(false);
  // Track the widget ID so we don't render it twice
  const widgetIdRef = useRef<string | null>(null);

  // Memoize the onVerify callback to avoid re-rendering the widget
  const stableOnVerify = useCallback(onVerify, [onVerify]);

  // --- Load the Turnstile script once ---
  useEffect(() => {
    // If script is already on the page, mark as loaded
    if (document.getElementById("cf-turnstile-script")) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "cf-turnstile-script";
    // "render=explicit" means we control when/where the widget appears
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  // --- Render the Turnstile widget once the script is ready ---
  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.error("TurnstileWidget: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set");
      return;
    }

    // Only render if we haven't already and the container is empty
    // @ts-ignore — window.turnstile is injected by the Cloudflare script
    if (window.turnstile && widgetIdRef.current === null) {
      // @ts-ignore
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: stableOnVerify,
        theme: "light",
      });
    }
  }, [loaded, stableOnVerify]);

  return <div ref={containerRef} className="mt-2" />;
}
