import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MediaCardProps {
  type: 'image' | 'video';
  url: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  caption: string;
  timestamp: string;
}

export function MediaCard({ type, url, author, likes, caption, timestamp }: MediaCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleLikeClick = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <article className="olas-media-card bg-white">
      {/* Header */}
      <div className="olas-media-header">
        <img
          src={author.avatar}
          alt={author.name}
          className="olas-media-avatar"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-900">{author.name}</p>
        </div>
        <button className="p-1">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* Media Content */}
      <div
        className="relative cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={url}
          alt="Post content"
          className="olas-media-content"
        />
        
        {/* Double-tap heart animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isLiked ? [0, 1.5, 0] : 0, opacity: isLiked ? [0, 1, 0] : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <svg className="w-24 h-24 text-white fill-current drop-shadow-lg" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        {/* Video indicator */}
        {type === 'video' && (
          <div className="absolute bottom-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="olas-media-actions">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLikeClick}
            className={`olas-action-btn transition-colors ${isLiked ? 'liked text-red-500' : ''}`}
          >
            <svg
              className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`}
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isLiked ? 0 : 2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button className="olas-action-btn">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button className="olas-action-btn">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <button className="olas-action-btn ml-auto">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4">
        <p className="text-sm">
          <span className="font-semibold text-gray-900">{author.name}</span>{' '}
          <span className="text-gray-700">{caption}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">{likeCount} likes · {timestamp}</p>
      </div>
    </article>
  );
}
