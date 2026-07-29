import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Server, User, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

interface PostFlowSimulatorProps {
  className?: string;
}

export function PostFlowSimulator({ className }: PostFlowSimulatorProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const steps = [
    { id: "user", label: t("postFlowSimulator.labels.yourDevice"), icon: User, description: t("postFlowSimulator.stages.create") },
    {
      id: "relay1",
      label: `${t("postFlowSimulator.labels.relay")} 1`,
      icon: Server,
      description: t("postFlowSimulator.stages.send"),
    },
    {
      id: "relay2",
      label: `${t("postFlowSimulator.labels.relay")} 2`,
      icon: Server,
      description: t("postFlowSimulator.stages.send"),
    },
    {
      id: "followers",
      label: t("postFlowSimulator.labels.followers"),
      icon: User,
      description: t("postFlowSimulator.stages.receive"),
    },
  ];

  return (
    <div
      className={cn(
        "bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6",
        className,
      )}
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t("postFlowSimulator.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("postFlowSimulator.description")}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = step >= index;
          const isCurrent = step === index;

          return (
            <React.Fragment key={s.id}>
              <motion.div
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  opacity: isActive ? 1 : 0.5,
                }}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl transition-all",
                  isActive ? "bg-primary-500/20" : "bg-white dark:bg-gray-800",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isActive
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-900 dark:text-white">{s.label}</span>
                {isCurrent && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-primary-400"
                  >
                    {s.description}
                  </motion.span>
                )}
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div
                  animate={{ opacity: isActive && step > index ? 1 : 0.3 }}
                >
                  <ArrowRight className="w-5 h-5 text-gray-500" />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all"
        >
          {isPlaying ? t("postFlowSimulator.buttons.pause") : t("postFlowSimulator.buttons.play")}
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            setStep(0);
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all"
        >
          {t("postFlowSimulator.buttons.reset")}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Send className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{t("postFlowSimulator.currentStepLabel")}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {step === 0 && t("postFlowSimulator.stepDescriptions.0")}
          {step === 1 && t("postFlowSimulator.stepDescriptions.1")}
          {step === 2 && t("postFlowSimulator.stepDescriptions.2")}
          {step === 3 && t("postFlowSimulator.stepDescriptions.3")}
        </p>
      </div>
    </div>
  );
}
