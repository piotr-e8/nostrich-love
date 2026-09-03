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

  // This block renders inside <article class="prose">, so `not-prose` on the
  // root turns off the typography plugin's link, heading and paragraph styling
  // for the furniture at the end of the article. It does NOT switch off the
  // hand-written `.prose p` / `.prose h3` rules in globals.css — those are
  // plain descendant selectors and out-weigh a utility class — which is why the
  // small labels below are spans rather than paragraphs.
  const rootClass = cn(
    'not-prose mt-12 border-t border-gray-200 pt-8 dark:border-gray-800',
    className,
  );

  // Card recipe, VISUAL_SYSTEM.md §4: a border and a ground. No shadow, no
  // scale, no accent-tinted hover border — the border and the ground move.
  const navCard =
    'flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800';
  const navLabel = 'block text-micro uppercase text-gray-500 dark:text-gray-400';
  const navTitle = 'block text-body-sm font-medium text-gray-900 dark:text-white';
  const navArrow = 'h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 rtl:rotate-180';

  // Secondary button: gray ground, both grounds. It carried no dark: variants
  // at all, so on the dark page it painted gray-100 on gray-900.
  const secondaryButton =
    'inline-flex items-center justify-center rounded-md bg-gray-100 px-6 py-3 text-body-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700';

  // Off-level message
  if (showOffLevelMessage) {
    return (
      <div className={rootClass}>
        <div className="text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {t('guideNavigation.offLevelMessage').replace('{level}', t(`skillLevels.${currentLevel}.label`) || 'selected')}
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={guidesPrefix}
              className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-body-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="me-2 h-4 w-4 shrink-0 rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
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
      <div className={rootClass}>
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <Milestone
            className="mx-auto mb-4 h-6 w-6 text-gray-400 dark:text-gray-500 rtl:-scale-x-100"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h3 className="mb-2 text-h3 font-semibold text-gray-900 dark:text-white">
            {t('guideNavigation.lastInLevel').replace('{level}', t(`skillLevels.${currentLevel}.label`) || '')}
          </h3>
          <p className="mx-auto mb-6 max-w-measure-narrow text-gray-600 dark:text-gray-400">
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
              className="inline-flex items-center rounded-md bg-primary-600 px-6 py-3 text-body-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              {t('guideNavigation.continueToLevel').replace('{level}', t(`skillLevels.${nextLevel}.label`) || '')}
              <ArrowRight className="ms-2 h-4 w-4 shrink-0 rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          {prevGuide ? (
            <a href={`${guidesPrefix}/${prevGuide.slug}`} className={navCard}>
              <ArrowLeft className={navArrow} strokeWidth={1.5} aria-hidden="true" />
              <span className="min-w-0">
                <span className={navLabel}>{t('guideNavigation.previous')}</span>
                <span className={navTitle}>{prevGuide.title}</span>
              </span>
            </a>
          ) : (
            <div className="flex-1" />
          )}

          <a href={guidesPrefix} className={secondaryButton}>
            {t('guideNavigation.exploreAllGuides')}
            <ArrowRight className="ms-2 h-4 w-4 shrink-0 rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  // Normal navigation.
  // A <nav> with a label, not a bare <div>: this is the sequential path through
  // the course and it is how a keyboard or screen-reader user moves between
  // guides. It also gives scripts/verify-seo.js a stable hook, so the check that
  // these anchors ship statically can stop matching on a Tailwind class string.
  return (
    <nav className={rootClass} aria-label={t('guideNavigation.aria')}>
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        {prevGuide ? (
          <a href={`${guidesPrefix}/${prevGuide.slug}`} className={navCard}>
            <ArrowLeft className={navArrow} strokeWidth={1.5} aria-hidden="true" />
            <span className="min-w-0">
              <span className={navLabel}>{t('guideNavigation.previous')}</span>
              <span className={navTitle}>{prevGuide.title}</span>
            </span>
          </a>
        ) : (
          <div className="flex-1 text-body-sm text-gray-500 dark:text-gray-400">
            {t('guideNavigation.startOfLevel').replace('{level}', t(`skillLevels.${currentLevel}.label`) || '')}
          </div>
        )}

        {nextGuide ? (
          <a href={`${guidesPrefix}/${nextGuide.slug}`} className={cn(navCard, 'sm:text-end')}>
            <span className="min-w-0 flex-1">
              <span className={navLabel}>{t('guideNavigation.next')}</span>
              <span className={navTitle}>{nextGuide.title}</span>
            </span>
            <ArrowRight className={navArrow} strokeWidth={1.5} aria-hidden="true" />
          </a>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
}

export default GuideNavigation;
