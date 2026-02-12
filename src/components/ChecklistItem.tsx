import React from "react";
import { CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

export interface ChecklistItemProps {
  number: number;
  title: string;
  time?: string;
  status?: "required" | "optional" | "completed" | "in-progress";
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

const statusStyles: Record<
  NonNullable<ChecklistItemProps["status"]>,
  string
> = {
  required: "text-primary-600 dark:text-primary-400",
  optional: "text-gray-500 dark:text-gray-400",
  completed: "text-success-500",
  "in-progress": "text-amber-500",
};

export function ChecklistItem({
  number,
  title,
  time,
  status = "required",
  href,
  children,
  className,
}: ChecklistItemProps) {
  const card = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-colors dark:border-gray-800 dark:bg-gray-900",
        href && "hover:border-primary-300 dark:hover:border-primary-700",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
            {number}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              {time && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {time}
                </span>
              )}
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide",
                  statusStyles[status],
                )}
              >
                {status === "required" && "Required"}
                {status === "optional" && "Optional"}
                {status === "completed" && (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </>
                )}
                {status === "in-progress" && "In Progress"}
              </span>
            </div>
          </div>
        </div>
        {href && (
          <ArrowUpRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-primary" />
        )}
      </div>
      {children && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {children}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
      >
        {card}
      </a>
    );
  }

  return card;
}
