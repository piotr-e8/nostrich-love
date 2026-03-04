import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Newspaper,
  Filter,
  ExternalLink,
  Info,
  CheckCircle2,
  Users,
  Sparkles,
  Play,
  Pause,
  Loader2,
  Clock,
  Hash,
  MessageSquare,
  Eye,
  X,
  RefreshCw,
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

  const filteredRelays =
    selectedCategory === "all"
      ? TOPICAL_RELAYS
      : TOPICAL_RELAYS.filter((relay) => relay.category === selectedCategory);

  const featuredRelays = TOPICAL_RELAYS.filter((relay) => relay.featured);

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="h-6 w-6 text-orange-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t("relayFeedBrowser.title") || "Browse Relay Feeds"}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("relayFeedBrowser.subtitle") ||
            "Discover Nostr communities by browsing relay feeds"}
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("relayFeedBrowser.filterByCategory") || "Filter by Category"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              selectedCategory === "all"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            )}
          >
            {t("relayFeedBrowser.categories.all") || "All"}
          </button>
          {RELAY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                selectedCategory === category.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Relay List */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-500" />
          {selectedCategory === "all"
            ? t("relayFeedBrowser.allRelays") || "All Relays"
            : RELAY_CATEGORIES.find((c) => c.id === selectedCategory)?.label || "Relays"}
        </h4>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-3"
          >
            {filteredRelays.length > 0 ? (
              filteredRelays.map((relay) => (
                <RelayCard
                  key={relay.id}
                  relay={relay}
                  isSelected={selectedRelay?.id === relay.id}
                  isViewing={viewingRelay?.id === relay.id}
                  onClick={() => setSelectedRelay(relay)}
                  onViewFeed={() => handleViewFeed(relay)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>{t("relayFeedBrowser.noRelays") || "No relays found in this category"}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selected Relay Details */}
      {selectedRelay && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-4 bg-orange-50 dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-gray-700"
        >
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {selectedRelay.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {selectedRelay.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedRelay.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
          <code className="block p-2 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono text-gray-700 dark:text-gray-300 mb-3">
            {selectedRelay.url}
          </code>
          <a
            href={`/${t('locale') || 'en'}/guides/relay-management`}
            className="inline-flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 hover:underline"
          >
            {t("relayFeedBrowser.howToAdd") || "How to add this relay to your client"}
            <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>
      )}

      {/* Recommended Clients */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-500" />
          {t("relayFeedBrowser.recommendedClients") || "Clients with Relay Browsing"}
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {RELAY_BROWSING_CLIENTS.slice(0, 4).map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          {t("relayFeedBrowser.moreClients") || "And more..."}
        </p>
      </div>
    </div>
  );
}

function RelayCard({
  relay,
  isSelected,
  isViewing,
  onClick,
  onViewFeed,
}: {
  relay: TopicalRelay;
  isSelected: boolean;
  isViewing: boolean;
  onClick: () => void;
  onViewFeed: () => void;
}) {
  const category = RELAY_CATEGORIES.find((c) => c.id === relay.category);

  return (
    <motion.div
      className={cn(
        "w-full p-4 rounded-xl border transition-all",
        isSelected
          ? "border-orange-500 bg-orange-50 dark:bg-gray-800"
          : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div 
          className="flex-1 cursor-pointer"
          onClick={onClick}
        >
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-semibold text-gray-900 dark:text-gray-100">
              {relay.name}
            </h5>
            {relay.verified && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {relay.featured && (
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                Featured
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {relay.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
              {category?.label || relay.category}
            </span>
            {relay.tags.slice(0, 3).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewFeed();
          }}
          disabled={isViewing}
          className={cn(
            "flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            isViewing
              ? "bg-orange-500 text-white cursor-default"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800"
          )}
        >
          {isViewing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              View Feed
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function ClientCard({ client }: { client: ClientWithRelaySupport }) {
  const platformIcons: Record<string, string> = {
    web: "🌐",
    desktop: "💻",
    ios: "📱",
    android: "📱",
  };

  return (
    <a
      href={client.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors bg-white dark:bg-gray-900"
    >
      <span className="text-2xl">{platformIcons[client.platform] || "🌐"}</span>
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {client.name}
        </h5>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {client.platform} • {client.features.length} features
        </p>
      </div>
      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
    </a>
  );
}
