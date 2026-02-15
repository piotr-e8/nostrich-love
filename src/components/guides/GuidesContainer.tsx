'use client';

import React, { useState, useEffect } from 'react';
import { InterestFilter } from './InterestFilter';
import { GuideSection } from './GuideSection';
import type { SkillLevel } from './GuideCard';
import type { Guide } from './GuideCard';
import { getLastInterestFilterLocal, setLastInterestFilterLocal } from '../../lib/progress';

interface GuideLevelData {
  id: SkillLevel;
  guides: Guide[];
  unlockThreshold: number;
}

interface GuidesContainerProps {
  skillLevels: GuideLevelData[];
}

/**
 * GuidesContainer Component
 * Manages filter state and passes it to all GuideSection children
 */
export const GuidesContainer: React.FC<GuidesContainerProps> = ({
  skillLevels,
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load saved filter on mount
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedFilter = getLastInterestFilterLocal();
      setActiveFilter(savedFilter);
    }
  }, []);

  // Save filter when it changes
  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter);
    if (typeof window !== 'undefined') {
      setLastInterestFilterLocal(filter);
    }
  };

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <div className="space-y-8">
        {skillLevels.map((level) => (
          <div 
            key={level.id}
            className="relative p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mb-12 animate-pulse"
          >
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Interest Filter */}
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Filter by interest
        </p>
        <div className="flex justify-center">
          <InterestFilter 
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Guide Sections */}
      <div className="space-y-8">
        {skillLevels.map((level) => (
          <GuideSection
            key={level.id}
            level={level.id}
            totalCount={level.guides.length}
            unlockThreshold={level.unlockThreshold}
            onUnlock={() => {}}
            guides={level.guides}
            inProgressGuideIds={[]}
            activeFilter={activeFilter}
          />
        ))}
      </div>
    </>
  );
};

export default GuidesContainer;
