/**
 * Amethyst Simulator with Tour Integration
 */

import React from 'react';
import { TourWrapper, TourButton } from '../../components/tour';
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
      <div className="relative">
        <div className="fixed top-4 right-4 z-[9999]">
          <TourButton 
            tourConfig={amethystTourConfig}
            variant="secondary"
            size="sm"
          />
        </div>
        <AmethystSimulatorBase />
      </div>
    </TourWrapper>
  );
}

export default AmethystSimulatorWithTour;
