import React, { useState, useEffect } from 'react';
import { Check, Circle, Lock, ChevronDown, ArrowLeft, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { loadGamificationData } from '../../utils/gamification';

export interface EnhancedGuideCompletionIndicatorProps {
  guides: Array<{
    slug: string;
    title: string;
  }>;
  currentGuideSlug: string;
  currentGuidePrerequisites?: string[];
  className?: string;
  showPrerequisites?: boolean;
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

export function EnhancedGuideCompletionIndicator({
  guides,
  currentGuideSlug,
  currentGuidePrerequisites = [],
  className,
  showPrerequisites = true,
}: EnhancedGuideCompletionIndicatorProps) {
  const [progress, setProgress] = useState<Record<string, GuideProgress>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [incompletePrereqs, setIncompletePrereqs] = useState<string[]>([]);

  useEffect(() => {
    const loadProgress = () => {
      try {
        const gamificationData = loadGamificationData();
        const completedGuides = gamificationData.progress?.completedGuides || [];
        
        // Convert to component's expected format
        const progressMap: Record<string, GuideProgress> = {};
        completedGuides.forEach((slug: string) => {
          progressMap[slug] = {
            guideId: slug,
            status: 'completed',
            timeSpentSeconds: 0,
            maxScrollDepth: 100,
            checklistCompleted: [],
            lastVisitedAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
          };
        });
        
        setProgress(progressMap);
        
        // Check incomplete prerequisites
        if (currentGuidePrerequisites.length > 0) {
          const incomplete = currentGuidePrerequisites.filter(
            prereq => !completedGuides.includes(prereq)
          );
          setIncompletePrereqs(incomplete);
        }
      } catch (error) {
        console.error('[EnhancedGuideCompletionIndicator] Error loading progress:', error);
        setProgress({});
      }
    };
    
    loadProgress();
    const interval = setInterval(loadProgress, 2000);
    return () => clearInterval(interval);
  }, [currentGuideSlug, currentGuidePrerequisites]);

  const currentIndex = guides.findIndex(g => g.slug === currentGuideSlug);
  const completedCount = Object.values(progress).filter(
    g => g.status === 'completed'
  ).length;
  const completionPercentage = Math.round((completedCount / guides.length) * 100);

  const getGuideStatus = (guideSlug: string) => {
    const guideProgress = progress[guideSlug];
    if (guideProgress?.status === 'completed') return 'completed';
    if (guideProgress?.status === 'engaged') return 'engaged';
    if (guideProgress?.status === 'viewed') return 'viewed';
    return 'not-started';
  };

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
          
          {/* Prerequisites warning in collapsed view */}
          {showPrerequisites && incompletePrereqs.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3 w-3" />
              <span>{incompletePrereqs.length} prerequisite{incompletePrereqs.length > 1 ? 's' : ''} incomplete</span>
            </div>
          )}
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
          {/* Prerequisites section (if any incomplete) */}
          {showPrerequisites && incompletePrereqs.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Prerequisites to complete
                </span>
              </div>
              <div className="space-y-2">
                {incompletePrereqs.slice(0, 3).map((prereqSlug) => {
                  const prereqGuide = guides.find(g => g.slug === prereqSlug);
                  if (!prereqGuide) return null;
                  
                  return (
                    <a
                      key={prereqSlug}
                      href={`/guides/${prereqSlug}`}
                      className="flex items-center gap-2 p-2 rounded-md bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500 transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {prereqGuide.title}
                      </span>
                      <span className="ml-auto text-xs text-amber-600 dark:text-amber-400">
                        Go to guide →
                      </span>
                    </a>
                  );
                })}
                {incompletePrereqs.length > 3 && (
                  <p className="text-xs text-amber-700 dark:text-amber-300 pl-2">
                    +{incompletePrereqs.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1">
            {guides.map((guide, index) => {
              const guideProgress = progress[guide.slug];
              const isCompleted = guideProgress?.status === 'completed';
              const isCurrent = guide.slug === currentGuideSlug;
              const status = getGuideStatus(guide.slug);
              
              // Check if this guide is a prerequisite for the current guide
              const isPrerequisite = currentGuidePrerequisites.includes(guide.slug);
              const isIncompletePrereq = incompletePrereqs.includes(guide.slug);
              
              // Determine if guide should be locked
              const isLocked = index > currentIndex && !isCompleted && !guideProgress;

              return (
                <a
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className={cn(
                    'flex items-center gap-3 p-2.5 rounded-lg transition-colors relative',
                    isCurrent && 'bg-primary/10 border border-primary/20',
                    isCompleted && !isCurrent && 'hover:bg-gray-100 dark:hover:bg-gray-800',
                    !isCompleted && !isCurrent && !isLocked && 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                    isLocked && 'opacity-50 cursor-not-allowed',
                    isIncompletePrereq && !isCurrent && 'bg-amber-50/50 dark:bg-amber-900/10'
                  )}
                  onClick={isLocked ? (e) => e.preventDefault() : undefined}
                >
                  {/* Status indicator */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative',
                      isCompleted && 'bg-green-500 text-white',
                      isCurrent && 'bg-primary text-white',
                      !isCompleted && !isCurrent && !isLocked && 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
                      isLocked && 'bg-gray-100 dark:bg-gray-800 text-gray-400',
                      isIncompletePrereq && !isCurrent && !isCompleted && 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isLocked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                    
                    {/* Prerequisite indicator dot */}
                    {isPrerequisite && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white dark:border-gray-900" 
                           title="Prerequisite for current guide" />
                    )}
                  </div>

                  {/* Guide info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        isCurrent && 'text-primary',
                        isIncompletePrereq && !isCurrent && 'text-amber-700 dark:text-amber-300',
                        !isCurrent && !isIncompletePrereq && 'text-gray-900 dark:text-white'
                      )}
                    >
                      {guide.title}
                    </p>
                    
                    {/* Status label */}
                    {isPrerequisite && (
                      <p className={cn(
                        'text-xs',
                        isIncompletePrereq 
                          ? 'text-amber-600 dark:text-amber-400' 
                          : 'text-green-600 dark:text-green-400'
                      )}>
                        {isIncompletePrereq ? 'Prerequisite (incomplete)' : 'Prerequisite ✓'}
                      </p>
                    )}
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
