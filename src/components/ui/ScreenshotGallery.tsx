import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "../../lib/utils";

const LIGHTBOX_EXIT_DURATION_MS = 200;

interface Screenshot {
  src: string;
  alt: string;
  caption?: string;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  className?: string;
}

export function ScreenshotGallery({
  screenshots,
  className,
}: ScreenshotGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  // Timed-exit idiom (StreakBanner): fade in via double-rAF, fade out on a timer.
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isLightboxOpen) {
      setEntered(false);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isLightboxOpen]);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    [],
  );

  const closeLightbox = () => {
    if (exiting) return;
    setExiting(true);
    exitTimer.current = setTimeout(() => {
      setExiting(false);
      setIsLightboxOpen(false);
    }, LIGHTBOX_EXIT_DURATION_MS);
  };

  const isLightboxShown = entered && !exiting;

  // Ensure screenshots is an array and filter out invalid screenshots
  const screenshotsArray = Array.isArray(screenshots) ? screenshots : [];
  const validScreenshots = screenshotsArray.filter(
    (s): s is Screenshot =>
      Boolean(s) && typeof s === "object" && "src" in s && Boolean(s.src),
  );

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? validScreenshots.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === validScreenshots.length - 1 ? 0 : prev + 1,
    );
  };

  if (!validScreenshots || validScreenshots.length === 0) {
    return (
      <div
        className={cn(
          "bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center",
          className,
        )}
      >
        <p className="text-gray-500 dark:text-gray-400">No screenshots available</p>
      </div>
    );
  }

  const currentScreenshot = validScreenshots[currentIndex];

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src={currentScreenshot.src}
            alt={currentScreenshot.alt || "Screenshot"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 end-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center transition-all"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>

          {/* Navigation Arrows */}
          {validScreenshots.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-white rtl:rotate-180" />
              </button>
              <button
                onClick={goToNext}
                className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-6 h-6 text-white rtl:rotate-180" />
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        {currentScreenshot.caption && (
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            {currentScreenshot.caption}
          </p>
        )}

        {/* Thumbnails */}
        {validScreenshots.length > 1 && (
          <div className="flex gap-2 justify-center">
            {validScreenshots.map((screenshot, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
                  index === currentIndex
                    ? "border-primary-500"
                    : "border-transparent hover:border-gray-600",
                )}
              >
                <img
                  src={screenshot.src}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
          <div
            className={cn(
              "fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4",
              "transition-opacity duration-200 motion-reduce:transition-none",
              isLightboxShown ? "opacity-100" : "opacity-0",
            )}
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 end-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <img
              src={currentScreenshot.src}
              alt={currentScreenshot.alt || "Screenshot"}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {validScreenshots.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute start-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white rtl:rotate-180" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute end-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white rtl:rotate-180" />
                </button>
              </>
            )}
          </div>
      )}
    </>
  );
}
