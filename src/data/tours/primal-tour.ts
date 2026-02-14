/**
 * Primal Web Simulator Tour
 * Tour drives the simulator - user clicks Next, tour navigates simulator
 */

import type { TourConfig, TourStep } from '../../components/tour';

const primalTourSteps: TourStep[] = [
  {
    id: 'primal-welcome',
    target: '.primal-web',
    title: 'Welcome to Primal',
    content: 'Primal is a fast, modern web-based Nostr client. It is optimized for speed and provides a clean Twitter-like experience right in your browser. Let us explore together!',
    position: 'center',
    spotlightPadding: 0,
  },
  {
    id: 'primal-login',
    target: '.primal-login, [data-tour="primal-keys"]',
    title: 'Key-Based Login',
    content: 'Primal uses Nostr\'s key system. Login with your existing nsec (private key) or generate new keys. No passwords, no email - just cryptography! Extensions like Alby or nos2x are the safest option.',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 16,
  },
  {
    id: 'primal-home',
    target: '.primal-feed, [data-tour="primal-feed"]',
    title: 'Optimized Feed',
    content: 'Primal\'s feed loads quickly with infinite scroll. See posts from followed accounts with threaded replies. The interface prioritizes content readability. This is where you will discover content!',
    position: 'top',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'primal-compose',
    target: '.primal-compose, [data-tour="primal-compose"]',
    title: 'Quick Compose',
    content: 'Create posts easily from anywhere. Support for text formatting, mentions (@username), hashtags (#topic), and custom emojis. Your post reaches all connected relays instantly.',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 12,
  },
  {
    id: 'primal-post',
    target: '.primal-post-btn, [data-tour="primal-post"]',
    title: 'Publish Your Note',
    content: 'Write something interesting and hit post! Your note will be cryptographically signed and broadcast to all connected relays. Once published, it is permanent on the Nostr network.',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 12,
  },
  {
    id: 'primal-profile',
    target: '.primal-profile, [data-tour="primal-profile"]',
    title: 'User Profiles',
    content: 'View detailed profiles with stats, posts, media, and followers. Edit your own profile with rich metadata including NIP-05 identifiers and Lightning addresses. This is your identity on Nostr!',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 16,
  },
  {
    id: 'primal-follow',
    target: '.primal-follow-btn, [data-tour="primal-follow"]',
    title: 'Following Users',
    content: 'Find interesting people by browsing your network. When you follow someone, their posts appear in your feed. Your follows are stored in your account and synced across all Nostr clients.',
    position: 'left',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'primal-interactions',
    target: '.primal-zap-btn, [data-tour="primal-zaps"]',
    title: 'Lightning Zaps',
    content: 'Primal has excellent Lightning Network integration. Send Bitcoin sats (zaps) to reward great content. Setup your own Lightning address to receive tips too! You can also like and reply to posts.',
    position: 'top',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'primal-settings',
    target: '.primal-settings-screen, [data-tour="primal-settings"]',
    title: 'Settings & Security',
    content: 'Manage your account, backup your keys, adjust notification preferences, and configure the app. Remember to backup your private key securely - if you lose it, you lose access to your account!',
    position: 'center',
    allowClickThrough: true,
    spotlightPadding: 0,
  },
  {
    id: 'primal-complete',
    target: '.primal-web',
    title: 'Mastered Primal!',
    content: 'You now understand Primal! It is a great web client for Nostr beginners and power users alike. Your same keys work here as in any other Nostr app. Stay sovereign!',
    position: 'center',
    spotlightPadding: 0,
  },
];

export const primalTourConfig: TourConfig = {
  id: 'primal-tour',
  name: 'Primal Simulator Tour',
  steps: primalTourSteps,
  storageKey: 'nostr-tour-primal',
};

export default primalTourConfig;
