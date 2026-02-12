/**
 * Primal Web Simulator with Tour Integration
 */

import React from 'react';
import { TourWrapper, TourButton } from '../../components/tour';
import { primalTourConfig } from '../../data/tours';
import { PrimalWebSimulator as PrimalWebSimulatorBase } from './index';

export function PrimalWebSimulatorWithTour() {
  return (
    <TourWrapper 
      tourConfig={primalTourConfig}
      autoStart={true}
      onTourComplete={() => {
        console.log('Primal tour completed!');
      }}
      onTourSkip={() => {
        console.log('Primal tour skipped');
      }}
    >
      <div className="relative">
        <div className="fixed top-4 right-4 z-[9999]">
          <TourButton 
            tourConfig={primalTourConfig}
            variant="secondary"
            size="sm"
          />
        </div>
        <PrimalWebSimulatorBase />
      </div>
    </TourWrapper>
  );
}

export default PrimalWebSimulatorWithTour;
