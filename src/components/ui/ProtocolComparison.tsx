import React from "react";
import { cn } from "../../lib/utils";

interface ComparisonItem {
  title: string;
  centralized: string;
  nostr: string;
}

const defaultItems: ComparisonItem[] = [
  {
    title: "Identity",
    centralized: "Owned by company, can be revoked anytime",
    nostr: "Owned by you. Keys work across all apps",
  },
  {
    title: "Data",
    centralized: "Stored on one server, subject to moderation",
    nostr: "Distributed across relays. You pick where data lives",
  },
  {
    title: "Clients",
    centralized: "Single app, no portability",
    nostr: "Many clients. Switch anytime without losing followers",
  },
  {
    title: "Censorship",
    centralized: "Company decides what stays up",
    nostr: "You can always post; others can choose what to read",
  },
];

export interface ProtocolComparisonProps {
  items?: ComparisonItem[];
  className?: string;
}

export function ProtocolComparison({
  items = defaultItems,
  className,
}: ProtocolComparisonProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      {items.map((item) => (
        <div
          key={item.title}
          className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:grid-cols-2"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Centralized Platforms
            </p>
            <h4 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {item.centralized}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Nostr
            </p>
            <p className="mt-2 text-sm text-gray-900 dark:text-white">
              {item.nostr}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
