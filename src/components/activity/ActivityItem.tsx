/**
 * ActivityItem Component
 *
 * Individual activity component with different styling per type.
 * Features hover effects and accessibility.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { ActivityType } from '../../data/activities';

export interface ActivityItemProps {
  message: string;
  timestamp: string;
  type: ActivityType;
  icon?: string;
  userName?: string;
  className?: string;
}

const typeStyles: Record<ActivityType, { bg: string; border: string; icon: string; text: string }> = {
  guide: {
    bg: 'bg-blue-50/50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100',
  },
  badge: {
    bg: 'bg-amber-50/50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-600 dark:text-amber-400',
    text: 'text-amber-900 dark:text-amber-100',
  },
  zap: {
    bg: 'bg-yellow-50/50 dark:bg-yellow-950/30',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-900 dark:text-yellow-100',
  },
  user: {
    bg: 'bg-green-50/50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
  },
  statistic: {
    bg: 'bg-purple-50/50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
    text: 'text-purple-900 dark:text-purple-100',
  },
};

const typeIcons: Record<ActivityType, string> = {
  guide: '📚',
  badge: '🏆',
  zap: '⚡',
  user: '👋',
  statistic: '📊',
};

export function ActivityItem({
  message,
  timestamp,
  type,
  icon,
  userName,
  className,
}: ActivityItemProps) {
  const styles = typeStyles[type];
  const displayIcon = icon || typeIcons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'group relative flex items-start gap-3 p-3 rounded-xl border transition-all duration-300',
        'hover:shadow-md hover:scale-[1.02] cursor-default',
        styles.bg,
        styles.border,
        className
      )}
      role="listitem"
    >
      {/* Icon Container */}
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-lg',
          'bg-white/60 dark:bg-black/20 backdrop-blur-sm',
          styles.icon,
          'transition-transform duration-300 group-hover:scale-110'
        )}
        aria-hidden="true"
      >
        {displayIcon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm leading-relaxed', styles.text)}>
          {userName && type !== 'statistic' && (
            <span className="font-semibold">{userName} </span>
          )}
          {type === 'statistic' && userName && (
            <span className="font-bold">{userName} </span>
          )}
          {message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {timestamp}
        </p>
      </div>

      {/* Type Indicator Dot */}
      <div
        className={cn(
          'absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-0',
          'group-hover:opacity-100 transition-opacity duration-300',
          styles.icon.replace('text-', 'bg-')
        )}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export default ActivityItem;
