/**
 * Type definitions for prerequisite system
 */

export interface PrerequisiteGuide {
  /** Unique slug identifier for the guide */
  slug: string;
  /** Display title of the guide */
  title: string;
  /** Optional description of the guide */
  description?: string;
  /** Estimated time to complete (e.g., "10 min", "5-10 minutes") */
  estimatedTime?: string;
}

export interface PrerequisiteCheckResult {
  /** List of prerequisite slugs that are completed */
  completed: string[];
  /** List of prerequisite slugs that are incomplete */
  incomplete: string[];
  /** Whether all prerequisites are completed */
  allCompleted: boolean;
  /** Percentage of prerequisites completed (0-100) */
  completionPercentage: number;
}

export interface PrerequisiteWarningProps {
  /** Current guide identifier */
  currentGuideId: string;
  /** Current guide display title */
  currentGuideTitle: string;
  /** Array of prerequisite guides to check */
  prerequisites: PrerequisiteGuide[];
  /** Additional CSS classes */
  className?: string;
  /** Callback when user dismisses the warning */
  onDismiss?: () => void;
  /** Whether the warning can be dismissed (default: true) */
  dismissible?: boolean;
}

export interface PrerequisiteModalProps {
  /** Current guide identifier */
  currentGuideId: string;
  /** Current guide display title */
  currentGuideTitle: string;
  /** Array of prerequisite guides */
  prerequisites: PrerequisiteGuide[];
  /** Whether this is a critical guide requiring special attention */
  isCritical?: boolean;
  /** Custom message for critical guides */
  criticalMessage?: string;
  /** Callback when user chooses to continue anyway */
  onContinueAnyway?: () => void;
  /** Callback when modal is closed */
  onClose?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export interface EnhancedGuideCompletionIndicatorProps {
  /** Array of all guides in the learning path */
  guides: Array<{
    slug: string;
    title: string;
  }>;
  /** Slug of the currently viewed guide */
  currentGuideSlug: string;
  /** Array of prerequisite slugs for the current guide */
  currentGuidePrerequisites?: string[];
  /** Additional CSS classes */
  className?: string;
  /** Whether to show prerequisite indicators (default: true) */
  showPrerequisites?: boolean;
}

export interface GuideProgress {
  guideId: string;
  status: 'not-started' | 'viewed' | 'engaged' | 'completed';
  timeSpentSeconds: number;
  maxScrollDepth: number;
  checklistCompleted: string[];
  lastVisitedAt: string;
  completedAt?: string;
}
