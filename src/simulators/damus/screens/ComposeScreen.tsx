import React, { useState, useRef, useEffect } from 'react';
import type { MockUser, MockNote } from '../../../data/mock';
import { Avatar } from '../components/Avatar';

interface ComposeScreenProps {
  currentUser: MockUser | null;
  onPost: (content: string) => void;
  onCancel: () => void;
  replyTo?: MockNote | null;
}

export const ComposeScreen: React.FC<ComposeScreenProps> = ({
  currentUser,
  onPost,
  onCancel,
  replyTo,
}) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxChars = 280;
  const charCount = content.length;
  const isOverLimit = charCount > maxChars;
  const isReply = !!replyTo;

  useEffect(() => {
    // Auto-focus textarea
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!content.trim() || isOverLimit) return;
    
    setIsPosting(true);
    
    // Simulate posting delay
    setTimeout(() => {
      onPost(content.trim());
      setIsPosting(false);
      console.log('[Damus] Posted:', content);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--damus-bg)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--damus-border)]">
        <button
          onClick={onCancel}
          className="text-[var(--damus-text-secondary)] hover:text-[var(--damus-text)] font-medium"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isOverLimit || isPosting}
          className={`damus-btn ${
            content.trim() && !isOverLimit && !isPosting
              ? 'damus-btn-primary'
              : 'bg-purple-300 text-white cursor-not-allowed'
          } px-6`}
          data-tour="damus-post"
        >
          {isPosting ? (
            <svg className="w-5 h-5 damus-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            isReply ? 'Reply' : 'Post'
          )}
        </button>
      </div>

      {/* Reply Context */}
      {isReply && replyTo && (
        <div className="px-4 py-3 bg-[var(--damus-bg-secondary)] border-b border-[var(--damus-border)]">
          <p className="text-sm text-[var(--damus-text-secondary)]">
            Replying to <span className="text-purple-600 font-medium">@{replyTo.author?.username || 'user'}</span>
          </p>
          <p className="text-sm text-[var(--damus-text-tertiary)] truncate mt-1">
            {replyTo.content.slice(0, 100)}{replyTo.content.length > 100 ? '...' : ''}
          </p>
        </div>
      )}

      {/* Compose Area */}
      <div className="flex-1 flex gap-4 p-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar
            src={currentUser?.avatar}
            alt="Profile"
            size="md"
            className="damus-avatar"
          />
        </div>

        {/* Text Area */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isReply ? "Add your reply..." : "What's on your mind?"}
            className="w-full h-full min-h-[200px] resize-none border-0 focus:outline-none text-lg text-[var(--damus-text)] placeholder-[var(--damus-text-tertiary)]"
            style={{ fontFamily: 'inherit' }}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-t border-[var(--damus-border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Image Upload */}
            <button
              onClick={() => console.log('[Damus] Add image')}
              className="text-purple-600 hover:text-purple-700 p-2 -ml-2 rounded-full hover:bg-purple-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* GIF */}
            <button
              onClick={() => console.log('[Damus] Add GIF')}
              className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Emoji */}
            <button
              onClick={() => console.log('[Damus] Add emoji')}
              className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Poll */}
            <button
              onClick={() => console.log('[Damus] Add poll')}
              className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>

          {/* Character Count */}
          <div className="flex items-center gap-3">
            <div className={`text-sm ${
              isOverLimit ? 'text-red-500' : charCount > maxChars * 0.8 ? 'text-yellow-500' : 'text-[var(--damus-text-tertiary)]'
            }`}>
              {charCount}/{maxChars}
            </div>
            
            {/* Progress Circle for character limit */}
            {charCount > 0 && (
              <div className="relative w-6 h-6">
                <svg className="w-6 h-6 transform -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#E5E5EA"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke={isOverLimit ? '#FF3B30' : '#8B5CF6'}
                    strokeWidth="2"
                    strokeDasharray={`${Math.min((charCount / maxChars) * 62.8, 62.8)} 62.8`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="bg-[var(--damus-bg-secondary)] px-4 py-2 text-xs text-[var(--damus-text-tertiary)] text-center">
        Press Cmd+Enter to post
      </div>
    </div>
  );
};

export default ComposeScreen;
