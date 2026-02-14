import React from 'react';
import type { ResultsListProps, MatchedAccount } from '../../types/twitter-bridge';

interface AccountCardProps {
  account: MatchedAccount;
  isSelected: boolean;
  onToggle: () => void;
  onViewProfile: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isSelected,
  onToggle,
  onViewProfile,
}) => {
  const { twitter, nostr, confidence, matchSource } = account;

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-orange-400';
      default: return 'bg-gray-400';
    }
  };

  const getMatchSourceLabel = (source: string) => {
    switch (source) {
      case 'nip05': return 'NIP-05 Verified';
      case 'bio': return 'Bio Match';
      case 'manual': return 'Manual Link';
      case 'directory': return 'Directory';
      default: return 'Matched';
    }
  };

  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200
        ${isSelected
          ? 'border-friendly-purple-500 bg-friendly-purple-50/50 dark:bg-friendly-purple-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
        bg-white dark:bg-gray-800
      `}
    >
      {/* Confidence indicator */}
      <div
        className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${getConfidenceColor(confidence)}`}
        title={`Match confidence: ${confidence}`}
      />

      <div className="flex items-start gap-4 mt-2">
        {/* Twitter Avatar */}
        <div className="flex-shrink-0">
          {twitter.twitterAvatar ? (
            <img
              src={twitter.twitterAvatar}
              alt={`${twitter.twitterHandle}'s Twitter avatar`}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {twitter.twitterHandle.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 dark:text-white">
              {nostr.name}
            </h3>
            {nostr.verified && (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className={`
              text-xs px-2 py-0.5 rounded-full font-medium
              ${confidence === 'high' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                confidence === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              }
            `}>
              {getMatchSourceLabel(matchSource)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className="font-medium text-blue-500">@{twitter.twitterHandle}</span>
            <span>→</span>
            {nostr.username && (
              <span className="font-medium text-friendly-purple-600 dark:text-friendly-purple-400">
                @{nostr.username}
              </span>
            )}
          </div>

          {nostr.nip05 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {nostr.nip05}
            </p>
          )}

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {nostr.bio}
          </p>

          {nostr.lud16 && (
            <p className="mt-2 text-xs text-friendly-gold-600 dark:text-friendly-gold-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              ⚡ {nostr.lud16}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onToggle}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5
              ${isSelected
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-friendly-purple-600 text-white hover:bg-friendly-purple-700'
              }
            `}
          >
            {isSelected ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Added</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Follow</span>
              </>
            )}
          </button>

          <button
            onClick={onViewProfile}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-friendly-purple-600 dark:hover:text-friendly-purple-400 transition-colors"
          >
            View Profile →
          </button>
        </div>
      </div>
    </div>
  );
};

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  selectedAccounts,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  onViewProfile,
  onFollowAll,
}) => {
  const allSelected = results.length > 0 && results.every(r => selectedAccounts.has(r.nostr.npub));
  const someSelected = selectedAccounts.size > 0 && !allSelected;
  const selectedCount = selectedAccounts.size;

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No matches found yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Search for a Twitter handle to find friends who have joined Nostr. 
          We'll check public Nostr directories to find matches.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Select All */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
              ${allSelected
                ? 'bg-friendly-purple-600 border-friendly-purple-600'
                : someSelected
                  ? 'bg-friendly-purple-600/50 border-friendly-purple-600'
                  : 'border-gray-300 dark:border-gray-600 hover:border-friendly-purple-400'
              }
            `}
          >
            {(allSelected || someSelected) && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Found {results.length} friend{results.length !== 1 ? 's' : ''} on Nostr
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedCount} selected
            </p>
          </div>
        </div>

        {selectedCount > 0 && (
          <button
            onClick={onFollowAll}
            className="px-6 py-2.5 bg-friendly-purple-600 hover:bg-friendly-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Follow {selectedCount} Selected
          </button>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-4">
        {results.map((account) => (
          <AccountCard
            key={account.nostr.npub}
            account={account}
            isSelected={selectedAccounts.has(account.nostr.npub)}
            onToggle={() => onToggleSelection(account.nostr.npub)}
            onViewProfile={() => onViewProfile(account)}
          />
        ))}
      </div>

      {/* Share Results */}
      {results.length > 0 && (
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {results.length} friend{results.length !== 1 ? 's' : ''} from Twitter
            </p>
            <button
              onClick={() => {
                const text = `I found ${results.length} of my Twitter friends on Nostr! Join me on the decentralized social network. nostrich.love`;
                if (navigator.share) {
                  navigator.share({
                    title: 'Found my friends on Nostr',
                    text: text,
                    url: 'https://nostrich.love/twitter-bridge',
                  });
                } else {
                  navigator.clipboard.writeText(text);
                }
              }}
              className="text-sm text-friendly-purple-600 dark:text-friendly-purple-400 hover:text-friendly-purple-700 dark:hover:text-friendly-purple-300 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
