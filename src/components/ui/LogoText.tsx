import React from "react";
import { cn } from "../../lib/utils";

interface LogoTextProps {
  className?: string;
  showTagline?: boolean;
  enableScramble?: boolean;
  enableGlitch?: boolean;
  size?: "sm" | "md" | "lg";
}

// The wordmark used to be a three-stop gradient poured through `bg-clip-text`,
// with a hover that scaled, brightened and dropped a glow behind the dot — and
// it named Inter inline, a face the project no longer ships. It is now set in
// the display face, solid, with the dot carrying the only accent.
export function LogoText({
  className,
  showTagline = false,
  enableScramble = false,
  enableGlitch = false,
  size = "md",
}: LogoTextProps) {
  // Props kept for backward compatibility - new design is cleaner without scramble/glitch
  const sizeClasses = {
    sm: "text-h3",
    md: "text-h2 sm:text-h1",
    lg: "text-h1 sm:text-display",
  };

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <div className="flex items-baseline gap-0.5">
          <span
            className={cn(
              "font-display font-semibold text-gray-900 dark:text-white",
              sizeClasses[size],
            )}
          >
            nostrich
          </span>

          <span
            className={cn(
              "relative inline-block rounded-full bg-primary-600 dark:bg-primary-400",
              dotSizeClasses[size],
            )}
          />

          <span
            className={cn(
              "font-display font-semibold text-gray-900 dark:text-white",
              sizeClasses[size],
            )}
          >
            love
          </span>
        </div>

        {showTagline && (
          <p className="absolute -bottom-5 start-0 text-caption text-gray-500 dark:text-gray-400">
            Nostr made simple
          </p>
        )}
      </div>
    </div>
  );
}
