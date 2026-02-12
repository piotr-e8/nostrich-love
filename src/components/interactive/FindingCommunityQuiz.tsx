import React, { useMemo, useState } from "react";
import {
  Users,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Hash,
  Heart,
  MessageSquare,
  UserPlus,
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
    id: "hashtag-strategy",
    title: "Hashtag Best Practices",
    prompt: "How many relevant hashtags should you use per post?",
    options: [
      {
        id: "many",
        label: "10+ hashtags for maximum reach",
        description: "Spam approach",
      },
      {
        id: "few",
        label: "2-5 hashtags",
        description: "Quality over quantity",
      },
      {
        id: "none",
        label: "No hashtags needed",
        description: "Skip them entirely",
      },
    ],
    correctId: "few",
    explanation:
      "Use 2-5 relevant hashtags per post. This is the sweet spot—enough to be discovered, not so many that it looks spammy. Quality over quantity always wins.",
    severity: "info",
  },
  {
    id: "finding-people",
    title: "Discovery Strategy",
    prompt: "What's the 'follow the followers' method?",
    options: [
      {
        id: "everyone",
        label: "Follow everyone who follows you back",
        description: "Reciprocal following",
      },
      {
        id: "taste",
        label: "Find one person you like, see who they follow, follow interesting ones",
        description: "Curated discovery",
      },
      {
        id: "algorithm",
        label: "Let the algorithm recommend people for you",
        description: "AI-powered suggestions",
      },
    ],
    correctId: "taste",
    explanation:
      "The 'follow the followers' method: Find one person whose content you enjoy, check who they follow (they probably have good taste), then follow the interesting accounts you find there.",
    severity: "info",
  },
  {
    id: "starting-point",
    title: "Building Your Feed",
    prompt: "How many accounts should you aim to follow initially?",
    options: [
      {
        id: "thousands",
        label: "Follow 1000+ accounts immediately",
        description: "Maximum content",
      },
      {
        id: "fifty",
        label: "50-100 active follows",
        description: "Sweet spot for engagement",
      },
      {
        id: "ten",
        label: "Just 10 close friends",
        description: "Minimal approach",
      },
    ],
    correctId: "fifty",
    explanation:
      "Aim for 50-100 active follows to start. This gives you enough content for a lively feed without being overwhelming. You can always add more later as you discover interesting people.",
    severity: "warning",
  },
  {
    id: "engagement",
    title: "Community Engagement",
    prompt: "What's the 80/20 rule for engagement?",
    options: [
      {
        id: "posting",
        label: "Post 80% of the time, engage 20%",
        description: "Content-focused",
      },
      {
        id: "value",
        label: "80% adding value, 20% self-promotion",
        description: "Community-first approach",
      },
      {
        id: "timing",
        label: "Be active 80% of the day, rest 20%",
        description: "Activity schedule",
      },
    ],
    correctId: "value",
    explanation:
      "The 80/20 rule: Spend 80% of your energy adding value (thoughtful replies, sharing insights, helping others) and only 20% on self-promotion. This builds genuine community.",
    severity: "info",
  },
  {
    id: "dm-safety",
    title: "DM Safety",
    prompt: "What should you never share in DMs?",
    options: [
      {
        id: "opinions",
        label: "Your controversial opinions",
        description: "Political views",
      },
      {
        id: "nsec",
        label: "Your private key (nsec)",
        description: "Never share your nsec!",
      },
      {
        id: "photos",
        label: "Personal photos",
        description: "Privacy concern",
      },
    ],
    correctId: "nsec",
    explanation:
      "NEVER share your nsec (private key) in DMs or anywhere else! Anyone with your nsec can post as you and steal your account. No legitimate person or service will ever ask for it.",
    severity: "critical",
  },
];

interface FindingCommunityQuizProps {
  className?: string;
}

export function FindingCommunityQuiz({ className }: FindingCommunityQuizProps) {
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
          <Users className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Community Knowledge: {successRate}%
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {score} / {total} correct answers
          </p>

          <div className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <ResultRow
              label="Community skills mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You're ready to build your Nostr community!"
                  : "Keep these tips in mind as you explore."
              }
            />
          </div>

          <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/quickstart"
            >
              Start Using Nostr →
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
            Community Quiz
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
          {currentQuestion.severity === "critical" && "Safety Critical"}
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
    case "few":
      return <Hash className="h-5 w-5 text-primary" />;
    case "taste":
      return <UserPlus className="h-5 w-5 text-success-500" />;
    case "fifty":
      return <Users className="h-5 w-5 text-blue-500" />;
    case "value":
      return <Heart className="h-5 w-5 text-purple-500" />;
    case "nsec":
      return <Lock className="h-5 w-5 text-error-500" />;
    default:
      return <MessageSquare className="h-5 w-5 text-gray-400" />;
  }
}

export default FindingCommunityQuiz;
