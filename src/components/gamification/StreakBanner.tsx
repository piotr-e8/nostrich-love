/**
 * StreakBanner Component
 *
 * Sticky or floating banner showing user's learning streak
 * Appears when user has an active streak with dismiss option
 *
 * Animations are plain CSS (transitions + keyframes in tailwind.config.js).
 * This component is mounted site-wide from Layout.astro, so it must NOT
 * import framer-motion — that pulled ~305 KB of JS onto every page (#59/#67).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Flame, X, Zap, Trophy, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { StreakBannerProps } from './types';

const EXIT_DURATION_MS = 300;

const streakMessages: Record<number, string> = {
  1: "Great start! Keep the momentum going! 🔥",
  2: "Two days strong! You're building a habit! 💪",
  3: "3-day streak! You're on fire! 🔥🔥🔥",
  5: "5 days! Amazing dedication! 🌟",
  7: "Week-long streak! You're unstoppable! 🚀",
  14: "Two weeks! You're a Nostr master in training! 👑",
  21: "Three weeks! Legendary status incoming! ⚡",
  30: "30 days! You're absolutely legendary! 🏆",
};

const getStreakMessage = (days: number): string => {
  // Check for exact matches first
  if (streakMessages[days]) {
    return streakMessages[days];
  }

  // Return appropriate message based on range
  if (days >= 30) return streakMessages[30];
  if (days >= 21) return streakMessages[21];
  if (days >= 14) return streakMessages[14];
  if (days >= 7) return streakMessages[7];
  if (days >= 5) return streakMessages[5];
  if (days >= 3) return streakMessages[3];
  return streakMessages[1];
};

const getStreakIcon = (days: number) => {
  if (days >= 30) return Trophy;
  if (days >= 7) return Zap;
  return Flame;
};

export function StreakBanner({
  streakDays,
  isVisible: initialVisible,
  onDismiss,
  className,
  position = 'top',
}: StreakBannerProps) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [isDismissed, setIsDismissed] = useState(false);
  // Drives the slide/fade-in transition: content mounts in its off-screen
  // state, then `entered` flips on the next frame and CSS transitions in.
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update visibility when prop changes
  useEffect(() => {
    setIsVisible(initialVisible);
  }, [initialVisible]);

  const shouldRender = isVisible && streakDays > 0 && !isDismissed;

  useEffect(() => {
    if (!shouldRender) {
      setEntered(false);
      return;
    }
    // Double rAF: let the browser paint the initial (hidden) state first so
    // the transition to the visible state actually animates.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [shouldRender]);

  // Clear any pending dismiss timeout on unmount
  useEffect(() => {
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, []);

  // Don't show if streak is 0 or not visible
  if (!shouldRender) {
    return null;
  }

  const StreakIcon = getStreakIcon(streakDays);
  const message = getStreakMessage(streakDays);
  const isHighStreak = streakDays >= 7;

  const handleDismiss = () => {
    if (exiting) return;
    // Slide/fade out via CSS, then unmount after the transition finishes.
    setExiting(true);
    exitTimer.current = setTimeout(() => {
      setIsDismissed(true);
      setExiting(false);
      onDismiss?.();
    }, EXIT_DURATION_MS);
  };

  const isShown = entered && !exiting;

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-[60] px-4',
        'transition-all duration-300 ease-out motion-reduce:transition-none',
        position === 'top' ? 'top-16 pt-4' : 'bottom-0 pb-4',
        isShown
          ? 'opacity-100 translate-y-0 scale-100'
          : cn(
              'opacity-0 scale-95',
              position === 'top' ? '-translate-y-24' : 'translate-y-24'
            ),
        className
      )}
      role="banner"
      aria-label="Learning streak notification"
    >
      <div
        className={cn(
          'max-w-lg mx-auto rounded-2xl shadow-2xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden',
          'border-2',
          isHighStreak
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 border-amber-400 dark:from-amber-600 dark:via-orange-600 dark:to-red-600 dark:border-amber-500'
            : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 border-orange-400 dark:from-orange-600 dark:via-red-600 dark:to-pink-600 dark:border-orange-500'
        )}
      >
        <div className="relative p-4">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-4 text-4xl">🔥</div>
            <div className="absolute bottom-2 right-8 text-3xl">✨</div>
            <div className="absolute top-1/2 right-4 text-2xl">⭐</div>
          </div>

          <div className="relative flex items-center gap-4">
            {/* Icon */}
            <div
              className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                'bg-white/20 backdrop-blur-sm border border-white/30',
                'animate-streak-wiggle motion-reduce:animate-none'
              )}
              aria-hidden="true"
            >
              <StreakIcon className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black text-white">
                  {streakDays}
                </span>
                <span className="text-lg font-bold text-white/90">
                  Day{streakDays !== 1 ? 's' : ''}
                </span>
                <span className="text-2xl inline-block animate-streak-beat motion-reduce:animate-none">
                  🔥
                </span>
              </div>
              <p className="text-sm text-white/90 font-medium truncate">
                {message}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className={cn(
                'p-2 rounded-xl transition-all flex-shrink-0',
                'bg-white/10 hover:bg-white/20',
                'focus:outline-none focus:ring-2 focus:ring-white/50'
              )}
              aria-label="Dismiss streak notification"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/70" aria-hidden="true" />
            <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden dark:bg-black/30">
              <div
                className="h-full bg-white rounded-full transition-[width] duration-500 delay-200 ease-out motion-reduce:transition-none"
                style={{
                  width: entered
                    ? `${Math.min(((streakDays % 7) / 7) * 100, 100)}%`
                    : '0%',
                }}
              />
            </div>
            <span className="text-xs text-white/70 font-medium">
              {7 - (streakDays % 7)} days to week
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakBanner;
