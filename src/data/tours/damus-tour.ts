/**
 * Damus iOS Simulator Tour
 * Interactive, event-driven guided tour for Damus client
 */

import type { TourConfig, TourStep } from '../../components/tour';

const damusTourSteps: TourStep[] = [
  {
    id: 'damus-welcome',
    target: '.damus-simulator',
    title: 'Welcome to Damus',
    content: 'Damus is a popular iOS Nostr client with a clean, Twitter-like interface. It is one of the most beginner-friendly mobile clients. Let us take a hands-on tour!',
    position: 'center',
    spotlightPadding: 0,
  },
  {
    id: 'damus-login',
    target: '.damus-login-screen, [data-tour="damus-login"]',
    title: 'Your Keys Are Your Identity',
    content: 'On Nostr, your private key (nsec) is your password. Never share it! Damus can generate one for you, or you can import an existing key. No email or phone number needed.',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 16,
  },
  {
    id: 'damus-home',
    target: '.damus-home-screen, [data-tour="damus-home"]',
    title: 'Your Home Feed',
    content: 'This is your timeline showing posts from people you follow. The feed updates in real-time from relays. You can see likes, replies, and reposts count on each note.',
    position: 'top',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'damus-compose',
    target: '[data-tour="damus-compose"]',
    title: 'Create a Post',
    content: 'Tap here to compose a new note (post). You can write text, mention users with @, and add hashtags. Posts are limited to 2800 characters and go to all your relays.',
    position: 'left',
    allowClickThrough: true,
    spotlightPadding: 12,
  },
  {
    id: 'damus-post',
    target: '[data-tour="damus-post"]',
    title: 'Publish Your Note',
    content: 'Write something interesting and hit post! Your note will be signed with your private key and broadcast to all connected relays. Once posted, it is permanent on the network.',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 12,
  },
  {
    id: 'damus-profile',
    target: '.damus-profile-header, [data-tour="damus-profile"]',
    title: 'Your Profile',
    content: 'View and edit your profile here. Add a display name, bio, profile picture, and banner. You can also see your NIP-05 identifier (like an email for Nostr) if you have one.',
    position: 'bottom',
    allowClickThrough: true,
    spotlightPadding: 16,
  },
  {
    id: 'damus-follow',
    target: '.damus-follow-btn, [data-tour="damus-follow"]',
    title: 'Following Users',
    content: 'Find interesting people by browsing your network. When you follow someone, their posts appear in your feed. Your follows are stored in your account and synced across all Nostr clients.',
    position: 'left',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'damus-interactions',
    target: '.damus-note-actions, [data-tour="damus-interactions"]',
    title: 'Interact with Posts',
    content: 'Engage with posts using: Reply (respond publicly), Repost (share with your followers), Like (show appreciation), or Zap (send Bitcoin sats as a tip). Zaps are a unique Nostr feature!',
    position: 'top',
    allowClickThrough: true,
    spotlightPadding: 8,
  },
  {
    id: 'damus-settings',
    target: '.damus-settings-screen, [data-tour="damus-settings"]',
    title: 'Settings & Security',
    content: 'Manage your account, backup your keys, adjust notification preferences, and configure the app. Remember to backup your private key securely - if you lose it, you lose access to your account!',
    position: 'center',
    allowClickThrough: true,
    spotlightPadding: 0,
  },
  {
    id: 'damus-complete',
    target: '.damus-simulator',
    title: 'You are Ready!',
    content: 'You now know the basics of Damus! Remember: your keys = your account. Keep them safe and never share your private key. Ready to try the real app?',
    position: 'center',
    spotlightPadding: 0,
  },
];

export const damusTourConfig: TourConfig = {
  id: 'damus-tour',
  name: 'Damus Simulator Tour',
  steps: damusTourSteps,
  storageKey: 'nostr-tour-damus',
};

export default damusTourConfig;
