import React from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';
import type { CuratedAccount, Category } from '../../types/follow-pack';

interface PackSidebarProps {
  selectedAccounts: CuratedAccount[];
  categoryBreakdown: Record<string, number>;
  categories: Category[];
  onRemoveAccount: (npub: string) => void;
  onClearAll: () => void;
  onExport: () => void;
}

export const PackSidebar: React.FC<PackSidebarProps> = ({
  selectedAccounts,
  categoryBreakdown,
  categories,
  onRemoveAccount,
  onClearAll,
  onExport,
}) => {
  const hasSelections = selectedAccounts.length > 0;

  return (
    <div className="space-y-4">
      {/* Main pack card */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-h3 text-gray-900 dark:text-white">Your Follow Pack</h3>
          <p className="text-body-sm text-gray-600 dark:text-gray-400">
            {hasSelections 
              ? `${selectedAccounts.length} account${selectedAccounts.length !== 1 ? 's' : ''} selected`
              : 'Select accounts to build your pack'
            }
          </p>
        </div>
        
        {/* Category breakdown */}
        {hasSelections && (
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <h4 className="mb-3 text-micro font-semibold uppercase text-gray-500 dark:text-gray-400">
              Categories
            </h4>
            <div className="space-y-2">
              {Object.entries(categoryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([categoryId, count]) => {
                  const category = categories.find(c => c.id === categoryId);
                  if (!category) return null;
                  return (
                    <div key={categoryId} className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="flex-1 text-body-sm text-gray-700 dark:text-gray-300">
                        {category.name}
                      </span>
                      <span className="text-body-sm font-medium text-gray-900 dark:text-white">
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        
        {/* Selected accounts list */}
        <div className="max-h-96 overflow-y-auto">
          {hasSelections ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {selectedAccounts.map(account => (
                <div 
                  key={account.npub}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {/* Avatar */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-body-sm font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {account.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-body-sm font-medium text-gray-900 dark:text-white">
                      {account.name}
                    </p>
                    {account.username && (
                      <p className="truncate text-caption text-gray-500 dark:text-gray-400">
                        @{account.username}
                      </p>
                    )}
                  </div>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveAccount(account.npub)}
                    className="rounded-md p-1 text-gray-400 transition-colors hover:text-danger-700 dark:text-gray-500 dark:hover:text-danger-400"
                    title="Remove from pack"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-body-sm text-gray-500 dark:text-gray-400">
                Your pack is empty
              </p>
              <p className="mt-1 text-caption text-gray-500 dark:text-gray-500">
                Click "Follow" on accounts to add them
              </p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        {hasSelections && (
          <div className="space-y-2 border-t border-gray-200 p-4 dark:border-gray-800">
            <button
              type="button"
              onClick={onExport}
              className="relative z-10 flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Generate Follow Pack
            </button>
            
            <button
              type="button"
              onClick={onClearAll}
              className="w-full rounded-md px-4 py-2 text-body-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Clear all selections
            </button>
          </div>
        )}
      </div>
      
      {/* Tips */}
      {hasSelections && selectedAccounts.length < 10 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          <p className="flex items-start gap-2 text-body-sm text-gray-700 dark:text-gray-300">
            <Lightbulb
              className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>
              <span className="font-medium">Tip:</span> Aim for 20-50 accounts to start. You can always add more later!
            </span>
          </p>
        </div>
      )}
      
      {hasSelections && selectedAccounts.length >= 50 && (
        <div className="rounded-lg border border-warning-200 bg-warning-50 p-3 dark:border-warning-900 dark:bg-warning-950">
          <p className="flex items-start gap-2 text-body-sm text-warning-900 dark:text-warning-100">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-warning-600 dark:text-warning-400"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>
              You have {selectedAccounts.length} accounts selected. Consider quality over quantity!
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
