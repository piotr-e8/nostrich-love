import React, { useState, useEffect } from 'react';
import { useProgressTracking } from '../../lib/useProgressTracking';
import { shouldShowProgressIndicators } from '../../lib/progressService';
import { LEARNING_PATHS } from '../../data/learning-paths';

interface MinimalProgressBarProps {
  guideId: string;
  estimatedTimeMinutes: number;
}

export function MinimalProgressBar({ guideId, estimatedTimeMinutes }: MinimalProgressBarProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { scrollProgress } = useProgressTracking({
    guideId,
    estimatedTimeMinutes,
  });
  
  // Don't show if not mounted yet or user hasn't opted in
  if (!mounted || !shouldShowProgressIndicators()) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress * 100}%` }}
        aria-hidden="true"
      />
    </div>
  );
}

interface GuidePositionIndicatorProps {
  currentGuide: number;
  totalGuides: number;
}

export function GuidePositionIndicator({ currentGuide, totalGuides }: GuidePositionIndicatorProps) {
  const [mounted, setMounted] = useState(false);
  const [activePath, setActivePath] = useState<string>('general');
  const [pathBasedPosition, setPathBasedPosition] = useState<{ current: number; total: number } | null>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Get active path from localStorage (using merged gamification key)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nostrich-gamification-v1');
        if (stored) {
          const data = JSON.parse(stored);
          setActivePath(data.progress?.activePath || 'general');
        }
      } catch (e) {
        console.error('Error reading path:', e);
      }
    }
  }, []);
  
  // Calculate path-based position on client side
  useEffect(() => {
    if (activePath === 'general' || typeof window === 'undefined') return;
    
    // Import dynamically to avoid SSR issues
    import('../../data/learning-paths').then(({ LEARNING_PATHS, getGuidePositionInPath, getPathLength }) => {
      const currentSlug = window.location.pathname.split('/').pop();
      if (currentSlug && LEARNING_PATHS[activePath]?.sequence.includes(currentSlug)) {
        const position = getGuidePositionInPath(currentSlug, activePath);
        const length = getPathLength(activePath);
        setPathBasedPosition({ current: position, total: length });
      }
    });
  }, [activePath]);
  
  if (!mounted || !shouldShowProgressIndicators()) return null;
  
  // Use path-based position if available, otherwise fall back to props
  const displayCurrent = pathBasedPosition?.current || currentGuide;
  const displayTotal = pathBasedPosition?.total || totalGuides;
  const pathLabel = activePath !== 'general' ? ` (${LEARNING_PATHS[activePath as keyof typeof LEARNING_PATHS]?.label || activePath})` : '';
  
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
      Guide {displayCurrent} of {displayTotal}
      {pathLabel && <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">{pathLabel}</span>}
    </div>
  );
}

interface GuideCardProgressProps {
  guideId: string;
}

export function GuideCardProgress({ guideId }: GuideCardProgressProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted || !shouldShowProgressIndicators()) return null;
  
  // This is a placeholder - in real implementation, you'd check guide status
  // and show a subtle dot or arc
  return (
    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
  );
}