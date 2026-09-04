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

/**
 * Pin positions as percentages of the map box, and the links drawn between
 * them. One list, used for both the circle and the line endpoint, because the
 * two used to be written out separately and drifted apart.
 *
 * There were four pins; two of them carried the same label ("North America"),
 * and the fourth had no line touching it at all. The duplicate is gone.
 */
const PINS = [
  { id: "northAmerica", x: 20, y: 38 },
  { id: "europe", x: 50, y: 33 },
  { id: "asia", x: 80, y: 48 },
] as const;

const LINKS: ReadonlyArray<[string, string]> = [
  ["northAmerica", "europe"],
  ["europe", "asia"],
  ["northAmerica", "asia"],
];

export function RelayWorldMap({
  relays = DEFAULT_RELAYS,
  className,
}: RelayWorldMapProps) {
  const { t } = useTranslation();
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-success-500";
      case "degraded":
        return "bg-warning-500";
      case "offline":
        return "bg-danger-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={cn(
        "not-prose rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Globe
            className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h3 className="text-h3 text-gray-900 dark:text-white">{t('relayWorldMap.title')}</h3>
        </div>
        {/* Indented by the icon column (24px) plus the gap (12px) so the two
            lines of the header share one left edge. */}
        <p className="mt-1 ms-9 text-body-sm text-gray-600 dark:text-gray-400">
          {t('relayWorldMap.subtitle')}
        </p>
      </div>

      {/* Simplified World Map Visualization.
          Grid, links and pins live in ONE svg, in one coordinate space. They
          used to be three stacked layers: percentage endpoints on the lines,
          but percentage *corners* on the pin boxes, whose width came from the
          translated label. So every line stopped short of its dot by a
          different amount, and the amount changed with the language. Here a
          pin is a circle at the same percentage the line ends at, so the line
          lands on the dot by construction, in all seven locales. */}
      <div className="relative mb-6 h-48 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
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
                className="stroke-gray-400 dark:stroke-gray-600"
                strokeWidth="1"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {LINKS.map(([from, to]) => {
            const a = PINS.find((p) => p.id === from)!;
            const b = PINS.find((p) => p.id === to)!;
            return (
              <line
                key={`${from}-${to}`}
                x1={`${a.x}%`}
                y1={`${a.y}%`}
                x2={`${b.x}%`}
                y2={`${b.y}%`}
                className="stroke-gray-300 dark:stroke-gray-600"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Pins stand for "relays run everywhere", not for the hosts listed
              below, which is why no relay name is attached to them. */}
          {PINS.map((pin) => (
            <g key={pin.id}>
              <circle
                cx={`${pin.x}%`}
                cy={`${pin.y}%`}
                r="6"
                className="fill-success-500"
              />
              <text
                x={`${pin.x}%`}
                y={`${pin.y}%`}
                dy="1.9em"
                textAnchor="middle"
                className="text-caption fill-gray-600 dark:fill-gray-400"
              >
                {t(`relayWorldMap.regions.${pin.id}`)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Relay List */}
      <div className="space-y-2">
        {relays.map((relay) => (
          <div
            key={relay.id}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800"
          >
            {relay.status && (
              <div
                className={cn(
                  "mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0",
                  getStatusColor(relay.status),
                )}
              />
            )}
            <Server
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="truncate font-mono text-body-sm text-gray-700 dark:text-gray-300">
                {relay.url.replace("wss://", "")}
              </p>
              <p className="text-caption text-gray-600 dark:text-gray-400">
                {t(`relayWorldMap.relays.${relay.id}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-caption text-gray-600 dark:text-gray-400">
        {t('relayWorldMap.checkedNote')}
      </p>
    </div>
  );
}
