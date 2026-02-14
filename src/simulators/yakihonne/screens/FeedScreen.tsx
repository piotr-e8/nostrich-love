import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Zap } from 'lucide-react';
import { NoteCard } from '../../../simulators/shared/components/NoteCard';
import { ContentTabs } from '../components/ContentTabs';
import { formatRelativeTime } from '../../shared/utils/mockEvents';
import type { SimulatorFeedItem, SimulatorUser } from '../../shared/types';

interface FeedScreenProps {
  onOpenCompose: () => void;
  onZap: (amount: number) => void;
}

// Mock feed items
const mockFeedItems: SimulatorFeedItem[] = [
  {
    id: 'note1',
    type: 'note',
    note: {
      id: 'note1',
      pubkey: 'user1',
      created_at: Date.now() / 1000 - 300,
      kind: 1,
      tags: [],
      content: 'Just read the Bitcoin whitepaper again. The elegance of the double-spend solution never gets old. 🔥 #Bitcoin #Nostr',
      sig: 'sig1',
      likes: 42,
      reposts: 12,
      replies: 5,
      zaps: 8,
      zapAmount: 2100,
      images: [],
      hashtags: ['Bitcoin', 'Nostr'],
      category: 'bitcoin' as const,
    },
    author: {
      pubkey: 'user1',
      npub: 'npub1alice',
      displayName: 'Alice Nakamoto',
      username: 'alice',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alice',
      bio: 'Bitcoin maximalist',
      followersCount: 5000,
      followingCount: 200,
      notesCount: 150,
      createdAt: Date.now() / 1000 - 86400 * 365,
      isVerified: true,
    },
    isRead: false,
    timestamp: Date.now() / 1000 - 300,
  },
  {
    id: 'note2',
    type: 'long_form',
    note: {
      id: 'note2',
      pubkey: 'user2',
      created_at: Date.now() / 1000 - 1800,
      kind: 30023,
      tags: [['title', 'Why Nostr is the Future of Social Media']],
      content: 'Nostr represents a fundamental shift in how we think about social media...',
      sig: 'sig2',
      likes: 128,
      reposts: 45,
      replies: 23,
      zaps: 32,
      zapAmount: 10000,
      images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800'],
      hashtags: ['Nostr', 'Decentralization'],
      category: 'nostr' as const,
    },
    author: {
      pubkey: 'user2',
      npub: 'npub1bob',
      displayName: 'Bob Builder',
      username: 'bob',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bob',
      bio: 'Building the future',
      followersCount: 12000,
      followingCount: 500,
      notesCount: 420,
      createdAt: Date.now() / 1000 - 86400 * 200,
      isVerified: false,
    },
    isRead: false,
    timestamp: Date.now() / 1000 - 1800,
  },
  {
    id: 'note3',
    type: 'note',
    note: {
      id: 'note3',
      pubkey: 'user3',
      created_at: Date.now() / 1000 - 3600,
      kind: 1,
      tags: [],
      content: 'Beautiful sunset from my run today 🌅 #running #bitcoin #life',
      sig: 'sig3',
      likes: 89,
      reposts: 7,
      replies: 12,
      zaps: 5,
      zapAmount: 500,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      hashtags: ['running', 'bitcoin', 'life'],
      category: 'personal' as const,
    },
    author: {
      pubkey: 'user3',
      npub: 'npub1carol',
      displayName: 'Carol Runner',
      username: 'carol',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=carol',
      bio: 'Run, Bitcoin, Repeat',
      followersCount: 3000,
      followingCount: 150,
      notesCount: 89,
      createdAt: Date.now() / 1000 - 86400 * 150,
      isVerified: true,
    },
    isRead: false,
    timestamp: Date.now() / 1000 - 3600,
  },
  {
    id: 'note4',
    type: 'repost',
    note: {
      id: 'note4',
      pubkey: 'user4',
      created_at: Date.now() / 1000 - 7200,
      kind: 6,
      tags: [],
      content: '',
      sig: 'sig4',
      likes: 23,
      reposts: 8,
      replies: 2,
      zaps: 3,
      zapAmount: 300,
      isRepost: true,
      repostedBy: 'user4',
      images: [],
      hashtags: [],
      category: 'nostr' as const,
    },
    author: {
      pubkey: 'user4',
      npub: 'npub1dave',
      displayName: 'Dave Developer',
      username: 'dave',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dave',
      bio: 'Code is poetry',
      followersCount: 8000,
      followingCount: 300,
      notesCount: 250,
      createdAt: Date.now() / 1000 - 86400 * 300,
      isVerified: false,
    },
    repostedBy: {
      pubkey: 'user4',
      npub: 'npub1dave',
      displayName: 'Dave Developer',
      username: 'dave',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dave',
      bio: 'Code is poetry',
      followersCount: 8000,
      followingCount: 300,
      notesCount: 250,
      createdAt: Date.now() / 1000 - 86400 * 300,
      isVerified: false,
    },
    isRead: false,
    timestamp: Date.now() / 1000 - 7200,
  },
  {
    id: 'note5',
    type: 'note',
    note: {
      id: 'note5',
      pubkey: 'user5',
      created_at: Date.now() / 1000 - 10800,
      kind: 1,
      tags: [],
      content: 'The Lightning Network is scaling beautifully. Just sent 1000 sats instantly for less than a sat in fees. This is the future! ⚡',
      sig: 'sig5',
      likes: 156,
      reposts: 67,
      replies: 34,
      zaps: 45,
      zapAmount: 25000,
      images: [],
      hashtags: ['Lightning', 'Bitcoin'],
      category: 'bitcoin' as const,
    },
    author: {
      pubkey: 'user5',
      npub: 'npub1eve',
      displayName: 'Eve Lightning',
      username: 'eve',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=eve',
      bio: 'Lightning Network enthusiast',
      followersCount: 15000,
      followingCount: 400,
      notesCount: 600,
      createdAt: Date.now() / 1000 - 86400 * 400,
      isVerified: true,
    },
    isRead: false,
    timestamp: Date.now() / 1000 - 10800,
  },
];

export function FeedScreen({ onOpenCompose, onZap }: FeedScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'zapped'>('all');
  const [likedNotes, setLikedNotes] = useState<Set<string>>(new Set());
  const [repostedNotes, setRepostedNotes] = useState<Set<string>>(new Set());
  const [zappedNotes, setZappedNotes] = useState<Set<string>>(new Set());

  const handleLike = useCallback((noteId: string) => {
    setLikedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  }, []);

  const handleRepost = useCallback((noteId: string) => {
    setRepostedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  }, []);

  const handleZap = useCallback((noteId: string) => {
    setZappedNotes(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(noteId)) {
        newSet.add(noteId);
        onZap(21);
      }
      return newSet;
    });
  }, [onZap]);

  const filteredItems = mockFeedItems.filter(item => {
    if (activeTab === 'following') return true; // Mock: all are following
    if (activeTab === 'zapped') return item.note.zaps > 10;
    return true;
  });

  return (
    <div className="flex flex-col h-full" data-tour="yakihonne-feed">
      {/* Header */}
      <div className="yakihonne-header">
        <div className="yakihonne-logo">
          <Zap className="w-8 h-8 fill-current" />
          <span className="text-xl font-bold">YakiHonne</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--yh-primary)] rounded-full" />
          </button>
        </div>
      </div>

      {/* Content Type Tabs */}
      <ContentTabs
        tabs={[
          { id: 'all', label: 'All' },
          { id: 'following', label: 'Following' },
          { id: 'zapped', label: 'Zapped' },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
      />

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ backgroundColor: 'var(--yh-background-secondary)' }}>
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                delay: index * 0.05,
                type: 'spring',
                stiffness: 300,
                damping: 25 
              }}
            >
              <div className="yakihonne-card">
                <NoteCard
                  item={item}
                  compact={false}
                  showActions={true}
                  isLiked={likedNotes.has(item.id)}
                  isReposted={repostedNotes.has(item.id)}
                  isZapped={zappedNotes.has(item.id)}
                  onLike={() => handleLike(item.id)}
                  onRepost={() => handleRepost(item.id)}
                  onReply={() => onOpenCompose()}
                  onZap={() => handleZap(item.id)}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* End of Feed */}
        <div className="text-center py-6 text-sm" style={{ color: 'var(--yh-text-tertiary)' }}>
          You've reached the end
        </div>
      </div>
    </div>
  );
}

export default FeedScreen;
