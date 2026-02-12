import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  estimatedTime?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = {
  sm: {
    marker: "h-3 w-3",
    track: "h-1",
    font: "text-xs",
  },
  md: {
    marker: "h-4 w-4",
    track: "h-1.5",
    font: "text-sm",
  },
  lg: {
    marker: "h-5 w-5",
    track: "h-2",
    font: "text-base",
  },
};

export function ProgressIndicator({
  current,
  total,
  estimatedTime,
  className,
  size = "md",
  label = "Guide Progress",
}: ProgressIndicatorProps) {
  const clampedCurrent = Math.min(Math.max(current, 0), total);
  const percentage =
    total === 0 ? 0 : Math.round((clampedCurrent / total) * 100);

  const sizeStyles = sizeMap[size];

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {percentage}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Step {clampedCurrent} of {total}
          </p>
        </div>

        {estimatedTime && (
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Est. time
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {estimatedTime}
            </p>
          </div>
        )}
      </div>

      <div className={cn("mt-4", sizeStyles.font)}>
        <div className={cn("relative flex items-center", sizeStyles.track)}>
          <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div
            className="relative rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${percentage}%`, height: "100%" }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Start</span>
          <span>Complete</span>
        </div>

        <div className="mt-2 flex justify-between">
          {Array.from({ length: total }).map((_, index) => {
            const isCompleted = index + 1 < clampedCurrent;
            const isCurrent = index + 1 === clampedCurrent;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1 text-[10px]"
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border",
                    sizeStyles.marker,
                    isCompleted && "border-primary bg-primary text-white",
                    isCurrent &&
                      "border-primary-500 bg-primary-50 text-primary dark:bg-primary/20",
                    !isCompleted &&
                      !isCurrent &&
                      "border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="text-[10px] font-semibold">
                      {index + 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgressIndicator;
