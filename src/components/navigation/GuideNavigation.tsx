import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GuideInfo {
  slug: string;
  title: string;
  description?: string;
}

interface GuideNavigationProps {
  prevGuide?: GuideInfo;
  nextGuide?: GuideInfo;
  currentGuideNum: number;
  totalGuides: number;
  className?: string;
}

export function GuideNavigation({
  prevGuide,
  nextGuide,
  currentGuideNum,
  totalGuides,
  className,
}: GuideNavigationProps) {
  return (
    <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-primary">Guide {currentGuideNum}</span>
          <span>of</span>
          <span>{totalGuides}</span>
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
          <div className="flex-1" />
        )}

        {/* Next guide */}
        {nextGuide ? (
          <a
            href={`/guides/${nextGuide.slug}`}
            className="group flex items-center gap-3 p-4 rounded-xl border-2 border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-all duration-200"
          >
            <div className="flex-1 min-w-0 text-right">
              <p className="text-xs text-primary/80 uppercase tracking-wide">Next Guide</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{nextGuide.title}</p>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
          </a>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
