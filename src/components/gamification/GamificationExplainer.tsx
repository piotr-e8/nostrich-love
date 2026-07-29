/**
 * GamificationExplainer Component
 * 
 * Educational modal that explains the gamification system to users
 * Features badges, progress tracking, streaks, and getting started guide
 */

import React, { useEffect, useState, useRef } from 'react';
import { X, Award, Trophy, Star, Flame, Target, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const EXIT_DURATION_MS = 300;

export interface GamificationExplainerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgress?: number;
  totalGuides?: number;
  currentStreak?: number;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, delay }) => (
  <div
    className={cn(
      'animate-slide-up motion-reduce:animate-none',
      'p-4 rounded-xl border transition-all',
      'bg-white dark:bg-gray-800',
      'border-gray-200 dark:border-gray-700',
      'hover:shadow-md hover:border-friendly-purple/30'
    )}
    style={{ animationDelay: `${Math.round(delay * 1000)}ms` }}
  >
    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', color)}>
      {icon}
    </div>
    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export function GamificationExplainer({
  isOpen,
  onClose,
  currentProgress = 0,
  totalGuides = 15,
  currentStreak = 0,
}: GamificationExplainerProps) {
  // Timed-exit idiom (StreakBanner): content mounts in its hidden state,
  // `entered` flips on the next frame and CSS transitions it in; closing
  // plays the exit transition before telling the parent to unmount us.
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isOpen]);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    []
  );

  const handleClose = () => {
    if (exiting) return;
    setExiting(true);
    exitTimer.current = setTimeout(() => {
      setExiting(false);
      onClose();
    }, EXIT_DURATION_MS);
  };

  const isShown = entered && !exiting;

  // Trap focus inside the dialog; Escape closes, focus returns to the opener.
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, handleClose);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const progressPercentage = totalGuides > 0 ? Math.round((currentProgress / totalGuides) * 100) : 0;

  const badgeExamples = [
    { emoji: '👤', name: 'First Steps', desc: 'Complete your first guide', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' },
    { emoji: '🏆', name: 'Knowledge Seeker', desc: 'Complete 5 guides', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' },
    { emoji: '⭐', name: 'Nostr Expert', desc: 'Collect all 8 badges', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' },
  ];

  const steps = [
    { num: 1, text: 'Pick a guide from the list', icon: <BookOpen className="w-4 h-4" /> },
    { num: 2, text: 'Read and scroll through it', icon: <Target className="w-4 h-4" /> },
    { num: 3, text: 'Earn badges automatically!', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              'fixed inset-0 bg-black/60 backdrop-blur-sm z-50',
              'transition-opacity duration-300 motion-reduce:transition-none',
              isShown ? 'opacity-100' : 'opacity-0'
            )}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none',
              'transition-all duration-300 ease-out-quint motion-reduce:transition-none',
              isShown
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-8'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gamification-title"
          >
            <div
              ref={modalRef}
              className={cn(
                'relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800',
                'rounded-3xl shadow-2xl overflow-hidden pointer-events-auto',
                'border border-gray-200 dark:border-gray-700',
                'flex flex-col'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Gradient */}
              <div className="relative h-24 bg-gradient-to-br from-friendly-purple via-purple-600 to-friendly-purple overflow-hidden flex-shrink-0">
                {/* Animated Background: oversized glow shuttling side to side
                    (CSS can't tween a radial-gradient's center, so we move the
                    element instead). */}
                <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                  <div
                    className="absolute -left-[30%] top-0 h-full w-[160%] animate-gamification-shimmer motion-reduce:animate-none"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 35%)',
                    }}
                  />
                </div>
                <style>{`
                  @keyframes gamification-shimmer-kf {
                    0%, 100% { transform: translateX(-12%); }
                    50% { transform: translateX(12%); }
                  }
                  .animate-gamification-shimmer {
                    animation: gamification-shimmer-kf 4s ease-in-out infinite;
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .animate-gamification-shimmer { animation: none; }
                  }
                `}</style>

                {/* Decorative Elements */}
                <div className="absolute top-3 left-4">
                  <Star className="w-5 h-5 text-white/40" />
                </div>
                <div className="absolute bottom-3 right-6">
                  <Trophy className="w-6 h-6 text-friendly-gold/60" />
                </div>
                <div className="absolute top-5 right-20">
                  <Flame className="w-4 h-4 text-white/30" />
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className={cn(
                    'absolute top-3 right-3 p-2 rounded-xl',
                    'bg-white/10 hover:bg-white/20 backdrop-blur-sm',
                    'transition-all focus:outline-none focus:ring-2 focus:ring-white/50'
                  )}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Title */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="animate-slide-up motion-reduce:animate-none text-center"
                    style={{ animationDelay: '200ms' }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Award className="w-6 h-6 text-white" />
                      <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                        How It Works
                      </span>
                    </div>
                    <h2
                      id="gamification-title"
                      className="text-2xl font-bold text-white"
                    >
                      Gamification System
                    </h2>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. Badges System */}
                <section
                  className="animate-slide-in-left motion-reduce:animate-none"
                  style={{ animationDelay: '300ms' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-friendly-purple/10 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-friendly-purple" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Badges System
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Complete guides to earn badges. Each badge represents a milestone in your Nostr learning journey!
                  </p>
                  
                  {/* Badge Examples */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {badgeExamples.map((badge, index) => (
                      <div
                        key={badge.name}
                        className={cn(
                          'animate-scale-in motion-reduce:animate-none',
                          'p-3 rounded-xl border border-gray-200 dark:border-gray-700',
                          'bg-gray-50 dark:bg-gray-700/50',
                          'flex items-center gap-3'
                        )}
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                      >
                        <div className="text-2xl">{badge.emoji}</div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{badge.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{badge.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2 text-sm text-friendly-purple font-medium">
                    <Star className="w-4 h-4" />
                    <span>Collect all 8 badges to become a Nostr Expert!</span>
                  </div>
                </section>

                {/* 2. Progress Tracking */}
                <section
                  className="animate-slide-in-left motion-reduce:animate-none"
                  style={{ animationDelay: '500ms' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Progress Tracking
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Track your learning progress. Each guide you complete adds to your total and brings you closer to mastery!
                  </p>
                  
                  {/* Progress Bar Demo */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
                      <span className="text-lg font-bold text-friendly-purple">{progressPercentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-friendly-purple to-friendly-purple-400 rounded-full transition-[width] duration-[800ms] delay-[600ms] ease-out motion-reduce:transition-none"
                        style={{ width: entered ? `${progressPercentage}%` : '0%' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {currentProgress} of {totalGuides} guides completed
                    </p>
                  </div>
                </section>

                {/* 3. Streak System */}
                <section
                  className="animate-slide-in-left motion-reduce:animate-none"
                  style={{ animationDelay: '600ms' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Streak System
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Build daily learning streaks! Come back every day to maintain your streak and stay motivated.
                  </p>
                  
                  <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                    <div className="text-4xl">🔥</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Current Streak: {currentStreak > 0 ? `${currentStreak} day${currentStreak !== 1 ? 's' : ''}` : 'Start today!'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentStreak > 0 
                          ? "Keep it up! You're building great habits." 
                          : "Visit a guide today to start your streak!"}
                      </p>
                    </div>
                  </div>
                </section>

                {/* 4. How to Start */}
                <section
                  className="animate-slide-in-left motion-reduce:animate-none"
                  style={{ animationDelay: '700ms' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      How to Start
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {steps.map((step, index) => (
                      <div
                        key={step.num}
                        className="animate-slide-in-left motion-reduce:animate-none flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        style={{ animationDelay: `${800 + index * 100}ms` }}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          'bg-friendly-purple text-white'
                        )}>
                          {step.num}
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          {step.icon}
                          <span className="text-gray-700 dark:text-gray-300">{step.text}</span>
                        </div>
                        {index < steps.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        {index === steps.length - 1 && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Footer with Got It Button */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                <button
                  onClick={handleClose}
                  className={cn(
                    'animate-slide-up motion-reduce:animate-none',
                    'w-full py-3.5 px-6 rounded-xl font-semibold text-white',
                    'bg-gradient-to-r from-friendly-purple to-purple-600',
                    'hover:from-purple-600 hover:to-purple-700',
                    'transition-all transform hover:scale-[1.02] active:scale-[0.98]',
                    'focus:outline-none focus:ring-2 focus:ring-friendly-purple focus:ring-offset-2',
                    'dark:focus:ring-offset-gray-800',
                    'flex items-center justify-center gap-2'
                  )}
                  style={{ animationDelay: '900ms' }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default GamificationExplainer;
