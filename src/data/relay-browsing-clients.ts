export interface ClientWithRelaySupport {
  id: string;
  name: string;
  url: string;
  platform: 'web' | 'ios' | 'android' | 'desktop';
  features: ('relay-browsing' | 'feed-filtering' | 'multi-relay' | 'ephemeral-feeds')[];
  notes?: string;
}

export const RELAY_BROWSING_CLIENTS: ClientWithRelaySupport[] = [
  {
    id: "jumble",
    name: "Jumble",
    url: "https://jumble.social",
    platform: "web",
    features: ["relay-browsing", "feed-filtering", "multi-relay"],
    notes: "Built specifically for relay exploration"
  },
  {
    id: "gossip",
    name: "Gossip",
    url: "https://github.com/mikedilger/gossip",
    platform: "desktop",
    features: ["relay-browsing", "ephemeral-feeds"],
    notes: "Desktop client with ephemeral relay feeds"
  },
  {
    id: "coracle",
    name: "Coracle",
    url: "https://coracle.social",
    platform: "web",
    features: ["relay-browsing", "feed-filtering", "multi-relay"]
  },
  {
    id: "wisp",
    name: "Wisp",
    url: "https://wisp.sh",
    platform: "web",
    features: ["relay-browsing"],
    notes: "Web client with relay browsing support"
  },
  {
    id: "primal",
    name: "Primal",
    url: "https://primal.net",
    platform: "web",
    features: ["relay-browsing", "feed-filtering"]
  },
  {
    id: "snort",
    name: "Snort",
    url: "https://snort.social",
    platform: "web",
    features: ["relay-browsing", "feed-filtering"]
  }
];

export const getClientsByPlatform = (platform: ClientWithRelaySupport['platform']): ClientWithRelaySupport[] =>
  RELAY_BROWSING_CLIENTS.filter(c => c.platform === platform);

export const getClientsByFeature = (feature: ClientWithRelaySupport['features'][number]): ClientWithRelaySupport[] =>
  RELAY_BROWSING_CLIENTS.filter(c => c.features.includes(feature));

export const PLATFORMS: { id: ClientWithRelaySupport['platform']; label: string }[] = [
  { id: 'web', label: 'Web' },
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'desktop', label: 'Desktop' }
];

export const FEATURES: { id: ClientWithRelaySupport['features'][number]; label: string; description: string }[] = [
  { 
    id: 'relay-browsing', 
    label: 'Relay Browsing', 
    description: 'Can view relay-specific feeds' 
  },
  { 
    id: 'feed-filtering', 
    label: 'Feed Filtering', 
    description: 'Can filter by relay' 
  },
  { 
    id: 'multi-relay', 
    label: 'Multi-Relay', 
    description: 'Can view multiple relays at once' 
  },
  { 
    id: 'ephemeral-feeds', 
    label: 'Ephemeral Feeds', 
    description: 'Temporary relay browsing without saving' 
  }
];
