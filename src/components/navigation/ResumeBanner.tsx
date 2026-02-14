import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Clock, ChevronRight, X, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LEARNING_PATHS } from '../../data/learning-paths';
import { getLastViewedGuide, getCurrentPathProgress, hasRecentProgress, getActivePath } from '../../lib/progress';

interface ResumeBannerProps {
  className?: string;
}

export function ResumeBanner({ className }: ResumeBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastViewed, setLastViewed] = useState<ReturnType<typeof getLastViewedGuide>>(null);
  const [pathProgress, setPathProgress] = useState<ReturnType<typeof getCurrentPathProgress> | null>(null);
  const [activePath, setActivePath] = useState<string>('beginner');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for recent progress
    if (hasRecentProgress()) {
      const lastGuide = getLastViewedGuide();
      const path = getActivePath();
      const progress = getCurrentPathProgress();
      
      setLastViewed(lastGuide);
      setActivePath(path);
      setPathProgress(progress);
      
      // Check if dismissed in this session
      const dismissed = sessionStorage.getItem('nostrich-resume-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('nostrich-resume-dismissed', 'true');
  };

  const handleResume = () => {
    if (lastViewed?.slug) {
      window.location.href = `/guides/${lastViewed.slug}`;
    }
  };

  const handleViewProgress = () => {
    window.location.href = '/guides';
  };

  const handleSwitchPath = () => {
    window.location.href = '/guides';
  };

  if (!mounted || !isVisible || isDismissed || !lastViewed) {
    return null;
  }

  const pathConfig = LEARNING_PATHS[activePath];
  const pathLabel = pathConfig?.label || 'Your Path';
  const pathIcon = pathConfig?.icon || '📚';
  
  // Calculate time since last viewed
  const timeSince = Date.now() - lastViewed.timestamp;
  const daysSince = Math.floor(timeSince / (1000 * 60 * 60 * 24));
  const hoursSince = Math.floor(timeSince / (1000 * 60 * 60));
  
  let timeText: string;
  if (daysSince > 0) {
    timeText = daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`;
  } else if (hoursSince > 0) {
    timeText = hoursSince === 1 ? '1 hour ago' : `${hoursSince} hours ago`;
  } else {
    timeText = 'Recently';
  }

  // Calculate progress percentage
  const progressPercentage = pathProgress?.percentage || 0;
  const completedCount = pathProgress?.completed || 0;
  const totalCount = pathProgress?.total || pathConfig?.sequence.length || 0;
  const nextGuide = pathProgress?.nextGuide;

  return (
    <div 
      className={cn(
        'w-full bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 border-b border-primary/20',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left side - Welcome back message */}
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
              {pathIcon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Welcome back!
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Continue your {pathLabel} journey
                </span>
              </div>
              
              {/* Last viewed guide */}
              <div className="mt-2 flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-gray-700 dark:text-gray-300">
                  You were reading: <strong className="text-gray-900 dark:text-white">{lastViewed.title}</strong>
                </span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeText}
                </span>
              </div>

              {/* Progress bar */}
              {progressPercentage > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {progressPercentage}%
                  </span>
                </div>
              )}

              {/* Progress text */}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {completedCount} of {totalCount} guides completed
                {nextGuide && (
                  <span className="ml-2">
                    • Next: <span className="text-primary font-medium">{formatGuideTitle(nextGuide)}</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleResume}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              Resume Guide
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleViewProgress}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              View Progress
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSwitchPath}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Switch Path
            </button>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 sm:static p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to format guide slug to title
function formatGuideTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
