import React from "react";
import { cn } from "../../lib/utils";

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
  showFraction?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  current,
  total,
  label,
  className,
  showFraction = true,
  size = "md",
}: ProgressBarProps) {
  const clampedCurrent = Math.min(Math.max(current, 0), total);
  const percentage =
    total === 0 ? 0 : Math.round((clampedCurrent / total) * 100);

  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {(label || showFraction) && (
        <div className="flex items-center justify-between text-body-sm">
          {label && (
            <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          )}
          {showFraction && (
            <span className="font-semibold text-primary-text dark:text-primary-400">
              {percentage}%
              <span className="ms-1 text-caption font-normal text-gray-500 dark:text-gray-400">
                ({clampedCurrent}/{total})
              </span>
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800",
          sizes[size],
        )}
      >
        <div
          className="h-full rounded-full bg-primary-600 transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
