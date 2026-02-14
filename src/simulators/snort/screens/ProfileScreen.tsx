/**
 * Snort Profile Screen
 * User profile with NIP-05 verification
 */

import React, { useState, useMemo } from 'react';
import { NoteCard } from '../components/NoteCard';
import type { MockUser, MockNote } from '../../../data/mock';

interface ProfileScreenProps {
  user: MockUser | null;
  currentUser: MockUser | null;
  notes: MockNote[];
  users: MockUser[];
  onBack: () => void;
  onViewProfile: (user: MockUser) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  currentUser,
  notes,
  users,
  onBack,
  onViewProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'likes'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  // Create user lookup map
  const userMap = useMemo(() => {
    const map = new Map<string, MockUser>();
    users.forEach(u => map.set(u.pubkey, u));
    return map;
  }, [users]);

  if (!user) {
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
          <p>User not found</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.pubkey === user.pubkey;
  
  // Filter user's notes
  const userNotes = notes
    .filter(note => note.pubkey === user.pubkey)
    .slice(0, 20);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    console.log('[Snort]', isFollowing ? 'Unfollowed' : 'Followed', user.displayName);
  };

  return (
    <div className="flex flex-col h-full" data-tour="snort-profile">
      {/* Header */}
      <div className="snort-header">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="snort-btn snort-btn-ghost snort-btn-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="snort-header-title">{user.displayName}</h1>
            <p className="text-sm text-slate-400">{userNotes.length} posts</p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="snort-profile-header">
        <div className="snort-profile-banner" />
        <div className="snort-profile-info">
          <div className="flex justify-between items-start">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.pubkey || user.username || 'default'}`}
              alt={user.displayName}
              className="snort-profile-avatar"
            />
            <div className="snort-profile-actions mt-3">
              {!isOwnProfile && (
                <>
                  <button className="snort-btn snort-btn-secondary snort-btn-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Message
                  </button>
                  <button
                    onClick={handleFollow}
                    data-tour="snort-follow"
                    className={`snort-btn snort-btn-sm ${isFollowing ? 'snort-btn-secondary' : 'snort-btn-primary'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
              {isOwnProfile && (
                <button className="snort-btn snort-btn-secondary snort-btn-sm">
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <h2 className="snort-profile-name">
            {user.displayName}
            {user.isVerified && (
              <span className="snort-verified ml-2" title="Verified">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </h2>

          <p className="snort-profile-handle">
            @{user.username}
            {user.nip05 && (
              <span className="ml-2 text-teal-400 text-sm">✓ {user.nip05}</span>
            )}
          </p>

          {user.bio && (
            <p className="snort-profile-bio">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
            {user.location && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.location}
              </span>
            )}
            {user.website && (
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-teal-400 hover:underline"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {user.lightningAddress && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {user.lightningAddress}
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Joined {new Date(user.createdAt * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="snort-profile-stats">
            <div className="snort-profile-stat">
              <strong>{user.followingCount.toLocaleString()}</strong>
              <span>Following</span>
            </div>
            <div className="snort-profile-stat">
              <strong>{user.followersCount.toLocaleString()}</strong>
              <span>Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="snort-tabs border-b border-slate-700">
        {(['posts', 'replies', 'likes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`snort-tab ${activeTab === tab ? 'active' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="snort-content flex-1">
        {activeTab === 'posts' && userNotes.map((note) => {
          const author = userMap.get(note.pubkey);
          return author ? (
            <NoteCard
              key={note.id}
              note={note}
              author={author}
              onViewProfile={() => onViewProfile(author)}
            />
          ) : null;
        })}

        {activeTab === 'replies' && (
          <div className="snort-empty">
            <p>No replies yet</p>
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="snort-empty">
            <p>No likes yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
