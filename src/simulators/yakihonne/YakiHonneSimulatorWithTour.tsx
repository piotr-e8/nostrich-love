/**
 * YakiHonne Simulator with Tour Integration
 * Tour drives the simulator state
 */

import React, { useState, useRef, useCallback } from 'react';
import { TourWrapper } from '../../components/tour';
import { yakihonneTourConfig } from '../../data/tours';
import { YakiHonneSimulator as YakiHonneSimulatorBase } from './YakiHonneSimulator';
import type { TabId } from './YakiHonneSimulator';

export interface SimulatorCommand {
  type: 'login' | 'navigate' | 'compose' | 'post' | 'viewProfile';
  payload?: any;
}

export function YakiHonneSimulatorWithTour() {
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
    console.log('[YakiHonneSimulator] Queueing commands:', commands);
    setCommandQueue(commands);
    if (commands.length > 0) {
      setTimeout(() => {
        setCurrentCommand(commands[0]);
      }, 50);
    }
  }, []);

  const handleStepChange = useCallback((stepIndex: number) => {
    if (lastStepRef.current === stepIndex) {
      console.log('[YakiHonneSimulator] Ignoring duplicate step:', stepIndex);
      return;
    }
    lastStepRef.current = stepIndex;
    
    console.log('[YakiHonneSimulator] Tour step changed to:', stepIndex);
    
    const stepCommands: Record<number, SimulatorCommand[]> = {
      0: [], // Welcome
      1: [], // Login - manual
      2: [{ type: 'login' }, { type: 'navigate', payload: 'feed' }], // Home feed
      3: [{ type: 'login' }, { type: 'navigate', payload: 'feed' }, { type: 'compose' }], // Compose
      4: [{ type: 'login' }, { type: 'navigate', payload: 'feed' }, { type: 'post' }], // Post
      5: [{ type: 'login' }, { type: 'viewProfile' }], // Profile
      6: [{ type: 'login' }, { type: 'viewProfile' }], // Follow
      7: [{ type: 'login' }, { type: 'navigate', payload: 'feed' }], // Interactions
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
      tourConfig={yakihonneTourConfig}
      autoStart={true}
      onStepChange={handleStepChange}
      onTourComplete={() => {
        console.log('YakiHonne tour completed!');
      }}
      onTourSkip={() => {
        console.log('YakiHonne tour skipped');
      }}
    >
      <YakiHonneSimulatorBase 
        tourCommand={currentCommand}
        onCommandHandled={handleCommandHandled}
      />
    </TourWrapper>
  );
}

export default YakiHonneSimulatorWithTour;
