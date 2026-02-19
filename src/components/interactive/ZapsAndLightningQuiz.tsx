import React, { useMemo, useState } from "react";
import {
  Zap,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Wallet,
  Shield,
  Bitcoin,
  CreditCard,
  Lock,
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
    setDirection(1);
    if (currentIndex === total - 1) {
      setShowResults(true);
      return;
    }
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
            <Zap className="h-12 w-12 text-warning-500" />
          </motion.div>
          
          <motion.h3 
            className="mt-4 text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Zap Knowledge: {successRate}%
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
          </motion.div>

          <motion.div 
            className="mt-6 grid w-full gap-3 sm:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
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
            Zaps Quiz
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
          {currentQuestion.severity === "critical" && "Must Know"}
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
