import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Lock,
  KeyRound,
  Zap,
  EyeOff,
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
    id: "sharing-keys",
    title: "Key Safety",
    prompt: "Which item can you safely share with anyone?",
    options: [
      {
        id: "npub",
        label: "Your npub (public key)",
        description: "Lets others follow or message you",
      },
      {
        id: "nsec",
        label: "Your nsec (private key)",
        description: "Used to sign posts",
      },
      {
        id: "seed",
        label: "Your 12/24 word seed phrase",
        description: "Backups for lightning wallets",
      },
    ],
    correctId: "npub",
    explanation:
      "npub keys are public identity. Anything that starts with nsec or a seed phrase must stay offline.",
    severity: "critical",
  },
  {
    id: "backup-rule",
    title: "Backups",
    prompt: "What's the safest long-term backup strategy for your keys?",
    options: [
      {
        id: "photo",
        label: "Screenshot the keys and store in iCloud/Google Photos",
      },
      {
        id: "note",
        label: "Paste keys in a notes app protected by FaceID",
      },
      {
        id: "321",
        label: "Follow the 3-2-1 rule (3 copies / 2 media / 1 offline)",
      },
    ],
    correctId: "321",
    explanation:
      "Use at least three copies across two media types with one offline (paper, metal). Cloud screenshots are single points of failure.",
    severity: "critical",
  },
  {
    id: "suspicious-client",
    title: "New Client Test",
    prompt:
      "A brand-new Nostr app asks you to paste your private key to log in. What's the best move?",
    options: [
      {
        id: "paste",
        label: "Paste the key if the app has more than 100 users",
      },
      {
        id: "signer",
        label:
          "Use a signer / hardware key or wait until the client supports delegated signing",
      },
      {
        id: "temp",
        label: "Generate a throwaway key and migrate later",
      },
    ],
    correctId: "signer",
    explanation:
      "Never paste your main private key into new clients. Use a signer (NIP-46) or hardware solution and wait until delegated signing is supported.",
    severity: "warning",
  },
  {
    id: "metadata",
    title: "Metadata Hygiene",
    prompt: "How do you minimize metadata leaks on Nostr?",
    options: [
      {
        id: "gps",
        label: "Leave location tags enabled—it helps discovery",
      },
      {
        id: "personas",
        label:
          "Separate personas, strip EXIF data, avoid linking Lightning invoices between identities",
      },
      {
        id: "follow",
        label: "Follow as many relays as possible with one profile",
      },
    ],
    correctId: "personas",
    explanation:
      "Use separate profiles, disable location metadata, and keep Lightning/Zap info isolated when anonymity matters.",
    severity: "info",
  },
  {
    id: "relay-strategy",
    title: "Relay Strategy",
    prompt:
      "Which relay approach offers the best mix of reliability and privacy?",
    options: [
      {
        id: "single",
        label: "Use one mega-relay so everything is centralized",
      },
      {
        id: "mix",
        label:
          "Use a small set of trusted paid relays + a rotating set for discovery",
      },
      {
        id: "public",
        label: "Only use free open relays and never curate",
      },
    ],
    correctId: "mix",
    explanation:
      "Combining reputable paid relays with a few rotating public ones balances redundancy, spam resistance, and privacy.",
    severity: "warning",
  },
  {
    id: "zaps",
    title: "Zap Safety",
    prompt:
      "You're setting up zaps for the first time. Which step keeps your funds safest?",
    options: [
      {
        id: "custodial",
        label: "Reuse the same custodial wallet for every identity",
      },
      {
        id: "link",
        label:
          "Link a Lightning wallet you control and confirm zap requests before signing",
      },
      {
        id: "email",
        label: "Send your seed phrase to a relay so it can auto-withdraw",
      },
    ],
    correctId: "link",
    explanation:
      "Connect a wallet you control, confirm each request, and avoid sharing custodial accounts between identities.",
    severity: "info",
  },
];

interface SecurityQuizProps {
  className?: string;
}

export function SecurityQuiz({ className }: SecurityQuizProps) {
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
          <ShieldCheck className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Security Grade: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Critical concepts mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "Share your knowledge—help onboard someone new."
                  : "Review the sections you missed below."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/keys-and-security"
            >
              Review Keys & Backups
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/privacy-security"
            >
              Revisit Privacy Guide
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
            Security Quiz
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
          {currentQuestion.severity === "critical" && "P0 Critical"}
          {currentQuestion.severity === "warning" && "Best Practice"}
          {currentQuestion.severity === "info" && "Good to know"}
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
    case "npub":
      return <KeyRound className="h-5 w-5 text-primary" />;
    case "nsec":
      return <Lock className="h-5 w-5 text-error-500" />;
    case "321":
      return <ShieldCheck className="h-5 w-5 text-success-500" />;
    case "photo":
      return <AlertTriangle className="h-5 w-5 text-warning-500" />;
    case "personas":
      return <EyeOff className="h-5 w-5 text-purple-500" />;
    case "link":
      return <Zap className="h-5 w-5 text-amber-500" />;
    default:
      return <ShieldCheck className="h-5 w-5 text-gray-400" />;
  }
}

export default SecurityQuiz;
