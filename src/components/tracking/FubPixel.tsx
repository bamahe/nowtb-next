// =============================================================================
// Follow Up Boss Tracking Pixel — tracks page views so you can see
// which listings and pages leads browse before they contact you.
// Loads the FUB website tracking script on every page.
// =============================================================================

"use client";

import Script from "next/script";

/**
 * FUB website tracking pixel.
 * Drop this in the root layout so it loads on every page.
 * When a lead fills out a form, FUB matches their email to their
 * browsing history so you see exactly what properties they viewed.
 */
export default function FubPixel() {
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
