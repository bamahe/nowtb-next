/**
 * Global loading state — shows while server components render.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Simple animated spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent" />
        <p className="font-body text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}
