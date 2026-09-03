import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

interface NIPProps {
  number: number;
  title?: string;
  description?: string;
  href?: string;
  className?: string;
}

export function NIP({
  number,
  title,
  description,
  href = `https://github.com/nostr-protocol/nips/blob/master/${number}.md`,
  className,
}: NIPProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800",
        className,
      )}
    >
      <FileText
        className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded-md border border-gray-200 px-2 py-0.5 font-mono text-caption text-primary-text dark:border-gray-800 dark:text-primary-400">
            NIP-{number.toString().padStart(2, "0")}
          </span>
          <ExternalLink
            className="h-4 w-4 text-gray-400 dark:text-gray-500"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        {title && (
          <h4 className="mb-1 text-h4 font-semibold text-gray-900 dark:text-white">
            {title}
          </h4>
        )}
        {description && (
          <p className="text-body-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </a>
  );
}
