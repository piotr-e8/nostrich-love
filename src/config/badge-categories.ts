import type { BadgeId } from '../utils/gamification';

/**
 * Which shelf a badge sits on when it is displayed.
 *
 * Presentation only — nothing here affects whether a badge can be earned, and
 * BADGE_DEFINITIONS deliberately does not carry it. It lives in its own module
 * because /badges needs it twice: once while rendering the page and once in the
 * inline script that unlocks cards from localStorage. Those two used to hold
 * full, separately hand-maintained copies of all nine badges.
 */
export const BADGE_CATEGORY: Record<BadgeId, 'beginner' | 'intermediate' | 'advanced' | 'special'> = {
  'key-master': 'beginner',
  'first-post': 'beginner',
  'zap-receiver': 'intermediate',
  'community-builder': 'intermediate',
  'knowledge-seeker': 'intermediate',
  'nostr-graduate': 'advanced',
  'security-conscious': 'intermediate',
  'relay-explorer': 'intermediate',
  'privacy-expert': 'advanced',
  'level-beginner': 'beginner',
  'level-intermediate': 'intermediate',
  'level-advanced': 'advanced',
};
