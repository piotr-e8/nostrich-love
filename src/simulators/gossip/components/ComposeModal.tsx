import React, { useState } from 'react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string) => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  onPost,
}) => {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (content.trim()) {
      onPost(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="gossip-modal-overlay" onClick={onClose}>
      <div className="gossip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gossip-modal-header">
          <h3 className="gossip-modal-title">Compose Note</h3>
          <button className="gossip-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="gossip-compose-body">
          <textarea
            className="gossip-compose-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <div className="gossip-compose-footer">
          <div className="gossip-compose-hint">
            Press <kbd>⌘</kbd> + <kbd>Enter</kbd> to post, <kbd>Esc</kbd> to cancel
          </div>
          <div className="gossip-compose-actions">
            <button className="gossip-btn gossip-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="gossip-btn gossip-btn-primary" 
              onClick={handleSubmit}
              disabled={!content.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;
