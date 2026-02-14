/**
 * Amethyst Simulator
 * Material Design 3 Nostr Client Simulator
 * 
 * A visual simulation of the Amethyst Android Nostr client
 * featuring Material Design 3 components and Material You theming.
 */

export { AmethystSimulator } from './AmethystSimulator';
export type { AmethystSimulatorProps, TabId } from './AmethystSimulator';

// Components
export { BottomNav } from './components/BottomNav';
export { MaterialCard } from './components/MaterialCard';
export { FloatingActionButton, ExtendedFAB } from './components/FloatingActionButton';
export { Drawer } from './components/Drawer';

// Screens
export { LoginScreen } from './screens/LoginScreen';
export { HomeScreen } from './screens/HomeScreen';
export { SearchScreen } from './screens/SearchScreen';
export { NotificationsScreen } from './screens/NotificationsScreen';
export { MessagesScreen } from './screens/MessagesScreen';
export { ProfileScreen } from './screens/ProfileScreen';
export { SettingsScreen } from './screens/SettingsScreen';
export { ComposeScreen } from './screens/ComposeScreen';
export { VideoScreen } from './screens/VideoScreen';

// Theme
import './amethyst.theme.css';
