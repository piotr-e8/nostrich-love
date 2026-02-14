/**
 * Simulator Configurations
 * Pre-defined configurations for all Nostr client simulators
 */

import { SimulatorClient, SimulatorFeature, SimulatorView } from './types';
import type { SimulatorConfig } from './types';

/**
 * Damus - iOS Nostr client
 * Clean, minimalist design with purple accent
 */
export const damusConfig: SimulatorConfig = {
  id: SimulatorClient.DAMUS,
  name: 'Damus',
  description: 'The Nostr client for iOS. Clean, fast, and private.',
  platform: 'ios',
  primaryColor: '#8B5CF6', // Purple
  secondaryColor: '#A78BFA',
  icon: '/icons/damus.png',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    SimulatorFeature.THREADS,
    SimulatorFeature.SEARCH,
    SimulatorFeature.RELAYS,
    SimulatorFeature.BADGES,
    SimulatorFeature.NIP05,
    SimulatorFeature.MUTE_LIST,
    SimulatorFeature.PINNED_NOTES,
  ],
  defaultView: SimulatorView.FEED,
};

/**
 * Amethyst - Android Nostr client
 * Material Design with deep purple theme
 */
export const amethystConfig: SimulatorConfig = {
  id: SimulatorClient.AMETHYST,
  name: 'Amethyst',
  description: 'Android Nostr client with rich features and modern design.',
  platform: 'android',
  primaryColor: '#6B21A8', // Deep purple - Amethyst brand color
  secondaryColor: '#A855F7', // Light purple
  icon: '/icons/amethyst.png',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    SimulatorFeature.THREADS,
    SimulatorFeature.SEARCH,
    SimulatorFeature.RELAYS,
    SimulatorFeature.BADGES,
    SimulatorFeature.NIP05,
    SimulatorFeature.LONG_FORM,
    SimulatorFeature.LIVE_STREAMING,
    SimulatorFeature.MUTE_LIST,
    SimulatorFeature.PINNED_NOTES,
  ],
  defaultView: SimulatorView.FEED,
};

/**
 * Primal - Web & Mobile Nostr client
 * Orange Bitcoin-themed design
 */
export const primalConfig: SimulatorConfig = {
  id: SimulatorClient.PRIMAL,
  name: 'Primal',
  description: 'Fast, modern Nostr client with excellent UX.',
  platform: 'web',
  primaryColor: '#F97316', // Orange - Primal brand color
  secondaryColor: '#FB923C', // Light orange
  icon: '/icons/primal.png',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    SimulatorFeature.THREADS,
    SimulatorFeature.SEARCH,
    SimulatorFeature.RELAYS,
    SimulatorFeature.BADGES,
    SimulatorFeature.NIP05,
    SimulatorFeature.LONG_FORM,
    SimulatorFeature.MARKETPLACE,
    SimulatorFeature.MUTE_LIST,
    SimulatorFeature.PINNED_NOTES,
  ],
  defaultView: SimulatorView.FEED,
};

/**
 * Snort - Web Nostr client
 * Minimalist web client with teal accents
 */
export const snortConfig: SimulatorConfig = {
  id: SimulatorClient.SNORT,
  name: 'Snort',
  description: 'Simple, fast web Nostr client.',
  platform: 'web',
  primaryColor: '#14B8A6', // Teal
  secondaryColor: '#5EEAD4',
  icon: '/icons/snort.png',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    SimulatorFeature.THREADS,
    SimulatorFeature.SEARCH,
    SimulatorFeature.RELAYS,
    SimulatorFeature.NIP05,
    SimulatorFeature.MUTE_LIST,
  ],
  defaultView: SimulatorView.FEED,
};

/**
 * YakiHonne - Mobile-first Nostr client
 * Japanese-inspired design with pink accents
 */
export const yakihonneConfig: SimulatorConfig = {
  id: SimulatorClient.YAKIHONNE,
  name: 'YakiHonne',
  description: 'Mobile-first Nostr client with unique social features.',
  platform: 'ios',
  primaryColor: '#EC4899', // Pink
  secondaryColor: '#F472B6',
  icon: '/icons/yakihonne.svg',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    SimulatorFeature.THREADS,
    SimulatorFeature.SEARCH,
    SimulatorFeature.RELAYS,
    SimulatorFeature.BADGES,
    SimulatorFeature.NIP05,
    SimulatorFeature.LONG_FORM,
    SimulatorFeature.MUTE_LIST,
    SimulatorFeature.PINNED_NOTES,
  ],
  defaultView: SimulatorView.FEED,
};

/**
 * Coracle - Web Nostr client
 * Simple, accessible, beginner-friendly web interface
 */
export const coracleConfig: SimulatorConfig = {
  id: SimulatorClient.CORACLE,
  name: 'Coracle',
  description: 'Simple, accessible web Nostr client perfect for beginners.',
  platform: 'web',
  primaryColor: '#6366F1', // Indigo
  secondaryColor: '#818CF8',
  icon: '/icons/coracle.png',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    SimulatorFeature.THREADS,
    SimulatorFeature.SEARCH,
    SimulatorFeature.RELAYS,
    SimulatorFeature.BADGES,
    SimulatorFeature.NIP05,
    SimulatorFeature.MUTE_LIST,
    SimulatorFeature.PINNED_NOTES,
  ],
  defaultView: SimulatorView.FEED,
};

/**
 * Gossip - Desktop Nostr client
 * Developer-focused with advanced relay management
 */
export const gossipConfig: SimulatorConfig = {
  id: SimulatorClient.GOSSIP,
  name: 'Gossip',
  description: 'Powerful desktop client with advanced relay features.',
  platform: 'desktop',
  primaryColor: '#22C55E', // Green
  secondaryColor: '#4ADE80',
  icon: '/icons/gossip.png',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    SimulatorFeature.THREADS,
    SimulatorFeature.SEARCH,
    SimulatorFeature.RELAYS,
    SimulatorFeature.NIP05,
    SimulatorFeature.MUTE_LIST,
  ],
  defaultView: SimulatorView.FEED,
};

/**
 * Keychat - Android Super App
 * Bitcoin wallet + Secure chat + Mini apps
 */
export const keychatConfig: SimulatorConfig = {
  id: SimulatorClient.KEYCHAT,
  name: 'Keychat',
  description: 'Super app for Bitcoiners with sovereign identity, ecash wallet, and secure chat.',
  platform: 'android',
  primaryColor: '#2D7FF9', // Bright blue
  secondaryColor: '#1E40AF', // Dark blue
  icon: '/icons/keychat.svg',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    SimulatorFeature.SEARCH,
    SimulatorFeature.BADGES,
    SimulatorFeature.NIP05,
    SimulatorFeature.MUTE_LIST,
  ],
  defaultView: SimulatorView.MESSAGES,
};

/**
 * Olas - Photo-first Nostr client
 * Instagram-style interface for sharing photos and videos
 */
export const olasConfig: SimulatorConfig = {
  id: SimulatorClient.OLAS,
  name: 'Olas',
  description: 'Photo-first Nostr client for sharing and discovering visual content.',
  platform: 'ios',
  primaryColor: '#FF6B6B', // Coral
  secondaryColor: '#FF8E53', // Orange
  icon: '/icons/olas.svg',
  supportedFeatures: [
    SimulatorFeature.ZAPS,
    SimulatorFeature.SEARCH,
    SimulatorFeature.RELAYS,
    SimulatorFeature.NIP05,
    SimulatorFeature.MUTE_LIST,
  ],
  defaultView: SimulatorView.FEED,
};

/**
 * All simulator configs collection
 */
export const allSimulatorConfigs: Record<SimulatorClient, SimulatorConfig> = {
  [SimulatorClient.DAMUS]: damusConfig,
  [SimulatorClient.AMETHYST]: amethystConfig,
  [SimulatorClient.PRIMAL]: primalConfig,
  [SimulatorClient.SNORT]: snortConfig,
  [SimulatorClient.YAKIHONNE]: yakihonneConfig,
  [SimulatorClient.CORACLE]: coracleConfig,
  [SimulatorClient.GOSSIP]: gossipConfig,
  [SimulatorClient.KEYCHAT]: keychatConfig,
  [SimulatorClient.OLAS]: olasConfig,
};

/**
 * Get config by client ID
 */
export function getSimulatorConfig(client: SimulatorClient): SimulatorConfig {
  return allSimulatorConfigs[client];
}

/**
 * Get all configs as array
 */
export function getAllSimulatorConfigs(): SimulatorConfig[] {
  return Object.values(allSimulatorConfigs);
}

/**
 * Get configs by platform
 */
export function getConfigsByPlatform(platform: SimulatorConfig['platform']): SimulatorConfig[] {
  return Object.values(allSimulatorConfigs).filter(config => config.platform === platform);
}

/**
 * Get config by name (case insensitive)
 */
export function getConfigByName(name: string): SimulatorConfig | undefined {
  const lowerName = name.toLowerCase();
  return Object.values(allSimulatorConfigs).find(
    config => config.name.toLowerCase() === lowerName
  );
}

export default allSimulatorConfigs;
