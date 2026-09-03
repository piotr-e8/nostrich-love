import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

interface Relay {
  id: string;
  url: string;
  name: string;
  status: "connected" | "connecting" | "disconnected";
  latency?: number;
  users?: number;
}

interface RelayVisualizerProps {
  relays?: Relay[];
  userNpub?: string;
  className?: string;
  onRelayToggle?: (relayId: string) => void;
}

// Demo relays for standalone usage
const DEMO_RELAYS: Relay[] = [
  {
    id: "relay-damus",
    url: "wss://relay.damus.io",
    name: "Damus",
    status: "connected",
    latency: 45,
    users: 15000,
  },
  {
    id: "relay-nos",
    url: "wss://nos.lol",
    name: "Nos",
    status: "connected",
    latency: 62,
    users: 8200,
  },
  {
    id: "relay-snort",
    url: "wss://relay.snort.social",
    name: "Snort",
    status: "disconnected",
    latency: undefined,
    users: undefined,
  },
];

export function RelayVisualizer({
  relays: propRelays,
  userNpub = "npub1demo...",
  className,
  onRelayToggle,
}: RelayVisualizerProps) {
  const { t } = useTranslation();
  // Use provided relays or demo data
  const [relays, setRelays] = useState<Relay[]>(propRelays || DEMO_RELAYS);

  // Update relays if props change
  useEffect(() => {
    if (propRelays) {
      setRelays(propRelays);
    }
  }, [propRelays]);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);
  const [dataPackets, setDataPackets] = useState<
    Array<{ id: string; relayId: string; progress: number }>
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Add new data packets for connected relays
      const connectedRelays = relays.filter((r) => r.status === "connected");
      if (connectedRelays.length > 0 && Math.random() > 0.7) {
        const randomRelay =
          connectedRelays[Math.floor(Math.random() * connectedRelays.length)];
        const newPacket = {
          id: Math.random().toString(36).substr(2, 9),
          relayId: randomRelay.id,
          progress: 0,
        };
        setDataPackets((prev) => [...prev, newPacket]);
      }

      // Update packet progress
      setDataPackets((prev) =>
        prev
          .map((packet) => ({ ...packet, progress: packet.progress + 5 }))
          .filter((packet) => packet.progress < 100),
      );
    }, 100);

    return () => clearInterval(interval);
  }, [relays]);

  useEffect(() => {
    setActiveConnections(
      relays.filter((r) => r.status === "connected").map((r) => r.id),
    );
  }, [relays]);

  const getStatusColor = (status: Relay["status"]) => {
    switch (status) {
      case "connected":
        return "bg-success-500";
      case "connecting":
        return "bg-warning-500";
      case "disconnected":
        return "bg-danger-500";
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <h3 className="mb-6 text-h3 text-gray-900 dark:text-white">
        {t('relayVisualizer.title')}
      </h3>

      {/* Visual Diagram */}
      <div className="relative mb-8 flex flex-col items-center gap-8">
        {/* User Node */}
        <div className="relative">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors duration-300 motion-reduce:transition-none",
              activeConnections.length > 0
                ? "border-success-500 bg-success-50 text-success-800 dark:bg-success-950 dark:text-success-300"
                : "border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800",
            )}
          >
            <span className="text-caption font-semibold">{t('nostrSimulator.nodes.user')}</span>
          </div>
          {activeConnections.length > 0 && (
            <div className="absolute inset-0 animate-ping-slow rounded-full border-2 border-success-500 opacity-30 motion-reduce:animate-none" />
          )}
        </div>

        {/* Connection Lines */}
        <div className="relative flex flex-wrap justify-center gap-8">
          {relays.map((relay) => (
            <div
              key={relay.id}
              className="relative flex flex-col items-center gap-4"
            >
              {/* Connection Line */}
              <div className="relative h-12 w-0.5 overflow-hidden bg-gray-200 dark:bg-gray-700">
                {relay.status === "connected" && (
                  <div className="absolute inset-0 bg-success-500 opacity-40" />
                )}
                {/* Data Packets */}
                {dataPackets
                  .filter((p) => p.relayId === relay.id)
                  .map((packet) => (
                    <div
                      key={packet.id}
                      className="absolute inset-x-0 mx-auto h-2 w-2 rounded-full bg-success-500"
                      style={{ top: `${packet.progress}%` }}
                    />
                  ))}
              </div>

              {/* Relay Node */}
              <button
                onClick={() => onRelayToggle?.(relay.id)}
                className={cn(
                  "group relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:border-gray-300 dark:hover:border-gray-700",
                  relay.status === "connected"
                    ? "border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-950"
                    : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800",
                )}
              >
                <div
                  className={cn(
                    "h-3 w-3 rounded-full",
                    getStatusColor(relay.status),
                  )}
                >
                  {relay.status === "connecting" && (
                    <div className="h-full w-full animate-pulse rounded-full" />
                  )}
                  {relay.status === "connected" && (
                    <div className="absolute inset-0 animate-ping rounded-full opacity-30" />
                  )}
                </div>
                <span className="text-caption font-medium text-gray-700 dark:text-gray-300">
                  {relay.name}
                </span>
                {relay.latency && (
                  <span className="text-micro text-gray-500 dark:text-gray-400">
                    {relay.latency}ms
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Relay List */}
      <div className="space-y-2">
        {relays.map((relay) => (
          <div
            key={relay.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  getStatusColor(relay.status),
                )}
              />
              <div>
                <p className="text-body-sm font-medium text-gray-900 dark:text-white">
                  {relay.url}
                </p>
                {relay.users && (
                  <p className="text-caption text-gray-500 dark:text-gray-400">
                    {relay.users.toLocaleString()} {t('relayVisualizer.labels.connections')}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onRelayToggle?.(relay.id)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-caption font-medium transition-colors",
                relay.status === "connected"
                  ? "border-danger-200 text-danger-800 hover:bg-danger-50 dark:border-danger-900 dark:text-danger-300 dark:hover:bg-danger-950"
                  : "border-success-200 text-success-800 hover:bg-success-50 dark:border-success-900 dark:text-success-300 dark:hover:bg-success-950",
              )}
            >
              {relay.status === "connected" ? t('relayVisualizer.controls.disconnect') : t('relayVisualizer.controls.connect')}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-body-sm text-gray-500 dark:text-gray-400">
        {activeConnections.length === 0 ? (
          <span className="text-danger-700 dark:text-danger-400">{t('relayExplorer.card.status.offline')}</span>
        ) : (
          <span className="text-success-800 dark:text-success-400">
            {t('relayVisualizer.labels.relayCount').replace('{count}', String(activeConnections.length))}
          </span>
        )}
      </div>
    </div>
  );
}
