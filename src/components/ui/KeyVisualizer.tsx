import React from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import { cn } from "../../lib/utils";

export interface KeyVisualizerProps {
  publicKey?: string;
  privateKey?: string;
  showPrivate?: boolean;
  onTogglePrivate?: () => void;
  onCopy?: (type: "npub" | "nsec") => void;
  className?: string;
}

export function KeyVisualizer({
  publicKey = "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
  privateKey = "nsec1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
  showPrivate = false,
  onTogglePrivate,
  onCopy,
  className,
}: KeyVisualizerProps) {
  const maskKey = (key: string) => key.slice(0, 6) + "••••••" + key.slice(-6);

  const KeyRow = ({
    label,
    value,
    type,
  }: {
    label: string;
    value: string;
    type: "npub" | "nsec";
  }) => (
    <div className="space-y-2 rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <div className="flex items-center gap-2">
          {type === "nsec" && (
            <button
              type="button"
              onClick={onTogglePrivate}
              className="text-gray-400 transition-colors hover:text-primary"
            >
              {showPrivate ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => onCopy?.(type)}
            className="text-gray-400 transition-colors hover:text-primary"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
      <code
        className={cn(
          "block text-xs break-all rounded-xl bg-gray-100 dark:bg-gray-900/90 p-3 font-mono text-gray-900 dark:text-white",
          type === "nsec"
            ? "border border-red-500/30 dark:border-red-500/50"
            : "border border-green-500/30 dark:border-green-500/50",
        )}
      >
        {type === "nsec" && !showPrivate ? maskKey(value) : value}
      </code>
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      <KeyRow label="Public Key (npub)" value={publicKey} type="npub" />
      <KeyRow label="Private Key (nsec)" value={privateKey} type="nsec" />
    </div>
  );
}
