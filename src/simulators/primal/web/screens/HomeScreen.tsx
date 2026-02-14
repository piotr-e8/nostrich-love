import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { getUserByPubkey, getRecentNotes } from '../../../../data/mock';
import { NoteCard } from '../components/NoteCard';

interface HomeScreenProps {
  onNewPost: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function HomeScreen({ onNewPost, showToast }: HomeScreenProps) {
  const [activeTab, setActiveTab] = React.useState<'for-you' | 'following'>('for-you');
  const notes = getRecentNotes(15);

  const handleLike = (id: string) => {
    showToast('Liked! ❤️', 'success');
  };

  const handleRepost = (id: string) => {
    showToast('Reposted! 🔄', 'success');
  };

  const handleZap = (id: string) => {
    showToast('Zapped! ⚡ 100 sats', 'success');
  };

  const handleReply = (id: string) => {
    onNewPost();
  };

  return (
    <div className="min-h-full" data-tour="primal-feed">
      {/* Header */}
      <div className="primal-header">
        <h1 className="primal-header-title">Home</h1>
      </div>

      {/* Tabs */}
      <div className="primal-tabs">
        <button
          className={`primal-tab ${activeTab === 'for-you' ? 'active' : ''}`}
          onClick={() => setActiveTab('for-you')}
        >
          For you
        </button>
        <button
          className={`primal-tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>

      {/* Compose Box */}
      <div className="primal-compose border-b border-[var(--primal-border)]" data-tour="primal-compose">
        <div className="flex gap-4">
          <div className="primal-avatar primal-avatar-small" />
          <div className="flex-1">
            <textarea
              placeholder="What is happening?!"
              className="primal-compose-input"
              onClick={onNewPost}
              readOnly
            />
          </div>
        </div>
        <div className="primal-compose-actions">
          <div className="primal-compose-tools">
            <div className="primal-compose-tool">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="primal-compose-tool">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="primal-compose-tool">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="primal-compose-tool">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <motion.button
            className="primal-btn-primary w-auto px-6"
            onClick={onNewPost}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Post
          </motion.button>
        </div>
      </div>

      {/* Feed */}
      <div>
        {notes.map((note, index) => {
          const author = getUserByPubkey(note.pubkey);
          if (!author) return null;
          return (
            <NoteCard
              key={note.id}
              note={note}
              author={author}
              index={index}
              onReply={() => handleReply(note.id)}
              onRepost={() => handleRepost(note.id)}
              onLike={() => handleLike(note.id)}
              onZap={() => handleZap(note.id)}
            />
          );
        })}
      </div>

      {/* Loading indicator */}
      <div className="p-8 text-center text-[var(--primal-on-surface-muted)]">
        <div className="primal-spinner mx-auto mb-4" />
        Loading more notes...
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
