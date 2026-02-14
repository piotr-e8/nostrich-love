/**
 * Activity Data
 *
 * Pre-written activity messages for the simulated feed system.
 * Categories: guide completions, badge earnings, new users, zaps received.
 */

export type ActivityType = 'guide' | 'badge' | 'zap' | 'user' | 'statistic';

export interface Activity {
  id: string;
  message: string;
  type: ActivityType;
  userName?: string;
  icon?: string;
}

export const activities: Activity[] = [
  // Guide Completions
  { id: 'guide-1', message: 'just completed the Quickstart guide', type: 'guide', userName: 'Sarah', icon: '📚' },
  { id: 'guide-2', message: 'finished the Keys & Security tutorial', type: 'guide', userName: 'Mike', icon: '🔐' },
  { id: 'guide-3', message: 'completed Understanding Relays', type: 'guide', userName: 'Emma', icon: '📖' },
  { id: 'guide-4', message: 'mastered NIP-05 Verification', type: 'guide', userName: 'Alex', icon: '✅' },
  { id: 'guide-5', message: 'just finished Setting Up Damus', type: 'guide', userName: 'Jordan', icon: '📱' },
  { id: 'guide-6', message: 'completed the First Post tutorial', type: 'guide', userName: 'Chris', icon: '📝' },
  { id: 'guide-7', message: 'finished the Zap Basics guide', type: 'guide', userName: 'Taylor', icon: '⚡' },
  { id: 'guide-8', message: 'completed Understanding Nostr', type: 'guide', userName: 'Morgan', icon: '🌟' },
  { id: 'guide-9', message: 'mastered the Twitter Bridge setup', type: 'guide', userName: 'Casey', icon: '🐦' },
  { id: 'guide-10', message: 'finished the Follow Pack tutorial', type: 'guide', userName: 'Riley', icon: '📦' },
  { id: 'guide-11', message: 'completed all beginner guides', type: 'guide', userName: 'Quinn', icon: '🎓' },
  { id: 'guide-12', message: 'just finished Backup & Recovery', type: 'guide', userName: 'Avery', icon: '💾' },

  // Badge Earnings
  { id: 'badge-1', message: 'earned their first zap', type: 'badge', userName: 'Mike', icon: '⚡' },
  { id: 'badge-2', message: 'unlocked the Nostr Newbie badge', type: 'badge', userName: 'Priya', icon: '🌱' },
  { id: 'badge-3', message: 'earned the Key Guardian badge', type: 'badge', userName: 'David', icon: '🛡️' },
  { id: 'badge-4', message: 'unlocked the Social Butterfly badge', type: 'badge', userName: 'Luna', icon: '🦋' },
  { id: 'badge-5', message: 'earned the Zap Master badge', type: 'badge', userName: 'Kai', icon: '⚡' },
  { id: 'badge-6', message: 'unlocked the Relay Explorer badge', type: 'badge', userName: 'Zoe', icon: '🚀' },
  { id: 'badge-7', message: 'earned the 7-Day Streak badge', type: 'badge', userName: 'Noah', icon: '🔥' },
  { id: 'badge-8', message: 'unlocked the NIP-05 Verified badge', type: 'badge', userName: 'Mia', icon: '✨' },
  { id: 'badge-9', message: 'earned the Guide Graduate badge', type: 'badge', userName: 'Ethan', icon: '🎓' },
  { id: 'badge-10', message: 'unlocked the Early Adopter badge', type: 'badge', userName: 'Isabella', icon: '🌟' },

  // New Users
  { id: 'user-1', message: 'New user joined from Twitter', type: 'user', icon: '🐦' },
  { id: 'user-2', message: 'Someone just created their first keys', type: 'user', icon: '🔑' },
  { id: 'user-3', message: 'New member joined from Reddit', type: 'user', icon: '👽' },
  { id: 'user-4', message: 'A Bitcoiner just discovered Nostr', type: 'user', icon: '₿' },
  { id: 'user-5', message: 'New user signed up via mobile app', type: 'user', icon: '📱' },
  { id: 'user-6', message: 'Someone joined from the newsletter', type: 'user', icon: '📧' },
  { id: 'user-7', message: 'New developer exploring the protocol', type: 'user', icon: '👨‍💻' },
  { id: 'user-8', message: 'A podcaster just joined Nostr', type: 'user', icon: '🎙️' },
  { id: 'user-9', message: 'New user migrated from Mastodon', type: 'user', icon: '🐘' },
  { id: 'user-10', message: 'Someone just set up their first client', type: 'user', icon: '⚙️' },

  // Zap Receipts
  { id: 'zap-1', message: 'just received their first zap', type: 'zap', userName: 'Jamie', icon: '⚡' },
  { id: 'zap-2', message: 'got zapped 1,000 sats', type: 'zap', userName: 'Sam', icon: '⚡' },
  { id: 'zap-3', message: 'received a zap from a new follower', type: 'zap', userName: 'Drew', icon: '⚡' },
  { id: 'zap-4', message: 'just got their biggest zap ever', type: 'zap', userName: 'Charlie', icon: '⚡' },
  { id: 'zap-5', message: 'received 5 zaps in the last hour', type: 'zap', userName: 'Max', icon: '⚡' },

  // Statistics
  { id: 'stat-1', message: 'people learning Nostr right now', type: 'statistic', icon: '🌍', userName: '1,247' },
  { id: 'stat-2', message: 'guides completed today', type: 'statistic', icon: '📈', userName: '342' },
  { id: 'stat-3', message: 'new users joined this week', type: 'statistic', icon: '🚀', userName: '892' },
  { id: 'stat-4', message: 'zaps sent in the last 24 hours', type: 'statistic', icon: '⚡', userName: '15.3K' },
  { id: 'stat-5', message: 'badges earned this month', type: 'statistic', icon: '🏆', userName: '2,156' },
];

/**
 * Generate a random timestamp within the last hour
 */
export function generateRandomTimestamp(): Date {
  const now = new Date();
  const randomMinutes = Math.floor(Math.random() * 60);
  return new Date(now.getTime() - randomMinutes * 60 * 1000);
}

/**
 * Format a timestamp as a relative time string (e.g., "2 min ago", "just now")
 */
export function formatRelativeTime(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffMin < 1) {
    return 'just now';
  } else if (diffMin === 1) {
    return '1 min ago';
  } else if (diffMin < 60) {
    return `${diffMin} min ago`;
  } else {
    return '1 hour ago';
  }
}

/**
 * Get a random activity that is different from the last one
 */
export function getRandomActivity(excludeId?: string): Activity {
  const available = excludeId
    ? activities.filter((a) => a.id !== excludeId)
    : activities;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

/**
 * Generate a display-ready activity with formatted timestamp
 */
export interface DisplayActivity extends Activity {
  timestamp: Date;
  relativeTime: string;
}

export function generateDisplayActivity(excludeId?: string): DisplayActivity {
  const activity = getRandomActivity(excludeId);
  const timestamp = generateRandomTimestamp();
  return {
    ...activity,
    timestamp,
    relativeTime: formatRelativeTime(timestamp),
  };
}
