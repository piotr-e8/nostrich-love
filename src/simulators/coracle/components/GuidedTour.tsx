import React from 'react';
import type { CoracleScreen } from '../CoracleSimulator';

interface GuidedTourProps {
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
  currentScreen: CoracleScreen;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  currentStep,
  onNext,
  onSkip,
  currentScreen,
}) => {
  const steps = [
    {
      title: 'Welcome to Coracle!',
      description: 'Coracle is a simple, accessible Nostr client designed for beginners. Let\'s take a quick tour of the main features.',
      position: 'center',
    },
    {
      title: 'Your Home Feed',
      description: 'This is where you\'ll see notes from people you follow. You can like, repost, reply, and zap notes to support creators.',
      position: 'center',
    },
    {
      title: 'Navigation Menu',
      description: 'Use the top navigation to switch between Home, Relays, Profile, and Settings. Everything is just one click away.',
      position: 'top',
    },
    {
      title: 'Create a Post',
      description: 'Click the "Post" button to share your thoughts with the Nostr network. You can add hashtags, mentions, and images.',
      position: 'top-right',
    },
    {
      title: 'Relay Manager',
      description: 'Relays are the servers that store and distribute Nostr content. Visit the Relays page to connect to more relays and expand your reach.',
      position: 'center',
    },
  ];

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onSkip} />

      {/* Tour Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={onSkip}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip tour
            </button>
          </div>

          {/* Illustration */}
          <div className="flex justify-center mb-6">
            {currentStep === 0 && (
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            )}
            {currentStep === 1 && (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            )}
            {currentStep === 2 && (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            )}
            {currentStep === 3 && (
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            )}
            {currentStep === 4 && (
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
            {step.title}
          </h3>
          <p className="text-gray-600 text-center leading-relaxed">
            {step.description}
          </p>

          {/* Tips */}
          {currentStep === 1 && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-2">Pro tip:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Like posts with the heart icon</li>
                <li>Repost to share with your followers</li>
                <li>Zap with Bitcoin to support creators</li>
              </ul>
            </div>
          )}

          {currentStep === 4 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                You're all set! 🎉
              </p>
              <p className="text-sm text-green-600 mt-1">
                Start exploring, follow interesting people, and join the conversation!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Skip
          </button>
          <button
            onClick={onNext}
            className="coracle-btn-primary"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
