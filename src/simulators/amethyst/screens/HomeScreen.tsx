import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, Filter, Plus } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { mockNotes, getRecentNotes, mockUsers, getUserByPubkey } from '../../../data/mock';
import type { MockNote } from '../../../data/mock';
import '../amethyst.theme.css';

interface HomeScreenProps {
  onOpenCompose: () => void;
}

interface Story {
  id: string;
  name: string;
  avatar: string;
  hasStory: boolean;
  isLive?: boolean;
}

export function HomeScreen({ onOpenCompose }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'following' | 'global'>('following');
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  
  // Generate stories from first 10 mock users
  const stories: Story[] = [
    {
      id: 'add-story',
      name: 'Add Story',
      avatar: '',
      hasStory: false,
    },
    ...mockUsers.slice(0, 10).map(user => ({
      id: user.pubkey,
      name: user.displayName,
      avatar: user.avatar,
      hasStory: true,
      isLive: user.isVerified && Math.random() < 0.3,
    })),
  ];
  
  const [posts, setPosts] = useState(() => {
    // Convert mock notes to post format
    return getRecentNotes(20).map(note => {
      const author = getUserByPubkey(note.pubkey);
      return {
        id: note.id,
        author: {
          name: author?.displayName || 'Unknown',
          handle: author?.nip05 || author?.username || 'unknown',
          avatar: author?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${note.pubkey}`,
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
        community: note.community,
        isLive: note.isLive,
      };
    });
  });

  // Pull-to-refresh handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (feedRef.current && feedRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || !feedRef.current) return;
    
    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStartY.current;
    
    if (diff > 0 && feedRef.current.scrollTop === 0) {
      // Resist the pull after 80px
      const resistedDistance = Math.min(diff * 0.5, 120);
      setPullDistance(resistedDistance);
    }
  }, [isPulling]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    
    if (pullDistance >= 80) {
      // Trigger refresh
      setRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRefreshing(false);
    }
    
    // Spring back
    setPullDistance(0);
    setIsPulling(false);
  }, [isPulling, pullDistance]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
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
      <div className="md-app-bar md-app-bar-enhanced">
        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="md-app-bar-icon-btn"
        >
          <Menu className="w-6 h-6 text-[var(--md-on-surface)]" />
        </motion.button>
        
        <div className="flex-1 flex items-center justify-center gap-2">
          {/* Amethyst Logo */}
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-[var(--md-primary)]">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
          <span className="font-semibold text-[var(--md-on-surface)] hidden sm:block">Amethyst</span>
        </div>
        
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="md-app-bar-icon-btn relative"
          >
            <Search className="w-6 h-6 text-[var(--md-on-surface)]" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="md-app-bar-icon-btn relative"
          >
            <Bell className="w-6 h-6 text-[var(--md-on-surface)]" />
            <span className="notification-badge">3</span>
          </motion.button>
        </div>
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

      {/* Stories Row */}
      <div className="stories-container">
        <div className="stories-scroll">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              className="story-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`story-avatar-wrapper ${story.hasStory ? 'has-story' : ''} ${story.isLive ? 'is-live' : ''}`}>
                {story.id === 'add-story' ? (
                  <div className="story-add-button">
                    <Plus className="w-6 h-6 text-[var(--md-primary)]" />
                  </div>
                ) : (
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${story.id || 'default'}`}
                    alt={story.name}
                    className="story-avatar"
                  />
                )}
                {story.isLive && (
                  <div className="live-indicator">
                    <span className="live-text">LIVE</span>
                  </div>
                )}
              </div>
              <span className="story-name">{story.name}</span>
            </motion.div>
          ))}
        </div>
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

      {/* Pull to Refresh Indicator */}
      <motion.div
        className="pull-indicator"
        animate={{
          height: pullDistance,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="pull-spinner"
          animate={{ rotate: (pullDistance / 80) * 360 }}
          style={{
            borderTopColor: pullDistance >= 80 ? 'var(--md-primary)' : 'transparent',
          }}
        />
      </motion.div>

      {/* Feed */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto p-2 space-y-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
