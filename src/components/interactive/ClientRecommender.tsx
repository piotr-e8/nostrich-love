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
    icon: <Smartphone className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: "android" as Device,
    label: t("clientRecommender.deviceOptions.android.label"),
    icon: <Smartphone className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: "desktop" as Device,
    label: t("clientRecommender.deviceOptions.desktop.label"),
    icon: <Monitor className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: "web" as Device,
    label: t("clientRecommender.deviceOptions.web.label"),
    icon: <Globe className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />,
  },
];

const getPriorityOptions = (t: (key: string) => string) => [
  {
    value: "easy" as Priority,
    label: t("clientRecommender.priorityOptions.easy.label"),
    description: t("clientRecommender.priorityOptions.easy.description"),
    icon: <Star className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: "power" as Priority,
    label: t("clientRecommender.priorityOptions.power.label"),
    description: t("clientRecommender.priorityOptions.power.description"),
    icon: <Zap className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: "privacy" as Priority,
    label: t("clientRecommender.priorityOptions.privacy.label"),
    description: t("clientRecommender.priorityOptions.privacy.description"),
    icon: <Shield className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: "web-only" as Priority,
    label: t("clientRecommender.priorityOptions.webOnly.label"),
    description: t("clientRecommender.priorityOptions.webOnly.description"),
    icon: <Globe className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
  },
];

const getFeatureOptions = (t: (key: string) => string) => [
  {
    value: "wallet" as Feature,
    label: t("clientRecommender.featureOptions.wallet.label"),
    icon: <Wallet className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: "images" as Feature,
    label: t("clientRecommender.featureOptions.images.label"),
    icon: <ImageIcon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
  },
  {
    value: "longform" as Feature,
    label: t("clientRecommender.featureOptions.longform.label"),
    icon: <FileText className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
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
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Award
              className="mx-auto mb-3 h-6 w-6 text-success-700 dark:text-success-400"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h2 className="text-h2 font-display text-gray-900 dark:text-white mb-2">
              {t('clientRecommender.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('clientRecommender.description')}
            </p>
          </div>

          {/* Top Recommendation */}
          <div className="bg-white dark:bg-gray-900 border border-primary-600 dark:border-primary-500 rounded-lg p-6 mb-6 animate-slide-up motion-reduce:animate-none">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-h3 font-display text-white">
                  {top.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-h3 font-display text-gray-900 dark:text-white">{top.name}</h3>
                  {top.beginnerFriendly && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 border border-success-300 dark:border-success-800 text-success-700 dark:text-success-400 text-caption rounded-full">
                      <Sparkles className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                      {t('clientRecommender.results.beginnerFriendly')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {clientText(top.id, 'description')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-h4 font-display text-success-700 dark:text-success-400 mb-2">
                  {t('clientRecommender.results.pros')}
                </h4>
                <ul className="space-y-1">
                  {clientList(top.id, 'pros').map((pro, i) => (
                    <li
                      key={i}
                      className="text-body-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                    >
                      <Check className="h-4 w-4 shrink-0 text-success-700 dark:text-success-400" strokeWidth={1.5} aria-hidden="true" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-h4 font-display text-error-700 dark:text-error-400 mb-2">
                  {t('clientRecommender.results.cons')}
                </h4>
                <ul className="space-y-1">
                  {clientList(top.id, 'cons').map((con, i) => (
                    <li
                      key={i}
                      className="text-body-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                    >
                      <span className="w-4 h-4 flex items-center justify-center text-error-700 dark:text-error-400 flex-shrink-0">
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors"
                >
                  {t('clientRecommender.results.getApp').replace('{clientName}', top.name)}
                  <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                </a>
              )}
              {top.urls.web && (
                <a
                  href={top.urls.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-gray-200 bg-white text-gray-700 font-medium transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                >
                  {t('clientRecommender.results.tryWeb')}
                  <Globe className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
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
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 animate-slide-up motion-reduce:animate-none"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {client.name}
                      </h4>
                      {client.beginnerFriendly && (
                        <div className="flex items-center gap-2 text-caption text-success-700 dark:text-success-400">
                          <Sparkles className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                          {t('clientRecommender.results.beginnerFriendly')}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-3">
                    {clientText(client.id, 'description')}
                  </p>
                  <div className="flex gap-2">
                    {answers.device && client.urls[answers.device] && (
                      <a
                        href={client.urls[answers.device]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-sm text-primary-text dark:text-primary-400 underline underline-offset-2 font-medium inline-flex items-center gap-1"
                      >
                        {t('clientRecommender.results.getApp').replace('{clientName}', client.name)}
                        <ExternalLink className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    )}
                    {client.urls.web && (
                      <a
                        href={client.urls.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1"
                      >
                        {t('clientRecommender.results.tryWeb')}
                        <Globe className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
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
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {t('clientRecommender.retakeQuiz')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                s <= step ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-800",
              )}
            />
          ))}
        </div>

        {/* Step 1: Device */}
        {step === 1 && (
          <div className="animate-slide-in-right motion-reduce:animate-none">
            <h2 className="text-h2 font-display text-gray-900 dark:text-white mb-2">
              {t('clientRecommender.steps.device.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('clientRecommender.steps.device.description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getDeviceOptions(t).map((option: { value: Device; label: string; icon: React.ReactNode }) => (
                <button
                  key={option.value}
                  onClick={() => handleDeviceSelect(option.value)}
                  className={cn(
                    "flex items-center gap-4 p-4 border rounded-md transition-colors text-start",
                    answers.device === option.value
                      ? "border-primary-600 bg-primary-50 dark:border-primary-500 dark:bg-gray-800"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800",
                  )}
                >
                  <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {option.icon}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
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
                className="p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-5 w-5 text-gray-400 dark:text-gray-500 rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <h2 className="text-h2 font-display text-gray-900 dark:text-white">
                {t('clientRecommender.steps.priority.title')}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('clientRecommender.steps.priority.description')}
            </p>

            <div className="space-y-3">
              {getPriorityOptions(t).map((option: { value: Priority; label: string; description: string; icon: React.ReactNode }) => (
                <button
                  key={option.value}
                  onClick={() => handlePrioritySelect(option.value)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 border rounded-md transition-colors text-start",
                    answers.priority === option.value
                      ? "border-primary-600 bg-primary-50 dark:border-primary-500 dark:bg-gray-800"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800",
                  )}
                >
                  <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {option.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">
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
                className="p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-5 w-5 text-gray-400 dark:text-gray-500 rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <h2 className="text-h2 font-display text-gray-900 dark:text-white">
                {t('clientRecommender.steps.features.title')}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('clientRecommender.steps.features.description')}
            </p>

            <div className="space-y-3 mb-6">
              {getFeatureOptions(t).map((option: { value: Feature; label: string; icon: React.ReactNode }) => (
                <button
                  key={option.value}
                  onClick={() => toggleFeature(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 border rounded-md transition-colors",
                    answers.features.includes(option.value)
                      ? "border-primary-600 bg-primary-50 dark:border-primary-500 dark:bg-gray-800"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {option.icon}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                      answers.features.includes(option.value)
                        ? "bg-primary-600 border-primary-600"
                        : "border-gray-300 dark:border-gray-600",
                    )}
                  >
                    {answers.features.includes(option.value) && (
                      <Check className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              {t('clientRecommender.steps.features.seeRecommendations')}
              <ChevronRight className="h-5 w-5 shrink-0 rtl:rotate-180" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
