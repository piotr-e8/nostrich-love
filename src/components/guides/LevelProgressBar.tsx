import React from 'react';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LevelProgressBarProps {
  completed: number;
  total: number;
  level: SkillLevel;
  className?: string;
}

const levelColors = {
  beginner: {
    fill: 'bg-green-500',
    text: 'text-green-600 dark:text-green-400',
  },
  intermediate: {
    fill: 'bg-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  advanced: {
    fill: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
  },
};

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
  const colors = levelColors[level];

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${levelNames[level]} progress: ${completed} of ${total} guides completed`}
      >
        <div
          className={`h-full ${colors.fill} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{completed}</span>
          {' '}of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
          {' '}guides completed
        </span>
        <span className={`font-medium ${colors.text}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default LevelProgressBar;
