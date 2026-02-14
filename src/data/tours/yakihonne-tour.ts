/**
 * YakiHonne Web Simulator Tour
 * Tour drives the simulator - user clicks Next, tour navigates simulator
 */

import type { TourConfig, TourStep } from '../../components/tour';

const yakihonneTourSteps: TourStep[] = [
  {
    id: 'yakihonne-welcome',
    target: '.yakihonne-simulator',
    title: 'Welcome to YakiHonne',
    content: 'YakiHonne (やきほんね) is a Japanese-inspired web Nostr client with unique features. The name means "true feelings" - expressing authentic thoughts on Nostr! Let us explore together.',
    position: 'center',
    spotlightPadding: 0,
  },
  {
    id: 'yakihonne-login',
    target: '.yakihonne-login, [data-tour="yakihonne-keys"]',
    title: 'Secure Login',
    content: 'Login with your Nostr keys or generate new ones. YakiHonne emphasizes privacy and security. Browser extensions are supported for the safest experience. Your keys are your identity!',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 16,
  },
  {
    id: 'yakihonne-home',
    target: '.yakihonne-feed, [data-tour="yakihonne-feed"]',
    title: 'Customizable Feed',
    content: 'Your timeline with multiple view options. Switch between different layouts and filters. YakiHonne offers unique ways to browse Nostr content beyond the standard feed.',
    position: 'top',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'yakihonne-compose',
    target: '.yakihonne-compose, [data-tour="yakihonne-compose"]',
    title: 'Express Yourself',
    content: 'Create notes with full formatting support. YakiHonne supports rich media embedding, custom reactions, and even drawing/art features for creative expression.',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 12,
  },
  {
    id: 'yakihonne-post',
    target: '.yakihonne-post-btn, [data-tour="yakihonne-post"]',
    title: 'Publish Your Note',
    content: 'Write something interesting and hit post! Your note will be cryptographically signed and broadcast to all connected relays. Once published, it is permanent on the Nostr network.',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 12,
  },
  {
    id: 'yakihonne-profile',
    target: '.yakihonne-profile, [data-tour="yakihonne-profile"]',
    title: 'Personal Space',
    content: 'Your profile hub with customizable themes, detailed statistics, and content organization. Show off your NIP-05 badge and Lightning address for tips. This is your identity on Nostr!',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 16,
  },
  {
    id: 'yakihonne-follow',
    target: '.yakihonne-follow-btn, [data-tour="yakihonne-follow"]',
    title: 'Following Users',
    content: 'Find interesting people by browsing your network. When you follow someone, their posts appear in your feed. Your follows are stored in your account and synced across all Nostr clients.',
    position: 'left',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'yakihonne-interactions',
    target: '.yakihonne-zap-btn, [data-tour="yakihonne-zaps"]',
    title: 'Unique Interactions',
    content: 'YakiHonne offers custom emoji reactions, zaps (Bitcoin tips), likes, and replies. Zaps use Lightning Network to send real Bitcoin to content creators instantly!',
    position: 'top',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'yakihonne-settings',
    target: '.yakihonne-features, [data-tour="yakihonne-unique"]',
    title: 'Unique Features',
    content: 'Discover YakiHonne\'s special features: custom emoji reactions, art/drawing tools, community spaces, and unique UI customizations. Remember to backup your private key securely!',
    position: 'left',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'yakihonne-complete',
    target: '.yakihonne-simulator',
    title: 'YakiHonne Explorer!',
    content: 'You have explored YakiHonne! This creative client offers unique ways to experience Nostr. Your keys work everywhere - the protocol is yours to explore freely!',
    position: 'center',
    spotlightPadding: 0,
  },
];

export const yakihonneTourConfig: TourConfig = {
  id: 'yakihonne-tour',
  name: 'YakiHonne Simulator Tour',
  steps: yakihonneTourSteps,
  storageKey: 'nostr-tour-yakihonne',
};

export default yakihonneTourConfig;
