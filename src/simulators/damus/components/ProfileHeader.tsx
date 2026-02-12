import React from 'react';
import type { MockUser } from '../../../data/mock';

interface ProfileHeaderProps {
  user: MockUser;
  currentUser: MockUser | null;
  isFollowing: boolean;
  onFollow: () => void;
  onEditProfile: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  currentUser,
  isFollowing,
  onFollow,
  onEditProfile,
}) => {
  const isOwnProfile = currentUser?.pubkey === user.pubkey;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-br from-purple-400 to-purple-600" />

      {/* Profile Info */}
      <div className="px-4 pb-4">
        {/* Avatar and Actions Row */}
        <div className="flex justify-between items-end -mt-12 mb-3">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
          />
          
          {isOwnProfile ? (
            <button
              onClick={onEditProfile}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={onFollow}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                isFollowing
                  ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Name and Handle */}
        <div className="mb-3">
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
          <p className="text-gray-900 mb-3">{user.bio}</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-500">
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
        </div>

        {/* Stats */}
        <div className="flex gap-6">
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
    </div>
  );
};

export default ProfileHeader;
