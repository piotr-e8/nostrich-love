import React from "react";
import { Globe, Server } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

interface Relay {
  /** Stable id; the human-readable line lives at relayWorldMap.relays.<id>.description */
  id: string;
  url: string;
  /** Only set it when something actually measured the relay. Undefined means "not checked". */
  status?: "online" | "offline" | "degraded";
}

interface RelayWorldMapProps {
  relays?: Relay[];
  className?: string;
}

// NIP-11 fetched per host on 2026-09-02 (docs/audit-2026-09/relays-verified.md).
// wss://relay.current.fyi was in this list with status "online" and has no DNS
// record at all, so the map was telling readers a dead relay was up. The whole
// status field went with it: nothing here measures a relay, and a green dot is a
// claim about right now, not about the day somebody checked.
// Geographic labels ("US East", "Asia") went too. Every one of these hosts sits
// behind a CDN, so the server location was a guess dressed up as data.
const DEFAULT_RELAYS: Relay[] = [
  { id: "damus", url: "wss://relay.damus.io" },
  { id: "nosLol", url: "wss://nos.lol" },
  { id: "primal", url: "wss://relay.primal.net" },
  { id: "snort", url: "wss://relay.snort.social" },
];

export function RelayWorldMap({
  relays = DEFAULT_RELAYS,
  className,
}: RelayWorldMapProps) {
  const { t } = useTranslation();
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "degraded":
        return "bg-amber-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={cn(
        "bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Globe className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('relayWorldMap.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('relayWorldMap.subtitle')}
          </p>
        </div>
      </div>

      {/* Simplified World Map Visualization */}
      <div className="relative h-48 bg-white dark:bg-gray-900 rounded-xl overflow-hidden mb-6">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          <line
            x1="20%"
            y1="40%"
            x2="50%"
            y2="35%"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <line
            x1="50%"
            y1="35%"
            x2="80%"
            y2="50%"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <line
            x1="20%"
            y1="40%"
            x2="80%"
            y2="50%"
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Decorative pins. They stand for "relays run everywhere", not for the
            hosts listed below, which is why no relay name is attached to them. */}
        <div className="absolute top-[35%] left-[20%] flex flex-col items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('relayWorldMap.regions.northAmerica')}</span>
        </div>

        <div className="absolute top-[30%] left-[50%] flex flex-col items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('relayWorldMap.regions.europe')}</span>
        </div>

        <div className="absolute top-[45%] left-[80%] flex flex-col items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('relayWorldMap.regions.asia')}</span>
        </div>

        <div className="absolute top-[60%] left-[15%] flex flex-col items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('relayWorldMap.regions.northAmerica')}</span>
        </div>
      </div>

      {/* Relay List */}
      <div className="space-y-2">
        {relays.map((relay) => (
          <div
            key={relay.id}
            className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg"
          >
            {relay.status && (
              <div
                className={cn(
                  "mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0",
                  getStatusColor(relay.status),
                )}
              />
            )}
            <Server className="mt-0.5 w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-mono truncate">
                {relay.url.replace("wss://", "")}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t(`relayWorldMap.relays.${relay.id}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        {t('relayWorldMap.checkedNote')}
      </p>
    </div>
  );
}
