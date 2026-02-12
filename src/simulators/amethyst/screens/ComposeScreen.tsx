import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  AtSign, 
  Hash, 
  Smile,
  Send,
  Clock,
  Globe,
  ChevronDown
} from 'lucide-react';
import '../amethyst.theme.css';

interface ComposeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onPost?: (content: string) => void;
}

export function ComposeScreen({ isOpen, onClose, onPost }: ComposeScreenProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [privacy, setPrivacy] = useState<'public' | 'followers'>('public');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 280;
  const remaining = maxLength - content.length;
  const isOverLimit = remaining < 0;

  const handlePost = () => {
    if (content.trim() && !isOverLimit) {
      onPost?.(content);
      setContent('');
      setImages([]);
      onClose();
    }
  };

  const handleImageSelect = () => {
    // Simulate image selection
    const mockImages = [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setImages(prev => [...prev, randomImage]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const insertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + tag + content.substring(end);
      setContent(newContent);
      textarea.focus();
      setTimeout(() => {
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-[var(--md-surface)] w-full sm:w-[500px] sm:rounded-2xl rounded-t-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--md-outline-variant)]">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--md-surface-variant)] transition-colors"
              >
                <X className="w-6 h-6 text-[var(--md-on-surface)]" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePost}
                disabled={!content.trim() || isOverLimit}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  content.trim() && !isOverLimit
                    ? 'bg-[var(--md-primary)] text-[var(--md-on-primary)]'
                    : 'bg-[var(--md-surface-variant)] text-[var(--md-on-surface-variant)] cursor-not-allowed'
                }`}
              >
                Post
              </motion.button>
            </div>

            {/* Composer */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex gap-3">
                {/* Avatar */}
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                  alt="You"
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />

                {/* Input Area */}
                <div className="flex-1">
                  {/* Privacy Selector */}
                  <div className="relative mb-2">
                    <button
                      onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[var(--md-outline)] text-sm text-[var(--md-primary)] hover:bg-[var(--md-surface-variant)] transition-colors"
                    >
                      {privacy === 'public' ? (
                        <>
                          <Globe className="w-3.5 h-3.5" />
                          Public
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          Followers
                        </>
                      )}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Privacy Menu */}
                    <AnimatePresence>
                      {showPrivacyMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-1 bg-[var(--md-surface)] border border-[var(--md-outline-variant)] rounded-xl shadow-lg overflow-hidden z-10 min-w-[150px]"
                        >
                          <button
                            onClick={() => {
                              setPrivacy('public');
                              setShowPrivacyMenu(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-[var(--md-surface-variant)] transition-colors ${
                              privacy === 'public' ? 'text-[var(--md-primary)]' : 'text-[var(--md-on-surface)]'
                            }`}
                          >
                            <Globe className="w-4 h-4" />
                            <span className="text-sm">Public</span>
                          </button>
                          <button
                            onClick={() => {
                              setPrivacy('followers');
                              setShowPrivacyMenu(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-[var(--md-surface-variant)] transition-colors ${
                              privacy === 'followers' ? 'text-[var(--md-primary)]' : 'text-[var(--md-on-surface)]'
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Followers only</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-transparent border-none resize-none outline-none text-[var(--md-on-surface)] text-lg min-h-[120px] placeholder:text-[var(--md-on-surface-variant)]"
                    autoFocus
                  />

                  {/* Image Previews */}
                  {images.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative flex-shrink-0"
                        >
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-xl"
                          />
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--md-error)] text-[var(--md-on-error)] rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-t border-[var(--md-outline-variant)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <ToolbarButton
                    icon={<ImageIcon className="w-5 h-5" />}
                    onClick={handleImageSelect}
                    label="Add image"
                  />
                  <ToolbarButton
                    icon={<LinkIcon className="w-5 h-5" />}
                    onClick={() => insertTag('https://')}
                    label="Add link"
                  />
                  <ToolbarButton
                    icon={<AtSign className="w-5 h-5" />}
                    onClick={() => insertTag('@')}
                    label="Mention user"
                  />
                  <ToolbarButton
                    icon={<Hash className="w-5 h-5" />}
                    onClick={() => insertTag('#')}
                    label="Add hashtag"
                  />
                  <ToolbarButton
                    icon={<Smile className="w-5 h-5" />}
                    onClick={() => {}}
                    label="Add emoji"
                  />
                </div>

                {/* Character Count */}
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-[var(--md-on-surface-variant)]'}`}>
                    {remaining}
                  </span>
                  
                  {/* Progress Circle */}
                  <div className="relative w-6 h-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="var(--md-surface-variant)"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke={isOverLimit ? '#ef4444' : 'var(--md-primary)'}
                        strokeWidth="2"
                        strokeDasharray={`${Math.min((content.length / maxLength) * 62.8, 62.8)} 62.8`}
                        className="transition-all duration-300"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToolbarButton({ 
  icon, 
  onClick, 
  label 
}: { 
  icon: React.ReactNode; 
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="p-2 rounded-full text-[var(--md-primary)] hover:bg-[var(--md-primary-container)]/50 transition-colors"
      title={label}
    >
      {icon}
    </motion.button>
  );
}
