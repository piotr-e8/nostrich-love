import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "../../lib/utils";

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

  // Ensure screenshots is an array and filter out invalid screenshots
  const screenshotsArray = Array.isArray(screenshots) ? screenshots : [];
  const validScreenshots = screenshotsArray.filter(
    (s): s is Screenshot => s && typeof s === "object" && "src" in s && s.src,
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
          "bg-gray-800/50 border border-border-dark rounded-xl p-8 text-center",
          className,
        )}
      >
        <p className="text-gray-500">No screenshots available</p>
      </div>
    );
  }

  const currentScreenshot = validScreenshots[currentIndex];

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden border border-border-dark">
          <img
            src={currentScreenshot.src}
            alt={currentScreenshot.alt || "Screenshot"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center transition-all"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>

          {/* Navigation Arrows */}
          {validScreenshots.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        {currentScreenshot.caption && (
          <p className="text-center text-gray-400 text-sm">
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
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
