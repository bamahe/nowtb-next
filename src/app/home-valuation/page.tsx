// =============================================================================
// /home-valuation — DEAD CODE. Shadowed by a redirect in next.config.mjs.
// =============================================================================
//
// ⚠️  THIS FILE NO LONGER RUNS. Do not "fix" anything here and expect to see it
//     live. As of 2026-10-17 the redirect lives in next.config.mjs instead:
//
//         { source: "/home-valuation/", destination: "/free-home-valuation/",
//           permanent: false }
//
//     Config redirects are handled by the platform's routing layer BEFORE any
//     route file is consulted, so this component is now unreachable.
//
// WHY IT MOVED — this was a real production bug, not a tidy-up.
// `redirect()` inside a server component works by throwing a special Next.js
// control-flow error. During a STATIC render there is no live HTTP response to
// hang a Location header on, so what actually got served to a plain HTTP client
// was a 307 with NO Location header plus Next's __next_error__ HTML shell.
// Verified live with curl. A browser hides this (the React client router
// follows the redirect itself), which is exactly why it survived so long. A
// crawler cannot: a redirect with no destination is a dead end, and ~1,500+
// internal links point at this URL — more than point at the real page.
//
// The file is KEPT, not deleted, for two reasons: the repo rule is move/never
// delete, and leaving `redirect()` in place means that if someone ever removes
// the config rule the URL degrades to the old browser-only behaviour instead of
// hard 404-ing. It is a fallback, not the mechanism.
//
// STILL TRUE: do NOT add `export const metadata` here. Because this component
// never returns HTML, Next never renders a <head> for it, so a metadata export
// would type-check, look like the SEO was handled, and emit precisely nothing.
// The real valuation page — and the only place its title/description/canonical
// can live — is src/app/free-home-valuation/page.tsx.
//
// -----------------------------------------------------------------------------
// OPEN ISSUE FOR THE SITE OWNER — which URL should be the real page?
// -----------------------------------------------------------------------------
// Counting the literal path strings across src/ (blog post bodies in
// posts-export.json, market-updates-export.json, and pages-content.json all
// contain hand-written <a href> links):
//
//     /home-valuation/        1,512 occurrences   <-- this redirect stub
//     /free-home-valuation/     708 occurrences   <-- the actual page
//
// So roughly twice as many internal links point at the URL that redirects as at
// the URL that renders. Every one of those link clicks and every crawl of them
// costs an extra HTTP round trip, and because `redirect()` emits a 307
// TEMPORARY redirect, Google is being told "keep /home-valuation/ in the index,
// this move might be undone" — which leaves two URLs competing over one piece
// of content instead of consolidating onto one.
//
// /home-valuation/ is also the better keyword target of the two ("home
// valuation" is the search; "free" is a modifier), and it is the URL the content
// automation keeps writing into new posts.
//
// The likely right fix is therefore to FLIP the direction: move the real page to
// /home-valuation/ and redirect /free-home-valuation/ here instead. That is a
// bigger change than one engineer should make unilaterally — it touches
// src/app/free-home-valuation/page.tsx (~700 lines), the sitemap, and the
// canonical tags — so it has been written up rather than done.
//
// WHY THE CONFIG REDIRECT IS STILL TEMPORARY (307, `permanent: false`):
// A 308 is cached aggressively and indefinitely by browsers, and it tells
// Google to consolidate all signal onto /free-home-valuation/ and retire this
// URL. If the direction is going to be flipped, a cached 308 pointing the wrong
// way is genuinely painful to undo — you have to un-teach every browser that
// cached it plus Google's consolidated index. The crawler bug was the MISSING
// LOCATION HEADER, not the status code, so fixing it cost nothing permanent and
// the 307 keeps the decision above reversible. Do not "upgrade" this to
// `permanent: true` as a quick SEO win without settling the question first.
//
// Already done in the meantime: /home-valuation/ was removed from
// src/app/sitemap.ts, because a sitemap should only list canonical URLs that
// return 200. See the note there.
//
// If it breaks, check:
//  - /home-valuation/ returning 404 instead of redirecting? Confirm the
//    destination route src/app/free-home-valuation/page.tsx still exists.
//  - Redirect loop? That means /free-home-valuation/ started redirecting back
//    here. Check the redirects block in next.config.mjs for a competing rule.
// =============================================================================

import { redirect } from "next/navigation";

export default function HomeValuationRedirect() {
  // The trailing slash matters. next.config.mjs sets `trailingSlash: true`, so
  // redirecting to "/free-home-valuation" (no slash) sent the visitor through
  // TWO hops: /home-valuation/ -> /free-home-valuation -> /free-home-valuation/,
  // because Next then 308s the slashless form to the canonical one. Naming the
  // canonical form directly cuts that to a single hop for all ~1,500 internal
  // links that point here.
  redirect("/free-home-valuation/");
}
