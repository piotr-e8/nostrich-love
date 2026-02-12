/**
 * Snort Simulator with Tour Integration
 */

import React from 'react';
import { TourWrapper, TourButton } from '../../components/tour';
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
      <div className="relative">
        <div className="fixed top-4 right-4 z-[9999]">
          <TourButton 
            tourConfig={snortTourConfig}
            variant="secondary"
            size="sm"
          />
        </div>
        <SnortSimulatorBase />
      </div>
    </TourWrapper>
  );
}

export default SnortSimulatorWithTour;
