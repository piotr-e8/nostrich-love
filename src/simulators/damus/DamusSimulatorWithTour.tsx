/**
 * Damus Simulator with Tour Integration
 * Tour drives the simulator state
 */

import React, { useState, useRef, useCallback } from 'react';
import { TourWrapper } from '../../components/tour';
import { damusTourConfig } from '../../data/tours/damus-tour';
import { DamusSimulator as DamusSimulatorBase } from './DamusSimulator';
import type { DamusSimulatorCommand } from './DamusSimulator';

export function DamusSimulatorWithTour() {
  const [commandQueue, setCommandQueue] = useState<DamusSimulatorCommand[]>([]);
  const [currentCommand, setCurrentCommand] = useState<DamusSimulatorCommand | null>(null);
  const lastStepRef = useRef<number>(-1);
  const isProcessingRef = useRef(false);

  // Process commands from queue one by one
  const processNextCommand = useCallback(() => {
    if (isProcessingRef.current || commandQueue.length === 0) return;
    
    isProcessingRef.current = true;
    const nextCmd = commandQueue[0];
    setCurrentCommand(nextCmd);
  }, [commandQueue]);

  // Handle command completion
  const handleCommandHandled = useCallback(() => {
    setCommandQueue(prev => prev.slice(1));
    setCurrentCommand(null);
    isProcessingRef.current = false;
    
    // Process next command after a short delay
    setTimeout(() => {
      if (commandQueue.length > 1) {
        const nextCmd = commandQueue[1];
        setCurrentCommand(nextCmd);
        setCommandQueue(prev => prev.slice(1));
      }
    }, 100);
  }, [commandQueue]);

  // Queue commands for a step
  const queueCommands = useCallback((commands: DamusSimulatorCommand[]) => {
    console.log('[DamusSimulator] Queueing commands:', commands);
    setCommandQueue(commands);
    // Start processing first command
    if (commands.length > 0) {
      setTimeout(() => {
        setCurrentCommand(commands[0]);
      }, 50);
    }
  }, []);

  // Handle tour step changes to navigate simulator
  const handleStepChange = useCallback((stepIndex: number) => {
    // Prevent duplicate processing of same step
    if (lastStepRef.current === stepIndex) {
      console.log('[DamusSimulator] Ignoring duplicate step:', stepIndex);
      return;
    }
    lastStepRef.current = stepIndex;
    
    console.log('[DamusSimulator] Tour step changed to:', stepIndex);
    
    // Define commands for each step
    const stepCommands: Record<number, DamusSimulatorCommand[]> = {
      // Step 0: Welcome - no action needed
      0: [],
      // Step 1: Login screen - already there
      1: [],
      // Step 2: Home feed - login + navigate to home
      2: [{ type: 'login' }, { type: 'navigate', payload: 'home' }],
      // Step 3: Compose button - login + navigate to home (compose shown in home)
      3: [{ type: 'login' }, { type: 'navigate', payload: 'home' }],
      // Step 4: Post - login + navigate to home
      4: [{ type: 'login' }, { type: 'navigate', payload: 'home' }],
      // Step 5: Profile - login + view profile
      5: [{ type: 'login' }, { type: 'viewProfile' }],
      // Step 6: Follow - login + view profile
      6: [{ type: 'login' }, { type: 'viewProfile' }],
      // Step 7: Interactions - login + navigate to home
      7: [{ type: 'login' }, { type: 'navigate', payload: 'home' }],
      // Step 8: Settings - login + navigate to settings
      8: [{ type: 'login' }, { type: 'navigate', payload: 'settings' }],
      // Step 9: Complete - no action
      9: [],
    };
    
    const commands = stepCommands[stepIndex] || [];
    if (commands.length > 0) {
      queueCommands(commands);
    }
  }, [queueCommands]);

  return (
    <TourWrapper 
      tourConfig={damusTourConfig}
      autoStart={true}
      onStepChange={handleStepChange}
      onTourComplete={() => {
        console.log('Damus tour completed!');
      }}
      onTourSkip={() => {
        console.log('Damus tour skipped');
      }}
    >
      <DamusSimulatorBase 
        tourCommand={currentCommand}
        onCommandHandled={handleCommandHandled}
      />
    </TourWrapper>
  );
}

export default DamusSimulatorWithTour;
