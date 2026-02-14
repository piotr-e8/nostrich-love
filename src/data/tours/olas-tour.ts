/**
 * Olas Simulator Tour
 * Interactive, event-driven guided tour for Olas photo-first client
 */

import type { TourConfig, TourStep } from '../../components/tour';

const olasTourSteps: TourStep[] = [
  {
    id: 'olas-welcome',
    target: '.olas-simulator',
    title: 'Welcome to Olas',
    content: 'Olas is a photo-first Nostr client for sharing and discovering visual content. Own your photos, build your gallery, and connect through images. Let\'s explore this Instagram-style Nostr experience!',
    position: 'center',
    spotlightPadding: 0,
  },
  {
    id: 'olas-login',
    target: '.olas-login, [data-tour="olas-keys"]',
    title: 'Your Nostr Identity',
    content: 'On Olas, you control your identity with cryptographic keys. Log in with a test account to start building your photo gallery on the decentralized Nostr network.',
    position: 'bottom',
    trigger: 'action',
    actionType: 'login',
    allowClickThrough: true,
    action: 'Login to start your Olas journey',
    spotlightPadding: 16,
  },
  {
    id: 'olas-stories',
    target: '.olas-stories, [data-tour="olas-stories"]',
    title: 'Stories from Friends',
    content: 'Stories let you share moments that disappear after 24 hours. Tap a story to view, swipe to skip. The gradient ring shows unviewed stories - tap to catch up!',
    position: 'bottom',
    trigger: 'action',
    actionType: 'view_stories',
    allowClickThrough: true,
    action: 'Tap a story to view it',
    spotlightPadding: 8,
  },
  {
    id: 'olas-feed',
    target: '.olas-feed, [data-tour="olas-feed"]',
    title: 'Your Photo Feed',
    content: 'Browse photos and videos from people you follow. Double-tap to like, tap to view full screen. Pull down to refresh and see the latest visual content from across Nostr.',
    position: 'top',
    trigger: 'action',
    actionType: 'navigate_home',
    allowClickThrough: true,
    action: 'Scroll through your photo feed',
    spotlightPadding: 8,
  },
  {
    id: 'olas-upload',
    target: '.olas-upload-btn, [data-tour="olas-upload"], .upload-fab',
    title: 'Share Your Moments',
    content: 'The + button opens the upload flow. Share photos and short videos directly to Nostr. Your media is stored on Blossom servers and linked to your Nostr identity forever.',
    position: 'left',
    trigger: 'action',
    actionType: 'compose',
    allowClickThrough: true,
    action: 'Tap the + button to upload a photo',
    spotlightPadding: 12,
  },
  {
    id: 'olas-discover',
    target: '.olas-discover, [data-tour="olas-discover"]',
    title: 'Discover Visual Content',
    content: 'Explore trending photos and find new creators to follow. The Discover tab shows popular content from across the Nostr network - a great way to find photography inspiration!',
    position: 'top',
    trigger: 'action',
    actionType: 'navigate_discover',
    allowClickThrough: true,
    action: 'Tap Discover to explore trending photos',
    spotlightPadding: 8,
  },
  {
    id: 'olas-profile',
    target: '.olas-profile, [data-tour="olas-profile"]',
    title: 'Your Photo Gallery',
    content: 'Your profile displays all your shared photos in a beautiful grid. View your stats, edit your bio, and showcase your visual story. This is your permanent gallery on Nostr!',
    position: 'bottom',
    trigger: 'action',
    actionType: 'view_profile',
    allowClickThrough: true,
    action: 'View your photo gallery profile',
    spotlightPadding: 16,
  },
  {
    id: 'olas-notifications',
    target: '.olas-notifications, [data-tour="olas-notifications"]',
    title: 'Activity & Engagement',
    content: 'See who liked your photos, new followers, and comments. Notifications keep you connected with your audience across the decentralized Nostr network.',
    position: 'bottom',
    trigger: 'action',
    actionType: 'view_notifications',
    allowClickThrough: true,
    action: 'Check your notifications',
    spotlightPadding: 8,
  },
  {
    id: 'olas-nostr',
    target: '.olas-simulator',
    title: 'Powered by Nostr',
    content: 'Olas leverages Nostr\'s open protocol: your photos aren\'t locked to any platform. Use zaps to tip photographers with Bitcoin, and your gallery persists across all Nostr apps. Welcome to the photo revolution!',
    position: 'center',
    spotlightPadding: 0,
  },
];

export const olasTourConfig: TourConfig = {
  id: 'olas-tour',
  name: 'Olas Simulator Tour',
  steps: olasTourSteps,
  storageKey: 'nostr-tour-olas',
};

export default olasTourConfig;
