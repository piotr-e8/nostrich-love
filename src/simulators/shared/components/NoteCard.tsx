/**
 * NoteCard - Display a single note/post
 * Used across all simulators
 */

import React from 'react';
import { Heart, Repeat2, MessageCircle, Zap, Share } from 'lucide-react';
import type { NoteCardProps, SimulatorUser } from '../types';
import { formatRelativeTime } from '../utils/mockEvents';
import { cn } from '../../../utils/cn';

/**
 * UserAvatar - Small avatar component
 */
function UserAvatar({ 
  user, 
  size = 'md',
  onClick 
}: { 
  user: SimulatorUser; 
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const initial = user.displayName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?';
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
        'hover:opacity-80 transition-opacity',
        sizeClasses[size],
        onClick && 'cursor-pointer'
      )}
    >
      {user.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.displayName}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        initial
      )}
    </button>
  );
}

/**
 * NoteCard - Displays a note with actions
 */
export interface NoteCardExtendedProps extends NoteCardProps {
  isLiked?: boolean;
  isReposted?: boolean;
  isZapped?: boolean;
}

export function NoteCard({
  item,
  compact = false,
  showActions = true,
  isLiked = false,
  isReposted = false,
  isZapped = false,
  onLike,
  onRepost,
  onReply,
  onZap,
  onShare,
}: NoteCardExtendedProps) {
  const { note, author, repostedBy, timestamp } = item;

  return (
    <article 
      className={cn(
        'note-card border-b border-gray-200 dark:border-gray-800',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
        compact ? 'p-3' : 'p-4'
      )}
    >
      {/* Repost indicator */}
      {repostedBy && (
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 ml-12">
          <Repeat2 className="w-3 h-3" />
          <span>{repostedBy.displayName} reposted</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <UserAvatar 
          user={author} 
          size={compact ? 'sm' : 'md'}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {author.displayName}
            </span>
            {author.isVerified && (
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-gray-500 text-sm truncate">
              @{author.username}
            </span>
            <span className="text-gray-400 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              {formatRelativeTime(timestamp)}
            </span>
          </div>

          {/* Note content */}
          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
            {note.content}
          </p>

          {/* Images */}
          {note.images && note.images.length > 0 && (
            <div className={cn(
              'mt-3 grid gap-2 rounded-xl overflow-hidden',
              note.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            )}>
              {note.images.map((img, i) => (
                <img 
                  key={i}
                  src={img}
                  alt=""
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity cursor-pointer"
                />
              ))}
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between mt-3 max-w-md">
              <button
                onClick={onReply}
                className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs">{note.replies || ''}</span>
              </button>

              <button
                onClick={onRepost}
                className={cn(
                  "flex items-center gap-1.5 transition-colors group",
                  isReposted ? "text-green-500" : "text-gray-500 hover:text-green-500"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full",
                  isReposted ? "bg-green-50 dark:bg-green-950" : "group-hover:bg-green-50 dark:group-hover:bg-green-950"
                )}>
                  <Repeat2 className="w-4 h-4" />
                </div>
                <span className="text-xs">
                  {(note.reposts || 0) + (isReposted ? 1 : 0) || ''}
                </span>
              </button>

              <button
                onClick={onLike}
                className={cn(
                  "flex items-center gap-1.5 transition-colors group",
                  isLiked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full",
                  isLiked ? "bg-pink-50 dark:bg-pink-950" : "group-hover:bg-pink-50 dark:group-hover:bg-pink-950"
                )}>
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                </div>
                <span className="text-xs">
                  {(note.likes || 0) + (isLiked ? 1 : 0) || ''}
                </span>
              </button>

              <button
                onClick={onZap}
                className={cn(
                  "flex items-center gap-1.5 transition-colors group",
                  isZapped ? "text-amber-500" : "text-gray-500 hover:text-amber-500"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full",
                  isZapped ? "bg-amber-50 dark:bg-amber-950" : "group-hover:bg-amber-50 dark:group-hover:bg-amber-950"
                )}>
                  <Zap className={cn("w-4 h-4", isZapped && "fill-current")} />
                </div>
                <span className="text-xs">
                  {(note.zapAmount || 0) + (isZapped ? 21 : 0) > 0 
                    ? `${((note.zapAmount || 0) + (isZapped ? 21 : 0)).toLocaleString()}` 
                    : ''}
                </span>
              </button>

              <button
                onClick={onShare}
                className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950">
                  <Share className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default NoteCard;
