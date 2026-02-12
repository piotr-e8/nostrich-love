import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shield, HelpCircle, Server, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

interface FAQAccordionProps {
  question: string;
  category?:
    | "security"
    | "basics"
    | "technical"
    | "advanced"
    | "troubleshooting"
    | "getting-started";
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  security: <Shield className="w-4 h-4" />,
  basics: <HelpCircle className="w-4 h-4" />,
  technical: <Server className="w-4 h-4" />,
  advanced: <Zap className="w-4 h-4" />,
  troubleshooting: <HelpCircle className="w-4 h-4" />,
  "getting-started": <HelpCircle className="w-4 h-4" />,
};

const categoryStyles: Record<string, string> = {
  security: "bg-red-500/10 text-red-500 border-red-500/30",
  basics: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  technical: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  advanced: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  troubleshooting: "bg-green-500/10 text-green-500 border-green-500/30",
  "getting-started": "bg-primary-500/10 text-primary-500 border-primary-500/30",
};

const categoryLabels: Record<string, string> = {
  security: "Security",
  basics: "Basics",
  technical: "Technical",
  advanced: "Advanced",
  troubleshooting: "Troubleshooting",
  "getting-started": "Getting Started",
};

export function FAQAccordion({
  question,
  category = "basics",
  children,
  className,
  defaultOpen = false,
}: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "border border-border-dark rounded-xl overflow-hidden bg-gray-800/30 mb-6",
        className,
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-800/50 transition-all"
        aria-expanded={isOpen}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {category && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                  categoryStyles[category] || categoryStyles.basics,
                )}
              >
                {categoryIcons[category]}
                {categoryLabels[category]}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white">{question}</h3>
        </div>
        <div
          className={cn(
            "w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 transition-all",
            isOpen && "bg-primary-500 rotate-180",
          )}
        >
          <ChevronDown
            className={cn(
              "w-5 h-5 text-gray-400 transition-colors",
              isOpen && "text-white",
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 pt-0 border-t border-border-dark">
              <div className="pt-4 prose prose-invert prose-sm max-w-none">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
