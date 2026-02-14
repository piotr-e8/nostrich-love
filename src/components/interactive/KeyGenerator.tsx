import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const SECURITY_CHECKS: SecurityCheck[] = [
  {
    id: "understand",
    label:
      "I understand this is my only password - if lost, it cannot be recovered",
    checked: false,
  },
  {
    id: "three-places",
    label: "I will save it in at least 3 different secure locations",
    checked: false,
  },
  {
    id: "never-share",
    label: "I will NEVER share my nsec (private key) with anyone",
    checked: false,
  },
];

export function KeyGenerator({
  className,
  onKeysGenerated,
}: KeyGeneratorProps) {
  const [keys, setKeys] = useState<KeyPair | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [securityChecks, setSecurityChecks] =
    useState<SecurityCheck[]>(SECURITY_CHECKS);
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

  const allChecksPassed = securityChecks.every((check) => check.checked);

  useEffect(() => {
    const savedChecks = loadFromLocalStorage<SecurityCheck[]>(
      "nostr-key-security-checks",
      SECURITY_CHECKS,
    );
    setSecurityChecks(savedChecks);
  }, []);

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
    showToast("Keys generated successfully!", "success");
  }, [onKeysGenerated, showToast]);

  const handleCopy = async (text: string, label: string) => {
    if (!allChecksPassed) {
      setPendingAction(() => () => performCopy(text, label));
      setShowWarningModal(true);
      return;
    }
    await performCopy(text, label);
  };

  const performCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast(`${label} copied to clipboard`, "success");
    } else {
      showToast("Failed to copy to clipboard", "error");
    }
  };

  const handleDownload = () => {
    if (!keys) return;

    const content = `NOSTR KEY BACKUP
================
Generated: ${new Date().toISOString()}

PUBLIC KEY (npub) - Safe to share:
${keys.npub}

PRIVATE KEY (nsec) - NEVER SHARE:
${keys.nsec}

Hex Private Key:
${keys.hexPrivate}

Hex Public Key:
${keys.hexPublic}

================
IMPORTANT SECURITY WARNINGS:
- Keep your private key (nsec) secret
- Never share it with anyone
- Store backups in multiple secure locations
- This is your only password - it cannot be recovered if lost
`;

    downloadFile(`nostr-keys-${Date.now()}.txt`, content);
    showToast("Keys downloaded successfully", "success");
    
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
      <div className="bg-surface border border-border-dark rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4"
          >
            <Shield className="w-8 h-8 text-primary-500" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Generate Your Nostr Keys
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Create a secure key pair to access Nostr. Your keys are generated
            locally in your browser and never sent to any server.
          </p>
        </div>

        {/* Generate Button */}
        {!keys && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={generateKeys}
              disabled={isGenerating}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Dice5 className="w-5 h-5" />
              )}
              {isGenerating ? "Generating..." : "Generate New Key Pair"}
            </button>

            {isGenerating && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Collecting entropy...
                  </span>
                  <span>{Math.min(100, Math.round(entropyProgress))}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-success-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, entropyProgress)}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Keys Display */}
        <AnimatePresence>
          {keys && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Security Warning */}
              <div className="bg-warning-500/10 border border-warning-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-warning-500 mb-1">
                      Critical Security Notice
                    </h3>
                    <p className="text-sm text-gray-300">
                      Your private key (nsec) is like a password. Anyone with
                      access to it can control your account. Complete the
                      security checklist below before copying or downloading
                      your keys.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Checklist */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-border-dark">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-500" />
                  Security Checklist
                </h3>
                <div className="space-y-2">
                  {securityChecks.map((check) => (
                    <label
                      key={check.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all",
                        check.checked
                          ? "bg-success-500/10"
                          : "hover:bg-gray-700/50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                          check.checked
                            ? "bg-success-500 border-success-500"
                            : "border-gray-500 hover:border-primary-500",
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
                          check.checked ? "text-success-500" : "text-gray-300",
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
                    <span className="text-gray-400">
                      Security Acknowledgment
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        allChecksPassed ? "text-success-500" : "text-gray-400",
                      )}
                    >
                      {securityChecks.filter((c) => c.checked).length}/
                      {securityChecks.length}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-success-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(securityChecks.filter((c) => c.checked).length / securityChecks.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* Public Key */}
              <div className="bg-success-500/5 border border-success-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-success-500" />
                    <h3 className="font-semibold text-success-500">
                      Public Key (npub)
                    </h3>
                  </div>
                  <span className="text-xs bg-success-500/20 text-success-500 px-2 py-1 rounded-full">
                    Safe to share
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  This is your public identifier. Share it with others so they
                  can find and follow you.
                </p>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-success-500 break-all mb-3">
                  {keys.npub}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCopy(keys.npub, "Public key")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-success-500/20 hover:bg-success-500/30 text-success-500 rounded-lg transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  {qrCodeData?.npub && (
                    <a
                      href={qrCodeData.npub}
                      download="npub-qr.png"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </a>
                  )}
                </div>
              </div>

              {/* Private Key */}
              <div className="bg-error-500/5 border border-error-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-error-500" />
                    <h3 className="font-semibold text-error-500">
                      Private Key (nsec)
                    </h3>
                  </div>
                  <span className="text-xs bg-error-500/20 text-error-500 px-2 py-1 rounded-full">
                    NEVER SHARE
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  This is your password. Anyone with this can control your
                  account. Keep it secret and secure.
                </p>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-error-500 break-all mb-3 flex items-center justify-between gap-3">
                  <span className={showPrivateKey ? "" : "blur-sm select-none"}>
                    {showPrivateKey ? keys.nsec : "•".repeat(keys.nsec.length)}
                  </span>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-all flex-shrink-0"
                    aria-label={
                      showPrivateKey ? "Hide private key" : "Show private key"
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
                    onClick={() => handleCopy(keys.nsec, "Private key")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-error-500/20 hover:bg-error-500/30 text-error-500 rounded-lg transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Backup
                  </button>
                  {qrCodeData?.nsec && (
                    <a
                      href={qrCodeData.nsec}
                      download="nsec-qr.png"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </a>
                  )}
                </div>
              </div>

              {/* Regenerate */}
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setKeys(null);
                    setSecurityChecks(SECURITY_CHECKS);
                    setQrCodeData(null);
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-all inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate new key pair
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowWarningModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-border-dark rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-warning-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning-500" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Security Warning
                </h3>
              </div>
              <p className="text-gray-300 mb-6">
                You haven't completed all security acknowledgments. Copying your
                keys without understanding the risks could result in permanent
                loss of access.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    setShowWarningModal(false);
                    pendingAction?.();
                    setPendingAction(null);
                  }}
                  className="flex-1 px-4 py-2 bg-warning-500/20 hover:bg-warning-500/30 text-warning-500 rounded-lg transition-all"
                >
                  Copy Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={cn(
              "fixed bottom-6 left-1/2 px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2",
              toast.type === "success" && "bg-success-500 text-white",
              toast.type === "error" && "bg-error-500 text-white",
              toast.type === "warning" && "bg-warning-500 text-black",
            )}
          >
            {toast.type === "success" && <Check className="w-5 h-5" />}
            {toast.type === "error" && <AlertTriangle className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
