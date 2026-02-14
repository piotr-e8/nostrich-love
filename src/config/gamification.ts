/**
 * Gamification Configuration
 * 
 * Centralized config for all activities, badges, and streak tracking.
 * Modify this file to change what gets rewarded without touching component code.
 */

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
}

export interface ActivityTrigger {
  type: 'count' | 'threshold' | 'boolean';
  threshold?: number; // For 'count' type - award when count >= threshold
}

export interface ActivityDefinition {
  id: string;
  name: string;
  description: string;
  triggers: {
    streak: boolean; // Does this activity count toward streak?
    badges: Array<{
      badgeId: string;
      trigger: ActivityTrigger;
    }>;
  };
}

export const GAMIFICATION_CONFIG = {
  // ============================================================================
  // BADGE DEFINITIONS
  // ============================================================================
  badges: {
    'key-master': {
      id: 'key-master',
      name: 'Key Master',
      description: 'Generated your first Nostr key pair',
      icon: '🔑',
      rarity: 'common' as const,
      requirement: 'Generate keys in the Key Generator',
    },
    'first-post': {
      id: 'first-post',
      name: 'First Post',
      description: 'Made your first post on Nostr',
      icon: '📝',
      rarity: 'common' as const,
      requirement: 'Publish your first note (requires Nostr client)',
    },
    'zap-receiver': {
      id: 'zap-receiver',
      name: 'Zap Receiver',
      description: 'Received your first Lightning zap',
      icon: '⚡',
      rarity: 'rare' as const,
      requirement: 'Receive a zap from another user (requires Nostr client)',
    },
    'community-builder': {
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Selected 10+ accounts to follow',
      icon: '🤝',
      rarity: 'common' as const,
      requirement: 'Select 10 or more accounts in the Follow Pack Finder',
    },
    'knowledge-seeker': {
      id: 'knowledge-seeker',
      name: 'Knowledge Seeker',
      description: 'Completed 3 guides',
      icon: '📚',
      rarity: 'common' as const,
      requirement: 'Complete any 3 learning guides',
    },
    'nostr-graduate': {
      id: 'nostr-graduate',
      name: 'Nostr Graduate',
      description: 'Completed all learning guides',
      icon: '🎓',
      rarity: 'epic' as const,
      requirement: 'Complete all 9 beginner-friendly guides',
    },
    'security-conscious': {
      id: 'security-conscious',
      name: 'Security Conscious',
      description: 'Backed up your keys',
      icon: '🛡️',
      rarity: 'common' as const,
      requirement: 'Download your key backup file',
    },
    'relay-explorer': {
      id: 'relay-explorer',
      name: 'Relay Explorer',
      description: 'Connected to 3+ relays',
      icon: '🌐',
      rarity: 'common' as const,
      requirement: 'Select 3 or more relays in the Relay Explorer',
    },
  } satisfies Record<string, BadgeDefinition>,

  // ============================================================================
  // ACTIVITY DEFINITIONS
  // ============================================================================
  // Add or modify activities here to change what gets tracked and rewarded
  activities: {
    /**
     * Viewing a guide page
     * - Counts toward streak
     * - No badges (just viewing doesn't earn badges)
     */
    viewGuide: {
      id: 'view-guide',
      name: 'View Guide',
      description: 'User viewed a guide page',
      triggers: {
        streak: true,
        badges: [],
      },
    } satisfies ActivityDefinition,

    /**
     * Completing a guide (scrolling to 80%)
     * - Counts toward streak
     * - Awards knowledge-seeker at 3 guides
     * - Awards nostr-graduate at 9 guides (all beginner guides)
     */
    completeGuide: {
      id: 'complete-guide',
      name: 'Complete Guide',
      description: 'User scrolled through 80% of a guide',
      triggers: {
        streak: true,
        badges: [
          {
            badgeId: 'knowledge-seeker',
            trigger: { type: 'count', threshold: 3 },
          },
          {
            badgeId: 'nostr-graduate',
            trigger: { type: 'count', threshold: 9 },
          },
        ],
      },
    } satisfies ActivityDefinition,

    /**
     * Generating Nostr keys
     * - Counts toward streak
     * - Awards key-master badge (one-time)
     */
    generateKeys: {
      id: 'generate-keys',
      name: 'Generate Keys',
      description: 'User generated a new Nostr key pair',
      triggers: {
        streak: true,
        badges: [
          {
            badgeId: 'key-master',
            trigger: { type: 'boolean' },
          },
        ],
      },
    } satisfies ActivityDefinition,

    /**
     * Backing up keys (downloading)
     * - Counts toward streak
     * - Awards security-conscious badge (one-time)
     */
    backupKeys: {
      id: 'backup-keys',
      name: 'Backup Keys',
      description: 'User downloaded their key backup file',
      triggers: {
        streak: true,
        badges: [
          {
            badgeId: 'security-conscious',
            trigger: { type: 'boolean' },
          },
        ],
      },
    } satisfies ActivityDefinition,

    /**
     * Selecting relays
     * - Counts toward streak
     * - Awards relay-explorer at 3+ relays
     */
    selectRelays: {
      id: 'select-relays',
      name: 'Select Relays',
      description: 'User selected relays in the Relay Explorer',
      triggers: {
        streak: true,
        badges: [
          {
            badgeId: 'relay-explorer',
            trigger: { type: 'threshold', threshold: 3 },
          },
        ],
      },
    } satisfies ActivityDefinition,

    /**
     * Selecting accounts to follow
     * - Counts toward streak
     * - Awards community-builder at 10+ accounts
     */
    followAccounts: {
      id: 'follow-accounts',
      name: 'Follow Accounts',
      description: 'User selected accounts in the Follow Pack Finder',
      triggers: {
        streak: true,
        badges: [
          {
            badgeId: 'community-builder',
            trigger: { type: 'threshold', threshold: 10 },
          },
        ],
      },
    } satisfies ActivityDefinition,

    /**
     * Making first post (requires external client)
     * - Counts toward streak
     * - Awards first-post badge
     * NOTE: This requires actual Nostr client usage
     */
    makeFirstPost: {
      id: 'make-first-post',
      name: 'Make First Post',
      description: 'User made their first Nostr post',
      triggers: {
        streak: true,
        badges: [
          {
            badgeId: 'first-post',
            trigger: { type: 'boolean' },
          },
        ],
      },
    } satisfies ActivityDefinition,

    /**
     * Receiving first zap (requires external client)
     * - Counts toward streak
     * - Awards zap-receiver badge
     * NOTE: This requires actual Nostr client usage
     */
    receiveFirstZap: {
      id: 'receive-first-zap',
      name: 'Receive First Zap',
      description: 'User received their first Lightning zap',
      triggers: {
        streak: true,
        badges: [
          {
            badgeId: 'zap-receiver',
            trigger: { type: 'boolean' },
          },
        ],
      },
    } satisfies ActivityDefinition,
  } satisfies Record<string, ActivityDefinition>,
};

// Type helpers for type-safe access
export type BadgeId = keyof typeof GAMIFICATION_CONFIG.badges;
export type ActivityId = keyof typeof GAMIFICATION_CONFIG.activities;
