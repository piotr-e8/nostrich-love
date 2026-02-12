import React, { useState } from 'react';
import type { MockUser, MockNote } from '../../../data/mock';
import type { DamusScreen } from '../DamusSimulator';
import { NoteCard } from '../components/NoteCard';
import { Avatar } from '../components/Avatar';
import { getNotesByAuthor } from '../../../data/mock';

interface ProfileScreenProps {
  user: MockUser | null;
  currentUser: MockUser | null;
  notes: MockNote[];
  onNavigate: (screen: DamusScreen) => void;
  onViewProfile: (user: MockUser) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  currentUser,
  notes,
  onNavigate,
  onViewProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'likes'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.pubkey === user.pubkey;
  const userNotes = getNotesByAuthor(user.pubkey).slice(0, 20);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    console.log(`[Damus] ${isFollowing ? 'Unfollowed' : 'Followed'} ${user.username}`);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white pb-24" data-tour="damus-profile">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold text-gray-900">{user.displayName}</span>
          <button
            onClick={() => onNavigate('settings')}
            className="p-2 -mr-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="damus-banner" />

      {/* Profile Info */}
      <div className="px-4 pb-4">
        {/* Avatar and Actions */}
        <div className="flex justify-between items-end -mt-10 mb-4">
          <Avatar
            src={user.avatar}
            alt={user.displayName}
            size="lg"
            className="damus-avatar-lg border-4 border-white shadow-md"
          />
          {isOwnProfile ? (
            <button
              onClick={() => onNavigate('settings')}
              className="damus-btn damus-btn-outline mb-2"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`damus-btn mb-2 ${
                isFollowing ? 'damus-btn-secondary' : 'damus-btn-primary'
              }`}
              data-tour="damus-follow"
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Name and Handle */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">{user.displayName}</h1>
          <p className="text-gray-500">@{user.username}</p>
          {user.nip05 && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600">{user.nip05}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-900 mb-4 whitespace-pre-wrap">{user.bio}</p>
        )}

        {/* Location & Website */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
          {user.location && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{user.location}</span>
            </div>
          )}
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-purple-600 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>{user.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {user.lightningAddress && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>{user.lightningAddress}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-4">
          <div className="flex gap-1">
            <span className="font-bold text-gray-900">{formatNumber(user.followingCount)}</span>
            <span className="text-gray-500">Following</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-gray-900">{formatNumber(user.followersCount)}</span>
            <span className="text-gray-500">Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {(['posts', 'replies', 'likes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {activeTab === 'posts' && userNotes.length > 0 ? (
          userNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              author={user}
              onViewProfile={() => {}}
            />
          ))
        ) : activeTab === 'posts' ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No posts yet</p>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
