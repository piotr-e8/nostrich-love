import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar, MessageCircle, Heart, Repeat2, Zap, Settings, ChevronRight } from 'lucide-react';
import { mockNotes, getRecentNotes } from '../../../../data/mock';

interface ProfileScreenProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function ProfileScreen({ showToast }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'replies' | 'media' | 'likes'>('notes');
  const [isFollowing, setIsFollowing] = useState(false);
  const notes = getRecentNotes(5);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    showToast(isFollowing ? 'Unfollowed' : 'Now following', 'success');
  };

  return (
    <div className="min-h-full pb-20">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]" />

      {/* Profile Info */}
      <div className="px-4 -mt-12">
        <div className="flex justify-between items-end mb-3">
          <div className="primal-avatar-mobile-large border-4 border-[var(--primal-mobile-background)]" />
          <div className="flex gap-2 mb-2">
            <motion.button
              className="p-2 rounded-full border border-[var(--primal-mobile-border)]"
              whileTap={{ scale: 0.9 }}
              onClick={() => showToast('Settings', 'info')}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              className={`px-6 py-2 rounded-full font-bold ${
                isFollowing 
                  ? 'border border-[var(--primal-mobile-border)]' 
                  : 'bg-[var(--primal-mobile-on-surface)] text-[var(--primal-mobile-background)]'
              }`}
              onClick={handleFollow}
              whileTap={{ scale: 0.95 }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </motion.button>
          </div>
        </div>

        <div className="primal-profile-info-mobile">
          <div>
            <h2 className="primal-profile-name-mobile">Your Name</h2>
            <p className="primal-profile-handle-mobile">@handle</p>
          </div>

          <p className="primal-profile-bio-mobile">
            Bitcoin enthusiast ⚡ Nostr developer 🚀 Building the decentralized future
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-[var(--primal-mobile-on-surface-variant)]">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>San Francisco</span>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon className="w-4 h-4" />
              <span>primal.net</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined March 2023</span>
            </div>
          </div>

          <div className="primal-profile-stats-mobile">
            <div className="primal-profile-stat-mobile">
              <span className="primal-profile-stat-value">1,234</span>
              <span className="primal-profile-stat-label"> Following</span>
            </div>
            <div className="primal-profile-stat-mobile">
              <span className="primal-profile-stat-value">5,678</span>
              <span className="primal-profile-stat-label"> Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="primal-tab-pills border-b border-[var(--primal-mobile-border)] mt-4">
        {(['notes', 'replies', 'media', 'likes'] as const).map((tab) => (
          <button
            key={tab}
            className={`primal-tab-pill ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'notes' && notes.map((note, index) => (
          <motion.div
            key={note.id}
            className="primal-mobile-note"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="primal-note-header-mobile">
              <div className="primal-avatar-mobile flex-shrink-0" />
              <div className="primal-note-author-info">
                <div className="primal-note-author-row">
                  <span className="primal-note-author-name">Your Name</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="primal-note-author-handle">@handle</span>
                  <span className="primal-note-time-mobile">· {formatTime(note.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="primal-note-content-mobile">{note.content}</div>
            <div className="primal-actions-mobile">
              <motion.button className="primal-action-btn-mobile" whileTap={{ scale: 0.9 }}>
                <MessageCircle />
              </motion.button>
              <motion.button className="primal-action-btn-mobile" whileTap={{ scale: 0.9 }}>
                <Repeat2 />
              </motion.button>
              <motion.button className="primal-action-btn-mobile" whileTap={{ scale: 0.9 }}>
                <Heart />
              </motion.button>
              <motion.button className="primal-action-btn-mobile" whileTap={{ scale: 0.9 }}>
                <Zap />
              </motion.button>
            </div>
          </motion.div>
        ))}

        {activeTab !== 'notes' && (
          <div className="p-8 text-center text-[var(--primal-mobile-on-surface-muted)]">
            <p>No {activeTab} yet</p>
          </div>
        )}
      </div>

      {/* Settings Links */}
      <div className="mt-4 border-t border-[var(--primal-mobile-border)]">
        {['Account', 'Privacy', 'Notifications', 'Relays'].map((item) => (
          <motion.button
            key={item}
            className="w-full px-4 py-4 flex items-center justify-between border-b border-[var(--primal-mobile-border)]"
            whileTap={{ scale: 0.98 }}
            onClick={() => showToast(`${item} settings`, 'info')}
          >
            <span>{item}</span>
            <ChevronRight className="w-5 h-5 text-[var(--primal-mobile-on-surface-muted)]" />
          </motion.button>
        ))}
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
