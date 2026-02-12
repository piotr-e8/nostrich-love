/**
 * Tour Overlay Component
 * Provides the dark backdrop with spotlight effect
 */

import React, { useEffect, useCallback } from 'react';
import { useTour } from './TourProvider';
import { TourTooltip } from './TourTooltip';
import { TourProgress } from './TourProgress';
import { TourControls } from './TourControls';
import { useTourElement } from './useTourElement';

export function TourOverlay() {
  const { state, currentStepData, endTour, goToNextStep, goToPreviousStep } = useTour();

  const targetSelector = currentStepData?.target ?? '';
  const position = currentStepData?.position ?? 'bottom';
  const padding = currentStepData?.spotlightPadding ?? 8;

  const { spotlightRect, scrollToElement } = useTourElement(
    targetSelector,
    position,
    padding
  );

  // Auto-scroll to element on step change
  useEffect(() => {
    if (state.isActive && currentStepData) {
      const timer = setTimeout(() => {
        scrollToElement();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state.isActive, currentStepData, scrollToElement]);

  // Keyboard navigation
  useEffect(() => {
    if (!state.isActive) return;

    // Don't allow keyboard navigation if waiting for action
    const isWaitingForAction = state.waitingForAction && currentStepData?.trigger === 'action';

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          // Don't advance with keyboard when waiting for action
          if (isWaitingForAction) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          goToNextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousStep();
          break;
        case 'Escape':
          e.preventDefault();
          endTour(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isActive, state.waitingForAction, currentStepData?.trigger, goToNextStep, goToPreviousStep, endTour]);

  // Prevent body scroll when tour is active
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (state.isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [state.isActive]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    // Only close if clicking the overlay background itself
    if (e.target === e.currentTarget) {
      // Don't close on background click, require explicit action
    }
  }, []);

  if (!state.isActive || !currentStepData) {
    return null;
  }

  // Calculate clip path for spotlight effect
  const clipPath = spotlightRect
    ? `polygon(
        0% 0%,
        0% 100%,
        ${spotlightRect.left - spotlightRect.padding}px 100%,
        ${spotlightRect.left - spotlightRect.padding}px ${spotlightRect.top - spotlightRect.padding}px,
        ${spotlightRect.left + spotlightRect.width + spotlightRect.padding}px ${spotlightRect.top - spotlightRect.padding}px,
        ${spotlightRect.left + spotlightRect.width + spotlightRect.padding}px ${spotlightRect.top + spotlightRect.height + spotlightRect.padding}px,
        ${spotlightRect.left - spotlightRect.padding}px ${spotlightRect.top + spotlightRect.height + spotlightRect.padding}px,
        ${spotlightRect.left - spotlightRect.padding}px 100%,
        100% 100%,
        100% 0%
      )`
    : undefined;

  return (
    <div
      className="tour-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Guided Tour"
    >
      {/* Dark backdrop with spotlight */}
      <div
        className={`tour-backdrop ${currentStepData?.allowClickThrough ? 'tour-backdrop--click-through' : ''}`}
        style={{
          clipPath: clipPath,
        }}
      />

      {/* Spotlight border */}
      {spotlightRect && (
        <div
          className="tour-spotlight"
          style={{
            position: 'absolute',
            top: spotlightRect.top - spotlightRect.padding,
            left: spotlightRect.left - spotlightRect.padding,
            width: spotlightRect.width + spotlightRect.padding * 2,
            height: spotlightRect.height + spotlightRect.padding * 2,
          }}
        />
      )}

      {/* Tooltip */}
      <TourTooltip />

      {/* Progress indicator */}
      <TourProgress />

      {/* Controls */}
      <TourControls />

      {/* Keyboard hints */}
      <div className="tour-keyboard-hints">
        <span>← → Navigate</span>
        <span>ESC Skip</span>
      </div>
    </div>
  );
}
