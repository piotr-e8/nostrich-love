import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface ValueCardProps {
  icon: LucideIcon | string;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
}

// A card is a border and a ground. The icon used to sit inside a 48px
// purple-tinted rounded square, which is the badge-behind-an-icon pattern the
// visual system rules out; the icon now sits on the card at text scale.
export function ValueCard({
  icon,
  title,
  description,
  className,
  iconClassName,
}: ValueCardProps) {
  const isString = typeof icon === "string";

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800",
        className,
      )}
    >
      <div className={cn("mb-4 text-gray-400 dark:text-gray-500", iconClassName)}>
        {isString ? (
          <span aria-hidden="true">{icon}</span>
        ) : (
          <Icon icon={icon} />
        )}
      </div>
      <h3 className="text-h3 mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-body-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

// Handle icon as component
function Icon({ icon }: { icon: LucideIcon }) {
  const IconComponent = icon;
  return (
    <IconComponent className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
  );
}
