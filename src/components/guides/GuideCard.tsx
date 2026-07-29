import React from 'react';
import { CheckCircle2, Clock, ArrowRight, BookOpen } from 'lucide-react';
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

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const levelColors = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-red-500',
};

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
      className={`group block p-6 bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-friendly-purple-400 ${
        isCompleted
          ? 'border-s-4 border-s-green-500 border-gray-200 dark:border-gray-700'
          : 'border-gray-200 dark:border-gray-700 hover:border-friendly-purple-400 dark:hover:border-friendly-purple-500'
      }`}
      aria-label={`${guide.title} - ${difficultyLabel} - ${statusText}`}
    >
      {/* Header: Difficulty Badge + Status + Time */}
      <div className="flex items-start justify-between mb-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${difficultyColors[guide.difficulty]}`}>
          {difficultyLabel}
        </span>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <CheckCircle2 className="w-5 h-5 text-green-500" aria-label={t('guideCard.status.completed')} />
          )}
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{guide.estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* Content: Title + Description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-friendly-purple-700 dark:group-hover:text-friendly-purple-400 transition-colors line-clamp-2">
          {guide.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {guide.description}
        </p>
      </div>

      {/* Tags (if any) */}
      {guide.tags && guide.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {guide.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Action Text + Arrow */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between mt-auto">
        <span className={`text-sm font-medium transition-colors ${
          isCompleted
            ? 'text-green-600 dark:text-green-400'
            : 'text-friendly-purple-700 dark:text-friendly-purple-400 group-hover:underline'
        }`}>
          {statusText}
        </span>
        <ArrowRight className={`w-5 h-5 transition-all rtl:rotate-180 ${
          isCompleted
            ? 'text-green-500'
            : 'text-gray-400 group-hover:text-friendly-purple-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1'
        }`} />
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
