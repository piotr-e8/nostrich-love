import React, { useState, useEffect } from "react";
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
  Sparkles,
} from "lucide-react";
import { cn, saveToLocalStorage, loadFromLocalStorage } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import { getValue } from "../../i18n";

type Device = "ios" | "android" | "desktop" | "web";
type Priority = "easy" | "power" | "privacy" | "web-only";
type Feature = "wallet" | "images" | "longform";

interface QuizAnswer {
  device?: Device;
  priority?: Priority;
  features: Feature[];
}

// Machine-readable only. Every human-readable string (description, pros, cons)
// lives in the translations under clientRecommender.clients.<id>.
interface NostrClient {
  id: string;
  name: string;
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
}

interface ClientRecommenderProps {
  className?: string;
}

// Checked against docs/audit-2026-09/facts.md and re-verified at source on
// 2026-09-02: App Store / Play Store lookups for the store listings, each
// project's own README for platform and feature claims.
//
// "Current" used to sit in this list. Its App Store id 1668517032 returns zero
// results, its repo stopped in December 2023 and relay.current.fyi has no DNS
// record, so it is gone.
//
// None of these six is a native desktop app. The four web clients are listed
// under "desktop" too because that is how a Mac or PC user reaches them: in a
// browser. Coracle in particular is a web client (its README says so), it was
// wrongly filed here as desktop-only.
const CLIENTS: NostrClient[] = [
  {
    id: "damus",
    name: "Damus",
    devices: ["ios"],
    priority: ["easy", "privacy"],
    features: ["wallet", "images"],
    beginnerFriendly: true,
    urls: { ios: "https://apps.apple.com/app/damus/id1628663131" },
  },
  {
    id: "amethyst",
    name: "Amethyst",
    devices: ["android"],
    priority: ["power", "privacy"],
    features: ["wallet", "images", "longform"],
    beginnerFriendly: true,
    urls: {
      android:
        "https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst",
    },
  },
  {
    id: "primal",
    name: "Primal",
    devices: ["web", "desktop", "ios", "android"],
    priority: ["easy", "power"],
    features: ["wallet", "images", "longform"],
    beginnerFriendly: true,
    urls: {
      web: "https://primal.net",
      ios: "https://apps.apple.com/app/primal/id1673134518",
      android:
        "https://play.google.com/store/apps/details?id=net.primal.android",
    },
  },
  {
    id: "iris",
    name: "Iris",
    devices: ["web", "desktop"],
    priority: ["easy", "web-only"],
    features: ["images"],
    beginnerFriendly: true,
    urls: { web: "https://iris.to" },
  },
  {
    id: "snort",
    name: "Snort",
    devices: ["web", "desktop"],
    priority: ["easy", "web-only"],
    features: ["wallet", "images", "longform"],
    beginnerFriendly: true,
    urls: { web: "https://snort.social" },
  },
  {
    id: "coracle",
    name: "Coracle",
    devices: ["web", "desktop"],
    priority: ["power", "privacy", "web-only"],
    features: ["wallet", "images"],
    beginnerFriendly: false,
    urls: { web: "https://coracle.social" },
  },
];

const getDeviceOptions = (t: (key: string) => string) => [
  {
    value: "ios" as Device,
    label: t("clientRecommender.deviceOptions.ios.label"),
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    value: "android" as Device,
    label: t("clientRecommender.deviceOptions.android.label"),
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    value: "desktop" as Device,
    label: t("clientRecommender.deviceOptions.desktop.label"),
    icon: <Monitor className="w-6 h-6" />,
  },
  {
    value: "web" as Device,
    label: t("clientRecommender.deviceOptions.web.label"),
    icon: <Globe className="w-6 h-6" />,
  },
];

const getPriorityOptions = (t: (key: string) => string) => [
  {
    value: "easy" as Priority,
    label: t("clientRecommender.priorityOptions.easy.label"),
    description: t("clientRecommender.priorityOptions.easy.description"),
    icon: <Star className="w-5 h-5" />,
  },
  {
    value: "power" as Priority,
    label: t("clientRecommender.priorityOptions.power.label"),
    description: t("clientRecommender.priorityOptions.power.description"),
    icon: <Zap className="w-5 h-5" />,
  },
  {
    value: "privacy" as Priority,
    label: t("clientRecommender.priorityOptions.privacy.label"),
    description: t("clientRecommender.priorityOptions.privacy.description"),
    icon: <Shield className="w-5 h-5" />,
  },
  {
    value: "web-only" as Priority,
    label: t("clientRecommender.priorityOptions.webOnly.label"),
    description: t("clientRecommender.priorityOptions.webOnly.description"),
    icon: <Globe className="w-5 h-5" />,
  },
];

const getFeatureOptions = (t: (key: string) => string) => [
  {
    value: "wallet" as Feature,
    label: t("clientRecommender.featureOptions.wallet.label"),
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    value: "images" as Feature,
    label: t("clientRecommender.featureOptions.images.label"),
    icon: <ImageIcon className="w-5 h-5" />,
  },
  {
    value: "longform" as Feature,
    label: t("clientRecommender.featureOptions.longform.label"),
    icon: <FileText className="w-5 h-5" />,
  },
];

export function ClientRecommender({ className }: ClientRecommenderProps) {
  const { t, locale } = useTranslation();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswer>({ features: [] });
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<NostrClient[]>([]);

  const clientText = (id: string, field: string): string =>
    t(`clientRecommender.clients.${id}.${field}`);
  const clientList = (id: string, field: string): string[] =>
    (getValue(`clientRecommender.clients.${id}.${field}`, locale) as
      | string[]
      | undefined) || [];

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

      return { client, score };
    });

    // Filter clients that support the selected device
    const filtered = scored.filter(
      ({ client }) =>
        !answers.device || client.devices.includes(answers.device),
    );

    // Sort by score. Array.prototype.sort is stable, so ties keep the order
    // above, which is where the old invented star ratings used to break them.
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
    const top = recommendations[0];

    return (
      <div className={cn("max-w-4xl mx-auto p-6", className)}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-500/20 rounded-2xl mb-4 animate-scale-in motion-reduce:animate-none">
              <Award className="w-8 h-8 text-success-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t('clientRecommender.title')}
            </h2>
            <p className="text-gray-400">
              {t('clientRecommender.description')}
            </p>
          </div>

          {/* Top Recommendation */}
          <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 border-2 border-primary-500 rounded-2xl p-6 mb-6 animate-slide-up motion-reduce:animate-none">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {top.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-white">{top.name}</h3>
                  {top.beginnerFriendly && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-500/20 text-success-500 text-xs rounded-full">
                      <Sparkles className="w-3 h-3" />
                      {t('clientRecommender.results.beginnerFriendly')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              {clientText(top.id, 'description')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-success-500 mb-2">
                  {t('clientRecommender.results.pros')}
                </h4>
                <ul className="space-y-1">
                  {clientList(top.id, 'pros').map((pro, i) => (
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
                  {t('clientRecommender.results.cons')}
                </h4>
                <ul className="space-y-1">
                  {clientList(top.id, 'cons').map((con, i) => (
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
              {answers.device && top.urls[answers.device] && (
                <a
                  href={top.urls[answers.device]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                >
                  {t('clientRecommender.results.getApp').replace('{clientName}', top.name)}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {top.urls.web && (
                <a
                  href={top.urls.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
                >
                  {t('clientRecommender.results.tryWeb')}
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Alternatives */}
          {recommendations.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.slice(1).map((client, index) => (
                <div
                  key={client.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 animate-slide-up motion-reduce:animate-none"
                  style={{ animationDelay: `${index * 100}ms` }}
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
                      {client.beginnerFriendly && (
                        <div className="flex items-center gap-2 text-xs text-success-500">
                          <Sparkles className="w-3 h-3" />
                          {t('clientRecommender.results.beginnerFriendly')}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {clientText(client.id, 'description')}
                  </p>
                  <div className="flex gap-2">
                    {answers.device && client.urls[answers.device] && (
                      <a
                        href={client.urls[answers.device]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center gap-1"
                      >
                        {t('clientRecommender.results.getApp').replace('{clientName}', client.name)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {client.urls.web && (
                      <a
                        href={client.urls.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-white inline-flex items-center gap-1"
                      >
                        {t('clientRecommender.results.tryWeb')}
                        <Globe className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
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
              {t('clientRecommender.retakeQuiz')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8">
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
          <div className="animate-slide-in-right motion-reduce:animate-none">
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('clientRecommender.steps.device.title')}
            </h2>
            <p className="text-gray-400 mb-6">
              {t('clientRecommender.steps.device.description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getDeviceOptions(t).map((option: { value: Device; label: string; icon: React.ReactNode }) => (
                <button
                  key={option.value}
                  onClick={() => handleDeviceSelect(option.value)}
                  className={cn(
                    "flex items-center gap-4 p-4 border rounded-xl transition-all text-start",
                    answers.device === option.value
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50",
                  )}
                >
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                    {option.icon}
                  </div>
                  <span className="font-medium text-white">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Priority */}
        {step === 2 && (
          <div className="animate-slide-in-right motion-reduce:animate-none">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep(1)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400 rtl:rotate-180" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                {t('clientRecommender.steps.priority.title')}
              </h2>
            </div>
            <p className="text-gray-400 mb-6">
              {t('clientRecommender.steps.priority.description')}
            </p>

            <div className="space-y-3">
              {getPriorityOptions(t).map((option: { value: Priority; label: string; description: string; icon: React.ReactNode }) => (
                <button
                  key={option.value}
                  onClick={() => handlePrioritySelect(option.value)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 border rounded-xl transition-all text-start",
                    answers.priority === option.value
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50",
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
          </div>
        )}

        {/* Step 3: Features */}
        {step === 3 && (
          <div className="animate-slide-in-right motion-reduce:animate-none">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep(2)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400 rtl:rotate-180" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                {t('clientRecommender.steps.features.title')}
              </h2>
            </div>
            <p className="text-gray-400 mb-6">
              {t('clientRecommender.steps.features.description')}
            </p>

            <div className="space-y-3 mb-6">
              {getFeatureOptions(t).map((option: { value: Feature; label: string; icon: React.ReactNode }) => (
                <button
                  key={option.value}
                  onClick={() => toggleFeature(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 border rounded-xl transition-all",
                    answers.features.includes(option.value)
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50",
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
              {t('clientRecommender.steps.features.seeRecommendations')}
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
