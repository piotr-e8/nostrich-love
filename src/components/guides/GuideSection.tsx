'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { GuideCard, type Guide } from './GuideCard';
import { LevelProgressBar } from './LevelProgressBar';
import { getCompletedGuidesInLevel } from '../../lib/progress';
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

const levelConfigBase = {
  beginner: {
    icon: '🌱',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  intermediate: {
    icon: '🚀',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  advanced: {
    icon: '⚡',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
  },
};

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
    ...levelConfigBase[levelId],
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

  // Filter guides based on interest filter
  const filteredGuides = React.useMemo(() => {
    if (!activeFilter) return guides;
    
    const normalizedFilter = activeFilter.toLowerCase();
    
    return guides.filter(guide => {
      // Check if guide has tags that match the filter (case-insensitive)
      if (guide.tags?.some(tag => tag.toLowerCase() === normalizedFilter)) return true;
      
      // Check guide title/description for keywords
      const searchText = `${guide.title} ${guide.description}`.toLowerCase();
      return searchText.includes(normalizedFilter);
    });
  }, [guides, activeFilter]);

  // Sort guides: incomplete first, then completed (within filtered set)
  const sortedGuides = React.useMemo(() => {
    return [...filteredGuides].sort((a, b) => {
      const aCompleted = completedGuideIds.includes(a.id);
      const bCompleted = completedGuideIds.includes(b.id);
      if (aCompleted === bCompleted) return 0;
      return aCompleted ? 1 : -1;
    });
  }, [filteredGuides, completedGuideIds]);

  return (
    <section 
      className="relative p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mb-12"
      aria-label={`${config.title} section`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor}`}>
          <span className="text-2xl" role="img" aria-label={config.title}>
            {config.icon}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {config.title}
            </h2>
            {level === 'beginner' && (
              <span className="px-3 py-1 bg-friendly-purple-100 text-friendly-purple-700 dark:bg-friendly-purple-900 dark:text-friendly-purple-200 text-sm font-medium rounded-full">
                {t('guideSection.startHere')}
              </span>
            )}
            {completedCount === totalCount && (
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm font-medium rounded-full">
                ✓ {t('guideSection.complete')}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {config.subtitle}
          </p>
        </div>
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

      {/* Empty State (when filter returns no results) */}
      {sortedGuides.length === 0 && activeFilter && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {t('ui.search.noResults')}
          </p>
        </div>
      )}
    </section>
  );
};

export default GuideSection;
