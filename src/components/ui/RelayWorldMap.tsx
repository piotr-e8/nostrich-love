import React from "react";
import { Globe, Signal, Server } from "lucide-react";
import { cn } from "../../lib/utils";

interface Relay {
  url: string;
  location?: string;
  latency?: number;
  status?: "online" | "offline" | "degraded";
}

interface RelayWorldMapProps {
  relays?: Relay[];
  className?: string;
}

const DEFAULT_RELAYS: Relay[] = [
  { url: "wss://relay.damus.io", location: "US East", status: "online" },
  { url: "wss://nos.lol", location: "US West", status: "online" },
  { url: "wss://relay.snort.social", location: "Europe", status: "online" },
  { url: "wss://nostr.wine", location: "US East", status: "online" },
  { url: "wss://relay.current.fyi", location: "Asia", status: "online" },
];

export function RelayWorldMap({
  relays = DEFAULT_RELAYS,
  className,
}: RelayWorldMapProps) {
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
        "bg-gray-100 dark:bg-gray-800/30 border border-border-dark rounded-2xl p-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Globe className="w-6 h-6 text-primary-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Relay Network</h3>
          <p className="text-sm text-gray-400">
            {relays.filter((r) => r.status === "online").length} of{" "}
            {relays.length} relays online
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

        {/* Relay nodes */}
        <div className="absolute top-[35%] left-[20%] flex flex-col items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          <span className="mt-2 text-xs text-gray-400">US East</span>
        </div>

        <div className="absolute top-[30%] left-[50%] flex flex-col items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          <span className="mt-2 text-xs text-gray-400">Europe</span>
        </div>

        <div className="absolute top-[45%] left-[80%] flex flex-col items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          <span className="mt-2 text-xs text-gray-400">Asia</span>
        </div>

        <div className="absolute top-[60%] left-[15%] flex flex-col items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
          <span className="mt-2 text-xs text-gray-400">US West</span>
        </div>
      </div>

      {/* Relay List */}
      <div className="space-y-2">
        {relays.map((relay, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-50 dark:bg-gray-900/50 rounded-lg"
          >
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                getStatusColor(relay.status),
              )}
            />
            <Server className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-300 font-mono truncate">
              {relay.url.replace("wss://", "")}
            </span>
            {relay.location && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Signal className="w-3 h-3" />
                {relay.location}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
