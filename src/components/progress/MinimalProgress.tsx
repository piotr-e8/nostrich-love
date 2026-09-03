import React, { useState, useEffect } from 'react';
import { useProgressTracking } from '../../lib/useProgressTracking';
import { shouldShowProgressIndicators } from '../../lib/progressService';

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
    <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
      <div
        className="h-full bg-primary-600 transition-[width] duration-300 ease-out dark:bg-primary-400 motion-reduce:transition-none"
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !shouldShowProgressIndicators()) return null;

  return (
    <div className="text-body-sm font-medium text-gray-500 dark:text-gray-400">
      Guide {currentGuide} of {totalGuides}
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
    <div className="absolute end-2 top-2 h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
  );
}
