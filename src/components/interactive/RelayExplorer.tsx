import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Lock,
  Plus,
  X,
  RefreshCw,
  Server,
  AlertCircle,
  Info,
  Sparkles,
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

type Topic = "all" | "bitcoin" | "general";
type RelayAccess = "free" | "paid" | "restricted";
type RelayType = "all" | RelayAccess;

interface Relay {
  id: string;
  url: string;
  name: string;
  topics: Exclude<Topic, "all">[];
  // free = anyone can read and post; paid = admission or per-note payment;
  // restricted = readable by anyone, but the operator gates who may post.
  type: RelayAccess;
  // NIP numbers the relay advertised in its own NIP-11 document.
  supportedNips: number[];
  latency?: number | null;
  status: "online" | "offline" | "checking";
}

interface RelayExplorerProps {
  className?: string;
  onSelectRelays?: (relays: string[]) => void;
}

// Every entry below was re-checked against the relay's own NIP-11 document on
// 2026-09-02 (see docs/audit-2026-09/relays-verified.md). Relays that no longer
// answer were removed rather than left on the page as broken suggestions.
// Deliberately absent: user counts. Nobody can count Nostr users per relay, so
// the old "500K+" style figures were invented and are gone for good.
const POPULAR_RELAYS: Relay[] = [
  {
    id: "damus",
    url: "wss://relay.damus.io",
    name: "Damus",
    topics: ["general"],
    type: "free",
    supportedNips: [1, 2, 4, 9, 28, 40, 45, 70],
    status: "checking",
  },
  {
    id: "nos-lol",
    url: "wss://nos.lol",
    name: "nos.lol",
    topics: ["general"],
    type: "free",
    supportedNips: [1, 2, 4, 9, 28, 40, 45, 70],
    status: "checking",
  },
  {
    id: "primal",
    url: "wss://relay.primal.net",
    name: "Primal",
    topics: ["general"],
    type: "free",
    supportedNips: [1, 2, 4, 9, 22, 28, 40, 70],
    status: "checking",
  },
  {
    id: "snort",
    url: "wss://relay.snort.social",
    name: "Snort",
    topics: ["general"],
    type: "free",
    supportedNips: [1],
    status: "checking",
  },
  {
    // The old data said wss://relay.bitcoiner.social, which is NXDOMAIN. The
    // relay itself is alive and free at this hostname.
    id: "bitcoiner-social",
    url: "wss://nostr.bitcoiner.social",
    name: "Bitcoiner.social",
    topics: ["general", "bitcoin"],
    type: "free",
    supportedNips: [1, 2, 4, 9, 28, 40, 45, 70],
    status: "checking",
  },
  {
    id: "christpill",
    url: "wss://christpill.nostr1.com",
    name: "Christpill",
    topics: ["general"],
    type: "free",
    supportedNips: [1, 2, 4, 9, 17, 22, 28, 40],
    status: "checking",
  },
  {
    id: "news-utxo",
    url: "wss://news.utxo.one",
    name: "NewsBot Relay",
    topics: ["general"],
    type: "free",
    supportedNips: [1, 9, 42, 45, 70],
    status: "checking",
  },
  {
    // fees.admission 18888000 msats
    id: "nostr-wine",
    url: "wss://nostr.wine",
    name: "Nostr Wine",
    topics: ["general"],
    type: "paid",
    supportedNips: [1, 2, 4, 9, 40, 42, 50, 70],
    status: "checking",
  },
  {
    // fees.admission 111000 msats
    id: "chillstr",
    url: "wss://chillstr.nostr1.com",
    name: "Chillstr",
    topics: ["general"],
    type: "paid",
    supportedNips: [1, 2, 4, 9, 17, 22, 28, 40],
    status: "checking",
  },
  {
    id: "holoboard",
    url: "wss://relay.holoboard.space",
    name: "Holoboard.space",
    topics: ["general", "bitcoin"],
    type: "paid",
    supportedNips: [1, 9, 57],
    status: "checking",
  },
  {
    // limitation.restricted_writes: true
    id: "spatia-arcana",
    url: "wss://spatia-arcana.com",
    name: "Spatia Arcana",
    topics: ["general"],
    type: "restricted",
    supportedNips: [1, 9, 16, 29, 34, 40, 42, 45, 50, 70],
    status: "checking",
  },
];

// The same three the relays-demystified guide puts in its table, so the button
// and the page around it recommend one set, not two.
const STARTER_PACK_RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.primal.net",
];

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

  // A relay's blurb lives in the translation files, keyed by its stable id, so
  // that an Arabic or Hindi reader gets their own language instead of English.
  const relayDescription = useCallback(
    (relay: Relay): string =>
      relay.id.startsWith("custom-")
        ? t("relayExplorer.customRelay.description")
        : t(`relayExplorer.relays.${relay.id}.description`),
    [t],
  );

  // Filter relays
  const filteredRelays = [...relays, ...customRelays].filter((relay) => {
    // Search filter
    const matchesSearch =
      relay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relayDescription(relay).toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      topics: ["general"],
      type: "free",
      supportedNips: [],
      status: "checking",
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
    if (latency < 100) return "text-success-700 dark:text-success-400";
    if (latency < 300) return "text-warning-700 dark:text-warning-400";
    return "text-error-700 dark:text-error-400";
  };

  return (
    <div className={cn("max-w-6xl mx-auto p-6", className)}>
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <Globe
              className="h-6 w-6 text-gray-400 dark:text-gray-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <h2 className="mb-2 text-h2 text-gray-900 dark:text-white">
            {t('relayExplorer.title')}
          </h2>
          <p className="mx-auto max-w-measure text-lead text-gray-600 dark:text-gray-400">
            {t('relayExplorer.description')}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" strokeWidth={1.5} aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t('relayExplorer.search.placeholder')}
                placeholder={t('relayExplorer.search.placeholder')}
                className="w-full ps-10 pe-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md text-gray-900 dark:text-white placeholder-gray-500 text-body transition-colors focus:border-primary-600 dark:focus:border-primary-400"
              />
            </div>
            {/* The one-click way out for a reader who does not want to judge
                thirteen relays on latency numbers. */}
            <button
              type="button"
              onClick={selectStarterPack}
              className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Sparkles className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              {t('relayExplorer.starterPack.button')}
            </button>
            <button
              type="button"
              onClick={checkAllRelays}
              disabled={isChecking}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-800"
            >
              <RefreshCw
                className={cn("w-5 h-5", isChecking && "animate-spin")} strokeWidth={1.5} aria-hidden="true" />
              {isChecking ? t('relayExplorer.checking') : t('relayExplorer.testAll')}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Topic Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all" as Topic, label: t('relayExplorer.filters.topic.label'), icon: <Globe className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> },
                { value: "general" as Topic, label: t('relayExplorer.filters.topic.general'), icon: <Users className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> },
                { value: "bitcoin" as Topic, label: t('relayExplorer.filters.topic.bitcoin'), icon: <Zap className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTopicFilter(option.value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-body-sm font-medium transition-colors",
                    topicFilter === option.value
                      ? "bg-primary-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800",
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
                { value: "all" as RelayType, label: t('relayExplorer.filters.type.label'), icon: <Filter className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> },
                { value: "free" as RelayType, label: t('relayExplorer.filters.type.free'), icon: <Check className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> },
                { value: "paid" as RelayType, label: t('relayExplorer.filters.type.paid'), icon: <DollarSign className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> },
                { value: "restricted" as RelayType, label: t('relayExplorer.filters.type.restricted'), icon: <Lock className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTypeFilter(option.value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-body-sm font-medium transition-colors",
                    typeFilter === option.value
                      ? "bg-primary-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800",
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
              <Server className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" strokeWidth={1.5} aria-hidden="true" />
              <input
                type="text"
                value={customRelayInput}
                onChange={(e) => setCustomRelayInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomRelay()}
                aria-label={t('relayExplorer.customRelay.placeholder')}
                placeholder={t('relayExplorer.customRelay.placeholder')}
                className="w-full ps-10 pe-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md text-gray-900 dark:text-white placeholder-gray-500 text-body transition-colors focus:border-primary-600 dark:focus:border-primary-400"
              />
            </div>
            <button
              onClick={addCustomRelay}
              disabled={!customRelayInput.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              {t('relayExplorer.customRelay.add')}
            </button>
          </div>

          {/* Selected Count */}
          {selectedRelays.size > 0 && (
            <>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-400">
                {t('relayExplorer.selected.count').replace('{count}', String(selectedRelays.size))}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copySelectedRelays}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-body-sm text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                >
                  <Copy className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  {t('relayExplorer.selected.copy')}
                </button>
                <button
                  onClick={downloadRelayList}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-body-sm text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  {t('relayExplorer.selected.download')}
                </button>
                <button
                  onClick={() => {
                    setSelectedRelays(new Set());
                    onSelectRelays?.([]);
                  }}
                  className="rounded-md px-3 py-2 text-body-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t('relayExplorer.selected.clear')}
                </button>
              </div>
            </div>

            {/* What the copied blob is for. Without this the tool ends at a
                toast and the reader is left holding a list of addresses. */}
            <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-body-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" strokeWidth={1.5} aria-hidden="true" />
              <p>{t('relayExplorer.selected.whereTo')}</p>
            </div>
            </>
          )}
        </div>

        {/* Relay Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRelays.map((relay) => (
            <div key={relay.id} className="relative">
              {/* The card is a real toggle button: keyboard, focus ring and
                  pressed state all come for free. The remove control for custom
                  relays sits outside it, since a button cannot nest a button. */}
              <button
                type="button"
                aria-pressed={selectedRelays.has(relay.url)}
                aria-label={relay.name}
                className={cn(
                  "relative w-full text-start border rounded-lg p-4 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "animate-scale-in motion-reduce:animate-none",
                  selectedRelays.has(relay.url)
                    ? "border-primary-600 bg-primary-50 dark:border-primary-400 dark:bg-gray-800"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800",
                )}
                onClick={() => toggleRelaySelection(relay.url)}
              >
                {/* Selection Indicator */}
                <div className="absolute top-3 end-3">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                      selectedRelays.has(relay.url)
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-300 dark:border-gray-600",
                    )}
                  >
                    {selectedRelays.has(relay.url) && (
                      <Check className="w-4 h-4 text-white" strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </div>
                </div>

                {/* Header */}
                <div className="flex items-start gap-3 mb-3 pe-8">
                  <Globe
                    className="mt-0.5 h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {relay.name}
                    </h3>
                    <p className="truncate text-caption text-gray-500 dark:text-gray-400">{relay.url}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-body-sm  text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                  {relayDescription(relay)}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-3 text-caption mb-3">
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      getLatencyColor(relay.latency),
                    )}
                  >
                    <Activity className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                    {relay.latency ? `${relay.latency}ms` : t('relayExplorer.card.latencyUnknown')}
                  </span>
                  {relay.type === "paid" && (
                    <span className="flex items-center gap-1 text-warning-700 dark:text-warning-400">
                      <DollarSign className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                      {t('relayExplorer.filters.type.paid')}
                    </span>
                  )}
                  {relay.type === "restricted" && (
                    <span className="flex items-center gap-1 text-warning-700 dark:text-warning-400">
                      <Lock className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                      {t('relayExplorer.filters.type.restricted')}
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
                  <span className="text-caption capitalize text-gray-500 dark:text-gray-400">
                    {relay.status === "checking" ? t('relayExplorer.card.status.checking') : 
                     relay.status === "online" ? t('relayExplorer.card.status.online') : 
                     t('relayExplorer.card.status.offline')}
                  </span>
                </div>

                {/* NIPs the relay advertises in its own NIP-11 document */}
                {relay.supportedNips.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {relay.supportedNips.slice(0, 4).map((nip) => (
                      <span
                        key={nip}
                        className="rounded-md border border-gray-200 px-2 py-1 text-caption text-gray-600 dark:border-gray-800 dark:text-gray-400"
                      >
                        NIP-{String(nip).padStart(2, "0")}
                      </span>
                    ))}
                  </div>
                )}

              </button>

              {/* Remove button for custom relays */}
              {relay.id.startsWith("custom-") && (
                <button
                  type="button"
                  onClick={() => removeCustomRelay(relay.url)}
                  aria-label={t('relayExplorer.customRelay.remove').replace('{name}', relay.name)}
                  className="absolute bottom-3 end-3 p-1 text-gray-500 hover:text-error-700 dark:hover:text-error-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRelays.length === 0 && (
          <div className="text-center py-12">
            <Server className="mx-auto mb-4 h-6 w-6 text-gray-400 dark:text-gray-500" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mb-2 text-h3 text-gray-900 dark:text-white">
              {t('relayExplorer.empty.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('relayExplorer.empty.hint')}
            </p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-h2 text-gray-900 dark:text-white">{relays.length}</p>
              <p className="text-body-sm  text-gray-600 dark:text-gray-400">{t('relayExplorer.stats.popularRelays')}</p>
            </div>
            <div className="text-center">
              <p className="text-h2 text-success-700 dark:text-success-400">
                {relays.filter((r) => r.status === "online").length}
              </p>
              <p className="text-body-sm  text-gray-600 dark:text-gray-400">{t('relayExplorer.stats.onlineNow')}</p>
            </div>
            <div className="text-center">
              <p className="text-h2 text-primary-text dark:text-primary-400">
                {relays.filter((r) => r.type === "free").length}
              </p>
              <p className="text-body-sm  text-gray-600 dark:text-gray-400">{t('relayExplorer.stats.freeRelays')}</p>
            </div>
            <div className="text-center">
              <p className="text-h2 text-warning-700 dark:text-warning-400">
                {selectedRelays.size}
              </p>
              <p className="text-body-sm  text-gray-600 dark:text-gray-400">{t('relayExplorer.stats.selected')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center">
          <div
            className={cn(
              "flex items-center gap-2 rounded-md px-6 py-3 shadow-raised animate-slide-up motion-reduce:animate-none",
              toast.type === "success" && "bg-success-700 text-white",
              toast.type === "error" && "bg-error-700 text-white",
              toast.type === "info" && "bg-primary-600 text-white",
            )}
          >
            {toast.type === "success" && <Check className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />}
            {toast.type === "info" && <Info className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
