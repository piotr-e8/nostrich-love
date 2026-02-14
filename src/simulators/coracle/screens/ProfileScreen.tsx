import React, { useState } from 'react';
import type { MockUser, MockNote } from '../../../data/mock';
import { getNotesByAuthor } from '../../../data/mock';
import { NoteCard } from '../components/NoteCard';
import type { CoracleScreen } from '../CoracleSimulator';

interface ProfileScreenProps {
  user: MockUser | null;
  currentUser: MockUser | null;
  notes: MockNote[];
  isFollowing: boolean;
  onNavigate: (screen: CoracleScreen) => void;
  onViewProfile: (user: MockUser) => void;
  onFollow: () => void;
  onUpdateProfile: (updates: Partial<MockUser>) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  currentUser,
  notes,
  isFollowing,
  onNavigate,
  onViewProfile,
  onFollow,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'replies' | 'likes'>('notes');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
    lightningAddress: user?.lightningAddress || '',
  });

  const isOwnProfile = user?.pubkey === currentUser?.pubkey;
  const userNotes = user ? getNotesByAuthor(notes, user.pubkey) : [];

  const handleSaveProfile = () => {
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="coracle-screen flex items-center justify-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="coracle-screen">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.pubkey || user.username || 'default'}`}
                alt={user.displayName}
                className="w-24 h-24 rounded-full bg-gray-100 object-cover border-4 border-white shadow-md"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
                      <p className="text-gray-500">@{user.username}</p>
                    </div>
                    {isOwnProfile ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="coracle-btn-secondary"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={onFollow}
                        className={isFollowing ? 'coracle-btn-secondary' : 'coracle-btn-primary'}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 mt-3">{user.bio}</p>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
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
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        {user.website}
                      </span>
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
                      Joined {new Date(user.createdAt * 1000).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <span className="font-bold text-gray-900">{userNotes.length}</span>
                      <span className="text-gray-500 ml-1 text-sm">Posts</span>
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-gray-900">{user.followingCount}</span>
                      <span className="text-gray-500 ml-1 text-sm">Following</span>
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-gray-900">{user.followersCount}</span>
                      <span className="text-gray-500 ml-1 text-sm">Followers</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      className="coracle-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="coracle-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="coracle-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="coracle-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="coracle-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lightning Address</label>
                    <input
                      type="text"
                      value={editForm.lightningAddress}
                      onChange={(e) => setEditForm({ ...editForm, lightningAddress: e.target.value })}
                      className="coracle-input"
                      placeholder="you@wallet.com"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="coracle-btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="coracle-btn-primary flex-1"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      {!isEditing && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('replies')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'replies'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Replies
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'likes'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Likes
            </button>
          </div>

          {/* Notes List */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {userNotes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No notes yet</p>
                </div>
              ) : (
                userNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    author={user}
                    onViewProfile={onViewProfile}
                    isLiked={false}
                    isReposted={false}
                    zapAmount={0}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'replies' && (
            <div className="text-center py-12">
              <p className="text-gray-500">No replies yet</p>
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="text-center py-12">
              <p className="text-gray-500">No likes yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
