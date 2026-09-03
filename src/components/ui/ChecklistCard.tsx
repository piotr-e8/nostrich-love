import React from "react";
import { CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ChecklistCardProps {
  number: number;
  title: string;
  time?: string;
  status?: "required" | "optional" | "completed" | "in-progress";
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

const statusStyles: Record<
  NonNullable<ChecklistCardProps["status"]>,
  string
> = {
  required: "text-primary-text dark:text-primary-400",
  optional: "text-gray-500 dark:text-gray-400",
  completed: "text-success-700 dark:text-success-400",
  "in-progress": "text-warning-700 dark:text-warning-400",
};

export function ChecklistCard({
  number,
  title,
  time,
  status = "required",
  href,
  children,
  className,
}: ChecklistCardProps) {
  const content = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900",
        href &&
          "transition-colors hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-body-sm font-semibold text-gray-600 dark:border-gray-800 dark:text-gray-400">
            {number}
          </div>
          <div>
            <h3 className="text-h3 text-gray-900 dark:text-white">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-caption text-gray-500 dark:text-gray-400">
              {time && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  {time}
                </span>
              )}
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-micro font-semibold uppercase",
                  statusStyles[status],
                )}
              >
                {status === "required" && "Required"}
                {status === "optional" && "Optional"}
                {status === "completed" && (
                  <>
                    <CheckCircle2
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    Completed
                  </>
                )}
                {status === "in-progress" && "In Progress"}
              </span>
            </div>
          </div>
        </div>
        {href && (
          <ArrowUpRight
            className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-primary-text dark:text-gray-500 dark:group-hover:text-primary-400"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        )}
      </div>
      {children && (
        <div className="mt-4 text-body-sm text-gray-600 dark:text-gray-300">
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
      >
        {content}
      </a>
    );
  }

  return content;
}
