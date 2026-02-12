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
        "flex items-start gap-4 p-4 bg-gray-800/30 border border-border-dark rounded-xl hover:bg-gray-800/50 hover:border-primary-500/50 transition-all group",
        className,
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
        <FileText className="w-6 h-6 text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded">
            NIP-{number.toString().padStart(2, "0")}
          </span>
          <ExternalLink className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {title && <h4 className="font-semibold text-white mb-1">{title}</h4>}
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
    </a>
  );
}
