/**
 * Snort Simulator with Tour Integration
 * Tour drives the simulator state
 */

import React, { useState, useRef, useCallback } from 'react';
import { TourWrapper } from '../../components/tour';
import { snortTourConfig } from '../../data/tours';
import { SnortSimulator as SnortSimulatorBase } from './SnortSimulator';
import type { SnortScreen } from './SnortSimulator';

export interface SimulatorCommand {
  type: 'login' | 'navigate' | 'compose' | 'post' | 'viewProfile';
  payload?: any;
}

export function SnortSimulatorWithTour() {
  const [commandQueue, setCommandQueue] = useState<SimulatorCommand[]>([]);
  const [currentCommand, setCurrentCommand] = useState<SimulatorCommand | null>(null);
  const lastStepRef = useRef<number>(-1);
  const isProcessingRef = useRef(false);

  const processNextCommand = useCallback(() => {
    if (isProcessingRef.current || commandQueue.length === 0) return;
    
    isProcessingRef.current = true;
    const nextCmd = commandQueue[0];
    setCurrentCommand(nextCmd);
  }, [commandQueue]);

  const handleCommandHandled = useCallback(() => {
    setCommandQueue(prev => prev.slice(1));
    setCurrentCommand(null);
    isProcessingRef.current = false;
    
    setTimeout(() => {
      if (commandQueue.length > 1) {
        const nextCmd = commandQueue[1];
        setCurrentCommand(nextCmd);
        setCommandQueue(prev => prev.slice(1));
      }
    }, 100);
  }, [commandQueue]);

  const queueCommands = useCallback((commands: SimulatorCommand[]) => {
    console.log('[SnortSimulator] Queueing commands:', commands);
    setCommandQueue(commands);
    if (commands.length > 0) {
      setTimeout(() => {
        setCurrentCommand(commands[0]);
      }, 50);
    }
  }, []);

  const handleStepChange = useCallback((stepIndex: number) => {
    if (lastStepRef.current === stepIndex) {
      console.log('[SnortSimulator] Ignoring duplicate step:', stepIndex);
      return;
    }
    lastStepRef.current = stepIndex;
    
    console.log('[SnortSimulator] Tour step changed to:', stepIndex);
    
    const stepCommands: Record<number, SimulatorCommand[]> = {
      0: [], // Welcome
      1: [], // Login - manual
      2: [{ type: 'login' }, { type: 'navigate', payload: 'timeline' }], // Home feed
      3: [{ type: 'login' }, { type: 'navigate', payload: 'timeline' }, { type: 'compose' }], // Compose
      4: [{ type: 'login' }, { type: 'navigate', payload: 'timeline' }, { type: 'post' }], // Post
      5: [{ type: 'login' }, { type: 'viewProfile' }], // Profile
      6: [{ type: 'login' }, { type: 'viewProfile' }], // Follow
      7: [{ type: 'login' }, { type: 'navigate', payload: 'timeline' }], // Interactions
      8: [{ type: 'login' }, { type: 'navigate', payload: 'settings' }], // Settings
      9: [], // Complete
    };
    
    const commands = stepCommands[stepIndex] || [];
    if (commands.length > 0) {
      queueCommands(commands);
    }
  }, [queueCommands]);

  return (
    <TourWrapper 
      tourConfig={snortTourConfig}
      autoStart={true}
      onStepChange={handleStepChange}
      onTourComplete={() => {
        console.log('Snort tour completed!');
      }}
      onTourSkip={() => {
        console.log('Snort tour skipped');
      }}
    >
      <SnortSimulatorBase 
        tourCommand={currentCommand}
        onCommandHandled={handleCommandHandled}
      />
    </TourWrapper>
  );
}

export default SnortSimulatorWithTour;
