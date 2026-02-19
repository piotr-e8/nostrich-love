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
    language: "en",
  },

  // Analytics - Cloudflare Web Analytics (privacy-friendly, no cookies)
  // To enable: Set enabled to true and add your Cloudflare token
  analytics: {
    cloudflareToken: "", // Add your Cloudflare Web Analytics token here
    enabled: false, // Set to true when you have a token
  },

  // Social Links
  social: {
    github: "https://github.com/nostr-protocol/nostr",
    nostr: "https://nostr.com",
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
    name: "Nostr Community",
    email: "hello@nostrich.love",
    website: "https://nostrich.love",
    location: "Global",
  },

  // Credits
  credits: {
    design: "Nostr Community",
    development: "Open Source Contributors",
    lastUpdate: new Date().toISOString().split("T")[0],
  },
} as const;

export type SiteConfig = typeof siteConfig;
