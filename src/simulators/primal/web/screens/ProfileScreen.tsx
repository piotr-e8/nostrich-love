import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar, MessageCircle, Heart, Repeat2, Zap } from 'lucide-react';
import { mockNotes, getUserByPubkey, getRecentNotes } from '../../../../data/mock';

interface ProfileScreenProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function ProfileScreen({ showToast }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'replies' | 'media' | 'likes'>('notes');
  const [isFollowing, setIsFollowing] = useState(false);
  const notes = getRecentNotes(10);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    showToast(isFollowing ? 'Unfollowed @nostrich' : 'Following @nostrich', 'success');
  };

  const handleLike = () => showToast('Liked!', 'success');
  const handleRepost = () => showToast('Reposted!', 'success');
  const handleZap = () => showToast('Zapped! 100 sats', 'success');
  const handleReply = () => showToast('Reply', 'info');

  return (
    <div className="min-h-full" data-tour="primal-profile">
      {/* Header */}
      <div className="primal-header">
        <div>
          <h1 className="primal-header-title">Your Name</h1>
          <p className="text-sm text-[var(--primal-on-surface-muted)]">1,234 notes</p>
        </div>
      </div>

      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]" />

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-end -mt-16 mb-4">
          <div className="primal-avatar primal-avatar-large border-4 border-[var(--primal-surface)]" />
          <motion.button
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              isFollowing 
                ? 'border border-[var(--primal-border)] text-[var(--primal-on-surface)] hover:border-red-500 hover:text-red-500' 
                : 'bg-[var(--primal-on-surface)] text-[var(--primal-background)] hover:opacity-90'
            }`}
            onClick={handleFollow}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-tour="primal-follow"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </motion.button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold">Your Name</h2>
          <p className="text-[var(--primal-on-surface-variant)]">@handle</p>
        </div>

        <p className="text-[var(--primal-on-surface)] mb-4">
          Bitcoin enthusiast ⚡ Nostr developer 🚀 Building the future of social media
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-[var(--primal-on-surface-variant)] mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-1">
            <LinkIcon className="w-4 h-4" />
            <a href="#" className="text-[#7C3AED] hover:underline">primal.net</a>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Joined March 2023</span>
          </div>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-bold text-[var(--primal-on-surface)]">1,234</span>
            <span className="text-[var(--primal-on-surface-variant)]"> Following</span>
          </div>
          <div>
            <span className="font-bold text-[var(--primal-on-surface)]">5,678</span>
            <span className="text-[var(--primal-on-surface-variant)]"> Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="primal-tabs">
        {(['notes', 'replies', 'media', 'likes'] as const).map((tab) => (
          <button
            key={tab}
            className={`primal-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'notes' && notes.map((note, index) => {
          const author = getUserByPubkey(note.pubkey);
          return (
            <motion.div
              key={note.id}
              className="primal-note"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex gap-3">
                <div className="primal-avatar primal-avatar-small flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="primal-note-author">Your Name</span>
                    <span className="primal-note-handle">@handle</span>
                    <span className="primal-note-time">· {formatTime(note.created_at)}</span>
                  </div>
                  <div className="mt-1 text-[var(--primal-on-surface)] whitespace-pre-wrap">
                    {note.content}
                  </div>
                  
                  <div className="flex justify-between mt-3 max-w-md">
                    <motion.button className="primal-action-btn group" onClick={handleReply}>
                      <MessageCircle className="group-hover:text-blue-500" />
                      <span>{note.replies || ''}</span>
                    </motion.button>
                    <motion.button className="primal-action-btn group" onClick={handleRepost}>
                      <Repeat2 className="group-hover:text-green-500" />
                      <span>{note.reposts || ''}</span>
                    </motion.button>
                    <motion.button className="primal-action-btn group" onClick={handleLike}>
                      <Heart className="group-hover:text-red-500" />
                      <span>{note.likes || ''}</span>
                    </motion.button>
                    <motion.button className="primal-action-btn group" onClick={handleZap}>
                      <Zap className="group-hover:text-yellow-500" />
                      <span>{note.zaps || ''}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {activeTab !== 'notes' && (
          <div className="p-8 text-center text-[var(--primal-on-surface-muted)]">
            <p>No {activeTab} yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(timestamp * 1000).toLocaleDateString();
}

export default ProfileScreen;
