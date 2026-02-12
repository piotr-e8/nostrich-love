import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, Users, Flame, Clock } from 'lucide-react';

interface ExploreScreenProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'nostr', label: 'Nostr' },
  { id: 'tech', label: 'Tech' },
  { id: 'news', label: 'News' },
  { id: 'art', label: 'Art' },
  { id: 'memes', label: 'Memes' },
];

const trendingTopics = [
  { topic: 'Bitcoin Halving', category: 'Bitcoin', posts: '45.2K', trending: 'up' },
  { topic: 'Nostr Protocol', category: 'Technology', posts: '32.1K', trending: 'up' },
  { topic: 'Lightning Network', category: 'Crypto', posts: '28.9K', trending: 'up' },
  { topic: 'ETF News', category: 'Finance', posts: '24.5K', trending: 'up' },
  { topic: 'NIP-XX', category: 'Nostr', posts: '18.3K', trending: 'new' },
  { topic: 'Zapping', category: 'Bitcoin', posts: '15.7K', trending: 'up' },
  { topic: ' nostr.build', category: 'Media', posts: '12.4K', trending: 'same' },
  { topic: 'SNSTR', category: 'Nostr', posts: '9.8K', trending: 'down' },
];

const popularUsers = [
  { name: 'Jack Dorsey', handle: '@jack', category: 'Tech', followers: '6.5M' },
  { name: 'fiatjaf', handle: '@fiatjaf', category: 'Developer', followers: '45K' },
  { name: 'Will Casarin', handle: '@jb55', category: 'Developer', followers: '38K' },
  { name: 'Pablo Fernandez', handle: '@pablof7z', category: 'Developer', followers: '32K' },
];

export function ExploreScreen({ showToast }: ExploreScreenProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="primal-header sticky top-0">
        <div className="primal-search mb-0">
          <Search className="w-5 h-5 text-[var(--primal-on-surface-muted)]" />
          <input
            type="text"
            placeholder="Search Primal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 p-4 overflow-x-auto border-b border-[var(--primal-border-subtle)] scrollbar-hide">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#7C3AED] text-white'
                : 'bg-[var(--primal-surface-variant)] text-[var(--primal-on-surface)] hover:bg-[var(--primal-hover)]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Trending Section */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold">Trending Now</h2>
        </div>

        <div className="primal-card">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-4 border-b border-[var(--primal-border-subtle)] last:border-0 cursor-pointer hover:bg-[var(--primal-hover)] transition-colors"
              whileHover={{ x: 4 }}
              onClick={() => showToast(`Exploring ${topic.topic}`, 'info')}
            >
              <div className="text-2xl font-bold text-[var(--primal-on-surface-muted)] w-8">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-bold text-[var(--primal-on-surface)]">{topic.topic}</div>
                <div className="text-sm text-[var(--primal-on-surface-variant)]">
                  {topic.category} · {topic.posts} posts
                </div>
              </div>
              <div className="text-[var(--primal-on-surface-muted)]">
                {topic.trending === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                {topic.trending === 'new' && <span className="text-[#7C3AED] text-xs font-bold">NEW</span>}
                {topic.trending === 'same' && <span className="text-gray-500">-</span>}
                {topic.trending === 'down' && <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Users */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-[#7C3AED]" />
          <h2 className="text-xl font-bold">Popular in {activeCategory === 'all' ? 'Nostr' : categories.find(c => c.id === activeCategory)?.label}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularUsers.map((user, index) => (
            <motion.div
              key={index}
              className="primal-card cursor-pointer hover:bg-[var(--primal-hover)] transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="primal-avatar primal-avatar-small" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{user.name}</div>
                  <div className="text-sm text-[var(--primal-on-surface-variant)] truncate">
                    {user.handle}
                  </div>
                  <div className="text-xs text-[var(--primal-on-surface-muted)]">
                    {user.category} · {user.followers} followers
                  </div>
                </div>
                <button className="primal-follow-btn text-sm">
                  Follow
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Topics Section */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-6 h-6 text-[#7C3AED]" />
          <h2 className="text-xl font-bold">Topics for you</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {['#bitcoin', '#nostr', '#lightning', '#privacy', '#freedom', '#tech', '#crypto', '#opensource'].map((tag) => (
            <motion.button
              key={tag}
              className="px-4 py-2 bg-[var(--primal-surface-variant)] rounded-full text-sm hover:bg-[var(--primal-hover)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showToast(`Searching ${tag}`, 'info')}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Section */}
      <div className="p-4 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-[var(--primal-on-surface-variant)]" />
          <h2 className="text-xl font-bold">Recent</h2>
        </div>

        <div className="text-[var(--primal-on-surface-muted)] text-center py-8">
          Your recent searches will appear here
        </div>
      </div>
    </div>
  );
}

export default ExploreScreen;
