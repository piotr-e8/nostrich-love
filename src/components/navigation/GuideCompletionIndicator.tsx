import React, { useState, useEffect } from 'react';
import { Check, Circle, Lock, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getProgressData } from '../../lib/progressService';

interface GuideCompletionIndicatorProps {
  guides: Array<{
    slug: string;
    title: string;
  }>;
  currentGuideSlug: string;
  className?: string;
}

interface GuideProgress {
  guideId: string;
  status: 'not-started' | 'viewed' | 'engaged' | 'completed';
  timeSpentSeconds: number;
  maxScrollDepth: number;
  checklistCompleted: string[];
  lastVisitedAt: string;
  completedAt?: string;
}

export function GuideCompletionIndicator({
  guides,
  currentGuideSlug,
  className,
}: GuideCompletionIndicatorProps) {
  const [progress, setProgress] = useState<Record<string, GuideProgress>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load progress immediately
    const loadProgress = () => {
      const data = getProgressData();
      setProgress(data.guides);
    };
    
    loadProgress();
    
    // Poll for updates every 2 seconds to reflect real-time progress
    const interval = setInterval(loadProgress, 2000);
    
    return () => clearInterval(interval);
  }, [currentGuideSlug]);

  const currentIndex = guides.findIndex(g => g.slug === currentGuideSlug);
  const completedCount = Object.values(progress).filter(
    g => g.status === 'completed'
  ).length;
  const completionPercentage = Math.round((completedCount / guides.length) * 100);

  return (
    <div className={cn('relative', className)}>
      {/* Collapsed view - shows current position and mini progress */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/30 dark:hover:border-primary/30 transition-all w-full"
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Learning Progress
            </span>
            <span className="text-xs font-medium text-primary">
              {completionPercentage}% Complete
            </span>
          </div>
          
          {/* Mini progress bar */}
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-xs">{currentIndex + 1}/{guides.length}</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Expanded view - shows all guides as a timeline */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl z-50 max-h-[60vh] overflow-y-auto">
          <div className="space-y-1">
            {guides.map((guide, index) => {
              const guideProgress = progress[guide.slug];
              const isCompleted = guideProgress?.status === 'completed';
              const isCurrent = guide.slug === currentGuideSlug;
              const isLocked = index > currentIndex && !isCompleted && !guideProgress;

              return (
                <a
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className={cn(
                    'flex items-center gap-3 p-2.5 rounded-lg transition-colors',
                    isCurrent && 'bg-primary/10 border border-primary/20',
                    isCompleted && !isCurrent && 'hover:bg-gray-100 dark:hover:bg-gray-800',
                    !isCompleted && !isCurrent && !isLocked && 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                    isLocked && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={isLocked ? (e) => e.preventDefault() : undefined}
                >
                  {/* Status indicator */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      isCompleted && 'bg-green-500 text-white',
                      isCurrent && 'bg-primary text-white',
                      !isCompleted && !isCurrent && !isLocked && 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
                      isLocked && 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isLocked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>

                  {/* Guide info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        isCurrent && 'text-primary',
                        !isCurrent && 'text-gray-900 dark:text-white'
                      )}
                    >
                      {guide.title}
                    </p>
                  </div>

                  {/* Current indicator */}
                  {isCurrent && (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                      Current
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Summary stats */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {completedCount} of {guides.length} guides completed
              </span>
              {completedCount === guides.length && (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  All done! 🎉
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
