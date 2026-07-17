// =============================================================================
// Follow Up Boss Tracking Pixel — tracks page views so you can see
// which listings and pages leads browse before they contact you.
// Loads the FUB website tracking script on every page.
// Also identifies logged-in Supabase users so their browsing history
// is linked to their FUB contact record automatically.
// =============================================================================

"use client";

import Script from "next/script";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Extend Window to include FUB global (avoids TypeScript errors)
declare global {
  interface Window {
    FUB?: {
      config?: Record<string, unknown>;
      identify?: (data: { email: string; firstName?: string }) => void;
    };
  }
}

/**
 * FUB website tracking pixel.
 * Drop this in the root layout so it loads on every page.
 * When a lead fills out a form, FUB matches their email to their
 * browsing history so you see exactly what properties they viewed.
 *
 * If the user is logged in via Supabase, we also call FUB.identify()
 * which connects ALL their page views to their FUB contact — even
 * before they fill out a form. This gives Barrett full browsing
 * history for every registered user.
 */
export default function FubPixel() {
  // After the FUB script loads, identify logged-in users
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    // Wait a tick for the FUB script to initialize, then identify
    const identifyUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return;

      // Pull first name from user metadata or profile
      const firstName =
        user.user_metadata?.full_name?.split(" ")[0] ||
        user.user_metadata?.first_name ||
        "";

      // Retry a few times — FUB script might not be ready yet
      let attempts = 0;
      const tryIdentify = () => {
        if (window.FUB?.identify) {
          window.FUB.identify({ email: user.email!, firstName });
        } else if (attempts < 5) {
          attempts++;
          setTimeout(tryIdentify, 1000); // try again in 1s
        }
      };

      // Start after a short delay to let FUB script load
      setTimeout(tryIdentify, 1500);
    };

    identifyUser();
  }, []);

  return (
    <Script
      id="fub-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(d,w){
            var r='https://assets.followupboss.com/third-party/website/';
            var s=d.createElement('script');
            s.async=true;
            s.src=r+'Website-min.js';
            var x=d.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s,x);
            w.FUB=w.FUB||{};
            w.FUB.config={
              accountId:'2047459509',
              pageName:d.title,
              pageUrl:w.location.href
            };
          })(document,window);
        `,
      }}
    />
  );
}
