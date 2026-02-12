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
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    outline:
      "border-2 border-primary-500 text-primary-500 hover:bg-primary-500/10",
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/30 rounded-2xl p-8 text-center",
        className,
      )}
    >
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      {description && (
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">{description}</p>
      )}
      <a
        href={href}
        className={cn(
          "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
          variantStyles[variant],
        )}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
