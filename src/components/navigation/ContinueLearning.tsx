import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ContinueLearningProps {
  nextGuide?: {
    slug: string;
    title: string;
    description?: string;
  };
  threshold?: number; // Scroll percentage threshold (0-1)
  className?: string;
  hasQuiz?: boolean; // Whether the current guide has a quiz
  quizSelector?: string; // CSS selector for quiz element (default: '[data-quiz]')
}

export function ContinueLearning({
  nextGuide,
  threshold = 0.8,
  className,
  hasQuiz = false,
  quizSelector = '[data-quiz], [id*="quiz"], [class*="quiz"]',
}: ContinueLearningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isViewingQuiz, setIsViewingQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Detect if user is viewing quiz section
  const checkQuizVisibility = useCallback(() => {
    if (!hasQuiz) return;

    const quizElement = document.querySelector(quizSelector);
    if (!quizElement) return;

    const rect = quizElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Quiz is considered "in view" if it's occupying >50% of viewport
    const quizVisibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const isQuizInViewport = quizVisibleHeight > windowHeight * 0.5;

    setIsViewingQuiz(isQuizInViewport);

    // Check if quiz is completed (look for completion indicators)
    const completionIndicator = quizElement.querySelector('[data-quiz-completed], .quiz-completed');
    if (completionIndicator) {
      setQuizCompleted(true);
    }
  }, [hasQuiz, quizSelector]);

  useEffect(() => {
    if (!nextGuide) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      // Check quiz visibility
      checkQuizVisibility();

      // Show when user reaches threshold, unless viewing quiz
      if (scrollPercent >= threshold && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextGuide, threshold, isDismissed, checkQuizVisibility]);

  const scrollToQuiz = () => {
    const quizElement = document.querySelector(quizSelector);
    if (quizElement) {
      quizElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Hide overlay when actively viewing quiz
  if (!nextGuide || !isVisible || isViewingQuiz) return null;

  return (
    <div
      className={cn(
        // Position: side panel when quiz detected, bottom center otherwise
        hasQuiz
          ? 'fixed right-6 top-1/2 -translate-y-1/2 z-40 w-80'
          : 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg',
        'animate-in fade-in duration-500',
        hasQuiz ? 'slide-in-from-right-4' : 'slide-in-from-bottom-4',
        className
      )}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-primary/30 shadow-2xl shadow-primary/10 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                Guide Complete!
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {hasQuiz && !quizCompleted ? 'Test your knowledge?' : 'Ready for the next guide?'}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {hasQuiz && !quizCompleted
                ? 'Take the quiz to reinforce what you\'ve learned.'
                : `Continue your Nostr journey with ${nextGuide.title}`}
            </p>

            <div className="flex flex-col gap-3">
              {hasQuiz && !quizCompleted && (
                <button
                  onClick={scrollToQuiz}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  Take the Quiz
                </button>
              )}

              <a
                href={`/guides/${nextGuide.slug}`}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors',
                  hasQuiz && !quizCompleted
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-primary text-white hover:bg-primary/90'
                )}
              >
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsDismissed(true)}
                className="self-end px-3 py-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
