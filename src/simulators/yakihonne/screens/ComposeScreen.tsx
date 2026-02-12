import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Image as ImageIcon, 
  Link, 
  Hash, 
  AtSign, 
  Send,
  FileText,
  Video,
  Globe
} from 'lucide-react';
import { ContentTabs } from '../components/ContentTabs';

interface ComposeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string, type: 'post' | 'article' | 'media') => void;
  initialType?: 'post' | 'article' | 'media';
}

export function ComposeScreen({ isOpen, onClose, onPost, initialType = 'post' }: ComposeScreenProps) {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'post' | 'article' | 'media'>(initialType);
  const [articleTitle, setArticleTitle] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() && selectedImages.length === 0) return;
    if (postType === 'article' && !articleTitle.trim()) return;

    setIsPosting(true);
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onPost(content, postType);
    setContent('');
    setArticleTitle('');
    setSelectedImages([]);
    setIsPosting(false);
    onClose();
  };

  const getPlaceholder = () => {
    switch (postType) {
      case 'article':
        return 'Write your article content...';
      case 'media':
        return 'Add a caption for your media...';
      default:
        return "What's on your mind?";
    }
  };

  const charLimit = postType === 'post' ? 280 : 10000;
  const charCount = content.length;
  const isOverLimit = charCount > charLimit;

  const handleImageSelect = () => {
    // Simulate image selection
    const mockImages = [
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setSelectedImages(prev => [...prev, randomImage]);
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[var(--yh-surface)] w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--yh-border)]">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-[var(--yh-text-secondary)]" />
              </button>
              
              <div className="flex items-center gap-2">
                {postType === 'post' && (
                  <span className={`text-sm font-medium ${isOverLimit ? 'text-red-500' : 'text-[var(--yh-text-tertiary)]'}`}>
                    {charCount}/{charLimit}
                  </span>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={(!content.trim() && selectedImages.length === 0) || isOverLimit || isPosting}
                  className="yakihonne-btn yakihonne-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPosting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {postType === 'article' ? 'Publish' : 'Post'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Type Selector */}
            <div className="px-4 pt-4">
              <ContentTabs
                tabs={[
                  { id: 'post', label: 'Post', icon: Globe },
                  { id: 'article', label: 'Article', icon: FileText },
                  { id: 'media', label: 'Media', icon: Video },
                ]}
                activeTab={postType}
                onTabChange={(tab) => setPostType(tab as typeof postType)}
              />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Article Title Input */}
              {postType === 'article' && (
                <input
                  type="text"
                  placeholder="Article Title"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full text-xl font-bold bg-transparent border-none outline-none placeholder:text-[var(--yh-text-tertiary)] mb-4 text-[var(--yh-text-primary)]"
                />
              )}

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full min-h-[150px] bg-transparent border-none outline-none resize-none text-[var(--yh-text-primary)] placeholder:text-[var(--yh-text-tertiary)]"
                autoFocus
              />

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={image} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Toolbar */}
            <div className="yakihonne-compose-toolbar">
              <button 
                onClick={handleImageSelect}
                className="yakihonne-toolbar-btn"
                title="Add Image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="yakihonne-toolbar-btn" title="Add Link">
                <Link className="w-5 h-5" />
              </button>
              <button className="yakihonne-toolbar-btn" title="Add Hashtag">
                <Hash className="w-5 h-5" />
              </button>
              <button className="yakihonne-toolbar-btn" title="Mention User">
                <AtSign className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ComposeScreen;
