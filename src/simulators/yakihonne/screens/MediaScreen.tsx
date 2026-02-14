import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Video, Grid, List } from 'lucide-react';
import { MediaGrid } from '../components/MediaGrid';
import { ContentTabs } from '../components/ContentTabs';

interface MediaScreenProps {
  onOpenCompose: () => void;
}

// Mock media items
const mockMediaItems = [
  {
    id: 'media1',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600',
    thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=300',
    author: {
      name: 'Bitcoin Artist',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=artist1',
    },
    likes: 234,
    zaps: 89,
    caption: 'The evolution of money 🧡',
  },
  {
    id: 'media2',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300',
    author: {
      name: 'Crypto Vision',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=artist2',
    },
    likes: 567,
    zaps: 234,
    caption: 'Nostr purple vibes 💜',
  },
  {
    id: 'media3',
    type: 'video' as const,
    url: 'https://example.com/video1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300',
    author: {
      name: 'Tech Reviewer',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=reviewer',
    },
    likes: 123,
    zaps: 45,
    caption: 'Lightning Network explained ⚡',
    duration: '3:45',
  },
  {
    id: 'media4',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
    author: {
      name: 'Nature Lover',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nature',
    },
    likes: 890,
    zaps: 445,
    caption: 'Mountain sunrise vibes 🏔️',
  },
  {
    id: 'media5',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300',
    author: {
      name: 'Space Explorer',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=space',
    },
    likes: 445,
    zaps: 178,
    caption: 'To the moon 🚀',
  },
  {
    id: 'media6',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?w=600',
    thumbnail: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?w=300',
    author: {
      name: 'Bitcoin Art',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bitcoinart',
    },
    likes: 678,
    zaps: 290,
    caption: 'Satoshi\'s vision realized',
  },
  {
    id: 'media7',
    type: 'video' as const,
    url: 'https://example.com/video2.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300',
    author: {
      name: 'Trading Pro',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=trader',
    },
    likes: 234,
    zaps: 120,
    caption: 'Market analysis 📊',
    duration: '5:20',
  },
  {
    id: 'media8',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1621504450168-b8c4375443a2?w=600',
    thumbnail: 'https://images.unsplash.com/photo-1621504450168-b8c4375443a2?w=300',
    author: {
      name: 'Meme Lord',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=meme',
    },
    likes: 1234,
    zaps: 567,
    caption: 'HODL gang 💎🙌',
  },
  {
    id: 'media9',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300',
    author: {
      name: 'Finance Guru',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=finance',
    },
    likes: 789,
    zaps: 340,
    caption: 'Chart patterns 📈',
  },
];

export function MediaScreen({ onOpenCompose }: MediaScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const filteredMedia = mockMediaItems.filter(item => {
    if (activeTab === 'images') return item.type === 'image';
    if (activeTab === 'videos') return item.type === 'video';
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="yakihonne-header">
        <span className="yakihonne-header-title">Media</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {viewMode === 'grid' ? (
              <List className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Grid className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Content Type Tabs */}
      <ContentTabs
        tabs={[
          { id: 'all', label: 'All' },
          { id: 'images', label: 'Photos', icon: ImageIcon },
          { id: 'videos', label: 'Videos', icon: Video },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
      />

      {/* Media Grid */}
      <div className="flex-1 overflow-y-auto">
        <MediaGrid
          items={filteredMedia}
          viewMode={viewMode}
          onItemClick={(id) => setSelectedMedia(id)}
        />
      </div>

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const media = mockMediaItems.find(m => m.id === selectedMedia);
                if (!media) return null;
                return (
                  <div className="flex flex-col items-center">
                    <img
                      src={media.url}
                      alt={media.caption}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                    <div className="mt-4 text-center">
                      <p className="text-white text-lg font-medium">{media.caption}</p>
                      <div className="flex items-center justify-center gap-4 mt-2 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <span>❤️</span> {media.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>⚡</span> {media.zaps}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MediaScreen;
