import React, { useMemo, useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  EyeOff,
  Lock,
  UserX,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { recordActivity, awardBadge } from "../../utils/gamification";

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
    id: "threat-model",
    title: "Threat Assessment",
    prompt: "You're a software developer who wants to separate professional posts from personal opinions. What threat level applies?",
    options: [
      {
        id: "level1",
        label: "Level 1: Casual Privacy",
        description: "Basic separation of personal/professional life",
      },
      {
        id: "level2",
        label: "Level 2: Active Avoidance",
        description: "Avoiding doxxing, harassment, or stalking",
      },
      {
        id: "level3",
        label: "Level 3: High Security",
        description: "Protection from state actors",
      },
    ],
    correctId: "level1",
    explanation:
      "Separating professional from personal content is a Level 1 (Casual Privacy) concern. You just want to keep different aspects of your life separate, not hide from sophisticated adversaries.",
    severity: "info",
  },
  {
    id: "identity-separation",
    title: "Identity Separation",
    prompt: "You have a public professional account and a pseudonymous personal account. Which practice is SAFE?",
    options: [
      {
        id: "same-thread",
        label: "Post from both accounts in the same thread",
      },
      {
        id: "mention",
        label: "Mention your public account from your private one",
      },
      {
        id: "separate",
        label: "Keep completely separate content and social circles",
        description: "No cross-references, different topics, different followers",
      },
    ],
    correctId: "separate",
    explanation:
      "Complete separation is essential. Any connection between identities—same threads, mentions, writing style, or social circles—can reveal that two accounts belong to the same person.",
    severity: "warning",
  },
  {
    id: "signer-apps",
    title: "Signer Apps (NIP-46)",
    prompt: "What's the main benefit of using a signer app like Amber?",
    options: [
      {
        id: "faster",
        label: "Faster posting speed",
      },
      {
        id: "isolation",
        label: "Your private key never leaves the signer app",
        description: "Client apps request signatures without seeing your nsec",
      },
      {
        id: "customization",
        label: "Better profile customization options",
      },
    ],
    correctId: "isolation",
    explanation:
      "Signer apps provide key isolation—your nsec stays in the signer while client apps only request signatures. Even if a client is compromised, your keys remain safe.",
    severity: "critical",
  },
  {
    id: "metadata-leaks",
    title: "Metadata Analysis",
    prompt: "Which of these can reveal that two 'anonymous' accounts belong to the same person?",
    options: [
      {
        id: "clients",
        label: "Using different Nostr clients",
      },
      {
        id: "timing",
        label: "Posting at different times of day",
      },
      {
        id: "patterns",
        label: "Using the same unique phrases and following the same people",
        description: "Writing style, vocabulary, and social graph analysis",
      },
    ],
    correctId: "patterns",
    explanation:
      "Metadata analysis looks at writing style, vocabulary patterns, emoji usage, timing, and social graph connections. To maintain separate identities, you must vary all of these.",
    severity: "warning",
  },
  {
    id: "key-rotation",
    title: "Key Rotation Strategy",
    prompt: "When should you rotate your Nostr keys to a new identity?",
    options: [
      {
        id: "monthly",
        label: "Every month as routine maintenance",
      },
      {
        id: "fresh",
        label: "When you want a fresh start or new username",
      },
      {
        id: "compromise",
        label: "When you suspect compromise or accidental exposure",
        description: "Nsec exposed, device stolen, or suspicious activity",
      },
    ],
    correctId: "compromise",
    explanation:
      "Don't rotate casually—you lose all history and confuse followers. Only rotate when you suspect compromise (exposed nsec, stolen device, or suspicious activity).",
    severity: "critical",
  },
  {
    id: "recovery-planning",
    title: "Incident Response",
    prompt: "Your account is compromised. What's the FIRST thing you should do?",
    options: [
      {
        id: "angry",
        label: "Post an angry message calling out the attacker",
      },
      {
        id: "generate",
        label: "Immediately generate new keys and start posting",
      },
      {
        id: "stop",
        label: "Stop posting from the compromised account and document what happened",
        description: "Contain the breach before taking recovery actions",
      },
    ],
    correctId: "stop",
    explanation:
      "First, stop the bleeding—don't post from compromised accounts. Document the incident while it's fresh. Then create new keys, verify their security, and announce the rotation with proof you control both accounts.",
    severity: "critical",
  },
];

interface PrivacySecurityQuizProps {
  className?: string;
}

// Icon mapping for options
const OPTION_ICONS: Record<string, React.ReactNode> = {
  level1: <div className="h-5 w-5 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs font-bold text-gray-600">1</div>,
  level2: <div className="h-5 w-5 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs font-bold text-gray-600">2</div>,
  level3: <div className="h-5 w-5 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs font-bold text-gray-600">3</div>,
  "same-thread": <UserX className="h-5 w-5 text-gray-500" />,
  mention: <AlertTriangle className="h-5 w-5 text-gray-500" />,
  separate: <ShieldCheck className="h-5 w-5 text-gray-500" />,
  faster: <div className="h-5 w-5 rounded-full border-2 border-gray-400" />,
  isolation: <Lock className="h-5 w-5 text-gray-500" />,
  customization: <div className="h-5 w-5 rounded-full border-2 border-gray-400" />,
  clients: <div className="h-5 w-5 rounded-full border-2 border-gray-400" />,
  timing: <div className="h-5 w-5 rounded-full border-2 border-gray-400" />,
  patterns: <EyeOff className="h-5 w-5 text-gray-500" />,
  monthly: <div className="h-5 w-5 rounded-full border-2 border-gray-400" />,
  fresh: <div className="h-5 w-5 rounded-full border-2 border-gray-400" />,
  compromise: <AlertTriangle className="h-5 w-5 text-gray-500" />,
  angry: <div className="h-5 w-5 rounded-full border-2 border-gray-400" />,
  generate: <div className="h-5 w-5 rounded-full border-2 border-gray-400" />,
  stop: <ShieldCheck className="h-5 w-5 text-gray-500" />,
};

export function PrivacySecurityQuiz({ className }: PrivacySecurityQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(0);
  const [badgeAwarded, setBadgeAwarded] = useState(false);

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

  // Award badge when quiz is completed with perfect score
  useEffect(() => {
    if (showResults && score === total && !badgeAwarded) {
      // Award perfect score badge
      const success = awardBadge('privacy-expert' as any);
      if (success) {
        setBadgeAwarded(true);
      }
    }
  }, [showResults, score, total, badgeAwarded]);

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
      // Record quiz completion activity
      recordActivity();
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
    setBadgeAwarded(false);
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

  const renderOptionIcon = (optionId: string) => {
    return OPTION_ICONS[optionId] || <div className="h-5 w-5 rounded-full border-2 border-gray-400" />;
  };

  if (showResults) {
    const successRate = Math.round((score / total) * 100);
    const isPerfect = score === total;

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
            {isPerfect ? (
              <ShieldCheck className="h-12 w-12 text-green-500" />
            ) : (
              <EyeOff className="h-12 w-12 text-primary" />
            )}
          </motion.div>
          
          <motion.h3 
            className="mt-4 text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isPerfect ? "Privacy Expert!" : "Privacy & Security Grade:"} {isPerfect ? "" : `${successRate}%`}
          </motion.h3>
          
          <motion.p 
            className="mt-2 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {score} / {total} correct answers
          </motion.p>

          {badgeAwarded && (
            <motion.div
              className="mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-white font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
            >
              🏆 Badge Earned: Privacy Expert
            </motion.div>
          )}

          <motion.div 
            className="mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ResultRow
              label="Advanced concepts mastered"
              value={`${score} of ${total}`}
            />
            <ResultRow
              label="Next steps"
              value={
                isPerfect
                  ? "Excellent! You've mastered advanced privacy and security concepts."
                  : "Review the privacy sections you missed to strengthen your security posture."
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
              href="/guides/privacy-security"
            >
              Review Privacy Guide
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href="/guides/keys-and-security"
            >
              Back to Security Basics
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
            Privacy & Security Quiz
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
          className="order-2 flex items-center gap-2 sm:order-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all",
              currentIndex === 0
                ? "pointer-events-none border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600"
                : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary dark:hover:text-primary",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {total}
          </span>
        </motion.div>

        <motion.button
          onClick={handleNext}
          disabled={!selectedOption}
          className={cn(
            "order-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all sm:order-2",
            !selectedOption
              ? "pointer-events-none bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
              : "bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-lg",
          )}
          whileHover={selectedOption ? { scale: 1.02 } : {}}
          whileTap={selectedOption ? { scale: 0.98 } : {}}
        >
          {currentIndex === total - 1 ? "Finish" : "Next"}
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </footer>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

export default PrivacySecurityQuiz;
