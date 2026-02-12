import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Smile, Calendar, MapPin, BarChart2 } from 'lucide-react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string) => void;
}

export function ComposeModal({ isOpen, onClose, onPost }: ComposeModalProps) {
  const [content, setContent] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = () => {
    if (content.trim()) {
      onPost(content);
      setContent('');
      setCharCount(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[var(--primal-surface)] w-full max-w-xl rounded-2xl shadow-2xl pointer-events-auto border border-[var(--primal-border)]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--primal-border-subtle)]">
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--primal-hover)] rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex gap-4">
                  <div className="primal-avatar primal-avatar-small flex-shrink-0" />
                  <div className="flex-1">
                    <textarea
                      value={content}
                      onChange={handleChange}
                      placeholder="What is happening?!"
                      className="w-full bg-transparent text-xl resize-none outline-none min-h-[160px] text-[var(--primal-on-surface)] placeholder-[var(--primal-on-surface-variant)]"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[var(--primal-border-subtle)]" />

              {/* Actions */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <motion.button
                    className="p-2 text-[#7C3AED] hover:bg-[var(--primal-primary-container)] rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Image className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="p-2 text-[#7C3AED] hover:bg-[var(--primal-primary-container)] rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Smile className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="p-2 text-[#7C3AED] hover:bg-[var(--primal-primary-container)] rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Calendar className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="p-2 text-[#7C3AED] hover:bg-[var(--primal-primary-container)] rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MapPin className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="p-2 text-[#7C3AED] hover:bg-[var(--primal-primary-container)] rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <BarChart2 className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-sm ${charCount > 280 ? 'text-red-500' : 'text-[var(--primal-on-surface-muted)]'}`}>
                    {charCount > 0 && charCount}
                  </span>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!content.trim() || charCount > 280}
                    className="primal-btn-primary w-auto px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Post
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ComposeModal;
