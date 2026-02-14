import { useEffect } from 'react';
import { setLastViewedGuide, markGuideCompleted } from '../../lib/progress';

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
    
    // Set up scroll listener for completion tracking
    let hasCompleted = false;
    const COMPLETION_THRESHOLD = 0.8; // 80% scroll
    
    const checkCompletion = () => {
      if (hasCompleted) return;
      
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      
      if (scrollPercent >= COMPLETION_THRESHOLD) {
        hasCompleted = true;
        markGuideCompleted(guideSlug);
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
