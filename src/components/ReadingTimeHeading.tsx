import React from "react";
import { cn } from "../lib/utils";

interface ReadingTimeHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

/**
 * Parses heading text and extracts reading time from parentheses
 * Example: "The Solution (2 minutes read)" ->
 *   title: "The Solution", time: "2 minutes read"
 */
export function ReadingTimeHeading({
  level,
  children,
  className,
}: ReadingTimeHeadingProps) {
  // Convert children to string for parsing
  const childrenString = React.Children.toArray(children).join("");

  // Match pattern: text (X minutes read) or (X min) or (X minutes)
  const timePattern = /\s*\((\d+\s*(?:minutes?|mins?)\s*(?:read)?)\)\s*$/i;
  const match = childrenString.match(timePattern);

  const title = match
    ? childrenString.replace(timePattern, "").trim()
    : childrenString;
  const readingTime = match ? match[1] : null;

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className={cn("flex flex-wrap items-baseline gap-3", className)}
    >
      <span>{title}</span>
      {readingTime && (
        <span className="text-sm font-normal text-gray-400 dark:text-gray-500 whitespace-nowrap">
          ({readingTime})
        </span>
      )}
    </HeadingTag>
  );
}

/**
 * Utility to transform markdown headings with time indicators
 * Use this in MDX files: <H2>The Solution (2 minutes read)</H2>
 */
export function H2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ReadingTimeHeading level={2} className={className}>
      {children}
    </ReadingTimeHeading>
  );
}

export function H3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ReadingTimeHeading level={3} className={className}>
      {children}
    </ReadingTimeHeading>
  );
}
