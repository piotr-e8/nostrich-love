import React from 'react';
import { PhotoGrid } from '../components/PhotoGrid';

const discoverPhotos = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518173946687-a4c036bc1d9e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=300&h=300&fit=crop',
];

const trendingTags = ['#nostrphotography', '#bitcoin', '#nature', '#portrait', '#streetphotography', '#landscape'];

export function DiscoverScreen() {
  return (
    <div className="olas-discover bg-white min-h-full" data-tour="olas-discover">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search photos and creators"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
          />
        </div>
      </div>

      {/* Trending Tags */}
      <div className="px-4 py-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Trending Tags</h3>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              className="px-3 py-1.5 bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8E53]/10 text-[#FF6B6B] text-sm font-medium rounded-full hover:from-[#FF6B6B]/20 hover:to-[#FF8E53]/20 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Featured Creators</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {['photo_master', 'visual_arts', 'crypto_lens', 'nostr_shooter'].map((creator, i) => (
            <div key={creator} className="flex-shrink-0 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] p-[2px]">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${creator}`}
                  alt={creator}
                  className="w-full h-full rounded-full border-2 border-white"
                />
              </div>
              <p className="text-xs text-gray-700 mt-1 whitespace-nowrap">{creator}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Grid */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Explore</h3>
        <PhotoGrid photos={discoverPhotos} />
      </div>
    </div>
  );
}
