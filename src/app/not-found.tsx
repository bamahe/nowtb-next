import type { Metadata } from "next";
import Link from "next/link";

/**
 * Explicit metadata for the 404 page.
 *
 * WHY THIS EXISTS: this page used to export no metadata at all, so it inherited
 * whatever the root layout declared. The root layout declared the homepage as
 * its canonical URL, which meant every missing URL on the site was telling
 * Google "the canonical version of me is the homepage", an instruction to fold
 * dead URLs into the homepage's identity.
 *
 * `index: false` keeps 404s out of the index where they belong. `follow: true`
 * is deliberate: a visitor landing here still gets real navigation, and letting
 * crawlers follow those links means link equity reaching a dead URL is passed
 * on to live pages instead of being thrown away.
 *
 * No `alternates.canonical` here, a 404 has no canonical version.
 */
export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "That page could not be found. Search Tampa Bay homes for sale or reach Barrett Henry, REALTOR® at REMAX Collective, on (813) 733-7907.",
  robots: { index: false, follow: true },
};

/**
 * Custom 404 page, catches all unmatched routes.
 * Navy-themed design with multiple CTAs to keep visitors engaged.
 */
export default function NotFound() {
  return (
    <section className="bg-primary min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        {/* Large 404 number, faded accent for visual impact */}
        <p className="font-heading text-[8rem] md:text-[10rem] font-extrabold leading-none text-accent/20 select-none">
          404
        </p>

        <h1 className="font-heading text-3xl md:text-4xl font-light tracking-wide uppercase text-white -mt-8 mb-4">
          Page Not Found
        </h1>

        <div className="w-12 h-px bg-accent mx-auto mb-6" />

        <p className="font-body text-white/60 font-light text-base md:text-lg mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* CTAs, go home, search properties, or call */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-accent text-primary font-body text-sm font-semibold
                       px-6 py-3 hover:bg-accent/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/properties/"
            className="inline-flex items-center gap-2 border border-white/30 text-white font-body text-sm font-semibold
                       px-6 py-3 hover:bg-white/10 transition-colors"
          >
            Search Properties
          </Link>
        </div>

        {/* Phone CTA, prominent with headshot */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <img
            src="/images/barrett-headshot.png"
            alt="Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective"
            width={80}
            height={80}
            className="rounded-full border-2 border-accent/40"
          />
          <p className="font-body text-white/60 text-sm">
            Barrett Henry, Licensed Florida Real Estate Broker
          </p>
          <a
            href="tel:+18137337907"
            className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-8 py-3 text-sm hover:bg-accent/90 transition-colors"
          >
            Call (813) 733-7907
          </a>
          <Link
            href="/contact/"
            className="font-body text-white/40 text-sm hover:text-accent transition-colors"
          >
            Or send a message →
          </Link>
        </div>
      </div>
    </section>
  );
}
