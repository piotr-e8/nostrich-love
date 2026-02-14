/**
 * YakiHonne Simulator with Tour Integration
 */

import React from 'react';
import { TourWrapper } from '../../components/tour';
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
      <YakiHonneSimulatorBase />
    </TourWrapper>
  );
}

export default YakiHonneSimulatorWithTour;
