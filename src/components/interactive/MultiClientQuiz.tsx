import React, { useMemo, useState } from "react";
import {
  MonitorSmartphone,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  CheckCircle,
  XCircle,
  Smartphone,
  Monitor,
  Key,
  Shield,
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
    id: "why-multiple",
    title: "Benefits of Multiple Clients",
    prompt: "Why use multiple Nostr clients?",
    options: [
      {
        id: "required",
        label: "You need at least 3 clients to use Nostr",
        description: "Mandatory requirement",
      },
      {
        id: "optimization",
        label: "Optimization, flexibility, different features for different tasks",
        description: "Power user benefits",
      },
      {
        id: "backup",
        label: "In case one client gets hacked",
        description: "Security concern",
      },
    ],
    correctId: "optimization",
    explanation:
      "Multiple clients let you optimize your workflow—use the best tool for each task. Different clients have different strengths. You might use one for mobile, another for desktop, and another for specific features.",
    severity: "info",
  },
  {
    id: "what-syncs",
    title: "Understanding Sync",
    prompt: "What syncs automatically across clients?",
    options: [
      {
        id: "everything",
        label: "Everything including settings and drafts",
        description: "Perfect sync",
      },
      {
        id: "content",
        label: "Posts, follows, profile info (but not settings or drafts)",
        description: "Content sync only",
      },
      {
        id: "nothing",
        label: "Nothing—you start fresh on each client",
        description: "No sync at all",
      },
    ],
    correctId: "content",
    explanation:
      "Your posts, follows, and profile sync automatically because they're stored on relays. But client-specific things like settings, drafts, and themes don't sync—you need to configure those separately on each client.",
    severity: "critical",
  },
  {
    id: "workflow",
    title: "Common Workflows",
    prompt: "What's a common mobile + desktop workflow?",
    options: [
      {
        id: "random",
        label: "Use whichever is closest, no strategy needed",
        description: "Casual approach",
      },
      {
        id: "optimized",
        label: "Desktop for writing/long-form, mobile for quick checks/notifications",
        description: "Optimized workflow",
      },
      {
        id: "same",
        label: "Do exactly the same things on both devices",
        description: "Identical usage",
      },
    ],
    correctId: "optimized",
    explanation:
      "A common workflow: Desktop for writing long posts and heavy browsing (bigger screen, easier typing), mobile for quick checks, notifications, and on-the-go replies. Play to each device's strengths!",
    severity: "info",
  },
  {
    id: "switching",
    title: "Switching Clients",
    prompt: "What do you need to switch clients?",
    options: [
      {
        id: "account",
        label: "Create a new account on the new client",
        description: "Fresh start",
      },
      {
        id: "nsec",
        label: "Your nsec (private key)",
        description: "Your identity",
      },
      {
        id: "password",
        label: "Your Nostr password",
        description: "Login credentials",
      },
    ],
    correctId: "nsec",
    explanation:
      "To switch clients, you just need your nsec (private key). Import it into the new client and everything syncs automatically. Your identity works everywhere—no need to create new accounts!",
    severity: "critical",
  },
  {
    id: "testing",
    title: "Safe Testing",
    prompt: "How can you safely test a new client?",
    options: [
      {
        id: "main",
        label: "Use your main account to test thoroughly",
        description: "Real-world testing",
      },
      {
        id: "test-keys",
        label: "Create test keys first, try with test account",
        description: "Safe approach",
      },
      {
        id: "skip",
        label: "Skip testing—if it's on Nostr it must be safe",
        description: "Trust blindly",
      },
    ],
    correctId: "test-keys",
    explanation:
      "Always create test keys first when trying a new client. Test with a throwaway account before importing your real nsec. Only paste your real nsec into clients you trust!",
    severity: "warning",
  },
];

interface MultiClientQuizProps {
  className?: string;
}

export function MultiClientQuiz({ className }: MultiClientQuizProps) {
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
          <MonitorSmartphone className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Multi-Client Knowledge: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Workflow skills"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Status"
              value={
                score === total
                  ? "You're a multi-client power user!"
                  : "You're ready to optimize your workflow."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/quickstart"
            >
              Try Different Clients →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/privacy-security"
            >
              Security Best Practices
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
            Multi-Client Quiz
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
          {currentQuestion.severity === "critical" && "Must Know"}
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
    case "optimization":
      return <CheckCircle className="h-5 w-5 text-success-500" />;
    case "content":
      return <MonitorSmartphone className="h-5 w-5 text-primary" />;
    case "optimized":
      return <Monitor className="h-5 w-5 text-blue-500" />;
    case "nsec":
      return <Key className="h-5 w-5 text-purple-500" />;
    case "test-keys":
      return <Shield className="h-5 w-5 text-warning-500" />;
    default:
      return <Smartphone className="h-5 w-5 text-gray-400" />;
  }
}

export default MultiClientQuiz;
