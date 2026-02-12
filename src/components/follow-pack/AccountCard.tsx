import React, { useState } from 'react';
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
    case 'high': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
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
        relative p-4 rounded-xl border-2 transition-all duration-200
        ${isSelected 
          ? 'border-primary bg-primary/5 dark:bg-primary/10' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
        bg-white dark:bg-gray-800
      `}
    >
      {/* Category indicator */}
      <div 
        className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
        style={{ backgroundColor: borderColor }}
      />
      
      {/* Header */}
      <div className="flex items-start gap-3 mt-2">
        {/* Avatar */}
        {account.picture && !imageError ? (
          <img
            src={account.picture}
            alt={`${account.name}'s avatar`}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-gray-200 dark:bg-gray-700"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-lg font-bold text-gray-500 dark:text-gray-400 flex-shrink-0">
            {account.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {account.name}
            </h3>
            {account.verified && (
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
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
        
        {/* Follow button */}
        <button
          onClick={onToggle}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            flex items-center gap-1 flex-shrink-0
            ${isSelected
              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-primary text-white hover:bg-primary/90'
            }
          `}
        >
          {isSelected ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Follow
            </>
          )}
        </button>
      </div>
      
      {/* Bio */}
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {account.bio}
      </p>
      
      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {account.tags.slice(0, 4).map(tag => (
          <span 
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          >
            #{tag}
          </span>
        ))}
        {account.tags.length > 4 && (
          <span className="text-xs px-2 py-0.5 text-gray-400 dark:text-gray-500">
            +{account.tags.length - 4} more
          </span>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          {account.followers !== undefined && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {formatFollowers(account.followers)} followers
            </span>
          )}
          
          <span 
            className="flex items-center gap-1"
            title={`Activity: ${getActivityLabel(account.activity)}`}
          >
            <span className={`w-2 h-2 rounded-full ${getActivityColor(account.activity)}`} />
            {getActivityLabel(account.activity)}
          </span>
        </div>
        
        {onPreview && (
          <button
            onClick={onPreview}
            className="text-primary hover:underline"
          >
            Preview →
          </button>
        )}
      </div>
    </div>
  );
};
