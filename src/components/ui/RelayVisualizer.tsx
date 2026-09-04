import React, { useState, useEffect, useRef } from "react";
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

  /**
   * The connection lines are measured, not guessed.
   *
   * They used to be three 48px vertical stubs, one per relay column: each one
   * started 32px below the user circle, ran halfway down, and stopped 16px
   * above its relay. Horizontally they sat at their own column's centre, up to
   * 100px away from the user, so the picture showed three ticks floating in a
   * gap and nothing was joined to anything. Now one svg spans the whole
   * diagram and every line runs from the bottom of the user circle to the top
   * of a relay tile, taken from the live boxes — which also survives the row
   * wrapping on a narrow screen and the mirrored order under RTL.
   */
  const diagramRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({});
  const [links, setLinks] = useState<
    Array<{ id: string; x1: number; y1: number; x2: number; y2: number }>
  >([]);

  useEffect(() => {
    const measure = () => {
      const frame = diagramRef.current;
      const user = userRef.current;
      if (!frame || !user) return;
      const box = frame.getBoundingClientRect();
      const u = user.getBoundingClientRect();
      const next = relays.flatMap((relay) => {
        const node = nodeRefs.current[relay.id];
        if (!node) return [];
        const n = node.getBoundingClientRect();
        return [
          {
            id: relay.id,
            x1: u.x + u.width / 2 - box.x,
            y1: u.bottom - box.y,
            x2: n.x + n.width / 2 - box.x,
            y2: n.y - box.y,
          },
        ];
      });
      setLinks(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (diagramRef.current) observer.observe(diagramRef.current);
    Object.values(nodeRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [relays]);

  useEffect(() => {
    // A packet crawling down a wire is decoration, so it does not run for a
    // reader who asked for less motion. The line itself still shows the state.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDataPackets([]);
      return;
    }
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
        "not-prose relative rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <h3 className="mb-6 text-h3 text-gray-900 dark:text-white">
        {t('relayVisualizer.title')}
      </h3>

      {/* Visual Diagram */}
      <div
        ref={diagramRef}
        className="relative mb-8 flex flex-col items-center gap-16"
      >
        {/* The wires, drawn under the nodes across the whole diagram. */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {links.map((link) => {
            const connected = activeConnections.includes(link.id);
            return (
              <line
                key={link.id}
                x1={link.x1}
                y1={link.y1}
                x2={link.x2}
                y2={link.y2}
                strokeWidth="2"
                className={
                  connected
                    ? "stroke-success-500"
                    : "stroke-gray-300 dark:stroke-gray-700"
                }
                strokeDasharray={connected ? undefined : "4 4"}
              />
            );
          })}
          {dataPackets.flatMap((packet) => {
            const link = links.find((l) => l.id === packet.relayId);
            if (!link) return [];
            const p = packet.progress / 100;
            return [
              <circle
                key={packet.id}
                cx={link.x1 + (link.x2 - link.x1) * p}
                cy={link.y1 + (link.y2 - link.y1) * p}
                r="4"
                className="fill-success-500"
              />,
            ];
          })}
        </svg>

        {/* User Node */}
        <div className="relative" ref={userRef}>
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

        {/* Relay nodes. The wires above are drawn to the top edge of each of
            these buttons, so the row can wrap without a line coming loose. */}
        <div className="relative flex flex-wrap justify-center gap-8">
          {relays.map((relay) => (
            <button
              key={relay.id}
              ref={(node) => {
                nodeRefs.current[relay.id] = node;
              }}
              onClick={() => onRelayToggle?.(relay.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:border-gray-300 dark:hover:border-gray-700",
                relay.status === "connected"
                  ? "border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-950"
                  // gray-800 on gray-800 was a tile with no edge in dark mode.
                  : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
              )}
            >
              <div
                className={cn(
                  "h-3 w-3 rounded-full",
                  relay.status === "connecting" &&
                    "animate-pulse motion-reduce:animate-none",
                  getStatusColor(relay.status),
                )}
              />
              <span className="text-caption font-medium text-gray-700 dark:text-gray-300">
                {relay.name}
              </span>
              {relay.latency && (
                <span className="text-micro text-gray-500 dark:text-gray-400">
                  {relay.latency}ms
                </span>
              )}
            </button>
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
