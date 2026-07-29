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
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import { guidePath } from "../../i18n/paths";

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

interface WhatIsNostrQuizProps {
  className?: string;
}

export function WhatIsNostrQuiz({ className }: WhatIsNostrQuizProps) {
  const { t, getValue, locale } = useTranslation();
  
  // Get questions from translations using getValue to retrieve arrays/objects
  const rawQuestions = getValue("guides.whatIsNostr.quiz.questions");
  const questions: Question[] = Array.isArray(rawQuestions) ? rawQuestions : [];
  const quizTitle = t("guides.whatIsNostr.quiz.title") || "What is Nostr Quiz";
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  // Handle case where translations haven't loaded yet
  if (!questions || questions.length === 0) {
    return (
      <div className={cn(
        "rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900",
        className
      )}>
        <div className="flex flex-col items-center text-center">
          <BookOpen className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-pulse" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t("ui.quiz.loading")}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;

  const score = useMemo(() => {
    return questions.reduce((acc: number, question: Question) => {
      if (answers[question.id] === question.correctId) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [answers, questions]);

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
          "animate-scale-in motion-reduce:animate-none rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900",
          className,
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="animate-spin-in motion-reduce:animate-none"
            style={{ animationDelay: "100ms" }}
          >
            <BookOpen className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          
          <h3
            className="animate-slide-up motion-reduce:animate-none mt-4 text-3xl font-bold text-gray-900 dark:text-white"
            style={{ animationDelay: "200ms" }}
          >
            {t("ui.quiz.gradeTitle").replace("{{title}}", quizTitle).replace("{{rate}}", successRate.toString())}
          </h3>
          
          <p
            className="animate-slide-up motion-reduce:animate-none mt-2 text-gray-600 dark:text-gray-300"
            style={{ animationDelay: "300ms" }}
          >
            {t("ui.quiz.scoreDisplay").replace("{{score}}", score.toString()).replace("{{total}}", total.toString())}
          </p>

          <div
            className="animate-slide-up motion-reduce:animate-none mt-6 grid w-full gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60"
            style={{ animationDelay: "400ms" }}
          >
            <ResultRow
              label={t("ui.quiz.conceptsMastered")}
              value={`${score} of ${total}`}
            />
            <ResultRow
              label={t("ui.quiz.nextSteps")}
              value={
                score === total
                  ? t("ui.quiz.perfectScore")
                  : t("ui.quiz.reviewSections")
              }
            />
          </div>

          <div
            className="animate-slide-up motion-reduce:animate-none mt-6 grid w-full gap-3 sm:grid-cols-2"
            style={{ animationDelay: "500ms" }}
          >
            <a
              className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-4 py-3 font-semibold text-primary-600 dark:text-primary-400 transition hover:bg-primary/10"
              href={guidePath("keys-and-security", locale)}
            >
              {t("ui.quiz.reviewKeys")}
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              href={guidePath("quickstart", locale)}
            >
              {t("ui.quiz.tryQuickstart")}
            </a>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="animate-scale-in motion-reduce:animate-none mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none"
            style={{ animationDelay: "600ms" }}
          >
            <RotateCcw className="h-4 w-4" />
            {t("ui.quiz.retakeQuiz")}
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
        "rounded-3xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 overflow-hidden",
        className,
      )}
    >
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            key={`title-${currentIndex}`}
            className="animate-slide-in-left motion-reduce:animate-none text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400"
          >
            {quizTitle}
          </p>
          <h3
            key={`heading-${currentIndex}`}
            className="animate-slide-in-left motion-reduce:animate-none text-2xl font-bold text-gray-900 dark:text-white"
            style={{ animationDelay: "50ms" }}
          >
            {currentQuestion.title}
          </h3>
          <p
            key={`counter-${currentIndex}`}
            className="animate-slide-in-left motion-reduce:animate-none text-sm text-gray-500 dark:text-gray-400"
            style={{ animationDelay: "100ms" }}
          >
            {t("ui.quiz.questionCounter").replace("{{current}}", (currentIndex + 1).toString()).replace("{{total}}", total.toString())}
          </p>
        </div>
        <div className="w-full rounded-full bg-gray-100 p-1 dark:bg-gray-800 sm:w-56">
          <div
            className="rounded-full bg-gradient-to-r from-primary to-secondary py-1 px-2 text-center text-xs font-semibold text-white min-w-[60px] transition-[width] duration-500 ease-out-quint motion-reduce:transition-none"
            style={{ width: `${Math.max(15, (answeredCount / total) * 100)}%` }}
          >
            {answeredCount}/{total} {t("ui.quiz.answered")}
          </div>
        </div>
      </header>

      <div
        key={currentIndex}
        className="animate-slide-in-right motion-reduce:animate-none"
      >
          <div
            className="animate-slide-up motion-reduce:animate-none rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-200"
            style={{ animationDelay: "100ms" }}
          >
            {currentQuestion.prompt}
          </div>

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, i) => {
              const isSelected = option.id === selectedOption;
              const isAnswer = option.id === currentQuestion.correctId;
              const showState = Boolean(selectedOption);

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => !showState && handleSelect(option.id)}
                  aria-pressed={isSelected}
                  disabled={showState}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className={cn(
                    "animate-slide-up motion-reduce:animate-none w-full rounded-2xl border px-4 py-3 text-start transition-all duration-300 motion-reduce:transition-none",
                    !showState &&
                      "hover:scale-[1.01] hover:translate-x-1 rtl:hover:-translate-x-1 active:scale-[0.99] motion-reduce:transform-none",
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
                          <div
                            className="animate-scale-pop motion-reduce:animate-none"
                            style={{ animationDelay: "200ms" }}
                          >
                            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-success-500" />
                          </div>
                        )}
                        {showState && isSelected && !isAnswer && (
                          <div
                            className="animate-scale-pop motion-reduce:animate-none"
                            style={{ animationDelay: "200ms" }}
                          >
                            <XCircle aria-hidden="true" className="h-4 w-4 text-error-500" />
                          </div>
                        )}
                        <span className="sr-only">{showState && isAnswer ? t("ui.quiz.feedback.correct") : showState && isSelected && !isAnswer ? t("ui.quiz.feedback.incorrect") : ""}</span>
                      </div>
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

          <div aria-live="polite">
            {selectedOption && (
              <div
                className={cn(
                  "animate-slide-down motion-reduce:animate-none mt-4 rounded-2xl border px-4 py-3 text-sm overflow-hidden",
                  isCorrect
                    ? "border-success-500 bg-success-500/10 text-success-900 dark:text-success-100"
                    : "border-error-500 bg-error-500/10 text-error-900 dark:text-error-100",
                )}
              >
                <div
                  className="animate-fade-in motion-reduce:animate-none"
                  style={{ animationDelay: "150ms" }}
                >
                  {isCorrect ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-flex animate-scale-pop motion-reduce:animate-none"
                        style={{ animationDelay: "200ms" }}
                      >
                        <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-success-500" />
                      </span>
                      <span className="font-semibold">{t("ui.quiz.feedback.correct")}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-flex animate-scale-pop motion-reduce:animate-none"
                        style={{ animationDelay: "200ms" }}
                      >
                        <XCircle aria-hidden="true" className="h-4 w-4 text-error-500" />
                      </span>
                      <span className="font-semibold">{t("ui.quiz.feedback.incorrect")}</span>
                    </span>
                  )}
                  {" "}{currentQuestion.explanation}
                </div>
              </div>
            )}
          </div>
      </div>

      <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="animate-fade-in motion-reduce:animate-none text-xs uppercase tracking-wider text-gray-400"
          style={{ animationDelay: "300ms" }}
        >
          {currentQuestion.severity === "critical" && t("ui.quiz.severity.critical")}
          {currentQuestion.severity === "warning" && t("ui.quiz.severity.warning")}
          {currentQuestion.severity === "info" && t("ui.quiz.severity.info")}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 motion-reduce:transition-none",
              currentIndex > 0 &&
                "hover:-translate-x-0.5 rtl:hover:translate-x-0.5 active:scale-[0.98] motion-reduce:transform-none",
            )}
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            {t("ui.quiz.backButton")}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOption}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition disabled:opacity-50 hover:shadow-lg motion-reduce:transition-none",
              selectedOption &&
                "hover:translate-x-0.5 rtl:hover:-translate-x-0.5 active:scale-[0.98] motion-reduce:transform-none",
            )}
          >
            {currentIndex === total - 1 ? t("ui.quiz.seeResults") : t("ui.quiz.nextButton")}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
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
    case "protocol":
      return <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
    case "npub":
      return <KeyRound className="h-5 w-5 text-success-500" />;
    case "no":
      return <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
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
