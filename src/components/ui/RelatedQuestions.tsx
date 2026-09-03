import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface RelatedQuestion {
  text: string;
  href: string;
}

interface RelatedQuestionsProps {
  currentPath?: string;
  questions: RelatedQuestion[];
  title?: string;
  className?: string;
}

export function RelatedQuestions({
  currentPath,
  questions,
  title = "Related Questions",
  className,
}: RelatedQuestionsProps) {
  // Filter out current page from related questions
  const filteredQuestions = currentPath
    ? questions.filter((q) => q.href !== currentPath)
    : questions;

  if (filteredQuestions.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <h3 className="mb-4 text-h3 text-gray-900 dark:text-white">{title}</h3>
      <div className="space-y-2">
        {filteredQuestions.map((question, index) => (
          <a
            key={index}
            href={question.href}
            className="group flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowRight
              className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-primary-text dark:text-gray-500 dark:group-hover:text-primary-400 rtl:rotate-180"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-body-sm text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
              {question.text}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
