/**
 * Snort Simulator with Tour Integration
 */

import React from 'react';
import { TourWrapper } from '../../components/tour';
import { snortTourConfig } from '../../data/tours';
import { SnortSimulator as SnortSimulatorBase } from './index';

export function SnortSimulatorWithTour() {
  return (
    <TourWrapper 
      tourConfig={snortTourConfig}
      autoStart={true}
      onTourComplete={() => {
        console.log('Snort tour completed!');
      }}
      onTourSkip={() => {
        console.log('Snort tour skipped');
      }}
    >
      <SnortSimulatorBase />
    </TourWrapper>
  );
}

export default SnortSimulatorWithTour;
