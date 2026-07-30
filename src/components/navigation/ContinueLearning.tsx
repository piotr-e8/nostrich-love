import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, X, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SKILL_LEVELS, type SkillLevel, getNextLevel, getGuideLevel } from '../../data/learning-paths';
import {
  getCompletedGuidesInLevel as getCompletedInLevel,
  getLevelProgressLocal as getLevelProgress,
} from '../../lib/progress';
import { useTranslation } from '../../hooks/useTranslation';
import { guidesIndexPath } from "../../i18n/paths";
import type { Locale } from '../../config/locales';

// Session-scoped dismissal. Deliberately plain sessionStorage, NOT routed
// through progressService: dismissing a prompt is a transient UI preference,
// not progress tracking, so it must keep working with tracking disabled.
const DISMISS_KEY = 'nostrich-continue-learning-dismissed';

function readSessionDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    // SSR, Safari private mode, or storage disabled — start undismissed.
    return false;
  }
}

interface ContinueLearningProps {
  nextGuide?: {
    slug: string;
    title: string;
    description?: string;
  };
  guideTitles?: Record<string, string>; // Map of slug -> title
  threshold?: number; // Scroll percentage threshold (0-1)
  className?: string;
  hasQuiz?: boolean; // Whether the current guide has a quiz
  quizSelector?: string; // CSS selector for quiz element (default: '[data-quiz]')
  locale?: Locale;
}

interface MobileBarProps {
  label: string;
  title?: string;
  action: { href: string } | { onClick: () => void };
  actionLabel: string;
  actionIcon: React.ReactNode;
  onDismiss: () => void;
  dismissLabel: string;
  className?: string;
}

/**
 * Slim bottom bar shown below `md` instead of the floating cards, which
 * covered most of a phone screen (audit #104). One row: state label +
 * truncated target, a 44px primary action, and a 44px dismiss.
 */
function MobileBar({
  label,
  title,
  action,
  actionLabel,
  actionIcon,
  onDismiss,
  dismissLabel,
  className,
}: MobileBarProps) {
  const actionClasses =
    'inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors';

  return (
    <div
      className={cn(
        'fixed bottom-0 start-0 end-0 z-40 md:hidden',
        'border-t border-primary/30 bg-white dark:bg-gray-900 shadow-lg',
        'pb-[env(safe-area-inset-bottom)]',
        'animate-in fade-in slide-in-from-bottom-4 duration-500',
        className
      )}
    >
      <div className="flex items-center gap-1.5 ps-4 pe-1.5 py-1.5">
        <div className="min-w-0 flex-1">
          <span className="block text-xs font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
            {label}
          </span>
          {title && (
            <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </span>
          )}
        </div>

        {'href' in action ? (
          <a href={action.href} aria-label={actionLabel} className={actionClasses}>
            {actionIcon}
          </a>
        ) : (
          <button type="button" onClick={action.onClick} aria-label={actionLabel} className={actionClasses}>
            {actionIcon}
          </button>
        )}

        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function ContinueLearning({
  nextGuide: initialNextGuide,
  guideTitles,
  threshold = 0.8,
  className,
  hasQuiz = false,
  quizSelector = '[data-quiz], [id*="quiz"], [class*="quiz"]',
  locale = 'en',
}: ContinueLearningProps) {
  const { t } = useTranslation();
  const guidesPrefix = guidesIndexPath(locale).replace(/\/$/, '');
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(readSessionDismissed);
  const [isViewingQuiz, setIsViewingQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [nextGuide, setNextGuide] = useState(initialNextGuide);
  const [currentLevel, setCurrentLevel] = useState<SkillLevel>('beginner');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [nextLevelInfo, setNextLevelInfo] = useState<{
    level: SkillLevel | null;
    unlocked: boolean;
    guidesNeeded: number;
    completedCount: number;
    totalInCurrent: number;
  } | null>(null);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Best effort — the in-memory flag still hides it for this page view.
    }
  }, []);

  // Calculate level-based next guide on mount
  useEffect(() => {
    try {
      const pathParts = window.location.pathname.split('/');
      const currentSlug = pathParts[pathParts.length - 1];

      // Determine which level this guide belongs to (not user's current level)
      const guideLevel = getGuideLevel(currentSlug);

      if (!guideLevel) {
        // Guide not found in any level
        setNextGuide(undefined);
        setIsLevelComplete(false);
        return;
      }

      setCurrentLevel(guideLevel);

      const levelConfig = SKILL_LEVELS[guideLevel];
      const levelProgress = getLevelProgress(guideLevel);
      const completedCount = getCompletedInLevel(guideLevel).length;
      const totalInLevel = levelConfig.sequence.length;

      // Check if current level is complete
      const isComplete = completedCount >= totalInLevel;
      setIsLevelComplete(isComplete);

      // Get next level info
      const nextLevel = getNextLevel(guideLevel);
      if (nextLevel) {
        // Nothing is gated any more.
        const nextUnlocked = true;
        const guidesNeeded = 0;

        setNextLevelInfo({
          level: nextLevel,
          unlocked: nextUnlocked,
          guidesNeeded,
          completedCount,
          totalInCurrent: totalInLevel
        });

        // If level complete, no next guide in current level
        if (isComplete) {
          setNextGuide(undefined);
          return;
        }
      } else {
        setNextLevelInfo(null);
      }

      // Find next incomplete guide in current level
      if (levelConfig?.sequence.includes(currentSlug)) {
        const currentIndex = levelConfig.sequence.indexOf(currentSlug);

        // Look for next incomplete guide after current
        for (let i = currentIndex + 1; i < levelConfig.sequence.length; i++) {
          const nextSlug = levelConfig.sequence[i];
          const isCompleted = getCompletedInLevel(guideLevel).includes(nextSlug);

          if (!isCompleted) {
            const title = guideTitles?.[nextSlug] || formatGuideTitle(nextSlug);
            setNextGuide({ slug: nextSlug, title });
            setIsLevelComplete(false);
            return;
          }
        }

        // If we've gone through all guides and they're all complete
        setNextGuide(undefined);
        setIsLevelComplete(true);
      } else {
        setNextGuide(undefined);
      }
    } catch (error) {
      console.error('[ContinueLearning] Error:', error);
    }
  }, [guideTitles]);

  // Helper to format guide title (fallback)
  function formatGuideTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Detect if user is viewing quiz section
  const checkQuizVisibility = useCallback(() => {
    if (!hasQuiz) return;

    const quizElement = document.querySelector(quizSelector);
    if (!quizElement) return;

    const rect = quizElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Quiz is considered "in view" if it's occupying >50% of viewport
    const quizVisibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const isQuizInViewport = quizVisibleHeight > windowHeight * 0.5;

    setIsViewingQuiz(isQuizInViewport);

    // Check if quiz is completed (look for completion indicators)
    const completionIndicator = quizElement.querySelector('[data-quiz-completed], .quiz-completed');
    if (completionIndicator) {
      setQuizCompleted(true);
    }
  }, [hasQuiz, quizSelector]);

  useEffect(() => {
    if (!nextGuide && !isLevelComplete) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      // Check quiz visibility
      checkQuizVisibility();

      // Show when user reaches threshold, unless viewing quiz
      if (scrollPercent >= threshold && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextGuide, isLevelComplete, threshold, isDismissed, checkQuizVisibility]);

  const scrollToQuiz = () => {
    const quizElement = document.querySelector(quizSelector);
    if (quizElement) {
      quizElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navigateToNextLevel = () => {
    if (!nextLevelInfo?.level) return;

    const nextLevel = nextLevelInfo.level;
    const nextLevelConfig = SKILL_LEVELS[nextLevel];

    if (nextLevelInfo.unlocked && nextLevelConfig) {
      // Navigate to first guide in next level
      const firstGuide = nextLevelConfig.sequence[0];
      window.location.href = `${guidesPrefix}/${firstGuide}`;
    }
  };

  const dismissLabel = t('continueLearning.dismiss');

  const dismissButton = (
    <button
      type="button"
      onClick={dismiss}
      aria-label={dismissLabel}
      className="absolute top-2 end-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
    >
      <X className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  // Hide when not yet scrolled far enough, dismissed, or actively viewing quiz
  if (!isVisible || isDismissed || isViewingQuiz) return null;

  // Level complete variant
  if (isLevelComplete) {
    const currentLevelConfig = SKILL_LEVELS[currentLevel];

    // Check if this is the final level (Advanced)
    const isFinalLevel = !nextLevelInfo?.level;

    if (isFinalLevel) {
      return (
        <>
          <MobileBar
            label={t('continueLearning.allLevelsComplete')}
            action={{ href: guidesPrefix }}
            actionLabel={t('guideNavigation.exploreAllGuides')}
            actionIcon={<CheckCircle className="h-5 w-5" aria-hidden="true" />}
            onDismiss={dismiss}
            dismissLabel={dismissLabel}
          />
          <div className="hidden md:block">
            <div className={cn(
              'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg',
              'animate-in fade-in duration-500 slide-in-from-bottom-4',
              className
            )}>
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-green-300 dark:border-green-700 shadow-2xl p-6">
                {dismissButton}
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {t('continueLearning.allLevelsComplete')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('continueLearning.allLevelsCompleteDescription').replace('{level}', currentLevelConfig.label)}
                  </p>
                  <a
                    href={guidesPrefix}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t('guideNavigation.exploreAllGuides')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    const nextLevelLabel = nextLevelInfo?.level
      ? SKILL_LEVELS[nextLevelInfo.level].label
      : '';
    const continueToLevelLabel = t('continueLearning.continueToLevel').replace('{level}', nextLevelLabel);

    return (
      <>
        <MobileBar
          label={t('continueLearning.levelComplete')}
          title={continueToLevelLabel}
          action={{ onClick: navigateToNextLevel }}
          actionLabel={continueToLevelLabel}
          actionIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />}
          onDismiss={dismiss}
          dismissLabel={dismissLabel}
        />
        <div className="hidden md:block">
          <div className={cn(
            'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg',
            'animate-in fade-in duration-500 slide-in-from-bottom-4',
            className
          )}>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-green-300 dark:border-green-700 shadow-2xl p-6">
              {dismissButton}
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {t('continueLearning.levelComplete')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('continueLearning.levelCompleteDescription').replace('{level}', currentLevelConfig.label)}
                </p>

                {nextLevelInfo?.unlocked ? (
                  <button
                    onClick={navigateToNextLevel}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                  >
                    {continueToLevelLabel}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {t('continueLearning.locked').replace('{level}', nextLevelLabel)}
                      </span>
                    </div>
                    {nextLevelInfo && nextLevelInfo.guidesNeeded > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('continueLearning.unlockRequirements').replace('{count}', String(nextLevelInfo.guidesNeeded)).replace('{currentLevel}', currentLevelConfig.label).replace('{nextLevel}', nextLevelLabel).replace('{plural}', nextLevelInfo.guidesNeeded !== 1 ? 's' : '')}
                      </p>
                    )}
                    <a
                      href={guidesPrefix}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      {t('continueLearning.browseAllGuides')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!nextGuide) return null;

  const showQuizCta = hasQuiz && !quizCompleted;

  return (
    <>
      {showQuizCta ? (
        <MobileBar
          label={t('continueLearning.guideComplete')}
          title={t('continueLearning.takeQuiz')}
          action={{ onClick: scrollToQuiz }}
          actionLabel={t('continueLearning.takeQuiz')}
          actionIcon={<GraduationCap className="h-5 w-5" aria-hidden="true" />}
          onDismiss={dismiss}
          dismissLabel={dismissLabel}
        />
      ) : (
        <MobileBar
          label={t('continueLearning.upNext')}
          title={nextGuide.title}
          action={{ href: `${guidesPrefix}/${nextGuide.slug}` }}
          actionLabel={t('continueLearning.continueLearning')}
          actionIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />}
          onDismiss={dismiss}
          dismissLabel={dismissLabel}
        />
      )}
      <div className="hidden md:block">
        <div
          className={cn(
            // Position: side panel when quiz detected, bottom center otherwise
            hasQuiz
              ? 'fixed end-6 top-1/2 -translate-y-1/2 z-40 w-80'
              : 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg',
            'animate-in fade-in duration-500',
            hasQuiz ? 'slide-in-from-right-4' : 'slide-in-from-bottom-4',
            className
          )}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-primary/30 shadow-2xl shadow-primary/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                    {t('continueLearning.guideComplete')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {showQuizCta ? t('continueLearning.testKnowledge') : t('continueLearning.nextGuide')}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {showQuizCta
                    ? t('continueLearning.quizDescription')
                    : t('continueLearning.continueDescription').replace('{title}', nextGuide.title)}
                </p>

                <div className="flex flex-col gap-3">
                  {showQuizCta && (
                    <button
                      onClick={scrollToQuiz}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                    >
                      <GraduationCap className="w-4 h-4" />
                      {t('continueLearning.takeQuiz')}
                    </button>
                  )}

                  <a
                    href={`${guidesPrefix}/${nextGuide.slug}`}
                    className={cn(
                      'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors',
                      showQuizCta
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    )}
                  >
                    {t('continueLearning.continueLearning')}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </a>

                  <button
                    type="button"
                    onClick={dismiss}
                    aria-label={dismissLabel}
                    className="self-end inline-flex items-center justify-center px-3 py-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
