import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, TrendingUp, Clock, X } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { mockNotes, getUserByPubkey } from '../../../data/mock';
import '../amethyst.theme.css';

const trendingTopics = [
  { tag: '#Bitcoin', posts: '12.5K' },
  { tag: '#Nostr', posts: '8.2K' },
  { tag: '#Lightning', posts: '5.1K' },
  { tag: '#Privacy', posts: '3.8K' },
  { tag: '#Development', posts: '2.9K' },
];

const recentSearches = [
  'fiatjaf',
  'NIP-05',
  'zaps',
  'amethyst',
];

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length > 2) {
      setIsSearching(true);
      // Simulate search
      const searchResults = mockNotes
        .filter(note => 
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 10)
        .map(note => {
          const author = getUserByPubkey(note.pubkey);
          return {
            id: note.id,
            author: {
              name: author?.displayName || 'Unknown',
              handle: author?.nip05 || author?.username || 'unknown',
              avatar: author?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${note.pubkey}`,
              nip05: author?.nip05,
              isVerified: author?.isVerified,
            },
            content: note.content,
            timestamp: formatTimestamp(note.created_at),
            stats: {
              replies: note.replies,
              reposts: note.reposts,
              zaps: note.zaps,
              likes: note.likes,
            },
          };
        });
      setResults(searchResults);
    } else {
      setIsSearching(false);
      setResults([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--md-background)]">
      {/* Search Bar */}
      <div className="p-4 bg-[var(--md-surface)] border-b border-[var(--md-outline-variant)]">
        <div className="flex items-center gap-3">
          {isSearching && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsSearching(false);
                setQuery('');
              }}
              className="p-2 rounded-full hover:bg-[var(--md-surface-variant)]"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--md-on-surface)]" />
            </motion.button>
          )}
          
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Nostr"
              className="w-full bg-[var(--md-surface-variant)] text-[var(--md-on-surface)] pl-10 pr-10 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--md-primary)]"
            />
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setQuery('');
                  setIsSearching(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-[var(--md-on-surface-variant)]/20"
              >
                <X className="w-4 h-4 text-[var(--md-on-surface)]" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Search Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!isSearching ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[var(--md-on-surface)] font-medium text-sm">Recent</h3>
                    <button className="text-[var(--md-primary)] text-sm">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={index}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSearch(search)}
                        className="md-chip md-chip-suggestion"
                      >
                        <Clock className="w-3 h-3" />
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-[var(--md-primary)]" />
                  <h3 className="text-[var(--md-on-surface)] font-medium text-sm">Trending</h3>
                </div>
                <div className="space-y-2">
                  {trendingTopics.map((topic, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSearch(topic.tag)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--md-surface-variant)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[var(--md-on-surface-variant)] font-medium w-6">
                          {index + 1}
                        </span>
                        <span className="text-[var(--md-on-surface)] font-medium">
                          {topic.tag}
                        </span>
                      </div>
                      <span className="text-[var(--md-on-surface-variant)] text-sm">
                        {topic.posts} posts
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Suggested Users */}
              <div className="mt-6">
                <h3 className="text-[var(--md-on-surface)] font-medium text-sm mb-3">
                  Suggested for you
                </h3>
                <div className="space-y-2">
                  {['fiatjaf', 'pablo', 'jb55', 'vitor'].map((user, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--md-surface-variant)] transition-colors"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user}`}
                        alt={user}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-[var(--md-on-surface)] font-medium capitalize">{user}</p>
                        <p className="text-[var(--md-on-surface-variant)] text-sm">@{user}</p>
                      </div>
                      <button className="md-button md-button-outlined text-sm py-1.5 px-4">
                        Follow
                      </button>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-2"
            >
              <div className="px-4 py-2 text-[var(--md-on-surface-variant)] text-sm">
                {results.length} results for "{query}"
              </div>
              {results.length > 0 ? (
                results.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MaterialCard post={post} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-[var(--md-on-surface-variant)]">
                  No results found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
