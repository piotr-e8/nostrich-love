/**
 * GamificationExplainer Component
 * 
 * Educational modal that explains the gamification system to users
 * Features badges, progress tracking, streaks, and getting started guide
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Trophy, Star, Flame, Target, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

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
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={cn(
      'p-4 rounded-xl border transition-all',
      'bg-white dark:bg-gray-800',
      'border-gray-200 dark:border-gray-700',
      'hover:shadow-md hover:border-friendly-purple/30'
    )}
  >
    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', color)}>
      {icon}
    </div>
    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

export function GamificationExplainer({
  isOpen,
  onClose,
  currentProgress = 0,
  totalGuides = 15,
  currentStreak = 0,
}: GamificationExplainerProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gamification-title"
          >
            <div
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
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                      'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                      'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

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
                  onClick={onClose}
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
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
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
                  </motion.div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. Badges System */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
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
                      <motion.div
                        key={badge.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={cn(
                          'p-3 rounded-xl border border-gray-200 dark:border-gray-700',
                          'bg-gray-50 dark:bg-gray-700/50',
                          'flex items-center gap-3'
                        )}
                      >
                        <div className="text-2xl">{badge.emoji}</div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{badge.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{badge.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2 text-sm text-friendly-purple font-medium">
                    <Star className="w-4 h-4" />
                    <span>Collect all 8 badges to become a Nostr Expert!</span>
                  </div>
                </motion.section>

                {/* 2. Progress Tracking */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
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
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-friendly-purple to-friendly-purple-400 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {currentProgress} of {totalGuides} guides completed
                    </p>
                  </div>
                </motion.section>

                {/* 3. Streak System */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
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
                </motion.section>

                {/* 4. How to Start */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
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
                      <motion.div
                        key={step.num}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
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
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </div>

              {/* Footer with Got It Button */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  onClick={onClose}
                  className={cn(
                    'w-full py-3.5 px-6 rounded-xl font-semibold text-white',
                    'bg-gradient-to-r from-friendly-purple to-purple-600',
                    'hover:from-purple-600 hover:to-purple-700',
                    'transition-all transform hover:scale-[1.02] active:scale-[0.98]',
                    'focus:outline-none focus:ring-2 focus:ring-friendly-purple focus:ring-offset-2',
                    'dark:focus:ring-offset-gray-800',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Got it!
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default GamificationExplainer;
