import React from "react";
import { Info, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";

interface NoteProps {
  children: React.ReactNode;
  type?: "info" | "tip" | "warning";
  title?: string;
  className?: string;
}

// Same semantic tint vocabulary as Callout, so the two do not read as two
// different design systems inside one guide. The title colours used to be the
// -400 shades on a light ground, which failed contrast badly; they are now the
// -800/-200 pair.
const noteStyles = {
  info: {
    container: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-900 dark:text-blue-100",
    Icon: Info,
  },
  tip: {
    container:
      "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800",
    icon: "text-gray-400 dark:text-gray-500",
    title: "text-gray-900 dark:text-white",
    Icon: Lightbulb,
  },
  warning: {
    container:
      "bg-warning-50 border-warning-200 dark:bg-warning-950 dark:border-warning-900",
    icon: "text-warning-600 dark:text-warning-400",
    title: "text-warning-900 dark:text-warning-100",
    Icon: AlertTriangle,
  },
};

export function Note({ children, type = "info", title, className }: NoteProps) {
  const safeType = type && noteStyles[type] ? type : "info";
  const styles = noteStyles[safeType];
  const Icon = styles.Icon;

  return (
    <div
      className={cn("border rounded-lg p-4 my-4", styles.container, className)}
    >
      <div className="flex gap-3">
        <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="flex-1">
          {title && (
            <h4 className={cn("text-h4 font-semibold mb-1", styles.title)}>
              {title}
            </h4>
          )}
          <div className="text-body-sm text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
