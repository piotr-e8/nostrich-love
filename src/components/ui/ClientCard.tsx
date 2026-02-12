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
  ios: <Smartphone className="h-3 w-3" />,
  android: <Smartphone className="h-3 w-3" />,
  web: <Globe className="h-3 w-3" />,
  desktop: <Monitor className="h-3 w-3" />,
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
        "group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900",
        onClick &&
          "cursor-pointer hover:border-primary-300 dark:hover:border-primary-700",
        className,
      )}
    >
      {/* Beginner Friendly Badge */}
      {client.beginnerFriendly && (
        <div className="absolute -right-8 top-4 rotate-45 bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-1 text-xs font-bold text-white shadow-lg">
          Beginner Friendly
        </div>
      )}

      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900">
        {client.icon ? (
          <img src={client.icon} alt="" className="h-10 w-10 object-contain" />
        ) : (
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {client.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        {client.name}
      </h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {client.description}
      </p>

      {/* Rating */}
      <div className="mb-4 flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {client.rating}
        </span>
      </div>

      {/* Platforms */}
      <div className="mb-4 flex flex-wrap gap-2">
        {client.platforms.map((platform) => (
          <span
            key={platform}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
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
            className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
          >
            <Check className="h-3 w-3 text-green-500" />
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
        className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        Visit Website
        <svg
          className="ml-1 h-4 w-4"
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
