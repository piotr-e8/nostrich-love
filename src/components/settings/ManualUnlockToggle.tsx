import React, { useState, useEffect } from 'react';
import { unlockAllLevels, hasManualUnlock, getUnlockedLevels } from '../../utils/gamification';

export function ManualUnlockToggle() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current state
    const manualUnlock = hasManualUnlock();
    const unlockedLevels = getUnlockedLevels();
    setIsUnlocked(manualUnlock || unlockedLevels.length === 3);
    setIsLoading(false);
  }, []);

  const handleToggle = () => {
    if (!isUnlocked) {
      // Show confirmation before unlocking
      setShowConfirmation(true);
    }
    // Note: Once unlocked, we don't allow re-locking via this toggle
  };

  const confirmUnlock = () => {
    unlockAllLevels();
    setIsUnlocked(true);
    setShowConfirmation(false);

    // Dispatch event to refresh UI
    window.dispatchEvent(new Event('gamification-updated'));
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Unlock All Levels</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Access all learning guides immediately without completing prerequisites
              </p>
            </div>

            <button
              onClick={handleToggle}
              disabled={isUnlocked}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isUnlocked
                  ? 'bg-primary cursor-default'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              role="switch"
              aria-checked={isUnlocked}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isUnlocked ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isUnlocked && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <span>All levels are unlocked. You have full access to all guides.</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold">Unlock All Levels?</h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This will immediately unlock all learning levels (Beginner, Intermediate, Advanced)
              without requiring guide completion. You can still track your progress, but the
              progression system will be bypassed.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnlock}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
              >
                Unlock All Levels
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
