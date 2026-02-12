/**
 * Tour Progress Component
 * Shows current progress through the tour
 */

import React from 'react';
import { useTour } from './TourProvider';

export function TourProgress() {
  const { state, goToStep } = useTour();

  if (!state.isActive) {
    return null;
  }

  const progress = ((state.currentStep + 1) / state.totalSteps) * 100;

  return (
    <div className="tour-progress">
      {/* Progress bar */}
      <div className="tour-progress__bar">
        <div
          className="tour-progress__fill"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={state.currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={state.totalSteps}
          aria-label={`Step ${state.currentStep + 1} of ${state.totalSteps}`}
        />
      </div>

      {/* Step indicators */}
      <div className="tour-progress__steps">
        {Array.from({ length: state.totalSteps }, (_, index) => {
          const isActive = index === state.currentStep;
          const isCompleted = index < state.currentStep;
          const isUpcoming = index > state.currentStep;

          return (
            <button
              key={index}
              className={`
                tour-progress__step
                ${isActive ? 'tour-progress__step--active' : ''}
                ${isCompleted ? 'tour-progress__step--completed' : ''}
                ${isUpcoming ? 'tour-progress__step--upcoming' : ''}
              `}
              onClick={() => goToStep(index)}
              aria-label={`Go to step ${index + 1}`}
              aria-current={isActive ? 'step' : undefined}
              disabled={isUpcoming}
              title={`Step ${index + 1}`}
            >
              {isCompleted ? (
                <svg className="tour-progress__check" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
