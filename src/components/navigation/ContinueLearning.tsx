import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { type SkillLevel, guideHasQuiz } from '../../data/learning-paths';
import {
  getCompletedGuides,
  getPassedQuizzes,
  getQuizResult,
  QUIZ_COMPLETED_EVENT,
} from '../../utils/gamification';
import {
  planContinueLearning,
  type ContinueLearningPlan,
} from './continueLearningPlan';
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

/**
 * Slug of the guide being read.
 *
 * The site's canonical URLs and its sitemap both carry a trailing slash, so a
 * reader arriving from search lands on /guides/what-is-nostr/. Splitting that
 * on '/' hands back an empty last segment, no level is found, and the whole
 * panel silently disappears — which is exactly what happened before the
 * trailing slash was stripped here.
 */
function currentSlugFromPath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname.replace(/\/+$/, '').split('/').pop() || '';
}

function formatGuideTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
  const [model, setModel] = useState<ContinueLearningPlan | null>(null);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Best effort — the in-memory flag still hides it for this page view.
    }
  }, []);

  // [slug].astro resolves the next guide's localized title at build time, so
  // prefer it over the slug-derived fallback when the target happens to match.
  const titleOf = useCallback(
    (slug: string) =>
      guideTitles?.[slug] ||
      (initialNextGuide?.slug === slug ? initialNextGuide.title : undefined) ||
      formatGuideTitle(slug),
    [guideTitles, initialNextGuide]
  );

  const buildModel = useCallback((): ContinueLearningPlan | null => {
    const slug = currentSlugFromPath();
    return planContinueLearning({
      slug,
      readGuides: getCompletedGuides(),
      passedQuizzes: getPassedQuizzes(),
      hasQuiz: hasQuiz || guideHasQuiz(slug),
      quizAttempted: getQuizResult(slug) !== null,
    });
  }, [hasQuiz]);

  useEffect(() => {
    try {
      setModel(buildModel());
    } catch (error) {
      console.error('[ContinueLearning] Error:', error);
    }
  }, [buildModel]);

  // The moment a quiz records a result, the panel has a different answer to
  // give. Before this, completion was sniffed for as a `[data-quiz-completed]`
  // element that no quiz on the site has ever rendered, so the panel offered
  // "Take the Quiz" for the whole life of the page — including to a reader
  // staring at their own results.
  useEffect(() => {
    const onQuizCompleted = () => {
      try {
        setModel(buildModel());
      } catch {
        // Keep whatever we had rather than blanking the panel.
      }
      setIsViewingQuiz(false);
      if (!readSessionDismissed()) setIsVisible(true);
    };

    window.addEventListener(QUIZ_COMPLETED_EVENT, onQuizCompleted);
    return () => window.removeEventListener(QUIZ_COMPLETED_EVENT, onQuizCompleted);
  }, [buildModel]);

  const quizPending = Boolean(model?.quiz && !model.quiz.attempted);

  // While the reader is still working through the quiz, stay out of the way.
  // Once it is answered the panel is the thing they need, so the quiz filling
  // the viewport must no longer hide it.
  const checkQuizVisibility = useCallback(() => {
    if (!quizPending) {
      setIsViewingQuiz(false);
      return;
    }

    const quizElement = document.querySelector(quizSelector);
    if (!quizElement) return;

    const rect = quizElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const quizVisibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);

    setIsViewingQuiz(quizVisibleHeight > windowHeight * 0.5);
  }, [quizPending, quizSelector]);

  useEffect(() => {
    if (!model) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      checkQuizVisibility();

      if (scrollPercent >= threshold && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [model, threshold, isDismissed, checkQuizVisibility]);

  const scrollToQuiz = () => {
    const quizElement = document.querySelector(quizSelector);
    if (quizElement) {
      quizElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const levelName = (level: SkillLevel) => t(`skillLevels.${level}.label`);

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

  /** Card shell for the desktop panel. Always a bottom bar. */
  const desktopCard = (children: React.ReactNode, accent: 'primary' | 'green') => (
    <div className="hidden md:block">
      <div
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg',
          'animate-in fade-in duration-500 slide-in-from-bottom-4',
          className
        )}
      >
        <div
          className={cn(
            'relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6',
            accent === 'green'
              ? 'border-2 border-green-300 dark:border-green-700'
              : 'border-2 border-primary/30 shadow-primary/10'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );

  if (!isVisible || isDismissed || isViewingQuiz || !model) return null;

  const { target } = model;
  const targetTitle = target ? titleOf(target.slug) : '';

  /**
   * Guides and quizzes, side by side. The site used to call a level complete on
   * guides alone while the certificate needed the quizzes too, so a reader was
   * congratulated and then handed nothing. Showing both counts is what makes
   * the two agree in the reader's head.
   */
  const counters = (
    <div className="flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
      <span>
        {t('continueLearning.guidesCounter')
          .replace('{done}', String(model.guidesRead))
          .replace('{total}', String(model.guidesTotal))}
      </span>
      {model.quizzesTotal > 0 && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            {t('continueLearning.quizzesCounter')
              .replace('{done}', String(model.quizzesPassed))
              .replace('{total}', String(model.quizzesTotal))}
          </span>
        </>
      )}
    </div>
  );

  // ---------------------------------------------------------------- complete
  if (model.levelComplete) {
    const finished = model.allLevelsComplete && !model.nextLevel;

    if (finished) {
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
          {desktopCard(
            <>
              {dismissButton}
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {t('continueLearning.allLevelsComplete')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('continueLearning.allLevelsCompleteDescription').replace(
                    '{level}',
                    levelName(model.level)
                  )}
                </p>
                <a
                  href={guidesPrefix}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t('guideNavigation.exploreAllGuides')}
                </a>
              </div>
            </>,
            'green'
          )}
        </>
      );
    }

    const onwardLabel = model.nextLevel
      ? t('continueLearning.continueToLevel').replace('{level}', levelName(model.nextLevel))
      : t('continueLearning.browseAllGuides');
    const onwardHref =
      model.nextLevel && target ? `${guidesPrefix}/${target.slug}` : guidesPrefix;

    return (
      <>
        <MobileBar
          label={t('continueLearning.levelComplete')}
          title={onwardLabel}
          action={{ href: onwardHref }}
          actionLabel={onwardLabel}
          actionIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />}
          onDismiss={dismiss}
          dismissLabel={dismissLabel}
        />
        {desktopCard(
          <>
            {dismissButton}
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t('continueLearning.levelComplete')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t('continueLearning.levelCompleteDescription').replace(
                  '{level}',
                  levelName(model.level)
                )}
              </p>
              <div className="mb-4">{counters}</div>
              <a
                href={onwardHref}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
              >
                {onwardLabel}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
            </div>
          </>,
          'green'
        )}
      </>
    );
  }

  // ------------------------------------------------------------- in progress
  const quizAttempted = Boolean(model.quiz?.attempted);
  const showRetake = Boolean(model.quiz && model.quiz.attempted && !model.quiz.passed);
  const targetHref = target ? `${guidesPrefix}/${target.slug}` : guidesPrefix;
  const isBackfill = target?.kind === 'backfill';

  const eyebrow = quizAttempted
    ? t('continueLearning.quizComplete')
    : t('continueLearning.guideComplete');

  let heading: string;
  let description: string;

  if (quizPending) {
    heading = t('continueLearning.testKnowledge');
    description = t('continueLearning.quizDescription');
  } else if (isBackfill) {
    heading = t('continueLearning.stillToFinish').replace('{level}', levelName(model.level));
    description = (
      target?.missing === 'quiz'
        ? t('continueLearning.unpassedQuizDescription')
        : t('continueLearning.unreadGuideDescription')
    ).replace('{title}', targetTitle);
  } else if (target?.kind === 'level' && target.level) {
    heading = t('continueLearning.continueToLevel').replace('{level}', levelName(target.level));
    description = t('continueLearning.continueDescription').replace('{title}', targetTitle);
  } else if (target) {
    heading = t('continueLearning.nextGuide');
    description = t('continueLearning.continueDescription').replace('{title}', targetTitle);
  } else {
    heading = t('continueLearning.nextGuide');
    description = t('continueLearning.browseAllGuides');
  }

  const mobileLabel = quizPending
    ? t('continueLearning.guideComplete')
    : isBackfill
      ? t('continueLearning.stillToFinish').replace('{level}', levelName(model.level))
      : quizAttempted
        ? t('continueLearning.quizComplete')
        : t('continueLearning.upNext');

  return (
    <>
      {quizPending ? (
        <MobileBar
          label={mobileLabel}
          title={t('continueLearning.takeQuiz')}
          action={{ onClick: scrollToQuiz }}
          actionLabel={t('continueLearning.takeQuiz')}
          actionIcon={<GraduationCap className="h-5 w-5" aria-hidden="true" />}
          onDismiss={dismiss}
          dismissLabel={dismissLabel}
        />
      ) : (
        <MobileBar
          label={mobileLabel}
          title={targetTitle || undefined}
          action={{ href: targetHref }}
          actionLabel={t('continueLearning.continueLearning')}
          actionIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />}
          onDismiss={dismiss}
          dismissLabel={dismissLabel}
        />
      )}

      {desktopCard(
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {quizAttempted ? (
              <GraduationCap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            ) : (
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                {eyebrow}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{heading}</h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>

            {isBackfill && <div className="mb-4">{counters}</div>}

            <div className="flex flex-col gap-3">
              {quizPending && (
                <button
                  onClick={scrollToQuiz}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  {t('continueLearning.takeQuiz')}
                </button>
              )}

              <a
                href={targetHref}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors',
                  quizPending
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                )}
              >
                {target ? t('continueLearning.continueLearning') : t('continueLearning.browseAllGuides')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>

              {showRetake && (
                <button
                  type="button"
                  onClick={scrollToQuiz}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  {t('ui.quiz.retakeQuiz')}
                </button>
              )}

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
        </div>,
        'primary'
      )}
    </>
  );
}
