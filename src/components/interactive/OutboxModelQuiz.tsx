import React, { useMemo, useState } from "react";
import {
  BookOpen,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Server,
  Database,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

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
  
  const rawQuestions = getValue("guides.outboxModel.quiz.questions");
  const questions: Question[] = Array.isArray(rawQuestions) ? rawQuestions : [];
  const quizTitle = t("guides.outboxModel.quiz.title") || "Outbox Model Quiz";
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className={cn(
        "rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900",
        className
      )}>
        <div className="flex flex-col items-center text-center">
          <BookOpen className="h-12 w-12 text-primary animate-pulse" />
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

  const successRate = Math.round((score / total) * 100);

  const handleSelect = (optionId: string) => {
    if (answers[currentQuestion.id]) return;
    
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
    setDirection(0);
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case "critical":
        return "text-red-600 dark:text-red-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
    }
  };

  const getSeverityBg = (severity: Severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20";
    }
  };

  if (showResults) {
    return (
      <div className={cn(
        "rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900",
        className
      )}>
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
            <span className="text-4xl font-bold text-white">
              {successRate >= 80 ? "A" : successRate >= 60 ? "B" : successRate >= 40 ? "C" : "D"}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("ui.quiz.gradeTitle").replace("{{title}}", quizTitle).replace("{{rate}}", successRate.toString())}
          </h3>
          
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("ui.quiz.scoreDisplay").replace("{{score}}", score.toString()).replace("{{total}}", total.toString())}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t("ui.quiz.conceptsMastered")}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <Database className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t("ui.quiz.nextSteps")}
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {successRate === 100 ? t("ui.quiz.perfectScore") : t("ui.quiz.reviewSections")}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {questions.map((q) => {
                const isCorrect = answers[q.id] === q.correctId;
                return (
                  <li key={q.id} className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={isCorrect ? "" : "text-red-600 dark:text-red-400"}>
                      {q.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            onClick={handleRestart}
            className="mt-8 flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary/90"
          >
            <RotateCcw className="h-4 w-4" />
            {t("ui.quiz.retakeQuiz")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900",
      className
    )}>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{quizTitle}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t("ui.quiz.questionCounter").replace("{{current}}", (currentIndex + 1).toString()).replace("{{total}}", total.toString())}
          </span>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
            style={{ width: `${((answeredCount) / total) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentQuestion.title}
            </h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {currentQuestion.prompt}
            </p>
            
            <div className={cn("mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium", getSeverityBg(currentQuestion.severity))}>
              <AlertTriangle className="h-4 w-4" />
              {currentQuestion.severity === "critical" && t("ui.quiz.severity.critical")}
              {currentQuestion.severity === "warning" && t("ui.quiz.severity.warning")}
              {currentQuestion.severity === "info" && t("ui.quiz.severity.info")}
            </div>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.id;
              const isCorrect = option.id === currentQuestion.correctId;
              const showState = answers[currentQuestion.id] !== undefined;
              
              return (
                <button
                  key={option.id}
                  onClick={() => !showState && handleSelect(option.id)}
                  disabled={showState}
                  className={cn(
                    "w-full rounded-xl border-2 p-4 text-left transition-all",
                    showState
                      ? isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isSelected
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-200 dark:border-gray-800"
                      : isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50 dark:border-gray-800 dark:hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium",
                      showState
                        ? isCorrect
                          ? "border-green-500 bg-green-500 text-white"
                          : isSelected
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-gray-300 dark:border-gray-600"
                        : isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 dark:border-gray-600"
                    )}>
                      {option.id.toUpperCase()}
                    </span>
                    <span className={cn(
                      "text-gray-900 dark:text-white",
                      showState && isCorrect && "font-medium text-green-700 dark:text-green-300"
                    )}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {answers[currentQuestion.id] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="flex items-start gap-3">
                {answers[currentQuestion.id] === currentQuestion.correctId ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                )}
                <div>
                  <p className={cn(
                    "font-medium",
                    answers[currentQuestion.id] === currentQuestion.correctId
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  )}>
                    {answers[currentQuestion.id] === currentQuestion.correctId
                      ? t("ui.quiz.feedback.correct")
                      : t("ui.quiz.feedback.incorrect")}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-all",
            currentIndex === 0
              ? "cursor-not-allowed text-gray-400"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          {t("ui.quiz.backButton")}
        </button>
        
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className={cn(
            "flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-all",
            !answers[currentQuestion.id]
              ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {currentIndex === total - 1 ? t("ui.quiz.seeResults") : t("ui.quiz.nextButton")}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
