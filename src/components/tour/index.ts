/**
 * Tour System Exports
 * Complete guided tour system for Nostr client simulators
 */

// Core components
export { TourProvider, useTour, useTourAutoStart, TourContext } from './TourProvider';
export { TourOverlay } from './TourOverlay';
export { TourTooltip } from './TourTooltip';
export { TourProgress } from './TourProgress';
export { TourControls } from './TourControls';
export { TourWrapper } from './TourWrapper';
export { TourButton } from './TourButton';

// Types
export type { 
  TourConfig, 
  TourStep, 
  TourState, 
  TourContextValue,
  TooltipPosition,
  TooltipRect,
  SpotlightRect 
} from './types';

// Storage utilities
export {
  getTourProgress,
  setTourProgress,
  markTourCompleted,
  markTourSkipped,
  resetTourProgress,
  hasCompletedTour,
  hasSkippedTour,
  shouldAutoStartTour,
  type TourProgress
} from './tourStorage';

// Import CSS
import './tour.css';
