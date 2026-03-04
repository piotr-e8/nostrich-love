import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export function RelayFeedBrowser({ className }: RelayFeedBrowserProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<RelayCategory | "all">("all");
  const [selectedRelay, setSelectedRelay] = useState<TopicalRelay | null>(null);
  const [viewingRelay, setViewingRelay] = useState<TopicalRelay | null>(null);
  const [events, setEvents] = useState<RelayFeedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const filteredRelays = selectedCategory === "all" ? TOPICAL_RELAYS : TOPICAL_RELAYS.filter((relay) => relay.category === selectedCategory);

  const handleViewFeed = (relay: TopicalRelay) => {
    setViewingRelay(relay);
    setIsLoading(true);
    
    const ws = new WebSocket(relay.url);
    wsRef.current = ws;
    
    ws.onopen = () => {
      ws.send(JSON.stringify(["REQ", "feed", { kinds: [1], limit: 20 }]));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data[0] === "EVENT") {
        setEvents(prev => [...prev, { event: data[2], relayName: relay.name, relayUrl: relay.url, receivedAt: new Date() }]);
      } else if (data[0] === "EOSE") {
        setIsLoading(false);
        ws.close();
      }
    };
    
    ws.onerror = () => {
      setIsLoading(false);
    };
  };

  const stopViewing = () => {
    if (wsRef.current) wsRef.current.close();
    setViewingRelay(null);
    setEvents([]);
  };

  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900", className)}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="h-6 w-6 text-orange-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t("relayFeedBrowser.title") || "Browse Relay Feeds"}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("relayFeedBrowser.subtitle") || "Discover Nostr communities by browsing relay feeds"}
        </p>
      </div>

      {viewingRelay && (
        <div className="mb-6 border border-orange-200 rounded-xl overflow-hidden">
          <div className="p-4 bg-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-semibold">{viewingRelay.name}</h4>
                <p className="text-xs text-gray-500">{events.length} events</p>
              </div>
            </div>
            <button onClick={stopViewing} className="p-2 hover:bg-orange-200 rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : (
              <div className="divide-y">
                {events.map((evt, idx) => (
                  <div key={idx} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-orange-100 text-xs rounded-full">
                        {evt.event.pubkey.slice(0, 8)}...
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(evt.event.created_at * 1000).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{evt.event.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedCategory("all")} className={cn("px-3 py-1.5 rounded-full text-sm font-medium", selectedCategory === "all" ? "bg-orange-500 text-white" : "bg-gray-100")}>All</button>
        {RELAY_CATEGORIES.map((category) => (
          <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={cn("px-3 py-1.5 rounded-full text-sm font-medium", selectedCategory === category.id ? "bg-orange-500 text-white" : "bg-gray-100")}>
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredRelays.map((relay) => (
          <div key={relay.id} className="p-4 border rounded-xl flex items-center justify-between">
            <div>
              <h5 className="font-semibold">{relay.name}</h5>
              <p className="text-sm text-gray-600">{relay.description}</p>
            </div>
            <button onClick={() => handleViewFeed(relay)} disabled={viewingRelay?.id === relay.id} className={cn("px-3 py-2 rounded-lg text-sm font-medium", viewingRelay?.id === relay.id ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700")}>
              {viewingRelay?.id === relay.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "View Feed"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
