/**
 * Olas Simulator - Photo-first Nostr Client Simulation
 * 
 * A visual simulation of the Olas mobile app for educational purposes.
 * Instagram-style interface focused on photo and video sharing.
 */

// Main Simulator
export { OlasSimulator } from './OlasSimulator';
export type { OlasScreen, TabId } from './OlasSimulator';
export { OlasSimulatorWithTour } from './OlasSimulatorWithTour';

// Screens
export { HomeScreen } from './screens/HomeScreen';
export { DiscoverScreen } from './screens/DiscoverScreen';
export { UploadScreen } from './screens/UploadScreen';
export { ProfileScreen } from './screens/ProfileScreen';
export { NotificationsScreen } from './screens/NotificationsScreen';

// Components
export { PhotoGrid } from './components/PhotoGrid';
export { StoryRow } from './components/StoryRow';
export { BottomNav } from './components/BottomNav';
export { MediaCard } from './components/MediaCard';

// Theme
import './olas.theme.css';
import '../../components/tour/tour.css';
