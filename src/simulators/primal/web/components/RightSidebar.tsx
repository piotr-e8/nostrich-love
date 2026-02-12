import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, Users } from 'lucide-react';

interface RightSidebarProps {
  theme: 'light' | 'dark';
}

const trendingTopics = [
  { category: 'Bitcoin', topic: 'Halving Countdown', posts: '24.5K posts' },
  { category: 'Technology', topic: '#Nostr', posts: '18.2K posts' },
  { category: 'Crypto', topic: 'Lightning Network', posts: '12.8K posts' },
  { category: 'News', topic: 'ETF Approval', posts: '9.5K posts' },
  { category: 'Programming', topic: 'TypeScript', posts: '7.3K posts' },
];

const suggestedUsers = [
  { name: 'Satoshi Nakamoto', handle: '@satoshi', followers: '2.1M' },
  { name: 'Jack Dorsey', handle: '@jack', followers: '6.5M' },
  { name: 'fiatjaf', handle: '@fiatjaf', followers: '45K' },
];

export function RightSidebar({ theme }: RightSidebarProps) {
  return (
    <aside className="primal-right-sidebar right-sidebar">
      {/* Search */}
      <div className="primal-search">
        <Search className="w-5 h-5 text-[var(--primal-on-surface-muted)]" />
        <input type="text" placeholder="Search Primal" />
      </div>

      {/* Wallet Card */}
      <div className="primal-wallet">
        <div className="primal-wallet-header">
          <span className="primal-wallet-label">Wallet Balance</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="primal-wallet-balance">128,450 sats</div>
        <div className="primal-wallet-actions mt-4">
          <button className="primal-wallet-btn">Receive</button>
          <button className="primal-wallet-btn">Send</button>
        </div>
      </div>

      {/* Trending */}
      <div className="primal-trending">
        <div className="primal-trending-header flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
          Trending for you
        </div>
        {trendingTopics.map((item, index) => (
          <motion.div
            key={index}
            className="primal-trending-item"
            whileHover={{ x: 4 }}
          >
            <div className="primal-trending-category">{item.category} · Trending</div>
            <div className="primal-trending-topic">{item.topic}</div>
            <div className="primal-trending-count">{item.posts}</div>
          </motion.div>
        ))}
        <motion.div 
          className="p-4 text-[#7C3AED] cursor-pointer text-sm"
          whileHover={{ x: 4 }}
        >
          Show more
        </motion.div>
      </div>

      {/* Who to follow */}
      <div className="primal-card mt-4">
        <div className="font-bold text-xl mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#7C3AED]" />
          Who to follow
        </div>
        {suggestedUsers.map((user, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 py-3 border-b border-[var(--primal-border-subtle)] last:border-0"
            whileHover={{ x: 4 }}
          >
            <div className="primal-avatar primal-avatar-small" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{user.name}</div>
              <div className="text-[var(--primal-on-surface-variant)] text-sm truncate">{user.handle}</div>
            </div>
            <button className="primal-follow-btn text-sm">
              Follow
            </button>
          </motion.div>
        ))}
        <motion.div 
          className="mt-3 text-[#7C3AED] cursor-pointer text-sm"
          whileHover={{ x: 4 }}
        >
          Show more
        </motion.div>
      </div>

      {/* Footer Links */}
      <div className="mt-6 text-sm text-[var(--primal-on-surface-muted)] flex flex-wrap gap-x-4 gap-y-2">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <a href="#" className="hover:underline">Accessibility</a>
        <a href="#" className="hover:underline">Ads info</a>
        <span>© 2025 Primal, Inc.</span>
      </div>
    </aside>
  );
}

export default RightSidebar;
