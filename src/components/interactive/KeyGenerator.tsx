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
  const openWarningModal = () => {
    if (modalExitTimer.current) {
      clearTimeout(modalExitTimer.current);
      modalExitTimer.current = null;
    }
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

  const handleCopy = async (text: string, label: string) => {
    if (!allChecksPassed) {
      setPendingAction(() => () => performCopy(text, label));
      openWarningModal();
      return;
    }
    await performCopy(text, label);
  };

  const performCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast(t('keyGenerator.toast.copied').replace('{label}', label), "success");
    } else {
      showToast(t('keyGenerator.toast.copyFailed'), "error");
    }
  };

  const handleDownload = () => {
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
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4 animate-scale-in motion-reduce:animate-none">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
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
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Dice5 className="w-5 h-5" />
              )}
              {isGenerating ? t('keyGenerator.buttons.generating') : t('keyGenerator.buttons.generate')}
            </button>

            {isGenerating && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {t('keyGenerator.progress.collectingEntropy')}
                  </span>
                  <span>{Math.min(100, Math.round(entropyProgress))}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-success-500 transition-[width] duration-100 ease-out-quint motion-reduce:transition-none"
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
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                      {t('keyGenerator.securityWarning.title')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('keyGenerator.securityWarning.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Checklist */}
              <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  {t('keyGenerator.securityChecklist.title')}
                </h3>
                <div className="space-y-2">
                  {securityChecks.map((check) => (
                    <label
                      key={check.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all",
                        check.checked
                          ? "bg-success-500/10"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700/50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                          check.checked
                            ? "bg-success-500 border-success-500"
                            : "border-gray-400 dark:border-gray-500 hover:border-primary-500",
                        )}
                      >
                        {check.checked && (
                          <Check className="w-3 h-3 text-white" />
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
                          "text-sm",
                          check.checked ? "text-success-500" : "text-gray-600 dark:text-gray-300",
                        )}
                      >
                        {check.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('keyGenerator.progress.securityAcknowledgment')}
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        allChecksPassed ? "text-success-500" : "text-gray-600 dark:text-gray-400",
                      )}
                    >
                      {securityChecks.filter((c) => c.checked).length}/
                      {securityChecks.length}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-success-500 transition-[width] duration-300 ease-out-quint motion-reduce:transition-none"
                      style={{
                        width: `${(securityChecks.filter((c) => c.checked).length / securityChecks.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Public Key */}
              <div className="bg-green-50 dark:bg-green-900/10 border border-success-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-success-500" />
                    <h3 className="font-semibold text-success-500">
                      {t('keyGenerator.keys.public.title')}
                    </h3>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-success-500 px-2 py-1 rounded-full">
                    {t('keyGenerator.keys.public.badge')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {t('keyGenerator.keys.public.description')}
                </p>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 font-mono text-sm text-success-500 break-all mb-3">
                  {keys.npub}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCopy(keys.npub, t('keyGenerator.keys.public.title'))}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:green-900/30 hover:bg-success-500/30 text-success-500 rounded-lg transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    {t('keyGenerator.keys.public.copy')}
                  </button>
                  {qrCodeData?.npub && (
                    <a
                      href={qrCodeData.npub}
                      download="npub-qr.png"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      {t('keyGenerator.keys.public.qrCode')}
                    </a>
                  )}
                </div>
              </div>

              {/* Private Key */}
              <div className="bg-red-50 dark:bg-red-900/10 border border-error-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-error-500" />
                    <h3 className="font-semibold text-error-500">
                      {t('keyGenerator.keys.private.title')}
                    </h3>
                  </div>
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-error-500 px-2 py-1 rounded-full">
                    {t('keyGenerator.keys.private.badge')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {t('keyGenerator.keys.private.description')}
                </p>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 font-mono text-sm text-error-500 break-all mb-3 flex items-center justify-between gap-3">
                  <span className={showPrivateKey ? "" : "blur-sm select-none"}>
                    {showPrivateKey ? keys.nsec : "•".repeat(keys.nsec.length)}
                  </span>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all flex-shrink-0"
                    aria-label={
                      showPrivateKey ? t('keyGenerator.keys.private.hide') : t('keyGenerator.keys.private.show')
                    }
                  >
                    {showPrivateKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCopy(keys.nsec, t('keyGenerator.keys.private.title'))}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:red-900/30 hover:bg-error-500/30 text-error-500 rounded-lg transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    {t('keyGenerator.keys.private.copy')}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    {t('keyGenerator.keys.private.download')}
                  </button>
                  {qrCodeData?.nsec && (
                    <a
                      href={qrCodeData.nsec}
                      download="nsec-qr.png"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      {t('keyGenerator.keys.private.qrCode')}
                    </a>
                  )}
                </div>
              </div>

              {/* Regenerate */}
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setKeys(null);
                    setSecurityChecks(getSecurityChecks(t));
                    setQrCodeData(null);
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
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
              "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4",
              "transition-opacity duration-300 motion-reduce:transition-none",
              isModalShown ? "opacity-100" : "opacity-0",
            )}
            onClick={closeWarningModal}
          >
            <div
              className={cn(
                "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-w-md w-full",
                "transition-all duration-300 ease-out-quint motion-reduce:transition-none",
                isModalShown ? "opacity-100 scale-100" : "opacity-0 scale-95",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-warning-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-700 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('keyGenerator.modal.title')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('keyGenerator.modal.description')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeWarningModal}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-all"
                >
                  {t('keyGenerator.modal.goBack')}
                </button>
                <button
                  onClick={() => {
                    pendingAction?.();
                    setPendingAction(null);
                    closeWarningModal();
                  }}
                  className="flex-1 px-4 py-2 bg-warning-500/20 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-700 dark:text-yellow-400 rounded-lg transition-all"
                >
                  {t('keyGenerator.modal.copyAnyway')}
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
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div
              className={cn(
                "px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-up motion-reduce:animate-none",
                toast.type === "success" && "bg-success-500 text-white",
                toast.type === "error" && "bg-error-500 text-white",
                toast.type === "warning" && "bg-warning-500 text-black",
              )}
            >
              {toast.type === "success" && <Check className="w-5 h-5" />}
              {toast.type === "error" && <AlertTriangle className="w-5 h-5" />}
              {toast.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
