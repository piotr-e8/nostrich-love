import React from "react";
import { cn } from "../../lib/utils";

interface LogoTextProps {
  className?: string;
  showTagline?: boolean;
  enableScramble?: boolean;
  enableGlitch?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LogoText({
  className,
  showTagline = false,
  enableScramble = false,
  enableGlitch = false,
  size = "md",
}: LogoTextProps) {
  // Props kept for backward compatibility - new design is cleaner without scramble/glitch
  const sizeClasses = {
    sm: "text-xl sm:text-2xl",
    md: "text-2xl sm:text-3xl lg:text-4xl",
    lg: "text-4xl sm:text-5xl lg:text-6xl",
  };

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <div className={cn("relative group", className)}>
      <div className="relative flex items-center transition-transform duration-200 ease-out group-hover:scale-[1.02]">
        {/* Main text container */}
        <div className="flex items-baseline gap-0.5">
          {/* "nostrich" part - playful gradient */}
          <span
            className={cn(
              "font-bold tracking-tight bg-gradient-to-r from-primary-600 via-friendly-purple to-primary-500 bg-clip-text text-transparent",
              "dark:from-primary-400 dark:via-friendly-purple-300 dark:to-primary-300",
              "transition-all duration-300",
              "group-hover:brightness-110 group-hover:saturate-110",
              sizeClasses[size]
            )}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            nostrich
          </span>

          {/* Dot - static with hover glow */}
          <span
            className={cn(
              "relative inline-block rounded-full bg-gradient-to-br from-friendly-gold to-amber-500",
              "shadow-sm transition-all duration-300",
              "group-hover:shadow-[0_0_12px_rgba(251,191,36,0.6)] group-hover:scale-110",
              dotSizeClasses[size]
            )}
          />

          {/* ".love" part - warm gold color */}
          <span
            className={cn(
              "font-semibold tracking-tight text-amber-600 dark:text-friendly-gold-300",
              "transition-all duration-300",
              "group-hover:text-amber-500 dark:group-hover:text-friendly-gold-200",
              sizeClasses[size]
            )}
          >
            love
          </span>
        </div>

        {/* Optional tagline */}
        {showTagline && (
          <p className="absolute -bottom-5 left-0 text-xs text-gray-500 dark:text-gray-400 tracking-wide">
            Nostr made simple
          </p>
        )}
      </div>
    </div>
  );
}
