import React from 'react';
import type { MockNote, MockUser } from '../../../data/mock';
import { getUserByPubkey } from '../../../data/mock';

interface ThreadScreenProps {
  note: MockNote;
  users: MockUser[];
  onBack: () => void;
  onViewProfile: (user: MockUser) => void;
}

export const ThreadScreen: React.FC<ThreadScreenProps> = ({
  note,
  users,
  onBack,
  onViewProfile,
}) => {
  const formatTime = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const renderNote = (n: MockNote, isMain: boolean = false) => {
    const author = getUserByPubkey(n.author);
    if (!author) return null;

    return (
      <div key={n.id} className={`gossip-note ${!isMain ? 'gossip-thread-reply' : ''}`}>
        <div className="gossip-note-header">
          <img
            src={author.avatar}
            alt={author.username}
            className="gossip-note-avatar"
            onClick={() => onViewProfile(author)}
          />
          <div className="gossip-note-meta">
            <div className="gossip-note-author">
              <span className="gossip-note-name">{author.displayName}</span>
              <span className="gossip-note-handle">@{author.username}</span>
              <span className="gossip-note-time">{formatTime(n.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="gossip-note-content">{n.content}</div>
        <div className="gossip-note-actions">
          <button className="gossip-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reply
          </button>
          <button className="gossip-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {n.reposts || 0}
          </button>
          <button className="gossip-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {n.likes || 0}
          </button>
          <button className="gossip-action gossip-action-zap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {n.zaps || 0}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="gossip-thread">
      <div className="gossip-header">
        <div className="flex items-center gap-4">
          <button className="gossip-header-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h2 className="gossip-header-title">Thread</h2>
        </div>
      </div>

      <div className="gossip-thread-main gossip-content">
        {renderNote(note, true)}
        {note.replies?.map((replyId) => {
          // In a real app, we'd fetch the reply note
          return null;
        })}
      </div>
    </div>
  );
};

export default ThreadScreen;
