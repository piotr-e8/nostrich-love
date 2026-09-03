import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Globe,
  Newspaper,
  Filter,
  ExternalLink,
  Info,
  CheckCircle2,
  Sparkles,
  Play,
  Loader2,
  Clock,
  MessageSquare,
  Eye,
  X,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import {
  TOPICAL_RELAYS,
  RELAY_CATEGORIES,
  type RelayCategory,
  type TopicalRelay,
} from "../../data/topical-relays";
import {
  RELAY_BROWSING_CLIENTS,
  type ClientWithRelaySupport,
} from "../../data/relay-browsing-clients";

interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

interface RelayFeedEvent {
  event: NostrEvent;
  relayName: string;
  relayUrl: string;
  receivedAt: Date;
}

interface RelayFeedBrowserProps {
  className?: string;
}

type FeedErrorCode = "connectFailed" | "loadMoreFailed" | "timedOut" | "refused";

// A relay that answers but never sends EOSE (auth-gated ones do this) would
// otherwise spin forever, so every request gets a deadline.
const FEED_TIMEOUT_MS = 10000;

interface FeedError {
  code: FeedErrorCode;
  // Whatever the relay itself said in CLOSED or NOTICE. Server text, never
  // translated, shown verbatim under the localized sentence.
  detail?: string;
}

// CLOSED and NOTICE carry a human-readable reason in different slots.
function reasonFrom(frame: unknown[]): string | undefined {
  const candidate = frame[0] === "NOTICE" ? frame[1] : frame[2];
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : undefined;
}

export function RelayFeedBrowser({ className }: RelayFeedBrowserProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<RelayCategory | "all">("all");
  const [selectedRelay, setSelectedRelay] = useState<TopicalRelay | null>(null);
  const [viewingRelay, setViewingRelay] = useState<TopicalRelay | null>(null);
  const [events, setEvents] = useState<RelayFeedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [oldestTimestamp, setOldestTimestamp] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  // The error is held as a code, not as a message: the text is resolved through
  // t() at render time, so it follows the reader's language.
  const [error, setError] = useState<FeedError | null>(null);
  const [copied, setCopied] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<number | null>(null);

  const filteredRelays = selectedCategory === "all" ? TOPICAL_RELAYS : TOPICAL_RELAYS.filter((relay) => relay.category === selectedCategory);

  // Drop the handlers before closing, so a socket we abandoned cannot come back
  // later and write its results over whatever the reader is looking at now.
  const closeSocket = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const ws = wsRef.current;
    if (!ws) return;
    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;
    ws.close();
    wsRef.current = null;
  }, []);

  const handleViewFeed = (relay: TopicalRelay) => {
    closeSocket();

    setViewingRelay(relay);
    setIsLoading(true);
    setError(null);
    setEvents([]);
    setOldestTimestamp(null);
    setHasMore(true);

    let ws: WebSocket;
    try {
      ws = new WebSocket(relay.url);
    } catch {
      setIsLoading(false);
      setError({ code: "connectFailed" });
      return;
    }
    wsRef.current = ws;

    const receivedEvents: RelayFeedEvent[] = [];
    // Every path out of the spinner runs through settle() exactly once, so a
    // relay that errors after EOSE (or never answers at all) cannot leave the
    // reader looking at a spinner.
    let settled = false;

    const done = (failure?: FeedError) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      setIsLoading(false);
      if (failure) {
        setError(failure);
        setHasMore(false);
      } else {
        setEvents(receivedEvents);
        if (receivedEvents.length > 0) {
          const oldest = Math.min(...receivedEvents.map((e) => e.event.created_at));
          setOldestTimestamp(oldest);
          setHasMore(receivedEvents.length >= 20);
        } else {
          setHasMore(false);
        }
      }
      try {
        ws.close();
      } catch {
        // Already closing; nothing to do.
      }
    };

    // Whatever arrived before the deadline is worth showing; nothing at all is
    // a failure the reader needs told.
    const timer = window.setTimeout(
      () => done(receivedEvents.length > 0 ? undefined : { code: "timedOut" }),
      FEED_TIMEOUT_MS,
    );
    timerRef.current = timer;

    ws.onopen = () => {
      ws.send(JSON.stringify(["REQ", "feed", { kinds: [1], limit: 20 }]));
    };

    ws.onmessage = (event) => {
      let data: unknown[];
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (!Array.isArray(data)) return;

      if (data[0] === "EVENT") {
        const evt = data[2] as NostrEvent;
        receivedEvents.push({ event: evt, relayName: relay.name, relayUrl: relay.url, receivedAt: new Date() });
      } else if (data[0] === "EOSE") {
        done();
      } else if (data[0] === "CLOSED" || data[0] === "NOTICE") {
        // The relay is turning the subscription down. If posts already came
        // through, keep them; otherwise say why we have nothing.
        done(
          receivedEvents.length > 0
            ? undefined
            : { code: "refused", detail: reasonFrom(data) },
        );
      }
    };

    ws.onerror = () => done({ code: "connectFailed" });

    ws.onclose = () =>
      done(receivedEvents.length > 0 ? undefined : { code: "connectFailed" });
  };

  const handleLoadMore = () => {
    if (!viewingRelay || !oldestTimestamp) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    let ws: WebSocket;
    try {
      ws = new WebSocket(viewingRelay.url);
    } catch {
      setIsLoadingMore(false);
      setError({ code: "loadMoreFailed" });
      return;
    }
    wsRef.current = ws;

    const newEvents: RelayFeedEvent[] = [];
    let settled = false;

    const done = (failed: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      setIsLoadingMore(false);
      if (failed) {
        setError({ code: "loadMoreFailed" });
      } else if (newEvents.length > 0) {
        setEvents((prev) => [...prev, ...newEvents]);
        const oldest = Math.min(...newEvents.map((e) => e.event.created_at));
        setOldestTimestamp(oldest);
        setHasMore(newEvents.length >= 20);
      } else {
        setHasMore(false);
      }
      try {
        ws.close();
      } catch {
        // Already closing; nothing to do.
      }
    };

    const timer = window.setTimeout(() => done(newEvents.length === 0), FEED_TIMEOUT_MS);
    timerRef.current = timer;

    ws.onopen = () => {
      ws.send(JSON.stringify(["REQ", "feed-more", { kinds: [1], limit: 20, until: oldestTimestamp - 1 }]));
    };

    ws.onmessage = (event) => {
      let data: unknown[];
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (!Array.isArray(data)) return;

      if (data[0] === "EVENT") {
        const evt = data[2] as NostrEvent;
        newEvents.push({ event: evt, relayName: viewingRelay.name, relayUrl: viewingRelay.url, receivedAt: new Date() });
      } else if (data[0] === "EOSE") {
        done(false);
      } else if (data[0] === "CLOSED" || data[0] === "NOTICE") {
        done(newEvents.length === 0);
      }
    };

    ws.onerror = () => done(true);

    ws.onclose = () => done(newEvents.length === 0);
  };

  const handleCopyUrl = () => {
    if (viewingRelay) {
      navigator.clipboard.writeText(viewingRelay.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Leaving the page mid-request should not leave a socket open behind us.
  useEffect(() => closeSocket, [closeSocket]);

  const stopViewing = () => {
    closeSocket();
    setIsLoading(false);
    setIsLoadingMore(false);
    setViewingRelay(null);
    setEvents([]);
    setOldestTimestamp(null);
    setHasMore(true);
    setError(null);
  };

  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900", className)}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="h-6 w-6 text-orange-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t("relayFeedBrowser.title")}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("relayFeedBrowser.subtitle")}
        </p>
      </div>

      {viewingRelay && (
        <div className="mb-6 border border-orange-200 dark:border-orange-900 rounded-xl overflow-hidden">
          <div className="p-4 bg-orange-100 dark:bg-orange-950">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{viewingRelay.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("relayFeedBrowser.eventCount").replace("{count}", String(events.length))}
                  </p>
                </div>
              </div>
              <button onClick={stopViewing} className="p-2 hover:bg-orange-200 dark:hover:bg-orange-900 rounded-lg">
                <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg">
              <code className="flex-1 text-xs text-gray-600 dark:text-gray-400 font-mono truncate">{viewingRelay.url}</code>
              <button onClick={handleCopyUrl} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors" title={t("relayFeedBrowser.copyUrl")}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
              </button>
            </div>
            {error && (
              <div className="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  {t(`relayFeedBrowser.errors.${error.code}`)}
                  {error.detail && (
                    <span className="mt-1 block break-all font-mono text-xs text-gray-600 dark:text-gray-400">
                      {error.detail}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto bg-white dark:bg-gray-900">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : (
              <>
                <div className="divide-y dark:divide-gray-800">
                  {events.map((evt, idx) => (
                    <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-950 text-xs rounded-full text-orange-800 dark:text-orange-300">
                          {evt.event.pubkey.slice(0, 8)}...
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(evt.event.created_at * 1000).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{evt.event.content}</p>
                    </div>
                  ))}
                </div>
                {events.length > 0 && hasMore && (
                  <div className="p-4 border-t dark:border-gray-800">
                    <button onClick={handleLoadMore} disabled={isLoadingMore} className="w-full py-2 px-4 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{t("relayFeedBrowser.loading")}</span>
                        </>
                      ) : (
                        <span>{t("relayFeedBrowser.loadMore")}</span>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedCategory("all")} className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-colors", selectedCategory === "all" ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")}>{t("relayFeedBrowser.allCategories")}</button>
        {RELAY_CATEGORIES.map((category) => (
          <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-colors", selectedCategory === category.id ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")}>
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredRelays.map((relay) => (
          <div key={relay.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between bg-white dark:bg-gray-900">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-gray-100">{relay.name}</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">{relay.description}</p>
            </div>
            <button
              type="button"
              onClick={() => handleViewFeed(relay)}
              disabled={viewingRelay?.id === relay.id && isLoading}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                viewingRelay?.id === relay.id
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900",
              )}
            >
              {/* The spinner belongs to the request, not to the selection: once
                  the feed has loaded the button goes back to being pressable. */}
              {viewingRelay?.id === relay.id && isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("relayFeedBrowser.viewFeed")
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
