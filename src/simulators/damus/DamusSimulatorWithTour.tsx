/**
 * Damus Simulator with Tour Integration
 * 
 * Example showing how to integrate the tour system into a simulator
 */

import React from 'react';
import { TourWrapper, TourButton } from '../../components/tour';
import { damusTourConfig } from '../../data/tours';
import { DamusSimulator as DamusSimulatorBase } from './index';

export function DamusSimulatorWithTour() {
  return (
    <TourWrapper 
      tourConfig={damusTourConfig}
      autoStart={true}
      onTourComplete={() => {
        console.log('Damus tour completed!');
      }}
      onTourSkip={() => {
        console.log('Damus tour skipped');
      }}
    >
      <div className="relative">
        {/* Tour restart button - fixed position */}
        <div className="fixed top-4 right-4 z-40">
          <TourButton 
            tourConfig={damusTourConfig}
            variant="secondary"
            size="sm"
          />
        </div>

        {/* Simulator */}
        <DamusSimulatorBase />
      </div>
    </TourWrapper>
  );
}

export default DamusSimulatorWithTour;
