import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, BookOpen } from "lucide-react";
import { cn } from "../../lib/utils";
import { isGuideCompleted } from "../../lib/progressService";

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
        "border rounded-xl p-4 my-6 bg-amber-500/10 border-amber-500/30",
        className
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5 text-amber-500">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-2 text-amber-400">
            Prerequisites Recommended
          </h4>
          <p className="text-gray-300 text-sm mb-3">
            This guide builds on concepts from the following guides. We recommend completing them first:
          </p>
          <ul className="space-y-2">
            {prerequisites.map((prereq) => {
              const isCompleted = completedPrereqs.has(prereq.slug);
              return (
                <li key={prereq.slug} className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                  <a
                    href={`/guides/${prereq.slug}`}
                    className={cn(
                      "text-sm hover:underline transition-colors",
                      isCompleted
                        ? "text-green-400 line-through opacity-70"
                        : "text-amber-400 hover:text-amber-300"
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
