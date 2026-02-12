/**
 * Tour Provider Component
 * Manages tour state and provides context to all tour components
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { TourConfig, TourState, TourContextValue, TourStep } from './types';
import { 
  getTourProgress, 
  markTourCompleted, 
  markTourSkipped, 
  shouldAutoStartTour 
} from './tourStorage';

export const TourContext = createContext<TourContextValue | null>(null);

interface TourProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
}

export function TourProvider({ children, autoStart = true }: TourProviderProps) {
  const [config, setConfig] = useState<TourConfig | null>(null);
  const [state, setState] = useState<TourState>({
    isActive: false,
    currentStep: 0,
    totalSteps: 0,
    hasCompleted: false,
    hasSkipped: false,
    waitingForAction: false,
    expectedActionType: null,
  });

  /**
   * Update waiting state based on current step configuration
   */
  const updateWaitingState = useCallback((stepIndex: number, tourConfig: TourConfig | null) => {
    if (!tourConfig) {
      setState(prev => ({
        ...prev,
        waitingForAction: false,
        expectedActionType: null,
      }));
      return;
    }

    const step = tourConfig.steps[stepIndex];
    if (step && step.trigger === 'action' && step.actionType) {
      setState(prev => ({
        ...prev,
        waitingForAction: true,
        expectedActionType: step.actionType ?? null,
      }));
    } else {
      setState(prev => ({
        ...prev,
        waitingForAction: false,
        expectedActionType: null,
      }));
    }
  }, []);

  const startTour = useCallback((newConfig: TourConfig) => {
    setConfig(newConfig);
    setState({
      isActive: true,
      currentStep: 0,
      totalSteps: newConfig.steps.length,
      hasCompleted: false,
      hasSkipped: false,
      waitingForAction: false,
      expectedActionType: null,
    });
    
    // Check if first step needs action
    setTimeout(() => {
      const firstStep = newConfig.steps[0];
      if (firstStep && firstStep.trigger === 'action' && firstStep.actionType) {
        setState(prev => ({
          ...prev,
          waitingForAction: true,
          expectedActionType: firstStep.actionType ?? null,
        }));
      }
    }, 0);
  }, []);

  const endTour = useCallback((skip = false) => {
    if (config) {
      if (skip) {
        markTourSkipped(config.id, state.currentStep);
      } else {
        markTourCompleted(config.id);
      }
    }
    
    setState(prev => ({
      ...prev,
      isActive: false,
      hasSkipped: skip,
      hasCompleted: !skip,
      waitingForAction: false,
      expectedActionType: null,
    }));
  }, [config, state.currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (!config) return;
    
    const clampedIndex = Math.max(0, Math.min(stepIndex, config.steps.length - 1));
    setState(prev => ({
      ...prev,
      currentStep: clampedIndex,
    }));
    
    // Update waiting state for the new step
    setTimeout(() => {
      updateWaitingState(clampedIndex, config);
    }, 0);
  }, [config, updateWaitingState]);

  const goToNextStep = useCallback(() => {
    if (!config) return;
    
    // If waiting for action and trigger is 'action', prevent manual advancement
    const currentStep = config.steps[state.currentStep];
    if (state.waitingForAction && currentStep?.trigger === 'action') {
      return; // Cannot manually advance, must trigger action
    }
    
    // Validate step if validation function exists
    if (currentStep?.validateStep && !currentStep.validateStep()) {
      return; // Validation failed, don't advance
    }
    
    if (state.currentStep >= config.steps.length - 1) {
      endTour(false);
    } else {
      const nextStepIndex = state.currentStep + 1;
      setState(prev => ({
        ...prev,
        currentStep: nextStepIndex,
        waitingForAction: false,
        expectedActionType: null,
      }));
      
      // Update waiting state for the next step
      setTimeout(() => {
        const nextStep = config.steps[nextStepIndex];
        if (nextStep && nextStep.trigger === 'action' && nextStep.actionType) {
          setState(prev => ({
            ...prev,
            waitingForAction: true,
            expectedActionType: nextStep.actionType ?? null,
          }));
        }
      }, 0);
    }
  }, [config, state.currentStep, state.waitingForAction, endTour]);

  const goToPreviousStep = useCallback(() => {
    if (!config) return;
    
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
      waitingForAction: false,
      expectedActionType: null,
    }));
    
    // Update waiting state for the previous step
    setTimeout(() => {
      const prevStepIndex = Math.max(0, state.currentStep - 1);
      updateWaitingState(prevStepIndex, config);
    }, 0);
  }, [config, state.currentStep, updateWaitingState]);

  const restartTour = useCallback(() => {
    if (!config) return;
    
    setState({
      isActive: true,
      currentStep: 0,
      totalSteps: config.steps.length,
      hasCompleted: false,
      hasSkipped: false,
      waitingForAction: false,
      expectedActionType: null,
    });
    
    // Check if first step needs action
    setTimeout(() => {
      const firstStep = config.steps[0];
      if (firstStep && firstStep.trigger === 'action' && firstStep.actionType) {
        setState(prev => ({
          ...prev,
          waitingForAction: true,
          expectedActionType: firstStep.actionType ?? null,
        }));
      }
    }, 0);
  }, [config]);

  /**
   * Register an action that may trigger tour advancement
   */
  const registerAction = useCallback((actionType: string, data?: any) => {
    if (!config || !state.isActive) return;
    
    const currentStep = config.steps[state.currentStep];
    if (!currentStep) return;
    
    // Check if current step is waiting for this action
    if (state.waitingForAction && currentStep.trigger === 'action' && currentStep.actionType === actionType) {
      // Call onAction callback if provided
      if (currentStep.onAction) {
        currentStep.onAction(actionType, data);
      }
      
      // Validate step if validation function exists
      if (currentStep.validateStep && !currentStep.validateStep()) {
        return; // Validation failed, don't advance
      }
      
      // Advance to next step
      if (state.currentStep >= config.steps.length - 1) {
        endTour(false);
      } else {
        const nextStepIndex = state.currentStep + 1;
        setState(prev => ({
          ...prev,
          currentStep: nextStepIndex,
          waitingForAction: false,
          expectedActionType: null,
        }));
        
        // Check if next step also requires action
        setTimeout(() => {
          const nextStep = config.steps[nextStepIndex];
          if (nextStep && nextStep.trigger === 'action' && nextStep.actionType) {
            setState(prev => ({
              ...prev,
              waitingForAction: true,
              expectedActionType: nextStep.actionType ?? null,
            }));
          }
        }, 0);
      }
    }
  }, [config, state.isActive, state.currentStep, state.waitingForAction, endTour]);

  /**
   * Check if the tour is currently waiting for a specific action
   */
  const isWaitingForAction = useCallback((actionType: string): boolean => {
    return state.waitingForAction && state.expectedActionType === actionType;
  }, [state.waitingForAction, state.expectedActionType]);

  const currentStepData = useMemo<TourStep | null>(() => {
    if (!config || !state.isActive) return null;
    return config.steps[state.currentStep] ?? null;
  }, [config, state.currentStep, state.isActive]);

  const value = useMemo<TourContextValue>(() => ({
    state,
    config,
    startTour,
    endTour,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    restartTour,
    currentStepData,
    registerAction,
    isWaitingForAction,
  }), [
    state,
    config,
    startTour,
    endTour,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    restartTour,
    currentStepData,
    registerAction,
    isWaitingForAction,
  ]);

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

export function useTourAutoStart(
  tourConfig: TourConfig, 
  enabled: boolean = true
) {
  const { startTour } = useTour();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!enabled || hasChecked) return;
    
    const shouldStart = shouldAutoStartTour(tourConfig.id);
    if (shouldStart) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        startTour(tourConfig);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    setHasChecked(true);
  }, [tourConfig, enabled, startTour, hasChecked]);
}
