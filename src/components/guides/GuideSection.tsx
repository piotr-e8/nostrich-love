'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { GuideCard, type Guide } from './GuideCard';
import { LevelProgressBar } from './LevelProgressBar';
import { UnlockButton } from './UnlockButton';
import { getUnlockedLevelsLocal, getCompletedGuidesInLevel, getLevelProgressLocal } from '../../lib/progress';
import { SKILL_LEVELS } from '../../data/learning-paths';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface GuideSectionProps {
  level: SkillLevel;
  isLocked?: boolean;
  completedCount?: number;
  totalCount: number;
  unlockThreshold: number;
  onUnlock: () => void;
  guides: Guide[];
  completedGuideIds?: string[];
  inProgressGuideIds?: string[];
  activeFilter?: string | null;
}

const levelConfig = {
  beginner: {
    icon: '🌱',
    title: 'Getting Started',
    subtitle: 'Start your Nostr journey here',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  intermediate: {
    icon: '🚀',
    title: 'Intermediate',
    subtitle: 'Level up your Nostr skills',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  advanced: {
    icon: '⚡',
    title: 'Advanced',
    subtitle: 'Master the protocol',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
  },
};

const levelNames: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const previousLevel: Record<SkillLevel, SkillLevel | null> = {
  beginner: null,
  intermediate: 'beginner',
  advanced: 'intermediate',
};

/**
 * GuideSection Component
 * Displays a skill level section with header, progress bar, and guide cards
 * Reads locked state and progress from localStorage
 */
export const GuideSection: React.FC<GuideSectionProps> = ({
  level,
  isLocked: isLockedProp,
  completedCount: completedCountProp,
  totalCount,
  unlockThreshold,
  onUnlock,
  guides,
  completedGuideIds: completedGuideIdsProp,
  inProgressGuideIds = [],
  activeFilter = null,
}) => {
  const config = levelConfig[level];
  const prevLevel = previousLevel[level];

  // Read actual state from localStorage (client-side only)
  const [isLocked, setIsLocked] = useState(isLockedProp ?? true);
  const [completedCount, setCompletedCount] = useState(completedCountProp ?? 0);
  const [completedGuideIds, setCompletedGuideIds] = useState<string[]>(completedGuideIdsProp ?? []);
  const [isClient, setIsClient] = useState(false);

  // Hydrate from localStorage on client side only
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const unlockedLevels = getUnlockedLevelsLocal();
      const isLevelLocked = !unlockedLevels.includes(level);
      setIsLocked(isLevelLocked);

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

  // Calculate previous level progress for unlock button
  // BUG FIX: Use actual completed count from previous level, not threshold
  const previousLevelCompleted = prevLevel 
    ? getCompletedGuidesInLevel(prevLevel).length 
    : completedCount;
  const previousLevelTotal = prevLevel 
    ? SKILL_LEVELS[prevLevel].sequence.length 
    : totalCount;

  // Don't render locked state details until client-side to avoid hydration mismatch
  // Show loading state on server, real state on client
  if (!isClient) {
    return (
      <section className="relative p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex-1">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
          </div>
        </div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </section>
    );
  }

  if (isLocked) {
    return (
      <section 
        className="relative p-6 lg:p-8 bg-gray-100/50 dark:bg-gray-800/30 rounded-2xl border-2 border-gray-200 dark:border-gray-700 mb-12"
        aria-label={`${config.title} section - Locked`}
      >
        {/* Locked Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor} opacity-50`}>
            <Lock className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-500">
                {config.title}
              </h2>
              <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium rounded">
                Locked
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-500">
              Complete {unlockThreshold} {prevLevel ? levelNames[prevLevel].toLowerCase() : 'beginner'} guides to unlock
            </p>
          </div>
          <UnlockButton
            level={level}
            onUnlock={onUnlock}
            completedInPrevious={previousLevelCompleted}
            totalInPrevious={previousLevelTotal}
            threshold={unlockThreshold}
          />
        </div>

        {/* Locked Progress Bar - Show PREVIOUS level progress to indicate unlock progress */}
        <div className="mb-6">
          <LevelProgressBar
            completed={previousLevelCompleted}
            total={previousLevelTotal}
            threshold={unlockThreshold}
            level={prevLevel || 'beginner'}
            showNextLevelUnlock={true}
            nextLevelName={config.title}
          />
        </div>

        {/* Locked Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: Math.min(3, totalCount) }).map((_, index) => (
            <GuideCard
              key={`locked-${level}-${index}`}
              isLocked={true}
              level={level}
              unlockRequirement={`Complete ${unlockThreshold - completedCount} more ${prevLevel ? levelNames[prevLevel].toLowerCase() : ''} guides to unlock`}
              index={index}
            />
          ))}
          {totalCount > 3 && (
            <div className="flex items-center justify-center h-[200px] bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-gray-400 dark:text-gray-500 text-sm">
                +{totalCount - 3} more locked
              </span>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Unlocked State
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
                Start Here
              </span>
            )}
            {completedCount === totalCount && (
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm font-medium rounded-full">
                ✓ Complete
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
          threshold={unlockThreshold}
          level={level}
          showNextLevelUnlock={false}
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
            No guides match the current filter
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Try selecting a different interest category
          </p>
        </div>
      )}
    </section>
  );
};

export default GuideSection;
