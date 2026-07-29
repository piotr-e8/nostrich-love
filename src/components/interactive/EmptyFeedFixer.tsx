import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Radio,
  Check,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Zap,
  Palette,
  Cpu,
  Globe,
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn, saveToLocalStorage, loadFromLocalStorage } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

interface StarterPack {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  accounts: Account[];
  color: string;
}

interface Account {
  npub: string;
  name: string;
  description: string;
  followerCount?: string;
}

interface Relay {
  url: string;
  name: string;
  description: string;
  isDefault?: boolean;
}

interface EmptyFeedFixerProps {
  className?: string;
  onComplete?: () => void;
}

const getStarterPacks = (t: (key: string) => string): StarterPack[] => [
  {
    id: "technology",
    name: t('emptyFeedFixer.starterPacks.technology.name'),
    description: t('emptyFeedFixer.starterPacks.technology.description'),
    icon: <Cpu className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    accounts: [
      {
        npub: "npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrfpy68s0tjzw",
        name: "fiatjaf",
        description: "Nostr creator",
        followerCount: "100K+",
      },
      {
        npub: "npub1gcxzte5zlkncx26j68ez60fzkvtkm9e0vrwdcvsjakxf9mu9zexsh6y3r7",
        name: "Will",
        description: "Nostr developer",
        followerCount: "50K+",
      },
      {
        npub: "npub1nstrcu63lzpjkz94djajuz2evrgu2psd66cw8n5888uzq2a7jcdrdkf02g",
        name: "Nostr Report",
        description: "Nostr news & updates",
        followerCount: "30K+",
      },
    ],
  },
  {
    id: "bitcoin",
    name: t('emptyFeedFixer.starterPacks.bitcoin.name'),
    description: t('emptyFeedFixer.starterPacks.bitcoin.description'),
    icon: <Zap className="w-6 h-6" />,
    color: "from-orange-500 to-yellow-500",
    accounts: [
      {
        npub: "npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6",
        name: "Jack Dorsey",
        description: "Bitcoin advocate",
        followerCount: "500K+",
      },
      {
        npub: "npub1sg6plzptd64u62q5q6f7y4t8q4z5v7w3x2y1z9a8b7c6d5e4f3g2h1i0j",
        name: "Bitcoin Magazine",
        description: "Bitcoin news & education",
        followerCount: "200K+",
      },
      {
        npub: "npub1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d",
        name: "Lightning Labs",
        description: "Lightning Network development",
        followerCount: "80K+",
      },
    ],
  },
  {
    id: "art",
    name: t('emptyFeedFixer.starterPacks.art.name'),
    description: t('emptyFeedFixer.starterPacks.art.description'),
    icon: <Palette className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    accounts: [
      {
        npub: "npub1art1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdef",
        name: "NostrArt",
        description: "Digital artist",
        followerCount: "25K+",
      },
      {
        npub: "npub1design9876543210zyxwvutsrqponmlkjihgfedcba0987654321",
        name: "Design Daily",
        description: "Design inspiration",
        followerCount: "40K+",
      },
      {
        npub: "npub1creative1111111111111111111111111111111111111111111111",
        name: "Creative Minds",
        description: "Creative community",
        followerCount: "15K+",
      },
    ],
  },
  {
    id: "general",
    name: t('emptyFeedFixer.starterPacks.general.name'),
    description: t('emptyFeedFixer.starterPacks.general.description'),
    icon: <Globe className="w-6 h-6" />,
    color: "from-purple-500 to-indigo-500",
    accounts: [
      {
        npub: "npub1general22222222222222222222222222222222222222222222222",
        name: "Nostr Explorer",
        description: "Nostr content curator",
        followerCount: "60K+",
      },
      {
        npub: "npub1news333333333333333333333333333333333333333333333333",
        name: "Nostr News",
        description: "Daily highlights",
        followerCount: "45K+",
      },
      {
        npub: "npub1community44444444444444444444444444444444444444444444",
        name: "Community Hub",
        description: "Nostr community",
        followerCount: "35K+",
      },
    ],
  },
];

const getDefaultRelays = (t: (key: string) => string): Relay[] => [
  {
    url: "wss://relay.damus.io",
    name: t('emptyFeedFixer.relays.wssRelayDamus.name'),
    description: t('emptyFeedFixer.relays.wssRelayDamus.description'),
    isDefault: true,
  },
  {
    url: "wss://nos.lol",
    name: t('emptyFeedFixer.relays.wssRelayNostr.name'),
    description: t('emptyFeedFixer.relays.wssRelayNostr.description'),
    isDefault: true,
  },
  {
    url: "wss://purplepag.es",
    name: t('emptyFeedFixer.relays.wssPurplePages.name'),
    description: t('emptyFeedFixer.relays.wssPurplePages.description'),
    isDefault: true,
  },
  {
    url: "wss://relay.snort.social",
    name: "Snort",
    description: "Snort client relay",
    isDefault: true,
  },
];

const RECOMMENDED_CLIENTS = [
  { name: "Damus", url: "https://damus.io", platform: "iOS" },
  {
    name: "Amethyst",
    url: "https://github.com/vitorpamplona/amethyst",
    platform: "Android",
  },
  { name: "Iris", url: "https://iris.to", platform: "Web" },
  { name: "Primal", url: "https://primal.net", platform: "Web/iOS/Android" },
];

export function EmptyFeedFixer({ className, onComplete }: EmptyFeedFixerProps) {
  const { t } = useTranslation();
  const STARTER_PACKS = getStarterPacks(t);
  const DEFAULT_RELAYS = getDefaultRelays(t);
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
  // Timed-exit modal state (StreakBanner idiom)
  const [successEntered, setSuccessEntered] = useState(false);
  const [successExiting, setSuccessExiting] = useState(false);
  const successExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successAutoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                    ? t('emptyFeedFixer.step1.following').replace('{count}', String(followedAccounts.size))
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
                        "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                        pack.color,
                      )}
                    >
                      {pack.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{pack.name}</h4>
                      <p className="text-sm text-gray-400">
                        {pack.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {pack.accounts.length} accounts
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Pack Details */}
            {selectedPack && (
                <div className="bg-gray-800/50 rounded-xl p-4 mb-4 animate-slide-down motion-reduce:animate-none">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">
                      {STARTER_PACKS.find((p) => p.id === selectedPack)?.name}{" "}
                      Accounts
                    </h4>
                    <button
                      onClick={() => handleFollowAll(selectedPack)}
                      className="text-sm text-primary-400 hover:text-primary-300 font-medium"
                    >
                      {t('emptyFeedFixer.step1.followAll')}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {STARTER_PACKS.find(
                      (p) => p.id === selectedPack,
                    )?.accounts.map((account) => (
                      <div
                        key={account.npub}
                        className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white truncate">
                            {account.name}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {account.description}
                          </p>
                          <p className="text-xs text-gray-500 font-mono truncate">
                            {account.npub.slice(0, 20)}...
                            {account.npub.slice(-8)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-sm text-gray-400">
                            {account.followerCount}
                          </span>
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  aria-label="Enter npub to follow"
                  value={customNpub}
                  onChange={(e) => setCustomNpub(e.target.value)}
                  placeholder="Enter npub to follow..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  if (customNpub.startsWith("npub1")) {
                    handleFollowIndividual(customNpub);
                    setCustomNpub("");
                  }
                }}
                disabled={!customNpub.startsWith("npub1")}
                className="px-4 py-2 bg-primary-600 disabled:bg-gray-700 text-white rounded-lg font-medium transition-all"
              >
                {t('emptyFeedFixer.step1.addCustom')}
              </button>
            </div>

            {followedAccounts.size > 0 && (
              <button
                onClick={() => setActiveStep(2)}
                className="mt-4 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                {t('emptyFeedFixer.step1.continue')}
                <ChevronRight className="w-5 h-5" />
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
                    ? t('emptyFeedFixer.step2.connected').replace('{count}', String(connectedRelays.size))
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
                      <p className="font-medium text-white">{relay.name}</p>
                      {relay.isDefault && (
                        <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
                          {t('emptyFeedFixer.step2.recommended')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{relay.description}</p>
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
                <ChevronRight className="w-5 h-5" />
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
                  key={client.name}
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
                    <p className="text-sm text-gray-400">{client.platform}</p>
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
