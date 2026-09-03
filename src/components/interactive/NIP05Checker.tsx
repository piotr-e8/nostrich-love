import React, { useState, useCallback } from "react";
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
import { useTranslation } from "../../hooks/useTranslation";

// Three outcomes, not two. "unknown" exists because a browser cannot tell a
// domain that withholds Access-Control-Allow-Origin from one that is down or
// does not resolve: fetch rejects with the same TypeError either way, and the
// message differs per browser. Reporting that as "Invalid NIP-05" sent people
// off to edit a file that was fine.
type NIP05Status = "valid" | "invalid" | "unknown";

type NIP05ErrorType =
  | "format"
  | "domain"
  | "not-found"
  | "json"
  | "network"
  | "blocked"
  | "npub-instead-of-hex"
  | "malformed-key";

interface NIP05Result {
  identifier: string;
  status: NIP05Status;
  npub?: string;
  name?: string;
  about?: string;
  picture?: string;
  relays?: string[];
  error?: string;
  errorType?: NIP05ErrorType;
  /** Hex decoded from an npub found where hex belongs, so the fix is copy-paste. */
  hexFromNpub?: string;
}

// NIP-05 requires the value in `names` to be the public key as 64 lowercase hex
// characters. An `npub1…` there is the most common hand-editing mistake: the
// file parses, the fetch succeeds, and every client still refuses to verify.
const HEX_PUBKEY = /^[0-9a-f]{64}$/;

interface NIP05CheckerProps {
  className?: string;
}

const getErrorMessages = (t: (key: string) => string): Record<
  string,
  { title: string; description: string; fix: string }
> => ({
  format: {
    title: t('nip05Checker.errors.invalidFormat.title'),
    description: t('nip05Checker.errors.invalidFormat.description'),
    fix: t('nip05Checker.errors.invalidFormat.fix'),
  },
  domain: {
    title: t('nip05Checker.errors.domainNotFound.title'),
    description: t('nip05Checker.errors.domainNotFound.description'),
    fix: t('nip05Checker.errors.domainNotFound.fix'),
  },
  "not-found": {
    title: t('nip05Checker.errors.notConfigured.title'),
    description: t('nip05Checker.errors.notConfigured.description'),
    fix: t('nip05Checker.errors.notConfigured.fix'),
  },
  json: {
    title: t('nip05Checker.errors.jsonError.title'),
    description: t('nip05Checker.errors.jsonError.description'),
    fix: t('nip05Checker.errors.jsonError.fix'),
  },
  network: {
    title: t('nip05Checker.errors.networkError.title'),
    description: t('nip05Checker.errors.networkError.description'),
    fix: t('nip05Checker.errors.networkError.fix'),
  },
  blocked: {
    title: t('nip05Checker.errors.blocked.title'),
    description: t('nip05Checker.errors.blocked.description'),
    fix: t('nip05Checker.errors.blocked.fix'),
  },
  "npub-instead-of-hex": {
    title: t('nip05Checker.errors.npubInsteadOfHex.title'),
    description: t('nip05Checker.errors.npubInsteadOfHex.description'),
    fix: t('nip05Checker.errors.npubInsteadOfHex.fix'),
  },
  "malformed-key": {
    title: t('nip05Checker.errors.malformedKey.title'),
    description: t('nip05Checker.errors.malformedKey.description'),
    fix: t('nip05Checker.errors.malformedKey.fix'),
  },
});

// Only providers confirmed reachable and confirmed to still sell/give away a
// NIP-05 identifier. nip05.social used to sit here and is now NXDOMAIN on three
// independent resolvers, so it was sending readers to a domain that no longer
// exists. Descriptions and prices live in i18n; the name and URL do not, since
// they are the same in every language.
const NIP05_PROVIDERS = [
  { id: "nostrplebs", name: "Nostr Plebs", url: "https://nostrplebs.com" },
  { id: "nostrcheck", name: "nostrcheck.me", url: "https://nostrcheck.me" },
];

export function NIP05Checker({ className }: NIP05CheckerProps) {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState("");
  const [result, setResult] = useState<NIP05Result | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [recentChecks, setRecentChecks] = useState<string[]>([]);
  const errorMessages = getErrorMessages(t);

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
          status: "invalid",
          error: t('nip05Checker.messages.invalidFormat'),
          errorType: "format",
        });
        setIsChecking(false);
        return;
      }

      const [name, domain] = identifier.split("@");

      // .well-known is the path NIP-05 defines; the bare /nostr.json is a
      // legacy fallback some hosts still use.
      const urls = [
        `https://${domain}/.well-known/nostr.json?name=${encodeURIComponent(name)}`,
        `https://${domain}/nostr.json?name=${encodeURIComponent(name)}`,
      ];

      let response: any = null;
      let brokenJson = false;
      // fetch() rejects only on a network-level failure, never on an HTTP error
      // status, so a rejection means the browser got nothing back: missing CORS
      // header, dead domain, dropped connection. Sniffing e.message for "CORS"
      // or "Failed to fetch" only ever matched Chrome's wording.
      let unreachable = false;
      let sawHttpResponse = false;

      for (const url of urls) {
        let res: Response;
        try {
          res = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
          });
        } catch {
          unreachable = true;
          continue;
        }
        sawHttpResponse = true;
        if (!res.ok) continue;
        try {
          response = await res.json();
        } catch {
          brokenJson = true;
        }
        break;
      }

      if (brokenJson) {
        setResult({
          identifier,
          status: "invalid",
          errorType: "json",
        });
        setIsChecking(false);
        return;
      }

      if (!response) {
        // A readable HTTP answer (even a 404) proves the domain is reachable
        // and does not block us, so that is a real "not set up here".
        setResult(
          !sawHttpResponse && unreachable
            ? { identifier, status: "unknown", errorType: "blocked" }
            : {
                identifier,
                status: "invalid",
                error: t('nip05Checker.messages.notConfigured'),
                errorType: "not-found",
              }
        );
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
          status: "invalid",
          error: t('nip05Checker.messages.nameNotFound')
            .replace('{name}', name)
            .replace('{domain}', domain),
          errorType: "not-found",
        });
        setIsChecking(false);
        return;
      }

      // The value has to be hex. npubEncode() happily encodes any short hex
      // string into a plausible-looking npub, so a truncated key used to be
      // reported valid too.
      const rawKey = typeof pubkey === "string" ? pubkey.trim() : "";
      if (!HEX_PUBKEY.test(rawKey)) {
        const looksLikeNpub = rawKey.startsWith("npub1");
        let hexFromNpub: string | undefined;
        if (looksLikeNpub) {
          try {
            const decoded = nip19.decode(rawKey);
            if (decoded.type === "npub") hexFromNpub = decoded.data as string;
          } catch {
            // An npub that does not decode: the message alone has to do.
          }
        }
        setResult({
          identifier,
          status: "invalid",
          errorType: looksLikeNpub ? "npub-instead-of-hex" : "malformed-key",
          hexFromNpub,
        });
        setIsChecking(false);
        return;
      }

      setResult({
        identifier,
        status: "valid",
        npub: nip19.npubEncode(rawKey),
        name: name === "_" ? domain : name,
        about: t('nip05Checker.messages.verifiedOn').replace('{domain}', domain),
        relays: response.relays?.[rawKey] || [],
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
        status: "invalid",
        error: t('nip05Checker.messages.networkError'),
        errorType: "network",
      });
    } finally {
      setIsChecking(false);
    }
  }, [identifier, t]);

  // Handle copy
  const handleCopy = async (text: string, message: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      // Show temporary success state
      const toast = document.createElement("div");
      toast.className =
        "fixed inset-x-0 bottom-6 z-50 mx-auto w-fit rounded-md bg-success-700 px-6 py-3 text-white shadow-raised";
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }
  };

  // Clear result
  const clearResult = () => {
    setResult(null);
    setIdentifier("");
  };

  // Shared by the "invalid" and the "could not check" panels
  const renderDetails = (errorType?: NIP05ErrorType) =>
    errorType && errorMessages[errorType] ? (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
          {errorMessages[errorType].title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-body-sm mb-2">
          {errorMessages[errorType].description}
        </p>
        <p className="text-body-sm text-gray-600 dark:text-gray-400">
          <span className="text-primary-600 dark:text-primary-400">
            {t('nip05Checker.errors.fixLabel')}
          </span>{" "}
          {errorMessages[errorType].fix}
        </p>
      </div>
    ) : null;

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <AtSign
              className="h-6 w-6 text-gray-400 dark:text-gray-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <h2 className="mb-2 text-h2 text-gray-900 dark:text-white">
            {t('nip05Checker.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {t('nip05Checker.description')}
          </p>
        </div>

        {/* What is NIP-05 Info */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full mb-6 text-start"
        >
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            <HelpCircle className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-medium">{t('nip05Checker.whatIsNip05')}</span>
          </div>
        </button>

        {showHelp && (
            <div className="mb-6 animate-slide-down motion-reduce:animate-none">
              <div className="border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 rounded-lg p-4">
                <h3 className="font-semibold text-info-500 mb-2">
                  {t('nip05Checker.aboutNip05')}
                </h3>
                <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-3">
                  {t('nip05Checker.aboutNip05Body')}
                </p>
                <ul className="text-body-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success-700 dark:text-success-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                    <span>{t('nip05Checker.benefits.humanReadable')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success-700 dark:text-success-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                    <span>{t('nip05Checker.benefits.domainOwnership')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success-700 dark:text-success-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                    <span>{t('nip05Checker.benefits.checkmark')}</span>
                  </li>
                </ul>
              </div>
            </div>
        )}

        {/* Input */}
        <div className="space-y-4">
          <div className="relative">
            <AtSign className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" strokeWidth={1.5} aria-hidden="true" />
            <input
              type="text"
              aria-label={t('nip05Checker.form.placeholder')}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isChecking && checkNIP05()
              }
              placeholder={t('nip05Checker.form.placeholder')}
              className="w-full ps-12 pe-4 py-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-body transition-colors focus:border-primary-600 dark:focus:border-primary-400"
            />
          </div>

          <button
            onClick={checkNIP05}
            disabled={!identifier.trim() || isChecking}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 dark:disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" strokeWidth={1.5} aria-hidden="true" />
                {t('nip05Checker.form.checking')}
              </>
            ) : (
              <>
                <Search className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                {t('nip05Checker.form.verifyButton')}
              </>
            )}
          </button>

          {/* Recent Checks */}
          {recentChecks.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-body-sm text-gray-500">{t('nip05Checker.form.recent')}</span>
              {recentChecks.map((check) => (
                <button
                  key={check}
                  onClick={() => {
                    setIdentifier(check);
                    setResult(null);
                  }}
                  className="text-body-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
                >
                  {check}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Result — persistent polite live region so screen readers hear the
            in-progress status and the check outcome when they render */}
        <div aria-live="polite">
          {isChecking && (
            <span className="sr-only">{t('nip05Checker.form.checking')}</span>
          )}
          {result && (
            <div className="mt-6 animate-slide-up motion-reduce:animate-none">
              {result.status === "valid" ? (
                <div className="border border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-950 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Check
                      className="h-6 w-6 shrink-0 text-success-700 dark:text-success-400"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-h3 text-success-800 dark:text-success-300">
                        {t('nip05Checker.results.valid.title')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('nip05Checker.results.valid.description')}
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
                          <p className="font-semibold text-gray-900 dark:text-white text-h4">
                            {result.name}
                          </p>
                          <p className="text-primary-600 dark:text-primary-400">
                            {result.identifier}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-500" strokeWidth={1.5} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-h4">
                            {result.name}
                          </p>
                          <p className="text-primary-600 dark:text-primary-400">
                            {result.identifier}
                          </p>
                        </div>
                      </div>
                    )}

                    {result.about && (
                      <p className="text-gray-600 dark:text-gray-400">{result.about}</p>
                    )}

                    {/* Public Key */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                      <p className="text-body-sm text-gray-500 mb-1">
                        {t('nip05Checker.results.valid.publicKey')}
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 font-mono text-body-sm text-success-700 dark:text-success-400 break-all">
                          {result.npub}
                        </code>
                        <button
                          onClick={() =>
                            handleCopy(
                              result.npub!,
                              t('nip05Checker.results.valid.copied')
                            )
                          }
                          aria-label={t('nip05Checker.results.valid.copyPublicKey')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Relays */}
                    {result.relays && result.relays.length > 0 && (
                      <div>
                        <p className="text-body-sm text-gray-500 mb-2">
                          {t('nip05Checker.results.valid.recommendedRelays')}
                        </p>
                        <div className="space-y-1">
                          {result.relays.slice(0, 3).map((relay) => (
                            <div
                              key={relay}
                              className="flex items-center gap-2 text-body-sm text-gray-600 dark:text-gray-400"
                            >
                              <Globe className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                              {relay}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : result.status === "unknown" ? (
                /* Not "invalid" — the check never got an answer, so the tool
                   has nothing to say about the identifier itself. */
                <div className="border border-warning-200 bg-warning-50 dark:border-warning-900 dark:bg-warning-950 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle
                      className="h-6 w-6 shrink-0 text-warning-600 dark:text-warning-400"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-h3 text-warning-900 dark:text-warning-100">
                        {t('nip05Checker.results.unknown.title')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('nip05Checker.results.unknown.description')}
                      </p>
                    </div>
                  </div>

                  {renderDetails(result.errorType)}

                  {result.error && (
                    <p className="text-gray-600 dark:text-gray-400 text-body-sm">{result.error}</p>
                  )}
                </div>
              ) : (
                <div className="border border-error-200 bg-error-50 dark:border-error-900 dark:bg-error-950 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <X
                      className="h-6 w-6 shrink-0 text-error-700 dark:text-error-400"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-h3 text-error-800 dark:text-error-300">
                        {t('nip05Checker.results.invalid.title')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('nip05Checker.results.invalid.description')}
                      </p>
                    </div>
                  </div>

                  {/* Error Details */}
                  {renderDetails(result.errorType)}

                  {/* The hex the file should have held, ready to paste */}
                  {result.hexFromNpub && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-4">
                      <p className="text-body-sm text-gray-500 mb-1">
                        {t('nip05Checker.errors.hexLabel')}
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 font-mono text-body-sm text-gray-900 dark:text-white break-all">
                          {result.hexFromNpub}
                        </code>
                        <button
                          onClick={() =>
                            handleCopy(
                              result.hexFromNpub!,
                              t('nip05Checker.results.valid.copied')
                            )
                          }
                          aria-label={t('nip05Checker.results.valid.copyPublicKey')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}

                  {result.error && (
                    <p className="text-gray-600 dark:text-gray-400 text-body-sm">{result.error}</p>
                  )}

                  {/* Get NIP-05 CTA */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => setShowProviders(true)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                      {t('nip05Checker.results.getYourOwn')}
                    </button>
                  </div>
                </div>
              )}

              {/* Clear Button */}
              <button
                onClick={clearResult}
                className="w-full mt-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t('nip05Checker.results.checkAnother')}
              </button>
            </div>
          )}
        </div>

        {/* Get NIP-05 Providers */}
        {(!result || showProviders) && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-h4 font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" strokeWidth={1.5} aria-hidden="true" />
              {t('nip05Checker.providers.title')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NIP05_PROVIDERS.map((provider) => (
                <a
                  key={provider.name}
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-lg transition-colors group"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {provider.name}
                    </p>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">
                      {t(`nip05Checker.providers.list.${provider.id}.description`)}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-success-700 dark:text-success-400 font-medium">
                      {t(`nip05Checker.providers.list.${provider.id}.price`)}
                    </p>
                    <ExternalLink className="w-4 h-4 text-gray-500 inline-block mt-1" strokeWidth={1.5} aria-hidden="true" />
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
