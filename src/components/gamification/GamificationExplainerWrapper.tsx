/**
 * GamificationExplainerWrapper Component
 * 
 * Wrapper for GamificationExplainer that manages its own state
 * Designed for use in Astro pages
 */

import React, { useState, useEffect } from 'react';
import { GamificationExplainer } from './GamificationExplainer';
import { getPassedQuizzes, getCompletedGuides, QUIZ_COMPLETED_EVENT } from '../../utils/gamification';
import { getAllGuidesOrdered } from '../../data/learning-paths';

interface GamificationExplainerWrapperProps {
  buttonId?: string;
  currentProgress?: number;
  totalGuides?: number;
  quizzesPassed?: number;
}

export function GamificationExplainerWrapper({
  buttonId = 'how-does-this-work-btn',
  currentProgress,
  totalGuides = getAllGuidesOrdered().length,
  quizzesPassed,
}: GamificationExplainerWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  // The page renders this island with no props, so anything not read here shows
  // as zero. Read on open rather than on mount: the reader may have finished a
  // quiz further up the page since this island hydrated.
  const [live, setLive] = useState({ guides: 0, quizzes: 0 });

  useEffect(() => {
    if (!isOpen) return;
    setLive({ guides: getCompletedGuides().length, quizzes: getPassedQuizzes().length });
  }, [isOpen]);

  useEffect(() => {
    const refresh = () =>
      setLive({ guides: getCompletedGuides().length, quizzes: getPassedQuizzes().length });
    window.addEventListener(QUIZ_COMPLETED_EVENT, refresh);
    return () => window.removeEventListener(QUIZ_COMPLETED_EVENT, refresh);
  }, []);

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
      currentProgress={currentProgress ?? live.guides}
      totalGuides={totalGuides}
      quizzesPassed={quizzesPassed ?? live.quizzes}
    />
  );
}

export default GamificationExplainerWrapper;
