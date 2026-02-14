import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Eye, Heart, MoreVertical } from 'lucide-react';
import '../amethyst.theme.css';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to Nostr Protocol',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    duration: '12:34',
    views: 1234,
    likes: 89,
    author: {
      name: 'NostrDev',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dev1',
    },
    timestamp: '2h ago',
  },
  {
    id: '2',
    title: 'Bitcoin Lightning Network Explained',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    duration: '8:45',
    views: 567,
    likes: 45,
    author: {
      name: 'BTCMaxi',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=btc1',
    },
    timestamp: '5h ago',
  },
  {
    id: '3',
    title: 'Building on Nostr: Tutorial',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    duration: '24:18',
    views: 2341,
    likes: 156,
    author: {
      name: 'BuilderBob',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bob1',
    },
    timestamp: '1d ago',
  },
  {
    id: '4',
    title: 'The Future of Decentralized Social',
    thumbnail: 'https://picsum.photos/400/225?random=4',
    duration: '15:22',
    views: 892,
    likes: 67,
    author: {
      name: 'CryptoSage',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sage1',
    },
    timestamp: '2d ago',
  },
];

export function VideoScreen() {
  const [activeTab, setActiveTab] = useState<'trending' | 'subscriptions' | 'library'>('trending');

  return (
    <div className="flex flex-col h-full bg-[var(--md-background)]">
      {/* App Bar */}
      <div className="md-app-bar md-app-bar-enhanced">
        <div className="flex-1 flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-[var(--md-primary)]">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
          <span className="font-semibold text-[var(--md-on-surface)]">Amethyst Video</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="md-tabs sticky top-16 z-10 bg-[var(--md-surface)]">
        {['trending', 'subscriptions', 'library'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`md-tab ${activeTab === tab ? 'active' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <motion.div
                layoutId="video-tab-indicator"
                className="md-tab-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="md-card cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-16 h-16 rounded-full bg-[var(--md-primary)] flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-3 flex gap-3">
                <img
                  src={video.author.avatar}
                  alt={video.author.name}
                  className="md-avatar w-10 h-10"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--md-on-surface)] line-clamp-2 text-sm">
                    {video.title}
                  </h3>
                  <p className="text-xs text-[var(--md-on-surface-variant)] mt-1">
                    {video.author.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--md-on-surface-variant)] mt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatViews(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {video.likes}
                    </span>
                    <span>{video.timestamp}</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-[var(--md-surface-variant)] self-start"
                >
                  <MoreVertical className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatViews(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
