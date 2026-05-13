import Link from "next/link";

/**
 * Custom 404 page — catches all unmatched routes.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-display-sm font-extrabold text-primary mb-4">
        Page Not Found
      </h1>
      <p className="font-body text-lg text-muted mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
        <Link href="/properties" className="btn-secondary">
          Search Homes
        </Link>
      </div>
    </div>
  );
}
