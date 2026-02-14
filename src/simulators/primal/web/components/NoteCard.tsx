import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Repeat2, Heart, Zap, Share } from 'lucide-react';
import type { MockNote, MockUser } from '../../../../data/mock';

interface NoteCardProps {
  note: MockNote;
  author: MockUser;
  onReply?: (note: MockNote) => void;
  onRepost?: (note: MockNote) => void;
  onLike?: (note: MockNote) => void;
  onZap?: (note: MockNote) => void;
  onShare?: (note: MockNote) => void;
  onViewProfile?: (user: MockUser) => void;
  index?: number;
}

export function NoteCard({
  note,
  author,
  onReply,
  onRepost,
  onLike,
  onZap,
  onShare,
  onViewProfile,
  index = 0,
}: NoteCardProps) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [zapped, setZapped] = useState(false);
  const [likeCount, setLikeCount] = useState(note.likes);
  const [repostCount, setRepostCount] = useState(note.reposts);
  const [zapCount, setZapCount] = useState(note.zaps);

  const formatTime = (timestamp: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike?.(note);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setRepostCount(prev => reposted ? prev - 1 : prev + 1);
    onRepost?.(note);
  };

  const handleZap = () => {
    setZapped(!zapped);
    setZapCount(prev => zapped ? prev - 1 : prev + 1);
    onZap?.(note);
  };

  const handleReply = () => {
    onReply?.(note);
  };

  const handleShare = () => {
    onShare?.(note);
  };

  return (
    <motion.div
      className="primal-note"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <motion.button
          className="primal-avatar primal-avatar-small flex-shrink-0"
          onClick={() => onViewProfile?.(author)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        
        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <div className="flex items-center gap-2 flex-wrap">
            <motion.span 
              className="primal-note-author cursor-pointer"
              onClick={() => onViewProfile?.(author)}
              whileHover={{ opacity: 0.8 }}
            >
              {author?.displayName || 'Unknown'}
            </motion.span>
            <span className="primal-note-handle">@{author?.username || 'unknown'}</span>
            <span className="primal-note-time">· {formatTime(note.created_at)}</span>
          </div>
          
          {/* Content */}
          <div className="mt-1 text-[var(--primal-on-surface)] whitespace-pre-wrap">
            {note.content}
          </div>
          
          {/* Images */}
          {note.images && note.images.length > 0 && (
            <div className={`mt-3 grid gap-1 rounded-xl overflow-hidden ${
              note.images.length === 1 ? 'grid-cols-1' : 
              note.images.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2'
            }`}>
              {note.images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Attachment ${idx + 1}`}
                  className={`w-full object-cover ${
                    note.images!.length === 1 ? 'h-64' : 'h-32'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-between mt-3 max-w-md">
            <motion.button
              className="primal-action-btn group"
              onClick={handleReply}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="group-hover:text-blue-500" />
              <span>{note.replies > 0 ? note.replies : ''}</span>
            </motion.button>
            
            <motion.button
              className={`primal-action-btn group ${reposted ? 'text-green-500' : ''}`}
              onClick={handleRepost}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Repeat2 className={reposted ? 'text-green-500' : 'group-hover:text-green-500'} />
              <span>{repostCount > 0 ? repostCount : ''}</span>
            </motion.button>
            
            <motion.button
              className={`primal-action-btn group ${liked ? 'text-red-500' : ''}`}
              onClick={handleLike}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                className={liked ? 'text-red-500 fill-current' : 'group-hover:text-red-500'} 
              />
              <span>{likeCount > 0 ? likeCount : ''}</span>
            </motion.button>
            
            <motion.button
              className={`primal-action-btn group ${zapped ? 'text-yellow-500' : ''}`}
              onClick={handleZap}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-tour="primal-zaps"
            >
              <Zap className={zapped ? 'text-yellow-500 fill-current' : 'group-hover:text-yellow-500'} />
              <span>{zapCount > 0 ? zapCount : ''}</span>
            </motion.button>
            
            <motion.button
              className="primal-action-btn group"
              onClick={handleShare}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share className="group-hover:text-blue-500" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default NoteCard;
