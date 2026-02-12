/**
 * Damus Simulator - iOS Nostr Client Simulation
 * 
 * A visual simulation of the Damus iOS app for educational purposes.
 * This is a UI-only simulator with mock data - no real Nostr protocol.
 */

// Main Simulator
export { DamusSimulator } from './DamusSimulator';
export type { DamusScreen } from './DamusSimulator';

// Screens
export { LoginScreen } from './screens/LoginScreen';
export { HomeScreen } from './screens/HomeScreen';
export { ProfileScreen } from './screens/ProfileScreen';
export { ComposeScreen } from './screens/ComposeScreen';
export { SettingsScreen } from './screens/SettingsScreen';

// Components
export { Avatar } from './components/Avatar';
export { TabBar } from './components/TabBar';
export { NoteCard } from './components/NoteCard';
export { ProfileHeader } from './components/ProfileHeader';

// Theme
import './damus.theme.css';
