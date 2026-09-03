import React, { useState, useEffect, useRef } from "react";
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

const MODAL_EXIT_DURATION_MS = 300;

/**
 * Timed-exit modal transition: a double-rAF drives the enter transition,
 * close() plays the exit transition then flips the flag.
 */
function useTimedModalExit(
  isOpen: boolean,
  setOpen: (open: boolean) => void,
) {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isOpen]);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    [],
  );

  const close = () => {
    if (exiting) return;
    setExiting(true);
    exitTimer.current = setTimeout(() => {
      setExiting(false);
      setOpen(false);
    }, MODAL_EXIT_DURATION_MS);
  };

  return { isShown: entered && !exiting, close };
}

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
    icon: <Key className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
    checked: false,
  },
  {
    id: "copy-nsec",
    label: t('backupChecklist.checklist.copiedNsec.label'),
    description: t('backupChecklist.checklist.copiedNsec.description'),
    icon: <Lock className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
    checked: false,
    warning: t('backupChecklist.checklist.copiedNsec.warning'),
  },
  {
    id: "password-manager",
    label: t('backupChecklist.checklist.passwordManager.label'),
    description: t('backupChecklist.checklist.passwordManager.description'),
    icon: <Shield className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
    checked: false,
  },
  {
    id: "paper-backup",
    label: t('backupChecklist.checklist.paperBackup.label'),
    description: t('backupChecklist.checklist.paperBackup.description'),
    icon: <FileText className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
    checked: false,
    warning: t('backupChecklist.checklist.paperBackup.warning'),
  },
  {
    id: "encrypted-file",
    label: t('backupChecklist.checklist.encryptedFile.label'),
    description: t('backupChecklist.checklist.encryptedFile.description'),
    icon: <Save className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />,
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

  const skipModal = useTimedModalExit(showSkipWarning, setShowSkipWarning);
  const confirmModal = useTimedModalExit(showConfirmation, setShowConfirmation);

  // Trap focus inside the dialogs; Escape closes, focus returns to the opener.
  const skipModalRef = useFocusTrap<HTMLDivElement>(showSkipWarning, () =>
    skipModal.close(),
  );
  const confirmModalRef = useFocusTrap<HTMLDivElement>(showConfirmation, () =>
    confirmModal.close(),
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
        <div className="bg-white dark:bg-gray-900 border border-success-300 dark:border-success-800 rounded-lg p-8 text-center">
          <CheckCircle2
            className="mx-auto mb-3 h-6 w-6 text-success-700 dark:text-success-400"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h2 className="text-h2 font-display text-gray-900 dark:text-white mb-2">
            {t('backupChecklist.completion.title')}
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-400 mb-6">
            {t('backupChecklist.completion.description')}
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 text-body-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            {t('backupChecklist.completion.reset')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Shield
            className="mx-auto mb-3 h-6 w-6 text-warning-700 dark:text-warning-400"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h2 className="text-h2 font-display text-gray-900 dark:text-white mb-2">
            {t('backupChecklist.title')}
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            {t('backupChecklist.description')}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-body-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">{t('backupChecklist.progress')}</span>
            <span
              className={cn(
                "font-medium",
                allChecked
                  ? "text-success-700 dark:text-success-400"
                  : "text-warning-700 dark:text-warning-400",
              )}
            >
              {checkedCount}/{checklist.length}
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500 ease-out-quint motion-reduce:transition-none",
                allChecked ? "bg-success-600" : "bg-warning-500",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Key Copy Buttons (if keys provided) */}
        {requiredKeys && (requiredKeys.npub || requiredKeys.nsec) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {requiredKeys.npub && (
              <button
                onClick={() => handleCopyKey("npub")}
                className="flex items-center justify-center gap-2 p-3 rounded-md border border-success-300 bg-white transition-colors hover:bg-success-50 dark:border-success-800 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <Key
                  className="h-5 w-5 shrink-0 text-success-700 dark:text-success-400"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="text-body-sm font-medium text-success-700 dark:text-success-400">
                  {t('backupChecklist.buttons.copyNpub')}
                </span>
              </button>
            )}
            {requiredKeys.nsec && (
              <button
                onClick={() => handleCopyKey("nsec")}
                className="flex items-center justify-center gap-2 p-3 rounded-md border border-error-300 bg-white transition-colors hover:bg-error-50 dark:border-error-800 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <Lock
                  className="h-5 w-5 shrink-0 text-error-700 dark:text-error-400"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="text-body-sm font-medium text-error-700 dark:text-error-400">
                  {t('backupChecklist.buttons.copyNsec')}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Checklist */}
        <div className="space-y-3 mb-8">
          {checklist.map((item, index) => (
            <div
              key={item.id}
              className="animate-slide-up motion-reduce:animate-none"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleCheck(item.id)}
                className={cn(
                  "w-full text-start p-4 border rounded-lg transition-colors",
                  item.checked
                    ? "border-success-300 bg-success-50 dark:border-success-800 dark:bg-gray-900"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800",
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-sm border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                      item.checked
                        ? "bg-success-600 border-success-600"
                        : "border-gray-300 dark:border-gray-600",
                    )}
                  >
                    {item.checked && (
                      <Check className="h-4 w-4 text-white" strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "transition-colors",
                          item.checked
                            ? "text-success-700 dark:text-success-400"
                            : "text-gray-400 dark:text-gray-500",
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "text-body font-medium transition-colors",
                          item.checked
                            ? "text-success-700 dark:text-success-400"
                            : "text-gray-900 dark:text-white",
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                    {item.warning && !item.checked && (
                      <div className="flex items-start gap-2 mt-2 text-caption text-warning-700 dark:text-warning-400">
                        <AlertCircle
                          className="h-4 w-4 flex-shrink-0 mt-0.5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        {item.warning}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleComplete}
            className={cn(
              "w-full py-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2",
              allChecked
                ? "bg-success-600 hover:bg-success-700 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800",
            )}
          >
            {allChecked ? (
              <>
                <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {t('backupChecklist.buttons.completeAll')}
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {t('backupChecklist.buttons.completeRequired')}
              </>
            )}
          </button>

          {!allChecked && (
            <button
              onClick={() => setShowSkipWarning(true)}
              className="w-full py-3 text-body-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t('backupChecklist.buttons.skip')}
            </button>
          )}
        </div>

        {/* Security Tips */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
          <h4 className="text-h4 font-display text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Shield
              className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {t('backupChecklist.securityTips.title')}
          </h4>
          <ul className="text-body-sm text-gray-600 dark:text-gray-400 space-y-1">
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
      {showSkipWarning && (
          <div
            className={cn(
              "fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",
              "transition-opacity duration-300 motion-reduce:transition-none",
              skipModal.isShown ? "opacity-100" : "opacity-0",
            )}
            onClick={() => skipModal.close()}
          >
            <div
              ref={skipModalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="backup-skip-title"
              className={cn(
                "bg-white dark:bg-gray-900 border border-error-300 dark:border-error-800 rounded-lg shadow-raised p-6 max-w-md w-full",
                "transition-all duration-300 ease-out-quint motion-reduce:transition-none",
                skipModal.isShown ? "opacity-100 scale-100" : "opacity-0 scale-95",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle
                  className="h-6 w-6 shrink-0 text-error-700 dark:text-error-400"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 id="backup-skip-title" className="text-h3 font-display text-gray-900 dark:text-white">
                  {t('backupChecklist.skipModal.title')}
                </h3>
              </div>
              <p className="text-body text-gray-700 dark:text-gray-300 mb-4">
                {t('backupChecklist.skipModal.description')}
              </p>
              <ul className="text-body-sm text-error-700 dark:text-error-400 space-y-1 mb-6">
                {(getValue('backupChecklist.skipModal.risks') as string[]).map((risk: string, index: number) => (
                  <li key={index}>• {risk}</li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => skipModal.close()}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                >
                  {t('backupChecklist.skipModal.goBack')}
                </button>
                <button
                  onClick={() => {
                    skipModal.close();
                    onComplete?.();
                  }}
                  className="flex-1 px-4 py-2 rounded-md border border-error-300 bg-white text-error-700 font-medium transition-colors hover:bg-error-50 dark:border-error-800 dark:bg-gray-900 dark:text-error-400 dark:hover:bg-gray-800"
                >
                  {t('backupChecklist.skipModal.skipAnyway')}
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
          <div
            className={cn(
              "fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",
              "transition-opacity duration-300 motion-reduce:transition-none",
              confirmModal.isShown ? "opacity-100" : "opacity-0",
            )}
            onClick={() => confirmModal.close()}
          >
            <div
              ref={confirmModalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="backup-confirm-title"
              className={cn(
                "bg-white dark:bg-gray-900 border border-success-300 dark:border-success-800 rounded-lg shadow-raised p-6 max-w-md w-full",
                "transition-all duration-300 ease-out-quint motion-reduce:transition-none",
                confirmModal.isShown ? "opacity-100 scale-100" : "opacity-0 scale-95",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2
                  className="h-6 w-6 shrink-0 text-success-700 dark:text-success-400"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 id="backup-confirm-title" className="text-h3 font-display text-gray-900 dark:text-white">
                  {t('backupChecklist.confirmModal.title')}
                </h3>
              </div>
              <p className="text-body text-gray-700 dark:text-gray-300 mb-6">
                {t('backupChecklist.confirmModal.description')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => confirmModal.close()}
                  className="flex-1 px-4 py-2 rounded-md border border-gray-200 bg-white text-gray-700 font-medium transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                >
                  {t('backupChecklist.confirmModal.review')}
                </button>
                <button
                  onClick={confirmComplete}
                  className="flex-1 px-4 py-2 bg-success-600 hover:bg-success-700 text-white font-medium rounded-md transition-colors"
                >
                  {t('backupChecklist.confirmModal.confirm')}
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div
            className={cn(
              "px-6 py-3 rounded-md shadow-raised flex items-center gap-2 animate-slide-up motion-reduce:animate-none",
              toast.type === "success"
                ? "bg-success-600 text-white"
                : "bg-error-600 text-white",
            )}
          >
            {toast.type === "success" ? (
              <Check className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
