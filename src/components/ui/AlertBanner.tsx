import React from "react";
import { AlertCircle, Shield, Info, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AlertBannerProps {
  type?: "info" | "warning" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const icons = {
  info: Info,
  warning: AlertCircle,
  danger: Shield,
  success: CheckCircle2,
};

// Solid semantic grounds, matching Callout. The `/10` ground plus `/40` border
// was an alpha wash that changed colour depending on what sat behind it, and
// the `backdrop-blur-sm` on top of it had nothing to blur.
const colorClasses: Record<NonNullable<AlertBannerProps["type"]>, string> = {
  info: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900",
  warning:
    "bg-warning-50 border-warning-200 dark:bg-warning-950 dark:border-warning-900",
  danger:
    "bg-danger-50 border-danger-200 dark:bg-danger-950 dark:border-danger-900",
  success:
    "bg-success-50 border-success-200 dark:bg-success-950 dark:border-success-900",
};

const iconClasses: Record<NonNullable<AlertBannerProps["type"]>, string> = {
  info: "text-blue-600 dark:text-blue-400",
  warning: "text-warning-600 dark:text-warning-400",
  danger: "text-danger-600 dark:text-danger-400",
  success: "text-success-600 dark:text-success-400",
};

const titleClasses: Record<NonNullable<AlertBannerProps["type"]>, string> = {
  info: "text-blue-900 dark:text-blue-100",
  warning: "text-warning-900 dark:text-warning-100",
  danger: "text-danger-900 dark:text-danger-100",
  success: "text-success-900 dark:text-success-100",
};

export function AlertBanner({
  type = "info",
  title,
  children,
  className,
}: AlertBannerProps) {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        "flex flex-col gap-2",
        colorClasses[type],
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={cn("h-5 w-5 shrink-0", iconClasses[type])}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        {title && (
          <h3 className={cn("text-h4 font-semibold", titleClasses[type])}>
            {title}
          </h3>
        )}
      </div>
      <div className="text-body-sm text-gray-700 dark:text-gray-200">
        {children}
      </div>
    </div>
  );
}
