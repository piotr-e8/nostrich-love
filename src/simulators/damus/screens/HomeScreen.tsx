import React, { useState, useCallback } from 'react';
import type { MockUser, MockNote } from '../../../data/mock';
import type { DamusScreen } from '../DamusSimulator';
import { NoteCard } from '../components/NoteCard';
import { Avatar } from '../components/Avatar';
import { getUserByPubkey } from '../../../data/mock';

interface HomeScreenProps {
  currentUser: MockUser | null;
  notes: MockNote[];
  users: MockUser[];
  onNavigate: (screen: DamusScreen) => void;
  onViewProfile: (user: MockUser) => void;
  onReply?: (note: MockNote) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  notes,
  users,
  onNavigate,
  onViewProfile,
  onReply,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'feed' | 'global'>('feed');

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      console.log('[Damus] Feed refreshed');
    }, 1000);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop < -50 && !refreshing) {
      handleRefresh();
    }
  };

  // Get author info for each note
  const notesWithAuthors = notes.slice(0, 20).map(note => ({
    note,
    author: getUserByPubkey(note.pubkey) || users[0],
  }));

  return (
    <div className="min-h-screen bg-white pb-24" data-tour="damus-home">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => onNavigate('profile')}
            className="w-8 h-8 rounded-full overflow-hidden"
          >
            <Avatar
              src={currentUser?.avatar}
              alt="Profile"
              size="sm"
              className="w-full h-full"
            />
          </button>
          
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveFilter('feed')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeFilter === 'feed'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveFilter('global')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeFilter === 'global'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Global
            </button>
          </div>
          
          <div className="w-8" /> {/* Spacer for balance */}
        </div>
      </div>

      {/* Pull to Refresh Indicator */}
      {refreshing && (
        <div className="flex items-center justify-center py-4">
          <svg className="w-5 h-5 text-purple-600 damus-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="ml-2 text-sm text-gray-600">Refreshing...</span>
        </div>
      )}

      {/* Feed */}
      <div 
        className="overflow-y-auto"
        onScroll={handleScroll}
        style={{ height: 'calc(100vh - 140px)' }}
      >
        {notesWithAuthors.map(({ note, author }) => (
          <NoteCard
            key={note.id}
            note={note}
            author={author}
            onViewProfile={() => onViewProfile(author)}
            onReply={() => onReply?.(note)}
          />
        ))}
        
        {/* Load More */}
        <div className="py-6 text-center">
          <button
            onClick={() => console.log('[Damus] Load more posts')}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Load more posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
