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

const colorClasses: Record<NonNullable<AlertBannerProps["type"]>, string> = {
  info: "bg-sky-500/10 border-sky-500/40 text-sky-600 dark:text-sky-400",
  warning:
    "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400",
  danger: "bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400",
  success:
    "bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-400",
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
        "rounded-2xl border p-5",
        "shadow-sm backdrop-blur-sm",
        "flex flex-col gap-2",
        colorClasses[type],
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title && <h3 className="text-base font-semibold">{title}</h3>}
      </div>
      <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
        {children}
      </div>
    </div>
  );
}
