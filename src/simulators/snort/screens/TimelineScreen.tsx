/**
 * Snort Timeline Screen
 * Main feed with filters and note display
 */

import React, { useState, useCallback, useMemo } from 'react';
import { NoteCard } from '../components/NoteCard';
import type { MockUser, MockNote } from '../../../data/mock';
import type { SnortScreen } from '../SnortSimulator';

interface TimelineScreenProps {
  currentUser: MockUser | null;
  notes: MockNote[];
  users: MockUser[];
  onNavigate: (screen: SnortScreen) => void;
  onViewProfile: (user: MockUser) => void;
  onViewThread: (note: MockNote) => void;
  onOpenCompose: () => void;
}

type FeedFilter = 'following' | 'global' | 'trending';

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  currentUser,
  notes,
  users,
  onViewProfile,
  onViewThread,
  onOpenCompose,
}) => {
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('following');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('[Snort] Feed refreshed');
    }, 1000);
  }, []);

  // Create user lookup map for performance
  const userMap = useMemo(() => {
    const map = new Map<string, MockUser>();
    users.forEach(user => map.set(user.pubkey, user));
    return map;
  }, [users]);

  // Get notes with authors
  const notesWithAuthors = useMemo(() => {
    return notes.slice(0, 25).map(note => ({
      note,
      author: userMap.get(note.pubkey),
    })).filter(item => item.author); // Only include notes with valid authors
  }, [notes, userMap]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="snort-header">
        <h1 className="snort-header-title">Timeline</h1>
        <div className="snort-header-actions">
          <button
            onClick={handleRefresh}
            className="snort-btn snort-btn-ghost snort-btn-sm"
            disabled={isRefreshing}
          >
            <svg 
              className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={onOpenCompose}
            className="snort-btn snort-btn-primary snort-btn-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="snort-tabs">
        {(['following', 'global', 'trending'] as FeedFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`snort-tab ${activeFilter === filter ? 'active' : ''}`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Quick Compose */}
      <div className="p-4 border-b border-slate-700">
        <div className="snort-compose">
          <div className="flex gap-3">
            {currentUser && (
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <button
                onClick={onOpenCompose}
                className="w-full text-left px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-500 hover:border-teal-500/50 hover:text-slate-400 transition-colors"
              >
                What's on your mind?
              </button>
              <div className="snort-compose-actions mt-3">
                <div className="snort-compose-tools">
                  <button className="snort-compose-tool" title="Add image">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="snort-compose-tool" title="Add code">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                  <button className="snort-compose-tool" title="Add poll">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={onOpenCompose}
                  className="snort-btn snort-btn-primary snort-btn-sm"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="snort-content flex-1">
        {isRefreshing && (
          <div className="snort-loading">
            <div className="snort-loading-spinner mr-3" />
            <span>Refreshing feed...</span>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="snort-empty">
            <svg className="snort-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Loading timeline...</p>
          </div>
        ) : (
          <>
            {notesWithAuthors.map(({ note, author }) => (
              author && (
                <NoteCard
                  key={note.id}
                  note={note}
                  author={author}
                  onViewProfile={() => onViewProfile(author)}
                  onViewThread={() => onViewThread(note)}
                />
              )
            ))}

            {/* Load More */}
            <div className="py-6 text-center">
              <button
                onClick={() => console.log('[Snort] Load more')}
                className="snort-btn snort-btn-secondary"
              >
                Load more posts
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TimelineScreen;
