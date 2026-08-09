/**
 * ProgressTracker Component
 * 
 * Progress bar showing overall completion with stats
 * Displays guides completed, quizzes passed, badges earned, and next milestone
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Award,
  Target,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ProgressTrackerProps } from './types';

export function ProgressTracker({
  progress,
  className,
  showMilestone = true,
  compact = false,
}: ProgressTrackerProps) {
  // Progress indicators mount in their zero state, then `entered` flips on
  // the next frame and CSS transitions them to the real value (double-rAF mount idiom).
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const completionPercentage = Math.round(
    (progress.guidesCompleted / progress.totalGuides) * 100
  );

  const milestonePercentage = Math.round(
    (progress.nextMilestone.current / progress.nextMilestone.target) * 100
  );

  const stats = [
    {
      icon: BookOpen,
      value: progress.guidesCompleted,
      total: progress.totalGuides,
      label: 'Guides',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      // Was "Day Streak". A streak counts visits; this counts what the reader
      // demonstrably understood, which is the distinction the course turns on.
      icon: CheckCircle2,
      value: progress.quizzesPassed,
      total: progress.totalQuizzes,
      label: 'Quizzes',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      icon: Award,
      value: progress.badgesEarned,
      total: progress.totalBadges,
      label: 'Badges',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  if (compact) {
    return (
      <div
        className={cn(
          'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4',
          className
        )}
        role="region"
        aria-label="Progress Summary"
      >
        <div className="flex items-center gap-4">
          {/* Progress Circle */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200 dark:text-gray-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-friendly-purple-700 dark:text-friendly-purple-400 [transition:stroke-dasharray_1s_ease-out] motion-reduce:transition-none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={entered ? `${completionPercentage}, 100` : '0, 100'}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {completionPercentage}%
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 grid grid-cols-3 gap-2">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
      role="region"
      aria-label="Learning Progress"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-friendly-purple to-friendly-gold rounded-xl">
            <TrendingUp className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Your Progress
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Keep learning to unlock more badges!
            </p>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Overall Completion
            </span>
            <span className="font-semibold text-friendly-purple-700 dark:text-friendly-purple-400">
              {progress.guidesCompleted}/{progress.totalGuides} Guides
            </span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-friendly-purple to-friendly-gold rounded-full transition-[width] duration-[800ms] ease-out motion-reduce:transition-none"
              style={{ width: entered ? `${completionPercentage}%` : '0%' }}
              role="progressbar"
              aria-valuenow={completionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${completionPercentage}% complete`}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-700">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div
              className={cn(
                'w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center',
                stat.bgColor
              )}
            >
              <stat.icon className={cn('w-5 h-5', stat.color)} aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
              {stat.total && (
                <span className="text-sm text-gray-400 font-normal">
                  /{stat.total}
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Next Milestone */}
      {showMilestone && (
        <div className="p-4 bg-gradient-to-r from-friendly-purple/5 to-friendly-gold/5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-friendly-gold/20 rounded-lg">
              <Target className="w-5 h-5 text-friendly-gold" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Next: {progress.nextMilestone.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {progress.nextMilestone.description}
              </p>
            </div>
            <div className="text-end flex-shrink-0">
              <p className="text-sm font-bold text-friendly-gold">
                {progress.nextMilestone.current}/{progress.nextMilestone.target}
              </p>
            </div>
          </div>

          {/* Milestone Progress */}
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-friendly-gold rounded-full transition-[width] duration-[800ms] delay-200 ease-out motion-reduce:transition-none"
              style={{ width: entered ? `${milestonePercentage}%` : '0%' }}
              role="progressbar"
              aria-valuenow={milestonePercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Milestone ${milestonePercentage}% complete`}
            />
          </div>

          {progress.nextMilestone.reward && (
            <div className="mt-2 flex items-center gap-2 text-xs text-friendly-gold">
              <Award className="w-3 h-3" aria-hidden="true" />
              <span>Reward: {progress.nextMilestone.reward}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgressTracker;
