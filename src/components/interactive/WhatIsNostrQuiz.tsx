import React, { useMemo, useState } from "react";
import {
  BookOpen,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  KeyRound,
  Shield,
  Server,
  Database,
  Lock,
} from "lucide-react";
import { cn } from "../../lib/utils";

type Severity = "critical" | "warning" | "info";

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface Question {
  id: string;
  title: string;
  prompt: string;
  options: Option[];
  correctId: string;
  explanation: string;
  severity: Severity;
}

const QUESTIONS: Question[] = [
  {
    id: "protocol-vs-platform",
    title: "Protocol vs Platform",
    prompt: "What's the key difference between Nostr and Twitter?",
    options: [
      {
        id: "faster",
        label: "Nostr is faster than Twitter",
        description: "Speed depends on many factors",
      },
      {
        id: "protocol",
        label: "Nostr is a protocol (like email), not a platform",
        description: "Anyone can build apps on the protocol",
      },
      {
        id: "free",
        label: "Nostr is completely free with no costs",
        description: "Some features like paid relays have costs",
      },
    ],
    correctId: "protocol",
    explanation:
      "Nostr is a protocol like email or the web itself. This means no single company owns it, and you can switch apps without losing your identity.",
    severity: "critical",
  },
  {
    id: "key-types",
    title: "Your Keys",
    prompt: "Which key is safe to share publicly?",
    options: [
      {
        id: "nsec",
        label: "nsec (private key)",
        description: "Starts with nsec1...",
      },
      {
        id: "npub",
        label: "npub (public key)",
        description: "Starts with npub1...",
      },
      {
        id: "both",
        label: "Both are safe to share",
        description: "Share freely with anyone",
      },
    ],
    correctId: "npub",
    explanation:
      "Your npub (public key) is like your username—share it everywhere. Your nsec (private key) is like your password—never share it with anyone.",
    severity: "critical",
  },
  {
    id: "censorship",
    title: "Censorship Resistance",
    prompt: "Can someone ban you from Nostr entirely?",
    options: [
      {
        id: "yes",
        label: "Yes, the Nostr admin can ban anyone",
        description: "There's centralized control",
      },
      {
        id: "no",
        label: "No, but they can ignore your posts",
        description: "No central authority to ban you",
      },
      {
        id: "sometimes",
        label: "Only if you break the rules",
        description: "There are terms of service",
      },
    ],
    correctId: "no",
    explanation:
      "No central authority can ban you from Nostr. Individual relays can choose not to carry your posts, but you can always use different relays.",
    severity: "info",
  },
  {
    id: "relays",
    title: "Relays Explained",
    prompt: "What do relays do in Nostr?",
    options: [
      {
        id: "mine",
        label: "They mine Bitcoin for zaps",
        description: "Processing Lightning payments",
      },
      {
        id: "store",
        label: "They store and forward messages",
        description: "Like post offices for your posts",
      },
      {
        id: "verify",
        label: "They verify your identity",
        description: "Check government-issued IDs",
      },
    ],
    correctId: "store",
    explanation:
      "Relays are servers that store your posts and share them with others. You choose which relays to use, and can switch anytime.",
    severity: "warning",
  },
  {
    id: "portability",
    title: "Data Portability",
    prompt: "What happens to your data if you switch Nostr clients?",
    options: [
      {
        id: "lost",
        label: "You lose everything and start over",
        description: "Data is trapped in the old app",
      },
      {
        id: "transfer",
        label: "You manually transfer your data",
        description: "Export/import process required",
      },
      {
        id: "automatic",
        label: "It comes with you automatically",
        description: "Posts and followers sync from relays",
      },
    ],
    correctId: "automatic",
    explanation:
      "Your posts and followers are stored on relays, not in the app. When you switch clients, everything syncs automatically—you just need your keys.",
    severity: "info",
  },
  {
    id: "responsibility",
    title: "Key Responsibility",
    prompt: "What happens if you lose your private key (nsec)?",
    options: [
      {
        id: "reset",
        label: "You can reset it via email",
        description: "Standard password reset process",
      },
      {
        id: "support",
        label: "Contact Nostr support to recover",
        description: "Customer service can help",
      },
      {
        id: "gone",
        label: "You lose your account forever",
        description: "No recovery possible",
      },
    ],
    correctId: "gone",
    explanation:
      "There's no 'forgot password' in Nostr. No customer support. No admin to help. Lose your nsec = lose your account forever. Back it up safely!",
    severity: "warning",
  },
];

interface WhatIsNostrQuizProps {
  className?: string;
}

export function WhatIsNostrQuiz({ className }: WhatIsNostrQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;

  const score = useMemo(() => {
    return QUESTIONS.reduce((acc, question) => {
      if (answers[question.id] === question.correctId) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [answers]);

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex === total - 1) {
      setShowResults(true);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev + 1, total - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const successRate = Math.round((score / total) * 100);

    return (
      <div
        data-quiz
        className={cn(
          "rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900",
          className,
        )}
      >
        <div className="flex flex-col items-center text-center">
          <BookOpen className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Nostr Knowledge: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Core concepts mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You're ready to start using Nostr!"
                  : "Review the guide sections you missed."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/keys-and-security"
            >
              Learn About Keys →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/quickstart"
            >
              Try Quickstart Guide
            </a>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow hover:bg-primary-600"
          >
            <RotateCcw className="h-4 w-4" />
            Retake quiz
          </button>
        </div>
      </div>
    );
  }

  const selectedOption = answers[currentQuestion.id];
  const isCorrect = selectedOption === currentQuestion.correctId;

  return (
    <div
      data-quiz
      className={cn(
        "rounded-3xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Nostr Basics Quiz
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentQuestion.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentIndex + 1} of {total}
          </p>
        </div>
        <div className="w-full rounded-full bg-gray-100 p-1 dark:bg-gray-800 sm:w-56">
          <div
            className="rounded-full bg-gradient-to-r from-primary to-secondary py-1 px-2 text-center text-xs font-semibold text-white min-w-[60px]"
            style={{ width: `${Math.max(15, (answeredCount / total) * 100)}%` }}
          >
            {answeredCount}/{total} answered
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-200">
        {currentQuestion.prompt}
      </div>

      <div className="mt-6 space-y-3">
        {currentQuestion.options.map((option) => {
          const isSelected = option.id === selectedOption;
          const isAnswer = option.id === currentQuestion.correctId;
          const showState = Boolean(selectedOption);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected && "border-primary bg-primary/10",
                showState && isAnswer && "border-success-500 bg-success-500/10",
                showState &&
                  isSelected &&
                  !isAnswer &&
                  "border-error-500 bg-error-500/10",
                !isSelected &&
                  !showState &&
                  "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
              )}
            >
              <div className="flex items-center gap-3">
                {renderOptionIcon(option.id)}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </p>
                  {option.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div
          className={cn(
            "mt-4 rounded-2xl border px-4 py-3 text-sm",
            isCorrect
              ? "border-success-500 bg-success-500/10 text-success-900 dark:text-success-100"
              : "border-error-500 bg-error-500/10 text-error-900 dark:text-error-100",
          )}
        >
          {isCorrect ? "Nice!" : "Not quite"}: {currentQuestion.explanation}
        </div>
      )}

      <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs uppercase tracking-wider text-gray-400">
          {currentQuestion.severity === "critical" && "Core Concept"}
          {currentQuestion.severity === "warning" && "Important"}
          {currentQuestion.severity === "info" && "Good to Know"}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOption}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
          >
            {currentIndex === total - 1 ? "See results" : "Next question"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

interface ResultRowProps {
  label: string;
  value: React.ReactNode;
}

function ResultRow({ label, value }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
      <span>{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function renderOptionIcon(optionId: string) {
  switch (optionId) {
    case "protocol":
      return <BookOpen className="h-5 w-5 text-primary" />;
    case "npub":
      return <KeyRound className="h-5 w-5 text-success-500" />;
    case "no":
      return <Shield className="h-5 w-5 text-primary" />;
    case "store":
      return <Server className="h-5 w-5 text-blue-500" />;
    case "automatic":
      return <Database className="h-5 w-5 text-purple-500" />;
    case "gone":
      return <AlertTriangle className="h-5 w-5 text-error-500" />;
    default:
      return <BookOpen className="h-5 w-5 text-gray-400" />;
  }
}

export default WhatIsNostrQuiz;
