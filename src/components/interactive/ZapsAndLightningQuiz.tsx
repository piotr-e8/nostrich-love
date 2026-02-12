import React, { useMemo, useState } from "react";
import {
  Zap,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Wallet,
  Shield,
  Bitcoin,
  CreditCard,
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
    id: "what-are-zaps",
    title: "Zaps Explained",
    prompt: "What are zaps in Nostr?",
    options: [
      {
        id: "likes",
        label: "Special types of likes with animations",
        description: "Visual engagement only",
      },
      {
        id: "bitcoin",
        label: "Bitcoin tips sent over Lightning Network",
        description: "Real value transfer",
      },
      {
        id: "boosts",
        label: "Paid post promotions for more visibility",
        description: "Advertising feature",
      },
    ],
    correctId: "bitcoin",
    explanation:
      "Zaps are Bitcoin tips sent over the Lightning Network. They're 'likes with value'—a way to support creators with real money instantly.",
    severity: "info",
  },
  {
    id: "wallet-types",
    title: "Wallet Security",
    prompt: "What's the key difference between custodial and non-custodial wallets?",
    options: [
      {
        id: "speed",
        label: "Custodial wallets are faster",
        description: "Performance difference",
      },
      {
        id: "control",
        label: "Custodial: They hold your keys | Non-custodial: You control keys",
        description: "Who controls your Bitcoin",
      },
      {
        id: "cost",
        label: "Non-custodial wallets are more expensive",
        description: "Fee difference",
      },
    ],
    correctId: "control",
    explanation:
      "With custodial wallets (like Alby), the provider holds your keys. With non-custodial wallets (like Phoenix), you control your own keys. 'Not your keys, not your coins!'",
    severity: "warning",
  },
  {
    id: "required",
    title: "Using Nostr",
    prompt: "Do you need Bitcoin to use Nostr?",
    options: [
      {
        id: "yes",
        label: "Yes, you need Bitcoin to create an account",
        description: "Payment required",
      },
      {
        id: "optional",
        label: "No, zaps are completely optional",
        description: "Free to use without zaps",
      },
      {
        id: "later",
        label: "You need it after your first month",
        description: "Trial period",
      },
    ],
    correctId: "optional",
    explanation:
      "Nostr is completely free to use! Zaps are optional. You can use Nostr forever without ever sending or receiving a single satoshi.",
    severity: "info",
  },
  {
    id: "receiving",
    title: "Receiving Zaps",
    prompt: "What do you need to receive zaps?",
    options: [
      {
        id: "hardware",
        label: "A hardware Bitcoin wallet",
        description: "Physical device required",
      },
      {
        id: "address",
        label: "Lightning wallet with address added to your profile",
        description: "Like you@walletofsatoshi.com",
      },
      {
        id: "business",
        label: "A registered business account",
        description: "KYC requirements",
      },
    ],
    correctId: "address",
    explanation:
      "To receive zaps, add your Lightning address (e.g., you@walletofsatoshi.com) to your Nostr profile. When someone zaps you, the sats go straight to your wallet!",
    severity: "critical",
  },
  {
    id: "amounts",
    title: "Zap Etiquette",
    prompt: "What's considered a standard 'thank you' zap amount?",
    options: [
      {
        id: "ten",
        label: "10 sats",
        description: "Minimum viable",
      },
      {
        id: "hundred",
        label: "100 sats",
        description: "Standard appreciation",
      },
      {
        id: "thousand",
        label: "1,000 sats",
        description: "Exceptional content",
      },
    ],
    correctId: "hundred",
    explanation:
      "100 sats is a standard 'thank you' zap. 21 sats is a minimum viable zap. 1,000+ sats says 'this was valuable.' Any amount shows appreciation!",
    severity: "info",
  },
  {
    id: "security",
    title: "Wallet Security",
    prompt: "What must you do when setting up a non-custodial wallet like Phoenix?",
    options: [
      {
        id: "nothing",
        label: "Nothing special—it just works",
        description: "Zero setup required",
      },
      {
        id: "seed",
        label: "Write down and safely store the recovery seed phrase",
        description: "Critical backup step",
      },
      {
        id: "verify",
        label: "Verify your identity with government ID",
        description: "KYC process",
      },
    ],
    correctId: "seed",
    explanation:
      "When using non-custodial wallets like Phoenix, you MUST write down the recovery seed phrase. Lose it = lose your Bitcoin forever. No exceptions!",
    severity: "critical",
  },
];

interface ZapsAndLightningQuizProps {
  className?: string;
}

export function ZapsAndLightningQuiz({ className }: ZapsAndLightningQuizProps) {
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
          <Zap className="h-12 w-12 text-warning-500" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Zap Knowledge: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Zap concepts mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You're ready to send and receive zaps!"
                  : "Review the zaps guide sections you missed."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/nostr-tools"
            >
              Find Wallet Tools →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/troubleshooting"
            >
              Fix Zap Issues
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
            Zaps Quiz
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
    case "bitcoin":
      return <Zap className="h-5 w-5 text-warning-500" />;
    case "control":
      return <Shield className="h-5 w-5 text-primary" />;
    case "optional":
      return <Wallet className="h-5 w-5 text-success-500" />;
    case "address":
      return <CreditCard className="h-5 w-5 text-blue-500" />;
    case "hundred":
      return <Bitcoin className="h-5 w-5 text-amber-500" />;
    case "seed":
      return <Lock className="h-5 w-5 text-error-500" />;
    default:
      return <Zap className="h-5 w-5 text-gray-400" />;
  }
}

export default ZapsAndLightningQuiz;
