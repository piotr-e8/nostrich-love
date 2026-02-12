import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Settings, Filter } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { mockNotes, getRecentNotes, mockUsers, getUserByPubkey } from '../../../data/mock';
import type { MockNote } from '../../../data/mock';
import '../amethyst.theme.css';

interface HomeScreenProps {
  onOpenCompose: () => void;
}

export function HomeScreen({ onOpenCompose }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'following' | 'global'>('following');
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(() => {
    // Convert mock notes to post format
    return getRecentNotes(20).map(note => {
      const author = getUserByPubkey(note.pubkey);
      return {
        id: note.id,
        author: {
          name: author?.displayName || 'Unknown',
          handle: author?.nip05 || author?.username || 'unknown',
          avatar: author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${note.pubkey}`,
          nip05: author?.nip05,
          isVerified: author?.isVerified,
        },
        content: note.content,
        timestamp: formatTimestamp(note.created_at),
        stats: {
          replies: note.replies,
          reposts: note.reposts,
          zaps: note.zaps,
          likes: note.likes,
        },
        images: note.images,
        hashtags: note.hashtags,
      };
    });
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const handleLike = useCallback((id: string) => {
    console.log('Liked post:', id);
  }, []);

  const handleRepost = useCallback((id: string) => {
    console.log('Reposted:', id);
  }, []);

  const handleZap = useCallback((id: string) => {
    console.log('Zapped:', id);
  }, []);

  const handleReply = useCallback((id: string) => {
    onOpenCompose();
  }, [onOpenCompose]);

  return (
    <div className="flex flex-col h-full bg-[var(--md-background)]" data-tour="amethyst-feed">
      {/* App Bar */}
      <div className="md-app-bar sticky top-0 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[var(--md-surface-variant)] transition-colors"
        >
          <Menu className="w-6 h-6 text-[var(--md-on-surface)]" />
        </motion.button>
        
        <div className="flex-1 flex justify-center">
          {/* Amethyst Logo */}
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-[var(--md-primary)]">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[var(--md-surface-variant)] transition-colors"
        >
          <Settings className="w-6 h-6 text-[var(--md-on-surface)]" />
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="md-tabs sticky top-16 z-10 bg-[var(--md-surface)]">
        <button
          onClick={() => setActiveTab('following')}
          className={`md-tab ${activeTab === 'following' ? 'active' : ''}`}
        >
          Following
          {activeTab === 'following' && (
            <motion.div
              layoutId="tab-indicator"
              className="md-tab-indicator"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('global')}
          className={`md-tab ${activeTab === 'global' ? 'active' : ''}`}
        >
          Global
          {activeTab === 'global' && (
            <motion.div
              layoutId="tab-indicator"
              className="md-tab-indicator"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-[var(--md-surface)] border-b border-[var(--md-outline-variant)]">
        <button className="md-chip md-chip-filter selected">
          <Filter className="w-4 h-4" />
          All
        </button>
        <button className="md-chip md-chip-filter">Bitcoin</button>
        <button className="md-chip md-chip-filter">Nostr</button>
        <button className="md-chip md-chip-filter">Tech</button>
        <button className="md-chip md-chip-filter">Memes</button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                delay: index * 0.03,
                type: 'spring',
                stiffness: 300,
                damping: 25 
              }}
            >
              <MaterialCard
                post={post}
                onLike={handleLike}
                onRepost={handleRepost}
                onZap={handleZap}
                onReply={handleReply}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading Indicator */}
        {refreshing && (
          <div className="flex justify-center py-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-6 h-6 border-2 border-[var(--md-primary)] border-t-transparent rounded-full"
            />
          </div>
        )}
        
        {/* End of Feed */}
        <div className="text-center py-6 text-[var(--md-on-surface-variant)] text-sm">
          You've reached the end
        </div>
      </div>
    </div>
  );
}

// Helper function to format timestamps
function formatTimestamp(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(timestamp * 1000).toLocaleDateString();
}
