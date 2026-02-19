import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AtSign,
  Check,
  X,
  AlertCircle,
  Search,
  Copy,
  ExternalLink,
  HelpCircle,
  Globe,
  Shield,
  User,
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Link,
} from "lucide-react";
import { nip19 } from "nostr-tools";
import { cn, copyToClipboard } from "../../lib/utils";

interface NIP05Result {
  identifier: string;
  isValid: boolean;
  npub?: string;
  name?: string;
  about?: string;
  picture?: string;
  relays?: string[];
  error?: string;
  errorType?: "format" | "domain" | "not-found" | "json" | "network";
}

interface NIP05CheckerProps {
  className?: string;
}

const ERROR_MESSAGES: Record<
  string,
  { title: string; description: string; fix: string }
> = {
  format: {
    title: "Invalid Format",
    description: "Your identifier doesn't match the expected format.",
    fix: "Use format: user@domain.com or _@domain.com",
  },
  domain: {
    title: "Domain Not Found",
    description: "We couldn't connect to the domain.",
    fix: "Check the spelling or wait and try again.",
  },
  "not-found": {
    title: "NIP-05 Not Configured",
    description: "The domain exists but NIP-05 is not set up.",
    fix: "Ask the domain owner to add NIP-05 configuration.",
  },
  json: {
    title: "JSON Parsing Error",
    description: "The nostr.json file is not valid JSON.",
    fix: "Check the file syntax on your server.",
  },
  network: {
    title: "Network Error",
    description: "Couldn't connect to check the identifier.",
    fix: "Check your internet connection and try again.",
  },
};

const NIP05_PROVIDERS = [
  {
    name: "NostrPlek",
    url: "https://nostrplebs.com",
    price: "$3/year",
    description: "Get verified in minutes",
  },
  {
    name: "NostrCheck.me",
    url: "https://nostrcheck.me",
    price: "Free/Paid",
    description: "Free verification available",
  },
  {
    name: "Nip05.social",
    url: "https://nip05.social",
    price: "Free",
    description: "Free NIP-05 identifiers",
  },
];

export function NIP05Checker({ className }: NIP05CheckerProps) {
  const [identifier, setIdentifier] = useState("");
  const [result, setResult] = useState<NIP05Result | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [recentChecks, setRecentChecks] = useState<string[]>([]);

  // Validate NIP-05 format
  const isValidFormat = (id: string): boolean => {
    // Basic validation: must contain @ and have valid characters
    if (!id.includes("@")) return false;
    const parts = id.split("@");
    if (parts.length !== 2) return false;
    const [name, domain] = parts;
    if (!name || !domain) return false;
    // Domain must have at least one dot and valid characters
    if (!domain.includes(".") || domain.length < 3) return false;
    return true;
  };

  // Check NIP-05 identifier
  const checkNIP05 = useCallback(async () => {
    if (!identifier.trim()) return;

    setIsChecking(true);
    setResult(null);

    try {
      // Validate format first
      if (!isValidFormat(identifier)) {
        setResult({
          identifier,
          isValid: false,
          error: "Invalid format. Use: user@domain.com",
          errorType: "format",
        });
        setIsChecking(false);
        return;
      }

      const [name, domain] = identifier.split("@");

      // Try to fetch nostr.json from the domain
      // Note: In production, you'd need to handle CORS or use a proxy
      const urls = [
        `https://${domain}/.well-known/nostr.json?name=${encodeURIComponent(name)}`,
        `https://${domain}/nostr.json?name=${encodeURIComponent(name)}`,
      ];

      let response = null;
      let lastError = null;

      for (const url of urls) {
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            response = await res.json();
            break;
          }
        } catch (e) {
          lastError = e;
          // Check if it's a CORS error (TypeError with network-related message)
          if (
            e instanceof TypeError &&
            (e.message.includes("CORS") ||
              e.message.includes("Failed to fetch"))
          ) {
            setResult({
              identifier,
              isValid: false,
              error:
                "CORS error: Domain blocks direct browser requests. Try checking manually or use a Nostr client.",
              errorType: "network",
            });
            setIsChecking(false);
            return;
          }
          continue;
        }
      }

      if (!response) {
        setResult({
          identifier,
          isValid: false,
          error: "NIP-05 not configured or domain not found",
          errorType: "not-found",
        });
        setIsChecking(false);
        return;
      }

      // Parse nostr.json
      const names = response.names || {};
      const nameKey = name === "_" ? "_" : name;
      const pubkey = names[nameKey];

      if (!pubkey) {
        setResult({
          identifier,
          isValid: false,
          error: `Username "${name}" not found on ${domain}`,
          errorType: "not-found",
        });
        setIsChecking(false);
        return;
      }

      // Convert pubkey to npub using proper bech32 encoding
      let npub: string;
      try {
        npub = nip19.npubEncode(pubkey);
      } catch {
        npub = pubkey; // Fallback to raw pubkey if encoding fails
      }

      setResult({
        identifier,
        isValid: true,
        npub,
        name: name === "_" ? domain : name,
        about: `Verified NIP-05 for ${domain}`,
        relays: response.relays?.[pubkey] || [],
      });

      // Add to recent checks
      setRecentChecks((prev) => {
        const updated = [
          identifier,
          ...prev.filter((i) => i !== identifier),
        ].slice(0, 5);
        return updated;
      });
    } catch (error) {
      setResult({
        identifier,
        isValid: false,
        error: "Network error occurred",
        errorType: "network",
      });
    } finally {
      setIsChecking(false);
    }
  }, [identifier]);

  // Handle copy
  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      // Show temporary success state
      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-success-500 text-white rounded-xl z-50";
      toast.textContent = `${label} copied!`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }
  };

  // Clear result
  const clearResult = () => {
    setResult(null);
    setIdentifier("");
  };

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="bg-surface border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4"
          >
            <AtSign className="w-8 h-8 text-primary-500" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            NIP-05 Checker
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Verify NIP-05 identifiers (like user@domain.com). These provide
            human-readable names on Nostr.
          </p>
        </div>

        {/* What is NIP-05 Info */}
        <motion.button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full mb-6 text-left"
        >
          <div className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">What is NIP-05?</span>
          </div>
        </motion.button>

        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-info-500/10 border border-info-500/30 rounded-xl p-4">
                <h3 className="font-semibold text-info-500 mb-2">
                  About NIP-05
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  NIP-05 is a protocol for verifying Nostr identities using DNS.
                  It lets you use an email-like address (user@domain.com)
                  instead of a long npub string.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                    <span>Get a human-readable username</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                    <span>Prove ownership of a domain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                    <span>Appear with a checkmark on some clients</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="space-y-4">
          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isChecking && checkNIP05()
              }
              placeholder="Enter identifier (e.g., jack@cash.app)"
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:outline-none text-lg"
            />
          </div>

          <button
            onClick={checkNIP05}
            disabled={!identifier.trim() || isChecking}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 dark:disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Verify Identifier
              </>
            )}
          </button>

          {/* Recent Checks */}
          {recentChecks.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-gray-500">Recent:</span>
              {recentChecks.map((check) => (
                <button
                  key={check}
                  onClick={() => {
                    setIdentifier(check);
                    setResult(null);
                  }}
                  className="text-sm text-primary-500 hover:text-primary-400 underline"
                >
                  {check}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              {result.isValid ? (
                <div className="bg-success-500/10 border border-success-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-white dark:text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-success-500">
                        Valid NIP-05!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This identifier is correctly configured
                      </p>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-4">
                    {result.picture ? (
                      <div className="flex items-center gap-4">
                        <img
                          src={result.picture}
                          alt={result.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">
                            {result.name}
                          </p>
                          <p className="text-primary-500">
                            {result.identifier}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">
                            {result.name}
                          </p>
                          <p className="text-primary-500">
                            {result.identifier}
                          </p>
                        </div>
                      </div>
                    )}

                    {result.about && (
                      <p className="text-gray-600 dark:text-gray-400">{result.about}</p>
                    )}

                    {/* Public Key */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <p className="text-sm text-gray-500 mb-1">
                        Public Key (npub)
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 font-mono text-sm text-success-500 break-all">
                          {result.npub}
                        </code>
                        <button
                          onClick={() => handleCopy(result.npub!, "Public key")}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Relays */}
                    {result.relays && result.relays.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Recommended Relays
                        </p>
                        <div className="space-y-1">
                          {result.relays.slice(0, 3).map((relay) => (
                            <div
                              key={relay}
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <Globe className="w-4 h-4" />
                              {relay}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-error-500/10 border border-error-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-error-500 rounded-full flex items-center justify-center">
                      <X className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-error-500">
                        Invalid NIP-05
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This identifier could not be verified
                      </p>
                    </div>
                  </div>

                  {/* Error Details */}
                  {result.errorType && ERROR_MESSAGES[result.errorType] && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                      <h4 className="font-semibold text-error-500 mb-1">
                        {ERROR_MESSAGES[result.errorType].title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {ERROR_MESSAGES[result.errorType].description}
                      </p>
                      <p className="text-sm">
                        <span className="text-primary-500">How to fix:</span>{" "}
                        {ERROR_MESSAGES[result.errorType].fix}
                      </p>
                    </div>
                  )}

                  <p className="text-gray-600 dark:text-gray-400 text-sm">{result.error}</p>

                  {/* Get NIP-05 CTA */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowProviders(true)}
                      className="text-primary-500 hover:text-primary-400 font-medium inline-flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Get your own NIP-05 identifier
                    </button>
                  </div>
                </div>
              )}

              {/* Clear Button */}
              <button
                onClick={clearResult}
                className="w-full mt-4 py-3 text-gray-600 dark:text-gray-400 hover:text-white transition-colors"
              >
                Check Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Get NIP-05 Providers */}
        {(!result || showProviders) && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              Get Your Own NIP-05
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NIP05_PROVIDERS.map((provider) => (
                <a
                  key={provider.name}
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-500 rounded-xl transition-all group"
                >
                  <div>
                    <p className="font-medium text-white group-hover:text-primary-500 transition-colors">
                      {provider.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {provider.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-success-500 font-medium">
                      {provider.price}
                    </p>
                    <ExternalLink className="w-4 h-4 text-gray-500 inline-block mt-1" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
