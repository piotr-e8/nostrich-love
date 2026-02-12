import React from 'react';

interface OnboardingTourProps {
  onClose: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onClose }) => {
  return (
    <div className="gossip-tour-overlay">
      <div className="gossip-tour">
        <div className="gossip-tour-header">
          <h2 className="gossip-tour-title">Welcome to Gossip</h2>
          <p className="gossip-tour-subtitle">
            A powerful desktop Nostr client built for efficiency
          </p>
        </div>

        <div className="gossip-tour-content">
          <div className="gossip-tour-step">
            <div className="gossip-tour-step-number">1</div>
            <div className="gossip-tour-step-content">
              <h4>Split-Pane Layout</h4>
              <p>Drag the sidebar edge to resize. Keep your feed visible while browsing threads.</p>
            </div>
          </div>

          <div className="gossip-tour-step">
            <div className="gossip-tour-step-number">2</div>
            <div className="gossip-tour-step-content">
              <h4>Keyboard Navigation</h4>
              <p>Use keyboard shortcuts to navigate quickly between sections.</p>
            </div>
          </div>

          <div className="gossip-tour-step">
            <div className="gossip-tour-step-number">3</div>
            <div className="gossip-tour-step-content">
              <h4>Advanced Relay Management</h4>
              <p>Configure multiple relays with granular control over read/write permissions.</p>
            </div>
          </div>

          <div className="gossip-tour-keyboard">
            <h4>Keyboard Shortcuts</h4>
            <div className="gossip-keyboard-row">
              <span>Navigate sections</span>
              <span><span className="gossip-keyboard-key">⌘1</span> - <span className="gossip-keyboard-key">⌘4</span></span>
            </div>
            <div className="gossip-keyboard-row">
              <span>Compose new note</span>
              <span><span className="gossip-keyboard-key">⌘N</span></span>
            </div>
            <div className="gossip-keyboard-row">
              <span>Close modal / Go back</span>
              <span><span className="gossip-keyboard-key">Esc</span></span>
            </div>
            <div className="gossip-keyboard-row">
              <span>Post note</span>
              <span><span className="gossip-keyboard-key">⌘Enter</span></span>
            </div>
          </div>
        </div>

        <div className="gossip-tour-footer">
          <button className="gossip-btn gossip-btn-primary" onClick={onClose}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
