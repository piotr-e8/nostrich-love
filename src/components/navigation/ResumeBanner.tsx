import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Clock, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SKILL_LEVELS, getGuideLevel, type SkillLevel } from '../../data/learning-paths';
import { getActiveLevel, getLevelProgress } from '../../utils/gamification';
import { getLastViewedGuide, hasRecentProgress } from '../../lib/progress';
import { guidePathFromLocation } from "../../i18n/paths";

interface ResumeBannerProps {
  className?: string;
}

export function ResumeBanner({ className }: ResumeBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastViewed, setLastViewed] = useState<ReturnType<typeof getLastViewedGuide>>(null);
  const [levelProgress, setLevelProgress] = useState<ReturnType<typeof getLevelProgress> | null>(null);
  const [currentLevel, setCurrentLevelState] = useState<SkillLevel>('beginner');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for recent progress
    if (hasRecentProgress()) {
      const lastGuide = getLastViewedGuide();
      // Derived, never read from storage. `progress.currentLevel` (and the
      // `level` field on the last-viewed record, which copies it) is written
      // once by the Layout bootstrap and never again, so reading it pinned
      // every returning reader to Beginner forever. The level of the guide
      // they were actually reading is the one this banner is talking about;
      // getActiveLevel() (first unfinished level) covers a slug that is no
      // longer in the course spine.
      const level =
        (lastGuide?.slug ? getGuideLevel(lastGuide.slug) : null) ?? getActiveLevel();
      const progress = getLevelProgress(level);

      setLastViewed(lastGuide);
      setCurrentLevelState(level);
      setLevelProgress(progress);
      
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
      window.location.href = guidePathFromLocation(lastViewed.slug);
    }
  };

  const handleViewProgress = () => {
    // /progress is a single un-localized page (src/pages/progress.astro), so
    // there is no locale prefix to build here.
    window.location.href = '/progress';
  };

  if (!mounted || !isVisible || isDismissed || !lastViewed) {
    return null;
  }

  const levelConfig = SKILL_LEVELS[currentLevel];
  const levelLabel = levelConfig?.label || 'Your Level';
  const levelIcon = levelConfig?.icon || '📚';

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

  // Calculate progress
  const progressPercentage = levelProgress?.percentage || 0;
  const completedCount = levelProgress?.completed || 0;
  const totalCount = levelProgress?.total || levelConfig?.sequence.length || 0;

  return (
    <div
      className={cn(
        'w-full bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 border-b border-primary/20',
        className
      )}
    >
      {/* One row at every width. On a phone this is a strip offering to resume:
          the greeting, the timestamp, the progress bar and the secondary button
          are all sm:-only, because the full panel used to push the page h1 off
          the first screen. Everything hidden here is on /progress. */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Level icon */}
          <div className="flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl sm:text-2xl">
            {levelIcon}
          </div>

          <div className="flex-1 min-w-0">
            {/* Greeting — desktop only */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Welcome back!
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Continue your {levelLabel} journey
              </span>
            </div>

            {/* Last viewed guide — the one line that stays on mobile */}
            <div className="flex items-center gap-2 text-sm min-w-0 sm:mt-2">
              <BookOpen className="w-4 h-4 flex-shrink-0 text-primary-600 dark:text-primary-400" />
              <span className="text-gray-700 dark:text-gray-300 truncate">
                You were reading:{' '}
                <strong className="text-gray-900 dark:text-white">{lastViewed.title}</strong>
              </span>
              <span className="hidden sm:inline text-gray-400 dark:text-gray-500">•</span>
              <span className="hidden sm:flex text-gray-400 dark:text-gray-500 items-center gap-1 whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {timeText}
              </span>
            </div>

            {/* Progress bar — desktop only */}
            {progressPercentage > 0 && (
              <div className="hidden sm:flex mt-3 items-center gap-3">
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

            {/* Progress text — desktop only */}
            <p className="hidden sm:block mt-1 text-sm text-gray-500 dark:text-gray-400">
              {completedCount}/{totalCount} {levelLabel} guides completed
            </p>
          </div>

          {/* Actions */}
          <button
            onClick={handleResume}
            className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Resume
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            onClick={handleViewProgress}
            className="hidden sm:inline-flex flex-shrink-0 items-center justify-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            View Progress
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          {/* Dismiss — a plain flex item. It used to be absolutely positioned
              with no positioned ancestor, which put it under the sticky header
              on mobile: invisible, and the tap hit the header. */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
