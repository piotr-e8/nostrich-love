import React from "react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

interface ComparisonItem {
  title: string;
  centralized: string;
  nostr: string;
}

export interface ProtocolComparisonProps {
  items?: ComparisonItem[];
  className?: string;
}

export function ProtocolComparison({
  items,
  className,
}: ProtocolComparisonProps) {
  const { t } = useTranslation();

  const defaultItems: ComparisonItem[] = [
    {
      title: t("protocolComparisonUI.items.identity.title"),
      centralized: t("protocolComparisonUI.items.identity.centralized"),
      nostr: t("protocolComparisonUI.items.identity.nostr"),
    },
    {
      title: t("protocolComparisonUI.items.data.title"),
      centralized: t("protocolComparisonUI.items.data.centralized"),
      nostr: t("protocolComparisonUI.items.data.nostr"),
    },
    {
      title: t("protocolComparisonUI.items.clients.title"),
      centralized: t("protocolComparisonUI.items.clients.centralized"),
      nostr: t("protocolComparisonUI.items.clients.nostr"),
    },
    {
      title: t("protocolComparisonUI.items.censorship.title"),
      centralized: t("protocolComparisonUI.items.censorship.centralized"),
      nostr: t("protocolComparisonUI.items.censorship.nostr"),
    },
  ];

  const displayItems = items || defaultItems;

  return (
    <div className={cn("grid gap-4", className)}>
      {displayItems.map((item) => (
        <div
          key={item.title}
          className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:grid-cols-2"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("protocolComparisonUI.centralizedLabel")}
            </p>
            <h4 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {item.centralized}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
              {t("protocolComparisonUI.nostrLabel")}
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
