import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Zap,
  Search,
  Activity,
  Clock,
  Signal,
  CheckCircle2,
  XCircle,
  Loader2,
  Server,
  Wifi,
  WifiOff,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Code,
  ExternalLink,
  Shield,
  AlertCircle,
  Eye,
  Filter,
  FileJson,
  MessageSquare,
  Calendar,
  Hash,
  Trash2,
  Terminal,
} from "lucide-react";
import { cn, copyToClipboard } from "../../lib/utils";

// Relay interface
interface Relay {
  id: string;
  url: string;
  name: string;
  description: string;
  location: string;
  region: string;
  status: "online" | "offline" | "checking";
  latency?: number;
  lastChecked?: Date;
  nip11Info?: NIP11Info;
  connectionState?: "idle" | "connecting" | "connected" | "error";
  connectionError?: string;
  supportedNIPs: number[];
}

interface NIP11Info {
  name?: string;
  description?: string;
  pubkey?: string;
  contact?: string;
  supported_nips?: number[];
  software?: string;
  version?: string;
  limitation?: {
    max_message_length?: number;
    max_subscriptions?: number;
    max_filters?: number;
    max_limit?: number;
    max_subid_length?: number;
    min_prefix?: number;
    max_event_tags?: number;
    max_content_length?: number;
    min_pow_difficulty?: number;
    auth_required?: boolean;
    payment_required?: boolean;
  };
  retention?: Array<{
    kinds?: number[];
    time?: number;
    count?: number;
  }>;
}

interface HealthCheck {
  relayId: string;
  timestamp: Date;
  latency: number;
  success: boolean;
}

// Nostr Event interface
interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

interface StreamEvent {
  event: NostrEvent;
  relayName: string;
  relayUrl: string;
  receivedAt: Date;
}

type Tab = "connection" | "health" | "nips" | "events" | "query";

// Curated relay list (40 reliable relays)
const CURATED_RELAYS: Omit<Relay, "status" | "supportedNIPs">[] = [
  { id: "damus", url: "wss://relay.damus.io", name: "Damus", description: "Most popular Nostr relay", location: "USA", region: "na" },
  { id: "nos-lol", url: "wss://nos.lol", name: "nos.lol", description: "Fast general-purpose relay", location: "Germany", region: "eu" },
  { id: "purple-pages", url: "wss://purplepag.es", name: "Purple Pages", description: "Metadata relay for profiles", location: "USA", region: "na" },
  { id: "snort", url: "wss://relay.snort.social", name: "Snort", description: "Snort client relay", location: "USA", region: "na" },
  { id: "primal", url: "wss://relay.primal.net", name: "Primal", description: "Primal client relay", location: "USA", region: "na" },
  { id: "current", url: "wss://relay.current.fyi", name: "Current", description: "Paid relay with support", location: "USA", region: "na" },
  { id: "eden", url: "wss://relay.eden.nostr.land", name: "Eden", description: "High-performance paid relay", location: "USA", region: "na" },
  { id: "bitcoiner-social", url: "wss://relay.bitcoiner.social", name: "Bitcoiner.social", description: "Bitcoin-focused relay", location: "USA", region: "na" },
  { id: "nostr-pub", url: "wss://relay.nostr.bg", name: "Nostr.bg", description: "Bulgarian relay", location: "Bulgaria", region: "eu" },
  { id: "yabu", url: "wss://relay.yabu.me", name: "Yabu", description: "Japanese relay", location: "Japan", region: "asia" },
  { id: "welshman", url: "wss://relay.welshman.com", name: "Welshman", description: "Community relay with moderation", location: "UK", region: "eu" },
  { id: "nostr-wine", url: "wss://nostr.wine", name: "Nostr Wine", description: "Paid relay", location: "USA", region: "na" },
  { id: "stacker-news", url: "wss://relay.stacker.news", name: "Stacker News", description: "Stacker News community", location: "USA", region: "na" },
  { id: "nostr-plebs", url: "wss://nostr.plebs.network", name: "Plebs Network", description: "Community relay", location: "USA", region: "na" },
  { id: "wolf-fiatjaf", url: "wss://relay.f7z.io", name: "F7Z", description: "fiatjaf's relay", location: "Brazil", region: "other" },
  { id: "hivetech", url: "wss://relay.hivetech.ovh", name: "Hivetech", description: "General purpose", location: "France", region: "eu" },
  { id: "damus-knots", url: "wss://knots.nostr.technology", name: "Knots", description: "Experimental relay", location: "USA", region: "na" },
  { id: "relay-vera", url: "wss://relay.vera.live", name: "Vera", description: "Live streaming", location: "USA", region: "na" },
  { id: "relay-nostrdice", url: "wss://relay.nostrdice.com", name: "NostrDice", description: "Gaming relay", location: "USA", region: "na" },
  { id: "relay-sdamus", url: "wss://relay.sdamus.io", name: "sDamus", description: "Spam-resistant relay", location: "USA", region: "na" },
];

const NIP_DESCRIPTIONS: Record<number, string> = {
  1: "Basic protocol flow",
  2: "Follow list",
  3: "OpenTimestamps",
  4: "Encrypted direct messages",
  5: "Mapping Nostr keys to DNS-based internet identifiers",
  6: "Delegated event signing",
  7: "Event deletion",
  9: "Event coordinates",
  10: "Conventions for clients",
  11: "Relay information",
  13: "Delegated event signing",
  15: "Nostr marketplace",
  17: "Private direct messages",
  18: "Reposts",
  19: "bech32-encoded entities",
  20: "Command results",
  21: "nostr: URI scheme",
  23: "Long-form content",
  24: "Extra metadata fields",
  25: "Reactions",
  26: "Delegated event signing",
  27: "Text note references",
  28: "Public chat",
  29: "Relay-based groups",
  30: "Custom emoji",
  31: "Dealing with unknown events",
  32: "Labeling",
  33: "Parameterized replaceable events",
  36: "Sensitive content",
  38: "User statuses",
  39: "External identities",
  40: "Expiration timestamp",
  42: "Authentication",
  44: "Encrypted payloads",
  45: "Counting results",
  46: "Nostr connect",
  47: "Nostr wallet connect",
  48: "Nostr wallet auth",
  50: "Search",
  51: "Lists",
  52: "Calendar events",
  53: "Live activities",
  54: "Zaps",
  55: "Zap goal",
  56: "Reporting",
  57: "Public key recovery",
  58: "Badges",
  59: "Long-form articles",
  60: "Coinjoin coordination",
  61: "Coinjoin peering",
  62: "Coinjoin signing",
  64: "Chess",
  65: "Relay lists",
  72: "Metadata",
  73: "External content IDs",
  75: "Zap request",
  84: "Highlights",
  89: "Recommended apps",
  90: "Data vending machines",
  92: "Media attachments",
  94: "File metadata",
  96: "HTTP File Storage Integration",
  98: "HTTP Auth",
  99: "Classifieds",
};

export function RelayPlayground({ className }: { className?: string }) {
  const [relays, setRelays] = useState<Relay[]>(
    CURATED_RELAYS.map(r => ({ ...r, status: "checking", supportedNIPs: [] }))
  );
  const [activeTab, setActiveTab] = useState<Tab>("connection");
  const [selectedRelay, setSelectedRelay] = useState<Relay | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [healthHistory, setHealthHistory] = useState<HealthCheck[]>([]);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const healthHistoryRef = useRef<HealthCheck[]>([]);
  const relaysRef = useRef<Relay[]>([]);
  const isMountedRef = useRef(true);
  const checkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check single relay latency
  const checkRelayLatency = useCallback(async (relay: Relay): Promise<{ latency: number; success: boolean }> => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      let resolved = false;
      let ws: WebSocket | null = null;
      
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          if (ws) {
            ws.close();
          }
          resolve({ latency: 0, success: false });
        }
      }, 5000);

      try {
        ws = new WebSocket(relay.url);

        ws.onopen = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            const latency = Math.round(performance.now() - startTime);
            ws?.close();
            resolve({ latency, success: true });
          }
        };

        ws.onerror = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            ws?.close();
            resolve({ latency: 0, success: false });
          }
        };

        ws.onclose = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve({ latency: 0, success: false });
          }
        };
      } catch {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          if (ws) {
            ws.close();
          }
          resolve({ latency: 0, success: false });
        }
      }
    });
  }, []);

  // Fetch NIP-11 info
  const fetchNIP11Info = useCallback(async (relay: Relay): Promise<NIP11Info | null> => {
    try {
      const httpUrl = relay.url.replace("wss://", "https://").replace("ws://", "http://");
      const response = await fetch(httpUrl, {
        headers: { Accept: "application/nostr+json" },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  }, []);

  // Check all relays - uses refs to avoid stale closure issues
  const checkAllRelays = useCallback(async () => {
    if (isCheckingAll) return;
    
    setIsCheckingAll(true);
    const currentRelays = relaysRef.current.length > 0 ? relaysRef.current : relays;
    const newHealthChecks: HealthCheck[] = [];
    
    const updatedRelays = await Promise.all(
      currentRelays.map(async (relay) => {
        const { latency, success } = await checkRelayLatency(relay);
        const nip11Info = await fetchNIP11Info(relay);
        
        const newCheck: HealthCheck = {
          relayId: relay.id,
          timestamp: new Date(),
          latency,
          success,
        };
        
        newHealthChecks.push(newCheck);

        return {
          ...relay,
          status: (success ? "online" : "offline") as "online" | "offline" | "checking",
          latency,
          lastChecked: new Date(),
          nip11Info: nip11Info || undefined,
          supportedNIPs: nip11Info?.supported_nips || [],
        };
      })
    );

    if (isMountedRef.current) {
      setRelays(updatedRelays);
      relaysRef.current = updatedRelays;
      setHealthHistory(prev => [...prev.slice(-200), ...newHealthChecks]);
      healthHistoryRef.current = [...healthHistoryRef.current.slice(-200), ...newHealthChecks];
    }
    
    if (checkingTimeoutRef.current) {
      clearTimeout(checkingTimeoutRef.current);
    }
    checkingTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsCheckingAll(false);
      }
    }, 0);
  }, [isCheckingAll, relays, checkRelayLatency, fetchNIP11Info]);

  // Update refs when state changes
  useEffect(() => {
    relaysRef.current = relays;
  }, [relays]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (checkingTimeoutRef.current) {
        clearTimeout(checkingTimeoutRef.current);
      }
    };
  }, []);

  // Initial check on mount - only run once
  useEffect(() => {
    if (!isMountedRef.current) return;
    
    // Delay initial check to avoid React 18 strict mode double-mount issues
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        checkAllRelays();
      }
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Connect to relay (for Connection Lab)
  const connectToRelay = useCallback((relay: Relay) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setRelays(prev => prev.map(r => 
      r.id === relay.id ? { ...r, connectionState: "connecting" } : r
    ));

    try {
      const ws = new WebSocket(relay.url);
      wsRef.current = ws;

      ws.onopen = () => {
        setRelays(prev => prev.map(r => 
          r.id === relay.id ? { ...r, connectionState: "connected" } : r
        ));
      };

      ws.onerror = (error) => {
        setRelays(prev => prev.map(r => 
          r.id === relay.id ? { ...r, connectionState: "error", connectionError: "Connection failed" } : r
        ));
      };

      ws.onclose = () => {
        setRelays(prev => prev.map(r => 
          r.id === relay.id ? { ...r, connectionState: "idle" } : r
        ));
      };
    } catch (error) {
      setRelays(prev => prev.map(r => 
        r.id === relay.id ? { ...r, connectionState: "error", connectionError: "Invalid URL" } : r
      ));
    }
  }, []);

  // Disconnect from relay
  const disconnectFromRelay = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setRelays(prev => prev.map(r => ({ ...r, connectionState: "idle" })));
  }, []);

  // Filter relays - only show online relays
  const filteredRelays = relays.filter(relay =>
    relay.status === "online" && (
      relay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relay.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relay.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate stats - only for online relays
  const onlineRelays = relays.filter(r => r.status === "online");
  const onlineCount = onlineRelays.length;
  const offlineCount = relays.filter(r => r.status === "offline").length;
  const avgLatency = Math.round(
    onlineRelays
      .filter(r => r.latency && r.latency > 0)
      .reduce((acc, r) => acc + (r.latency || 0), 0) / 
    Math.max(onlineRelays.filter(r => r.latency && r.latency > 0).length, 1)
  );

  // Get unique NIPs across online relays only
  const allSupportedNIPs = Array.from(
    new Set(onlineRelays.flatMap(r => r.supportedNIPs))
  ).sort((a, b) => a - b);

  return (
    <div className={cn("max-w-7xl mx-auto p-4 md:p-6", className)}>
      <div className="bg-surface border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4"
          >
            <Globe className="w-8 h-8 text-primary-500" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Relay Playground
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore, test, and learn about Nostr relays. Only online relays are shown. No keys required - just open WebSocket connections and see what happens.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-success-500">{onlineCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Online Relays</div>
          </div>
          <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-error-500">{offlineCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Currently Offline</div>
          </div>
          <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{relays.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Monitored</div>
          </div>
          <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-primary-500">{avgLatency}ms</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Latency</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
          {[
            { id: "connection" as Tab, label: "Connection Lab", icon: Wifi },
            { id: "health" as Tab, label: "Health Dashboard", icon: Activity },
            { id: "nips" as Tab, label: "NIP Support", icon: Shield },
            { id: "events" as Tab, label: "Event Stream", icon: Eye },
            { id: "query" as Tab, label: "Query Tester", icon: Filter },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <button
            onClick={checkAllRelays}
            disabled={isCheckingAll}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg font-medium transition-all"
          >
            <RefreshCw className={cn("w-4 h-4", isCheckingAll && "animate-spin")} />
            {isCheckingAll ? "Checking..." : "Refresh All"}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search relays by name, URL, or location..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "connection" && (
            <ConnectionLab
              key="connection"
              relays={filteredRelays}
              selectedRelay={selectedRelay}
              onSelectRelay={setSelectedRelay}
              onConnect={connectToRelay}
              onDisconnect={disconnectFromRelay}
            />
          )}
          {activeTab === "health" && (
            <HealthDashboard
              key="health"
              relays={filteredRelays}
              healthHistory={healthHistory}
            />
          )}
          {activeTab === "nips" && (
            <NIPDetector
              key="nips"
              relays={filteredRelays}
              allSupportedNIPs={allSupportedNIPs}
            />
          )}
          {activeTab === "events" && (
            <EventStreamViewer
              key="events"
              relays={filteredRelays}
            />
          )}
          {activeTab === "query" && (
            <QueryTester
              key="query"
              relays={filteredRelays}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Connection Lab Component
function ConnectionLab({
  relays,
  selectedRelay,
  onSelectRelay,
  onConnect,
  onDisconnect,
}: {
  relays: Relay[];
  selectedRelay: Relay | null;
  onSelectRelay: (relay: Relay) => void;
  onConnect: (relay: Relay) => void;
  onDisconnect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Educational Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          <strong className="text-blue-400">How it works:</strong> Click any relay to open a live WebSocket connection. 
          You will see the connection process in real-time without needing any keys. This is exactly how Nostr clients connect to relays behind the scenes.
        </div>
      </div>

      {/* Relay Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relays.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-600 dark:text-gray-400">
            <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No online relays found. Click &quot;Refresh All&quot; to check relay status.</p>
          </div>
        ) : (
          relays.map((relay) => (
            <motion.div
              key={relay.id}
              layout
              onClick={() => onSelectRelay(relay)}
              className={cn(
                "relative p-4 border rounded-xl cursor-pointer transition-all",
                selectedRelay?.id === relay.id
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 bg-gray-100/30 dark:bg-gray-800/30"
              )}
            >
              {/* Connection Status Indicator */}
              <div className="absolute top-3 right-3">
                {relay.connectionState === "connected" && (
                  <div className="flex items-center gap-1 text-success-500 text-xs">
                    <Wifi className="w-3 h-3" />
                    Connected
                  </div>
                )}
                {relay.connectionState === "connecting" && (
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Connecting...
                  </div>
                )}
                {relay.connectionState === "error" && (
                  <div className="flex items-center gap-1 text-error-500 text-xs">
                    <WifiOff className="w-3 h-3" />
                    Error
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white truncate">{relay.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{relay.url}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{relay.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {relay.location}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full",
                  relay.status === "online" ? "bg-green-500/20 text-green-400" :
                  relay.status === "offline" ? "bg-red-500/20 text-red-400" :
                  "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                )}>
                  {relay.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Selected Relay Details */}
      <AnimatePresence>
        {selectedRelay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-100/50 dark:bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedRelay.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedRelay.url}</p>
              </div>
              <button
                onClick={() => onSelectRelay(null as any)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Connection Controls */}
            <div className="flex gap-3 mb-6">
              {selectedRelay.connectionState === "idle" || selectedRelay.connectionState === "error" ? (
                <button
                  onClick={() => onConnect(selectedRelay)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                >
                  <Play className="w-5 h-5" />
                  Connect
                </button>
              ) : (
                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
                >
                  <Pause className="w-5 h-5" />
                  Disconnect
                </button>
              )}
              <button
                onClick={() => copyToClipboard(selectedRelay.url)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
              >
                <Copy className="w-5 h-5" />
                Copy URL
              </button>
            </div>

            {/* Connection State Display */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 font-mono text-sm">
              <div className="text-gray-500 mb-2">// Connection Status</div>
              <div className="text-green-400">
                {selectedRelay.connectionState === "idle" && "awaiting connection..."}
                {selectedRelay.connectionState === "connecting" && "const ws = new WebSocket('" + selectedRelay.url + "');\nws.onopen = () => console.log('Connected!');"}
                {selectedRelay.connectionState === "connected" && "WebSocket connection established\nReady to send/receive events\nNo authentication required"}
                {selectedRelay.connectionState === "error" && "Connection failed: " + (selectedRelay.connectionError || "Unknown error")}
              </div>
            </div>

            {/* Educational Info */}
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                What just happened?
              </h4>
              <p className="text-sm text-gray-300">
                When you clicked &quot;Connect&quot;, your browser opened a WebSocket connection to {selectedRelay.name}. 
                This is the same technology Nostr clients use to communicate with relays. The connection is persistent 
                (stays open) and bidirectional (both sides can send messages).
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Health Dashboard Component
function HealthDashboard({
  relays,
}: {
  relays: Relay[];
  healthHistory: HealthCheck[];
}) {
  const [sortBy, setSortBy] = useState<"latency" | "location">("latency");

  const sortedRelays = [...relays].sort((a, b) => {
    if (sortBy === "latency") {
      if (!a.latency) return 1;
      if (!b.latency) return -1;
      return a.latency - b.latency;
    }
    return a.location.localeCompare(b.location);
  });

  const getLatencyColor = (latency?: number) => {
    if (!latency) return "text-gray-500";
    if (latency < 100) return "text-green-400";
    if (latency < 300) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Sort Controls */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600 dark:text-gray-400 text-sm">Sort by:</span>
        <div className="flex gap-2">
          {[
            { key: "latency" as const, label: "Latency" },
            { key: "location" as const, label: "Location" },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                sortBy === option.key
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Health Table */}
      <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-100/50 dark:bg-gray-800/50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Relay</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Location</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Latency</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Last Checked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedRelays.map((relay) => (
              <tr key={relay.id} className="hover:bg-gray-100/30 dark:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Server className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{relay.name}</div>
                      <div className="text-xs text-gray-500">{relay.url}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Globe className="w-3 h-3" />
                    {relay.location}
                  </span>
                </td>
                <td className={cn("px-4 py-3 font-mono", getLatencyColor(relay.latency))}>
                  {relay.latency ? `${relay.latency}ms` : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                  {relay.lastChecked ? 
                    new Date(relay.lastChecked).toLocaleTimeString() : 
                    "Never"
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Latency Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
            <CheckCircle2 className="w-5 h-5" />
            Excellent (&lt; 100ms)
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            These relays are very close to you geographically or have excellent infrastructure. 
            You will have the best experience with these.
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-400 font-semibold mb-2">
            <Activity className="w-5 h-5" />
            Good (100-300ms)
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            These relays are usable but may be farther away. You will still have a good experience, 
            but posts might take slightly longer to load.
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
            <AlertCircle className="w-5 h-5" />
            Slow (&gt; 300ms)
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            These relays are either very far away or experiencing issues. Consider using closer 
            relays for better performance.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// NIP Detector Component
function NIPDetector({
  relays,
  allSupportedNIPs,
}: {
  relays: Relay[];
  allSupportedNIPs: number[];
}) {
  const [selectedNIP, setSelectedNIP] = useState<number | null>(null);

  const getNIPSupportCount = (nip: number) => {
    return relays.filter(r => r.supportedNIPs.includes(nip)).length;
  };

  const getSupportPercentage = (nip: number) => {
    return Math.round((getNIPSupportCount(nip) / relays.length) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* What are NIPs? */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          <strong className="text-purple-400">What are NIPs?</strong> NIPs (Nostr Implementation Possibilities) 
          are specifications that extend the core Nostr protocol. Think of them like browser features - not all 
          relays support all features. This tool shows which NIPs each relay supports so you can choose relays 
          that have the features you need.
        </div>
      </div>

      {/* NIP Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {allSupportedNIPs.map((nip) => {
          const supportCount = getNIPSupportCount(nip);
          const percentage = getSupportPercentage(nip);
          
          return (
            <motion.button
              key={nip}
              onClick={() => setSelectedNIP(selectedNIP === nip ? null : nip)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                selectedNIP === nip
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-gray-700 hover:border-purple-500/50 bg-gray-100/30 dark:bg-gray-800/30"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">NIP-{nip}</span>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  percentage >= 70 ? "bg-green-500/20 text-green-400" :
                  percentage >= 30 ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                )}>
                  {percentage}%
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {NIP_DESCRIPTIONS[nip] || "Unknown NIP"}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {supportCount} of {relays.length} relays
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected NIP Details */}
      <AnimatePresence>
        {selectedNIP && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-100/50 dark:bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">NIP-{selectedNIP}</h3>
                <p className="text-purple-400">{NIP_DESCRIPTIONS[selectedNIP]}</p>
              </div>
              <button
                onClick={() => setSelectedNIP(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-white mb-2">Supported by:</h4>
              <div className="flex flex-wrap gap-2">
                {relays
                  .filter(r => r.supportedNIPs.includes(selectedNIP))
                  .map(relay => (
                    <span
                      key={relay.id}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                    >
                      {relay.name}
                    </span>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Not supported by:</h4>
              <div className="flex flex-wrap gap-2">
                {relays
                  .filter(r => !r.supportedNIPs.includes(selectedNIP))
                  .slice(0, 10)
                  .map(relay => (
                    <span
                      key={relay.id}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
                    >
                      {relay.name}
                    </span>
                  ))}
                {relays.filter(r => !r.supportedNIPs.includes(selectedNIP)).length > 10 && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-600 dark:text-gray-400 rounded-full text-sm">
                    +{relays.filter(r => !r.supportedNIPs.includes(selectedNIP)).length - 10} more
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Common NIPs */}
      <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Most Common NIPs</h3>
        <div className="space-y-3">
          {[1, 2, 4, 9, 11, 40, 42].map((nip) => (
            <div key={nip} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-12 font-mono text-gray-600 dark:text-gray-400">NIP-{nip}</span>
                <span className="text-gray-300">{NIP_DESCRIPTIONS[nip]}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${getSupportPercentage(nip)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {getSupportPercentage(nip)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Event Stream Viewer Component
function EventStreamViewer({
  relays,
}: {
  relays: Relay[];
}) {
  const [selectedRelay, setSelectedRelay] = useState<Relay | null>(null);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedKinds, setSelectedKinds] = useState<number[]>([1]);
  const [maxEvents, setMaxEvents] = useState(50);
  const wsRef = useRef<WebSocket | null>(null);
  const subscriptionRef = useRef<string | null>(null);

  const EVENT_KINDS = [
    { kind: 0, label: "Metadata", description: "User profiles" },
    { kind: 1, label: "Text Note", description: "Regular posts" },
    { kind: 6, label: "Repost", description: "Shared posts" },
    { kind: 7, label: "Reaction", description: "Likes" },
  ];

  const startStreaming = useCallback(() => {
    if (!selectedRelay) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    setIsStreaming(true);

    try {
      const ws = new WebSocket(selectedRelay.url);
      wsRef.current = ws;
      const subId = `stream-${Date.now()}`;
      subscriptionRef.current = subId;

      ws.onopen = () => {
        ws.send(JSON.stringify(["REQ", subId, { kinds: selectedKinds, limit: maxEvents }]));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data[0] === "EVENT" && data[1] === subId) {
            const nostrEvent: NostrEvent = data[2];
            setEvents(prev => {
              const newEvents = [{
                event: nostrEvent,
                relayName: selectedRelay.name,
                relayUrl: selectedRelay.url,
                receivedAt: new Date(),
              }, ...prev];
              return newEvents.slice(0, maxEvents);
            });
          }
        } catch (e) {
          console.error("Failed to parse event:", e);
        }
      };

      ws.onclose = () => setIsStreaming(false);
      ws.onerror = () => setIsStreaming(false);
    } catch {
      setIsStreaming(false);
    }
  }, [selectedRelay, selectedKinds, maxEvents]);

  const stopStreaming = useCallback(() => {
    if (wsRef.current) {
      if (subscriptionRef.current) {
        wsRef.current.send(JSON.stringify(["CLOSE", subscriptionRef.current]));
      }
      wsRef.current.close();
    }
    wsRef.current = null;
    subscriptionRef.current = null;
    setIsStreaming(false);
  }, []);

  const toggleKind = (kind: number) => {
    setSelectedKinds(prev => 
      prev.includes(kind) ? prev.filter(k => k !== kind) : [...prev, kind]
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        if (subscriptionRef.current) {
          try {
            wsRef.current.send(JSON.stringify(["CLOSE", subscriptionRef.current]));
          } catch (e) {
            // Ignore errors when closing
          }
        }
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Educational Banner */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <strong className="text-green-400">Watch events in real-time!</strong> Select a relay and start 
            streaming to see actual Nostr events flowing through the network. This shows public posts and 
            interactions as they happen.
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-700 space-y-4">
        {/* Relay Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select Relay</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {relays.slice(0, 8).map((relay) => (
              <button
                key={relay.id}
                onClick={() => {
                  if (isStreaming) stopStreaming();
                  setSelectedRelay(relay);
                }}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                  selectedRelay?.id === relay.id
                    ? "bg-primary-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                )}
              >
                <div className="truncate font-medium">{relay.name}</div>
                <div className="text-xs opacity-70">{relay.latency}ms</div>
              </button>
            ))}
          </div>
        </div>

        {/* Event Kinds */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Event Types</label>
          <div className="flex flex-wrap gap-2">
            {EVENT_KINDS.map((kind) => (
              <button
                key={kind.kind}
                onClick={() => !isStreaming && toggleKind(kind.kind)}
                disabled={isStreaming}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedKinds.includes(kind.kind)
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-600 dark:text-gray-400",
                  isStreaming && "opacity-50 cursor-not-allowed"
                )}
              >
                <Hash className="w-4 h-4" />
                {kind.label}
              </button>
            ))}
          </div>
        </div>

        {/* Max Events */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Max Events: {maxEvents}
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={maxEvents}
            onChange={(e) => setMaxEvents(Number(e.target.value))}
            disabled={isStreaming}
            className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isStreaming ? (
            <button
              onClick={startStreaming}
              disabled={!selectedRelay || selectedKinds.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded-xl font-medium"
            >
              <Play className="w-5 h-5" />
              Start Streaming
            </button>
          ) : (
            <button
              onClick={stopStreaming}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium"
            >
              <Pause className="w-5 h-5" />
              Stop
            </button>
          )}
          <button
            onClick={() => setEvents([])}
            className="flex items-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl font-medium"
          >
            <Trash2 className="w-5 h-5" />
            Clear
          </button>
        </div>
      </div>

      {/* Events Display */}
      <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Events Stream ({events.length})
          </h3>
          {isStreaming && (
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live
            </div>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No events yet. Start streaming to see events.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {events.map((evt, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-100/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-xs">
                      Kind {evt.event.kind}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(evt.event.created_at * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{evt.event.content}</p>
                  <p className="text-xs text-gray-500 mt-1">From: {evt.event.pubkey.slice(0, 16)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Query Tester Component
function QueryTester({
  relays,
}: {
  relays: Relay[];
}) {
  const [selectedRelay, setSelectedRelay] = useState<Relay | null>(null);
  const [queryKinds, setQueryKinds] = useState<number[]>([1]);
  const [limit, setLimit] = useState(10);
  const [isQuerying, setIsQuerying] = useState(false);
  const [results, setResults] = useState<NostrEvent[]>([]);
  const [showRaw, setShowRaw] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const EVENT_KINDS = [
    { kind: 0, label: "Metadata" },
    { kind: 1, label: "Text Note" },
    { kind: 3, label: "Contacts" },
    { kind: 6, label: "Repost" },
    { kind: 7, label: "Reaction" },
    { kind: 9735, label: "Zap" },
  ];

  const runQuery = useCallback(() => {
    if (!selectedRelay) return;
    if (wsRef.current) wsRef.current.close();

    setIsQuerying(true);
    setResults([]);

    try {
      const ws = new WebSocket(selectedRelay.url);
      wsRef.current = ws;
      const subId = `query-${Date.now()}`;
      const filter = { kinds: queryKinds, limit };

      const newResults: NostrEvent[] = [];

      ws.onopen = () => {
        ws.send(JSON.stringify(["REQ", subId, filter]));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data[0] === "EVENT" && data[1] === subId) {
            newResults.push(data[2]);
            setResults([...newResults]);
          } else if (data[0] === "EOSE") {
            setIsQuerying(false);
            ws.close();
          }
        } catch (e) {
          console.error("Parse error:", e);
        }
      };

      ws.onclose = () => setIsQuerying(false);
      ws.onerror = () => setIsQuerying(false);

      setTimeout(() => ws.close(), 10000);
    } catch {
      setIsQuerying(false);
    }
  }, [selectedRelay, queryKinds, limit]);

  const toggleKind = (kind: number) => {
    setQueryKinds(prev => 
      prev.includes(kind) ? prev.filter(k => k !== kind) : [...prev, kind]
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Educational Banner */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <strong className="text-purple-400">Test your queries!</strong> Build custom filters to fetch 
            specific events from relays. This demonstrates how Nostr clients request data using filters.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Builder */}
        <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Query Builder</h3>

          {/* Relay */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Target Relay</label>
            <select
              value={selectedRelay?.id || ""}
              onChange={(e) => setSelectedRelay(relays.find(r => r.id === e.target.value) || null)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="">Select relay...</option>
              {relays.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.latency}ms)</option>
              ))}
            </select>
          </div>

          {/* Kinds */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Event Kinds</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_KINDS.map(kind => (
                <button
                  key={kind.kind}
                  onClick={() => toggleKind(kind.kind)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all",
                    queryKinds.includes(kind.kind)
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-600 dark:text-gray-400"
                  )}
                >
                  {kind.label}
                </button>
              ))}
            </div>
          </div>

          {/* Limit */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Limit: {limit}</label>
            <input
              type="range"
              min="1"
              max="50"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Run */}
          <button
            onClick={runQuery}
            disabled={!selectedRelay || queryKinds.length === 0 || isQuerying}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded-xl font-medium"
          >
            {isQuerying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Querying...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Run Query
              </span>
            )}
          </button>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Results: <strong className="text-white">{results.length}</strong></span>
            <button
              onClick={() => setShowRaw(!showRaw)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-all",
                showRaw ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-600 dark:text-gray-400"
              )}
            >
              {showRaw ? "Hide" : "Show"} Raw JSON
            </button>
          </div>

          {/* Raw JSON */}
          {showRaw && results.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 overflow-x-auto">
              <pre className="text-xs text-gray-700 dark:text-gray-300">
                {JSON.stringify(["REQ", "sub", { kinds: queryKinds, limit }], null, 2)}
              </pre>
            </div>
          )}

          {/* Results List */}
          <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-xl border border-gray-700 max-h-[500px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No results yet. Run a query to fetch events.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {results.map((evt, idx) => (
                  <div key={idx} className="p-4 hover:bg-gray-100/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-xs">
                        Kind {evt.kind}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(evt.created_at * 1000).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3">{evt.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{evt.pubkey.slice(0, 20)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
