// =============================================================================
// ShareButtons — Social share buttons for listings, blog posts, and pages
// "use client" because it reads window.location for share URLs
// =============================================================================

"use client";

import { useState } from "react";
import { Share2, Mail, Link2, Check, ExternalLink, MessageCircle } from "lucide-react";

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
        <ExternalLink size={16} />
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
        <MessageCircle size={16} />
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
