import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Flame, Users, Clock } from 'lucide-react';

interface SearchScreenProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const trendingTopics = [
  { topic: 'Bitcoin Halving', posts: '45.2K posts', category: 'Bitcoin' },
  { topic: 'Nostr Protocol', posts: '32.1K posts', category: 'Technology' },
  { topic: 'Lightning Network', posts: '28.9K posts', category: 'Crypto' },
  { topic: 'ETF News', posts: '24.5K posts', category: 'Finance' },
  { topic: 'NIP Updates', posts: '18.3K posts', category: 'Nostr' },
];

const recentSearches = ['#bitcoin', '@jack', 'nostr', 'zapping'];

export function SearchScreen({ showToast }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'users' | 'media'>('trending');

  return (
    <div className="min-h-full pb-20">
      {/* Header with Search */}
      <div className="primal-mobile-header">
        <div className="primal-search-mobile flex-1 mx-2">
          <Search className="w-5 h-5 text-[var(--primal-mobile-on-surface-muted)]" />
          <input
            type="text"
            placeholder="Search Primal"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="primal-tab-pills">
        <button
          className={`primal-tab-pill ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          Trending
        </button>
        <button
          className={`primal-tab-pill ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`primal-tab-pill ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Media
        </button>
      </div>

      {/* Content */}
      {activeTab === 'trending' && (
        <>
          {/* Trending Card */}
          <div className="primal-trending-card">
            <div className="primal-trending-header-mobile flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Trending Now
            </div>
            {trendingTopics.map((item, index) => (
              <motion.div
                key={index}
                className="primal-trending-item-mobile"
                whileTap={{ scale: 0.98 }}
                onClick={() => showToast(`Exploring ${item.topic}`, 'info')}
              >
                <div className="primal-trending-category-mobile">{item.category} · Trending</div>
                <div className="primal-trending-topic-mobile">{item.topic}</div>
                <div className="primal-trending-count-mobile">{item.posts}</div>
              </motion.div>
            ))}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="px-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[var(--primal-mobile-on-surface-muted)]" />
                <span className="font-bold">Recent</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    className="px-4 py-2 bg-[var(--primal-mobile-surface-variant)] rounded-full text-sm"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setQuery(search);
                      showToast(`Searching ${search}`, 'info');
                    }}
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'users' && (
        <div className="p-4">
          <div className="text-center text-[var(--primal-mobile-on-surface-muted)] py-8">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Search for users to follow</p>
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <div className="p-4">
          <div className="text-center text-[var(--primal-mobile-on-surface-muted)] py-8">
            <p>Media search coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchScreen;
