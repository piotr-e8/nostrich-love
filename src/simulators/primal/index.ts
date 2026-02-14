/**
 * Primal Simulator
 * Discovery-focused Nostr client with Web and Mobile variants
 * 
 * @module simulators/primal
 */

export { PrimalWebSimulator } from './web/WebSimulator';
export { PrimalMobileSimulator } from './mobile/MobileSimulator';
export type { PrimalWebSimulatorProps } from './web/WebSimulator';
export type { PrimalMobileSimulatorProps } from './mobile/MobileSimulator';
export type { TabId as PrimalWebTabId } from './web/WebSimulator';
export type { TabId as PrimalMobileTabId } from './mobile/MobileSimulator';

// Web Components
export { NoteCard as PrimalWebNoteCard } from './web/components/NoteCard';

// Mobile Screens
export { SettingsScreen as PrimalMobileSettingsScreen } from './mobile/screens/SettingsScreen';

// Tour styles
import '../../components/tour/tour.css';
