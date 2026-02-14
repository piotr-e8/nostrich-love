import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  Link as LinkIcon,
  Calendar,
  MapPin,
  Globe,
  Edit3,
  Grid3X3,
  Bookmark,
  Heart
} from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { mockNotes, getUserByPubkey, getNotesByAuthor } from '../../../data/mock';
import '../amethyst.theme.css';

interface ProfileScreenProps {
  onBack?: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'likes'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock current user - in real app this would come from context/auth
  const currentUser = {
    name: 'You',
    handle: 'you@nostr.local',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=currentuser',
    banner: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bio: 'Nostr enthusiast ⚡️ Building on Bitcoin. Freedom advocate.',
    location: 'Cyberspace',
    website: 'nostr.how',
    joinedDate: 'March 2023',
    followers: 1234,
    following: 567,
    isVerified: true,
  };

  // Get user's posts
  const userPosts = mockNotes.slice(0, 5).map(note => {
    const author = getUserByPubkey(note.pubkey);
    return {
      id: note.id,
      author: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
      },
      content: note.content,
      timestamp: formatTimestamp(note.created_at),
      stats: {
        replies: note.replies,
        reposts: note.reposts,
        zaps: note.zaps,
        likes: note.likes,
      },
    };
  });

  return (
    <div className="flex flex-col h-full bg-[var(--md-background)]">
      {/* App Bar */}
      <div className="md-app-bar sticky top-0 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 rounded-full hover:bg-[var(--md-surface-variant)]"
        >
          <ArrowLeft className="w-6 h-6 text-[var(--md-on-surface)]" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[var(--md-on-surface)]">{currentUser.name}</h1>
          <p className="text-sm text-[var(--md-on-surface-variant)]">{userPosts.length} posts</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[var(--md-surface-variant)]"
        >
          <Settings className="w-6 h-6 text-[var(--md-on-surface)]" />
        </motion.button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Banner */}
        <div 
          className="h-32 w-full"
          style={{ background: currentUser.banner }}
        />

        {/* Profile Info */}
        <div className="px-4 pb-4">
          {/* Avatar and Actions */}
          <div className="flex justify-between items-end -mt-12 mb-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full border-4 border-[var(--md-background)]"
              />
              {currentUser.isVerified && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--md-primary)] rounded-full flex items-center justify-center border-2 border-[var(--md-background)]">
                  <svg className="w-3.5 h-3.5 text-[var(--md-on-primary)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.div>

            <div className="flex gap-2 mb-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full border border-[var(--md-outline)] hover:bg-[var(--md-surface-variant)]"
              >
                <Share2 className="w-5 h-5 text-[var(--md-on-surface)]" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFollowing(!isFollowing)}
                className={`md-button ${isFollowing ? 'md-button-outlined' : 'md-button-filled'} text-sm py-2 px-6`}
              >
                {isFollowing ? 'Following' : 'Edit Profile'}
              </motion.button>
            </div>
          </div>

          {/* Name and Handle */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[var(--md-on-surface)]">{currentUser.name}</h2>
            <p className="text-[var(--md-on-surface-variant)]">{currentUser.handle}</p>
          </div>

          {/* Bio */}
          <p className="text-[var(--md-on-surface)] mb-4 leading-relaxed">
            {currentUser.bio}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-[var(--md-on-surface-variant)] text-sm mb-4">
            {currentUser.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{currentUser.location}</span>
              </div>
            )}
            {currentUser.website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="text-[var(--md-primary)] hover:underline">
                  {currentUser.website}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {currentUser.joinedDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-4">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="hover:underline"
            >
              <span className="font-bold text-[var(--md-on-surface)]">{currentUser.following.toLocaleString()}</span>
              <span className="text-[var(--md-on-surface-variant)] ml-1">Following</span>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="hover:underline"
            >
              <span className="font-bold text-[var(--md-on-surface)]">{currentUser.followers.toLocaleString()}</span>
              <span className="text-[var(--md-on-surface-variant)] ml-1">Followers</span>
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="md-tabs sticky top-0 bg-[var(--md-background)] z-10">
          <button
            onClick={() => setActiveTab('posts')}
            className={`md-tab ${activeTab === 'posts' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-1">
              <Grid3X3 className="w-4 h-4" />
              Posts
            </div>
            {activeTab === 'posts' && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="md-tab-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('replies')}
            className={`md-tab ${activeTab === 'replies' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-1">
              <Edit3 className="w-4 h-4" />
              Replies
            </div>
            {activeTab === 'replies' && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="md-tab-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`md-tab ${activeTab === 'likes' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Likes
            </div>
            {activeTab === 'likes' && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="md-tab-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-2">
          <AnimatePresence mode="wait">
            {activeTab === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MaterialCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'replies' && (
              <motion.div
                key="replies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-[var(--md-on-surface-variant)]"
              >
                No replies yet
              </motion.div>
            )}

            {activeTab === 'likes' && (
              <motion.div
                key="likes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-[var(--md-on-surface-variant)]"
              >
                No likes yet
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
