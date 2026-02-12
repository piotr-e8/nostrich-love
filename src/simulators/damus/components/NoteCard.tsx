import React, { useState } from 'react';
import type { MockNote, MockUser } from '../../../data/mock';
import { Avatar } from './Avatar';

interface NoteCardProps {
  note: MockNote;
  author: MockUser;
  onViewProfile: () => void;
  onReply?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, author, onViewProfile, onReply }) => {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [zapped, setZapped] = useState(false);
  const [likeCount, setLikeCount] = useState(note.likes);
  const [repostCount, setRepostCount] = useState(note.reposts);
  const [zapCount, setZapCount] = useState(note.zaps);
  const [showFullContent, setShowFullContent] = useState(false);

  const formatTime = (timestamp: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    console.log(`[Damus] ${liked ? 'Unliked' : 'Liked'} note ${note.id.slice(0, 8)}`);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setRepostCount(prev => reposted ? prev - 1 : prev + 1);
    console.log(`[Damus] ${reposted ? 'Unreposted' : 'Reposted'} note ${note.id.slice(0, 8)}`);
  };

  const handleZap = () => {
    setZapped(!zapped);
    setZapCount(prev => zapped ? prev - 1 : prev + 1);
    console.log(`[Damus] Zapped note ${note.id.slice(0, 8)}`);
  };

  const handleReply = () => {
    console.log(`[Damus] Reply to note ${note.id.slice(0, 8)}`);
    onReply?.();
  };

  const handleShare = () => {
    console.log(`[Damus] Share note ${note.id.slice(0, 8)}`);
  };

  // Truncate long content
  const content = note.content;
  const shouldTruncate = content.length > 280 && !showFullContent;
  const displayContent = shouldTruncate ? content.slice(0, 280) + '...' : content;

  return (
    <article className="damus-card-flat py-4 px-4">
      {/* Repost indicator */}
      {note.isRepost && note.repostedBy && (
        <div className="flex items-center gap-2 mb-2 ml-12 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reposted</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <button
          onClick={onViewProfile}
          className="flex-shrink-0"
        >
          <Avatar
            src={author.avatar}
            alt={author.displayName}
            size="md"
            className="damus-avatar"
          />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onViewProfile}
              className="font-semibold text-gray-900 hover:underline truncate"
            >
              {author.displayName}
            </button>
            {author.nip05 && (
              <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-gray-500 truncate">@{author.username}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 text-sm flex-shrink-0">{formatTime(note.created_at)}</span>
          </div>

          {/* Content */}
          <div className="text-gray-900 mb-3 whitespace-pre-wrap">
            {displayContent}
            {shouldTruncate && (
              <button
                onClick={() => setShowFullContent(true)}
                className="text-purple-600 hover:underline ml-1"
              >
                Show more
              </button>
            )}
          </div>

          {/* Images */}
          {note.images && note.images.length > 0 && (
            <div className={`grid gap-1 mb-3 rounded-xl overflow-hidden ${
              note.images.length === 1 ? 'grid-cols-1' : 
              note.images.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2'
            }`}>
              {note.images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Attachment ${idx + 1}`}
                  className={`w-full object-cover ${
                    note.images!.length === 1 ? 'h-64' : 'h-32'
                  }`}
                  onClick={() => console.log(`[Damus] View image ${idx + 1}`)}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between max-w-md" data-tour="damus-interactions">
            <button
              onClick={handleReply}
              className="damus-action-btn"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {note.replies > 0 && <span>{note.replies}</span>}
            </button>

            <button
              onClick={handleRepost}
              className={`damus-action-btn ${reposted ? 'active' : ''}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {repostCount > 0 && <span>{repostCount}</span>}
            </button>

            <button
              onClick={handleLike}
              className={`damus-action-btn ${liked ? 'active' : ''}`}
            >
              <svg fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            <button
              onClick={handleZap}
              className={`damus-action-btn ${zapped ? 'active' : ''}`}
            >
              <svg fill={zapped ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {zapCount > 0 && <span>{zapCount}</span>}
            </button>

            <button
              onClick={handleShare}
              className="damus-action-btn"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;
