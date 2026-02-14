/**
 * Gamification Types and Interfaces
 * 
 * TypeScript interfaces for all gamification components
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: Date;
  category: 'beginner' | 'intermediate' | 'advanced' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
}

export interface UserProgress {
  guidesCompleted: number;
  totalGuides: number;
  streakDays: number;
  badgesEarned: number;
  totalBadges: number;
  lastActive: Date;
  nextMilestone: Milestone;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  reward?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: Date;
  streakHistory: Date[];
}

export interface BadgeDisplayProps {
  badges: Badge[];
  unlockedBadgeIds: string[];
  onBadgeClick?: (badge: Badge) => void;
  className?: string;
  showAnimation?: boolean;
  newlyUnlockedId?: string | null;
}

export interface ProgressTrackerProps {
  progress: UserProgress;
  className?: string;
  showMilestone?: boolean;
  compact?: boolean;
}

export interface StreakBannerProps {
  streakDays: number;
  isVisible: boolean;
  onDismiss?: () => void;
  className?: string;
  position?: 'top' | 'bottom';
}

export interface BadgeEarnedModalProps {
  isOpen: boolean;
  badge: Badge | null;
  onClose: () => void;
  onClaim?: () => void;
  showConfetti?: boolean;
}

export interface GamificationContextType {
  badges: Badge[];
  unlockedBadges: string[];
  progress: UserProgress;
  streak: StreakData;
  unlockBadge: (badgeId: string) => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  updateStreak: () => void;
}
