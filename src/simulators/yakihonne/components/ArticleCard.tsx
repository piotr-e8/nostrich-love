import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Zap, Bookmark, Share2, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    coverImage: string;
    author: {
      name: string;
      avatar: string;
      nip05?: string;
    };
    readTime: string;
    publishedAt: string;
    likes: number;
    comments: number;
    zaps: number;
    tags: string[];
  };
  isBookmarked: boolean;
  onBookmark: () => void;
}

export function ArticleCard({ article, isBookmarked, onBookmark }: ArticleCardProps) {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <motion.article
      className="yakihonne-article-card cursor-pointer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="yakihonne-article-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {article.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="yakihonne-badge bg-black/60 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="yakihonne-article-content">
        <h2 className="yakihonne-article-title">{article.title}</h2>
        <p className="yakihonne-article-summary">{article.summary}</p>

        {/* Author Info */}
        <div className="flex items-center gap-3 mt-4">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="yakihonne-avatar yakihonne-avatar-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--yh-text-primary)] text-sm truncate">
              {article.author.name}
            </p>
            {article.author.nip05 && (
              <p className="text-xs text-[var(--yh-primary)] truncate">
                ✓ {article.author.nip05}
              </p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="yakihonne-article-meta">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="yakihonne-card-footer">
        <div className="yakihonne-actions">
          <button className="yakihonne-action hover:text-red-500">
            <Heart className="w-4 h-4" />
            <span>{formatNumber(article.likes)}</span>
          </button>
          <button className="yakihonne-action hover:text-blue-500">
            <MessageCircle className="w-4 h-4" />
            <span>{formatNumber(article.comments)}</span>
          </button>
          <button className="yakihonne-action hover:text-yellow-500">
            <Zap className="w-4 h-4" />
            <span>{formatNumber(article.zaps)}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked 
                ? 'text-[var(--yh-primary)] bg-[var(--yh-primary)]/10' 
                : 'text-[var(--yh-text-tertiary)] hover:bg-[var(--yh-surface-variant)]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 text-[var(--yh-text-tertiary)] hover:bg-[var(--yh-surface-variant)] rounded-full transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ArticleCard;
