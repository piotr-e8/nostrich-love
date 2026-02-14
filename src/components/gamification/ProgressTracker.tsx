/**
 * ProgressTracker Component
 * 
 * Progress bar showing overall completion with stats
 * Displays guides completed, streak days, badges earned, and next milestone
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Flame,
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
      icon: Flame,
      value: progress.streakDays,
      label: 'Day Streak',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      suffix: progress.streakDays === 1 ? '' : 's',
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
              <motion.path
                className="text-friendly-purple"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${completionPercentage}, 100`}
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${completionPercentage}, 100` }}
                transition={{ duration: 1, ease: 'easeOut' }}
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
                  {stat.suffix && <span className="text-xs">{stat.suffix}</span>}
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
            <span className="font-semibold text-friendly-purple">
              {progress.guidesCompleted}/{progress.totalGuides} Guides
            </span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-friendly-purple to-friendly-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
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
      <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
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
              {stat.suffix && (
                <span className="text-sm text-gray-400 font-normal">
                  {stat.suffix}
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
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-friendly-gold">
                {progress.nextMilestone.current}/{progress.nextMilestone.target}
              </p>
            </div>
          </div>

          {/* Milestone Progress */}
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-friendly-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${milestonePercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
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
