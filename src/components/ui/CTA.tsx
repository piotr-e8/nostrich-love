import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface CTAProps {
  title: string;
  description?: string;
  href: string;
  buttonText?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export function CTA({
  title,
  description,
  href,
  buttonText = "Get Started",
  variant = "primary",
  className,
}: CTAProps) {
  const variantStyles = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary:
      "bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600",
    outline:
      "border border-primary-600 text-primary-text hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-gray-800",
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <h3 className="text-h3 mb-3 text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="text-body-sm mx-auto mb-6 max-w-measure-narrow text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      <a
        href={href}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-6 py-3 font-medium transition-colors",
          variantStyles[variant],
        )}
      >
        {buttonText}
        <ArrowRight
          className="h-4 w-4 rtl:rotate-180"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
