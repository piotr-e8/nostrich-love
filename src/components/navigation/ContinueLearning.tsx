import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, X, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SKILL_LEVELS, type SkillLevel, getNextLevel, getGuideLevel } from '../../data/learning-paths';
import { 
  getCompletedGuidesInLevel as getCompletedInLevel, 
  getLevelProgressLocal as getLevelProgress,
  isLevelUnlockedLocal as isLevelUnlocked
} from '../../lib/progress';

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
}

export function ContinueLearning({
  nextGuide: initialNextGuide,
  guideTitles,
  threshold = 0.8,
  className,
  hasQuiz = false,
  quizSelector = '[data-quiz], [id*="quiz"], [class*="quiz"]',
}: ContinueLearningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
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
        const nextUnlocked = isLevelUnlocked(nextLevel);
        const threshold = SKILL_LEVELS[nextLevel].unlockThreshold;
        const guidesNeeded = Math.max(0, threshold - completedCount);
        
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
      window.location.href = `/guides/${firstGuide}`;
    }
  };

  // Hide overlay when actively viewing quiz
  if (!isVisible || isViewingQuiz) return null;

  // Level complete variant
  if (isLevelComplete) {
    const currentLevelConfig = SKILL_LEVELS[currentLevel];
    
    // Check if this is the final level (Advanced)
    const isFinalLevel = !nextLevelInfo?.level;
    
    if (isFinalLevel) {
      return (
        <div className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg',
          'animate-in fade-in duration-500 slide-in-from-bottom-4',
          className
        )}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-green-300 dark:border-green-700 shadow-2xl p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                All Levels Complete!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Congratulations! You've completed all {currentLevelConfig.label} guides and mastered Nostr!
              </p>
              <a
                href="/guides"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Explore All Guides
              </a>
            </div>
          </div>
        </div>
      );
    }
    
    const nextLevelLabel = nextLevelInfo?.level 
      ? SKILL_LEVELS[nextLevelInfo.level].label 
      : '';
    
    return (
      <div className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg',
        'animate-in fade-in duration-500 slide-in-from-bottom-4',
        className
      )}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-green-300 dark:border-green-700 shadow-2xl p-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Level Complete!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              You've completed all {currentLevelConfig.label} guides!
            </p>
            
            {nextLevelInfo?.unlocked ? (
              <button
                onClick={navigateToNextLevel}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
              >
                Continue to {nextLevelLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {nextLevelLabel} is Locked
                  </span>
                </div>
                {nextLevelInfo && nextLevelInfo.guidesNeeded > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Complete {nextLevelInfo.guidesNeeded} more {currentLevelConfig.label} guide{nextLevelInfo.guidesNeeded !== 1 ? 's' : ''} to unlock {nextLevelLabel}
                  </p>
                )}
                <a
                  href="/guides"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse All Guides
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!nextGuide) return null;

  return (
    <div
      className={cn(
        // Position: side panel when quiz detected, bottom center otherwise
        hasQuiz
          ? 'fixed right-6 top-1/2 -translate-y-1/2 z-40 w-80'
          : 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg',
        'animate-in fade-in duration-500',
        hasQuiz ? 'slide-in-from-right-4' : 'slide-in-from-bottom-4',
        className
      )}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-primary/30 shadow-2xl shadow-primary/10 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                Guide Complete!
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {hasQuiz && !quizCompleted ? 'Test your knowledge?' : 'Ready for the next guide?'}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {hasQuiz && !quizCompleted
                ? 'Take the quiz to reinforce what you\'ve learned.'
                : `Continue your Nostr journey with ${nextGuide.title}`}
            </p>

            <div className="flex flex-col gap-3">
              {hasQuiz && !quizCompleted && (
                <button
                  onClick={scrollToQuiz}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  Take the Quiz
                </button>
              )}

              <a
                href={`/guides/${nextGuide.slug}`}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors',
                  hasQuiz && !quizCompleted
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-primary text-white hover:bg-primary/90'
                )}
              >
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsDismissed(true)}
                className="self-end px-3 py-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
