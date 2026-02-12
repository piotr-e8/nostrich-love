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
const createSolutions = (): Record<string, Solution> => ({
  lostKeys: {
    title: "Lost Keys - Prevention Focus",
    description:
      "Unfortunately, lost keys cannot be recovered. However, we can help you prevent this in the future.",
    severity: "high",
    steps: [
      "Create a new key pair using the Key Generator",
      "Immediately save your nsec in 3+ secure locations",
      "Consider using a password manager (1Password, Bitwarden)",
      "Write it down on paper and store in a safe place",
      "Never rely on browser cache or single device storage",
    ],
    tips: [
      'There is no "Forgot Password" in Nostr',
      "Your keys are your identity - treat them like cash",
      "Test your backup by restoring from it",
    ],
    resources: [
      { label: "Key Generator", url: "#key-generator" },
      { label: "Security Guide", url: "#security" },
    ],
  },
  newUserFeed: {
    title: "Welcome! Your Feed is Empty",
    description:
      "As a new user, your feed is empty because you need to follow people first.",
    severity: "low",
    steps: [
      "Go to the Empty Feed Fixer tool below",
      "Select a starter pack of accounts to follow",
      "Connect to 3-5 recommended relays",
      "Wait a few minutes for content to load",
      "Try following popular accounts manually",
    ],
    tips: [
      "Start with a starter pack for your interests",
      "Follow at least 10-20 accounts to see content",
      "Connect to multiple relays for better coverage",
    ],
    resources: [
      { label: "Empty Feed Fixer", url: "/guides/quickstart" },
      { label: "Relay Explorer", url: "#relays" },
    ],
  },
  partialFeed: {
    title: "Missing Some Posts",
    description: "Partial content usually means relay connectivity issues.",
    severity: "medium",
    steps: [
      "Check which relays you are connected to",
      "Add more relays (aim for 5-10 diverse relays)",
      "Wait a few minutes for sync to complete",
      "Try refreshing the feed",
      "Check if the missing users use different relays",
    ],
    tips: [
      "Different users post to different relays",
      "More relays = more content but slower loading",
      "Some relays may filter certain content",
    ],
  },
  checkRelays: {
    title: "Check Your Relay Connections",
    description: "Let's verify your relay setup.",
    severity: "medium",
    steps: [
      "Open your client settings",
      'Look for "Relays" or "Network" section',
      "Check if you have 3+ relays connected",
      "Test relay connections",
      "Add recommended relays if needed",
    ],
    resources: [{ label: "Relay Explorer", url: "#relays" }],
  },
  relayIssue: {
    title: "Relay Connection Issue",
    description: "Connected but no content suggests relay problems.",
    severity: "medium",
    steps: [
      'Check if relays show "online" status',
      "Remove and re-add problematic relays",
      "Try different relay URLs",
      "Check your internet connection",
      "Wait and try again later",
    ],
    tips: [
      "Relays sometimes go offline for maintenance",
      "Try geographically closer relays",
      "Free relays can be overloaded",
    ],
  },
  offlineRelays: {
    title: "All Relays Offline",
    description: "This usually indicates a network or configuration issue.",
    severity: "high",
    steps: [
      "Check your internet connection",
      "Verify relay URLs are correct (wss://...)",
      "Try different relays from the Relay Explorer",
      "Check if client is blocked by firewall",
      "Restart the app and try again",
    ],
    tips: [
      "Make sure URLs start with wss:// not https://",
      "Some networks block WebSocket connections",
      "Try using a VPN if on restricted network",
    ],
  },
  stuckConnecting: {
    title: "Stuck on Connecting",
    description: "The client is having trouble reaching relays.",
    severity: "medium",
    steps: [
      "Force close and reopen the app",
      "Check internet connection",
      "Remove slow or dead relays",
      "Try connecting to fewer relays (3-5)",
      "Clear app cache/data if on mobile",
    ],
  },
  notPublishing: {
    title: "Posts Not Publishing",
    description: "Your posts are failing to send.",
    severity: "medium",
    steps: [
      "Check if you have write-enabled relays",
      "Verify you have enough relays (at least 1)",
      "Try posting again - it might be temporary",
      "Check relay status - some require payment",
      "Reduce post length and try again",
    ],
  },
  slowLoading: {
    title: "Slow Loading",
    description: "Content is loading very slowly.",
    severity: "low",
    steps: [
      "Reduce number of connected relays",
      "Switch to faster relays (lower latency)",
      "Use the Relay Explorer to find fast relays",
      "Check your internet speed",
      "Close other apps using bandwidth",
    ],
  },
  unstableConnection: {
    title: "Unstable Connection",
    description: "Connection keeps dropping.",
    severity: "medium",
    steps: [
      "Remove unreliable relays",
      "Keep only 3-5 stable relays",
      "Use relays geographically closer to you",
      "Check if on unstable WiFi/mobile data",
      "Try using a VPN",
    ],
  },
  zapNothing: {
    title: "Zap Button Does Nothing",
    description: "Zap functionality may not be configured.",
    severity: "medium",
    steps: [
      "Ensure you have a lightning wallet connected",
      "Check if client supports zaps",
      "Verify your wallet has NWC configured",
      "Try a different client that supports zaps",
      "Check if the recipient accepts zaps",
    ],
  },
  zapError: {
    title: "Zap Error Message",
    description: "There is a specific error with your zap.",
    severity: "medium",
    steps: [
      "Note the exact error message",
      "Check wallet has sufficient balance",
      "Verify NWC connection is valid",
      "Try zapping a smaller amount",
      "Restart wallet and client apps",
    ],
  },
  zapNotReceived: {
    title: "Zap Sent But Not Received",
    description: "The zap was sent but recipient did not get it.",
    severity: "low",
    steps: [
      "Wait 5-10 minutes (lightning can be slow)",
      "Check your wallet transaction history",
      "Verify the recipient's lightning address",
      "Contact recipient to check their wallet",
      "Zaps sometimes fail silently - try again",
    ],
  },
  noWallet: {
    title: "No Wallet Connected",
    description: "You need a Bitcoin Lightning wallet to send zaps.",
    severity: "low",
    steps: [
      "Download a lightning wallet (Alby, Zeus, Phoenix)",
      "Fund the wallet with Bitcoin",
      "Connect wallet to your Nostr client via NWC",
      "Try sending a small test zap",
      "Start with 21 sats to test",
    ],
    resources: [
      { label: "Get Alby Wallet", url: "https://getalby.com" },
      { label: "Zeus Wallet", url: "https://zeusln.com" },
    ],
  },
  appCrash: {
    title: "App Crashes on Start",
    description: "The app crashes immediately when opened.",
    severity: "high",
    steps: [
      "Force close the app completely",
      "Restart your device",
      "Update to latest app version",
      "Clear app cache (Android) or reinstall",
      "Check if device meets minimum requirements",
    ],
  },
  blankScreen: {
    title: "Blank or White Screen",
    description: "The app opens but shows nothing.",
    severity: "medium",
    steps: [
      "Wait 30 seconds - might be loading",
      "Check internet connection",
      "Force close and reopen",
      "Clear app data/cache",
      "Try using web version instead",
    ],
  },
  importFail: {
    title: "Key Import Failed",
    description: "Unable to import your keys.",
    severity: "high",
    steps: [
      "Verify nsec format (starts with nsec1)",
      "Check for extra spaces or characters",
      "Try copying from a different source",
      "Use QR code scan if available",
      "Ensure you have the full key (63 chars)",
    ],
  },
  genericError: {
    title: "General Error",
    description: "An unexpected error occurred.",
    severity: "medium",
    steps: [
      "Note the exact error message",
      "Restart the application",
      "Check for app updates",
      "Try a different client",
      "Report the issue to developers",
    ],
  },
  profileNotFound: {
    title: "Profile Not Found",
    description: "The profile cannot be located.",
    severity: "medium",
    steps: [
      "Verify the npub is correct",
      "Try searching by NIP-05 instead",
      "Check if user uses a specific relay",
      "Add more relays to find the profile",
      "The user may have changed keys",
    ],
  },
  profileNoPosts: {
    title: "Profile Loads But No Posts",
    description: "Profile found but content is missing.",
    severity: "low",
    steps: [
      "Wait a moment for posts to load",
      "Connect to relays the user posts to",
      "The user may be new or inactive",
      "Try refreshing the profile",
      "Check different time periods",
    ],
  },
  oldProfileData: {
    title: "Outdated Profile Data",
    description: "Old profile information is showing.",
    severity: "low",
    steps: [
      "Pull down to refresh",
      "Clear app cache",
      "Reconnect to profile relay",
      "Wait for relays to sync",
      "Profile updates take time to propagate",
    ],
  },
  cantFollow: {
    title: "Cannot Follow User",
    description: "Follow action is not working.",
    severity: "medium",
    steps: [
      "Check internet connection",
      "Verify you have write-access to relays",
      "Try again in a few minutes",
      "Use a different client to follow",
      "Check if relays are functioning",
    ],
  },
});

export function TroubleshootingWizard({
  className,
}: TroubleshootingWizardProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("start");
  const [history, setHistory] = useState<string[]>([]);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [showDiagnosticInfo, setShowDiagnosticInfo] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    userAgent: "",
    platform: "",
    timestamp: "",
  });

  const currentQuestion = QUESTIONS[currentQuestionId];

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
    alert("Diagnostic info copied to clipboard!");
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
      <div className="bg-surface border border-border-dark rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4"
          >
            <Wrench className="w-8 h-8 text-primary-500" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Troubleshooting Wizard
          </h2>
          <p className="text-gray-400">
            Let's diagnose and fix your Nostr issue step by step
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
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
          <span className="text-sm text-gray-400">
            Step {history.length + (solution ? 1 : 0)}
          </span>
        </div>

        {/* Back Button */}
        {(history.length > 0 || solution) && (
          <button
            onClick={goBack}
            className="mb-4 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Solution View */}
        <AnimatePresence mode="wait">
          {solution ? (
            <motion.div
              key="solution"
              initial={{ opacity: 0, y: 20 }}
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
                  ? "High Priority"
                  : solution.severity === "medium"
                    ? "Medium Priority"
                    : "Low Priority"}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {solution.title}
              </h3>
              <p className="text-gray-400 mb-6">{solution.description}</p>

              {/* Steps */}
              <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary-500" />
                  Steps to Fix
                </h4>
                <ol className="space-y-3">
                  {solution.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {solution.tips && (
                <div className="bg-info-500/10 border border-info-500/30 rounded-xl p-4 mb-6">
                  <h4 className="font-medium text-info-500 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Pro Tips
                  </h4>
                  <ul className="space-y-1">
                    {solution.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-400 flex items-start gap-2"
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
                  <h4 className="font-medium text-white mb-3">
                    Helpful Resources
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
                  className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Start Over
                </button>
                <button
                  onClick={() => setShowDiagnosticInfo(true)}
                  className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Save Diagnostic Info
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Question */}
              <h3 className="text-xl font-bold text-white mb-6">
                {currentQuestion.text}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left p-4 border border-border-dark hover:border-primary-500 hover:bg-primary-500/5 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 group-hover:bg-primary-500/20 rounded-xl flex items-center justify-center transition-colors">
                        <span className="text-gray-400 group-hover:text-primary-500 transition-colors">
                          {option.icon || <ArrowRight className="w-5 h-5" />}
                        </span>
                      </div>
                      <span className="font-medium text-white flex-1">
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
            className="mt-6 text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </button>
        )}

        {/* Footer - Still Need Help */}
        <div className="mt-8 pt-6 border-t border-border-dark">
          <p className="text-center text-gray-400 mb-4">Still need help?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://snort.social"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Ask on Nostr
            </a>
            <a
              href="https://github.com/nostr-protocol/nostr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Documentation
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-border-dark rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Diagnostic Information
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Copy this information when asking for help. It helps developers
                understand your setup.
              </p>
              <div className="bg-gray-900 rounded-xl p-4 mb-4 font-mono text-xs text-gray-400 space-y-2">
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
                  className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => setShowDiagnosticInfo(false)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Create SOLUTIONS at module level so QUESTIONS can reference it
const SOLUTIONS = createSolutions();

// Define QUESTIONS after SOLUTIONS since we need to reference it
const QUESTIONS: Record<string, Question> = {
  start: {
    id: "start",
    text: "What's your problem?",
    options: [
      {
        label: "Empty feed / No posts",
        value: "empty-feed",
        icon: <Eye className="w-5 h-5" />,
        next: "feed-check",
      },
      {
        label: "Connection issues",
        value: "connection",
        icon: <Wifi className="w-5 h-5" />,
        next: "connection-check",
      },
      {
        label: "Lost or forgot keys",
        value: "lost-keys",
        icon: <Key className="w-5 h-5" />,
        solution: SOLUTIONS.lostKeys,
      },
      {
        label: "Zaps not working",
        value: "zaps",
        icon: <Zap className="w-5 h-5" />,
        next: "zap-check",
      },
      {
        label: "Client crashes or errors",
        value: "client-error",
        icon: <Smartphone className="w-5 h-5" />,
        next: "client-check",
      },
      {
        label: "Can't see someone's profile",
        value: "profile-issue",
        icon: <Eye className="w-5 h-5" />,
        next: "profile-check",
      },
    ],
  },
  "feed-check": {
    id: "feed-check",
    text: "When did your feed become empty?",
    options: [
      {
        label: "Just started using Nostr",
        value: "new-user",
        solution: SOLUTIONS.newUserFeed,
      },
      {
        label: "Was working before, now empty",
        value: "was-working",
        next: "relay-check",
      },
      {
        label: "Only some posts missing",
        value: "partial",
        solution: SOLUTIONS.partialFeed,
      },
    ],
  },
  "relay-check": {
    id: "relay-check",
    text: "Are you connected to any relays?",
    options: [
      { label: "Not sure / Don't know", value: "unknown", next: "checkRelays" },
      {
        label: "Yes, but feed is still empty",
        value: "connected-empty",
        solution: SOLUTIONS.relayIssue,
      },
      {
        label: "Relays show as offline",
        value: "offline",
        solution: SOLUTIONS.offlineRelays,
      },
    ],
  },
  "connection-check": {
    id: "connection-check",
    text: "What type of connection issue?",
    options: [
      {
        label: 'Client says "connecting..."',
        value: "connecting",
        solution: SOLUTIONS.stuckConnecting,
      },
      {
        label: "Posts not publishing",
        value: "not-publishing",
        solution: SOLUTIONS.notPublishing,
      },
      {
        label: "Very slow loading",
        value: "slow",
        solution: SOLUTIONS.slowLoading,
      },
      {
        label: "Disconnects frequently",
        value: "unstable",
        solution: SOLUTIONS.unstableConnection,
      },
    ],
  },
  "zap-check": {
    id: "zap-check",
    text: "What happens when you try to zap?",
    options: [
      {
        label: "Nothing happens",
        value: "nothing",
        solution: SOLUTIONS.zapNothing,
      },
      {
        label: "Error message appears",
        value: "error",
        solution: SOLUTIONS.zapError,
      },
      {
        label: "Zap sent but not received",
        value: "not-received",
        solution: SOLUTIONS.zapNotReceived,
      },
      {
        label: "Don't have a wallet",
        value: "no-wallet",
        solution: SOLUTIONS.noWallet,
      },
    ],
  },
  "client-check": {
    id: "client-check",
    text: "What error are you seeing?",
    options: [
      {
        label: "App crashes on start",
        value: "crash",
        solution: SOLUTIONS.appCrash,
      },
      {
        label: "White/black screen",
        value: "blank",
        solution: SOLUTIONS.blankScreen,
      },
      {
        label: "Key import fails",
        value: "import",
        solution: SOLUTIONS.importFail,
      },
      {
        label: "Other error message",
        value: "other",
        solution: SOLUTIONS.genericError,
      },
    ],
  },
  "profile-check": {
    id: "profile-check",
    text: "What happens when you view the profile?",
    options: [
      {
        label: "Profile not found",
        value: "not-found",
        solution: SOLUTIONS.profileNotFound,
      },
      {
        label: "Profile loads but no posts",
        value: "no-posts",
        solution: SOLUTIONS.profileNoPosts,
      },
      {
        label: "Old data shown",
        value: "old-data",
        solution: SOLUTIONS.oldProfileData,
      },
      {
        label: "Can't follow user",
        value: "cant-follow",
        solution: SOLUTIONS.cantFollow,
      },
    ],
  },
};
