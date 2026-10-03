// =============================================================================
// QuickAnswer : short, quotable answer block placed near the top of a page
// Server component. The "quick-answer" class is the hook the site's speakable
// schema points at, so AI answer engines know which lines to lift.
// =============================================================================

interface QuickAnswerProps {
  /** Optional heading override. Defaults to "Quick answer". */
  heading?: string;
  /** The 2 to 4 sentence answer, plus any short list */
  children: React.ReactNode;
}

export default function QuickAnswer({
  heading = "Quick answer",
  children,
}: QuickAnswerProps) {
  return (
    <div className="quick-answer bg-light border-l-4 border-accent rounded-lg p-6 md:p-8">
      <p className="font-body text-xs font-medium tracking-[0.2em] uppercase text-muted mb-3">
        {heading}
      </p>
      <div className="font-body text-primary text-base md:text-lg leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
