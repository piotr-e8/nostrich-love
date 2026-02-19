import React, { useMemo, useState } from "react";
import {
  BookOpen,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  KeyRound,
  Shield,
  Server,
  Database,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    id: "protocol-vs-platform",
    title: "Protocol vs Platform",
    prompt: "What's the key difference between Nostr and Twitter?",
    options: [
      {
        id: "faster",
        label: "Nostr is faster than Twitter",
        description: "Speed depends on many factors",
      },
      {
        id: "protocol",
        label: "Nostr is a protocol (like email), not a platform",
        description: "Anyone can build apps on the protocol",
      },
      {
        id: "free",
        label: "Nostr is completely free with no costs",
        description: "Some features like paid relays have costs",
      },
    ],
    correctId: "protocol",
    explanation:
      "Nostr is a protocol like email or the web itself. This means no single company owns it, and you can switch apps without losing your identity.",
    severity: "critical",
  },
  {
    id: "key-types",
    title: "Your Keys",
    prompt: "Which key is safe to share publicly?",
    options: [
      {
        id: "nsec",
        label: "nsec (private key)",
        description: "Starts with nsec1...",
      },
      {
        id: "npub",
        label: "npub (public key)",
        description: "Starts with npub1...",
      },
      {
        id: "both",
        label: "Both are safe to share",
        description: "Share freely with anyone",
      },
    ],
    correctId: "npub",
    explanation:
      "Your npub (public key) is like your username—share it everywhere. Your nsec (private key) is like your password—never share it with anyone.",
    severity: "critical",
  },
  {
    id: "censorship",
    title: "Censorship Resistance",
    prompt: "Can someone ban you from Nostr entirely?",
    options: [
      {
        id: "yes",
        label: "Yes, the Nostr admin can ban anyone",
        description: "There's centralized control",
      },
      {
        id: "no",
        label: "No, but they can ignore your posts",
        description: "No central authority to ban you",
      },
      {
        id: "sometimes",
        label: "Only if you break the rules",
        description: "There are terms of service",
      },
    ],
    correctId: "no",
    explanation:
      "No central authority can ban you from Nostr. Individual relays can choose not to carry your posts, but you can always use different relays.",
    severity: "info",
  },
  {
    id: "relays",
    title: "Relays Explained",
    prompt: "What do relays do in Nostr?",
    options: [
      {
        id: "mine",
        label: "They mine Bitcoin for zaps",
        description: "Processing Lightning payments",
      },
      {
        id: "store",
        label: "They store and forward messages",
        description: "Like post offices for your posts",
      },
      {
        id: "verify",
        label: "They verify your identity",
        description: "Check government-issued IDs",
      },
    ],
    correctId: "store",
    explanation:
      "Relays are servers that store your posts and share them with others. You choose which relays to use, and can switch anytime.",
    severity: "warning",
  },
  {
    id: "portability",
    title: "Data Portability",
    prompt: "What happens to your data if you switch Nostr clients?",
    options: [
      {
        id: "lost",
        label: "You lose everything and start over",
        description: "Data is trapped in the old app",
      },
      {
        id: "transfer",
        label: "You manually transfer your data",
        description: "Export/import process required",
      },
      {
        id: "automatic",
        label: "It comes with you automatically",
        description: "Posts and followers sync from relays",
      },
    ],
    correctId: "automatic",
    explanation:
      "Your posts and followers are stored on relays, not in the app. When you switch clients, everything syncs automatically—you just need your keys.",
    severity: "info",
  },
  {
    id: "responsibility",
    title: "Key Responsibility",
    prompt: "What happens if you lose your private key (nsec)?",
    options: [
      {
        id: "reset",
        label: "You can reset it via email",
        description: "Standard password reset process",
      },
      {
        id: "support",
        label: "Contact Nostr support to recover",
        description: "Customer service can help",
      },
      {
        id: "gone",
        label: "You lose your account forever",
        description: "No recovery possible",
      },
    ],
    correctId: "gone",
    explanation:
      "There's no 'forgot password' in Nostr. No customer support. No admin to help. Lose your nsec = lose your account forever. Back it up safely!",
    severity: "warning",
  },
];

interface WhatIsNostrQuizProps {
  className?: string;
}

export function WhatIsNostrQuiz({ className }: WhatIsNostrQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(0);

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
      setDirection(1);
      setShowResults(true);
      return;
    }
    setDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, total - 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleRestart = () => {
    setDirection(0);
    setCurrentIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  const optionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  if (showResults) {
    const successRate = Math.round((score / total) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        data-quiz
        className={cn(
          "rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900",
          className,
        )}
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1 
            }}
          >
            <BookOpen className="h-12 w-12 text-primary" />
          </motion.div>
          
          <motion.h3 
            className="mt-4 text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Nostr Knowledge: {successRate}%
          </motion.h3>
          
          <motion.p 
            className="mt-2 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {score} / {total} correct answers
          </motion.p>

          <motion.div 
            className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ResultRow
              label="Core concepts mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                score === total
                  ? "You're ready to start using Nostr!"
                  : "Review the guide sections you missed."
              }
            />
          </motion.div>

          <motion.div 
            className="mt-6 grid w-full gap-3 sm:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10"
              href="/guides/keys-and-security"
            >
              Learn About Keys →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/quickstart"
            >
              Try Quickstart Guide
            </a>
          </motion.div>

          <motion.button
            type="button"
            onClick={handleRestart}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-lg hover:bg-primary-600 hover:shadow-xl transition-all"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="h-4 w-4" />
            Retake quiz
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const selectedOption = answers[currentQuestion.id];
  const isCorrect = selectedOption === currentQuestion.correctId;

  return (
    <div
      data-quiz
      className={cn(
        "rounded-3xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 overflow-hidden",
        className,
      )}
    >
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.p 
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-semibold uppercase tracking-wider text-primary"
          >
            Nostr Basics Quiz
          </motion.p>
          <motion.h3 
            key={`heading-${currentIndex}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            {currentQuestion.title}
          </motion.h3>
          <motion.p 
            key={`counter-${currentIndex}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Question {currentIndex + 1} of {total}
          </motion.p>
        </div>
        <div className="w-full rounded-full bg-gray-100 p-1 dark:bg-gray-800 sm:w-56">
          <motion.div
            className="rounded-full bg-gradient-to-r from-primary to-secondary py-1 px-2 text-center text-xs font-semibold text-white min-w-[60px]"
            initial={{ width: `${Math.max(15, ((answeredCount - 1) / total) * 100)}%` }}
            animate={{ width: `${Math.max(15, (answeredCount / total) * 100)}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {answeredCount}/{total} answered
          </motion.div>
        </div>
      </header>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {currentQuestion.prompt}
          </motion.div>

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, i) => {
              const isSelected = option.id === selectedOption;
              const isAnswer = option.id === currentQuestion.correctId;
              const showState = Boolean(selectedOption);

              return (
                <motion.button
                  key={option.id}
                  custom={i}
                  variants={optionVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={!showState ? { scale: 1.01, x: 4 } : {}}
                  whileTap={!showState ? { scale: 0.99 } : {}}
                  type="button"
                  onClick={() => !showState && handleSelect(option.id)}
                  disabled={showState}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected && "border-primary bg-primary/10 shadow-md",
                    showState && isAnswer && "border-success-500 bg-success-500/10 shadow-md",
                    showState &&
                      isSelected &&
                      !isAnswer &&
                      "border-error-500 bg-error-500/10 shadow-md",
                    !isSelected &&
                      !showState &&
                      "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:shadow-sm",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {renderOptionIcon(option.id)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {option.label}
                        </p>
                        {showState && isAnswer && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                          >
                            <CheckCircle2 className="h-4 w-4 text-success-500" />
                          </motion.div>
                        )}
                        {showState && isSelected && !isAnswer && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                          >
                            <XCircle className="h-4 w-4 text-error-500" />
                          </motion.div>
                        )}
                      </div>
                      {option.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "mt-4 rounded-2xl border px-4 py-3 text-sm overflow-hidden",
                  isCorrect
                    ? "border-success-500 bg-success-500/10 text-success-900 dark:text-success-100"
                    : "border-error-500 bg-error-500/10 text-error-900 dark:text-error-100",
                )}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {isCorrect ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-success-500" />
                      </motion.span>
                      <span className="font-semibold">Nice!</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
                      >
                        <XCircle className="h-4 w-4 text-error-500" />
                      </motion.span>
                      <span className="font-semibold">Not quite</span>
                    </span>
                  )}
                  {" "}{currentQuestion.explanation}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <motion.div 
          className="text-xs uppercase tracking-wider text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {currentQuestion.severity === "critical" && "Core Concept"}
          {currentQuestion.severity === "warning" && "Important"}
          {currentQuestion.severity === "info" && "Good to Know"}
        </motion.div>

        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            whileHover={currentIndex > 0 ? { x: -2 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.98 } : {}}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </motion.button>
          <motion.button
            type="button"
            onClick={handleNext}
            disabled={!selectedOption}
            whileHover={selectedOption ? { x: 2 } : {}}
            whileTap={selectedOption ? { scale: 0.98 } : {}}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition disabled:opacity-50 hover:shadow-lg"
          >
            {currentIndex === total - 1 ? "See results" : "Next question"}
            <ChevronRight className="h-4 w-4" />
          </motion.button>
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
    case "protocol":
      return <BookOpen className="h-5 w-5 text-primary" />;
    case "npub":
      return <KeyRound className="h-5 w-5 text-success-500" />;
    case "no":
      return <Shield className="h-5 w-5 text-primary" />;
    case "store":
      return <Server className="h-5 w-5 text-blue-500" />;
    case "automatic":
      return <Database className="h-5 w-5 text-purple-500" />;
    case "gone":
      return <AlertTriangle className="h-5 w-5 text-error-500" />;
    default:
      return <BookOpen className="h-5 w-5 text-gray-400" />;
  }
}

export default WhatIsNostrQuiz;
