import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Users,
  Radio,
  Check,
  ExternalLink,
  TrendingUp,
  Palette,
  Camera,
  Music,
  BookOpen,
  BadgeCheck,
  Rocket,
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { nip19 } from "nostr-tools";
import { cn, saveToLocalStorage, loadFromLocalStorage } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import { curatedAccounts } from "../../data/follow-pack";
import type { CategoryId, CuratedAccount } from "../../types/follow-pack";

/**
 * Starter packs are DERIVED from src/data/follow-pack, never written by hand.
 *
 * The hardcoded list this replaced named twelve accounts, and eleven of the
 * twelve npubs failed their own bech32 checksum — invented keys that cannot
 * belong to anybody ("npub1news3333...", "npub1community4444..."). Telling a
 * beginner to follow a key that does not exist is the one failure this tool
 * must not have, so the accounts now come from the 527 curated npubs that the
 * follow pack already ships, every one of which decodes as a valid 32-byte key.
 *
 * A pack id IS a follow-pack category id, which buys the labels for free:
 * `followPack.categories.<id>.{name,description}` is already translated into
 * all seven locales.
 */
interface StarterPack {
  id: CategoryId;
  icon: React.ReactNode;
  color: string;
  accounts: CuratedAccount[];
}

interface Relay {
  id: string;
  url: string;
  isDefault?: boolean;
}

interface RecommendedClient {
  id: string;
  name: string;
  url: string;
}

interface EmptyFeedFixerProps {
  className?: string;
  onComplete?: () => void;
}

/** How many accounts each pack offers. Enough to fill a feed, few enough to read. */
const ACCOUNTS_PER_PACK = 6;

/**
 * Which categories become packs, in display order. Aimed at the audience this
 * site is for: writers, artists, musicians and photographers, plus a
 * general-purpose starting bucket.
 */
const PACK_DEFINITIONS: Array<{
  id: CategoryId;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    id: "jumpstart",
    icon: <Rocket className="w-6 h-6 text-white" />,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "legit",
    icon: <BadgeCheck className="w-6 h-6 text-white" />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "artists",
    icon: <Palette className="w-6 h-6 text-white" />,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "photography",
    icon: <Camera className="w-6 h-6 text-white" />,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "musicians",
    icon: <Music className="w-6 h-6 text-white" />,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "books",
    icon: <BookOpen className="w-6 h-6 text-white" />,
    color: "from-amber-500 to-orange-500",
  },
];

const isValidNpub = (value: string): boolean => {
  try {
    return nip19.decode(value.trim()).type === "npub";
  } catch {
    return false;
  }
};

const STARTER_PACKS: StarterPack[] = PACK_DEFINITIONS.map((definition) => ({
  ...definition,
  accounts: curatedAccounts
    .filter(
      (account) =>
        account.categories.includes(definition.id) &&
        account.bio.trim().length > 0,
    )
    .slice(0, ACCOUNTS_PER_PACK),
})).filter((pack) => pack.accounts.length > 0);

/**
 * Only relays confirmed alive and free to write to on 2026-09-02
 * (docs/audit-2026-09/relays-verified.md). purplepag.es used to sit in this
 * list; its NIP-11 could not be fetched at all, and a step whose whole promise
 * is "connect to these and your feed fills up" cannot ship a relay nobody can
 * confirm is answering.
 */
const DEFAULT_RELAYS: Relay[] = [
  { id: "damus", url: "wss://relay.damus.io", isDefault: true },
  { id: "nosLol", url: "wss://nos.lol", isDefault: true },
  { id: "primal", url: "wss://relay.primal.net", isDefault: true },
  { id: "snort", url: "wss://relay.snort.social", isDefault: true },
];

/**
 * Platform labels come from t(), not from this table: Amethyst being Android
 * only is a fact (docs/audit-2026-09/facts.md), but "Android" still renders in
 * seven languages.
 */
const RECOMMENDED_CLIENTS: RecommendedClient[] = [
  { id: "damus", name: "Damus", url: "https://damus.io" },
  {
    id: "amethyst",
    name: "Amethyst",
    url: "https://github.com/vitorpamplona/amethyst",
  },
  { id: "iris", name: "Iris", url: "https://iris.to" },
  { id: "primal", name: "Primal", url: "https://primal.net" },
];

export function EmptyFeedFixer({ className, onComplete }: EmptyFeedFixerProps) {
  const { t } = useTranslation();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [followedAccounts, setFollowedAccounts] = useState<Set<string>>(
    new Set(),
  );
  const [connectedRelays, setConnectedRelays] = useState<Set<string>>(
    new Set(),
  );
  const [customNpub, setCustomNpub] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Timed-exit modal state (double-rAF mount idiom)
  const [successEntered, setSuccessEntered] = useState(false);
  const [successExiting, setSuccessExiting] = useState(false);
  const successExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successAutoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmedNpub = customNpub.trim();
  const customNpubIsValid = useMemo(
    () => isValidNpub(trimmedNpub),
    [trimmedNpub],
  );
  const showNpubError = trimmedNpub.length > 0 && !customNpubIsValid;

  useEffect(() => {
    // Double rAF: paint the hidden state first so the enter transition runs
    if (!showSuccess) {
      setSuccessEntered(false);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setSuccessEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [showSuccess]);

  useEffect(
    () => () => {
      if (successExitTimer.current) clearTimeout(successExitTimer.current);
      if (successAutoTimer.current) clearTimeout(successAutoTimer.current);
    },
    [],
  );

  const dismissSuccess = () => {
    if (successExiting) return;
    setSuccessExiting(true);
    successExitTimer.current = setTimeout(() => {
      setSuccessExiting(false);
      setShowSuccess(false);
    }, 300);
  };

  const isSuccessShown = successEntered && !successExiting;

  useEffect(() => {
    const saved = loadFromLocalStorage<{
      followedAccounts: string[];
      connectedRelays: string[];
      completed: boolean;
    }>("nostr-feed-setup", {
      followedAccounts: [],
      connectedRelays: [],
      completed: false,
    });

    setFollowedAccounts(new Set(saved.followedAccounts));
    setConnectedRelays(new Set(saved.connectedRelays));
    setIsComplete(saved.completed);
  }, []);

  useEffect(() => {
    saveToLocalStorage("nostr-feed-setup", {
      followedAccounts: Array.from(followedAccounts),
      connectedRelays: Array.from(connectedRelays),
      completed: isComplete,
    });
  }, [followedAccounts, connectedRelays, isComplete]);

  const packName = (id: CategoryId) => t(`followPack.categories.${id}.name`);
  const packDescription = (id: CategoryId) =>
    t(`followPack.categories.${id}.description`);

  const handleFollowAll = (packId: string) => {
    const pack = STARTER_PACKS.find((p) => p.id === packId);
    if (!pack) return;

    const newFollowed = new Set(followedAccounts);
    pack.accounts.forEach((account) => newFollowed.add(account.npub));
    setFollowedAccounts(newFollowed);
    setSelectedPack(packId);
  };

  const handleFollowIndividual = (npub: string) => {
    const newFollowed = new Set(followedAccounts);
    if (newFollowed.has(npub)) {
      newFollowed.delete(npub);
    } else {
      newFollowed.add(npub);
    }
    setFollowedAccounts(newFollowed);
  };

  const handleAddCustomNpub = () => {
    if (!customNpubIsValid) return;
    handleFollowIndividual(trimmedNpub);
    setCustomNpub("");
  };

  const handleConnectRelay = (url: string) => {
    const newConnected = new Set(connectedRelays);
    if (newConnected.has(url)) {
      newConnected.delete(url);
    } else {
      newConnected.add(url);
    }
    setConnectedRelays(newConnected);
  };

  const handleConnectAllRelays = () => {
    const allUrls = new Set(DEFAULT_RELAYS.map((r) => r.url));
    setConnectedRelays(allUrls);
  };

  const handleComplete = () => {
    setIsComplete(true);
    setShowSuccess(true);
    onComplete?.();
    if (successAutoTimer.current) clearTimeout(successAutoTimer.current);
    successAutoTimer.current = setTimeout(() => dismissSuccess(), 5000);
  };

  const progress = Math.round(
    (followedAccounts.size > 0 ? 50 : 0) + (connectedRelays.size > 0 ? 50 : 0),
  );

  const openPack = STARTER_PACKS.find((p) => p.id === selectedPack);

  return (
    <div className={cn("max-w-4xl mx-auto p-6", className)}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4 animate-scale-in motion-reduce:animate-none">
            <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {t('emptyFeedFixer.title')}
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            {t('emptyFeedFixer.description')}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">{t('emptyFeedFixer.setupProgress')}</span>
            <span className="text-primary-600 dark:text-primary-400 font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-success-500 transition-[width] duration-500 ease-out-quint motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1: Follow Accounts */}
          <div
            className={cn(
              "border rounded-xl p-6 transition-all",
              activeStep === 1
                ? "border-primary-500 bg-primary-500/5"
                : "border-gray-700",
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  followedAccounts.size > 0
                    ? "bg-success-500"
                    : "bg-primary-500",
                )}
              >
                {followedAccounts.size > 0 ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Users className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {t('emptyFeedFixer.step1.title')}
                </h3>
                <p className="text-sm text-gray-400">
                  {followedAccounts.size > 0
                    ? t('emptyFeedFixer.step1.followingCount').replace('{count}', String(followedAccounts.size))
                    : t('emptyFeedFixer.step1.description')}
                </p>
              </div>
            </div>

            {/* Starter Packs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {STARTER_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all",
                    "hover:scale-[1.02] active:scale-[0.98] motion-reduce:transform-none",
                    selectedPack === pack.id
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-gray-700 hover:border-gray-600",
                  )}
                  onClick={() => setSelectedPack(pack.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-br",
                        pack.color,
                      )}
                    >
                      {pack.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        {packName(pack.id)}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {packDescription(pack.id)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('emptyFeedFixer.step1.accountCount').replace('{count}', String(pack.accounts.length))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Pack Details */}
            {openPack && (
                <div className="bg-gray-800/50 rounded-xl p-4 mb-4 animate-slide-down motion-reduce:animate-none">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">
                      {t('emptyFeedFixer.step1.packAccountsTitle').replace('{pack}', packName(openPack.id))}
                    </h4>
                    <button
                      onClick={() => handleFollowAll(openPack.id)}
                      className="text-sm text-primary-400 hover:text-primary-300 font-medium"
                    >
                      {t('emptyFeedFixer.step1.followAll')}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {openPack.accounts.map((account) => (
                      <div
                        key={account.npub}
                        className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white truncate">
                            {account.name}
                          </p>
                          {/* The account's own profile bio, as they wrote it.
                              Not our copy, so not translated - same as
                              AccountCard on /follow-pack. */}
                          <p className="text-sm text-gray-400 truncate">
                            {account.bio}
                          </p>
                          <p className="text-xs text-gray-500 font-mono truncate">
                            {account.npub.slice(0, 20)}...
                            {account.npub.slice(-8)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 ms-4">
                          <button
                            onClick={() => handleFollowIndividual(account.npub)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                              followedAccounts.has(account.npub)
                                ? "bg-success-500/20 text-success-500"
                                : "bg-primary-600 text-white hover:bg-primary-700",
                            )}
                          >
                            {followedAccounts.has(account.npub)
                              ? t('emptyFeedFixer.step1.following')
                              : t('emptyFeedFixer.step1.follow')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Custom Account Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  aria-label={t('emptyFeedFixer.step1.npubLabel')}
                  aria-invalid={showNpubError}
                  value={customNpub}
                  onChange={(e) => setCustomNpub(e.target.value)}
                  placeholder={t('emptyFeedFixer.step1.npubPlaceholder')}
                  className={cn(
                    "w-full ps-10 pe-4 py-2 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none",
                    showNpubError
                      ? "border-error-500 focus:border-error-500"
                      : "border-gray-700 focus:border-primary-500",
                  )}
                />
              </div>
              <button
                onClick={handleAddCustomNpub}
                disabled={!customNpubIsValid}
                className="px-4 py-2 bg-primary-600 disabled:bg-gray-700 text-white rounded-lg font-medium transition-all"
              >
                {t('emptyFeedFixer.step1.addCustom')}
              </button>
            </div>
            {showNpubError && (
              <p className="mt-2 text-sm text-error-500">
                {t('emptyFeedFixer.step1.npubInvalid')}
              </p>
            )}

            {followedAccounts.size > 0 && (
              <button
                onClick={() => setActiveStep(2)}
                className="mt-4 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                {t('emptyFeedFixer.step1.continue')}
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            )}
          </div>

          {/* Step 2: Connect Relays */}
          <div
            className={cn(
              "border rounded-xl p-6 transition-all",
              activeStep === 2
                ? "border-primary-500 bg-primary-500/5"
                : "border-gray-700",
              followedAccounts.size === 0 && "opacity-50 pointer-events-none",
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  connectedRelays.size > 0
                    ? "bg-success-500"
                    : "bg-primary-500",
                )}
              >
                {connectedRelays.size > 0 ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Radio className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {t('emptyFeedFixer.step2.title')}
                </h3>
                <p className="text-sm text-gray-400">
                  {connectedRelays.size > 0
                    ? t('emptyFeedFixer.step2.connectedCount').replace('{count}', String(connectedRelays.size))
                    : t('emptyFeedFixer.step2.description')}
                </p>
              </div>
            </div>

            <div className="bg-info-500/10 border border-info-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-info-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  {t('emptyFeedFixer.step2.info')}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {DEFAULT_RELAYS.map((relay) => (
                <div
                  key={relay.url}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-lg transition-all",
                    connectedRelays.has(relay.url)
                      ? "border-success-500 bg-success-500/10"
                      : "border-gray-700 hover:border-gray-600",
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">
                        {t(`emptyFeedFixer.relays.${relay.id}.name`)}
                      </p>
                      {relay.isDefault && (
                        <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
                          {t('emptyFeedFixer.step2.recommended')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {t(`emptyFeedFixer.relays.${relay.id}.description`)}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {relay.url}
                    </p>
                  </div>
                  <button
                    onClick={() => handleConnectRelay(relay.url)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                      connectedRelays.has(relay.url)
                        ? "bg-success-500/20 text-success-500"
                        : "bg-gray-700 text-white hover:bg-gray-600",
                    )}
                  >
                    {connectedRelays.has(relay.url) ? t('emptyFeedFixer.step2.connected') : t('emptyFeedFixer.step2.connect')}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleConnectAllRelays}
              className="w-full py-2 border border-primary-500 text-primary-400 hover:bg-primary-500/10 rounded-lg font-medium transition-all"
            >
              {t('emptyFeedFixer.step2.connectAll')}
            </button>

            {connectedRelays.size > 0 && (
              <button
                onClick={() => setActiveStep(3)}
                className="mt-4 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                {t('emptyFeedFixer.step2.continue')}
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            )}
          </div>

          {/* Step 3: Open Client */}
          <div
            className={cn(
              "border rounded-xl p-6 transition-all",
              activeStep === 3
                ? "border-success-500 bg-success-500/5"
                : "border-gray-700",
              (followedAccounts.size === 0 || connectedRelays.size === 0) &&
                "opacity-50 pointer-events-none",
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-success-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {t('emptyFeedFixer.step3.title')}
                </h3>
                <p className="text-sm text-gray-400">
                  {t('emptyFeedFixer.step3.description')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RECOMMENDED_CLIENTS.map((client) => (
                <a
                  key={client.id}
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleComplete}
                  className="flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-primary-500 rounded-xl transition-all group"
                >
                  <div>
                    <p className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {client.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {t(`emptyFeedFixer.clients.${client.id}.platform`)}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Success Animation */}
        {showSuccess && (
            <div
              className={cn(
                "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4",
                "transition-opacity duration-300 motion-reduce:transition-none",
                isSuccessShown ? "opacity-100" : "opacity-0",
              )}
            >
              <div
                className={cn(
                  "bg-gray-900 border border-success-500 rounded-2xl p-8 max-w-md w-full text-center",
                  "transition-all duration-300 ease-out-quint motion-reduce:transition-none",
                  isSuccessShown ? "opacity-100 scale-100" : "opacity-0 scale-95",
                )}
              >
                <div className="w-20 h-20 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-pop motion-reduce:animate-none">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t('emptyFeedFixer.step3.completed')}
                </h3>
                <p className="text-gray-400 mb-6">
                  {t('emptyFeedFixer.step3.successMessage')
                    .replace('{accounts}', String(followedAccounts.size))
                    .replace('{relays}', String(connectedRelays.size))}
                </p>
                <button
                  onClick={dismissSuccess}
                  className="px-6 py-3 bg-success-500 hover:bg-success-600 text-white rounded-xl font-medium transition-all"
                >
                  {t('emptyFeedFixer.step3.awesome')}
                </button>
              </div>
            </div>
        )}
      </div>
    </div>
  );
}
