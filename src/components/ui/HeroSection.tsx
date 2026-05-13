// =============================================================================
// HeroSection — Full-width hero banner with optional background image
// Server component (no "use client" directive)
// =============================================================================

import { cn } from "@/lib/utils";

interface HeroSectionProps {
  /** Main heading text */
  title: string;
  /** Optional subtitle displayed below the heading */
  subtitle?: string;
  /** Background image URL — a dark overlay is applied on top */
  bgImage?: string;
  /** Slot for CTA buttons, search bar, or other interactive content */
  children?: React.ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  bgImage,
  children,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex items-center justify-center min-h-[400px] md:min-h-[500px] w-full overflow-hidden",
        // Use dark navy background when there's no image
        !bgImage && "bg-primary"
      )}
    >
      {/* --- Background Image (if provided) --- */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        />
      )}

      {/* --- Dark Overlay — ensures text is readable over any image --- */}
      {bgImage && (
        <div className="absolute inset-0 bg-primary/70" aria-hidden="true" />
      )}

      {/* --- Content --- */}
      <div className="relative z-10 container-wide text-center py-16">
        {/* Heading */}
        <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="font-body text-accent text-lg md:text-xl max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
        )}

        {/* Children slot — CTA buttons, search bar, etc. */}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
