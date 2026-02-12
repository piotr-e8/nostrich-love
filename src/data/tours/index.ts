/**
 * Tour Data Index
 * Export all tour configurations
 */

export { damusTourConfig, default as damusTour } from './damus-tour';
export { amethystTourConfig, default as amethystTour } from './amethyst-tour';
export { primalTourConfig, default as primalTour } from './primal-tour';
export { snortTourConfig, default as snortTour } from './snort-tour';
export { yakihonneTourConfig, default as yakihonneTour } from './yakihonne-tour';

// Static map for easy lookup
import { damusTourConfig as damus } from './damus-tour';
import { amethystTourConfig as amethyst } from './amethyst-tour';
import { primalTourConfig as primal } from './primal-tour';
import { snortTourConfig as snort } from './snort-tour';
import { yakihonneTourConfig as yakihonne } from './yakihonne-tour';

export const tourConfigs = {
  damus,
  amethyst,
  primal,
  snort,
  yakihonne,
} as const;

export type TourClient = keyof typeof tourConfigs;
