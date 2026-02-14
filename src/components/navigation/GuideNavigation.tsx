import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LEARNING_PATHS, getPreviousGuideInPath, getNextGuideInPath, getGuidePositionInPath, getPathLength } from '../../data/learning-paths';
import { getActivePath } from '../../lib/progress';

interface GuideInfo {
  slug: string;
  title: string;
  description?: string;
}

interface GuideNavigationProps {
  prevGuide?: GuideInfo;
  nextGuide?: GuideInfo;
  currentGuideNum?: number;
  totalGuides?: number;
  guideTitles?: Record<string, string>; // Map of slug -> title
  className?: string;
}

export function GuideNavigation({
  prevGuide: initialPrevGuide,
  nextGuide: initialNextGuide,
  currentGuideNum: initialCurrentGuideNum,
  totalGuides: initialTotalGuides,
  guideTitles,
  className,
}: GuideNavigationProps) {
  const [prevGuide, setPrevGuide] = useState<GuideInfo | undefined>(initialPrevGuide);
  const [nextGuide, setNextGuide] = useState<GuideInfo | undefined>(initialNextGuide);
  const [currentGuideNum, setCurrentGuideNum] = useState<number>(initialCurrentGuideNum || 0);
  const [totalGuides, setTotalGuides] = useState<number>(initialTotalGuides || 0);
  const [activePath, setActivePath] = useState<string>('general');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current guide slug from URL
    const pathParts = window.location.pathname.split('/');
    const currentGuideSlug = pathParts[pathParts.length - 1];
    
    // Get user's active path from localStorage
    const userPath = getActivePath();
    setActivePath(userPath);
    
    // Get path configuration
    const pathConfig = LEARNING_PATHS[userPath];
    
    if (pathConfig && pathConfig.sequence.includes(currentGuideSlug)) {
      // Calculate path-based navigation
      const prevSlug = getPreviousGuideInPath(currentGuideSlug, userPath);
      const nextSlug = getNextGuideInPath(currentGuideSlug, userPath);
      const position = getGuidePositionInPath(currentGuideSlug, userPath);
      const pathLength = getPathLength(userPath);
      
      // Update state with path-based values
      setCurrentGuideNum(position);
      setTotalGuides(pathLength);
      
      // Fetch guide info for prev/next
      if (prevSlug) {
        fetchGuideInfo(prevSlug).then(info => setPrevGuide(info));
      } else {
        setPrevGuide(undefined);
      }
      
      if (nextSlug) {
        fetchGuideInfo(nextSlug).then(info => setNextGuide(info));
      } else {
        setNextGuide(undefined);
      }
    }
    // If guide not in path, fall back to initial props (global order)
    
    setIsLoading(false);
  }, []);

  // Helper function to fetch guide info
  async function fetchGuideInfo(slug: string): Promise<GuideInfo | undefined> {
    try {
      // Use provided guide titles map if available
      if (guideTitles && guideTitles[slug]) {
        return {
          slug,
          title: guideTitles[slug],
        };
      }
      
      // Fallback to formatting the slug
      return {
        slug,
        title: formatGuideTitle(slug),
      };
    } catch (error) {
      console.error('Error fetching guide info:', error);
      return undefined;
    }
  }

  // Format guide slug to title (fallback)
  function formatGuideTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (isLoading) {
    return (
      <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
        <div className="animate-pulse flex justify-center">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-primary">Guide {currentGuideNum}</span>
          <span>of</span>
          <span>{totalGuides}</span>
          {activePath !== 'general' && (
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              ({LEARNING_PATHS[activePath]?.label} path)
            </span>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Previous guide */}
        {prevGuide ? (
          <a
            href={`/guides/${prevGuide.slug}`}
            className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all duration-200"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Previous</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{prevGuide.title}</p>
            </div>
          </a>
        ) : (
          <div className="flex-1" /> // Spacer
        )}

        {/* Next guide */}
        {nextGuide ? (
          <a
            href={`/guides/${nextGuide.slug}`}
            className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all duration-200 sm:text-right"
          >
            <div className="flex-1 min-w-0 sm:order-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Next</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{nextGuide.title}</p>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors sm:order-2">
              <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </a>
        ) : (
          <div className="flex-1" /> // Spacer
        )}
      </div>
    </div>
  );
}
