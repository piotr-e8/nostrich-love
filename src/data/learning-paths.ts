/**
 * Skill Levels Configuration
 * 
 * Progressive learning system with 3 levels:
 * - Beginner (6 guides) - Unlocked by default
 * - Intermediate (6 guides) - Unlock at 4/6 Beginner completion
 * - Advanced (4 guides) - Unlock at 4/6 Intermediate completion
 * 
 * Users can complete all guides across all levels.
 */

export interface SkillLevelConfig {
  id: SkillLevel;
  label: string;
  icon: string;
  description: string;
  sequence: string[]; // Ordered list of guide slugs
  unlockThreshold: number; // Number of guides to complete in previous level
  estimatedTotalTime: string;
}

export const SKILL_LEVELS: Record<SkillLevel, SkillLevelConfig> = {
  beginner: {
    id: 'beginner',
    label: 'Beginner',
    icon: '🌱',
    description: 'Start your Nostr journey with the fundamentals. No prior knowledge required.',
    sequence: [
      'what-is-nostr',
      'keys-and-security',
      'quickstart',
      'finding-community',
      'faq',
      'relays-demystified'
    ],
    unlockThreshold: 0, // Always unlocked
    estimatedTotalTime: '60 min'
  },
  
  intermediate: {
    id: 'intermediate',
    label: 'Intermediate',
    icon: '🚀',
    description: 'Level up with deeper topics like NIP-05, Zaps, and essential tools.',
    sequence: [
      'nip05-identity',
      'zaps-and-lightning',
      'nostr-tools',
      'troubleshooting',
      'multi-client',
      'relay-guide'
    ],
    unlockThreshold: 4, // Unlock after completing 4 Beginner guides
    estimatedTotalTime: '75 min'
  },
  
  advanced: {
    id: 'advanced',
    label: 'Advanced',
    icon: '⚡',
    description: 'Master the protocol with privacy, security, and technical deep dives.',
    sequence: [
      'privacy-security',
      'nip17-private-messages',
      'protocol-comparison'
    ],
    unlockThreshold: 4, // Unlock after completing 4 Intermediate guides
    estimatedTotalTime: '45 min'
  }
} as const;

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Get all available skill level IDs
 */
export function getSkillLevelIds(): SkillLevel[] {
  return Object.keys(SKILL_LEVELS) as SkillLevel[];
}

/**
 * Get a specific skill level configuration
 */
export function getSkillLevel(levelId: SkillLevel): SkillLevelConfig | undefined {
  return SKILL_LEVELS[levelId];
}

/**
 * Get the default skill level for new users
 */
export function getDefaultLevel(): SkillLevelConfig {
  return SKILL_LEVELS.beginner;
}

/**
 * Get the default skill level ID
 */
export function getDefaultLevelId(): SkillLevel {
  return 'beginner';
}

/**
 * Check if a guide is part of a specific skill level
 */
export function isGuideInLevel(guideSlug: string, levelId: SkillLevel): boolean {
  const level = SKILL_LEVELS[levelId];
  if (!level) return false;
  return level.sequence.includes(guideSlug);
}

/**
 * Get the position of a guide within a level (1-based index)
 * Returns -1 if guide is not in the level
 */
export function getGuidePositionInLevel(guideSlug: string, levelId: SkillLevel): number {
  const level = SKILL_LEVELS[levelId];
  if (!level) return -1;
  const index = level.sequence.indexOf(guideSlug);
  return index === -1 ? -1 : index + 1;
}

/**
 * Get total number of guides in a level
 */
export function getLevelLength(levelId: SkillLevel): number {
  const level = SKILL_LEVELS[levelId];
  return level ? level.sequence.length : 0;
}

/**
 * Get all guides in a level as an array
 */
export function getLevelSequence(levelId: SkillLevel): string[] {
  const level = SKILL_LEVELS[levelId];
  return level ? [...level.sequence] : [];
}

/**
 * Get the next level in progression
 * Returns null if already at advanced
 */
export function getNextLevel(currentLevel: SkillLevel): SkillLevel | null {
  const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
  const index = levels.indexOf(currentLevel);
  if (index === -1 || index >= levels.length - 1) return null;
  return levels[index + 1];
}

/**
 * Get the previous level in progression
 * Returns null if already at beginner
 */
export function getPreviousLevel(currentLevel: SkillLevel): SkillLevel | null {
  const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
  const index = levels.indexOf(currentLevel);
  if (index <= 0) return null;
  return levels[index - 1];
}

/**
 * Check if a level is valid
 */
export function isValidLevel(levelId: string): levelId is SkillLevel {
  return levelId in SKILL_LEVELS;
}

/**
 * Get unlock threshold for a level
 */
export function getUnlockThreshold(levelId: SkillLevel): number {
  const level = SKILL_LEVELS[levelId];
  return level ? level.unlockThreshold : 0;
}

/**
 * Check if a level should be unlocked based on completion count
 */
export function shouldUnlockLevel(
  levelId: SkillLevel, 
  completedInPreviousLevel: number
): boolean {
  const threshold = getUnlockThreshold(levelId);
  if (threshold === 0) return true; // Beginner is always unlocked
  return completedInPreviousLevel >= threshold;
}

/**
 * Get all guides across all levels
 */
export function getAllGuides(): string[] {
  const allGuides: string[] = [];
  (Object.keys(SKILL_LEVELS) as SkillLevel[]).forEach(levelId => {
    allGuides.push(...SKILL_LEVELS[levelId].sequence);
  });
  // Remove duplicates while preserving order
  return [...new Set(allGuides)];
}

/**
 * Find which level a guide belongs to
 */
export function getGuideLevel(guideSlug: string): SkillLevel | null {
  for (const levelId of (Object.keys(SKILL_LEVELS) as SkillLevel[])) {
    if (SKILL_LEVELS[levelId].sequence.includes(guideSlug)) {
      return levelId;
    }
  }
  return null;
}

/**
 * Get ordered list of all guides (beginner → intermediate → advanced)
 */
export function getAllGuidesOrdered(): string[] {
  return [
    ...SKILL_LEVELS.beginner.sequence,
    ...SKILL_LEVELS.intermediate.sequence,
    ...SKILL_LEVELS.advanced.sequence
  ];
}

// ============================================================================
// Backwards Compatibility (Deprecated - for migration only)
// ============================================================================

/** @deprecated Use SkillLevel instead */
export type LearningPathId = SkillLevel;

/** @deprecated Use SKILL_LEVELS instead */
export const LEARNING_PATHS = SKILL_LEVELS;

/** @deprecated Use getSkillLevel instead */
export const getLearningPath = getSkillLevel;

/** @deprecated Use getDefaultLevel instead */
export const getDefaultPath = getDefaultLevel;

/** @deprecated Use isGuideInLevel instead */
export const isGuideInPath = isGuideInLevel;

/** @deprecated Use getGuidePositionInLevel instead */
export const getGuidePositionInPath = getGuidePositionInLevel;

/** @deprecated Use getPathLength instead */
export const getPathLength = getLevelLength;

/** @deprecated Use getPathSequence instead */
export const getPathSequence = getLevelSequence;

/** @deprecated Use getPreviousLevel instead */
export const getPreviousGuideInPath = (guideSlug: string, levelId: SkillLevel): string | null => {
  const level = SKILL_LEVELS[levelId];
  if (!level) return null;
  const index = level.sequence.indexOf(guideSlug);
  if (index <= 0) return null;
  return level.sequence[index - 1];
};

/** @deprecated Use getNextLevel instead */
export const getNextGuideInPath = (guideSlug: string, levelId: SkillLevel): string | null => {
  const level = SKILL_LEVELS[levelId];
  if (!level) return null;
  const index = level.sequence.indexOf(guideSlug);
  if (index === -1 || index >= level.sequence.length - 1) return null;
  return level.sequence[index + 1];
};

/** @deprecated Use isValidLevel instead */
export const isValidPathId = isValidLevel;
