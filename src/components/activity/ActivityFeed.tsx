/**
 * ActivityFeed Component
 * 
 * Displays recent user activity, guide completions, and badge unlocks
 * Shown in sidebar on desktop, footer on mobile
 */

import { motion } from 'framer-motion';
import { BookOpen, Award, Flame, Clock, Trophy, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActivityItemData {
  id: string;
  type: 'guide_complete' | 'badge_earned' | 'streak_milestone' | 'milestone_reached';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: {
    guideSlug?: string;
    badgeEmoji?: string;
    streakDays?: number;
  };
}

interface ActivityFeedProps {
  activities?: ActivityItemData[];
  maxItems?: number;
  className?: string;
  compact?: boolean;
}

const iconMap = {
  guide_complete: BookOpen,
  badge_earned: Award,
  streak_milestone: Flame,
  milestone_reached: Trophy,
};

const colorMap = {
  guide_complete: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  badge_earned: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  streak_milestone: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
  milestone_reached: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
};

// Demo activities for when no real data exists
const demoActivities: ActivityItemData[] = [
  {
    id: '1',
    type: 'guide_complete',
    title: 'Completed "What is Nostr?"',
    description: 'Understanding the protocol basics',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    metadata: { guideSlug: 'what-is-nostr' },
  },
  {
    id: '2',
    type: 'badge_earned',
    title: 'Earned "First Steps" Badge',
    description: 'Started your Nostr journey',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    metadata: { badgeEmoji: '👣' },
  },
  {
    id: '3',
    type: 'streak_milestone',
    title: '3-Day Streak!',
    description: 'Keep the momentum going',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    metadata: { streakDays: 3 },
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function ActivityFeed({
  activities,
  maxItems = 5,
  className,
  compact = false,
}: ActivityFeedProps) {
  // Use demo activities if none provided
  const displayActivities = activities?.length ? activities.slice(0, maxItems) : demoActivities.slice(0, maxItems);

  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        {displayActivities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorMap[activity.type])}>
                {activity.metadata?.badgeEmoji ? (
                  <span className="text-sm">{activity.metadata.badgeEmoji}</span>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-friendly-purple" />
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {displayActivities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[activity.type])}>
                  {activity.metadata?.badgeEmoji ? (
                    <span className="text-xl">{activity.metadata.badgeEmoji}</span>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <a
          href="/guides"
          className="text-xs text-friendly-purple hover:text-friendly-purple-dark font-medium flex items-center justify-center gap-1 transition-colors"
        >
          View all activity
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default ActivityFeed;
