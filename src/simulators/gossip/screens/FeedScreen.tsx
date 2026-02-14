import React from 'react';
import type { MockNote, MockUser } from '../../../data/mock';
import { getUserByPubkey } from '../../../data/mock';

interface FeedScreenProps {
  notes: MockNote[];
  users: MockUser[];
  onOpenThread: (note: MockNote) => void;
  onViewProfile: (user: MockUser) => void;
  onCompose: () => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({
  notes,
  users,
  onOpenThread,
  onViewProfile,
  onCompose,
}) => {
  const formatTime = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="gossip-feed">
      <div className="gossip-header">
        <h2 className="gossip-header-title">Feed</h2>
        <div className="gossip-header-actions">
          <button className="gossip-header-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Filter
          </button>
          <button className="gossip-header-btn" onClick={onCompose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New
          </button>
        </div>
      </div>

      <div className="gossip-content">
        {notes.length === 0 ? (
          <div className="gossip-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 mb-4 opacity-50">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="gossip-empty-text">No notes to display</p>
            <p className="gossip-empty-subtext">Be the first to post!</p>
          </div>
        ) : (
          notes.map((note) => {
          const author = getUserByPubkey(note.pubkey);
          if (!author) return null;

          return (
            <div
              key={note.id}
              className="gossip-note"
              onClick={() => onOpenThread(note)}
            >
              <div className="gossip-note-header">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${author.pubkey || author.username || 'default'}`}
                  alt={author.username}
                  className="gossip-note-avatar"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewProfile(author);
                  }}
                />
                <div className="gossip-note-meta">
                  <div className="gossip-note-author">
                    <span className="gossip-note-name">{author.displayName}</span>
                    <span className="gossip-note-handle">@{author.username}</span>
                    <span className="gossip-note-time">{formatTime(note.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="gossip-note-content">{note.content}</div>
              <div className="gossip-note-actions">
                <button className="gossip-action" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {note.replies?.length || 0}
                </button>
                <button className="gossip-action" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {note.reposts || 0}
                </button>
                <button className="gossip-action" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {note.likes || 0}
                </button>
                <button className="gossip-action gossip-action-zap" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {note.zaps || 0}
                </button>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
};

export default FeedScreen;
