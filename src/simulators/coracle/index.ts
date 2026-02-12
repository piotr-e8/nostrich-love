/**
 * Coracle Simulator
 * Simple, accessible web Nostr client simulation
 * 
 * A beginner-friendly Nostr client featuring:
 * - Clean, high-contrast interface
 * - Easy onboarding with guided tour
 * - All 9 core Nostr features
 * - Responsive web design
 * 
 * @module simulators/coracle
 */

export { CoracleSimulator } from './CoracleSimulator';
export type { CoracleScreen } from './CoracleSimulator';

// Screens
export { LoginScreen } from './screens/LoginScreen';
export { HomeScreen } from './screens/HomeScreen';
export { ProfileScreen } from './screens/ProfileScreen';
export { RelaysScreen } from './screens/RelaysScreen';
export { SettingsScreen } from './screens/SettingsScreen';

// Components
export { Navigation } from './components/Navigation';
export { NoteCard } from './components/NoteCard';
export { ComposeModal } from './components/ComposeModal';
export { GuidedTour } from './components/GuidedTour';

// Theme
import './coracle.theme.css';
