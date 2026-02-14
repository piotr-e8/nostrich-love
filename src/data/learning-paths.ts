/**
 * Learning Paths Configuration
 * 
 * Centralized definition of all learning paths, their sequences,
 * and metadata. Used for navigation, progress tracking, and UI.
 */

export interface LearningPathConfig {
  id: string;
  label: string;
  icon: string;
  description: string;
  sequence: string[]; // Ordered list of guide slugs
  hideAdvanced: boolean;
  estimatedTotalTime: string;
  targetAudience: string;
}

export const LEARNING_PATHS: Record<string, LearningPathConfig> = {
  beginner: {
    id: 'beginner',
    label: 'Beginner',
    icon: '👋',
    description: 'New to Nostr? Start here with no technical knowledge required.',
    sequence: [
      'what-is-nostr',
      'keys-and-security',
      'quickstart',
      'relays-demystified',
      'nip05-identity',
      'zaps-and-lightning',
      'finding-community',
      'nostr-tools',
      'troubleshooting'
    ],
    hideAdvanced: true,
    estimatedTotalTime: '90 min',
    targetAudience: 'Complete beginners'
  },
  
  bitcoiner: {
    id: 'bitcoiner',
    label: 'Bitcoiner',
    icon: '₿',
    description: 'Already into Bitcoin? Skip the basics and dive into Lightning.',
    sequence: [
      'quickstart',
      'zaps-and-lightning',
      'relays-demystified',
      'finding-community',
      'nostr-tools',
      'troubleshooting',
      'relay-guide',
      'faq'
    ],
    hideAdvanced: false,
    estimatedTotalTime: '75 min',
    targetAudience: 'Bitcoin enthusiasts'
  },
  
  privacy: {
    id: 'privacy',
    label: 'Privacy Advocate',
    icon: '🔒',
    description: 'Privacy-first approach with emphasis on security best practices.',
    sequence: [
      'what-is-nostr',
      'keys-and-security',
      'quickstart',
      'relays-demystified',
      'privacy-security',
      'nip05-identity',
      'troubleshooting',
      'faq'
    ],
    hideAdvanced: false,
    estimatedTotalTime: '85 min',
    targetAudience: 'Privacy-conscious users'
  },
  
  general: {
    id: 'general',
    label: 'All Guides',
    icon: '📚',
    description: 'Browse all guides at your own pace.',
    sequence: [
      'protocol-comparison',
      'what-is-nostr',
      'keys-and-security',
      'quickstart',
      'relays-demystified',
      'nip05-identity',
      'zaps-and-lightning',
      'finding-community',
      'nostr-tools',
      'troubleshooting',
      'relay-guide',
      'privacy-security',
      'nip17-private-messages',
      'multi-client',
      'faq'
    ],
    hideAdvanced: false,
    estimatedTotalTime: '3 hours',
    targetAudience: 'Self-directed learners'
  }
} as const;

export type LearningPathId = keyof typeof LEARNING_PATHS;

/**
 * Get all available learning path IDs
 */
export function getLearningPathIds(): string[] {
  return Object.keys(LEARNING_PATHS);
}

/**
 * Get a specific learning path configuration
 */
export function getLearningPath(pathId: string): LearningPathConfig | undefined {
  return LEARNING_PATHS[pathId];
}

/**
 * Get the default learning path for new users
 */
export function getDefaultPath(): LearningPathConfig {
  return LEARNING_PATHS.beginner;
}

/**
 * Check if a guide is part of a specific learning path
 */
export function isGuideInPath(guideSlug: string, pathId: string): boolean {
  const path = LEARNING_PATHS[pathId];
  if (!path) return false;
  return path.sequence.includes(guideSlug);
}

/**
 * Get the position of a guide within a path (1-based index)
 * Returns -1 if guide is not in the path
 */
export function getGuidePositionInPath(guideSlug: string, pathId: string): number {
  const path = LEARNING_PATHS[pathId];
  if (!path) return -1;
  const index = path.sequence.indexOf(guideSlug);
  return index === -1 ? -1 : index + 1;
}

/**
 * Get total number of guides in a path
 */
export function getPathLength(pathId: string): number {
  const path = LEARNING_PATHS[pathId];
  return path ? path.sequence.length : 0;
}

/**
 * Get previous guide in path
 */
export function getPreviousGuideInPath(guideSlug: string, pathId: string): string | null {
  const path = LEARNING_PATHS[pathId];
  if (!path) return null;
  const index = path.sequence.indexOf(guideSlug);
  if (index <= 0) return null;
  return path.sequence[index - 1];
}

/**
 * Get next guide in path
 */
export function getNextGuideInPath(guideSlug: string, pathId: string): string | null {
  const path = LEARNING_PATHS[pathId];
  if (!path) return null;
  const index = path.sequence.indexOf(guideSlug);
  if (index === -1 || index >= path.sequence.length - 1) return null;
  return path.sequence[index + 1];
}

/**
 * Get all guides in a path as an array
 */
export function getPathSequence(pathId: string): string[] {
  const path = LEARNING_PATHS[pathId];
  return path ? [...path.sequence] : [];
}

/**
 * Validate that a path ID is valid
 */
export function isValidPathId(pathId: string): pathId is LearningPathId {
  return pathId in LEARNING_PATHS;
}
