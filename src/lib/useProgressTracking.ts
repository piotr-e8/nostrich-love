import { useEffect, useRef, useCallback, useState } from 'react';
import {
  getGuideProgress,
  updateGuideProgress,
  calculateCompletionStatus,
  shouldShowProgressIndicators,
} from './progressService';

interface UseProgressTrackingOptions {
  guideId: string;
  estimatedTimeMinutes: number;
  hasChecklist?: boolean;
}

interface UseProgressTrackingReturn {
  progress: ReturnType<typeof getGuideProgress>;
  scrollProgress: number;
  timeSpentSeconds: number;
  updateChecklistItem: (itemId: string, completed: boolean) => void;
}

export function useProgressTracking({
  guideId,
  estimatedTimeMinutes,
  hasChecklist = false,
}: UseProgressTrackingOptions): UseProgressTrackingReturn {
  const [progress, setProgress] = useState(() => getGuideProgress(guideId));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  
  // Load saved progress on mount and when guideId changes
  useEffect(() => {
    if (!shouldShowProgressIndicators()) return;
    
    const savedProgress = getGuideProgress(guideId);
    if (savedProgress) {
      // Restore the max scroll depth
      maxScrollRef.current = savedProgress.maxScrollDepth || 0;
      setScrollProgress(savedProgress.maxScrollDepth || 0);
    }
    
    // Check current scroll position on mount (in case user is already scrolled)
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    
    if (scrollPercent > maxScrollRef.current) {
      maxScrollRef.current = scrollPercent;
      setScrollProgress(scrollPercent);
    }
  }, [guideId]);
  const rafIdRef = useRef<number | null>(null);
  const isActiveRef = useRef<boolean>(true);
  
  // Track time spent
  useEffect(() => {
    if (!shouldShowProgressIndicators()) return;
    
    const interval = setInterval(() => {
      if (isActiveRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeSpentSeconds(elapsed);
        
        // Update progress every 10 seconds
        if (elapsed % 10 === 0) {
          // Calculate new status based on time spent
          const newStatus = calculateCompletionStatus(guideId, estimatedTimeMinutes, hasChecklist);
          
          updateGuideProgress(guideId, {
            timeSpentSeconds: elapsed,
            status: newStatus,
          });
          
          // Update local progress state
          setProgress(getGuideProgress(guideId));
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [guideId, estimatedTimeMinutes, hasChecklist]);
  
  // Track scroll depth
  useEffect(() => {
    if (!shouldShowProgressIndicators()) return;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      
      if (scrollPercent > maxScrollRef.current) {
        maxScrollRef.current = scrollPercent;
        setScrollProgress(scrollPercent);
        
        // Update progress when scroll changes significantly
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          // Calculate new status based on scroll progress
          const newStatus = calculateCompletionStatus(guideId, estimatedTimeMinutes, hasChecklist);
          
          updateGuideProgress(guideId, {
            maxScrollDepth: maxScrollRef.current,
            status: newStatus,
          });
          
          // Update local progress state
          setProgress(getGuideProgress(guideId));
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [guideId, estimatedTimeMinutes, hasChecklist]);
  
  // Track visibility changes (pause when tab not active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = document.visibilityState === 'visible';
      if (isActiveRef.current) {
        // Reset start time to avoid counting inactive time
        startTimeRef.current = Date.now() - (timeSpentSeconds * 1000);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [timeSpentSeconds]);
  
  // Update checklist item
  const updateChecklistItem = useCallback((itemId: string, completed: boolean) => {
    if (!shouldShowProgressIndicators()) return;
    
    const current = getGuideProgress(guideId);
    const checklist = current?.checklistCompleted || [];
    
    let updatedChecklist: string[];
    if (completed && !checklist.includes(itemId)) {
      updatedChecklist = [...checklist, itemId];
    } else if (!completed && checklist.includes(itemId)) {
      updatedChecklist = checklist.filter(id => id !== itemId);
    } else {
      updatedChecklist = checklist;
    }
    
    // Recalculate status
    const newStatus = calculateCompletionStatus(guideId, estimatedTimeMinutes, hasChecklist);
    
    updateGuideProgress(guideId, {
      checklistCompleted: updatedChecklist,
      status: newStatus,
    });
    
    setProgress(getGuideProgress(guideId));
  }, [guideId, estimatedTimeMinutes, hasChecklist]);
  
  return {
    progress,
    scrollProgress,
    timeSpentSeconds,
    updateChecklistItem,
  };
}