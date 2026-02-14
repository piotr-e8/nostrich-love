import React, { useState } from 'react';
import { PhotoGrid } from '../components/PhotoGrid';
import type { MockUser } from '../../../data/mock';

interface ProfileScreenProps {
  currentUser: MockUser | null;
}

const profilePhotos = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
];

export function ProfileScreen({ currentUser }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'grid' | 'saved'>('grid');

  return (
    <div className="olas-profile bg-white min-h-full" data-tour="olas-profile">
      {/* Profile Header */}
      <div className="olas-profile-header px-4 pt-8">
        {/* Avatar */}
        <div className="relative mx-auto w-24 h-24 mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] p-[3px]">
            <img
              src={currentUser?.picture || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-white object-cover bg-white"
            />
          </div>
        </div>

        {/* Username */}
        <h1 className="text-xl font-bold text-gray-900">
          {currentUser?.displayName || 'Photo Enthusiast'}
        </h1>
        <p className="text-sm text-gray-500 mb-1">
          {currentUser?.nip05 || '@photolover'}
        </p>
        <p className="text-sm text-gray-700 max-w-xs mx-auto">
          {currentUser?.about || 'Capturing moments on Nostr 📸'}
        </p>

        {/* Stats */}
        <div className="olas-profile-stats mt-6">
          <div className="olas-stat">
            <div className="olas-stat-value">{profilePhotos.length}</div>
            <div className="olas-stat-label">posts</div>
          </div>
          <div className="olas-stat">
            <div className="olas-stat-value">1.2k</div>
            <div className="olas-stat-label">followers</div>
          </div>
          <div className="olas-stat">
            <div className="olas-stat-value">486</div>
            <div className="olas-stat-label">following</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6 px-4">
          <button className="flex-1 py-1.5 bg-gray-100 text-gray-900 font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors">
            Edit Profile
          </button>
          <button className="flex-1 py-1.5 bg-gray-100 text-gray-900 font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors">
            Share Profile
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-t border-gray-200 mt-6">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm font-semibold transition-colors ${
            activeTab === 'grid' ? 'text-gray-900 border-t-2 border-gray-900' : 'text-gray-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Grid
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm font-semibold transition-colors ${
            activeTab === 'saved' ? 'text-gray-900 border-t-2 border-gray-900' : 'text-gray-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Saved
        </button>
      </div>

      {/* Content */}
      {activeTab === 'grid' ? (
        <PhotoGrid photos={profilePhotos} />
      ) : (
        <div className="py-12 text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-sm">No saved photos yet</p>
        </div>
      )}
    </div>
  );
}
