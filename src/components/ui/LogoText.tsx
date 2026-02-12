import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [displayText, setDisplayText] = useState("NOSTRICH.LOVE");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const targetText = "NOSTRICH.LOVE";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

  const sizeClasses = {
    sm: "text-xl sm:text-2xl",
    md: "text-2xl sm:text-3xl lg:text-4xl",
    lg: "text-4xl sm:text-5xl lg:text-6xl",
  };

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!enableScramble || prefersReducedMotion) {
      setDisplayText(targetText);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [enableScramble, prefersReducedMotion]);

  const handleMouseEnter = () => {
    if (!enableScramble || prefersReducedMotion) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2;
    }, 20);
  };

  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onMouseEnter={handleMouseEnter}
      >
        {/* Main text */}
        <h1
          className={cn(
            "font-bold tracking-wider text-white cursor-pointer select-none whitespace-nowrap",
            sizeClasses[size]
          )}
          style={{
            textShadow: "0 0 10px #8B5CF6, 0 0 20px #8B5CF6, 0 0 30px #8B5CF6",
          }}
        >
          {displayText.split("").map((char, i) => (
            <motion.span
              key={i}
              className={cn(
                "inline-block",
                char === "." && "text-cyan-400"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.05 }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Glitch effect layers */}
        {enableGlitch && !prefersReducedMotion && (
          <>
            <motion.div
              className={cn(
                "absolute inset-0 font-bold tracking-wider text-cyan-400 opacity-0 pointer-events-none whitespace-nowrap",
                sizeClasses[size]
              )}
              animate={{
                opacity: [0, 0.8, 0],
                x: [-2, 2, -2],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 5,
              }}
              style={{
                clipPath: "inset(10% 0 60% 0)",
              }}
            >
              {displayText}
            </motion.div>

            <motion.div
              className={cn(
                "absolute inset-0 font-bold tracking-wider text-purple-400 opacity-0 pointer-events-none whitespace-nowrap",
                sizeClasses[size]
              )}
              animate={{
                opacity: [0, 0.8, 0],
                x: [2, -2, 2],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 5,
                delay: 0.1,
              }}
              style={{
                clipPath: "inset(60% 0 10% 0)",
              }}
            >
              {displayText}
            </motion.div>
          </>
        )}

        {/* Tagline */}
        {showTagline && (
          <motion.p
            className="mt-2 text-xs sm:text-sm text-gray-400 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="text-cyan-400">[</span>
            {"Decentralized Social Protocol".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 + i * 0.02 }}
              >
                {char}
              </motion.span>
            ))}
            <span className="text-cyan-400">]</span>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
