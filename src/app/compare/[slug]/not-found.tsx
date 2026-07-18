/**
 * 404 page for /compare/[slug] when no matching comparison exists.
 */
import Link from 'next/link';

export default function CompareNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-[#0B2545]">Page not found</h1>
      <p className="mb-6 text-slate-600">
        This comparison does not exist or may have been removed.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[#0B2545] px-6 py-3 font-semibold text-white transition hover:bg-[#0B2545]/90"
      >
        Back to home
      </Link>
    </div>
  );
}
