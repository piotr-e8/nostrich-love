import React from 'react';
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
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
          <h3 className="font-bold text-lg">Your Follow Pack</h3>
          <p className="text-white/80 text-sm">
            {hasSelections 
              ? `${selectedAccounts.length} account${selectedAccounts.length !== 1 ? 's' : ''} selected`
              : 'Select accounts to build your pack'
            }
          </p>
        </div>
        
        {/* Category breakdown */}
        {hasSelections && (
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
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
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                        {category.name}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
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
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {selectedAccounts.map(account => (
                <div 
                  key={account.npub}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {account.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {account.name}
                    </p>
                    {account.username && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        @{account.username}
                      </p>
                    )}
                  </div>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveAccount(account.npub)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove from pack"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your pack is empty
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Click "Follow" on accounts to add them
              </p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        {hasSelections && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <button
              type="button"
              onClick={onExport}
              className="w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 relative z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Generate Follow Pack
            </button>
            
            <button
              type="button"
              onClick={onClearAll}
              className="w-full py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
            >
              Clear all selections
            </button>
          </div>
        )}
      </div>
      
      {/* Tips */}
      {hasSelections && selectedAccounts.length < 10 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-medium">💡 Tip:</span> Aim for 20-50 accounts to start. You can always add more later!
          </p>
        </div>
      )}
      
      {hasSelections && selectedAccounts.length >= 50 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <span className="font-medium">⚠️</span> You have {selectedAccounts.length} accounts selected. Consider quality over quantity!
          </p>
        </div>
      )}
    </div>
  );
};
