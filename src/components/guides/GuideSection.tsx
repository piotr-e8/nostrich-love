'use client';

import React, { useState, useEffect } from 'react';
import { SearchX } from 'lucide-react';
import { GuideCard, type Guide } from './GuideCard';
import { LevelProgressBar } from './LevelProgressBar';
import { CLEAR_GUIDE_FILTER_EVENT } from './InterestFilter';
import { getCompletedGuidesInLevel } from '../../lib/progress';
import { guideMatchesTopic, isGuideTopicId } from '../../config/guide-topics';
import { useTranslation } from '../../hooks/useTranslation';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface GuideSectionProps {
  level: SkillLevel;
  completedCount?: number;
  totalCount: number;
  guides: Guide[];
  completedGuideIds?: string[];
  inProgressGuideIds?: string[];
  activeFilter?: string | null;
}

// The 🌱 / 🚀 / ⚡ in tinted circles are gone, and with them the green/yellow/red
// per-level tints. Two reasons. The emoji only repeated the level name next to
// it, and green on this site means "completed" — a green ring on the Beginner
// header put the success colour on a section nobody had finished yet. Level is
// carried by the heading and the progress bar now; green stays semantic.

/**
 * GuideSection Component
 * Displays a skill level section with header, progress bar, and guide cards
 * Reads completion progress from localStorage
 */
export const GuideSection: React.FC<GuideSectionProps> = ({
  level,
  completedCount: completedCountProp,
  totalCount,
  guides,
  completedGuideIds: completedGuideIdsProp,
  inProgressGuideIds = [],
  activeFilter = null,
}) => {
  const { t } = useTranslation();
  
  // Get translated level config
  const getLevelConfig = (levelId: SkillLevel) => ({
    title: t(`skillLevels.${levelId}.title`),
    subtitle: t(`skillLevels.${levelId}.subtitle`),
  });

  const config = getLevelConfig(level);

  const [completedCount, setCompletedCount] = useState(completedCountProp ?? 0);
  const [completedGuideIds, setCompletedGuideIds] = useState<string[]>(completedGuideIdsProp ?? []);

  // Hydrate from localStorage on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {

      const completed = getCompletedGuidesInLevel(level);
      setCompletedCount(completed.length);
      setCompletedGuideIds(completed);
    }
  }, [level]);

  // `activeFilter` carries two different things, because GuidesContainer feeds
  // one value to every section: either a topic id from the chips, or whatever
  // the reader typed into the search box. Topic ids are a closed set, so they
  // can be told apart and matched against the slug->topic map instead of against
  // prose. Free text still falls back to a title/description substring match,
  // which is what a search box should do.
  //
  // Do NOT reinstate the old behaviour of substring-matching a chip value
  // ("privacy", "relays") against the title and description: those are
  // translated, the chip values are not, and in Polish, Chinese, Arabic and
  // Hindi that combination emptied the whole page.
  const normalizedFilter = activeFilter?.trim().toLowerCase() ?? '';

  const filteredGuides = React.useMemo(() => {
    if (!normalizedFilter) return guides;

    if (isGuideTopicId(normalizedFilter)) {
      const topic = normalizedFilter;
      return guides.filter(guide => guideMatchesTopic(guide.id, topic));
    }

    return guides.filter(guide => {
      const searchText = `${guide.title} ${guide.description}`.toLowerCase();
      return searchText.includes(normalizedFilter);
    });
  }, [guides, normalizedFilter]);

  // The filter state lives in GuidesContainer, two levels up, and this component
  // is not given a setter. Rather than thread a prop through, the reset asks the
  // filter bar to reset itself: InterestFilter listens for this event and calls
  // its own onFilterChange(null), which is the same path a click on "All Guides"
  // takes (and which also clears the search box).
  const clearFilter = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(CLEAR_GUIDE_FILTER_EVENT));
  }, []);

  // Reading order, exactly as SKILL_LEVELS lists it. This used to re-sort
  // completed guides to the end of the section, which quietly rearranged the
  // course as the reader progressed: finish guide 1 and 2, come back, and the
  // section now starts at guide 3 with the first two at the bottom. The cards
  // already say what is done (green start border, check icon, "Completed"), so
  // the reordering only cost the reader the order they had learned.
  const sortedGuides = filteredGuides;

  // The section is not a card any more. A card of cards made the guide cards
  // disappear into the section's own white ground on light, and the page read
  // as a marketing grid rather than an index. A hairline rule between levels
  // does the grouping the border used to do.
  return (
    <section
      className="border-t border-gray-200 pt-10 first:border-t-0 first:pt-0 dark:border-gray-800"
      aria-label={`${config.title} section`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-h2 font-semibold text-gray-900 dark:text-white">
            {config.title}
          </h2>
          {level === 'beginner' && (
            <span className="inline-flex items-center rounded-full border border-primary-200 px-2.5 py-0.5 text-micro font-semibold uppercase text-primary-text dark:border-primary-800 dark:text-primary-400">
              {t('guideSection.startHere')}
            </span>
          )}
          {completedCount === totalCount && (
            <span className="inline-flex items-center rounded-full border border-success-300 px-2.5 py-0.5 text-micro font-semibold uppercase text-success-700 dark:border-success-800 dark:text-success-400">
              {t('guideSection.complete')}
            </span>
          )}
        </div>
        <p className="mt-1 max-w-measure text-body-sm text-gray-600 dark:text-gray-400">
          {config.subtitle}
        </p>
      </div>

      {/* Progress Bar - Show current level progress WITHOUT unlock status (that's for locked sections) */}
      <div className="mb-6">
        <LevelProgressBar
          completed={completedCount}
          total={totalCount}
          level={level}
        />
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedGuides.map((guide, index) => (
          <GuideCard
            key={guide.id}
            guide={guide}
            isCompleted={completedGuideIds.includes(guide.id)}
            isInProgress={inProgressGuideIds.includes(guide.id)}
            index={index}
          />
        ))}
      </div>

      {/* Empty state. A topic can legitimately have nothing at one level (there
          is no Bitcoin guide in Advanced), so this must always say so and offer
          the way back, never leave a bare gap. */}
      {sortedGuides.length === 0 && normalizedFilter !== '' && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6 text-center">
          <SearchX
            className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          {/* ui.search.noResults is the only "nothing found" string that exists
              in all seven locales today. Its English wording says "matching your
              search", which is a shade off for a topic chip; a dedicated
              guidesPage.filter.noMatches key would read better once it can be
              translated in all seven. */}
          <p className="text-body-sm text-gray-500 dark:text-gray-400">
            {t('ui.search.noResults')}
          </p>
          <button
            type="button"
            onClick={clearFilter}
            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-body-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800"
          >
            {t('interestFilter.allGuides')}
          </button>
        </div>
      )}
    </section>
  );
};

export default GuideSection;
