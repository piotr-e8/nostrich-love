/**
 * Tour Wrapper Component
 * Easy integration wrapper for simulators - combines TourProvider and TourOverlay
 */

import React, { useEffect } from 'react';
import { TourProvider } from './TourProvider';
import { TourOverlay } from './TourOverlay';
import type { TourConfig, TourStep } from './types';
import { shouldAutoStartTour } from './tourStorage';
import { useTour } from './TourProvider';

interface TourWrapperProps {
  children: React.ReactNode;
  tourConfig: TourConfig;
  autoStart?: boolean;
  onTourComplete?: () => void;
  onTourSkip?: () => void;
  /**
   * Called whenever tour step changes - use to navigate simulator
   * @param stepIndex - The new step index
   * @param step - The new step data
   */
  onStepChange?: (stepIndex: number, step: TourStep) => void;
}

function TourAutoStarter({ 
  tourConfig, 
  autoStart,
  onTourComplete,
  onTourSkip,
  onStepChange
}: { 
  tourConfig: TourConfig;
  autoStart: boolean;
  onTourComplete?: () => void;
  onTourSkip?: () => void;
  onStepChange?: (stepIndex: number, step: TourStep) => void;
}) {
  const { startTour, restartTour, state, currentStepData } = useTour();
  const lastStepRef = React.useRef<number>(-1);

  useEffect(() => {
    const shouldStart = shouldAutoStartTour(tourConfig.id);
    console.log(`[TourAutoStarter] ${tourConfig.id}: autoStart=${autoStart}, shouldStart=${shouldStart}`);
    
    if (autoStart && shouldStart) {
      // Small delay to ensure UI is rendered
      const timer = setTimeout(() => {
        console.log(`[TourAutoStarter] Starting tour: ${tourConfig.id}`);
        startTour(tourConfig);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoStart, tourConfig, startTour]);

  // Listen for restart tour events from page buttons
  useEffect(() => {
    const eventName = `start-${tourConfig.id}`;
    
    const handleRestartEvent = () => {
      console.log(`[TourAutoStarter] Received restart event: ${eventName}`);
      // Reset progress and restart with config
      restartTour(tourConfig);
    };
    
    window.addEventListener(eventName, handleRestartEvent);
    
    return () => {
      window.removeEventListener(eventName, handleRestartEvent);
    };
  }, [tourConfig, restartTour]);

  // Callbacks for tour events
  useEffect(() => {
    if (state.hasCompleted && onTourComplete) {
      onTourComplete();
    }
    if (state.hasSkipped && onTourSkip) {
      onTourSkip();
    }
  }, [state.hasCompleted, state.hasSkipped, onTourComplete, onTourSkip]);

  // Notify when step changes (only once per step)
  useEffect(() => {
    if (state.isActive && onStepChange && currentStepData) {
      if (lastStepRef.current !== state.currentStep) {
        lastStepRef.current = state.currentStep;
        onStepChange(state.currentStep, currentStepData);
      }
    }
  }, [state.currentStep, state.isActive, currentStepData, onStepChange]);

  return null;
}

export function TourWrapper({
  children,
  tourConfig,
  autoStart = true,
  onTourComplete,
  onTourSkip,
  onStepChange,
}: TourWrapperProps) {
  return (
    <TourProvider>
      {children}
      <TourOverlay />
      <TourAutoStarter 
        tourConfig={tourConfig} 
        autoStart={autoStart}
        onTourComplete={onTourComplete}
        onTourSkip={onTourSkip}
        onStepChange={onStepChange}
      />
    </TourProvider>
  );
}

export default TourWrapper;
