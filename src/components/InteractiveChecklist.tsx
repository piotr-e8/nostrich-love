import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

export interface InteractiveChecklistItem {
  id: string;
  number: number;
  title: string;
  time?: string;
  status?: "required" | "optional";
  href?: string;
  description?: React.ReactNode;
}

export interface InteractiveChecklistProps {
  guideId: string;
  items: InteractiveChecklistItem[];
  className?: string;
  onProgressChange?: (completed: number, total: number) => void;
}

export function InteractiveChecklist({
  guideId,
  items,
  className,
  onProgressChange,
}: InteractiveChecklistProps) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const storageKey = `nostrich-checklist-${guideId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedItems(new Set(parsed));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [guideId]);

  // Save to localStorage when changed
  useEffect(() => {
    if (!mounted) return;
    const storageKey = `nostrich-checklist-${guideId}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify(Array.from(completedItems)),
    );

    if (onProgressChange) {
      onProgressChange(completedItems.size, items.length);
    }
  }, [completedItems, guideId, items.length, mounted, onProgressChange]);

  const toggleItem = (id: string, event: React.MouseEvent) => {
    // Don't toggle if clicking on a link
    if ((event.target as HTMLElement).closest("a")) {
      return;
    }

    const newCompleted = new Set(completedItems);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedItems(newCompleted);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => {
        const isCompleted = completedItems.has(item.id);

        return (
          <motion.div
            key={item.id}
            layout
            onClick={(e) => toggleItem(item.id, e)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border-2 p-6 transition-all cursor-pointer",
              isCompleted
                ? "border-success-500/50 bg-success-500/5 dark:border-success-500/30 dark:bg-success-500/10"
                : "border-gray-200 bg-white hover:border-primary-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700",
            )}
          >
            {/* Completion indicator */}
            <div className="absolute top-4 right-4">
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isCompleted
                    ? "bg-success-500 border-success-500"
                    : "border-gray-300 dark:border-gray-600 group-hover:border-primary-500",
                )}
              >
                <AnimatePresence>
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-start gap-4 pr-8">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold transition-colors",
                  isCompleted
                    ? "bg-success-500/20 text-success-600 dark:text-success-400"
                    : "bg-primary/10 text-primary",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  item.number
                )}
              </div>

              <div className="flex-1">
                <h3
                  className={cn(
                    "text-lg font-semibold transition-colors",
                    isCompleted
                      ? "text-gray-700 dark:text-gray-300 line-through opacity-70"
                      : "text-gray-900 dark:text-white",
                  )}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.title}
                      {item.href.startsWith("http") && (
                        <ArrowUpRight className="inline h-4 w-4 ml-1 text-gray-400" />
                      )}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>

                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  {item.time && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {item.time}
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium uppercase tracking-wide",
                      item.status === "required" &&
                        "text-primary-600 dark:text-primary-400",
                      item.status === "optional" &&
                        "text-gray-500 dark:text-gray-400",
                      isCompleted && "text-success-600 dark:text-success-400",
                    )}
                  >
                    {isCompleted
                      ? "Completed"
                      : item.status === "required"
                        ? "Required"
                        : "Optional"}
                  </span>
                </div>

                {item.description && (
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function ChecklistProgress({
  guideId,
  total,
  label = "Your Progress",
  enabled = false,
}: {
  guideId: string;
  total: number;
  label?: string;
  enabled?: boolean;
}) {
  if (!enabled) {
    return null;
  }
  const [completed, setCompleted] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storageKey = `nostrich-checklist-${guideId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompleted(parsed.length);
      } catch {
        // Invalid JSON, ignore
      }
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const updated = localStorage.getItem(storageKey);
      if (updated) {
        try {
          const parsed = JSON.parse(updated);
          setCompleted(parsed.length);
        } catch {
          // Invalid JSON, ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [guideId]);

  if (!mounted) {
    return (
      <div className="w-full space-y-2 animate-pulse">
        <div className="flex items-center justify-between text-sm">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <span className="text-gray-400">Loading...</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <span className="font-semibold text-primary">
          {percentage}%
          <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
            ({completed}/{total})
          </span>
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
