import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Repeat, Zap, Share, MoreVertical } from 'lucide-react';
import '../amethyst.theme.css';

interface PostAuthor {
  name: string;
  handle: string;
  avatar: string;
  nip05?: string;
  isVerified?: boolean;
}

interface PostStats {
  replies: number;
  reposts: number;
  zaps: number;
  likes: number;
}

interface PostData {
  id: string;
  author: PostAuthor;
  content: string;
  timestamp: string;
  stats: PostStats;
  images?: string[];
  hashtags?: string[];
  community?: string;
  isLive?: boolean;
}

interface MaterialCardProps {
  post: PostData;
  onLike?: (id: string) => void;
  onRepost?: (id: string) => void;
  onZap?: (id: string) => void;
  onReply?: (id: string) => void;
  onShare?: (id: string) => void;
}

export function MaterialCard({ 
  post, 
  onLike, 
  onRepost, 
  onZap, 
  onReply, 
  onShare 
}: MaterialCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isReposted, setIsReposted] = React.useState(false);
  const [isZapped, setIsZapped] = React.useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    onRepost?.(post.id);
  };

  const handleZap = () => {
    setIsZapped(!isZapped);
    onZap?.(post.id);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderContent = (content: string) => {
    // Highlight hashtags
    let processedContent = content.replace(
      /#(\w+)/g,
      '<span style="color: var(--md-primary); font-weight: 500;">#$1</span>'
    );
    
    // Highlight mentions
    processedContent = processedContent.replace(
      /nostr:(\w+)/g,
      '<span style="color: var(--md-primary); font-weight: 500;">@$1</span>'
    );
    
    // Highlight links
    processedContent = processedContent.replace(
      /(https?:\/\/[^\s]+)/g,
      '<span style="color: var(--md-primary); text-decoration: underline;">$1</span>'
    );
    
    return { __html: processedContent };
  };

  return (
    <motion.article
      className="md-card mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      layout
    >
      {/* Card Header */}
      <div className="p-4 flex items-start gap-3">
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="relative z-10"
        >
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${post.author.handle || post.author.name || 'default'}`}
            alt={post.author.name}
            className="md-avatar"
          />
          {post.author.nip05 && (
            <div className="nip05-badge absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-20">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-semibold text-[var(--md-on-surface)] truncate">
              {post.author.name}
            </span>
            {post.author.nip05 && (
              <div className="flex items-center gap-0.5 text-[var(--md-primary)]">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium truncate max-w-[120px]">
                  {post.author.nip05}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--md-on-surface-variant)]">
              {post.timestamp}
            </span>
            {post.isLive && (
              <span className="live-badge text-xs font-bold px-2 py-0.5 rounded-full text-white">
                LIVE
              </span>
            )}
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="md-app-bar-icon-btn"
        >
          <MoreVertical className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
        </motion.button>
      </div>

      {/* Community Tag */}
      {post.community && (
        <div className="px-4 pb-2">
          <span className="community-badge inline-flex items-center gap-1 text-xs font-medium text-[var(--md-primary)] bg-[var(--md-primary-container)] px-2 py-1 rounded-full">
            Posted in {post.community}
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="px-4 pb-3">
        <p 
          className="text-[var(--md-on-surface)] leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={renderContent(post.content)}
        />
      </div>

      {/* Card Images */}
      {post.images && post.images.length > 0 && (
        <div className={`px-4 pb-3 grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {post.images.slice(0, 4).map((image, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-lg ${post.images!.length === 1 ? 'aspect-video' : 'aspect-square'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <img
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {post.images!.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">+{post.images!.length - 4}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-[var(--md-outline-variant)]" data-tour="amethyst-actions">
        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={() => onReply?.(post.id)}
          className={`action-btn action-btn-reply md-ripple flex items-center gap-1.5 text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] transition-colors`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium min-w-[20px] text-center">{formatNumber(post.stats.replies)}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={handleRepost}
          className={`action-btn action-btn-repost md-ripple flex items-center gap-1.5 transition-colors ${
            isReposted ? 'active text-green-600' : 'text-[var(--md-on-surface-variant)] hover:text-green-600'
          }`}
        >
          <Repeat className="w-5 h-5" />
          <span className="text-sm font-medium min-w-[20px] text-center">
            {formatNumber(post.stats.reposts + (isReposted ? 1 : 0))}
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={handleZap}
          className={`action-btn action-btn-zap md-ripple flex items-center gap-1.5 transition-colors ${
            isZapped ? 'active' : 'text-[var(--md-on-surface-variant)]'
          }`}
          style={{ color: isZapped ? 'var(--bitcoin-orange)' : undefined }}
        >
          <Zap className="w-5 h-5" fill={isZapped ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium min-w-[20px] text-center">
            {formatNumber(post.stats.zaps + (isZapped ? 21 : 0))}
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={handleLike}
          className={`action-btn action-btn-like md-ripple flex items-center gap-1.5 transition-colors ${
            isLiked ? 'active text-red-500' : 'text-[var(--md-on-surface-variant)] hover:text-red-500'
          }`}
        >
          <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium min-w-[20px] text-center">
            {formatNumber(post.stats.likes + (isLiked ? 1 : 0))}
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={() => onShare?.(post.id)}
          className={`action-btn md-ripple flex items-center gap-1.5 text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] transition-colors`}
        >
          <Share className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.article>
  );
}
