'use client';

import React, { useState, useEffect } from 'react';
import { InterestFilter } from './InterestFilter';
import { GuideSection } from './GuideSection';
import type { SkillLevel } from './GuideCard';
import type { Guide } from './GuideCard';
import { getLastInterestFilterLocal, setLastInterestFilterLocal, unlockLevelLocal } from '../../lib/progress';

interface GuideLevelData {
  id: SkillLevel;
  guides: Guide[];
  unlockThreshold: number;
}

interface GuidesContainerProps {
  skillLevels: GuideLevelData[];
}

// Helper to get last viewed guide from localStorage
function getLastViewedGuide(): { slug: string; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('nostrich-last-viewed');
    if (stored) {
      const data = JSON.parse(stored);
      return { slug: data.slug, timestamp: data.timestamp };
    }
  } catch (e) {
    console.error('Error reading last viewed guide:', e);
  }
  return null;
}

/**
 * GuidesContainer Component
 * Manages filter state and search functionality
 */
export const GuidesContainer: React.FC<GuidesContainerProps> = ({
  skillLevels,
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [inProgressGuideIds, setInProgressGuideIds] = useState<string[]>([]);

  // Load saved filter and in-progress guides on mount
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedFilter = getLastInterestFilterLocal();
      setActiveFilter(savedFilter);
      
      // Load last viewed guide as in-progress (if viewed within last 7 days)
      const lastViewed = getLastViewedGuide();
      if (lastViewed) {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (lastViewed.timestamp > sevenDaysAgo) {
          setInProgressGuideIds([lastViewed.slug]);
        }
      }
    }
  }, []);

  // Save filter when it changes
  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter);
    setSearchQuery(''); // Clear search when filter changes
    if (typeof window !== 'undefined') {
      setLastInterestFilterLocal(filter);
    }
  };

  // Handle level unlock
  const handleUnlock = (level: SkillLevel) => {
    unlockLevelLocal(level);
    // Force re-render by updating state
    window.dispatchEvent(new CustomEvent('levelUnlocked', { detail: { level } }));
  };

  // Combine filter and search
  const getActiveSearch = () => {
    if (searchQuery.trim()) return searchQuery.toLowerCase();
    return activeFilter;
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

    {/* <section className="py-8 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-4">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
            type="text"
            placeholder="Type to search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-friendly-purple-400 focus:border-transparent"
          />
          </div>
        </div>
      </div>
    </section> */}


      {/* Search */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
          Search guides
        </p>
        <div className="relative max-w-xl mx-auto">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          <input
            type="text"
            placeholder="Type to search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-friendly-purple-400 focus:border-transparent"
          />
        </div>
      </div>

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
            onUnlock={() => handleUnlock(level.id)}
            guides={level.guides}
            inProgressGuideIds={inProgressGuideIds}
            activeFilter={getActiveSearch()}
          />
        ))}
      </div>
    </>
  );
};

export default GuidesContainer;
