/**
 * GamificationExplainer Component
 * 
 * Educational modal that explains how progress works on the site.
 * Covers badges, progress tracking and quizzes. The streak section it used to
 * carry was removed with the streak itself — see Layout.astro.
 */

import React, { useEffect, useState, useRef } from 'react';
import { X, Award, Trophy, Star, Target, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { BADGE_DEFINITIONS } from '../../utils/gamification';

const EXIT_DURATION_MS = 300;

export interface GamificationExplainerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgress?: number;
  totalGuides?: number;
  quizzesPassed?: number;
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
      'p-4 rounded-lg border transition-colors',
      'bg-white dark:bg-gray-900',
      'border-gray-200 dark:border-gray-800',
      'hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800'
    )}
    style={{ animationDelay: `${Math.round(delay * 1000)}ms` }}
  >
    <div className={cn('mb-3', color)}>{icon}</div>
    <h4 className="text-h4 font-display text-gray-900 dark:text-white mb-1">{title}</h4>
    <p className="text-body-sm text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export function GamificationExplainer({
  isOpen,
  onClose,
  currentProgress = 0,
  // 16 is the course length; the wrapper passes the real count from SKILL_LEVELS,
  // so this default only matters if someone mounts the modal directly.
  totalGuides = 16,
  quizzesPassed = 0,
}: GamificationExplainerProps) {
  // Timed-exit idiom: content mounts in its hidden state,
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

  // Real badges, pulled from the list the award logic reads. These were three
  // invented examples: "First Steps" and "Nostr Expert" are not badges at all,
  // "Knowledge Seeker" asked for 5 guides when the requirement is 3, and
  // "Collect all 8 badges" was already wrong before the level certificates took
  // the total to twelve. A modal explaining the system must not describe a
  // different one.
  const EXAMPLE_BADGE_IDS = ['knowledge-seeker', 'level-beginner', 'nostr-graduate'] as const;
  const EXAMPLE_COLORS = [
    'text-primary-text dark:text-primary-400',
    'text-emerald-700 dark:text-emerald-400',
    'text-amber-700 dark:text-amber-400',
  ];
  const badgeExamples = EXAMPLE_BADGE_IDS.map((id, i) => {
    const badge = BADGE_DEFINITIONS.find((b) => b.id === id);
    return {
      emoji: badge?.icon ?? '🏅',
      name: badge?.name ?? id,
      desc: badge?.requirement ?? '',
      color: EXAMPLE_COLORS[i],
    };
  });

  const steps = [
    {
      num: 1,
      text: 'Pick a guide from the list',
      icon: <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />,
    },
    {
      num: 2,
      text: 'Read and scroll through it',
      icon: <Target className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />,
    },
    {
      num: 3,
      text: 'Take the quiz at the end',
      icon: <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />,
    },
  ];

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              'fixed inset-0 bg-black/60 z-50',
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
                'relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900',
                'rounded-lg shadow-raised overflow-hidden pointer-events-auto',
                'border border-gray-200 dark:border-gray-800',
                'flex flex-col'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative flex-shrink-0 border-b border-gray-200 dark:border-gray-800 px-6 py-5">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className={cn(
                    'absolute top-4 end-4 p-2 rounded-md',
                    'text-gray-500 dark:text-gray-400',
                    'transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </button>

                {/* Title */}
                <div
                  className="animate-slide-up motion-reduce:animate-none text-center"
                  style={{ animationDelay: '200ms' }}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Award
                      className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="text-micro uppercase text-gray-500 dark:text-gray-400">
                      How It Works
                    </span>
                  </div>
                  <h2
                    id="gamification-title"
                    className="text-h2 font-display text-gray-900 dark:text-white"
                  >
                    Gamification System
                  </h2>
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
                    <Trophy
                      className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="text-h3 font-display text-gray-900 dark:text-white">
                      Badges System
                    </h3>
                  </div>
                  <p className="text-body text-gray-600 dark:text-gray-400 mb-4">
                    Complete guides to earn badges. Each badge represents a milestone in your Nostr learning journey!
                  </p>

                  {/* Badge Examples */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {badgeExamples.map((badge, index) => (
                      <div
                        key={badge.name}
                        className={cn(
                          'animate-scale-in motion-reduce:animate-none',
                          'p-3 rounded-lg border border-gray-200 dark:border-gray-800',
                          'bg-gray-50 dark:bg-gray-900',
                          'flex items-center gap-3'
                        )}
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                      >
                        <div className="text-2xl">{badge.emoji}</div>
                        <div>
                          <p className="text-body-sm font-semibold text-gray-900 dark:text-white">{badge.name}</p>
                          <p className="text-caption text-gray-500 dark:text-gray-400">{badge.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-body-sm text-primary-text dark:text-primary-400 font-medium">
                    <Star className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    {/* The count was hard-coded as 8 and named a "Nostr Expert"
                        badge that does not exist. Both were wrong before the
                        level certificates; now it counts the real list. */}
                    <span>
                      {BADGE_DEFINITIONS.length} badges in all — three of them close a level.
                    </span>
                  </div>
                </section>

                {/* 2. Progress Tracking */}
                <section
                  className="animate-slide-in-left motion-reduce:animate-none"
                  style={{ animationDelay: '500ms' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Target
                      className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="text-h3 font-display text-gray-900 dark:text-white">
                      Progress Tracking
                    </h3>
                  </div>
                  <p className="text-body text-gray-600 dark:text-gray-400 mb-3">
                    Track your learning progress. Each guide you complete adds to your total and brings you closer to mastery!
                  </p>

                  {/* Progress Bar Demo */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-sm font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
                      <span className="text-body font-semibold text-primary-text dark:text-primary-400">{progressPercentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-[width] duration-[800ms] delay-[600ms] ease-out motion-reduce:transition-none"
                        style={{ width: entered ? `${progressPercentage}%` : '0%' }}
                      />
                    </div>
                    <p className="text-caption text-gray-500 dark:text-gray-400 mt-2">
                      {currentProgress} of {totalGuides} guides completed
                    </p>
                  </div>
                </section>

                {/* 3. Quizzes.
                    This slot used to explain a daily streak. The streak was
                    removed: it rewarded coming back, and a course has an end.
                    What belongs here is the one mechanism that measures whether
                    a reader understood something rather than merely visited. */}
                <section
                  className="animate-slide-in-left motion-reduce:animate-none"
                  style={{ animationDelay: '600ms' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="text-h3 font-display text-gray-900 dark:text-white">
                      Quizzes
                    </h3>
                  </div>
                  <p className="text-body text-gray-600 dark:text-gray-400 mb-3">
                    Most guides end in a short quiz. Nothing is graded and nothing is locked — it is there so you leave knowing which parts you understood and which are worth rereading.
                  </p>

                  <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-400"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-body font-semibold text-gray-900 dark:text-white">
                        {quizzesPassed > 0
                          ? `${quizzesPassed} quiz${quizzesPassed === 1 ? '' : 'zes'} passed`
                          : 'No quizzes passed yet'}
                      </p>
                      <p className="text-body-sm text-gray-600 dark:text-gray-400">
                        Retaking one can only improve your result, so a second attempt costs you nothing.
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
                    <BookOpen
                      className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="text-h3 font-display text-gray-900 dark:text-white">
                      How to Start
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {steps.map((step, index) => (
                      <div
                        key={step.num}
                        className="animate-slide-in-left motion-reduce:animate-none flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                        style={{ animationDelay: `${800 + index * 100}ms` }}
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center font-semibold text-caption',
                          'bg-primary-600 text-white'
                        )}>
                          {step.num}
                        </div>
                        <div className="flex items-center gap-2 flex-1 text-gray-400 dark:text-gray-500">
                          {step.icon}
                          <span className="text-body-sm text-gray-700 dark:text-gray-300">{step.text}</span>
                        </div>
                        {index < steps.length - 1 && (
                          <ChevronRight
                            className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 rtl:rotate-180"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        )}
                        {index === steps.length - 1 && (
                          <CheckCircle2
                            className="h-5 w-5 shrink-0 text-success-700 dark:text-success-400"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Footer with Got It Button */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                <button
                  onClick={handleClose}
                  className={cn(
                    'animate-slide-up motion-reduce:animate-none',
                    'w-full py-3.5 px-6 rounded-md font-semibold text-white',
                    'bg-primary-600 hover:bg-primary-700 transition-colors',
                    'flex items-center justify-center gap-2'
                  )}
                  style={{ animationDelay: '900ms' }}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
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
