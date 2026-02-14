/**
 * Keychat Simulator with Tour Integration
 * Tour drives the simulator state
 */

import React, { useState, useRef, useCallback } from 'react';
import { TourWrapper } from '../../components/tour';
import { keychatTourConfig } from '../../data/tours/keychat-tour';
import { KeychatSimulator as KeychatSimulatorBase } from './KeychatSimulator';
import type { SimulatorCommand } from './KeychatSimulator';

export function KeychatSimulatorWithTour() {
  const [commandQueue, setCommandQueue] = useState<SimulatorCommand[]>([]);
  const [currentCommand, setCurrentCommand] = useState<SimulatorCommand | null>(null);
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
    
    // Process next command after a short delay to allow React to re-render
    setTimeout(() => {
      if (commandQueue.length > 1) {
        const nextCmd = commandQueue[1];
        setCurrentCommand(nextCmd);
        setCommandQueue(prev => prev.slice(1));
      }
    }, 100);
  }, [commandQueue]);

  // Queue commands for a step
  const queueCommands = useCallback((commands: SimulatorCommand[]) => {
    console.log('[KeychatSimulator] Queueing commands:', commands);
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
      console.log('[KeychatSimulator] Ignoring duplicate step:', stepIndex);
      return;
    }
    lastStepRef.current = stepIndex;
    
    console.log('[KeychatSimulator] Tour step changed to:', stepIndex);
    
    // Define commands for each step
    const stepCommands: Record<number, SimulatorCommand[]> = {
      // Step 0: Welcome - no action needed
      0: [],
      // Step 1: Login screen - already there, just ensure not authenticated
      1: [{ type: 'back' }],
      // Step 2: Chats list - login + navigate to chats
      2: [{ type: 'login' }, { type: 'navigate', payload: 'chats' }],
      // Step 3: Chat item - login + navigate to chats
      3: [{ type: 'login' }, { type: 'navigate', payload: 'chats' }],
      // Step 4: Chat room - login + navigate to chats + select chat
      4: [{ type: 'login' }, { type: 'navigate', payload: 'chats' }, { type: 'selectChat', payload: '1' }],
      // Step 5: Message input - same as step 4
      5: [{ type: 'login' }, { type: 'navigate', payload: 'chats' }, { type: 'selectChat', payload: '1' }],
      // Step 6: Wallet - login + navigate to wallet
      6: [{ type: 'login' }, { type: 'navigate', payload: 'wallet' }],
      // Step 7: Apps - login + navigate to apps
      7: [{ type: 'login' }, { type: 'navigate', payload: 'apps' }],
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
      tourConfig={keychatTourConfig}
      autoStart={true}
      onStepChange={handleStepChange}
      onTourComplete={() => {
        console.log('Keychat tour completed!');
      }}
      onTourSkip={() => {
        console.log('Keychat tour skipped');
      }}
    >
      <KeychatSimulatorBase 
        tourCommand={currentCommand}
        onCommandHandled={handleCommandHandled}
      />
    </TourWrapper>
  );
}

export default KeychatSimulatorWithTour;
