/**
 * BadgeDisplay Component
 * 
 * Grid display of all badges with locked/unlocked states
 * Features hover effects, celebration animation, and accessibility
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { BadgeDisplayProps, Badge } from './types';

const categoryColors: Record<string, string> = {
  beginner: 'from-green-400 to-emerald-500',
  intermediate: 'from-blue-400 to-indigo-500',
  advanced: 'from-purple-400 to-violet-500',
  special: 'from-amber-400 to-orange-500',
};

const rarityStyles: Record<string, { border: string; glow: string; text: string }> = {
  common: {
    border: 'border-gray-200 dark:border-gray-700',
    glow: '',
    text: 'text-gray-600 dark:text-gray-400',
  },
  rare: {
    border: 'border-blue-300 dark:border-blue-700',
    glow: 'shadow-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  epic: {
    border: 'border-purple-300 dark:border-purple-700',
    glow: 'shadow-purple-500/30',
    text: 'text-purple-600 dark:text-purple-400',
  },
  legendary: {
    border: 'border-amber-300 dark:border-amber-700',
    glow: 'shadow-amber-500/40',
    text: 'text-amber-600 dark:text-amber-400',
  },
};

export function BadgeDisplay({
  badges,
  unlockedBadgeIds,
  onBadgeClick,
  className,
  showAnimation = true,
  newlyUnlockedId = null,
}: BadgeDisplayProps) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  // Trigger celebration for newly unlocked badge
  useEffect(() => {
    if (newlyUnlockedId && showAnimation) {
      setCelebratingId(newlyUnlockedId);
      const timer = setTimeout(() => setCelebratingId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlockedId, showAnimation]);

  const isUnlocked = (badgeId: string) => unlockedBadgeIds.includes(badgeId);

  const handleBadgeClick = (badge: Badge) => {
    if (isUnlocked(badge.id)) {
      onBadgeClick?.(badge);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, badge: Badge) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBadgeClick(badge);
    }
  };

  return (
    <div
      className={cn('w-full', className)}
      role="region"
      aria-label="Achievement Badges"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-friendly-purple to-friendly-gold rounded-xl">
            <Trophy className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Badges
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unlockedBadgeIds.length} of {badges.length} earned
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-friendly-purple dark:text-friendly-purple-400">
            {Math.round((unlockedBadgeIds.length / badges.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Badge Grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        role="list"
        aria-label="Badge collection"
      >
        {badges.map((badge, index) => {
          const unlocked = isUnlocked(badge.id);
          const isHovered = hoveredBadge === badge.id;
          const isCelebrating = celebratingId === badge.id;
          const rarityStyle = rarityStyles[badge.rarity];

          return (
            <motion.div
              key={badge.id}
              role="listitem"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'relative group cursor-pointer',
                !unlocked && 'cursor-not-allowed'
              )}
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
              onClick={() => handleBadgeClick(badge)}
              onKeyDown={(e) => handleKeyDown(e, badge)}
              tabIndex={unlocked ? 0 : -1}
              aria-label={
                unlocked
                  ? `${badge.name} badge - ${badge.description}`
                  : `${badge.name} badge - Locked: ${badge.requirement}`
              }
            >
              {/* Celebration Effect */}
              <AnimatePresence>
                {isCelebrating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
                  >
                    <Sparkles className="w-16 h-16 text-friendly-gold animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Badge Card */}
              <div
                className={cn(
                  'relative aspect-square rounded-2xl border-2 transition-all duration-300 overflow-hidden',
                  'flex flex-col items-center justify-center p-3',
                  unlocked
                    ? cn(
                        'bg-white dark:bg-gray-800',
                        rarityStyle.border,
                        isHovered && cn('scale-105 shadow-lg', rarityStyle.glow),
                        isCelebrating && 'ring-4 ring-friendly-gold ring-opacity-50'
                      )
                    : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 grayscale opacity-60'
                )}
              >
                {/* Category Indicator */}
                {unlocked && (
                  <div
                    className={cn(
                      'absolute top-2 left-2 w-2 h-2 rounded-full bg-gradient-to-r',
                      categoryColors[badge.category]
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Lock Icon for Locked Badges */}
                {!unlocked && (
                  <div className="absolute top-2 right-2" aria-hidden="true">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}

                {/* Emoji */}
                <motion.div
                  className={cn(
                    'text-4xl mb-2 transition-transform duration-300',
                    isHovered && unlocked && 'scale-110'
                  )}
                  animate={isCelebrating ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {badge.emoji}
                </motion.div>

                {/* Name */}
                <p
                  className={cn(
                    'text-xs font-semibold text-center line-clamp-2',
                    unlocked
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-500'
                  )}
                >
                  {badge.name}
                </p>

                {/* Rarity Indicator */}
                {unlocked && (
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wider mt-1',
                      rarityStyle.text
                    )}
                  >
                    {badge.rarity}
                  </span>
                )}
              </div>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 pointer-events-none"
                  >
                    <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-xl p-3 shadow-xl border border-gray-700">
                      <p className="font-semibold mb-1">{badge.name}</p>
                      <p className="text-gray-300 mb-2">{badge.description}</p>
                      <p className="text-friendly-gold text-[10px]">
                        {unlocked ? '✓ Earned' : `🔒 ${badge.requirement}`}
                      </p>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                        <div className="w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 border-r border-b border-gray-700" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default BadgeDisplay;
