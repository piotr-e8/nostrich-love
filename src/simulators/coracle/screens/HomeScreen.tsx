import React from 'react';
import type { MockUser, MockNote } from '../../../data/mock';
import { NoteCard } from '../components/NoteCard';
import type { CoracleScreen } from '../CoracleSimulator';

interface HomeScreenProps {
  currentUser: MockUser | null;
  notes: MockNote[];
  users: MockUser[];
  following: string[];
  likedNotes: string[];
  repostedNotes: string[];
  zappedNotes: { [noteId: string]: number };
  onNavigate: (screen: CoracleScreen) => void;
  onViewProfile: (user: MockUser) => void;
  onLike: (noteId: string) => void;
  onRepost: (noteId: string) => void;
  onZap: (noteId: string, amount: number) => void;
  onReply?: (noteId: string) => void;
  isLiked: (noteId: string) => boolean;
  isReposted: (noteId: string) => boolean;
  getZapAmount: (noteId: string) => number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  notes,
  users,
  following,
  onNavigate,
  onViewProfile,
  onLike,
  onRepost,
  onZap,
  onReply,
  isLiked,
  isReposted,
  getZapAmount,
}) => {
  // Show notes from followed users + some popular ones
  const feedNotes = notes.filter(note => 
    following.includes(note.pubkey) || note.likes > 50
  ).slice(0, 20);

  const getUserByPubkey = (pubkey: string) => {
    return users.find(u => u.pubkey === pubkey);
  };

  return (
    <div className="coracle-screen">
      {/* Welcome Banner */}
      <div className="coracle-welcome-banner">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome back, {currentUser?.displayName || 'User'}!
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            You have {following.length} connections. Here's what's happening in your network.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-indigo-600">{following.length}</p>
            <p className="text-xs text-gray-500 mt-1">Following</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-indigo-600">{feedNotes.length}</p>
            <p className="text-xs text-gray-500 mt-1">New Notes</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-indigo-600">3</p>
            <p className="text-xs text-gray-500 mt-1">Notifications</p>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Feed</h3>
            <div className="flex gap-2">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Latest
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Popular
              </button>
            </div>
          </div>

          {feedNotes.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Your feed is empty</h4>
              <p className="text-sm text-gray-500 mb-4">
                Follow more people to see their notes here.
              </p>
              <button 
                onClick={() => onNavigate('relays')}
                className="coracle-btn-secondary"
              >
                Discover People
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {feedNotes.map(note => {
                const author = getUserByPubkey(note.pubkey);
                if (!author) return null;
                
                return (
                  <NoteCard
                    key={note.id}
                    note={note}
                    author={author}
                    onViewProfile={onViewProfile}
                    onLike={() => onLike(note.id)}
                    onRepost={() => onRepost(note.id)}
                    onZap={(amount) => onZap(note.id, amount)}
                    onReply={() => onReply?.(note.id)}
                    isLiked={isLiked(note.id)}
                    isReposted={isReposted(note.id)}
                    zapAmount={getZapAmount(note.id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Load More */}
        {feedNotes.length > 0 && (
          <div className="text-center mt-8">
            <button className="coracle-btn-secondary">
              Load More Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
