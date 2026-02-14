/**
 * Amethyst Simulator with Tour Integration
 */

import React from 'react';
import { TourWrapper } from '../../components/tour';
import { amethystTourConfig } from '../../data/tours';
import { AmethystSimulator as AmethystSimulatorBase } from './index';

export function AmethystSimulatorWithTour() {
  return (
    <TourWrapper 
      tourConfig={amethystTourConfig}
      autoStart={true}
      onTourComplete={() => {
        console.log('Amethyst tour completed!');
      }}
      onTourSkip={() => {
        console.log('Amethyst tour skipped');
      }}
    >
      <AmethystSimulatorBase />
    </TourWrapper>
  );
}

export default AmethystSimulatorWithTour;
