import React, { useState } from 'react';
import { Lock, Unlock, Loader2, X } from 'lucide-react';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UnlockButtonProps {
  level: SkillLevel;
  onUnlock: () => void;
  disabled?: boolean;
  completedInPrevious?: number;
  totalInPrevious?: number;
  threshold?: number;
}

const levelNames = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const levelColors = {
  beginner: 'border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30',
  intermediate: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30',
  advanced: 'border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30',
};

/**
 * UnlockButton Component
 * Shows unlock button with confirmation modal
 */
export const UnlockButton: React.FC<UnlockButtonProps> = ({
  level,
  onUnlock,
  disabled = false,
  completedInPrevious = 0,
  totalInPrevious = 0,
  threshold = 4,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async () => {
    setIsLoading(true);
    try {
      await onUnlock();
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMetThreshold = completedInPrevious >= threshold;
  const remainingToThreshold = Math.max(0, threshold - completedInPrevious);

  return (
    <>
      {/* Unlock Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={disabled || isLoading}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-transparent border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-friendly-purple-400 disabled:opacity-50 disabled:cursor-not-allowed ${levelColors[level]}`}
        aria-label={`Unlock ${levelNames[level]} guides`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Unlocking...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Unlock {levelNames[level]}</span>
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="unlock-modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 
                id="unlock-modal-title" 
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Unlock {levelNames[level]} Guides?
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-friendly-purple-100 dark:bg-friendly-purple-900/30 rounded-full">
                <Unlock className="w-8 h-8 text-friendly-purple-600 dark:text-friendly-purple-400" />
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-center">
                You've completed{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {completedInPrevious} of {totalInPrevious}
                </span>{' '}
                guides in the previous level.
              </p>

              {!hasMetThreshold ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-semibold">Early Unlock:</span>{' '}
                    The recommended threshold is {threshold} guides. You're {remainingToThreshold} guide{remainingToThreshold !== 1 ? 's' : ''} away.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <span className="font-semibold">Ready to unlock!</span>{' '}
                    You've met the recommended threshold.
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
                Note: Unlocking early won't affect your progress tracking.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Keep Locked
              </button>
              <button
                onClick={handleUnlock}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-friendly-purple-600 text-white font-medium rounded-lg hover:bg-friendly-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Unlock Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UnlockButton;
