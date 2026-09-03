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
  // Timed-exit idiom: fade in via double-rAF, fade out on a timer.
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
          "rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900",
          className,
        )}
      >
        <p className="text-body-sm text-gray-500 dark:text-gray-400">No screenshots available</p>
      </div>
    );
  }

  const currentScreenshot = validScreenshots[currentIndex];

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
          <img
            src={currentScreenshot.src}
            alt={currentScreenshot.alt || "Screenshot"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-md bg-black/60 transition-colors hover:bg-black/80"
          >
            <ZoomIn className="h-5 w-5 text-white" strokeWidth={1.5} aria-hidden="true" />
          </button>

          {/* Navigation Arrows */}
          {validScreenshots.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute start-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/80"
              >
                <ChevronLeft className="h-5 w-5 text-white rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                onClick={goToNext}
                className="absolute end-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/80"
              >
                <ChevronRight className="h-5 w-5 text-white rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        {currentScreenshot.caption && (
          <p className="text-center text-body-sm text-gray-600 dark:text-gray-400">
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
                  "h-12 w-16 overflow-hidden rounded-md border-2 transition-colors",
                  index === currentIndex
                    ? "border-primary-600 dark:border-primary-400"
                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-700",
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
              className="absolute end-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5 text-white" strokeWidth={1.5} aria-hidden="true" />
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
                  className="absolute start-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="h-5 w-5 text-white rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute end-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="h-5 w-5 text-white rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
      )}
    </>
  );
}
