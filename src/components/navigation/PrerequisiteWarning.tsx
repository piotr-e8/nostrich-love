import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { checkPrerequisites } from '../../lib/progressService';
import { Button } from '../ui/Button';

export interface PrerequisiteWarningProps {
  currentGuideId: string;
  currentGuideTitle: string;
  prerequisites: Array<{
    slug: string;
    title: string;
    estimatedTime?: string;
  }>;
  className?: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const STORAGE_KEY_PREFIX = 'nostrich-prereq-warning-dismissed-';

export function PrerequisiteWarning({
  currentGuideId,
  currentGuideTitle,
  prerequisites,
  className,
  onDismiss,
  dismissible = true,
}: PrerequisiteWarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [incompletePrereqs, setIncompletePrereqs] = useState<typeof prerequisites>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if warning was previously dismissed
    const dismissedKey = `${STORAGE_KEY_PREFIX}${currentGuideId}`;
    const isDismissed = typeof window !== 'undefined' && localStorage.getItem(dismissedKey) === 'true';
    
    if (isDismissed) {
      setIsVisible(false);
      return;
    }

    // Check which prerequisites are incomplete
    const prereqSlugs = prerequisites.map(p => p.slug);
    const { incomplete } = checkPrerequisites(currentGuideId, prereqSlugs);
    
    const incompleteData = prerequisites.filter(p => incomplete.includes(p.slug));
    setIncompletePrereqs(incompleteData);
    setIsVisible(incompleteData.length > 0);
  }, [currentGuideId, prerequisites]);

  const handleDismiss = () => {
    setIsVisible(false);
    
    // Store dismissal in localStorage
    if (typeof window !== 'undefined') {
      const dismissedKey = `${STORAGE_KEY_PREFIX}${currentGuideId}`;
      localStorage.setItem(dismissedKey, 'true');
    }
    
    onDismiss?.();
  };

  const calculateTotalTime = () => {
    let totalMinutes = 0;
    incompletePrereqs.forEach(prereq => {
      if (prereq.estimatedTime) {
        const match = prereq.estimatedTime.match(/(\d+)/);
        if (match) {
          totalMinutes += parseInt(match[1], 10);
        }
      }
    });
    return totalMinutes;
  };

  if (!isVisible || incompletePrereqs.length === 0) {
    return null;
  }

  const totalTime = calculateTotalTime();

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'relative rounded-2xl border border-amber-500/40',
        'bg-gradient-to-br from-amber-500/10 to-orange-500/5',
        'backdrop-blur-sm',
        'p-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-amber-900 dark:text-amber-100">
            You're skipping ahead
          </h3>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-200/80">
            This guide builds on {incompletePrereqs.length === 1 ? '1 prerequisite' : `${incompletePrereqs.length} prerequisites`} you haven't completed yet. 
            You can continue reading, but we recommend completing {incompletePrereqs.length === 1 ? 'it' : 'them'} first for the best experience.
          </p>
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
            aria-label="Dismiss warning"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Prerequisites List */}
      <div className="mt-4 space-y-2">
        {incompletePrereqs.slice(0, isExpanded ? undefined : 3).map((prereq, index) => (
          <a
            key={prereq.slug}
            href={`/guides/${prereq.slug}`}
            className={cn(
              'group flex items-center gap-3 p-3 rounded-xl',
              'bg-white/60 dark:bg-gray-900/60',
              'border border-amber-500/20',
              'hover:border-amber-500/40 hover:bg-white dark:hover:bg-gray-900',
              'transition-all duration-200'
            )}
          >
            <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold">
              {index + 1}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                {prereq.title}
              </p>
            </div>

            {prereq.estimatedTime && (
              <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                {prereq.estimatedTime}
              </div>
            )}

            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
          </a>
        ))}

        {/* Show more/less button */}
        {incompletePrereqs.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 text-sm text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 font-medium transition-colors"
          >
            {isExpanded ? 'Show less' : `Show ${incompletePrereqs.length - 3} more`}
          </button>
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-4 pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {totalTime > 0 && (
          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
            <Clock className="h-4 w-4" />
            <span>About {totalTime} min to complete all</span>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200"
          >
            Continue anyway
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            leftIcon={<BookOpen className="h-4 w-4" />}
            onClick={() => {
              window.location.href = `/guides/${incompletePrereqs[0].slug}`;
            }}
          >
            Start with first prerequisite
          </Button>
        </div>
      </div>
    </div>
  );
}
