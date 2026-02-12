import React from "react";
import { Info } from "lucide-react";
import { cn } from "../lib/utils";

export interface HoverCardProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
  className?: string;
}

export function HoverCard({
  term,
  definition,
  children,
  className,
}: HoverCardProps) {
  return (
    <div
      className={cn(
        "relative inline-flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/80",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Info className="h-4 w-4 text-primary" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {term}
          </p>
          {children && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {children}
            </p>
          )}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {definition}
      </p>
    </div>
  );
}
