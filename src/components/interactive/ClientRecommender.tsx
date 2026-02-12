import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Monitor,
  Globe,
  Star,
  Shield,
  Zap,
  Image as ImageIcon,
  FileText,
  Wallet,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Award,
  Users,
  Sparkles,
} from "lucide-react";
import { cn, saveToLocalStorage, loadFromLocalStorage } from "../../lib/utils";

type Device = "ios" | "android" | "desktop" | "web";
type Priority = "easy" | "power" | "privacy" | "web-only";
type Feature = "wallet" | "images" | "longform";

interface QuizAnswer {
  device?: Device;
  priority?: Priority;
  features: Feature[];
}

interface NostrClient {
  name: string;
  description: string;
  devices: Device[];
  priority: Priority[];
  features: Feature[];
  beginnerFriendly: boolean;
  urls: {
    web?: string;
    ios?: string;
    android?: string;
    desktop?: string;
  };
  pros: string[];
  cons: string[];
  screenshot?: string;
  rating: number;
  userCount?: string;
}

interface ClientRecommenderProps {
  className?: string;
}

const CLIENTS: NostrClient[] = [
  {
    name: "Damus",
    description:
      "The most popular iOS client for Nostr, known for its polished UI and smooth experience.",
    devices: ["ios"],
    priority: ["easy", "privacy"],
    features: ["wallet", "images"],
    beginnerFriendly: true,
    urls: { ios: "https://apps.apple.com/app/damus/id1628663131" },
    pros: [
      "Beautiful UI",
      "Easy to use",
      "Active development",
      "Great onboarding",
    ],
    cons: ["iOS only", "Limited desktop support"],
    rating: 4.8,
    userCount: "100K+",
  },
  {
    name: "Amethyst",
    description:
      "A feature-rich Android client with excellent support for all Nostr features.",
    devices: ["android"],
    priority: ["power", "privacy"],
    features: ["wallet", "images", "longform"],
    beginnerFriendly: true,
    urls: {
      android:
        "https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst",
    },
    pros: [
      "Full-featured",
      "Zaps support",
      "Active community",
      "Regular updates",
    ],
    cons: ["Can be overwhelming", "Android only"],
    rating: 4.7,
    userCount: "50K+",
  },
  {
    name: "Primal",
    description:
      "A fast, modern client available on all platforms with excellent performance.",
    devices: ["web", "ios", "android"],
    priority: ["easy", "power"],
    features: ["wallet", "images", "longform"],
    beginnerFriendly: true,
    urls: {
      web: "https://primal.net",
      ios: "https://apps.apple.com/app/primal/id1673134518",
      android:
        "https://play.google.com/store/apps/details?id=net.primal.android",
    },
    pros: ["Fast loading", "All platforms", "Great search", "Beautiful design"],
    cons: ["Newer app", "Some features still in development"],
    rating: 4.6,
    userCount: "30K+",
  },
  {
    name: "Iris",
    description:
      "A simple, no-signup web client perfect for getting started quickly.",
    devices: ["web"],
    priority: ["easy", "web-only"],
    features: ["images"],
    beginnerFriendly: true,
    urls: { web: "https://iris.to" },
    pros: [
      "No download needed",
      "Works instantly",
      "Clean interface",
      "Open source",
    ],
    cons: ["Web only", "Limited advanced features"],
    rating: 4.4,
    userCount: "20K+",
  },
  {
    name: "Snort",
    description: "A web client focused on simplicity and performance.",
    devices: ["web"],
    priority: ["easy", "web-only"],
    features: ["images", "longform"],
    beginnerFriendly: true,
    urls: { web: "https://snort.social" },
    pros: ["Lightning fast", "Minimal UI", "No bloat", "Great for reading"],
    cons: ["Web only", "Fewer social features"],
    rating: 4.3,
    userCount: "15K+",
  },
  {
    name: "Coracle",
    description: "A desktop client for power users with advanced features.",
    devices: ["desktop"],
    priority: ["power", "privacy"],
    features: ["wallet", "images", "longform"],
    beginnerFriendly: false,
    urls: { desktop: "https://coracle.social" },
    pros: [
      "Powerful features",
      "Desktop optimized",
      "Great for creators",
      "Advanced filtering",
    ],
    cons: ["Desktop only", "Steeper learning curve"],
    rating: 4.5,
    userCount: "10K+",
  },
  {
    name: "Current",
    description: "iOS client with excellent Nostr Wallet Connect integration.",
    devices: ["ios"],
    priority: ["power", "privacy"],
    features: ["wallet", "images", "longform"],
    beginnerFriendly: false,
    urls: {
      ios: "https://apps.apple.com/app/current-nostr-client/id1668517032",
    },
    pros: ["Best wallet support", "Power user features", "NWC integration"],
    cons: ["More complex", "iOS only"],
    rating: 4.4,
    userCount: "8K+",
  },
];

const DEVICE_OPTIONS: {
  value: Device;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "ios",
    label: "iPhone / iPad",
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    value: "android",
    label: "Android",
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    value: "desktop",
    label: "Desktop (Mac/PC)",
    icon: <Monitor className="w-6 h-6" />,
  },
  { value: "web", label: "Web Browser", icon: <Globe className="w-6 h-6" /> },
];

const PRIORITY_OPTIONS: {
  value: Priority;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "easy",
    label: "Easy to Use",
    description: "Simple interface, minimal setup",
    icon: <Star className="w-5 h-5" />,
  },
  {
    value: "power",
    label: "Power User",
    description: "Advanced features and customization",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    value: "privacy",
    label: "Privacy First",
    description: "Maximum privacy and security",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    value: "web-only",
    label: "Web Only",
    description: "No app download needed",
    icon: <Globe className="w-5 h-5" />,
  },
];

const FEATURE_OPTIONS: {
  value: Feature;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "wallet",
    label: "Built-in Wallet",
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    value: "images",
    label: "Image Sharing",
    icon: <ImageIcon className="w-5 h-5" />,
  },
  {
    value: "longform",
    label: "Long-form Posts",
    icon: <FileText className="w-5 h-5" />,
  },
];

export function ClientRecommender({ className }: ClientRecommenderProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswer>({ features: [] });
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<NostrClient[]>([]);

  useEffect(() => {
    const saved = loadFromLocalStorage<{ answers: QuizAnswer; step: number }>(
      "nostr-client-quiz",
      {
        answers: { features: [] },
        step: 1,
      },
    );
    setAnswers(saved.answers);
    setStep(saved.step);
  }, []);

  useEffect(() => {
    saveToLocalStorage("nostr-client-quiz", { answers, step });
  }, [answers, step]);

  const calculateRecommendations = () => {
    const scored = CLIENTS.map((client) => {
      let score = 0;

      // Device match (highest priority)
      if (answers.device && client.devices.includes(answers.device)) {
        score += 50;
      }

      // Priority match
      if (answers.priority && client.priority.includes(answers.priority)) {
        score += 20;
      }

      // Feature matches
      answers.features.forEach((feature) => {
        if (client.features.includes(feature)) {
          score += 10;
        }
      });

      // Beginner bonus for easy priority
      if (answers.priority === "easy" && client.beginnerFriendly) {
        score += 15;
      }

      // Rating bonus
      score += client.rating * 2;

      return { client, score };
    });

    // Filter clients that support the selected device
    const filtered = scored.filter(
      ({ client }) =>
        !answers.device || client.devices.includes(answers.device),
    );

    // Sort by score
    const sorted = filtered.sort((a, b) => b.score - a.score);

    setRecommendations(sorted.slice(0, 3).map((s) => s.client));
    setShowResults(true);
  };

  const handleDeviceSelect = (device: Device) => {
    setAnswers((prev) => ({ ...prev, device }));
    setStep(2);
  };

  const handlePrioritySelect = (priority: Priority) => {
    setAnswers((prev) => ({ ...prev, priority }));
    setStep(3);
  };

  const toggleFeature = (feature: Feature) => {
    setAnswers((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleFinish = () => {
    calculateRecommendations();
  };

  const reset = () => {
    setStep(1);
    setAnswers({ features: [] });
    setShowResults(false);
    setRecommendations([]);
  };

  if (showResults && recommendations.length > 0) {
    return (
      <div className={cn("max-w-4xl mx-auto p-6", className)}>
        <div className="bg-surface border border-border-dark rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-success-500/20 rounded-2xl mb-4"
            >
              <Award className="w-8 h-8 text-success-500" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Your Perfect Client
            </h2>
            <p className="text-gray-400">
              Based on your preferences, here are our top recommendations
            </p>
          </div>

          {/* Top Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 border-2 border-primary-500 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {recommendations[0].name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-white">
                    {recommendations[0].name}
                  </h3>
                  {recommendations[0].beginnerFriendly && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-500/20 text-success-500 text-xs rounded-full">
                      <Sparkles className="w-3 h-3" />
                      Beginner Friendly
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {recommendations[0].rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {recommendations[0].userCount}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              {recommendations[0].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-success-500 mb-2">
                  Pros
                </h4>
                <ul className="space-y-1">
                  {recommendations[0].pros.map((pro, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-400 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-success-500 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-error-500 mb-2">
                  Cons
                </h4>
                <ul className="space-y-1">
                  {recommendations[0].cons.map((con, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-400 flex items-center gap-2"
                    >
                      <span className="w-4 h-4 flex items-center justify-center text-error-500 flex-shrink-0">
                        −
                      </span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {answers.device && recommendations[0].urls[answers.device] && (
                <a
                  href={recommendations[0].urls[answers.device]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                >
                  Get {recommendations[0].name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {recommendations[0].urls.web && (
                <a
                  href={recommendations[0].urls.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
                >
                  Try Web Version
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Alternatives */}
          {recommendations.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.slice(1).map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 border border-border-dark rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                      <span className="font-bold text-white">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {client.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {client.rating}
                        {client.beginnerFriendly && (
                          <span className="text-success-500">
                            • Beginner Friendly
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {client.description}
                  </p>
                  <div className="flex gap-2">
                    {answers.device && client.urls[answers.device] && (
                      <a
                        href={client.urls[answers.device]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-500 hover:text-primary-400 font-medium inline-flex items-center gap-1"
                      >
                        Get App <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {client.urls.web && (
                      <a
                        href={client.urls.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-white inline-flex items-center gap-1"
                      >
                        Web <Globe className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Reset Button */}
          <div className="text-center mt-8">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="bg-surface border border-border-dark rounded-2xl p-6 md:p-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-2 rounded-full transition-all",
                s <= step ? "bg-primary-500" : "bg-gray-700",
              )}
            />
          ))}
        </div>

        {/* Step 1: Device */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              What device do you use?
            </h2>
            <p className="text-gray-400 mb-6">
              Select the device you'll primarily use Nostr on
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEVICE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDeviceSelect(option.value)}
                  className={cn(
                    "flex items-center gap-4 p-4 border rounded-xl transition-all text-left",
                    answers.device === option.value
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-border-dark hover:border-gray-600 hover:bg-gray-800/50",
                  )}
                >
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                    {option.icon}
                  </div>
                  <span className="font-medium text-white">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Priority */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep(1)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                What's your priority?
              </h2>
            </div>
            <p className="text-gray-400 mb-6">
              Choose what matters most to you
            </p>

            <div className="space-y-3">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePrioritySelect(option.value)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 border rounded-xl transition-all text-left",
                    answers.priority === option.value
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-border-dark hover:border-gray-600 hover:bg-gray-800/50",
                  )}
                >
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                    {option.icon}
                  </div>
                  <div>
                    <p className="font-medium text-white">{option.label}</p>
                    <p className="text-sm text-gray-400">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Features */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep(2)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                Nice-to-have features?
              </h2>
            </div>
            <p className="text-gray-400 mb-6">
              Select any features you'd like (optional)
            </p>

            <div className="space-y-3 mb-6">
              {FEATURE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleFeature(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 border rounded-xl transition-all",
                    answers.features.includes(option.value)
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-border-dark hover:border-gray-600 hover:bg-gray-800/50",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                      {option.icon}
                    </div>
                    <span className="font-medium text-white">
                      {option.label}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                      answers.features.includes(option.value)
                        ? "bg-primary-500 border-primary-500"
                        : "border-gray-500",
                    )}
                  >
                    {answers.features.includes(option.value) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              See Recommendations
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
