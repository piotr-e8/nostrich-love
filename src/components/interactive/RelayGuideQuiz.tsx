import React, { useMemo, useState } from "react";
import {
  Server,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  DollarSign,
  Gauge,
  Settings,
  Shield,
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
    id: "relay-types",
    title: "Relay Types",
    prompt: "What's the main difference between free and paid relays?",
    options: [
      {
        id: "cost",
        label: "Only the cost—functionality is identical",
        description: "Price is the only factor",
      },
      {
        id: "quality",
        label: "Paid relays usually offer better performance and less spam",
        description: "Quality difference",
      },
      {
        id: "access",
        label: "Free relays don't allow posting",
        description: "Read-only restriction",
      },
    ],
    correctId: "quality",
    explanation:
      "Paid relays typically offer better performance, higher reliability, less spam, and you're directly supporting relay operators. Free relays are great to start with, but paid options provide a premium experience.",
    severity: "info",
  },
  {
    id: "how-many",
    title: "Relay Strategy",
    prompt: "What's the recommended number of relays for an active user?",
    options: [
      {
        id: "minimal",
        label: "1-2 relays to keep it simple",
        description: "Minimal approach",
      },
      {
        id: "sweet",
        label: "5-10 relays",
        description: "Good balance",
      },
      {
        id: "maximum",
        label: "20+ relays for best coverage",
        description: "More is better",
      },
    ],
    correctId: "sweet",
    explanation:
      "5-10 relays is the sweet spot for active users. Too few and you miss content; too many and you waste bandwidth with diminishing returns. Quality over quantity!",
    severity: "warning",
  },
  {
    id: "why-pay",
    title: "Upgrading to Paid",
    prompt: "When should you consider paid relays?",
    options: [
      {
        id: "immediately",
        label: "Immediately when you start using Nostr",
        description: "Required from day one",
      },
      {
        id: "serious",
        label: "When you're serious about Nostr or free relays aren't meeting needs",
        description: "Upgrade when needed",
      },
      {
        id: "never",
        label: "Never—paid relays are a scam",
        description: "Avoid entirely",
      },
    ],
    correctId: "serious",
    explanation:
      "Consider paid relays when you're serious about Nostr long-term, free relays aren't meeting your performance needs, or you want to support the infrastructure. Start free, upgrade when it makes sense for you.",
    severity: "info",
  },
  {
    id: "own-relay",
    title: "Running Your Own Relay",
    prompt: "What are benefits of running your own relay?",
    options: [
      {
        id: "money",
        label: "You can charge others to use it",
        description: "Revenue generation",
      },
      {
        id: "control",
        label: "Complete control, privacy, custom policies",
        description: "Sovereignty benefits",
      },
      {
        id: "speed",
        label: "It's faster than using public relays",
        description: "Performance advantage",
      },
    ],
    correctId: "control",
    explanation:
      "Running your own relay gives you complete control over your data, enhanced privacy (only your data on the relay), and ability to set custom policies. It's about sovereignty, not speed or profit.",
    severity: "info",
  },
  {
    id: "decentralization",
    title: "Decentralization Concerns",
    prompt: "Why shouldn't you rely only on popular relays?",
    options: [
      {
        id: "cost",
        label: "They're more expensive than small relays",
        description: "Price concern",
      },
      {
        id: "centralization",
        label: "Concentrates power and goes against Nostr's decentralized ethos",
        description: "Philosophical alignment",
      },
      {
        id: "speed",
        label: "They're slower due to too many users",
        description: "Performance issue",
      },
    ],
    correctId: "centralization",
    explanation:
      "Relying only on a few large relays concentrates power and creates centralization risks. Nostr's strength comes from a diverse ecosystem of relays. Use a mix of large and small relays to support network health.",
    severity: "warning",
  },
];

interface RelayGuideQuizProps {
  className?: string;
}

export function RelayGuideQuiz({ className }: RelayGuideQuizProps) {
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
          <Server className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Relay Management: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Relay expertise"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You're a relay management expert!"
                  : "Review the relay guide sections you missed."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/relays-demystified"
            >
              Relay Basics →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/troubleshooting"
            >
              Fix Connection Issues
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
            Advanced Relay Quiz
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
          {currentQuestion.severity === "warning" && "Best Practice"}
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
    case "quality":
      return <DollarSign className="h-5 w-5 text-success-500" />;
    case "sweet":
      return <Gauge className="h-5 w-5 text-primary" />;
    case "serious":
      return <Settings className="h-5 w-5 text-blue-500" />;
    case "control":
      return <Shield className="h-5 w-5 text-purple-500" />;
    case "centralization":
      return <Lock className="h-5 w-5 text-warning-500" />;
    default:
      return <Server className="h-5 w-5 text-gray-400" />;
  }
}

export default RelayGuideQuiz;
