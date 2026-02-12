import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Smile, MapPin } from 'lucide-react';

interface ComposeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string) => void;
}

export function ComposeSheet({ isOpen, onClose, onPost }: ComposeSheetProps) {
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (content.trim()) {
      onPost(content);
      setContent('');
    }
  };

  return (
    <motion.div
      className={`primal-compose-sheet ${isOpen ? 'open' : ''}`}
      initial={false}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="primal-compose-handle" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          onClick={onClose}
          className="text-[var(--primal-mobile-primary)] font-medium"
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={handlePost}
          disabled={!content.trim()}
          className="bg-[var(--primal-mobile-primary)] text-white px-4 py-2 rounded-full font-bold disabled:opacity-50"
          whileTap={{ scale: 0.95 }}
        >
          Post
        </motion.button>
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <div className="primal-avatar-mobile-small flex-shrink-0" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What is happening?!"
          className="flex-1 bg-transparent text-lg resize-none outline-none min-h-[120px] text-[var(--primal-mobile-on-surface)] placeholder-[var(--primal-mobile-on-surface-muted)]"
          autoFocus
        />
      </div>

      {/* Tools */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--primal-mobile-border)]">
        <div className="flex gap-4">
          <motion.button 
            className="text-[var(--primal-mobile-primary)]"
            whileTap={{ scale: 0.9 }}
          >
            <Image className="w-6 h-6" />
          </motion.button>
          <motion.button 
            className="text-[var(--primal-mobile-primary)]"
            whileTap={{ scale: 0.9 }}
          >
            <Smile className="w-6 h-6" />
          </motion.button>
          <motion.button 
            className="text-[var(--primal-mobile-primary)]"
            whileTap={{ scale: 0.9 }}
          >
            <MapPin className="w-6 h-6" />
          </motion.button>
        </div>
        <span className="text-[var(--primal-mobile-on-surface-muted)] text-sm">
          {content.length > 0 && content.length}
        </span>
      </div>
    </motion.div>
  );
}

export default ComposeSheet;
