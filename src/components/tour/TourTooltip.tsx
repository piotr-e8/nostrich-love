/**
 * Tour Tooltip Component
 * Displays tour step information with auto-positioning
 */

import React, { useEffect, useState } from 'react';
import { useTour } from './TourProvider';
import { useTourElement } from './useTourElement';
import { X, MousePointer, ArrowRight } from 'lucide-react';

export function TourTooltip() {
  const { state, currentStepData, endTour } = useTour();
  const [isVisible, setIsVisible] = useState(false);

  const targetSelector = currentStepData?.target ?? '';
  const position = currentStepData?.position ?? 'bottom';
  const padding = currentStepData?.spotlightPadding ?? 8;

  const { tooltipRect, targetCenter } = useTourElement(targetSelector, position, padding);

  // Animation delay
  useEffect(() => {
    if (state.isActive && currentStepData) {
      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), 150);
      return () => clearTimeout(timer);
    }
  }, [state.isActive, currentStepData, state.currentStep]);

  if (!state.isActive || !currentStepData || !tooltipRect) {
    return null;
  }

  const stepNumber = state.currentStep + 1;
  const totalSteps = state.totalSteps;

  // Determine if this step is waiting for an action
  const isWaitingForAction = state.waitingForAction && currentStepData.trigger === 'action';

  return (
    <div
      className={`tour-tooltip tour-tooltip--${position} ${isVisible ? 'tour-tooltip--visible' : ''}`}
      style={{
        position: 'absolute',
        top: tooltipRect.top,
        left: tooltipRect.left,
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Arrows removed - they were causing positioning issues */}

      {/* Header */}
      <div className="tour-tooltip__header">
        <span className="tour-tooltip__badge">
          {stepNumber} / {totalSteps}
        </span>
        <button
          className="tour-tooltip__close"
          onClick={() => endTour(true)}
          aria-label="Skip tour"
          title="Skip tour (ESC)"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="tour-tooltip__content">
        <h3 className="tour-tooltip__title">{currentStepData.title}</h3>
        <p className="tour-tooltip__text">{currentStepData.content}</p>
      </div>

      {/* Action hint - shows different UI based on trigger type */}
      {isWaitingForAction ? (
        <div className="tour-tooltip__action tour-tooltip__action--waiting">
          <span className="tour-tooltip__action-icon"><MousePointer size={16} /></span>
          <span className="tour-tooltip__action-text">
            Perform the action above to continue
          </span>
        </div>
      ) : currentStepData.action ? (
        <div className="tour-tooltip__action">
          <span className="tour-tooltip__action-icon">👆</span>
          <span>{currentStepData.action}</span>
        </div>
      ) : (
        <div className="tour-tooltip__action tour-tooltip__action--next">
          <span className="tour-tooltip__action-icon"><ArrowRight size={16} /></span>
          <span className="tour-tooltip__action-text">
            Click Next or press → to continue
          </span>
        </div>
      )}
    </div>
  );
}
