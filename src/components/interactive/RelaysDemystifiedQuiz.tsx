import React, { useMemo, useState } from "react";
import {
  Server,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Mail,
  Unlink,
  DollarSign,
  Network,
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
    id: "relay-function",
    title: "Relay Basics",
    prompt: "In the post office analogy, what are relays?",
    options: [
      {
        id: "users",
        label: "The people who send messages",
        description: "Like postal customers",
      },
      {
        id: "offices",
        label: "Post offices where messages live and travel",
        description: "Servers storing and sharing posts",
      },
      {
        id: "boxes",
        label: "Your mailbox that holds your keys",
        description: "Personal storage containers",
      },
    ],
    correctId: "offices",
    explanation:
      "Relays are like post offices—they store your messages and forward them to others. You choose which post offices (relays) to use.",
    severity: "critical",
  },
  {
    id: "why-no-sync",
    title: "The Sync Problem",
    prompt: "You post to Relay A. Your friend only uses Relay B. What happens?",
    options: [
      {
        id: "auto",
        label: "Posts automatically sync between all relays",
        description: "Universal distribution",
      },
      {
        id: "manual",
        label: "You need to manually copy the post to Relay B",
        description: "Requires extra effort",
      },
      {
        id: "no-see",
        label: "Your friend won't see your post",
        description: "Unless they also connect to Relay A",
      },
    ],
    correctId: "no-see",
    explanation:
      "If you post to Relay A and your friend only uses Relay B, they won't see your post. This is the #1 confusion for new users! Connect to multiple relays to reach more people.",
    severity: "critical",
  },
  {
    id: "free-vs-paid",
    title: "Relay Types",
    prompt: "What's a key benefit of paid relays over free ones?",
    options: [
      {
        id: "more-users",
        label: "They have more users",
        description: "Larger network effect",
      },
      {
        id: "better",
        label: "Better performance, less spam, supports operators",
        description: "Higher quality service",
      },
      {
        id: "exclusive",
        label: "Only paid users can see your posts",
        description: "Private content access",
      },
    ],
    correctId: "better",
    explanation:
      "Paid relays typically offer better performance, less spam, and directly support the people running the infrastructure.",
    severity: "info",
  },
  {
    id: "how-many",
    title: "Relay Strategy",
    prompt: "How many relays should you connect to for good coverage?",
    options: [
      {
        id: "one",
        label: "Just 1 reliable relay",
        description: "Keep it simple",
      },
      {
        id: "many",
        label: "As many as possible (50+)",
        description: "Maximum redundancy",
      },
      {
        id: "balance",
        label: "4-8 relays",
        description: "Good balance of coverage and performance",
      },
    ],
    correctId: "balance",
    explanation:
      "4-8 relays hits the sweet spot. Too few and you miss content; too many and you waste bandwidth. Quality over quantity!",
    severity: "warning",
  },
  {
    id: "nip65",
    title: "NIP-65 (Advanced)",
    prompt: "What does the NIP-65 outbox model do?",
    options: [
      {
        id: "encrypt",
        label: "Encrypts all your posts automatically",
        description: "Enhanced security",
      },
      {
        id: "list",
        label: "Publishes your preferred relay list so clients know where to find you",
        description: "Smart relay discovery",
      },
      {
        id: "backup",
        label: "Backs up your posts to the cloud",
        description: "Data protection",
      },
    ],
    correctId: "list",
    explanation:
      "NIP-65 lets you publish a list of your preferred relays. Instead of manually connecting to 10+ relays, clients can read your list and automatically know where to find your posts.",
    severity: "info",
  },
];

interface RelaysDemystifiedQuizProps {
  className?: string;
}

export function RelaysDemystifiedQuiz({ className }: RelaysDemystifiedQuizProps) {
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
            Relay Knowledge: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Relay concepts mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You're ready to manage your relays!"
                  : "Review the relay guide sections you missed."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/relay-guide"
            >
              Advanced Relay Guide →
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
            Relays Quiz
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
    case "offices":
      return <Mail className="h-5 w-5 text-primary" />;
    case "no-see":
      return <Unlink className="h-5 w-5 text-warning-500" />;
    case "better":
      return <DollarSign className="h-5 w-5 text-success-500" />;
    case "balance":
      return <Server className="h-5 w-5 text-blue-500" />;
    case "list":
      return <Network className="h-5 w-5 text-purple-500" />;
    default:
      return <Server className="h-5 w-5 text-gray-400" />;
  }
}

export default RelaysDemystifiedQuiz;
