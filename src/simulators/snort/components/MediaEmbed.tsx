/**
 * Snort Media Embed Component
 * Image and video embeds
 */

import React, { useState } from 'react';

interface MediaEmbedProps {
  images?: string[];
  video?: string;
  link?: string;
}

export const MediaEmbed: React.FC<MediaEmbedProps> = ({
  images = [],
  video,
  link,
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  const handleImageError = (index: number) => {
    setErrorImages(prev => new Set([...prev, index]));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setLightboxIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setLightboxIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'ArrowRight') navigateLightbox('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, images.length]);

  // Get grid class based on image count
  const getGridClass = () => {
    switch (images.length) {
      case 1:
        return '';
      case 2:
        return 'snort-media-grid snort-media-grid-2';
      case 3:
        return 'snort-media-grid snort-media-grid-3';
      default:
        return 'snort-media-grid snort-media-grid-4';
    }
  };

  // Render link preview
  if (link && images.length === 0 && !video) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="snort-media block p-4 hover:bg-slate-800/50 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-300 truncate">{link}</p>
            <p className="text-sm text-slate-500 mt-1">External link</p>
          </div>
        </div>
      </a>
    );
  }

  // Render video
  if (video) {
    return (
      <div className="snort-media">
        <video
          src={video}
          controls
          className="w-full max-h-[500px]"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  // Render images
  if (images.length === 0) return null;

  return (
    <>
      <div 
        className={`snort-media ${getGridClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {images.slice(0, 4).map((image, index) => {
          const isLoaded = loadedImages.has(index);
          const hasError = errorImages.has(index);
          const isLastHidden = index === 3 && images.length > 4;

          if (hasError) {
            return (
              <div
                key={index}
                className="relative aspect-video bg-slate-800 flex items-center justify-center"
              >
                <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="relative overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              {!isLoaded && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse" />
              )}
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  images.length === 1 ? 'max-h-[500px]' : 'aspect-video'
                }`}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
              {isLastHidden && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">+{images.length - 4}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('prev');
                }}
                className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('next');
                }}
                className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={images[lightboxIndex]}
            alt={`Image ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MediaEmbed;
