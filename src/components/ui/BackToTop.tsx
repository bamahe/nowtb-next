// =============================================================================
// BackToTop — Floating button that appears after scrolling down ~400px
// Smoothly scrolls the user back to the top of the page.
// =============================================================================

"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  // Show the button after scrolling down 400px
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    handleScroll(); // check on mount in case page loads scrolled
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`
        fixed bottom-20 md:bottom-8 right-20 z-30
        w-10 h-10 rounded-full
        bg-primary/80 text-white shadow-lg backdrop-blur-sm
        flex items-center justify-center
        hover:bg-primary transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <ArrowUp size={18} />
    </button>
  );
}
