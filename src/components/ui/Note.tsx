import React from "react";
import { Callout, type CalloutVariant } from "./Callout";

interface NoteProps {
  children: React.ReactNode;
  type?: "info" | "warning";
  title?: string;
  className?: string;
}

// Note is a name the guides use, not a second design. It used to be its own
// component with its own tint table, its own icon offset and its own body
// colour (grey on a blue ground, while every Callout on the same page carried
// dark blue), which made two blue info boxes that did not match.
//
// It also shipped three looks and reached exactly one. All 21 call sites pass
// a prop the component does not have — `type="advanced"` (14) or
// `variant="info"` (7) — and MDX is not typechecked, so both fall through to
// the default. `tip` was the third look: a neutral grey box, unreachable and
// duplicating a box the system already had. It is gone. `warning` stays
// because Callout has that variant anyway, so it costs one branch rather than
// a parallel style table.
//
// The unknown-type fallback is deliberate: `advanced` has to keep rendering as
// the blue info box it renders as today.
const noteVariants: Record<string, CalloutVariant> = {
  info: "info",
  warning: "warning",
};

export function Note({ children, type = "info", title, className }: NoteProps) {
  return (
    <Callout
      variant={noteVariants[type as string] ?? "info"}
      title={title}
      className={className}
    >
      {children}
    </Callout>
  );
}
