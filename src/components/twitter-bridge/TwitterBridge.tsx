import React, { useState, useCallback } from 'react';
import { TwitterSearch } from './TwitterSearch';
import { ResultsList } from './ResultsList';
import { FollowPackGenerator } from './FollowPackGenerator';
import type { MatchedAccount } from '../../types/twitter-bridge';
import {
  findTwitterOnNostr,
  findMultipleTwitterOnNostr,
  parseTwitterFollowingCSV,
} from '../../utils/nostrDirectory';

export const TwitterBridge: React.FC = () => {
  const [twitterHandle, setTwitterHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MatchedAccount[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [showGenerator, setShowGenerator] = useState(false);

  const handleSearch = useCallback(async (handle: string) => {
    setTwitterHandle(handle);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);
    setSelectedAccounts(new Set());

    try {
      // Call the real nostr.directory API
      const npub = await findTwitterOnNostr(handle);

      if (npub) {
        // Create a matched account from the API response
        const matchedAccount: MatchedAccount = {
          twitter: {
            twitterHandle: handle.replace(/^@/, '').trim().toLowerCase(),
            twitterName: handle.replace(/^@/, '').trim(),
            twitterBio: '',
          },
          nostr: {
            npub: npub,
            name: handle.replace(/^@/, '').trim(),
            username: handle.replace(/^@/, '').trim().toLowerCase(),
            bio: '',
            verified: false,
          },
          confidence: 'high',
          matchSource: 'directory',
        };
        
        setResults([matchedAccount]);
        setSelectedAccounts(new Set([npub]));
      } else {
        // No account found
        setResults([]);
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUploadCSV = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setSelectedAccounts(new Set());

    try {
      // Parse the CSV file to extract Twitter handles
      const handles = await parseTwitterFollowingCSV(file);

      if (handles.length === 0) {
        setError('No valid Twitter handles found in the CSV file.');
        setIsLoading(false);
        return;
      }

      // Search for these handles on Nostr
      const results = await findMultipleTwitterOnNostr(handles);

      // Convert results to MatchedAccount format
      const matchedAccounts: MatchedAccount[] = [];
      results.forEach((npub, handle) => {
        matchedAccounts.push({
          twitter: {
            twitterHandle: handle,
            twitterName: handle,
            twitterBio: '',
          },
          nostr: {
            npub: npub,
            name: handle,
            username: handle,
            bio: '',
            verified: false,
          },
          confidence: 'high',
          matchSource: 'directory',
        });
      });

      setResults(matchedAccounts);
      setSelectedAccounts(new Set(matchedAccounts.map(r => r.nostr.npub)));
      setHasSearched(true);
    } catch (err) {
      setError('Failed to process CSV file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleSelection = useCallback((npub: string) => {
    setSelectedAccounts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(npub)) {
        newSet.delete(npub);
      } else {
        newSet.add(npub);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedAccounts(new Set(results.map(r => r.nostr.npub)));
  }, [results]);

  const handleDeselectAll = useCallback(() => {
    setSelectedAccounts(new Set());
  }, []);

  const handleViewProfile = useCallback((account: MatchedAccount) => {
    // Open profile in new tab (would use njump.me or similar)
    window.open(`https://njump.me/${account.nostr.npub}`, '_blank');
  }, []);

  const handleFollowAll = useCallback(() => {
    setShowGenerator(true);
  }, []);

  const selectedAccountData = results.filter(r => selectedAccounts.has(r.nostr.npub));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Search Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter Bridge
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Search for your Twitter handle or upload your following list to find friends who have already joined Nostr.
          </p>
        </div>

        <TwitterSearch
          onSearch={handleSearch}
          onUploadCSV={handleUploadCSV}
          isLoading={isLoading}
          error={error}
        />

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>
              <strong>Privacy First:</strong> We only check public Nostr directories. 
              No data is stored on our servers. Your Twitter data is processed locally in your browser.
            </span>
          </p>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <ResultsList
            results={results}
            selectedAccounts={selectedAccounts}
            onToggleSelection={handleToggleSelection}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onViewProfile={handleViewProfile}
            onFollowAll={handleFollowAll}
          />
        </section>
      )}

      {/* FAQ Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-gray-800 dark:text-gray-200">How does this work?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="text-gray-600 dark:text-gray-400 mt-3 group-open:animate-fadeIn">
              We scan public Nostr directories and profiles that have linked their Twitter accounts. 
              When you search for a Twitter handle, we look for matching Nostr profiles based on NIP-05 identifiers, 
              bio mentions, and verified connections.
            </p>
          </details>
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-gray-800 dark:text-gray-200">Is my data safe?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="text-gray-600 dark:text-gray-400 mt-3 group-open:animate-fadeIn">
              Absolutely. All processing happens in your browser. We don't store any Twitter data on our servers. 
              We only query public Nostr directories that are already publicly available.
            </p>
          </details>
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span className="text-gray-800 dark:text-gray-200">What if my friends aren't on Nostr yet?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="text-gray-600 dark:text-gray-400 mt-3 group-open:animate-fadeIn">
              Invite them! Share your Nostr profile and show them why you made the switch. 
              The more people who join, the stronger the network becomes.
            </p>
          </details>
        </div>
      </section>

      {/* Follow Pack Generator Modal */}
      <FollowPackGenerator
        selectedAccounts={selectedAccountData}
        onClose={() => setShowGenerator(false)}
        isOpen={showGenerator}
      />
    </div>
  );
};
