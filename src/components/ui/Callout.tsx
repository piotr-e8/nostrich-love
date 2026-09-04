import React from "react";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export type CalloutVariant = "info" | "warning" | "success" | "danger";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

// The tint here is semantic, which is the one exception to "a card is a border
// and a ground" — a warning has to look like a warning. Dark grounds are solid
// 950s, not `/30` alphas: an alpha tint over the page ground renders muddy and
// shifts depending on what is behind it.
//
// The container sets the body colour too (the -900/-100 pair). Every block in
// the family inherits it, including Note, so one blue box does not carry grey
// text while the one three paragraphs down carries dark blue.
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
  icon,
}: CalloutProps) {
  const styles = variantStyles[variant];

  return (
    <div
      // `not-prose` is the component boundary (VISUAL_SYSTEM.md §6). Callout is
      // used from MDX without a client directive, so it renders to plain HTML
      // with no <astro-island> around it and nothing else marks where the
      // article's prose ends and the component begins. Without it, `.prose p`
      // put 20px of margin above the body text and the icon floated 28px above
      // the line it belongs to.
      //
      // `my-5` is the flip side of that boundary: `not-prose` also stops the
      // article from spacing the block, so the callout has to carry the prose
      // rhythm (20px) itself. Sibling margins collapse, so a callout between
      // two paragraphs still sits in a 20px gap, not a 40px one.
      className={cn(
        "not-prose relative my-5 rounded-lg border p-4",
        styles.container,
        className,
      )}
      role="alert"
    >
      <div className="flex gap-3">
        {/* `mt-0.5` is optical, not arbitrary: the icon box is 20px inside a
            24px first line, so flush-top leaves it sitting 2px high. */}
        <div className={cn("mt-0.5 flex-shrink-0", styles.icon)}>
          {icon || defaultIcons[variant]}
        </div>
        <div className="flex-1">
          {title && <h4 className="mb-1 text-h4 font-semibold">{title}</h4>}
          {/* `space-y-3` because the boundary reset strips prose margins: a
              two-paragraph body used to run together with no gap at all. */}
          <div className="space-y-3 text-body-sm">{children}</div>
        </div>
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
