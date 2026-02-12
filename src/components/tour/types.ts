/**
 * Tour System Type Definitions
 */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: TooltipPosition;
  action?: string;
  allowClickThrough?: boolean;
  spotlightPadding?: number;
  /**
   * Whether the step advances manually (clicking Next) or automatically on action
   * @default 'manual'
   */
  trigger?: 'manual' | 'action';
  /**
   * Identifier for the action that triggers advancement when trigger is 'action'
   */
  actionType?: string;
  /**
   * Callback when an action is triggered for this step
   */
  onAction?: (actionType: string, data?: any) => void;
  /**
   * Optional validation function that must return true before advancing
   */
  validateStep?: () => boolean;
}

export interface TourConfig {
  id: string;
  name: string;
  steps: TourStep[];
  storageKey: string;
}

export interface TourState {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  hasCompleted: boolean;
  hasSkipped: boolean;
  /**
   * Whether the current step is waiting for an action to be triggered
   */
  waitingForAction: boolean;
  /**
   * The action type that the current step is waiting for
   */
  expectedActionType: string | null;
}

export interface TourContextValue {
  state: TourState;
  config: TourConfig | null;
  startTour: (config: TourConfig) => void;
  endTour: (skip?: boolean) => void;
  goToStep: (stepIndex: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  restartTour: () => void;
  currentStepData: TourStep | null;
  /**
   * Register an action that may trigger tour advancement
   * @param actionType - The type of action being performed
   * @param data - Optional data associated with the action
   */
  registerAction: (actionType: string, data?: any) => void;
  /**
   * Check if the tour is currently waiting for a specific action
   * @param actionType - The action type to check
   */
  isWaitingForAction: (actionType: string) => boolean;
}

export interface TooltipRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
  padding: number;
}
