import React, { useState } from 'react';
import type { CuratedAccount } from '../../types/follow-pack';
import { AccountCard } from './AccountCard';
import { useFocusTrap } from '../../hooks/useFocusTrap';

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
  // Trap focus inside the preview dialog; Escape closes, focus returns to the opener.
  const previewModalRef = useFocusTrap<HTMLDivElement>(previewAccount !== null, () =>
    setPreviewAccount(null),
  );

  if (accounts.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 text-h3 text-gray-900 dark:text-white">
          No accounts found
        </h3>
        <p className="text-body-sm text-gray-600 dark:text-gray-400">
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
            className="text-body-sm text-primary-text underline-offset-2 hover:underline dark:text-primary-400"
          >
            Select all visible
          </button>
          <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
          <span className="text-body-sm text-gray-600 dark:text-gray-400">
            {accounts.length} accounts
          </span>
        </div>
        
        <div className="flex items-center gap-1 rounded-md border border-gray-200 p-1 dark:border-gray-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`
              rounded-md p-1.5 transition-colors
              ${viewMode === 'grid'
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
            title="Grid view"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              rounded-md p-1.5 transition-colors
              ${viewMode === 'list'
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
            title="List view"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
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
            ref={previewModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-preview-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-raised dark:border-gray-800 dark:bg-gray-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 id="account-preview-title" className="text-h2 text-gray-900 dark:text-white">
                {previewAccount.name}
              </h2>
              <button
                onClick={() => setPreviewAccount(null)}
                className="rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label="Close preview"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-micro font-semibold uppercase text-gray-500 dark:text-gray-400">Bio</h3>
                <p className="text-body-sm text-gray-900 dark:text-white">{previewAccount.bio}</p>
              </div>
              
              <div>
                <h3 className="mb-1 text-micro font-semibold uppercase text-gray-500 dark:text-gray-400">npub</h3>
                <code className="break-all rounded-md border border-gray-200 px-2 py-1 text-caption dark:border-gray-800">
                  {previewAccount.npub}
                </code>
              </div>
              
              {previewAccount.nip05 && (
                <div>
                  <h3 className="mb-1 text-micro font-semibold uppercase text-gray-500 dark:text-gray-400">NIP-05</h3>
                  <p className="text-body-sm text-gray-900 dark:text-white">{previewAccount.nip05}</p>
                </div>
              )}
              
              {previewAccount.website && (
                <div>
                  <h3 className="mb-1 text-micro font-semibold uppercase text-gray-500 dark:text-gray-400">Website</h3>
                  <a 
                    href={previewAccount.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-primary-text underline-offset-2 hover:underline dark:text-primary-400"
                  >
                    {previewAccount.website}
                  </a>
                </div>
              )}
              
              <div>
                <h3 className="mb-1 text-micro font-semibold uppercase text-gray-500 dark:text-gray-400">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {previewAccount.tags.map(tag => (
                    <span 
                      key={tag}
                      className="rounded-md border border-gray-200 px-2 py-1 text-caption text-gray-700 dark:border-gray-800 dark:text-gray-300"
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
                  rounded-md px-6 py-2 font-medium transition-colors
                  ${selectedNpubs.has(previewAccount.npub)
                    ? 'border border-danger-200 text-danger-800 hover:bg-danger-50 dark:border-danger-900 dark:text-danger-300 dark:hover:bg-danger-950'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
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
