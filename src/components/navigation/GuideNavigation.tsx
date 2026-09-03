import React from 'react';
import { ArrowLeft, ArrowRight, Milestone } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SKILL_LEVELS, type SkillLevel, getGuideLevel } from '../../data/learning-paths';
import { useTranslation } from '../../hooks/useTranslation';
import { guidesIndexPath } from "../../i18n/paths";
import type { Locale } from '../../config/locales';

interface GuideInfo {
  slug: string;
  title: string;
}

interface GuideNavigationProps {
  guideTitles?: Record<string, string>;
  className?: string;
  locale?: Locale;
  /**
   * Slug of the guide being rendered. Required for the static render — with it
   * this component is a pure function of its props and needs no JavaScript.
   * Falls back to the URL so a client-side caller still works.
   */
  currentSlug?: string;
}

interface NavigationState {
  prevGuide: GuideInfo | null;
  nextGuide: GuideInfo | null;
  /**
   * The current guide is the last one in its level's sequence. This is a
   * statement about position, never about what the reader has read — this
   * component has no access to progress, see the note on the render below.
   */
  isLastInLevel: boolean;
  showOffLevelMessage: boolean;
  currentLevel: SkillLevel;
  nextLevel: SkillLevel | null;
  nextLevelFirstGuide: string | null;
}

const LEVEL_ORDER: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

function formatTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Where this guide sits in its level, as a pure function of the slug.
 *
 * This used to live in a useEffect that read window.location and drove nine
 * useState hooks, so the server render was always a pulsing skeleton: 112 guide
 * pages shipped no prev/next anchors at all, and readers without JS never got
 * the "what do I read next" affordance. The effect stopped depending on
 * anything asynchronous when level gating was removed — nothing here reads
 * localStorage or the network, so it can simply be computed while rendering.
 *
 * Progress-dependent prompting still belongs on the client; that is
 * ContinueLearning, which reads completion state and scroll position.
 */
function computeNavigation(
  currentSlug: string,
  guideTitles?: Record<string, string>
): NavigationState {
  const guideLevel = getGuideLevel(currentSlug);

  const base: NavigationState = {
    prevGuide: null,
    nextGuide: null,
    isLastInLevel: false,
    showOffLevelMessage: false,
    currentLevel: 'beginner',
    nextLevel: null,
    nextLevelFirstGuide: null,
  };

  // A slug in no level: the guide exists but is outside the curriculum.
  if (!guideLevel) return { ...base, showOffLevelMessage: true };

  const sequence = SKILL_LEVELS[guideLevel].sequence;
  const currentIndex = sequence.indexOf(currentSlug);
  const toGuideInfo = (slug: string): GuideInfo => ({
    slug,
    title: guideTitles?.[slug] || formatTitle(slug),
  });

  const prevGuide = currentIndex > 0 ? toGuideInfo(sequence[currentIndex - 1]) : null;
  const isLastInLevel = currentIndex === sequence.length - 1;

  if (!isLastInLevel) {
    return {
      ...base,
      currentLevel: guideLevel,
      prevGuide,
      nextGuide: toGuideInfo(sequence[currentIndex + 1]),
    };
  }

  // Last guide of the level — offer the next level's first guide instead.
  const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(guideLevel) + 1] ?? null;
  return {
    ...base,
    currentLevel: guideLevel,
    prevGuide,
    isLastInLevel: true,
    nextLevel,
    nextLevelFirstGuide: nextLevel ? SKILL_LEVELS[nextLevel].sequence[0] : null,
  };
}

export function GuideNavigation({
  guideTitles,
  className,
  locale = 'en',
  currentSlug,
}: GuideNavigationProps) {
  const { t } = useTranslation();

  // Prefer the build-time slug; fall back to the URL for a client-side caller.
  // On the server with neither, there is nothing to navigate from.
  const slug =
    currentSlug ??
    (typeof window === 'undefined'
      ? ''
      : window.location.pathname.replace(/\/$/, '').split('/').pop() || '');

  const {
    prevGuide,
    nextGuide,
    isLastInLevel,
    showOffLevelMessage,
    currentLevel,
    nextLevel,
    nextLevelFirstGuide,
  } = computeNavigation(slug, guideTitles);

  const guidesPrefix = guidesIndexPath(locale).replace(/\/$/, '');

  // Off-level message
  if (showOffLevelMessage) {
    return (
      <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('guideNavigation.offLevelMessage').replace('{level}', t(`skillLevels.${currentLevel}.label`) || 'selected')}
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href={guidesPrefix} 
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" />
              {t('guideNavigation.backToAllGuides')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // End of the level's sequence: a signpost, not a celebration.
  //
  // This renders as static HTML with no client directive (see the comment at
  // the call site in src/pages/[...lang]/guides/[slug].astro), so it is
  // identical for every visitor and knows nothing about who has read what.
  // It therefore states position only. Congratulating a reader on finishing a
  // level is ContinueLearning's job — that one reads stored progress, and it
  // sits on the same page, so any claim made here would contradict it for a
  // reader who arrived on this guide from search.
  if (isLastInLevel) {
    return (
      <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8 text-center mb-8">
          <Milestone className="w-8 h-8 mx-auto mb-4 text-gray-400 dark:text-gray-500 rtl:-scale-x-100" aria-hidden="true" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('guideNavigation.lastInLevel').replace('{level}', t(`skillLevels.${currentLevel}.label`) || '')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t(
              nextLevel
                ? 'guideNavigation.lastInLevelDescription'
                : 'guideNavigation.lastInLevelDescriptionFinal'
            ).replace('{level}', t(`skillLevels.${currentLevel}.label`) || '')}
          </p>

          {/* Level gating was removed wholesale, so the next level is always
              reachable — there is no locked variant to render any more. */}
          {nextLevelFirstGuide && nextLevel && (
            <a
              href={`${guidesPrefix}/${nextLevelFirstGuide}`}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              {t('guideNavigation.continueToLevel').replace('{level}', t(`skillLevels.${nextLevel}.label`) || '')}
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </a>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {prevGuide ? (
            <a
              href={`${guidesPrefix}/${prevGuide.slug}`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              <div>
                <p className="text-xs text-gray-500 uppercase">{t('guideNavigation.previous')}</p>
                <p className="text-sm font-medium">{prevGuide.title}</p>
              </div>
            </a>
          ) : (
            <div className="flex-1" />
          )}
          
          <a
            href={guidesPrefix}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {t('guideNavigation.exploreAllGuides')}
            <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
          </a>
        </div>
      </div>
    );
  }

  // Normal navigation
  return (
    <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {prevGuide ? (
          <a
            href={`${guidesPrefix}/${prevGuide.slug}`}
            className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            <div>
              <p className="text-xs text-gray-500 uppercase">{t('guideNavigation.previous')}</p>
              <p className="text-sm font-medium">{prevGuide.title}</p>
            </div>
          </a>
        ) : (
          <div className="flex-1 text-sm text-gray-500">
            {t('guideNavigation.startOfLevel').replace('{level}', t(`skillLevels.${currentLevel}.label`) || '')}
          </div>
        )}

        {nextGuide ? (
          <a
            href={`${guidesPrefix}/${nextGuide.slug}`}
            className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 transition-all sm:text-end"
          >
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase">{t('guideNavigation.next')}</p>
              <p className="text-sm font-medium">{nextGuide.title}</p>
            </div>
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </a>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}

export default GuideNavigation;
