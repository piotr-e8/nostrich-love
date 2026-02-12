/**
 * Shared Module - Central exports for simulator framework
 */

// Types
export * from './types';

// Hooks
export { 
  useSimulator, 
  useSimulatorState,
  useCurrentUser,
  useIsLoggedIn,
  useCurrentView,
  useActiveModal,
  useFeed,
  useNotifications,
  useUnreadNotificationsCount,
  useFollowing,
  useConnectedRelays,
  useIsLoading,
  useSimulatorError,
  SimulatorProvider,
  SimulatorContext,
} from './hooks/useSimulator';

export { useParentTheme } from './hooks/useParentTheme';

// Components
export { SimulatorShell } from './components/SimulatorShell';
export { MockKeyDisplay } from './components/MockKeyDisplay';
export { NoteCard } from './components/NoteCard';

// Utilities
export * from './utils/mockKeys';
export * from './utils/mockEvents';

// Configs
export {
  damusConfig,
  amethystConfig,
  primalConfig,
  snortConfig,
  yakihonneConfig,
  coracleConfig,
  gossipConfig,
  allSimulatorConfigs,
  getSimulatorConfig,
  getAllSimulatorConfigs,
  getConfigsByPlatform,
  getConfigByName,
} from './configs';
