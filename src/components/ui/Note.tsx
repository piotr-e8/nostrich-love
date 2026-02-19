import React from "react";
import { Info } from "lucide-react";
import { cn } from "../../lib/utils";

interface NoteProps {
  children: React.ReactNode;
  type?: "info" | "tip" | "warning";
  title?: string;
  className?: string;
}

const noteStyles = {
  info: {
    container: "bg-blue-500/10 border-blue-500/30",
    icon: "text-blue-500",
    title: "text-blue-400",
  },
  tip: {
    container: "bg-amber-500/10 border-amber-500/30",
    icon: "text-amber-500",
    title: "text-amber-400",
  },
  warning: {
    container: "bg-red-500/10 border-red-500/30",
    icon: "text-red-500",
    title: "text-red-400",
  },
};

export function Note({ children, type = "info", title, className }: NoteProps) {
  const safeType = type && noteStyles[type] ? type : "info";
  const styles = noteStyles[safeType];

  return (
    <div
      className={cn(
        "border rounded-xl p-4 my-4",
        styles?.container ?? noteStyles.info.container,
        className,
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex-shrink-0 mt-0.5",
            styles?.icon ?? noteStyles.info.icon,
          )}
        >
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          {title && (
            <h4
              className={cn(
                "font-semibold mb-1",
                styles?.title ?? noteStyles.info.title,
              )}
            >
              {title}
            </h4>
          )}
          <div className="text-gray-700 dark:text-gray-300 text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
