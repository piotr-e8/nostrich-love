import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Server, User, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface PostFlowSimulatorProps {
  className?: string;
}

export function PostFlowSimulator({ className }: PostFlowSimulatorProps) {
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
    { id: "user", label: "You", icon: User, description: "Create a post" },
    {
      id: "relay1",
      label: "Relay 1",
      icon: Server,
      description: "Receives & stores",
    },
    {
      id: "relay2",
      label: "Relay 2",
      icon: Server,
      description: "Receives & stores",
    },
    {
      id: "followers",
      label: "Followers",
      icon: User,
      description: "See your post",
    },
  ];

  return (
    <div
      className={cn(
        "bg-gray-100 dark:bg-white dark:bg-gray-800/30 border border-border-dark rounded-2xl p-6",
        className,
      )}
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold 	ext-gray-900 dark:text-white mb-2">
          How Posts Flow
        </h3>
        <p className="text-sm 	ext-gray-600 dark:text-gray-400">
          See how your posts travel through the Nostr network
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
                      ? "bg-primary-500 	ext-gray-900 dark:text-white"
                      : "bg-gray-200 dark:bg-gray-700 	ext-gray-600 dark:text-gray-400",
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-300">{s.label}</span>
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
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 	ext-gray-900 dark:text-white rounded-lg text-sm font-medium transition-all"
        >
          {isPlaying ? "Pause" : "Play Animation"}
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            setStep(0);
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-600 	ext-gray-900 dark:text-white rounded-lg text-sm font-medium transition-all"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Send className="w-5 h-5 text-primary-500" />
          <span className="text-sm font-medium 	ext-gray-900 dark:text-white">Current Step:</span>
        </div>
        <p className="text-sm 	ext-gray-600 dark:text-gray-400">
          {step === 0 && "You write a post and sign it with your private key."}
          {step === 1 &&
            "Your client sends the post to Relay 1, which verifies the signature and stores it."}
          {step === 2 &&
            "Your client re-broadcasts the post to Relay 2, ensuring wider distribution across the network."}
          {step === 3 &&
            "Your followers connected to these relays receive and see your post in their feed."}
        </p>
      </div>
    </div>
  );
}
