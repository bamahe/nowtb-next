// =============================================================================
// HeroSection — Full-viewport luxury hero banner
// Server component (no "use client" directive)
// Content positioned in the lower portion for dramatic negative space above
// Supports full-height (100dvh) or shorter (50vh) modes
// =============================================================================

import { cn } from "@/lib/utils";

interface HeroSectionProps {
  /** Main heading text */
  title: string;
  /** Optional subtitle displayed below the heading */
  subtitle?: string;
  /** Small uppercase label above the title (e.g. "TAMPA BAY REAL ESTATE") */
  label?: string;
  /** Background image URL — a gradient overlay is applied on top */
  bgImage?: string;
  /** Use full viewport height (true) or shorter 50vh hero (false). Defaults to false. */
  fullHeight?: boolean;
  /** Slot for CTA buttons, search bar, or other interactive content */
  children?: React.ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  label,
  bgImage,
  fullHeight = false,
  children,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex w-full overflow-hidden",
        // Full viewport — content at bottom; shorter — content centered
        fullHeight
          ? "min-h-[100dvh] items-end"
          : "min-h-[50vh] items-center justify-center",
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

      {/* --- Gradient Overlay — darker at bottom for text legibility --- */}
      {bgImage && (
        <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      )}

      {/* --- Content — positioned in the lower portion of the hero --- */}
      <div
        className={cn(
          "relative z-10 container-wide text-center",
          fullHeight ? "pb-24 md:pb-32 pt-16" : "py-16 md:py-20"
        )}
      >
        {/* Optional small label above title — brand identifier */}
        {label && (
          <p className="heading-label text-white/50 mb-8">{label}</p>
        )}

        {/* Heading — ultra-light weight, wide tracking, large fluid sizing */}
        <h1 className="font-heading font-extralight text-4xl md:text-5xl lg:text-7xl tracking-[0.1em] uppercase text-white mb-0">
          {title}
        </h1>

        {/* Thin accent divider between title and subtitle */}
        <div className="section-divider" />

        {/* Subtitle — slightly transparent, light weight for refinement */}
        {subtitle && (
          <p className="font-body text-base md:text-lg text-white/70 font-light max-w-xl mx-auto">
            {subtitle}
          </p>
        )}

        {/* Children slot — CTA buttons, search bar, etc. */}
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}
