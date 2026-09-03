import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";
import { cn } from "../../lib/utils";

export interface CTAButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  description?: string;
  href?: string;
  external?: boolean;
  showArrow?: boolean;
}

const variantMap: Record<
  NonNullable<CTAButtonProps["variant"]>,
  NonNullable<ButtonProps["variant"]>
> = {
  primary: "primary",
  secondary: "secondary",
  outline: "ghost",
  ghost: "ghost",
};

export function CTAButton({
  className,
  children,
  description,
  variant = "primary",
  size = "lg",
  href,
  external,
  showArrow = true,
  leftIcon,
  rightIcon,
  ...props
}: CTAButtonProps) {
  const content = (
    <Button
      variant={variantMap[variant]}
      size={size}
      className={cn(
        "flex w-full flex-col items-center gap-1 text-center sm:flex-row sm:justify-between sm:text-start",
        variant === "outline" &&
          "border border-gray-300 text-primary-text hover:bg-gray-50 dark:border-gray-700 dark:text-primary-400 dark:hover:bg-gray-800",
        className,
      )}
      leftIcon={leftIcon}
      rightIcon={
        showArrow && !rightIcon ? (
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          rightIcon
        )
      }
      {...props}
    >
      <span className="flex flex-col">
        <span className="text-body font-semibold">{children}</span>
        {description && (
          <span className="text-body-sm font-normal opacity-80">
            {description}
          </span>
        )}
      </span>
    </Button>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}
