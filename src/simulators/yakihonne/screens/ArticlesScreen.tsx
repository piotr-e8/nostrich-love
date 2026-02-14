import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Clock, Bookmark } from 'lucide-react';
import { ArticleCard } from '../components/ArticleCard';
import { ContentTabs } from '../components/ContentTabs';

interface ArticlesScreenProps {
  onOpenCompose: () => void;
}

// Mock articles data
const mockArticles = [
  {
    id: 'article1',
    title: 'The Complete Guide to Nostr Protocol',
    summary: 'Nostr is a simple, open protocol that enables global, decentralized, and censorship-resistant social media. This comprehensive guide covers everything from basic concepts to advanced implementations.',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    author: {
      name: 'Jack Dorsey',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=jack',
      nip05: 'jack@nostr.com',
    },
    readTime: '12 min read',
    publishedAt: '2024-01-15',
    likes: 342,
    comments: 28,
    zaps: 156,
    tags: ['Nostr', 'Protocol', 'Guide'],
  },
  {
    id: 'article2',
    title: 'Why Bitcoin Will Change Everything',
    summary: 'An in-depth analysis of Bitcoin\'s impact on the global financial system, exploring the philosophical and technological foundations that make it unstoppable.',
    coverImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
    author: {
      name: 'Michael Saylor',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=saylor',
      nip05: 'saylor@bitcoin.com',
    },
    readTime: '18 min read',
    publishedAt: '2024-01-14',
    likes: 892,
    comments: 145,
    zaps: 523,
    tags: ['Bitcoin', 'Finance', 'Analysis'],
  },
  {
    id: 'article3',
    title: 'Building on Lightning: A Developer\'s Journey',
    summary: 'From concept to deployment: lessons learned building Lightning Network applications and the future of instant Bitcoin payments.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    author: {
      name: 'Elizabeth Stark',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=elizabeth',
      nip05: 'stark@lightning.org',
    },
    readTime: '15 min read',
    publishedAt: '2024-01-13',
    likes: 567,
    comments: 89,
    zaps: 340,
    tags: ['Lightning', 'Development', 'Bitcoin'],
  },
  {
    id: 'article4',
    title: 'The Philosophy of Decentralization',
    summary: 'Exploring the deeper meaning behind decentralized technologies and their implications for human freedom and self-sovereignty.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    author: {
      name: 'Andreas Antonopoulos',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=andreas',
      nip05: 'andreas@aantonop.org',
    },
    readTime: '22 min read',
    publishedAt: '2024-01-12',
    likes: 723,
    comments: 112,
    zaps: 445,
    tags: ['Philosophy', 'Decentralization', 'Bitcoin'],
  },
  {
    id: 'article5',
    title: 'Nostr Relays: The Complete Setup Guide',
    summary: 'Everything you need to know about running your own Nostr relay, from hardware requirements to configuration and maintenance.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    author: {
      name: 'Pablo Fernandez',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=pablo',
      nip05: 'pablo@relay.dev',
    },
    readTime: '25 min read',
    publishedAt: '2024-01-11',
    likes: 445,
    comments: 67,
    zaps: 234,
    tags: ['Nostr', 'Relay', 'Technical'],
  },
];

export function ArticlesScreen({ onOpenCompose }: ArticlesScreenProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'bookmarked'>('trending');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());

  const handleBookmark = (articleId: string) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const filteredArticles = mockArticles.filter(article => {
    if (activeTab === 'bookmarked') return bookmarkedArticles.has(article.id);
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="yakihonne-header">
        <span className="yakihonne-header-title">Articles</span>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content Type Tabs */}
      <ContentTabs
        tabs={[
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'latest', label: 'Latest', icon: Clock },
          { id: 'bookmarked', label: 'Saved', icon: Bookmark },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
      />

      {/* Articles List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              No saved articles
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Bookmark articles to read them later
            </p>
          </div>
        ) : (
          filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.05,
                type: 'spring',
                stiffness: 300,
                damping: 25 
              }}
            >
              <ArticleCard
                article={article}
                isBookmarked={bookmarkedArticles.has(article.id)}
                onBookmark={() => handleBookmark(article.id)}
              />
            </motion.div>
          ))
        )}
        
        {filteredArticles.length > 0 && (
          <div className="text-center py-6 text-[var(--yh-text-tertiary)] text-sm">
            You've reached the end
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticlesScreen;
