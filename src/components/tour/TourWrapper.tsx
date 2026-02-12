/**
 * Tour Wrapper Component
 * Easy integration wrapper for simulators - combines TourProvider and TourOverlay
 */

import React, { useEffect } from 'react';
import { TourProvider } from './TourProvider';
import { TourOverlay } from './TourOverlay';
import type { TourConfig } from './types';
import { shouldAutoStartTour } from './tourStorage';
import { useTour } from './TourProvider';

interface TourWrapperProps {
  children: React.ReactNode;
  tourConfig: TourConfig;
  autoStart?: boolean;
  onTourComplete?: () => void;
  onTourSkip?: () => void;
}

function TourAutoStarter({ 
  tourConfig, 
  autoStart,
  onTourComplete,
  onTourSkip 
}: { 
  tourConfig: TourConfig;
  autoStart: boolean;
  onTourComplete?: () => void;
  onTourSkip?: () => void;
}) {
  const { startTour, state } = useTour();

  useEffect(() => {
    if (autoStart && shouldAutoStartTour(tourConfig.id)) {
      // Small delay to ensure UI is rendered
      const timer = setTimeout(() => {
        startTour(tourConfig);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoStart, tourConfig, startTour]);

  // Callbacks for tour events
  useEffect(() => {
    if (state.hasCompleted && onTourComplete) {
      onTourComplete();
    }
    if (state.hasSkipped && onTourSkip) {
      onTourSkip();
    }
  }, [state.hasCompleted, state.hasSkipped, onTourComplete, onTourSkip]);

  return null;
}

export function TourWrapper({
  children,
  tourConfig,
  autoStart = true,
  onTourComplete,
  onTourSkip,
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
      />
    </TourProvider>
  );
}

export default TourWrapper;
