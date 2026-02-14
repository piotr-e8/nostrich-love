import React, { useState, useRef, useCallback } from 'react';
import { TourWrapper } from '../../components/tour';
import { olasTourConfig } from '../../data/tours/olas-tour';
import { OlasSimulator as OlasSimulatorBase } from './OlasSimulator';
import type { TabId } from './OlasSimulator';

interface OlasSimulatorCommand {
  type: 'login' | 'navigate' | 'viewProfile' | 'viewNotifications' | 'compose';
  payload?: string;
}

export function OlasSimulatorWithTour() {
  const [commandQueue, setCommandQueue] = useState<OlasSimulatorCommand[]>([]);
  const [currentCommand, setCurrentCommand] = useState<OlasSimulatorCommand | null>(null);
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

  const queueCommands = useCallback((commands: OlasSimulatorCommand[]) => {
    console.log('[OlasSimulator] Queueing commands:', commands);
    setCommandQueue(commands);
    if (commands.length > 0) {
      setTimeout(() => {
        setCurrentCommand(commands[0]);
      }, 50);
    }
  }, []);

  const handleStepChange = useCallback((stepIndex: number) => {
    if (lastStepRef.current === stepIndex) {
      console.log('[OlasSimulator] Ignoring duplicate step:', stepIndex);
      return;
    }
    lastStepRef.current = stepIndex;
    
    console.log('[OlasSimulator] Tour step changed to:', stepIndex);
    
    const stepCommands: Record<number, OlasSimulatorCommand[]> = {
      0: [], // Welcome
      1: [], // Login
      2: [{ type: 'login' }, { type: 'navigate', payload: 'home' }], // Stories
      3: [{ type: 'login' }, { type: 'navigate', payload: 'home' }], // Feed
      4: [{ type: 'login' }, { type: 'navigate', payload: 'home' }], // Upload
      5: [{ type: 'login' }, { type: 'navigate', payload: 'discover' }], // Discover
      6: [{ type: 'login' }, { type: 'viewProfile' }], // Profile
      7: [{ type: 'login' }, { type: 'viewNotifications' }], // Notifications
      8: [], // Nostr features
    };
    
    const commands = stepCommands[stepIndex] || [];
    if (commands.length > 0) {
      queueCommands(commands);
    }
  }, [queueCommands]);

  return (
    <TourWrapper 
      tourConfig={olasTourConfig}
      autoStart={true}
      onStepChange={handleStepChange}
      onTourComplete={() => {
        console.log('Olas tour completed!');
      }}
      onTourSkip={() => {
        console.log('Olas tour skipped');
      }}
    >
      <OlasSimulatorBase />
    </TourWrapper>
  );
}

export default OlasSimulatorWithTour;
