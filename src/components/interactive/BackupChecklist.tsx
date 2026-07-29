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
import { useTranslation } from "../../hooks/useTranslation";
import { useFocusTrap } from "../../hooks/useFocusTrap";

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

const getDefaultChecklist = (t: (key: string) => string): ChecklistItem[] => [
  {
    id: "copy-npub",
    label: t('backupChecklist.checklist.copiedNpub.label'),
    description: t('backupChecklist.checklist.copiedNpub.description'),
    icon: <Key className="w-5 h-5" />,
    checked: false,
  },
  {
    id: "copy-nsec",
    label: t('backupChecklist.checklist.copiedNsec.label'),
    description: t('backupChecklist.checklist.copiedNsec.description'),
    icon: <Lock className="w-5 h-5" />,
    checked: false,
    warning: t('backupChecklist.checklist.copiedNsec.warning'),
  },
  {
    id: "password-manager",
    label: t('backupChecklist.checklist.passwordManager.label'),
    description: t('backupChecklist.checklist.passwordManager.description'),
    icon: <Shield className="w-5 h-5" />,
    checked: false,
  },
  {
    id: "paper-backup",
    label: t('backupChecklist.checklist.paperBackup.label'),
    description: t('backupChecklist.checklist.paperBackup.description'),
    icon: <FileText className="w-5 h-5" />,
    checked: false,
    warning: t('backupChecklist.checklist.paperBackup.warning'),
  },
  {
    id: "encrypted-file",
    label: t('backupChecklist.checklist.encryptedFile.label'),
    description: t('backupChecklist.checklist.encryptedFile.description'),
    icon: <Save className="w-5 h-5" />,
    checked: false,
  },
];

export function BackupChecklist({
  className,
  onComplete,
  requiredKeys,
}: BackupChecklistProps) {
  const { t, getValue } = useTranslation();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(getDefaultChecklist(t));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Trap focus inside the dialogs; Escape closes, focus returns to the opener.
  const skipModalRef = useFocusTrap<HTMLDivElement>(showSkipWarning, () =>
    setShowSkipWarning(false),
  );
  const confirmModalRef = useFocusTrap<HTMLDivElement>(showConfirmation, () =>
    setShowConfirmation(false),
  );

  useEffect(() => {
    const saved = loadFromLocalStorage<{
      checklist: ChecklistItem[];
      isComplete: boolean;
    }>("nostr-backup-checklist", {
      checklist: getDefaultChecklist(t),
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
    setChecklist(getDefaultChecklist(t));
    setIsComplete(false);
    setShowConfirmation(false);
    setShowSkipWarning(false);
  };

  if (isComplete) {
    return (
      <div className={cn("max-w-2xl mx-auto p-6", className)}>
        <div className="bg-gray-900 border border-success-500 rounded-2xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="w-20 h-20 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('backupChecklist.completion.title')}
          </h2>
          <p className="text-gray-400 mb-6">
            {t('backupChecklist.completion.description')}
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            {t('backupChecklist.completion.reset')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8">
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
            {t('backupChecklist.title')}
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            {t('backupChecklist.description')}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">{t('backupChecklist.progress')}</span>
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
                <span className="text-success-500 font-medium">{t('backupChecklist.buttons.copyNpub')}</span>
              </button>
            )}
            {requiredKeys.nsec && (
              <button
                onClick={() => handleCopyKey("nsec")}
                className="flex items-center justify-center gap-2 p-3 bg-error-500/10 border border-error-500/30 hover:bg-error-500/20 rounded-xl transition-all"
              >
                <Lock className="w-5 h-5 text-error-500" />
                <span className="text-error-500 font-medium">{t('backupChecklist.buttons.copyNsec')}</span>
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
                    : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30",
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
                {t('backupChecklist.buttons.completeAll')}
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                {t('backupChecklist.buttons.completeRequired')}
              </>
            )}
          </button>

          {!allChecked && (
            <button
              onClick={() => setShowSkipWarning(true)}
              className="w-full py-3 text-gray-400 hover:text-white text-sm transition-all"
            >
              {t('backupChecklist.buttons.skip')}
            </button>
          )}
        </div>

        {/* Security Tips */}
        <div className="mt-8 p-4 bg-info-500/10 border border-info-500/30 rounded-xl">
          <h4 className="font-medium text-info-500 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
{t('backupChecklist.securityTips')}
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• {t('backupChecklist.securityTips.items.0')}</li>
            <li>• {t('backupChecklist.securityTips.items.1')}</li>
            <li>
              • {t('backupChecklist.securityTips.items.2')}
            </li>
            <li>• {t('backupChecklist.securityTips.items.3')}</li>
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
              ref={skipModalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="backup-skip-title"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-error-500 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-error-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-error-500" />
                </div>
                <h3 id="backup-skip-title" className="text-xl font-bold text-white">{t('backupChecklist.skipModal.title')}</h3>
              </div>
              <p className="text-gray-300 mb-4">
                {t('backupChecklist.skipModal.description')}
              </p>
              <ul className="text-sm text-error-500 space-y-1 mb-6">
                {(getValue('backupChecklist.skipModal.risks') as string[]).map((risk: string, index: number) => (
                  <li key={index}>• {risk}</li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSkipWarning(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  {t('backupChecklist.skipModal.goBack')}
                </button>
                <button
                  onClick={() => {
                    setShowSkipWarning(false);
                    onComplete?.();
                  }}
                  className="flex-1 px-4 py-2 bg-error-500/20 hover:bg-error-500/30 text-error-500 rounded-lg transition-all"
                >
                  {t('backupChecklist.skipModal.skipAnyway')}
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
              ref={confirmModalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="backup-confirm-title"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-success-500 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-success-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success-500" />
                </div>
                <h3 id="backup-confirm-title" className="text-xl font-bold text-white">{t('backupChecklist.confirmModal.title')}</h3>
              </div>
              <p className="text-gray-300 mb-6">
                {t('backupChecklist.confirmModal.description')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  {t('backupChecklist.confirmModal.review')}
                </button>
                <button
                  onClick={confirmComplete}
                  className="flex-1 px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-all"
                >
                  {t('backupChecklist.confirmModal.confirm')}
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
