import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Zap,
  Search,
  Filter,
  Copy,
  Download,
  Check,
  Activity,
  DollarSign,
  Users,
  Wifi,
  WifiOff,
  MapPin,
  Plus,
  X,
  RefreshCw,
  ExternalLink,
  Server,
  Shield,
  Clock,
  Signal,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  cn,
  copyToClipboard,
  downloadFile,
  saveToLocalStorage,
  loadFromLocalStorage,
} from "../../lib/utils";
import { recordActivity } from "../../utils/gamificationEngine";
import { useTranslation } from "../../hooks/useTranslation";

type Topic = "all" | "bitcoin" | "tech" | "general" | "art" | "music";
type RelayType = "all" | "free" | "paid";
type Language = "all" | "en" | "es" | "de" | "ja" | "other";

interface Relay {
  id: string;
  url: string;
  name: string;
  description: string;
  topics: Topic[];
  type: "free" | "paid";
  language: Language;
  location: string;
  region: "na" | "eu" | "asia" | "other";
  userCount: string;
  latency?: number | null;
  status: "online" | "offline" | "checking";
  features: string[];
  owner?: string;
  contact?: string;
}

interface RelayExplorerProps {
  className?: string;
  onSelectRelays?: (relays: string[]) => void;
}

const POPULAR_RELAYS: Relay[] = [
  {
    id: "damus",
    url: "wss://relay.damus.io",
    name: "Damus",
    description: "The most popular Nostr relay, maintained by Damus team",
    topics: ["general", "bitcoin", "tech"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "500K+",
    status: "checking",
    features: ["NIP-01", "NIP-04", "NIP-50"],
    owner: "Damus",
  },
  {
    id: "nos-lol",
    url: "wss://nos.lol",
    name: "nos.lol",
    description: "Fast general-purpose relay with good uptime",
    topics: ["general", "tech"],
    type: "free",
    language: "en",
    location: "Germany",
    region: "eu",
    userCount: "200K+",
    status: "checking",
    features: ["NIP-01", "NIP-09", "NIP-40"],
  },

  {
    id: "purple-pages",
    url: "wss://purplepag.es",
    name: "Purple Pages",
    description: "Metadata relay for profiles and contacts",
    topics: ["general"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "400K+",
    status: "checking",
    features: ["Metadata", "Contacts", "NIP-05"],
  },
  {
    id: "snort",
    url: "wss://relay.snort.social",
    name: "Snort",
    description: "Snort client relay with spam protection",
    topics: ["general", "bitcoin"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "150K+",
    status: "checking",
    features: ["NIP-01", "Anti-spam", "Paid relay support"],
  },
  {
    id: "nostr-pub",
    url: "wss://relay.nostr.bg",
    name: "Nostr.bg",
    description: "Bulgarian relay serving European users",
    topics: ["general"],
    type: "free",
    language: "other",
    location: "Bulgaria",
    region: "eu",
    userCount: "50K+",
    status: "checking",
    features: ["NIP-01", "NIP-04"],
  },
  {
    id: "current",
    url: "wss://relay.current.fyi",
    name: "Current",
    description: "Paid relay with high performance and support",
    topics: ["general", "bitcoin"],
    type: "paid",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "20K+",
    status: "checking",
    features: ["Premium", "Priority", "Support"],
    owner: "Current",
  },
  {
    id: "primal",
    url: "wss://relay.primal.net",
    name: "Primal",
    description: "Primal client relay optimized for performance",
    topics: ["general", "tech"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "100K+",
    status: "checking",
    features: ["NIP-01", "NIP-50", "Fast sync"],
  },
  {
    id: "bitcoiner-social",
    url: "wss://relay.bitcoiner.social",
    name: "Bitcoiner.social",
    description: "Community-focused relay for Bitcoiners",
    topics: ["bitcoin"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "75K+",
    status: "checking",
    features: ["Bitcoin focused", "Community"],
  },
  {
    id: "yabu",
    url: "wss://relay.yabu.me",
    name: "Yabu",
    description: "Japanese relay serving Asian Nostr users",
    topics: ["general"],
    type: "free",
    language: "ja",
    location: "Japan",
    region: "asia",
    userCount: "60K+",
    status: "checking",
    features: ["Japanese community"],
  },
  {
    id: "eden",
    url: "wss://relay.eden.nostr.land",
    name: "Eden",
    description: "High-performance paid relay",
    topics: ["general", "tech", "bitcoin"],
    type: "paid",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "30K+",
    status: "checking",
    features: ["Premium", "Low latency", "High availability"],
  },
  {
    id: "damus-knots",
    url: "wss://knots.nostr.technology",
    name: "Knots",
    description: "Experimental relay testing new features",
    topics: ["tech"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "10K+",
    status: "checking",
    features: ["Experimental", "NIP testing"],
  },
  {
    id: "welshman",
    url: "wss://relay.welshman.com",
    name: "Welshman",
    description: "Community relay with good moderation",
    topics: ["general"],
    type: "free",
    language: "en",
    location: "UK",
    region: "eu",
    userCount: "25K+",
    status: "checking",
    features: ["Community", "Moderation"],
  },
  {
    id: "nostr-plebs",
    url: "wss://nostr.plebs.network",
    name: "Plebs Network",
    description: "Community relay network",
    topics: ["general", "bitcoin"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "40K+",
    status: "checking",
    features: ["Community", "Bitcoin"],
  },
  {
    id: "hivetech",
    url: "wss://relay.hivetech.ovh",
    name: "Hivetech",
    description: "General purpose relay",
    topics: ["general"],
    type: "free",
    language: "en",
    location: "France",
    region: "eu",
    userCount: "15K+",
    status: "checking",
    features: ["NIP-01"],
  },
  {
    id: "wolf-fiatjaf",
    url: "wss://relay.f7z.io",
    name: "F7Z",
    description: "fiatjaf's personal relay",
    topics: ["tech", "general"],
    type: "free",
    language: "en",
    location: "Brazil",
    region: "other",
    userCount: "30K+",
    status: "checking",
    features: ["Experimental"],
    owner: "fiatjaf",
  },
  {
    id: "stacker-news",
    url: "wss://relay.stacker.news",
    name: "Stacker News",
    description: "Relay for Stacker News community",
    topics: ["bitcoin"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "45K+",
    status: "checking",
    features: ["Bitcoin", "Stacker News"],
  },
  {
    id: "nostr-wine",
    url: "wss://nostr.wine",
    name: "Nostr Wine",
    description: "Paid relay with excellent performance",
    topics: ["general", "bitcoin"],
    type: "paid",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "15K+",
    status: "checking",
    features: ["Premium", "High performance"],
  },
  {
    id: "relay-nostrdice",
    url: "wss://relay.nostrdice.com",
    name: "NostrDice",
    description: "Gaming and dice-focused relay",
    topics: ["general"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "5K+",
    status: "checking",
    features: ["Gaming"],
  },
  {
    id: "relay-vera",
    url: "wss://relay.vera.live",
    name: "Vera",
    description: "Live streaming focused relay",
    topics: ["tech", "general"],
    type: "free",
    language: "en",
    location: "USA",
    region: "na",
    userCount: "8K+",
    status: "checking",
    features: ["Live streaming", "NIP-53"],
  },
];

const STARTER_PACK_RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://purplepag.es",
  "wss://relay.snort.social",
];

const REGION_COLORS: Record<string, string> = {
  na: "from-blue-500/20 to-blue-600/10",
  eu: "from-green-500/20 to-green-600/10",
  asia: "from-red-500/20 to-red-600/10",
  other: "from-purple-500/20 to-purple-600/10",
};

export function RelayExplorer({
  className,
  onSelectRelays,
}: RelayExplorerProps) {
  const { t } = useTranslation();
  const [relays, setRelays] = useState<Relay[]>(POPULAR_RELAYS);
  const [selectedRelays, setSelectedRelays] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<Topic>("all");
  const [typeFilter, setTypeFilter] = useState<RelayType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [customRelayInput, setCustomRelayInput] = useState("");
  const [customRelays, setCustomRelays] = useState<Relay[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showStarterPack, setShowStarterPack] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Load saved selections from localStorage
  useEffect(() => {
    const saved = loadFromLocalStorage<{
      selected: string[];
      custom: Relay[];
    }>("nostr-relay-selections", { selected: [], custom: [] });

    setSelectedRelays(new Set(saved.selected));
    setCustomRelays(saved.custom);
  }, []);

  // Save selections to localStorage
  useEffect(() => {
    saveToLocalStorage("nostr-relay-selections", {
      selected: Array.from(selectedRelays),
      custom: customRelays,
    });
    
    // Record relay selection (triggers relay-explorer badge at 3+ relays and streak)
    recordActivity('selectRelays', { count: selectedRelays.size });
  }, [selectedRelays, customRelays]);

  // Show toast helper
  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  // Check relay latency
  const checkRelayLatency = useCallback(
    async (relay: Relay): Promise<number | null> => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        const timeout = setTimeout(() => {
          resolve(null);
        }, 5000);

        try {
          const ws = new WebSocket(relay.url);

          ws.onopen = () => {
            clearTimeout(timeout);
            const latency = Math.round(performance.now() - startTime);
            ws.close();
            resolve(latency);
          };

          ws.onerror = () => {
            clearTimeout(timeout);
            resolve(null);
          };

          ws.onclose = () => {
            clearTimeout(timeout);
            resolve(null);
          };
        } catch {
          clearTimeout(timeout);
          resolve(null);
        }
      });
    },
    [],
  );

  // Check all relays
  const checkAllRelays = useCallback(async () => {
    setIsChecking(true);

    const updateRelayStatus = async (relay: Relay): Promise<Relay> => {
      const latency = await checkRelayLatency(relay);
      return {
        ...relay,
        latency,
        status: latency ? "online" : "offline",
      };
    };

    const updatedRelays = await Promise.all(relays.map(updateRelayStatus));
    setRelays(updatedRelays);

    // Also check custom relays
    if (customRelays.length > 0) {
      const updatedCustom = await Promise.all(
        customRelays.map(updateRelayStatus),
      );
      setCustomRelays(updatedCustom);
    }

    setIsChecking(false);
    showToast(t('relayExplorer.toast.checkComplete'), "success");
  }, [relays, customRelays, checkRelayLatency, showToast, t]);

  // Initial check on mount
  useEffect(() => {
    checkAllRelays();
  }, []);

  // Filter relays
  const filteredRelays = [...relays, ...customRelays].filter((relay) => {
    // Search filter
    const matchesSearch =
      relay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relay.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relay.url.toLowerCase().includes(searchQuery.toLowerCase());

    // Topic filter
    const matchesTopic =
      topicFilter === "all" || relay.topics.includes(topicFilter);

    // Type filter
    const matchesType = typeFilter === "all" || relay.type === typeFilter;

    return matchesSearch && matchesTopic && matchesType;
  });

  // Toggle relay selection
  const toggleRelaySelection = (url: string) => {
    const newSelected = new Set(selectedRelays);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      newSelected.add(url);
    }
    setSelectedRelays(newSelected);
    onSelectRelays?.(Array.from(newSelected));
  };

  // Select all starter pack relays
  const selectStarterPack = () => {
    const newSelected = new Set(selectedRelays);
    STARTER_PACK_RELAYS.forEach((url) => newSelected.add(url));
    setSelectedRelays(newSelected);
    onSelectRelays?.(Array.from(newSelected));
    showToast(t('relayExplorer.toast.starterPackAdded'), "success");
  };

  // Add custom relay
  const addCustomRelay = () => {
    if (!customRelayInput.trim()) return;

    let url = customRelayInput.trim();
    if (!url.startsWith("wss://") && !url.startsWith("ws://")) {
      url = `wss://${url}`;
    }

    if (
      customRelays.some((r) => r.url === url) ||
      relays.some((r) => r.url === url)
    ) {
      showToast(t('relayExplorer.toast.alreadyExists'), "error");
      return;
    }

    const newRelay: Relay = {
      id: `custom-${Date.now()}`,
      url,
      name: url.replace("wss://", "").replace("ws://", ""),
      description: "Custom relay",
      topics: ["general"],
      type: "free",
      language: "en",
      location: "Unknown",
      region: "other",
      userCount: "Unknown",
      status: "checking",
      features: ["Custom"],
    };

    setCustomRelays([...customRelays, newRelay]);
    setCustomRelayInput("");
    showToast(t('relayExplorer.toast.added'), "success");

    // Check latency for the new relay
    checkRelayLatency(newRelay).then((latency) => {
      setCustomRelays((prev) =>
        prev.map((r) =>
          r.url === url
            ? { ...r, latency, status: latency ? "online" : "offline" }
            : r,
        ),
      );
    });
  };

  // Remove custom relay
  const removeCustomRelay = (url: string) => {
    setCustomRelays(customRelays.filter((r) => r.url !== url));
    const newSelected = new Set(selectedRelays);
    newSelected.delete(url);
    setSelectedRelays(newSelected);
    showToast(t('relayExplorer.toast.removed'), "info");
  };

  // Copy selected relays
  const copySelectedRelays = async () => {
    const urls = Array.from(selectedRelays).join("\n");
    const success = await copyToClipboard(urls);
    if (success) {
      showToast(
        t('relayExplorer.toast.copied').replace('{count}', String(selectedRelays.size)),
        "success",
      );
    } else {
      showToast(t('relayExplorer.toast.copyFailed'), "error");
    }
  };

  // Download relay list
  const downloadRelayList = () => {
    const urls = Array.from(selectedRelays).join("\n");
    downloadFile("nostr-relays.txt", urls);
    showToast(t('relayExplorer.toast.downloaded'), "success");
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-success-500";
      case "offline":
        return "bg-error-500";
      default:
        return "bg-gray-500 animate-pulse";
    }
  };

  // Get latency color
  const getLatencyColor = (latency?: number | null) => {
    if (!latency) return "text-gray-500";
    if (latency < 100) return "text-success-500";
    if (latency < 300) return "text-warning-500";
    return "text-error-500";
  };

  return (
    <div className={cn("max-w-6xl mx-auto p-6", className)}>
      <div className="bg-surface border border-border-dark rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4"
          >
            <Globe className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('relayExplorer.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            {t('relayExplorer.description')}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t('relayExplorer.search.placeholder')}
                placeholder={t('relayExplorer.search.placeholder')}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-border-dark rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <button
              onClick={checkAllRelays}
              disabled={isChecking}
              className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-600 disabled:bg-gray-100 dark:bg-gray-800 	ext-gray-900 dark:text-white rounded-xl font-medium transition-all inline-flex items-center gap-2"
            >
              <RefreshCw
                className={cn("w-5 h-5", isChecking && "animate-spin")}
              />
              {isChecking ? t('relayExplorer.checking') : t('relayExplorer.testAll')}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Topic Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all" as Topic, label: t('relayExplorer.filters.topic.label'), icon: <Globe className="w-4 h-4" /> },
                { value: "bitcoin" as Topic, label: t('relayExplorer.filters.topic.bitcoin'), icon: <Zap className="w-4 h-4" /> },
                { value: "tech" as Topic, label: t('relayExplorer.filters.topic.technology'), icon: <Server className="w-4 h-4" /> },
                { value: "general" as Topic, label: t('relayExplorer.filters.topic.general'), icon: <Users className="w-4 h-4" /> },
                { value: "art" as Topic, label: t('relayExplorer.filters.topic.art'), icon: <Shield className="w-4 h-4" /> },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTopicFilter(option.value)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    topicFilter === option.value
                      ? "bg-primary-500 text-gray-900 dark:text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
                  )}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all" as RelayType, label: t('relayExplorer.filters.type.label'), icon: <Filter className="w-4 h-4" /> },
                { value: "free" as RelayType, label: t('relayExplorer.filters.type.free'), icon: <Check className="w-4 h-4" /> },
                { value: "paid" as RelayType, label: t('relayExplorer.filters.type.paid'), icon: <DollarSign className="w-4 h-4" /> },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTypeFilter(option.value)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    typeFilter === option.value
                      ? "bg-primary-500 text-gray-900 dark:text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
                  )}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Relay Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={customRelayInput}
                onChange={(e) => setCustomRelayInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomRelay()}
                aria-label={t('relayExplorer.customRelay.placeholder')}
                placeholder={t('relayExplorer.customRelay.placeholder')}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-border-dark rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <button
              onClick={addCustomRelay}
              disabled={!customRelayInput.trim()}
              className="px-4 py-3 bg-primary-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('relayExplorer.customRelay.add')}
            </button>
          </div>

          {/* Selected Count */}
          {selectedRelays.size > 0 && (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3">
              <span className="text-gray-600 dark:text-gray-400">
                {t('relayExplorer.selected.count').replace('{count}', String(selectedRelays.size))}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copySelectedRelays}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm transition-all inline-flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {t('relayExplorer.selected.copy')}
                </button>
                <button
                  onClick={downloadRelayList}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm transition-all inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t('relayExplorer.selected.download')}
                </button>
                <button
                  onClick={() => {
                    setSelectedRelays(new Set());
                    onSelectRelays?.([]);
                  }}
                  className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg text-sm transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Relay Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredRelays.map((relay) => (
              <motion.div
                key={relay.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "relative border rounded-xl p-4 transition-all cursor-pointer",
                  selectedRelays.has(relay.url)
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-border-dark hover:border-gray-600 hover:bg-gray-100 dark:bg-gray-800/30",
                )}
                onClick={() => toggleRelaySelection(relay.url)}
              >
                {/* Selection Indicator */}
                <div className="absolute top-3 right-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedRelays.has(relay.url)
                        ? "bg-primary-500 border-primary-500"
                        : "border-gray-600",
                    )}
                  >
                    {selectedRelays.has(relay.url) && (
                      <Check className="w-4 h-4 	ext-gray-900 dark:text-white" />
                    )}
                  </div>
                </div>

                {/* Header */}
                <div className="flex items-start gap-3 mb-3 pr-8">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br",
                      REGION_COLORS[relay.region],
                    )}
                  >
                    <Globe className="w-6 h-6 	ext-gray-900 dark:text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold 	ext-gray-900 dark:text-white truncate">
                      {relay.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {relay.location}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm  text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {relay.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs mb-3">
                  <span className="flex items-center gap-1  text-gray-600 dark:text-gray-400">
                    <Users className="w-3 h-3" />
                    {relay.userCount}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      getLatencyColor(relay.latency),
                    )}
                  >
                    <Activity className="w-3 h-3" />
                    {relay.latency ? `${relay.latency}ms` : t('relayExplorer.card.latencyUnknown')}
                  </span>
                  {relay.type === "paid" && (
                    <span className="flex items-center gap-1 text-warning-500">
                      <DollarSign className="w-3 h-3" />
                      {t('relayExplorer.filters.type.paid')}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      getStatusColor(relay.status),
                    )}
                  />
                  <span className="text-xs text-gray-500 capitalize">
                    {relay.status === "checking" ? t('relayExplorer.card.status.checking') : 
                     relay.status === "online" ? t('relayExplorer.card.status.online') : 
                     t('relayExplorer.card.status.offline')}
                  </span>
                </div>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {relay.features.slice(0, 2).map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Remove button for custom relays */}
                {relay.id.startsWith("custom-") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomRelay(relay.url);
                    }}
                    className="absolute bottom-3 right-3 p-1 text-gray-500 hover:text-error-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredRelays.length === 0 && (
          <div className="text-center py-12">
            <Server className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No relays found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or add a custom relay
            </p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 pt-6 border-t border-border-dark">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold 	ext-gray-900 dark:text-white">{relays.length}</p>
              <p className="text-sm  text-gray-600 dark:text-gray-400">{t('relayExplorer.stats.popularRelays')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success-500">
                {relays.filter((r) => r.status === "online").length}
              </p>
              <p className="text-sm  text-gray-600 dark:text-gray-400">{t('relayExplorer.stats.onlineNow')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {relays.filter((r) => r.type === "free").length}
              </p>
              <p className="text-sm  text-gray-600 dark:text-gray-400">{t('relayExplorer.stats.freeRelays')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning-500">
                {selectedRelays.size}
              </p>
              <p className="text-sm  text-gray-600 dark:text-gray-400">{t('relayExplorer.stats.selected')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={cn(
              "fixed bottom-6 left-1/2 px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2",
              toast.type === "success" && "bg-success-500 	ext-gray-900 dark:text-white",
              toast.type === "error" && "bg-error-500 	ext-gray-900 dark:text-white",
              toast.type === "info" && "bg-primary-500 	ext-gray-900 dark:text-white",
            )}
          >
            {toast.type === "success" && <Check className="w-5 h-5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "info" && <Info className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
