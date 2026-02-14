/**
 * Snort Thread Screen
 * Thread tree visualization with nested replies
 */

import React, { useState, useMemo } from 'react';
import { ThreadTree } from '../components/ThreadTree';
import { NoteCard } from '../components/NoteCard';
import type { MockUser, MockNote, MockThread } from '../../../data/mock';

interface ThreadScreenProps {
  thread: MockThread | null;
  rootNote: MockNote | null;
  currentUser: MockUser | null;
  users: MockUser[];
  onBack: () => void;
  onViewProfile: (user: MockUser) => void;
  onReply: (parentId: string, content: string) => void;
}

export const ThreadScreen: React.FC<ThreadScreenProps> = ({
  thread,
  rootNote,
  currentUser,
  users,
  onBack,
  onViewProfile,
  onReply,
}) => {
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Create user lookup map
  const userMap = useMemo(() => {
    const map = new Map<string, MockUser>();
    users.forEach(u => map.set(u.pubkey, u));
    return map;
  }, [users]);

  const rootAuthor = rootNote ? userMap.get(rootNote.pubkey) : null;

  const handleSubmitReply = () => {
    if (replyContent.trim() && rootNote) {
      onReply(replyingTo || rootNote.id, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  if (!rootNote) {
    return (
      <div className="flex flex-col h-full">
        <div className="snort-header">
          <button onClick={onBack} className="snort-btn snort-btn-ghost snort-btn-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        <div className="snort-empty flex-1">
          <svg className="snort-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>Thread not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="snort-header">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="snort-btn snort-btn-ghost snort-btn-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="snort-header-title">Thread</h1>
        </div>
        <div className="snort-header-actions">
          <button className="snort-btn snort-btn-ghost snort-btn-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Thread Content */}
      <div className="snort-content flex-1">
        {/* Root Note */}
        {rootAuthor && (
          <div className="mb-6">
            <NoteCard
              note={rootNote}
              author={rootAuthor}
              onViewProfile={() => onViewProfile(rootAuthor)}
              showReplyLine={true}
            />
          </div>
        )}

        {/* Reply Input */}
        <div className="snort-compose mb-6">
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
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Post your reply..."
                className="snort-compose-textarea"
                rows={3}
              />
              <div className="snort-compose-actions">
                <div className="snort-compose-tools">
                  <button className="snort-compose-tool" title="Add image">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="snort-compose-tool" title="Add code">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{280 - replyContent.length}</span>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim()}
                    className="snort-btn snort-btn-primary snort-btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thread Replies */}
        <div className="snort-thread">
          {thread && thread.notes.length > 1 ? (
            <ThreadTree
              notes={thread.notes.slice(1)}
              rootNoteId={rootNote.id}
              users={users}
              onViewProfile={onViewProfile}
              onReply={(noteId) => setReplyingTo(noteId)}
            />
          ) : (
            <div className="snort-empty">
              <svg className="snort-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>No replies yet</p>
              <p className="text-sm text-slate-500 mt-1">Be the first to reply!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadScreen;
