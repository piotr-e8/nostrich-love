import React, { useState, useEffect } from "react";
import { Send, Server, User, ArrowDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

interface PostFlowSimulatorProps {
  className?: string;
}

/**
 * How a post actually travels: one client, several relays, in parallel.
 *
 * This used to animate a chain — Your Device -> Relay 1 -> Relay 2 -> Followers,
 * with an arrow between the two relays — which taught the exact misconception
 * the surrounding guide exists to correct. Two sections above this component,
 * "Why Posts Don't Sync" explains that relays do not talk to each other and that
 * this is why your friend cannot see your post; the picture underneath it showed
 * a post being handed from one relay to the next.
 *
 * So: the client publishes the SAME signed event to every relay it uses at the
 * same time, there is deliberately no link drawn between relays, and the third
 * column is a relay you do not publish to — whose reader therefore never sees
 * the post. That last beat is the guide's actual lesson.
 */
export function PostFlowSimulator({ className }: PostFlowSimulatorProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setStep((prev) => (prev + 1) % 4), 1800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Two relays you publish to, and one you do not. The third column is the point.
  const relays = [
    { id: "a", label: `${t("postFlowSimulator.labels.relay")} A`, used: true },
    { id: "b", label: `${t("postFlowSimulator.labels.relay")} B`, used: true },
    { id: "c", label: `${t("postFlowSimulator.labels.relay")} C`, used: false },
  ];

  const published = step >= 1;
  const fetched = step >= 2;
  const gapShown = step >= 3;

  // Nothing here may change size. The first version scaled the active tile to
  // 105% and mounted/unmounted the little status lines, so every step nudged
  // the whole grid — activation read as a glitch, not a highlight. Active state
  // is now a ring (drawn outside the layout) and the status lines keep their
  // slot at all times, fading rather than appearing.
  const tile = (active: boolean, tone: "primary" | "muted" | "gap") =>
    cn(
      "flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all duration-500 motion-reduce:transition-none",
      tone === "muted" && "border border-dashed border-gray-300 dark:border-gray-600",
      active && tone === "primary" && "bg-primary-500/20 ring-2 ring-primary-400 dark:ring-primary-500",
      active && tone === "gap" && "bg-amber-500/10 ring-2 ring-amber-400 dark:ring-amber-500",
      !active && tone !== "muted" && "bg-white dark:bg-gray-800 opacity-60",
      !active && tone === "muted" && "opacity-60",
    );

  /** A status line that always occupies its row, visible or not. */
  const status = (visible: boolean, tone: "primary" | "gap", text: string) => (
    <span
      className={cn(
        "text-xs h-4 leading-4 transition-opacity duration-300 motion-reduce:transition-none",
        tone === "primary" ? "text-primary-500" : "text-amber-600 dark:text-amber-500",
        visible ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!visible}
    >
      {text}
    </span>
  );

  const icon = (active: boolean, tone: "primary" | "muted" | "gap") =>
    cn(
      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 motion-reduce:transition-none",
      active && tone === "primary" && "bg-primary-500 text-white",
      active && tone === "gap" && "bg-amber-500 text-white",
      (!active || tone === "muted") && "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
    );

  /**
   * One arrow per column you publish to, so the fan-out is two arrows leaving at
   * the same moment rather than a baton being passed along a line.
   *
   * The unused column gets no arrow at all — not even a faint one. A dimmed
   * arrow pointing at the reader who never sees the post still draws a path to
   * them, which is the opposite of what this column is here to say.
   */
  const arrow = (used: boolean, active: boolean) =>
    used ? (
      <ArrowDown
        className={cn(
          "w-5 h-5 mx-auto text-primary-500 transition-opacity duration-500 motion-reduce:transition-none",
          active ? "opacity-100" : "opacity-20",
        )}
      />
    ) : (
      <div className="w-5 h-5 mx-auto" aria-hidden="true" />
    );

  return (
    <div
      className={cn(
        "bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6",
        className,
      )}
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t("postFlowSimulator.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("postFlowSimulator.description")}
        </p>
      </div>

      {/* Your device, spanning the whole width: one client, many relays. */}
      <div className="max-w-[10rem] mx-auto mb-3">
        <div className={tile(true, "primary")}>
          <div className={icon(true, "primary")}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {t("postFlowSimulator.labels.yourDevice")}
          </span>
          {status(step === 0, "primary", t("postFlowSimulator.stages.sign"))}
        </div>
      </div>

      {/* Three arrows at once — the same event going to every relay in parallel. */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {relays.map((r) => (
          <div key={r.id}>{arrow(r.used, published)}</div>
        ))}
      </div>

      {/* No connector is drawn between relays, and none should be: they do not
          talk to each other. That absence is the correction. */}
      <div className="grid grid-cols-3 gap-3 mb-2">
        {relays.map((r) => (
          <div key={r.id} className={tile(published && r.used, r.used ? "primary" : "muted")}>
            <div className={icon(published && r.used, r.used ? "primary" : "muted")}>
              <Server className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-900 dark:text-white">{r.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[0.7rem] text-center text-gray-500 dark:text-gray-400 mb-3">
        {t("postFlowSimulator.labels.noSync")}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {relays.map((r) => (
          <div key={r.id}>{arrow(r.used, fetched)}</div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {relays.map((r) => (
          <div
            key={r.id}
            className={tile(r.used ? fetched : gapShown, r.used ? "primary" : "gap")}
          >
            <div className={icon(r.used ? fetched : gapShown, r.used ? "primary" : "gap")}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {t("postFlowSimulator.labels.reader")}
            </span>
            {r.used
              ? status(fetched, "primary", t("postFlowSimulator.stages.receive"))
              : status(gapShown, "gap", t("postFlowSimulator.stages.missed"))}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all"
        >
          {isPlaying ? t("postFlowSimulator.buttons.pause") : t("postFlowSimulator.buttons.play")}
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            setStep(0);
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-all"
        >
          {t("postFlowSimulator.buttons.reset")}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Send className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {t("postFlowSimulator.currentStepLabel")}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t(`postFlowSimulator.stepDescriptions.${step}`)}
        </p>
      </div>
    </div>
  );
}
