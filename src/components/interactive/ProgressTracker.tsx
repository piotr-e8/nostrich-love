import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Circle,
  Clock,
  Play,
  RotateCcw,
  Trophy,
  BookOpen,
  Key,
  Zap,
  Radio,
  AtSign,
  Users,
  Shield,
  Sparkles,
  Share2,
  ChevronRight,
  Timer,
  Award,
  Target,
  TrendingUp,
  Calendar,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn, saveToLocalStorage, loadFromLocalStorage } from "../../lib/utils";

interface Section {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  status: "completed" | "in-progress" | "not-started";
  completedAt?: number;
}

interface ProgressData {
  sections: Section[];
  lastVisited: string | null;
  totalTime: number;
  startedAt: number;
  completedAt: number | null;
  streak: number;
}

interface ProgressTrackerProps {
  className?: string;
  onSectionClick?: (sectionId: string) => void;
}

const DEFAULT_SECTIONS: Section[] = [
  {
    id: "what-is-nostr",
    title: "What is Nostr?",
    description: "Understanding the protocol and how it works",
    icon: <BookOpen className="w-5 h-5" />,
    duration: "5 min",
    status: "not-started",
  },
  {
    id: "keys-security",
    title: "Keys & Security",
    description: "Generate keys and learn about security",
    icon: <Key className="w-5 h-5" />,
    duration: "10 min",
    status: "not-started",
  },
  {
    id: "quickstart",
    title: "Quick Start",
    description: "Choose a client and connect",
    icon: <Zap className="w-5 h-5" />,
    duration: "5 min",
    status: "not-started",
  },
  {
    id: "relays",
    title: "Understanding Relays",
    description: "Learn about relay selection and management",
    icon: <Radio className="w-5 h-5" />,
    duration: "8 min",
    status: "not-started",
  },
  {
    id: "nip-05",
    title: "NIP-05 Identifiers",
    description: "Get a human-readable username",
    icon: <AtSign className="w-5 h-5" />,
    duration: "5 min",
    status: "not-started",
  },
  {
    id: "zaps",
    title: "Zaps & Bitcoin",
    description: "Send and receive Bitcoin payments",
    icon: <Zap className="w-5 h-5" />,
    duration: "10 min",
    status: "not-started",
  },
  {
    id: "following",
    title: "Following & Feeds",
    description: "Build your network and customize feeds",
    icon: <Users className="w-5 h-5" />,
    duration: "8 min",
    status: "not-started",
  },
  {
    id: "security-advanced",
    title: "Advanced Security",
    description: "Best practices and advanced techniques",
    icon: <Shield className="w-5 h-5" />,
    duration: "12 min",
    status: "not-started",
  },
];

const ACHIEVEMENTS = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first section",
    icon: "👣",
  },
  {
    id: "halfway",
    title: "Halfway There",
    description: "Complete 50% of the guide",
    icon: "🎯",
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Complete all sections",
    icon: "🏆",
  },
  {
    id: "speed-learner",
    title: "Speed Learner",
    description: "Complete in under 1 hour",
    icon: "⚡",
  },
  {
    id: "security-conscious",
    title: "Security Conscious",
    description: "Complete security sections",
    icon: "🔒",
  },
];

export function ProgressTracker({
  className,
  onSectionClick,
}: ProgressTrackerProps) {
  const [progress, setProgress] = useState<ProgressData>({
    sections: DEFAULT_SECTIONS,
    lastVisited: null,
    totalTime: 0,
    startedAt: Date.now(),
    completedAt: null,
    streak: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    [],
  );

  // Load saved progress
  useEffect(() => {
    const saved = loadFromLocalStorage<ProgressData>("nostr-guide-progress", {
      sections: DEFAULT_SECTIONS,
      lastVisited: null,
      totalTime: 0,
      startedAt: Date.now(),
      completedAt: null,
      streak: 0,
    });

    // Check for daily streak
    const lastVisit = saved.lastVisited ? new Date(saved.lastVisited) : null;
    const today = new Date();
    if (lastVisit) {
      const diffDays = Math.floor(
        (today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === 1) {
        saved.streak = (saved.streak || 0) + 1;
      } else if (diffDays > 1) {
        saved.streak = 0;
      }
    }

    saved.lastVisited = today.toISOString();
    setProgress(saved);

    // Check achievements
    checkAchievements(saved);

    // Track time
    const timeInterval = setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        totalTime: prev.totalTime + 1,
      }));
    }, 60000); // Every minute

    return () => clearInterval(timeInterval);
  }, []);

  // Save progress when it changes
  useEffect(() => {
    saveToLocalStorage("nostr-guide-progress", progress);
  }, [progress]);

  // Check for achievements
  const checkAchievements = (data: ProgressData) => {
    const completed = data.sections.filter(
      (s) => s.status === "completed",
    ).length;
    const unlocked: string[] = [];

    if (completed >= 1) unlocked.push("first-steps");
    if (completed >= data.sections.length / 2) unlocked.push("halfway");
    if (completed === data.sections.length) unlocked.push("completionist");
    if (data.totalTime > 0 && data.totalTime <= 60)
      unlocked.push("speed-learner");
    if (
      data.sections.find(
        (s) => s.id === "keys-security" || s.id === "security-advanced",
      )?.status === "completed"
    ) {
      unlocked.push("security-conscious");
    }

    setUnlockedAchievements(unlocked);
  };

  // Mark section as completed
  const completeSection = (sectionId: string) => {
    setProgress((prev) => {
      const newSections = prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              status: "completed" as const,
              completedAt: Date.now(),
            }
          : section,
      );

      // Check if all completed
      const allCompleted = newSections.every((s) => s.status === "completed");

      if (allCompleted && !prev.completedAt) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      const newProgress = {
        ...prev,
        sections: newSections,
        completedAt: allCompleted ? Date.now() : prev.completedAt,
      };

      checkAchievements(newProgress);
      return newProgress;
    });
  };

  // Mark section as in-progress
  const startSection = (sectionId: string) => {
    setProgress((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId && section.status === "not-started"
          ? { ...section, status: "in-progress" as const }
          : section,
      ),
      lastVisited: sectionId,
    }));
    onSectionClick?.(sectionId);
  };

  // Reset progress
  const resetProgress = () => {
    if (confirm("Are you sure you want to reset your progress?")) {
      setProgress({
        sections: DEFAULT_SECTIONS,
        lastVisited: null,
        totalTime: 0,
        startedAt: Date.now(),
        completedAt: null,
        streak: 0,
      });
      setUnlockedAchievements([]);
    }
  };

  // Calculate stats
  const completedCount = progress.sections.filter(
    (s) => s.status === "completed",
  ).length;
  const inProgressCount = progress.sections.filter(
    (s) => s.status === "in-progress",
  ).length;
  const progressPercentage = Math.round(
    (completedCount / progress.sections.length) * 100,
  );

  // Get continue section
  const continueSection =
    progress.sections.find((s) => s.status === "in-progress") ||
    progress.sections.find((s) => s.status === "not-started");

  // Format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className={cn("max-w-3xl mx-auto p-6", className)}>
      <div className="bg-surface border border-border-dark rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4"
          >
            <TrendingUp className="w-8 h-8 text-primary-500" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Your Learning Journey
          </h2>
          <p className="text-gray-400">
            Track your progress through the Nostr beginner guide
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary-500">
              {progressPercentage}%
            </p>
            <p className="text-sm text-gray-400">Complete</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-success-500">
              {completedCount}
            </p>
            <p className="text-sm text-gray-400">Sections Done</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-warning-500">
              {formatTime(progress.totalTime)}
            </p>
            <p className="text-sm text-gray-400">Time Spent</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-pink-500">
              {progress.streak}
            </p>
            <p className="text-sm text-gray-400">Day Streak</p>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Overall Progress</span>
            <span className="text-primary-500 font-medium">
              {completedCount}/{progress.sections.length} sections
            </span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-success-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Continue Button */}
        {continueSection && progressPercentage < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => startSection(continueSection.id)}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5" />
              {continueSection.status === "in-progress"
                ? `Continue: ${continueSection.title}`
                : `Start: ${continueSection.title}`}
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Completion Celebration */}
        {progressPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-success-500/20 to-primary-500/20 border border-success-500/30 rounded-xl p-6 mb-8 text-center"
          >
            <Trophy className="w-12 h-12 text-success-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">
              Congratulations!
            </h3>
            <p className="text-gray-400 mb-4">
              You've completed the entire Nostr beginner guide. You're ready to
              explore the protocol!
            </p>
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-success-600 hover:bg-success-700 text-white rounded-xl font-medium transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share Achievement
            </button>
          </motion.div>
        )}

        {/* Section Checklist */}
        <div className="space-y-3 mb-8">
          <h3 className="font-semibold text-white mb-4">Guide Sections</h3>
          {progress.sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                section.status === "completed"
                  ? "border-success-500/30 bg-success-500/5"
                  : section.status === "in-progress"
                    ? "border-primary-500/30 bg-primary-500/5"
                    : "border-border-dark hover:border-gray-600 hover:bg-gray-800/30",
              )}
              onClick={() => startSection(section.id)}
            >
              {/* Status Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  section.status === "completed"
                    ? "bg-success-500"
                    : section.status === "in-progress"
                      ? "bg-primary-500"
                      : "bg-gray-700",
                )}
              >
                {section.status === "completed" ? (
                  <Check className="w-5 h-5 text-white" />
                ) : section.status === "in-progress" ? (
                  <Clock className="w-5 h-5 text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "transition-colors",
                      section.status === "completed"
                        ? "text-success-500"
                        : section.status === "in-progress"
                          ? "text-primary-500"
                          : "text-gray-400",
                    )}
                  >
                    {section.icon}
                  </span>
                  <h4
                    className={cn(
                      "font-medium truncate",
                      section.status === "completed"
                        ? "text-success-500 line-through"
                        : section.status === "in-progress"
                          ? "text-white"
                          : "text-gray-300",
                    )}
                  >
                    {section.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {section.description}
                </p>
              </div>

              {/* Duration */}
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {section.duration}
              </div>

              {/* Actions */}
              {section.status !== "completed" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    completeSection(section.id);
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Mark as complete"
                >
                  <Check className="w-4 h-4 text-gray-400 hover:text-success-500" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h3 className="font-semibold text-white mb-4">Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = unlockedAchievements.includes(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  whileHover={unlocked ? { scale: 1.02 } : undefined}
                  className={cn(
                    "p-3 rounded-xl border transition-all",
                    unlocked
                      ? "border-success-500/30 bg-success-500/5"
                      : "border-gray-700 bg-gray-800/30 opacity-50",
                  )}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p
                    className={cn(
                      "font-medium text-sm",
                      unlocked ? "text-white" : "text-gray-500",
                    )}
                  >
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {achievement.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={resetProgress}
            className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </button>
          {progressPercentage > 0 && (
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 text-primary-500 hover:text-primary-400 text-sm transition-colors inline-flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Progress
            </button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-border-dark rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Share Your Progress
              </h3>
              <p className="text-gray-400 mb-4">
                I've completed {progressPercentage}% of Nostrich.love!
              </p>
              <div className="bg-gray-900 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">Your progress:</p>
                <p className="font-mono text-sm text-white">
                  {completedCount}/{progress.sections.length} sections •{" "}
                  {formatTime(progress.totalTime)} • {progress.streak} day
                  streak
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    const text = `I'm learning Nostr! 🚀\n\nProgress: ${progressPercentage}% complete\n${completedCount}/${progress.sections.length} sections\n${formatTime(progress.totalTime)} spent learning\n\nStart your journey: https://nostr.how`;
                    await navigator.clipboard.writeText(text);
                    setShowShareModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <div className="text-6xl animate-bounce">🎉</div>
            <div className="absolute top-1/4 left-1/4 text-4xl animate-pulse">
              ✨
            </div>
            <div
              className="absolute top-1/3 right-1/4 text-4xl animate-pulse"
              style={{ animationDelay: "0.2s" }}
            >
              ⭐
            </div>
            <div
              className="absolute bottom-1/3 left-1/3 text-4xl animate-pulse"
              style={{ animationDelay: "0.4s" }}
            >
              🌟
            </div>
            <div
              className="absolute bottom-1/4 right-1/3 text-4xl animate-pulse"
              style={{ animationDelay: "0.6s" }}
            >
              🎊
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
