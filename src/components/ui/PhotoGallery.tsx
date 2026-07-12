// =============================================================================
// PhotoGallery — Full-width hero image + horizontal thumbnail strip below
// Click any thumbnail to swap the hero; click the hero to open lightbox
// Lightbox has arrow navigation + thumbnail strip at the bottom
// =============================================================================

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Photo {
  MediaURL: string;
  ShortDescription?: string;
  Order: number;
}

interface PhotoGalleryProps {
  photos: Photo[];
  address: string;
  autoScroll?: boolean;
}

export default function PhotoGallery({ photos, address, autoScroll = false }: PhotoGalleryProps) {
  // Which photo is shown as the hero (auto-advances)
  const [heroIndex, setHeroIndex] = useState(0);
  // Which photo is shown in the lightbox (-1 = closed)
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const lightboxOpen = lightboxIndex >= 0;
  // Pause auto-scroll on hover or after user clicks
  const [paused, setPaused] = useState(false);
  const userClicked = useRef(false);

  // Auto-scroll hero image every 4 seconds
  useEffect(() => {
    if (!autoScroll || paused || lightboxOpen || userClicked.current || photos.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((current) => (current === photos.length - 1 ? 0 : current + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [autoScroll, paused, lightboxOpen, photos.length]);

  // Navigate lightbox
  const goTo = useCallback(
    (direction: "prev" | "next") => {
      setLightboxIndex((current) => {
        if (direction === "prev") return current === 0 ? photos.length - 1 : current - 1;
        return current === photos.length - 1 ? 0 : current + 1;
      });
    },
    [photos.length]
  );

  // Keyboard navigation in lightbox
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo("prev");
      else if (e.key === "ArrowRight") goTo("next");
      else if (e.key === "Escape") setLightboxIndex(-1);
    },
    [goTo]
  );

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-[16/9] bg-gray-100">
        <p className="font-body text-muted">No photos available</p>
      </div>
    );
  }

  return (
    <>
      {/* ===== Full-width hero image — click to open lightbox ===== */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          onClick={() => { userClicked.current = true; setLightboxIndex(heroIndex); }}
          className="w-full cursor-pointer group"
          aria-label={`View photo ${heroIndex + 1} fullscreen`}
        >
          <Image
            src={photos[heroIndex].MediaURL}
            alt={photos[heroIndex].ShortDescription || `${address} — photo ${heroIndex + 1}`}
            width={1200}
            height={600}
            sizes="100vw"
            priority
            className="w-full aspect-[2/1] object-cover group-hover:scale-[1.01] transition-transform duration-500"
          />
        </button>

        {/* Hero navigation arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => { userClicked.current = true; setHeroIndex((i) => i === 0 ? photos.length - 1 : i - 1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => { userClicked.current = true; setHeroIndex((i) => i === photos.length - 1 ? 0 : i + 1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Photo counter badge */}
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-body px-3 py-1.5 rounded-full">
          {heroIndex + 1} / {photos.length}
        </span>
      </div>

      {/* ===== Thumbnail strip below the hero — horizontal scroll ===== */}
      {photos.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-thin">
          {photos.map((photo, index) => (
            <button
              key={photo.MediaURL}
              onClick={() => { userClicked.current = true; setHeroIndex(index); }}
              className={`relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 overflow-hidden transition-all ${
                index === heroIndex
                  ? "ring-2 ring-[#1B2A4A] opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
              aria-label={`View photo ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.MediaURL}
                alt={photo.ShortDescription || `${address} — thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* ===== Fullscreen Lightbox ===== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          onClick={() => setLightboxIndex(-1)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Photo viewer"
          ref={(el) => el?.focus()}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(-1)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 bg-white/10 rounded-full p-2"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous arrow */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goTo("prev"); }}
              className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-3"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main lightbox image */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto px-16 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightboxIndex].MediaURL}
              alt={photos[lightboxIndex].ShortDescription || `${address} — photo ${lightboxIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Next arrow */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goTo("next"); }}
              className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-3"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Bottom bar: counter + thumbnail strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-4 px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-white/60 text-sm font-body text-center mb-3">
                {lightboxIndex + 1} / {photos.length}
              </p>
              <div className="flex gap-1.5 overflow-x-auto justify-center scrollbar-thin">
                {photos.map((photo, index) => (
                  <button
                    key={photo.MediaURL}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(index); }}
                    className={`relative flex-shrink-0 w-12 h-9 rounded overflow-hidden transition-all ${
                      index === lightboxIndex
                        ? "ring-2 ring-white opacity-100"
                        : "opacity-40 hover:opacity-70"
                    }`}
                    aria-label={`View photo ${index + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.MediaURL}
                      alt={photo.ShortDescription || `${address} — photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
