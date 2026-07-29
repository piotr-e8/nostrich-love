import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  AlertCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Wifi,
  Eye,
  Key,
  Zap,
  Smartphone,
  Copy,
  ExternalLink,
  Info,
  FileText,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { cn, copyToClipboard } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { guidePathFromLocation } from "../../i18n/paths";

interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    next?: string;
    solution?: Solution;
  }[];
}

interface Solution {
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
  resources?: { label: string; url: string }[];
  severity: "low" | "medium" | "high";
}

interface TroubleshootingWizardProps {
  className?: string;
}

// Solutions definitions
const createSolutions = (t: (key: string) => string): Record<string, Solution> => ({
  lostKeys: {
    title: t('troubleshootingWizard.solutions.lostKeys.title'),
    description: t('troubleshootingWizard.solutions.lostKeys.description'),
    severity: "high",
    steps: [
      t('troubleshootingWizard.solutions.lostKeys.steps.0'),
      t('troubleshootingWizard.solutions.lostKeys.steps.1'),
      t('troubleshootingWizard.solutions.lostKeys.steps.2'),
      t('troubleshootingWizard.solutions.lostKeys.steps.3'),
      t('troubleshootingWizard.solutions.lostKeys.steps.4'),
    ],
    tips: [
      t('troubleshootingWizard.solutions.lostKeys.tips.0'),
      t('troubleshootingWizard.solutions.lostKeys.tips.1'),
      t('troubleshootingWizard.solutions.lostKeys.tips.2'),
    ],
    resources: [
      { label: "Key Generator", url: "#key-generator" },
      { label: "Security Guide", url: "#security" },
    ],
  },
  newUserFeed: {
    title: t('troubleshootingWizard.solutions.newUserFeed.title'),
    description: t('troubleshootingWizard.solutions.newUserFeed.description'),
    severity: "low",
    steps: [
      t('troubleshootingWizard.solutions.newUserFeed.steps.0'),
      t('troubleshootingWizard.solutions.newUserFeed.steps.1'),
      t('troubleshootingWizard.solutions.newUserFeed.steps.2'),
      t('troubleshootingWizard.solutions.newUserFeed.steps.3'),
      t('troubleshootingWizard.solutions.newUserFeed.steps.4'),
    ],
    tips: [
      t('troubleshootingWizard.solutions.newUserFeed.tips.0'),
      t('troubleshootingWizard.solutions.newUserFeed.tips.1'),
      t('troubleshootingWizard.solutions.newUserFeed.tips.2'),
    ],
    resources: [
      { label: "Empty Feed Fixer", url: guidePathFromLocation("quickstart") },
      { label: "Relay Explorer", url: "#relays" },
    ],
  },
  partialFeed: {
    title: t('troubleshootingWizard.solutions.partialFeed.title'),
    description: t('troubleshootingWizard.solutions.partialFeed.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.partialFeed.steps.0'),
      t('troubleshootingWizard.solutions.partialFeed.steps.1'),
      t('troubleshootingWizard.solutions.partialFeed.steps.2'),
      t('troubleshootingWizard.solutions.partialFeed.steps.3'),
      t('troubleshootingWizard.solutions.partialFeed.steps.4'),
    ],
    tips: [
      t('troubleshootingWizard.solutions.partialFeed.tips.0'),
      t('troubleshootingWizard.solutions.partialFeed.tips.1'),
      t('troubleshootingWizard.solutions.partialFeed.tips.2'),
    ],
  },
  checkRelays: {
    title: t('troubleshootingWizard.solutions.checkRelays.title'),
    description: t('troubleshootingWizard.solutions.checkRelays.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.checkRelays.steps.0'),
      t('troubleshootingWizard.solutions.checkRelays.steps.1'),
      t('troubleshootingWizard.solutions.checkRelays.steps.2'),
      t('troubleshootingWizard.solutions.checkRelays.steps.3'),
      t('troubleshootingWizard.solutions.checkRelays.steps.4'),
    ],
    resources: [{ label: "Relay Explorer", url: "#relays" }],
  },
  relayIssue: {
    title: t('troubleshootingWizard.solutions.relayIssue.title'),
    description: t('troubleshootingWizard.solutions.relayIssue.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.relayIssue.steps.0'),
      t('troubleshootingWizard.solutions.relayIssue.steps.1'),
      t('troubleshootingWizard.solutions.relayIssue.steps.2'),
      t('troubleshootingWizard.solutions.relayIssue.steps.3'),
      t('troubleshootingWizard.solutions.relayIssue.steps.4'),
    ],
    tips: [
      t('troubleshootingWizard.solutions.relayIssue.tips.0'),
      t('troubleshootingWizard.solutions.relayIssue.tips.1'),
      t('troubleshootingWizard.solutions.relayIssue.tips.2'),
    ],
  },
  offlineRelays: {
    title: t('troubleshootingWizard.solutions.offlineRelays.title'),
    description: t('troubleshootingWizard.solutions.offlineRelays.description'),
    severity: "high",
    steps: [
      t('troubleshootingWizard.solutions.offlineRelays.steps.0'),
      t('troubleshootingWizard.solutions.offlineRelays.steps.1'),
      t('troubleshootingWizard.solutions.offlineRelays.steps.2'),
      t('troubleshootingWizard.solutions.offlineRelays.steps.3'),
      t('troubleshootingWizard.solutions.offlineRelays.steps.4'),
    ],
    tips: [
      t('troubleshootingWizard.solutions.offlineRelays.tips.0'),
      t('troubleshootingWizard.solutions.offlineRelays.tips.1'),
      t('troubleshootingWizard.solutions.offlineRelays.tips.2'),
    ],
  },
  stuckConnecting: {
    title: t('troubleshootingWizard.solutions.stuckConnecting.title'),
    description: t('troubleshootingWizard.solutions.stuckConnecting.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.stuckConnecting.steps.0'),
      t('troubleshootingWizard.solutions.stuckConnecting.steps.1'),
      t('troubleshootingWizard.solutions.stuckConnecting.steps.2'),
      t('troubleshootingWizard.solutions.stuckConnecting.steps.3'),
      t('troubleshootingWizard.solutions.stuckConnecting.steps.4'),
    ],
  },
  notPublishing: {
    title: t('troubleshootingWizard.solutions.notPublishing.title'),
    description: t('troubleshootingWizard.solutions.notPublishing.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.notPublishing.steps.0'),
      t('troubleshootingWizard.solutions.notPublishing.steps.1'),
      t('troubleshootingWizard.solutions.notPublishing.steps.2'),
      t('troubleshootingWizard.solutions.notPublishing.steps.3'),
      t('troubleshootingWizard.solutions.notPublishing.steps.4'),
    ],
  },
  slowLoading: {
    title: t('troubleshootingWizard.solutions.slowLoading.title'),
    description: t('troubleshootingWizard.solutions.slowLoading.description'),
    severity: "low",
    steps: [
      t('troubleshootingWizard.solutions.slowLoading.steps.0'),
      t('troubleshootingWizard.solutions.slowLoading.steps.1'),
      t('troubleshootingWizard.solutions.slowLoading.steps.2'),
      t('troubleshootingWizard.solutions.slowLoading.steps.3'),
      t('troubleshootingWizard.solutions.slowLoading.steps.4'),
    ],
  },
  unstableConnection: {
    title: t('troubleshootingWizard.solutions.unstableConnection.title'),
    description: t('troubleshootingWizard.solutions.unstableConnection.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.unstableConnection.steps.0'),
      t('troubleshootingWizard.solutions.unstableConnection.steps.1'),
      t('troubleshootingWizard.solutions.unstableConnection.steps.2'),
      t('troubleshootingWizard.solutions.unstableConnection.steps.3'),
      t('troubleshootingWizard.solutions.unstableConnection.steps.4'),
    ],
  },
  zapNothing: {
    title: t('troubleshootingWizard.solutions.zapNothing.title'),
    description: t('troubleshootingWizard.solutions.zapNothing.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.zapNothing.steps.0'),
      t('troubleshootingWizard.solutions.zapNothing.steps.1'),
      t('troubleshootingWizard.solutions.zapNothing.steps.2'),
      t('troubleshootingWizard.solutions.zapNothing.steps.3'),
      t('troubleshootingWizard.solutions.zapNothing.steps.4'),
    ],
  },
  zapError: {
    title: t('troubleshootingWizard.solutions.zapError.title'),
    description: t('troubleshootingWizard.solutions.zapError.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.zapError.steps.0'),
      t('troubleshootingWizard.solutions.zapError.steps.1'),
      t('troubleshootingWizard.solutions.zapError.steps.2'),
      t('troubleshootingWizard.solutions.zapError.steps.3'),
      t('troubleshootingWizard.solutions.zapError.steps.4'),
    ],
  },
  zapNotReceived: {
    title: t('troubleshootingWizard.solutions.zapNotReceived.title'),
    description: t('troubleshootingWizard.solutions.zapNotReceived.description'),
    severity: "low",
    steps: [
      t('troubleshootingWizard.solutions.zapNotReceived.steps.0'),
      t('troubleshootingWizard.solutions.zapNotReceived.steps.1'),
      t('troubleshootingWizard.solutions.zapNotReceived.steps.2'),
      t('troubleshootingWizard.solutions.zapNotReceived.steps.3'),
      t('troubleshootingWizard.solutions.zapNotReceived.steps.4'),
    ],
  },
  noWallet: {
    title: t('troubleshootingWizard.solutions.noWallet.title'),
    description: t('troubleshootingWizard.solutions.noWallet.description'),
    severity: "low",
    steps: [
      t('troubleshootingWizard.solutions.noWallet.steps.0'),
      t('troubleshootingWizard.solutions.noWallet.steps.1'),
      t('troubleshootingWizard.solutions.noWallet.steps.2'),
      t('troubleshootingWizard.solutions.noWallet.steps.3'),
      t('troubleshootingWizard.solutions.noWallet.steps.4'),
    ],
    resources: [
      { label: "Get Alby Wallet", url: "https://getalby.com" },
      { label: "Zeus Wallet", url: "https://zeusln.com" },
    ],
  },
  appCrash: {
    title: t('troubleshootingWizard.solutions.appCrash.title'),
    description: t('troubleshootingWizard.solutions.appCrash.description'),
    severity: "high",
    steps: [
      t('troubleshootingWizard.solutions.appCrash.steps.0'),
      t('troubleshootingWizard.solutions.appCrash.steps.1'),
      t('troubleshootingWizard.solutions.appCrash.steps.2'),
      t('troubleshootingWizard.solutions.appCrash.steps.3'),
      t('troubleshootingWizard.solutions.appCrash.steps.4'),
    ],
  },
  blankScreen: {
    title: t('troubleshootingWizard.solutions.blankScreen.title'),
    description: t('troubleshootingWizard.solutions.blankScreen.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.blankScreen.steps.0'),
      t('troubleshootingWizard.solutions.blankScreen.steps.1'),
      t('troubleshootingWizard.solutions.blankScreen.steps.2'),
      t('troubleshootingWizard.solutions.blankScreen.steps.3'),
      t('troubleshootingWizard.solutions.blankScreen.steps.4'),
    ],
  },
  importFail: {
    title: t('troubleshootingWizard.solutions.importFail.title'),
    description: t('troubleshootingWizard.solutions.importFail.description'),
    severity: "high",
    steps: [
      t('troubleshootingWizard.solutions.importFail.steps.0'),
      t('troubleshootingWizard.solutions.importFail.steps.1'),
      t('troubleshootingWizard.solutions.importFail.steps.2'),
      t('troubleshootingWizard.solutions.importFail.steps.3'),
      t('troubleshootingWizard.solutions.importFail.steps.4'),
    ],
  },
  genericError: {
    title: t('troubleshootingWizard.solutions.genericError.title'),
    description: t('troubleshootingWizard.solutions.genericError.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.genericError.steps.0'),
      t('troubleshootingWizard.solutions.genericError.steps.1'),
      t('troubleshootingWizard.solutions.genericError.steps.2'),
      t('troubleshootingWizard.solutions.genericError.steps.3'),
      t('troubleshootingWizard.solutions.genericError.steps.4'),
    ],
  },
  profileNotFound: {
    title: t('troubleshootingWizard.solutions.profileNotFound.title'),
    description: t('troubleshootingWizard.solutions.profileNotFound.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.profileNotFound.steps.0'),
      t('troubleshootingWizard.solutions.profileNotFound.steps.1'),
      t('troubleshootingWizard.solutions.profileNotFound.steps.2'),
      t('troubleshootingWizard.solutions.profileNotFound.steps.3'),
      t('troubleshootingWizard.solutions.profileNotFound.steps.4'),
    ],
  },
  profileNoPosts: {
    title: t('troubleshootingWizard.solutions.profileNoPosts.title'),
    description: t('troubleshootingWizard.solutions.profileNoPosts.description'),
    severity: "low",
    steps: [
      t('troubleshootingWizard.solutions.profileNoPosts.steps.0'),
      t('troubleshootingWizard.solutions.profileNoPosts.steps.1'),
      t('troubleshootingWizard.solutions.profileNoPosts.steps.2'),
      t('troubleshootingWizard.solutions.profileNoPosts.steps.3'),
      t('troubleshootingWizard.solutions.profileNoPosts.steps.4'),
    ],
  },
  oldProfileData: {
    title: t('troubleshootingWizard.solutions.oldProfileData.title'),
    description: t('troubleshootingWizard.solutions.oldProfileData.description'),
    severity: "low",
    steps: [
      t('troubleshootingWizard.solutions.oldProfileData.steps.0'),
      t('troubleshootingWizard.solutions.oldProfileData.steps.1'),
      t('troubleshootingWizard.solutions.oldProfileData.steps.2'),
      t('troubleshootingWizard.solutions.oldProfileData.steps.3'),
      t('troubleshootingWizard.solutions.oldProfileData.steps.4'),
    ],
  },
  cantFollow: {
    title: t('troubleshootingWizard.solutions.cantFollow.title'),
    description: t('troubleshootingWizard.solutions.cantFollow.description'),
    severity: "medium",
    steps: [
      t('troubleshootingWizard.solutions.cantFollow.steps.0'),
      t('troubleshootingWizard.solutions.cantFollow.steps.1'),
      t('troubleshootingWizard.solutions.cantFollow.steps.2'),
      t('troubleshootingWizard.solutions.cantFollow.steps.3'),
      t('troubleshootingWizard.solutions.cantFollow.steps.4'),
    ],
  },
});

export function TroubleshootingWizard({
  className,
}: TroubleshootingWizardProps) {
  const { t } = useTranslation();
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("start");
  const [history, setHistory] = useState<string[]>([]);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [showDiagnosticInfo, setShowDiagnosticInfo] = useState(false);
  // Trap focus inside the dialog; Escape closes, focus returns to the opener.
  const diagnosticModalRef = useFocusTrap<HTMLDivElement>(showDiagnosticInfo, () =>
    setShowDiagnosticInfo(false),
  );
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    userAgent: "",
    platform: "",
    timestamp: "",
  });

  const solutions = getSolutions(t);
  const questions = getQuestions(solutions, t);
  const currentQuestion = questions[currentQuestionId];

  useEffect(() => {
    setDiagnosticInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleOptionSelect = (option: Question["options"][0]) => {
    if (option.solution) {
      setSolution(option.solution);
    } else if (option.next) {
      setHistory([...history, currentQuestionId]);
      setCurrentQuestionId(option.next);
    }
  };

  const goBack = () => {
    if (solution) {
      setSolution(null);
    } else if (history.length > 0) {
      const previous = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentQuestionId(previous);
    }
  };

  const reset = () => {
    setCurrentQuestionId("start");
    setHistory([]);
    setSolution(null);
  };

  const copyDiagnosticInfo = async () => {
    const info = `
Nostr Troubleshooting Diagnostic Info
================================
Date: ${diagnosticInfo.timestamp}
Platform: ${diagnosticInfo.platform}
User Agent: ${diagnosticInfo.userAgent}
Current Step: ${solution ? solution.title : currentQuestion?.text}
    `.trim();

    await copyToClipboard(info);
    alert(t('troubleshootingWizard.diagnosticInfo.copy') + "!");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-error-500 bg-error-500/10 border-error-500/30";
      case "medium":
        return "text-warning-500 bg-warning-500/10 border-warning-500/30";
      default:
        return "text-success-500 bg-success-500/10 border-success-500/30";
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4"
          >
            <Wrench className="w-8 h-8 text-primary-500" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('troubleshootingWizard.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('troubleshootingWizard.description')}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500"
              initial={{ width: 0 }}
              animate={{
                width: solution
                  ? "100%"
                  : `${((history.length + 1) / 5) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('troubleshootingWizard.step')} {history.length + (solution ? 1 : 0)}
          </span>
        </div>

        {/* Back Button */}
        {(history.length > 0 || solution) && (
          <button
            onClick={goBack}
            className="mb-4 inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('troubleshootingWizard.back')}
          </button>
        )}

        {/* Solution View */}
        <AnimatePresence mode="wait">
          {solution ? (
            <motion.div
              key="solution"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Severity Badge */}
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 border",
                  getSeverityColor(solution.severity),
                )}
              >
                <AlertCircle className="w-4 h-4" />
                {solution.severity === "high"
                  ? t('troubleshootingWizard.severity.high')
                  : solution.severity === "medium"
                    ? t('troubleshootingWizard.severity.medium')
                    : t('troubleshootingWizard.severity.low')}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {solution.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{solution.description}</p>

              {/* Steps */}
              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary-500" />
                  {t('troubleshootingWizard.stepsToFix')}
                </h4>
                <ol className="space-y-3">
                  {solution.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white text-sm font-medium flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {solution.tips && (
                <div className="bg-info-500/10 border border-info-500/30 rounded-xl p-4 mb-6">
                  <h4 className="font-medium text-info-500 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    {t('troubleshootingWizard.proTips')}
                  </h4>
                  <ul className="space-y-1">
                    {solution.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                      >
                        <span className="text-info-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources */}
              {solution.resources && solution.resources.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {t('troubleshootingWizard.helpfulResources')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {solution.resources.map((resource) => (
                      <a
                        key={resource.label}
                        href={resource.url}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 text-primary-500 hover:bg-primary-500/30 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {resource.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={reset}
                  className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-gray-900 dark:text-white rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  {t('troubleshootingWizard.startOver')}
                </button>
                <button
                  onClick={() => setShowDiagnosticInfo(true)}
                  className="py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  {t('troubleshootingWizard.saveDiagnosticInfo')}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Question */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {currentQuestion.text}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/5 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-500/20 rounded-xl flex items-center justify-center transition-colors">
                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-primary-500 transition-colors">
                          {option.icon || <ArrowRight className="w-5 h-5" />}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white flex-1">
                        {option.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary-500" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Button (when not showing solution) */}
        {!solution && history.length > 0 && (
          <button
            onClick={reset}
            className="mt-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white text-sm transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t('troubleshootingWizard.startOver')}
          </button>
        )}

        {/* Footer - Still Need Help */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">{t('troubleshootingWizard.stillNeedHelp')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://snort.social"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {t('troubleshootingWizard.askOnNostr')}
            </a>
            <a
              href="https://github.com/nostr-protocol/nostr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {t('troubleshootingWizard.documentation')}
            </a>
          </div>
        </div>
      </div>

      {/* Diagnostic Info Modal */}
      <AnimatePresence>
        {showDiagnosticInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDiagnosticInfo(false)}
          >
            <motion.div
              ref={diagnosticModalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="diagnostic-info-title"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="diagnostic-info-title" className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('troubleshootingWizard.diagnosticInfo.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {t('troubleshootingWizard.diagnosticInfo.description')}
              </p>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-4 font-mono text-xs text-gray-600 dark:text-gray-400 space-y-2">
                <p>
                  <span className="text-gray-600">Date:</span>{" "}
                  {diagnosticInfo.timestamp}
                </p>
                <p>
                  <span className="text-gray-600">Platform:</span>{" "}
                  {diagnosticInfo.platform}
                </p>
                <p>
                  <span className="text-gray-600">Browser:</span>{" "}
                  {diagnosticInfo.userAgent.slice(0, 50)}...
                </p>
                <p>
                  <span className="text-gray-600">Issue:</span>{" "}
                  {solution?.title || currentQuestion?.text}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyDiagnosticInfo}
                  className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-gray-900 dark:text-white rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {t('troubleshootingWizard.diagnosticInfo.copy')}
                </button>
                <button
                  onClick={() => setShowDiagnosticInfo(false)}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-all"
                >
                  {t('troubleshootingWizard.diagnosticInfo.close')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// We need to call createSolutions inside the component to access translations
// So we'll define a function to get solutions
const getSolutions = (t: (key: string) => string) => createSolutions(t);

// Define QUESTIONS as a function that accepts solutions
const getQuestions = (solutions: Record<string, Solution>, t: (key: string) => string): Record<string, Question> => ({
  start: {
    id: "start",
    text: t('troubleshootingWizard.questions.start.text'),
    options: [
      {
        label: t('troubleshootingWizard.questions.start.options.emptyFeed'),
        value: "empty-feed",
        icon: <Eye className="w-5 h-5" />,
        next: "feed-check",
      },
      {
        label: t('troubleshootingWizard.questions.start.options.connection'),
        value: "connection",
        icon: <Wifi className="w-5 h-5" />,
        next: "connection-check",
      },
      {
        label: t('troubleshootingWizard.questions.start.options.lostKeys'),
        value: "lost-keys",
        icon: <Key className="w-5 h-5" />,
        solution: solutions.lostKeys,
      },
      {
        label: t('troubleshootingWizard.questions.start.options.zaps'),
        value: "zaps",
        icon: <Zap className="w-5 h-5" />,
        next: "zap-check",
      },
      {
        label: t('troubleshootingWizard.questions.start.options.clientError'),
        value: "client-error",
        icon: <Smartphone className="w-5 h-5" />,
        next: "client-check",
      },
      {
        label: t('troubleshootingWizard.questions.start.options.profileIssue'),
        value: "profile-issue",
        icon: <Eye className="w-5 h-5" />,
        next: "profile-check",
      },
    ],
  },
  "feed-check": {
    id: "feed-check",
    text: t('troubleshootingWizard.questions.feedCheck.text'),
    options: [
      {
        label: t('troubleshootingWizard.questions.feedCheck.options.newUser'),
        value: "new-user",
        solution: solutions.newUserFeed,
      },
      {
        label: t('troubleshootingWizard.questions.feedCheck.options.wasWorking'),
        value: "was-working",
        next: "relay-check",
      },
      {
        label: t('troubleshootingWizard.questions.feedCheck.options.partial'),
        value: "partial",
        solution: solutions.partialFeed,
      },
    ],
  },
  "relay-check": {
    id: "relay-check",
    text: t('troubleshootingWizard.questions.relayCheck.text'),
    options: [
      { 
        label: t('troubleshootingWizard.questions.relayCheck.options.unknown'), 
        value: "unknown", 
        next: "checkRelays" 
      },
      {
        label: t('troubleshootingWizard.questions.relayCheck.options.connectedEmpty'),
        value: "connected-empty",
        solution: solutions.relayIssue,
      },
      {
        label: t('troubleshootingWizard.questions.relayCheck.options.offline'),
        value: "offline",
        solution: solutions.offlineRelays,
      },
    ],
  },
  "connection-check": {
    id: "connection-check",
    text: t('troubleshootingWizard.questions.connectionCheck.text'),
    options: [
      {
        label: t('troubleshootingWizard.questions.connectionCheck.options.connecting'),
        value: "connecting",
        solution: solutions.stuckConnecting,
      },
      {
        label: t('troubleshootingWizard.questions.connectionCheck.options.notPublishing'),
        value: "not-publishing",
        solution: solutions.notPublishing,
      },
      {
        label: t('troubleshootingWizard.questions.connectionCheck.options.slow'),
        value: "slow",
        solution: solutions.slowLoading,
      },
      {
        label: t('troubleshootingWizard.questions.connectionCheck.options.unstable'),
        value: "unstable",
        solution: solutions.unstableConnection,
      },
    ],
  },
  "zap-check": {
    id: "zap-check",
    text: t('troubleshootingWizard.questions.zapCheck.text'),
    options: [
      {
        label: t('troubleshootingWizard.questions.zapCheck.options.nothing'),
        value: "nothing",
        solution: solutions.zapNothing,
      },
      {
        label: t('troubleshootingWizard.questions.zapCheck.options.error'),
        value: "error",
        solution: solutions.zapError,
      },
      {
        label: t('troubleshootingWizard.questions.zapCheck.options.notReceived'),
        value: "not-received",
        solution: solutions.zapNotReceived,
      },
      {
        label: t('troubleshootingWizard.questions.zapCheck.options.noWallet'),
        value: "no-wallet",
        solution: solutions.noWallet,
      },
    ],
  },
  "client-check": {
    id: "client-check",
    text: t('troubleshootingWizard.questions.clientCheck.text'),
    options: [
      {
        label: t('troubleshootingWizard.questions.clientCheck.options.crash'),
        value: "crash",
        solution: solutions.appCrash,
      },
      {
        label: t('troubleshootingWizard.questions.clientCheck.options.blank'),
        value: "blank",
        solution: solutions.blankScreen,
      },
      {
        label: t('troubleshootingWizard.questions.clientCheck.options.import'),
        value: "import",
        solution: solutions.importFail,
      },
      {
        label: t('troubleshootingWizard.questions.clientCheck.options.other'),
        value: "other",
        solution: solutions.genericError,
      },
    ],
  },
  "profile-check": {
    id: "profile-check",
    text: t('troubleshootingWizard.questions.profileCheck.text'),
    options: [
      {
        label: t('troubleshootingWizard.questions.profileCheck.options.notFound'),
        value: "not-found",
        solution: solutions.profileNotFound,
      },
      {
        label: t('troubleshootingWizard.questions.profileCheck.options.noPosts'),
        value: "no-posts",
        solution: solutions.profileNoPosts,
      },
      {
        label: t('troubleshootingWizard.questions.profileCheck.options.oldData'),
        value: "old-data",
        solution: solutions.oldProfileData,
      },
      {
        label: t('troubleshootingWizard.questions.profileCheck.options.cantFollow'),
        value: "cant-follow",
        solution: solutions.cantFollow,
      },
    ],
  },
});
