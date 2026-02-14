import React from 'react';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LevelProgressBarProps {
  completed: number;
  total: number;
  threshold: number;
  level: SkillLevel;
  showThreshold?: boolean;
  className?: string;
}

const levelColors = {
  beginner: {
    fill: 'bg-green-500',
    text: 'text-green-600 dark:text-green-400',
    light: 'bg-green-100 dark:bg-green-900/30',
  },
  intermediate: {
    fill: 'bg-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-400',
    light: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  advanced: {
    fill: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    light: 'bg-red-100 dark:bg-red-900/30',
  },
};

const levelNames = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const nextLevelNames = {
  beginner: 'Intermediate',
  intermediate: 'Advanced',
  advanced: null,
};

/**
 * LevelProgressBar Component
 * Displays progress bar with threshold marker and completion text
 */
export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  completed,
  total,
  threshold,
  level,
  showThreshold = true,
  className = '',
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const thresholdPercentage = total > 0 ? Math.round((threshold / total) * 100) : 0;
  const colors = levelColors[level];
  const nextLevel = nextLevelNames[level];
  
  // Calculate how many more to unlock next level
  const remainingToUnlock = Math.max(0, threshold - completed);
  const isCloseToUnlock = remainingToUnlock > 0 && remainingToUnlock <= 2;
  const canUnlockNext = completed >= threshold;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar Track */}
      <div 
        className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${levelNames[level]} progress: ${completed} of ${total} guides completed`}
      >
        {/* Progress Fill */}
        <div
          className={`h-full ${colors.fill} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        
        {/* Threshold Marker */}
        {showThreshold && threshold > 0 && threshold < total && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-500 border-r-2 border-dashed border-gray-400"
            style={{ left: `${thresholdPercentage}%` }}
            aria-label={`Unlock threshold at ${threshold} guides (${thresholdPercentage}%)`}
          />
        )}
      </div>

      {/* Progress Text */}
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

      {/* Unlock Status */}
      {nextLevel && (
        <div className="mt-2">
          {canUnlockNext ? (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Ready to unlock {nextLevel}!
            </span>
          ) : isCloseToUnlock ? (
            <span className={`text-sm font-medium ${colors.text} animate-pulse`}>
              Complete {remainingToUnlock} more {levelNames[level].toLowerCase()} guide{remainingToUnlock !== 1 ? 's' : ''} to unlock {nextLevel}
            </span>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-500">
              Complete {threshold} guides to unlock {nextLevel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LevelProgressBar;
