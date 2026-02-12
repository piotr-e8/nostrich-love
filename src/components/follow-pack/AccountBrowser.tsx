import React, { useState } from 'react';
import type { CuratedAccount } from '../../types/follow-pack';
import { AccountCard } from './AccountCard';

interface AccountBrowserProps {
  accounts: CuratedAccount[];
  selectedNpubs: Set<string>;
  onToggleAccount: (npub: string) => void;
  onSelectAll: () => void;
}

export const AccountBrowser: React.FC<AccountBrowserProps> = ({
  accounts,
  selectedNpubs,
  onToggleAccount,
  onSelectAll,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewAccount, setPreviewAccount] = useState<CuratedAccount | null>(null);

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No accounts found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAll}
            className="text-sm text-primary hover:underline"
          >
            Select all visible
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {accounts.length} accounts
          </span>
        </div>
        
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`
              p-1.5 rounded transition-colors
              ${viewMode === 'grid' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
            title="Grid view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              p-1.5 rounded transition-colors
              ${viewMode === 'list' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
            title="List view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

        {/* Accounts grid/list */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
          : 'space-y-3'
        }
      `}>
        {accounts.map(account => (
          <AccountCard
            key={account.npub}
            account={account}
            isSelected={selectedNpubs.has(account.npub)}
            onToggle={() => onToggleAccount(account.npub)}
            onPreview={() => setPreviewAccount(account)}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {previewAccount && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setPreviewAccount(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {previewAccount.name}
              </h2>
              <button
                onClick={() => setPreviewAccount(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bio</h3>
                <p className="text-gray-900 dark:text-white">{previewAccount.bio}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">npub</h3>
                <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded break-all">
                  {previewAccount.npub}
                </code>
              </div>
              
              {previewAccount.nip05 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">NIP-05</h3>
                  <p className="text-gray-900 dark:text-white">{previewAccount.nip05}</p>
                </div>
              )}
              
              {previewAccount.website && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Website</h3>
                  <a 
                    href={previewAccount.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {previewAccount.website}
                  </a>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {previewAccount.tags.map(tag => (
                    <span 
                      key={tag}
                      className="text-sm px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  onToggleAccount(previewAccount.npub);
                  setPreviewAccount(null);
                }}
                className={`
                  px-6 py-2 rounded-lg font-medium
                  ${selectedNpubs.has(previewAccount.npub)
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-primary text-white hover:bg-primary/90'
                  }
                `}
              >
                {selectedNpubs.has(previewAccount.npub) ? 'Remove from Pack' : 'Add to Pack'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
