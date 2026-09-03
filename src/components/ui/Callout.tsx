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

// The tint here is semantic, which is the one exception to "a card is a border
// and a ground" — a warning has to look like a warning. Dark grounds are solid
// 950s, not `/30` alphas: an alpha tint over the page ground renders muddy and
// shifts depending on what is behind it.
const variantStyles: Record<CalloutVariant, { container: string; icon: string }> =
  {
    info: {
      container:
        "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-100",
      icon: "text-blue-600 dark:text-blue-400",
    },
    warning: {
      container:
        "bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-950 dark:border-warning-900 dark:text-warning-100",
      icon: "text-warning-600 dark:text-warning-400",
    },
    success: {
      container:
        "bg-success-50 border-success-200 text-success-900 dark:bg-success-950 dark:border-success-900 dark:text-success-100",
      icon: "text-success-600 dark:text-success-400",
    },
    danger: {
      container:
        "bg-danger-50 border-danger-200 text-danger-900 dark:bg-danger-950 dark:border-danger-900 dark:text-danger-100",
      icon: "text-danger-600 dark:text-danger-400",
    },
  };

const defaultIcons: Record<CalloutVariant, React.ReactNode> = {
  info: <Info className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
  warning: (
    <AlertTriangle className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
  ),
  success: (
    <CheckCircle className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
  ),
  danger: <XCircle className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
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
      className={cn("relative rounded-lg border p-4", styles.container, className)}
      role="alert"
    >
      <div className="flex gap-3">
        <div className={cn("flex-shrink-0", styles.icon)}>
          {icon || defaultIcons[variant]}
        </div>
        <div className="flex-1">
          {title && <h4 className="mb-1 text-h4 font-semibold">{title}</h4>}
          <div className="text-body-sm">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
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
        "rounded-lg border border-danger-200 bg-danger-50 p-5 dark:border-danger-900 dark:bg-danger-950",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-danger-800 dark:text-danger-200">
        <AlertTriangle
          className="h-5 w-5 shrink-0"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span className="font-semibold">Security Warning</span>
      </div>
      <div className="text-body-sm text-danger-700 dark:text-danger-300">
        {children}
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

// Not tinted purple any more. Purple means "you can act on this"; a tip is not
// an action, and an accent used as a mood is the ornament this pass removes.
export function Tip({ children, pro = false, className }: TipProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      {pro && (
        <span className="mb-2 block text-micro font-semibold uppercase text-primary-text dark:text-primary-400">
          Pro Tip
        </span>
      )}
      <div className="text-body-sm text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}
