// =============================================================================
// HeroSection — Full-width hero banner with optional background image
// Server component (no "use client" directive)
// Dramatic design: 500px+ height, gradient overlays, large typography
// =============================================================================

import { cn } from "@/lib/utils";

interface HeroSectionProps {
  /** Main heading text */
  title: string;
  /** Optional subtitle displayed below the heading */
  subtitle?: string;
  /** Background image URL — a gradient overlay is applied on top */
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
        // Dramatic dark gradient when there's no background image
        !bgImage && "bg-gradient-to-br from-primary via-[#0f2847] to-primary"
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

      {/* --- Gradient Overlay — matches WordPress site's hero treatment --- */}
      {bgImage && (
        <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      )}

      {/* --- Content — centered vertically and horizontally --- */}
      <div className="relative z-10 container-wide text-center py-16 md:py-20">
        {/* Heading — large, impactful, fluid sizing */}
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mb-2">
          {title}
        </h1>

        {/* Accent bar divider below title */}
        <div className="section-divider" />

        {/* Subtitle — slightly transparent for depth */}
        {subtitle && (
          <p className="font-body text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        {/* Children slot — CTA buttons, search bar, etc. */}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
