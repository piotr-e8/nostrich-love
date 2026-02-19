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
        "bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-2">
        {filteredQuestions.map((question, index) => (
          <a
            key={index}
            href={question.href}
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
          >
            <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors" />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {question.text}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
