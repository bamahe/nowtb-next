// =============================================================================
// /login layout, exports metadata for the client component page
//
// The page itself is "use client" (it talks to Supabase auth in the browser),
// and Next.js will not read an `export const metadata` out of a client
// component, the build fails outright. A co-located layout.tsx is a server
// component by default, so metadata for the route goes here. Same pattern as
// src/app/card/layout.tsx and src/app/properties/search/layout.tsx.
// =============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  // 55 characters. /login/ has no search value, so the title is written for the
  // human who has it open (and for the browser tab / bookmark), not for Google.
  // It still names the page purpose first rather than leading with the brand.
  title: "Sign In | Saved Home Searches | Barrett Henry, REALTOR®",

  // 139 characters, inside the 120-155 window. The previous description was 111
  // characters, which is under the window and ends in the filler phrase "and
  // more". This version says what the account actually gives you, then gives a
  // recovery path, which is the only useful CTA on a sign-in screen.
  description:
    "Sign in to your nowtb.com account to see saved Tampa Bay home searches and favorite listings. Locked out or need help? Call (813) 733-7907.",

  // Trailing slash required: next.config.mjs sets trailingSlash: true.
  alternates: {
    canonical: "/login/",
  },

  // index: false, a sign-in form has nothing a searcher wants, and letting it
  //                 into the index means it competes with real pages for the
  //                 site's relevance budget.
  // follow: true, changed from the previous `follow: false`. noindex,nofollow
  //                 told Google to throw away every link on the page. There is
  //                 no reason to burn those signals; noindex,follow keeps the
  //                 page out of the index while still letting crawl equity flow
  //                 onward. nofollow is for links you distrust, not your own.
  //
  // IMPORTANT, this tag is probably never actually read by Google.
  // src/app/robots.ts disallows /login/ for user-agent *, and a URL that is
  // disallowed in robots.txt is never fetched, so the noindex in this HTML is
  // never seen. robots.txt is doing the real work today; this is a safety net
  // for crawlers that ignore robots.txt and for the day /login/ is removed from
  // that disallow list. Do not treat the two as interchangeable: if you ever
  // need a URL definitively de-indexed, it must be CRAWLABLE and noindex, not
  // blocked. (Google's own guidance, blocked URLs can still get indexed from
  // external links, with no snippet, because the noindex was unreadable.)
  robots: {
    index: false,
    follow: true,
  },

  openGraph: {
    title: "Sign In | Barrett Henry, REALTOR® | REMAX Collective",
    description:
      "Sign in to your nowtb.com account to see saved Tampa Bay home searches and favorite listings.",
    url: "/login/",
    type: "website",
    // /og-default.png is the site's existing 1200x630 card from
    // src/app/layout.tsx. Named explicitly so overriding `openGraph` here does
    // not drop the inherited image.
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
