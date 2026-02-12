/**
 * Snort Note Card Component
 * Individual note display with actions
 */

import React, { useState } from 'react';
import { MediaEmbed } from './MediaEmbed';
import { CodeBlock } from './CodeBlock';
import type { MockUser, MockNote } from '../../../data/mock';

interface NoteCardProps {
  note: MockNote;
  author: MockUser;
  onViewProfile: () => void;
  onViewThread?: () => void;
  showReplyLine?: boolean;
  compact?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  author,
  onViewProfile,
  onViewThread,
  showReplyLine = false,
  compact = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [zapOpen, setZapOpen] = useState(false);
  const [likes, setLikes] = useState(note.likes);
  const [reposts, setReposts] = useState(note.reposts);
  const [zaps, setZaps] = useState(note.zaps);
  const [zapAmount, setZapAmount] = useState(note.zapAmount);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLike = () => {
    if (liked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const handleRepost = () => {
    if (reposted) {
      setReposts(prev => prev - 1);
    } else {
      setReposts(prev => prev + 1);
    }
    setReposted(!reposted);
  };

  const handleZap = (amount: number) => {
    setZaps(prev => prev + 1);
    setZapAmount(prev => prev + amount);
    setZapOpen(false);
    console.log(`[Snort] Zapped ${amount} sats`);
  };

  // Parse content for code blocks and media
  const renderContent = () => {
    const parts: React.ReactNode[] = [];
    let content = note.content;

    // Check for code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let lastIndex = 0;

    while ((match = codeBlockRegex.exec(note.content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={lastIndex} className="mb-2">
            {renderTextWithLinks(note.content.substring(lastIndex, match.index))}
          </p>
        );
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push(
        <CodeBlock key={match.index} code={code} language={language} />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < note.content.length) {
      parts.push(
        <p key={lastIndex}>
          {renderTextWithLinks(note.content.substring(lastIndex))}
        </p>
      );
    }

    // If no code blocks found, just render the text
    if (parts.length === 0) {
      parts.push(<p key="text">{renderTextWithLinks(note.content)}</p>);
    }

    return parts;
  };

  const renderTextWithLinks = (text: string) => {
    // Replace URLs with links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const nostrRegex = /(nostr:npub[\w]+|nostr:nevent[\w]+|nostr:note[\w]+)/g;
    const hashtagRegex = /#[\w]+/g;

    let parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Combine all regex matches
    const matches: Array<{ type: string; index: number; length: number; content: string }> = [];
    
    let m;
    while ((m = urlRegex.exec(text)) !== null) {
      matches.push({ type: 'url', index: m.index, length: m[0].length, content: m[0] });
    }
    while ((m = nostrRegex.exec(text)) !== null) {
      matches.push({ type: 'nostr', index: m.index, length: m[0].length, content: m[0] });
    }
    while ((m = hashtagRegex.exec(text)) !== null) {
      matches.push({ type: 'hashtag', index: m.index, length: m[0].length, content: m[0] });
    }

    // Sort by index
    matches.sort((a, b) => a.index - b.index);

    for (const match of matches) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add styled match
      if (match.type === 'url') {
        parts.push(
          <a
            key={match.index}
            href={match.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {match.content}
          </a>
        );
      } else if (match.type === 'nostr') {
        parts.push(
          <span
            key={match.index}
            className="text-teal-400 font-mono cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              console.log('[Snort] Open:', match.content);
            }}
          >
            {match.content.substring(0, 20)}...
          </span>
        );
      } else if (match.type === 'hashtag') {
        parts.push(
          <span
            key={match.index}
            className="text-teal-400 cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              console.log('[Snort] Search hashtag:', match.content);
            }}
          >
            {match.content}
          </span>
        );
      }

      lastIndex = match.index + match.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      <div 
        className={`snort-note ${compact ? 'p-3' : ''}`}
        onClick={onViewThread}
        style={{ cursor: onViewThread ? 'pointer' : 'default' }}
      >
        {/* Reply Line */}
        {showReplyLine && <div className="snort-thread-line" />}

        {/* Header */}
        <div className="snort-note-header">
          <img
            src={author.avatar}
            alt={author.displayName}
            className="snort-note-avatar"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile();
            }}
          />
          <div className="snort-note-meta">
            <div className="snort-note-author">
              <span 
                className="hover:underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile();
                }}
              >
                {author.displayName}
              </span>
              {author.isVerified && (
                <span className="snort-verified">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <div className="snort-note-username">
              @{author.username} · <span className="snort-note-time">{formatTime(note.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="snort-note-content">
          {renderContent()}
        </div>

        {/* Media */}
        {note.images && note.images.length > 0 && (
          <MediaEmbed images={note.images} />
        )}

        {/* Actions */}
        <div className="snort-note-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewThread?.();
            }}
            className="snort-action-btn"
            title="Reply"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{note.replies > 0 ? note.replies : ''}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRepost();
            }}
            className={`snort-action-btn ${reposted ? 'reposted' : ''}`}
            title="Repost"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{reposts > 0 ? reposts : ''}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`snort-action-btn ${liked ? 'liked' : ''}`}
            title="Like"
          >
            <svg fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likes > 0 ? likes : ''}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setZapOpen(true);
            }}
            className="snort-action-btn"
            title="Zap"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{zapAmount > 0 ? (zapAmount / 1000).toFixed(1) + 'k' : ''}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('[Snort] Share:', note.id);
            }}
            className="snort-action-btn ml-auto"
            title="Share"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Zap Modal */}
      {zapOpen && (
        <div 
          className="snort-modal-overlay"
          onClick={() => setZapOpen(false)}
        >
          <div 
            className="snort-modal max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="snort-modal-header">
              <h2 className="snort-modal-title">Send Zap</h2>
              <button
                onClick={() => setZapOpen(false)}
                className="snort-modal-close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="snort-modal-content">
              <p className="text-sm text-slate-400 mb-4">Choose amount to zap:</p>
              <div className="snort-zap-amounts">
                {[100, 500, 1000, 5000, 10000, 50000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleZap(amount)}
                    className="snort-zap-amount"
                  >
                    <div className="snort-zap-amount-value">{amount >= 1000 ? (amount / 1000) + 'k' : amount}</div>
                    <div className="snort-zap-amount-sats">sats</div>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Custom amount..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const amount = parseInt((e.target as HTMLInputElement).value);
                      if (amount > 0) handleZap(amount);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
