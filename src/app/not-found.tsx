import Link from "next/link";

/**
 * Custom 404 page — catches all unmatched routes.
 * Navy-themed design with multiple CTAs to keep visitors engaged.
 */
export default function NotFound() {
  return (
    <section className="bg-primary min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        {/* Large 404 number — faded accent for visual impact */}
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

        {/* CTAs — go home, search properties, or call */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-accent text-primary font-body text-sm font-semibold
                       px-6 py-3 hover:bg-accent/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 border border-white/30 text-white font-body text-sm font-semibold
                       px-6 py-3 hover:bg-white/10 transition-colors"
          >
            Search Properties
          </Link>
        </div>

        {/* Phone CTA — always clickable */}
        <p className="font-body text-white/40 text-sm mt-8">
          Need help? Call{" "}
          <a
            href="tel:+18137337907"
            className="text-accent hover:underline"
          >
            (813) 733-7907
          </a>
        </p>
      </div>
    </section>
  );
}
