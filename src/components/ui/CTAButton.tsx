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
        "flex w-full flex-col items-center gap-1 text-center sm:flex-row sm:justify-between sm:text-left",
        variant === "outline" &&
          "border-2 border-primary/40 text-primary hover:bg-primary/10",
        className,
      )}
      leftIcon={leftIcon}
      rightIcon={
        showArrow && !rightIcon ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          rightIcon
        )
      }
      {...props}
    >
      <span className="flex flex-col">
        <span className="text-base font-semibold leading-tight">
          {children}
        </span>
        {description && (
          <span className="text-sm font-normal text-gray-200/80 dark:text-gray-200/70">
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
