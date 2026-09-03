import React from "react";
import { Star, Smartphone, Monitor, Globe, Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface Client {
  id: string;
  name: string;
  description: string;
  platforms: Array<"ios" | "android" | "web" | "desktop">;
  rating: number;
  beginnerFriendly: boolean;
  features: string[];
  websiteUrl: string;
  icon?: string;
}

export interface ClientCardProps {
  client: Client;
  className?: string;
  onClick?: (client: Client) => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  ios: <Smartphone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />,
  android: (
    <Smartphone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
  ),
  web: <Globe className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />,
  desktop: <Monitor className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />,
};

const platformLabels: Record<string, string> = {
  ios: "iOS",
  android: "Android",
  web: "Web",
  desktop: "Desktop",
};

export function ClientCard({ client, className, onClick }: ClientCardProps) {
  return (
    <div
      onClick={() => onClick?.(client)}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-colors dark:border-gray-800 dark:bg-gray-900",
        onClick &&
          "cursor-pointer hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800",
        className,
      )}
    >
      {/* Beginner Friendly Badge */}
      {client.beginnerFriendly && (
        <span className="mb-3 inline-block rounded-md border border-gray-200 px-2 py-0.5 text-micro font-semibold uppercase text-primary-text dark:border-gray-800 dark:text-primary-400">
          Beginner Friendly
        </span>
      )}

      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800">
        {client.icon ? (
          <img src={client.icon} alt="" className="h-8 w-8 object-contain" />
        ) : (
          <span className="text-h3 font-semibold text-gray-600 dark:text-gray-400">
            {client.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="mb-1 text-h3 text-gray-900 dark:text-white">
        {client.name}
      </h3>
      <p className="mb-3 text-body-sm text-gray-600 dark:text-gray-400">
        {client.description}
      </p>

      {/* Rating */}
      <div className="mb-4 flex items-center gap-1">
        <Star
          className="h-4 w-4 text-gray-400 dark:text-gray-500"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span className="text-body-sm font-medium text-gray-700 dark:text-gray-300">
          {client.rating}
        </span>
      </div>

      {/* Platforms */}
      <div className="mb-4 flex flex-wrap gap-2">
        {client.platforms.map((platform) => (
          <span
            key={platform}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-caption text-gray-600 dark:border-gray-800 dark:text-gray-400"
          >
            {platformIcons[platform]}
            {platformLabels[platform]}
          </span>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-1.5">
        {client.features.slice(0, 3).map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-2 text-caption text-gray-600 dark:text-gray-400"
          >
            <Check
              className="h-4 w-4 shrink-0 text-success-700 dark:text-success-400"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Website Link */}
      <a
        href={client.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-4 inline-flex items-center text-body-sm font-medium text-primary-text underline-offset-2 hover:underline dark:text-primary-400"
      >
        Visit Website
        <svg
          className="ms-1 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}

export interface ClientGridProps {
  clients: Client[];
  className?: string;
  onClientClick?: (client: Client) => void;
}

export function ClientGrid({
  clients,
  className,
  onClientClick,
}: ClientGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} onClick={onClientClick} />
      ))}
    </div>
  );
}
