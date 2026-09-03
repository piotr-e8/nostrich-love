import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Shield,
  AlertTriangle,
  Check,
  QrCode,
  Dice5,
  Lock,
  Unlock,
} from "lucide-react";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import * as QRCode from "qrcode";
import {
  cn,
  copyToClipboard,
  downloadFile,
  saveToLocalStorage,
  loadFromLocalStorage,
} from "../../lib/utils";
import { recordActivity } from "../../utils/gamificationEngine";
import { useTranslation } from "../../hooks/useTranslation";

// Helper function to convert Uint8Array to hex string (browser-compatible)
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface KeyPair {
  nsec: string;
  npub: string;
  hexPrivate: string;
  hexPublic: string;
}

interface SecurityCheck {
  id: string;
  label: string;
  checked: boolean;
}

interface KeyGeneratorProps {
  className?: string;
  onKeysGenerated?: (keys: KeyPair) => void;
}

const MODAL_EXIT_DURATION_MS = 300;

const getSecurityChecks = (t: (key: string) => string): SecurityCheck[] => [
  {
    id: "understand",
    label: t("keyGenerator.securityChecklist.items.understand.label"),
    checked: false,
  },
  {
    id: "three-places",
    label: t("keyGenerator.securityChecklist.items.threePlaces.label"),
    checked: false,
  },
  {
    id: "never-share",
    label: t("keyGenerator.securityChecklist.items.neverShare.label"),
    checked: false,
  },
];

export function KeyGenerator({
  className,
  onKeysGenerated,
}: KeyGeneratorProps) {
  const { t, locale } = useTranslation();
  const [keys, setKeys] = useState<KeyPair | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [qrCodeData, setQrCodeData] = useState<{
    npub: string;
    nsec: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const [entropyProgress, setEntropyProgress] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  // "security": an action on the private key before the checklist is done.
  // "discard": throwing the current pair away, which nothing can undo.
  const [modalVariant, setModalVariant] = useState<"security" | "discard">(
    "security",
  );
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  // Timed-exit modal state (double-rAF mount idiom)
  const [modalEntered, setModalEntered] = useState(false);
  const [modalExiting, setModalExiting] = useState(false);
  const modalExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allChecksPassed = securityChecks.every((check) => check.checked);

  useEffect(() => {
    // Double rAF: paint the hidden state first so the enter transition runs
    if (!showWarningModal) {
      setModalEntered(false);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setModalEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [showWarningModal]);

  useEffect(
    () => () => {
      if (modalExitTimer.current) clearTimeout(modalExitTimer.current);
    },
    [],
  );

  const closeWarningModal = () => {
    if (modalExiting) return;
    setPendingAction(null);
    setModalExiting(true);
    modalExitTimer.current = setTimeout(() => {
      setModalExiting(false);
      setShowWarningModal(false);
    }, MODAL_EXIT_DURATION_MS);
  };

  // Opening must cancel an exit in flight: `showWarningModal` stays true for
  // the whole 300 ms exit window, so a plain setShowWarningModal(true) there
  // is a no-op and the pending timer would close the modal the user just
  // re-requested. (AnimatePresence used to re-enter in this case.)
  const openWarningModal = (variant: "security" | "discard" = "security") => {
    if (modalExitTimer.current) {
      clearTimeout(modalExitTimer.current);
      modalExitTimer.current = null;
    }
    setModalVariant(variant);
    setModalExiting(false);
    setShowWarningModal(true);
  };

  const isModalShown = modalEntered && !modalExiting;

  // Load security checks from localStorage only once on mount, or when locale changes
  useEffect(() => {
    const defaultChecks = getSecurityChecks(t);
    const savedChecks = loadFromLocalStorage<SecurityCheck[] | null>(
      "nostr-key-security-checks",
      null,
    );
    
    if (savedChecks && Array.isArray(savedChecks) && savedChecks.length > 0) {
      // Merge saved checked state with current translations
      const mergedChecks = defaultChecks.map((defaultCheck, index) => ({
        ...defaultCheck,
        checked: savedChecks[index]?.checked ?? false,
      }));
      setSecurityChecks(mergedChecks);
    } else {
      setSecurityChecks(defaultChecks);
    }
  }, [locale]); // Only re-run when locale changes, not on every t change

  useEffect(() => {
    saveToLocalStorage("nostr-key-security-checks", securityChecks);
  }, [securityChecks]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "warning" = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  const generateKeys = useCallback(async () => {
    setIsGenerating(true);
    setKeys(null);
    setQrCodeData(null);
    setEntropyProgress(0);

    // Animate entropy collection
    const entropyInterval = setInterval(() => {
      setEntropyProgress((prev) => {
        if (prev >= 100) {
          clearInterval(entropyInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Simulate generation delay for animation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    clearInterval(entropyInterval);
    setEntropyProgress(100);

    // Generate actual keys using nostr-tools
    const privateKey = generateSecretKey();
    const publicKey = getPublicKey(privateKey);

    const keyPair: KeyPair = {
      hexPrivate: bytesToHex(privateKey),
      hexPublic: publicKey,
      nsec: nip19.nsecEncode(privateKey),
      npub: nip19.npubEncode(publicKey),
    };

    setKeys(keyPair);

    // Record key generation (triggers key-master badge and streak)
    recordActivity('generateKeys');

    // Generate QR codes
    try {
      const npubQr = await QRCode.toDataURL(keyPair.npub, { width: 200 });
      const nsecQr = await QRCode.toDataURL(keyPair.nsec, { width: 200 });
      setQrCodeData({ npub: npubQr, nsec: nsecQr });
    } catch (err) {
      console.error("Failed to generate QR codes:", err);
    }

    setIsGenerating(false);
    onKeysGenerated?.(keyPair);
    showToast(t('keyGenerator.toast.success'), "success");
  }, [onKeysGenerated, showToast, t]);

  // Gate for anything that puts the PRIVATE key somewhere it can be read
  // later: the clipboard, a text file, a PNG. The npub is not routed through
  // here — it carries a "Safe to share" badge, and a warning modal on top of
  // that badge told the reader two opposite things about the same key.
  const guardPrivateKeyAction = (action: () => void) => {
    if (!allChecksPassed) {
      setPendingAction(() => action);
      openWarningModal("security");
      return;
    }
    action();
  };

  const handleCopyPrivate = (text: string, label: string) => {
    guardPrivateKeyAction(() => {
      void performCopy(text, label);
    });
  };

  const performCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast(t('keyGenerator.toast.copied').replace('{label}', label), "success");
    } else {
      showToast(t('keyGenerator.toast.copyFailed'), "error");
    }
  };

  const saveDataUrl = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownload = () => {
    if (!keys) return;
    guardPrivateKeyAction(performDownload);
  };

  const performDownload = () => {
    if (!keys) return;

    const content = `${t('keyGenerator.backupFile.title')}
================
${t('keyGenerator.backupFile.generated')}: ${new Date().toISOString()}

${t('keyGenerator.backupFile.publicKey')}:
${keys.npub}

${t('keyGenerator.backupFile.privateKey')}:
${keys.nsec}

${t('keyGenerator.backupFile.hexPrivate')}:
${keys.hexPrivate}

${t('keyGenerator.backupFile.hexPublic')}:
${keys.hexPublic}

================
${t('keyGenerator.backupFile.warnings.title')}:
- ${t('keyGenerator.backupFile.warnings.keepSecret')}
- ${t('keyGenerator.backupFile.warnings.neverShare')}
- ${t('keyGenerator.backupFile.warnings.storeBackups')}
- ${t('keyGenerator.backupFile.warnings.onlyPassword')}
`;

    downloadFile(`nostr-keys-${Date.now()}.txt`, content);
    showToast(t('keyGenerator.toast.downloaded'), "success");
    
    // Record key backup (triggers security-conscious badge and streak)
    recordActivity('backupKeys');
  };

  const toggleSecurityCheck = (id: string) => {
    setSecurityChecks((prev) =>
      prev.map((check) =>
        check.id === id ? { ...check, checked: !check.checked } : check,
      ),
    );
  };

  return (
    <div className={cn("max-w-3xl mx-auto p-6", className)}>
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <Shield
              className="h-6 w-6 text-gray-400 dark:text-gray-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <h2 className="mb-2 text-h2 text-gray-900 dark:text-white">
            {t('keyGenerator.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            {t('keyGenerator.description')}
          </p>
        </div>

        {/* Generate Button */}
        {!keys && (
          <div className="text-center animate-slide-up motion-reduce:animate-none">
            <button
              onClick={generateKeys}
              disabled={isGenerating}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-md transition-colors disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Dice5 className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              )}
              {isGenerating ? t('keyGenerator.buttons.generating') : t('keyGenerator.buttons.generate')}
            </button>

            {isGenerating && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="flex items-center justify-between text-body-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                    {t('keyGenerator.progress.collectingEntropy')}
                  </span>
                  <span>{Math.min(100, Math.round(entropyProgress))}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-[width] duration-100 ease-out-quint dark:bg-primary-400 motion-reduce:transition-none"
                    style={{ width: `${Math.min(100, entropyProgress)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keys Display */}
        {keys && (
          <div className="space-y-6 animate-slide-up motion-reduce:animate-none">
              {/* Security Warning */}
              <div className="border border-warning-200 bg-warning-50 dark:border-warning-900 dark:bg-warning-950 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning-600 dark:text-warning-400" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <h3 className="mb-1 font-semibold text-warning-900 dark:text-warning-100">
                      {t('keyGenerator.securityWarning.title')}
                    </h3>
                    <p className="text-body-sm text-gray-600 dark:text-gray-300">
                      {t('keyGenerator.securityWarning.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Checklist */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" strokeWidth={1.5} aria-hidden="true" />
                  {t('keyGenerator.securityChecklist.title')}
                </h3>
                <div className="space-y-2">
                  {securityChecks.map((check) => (
                    <label
                      key={check.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        check.checked
                          ? "bg-success-50 dark:bg-success-950"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700/50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                          check.checked
                            ? "bg-success-500 border-success-500"
                            : "border-gray-400 dark:border-gray-500 hover:border-gray-300 dark:hover:border-gray-700",
                        )}
                      >
                        {check.checked && (
                          <Check className="w-3 h-3 text-white" strokeWidth={1.5} aria-hidden="true" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={check.checked}
                        onChange={() => toggleSecurityCheck(check.id)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "text-body-sm",
                          check.checked ? "text-success-700 dark:text-success-400" : "text-gray-600 dark:text-gray-300",
                        )}
                      >
                        {check.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-body-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('keyGenerator.progress.securityAcknowledgment')}
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        allChecksPassed ? "text-success-700 dark:text-success-400" : "text-gray-600 dark:text-gray-400",
                      )}
                    >
                      {securityChecks.filter((c) => c.checked).length}/
                      {securityChecks.length}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 transition-[width] duration-300 ease-out-quint dark:bg-primary-400 motion-reduce:transition-none"
                      style={{
                        width: `${(securityChecks.filter((c) => c.checked).length / securityChecks.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Public Key */}
              <div className="bg-success-50 dark:bg-success-950 border border-success-200 dark:border-success-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-success-700 dark:text-success-400" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="font-semibold text-success-700 dark:text-success-400">
                      {t('keyGenerator.keys.public.title')}
                    </h3>
                  </div>
                  <span className="text-caption border border-success-200 dark:border-success-900 text-success-800 dark:text-success-400 px-2 py-1 rounded-full">
                    {t('keyGenerator.keys.public.badge')}
                  </span>
                </div>
                <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-3">
                  {t('keyGenerator.keys.public.description')}
                </p>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 font-mono text-body-sm text-success-700 dark:text-success-400 break-all mb-3">
                  {keys.npub}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => performCopy(keys.npub, t('keyGenerator.keys.public.title'))}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-success-200 dark:border-success-900 hover:bg-success-100 dark:hover:bg-success-900 text-success-700 dark:text-success-400 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                    {t('keyGenerator.keys.public.copy')}
                  </button>
                  {qrCodeData?.npub && (
                    <a
                      href={qrCodeData.npub}
                      download="npub-qr.png"
                      className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-800"
                    >
                      <QrCode className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                      {t('keyGenerator.keys.public.qrCode')}
                    </a>
                  )}
                </div>
              </div>

              {/* Private Key */}
              <div className="bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-error-700 dark:text-error-400" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="font-semibold text-error-700 dark:text-error-400">
                      {t('keyGenerator.keys.private.title')}
                    </h3>
                  </div>
                  <span className="text-caption border border-error-200 dark:border-error-900 text-error-800 dark:text-error-400 px-2 py-1 rounded-full">
                    {t('keyGenerator.keys.private.badge')}
                  </span>
                </div>
                <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-3">
                  {t('keyGenerator.keys.private.description')}
                </p>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 font-mono text-body-sm text-error-700 dark:text-error-400 break-all mb-3 flex items-center justify-between gap-3">
                  <span className={showPrivateKey ? "" : "blur-sm select-none"}>
                    {showPrivateKey ? keys.nsec : "•".repeat(keys.nsec.length)}
                  </span>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                    aria-label={
                      showPrivateKey ? t('keyGenerator.keys.private.hide') : t('keyGenerator.keys.private.show')
                    }
                  >
                    {showPrivateKey ? (
                      <EyeOff className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCopyPrivate(keys.nsec, t('keyGenerator.keys.private.title'))}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-error-200 dark:border-error-900 hover:bg-error-100 dark:hover:bg-error-900 text-error-700 dark:text-error-400 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                    {t('keyGenerator.keys.private.copy')}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-800"
                  >
                    <Download className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                    {t('keyGenerator.keys.private.download')}
                  </button>
                  {qrCodeData?.nsec && (
                    /* A button, not <a download>: an anchor saves the private
                       key as a PNG with no way to gate it on the checklist. */
                    <button
                      onClick={() =>
                        guardPrivateKeyAction(() =>
                          saveDataUrl(qrCodeData.nsec, "nsec-qr.png"),
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-800"
                    >
                      <QrCode className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                      {t('keyGenerator.keys.private.qrCode')}
                    </button>
                  )}
                </div>
              </div>

              {/* Regenerate */}
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    // The pair lives in React state only. Clearing it is final,
                    // so ask first instead of wiping it on a stray click.
                    setPendingAction(() => () => {
                      setKeys(null);
                      setSecurityChecks(getSecurityChecks(t));
                      setQrCodeData(null);
                    });
                    openWarningModal("discard");
                  }}
                  className="text-body-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  {t('keyGenerator.buttons.regenerate')}
                </button>
              </div>
          </div>
        )}
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
          <div
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
              "transition-opacity duration-300 motion-reduce:transition-none",
              isModalShown ? "opacity-100" : "opacity-0",
            )}
            onClick={closeWarningModal}
          >
            <div
              className={cn(
                "w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-raised dark:border-gray-800 dark:bg-gray-900",
                "transition-colors duration-300 ease-out-quint motion-reduce:transition-none",
                isModalShown ? "opacity-100 scale-100" : "opacity-0 scale-95",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle
                  className="h-6 w-6 shrink-0 text-warning-600 dark:text-warning-400"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="text-h3 text-gray-900 dark:text-white">
                  {modalVariant === "discard"
                    ? t('keyGenerator.discardModal.title')
                    : t('keyGenerator.modal.title')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {modalVariant === "discard"
                  ? t('keyGenerator.discardModal.description')
                  : t('keyGenerator.modal.description')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeWarningModal}
                  className="flex-1 rounded-md border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-800"
                >
                  {t('keyGenerator.modal.goBack')}
                </button>
                <button
                  onClick={() => {
                    pendingAction?.();
                    setPendingAction(null);
                    closeWarningModal();
                  }}
                  className="flex-1 rounded-md border border-warning-300 px-4 py-2 text-warning-800 transition-colors hover:bg-warning-50 dark:border-warning-800 dark:text-warning-300 dark:hover:bg-warning-950"
                >
                  {modalVariant === "discard"
                    ? t('keyGenerator.discardModal.confirm')
                    : t('keyGenerator.modal.continueAnyway')}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Toast Notification — persistent polite live region: announces the key
          generation result ("Keys generated successfully!") plus copy/download
          feedback to screen readers the moment the toast renders */}
      <div aria-live="polite">
        {toast && (
          <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center">
            <div
              className={cn(
                "flex items-center gap-2 rounded-md px-6 py-3 shadow-raised animate-slide-up motion-reduce:animate-none",
                toast.type === "success" && "bg-success-700 text-white",
                toast.type === "error" && "bg-error-700 text-white",
                toast.type === "warning" && "bg-warning-700 text-white",
              )}
            >
              {toast.type === "success" && <Check className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />}
              {toast.type === "error" && <AlertTriangle className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />}
              {toast.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
