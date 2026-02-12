/**
 * YakiHonne Simulator with Tour Integration
 */

import React from 'react';
import { TourWrapper, TourButton } from '../../components/tour';
import { yakihonneTourConfig } from '../../data/tours';
import { YakiHonneSimulator as YakiHonneSimulatorBase } from './index';

export function YakiHonneSimulatorWithTour() {
  return (
    <TourWrapper 
      tourConfig={yakihonneTourConfig}
      autoStart={true}
      onTourComplete={() => {
        console.log('YakiHonne tour completed!');
      }}
      onTourSkip={() => {
        console.log('YakiHonne tour skipped');
      }}
    >
      <div className="relative">
        <div className="fixed top-4 right-4 z-[9999]">
          <TourButton 
            tourConfig={yakihonneTourConfig}
            variant="secondary"
            size="sm"
          />
        </div>
        <YakiHonneSimulatorBase />
      </div>
    </TourWrapper>
  );
}

export default YakiHonneSimulatorWithTour;
