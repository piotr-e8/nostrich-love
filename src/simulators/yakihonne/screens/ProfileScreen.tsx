import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, MapPin, Link as LinkIcon, Zap, Users, FileText, Image as ImageIcon, Heart } from 'lucide-react';
import { ContentTabs } from '../components/ContentTabs';
import { NoteCard } from '../../../simulators/shared/components/NoteCard';
import type { SimulatorUser, SimulatorFeedItem } from '../../shared/types';

interface ProfileScreenProps {
  user: SimulatorUser;
  onOpenSettings: () => void;
}

// Mock user's posts
const mockUserPosts: SimulatorFeedItem[] = [
  {
    id: 'post1',
    type: 'note',
    note: {
      id: 'post1',
      pubkey: 'user1',
      created_at: Date.now() / 1000 - 3600,
      kind: 1,
      tags: [],
      content: 'Working on something big for the Bitcoin community. Stay tuned! 🚀',
      sig: 'sig1',
      likes: 234,
      reposts: 45,
      replies: 23,
      zaps: 56,
      zapAmount: 10000,
      images: [],
      hashtags: ['Bitcoin'],
      category: 'bitcoin' as const,
    },
    author: {
      pubkey: 'user1',
      npub: 'npub1user',
      displayName: 'Satoshi Nakamoto',
      username: 'satoshi',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=satoshi',
      bio: 'Bitcoin creator',
      followersCount: 21000000,
      followingCount: 21,
      notesCount: 42,
      createdAt: Date.now() / 1000 - 86400 * 5000,
      isVerified: true,
    },
    isRead: false,
    timestamp: Date.now() / 1000 - 3600,
  },
  {
    id: 'post2',
    type: 'note',
    note: {
      id: 'post2',
      pubkey: 'user1',
      created_at: Date.now() / 1000 - 86400,
      kind: 1,
      tags: [],
      content: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks. #Genesis',
      sig: 'sig2',
      likes: 10000,
      reposts: 5000,
      replies: 1000,
      zaps: 2100,
      zapAmount: 1000000,
      images: [],
      hashtags: ['Genesis'],
      category: 'bitcoin' as const,
    },
    author: {
      pubkey: 'user1',
      npub: 'npub1user',
      displayName: 'Satoshi Nakamoto',
      username: 'satoshi',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=satoshi',
      bio: 'Bitcoin creator',
      followersCount: 21000000,
      followingCount: 21,
      notesCount: 42,
      createdAt: Date.now() / 1000 - 86400 * 5000,
      isVerified: true,
    },
    isRead: false,
    timestamp: Date.now() / 1000 - 86400,
  },
];

export function ProfileScreen({ user, onOpenSettings }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'articles' | 'media' | 'likes'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedNotes, setLikedNotes] = useState<Set<string>>(new Set());

  const handleLike = (noteId: string) => {
    setLikedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="flex flex-col h-full" data-tour="yakihonne-profile">
      {/* Header */}
      <div className="yakihonne-header">
        <div className="flex items-center gap-3">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={onOpenSettings}
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="yakihonne-header-title">Profile</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-[var(--yh-surface)] pb-4">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-br from-[var(--yh-primary)] to-[var(--yh-primary-dark)]" />
          
          {/* Avatar and Actions */}
          <div className="px-4 -mt-12">
            <div className="flex justify-between items-end">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-24 h-24 rounded-full border-4 border-[var(--yh-surface)] bg-gray-200"
              />
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`yakihonne-btn ${isFollowing ? 'yakihonne-btn-secondary' : 'yakihonne-btn-primary'} mb-2`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 mt-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[var(--yh-text-primary)]">
                {user.displayName}
              </h1>
              {user.isVerified && (
                <span className="text-[var(--yh-primary)]">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            
            <p className="text-[var(--yh-text-secondary)] text-sm">
              @{user.username}
              {user.nip05 && <span className="text-[var(--yh-primary)]"> ✓ {user.nip05}</span>}
            </p>

            <p className="mt-2 text-[var(--yh-text-primary)]">{user.bio}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-[var(--yh-text-secondary)]">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </span>
              )}
              {user.website && (
                <span className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a href={user.website} className="text-[var(--yh-primary)] hover:underline">
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </span>
              )}
              {user.lightningAddress && (
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-[var(--yh-primary)]" />
                  {user.lightningAddress}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[var(--yh-text-primary)]">{formatNumber(user.followingCount)}</span>
                <span className="text-[var(--yh-text-secondary)]">Following</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[var(--yh-text-primary)]">{formatNumber(user.followersCount)}</span>
                <span className="text-[var(--yh-text-secondary)]">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <ContentTabs
          tabs={[
            { id: 'posts', label: 'Posts', icon: FileText },
            { id: 'articles', label: 'Articles', icon: FileText },
            { id: 'media', label: 'Media', icon: ImageIcon },
            { id: 'likes', label: 'Likes', icon: Heart },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
        />

        {/* Tab Content */}
        <div className="p-3">
          {activeTab === 'posts' && (
            <div className="space-y-3">
              {mockUserPosts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <NoteCard
                    item={item}
                    compact={false}
                    showActions={true}
                    isLiked={likedNotes.has(item.id)}
                    onLike={() => handleLike(item.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          {activeTab === 'articles' && (
            <div className="text-center py-12 text-[var(--yh-text-tertiary)]">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No articles yet</p>
            </div>
          )}
          
          {activeTab === 'media' && (
            <div className="text-center py-12 text-[var(--yh-text-tertiary)]">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No media yet</p>
            </div>
          )}
          
          {activeTab === 'likes' && (
            <div className="text-center py-12 text-[var(--yh-text-tertiary)]">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No liked posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
