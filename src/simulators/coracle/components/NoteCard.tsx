import React, { useState } from 'react';
import type { MockNote, MockUser } from '../../../data/mock';

interface NoteCardProps {
  note: MockNote;
  author: MockUser;
  onViewProfile: (user: MockUser) => void;
  onLike?: () => void;
  onRepost?: () => void;
  onZap?: (amount: number) => void;
  onReply?: () => void;
  isLiked?: boolean;
  isReposted?: boolean;
  zapAmount?: number;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  author,
  onViewProfile,
  onLike,
  onRepost,
  onZap,
  onReply,
  isLiked = false,
  isReposted = false,
  zapAmount = 0,
}) => {
  const [showZapModal, setShowZapModal] = useState(false);
  const [zapInputAmount, setZapInputAmount] = useState(100);
  const [expanded, setExpanded] = useState(false);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handleZap = () => {
    if (onZap) {
      onZap(zapInputAmount);
      setShowZapModal(false);
    }
  };

  return (
    <>
      <article className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewProfile(author)}
              className="flex-shrink-0"
            >
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${author.pubkey || author.username || 'default'}`}
                alt={author.displayName}
                className="w-10 h-10 rounded-full bg-gray-100 object-cover hover:ring-2 hover:ring-indigo-300 transition-all"
              />
            </button>
            <div className="min-w-0">
              <button
                onClick={() => onViewProfile(author)}
                className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors truncate block"
              >
                {author.displayName}
              </button>
              <p className="text-sm text-gray-500 truncate">@{author.username}</p>
            </div>
          </div>
          <span className="text-sm text-gray-400 flex-shrink-0">
            {formatTime(note.created_at)}
          </span>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className={`text-gray-800 whitespace-pre-wrap ${expanded ? '' : 'line-clamp-6'}`}>
            {note.content}
          </p>
          {note.content.length > 300 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-indigo-600 text-sm font-medium mt-2 hover:underline"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Images */}
        {note.images && note.images.length > 0 && (
          <div className="mb-4 rounded-xl overflow-hidden">
            {note.images.length === 1 ? (
              <img
                src={note.images[0]}
                alt="Note attachment"
                className="w-full max-h-96 object-cover"
              />
            ) : (
              <div className={`grid gap-2 ${note.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                {note.images.slice(0, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Note attachment ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Reply */}
          <button
            onClick={onReply}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
            title="Reply"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">{formatNumber(note.replies)}</span>
          </button>

          {/* Repost */}
          <button
            onClick={onRepost}
            className={`flex items-center gap-2 transition-colors ${
              isReposted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
            }`}
            title="Repost"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm">{formatNumber(note.reposts + (isReposted ? 1 : 0))}</span>
          </button>

          {/* Like */}
          <button
            onClick={onLike}
            className={`flex items-center gap-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
            title="Like"
          >
            <svg 
              className="w-5 h-5" 
              fill={isLiked ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">{formatNumber(note.likes + (isLiked ? 1 : 0))}</span>
          </button>

          {/* Zap */}
          <button
            onClick={() => setShowZapModal(true)}
            className={`flex items-center gap-2 transition-colors ${
              (zapAmount || note.zapAmount) > 0 ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'
            }`}
            title="Zap (Send Sats)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm">
              {formatNumber((note.zapAmount || 0) + zapAmount)}
            </span>
          </button>

          {/* Share */}
          <button
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
            title="Share"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* Zap Amount Indicator */}
        {zapAmount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-orange-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              You zapped this note with {zapAmount} sats!
            </p>
          </div>
        )}
      </article>

      {/* Zap Modal */}
      {showZapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Zap {author.displayName}</h3>
              <p className="text-sm text-gray-500 mt-1">Send Bitcoin sats to support this note</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (sats)</label>
              <input
                type="number"
                value={zapInputAmount}
                onChange={(e) => setZapInputAmount(parseInt(e.target.value) || 0)}
                className="coracle-input text-center text-2xl font-bold"
                min="1"
              />
              <div className="flex gap-2 mt-3">
                {[100, 500, 1000, 5000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setZapInputAmount(amount)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      zapInputAmount === amount
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowZapModal(false)}
                className="coracle-btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleZap}
                className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Zap!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
