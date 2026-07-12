// =============================================================================
// HeroSection — Full-viewport luxury hero banner
// Server component (no "use client" directive)
// Content positioned in the lower portion for dramatic negative space above
// Supports full-height (100dvh) or shorter (50vh) modes
// Supports optional background video (auto-plays muted, loops, hidden on mobile)
// =============================================================================

import { cn } from "@/lib/utils";

interface HeroSectionProps {
  /** Main heading text */
  title: string;
  /** Optional subtitle displayed below the heading */
  subtitle?: string;
  /** Small uppercase label above the title (e.g. "TAMPA BAY REAL ESTATE") */
  label?: string;
  /** Background image URL — a gradient overlay is applied on top. Also used as video poster/fallback. */
  bgImage?: string;
  /** Background video URL — plays behind content, muted+looping. Falls back to bgImage on mobile. */
  bgVideo?: string;
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
  bgVideo,
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
          : bgImage
            ? "min-h-[70vh] items-center justify-center"
            : "min-h-[50vh] items-center justify-center",
        // Dramatic dark gradient when there's no background image
        !bgImage && "bg-gradient-to-br from-primary via-[#0f2847] to-primary"
      )}
    >
      {/* --- Background Image (fallback / poster for video, or standalone) --- */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        />
      )}

      {/* --- Background Video (hidden on mobile to save bandwidth) --- */}
      {bgVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={bgImage}
          aria-hidden="true"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      )}

      {/* --- Gradient Overlay — darker at bottom for text legibility --- */}
      {(bgImage || bgVideo) && (
        <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      )}

      {/* --- Content — positioned in the lower portion of the hero --- */}
      <div
        className={cn(
          "relative z-10 container-wide text-center",
          fullHeight ? "pb-24 md:pb-32 pt-16" : "pt-28 pb-16 md:pt-32 md:pb-20"
        )}
      >
        {/* Small label above title — defaults to Barrett's brand if none passed */}
        <p className="heading-label text-white/50 mb-8">
          {label || "BARRETT HENRY | THE NOW TEAM"}
        </p>

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
