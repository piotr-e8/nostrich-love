/**
 * Tour Controls Component
 * Next/Prev/Skip buttons for tour navigation
 */

import React from 'react';
import { useTour } from './TourProvider';
import { ChevronLeft, ChevronRight, SkipForward, RotateCcw, MousePointer } from 'lucide-react';

export function TourControls() {
  const { state, goToNextStep, goToPreviousStep, endTour, restartTour, currentStepData } = useTour();

  if (!state.isActive) {
    return null;
  }

  const isFirstStep = state.currentStep === 0;
  const isLastStep = state.currentStep === state.totalSteps - 1;
  
  // Determine if this step is waiting for an action
  const isWaitingForAction = state.waitingForAction && currentStepData?.trigger === 'action';

  return (
    <div className="tour-controls">
      {/* Left side - Navigation */}
      <div className="tour-controls__nav">
        <button
          className="tour-controls__btn tour-controls__btn--secondary"
          onClick={goToPreviousStep}
          disabled={isFirstStep}
          aria-label="Previous step"
          title="Previous (←)"
        >
          <ChevronLeft size={20} />
          <span className="tour-controls__btn-text">Prev</span>
        </button>

        {isWaitingForAction ? (
          <button
            className="tour-controls__btn tour-controls__btn--waiting"
            disabled
            aria-label="Waiting for action"
            title="Waiting for action..."
          >
            <MousePointer size={20} />
            <span className="tour-controls__btn-text">Waiting...</span>
          </button>
        ) : (
          <button
            className={`tour-controls__btn ${isLastStep ? 'tour-controls__btn--primary' : 'tour-controls__btn--secondary'}`}
            onClick={goToNextStep}
            disabled={isWaitingForAction}
            aria-label={isLastStep ? 'Finish tour' : 'Next step'}
            title={isLastStep ? 'Finish' : 'Next (→)'}
          >
            <span className="tour-controls__btn-text">
              {isLastStep ? 'Finish' : 'Next'}
            </span>
            {!isLastStep && <ChevronRight size={20} />}
          </button>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="tour-controls__actions">
        <button
          className="tour-controls__btn tour-controls__btn--ghost"
          onClick={() => endTour(true)}
          aria-label="Skip tour"
          title="Skip (ESC)"
        >
          <SkipForward size={18} />
          <span className="tour-controls__btn-text">Skip</span>
        </button>

        {state.hasCompleted || state.hasSkipped ? (
          <button
            className="tour-controls__btn tour-controls__btn--ghost"
            onClick={restartTour}
            aria-label="Restart tour"
            title="Restart"
          >
            <RotateCcw size={18} />
            <span className="tour-controls__btn-text">Restart</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
