import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Repeat2, Heart, Zap, Settings } from 'lucide-react';
import { mockNotes, getUserByPubkey, getRecentNotes } from '../../../../data/mock';

interface HomeScreenProps {
  onNewPost: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function HomeScreen({ onNewPost, showToast }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const notes = getRecentNotes(10);

  const handleLike = () => showToast('Liked!', 'success');
  const handleRepost = () => showToast('Reposted!', 'success');
  const handleZap = () => showToast('Zapped! 100 sats', 'success');

  return (
    <div className="min-h-full pb-20">
      {/* Header */}
      <div className="primal-mobile-header">
        <div className="primal-avatar-mobile-small" />
        <h1 className="primal-mobile-header-title">Home</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => showToast('Settings', 'info')}
        >
          <Settings className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Tab Pills */}
      <div className="primal-tab-pills border-b border-[var(--primal-mobile-border)]">
        <button
          className={`primal-tab-pill ${activeTab === 'for-you' ? 'active' : ''}`}
          onClick={() => setActiveTab('for-you')}
        >
          For You
        </button>
        <button
          className={`primal-tab-pill ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>

      {/* Feed */}
      <div>
        {notes.map((note, index) => {
          const author = getUserByPubkey(note.pubkey);
          return (
            <motion.div
              key={note.id}
              className="primal-mobile-note"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="primal-note-header-mobile">
                <div className="primal-avatar-mobile flex-shrink-0" />
                <div className="primal-note-author-info">
                  <div className="primal-note-author-row">
                    <span className="primal-note-author-name truncate">{author?.displayName || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="primal-note-author-handle">@{author?.username || 'unknown'}</span>
                    <span className="primal-note-time-mobile">· {formatTime(note.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="primal-note-content-mobile">
                {note.content}
              </div>

              {/* Actions */}
              <div className="primal-actions-mobile">
                <motion.button 
                  className="primal-action-btn-mobile"
                  onClick={() => onNewPost()}
                  whileTap={{ scale: 0.9 }}
                >
                  <MessageCircle />
                  {note.replies > 0 && <span>{note.replies}</span>}
                </motion.button>
                <motion.button 
                  className="primal-action-btn-mobile"
                  onClick={handleRepost}
                  whileTap={{ scale: 0.9 }}
                >
                  <Repeat2 />
                  {note.reposts > 0 && <span>{note.reposts}</span>}
                </motion.button>
                <motion.button 
                  className="primal-action-btn-mobile"
                  onClick={handleLike}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart />
                  {note.likes > 0 && <span>{note.likes}</span>}
                </motion.button>
                <motion.button 
                  className="primal-action-btn-mobile"
                  onClick={handleZap}
                  whileTap={{ scale: 0.9 }}
                >
                  <Zap />
                  {note.zaps > 0 && <span>{note.zaps}</span>}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Loading */}
      <div className="p-8 text-center text-[var(--primal-mobile-on-surface-muted)]">
        <div className="primal-skeleton w-6 h-6 rounded-full mx-auto mb-2" />
        <p className="text-sm">Loading more...</p>
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

export default HomeScreen;
