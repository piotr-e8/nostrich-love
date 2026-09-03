import React, { useState, useEffect, useCallback, useRef, useId } from "react";
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
import { useTranslation } from "../../hooks/useTranslation";

// How much a beginner is allowed to do on a relay. Machine-readable; the label
// and the wording next to it come from i18n.
type RelayAccess = "free" | "paid" | "restricted" | "unknown";

// Relay interface. Human-readable copy (the description, the access label) is
// NOT stored here — it is looked up per locale from
// relayPlayground.relays.<id>.description / relayPlayground.access.<access>.
interface Relay {
  id: string;
  url: string;
  name: string;
  access: RelayAccess;
  status: "online" | "offline" | "checking";
  latency?: number;
  lastChecked?: Date;
  nip11Info?: NIP11Info;
  connectionState?: "idle" | "connecting" | "connected" | "error";
  /** i18n key suffix under relayPlayground.connectionTab, not a message. */
  connectionError?: "connectionFailed" | "invalidUrl";
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

// Why a subscription produced nothing. Held as a code, resolved through t() at
// render time, so the sentence follows the reader's language.
interface RelayIssue {
  code: "connectionFailed" | "timedOut" | "subscriptionRefused" | "closedEarly";
  /** The relay's own words from CLOSED or NOTICE. Server text, never translated. */
  detail?: string;
}

// A relay that refuses a subscription has to answer within this, or we stop
// waiting and say so. Silence is otherwise indistinguishable from an empty relay.
const SUBSCRIPTION_TIMEOUT_MS = 10000;

// CLOSED puts its reason third, NOTICE second.
function relayReason(frame: unknown[]): string | undefined {
  const candidate = frame[0] === "NOTICE" ? frame[1] : frame[2];
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : undefined;
}

function RelayIssueNotice({ issue }: { issue: RelayIssue }) {
  const { t } = useTranslation();
  const message =
    issue.code === "connectionFailed"
      ? t("relayPlayground.connectionTab.connectionFailed")
      : t(`relayPlayground.errors.${issue.code}`);

  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-xl border border-error-500/40 bg-error-500/10 p-3 text-sm text-error-600 dark:text-error-400"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>
        {message}
        {issue.detail && (
          <span className="mt-1 block break-all font-mono text-xs text-gray-600 dark:text-gray-400">
            {issue.detail}
          </span>
        )}
      </span>
    </div>
  );
}

// Relay list. Every host here answered a NIP-11 request on 2026-09-02
// (docs/audit-2026-09/relays-verified.md), except purplepag.es, whose own proxy
// returned 502 while its certificate was still being renewed: unresolved, kept,
// and it simply shows as offline until it answers again.
//
// Sixteen entries were removed or repointed in that pass. Dead hosts with no DNS
// at all: relay.current.fyi, relay.eden.nostr.land, relay.nostr.bg, relay.yabu.me,
// relay.welshman.com, relay.stacker.news, relay.f7z.io, relay.hivetech.ovh,
// knots.nostr.technology, relay.vera.live, relay.nostrdice.com, relay.sdamus.io.
// Two were hostname typos, not dead services: relay.bitcoiner.social -> bitcoiner.social
// and nostr.plebs.network -> relay.nostrplebs.com.
//
// No location or region field: nothing verifies where a relay's server actually
// sits (most answer from behind a CDN), and the measured latency below is the
// honest version of the same information.
const CURATED_RELAYS: Omit<Relay, "status" | "supportedNIPs">[] = [
  { id: "damus", url: "wss://relay.damus.io", name: "Damus", access: "free" },
  { id: "nos-lol", url: "wss://nos.lol", name: "nos.lol", access: "free" },
  { id: "primal", url: "wss://relay.primal.net", name: "Primal", access: "free" },
  { id: "snort", url: "wss://relay.snort.social", name: "Snort", access: "free" },
  { id: "nostr-mom", url: "wss://nostr.mom", name: "nostr.mom", access: "free" },
  { id: "bitcoiner-social", url: "wss://bitcoiner.social", name: "bitcoiner.social", access: "free" },
  { id: "christpill", url: "wss://christpill.nostr1.com", name: "Christpill", access: "free" },
  { id: "news-utxo", url: "wss://news.utxo.one", name: "NewsBot", access: "free" },
  { id: "nostr-wine", url: "wss://nostr.wine", name: "Nostr Wine", access: "paid" },
  { id: "nostr-plebs", url: "wss://relay.nostrplebs.com", name: "Nostr Plebs", access: "paid" },
  { id: "chillstr", url: "wss://chillstr.nostr1.com", name: "Chillstr", access: "paid" },
  { id: "holoboard", url: "wss://relay.holoboard.space", name: "Holoboard", access: "paid" },
  { id: "spatia-arcana", url: "wss://spatia-arcana.com", name: "Spatia Arcana", access: "restricted" },
  { id: "purple-pages", url: "wss://purplepag.es", name: "Purple Pages", access: "unknown" },
];

// NIPs a relay may advertise in its NIP-11 document. Titles follow the index at
// github.com/nostr-protocol/nips (checked 2026-09-02); 12, 16, 20 and 33 are the
// old numbers whose text now says "Moved to NIP-01". The list is here only so the
// UI knows WHICH numbers it can name — the names themselves come from i18n.
const KNOWN_NIPS = [
  1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 75,
  77, 78, 84, 85, 86, 87, 88, 89, 90, 92, 94, 96, 98, 99,
];
const KNOWN_NIP_SET = new Set(KNOWN_NIPS);

/** Localized one-line name of a NIP, or a neutral fallback for numbers we do not know. */
function nipName(nip: number, t: (key: string) => string): string {
  return KNOWN_NIP_SET.has(nip) ? t(`relayPlayground.nipNames.${nip}`) : t("relayPlayground.nipsTab.unknownNip");
}

export function RelayPlayground({ className }: { className?: string }) {
  const { t } = useTranslation();
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
          r.id === relay.id ? { ...r, connectionState: "error", connectionError: "connectionFailed" } : r
        ));
      };

      ws.onclose = () => {
        setRelays(prev => prev.map(r => 
          r.id === relay.id ? { ...r, connectionState: "idle" } : r
        ));
      };
    } catch (error) {
      setRelays(prev => prev.map(r => 
        r.id === relay.id ? { ...r, connectionState: "error", connectionError: "invalidUrl" } : r
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
      relay.url.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4 animate-scale-in motion-reduce:animate-none">
            <Globe className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('relayPlayground.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('relayPlayground.description')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-success-500">{onlineCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('relayPlayground.status.online')}</div>
          </div>
          <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-error-500">{offlineCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('relayPlayground.status.offline')}</div>
          </div>
          <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{relays.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('relayPlayground.stats.totalRelays')}</div>
          </div>
          <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{avgLatency}ms</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('relayPlayground.healthTab.responseTime')}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
          {[
            { id: "connection" as Tab, label: t('relayPlayground.tabs.connection'), icon: Wifi },
            { id: "health" as Tab, label: t('relayPlayground.tabs.health'), icon: Activity },
            { id: "nips" as Tab, label: t('relayPlayground.tabs.nips'), icon: Shield },
            { id: "events" as Tab, label: t('relayPlayground.tabs.events'), icon: Eye },
            { id: "query" as Tab, label: t('relayPlayground.tabs.query'), icon: Filter },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            onClick={checkAllRelays}
            disabled={isCheckingAll}
            className="ms-auto flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white disabled:text-gray-500 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RefreshCw className={cn("w-4 h-4", isCheckingAll && "animate-spin")} />
            {isCheckingAll ? t('relayPlayground.buttons.checking') : t('relayPlayground.buttons.checkAll')}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t('relayPlayground.search.placeholder')}
            placeholder={t('relayPlayground.search.placeholder')}
            className="w-full ps-10 pe-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Tab Content */}
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
  const { t } = useTranslation();
  return (
    <div className="space-y-6 animate-slide-up motion-reduce:animate-none">
      {/* Educational Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <strong className="text-blue-600 dark:text-blue-400">{t('relayPlayground.connectionTab.selectRelay')}</strong>
        </div>
      </div>

      {/* Relay Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relays.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-600 dark:text-gray-400">
            <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t('relayPlayground.healthTab.noData')}</p>
          </div>
        ) : (
          relays.map((relay) => (
            // A real button: every tab downstream reads from the relay picked
            // here, so this has to work from the keyboard.
            <button
              key={relay.id}
              type="button"
              aria-pressed={selectedRelay?.id === relay.id}
              aria-label={relay.name}
              onClick={() => onSelectRelay(relay)}
              className={cn(
                "relative w-full text-start p-4 border rounded-xl transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                selectedRelay?.id === relay.id
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 bg-gray-100/30 dark:bg-gray-800/30"
              )}
            >
              {/* Connection Status Indicator */}
              <div className="absolute top-3 end-3">
                {relay.connectionState === "connected" && (
                  <div className="flex items-center gap-1 text-success-500 text-xs">
                    <Wifi className="w-3 h-3" />
                    {t('relayPlayground.status.connected')}
                  </div>
                )}
                {relay.connectionState === "connecting" && (
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {t('relayPlayground.status.checking')}
                  </div>
                )}
                {relay.connectionState === "error" && (
                  <div className="flex items-center gap-1 text-error-500 text-xs">
                    <WifiOff className="w-3 h-3" />
                    {t('relayPlayground.status.error')}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{relay.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{relay.url}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {t(`relayPlayground.relays.${relay.id}.description`)}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className={cn(
                  "px-2 py-0.5 rounded-full",
                  relay.access === "free" ? "bg-green-500/20 text-green-400" :
                  relay.access === "paid" ? "bg-amber-500/20 text-amber-500" :
                  relay.access === "restricted" ? "bg-purple-500/20 text-purple-400" :
                  "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                )}>
                  {t(`relayPlayground.access.${relay.access}`)}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full",
                  relay.status === "online" ? "bg-green-500/20 text-green-400" :
                  relay.status === "offline" ? "bg-red-500/20 text-red-400" :
                  "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                )}>
                  {t(`relayPlayground.status.${relay.status}`)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Selected Relay Details */}
      {selectedRelay && (
          <div className="bg-gray-100/50 dark:bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-slide-down motion-reduce:animate-none">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedRelay.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedRelay.url}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {t(`relayPlayground.relays.${selectedRelay.id}.description`)}
                </p>
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
                  {t('relayPlayground.buttons.connect')}
                </button>
              ) : (
                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
                >
                  <Pause className="w-5 h-5" />
                  {t('relayPlayground.buttons.disconnect')}
                </button>
              )}
              <button
                onClick={() => copyToClipboard(selectedRelay.url)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Copy className="w-5 h-5" />
                {t('relayPlayground.buttons.copy')}
              </button>
            </div>

            {/* Connection State Display */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 font-mono text-sm">
              <div className="text-gray-500 mb-2">// {t('relayPlayground.connectionTab.connectionState')}</div>
              <div className="text-green-400">
                {selectedRelay.connectionState === "idle" && t('relayPlayground.connectionTab.unknown')}
                {selectedRelay.connectionState === "connecting" && `const ws = new WebSocket('${selectedRelay.url}');\nws.onopen = () => console.log('${t('relayPlayground.status.connected')}');`}
                {selectedRelay.connectionState === "connected" && t('relayPlayground.connectionTab.connected')}
                {selectedRelay.connectionState === "error" && `${t('relayPlayground.connectionTab.error')}: ${
                  selectedRelay.connectionError
                    ? t(`relayPlayground.connectionTab.${selectedRelay.connectionError}`)
                    : t('relayPlayground.connectionTab.unknown')
                }`}
              </div>
            </div>

            {/* Educational Info */}
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                {t('relayPlayground.connectionTab.whatHappensTitle')}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {t('relayPlayground.connectionTab.whatHappensBody')}
              </p>
            </div>
          </div>
        )}
    </div>
  );
}

// Health Dashboard Component
function HealthDashboard({
  relays,
}: {
  relays: Relay[];
  healthHistory: HealthCheck[];
}) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<"latency" | "name">("latency");

  const sortedRelays = [...relays].sort((a, b) => {
    if (sortBy === "latency") {
      if (!a.latency) return 1;
      if (!b.latency) return -1;
      return a.latency - b.latency;
    }
    return a.name.localeCompare(b.name);
  });

  const getLatencyColor = (latency?: number) => {
    if (!latency) return "text-gray-500";
    if (latency < 100) return "text-green-400";
    if (latency < 300) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6 animate-slide-up motion-reduce:animate-none">
      {/* Sort Controls */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600 dark:text-gray-400 text-sm">{t('relayPlayground.healthTab.sortBy')}</span>
        <div className="flex gap-2">
          {[
            { key: "latency" as const, label: t('relayPlayground.healthTab.responseTime') },
            { key: "name" as const, label: t('relayPlayground.healthTab.relay') },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                sortBy === option.key
                  ? "bg-primary-600 text-white"
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
              <th className="text-start px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('relayPlayground.healthTab.relay')}</th>
              <th className="text-start px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('relayPlayground.healthTab.access')}</th>
              <th className="text-start px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('relayPlayground.connectionTab.latency')}</th>
              <th className="text-start px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('relayPlayground.healthTab.lastChecked')}</th>
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
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {t(`relayPlayground.access.${relay.access}`)}
                  </span>
                </td>
                <td className={cn("px-4 py-3 font-mono", getLatencyColor(relay.latency))}>
                  {relay.latency ? `${relay.latency}ms` : t('relayPlayground.connectionTab.unknown')}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                  {relay.lastChecked ? 
                    new Date(relay.lastChecked).toLocaleTimeString() : 
                    t('relayPlayground.connectionTab.unknown')
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
            {t('relayPlayground.healthTab.fastTitle')} (&lt; 100ms)
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('relayPlayground.healthTab.fastBody')}
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-400 font-semibold mb-2">
            <Activity className="w-5 h-5" />
            {t('relayPlayground.healthTab.okTitle')} (100-300ms)
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('relayPlayground.healthTab.okBody')}
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
            <AlertCircle className="w-5 h-5" />
            {t('relayPlayground.healthTab.slowTitle')} (&gt; 300ms)
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('relayPlayground.healthTab.slowBody')}
          </p>
        </div>
      </div>
    </div>
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
  const { t } = useTranslation();
  const [selectedNIP, setSelectedNIP] = useState<number | null>(null);

  const getNIPSupportCount = (nip: number) => {
    return relays.filter(r => r.supportedNIPs.includes(nip)).length;
  };

  const getSupportPercentage = (nip: number) => {
    return Math.round((getNIPSupportCount(nip) / relays.length) * 100);
  };

  return (
    <div className="space-y-6 animate-slide-up motion-reduce:animate-none">
      {/* What are NIPs? */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          {t('relayPlayground.nipsTab.description')}
        </div>
      </div>

      {/* NIP Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {allSupportedNIPs.map((nip) => {
          const supportCount = getNIPSupportCount(nip);
          const percentage = getSupportPercentage(nip);
          
          return (
            <button
              key={nip}
              onClick={() => setSelectedNIP(selectedNIP === nip ? null : nip)}
              className={cn(
                "p-3 rounded-xl border text-start transition-all",
                "hover:scale-105 active:scale-95 motion-reduce:transform-none",
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
                {nipName(nip, t)}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {t('relayPlayground.nipsTab.relayCount')
                  .replace('{count}', String(supportCount))
                  .replace('{total}', String(relays.length))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected NIP Details */}
      {selectedNIP && (
          <div className="bg-gray-100/50 dark:bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-slide-down motion-reduce:animate-none">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">NIP-{selectedNIP}</h3>
                <p className="text-purple-400">{nipName(selectedNIP, t)}</p>
              </div>
              <button
                onClick={() => setSelectedNIP(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('relayPlayground.nipsTab.supportedBy')}</h4>
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('relayPlayground.nipsTab.notSupportedBy')}</h4>
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
                    {t('relayPlayground.nipsTab.andMore').replace(
                      '{count}',
                      String(relays.filter(r => !r.supportedNIPs.includes(selectedNIP)).length - 10)
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Common NIPs */}
      <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('relayPlayground.nipsTab.title')}</h3>
        <div className="space-y-3">
          {[1, 2, 9, 11, 17, 40, 42].map((nip) => (
            <div key={nip} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-12 font-mono text-gray-600 dark:text-gray-400">NIP-{nip}</span>
                <span className="text-gray-700 dark:text-gray-300">{nipName(nip, t)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${getSupportPercentage(nip)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-end">
                  {getSupportPercentage(nip)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Event Stream Viewer Component
function EventStreamViewer({
  relays,
}: {
  relays: Relay[];
}) {
  const { t } = useTranslation();
  const maxEventsId = useId();
  const [selectedRelay, setSelectedRelay] = useState<Relay | null>(null);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedKinds, setSelectedKinds] = useState<number[]>([1]);
  const [maxEvents, setMaxEvents] = useState(50);
  const [issue, setIssue] = useState<RelayIssue | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const subscriptionRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  // Set while the reader presses Stop, so a close we asked for is not reported
  // back to them as a failure.
  const manualStopRef = useRef(false);

  // Kind numbers are protocol values; their names come from i18n.
  const EVENT_KINDS = [0, 1, 6, 7];

  const startStreaming = useCallback(() => {
    if (!selectedRelay) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    setIssue(null);
    setIsStreaming(true);
    manualStopRef.current = false;

    try {
      const ws = new WebSocket(selectedRelay.url);
      wsRef.current = ws;
      const subId = `stream-${Date.now()}`;
      subscriptionRef.current = subId;

      // Whatever ends the stream ends it once, and says why.
      let heardBack = false;
      let stopped = false;
      const stop = (failure?: RelayIssue) => {
        if (stopped) return;
        stopped = true;
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (failure) setIssue(failure);
        setIsStreaming(false);
        try {
          ws.close();
        } catch {
          // Already closing.
        }
      };

      timerRef.current = window.setTimeout(() => {
        if (!heardBack) stop({ code: "timedOut" });
      }, SUBSCRIPTION_TIMEOUT_MS);

      ws.onopen = () => {
        ws.send(JSON.stringify(["REQ", subId, { kinds: selectedKinds, limit: maxEvents }]));
      };

      ws.onmessage = (event) => {
        let data: unknown[];
        try {
          data = JSON.parse(event.data);
        } catch (e) {
          console.error("Failed to parse event:", e);
          return;
        }
        if (!Array.isArray(data)) return;

        if (data[0] === "EVENT" && data[1] === subId) {
          heardBack = true;
          const nostrEvent: NostrEvent = data[2] as NostrEvent;
          setEvents(prev => {
            const newEvents = [{
              event: nostrEvent,
              relayName: selectedRelay.name,
              relayUrl: selectedRelay.url,
              receivedAt: new Date(),
            }, ...prev];
            return newEvents.slice(0, maxEvents);
          });
        } else if (data[0] === "EOSE") {
          // Stored events are done; the stream stays open for live ones.
          heardBack = true;
        } else if (data[0] === "CLOSED") {
          stop({ code: "subscriptionRefused", detail: relayReason(data) });
        } else if (data[0] === "NOTICE" && !heardBack) {
          stop({ code: "subscriptionRefused", detail: relayReason(data) });
        }
      };

      ws.onclose = () => {
        if (manualStopRef.current) {
          stop();
          return;
        }
        stop(heardBack ? { code: "closedEarly" } : { code: "connectionFailed" });
      };
      ws.onerror = () => stop({ code: "connectionFailed" });
    } catch {
      setIsStreaming(false);
      setIssue({ code: "connectionFailed" });
    }
  }, [selectedRelay, selectedKinds, maxEvents]);

  const stopStreaming = useCallback(() => {
    manualStopRef.current = true;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (wsRef.current) {
      if (subscriptionRef.current && wsRef.current.readyState === WebSocket.OPEN) {
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
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (wsRef.current) {
        if (subscriptionRef.current) {
          try {
            wsRef.current.send(JSON.stringify(["CLOSE", subscriptionRef.current]));
          } catch (e) {
            // Ignore errors when closing
          }
        }
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6 animate-slide-up motion-reduce:animate-none">
      {/* Educational Banner */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            {t('relayPlayground.eventsTab.description')}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-700 space-y-4">
        {/* Relay Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('relayPlayground.connectionTab.selectRelay')}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {relays.slice(0, 8).map((relay) => (
              <button
                key={relay.id}
                type="button"
                aria-pressed={selectedRelay?.id === relay.id}
                onClick={() => {
                  if (isStreaming) stopStreaming();
                  setIssue(null);
                  setSelectedRelay(relay);
                }}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all text-start",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  selectedRelay?.id === relay.id
                    ? "bg-primary-600 text-white"
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
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('relayPlayground.queryTab.kinds')}</label>
          <div className="flex flex-wrap gap-2">
            {EVENT_KINDS.map((kind) => (
              <button
                key={kind}
                onClick={() => !isStreaming && toggleKind(kind)}
                disabled={isStreaming}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedKinds.includes(kind)
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-600 dark:text-gray-400",
                  isStreaming && "opacity-50 cursor-not-allowed"
                )}
              >
                <Hash className="w-4 h-4" />
                {t(`relayPlayground.kinds.${kind}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Max Events */}
        <div>
          <label htmlFor={maxEventsId} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t('relayPlayground.queryTab.limit')}: {maxEvents}
          </label>
          <input
            id={maxEventsId}
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
              {t('relayPlayground.buttons.connect')}
            </button>
          ) : (
            <button
              onClick={stopStreaming}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium"
            >
              <Pause className="w-5 h-5" />
              {t('relayPlayground.buttons.disconnect')}
            </button>
          )}
          <button
            onClick={() => setEvents([])}
            className="flex items-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Trash2 className="w-5 h-5" />
            {t('relayPlayground.buttons.clear')}
          </button>
        </div>
      </div>

      {/* Why the stream produced nothing, when it produced nothing. */}
      {issue && <RelayIssueNotice issue={issue} />}

      {/* Events Display */}
      <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {t('relayPlayground.eventsTab.title')} ({events.length})
          </h3>
          {isStreaming && (
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {t('relayPlayground.status.online')}
            </div>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>{t('relayPlayground.eventsTab.noEvents')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {events.map((evt, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-100/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-xs">
                      {t('relayPlayground.eventsTab.kind')} {evt.event.kind}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(evt.event.created_at * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{evt.event.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('relayPlayground.eventsTab.author')}: {evt.event.pubkey.slice(0, 16)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Query Tester Component
function QueryTester({
  relays,
}: {
  relays: Relay[];
}) {
  const { t } = useTranslation();
  const relaySelectId = useId();
  const limitId = useId();
  const [selectedRelay, setSelectedRelay] = useState<Relay | null>(null);
  const [queryKinds, setQueryKinds] = useState<number[]>([1]);
  const [limit, setLimit] = useState(10);
  const [isQuerying, setIsQuerying] = useState(false);
  const [results, setResults] = useState<NostrEvent[]>([]);
  const [showRaw, setShowRaw] = useState(false);
  const [issue, setIssue] = useState<RelayIssue | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<number | null>(null);

  // Kind numbers are protocol values; their names come from i18n.
  const EVENT_KINDS = [0, 1, 3, 6, 7, 9735];

  const runQuery = useCallback(() => {
    if (!selectedRelay) return;
    if (wsRef.current) wsRef.current.close();

    setIsQuerying(true);
    setResults([]);
    setIssue(null);

    try {
      const ws = new WebSocket(selectedRelay.url);
      wsRef.current = ws;
      const subId = `query-${Date.now()}`;
      const filter = { kinds: queryKinds, limit };

      const newResults: NostrEvent[] = [];
      let done = false;

      // One exit for every outcome: EOSE, a refusal, a drop, or silence.
      const finish = (failure?: RelayIssue) => {
        if (done) return;
        done = true;
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setIsQuerying(false);
        if (failure) setIssue(failure);
        try {
          ws.close();
        } catch {
          // Already closing.
        }
      };

      timerRef.current = window.setTimeout(
        () => finish(newResults.length > 0 ? undefined : { code: "timedOut" }),
        SUBSCRIPTION_TIMEOUT_MS,
      );

      ws.onopen = () => {
        ws.send(JSON.stringify(["REQ", subId, filter]));
      };

      ws.onmessage = (event) => {
        let data: unknown[];
        try {
          data = JSON.parse(event.data);
        } catch (e) {
          console.error("Parse error:", e);
          return;
        }
        if (!Array.isArray(data)) return;

        if (data[0] === "EVENT" && data[1] === subId) {
          newResults.push(data[2] as NostrEvent);
          setResults([...newResults]);
        } else if (data[0] === "EOSE") {
          finish();
        } else if (data[0] === "CLOSED" || data[0] === "NOTICE") {
          finish(
            newResults.length > 0
              ? undefined
              : { code: "subscriptionRefused", detail: relayReason(data) },
          );
        }
      };

      ws.onclose = () =>
        finish(newResults.length > 0 ? undefined : { code: "closedEarly" });
      ws.onerror = () => finish({ code: "connectionFailed" });
    } catch {
      setIsQuerying(false);
      setIssue({ code: "connectionFailed" });
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
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6 animate-slide-up motion-reduce:animate-none">
      {/* Educational Banner */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            {t('relayPlayground.queryTab.description')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Builder */}
        <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('relayPlayground.queryTab.title')}</h3>

          {/* Relay */}
          <div className="mb-4">
            <label htmlFor={relaySelectId} className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('relayPlayground.connectionTab.selectRelay')}</label>
            <select
              id={relaySelectId}
              value={selectedRelay?.id || ""}
              onChange={(e) => {
                setIssue(null);
                setSelectedRelay(relays.find(r => r.id === e.target.value) || null);
              }}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">{t('relayPlayground.queryTab.chooseRelay')}</option>
              {relays.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.latency}ms)</option>
              ))}
            </select>
          </div>

          {/* Kinds */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('relayPlayground.queryTab.kinds')}</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_KINDS.map(kind => (
                <button
                  key={kind}
                  onClick={() => toggleKind(kind)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all",
                    queryKinds.includes(kind)
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-600 dark:text-gray-400"
                  )}
                >
                  {t(`relayPlayground.kinds.${kind}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Limit */}
          <div className="mb-4">
            <label htmlFor={limitId} className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('relayPlayground.queryTab.limit')}: {limit}</label>
            <input
              id={limitId}
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
                <Loader2 className="w-5 h-5 animate-spin" /> {t('relayPlayground.buttons.checking')}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> {t('relayPlayground.queryTab.execute')}
              </span>
            )}
          </button>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">{t('relayPlayground.queryTab.results')}: <strong className="text-gray-900 dark:text-white">{results.length}</strong></span>
            <button
              type="button"
              onClick={() => setShowRaw(!showRaw)}
              aria-pressed={showRaw}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                showRaw ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              )}
            >
              {showRaw ? t('relayPlayground.buttons.hideJson') : t('relayPlayground.buttons.showJson')}
            </button>
          </div>

          {/* Raw JSON: the events that came back, which is what the toggle sits
              next to. Shown even when the answer is an empty list. */}
          {showRaw && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 overflow-x-auto">
              <pre className="text-xs text-gray-700 dark:text-gray-300">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}

          {/* Why the query came back empty, when it did */}
          {issue && (
            <div className="mb-4">
              <RelayIssueNotice issue={issue} />
            </div>
          )}

          {/* Results List */}
          <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-xl border border-gray-700 max-h-[500px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {/* An empty answer and a failed query are not the same thing,
                    so the empty-state line stands down when there is an error. */}
                {!issue && <p>{t('relayPlayground.queryTab.noResults')}</p>}
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {results.map((evt, idx) => (
                  <div key={idx} className="p-4 hover:bg-gray-100/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-xs">
                        {t('relayPlayground.eventsTab.kind')} {evt.kind}
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
    </div>
  );
}
