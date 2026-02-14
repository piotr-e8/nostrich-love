/**
 * GamificationExplainerWrapper Component
 * 
 * Wrapper for GamificationExplainer that manages its own state
 * Designed for use in Astro pages
 */

import React, { useState, useEffect } from 'react';
import { GamificationExplainer } from './GamificationExplainer';

interface GamificationExplainerWrapperProps {
  buttonId?: string;
  currentProgress?: number;
  totalGuides?: number;
  currentStreak?: number;
}

export function GamificationExplainerWrapper({
  buttonId = 'how-does-this-work-btn',
  currentProgress = 0,
  totalGuides = 15,
  currentStreak = 0,
}: GamificationExplainerWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Find the button by ID and attach click handler
    const button = document.getElementById(buttonId);
    
    if (button) {
      const handleClick = () => setIsOpen(true);
      button.addEventListener('click', handleClick);
      
      return () => {
        button.removeEventListener('click', handleClick);
      };
    }
  }, [buttonId]);

  // Also check for hash in URL
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#how-it-works') {
      setIsOpen(true);
      // Clear the hash
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <GamificationExplainer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      currentProgress={currentProgress}
      totalGuides={totalGuides}
      currentStreak={currentStreak}
    />
  );
}

export default GamificationExplainerWrapper;
