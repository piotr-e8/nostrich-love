import React from 'react';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Guide {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: SkillLevel;
  href: string;
  tags?: string[];
}

export interface GuideCardProps {
  guide?: Guide;
  isCompleted?: boolean;
  isInProgress?: boolean;
  level?: SkillLevel;
  index?: number;
}

// The difficulty pill used to be tinted green / yellow / red, and `levelColors`
// held a second unused copy of the same three. Green means "completed" on this
// card — the check icon and the start border both use it — so a green pill on
// an unread beginner guide was the success colour doing decoration. The pill is
// a neutral outlined chip now; the only green left on the card is completion.

// Helper to get translated difficulty label
const getDifficultyLabel = (difficulty: SkillLevel, t: (key: string) => string) => {
  return t(`guideCard.difficulty.${difficulty}`);
};

/**
 * GuideCard
 * Shows guide details with completion status and hover effects
 */
const UnlockedCard: React.FC<{ guide: Guide; isCompleted?: boolean; isInProgress?: boolean }> = ({
  guide,
  isCompleted = false,
  isInProgress = false,
}) => {
  const { t } = useTranslation();
  const statusText = isCompleted 
    ? t('guideCard.status.completed') 
    : isInProgress 
      ? t('guideCard.status.continueReading') 
      : t('guideCard.status.startLearning');
  const difficultyLabel = getDifficultyLabel(guide.difficulty, t);

  return (
    <a
      href={guide.href}
      className={`group block rounded-lg border bg-white p-6 transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 ${
        isCompleted
          ? 'border-s-4 border-s-success-500 border-gray-200 dark:border-gray-800'
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
      }`}
      aria-label={`${guide.title} - ${difficultyLabel} - ${statusText}`}
    >
      {/* Header: Difficulty Badge + Status + Time */}
      <div className="flex items-start justify-between mb-4">
        <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-micro font-medium uppercase text-gray-600 dark:border-gray-800 dark:text-gray-400">
          {difficultyLabel}
        </span>

        <div className="flex items-center gap-2">
          {/* The link's own aria-label already reads the status, so the icon is
              decorative to a screen reader. */}
          {isCompleted && (
            <CheckCircle2
              className="h-4 w-4 text-success-600 dark:text-success-400"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          )}
          <div className="flex items-center gap-1.5 text-caption text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            <span>{guide.estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* Content: Title + Description */}
      <div className="mb-4">
        <h3 className="mb-2 line-clamp-2 text-h3 font-semibold text-gray-900 underline-offset-2 group-hover:underline dark:text-white">
          {guide.title}
        </h3>
        <p className="line-clamp-2 text-body-sm text-gray-600 dark:text-gray-400">
          {guide.description}
        </p>
      </div>

      {/* Tags (if any) */}
      {guide.tags && guide.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {guide.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-gray-200 px-2 py-0.5 text-caption text-gray-600 dark:border-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Action Text + Arrow */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
        <span className={`text-body-sm font-medium ${
          isCompleted
            ? 'text-success-700 dark:text-success-400'
            : 'text-primary-text dark:text-primary-400'
        }`}>
          {statusText}
        </span>
        {/* Directional, so it flips under RTL. It no longer slides on hover —
            the card's ground and the underlined title carry that now. */}
        <ArrowRight
          className={`h-4 w-4 shrink-0 rtl:rotate-180 ${
            isCompleted
              ? 'text-success-600 dark:text-success-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    </a>
  );
};

/**
 * GuideCard Component
 * Renders either a locked or unlocked card based on state
 */
export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  isCompleted = false,
  isInProgress = false,
  level = 'beginner',
  index = 0,
}) => {
  if (!guide) return null;

  return (
    <UnlockedCard
      guide={guide}
      isCompleted={isCompleted}
      isInProgress={isInProgress}
    />
  );
};

export default GuideCard;
