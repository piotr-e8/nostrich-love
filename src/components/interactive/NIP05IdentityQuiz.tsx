import React, { useMemo, useState } from "react";
import {
  AtSign,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  CheckCircle,
  FileJson,
  Globe,
  Share2,
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
    id: "purpose",
    title: "What is NIP-05?",
    prompt: "What does a NIP-05 identifier look like?",
    options: [
      {
        id: "npub",
        label: "npub1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        description: "Long random string",
      },
      {
        id: "nsec",
        label: "nsec1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        description: "Private key format",
      },
      {
        id: "human",
        label: "you@domain.com",
        description: "Human-readable format",
      },
    ],
    correctId: "human",
    explanation:
      "A NIP-05 identifier is a human-readable address like you@domain.com, making it much easier to share than long npub strings.",
    severity: "info",
  },
  {
    id: "benefits",
    title: "Benefits",
    prompt: "What's a major benefit of having a NIP-05?",
    options: [
      {
        id: "security",
        label: "It encrypts all your messages automatically",
        description: "Enhanced security",
      },
      {
        id: "appearance",
        label: "Easy to share, professional appearance, verification badge",
        description: "Multiple benefits",
      },
      {
        id: "required",
        label: "It's required to use Nostr",
        description: "Mandatory for posting",
      },
    ],
    correctId: "appearance",
    explanation:
      "NIP-05 gives you an easy-to-share identifier, looks more professional, and many clients show a verification badge. It's completely optional though!",
    severity: "info",
  },
  {
    id: "required-question",
    title: "Is It Required?",
    prompt: "Do you need a NIP-05 to use Nostr?",
    options: [
      {
        id: "yes",
        label: "Yes, you can't post without one",
        description: "Mandatory requirement",
      },
      {
        id: "no",
        label: "No, it's optional but recommended",
        description: "Nice to have",
      },
      {
        id: "recommended",
        label: "Only recommended for businesses",
        description: "Professional accounts only",
      },
    ],
    correctId: "no",
    explanation:
      "NIP-05 is completely optional! You can use Nostr perfectly well with just your npub. It's a convenience, not a requirement.",
    severity: "warning",
  },
  {
    id: "setup-location",
    title: "Setup Requirements",
    prompt: "Where must the nostr.json file be hosted for self-hosted NIP-05?",
    options: [
      {
        id: "root",
        label: "Anywhere on your website",
        description: "Flexible location",
      },
      {
        id: "specific",
        label: "At /.well-known/nostr.json",
        description: "Exact path required",
      },
      {
        id: "subdomain",
        label: "On a subdomain like nostr.yoursite.com",
        description: "Separate domain",
      },
    ],
    correctId: "specific",
    explanation:
      "For self-hosted NIP-05, the nostr.json file must be at the exact path /.well-known/nostr.json on your domain. This is where clients look for it.",
    severity: "critical",
  },
  {
    id: "centralization",
    title: "Decentralization Concerns",
    prompt: "Does using NIP-05 mean centralized identity?",
    options: [
      {
        id: "yes-centralized",
        label: "Yes, you're tied to one domain forever",
        description: "Centralized control",
      },
      {
        id: "no-flexible",
        label: "No, you can have multiple and change anytime",
        description: "Flexible and portable",
      },
      {
        id: "sometimes",
        label: "Only if you pay for it",
        description: "Depends on provider",
      },
    ],
    correctId: "no-flexible",
    explanation:
      "NIP-05 doesn't mean centralized identity! You can have multiple identifiers, change them anytime, and your npub is still your real identity. NIP-05 is just a pointer.",
    severity: "warning",
  },
];

interface NIP05IdentityQuizProps {
  className?: string;
}

export function NIP05IdentityQuiz({ className }: NIP05IdentityQuizProps) {
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
          <AtSign className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            NIP-05 Knowledge: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="NIP-05 concepts mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You're ready to get your NIP-05!"
                  : "Review the NIP-05 sections you missed."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="https://nostrplebs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Free NIP-05 →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/zaps-and-lightning"
            >
              Learn About Zaps
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
            NIP-05 Quiz
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
          {currentQuestion.severity === "critical" && "Setup Essential"}
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
    case "human":
      return <AtSign className="h-5 w-5 text-primary" />;
    case "appearance":
      return <CheckCircle className="h-5 w-5 text-success-500" />;
    case "no":
      return <Share2 className="h-5 w-5 text-blue-500" />;
    case "specific":
      return <FileJson className="h-5 w-5 text-purple-500" />;
    case "no-flexible":
      return <Globe className="h-5 w-5 text-amber-500" />;
    default:
      return <AtSign className="h-5 w-5 text-gray-400" />;
  }
}

export default NIP05IdentityQuiz;
