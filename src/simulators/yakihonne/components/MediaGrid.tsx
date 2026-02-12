import React from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Zap } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  zaps: number;
  caption: string;
  duration?: string;
}

interface MediaGridProps {
  items: MediaItem[];
  viewMode: 'grid' | 'list';
  onItemClick: (id: string) => void;
}

export function MediaGrid({ items, viewMode, onItemClick }: MediaGridProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (viewMode === 'grid') {
    return (
      <div className="yakihonne-media-grid">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="yakihonne-media-item"
            onClick={() => onItemClick(item.id)}
          >
            <img
              src={item.thumbnail}
              alt={item.caption}
              className="w-full h-full object-cover"
            />
            
            {/* Video Indicator */}
            {item.type === 'video' && (
              <div className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
            )}

            {/* Duration Badge */}
            {item.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-white text-xs font-medium">
                {item.duration}
              </div>
            )}

            {/* Hover Overlay */}
            <div className="yakihonne-media-overlay">
              <div className="flex items-center gap-3 text-white text-sm">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {formatNumber(item.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {formatNumber(item.zaps)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // List View
  return (
    <div className="p-3 space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-[var(--yh-surface)] rounded-xl overflow-hidden cursor-pointer"
          onClick={() => onItemClick(item.id)}
        >
          <div className="flex">
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                src={item.thumbnail}
                alt={item.caption}
                className="w-full h-full object-cover"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-[var(--yh-text-primary)] fill-current ml-0.5" />
                  </div>
                </div>
              )}
              {item.duration && (
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-white text-xs">
                  {item.duration}
                </div>
              )}
            </div>
            
            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <p className="text-[var(--yh-text-primary)] font-medium line-clamp-2">
                  {item.caption}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={item.author.avatar}
                    alt={item.author.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm text-[var(--yh-text-secondary)]">
                    {item.author.name}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-[var(--yh-text-secondary)]">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {formatNumber(item.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {formatNumber(item.zaps)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default MediaGrid;
