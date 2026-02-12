import React, { useMemo, useState } from "react";
import {
  GitCompare,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Key,
  Shield,
  Network,
  Server,
  Users,
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
    id: "identity-model",
    title: "Identity Models",
    prompt: "How is identity handled in Nostr vs Mastodon (ActivityPub)?",
    options: [
      {
        id: "nostr-central",
        label: "Nostr uses central servers to assign identities",
        description: "Like traditional platforms",
      },
      {
        id: "mastodon-keys",
        label: "Mastodon uses cryptographic keys like Nostr",
        description: "Self-sovereign identity",
      },
      {
        id: "different",
        label: "Nostr: Self-sovereign keys | Mastodon: Server-assigned handles",
        description: "Key architectural difference",
      },
    ],
    correctId: "different",
    explanation:
      "Nostr uses self-sovereign cryptographic keys (npub/nsec) that you control completely. Mastodon uses server-assigned handles (like @user@server.com) that are tied to the server you join.",
    severity: "critical",
  },
  {
    id: "censorship-resistance",
    title: "Censorship Resistance",
    prompt: "Which protocol offers the highest censorship resistance?",
    options: [
      {
        id: "bluesky",
        label: "Bluesky AT Protocol",
        description: "Corporate-backed with moderation",
      },
      {
        id: "mastodon",
        label: "ActivityPub (Mastodon)",
        description: "Federated with server admins",
      },
      {
        id: "nostr",
        label: "Nostr",
        description: "No central authority",
      },
    ],
    correctId: "nostr",
    explanation:
      "Nostr offers maximum censorship resistance. No central authority can ban you from the protocol, anyone can run a relay, and content is cryptographically signed and can't be forged.",
    severity: "warning",
  },
  {
    id: "portability",
    title: "Data Portability",
    prompt: "Which protocols have native data portability?",
    options: [
      {
        id: "nostr-bluesky",
        label: "Nostr and Bluesky (ActivityPub is server-dependent)",
        description: "True ownership",
      },
      {
        id: "all",
        label: "All three protocols equally",
        description: "Standard feature",
      },
      {
        id: "mastodon",
        label: "Only ActivityPub (Mastodon)",
        description: "Most mature",
      },
    ],
    correctId: "nostr-bluesky",
    explanation:
      "Nostr and Bluesky have native data portability built into their design. ActivityPub's portability depends on your server and migration tools are limited.",
    severity: "info",
  },
  {
    id: "network-type",
    title: "Network Architecture",
    prompt: "What type of network is Nostr?",
    options: [
      {
        id: "federated",
        label: "Federated (servers talk to each other)",
        description: "Like Mastodon",
      },
      {
        id: "permissionless",
        label: "Permissionless relay network",
        description: "Anyone can run a relay",
      },
      {
        id: "centralized",
        label: "Centralized (single company controls)",
        description: "Like Twitter",
      },
    ],
    correctId: "permissionless",
    explanation:
      "Nostr is a permissionless relay network. Anyone can run a relay without approval, and relays don't communicate with each other—clients aggregate from multiple sources.",
    severity: "info",
  },
  {
    id: "best-use-case",
    title: "Choosing the Right Protocol",
    prompt: "Who should choose Nostr?",
    options: [
      {
        id: "mainstream",
        label: "Users wanting the most polished, mainstream experience",
        description: "Best UX",
      },
      {
        id: "communities",
        label: "Organizations needing strong community moderation",
        description: "Server-based control",
      },
      {
        id: "censorship",
        label: "Those prioritizing censorship resistance and data ownership",
        description: "Maximum freedom",
      },
    ],
    correctId: "censorship",
    explanation:
      "Choose Nostr if censorship resistance is your top priority, you want true data ownership, or you're part of the Bitcoin/cryptography community.",
    severity: "info",
  },
];

interface ProtocolComparisonQuizProps {
  className?: string;
}

export function ProtocolComparisonQuiz({ className }: ProtocolComparisonQuizProps) {
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
          <GitCompare className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Protocol Knowledge: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Protocol concepts mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You understand the key differences!"
                  : "Review the comparison sections you missed."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/what-is-nostr"
            >
              Nostr Basics →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/quickstart"
            >
              Get Started with Nostr
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
            Protocol Comparison Quiz
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
          {currentQuestion.severity === "critical" && "Key Concept"}
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
    case "different":
      return <Key className="h-5 w-5 text-primary" />;
    case "nostr":
      return <Shield className="h-5 w-5 text-success-500" />;
    case "nostr-bluesky":
      return <Network className="h-5 w-5 text-blue-500" />;
    case "permissionless":
      return <Server className="h-5 w-5 text-purple-500" />;
    case "censorship":
      return <Users className="h-5 w-5 text-amber-500" />;
    default:
      return <GitCompare className="h-5 w-5 text-gray-400" />;
  }
}

export default ProtocolComparisonQuiz;
