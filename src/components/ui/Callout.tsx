import React, { useState } from "react";
import { Info, AlertTriangle, CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";

export type CalloutVariant = "info" | "warning" | "success" | "danger";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const variantStyles: Record<
  CalloutVariant,
  { container: string; icon: string; iconBg: string }
> = {
  info: {
    container:
      "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100",
    icon: "text-blue-500 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900",
  },
  warning: {
    container:
      "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-100",
    icon: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900",
  },
  success: {
    container:
      "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-100",
    icon: "text-green-500 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900",
  },
  danger: {
    container:
      "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-800 dark:text-red-100",
    icon: "text-red-500 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900",
  },
};

const defaultIcons: Record<CalloutVariant, React.ReactNode> = {
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  danger: <XCircle className="h-5 w-5" />,
};

export function Callout({
  variant = "info",
  title,
  children,
  className,
  dismissible = false,
  onDismiss,
  icon,
}: CalloutProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const styles = variantStyles[variant];

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4",
        styles.container,
        className,
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <div className={cn("flex-shrink-0", styles.icon)}>
          {icon || defaultIcons[variant]}
        </div>
        <div className="flex-1">
          {title && <h4 className="mb-1 font-semibold">{title}</h4>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 rounded p-1 opacity-60 transition-opacity hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Specialized callouts for common use cases
export function InfoCallout(props: Omit<CalloutProps, "variant">) {
  return <Callout variant="info" {...props} />;
}

export function WarningCallout(props: Omit<CalloutProps, "variant">) {
  return <Callout variant="warning" {...props} />;
}

export function SuccessCallout(props: Omit<CalloutProps, "variant">) {
  return <Callout variant="success" {...props} />;
}

export function DangerCallout(props: Omit<CalloutProps, "variant">) {
  return <Callout variant="danger" {...props} />;
}

// Security warning specific to Nostr
interface SecurityWarningProps {
  children: React.ReactNode;
  className?: string;
}

export function SecurityWarning({ children, className }: SecurityWarningProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border-2 border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-950/30",
        className,
      )}
    >
      {/* Warning stripes decoration */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rotate-45 bg-red-500/10" />
      <div className="absolute -left-8 -bottom-8 h-24 w-24 rotate-45 bg-red-500/10" />

      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-red-800 dark:text-red-200">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold">Security Warning</span>
        </div>
        <div className="text-sm text-red-700 dark:text-red-300">{children}</div>
      </div>
    </div>
  );
}

// Tip/Pro Tip callout
interface TipProps {
  children: React.ReactNode;
  pro?: boolean;
  className?: string;
}

export function Tip({ children, pro = false, className }: TipProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/30",
        className,
      )}
    >
      {pro && (
        <span className="mb-2 inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-purple-700 dark:bg-purple-900 dark:text-purple-300">
          Pro Tip
        </span>
      )}
      <div className="text-sm text-purple-900 dark:text-purple-100">
        {children}
      </div>
    </div>
  );
}
