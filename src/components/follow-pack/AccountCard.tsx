import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { CuratedAccount, Category } from '../../types/follow-pack';
import { getCategoryById } from '../../data/follow-pack';

interface AccountCardProps {
  account: CuratedAccount;
  isSelected: boolean;
  onToggle: () => void;
  onPreview?: () => void;
}

const formatFollowers = (count?: number): string => {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

const getActivityColor = (activity: string): string => {
  switch (activity) {
    case 'high': return 'bg-success-500';
    case 'medium': return 'bg-warning-500';
    case 'low': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

const getActivityLabel = (activity: string): string => {
  switch (activity) {
    case 'high': return 'Very Active';
    case 'medium': return 'Active';
    case 'low': return 'Occasional';
    default: return 'Unknown';
  }
};

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isSelected,
  onToggle,
  onPreview,
}) => {
  const primaryCategory = getCategoryById(account.categories[0]);
  const borderColor = primaryCategory?.color || '#8B5CF6';
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className={`
        relative rounded-lg border p-4 transition-colors
        ${isSelected
          ? 'border-primary-600 dark:border-primary-400'
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
        }
        bg-white dark:bg-gray-900
      `}
    >
      {/* Category indicator */}
      <div 
        className="absolute inset-x-0 top-0 h-1 rounded-t-lg"
        style={{ backgroundColor: borderColor }}
      />
      
      {/* Header */}
      <div className="flex items-start gap-3 mt-2">
        {/* Avatar */}
        {account.picture && !imageError ? (
          <img
            src={account.picture}
            alt={`${account.name}'s avatar`}
            // Intrinsic size matches w-12/h-12 (48px). Without it the browser
            // reserves no space for a hotlinked avatar it has never seen, so
            // every card jumps as images land — the whole list shifts on a
            // page that renders dozens of them.
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-h3 font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {account.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {account.name}
            </h3>
            {account.verified && (
              <svg className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          {account.username && (
            <p className="truncate text-body-sm text-gray-500 dark:text-gray-400">
              @{account.username}
            </p>
          )}
          
          {account.nip05 && (
            <p className="truncate text-caption text-gray-500 dark:text-gray-500">
              {account.nip05}
            </p>
          )}
        </div>
        
        {/* Follow button */}
        <button
          onClick={onToggle}
          className={`
            flex flex-shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-body-sm
            font-medium transition-colors
            ${isSelected
              ? 'border border-danger-200 text-danger-800 hover:bg-danger-50 dark:border-danger-900 dark:text-danger-300 dark:hover:bg-danger-950'
              : 'bg-primary-600 text-white hover:bg-primary-700'
            }
          `}
        >
          {isSelected ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              Added
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Follow
            </>
          )}
        </button>
      </div>
      
      {/* Bio */}
      <p className="mt-3 line-clamp-2 text-body-sm text-gray-600 dark:text-gray-300">
        {account.bio}
      </p>
      
      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {account.tags.slice(0, 4).map(tag => (
          <span 
            key={tag}
            className="rounded-md border border-gray-200 px-2 py-0.5 text-caption text-gray-600 dark:border-gray-800 dark:text-gray-400"
          >
            #{tag}
          </span>
        ))}
        {account.tags.length > 4 && (
          <span className="px-2 py-0.5 text-caption text-gray-500 dark:text-gray-500">
            +{account.tags.length - 4} more
          </span>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-caption text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          {account.followers !== undefined && (
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {formatFollowers(account.followers)} followers
            </span>
          )}
          
          <span 
            className="flex items-center gap-1"
            title={`Activity: ${getActivityLabel(account.activity)}`}
          >
            <span className={`h-2 w-2 rounded-full ${getActivityColor(account.activity)}`} aria-hidden="true" />
            {getActivityLabel(account.activity)}
          </span>
        </div>
        
        {onPreview && (
          <button
            onClick={onPreview}
            className="inline-flex items-center gap-1 text-primary-text underline-offset-2 hover:underline dark:text-primary-400"
          >
            Preview
            <ArrowRight
              className="h-4 w-4 rtl:rotate-180"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
};
