/**
 * Site Configuration
 * Centralized config for SEO, analytics, and site-wide settings
 */

export const siteConfig = {
  name: "Nostrich.love",
  shortName: "Nostrich",
  description:
    "A comprehensive beginner-friendly guide to Nostr - the decentralized social protocol. Learn how to get started, generate keys, choose clients, and join the censorship-resistant social web at Nostrich.love",
  url: "https://nostrich.love",
  ogImage: "/preview_image.png",

  // SEO Defaults
  seo: {
    defaultTitle: "Nostrich.love - Learn the Decentralized Social Protocol",
    titleTemplate: "%s | Nostrich.love",
    defaultDescription:
      "A comprehensive beginner guide to Nostr - the decentralized social network protocol. Learn how to get started, generate keys, choose clients, and join the censorship-resistant social web at Nostrich.love",
    defaultImage: "/preview_image.png",
    // Intrinsic size of defaultImage, emitted as og:image:width/height so a
    // scraper can lay the card out before the bytes arrive. Update both if the
    // file is replaced. Was 2880x1368 / 1.13 MB; resampled to 1200 wide, which
    // is the width every major consumer targets.
    defaultImageWidth: 1200,
    defaultImageHeight: 570,
    language: "en",
  },

  // Analytics - Cloudflare Web Analytics (privacy-friendly, no cookies)
  // To enable: Set enabled to true and add your Cloudflare token
  analytics: {
    cloudflareToken: "3cc27bbcb8844ca0999a2cd0afa50935", // Cloudflare Web Analytics token
    enabled: true, // Privacy-friendly analytics enabled
  },

  // Social Links
  social: {
    github: "https://github.com/nostr-protocol/nostr",
    nostr: "https://nostr.com",
    // This project's own accounts — the `sameAs` set that identifies the
    // Nostrich.love entity. `github` above points at the protocol, not at us.
    // The npub is nip19.npubEncode of the pubkey in public/.well-known/nostr.json.
    repo: "https://github.com/ptrio42/nostrich-love",
    npub: "npub1p6t6gjhy3q4rfmcxuff7hu3xh5u09cvzem98d48arfzsrzd9kxws3cpeyl",
  },

  // Navigation
  navigation: {
    main: [
      { label: "Getting Started", href: "/guides/getting-started" },
      { label: "Key Generator", href: "/tools/key-generator" },
      { label: "FAQ", href: "/faq" },
      { label: "Resources", href: "/resources" },
    ],
  },

  // Author info for humans.txt
  author: {
    name: "Piotr Czarnoleski (ptrio42)",
    email: "hello@nostrich.love",
    website: "https://nostrich.love",
    location: "Poland",
  },

  // Credits
  credits: {
    design: "Piotr Czarnoleski (ptrio42)",
    development: "Piotr Czarnoleski (ptrio42) and contributors",
    lastUpdate: new Date().toISOString().split("T")[0],
  },
} as const;

export type SiteConfig = typeof siteConfig;
