import React from "react";
import { Confetti } from "./Animations";

export interface ConfettiAnimationProps {
  trigger?: "all-complete" | "manual";
  isActive?: boolean;
  duration?: number;
  particleCount?: number;
}

export function ConfettiAnimation({
  trigger,
  isActive,
  duration,
  particleCount,
}: ConfettiAnimationProps) {
  const active = trigger ? true : Boolean(isActive);
  return (
    <Confetti
      isActive={active}
      duration={duration}
      particleCount={particleCount}
    />
  );
}
