import React from 'react';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LevelProgressBarProps {
  completed: number;
  total: number;
  level: SkillLevel;
  className?: string;
}

const levelNames = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/**
 * LevelProgressBar Component
 * Shows how much of a level the reader has completed.
 *
 * The unlock threshold marker and the "complete N more to unlock" states were
 * removed with the level-gating layer — nothing is gated any more, so progress
 * here is informational only.
 */
export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  completed,
  total,
  level,
  className = '',
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // The fill used to be green at Beginner, yellow at Intermediate, red at
  // Advanced. Three problems in one bar: green is the completion colour on the
  // cards below, red reads as an error, and none of the three said anything the
  // heading had not already said. Progress is an accent, so it is purple, and
  // it is purple at every level.
  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${levelNames[level]} progress: ${completed} of ${total} guides completed`}
      >
        <div
          className="h-full rounded-full bg-primary-600 transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-caption">
        <span className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{completed}</span>
          {' '}of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
          {' '}guides completed
        </span>
        <span className="font-semibold text-gray-900 dark:text-white">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default LevelProgressBar;
