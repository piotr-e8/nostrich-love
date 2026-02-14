/**
 * Snort Compose Screen
 * Rich text editor for creating posts
 */

import React, { useState, useRef, useEffect } from 'react';
import type { MockUser } from '../../../data/mock';

interface ComposeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string) => void;
  currentUser: MockUser | null;
  replyTo?: { author: string; content: string } | null;
}

export const ComposeScreen: React.FC<ComposeScreenProps> = ({
  isOpen,
  onClose,
  onPost,
  currentUser,
  replyTo,
}) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxChars = 280;
  const remainingChars = maxChars - content.length;
  const isOverLimit = remainingChars < 0;

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!content.trim() || isOverLimit) return;

    setIsPosting(true);
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onPost(content);
    setContent('');
    setIsPosting(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="snort-modal-overlay" onClick={onClose}>
      <div 
        className="snort-modal max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="snort-modal-header">
          <h2 className="snort-modal-title">
            {replyTo ? 'Reply' : 'New Post'}
          </h2>
          <button
            onClick={onClose}
            className="snort-modal-close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="snort-modal-content">
          {/* Reply Reference */}
          {replyTo && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border-l-2 border-teal-500">
              <p className="text-sm text-slate-400">Replying to @{replyTo.author}</p>
              <p className="text-sm text-slate-300 mt-1 line-clamp-2">{replyTo.content}</p>
            </div>
          )}

          <div className="flex gap-3">
            {currentUser && (
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.pubkey || currentUser?.username || 'default'}`}
                alt={currentUser.displayName}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={replyTo ? "Post your reply..." : "What's on your mind?"}
                className="w-full min-h-[160px] bg-transparent border-none resize-none text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-lg"
                disabled={isPosting}
              />
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 mt-4 pt-4 border-t border-slate-700">
            <button
              onClick={() => insertMarkdown('**', '**')}
              className="snort-compose-tool"
              title="Bold"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6V4zm0 8h9a4 4 0 014 4 4 4 0 01-4 4H6v-8z" />
              </svg>
            </button>
            <button
              onClick={() => insertMarkdown('*', '*')}
              className="snort-compose-tool"
              title="Italic"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <button
              onClick={() => insertMarkdown('`', '`')}
              className="snort-compose-tool"
              title="Inline Code"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <button
              onClick={() => insertMarkdown('\n```\n', '\n```\n')}
              className="snort-compose-tool"
              title="Code Block"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => insertMarkdown('[', '](url)')}
              className="snort-compose-tool"
              title="Link"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            <div className="w-px h-6 bg-slate-700 mx-2" />
            <button
              className="snort-compose-tool"
              title="Add Image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              className="snort-compose-tool"
              title="Add Poll"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <kbd className="snort-kbd">Ctrl</kbd>
            <span>+</span>
            <kbd className="snort-kbd">Enter</kbd>
            <span>to post</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${isOverLimit ? 'text-red-400' : remainingChars < 20 ? 'text-amber-400' : 'text-slate-400'}`}>
              {remainingChars}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isOverLimit || isPosting}
              className="snort-btn snort-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? (
                <>
                  <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Posting...
                </>
              ) : (
                replyTo ? 'Reply' : 'Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeScreen;
