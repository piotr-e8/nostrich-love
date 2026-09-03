import React, { useMemo, useState } from "react";
import {
  BookOpen,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Server,
  Database,
  Globe,
  Zap,
  Share2,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import { useQuizCompletion } from "../../hooks/useQuizCompletion";
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

interface OutboxModelQuizProps {
  className?: string;
}

export function OutboxModelQuiz({ className }: OutboxModelQuizProps) {
  const { t, getValue, locale } = useTranslation();
  
  // Get questions from translations using getValue to retrieve arrays/objects
  const rawQuestions = getValue("guides.outboxModel.quiz.questions");
  const questions: Question[] = Array.isArray(rawQuestions) ? rawQuestions : [];
  const quizTitle = t("guides.outboxModel.quiz.title") || "Outbox Model Quiz";
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  // Records the result once the reader reaches the results screen. Must stay
  // above the early return below — see useQuizCompletion for why.
  useQuizCompletion("outbox-model", showResults, questions, answers);

  // Handle case where translations haven't loaded yet
  if (!questions || questions.length === 0) {
    return (
      <div className={cn(
        "rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900",
        className
      )}>
        <div className="flex flex-col items-center text-center">
          <BookOpen aria-hidden="true" strokeWidth={1.5} className="h-6 w-6 animate-pulse text-gray-400 motion-reduce:animate-none dark:text-gray-500" />
          <p className="mt-4 text-body text-gray-600 dark:text-gray-300">{t("ui.quiz.loading")}</p>
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
          "animate-scale-in motion-reduce:animate-none rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900",
          className,
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="animate-spin-in motion-reduce:animate-none"
            style={{ animationDelay: "100ms" }}
          >
            <BookOpen aria-hidden="true" strokeWidth={1.5} className="h-6 w-6 text-primary-text dark:text-primary-400" />
          </div>
          
          <h3
            className="animate-slide-up motion-reduce:animate-none mt-4 text-h2 font-bold text-gray-900 dark:text-white"
            style={{ animationDelay: "200ms" }}
          >
            {t("ui.quiz.gradeTitle").replace("{{title}}", quizTitle).replace("{{rate}}", successRate.toString())}
          </h3>
          
          <p
            className="animate-slide-up motion-reduce:animate-none mt-2 text-body text-gray-600 dark:text-gray-300"
            style={{ animationDelay: "300ms" }}
          >
            {t("ui.quiz.scoreDisplay").replace("{{score}}", score.toString()).replace("{{total}}", total.toString())}
          </p>

          <div
            className="animate-slide-up motion-reduce:animate-none mt-6 grid w-full gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
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
              className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-3 font-semibold text-primary-text transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-primary-400 dark:hover:border-gray-700 dark:hover:bg-gray-800"
              href={guidePath("outbox-model", locale)}
            >
              {t("ui.quiz.reviewOutboxModel")}
            </a>
            <a
              className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-3 font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-800"
              href={guidePath("relays-demystified", locale)}
            >
              {t("ui.quiz.learnMoreRelays")}
            </a>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="animate-scale-in motion-reduce:animate-none mt-8 inline-flex items-center gap-2 rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-700 motion-reduce:transition-none"
            style={{ animationDelay: "600ms" }}
          >
            <RotateCcw aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
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
        "overflow-hidden rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            key={`title-${currentIndex}`}
            className="animate-slide-in-left motion-reduce:animate-none text-micro font-semibold uppercase text-primary-text dark:text-primary-400"
          >
            {quizTitle}
          </p>
          <h3
            key={`heading-${currentIndex}`}
            className="animate-slide-in-left motion-reduce:animate-none text-h3 font-bold text-gray-900 dark:text-white"
            style={{ animationDelay: "50ms" }}
          >
            {currentQuestion.title}
          </h3>
          <p
            key={`counter-${currentIndex}`}
            className="animate-slide-in-left motion-reduce:animate-none text-body-sm text-gray-500 dark:text-gray-400"
            style={{ animationDelay: "100ms" }}
          >
            {t("ui.quiz.questionCounter").replace("{{current}}", (currentIndex + 1).toString()).replace("{{total}}", total.toString())}
          </p>
        </div>
        {/* The label used to live INSIDE the fill, which at 1 of 6 answered is
            about 17% of a 224px track — so the text spilled out over the grey
            and read as broken. `Math.max(15, …)` and `min-w-[60px]` were there
            to paper over it, and they also made the bar overstate progress.
            Label above, bar below: the fill is now the true fraction. */}
        <div className="w-full sm:w-56">
          <p className="mb-1 text-end text-caption font-semibold text-gray-600 dark:text-gray-300">
            {answeredCount}/{total} {t("ui.quiz.answered")}
          </p>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
            role="progressbar"
            aria-valuenow={answeredCount}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={t("ui.quiz.answered")}
          >
            <div
              className="h-full rounded-full bg-primary-600 transition-[width] duration-500 ease-out-quint motion-reduce:transition-none"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div
        key={currentIndex}
        className="animate-slide-in-right motion-reduce:animate-none"
      >
          <div
            className="animate-slide-up motion-reduce:animate-none rounded-lg border border-gray-200 bg-gray-50 p-4 text-body-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
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
                    "animate-slide-up motion-reduce:animate-none w-full rounded-lg border px-4 py-3 text-start transition-colors motion-reduce:transition-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected && "border-primary bg-primary/10",
                    showState && isAnswer && "border-success-500 bg-success-500/10",
                    showState &&
                      isSelected &&
                      !isAnswer &&
                      "border-error-500 bg-error-500/15 animate-shake motion-reduce:animate-none",
                    !isSelected &&
                      !showState &&
                      "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800",
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
                            <CheckCircle2 aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 text-success-600 dark:text-success-400" />
                          </div>
                        )}
                        {showState && isSelected && !isAnswer && (
                          <div
                            className="animate-scale-pop motion-reduce:animate-none"
                            style={{ animationDelay: "200ms" }}
                          >
                            <XCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 text-error-600 dark:text-error-400" />
                          </div>
                        )}
                        <span className="sr-only">{showState && isAnswer ? t("ui.quiz.feedback.correct") : showState && isSelected && !isAnswer ? t("ui.quiz.feedback.incorrect") : ""}</span>
                      </div>
                      {option.description && (
                        <p className="text-body-sm text-gray-500 dark:text-gray-400">
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
                  "animate-slide-down motion-reduce:animate-none mt-4 overflow-hidden rounded-lg border px-4 py-3 text-body-sm",
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
                        <CheckCircle2 aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 text-success-600 dark:text-success-400" />
                      </span>
                      <span className="font-semibold">{t("ui.quiz.feedback.correct")}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-flex animate-scale-pop motion-reduce:animate-none"
                        style={{ animationDelay: "200ms" }}
                      >
                        <XCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 text-error-600 dark:text-error-400" />
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
          className="animate-fade-in motion-reduce:animate-none text-micro uppercase text-gray-500 dark:text-gray-400"
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
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-body-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 motion-reduce:transition-none"
          >
            <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 rtl:rotate-180" />
            {t("ui.quiz.backButton")}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOption}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-5 py-2 text-body-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50 motion-reduce:transition-none"
          >
            {currentIndex === total - 1 ? t("ui.quiz.seeResults") : t("ui.quiz.nextButton")}
            <ChevronRight aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 rtl:rotate-180" />
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
    <div className="flex items-center justify-between text-body-sm text-gray-600 dark:text-gray-300">
      <span>{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function renderOptionIcon(optionId: string) {
  const iconClass = "h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500";
  switch (optionId) {
    case "relays":
    case "store":
      return <Server aria-hidden="true" strokeWidth={1.5} className={iconClass} />;
    case "followers":
    case "contacts":
      return <Users aria-hidden="true" strokeWidth={1.5} className={iconClass} />;
    case "keys":
      return <Database aria-hidden="true" strokeWidth={1.5} className={iconClass} />;
    case "email":
    case "everyone":
      return <Globe aria-hidden="true" strokeWidth={1.5} className={iconClass} />;
    case "single":
      return <Zap aria-hidden="true" strokeWidth={1.5} className={iconClass} />;
    case "global":
    case "broadcast":
      return <Share2 aria-hidden="true" strokeWidth={1.5} className={iconClass} />;
    case "none":
      return <AlertTriangle aria-hidden="true" strokeWidth={1.5} className={iconClass} />;
    default:
      return <BookOpen aria-hidden="true" strokeWidth={1.5} className={iconClass} />;
  }
}

export default OutboxModelQuiz;