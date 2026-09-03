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
    <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between text-body-sm font-medium text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <div className="flex items-center gap-2">
          {type === "nsec" && (
            <button
              type="button"
              onClick={onTogglePrivate}
              className="rounded-md p-1 text-gray-400 transition-colors hover:text-primary-text dark:text-gray-500 dark:hover:text-primary-400"
            >
              {showPrivate ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => onCopy?.(type)}
            className="rounded-md p-1 text-gray-400 transition-colors hover:text-primary-text dark:text-gray-500 dark:hover:text-primary-400"
          >
            <Copy className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <code
        className={cn(
          "block break-all rounded-md bg-gray-50 p-3 font-mono text-caption text-gray-900 dark:bg-gray-800 dark:text-white",
          type === "nsec"
            ? "border border-danger-200 dark:border-danger-900"
            : "border border-success-200 dark:border-success-900",
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
