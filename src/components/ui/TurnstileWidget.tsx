// Cloudflare Turnstile spam protection widget
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TurnstileProps {
  onVerify: (token: string) => void;
}

export default function TurnstileWidget({ onVerify }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const widgetIdRef = useRef<string | null>(null);
  const stableOnVerify = useCallback(onVerify, [onVerify]);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // If no site key configured, skip turnstile entirely and auto-verify
  useEffect(() => {
    if (!siteKey) {
      stableOnVerify("no-turnstile-key-configured");
    }
  }, [siteKey, stableOnVerify]);

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
      const w = (window as Record<string, unknown>).turnstile as Record<string, Function> | undefined;
      if (w?.render && widgetIdRef.current === null) {
        widgetIdRef.current = w.render(containerRef.current, {
          sitekey: siteKey,
          callback: stableOnVerify,
          theme: "light",
        }) as string;
      }
    } catch (err) {
      console.error("Turnstile render error:", err);
      stableOnVerify("turnstile-render-failed");
    }
  }, [loaded, stableOnVerify, siteKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="mt-2" />;
}
