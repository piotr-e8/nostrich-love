import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface Relay {
  id: string;
  url: string;
  name: string;
  status: "connected" | "connecting" | "disconnected";
  latency?: number;
  users?: number;
}

interface RelayVisualizerProps {
  relays: Relay[];
  userNpub: string;
  className?: string;
  onRelayToggle?: (relayId: string) => void;
}

export function RelayVisualizer({
  relays = [],
  userNpub = "",
  className,
  onRelayToggle,
}: RelayVisualizerProps) {
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
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-red-500";
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900",
        className,
      )}
    >
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        Relay Network
      </h3>

      {/* Visual Diagram */}
      <div className="relative mb-8 flex flex-col items-center gap-8">
        {/* User Node */}
        <div className="relative">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full border-4 transition-all duration-300",
              activeConnections.length > 0
                ? "border-green-500 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-800",
            )}
          >
            <span className="text-xs font-bold">YOU</span>
          </div>
          {activeConnections.length > 0 && (
            <div className="absolute inset-0 animate-ping-slow rounded-full border-2 border-green-500 opacity-30" />
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
                  <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-transparent opacity-50" />
                )}
                {/* Data Packets */}
                {dataPackets
                  .filter((p) => p.relayId === relay.id)
                  .map((packet) => (
                    <div
                      key={packet.id}
                      className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-green-400"
                      style={{ top: `${packet.progress}%` }}
                    />
                  ))}
              </div>

              {/* Relay Node */}
              <button
                onClick={() => onRelayToggle?.(relay.id)}
                className={cn(
                  "group relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
                  relay.status === "connected"
                    ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
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
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {relay.name}
                </span>
                {relay.latency && (
                  <span className="text-[10px] text-gray-500">
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
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  getStatusColor(relay.status),
                )}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {relay.url}
                </p>
                {relay.users && (
                  <p className="text-xs text-gray-500">
                    {relay.users.toLocaleString()} users connected
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onRelayToggle?.(relay.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                relay.status === "connected"
                  ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                  : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300",
              )}
            >
              {relay.status === "connected" ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        {activeConnections.length === 0 ? (
          <span className="text-red-500">Not connected to any relays</span>
        ) : (
          <span className="text-green-600">
            Connected to {activeConnections.length} relay
            {activeConnections.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
