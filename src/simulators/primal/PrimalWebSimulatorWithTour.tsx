/**
 * Primal Web Simulator with Tour Integration
 */

import React from 'react';
import { TourWrapper } from '../../components/tour';
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
      <PrimalWebSimulatorBase />
    </TourWrapper>
  );
}

export default PrimalWebSimulatorWithTour;
