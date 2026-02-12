import React, { useMemo, useState } from "react";
import {
  MessageSquareLock,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Shield,
  Eye,
  Lock,
  Unlock,
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
    id: "purpose",
    title: "What is NIP-17?",
    prompt: "What is NIP-17?",
    options: [
      {
        id: "nip04",
        label: "Nostr's original DM protocol from 2019",
        description: "Legacy encryption",
      },
      {
        id: "seal",
        label: "Private Direct Messages using seal + gift wrap encryption",
        description: "Modern secure messaging",
      },
      {
        id: "group",
        label: "Group chat protocol for Nostr",
        description: "Multi-user conversations",
      },
    ],
    correctId: "seal",
    explanation:
      "NIP-17 is the modern standard for Private Direct Messages, using a dual-layer encryption system called 'seal + gift wrap' for enhanced privacy.",
    severity: "info",
  },
  {
    id: "nip04-problem",
    title: "The NIP-04 Problem",
    prompt: "What's the security issue with NIP-04?",
    options: [
      {
        id: "content",
        label: "Message content is not encrypted",
        description: "Plain text messages",
      },
      {
        id: "metadata",
        label: "Metadata is visible—anyone can see who talks to whom",
        description: "Envelope exposure",
      },
      {
        id: "hackable",
        label: "Messages can be easily hacked by anyone",
        description: "Weak encryption",
      },
    ],
    correctId: "metadata",
    explanation:
      "NIP-04's critical flaw: while message content is encrypted, the envelope exposes sender and recipient metadata. Relay operators can build social graphs showing who communicates with whom.",
    severity: "critical",
  },
  {
    id: "gift-wrap",
    title: "Gift Wrap Layer",
    prompt: "What does the 'gift wrap' layer hide?",
    options: [
      {
        id: "content-only",
        label: "Only the message content",
        description: "Inner encryption",
      },
      {
        id: "metadata",
        label: "All metadata—sender and recipient information",
        description: "Complete privacy",
      },
      {
        id: "nothing",
        label: "Nothing, it's just a decorative name",
        description: "No protection",
      },
    ],
    correctId: "metadata",
    explanation:
      "The gift wrap is the outer encryption layer that hides ALL metadata. Without the decryption key, no one can see who sent the message or who it's for.",
    severity: "info",
  },
  {
    id: "compatibility",
    title: "Client Compatibility",
    prompt: "What happens if you send NIP-17 to someone with NIP-04-only client?",
    options: [
      {
        id: "auto",
        label: "It automatically falls back to NIP-04",
        description: "Seamless compatibility",
      },
      {
        id: "gibberish",
        label: "They see unreadable/gibberish messages",
        description: "Incompatibility issue",
      },
      {
        id: "error",
        label: "Your client shows an error and won't send",
        description: "Prevention",
      },
    ],
    correctId: "gibberish",
    explanation:
      "If you send NIP-17 to someone whose client only supports NIP-04, they'll see unreadable or gibberish messages. Always verify both parties support NIP-17 for secure communication!",
    severity: "warning",
  },
  {
    id: "migration",
    title: "Migration Best Practice",
    prompt: "What should you do before sending sensitive info via DM?",
    options: [
      {
        id: "assume",
        label: "Assume everyone supports NIP-17 now",
        description: "Universal adoption",
      },
      {
        id: "verify",
        label: "Verify both parties use NIP-17-capable clients",
        description: "Check compatibility",
      },
      {
        id: "encrypt",
        label: "Encrypt the message yourself manually",
        description: "Additional security",
      },
    ],
    correctId: "verify",
    explanation:
      "Before sharing sensitive information, verify that both you and your contact use NIP-17-capable clients. Modern clients like Damus, Amethyst, and Primal support it.",
    severity: "warning",
  },
];

interface NIP17PrivateMessagesQuizProps {
  className?: string;
}

export function NIP17PrivateMessagesQuiz({ className }: NIP17PrivateMessagesQuizProps) {
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
          <MessageSquareLock className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            NIP-17 Knowledge: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Privacy concepts mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You're ready for secure messaging!"
                  : "Review the NIP-17 sections for better privacy."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/privacy-security"
            >
              Privacy & Security →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/keys-and-security"
            >
              Key Security Guide
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
            NIP-17 Quiz
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
          {currentQuestion.severity === "critical" && "Security Critical"}
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
    case "seal":
      return <MessageSquareLock className="h-5 w-5 text-primary" />;
    case "metadata":
      return <Eye className="h-5 w-5 text-warning-500" />;
    case "content-only":
      return <Unlock className="h-5 w-5 text-error-500" />;
    case "gibberish":
      return <UserX className="h-5 w-5 text-purple-500" />;
    case "verify":
      return <Shield className="h-5 w-5 text-success-500" />;
    default:
      return <Lock className="h-5 w-5 text-gray-400" />;
  }
}

export default NIP17PrivateMessagesQuiz;
