import { useEffect } from 'react';
import { setLastViewedGuide } from '../../lib/progress';
import { recordActivity, markGuideComplete } from '../../utils/gamificationEngine';

interface ProgressTrackerProps {
  guideSlug: string;
  guideTitle: string;
}

/**
 * Progress Tracker Component
 * 
 * Integrates with the merged progress/gamification system.
 * Tracks guide views and completion.
 */
export function ProgressTracker({ guideSlug, guideTitle }: ProgressTrackerProps) {
  useEffect(() => {
    // Track that user viewed this guide (for resume feature)
    setLastViewedGuide(guideSlug, guideTitle);
    
    // Record view activity (triggers streak)
    recordActivity('viewGuide');
    
    // Set up scroll listener for completion tracking
    let hasCompleted = false;
    const COMPLETION_THRESHOLD = 0.8; // 80% scroll
    
    const checkCompletion = () => {
      if (hasCompleted) return;
      
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      
      // Debug logging
      if (scrollPercent > 0.5) {
        console.log('[ProgressTracker] Scroll progress:', Math.round(scrollPercent * 100) + '%');
      }
      
      if (scrollPercent >= COMPLETION_THRESHOLD) {
        console.log('[ProgressTracker] Guide completed:', guideSlug);
        hasCompleted = true;
        markGuideComplete(guideSlug);
      }
    };
    
    // Throttled scroll listener
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkCompletion();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check on mount in case already scrolled
    checkCompletion();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [guideSlug, guideTitle]);
  
  return null; // This is a tracking-only component
}
