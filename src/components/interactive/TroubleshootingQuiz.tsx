import React, { useMemo, useState } from "react";
import {
  Wrench,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Eye,
  MessageSquare,
  Key,
  Wifi,
  Zap,
  UserX,
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
    id: "empty-feed",
    title: "Empty Feed",
    prompt: "Why is your feed empty?",
    options: [
      {
        id: "blocked",
        label: "You've been banned from Nostr",
        description: "Account suspension",
      },
      {
        id: "relays",
        label: "Not following anyone or not connected to relays",
        description: "#1 beginner issue",
      },
      {
        id: "waiting",
        label: "You need to wait 24 hours for approval",
        description: "Account activation required",
      },
    ],
    correctId: "relays",
    explanation:
      "The #1 beginner issue is an empty feed. This usually means you're not following anyone or not connected to relays. Add popular relays like wss://relay.damus.io and follow some accounts!",
    severity: "critical",
  },
  {
    id: "missing-posts",
    title: "Missing Old Posts",
    prompt: "Why can't you see your old posts?",
    options: [
      {
        id: "deleted",
        label: "Nostr automatically deletes posts after 30 days",
        description: "Built-in expiration",
      },
      {
        id: "relay-limits",
        label: "Relay storage limits or different relay configuration",
        description: "Technical reasons",
      },
      {
        id: "hidden",
        label: "Your posts were flagged as spam",
        description: "Content moderation",
      },
    ],
    correctId: "relay-limits",
    explanation:
      "Free relays often delete old content to save space. Also, if you posted from Client A (Relays X,Y) and now use Client B (Relays Z), posts might not appear. Connect to multiple relays for redundancy!",
    severity: "warning",
  },
  {
    id: "lost-keys",
    title: "Lost Keys",
    prompt: "Can you recover your account if you lose your private key (nsec)?",
    options: [
      {
        id: "email",
        label: "Yes, use the 'Forgot Password' feature",
        description: "Standard recovery",
      },
      {
        id: "support",
        label: "Yes, contact Nostr customer support",
        description: "Help desk assistance",
      },
      {
        id: "no-recovery",
        label: "No, there is no recovery",
        description: "Permanent loss",
      },
    ],
    correctId: "no-recovery",
    explanation:
      "There is NO recovery for lost keys in Nostr. No 'forgot password', no customer support, no admin to help. This is by design for decentralization. Back up your nsec safely NOW!",
    severity: "critical",
  },
  {
    id: "relay-connection",
    title: "Relay Connection",
    prompt: "Relay URL must start with what?",
    options: [
      {
        id: "https",
        label: "https://",
        description: "Standard web protocol",
      },
      {
        id: "wss",
        label: "wss:// (secure WebSocket)",
        description: "WebSocket secure",
      },
      {
        id: "nostr",
        label: "nostr://",
        description: "Custom protocol",
      },
    ],
    correctId: "wss",
    explanation:
      "Relay URLs must start with wss:// (secure WebSocket) or ws:// (insecure). A common mistake is using https:// which won't work for relay connections.",
    severity: "warning",
  },
  {
    id: "impersonation",
    title: "Impersonation",
    prompt: "How can you protect against impersonation?",
    options: [
      {
        id: "report",
        label: "Report to Nostr authorities",
        description: "Centralized reporting",
      },
      {
        id: "nip05",
        label: "Get NIP-05 verified and share your npub widely",
        description: "Verification methods",
      },
      {
        id: "legal",
        label: "File a lawsuit",
        description: "Legal action",
      },
    ],
    correctId: "nip05",
    explanation:
      "Get a NIP-05 identifier (human-readable name like you@domain.com) which shows a verification badge in clients. Also share your real npub on other platforms so people can verify cryptographically.",
    severity: "info",
  },
  {
    id: "zap-issues",
    title: "Zap Problems",
    prompt: "Why might zaps not work?",
    options: [
      {
        id: "maintenance",
        label: "Nostr is doing scheduled maintenance",
        description: "System downtime",
      },
      {
        id: "wallet",
        label: "No wallet connected, insufficient balance, or wallet offline",
        description: "Common technical issues",
      },
      {
        id: "banned",
        label: "Your account was banned from sending zaps",
        description: "Account restriction",
      },
    ],
    correctId: "wallet",
    explanation:
      "Zap issues are usually: no wallet connected in settings, insufficient balance, or non-custodial wallet (like Phoenix) being offline. Check Settings → Wallet and ensure you have funds!",
    severity: "warning",
  },
];

interface TroubleshootingQuizProps {
  className?: string;
}

export function TroubleshootingQuiz({ className }: TroubleshootingQuizProps) {
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
          <Wrench className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Troubleshooting Knowledge: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Problem-solving skills"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You're ready to solve Nostr issues!"
                  : "Keep this guide bookmarked for reference."
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
              href="/guides/keys-and-security"
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
            Troubleshooting Quiz
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
          {currentQuestion.severity === "critical" && "Critical Issue"}
          {currentQuestion.severity === "warning" && "Common Problem"}
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
    case "relays":
      return <Eye className="h-5 w-5 text-primary" />;
    case "relay-limits":
      return <MessageSquare className="h-5 w-5 text-warning-500" />;
    case "no-recovery":
      return <Key className="h-5 w-5 text-error-500" />;
    case "wss":
      return <Wifi className="h-5 w-5 text-blue-500" />;
    case "nip05":
      return <UserX className="h-5 w-5 text-purple-500" />;
    case "wallet":
      return <Zap className="h-5 w-5 text-amber-500" />;
    default:
      return <Wrench className="h-5 w-5 text-gray-400" />;
  }
}

export default TroubleshootingQuiz;
