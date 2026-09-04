import React from "react";
import { cn } from "../lib/utils";

export interface HoverCardProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * A definition aside inside a guide: the term, what it means, and usually one
 * line of example or analogy underneath.
 *
 * The name is a leftover. Nothing hovers and nothing ever did; renaming it
 * would touch 35 usages across seven locales, so it stays until something else
 * takes us into those files.
 *
 * It used to render as an icon in a tinted circle with the term and a small
 * gloss beside it, and then the definition as a separate paragraph at the
 * container's own padding. That put the heading and the body on two different
 * left edges with a gap between them, which is what made the card look broken.
 * It is now a description list: one left edge, one rhythm, and markup that says
 * what the thing is.
 */
export function HoverCard({
  term,
  definition,
  children,
  className,
}: HoverCardProps) {
  return (
    <dl
      className={cn(
        "my-6 rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <dt className="text-h4 font-semibold text-gray-900 dark:text-white">
        {term}
      </dt>
      {/* `dd` carries a browser default margin-inline-start; ms-0 keeps every
          line on the same edge as the term, in both directions. */}
      <dd className="ms-0 mt-2 text-body-sm text-gray-600 dark:text-gray-400">
        {definition}
      </dd>
      {children && (
        <dd className="ms-0 mt-2 border-t border-gray-200 pt-2 text-body-sm text-gray-500 dark:border-gray-800 dark:text-gray-500">
          {children}
        </dd>
      )}
    </dl>
  );
}
