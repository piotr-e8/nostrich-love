import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, BookOpen } from "lucide-react";
import { cn } from "../../lib/utils";
import { isGuideCompleted } from "../../lib/progressService";
import { guidePathFromLocation } from "../../i18n/paths";

interface Prerequisite {
  slug: string;
  title: string;
}

interface PrerequisiteWarningProps {
  prerequisites: Prerequisite[];
  className?: string;
}

export function PrerequisiteWarning({ prerequisites, className }: PrerequisiteWarningProps) {
  const [completedPrereqs, setCompletedPrereqs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check which prerequisites are completed
    const completed = new Set<string>();
    for (const prereq of prerequisites) {
      if (isGuideCompleted(prereq.slug)) {
        completed.add(prereq.slug);
      }
    }
    setCompletedPrereqs(completed);
    setIsLoading(false);
  }, [prerequisites]);

  // Don't show anything while loading
  if (isLoading) {
    return null;
  }

  const incompletePrereqs = prerequisites.filter(
    (prereq) => !completedPrereqs.has(prereq.slug)
  );

  // If all prerequisites are completed, don't show the warning
  if (incompletePrereqs.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-warning-200 bg-warning-50 p-4 dark:border-warning-900 dark:bg-warning-950",
        className
      )}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 flex-shrink-0 text-warning-600 dark:text-warning-400">
          <AlertTriangle className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h4 className="mb-2 text-h4 font-semibold text-warning-900 dark:text-warning-100">
            Prerequisites Recommended
          </h4>
          <p className="mb-3 text-body-sm text-gray-700 dark:text-gray-300">
            This guide builds on concepts from the following guides. We recommend completing them first:
          </p>
          <ul className="space-y-2">
            {prerequisites.map((prereq) => {
              const isCompleted = completedPrereqs.has(prereq.slug);
              return (
                <li key={prereq.slug} className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle
                      className="h-4 w-4 flex-shrink-0 text-success-700 dark:text-success-400"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  ) : (
                    <BookOpen
                      className="h-4 w-4 flex-shrink-0 text-warning-600 dark:text-warning-400"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  )}
                  <a
                    href={guidePathFromLocation(prereq.slug)}
                    className={cn(
                      "text-body-sm underline-offset-2 transition-colors hover:underline",
                      isCompleted
                        ? "text-gray-500 line-through dark:text-gray-400"
                        : "text-primary-text dark:text-primary-400"
                    )}
                  >
                    {prereq.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
