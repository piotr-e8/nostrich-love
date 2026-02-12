/**
 * Mock Data Generation Utilities
 * Helper functions for creating realistic Nostr mock data
 */

import type { MockUser, MockNote, MockRelay, ContentCategory, NostrEvent } from './types';
import { EventKind } from './types';

// Generate random hex string
export function generateHex(length: number = 64): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Generate npub from hex pubkey (simplified)
export function generateNpub(): string {
  return `npub1${generateHex(32)}`;
}

// Generate random timestamp within range
export function generateTimestamp(daysBack: number = 30): number {
  const now = Math.floor(Date.now() / 1000);
  const secondsBack = daysBack * 24 * 60 * 60;
  const randomOffset = Math.floor(Math.random() * secondsBack);
  return now - randomOffset;
}

// Generate realistic timestamps with clustering (more posts during certain hours)
export function generateRealisticTimestamp(daysBack: number = 30): number {
  const now = Math.floor(Date.now() / 1000);
  const secondsBack = daysBack * 24 * 60 * 60;
  const baseTime = now - Math.floor(Math.random() * secondsBack);
  
  // Cluster more posts during "active hours" (8am - 11pm)
  const date = new Date(baseTime * 1000);
  const hour = date.getHours();
  
  // 70% chance to be during active hours
  if (Math.random() < 0.7) {
    if (hour < 8 || hour > 23) {
      // Move to active hours
      date.setHours(8 + Math.floor(Math.random() * 15));
    }
  }
  
  return Math.floor(date.getTime() / 1000);
}

// Generate a mock signature (64 bytes hex)
export function generateSig(): string {
  return generateHex(128);
}

// Extract hashtags from content
export function extractHashtags(content: string): string[] {
  const hashtags: string[] = [];
  const regex = /#(\w+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    hashtags.push(match[1].toLowerCase());
  }
  return hashtags;
}

// Extract mentions (@npub...)
export function extractMentions(content: string): string[] {
  const mentions: string[] = [];
  const regex = /@(npub1[a-z0-9]+)/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
}

// Extract URLs
export function extractUrls(content: string): string[] {
  const urls: string[] = [];
  const regex = /(https?:\/\/[^\s]+)/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

// Generate random follower count with realistic distribution
export function generateFollowerCount(): number {
  const rand = Math.random();
  if (rand < 0.4) return Math.floor(Math.random() * 100); // 40% have < 100
  if (rand < 0.7) return Math.floor(Math.random() * 500) + 100; // 30% have 100-600
  if (rand < 0.9) return Math.floor(Math.random() * 2000) + 500; // 20% have 500-2500
  if (rand < 0.97) return Math.floor(Math.random() * 10000) + 2500; // 7% have 2500-12500
  return Math.floor(Math.random() * 50000) + 12500; // 3% have 12500+
}

// Generate engagement counts based on follower count and content quality
export function generateEngagement(followerCount: number, isHighQuality: boolean = false): {
  likes: number;
  reposts: number;
  replies: number;
  zaps: number;
  zapAmount: number;
} {
  const baseMultiplier = isHighQuality ? 0.15 : 0.05;
  const variance = () => 0.5 + Math.random(); // 0.5x to 1.5x variance
  
  const likes = Math.floor(followerCount * baseMultiplier * variance() * Math.random());
  const reposts = Math.floor(likes * 0.15 * variance());
  const replies = Math.floor(likes * 0.08 * variance());
  const zaps = Math.floor(likes * 0.02 * variance());
  const zapAmount = zaps > 0 ? Math.floor(zaps * (100 + Math.random() * 4900)) : 0; // 100-5000 sats avg
  
  return { likes, reposts, replies, zaps, zapAmount };
}

// Create Nostr event tags
export function createTags(
  mentions: string[] = [],
  hashtags: string[] = [],
  replyTo?: string,
  rootEvent?: string
): string[][] {
  const tags: string[][] = [];
  
  // Add reply tags if applicable
  if (rootEvent) {
    tags.push(['e', rootEvent, '', 'root']);
  }
  if (replyTo && replyTo !== rootEvent) {
    tags.push(['e', replyTo, '', 'reply']);
  }
  
  // Add mention tags
  mentions.forEach(pubkey => {
    tags.push(['p', pubkey]);
  });
  
  // Add hashtag tags (t tags for NIP-12)
  hashtags.forEach(tag => {
    tags.push(['t', tag.toLowerCase()]);
  });
  
  return tags;
}

// Avatar gradient generator
export function generateAvatarGradient(seed: string): string {
  const gradients = [
    'from-pink-500 via-red-500 to-yellow-500',
    'from-green-400 via-blue-500 to-purple-600',
    'from-orange-400 via-pink-500 to-purple-600',
    'from-blue-400 via-indigo-500 to-purple-600',
    'from-yellow-400 via-orange-500 to-red-600',
    'from-teal-400 via-cyan-500 to-blue-600',
    'from-purple-400 via-pink-500 to-red-500',
    'from-indigo-400 via-purple-500 to-pink-500',
    'from-red-400 via-pink-500 to-rose-500',
    'from-emerald-400 via-teal-500 to-cyan-600',
    'from-amber-400 via-orange-500 to-yellow-600',
    'from-violet-400 via-purple-500 to-fuchsia-600',
    'from-cyan-400 via-blue-500 to-indigo-600',
    'from-rose-400 via-pink-500 to-purple-600',
    'from-lime-400 via-green-500 to-emerald-600',
    'from-sky-400 via-blue-500 to-indigo-600',
  ];
  
  // Use seed to deterministically pick gradient
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return gradients[Math.abs(hash) % gradients.length];
}

// Sample image URLs for posts
export function getSampleImages(count: number = 1): string[] {
  const images = [
    'https://image.nostr.build/abc123.jpg',
    'https://void.cat/d/abc456.webp',
    'https://nostr.build/i/xyz789.png',
    'https://pbs.twimg.com/media/sample1.jpg',
    'https://i.imgur.com/sample2.jpg',
    'https://cdn.nostr.com/image3.webp',
    'https://image.hosting.com/photo4.jpg',
    'https://media.nostr.net/pic5.png',
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
  ];
  
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    selected.push(images[Math.floor(Math.random() * images.length)]);
  }
  return selected;
}

// Validate mock event structure
export function validateEvent(event: Partial<NostrEvent>): boolean {
  if (!event.id || event.id.length !== 64) return false;
  if (!event.pubkey || event.pubkey.length < 20) return false;
  if (!event.created_at || event.created_at < 1609459200) return false; // After 2021
  if (typeof event.kind !== 'number') return false;
  if (!Array.isArray(event.tags)) return false;
  if (typeof event.content !== 'string') return false;
  if (!event.sig || event.sig.length !== 128) return false;
  return true;
}

// Export all utilities
export const MockUtils = {
  generateHex,
  generateNpub,
  generateTimestamp,
  generateRealisticTimestamp,
  generateSig,
  extractHashtags,
  extractMentions,
  extractUrls,
  generateFollowerCount,
  generateEngagement,
  createTags,
  generateAvatarGradient,
  getSampleImages,
  validateEvent,
};

export default MockUtils;
