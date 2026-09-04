import React from "react";
import { BadgeCheck, User, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Diagram components replacing the box-drawing ASCII art in the guides.
 *
 * The art was authored once in English and copied verbatim into all seven
 * locales, so `One Big Server`, `(Relays)` and `Your posts` sat untranslated
 * inside Chinese, Arabic and Hindi pages — the largest remaining source of
 * English text in the localized HTML. It also rendered badly: a <pre> block of
 * U+2500 box characters overflows on a phone, and under `dir="rtl"` the
 * columns and arrows point the wrong way with no way to mirror them.
 *
 * These take their labels as props, so each locale's MDX passes its own
 * strings, and they are real elements rather than preformatted text: readable
 * by screen readers, reflowable on mobile, and mirrored automatically because
 * every spacing utility here is logical (ms/me/ps/pe/start/end), never
 * physical. None of them needs a client directive — they render to static HTML.
 */

type Tone = "neutral" | "positive" | "negative";

const TONES: Record<Tone, string> = {
  neutral: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
  positive: "border-primary/40 bg-primary/5 dark:bg-primary/10",
  negative: "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
};

interface Figure {
  caption?: string;
  className?: string;
}

/** Shared frame: a <figure> so the caption is associated, not just nearby text. */
function DiagramFrame({
  caption,
  className,
  children,
}: Figure & { children: React.ReactNode }) {
  return (
    <figure className={cn("not-prose my-8", className)}>
      {children}
      {caption && (
        <figcaption className="mt-3 text-caption text-gray-500 dark:text-gray-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ compare */

export interface ComparePanel {
  title: string;
  subtitle?: string;
  lines?: string[];
  tone?: Tone;
}

/**
 * Two or three labelled panels side by side — the "Traditional social media /
 * Nostr" and "Before NIP-05 / After NIP-05" shapes. Stacks on narrow screens
 * instead of overflowing, which the ASCII version could not do.
 */
export function DiagramCompare({
  panels,
  caption,
  className,
}: Figure & { panels: ComparePanel[] }) {
  return (
    <DiagramFrame caption={caption} className={className}>
      <div
        className={cn(
          "grid gap-4",
          panels.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        )}
      >
        {panels.map((panel) => (
          <div
            key={panel.title}
            className={cn("rounded-lg border p-5", TONES[panel.tone ?? "neutral"])}
          >
            <p className="font-semibold text-gray-900 dark:text-white">{panel.title}</p>
            {panel.subtitle && (
              <p className="mt-1 text-body-sm text-gray-500 dark:text-gray-400">
                {panel.subtitle}
              </p>
            )}
            {panel.lines && panel.lines.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-body-sm text-gray-600 dark:text-gray-300">
                {panel.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </DiagramFrame>
  );
}

/* ------------------------------------------------------------------- layers */

export interface Layer {
  label: string;
  note?: string;
}

/**
 * Concentric layers, outermost first — the NIP-17 gift wrap / seal / content
 * nesting. Real nesting rather than indented pipes, so the containment is
 * conveyed structurally and survives translation of any label length.
 */
export function DiagramLayers({
  layers,
  caption,
  className,
}: Figure & { layers: Layer[] }) {
  const render = (index: number): React.ReactNode => {
    if (index >= layers.length) return null;
    const layer = layers[index];
    const innermost = index === layers.length - 1;
    return (
      <div
        className={cn(
          "rounded-lg border p-4",
          innermost
            ? "border-primary/40 bg-primary/5 dark:bg-primary/10"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        )}
      >
        <p className="text-body-sm font-semibold text-gray-900 dark:text-white">
          {layer.label}
        </p>
        {layer.note && (
          <p className="mt-1 text-caption text-gray-500 dark:text-gray-400">{layer.note}</p>
        )}
        {!innermost && <div className="mt-3">{render(index + 1)}</div>}
      </div>
    );
  };

  return (
    <DiagramFrame caption={caption} className={className}>
      {render(0)}
    </DiagramFrame>
  );
}

/* -------------------------------------------------------------------- nodes */

export interface DiagramNode {
  label: string;
  sub?: string;
  tone?: Tone;
}

export interface NodeRow {
  nodes: DiagramNode[];
  /** Text on the connector drawn *above* this row. */
  connector?: string;
}

/**
 * Rows of boxes joined by captioned connectors — the client/relay, federated
 * server and personal-data-store topologies, plus the connected and
 * disconnected relay pictures. The connector is a labelled rule rather than an
 * arrow glyph, because an arrow has to be mirrored under RTL and a rule does
 * not.
 */
export function DiagramNodes({
  rows,
  caption,
  className,
}: Figure & { rows: NodeRow[] }) {
  return (
    <DiagramFrame caption={caption} className={className}>
      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <React.Fragment key={row.nodes.map((n) => n.label).join("|")}>
            {rowIndex > 0 && (
              <div className="flex items-center gap-3" aria-hidden={!row.connector}>
                <span className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                {row.connector && (
                  <span className="text-micro font-medium uppercase text-gray-500 dark:text-gray-400">
                    {row.connector}
                  </span>
                )}
                <span className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
              </div>
            )}
            <div
              className={cn(
                "grid gap-3",
                row.nodes.length >= 3
                  ? "sm:grid-cols-3"
                  : row.nodes.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-1"
              )}
            >
              {row.nodes.map((node) => (
                <div
                  key={node.label}
                  className={cn(
                    "rounded-lg border p-4 text-center",
                    TONES[node.tone ?? "neutral"]
                  )}
                >
                  <p className="font-medium text-gray-900 dark:text-white">{node.label}</p>
                  {node.sub && (
                    <p className="mt-1 text-caption text-gray-500 dark:text-gray-400">
                      {node.sub}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </DiagramFrame>
  );
}

/* ------------------------------------------------------------------ mock UI */

/** A mock profile card — what a NIP-05 verified identity looks like in a client. */
export function MockProfile({
  name,
  handle,
  bio,
  verified = false,
  caption,
  className,
}: Figure & { name: string; handle: string; bio?: string; verified?: boolean }) {
  return (
    <DiagramFrame caption={caption} className={className}>
      <div className="mx-auto max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <User
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
              {name}
              {/* The badge a client draws next to a verified name. It carried a
                  hardcoded English title="Verified"; the caption under the
                  figure is where that sentence belongs, in the locale's own
                  words, so the mark is drawn and nothing is asserted in
                  English. */}
              {verified && (
                <BadgeCheck
                  className="h-4 w-4 shrink-0 text-primary-text dark:text-primary-400"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}
            </p>
            <p className="truncate text-body-sm text-gray-500 dark:text-gray-400">{handle}</p>
          </div>
        </div>
        {bio && <p className="mt-3 text-body-sm text-gray-600 dark:text-gray-300">{bio}</p>}
      </div>
    </DiagramFrame>
  );
}

export interface PostReaction {
  icon: string;
  label: string;
}

/** A mock note with its reaction row and zap receipts. */
export function MockPost({
  author,
  content,
  reactions = [],
  zaps = [],
  caption,
  className,
}: Figure & {
  author: string;
  content: string;
  reactions?: PostReaction[];
  zaps?: string[];
}) {
  return (
    <DiagramFrame caption={caption} className={className}>
      <div className="mx-auto max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{content}</p>
        {reactions.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
            {reactions.map((reaction) => (
              <li
                key={reaction.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-body-sm text-gray-600 dark:text-gray-300"
              >
                <span aria-hidden="true">{reaction.icon}</span>
                {reaction.label}
              </li>
            ))}
          </ul>
        )}
        {zaps.length > 0 && (
          <ul className="mt-3 space-y-1 text-body-sm text-gray-500 dark:text-gray-400">
            {zaps.map((zap) => (
              <li key={zap} className="flex items-center gap-1.5">
                <Zap
                  className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                {zap}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DiagramFrame>
  );
}

/* -------------------------------------------------------------------- split */

export interface SplitRow {
  percent: number;
  label: string;
}

/**
 * A share-of-total breakdown — zap splits. The bar is decorative width; the
 * percentage is text, so the numbers survive with images and CSS off.
 */
export function DiagramSplit({
  title,
  rows,
  caption,
  className,
}: Figure & { title?: string; rows: SplitRow[] }) {
  return (
    <DiagramFrame caption={caption} className={className}>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        {title && (
          <p className="mb-4 font-semibold text-gray-900 dark:text-white">{title}</p>
        )}
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-body-sm font-semibold text-gray-900 dark:text-white">
                {row.percent}%
              </span>
              <span className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-700">
                <span
                  className="block h-2 rounded-full bg-primary/70"
                  style={{ width: `${row.percent}%` }}
                />
              </span>
              <span className="shrink-0 text-body-sm text-gray-600 dark:text-gray-300">
                {row.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DiagramFrame>
  );
}
