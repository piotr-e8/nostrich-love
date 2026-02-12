import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ArrowRight, BookOpen, Clock, Shield, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { checkPrerequisites } from '../../lib/progressService';
import { Button } from '../ui/Button';

export interface PrerequisiteModalProps {
  currentGuideId: string;
  currentGuideTitle: string;
  prerequisites: Array<{
    slug: string;
    title: string;
    description?: string;
    estimatedTime?: string;
  }>;
  isCritical?: boolean;
  criticalMessage?: string;
  onContinueAnyway?: () => void;
  onClose?: () => void;
  className?: string;
}

export function PrerequisiteModal({
  currentGuideId,
  currentGuideTitle,
  prerequisites,
  isCritical = false,
  criticalMessage = "This guide covers foundational concepts that are essential for understanding Nostr safely and effectively.",
  onContinueAnyway,
  onClose,
  className,
}: PrerequisiteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [incompletePrereqs, setIncompletePrereqs] = useState<typeof prerequisites>([]);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    // Check which prerequisites are incomplete
    const prereqSlugs = prerequisites.map(p => p.slug);
    const { incomplete } = checkPrerequisites(currentGuideId, prereqSlugs);
    
    const incompleteData = prerequisites.filter(p => incomplete.includes(p.slug));
    setIncompletePrereqs(incompleteData);
    
    // Only show modal if there are incomplete prerequisites
    if (incompleteData.length > 0) {
      setIsOpen(true);
    }
  }, [currentGuideId, prerequisites]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleContinueAnyway = () => {
    setIsOpen(false);
    onContinueAnyway?.();
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

  if (!isOpen || incompletePrereqs.length === 0) {
    return null;
  }

  const totalTime = calculateTotalTime();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prereq-modal-title"
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/60 backdrop-blur-sm',
        className
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={cn(
          'relative w-full max-w-2xl max-h-[90vh] overflow-y-auto',
          'rounded-3xl',
          'bg-white dark:bg-gray-900',
          'border border-gray-200 dark:border-gray-800',
          'shadow-2xl'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn(
          'relative p-6 sm:p-8',
          isCritical 
            ? 'bg-gradient-to-br from-red-500/10 to-orange-500/5 border-b border-red-500/20' 
            : 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-b border-amber-500/20'
        )}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className={cn(
              'flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl',
              isCritical 
                ? 'bg-red-500/20 text-red-600 dark:text-red-400' 
                : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
            )}>
              {isCritical ? <Shield className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
            </div>
            
            <div>
              <h2 
                id="prereq-modal-title"
                className={cn(
                  'text-xl sm:text-2xl font-bold',
                  isCritical 
                    ? 'text-red-900 dark:text-red-100' 
                    : 'text-amber-900 dark:text-amber-100'
                )}
              >
                {isCritical ? 'Important prerequisites' : 'Before you continue'}
              </h2>
              <p className={cn(
                'mt-2 text-sm',
                isCritical 
                  ? 'text-red-700 dark:text-red-200/80' 
                  : 'text-amber-800 dark:text-amber-200/80'
              )}>
                {criticalMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Time estimate */}
          {totalTime > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Estimated time to complete prerequisites
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  About {totalTime} minutes total
                </p>
              </div>
            </div>
          )}

          {/* Prerequisites list */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Incomplete prerequisites ({incompletePrereqs.length})
            </h3>
            
            <div className="space-y-3">
              {incompletePrereqs.map((prereq, index) => (
                <a
                  key={prereq.slug}
                  href={`/guides/${prereq.slug}`}
                  className={cn(
                    'group flex items-start gap-4 p-4 rounded-xl',
                    'bg-gray-50 dark:bg-gray-800/50',
                    'border border-gray-200 dark:border-gray-700',
                    'hover:border-primary/30 dark:hover:border-primary/30',
                    'hover:bg-white dark:hover:bg-gray-800',
                    'transition-all duration-200'
                  )}
                >
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {prereq.title}
                    </h4>
                    {prereq.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {prereq.description}
                      </p>
                    )}
                    {prereq.estimatedTime && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {prereq.estimatedTime}
                      </div>
                    )}
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors mt-1" />
                </a>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className={cn(
            'p-4 rounded-xl border',
            isCritical 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          )}>
            <p className={cn(
              'text-sm',
              isCritical 
                ? 'text-red-800 dark:text-red-200' 
                : 'text-amber-800 dark:text-amber-200'
            )}>
              <strong>We recommend:</strong> Complete {incompletePrereqs.length === 1 ? 'this prerequisite' : 'these prerequisites'} first. 
              {isCritical 
                ? ' The concepts covered are essential for your safety and understanding.' 
                : " They'll make this guide much easier to follow."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              leftIcon={<BookOpen className="h-5 w-5" />}
              onClick={() => {
                window.location.href = `/guides/${incompletePrereqs[0].slug}`;
              }}
            >
              Go to first prerequisite
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              className="flex-1"
              onClick={handleContinueAnyway}
            >
              Continue anyway
            </Button>
          </div>
          
          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            You can always come back to complete prerequisites later. Your progress is saved automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
