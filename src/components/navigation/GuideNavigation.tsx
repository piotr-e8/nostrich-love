import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SKILL_LEVELS, type SkillLevel, getGuideLevel } from '../../data/learning-paths';
import { isLevelUnlockedLocal } from '../../lib/progress';
import { useTranslation } from '../../hooks/useTranslation';
import { guidesIndexPath } from "../../i18n/paths";

interface GuideInfo {
  slug: string;
  title: string;
}

interface GuideNavigationProps {
  guideTitles?: Record<string, string>;
  className?: string;
  locale?: string;
}

export function GuideNavigation({
  guideTitles,
  className,
  locale = 'en',
}: GuideNavigationProps) {
  const { t } = useTranslation();
  const [prevGuide, setPrevGuide] = useState<GuideInfo | null>(null);
  const [nextGuide, setNextGuide] = useState<GuideInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showOffLevelMessage, setShowOffLevelMessage] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<SkillLevel>('beginner');
  const [isNextLevelUnlocked, setIsNextLevelUnlocked] = useState(false);
  const [nextLevelFirstGuide, setNextLevelFirstGuide] = useState<string | null>(null);
  const [nextLevel, setNextLevel] = useState<SkillLevel | null>(null);

  useEffect(() => {
    try {
      // Get current guide from URL
      const pathParts = window.location.pathname.split('/');
      const currentSlug = pathParts[pathParts.length - 1];
      
      // Determine which level this guide belongs to (not user's current level)
      const guideLevel = getGuideLevel(currentSlug);
      
      if (!guideLevel) {
        // Guide not found in any level
        setShowOffLevelMessage(true);
        setPrevGuide(null);
        setNextGuide(null);
        setIsLoading(false);
        return;
      }
      
      setCurrentLevel(guideLevel);
      const levelConfig = SKILL_LEVELS[guideLevel];
      
      // Calculate navigation within this guide's level
      const currentIndex = levelConfig.sequence.indexOf(currentSlug);
      
      // Check if this is the last guide in the level
      if (currentIndex === levelConfig.sequence.length - 1) {
        setIsLevelComplete(true);
        
        // Check if next level exists and is unlocked
        const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
        const currentLevelIndex = levels.indexOf(guideLevel);
        const nextLvl = levels[currentLevelIndex + 1];
        
        if (nextLvl) {
          setNextLevel(nextLvl);
          const isNextUnlocked = isLevelUnlockedLocal(nextLvl);
          setIsNextLevelUnlocked(isNextUnlocked);
          if (isNextUnlocked) {
            // Get first guide of next level
            const nextLevelFirst = SKILL_LEVELS[nextLvl].sequence[0];
            setNextLevelFirstGuide(nextLevelFirst);
          }
        }
        
        // Previous guide (if not first)
        if (currentIndex > 0) {
          const prevSlug = levelConfig.sequence[currentIndex - 1];
          setPrevGuide({
            slug: prevSlug,
            title: guideTitles?.[prevSlug] || formatTitle(prevSlug)
          });
        }
        setNextGuide(null);
      } else {
        // Normal case - middle of level
        setIsLevelComplete(false);
        setNextLevel(null);
        setIsNextLevelUnlocked(false);
        setNextLevelFirstGuide(null);
        
        // Previous guide
        if (currentIndex > 0) {
          const prevSlug = levelConfig.sequence[currentIndex - 1];
          setPrevGuide({
            slug: prevSlug,
            title: guideTitles?.[prevSlug] || formatTitle(prevSlug)
          });
        } else {
          setPrevGuide(null); // First guide
        }
        
        // Next guide
        const nextSlug = levelConfig.sequence[currentIndex + 1];
        setNextGuide({
          slug: nextSlug,
          title: guideTitles?.[nextSlug] || formatTitle(nextSlug)
        });
      }
    } catch (error) {
      console.error('[GuideNavigation] Error calculating navigation:', error);
    }
    
    setIsLoading(false);
  }, [guideTitles]);

  // Format guide slug to title (fallback)
  function formatTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
        <div className="animate-pulse flex justify-center">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  const guidesPrefix = guidesIndexPath(locale).replace(/\/$/, '');

  // Off-level message
  if (showOffLevelMessage) {
    return (
      <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('guideNavigation.offLevelMessage').replace('{level}', t(`skillLevels.${currentLevel}.label`) || 'selected')}
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href={guidesPrefix} 
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('guideNavigation.backToAllGuides')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Level complete celebration with level boundary handling
  if (isLevelComplete) {
    return (
      <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 text-center mb-8">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('guideNavigation.levelComplete').replace('{level}', t(`skillLevels.${currentLevel}.label`) || '')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('guideNavigation.levelCompleteDescription').replace('{level}', t(`skillLevels.${currentLevel}.label`) || '')}
          </p>
          
          {/* If next level is unlocked, show continue button */}
          {isNextLevelUnlocked && nextLevelFirstGuide && nextLevel && (
            <a
              href={`${guidesPrefix}/${nextLevelFirstGuide}`}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              {t('guideNavigation.continueToLevel').replace('{level}', t(`skillLevels.${nextLevel}.label`) || '')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          )}
          
          {/* If next level is locked, show requirements */}
          {!isNextLevelUnlocked && nextLevel && (
            <div className="text-sm text-gray-500">
              {t('guideNavigation.unlockRequirements').replace('{currentLevel}', t(`skillLevels.${currentLevel}.label`) || '').replace('{nextLevel}', t(`skillLevels.${nextLevel}.label`) || '')}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {prevGuide ? (
            <a
              href={`${guidesPrefix}/${prevGuide.slug}`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500 uppercase">{t('guideNavigation.previous')}</p>
                <p className="text-sm font-medium">{prevGuide.title}</p>
              </div>
            </a>
          ) : (
            <div className="flex-1" />
          )}
          
          <a
            href={guidesPrefix}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {t('guideNavigation.exploreAllGuides')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    );
  }

  // Normal navigation
  return (
    <div className={cn('border-t border-gray-200 dark:border-gray-800 pt-8 mt-12', className)}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {prevGuide ? (
          <a
            href={`${guidesPrefix}/${prevGuide.slug}`}
            className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <div>
              <p className="text-xs text-gray-500 uppercase">{t('guideNavigation.previous')}</p>
              <p className="text-sm font-medium">{prevGuide.title}</p>
            </div>
          </a>
        ) : (
          <div className="flex-1 text-sm text-gray-500">
            {t('guideNavigation.startOfLevel').replace('{level}', t(`skillLevels.${currentLevel}.label`) || '')}
          </div>
        )}

        {nextGuide ? (
          <a
            href={`${guidesPrefix}/${nextGuide.slug}`}
            className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary/50 transition-all sm:text-right"
          >
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase">{t('guideNavigation.next')}</p>
              <p className="text-sm font-medium">{nextGuide.title}</p>
            </div>
            <ArrowRight className="w-5 h-5" />
          </a>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}

export default GuideNavigation;
