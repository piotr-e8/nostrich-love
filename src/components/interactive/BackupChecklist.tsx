import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  AlertTriangle,
  Shield,
  Lock,
  FileText,
  Key,
  Save,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import {
  cn,
  saveToLocalStorage,
  loadFromLocalStorage,
  copyToClipboard,
} from "../../lib/utils";

interface BackupChecklistProps {
  className?: string;
  onComplete?: () => void;
  requiredKeys?: {
    npub?: string;
    nsec?: string;
  };
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  warning?: string;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: "copy-npub",
    label: "Copied npub (public key)",
    description: "Your public identifier that you can share with others",
    icon: <Key className="w-5 h-5" />,
    checked: false,
  },
  {
    id: "copy-nsec",
    label: "Copied nsec (private key)",
    description: "Your secret password - never share this with anyone",
    icon: <Lock className="w-5 h-5" />,
    checked: false,
    warning:
      "Critical: This is your only password. If lost, your account cannot be recovered.",
  },
  {
    id: "password-manager",
    label: "Saved to password manager",
    description: "1Password, Bitwarden, KeePass, or similar secure storage",
    icon: <Shield className="w-5 h-5" />,
    checked: false,
  },
  {
    id: "paper-backup",
    label: "Written on paper (offline backup)",
    description: "Physical copy stored in a safe, secure location",
    icon: <FileText className="w-5 h-5" />,
    checked: false,
    warning: "Store this in a safe place away from your computer and phone.",
  },
  {
    id: "encrypted-file",
    label: "Saved to encrypted file",
    description: "USB drive, encrypted cloud storage, or hardware wallet",
    icon: <Save className="w-5 h-5" />,
    checked: false,
  },
];

export function BackupChecklist({
  className,
  onComplete,
  requiredKeys,
}: BackupChecklistProps) {
  const [checklist, setChecklist] =
    useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const saved = loadFromLocalStorage<{
      checklist: ChecklistItem[];
      isComplete: boolean;
    }>("nostr-backup-checklist", {
      checklist: DEFAULT_CHECKLIST,
      isComplete: false,
    });
    setChecklist(saved.checklist);
    setIsComplete(saved.isComplete);
  }, []);

  useEffect(() => {
    saveToLocalStorage("nostr-backup-checklist", { checklist, isComplete });
  }, [checklist, isComplete]);

  const checkedCount = checklist.filter((item) => item.checked).length;
  const progress = (checkedCount / checklist.length) * 100;
  const allChecked = checkedCount === checklist.length;

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const showToastMessage = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyKey = async (type: "npub" | "nsec") => {
    const key = type === "npub" ? requiredKeys?.npub : requiredKeys?.nsec;
    if (!key) {
      showToastMessage(`No ${type} provided. Generate keys first.`, "error");
      return;
    }

    const success = await copyToClipboard(key);
    if (success) {
      showToastMessage(`${type.toUpperCase()} copied to clipboard!`, "success");
      // Auto-check the corresponding item
      const checkId = type === "npub" ? "copy-npub" : "copy-nsec";
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === checkId ? { ...item, checked: true } : item,
        ),
      );
    } else {
      showToastMessage("Failed to copy to clipboard", "error");
    }
  };

  const handleComplete = () => {
    if (!allChecked) {
      setShowSkipWarning(true);
      return;
    }
    setShowConfirmation(true);
  };

  const confirmComplete = () => {
    setIsComplete(true);
    setShowConfirmation(false);
    onComplete?.();
  };

  const reset = () => {
    setChecklist(DEFAULT_CHECKLIST);
    setIsComplete(false);
    setShowConfirmation(false);
    setShowSkipWarning(false);
  };

  if (isComplete) {
    return (
      <div className={cn("max-w-2xl mx-auto p-6", className)}>
        <div className="bg-surface border border-success-500 rounded-2xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="w-20 h-20 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Backup Complete!
          </h2>
          <p className="text-gray-400 mb-6">
            You've successfully backed up your Nostr keys in multiple secure
            locations. Your keys are safe!
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Checklist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="bg-surface border border-border-dark rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-warning-500/20 rounded-2xl mb-4"
          >
            <Shield className="w-8 h-8 text-warning-500" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Backup Your Keys
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Before proceeding, complete this checklist to ensure your keys are
            safely backed up.
            <span className="text-warning-500 font-medium">
              {" "}
              This is critical - lost keys cannot be recovered.
            </span>
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Backup Progress</span>
            <span
              className={cn(
                "font-medium",
                allChecked ? "text-success-500" : "text-warning-500",
              )}
            >
              {checkedCount}/{checklist.length}
            </span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full transition-all",
                allChecked
                  ? "bg-success-500"
                  : "bg-gradient-to-r from-warning-500 to-warning-400",
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Key Copy Buttons (if keys provided) */}
        {requiredKeys && (requiredKeys.npub || requiredKeys.nsec) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {requiredKeys.npub && (
              <button
                onClick={() => handleCopyKey("npub")}
                className="flex items-center justify-center gap-2 p-3 bg-success-500/10 border border-success-500/30 hover:bg-success-500/20 rounded-xl transition-all"
              >
                <Key className="w-5 h-5 text-success-500" />
                <span className="text-success-500 font-medium">Copy npub</span>
              </button>
            )}
            {requiredKeys.nsec && (
              <button
                onClick={() => handleCopyKey("nsec")}
                className="flex items-center justify-center gap-2 p-3 bg-error-500/10 border border-error-500/30 hover:bg-error-500/20 rounded-xl transition-all"
              >
                <Lock className="w-5 h-5 text-error-500" />
                <span className="text-error-500 font-medium">Copy nsec</span>
              </button>
            )}
          </div>
        )}

        {/* Checklist */}
        <div className="space-y-3 mb-8">
          {checklist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleCheck(item.id)}
                className={cn(
                  "w-full text-left p-4 border rounded-xl transition-all",
                  item.checked
                    ? "border-success-500/50 bg-success-500/5"
                    : "border-border-dark hover:border-gray-600 hover:bg-gray-800/30",
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                      item.checked
                        ? "bg-success-500 border-success-500"
                        : "border-gray-500 hover:border-primary-500",
                    )}
                  >
                    {item.checked && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "transition-colors",
                          item.checked ? "text-success-500" : "text-gray-400",
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "font-medium transition-colors",
                          item.checked ? "text-success-500" : "text-white",
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.description}
                    </p>
                    {item.warning && !item.checked && (
                      <div className="flex items-start gap-2 mt-2 text-xs text-warning-500">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {item.warning}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleComplete}
            className={cn(
              "w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
              allChecked
                ? "bg-success-600 hover:bg-success-700 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600",
            )}
          >
            {allChecked ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                I've Completed All Backups
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                Complete All Items First
              </>
            )}
          </button>

          {!allChecked && (
            <button
              onClick={() => setShowSkipWarning(true)}
              className="w-full py-3 text-gray-400 hover:text-white text-sm transition-all"
            >
              Skip for now (not recommended)
            </button>
          )}
        </div>

        {/* Security Tips */}
        <div className="mt-8 p-4 bg-info-500/10 border border-info-500/30 rounded-xl">
          <h4 className="font-medium text-info-500 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Tips
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Never store your nsec in plain text files or screenshots</li>
            <li>• Don't share your keys with anyone, including "support"</li>
            <li>
              • Test your backup by restoring from it before deleting originals
            </li>
            <li>• Consider a hardware wallet for maximum security</li>
          </ul>
        </div>
      </div>

      {/* Skip Warning Modal */}
      <AnimatePresence>
        {showSkipWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSkipWarning(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-error-500 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-error-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-error-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Are you sure?</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Skipping backup puts your account at risk. If you lose your
                private key:
              </p>
              <ul className="text-sm text-error-500 space-y-1 mb-6">
                <li>• Your account cannot be recovered</li>
                <li>• Your identity and followers are lost forever</li>
                <li>• Any funds in your wallet are irretrievable</li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSkipWarning(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    setShowSkipWarning(false);
                    onComplete?.();
                  }}
                  className="flex-1 px-4 py-2 bg-error-500/20 hover:bg-error-500/30 text-error-500 rounded-lg transition-all"
                >
                  Skip Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-success-500 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-success-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Confirm Backup</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Please confirm that you have completed all backup steps. You
                understand that lost keys cannot be recovered.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  Review
                </button>
                <button
                  onClick={confirmComplete}
                  className="flex-1 px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={cn(
              "fixed bottom-6 left-1/2 px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2",
              toast.type === "success"
                ? "bg-success-500 text-white"
                : "bg-error-500 text-white",
            )}
          >
            {toast.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
