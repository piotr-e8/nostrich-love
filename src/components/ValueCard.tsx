import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface ValueCardProps {
  icon: LucideIcon | string;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
}

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
        "bg-gray-800/30 border border-border-dark rounded-xl p-6 hover:bg-gray-800/50 transition-all",
        className,
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4",
          iconClassName,
        )}
      >
        {isString ? (
          <span className="text-2xl">{icon}</span>
        ) : (
          <Icon className="w-6 h-6 text-primary-500" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

// Handle icon as component
function Icon({ icon }: { icon: LucideIcon }) {
  const IconComponent = icon;
  return <IconComponent className="w-6 h-6 text-primary-500" />;
}
