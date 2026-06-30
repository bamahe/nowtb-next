// =============================================================================
// ShareButtons — Social share buttons for listings, blog posts, and pages
// "use client" because it reads window.location for share URLs
// =============================================================================

"use client";

import { useState } from "react";
import { Share2, Mail, Link2, Check } from "lucide-react";

// Facebook "f" logo (brand icon — Lucide doesn't have brand icons)
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// X (Twitter) logo
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface ShareButtonsProps {
  /** Title of the page/listing being shared */
  title: string;
  /** Optional description for email/SMS shares */
  description?: string;
  /** Layout: "row" for horizontal, "column" for vertical stack */
  layout?: "row" | "column";
}

export default function ShareButtons({
  title,
  description = "",
  layout = "row",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Get current page URL (runs client-side only)
  const getUrl = () => typeof window !== "undefined" ? window.location.href : "";

  // Copy link to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = getUrl();
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Native share (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url: getUrl() });
      } catch {
        // User cancelled — ignore
      }
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || title);

  const buttonClass =
    "flex items-center justify-center w-9 h-9 border border-border text-muted hover:text-primary hover:border-primary transition-colors duration-300";

  return (
    <div className={`flex ${layout === "column" ? "flex-col" : "flex-row"} gap-2`}>
      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on Facebook"
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
            "facebook-share",
            "width=580,height=400"
          );
        }}
      >
        <FacebookIcon />
      </a>

      {/* Twitter/X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(getUrl())}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on X"
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(getUrl())}`,
            "twitter-share",
            "width=580,height=400"
          );
        }}
      >
        <XIcon />
      </a>

      {/* Email */}
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodeURIComponent(getUrl())}`}
        className={buttonClass}
        aria-label="Share via email"
      >
        <Mail size={16} />
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className={buttonClass}
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? <Check size={16} className="text-green-600" /> : <Link2 size={16} />}
      </button>

      {/* Native share (mobile only — shows share sheet) */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={handleNativeShare}
          className={buttonClass}
          aria-label="Share"
        >
          <Share2 size={16} />
        </button>
      )}
    </div>
  );
}
