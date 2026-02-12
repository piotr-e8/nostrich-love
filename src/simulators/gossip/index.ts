/**
 * Gossip Simulator
 * Desktop-efficient Nostr client simulation
 * 
 * Features:
 * - Split-pane layout with resizable sidebar
 * - Keyboard shortcuts for navigation
 * - Dense information display
 * - Advanced relay management
 * - Thread view with inline replies
 * - Power-user onboarding tour
 * 
 * @module simulators/gossip
 */

export { GossipSimulator } from './GossipSimulator';
export type { GossipView } from './GossipSimulator';
export { default } from './GossipSimulator';

// Theme
import './gossip.theme.css';
