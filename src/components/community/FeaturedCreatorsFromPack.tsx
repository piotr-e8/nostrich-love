import React, { useState, useMemo } from 'react';
import type { CuratedAccount } from '../../types/follow-pack';
import { curatedAccounts } from '../../data/follow-pack/accounts';
import { getCategoryById } from '../../data/follow-pack/categories';

interface FeaturedCreatorsFromPackProps {
  categoryId: string;
  maxDisplay?: number;
  followPackUrl: string;
}

export const FeaturedCreatorsFromPack: React.FC<FeaturedCreatorsFromPackProps> = ({
  categoryId,
  maxDisplay = 6,
  followPackUrl,
}) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  const category = getCategoryById(categoryId);
  
  const featuredAccounts = useMemo<CuratedAccount[]>(() => {
    return curatedAccounts
      .filter((account: CuratedAccount) => account.categories.includes(categoryId as any))
      .slice(0, maxDisplay);
  }, [categoryId, maxDisplay]);
  
  const handleImageError = (npub: string) => {
    setImageErrors(prev => new Set(prev).add(npub));
  };
  
  const borderColor = category?.color || '#8B5CF6';
  
  if (featuredAccounts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No accounts yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Be among the first to join this community on Nostr!
        </p>
        <a
          href={followPackUrl}
          className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-friendly-purple-600 hover:bg-friendly-purple-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Explore Community
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredAccounts.map((account) => (
          <a
            key={account.npub}
            href={`https://njump.me/${account.npub}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Category color indicator */}
            <div 
              className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
              style={{ backgroundColor: borderColor }}
            />
            
            {/* Header */}
            <div className="flex items-start gap-4 mt-2">
              {/* Avatar */}
              {account.picture && !imageErrors.has(account.npub) ? (
                <img
                  src={account.picture}
                  alt={`${account.name}'s avatar`}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0 bg-gray-200 dark:bg-gray-700"
                  onError={() => handleImageError(account.npub)}
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {account.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-friendly-purple-600 dark:group-hover:text-friendly-purple-400 transition-colors">
                  {account.name}
                </h3>
                
                {account.username && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    @{account.username}
                  </p>
                )}
                
                {account.nip05 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {account.nip05}
                  </p>
                )}
              </div>
            </div>
            
            {/* Bio */}
            {account.bio && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {account.bio}
              </p>
            )}
            
            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              {account.followers !== undefined && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {account.followers >= 1000 
                    ? `${(account.followers / 1000).toFixed(1)}K` 
                    : account.followers} followers
                </span>
              )}
              
              {account.activity && (
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    account.activity === 'high' ? 'bg-green-500' :
                    account.activity === 'medium' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                  {account.activity === 'high' ? 'Very Active' :
                   account.activity === 'medium' ? 'Active' :
                   'Occasional'}
                </span>
              )}
            </div>
            
            {/* Hover hint */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <span className="text-xs text-friendly-purple-600 dark:text-friendly-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Profile →
              </span>
            </div>
          </a>
        ))}
      </div>
      
      {/* CTA Button */}
      <div className="text-center pt-4">
        <a
          href={followPackUrl}
          className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-friendly-purple-600 hover:bg-friendly-purple-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Follow These Accounts
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          View all {featuredAccounts.length}+ accounts and import with one click
        </p>
      </div>
    </div>
  );
};
