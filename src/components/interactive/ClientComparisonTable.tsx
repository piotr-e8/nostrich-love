import React, { useState, useMemo } from 'react';
import {
  Smartphone,
  Monitor,
  Globe,
  Wallet,
  Image as ImageIcon,
  FileText,
  Shield,
  Download,
  Filter,
  Search,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn, downloadFile } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';
import { getValue } from '../../i18n';

type Platform = 'ios' | 'android' | 'web' | 'desktop';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Machine-readable only. Every human-readable string (name, description,
// pros, cons, tags) lives in the translations under clientComparisonTable.*.
interface NostrClient {
  id: string;
  name: string;
  icon: string;
  platforms: Platform[];
  difficulty: Difficulty;
  wallet: boolean;
  media: boolean;
  longform: boolean;
  privacy: boolean;
  description: string;
  pros: string[];
  cons: string[];
  urls: {
    web?: string;
    ios?: string;
    android?: string;
    desktop?: string;
  };
  tags: string[];
}

interface ClientComparisonTableProps {
  className?: string;
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  ios: <Smartphone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />,
  android: <Smartphone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />,
  web: <Globe className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />,
  desktop: <Monitor className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />,
};

// The CSV is a file the reader keeps, not a UI label, so the name stays
// constant across locales; the column headers inside it are translated.
const CSV_FILENAME = 'nostr-clients.csv';

// Store and site links, checked against docs/audit-2026-09/facts.md and
// re-verified at source on 2026-09-02 (iTunes lookup by track id, Play Store
// listing by package name, HTTP status for the web clients).
//
// Three entries used to live here and are gone:
//   - Current: App Store id 1668517032 returns zero results and the repo
//     stopped in December 2023.
//   - Habla: habla.news answers 404.
//   - Plebstr: the package com.plebstr.client is now the Openvibe app, a
//     multi-network client, not the Nostr client we described.
// YakiHonne took the long-form slot: web, iOS, Android and desktop, iOS
// id6472556189 updated 2026-08-31.
const CLIENT_URLS: Record<string, { web?: string; ios?: string; android?: string; desktop?: string }> = {
  damus: { ios: 'https://apps.apple.com/app/damus/id1628663131' },
  amethyst: { android: 'https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst' },
  primal: {
    web: 'https://primal.net',
    ios: 'https://apps.apple.com/app/primal/id1673134518',
    android: 'https://play.google.com/store/apps/details?id=net.primal.android'
  },
  iris: { web: 'https://iris.to' },
  snort: { web: 'https://snort.social' },
  coracle: { web: 'https://coracle.social' },
  yakihonne: {
    web: 'https://yakihonne.com',
    ios: 'https://apps.apple.com/app/yakihonne/id6472556189',
    android: 'https://play.google.com/store/apps/details?id=com.yakihonne.yakihonne'
  },
  nostur: { ios: 'https://apps.apple.com/app/nostur/id1672780508' },
};

export function ClientComparisonTable({ className }: ClientComparisonTableProps) {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set());
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Helper to get array from translations
  const getArray = (key: string): string[] => getValue(key, locale) || [];

  // None of these is a native desktop app. The web clients carry "desktop"
  // as well, because opening them in a browser is how somebody on a Mac or a
  // PC uses them, and a Desktop filter that returns nothing helps nobody.
  // Coracle in particular is a web app (its own README says so) and was
  // filed here as desktop-only.
  //
  // Cards are shown in the order below, easiest first. There used to be a
  // sort by a per-client rating; nobody could source those numbers, so the
  // ratings and the follower counts next to them are gone.
  const clients = useMemo((): NostrClient[] => [
    {
      id: 'damus',
      name: t('clientComparisonTable.clients.damus.name'),
      icon: 'D',
      platforms: ['ios'],
      difficulty: 'beginner',
      wallet: true,
      media: true,
      longform: false,
      privacy: true,
      description: t('clientComparisonTable.clients.damus.description'),
      pros: getArray('clientComparisonTable.clients.damus.pros'),
      cons: getArray('clientComparisonTable.clients.damus.cons'),
      urls: CLIENT_URLS.damus,
      tags: [t('clientComparisonTable.tags.beginnerFriendly'), t('clientComparisonTable.tags.popular')],
    },
    {
      id: 'primal',
      name: t('clientComparisonTable.clients.primal.name'),
      icon: 'P',
      platforms: ['web', 'desktop', 'ios', 'android'],
      difficulty: 'beginner',
      wallet: true,
      media: true,
      longform: true,
      privacy: false,
      description: t('clientComparisonTable.clients.primal.description'),
      pros: getArray('clientComparisonTable.clients.primal.pros'),
      cons: getArray('clientComparisonTable.clients.primal.cons'),
      urls: CLIENT_URLS.primal,
      tags: [t('clientComparisonTable.tags.beginnerFriendly'), t('clientComparisonTable.tags.crossPlatform')],
    },
    {
      id: 'iris',
      name: t('clientComparisonTable.clients.iris.name'),
      icon: 'I',
      platforms: ['web', 'desktop'],
      difficulty: 'beginner',
      wallet: false,
      media: true,
      longform: false,
      privacy: true,
      description: t('clientComparisonTable.clients.iris.description'),
      pros: getArray('clientComparisonTable.clients.iris.pros'),
      cons: getArray('clientComparisonTable.clients.iris.cons'),
      urls: CLIENT_URLS.iris,
      tags: [t('clientComparisonTable.tags.beginnerFriendly'), t('clientComparisonTable.tags.webOnly')],
    },
    {
      id: 'snort',
      name: t('clientComparisonTable.clients.snort.name'),
      icon: 'S',
      platforms: ['web', 'desktop'],
      difficulty: 'beginner',
      wallet: false,
      media: true,
      longform: true,
      privacy: true,
      description: t('clientComparisonTable.clients.snort.description'),
      pros: getArray('clientComparisonTable.clients.snort.pros'),
      cons: getArray('clientComparisonTable.clients.snort.cons'),
      urls: CLIENT_URLS.snort,
      tags: [t('clientComparisonTable.tags.minimal'), t('clientComparisonTable.tags.privacy')],
    },
    {
      id: 'amethyst',
      name: t('clientComparisonTable.clients.amethyst.name'),
      icon: 'A',
      platforms: ['android'],
      difficulty: 'intermediate',
      wallet: true,
      media: true,
      longform: true,
      privacy: true,
      description: t('clientComparisonTable.clients.amethyst.description'),
      pros: getArray('clientComparisonTable.clients.amethyst.pros'),
      cons: getArray('clientComparisonTable.clients.amethyst.cons'),
      urls: CLIENT_URLS.amethyst,
      tags: [t('clientComparisonTable.tags.powerUser'), t('clientComparisonTable.tags.featureRich')],
    },
    {
      id: 'yakihonne',
      name: t('clientComparisonTable.clients.yakihonne.name'),
      icon: 'Y',
      platforms: ['web', 'desktop', 'ios', 'android'],
      difficulty: 'intermediate',
      wallet: true,
      media: true,
      longform: true,
      privacy: false,
      description: t('clientComparisonTable.clients.yakihonne.description'),
      pros: getArray('clientComparisonTable.clients.yakihonne.pros'),
      cons: getArray('clientComparisonTable.clients.yakihonne.cons'),
      urls: CLIENT_URLS.yakihonne,
      tags: [t('clientComparisonTable.tags.longForm'), t('clientComparisonTable.tags.writers')],
    },
    {
      id: 'nostur',
      name: t('clientComparisonTable.clients.nostur.name'),
      icon: 'N',
      platforms: ['ios'],
      difficulty: 'intermediate',
      wallet: true,
      media: true,
      longform: false,
      privacy: true,
      description: t('clientComparisonTable.clients.nostur.description'),
      pros: getArray('clientComparisonTable.clients.nostur.pros'),
      cons: getArray('clientComparisonTable.clients.nostur.cons'),
      urls: CLIENT_URLS.nostur,
      tags: [t('clientComparisonTable.tags.ios'), t('clientComparisonTable.tags.featureRich')],
    },
    {
      id: 'coracle',
      name: t('clientComparisonTable.clients.coracle.name'),
      icon: 'C',
      platforms: ['web', 'desktop'],
      difficulty: 'advanced',
      wallet: true,
      media: true,
      longform: true,
      privacy: true,
      description: t('clientComparisonTable.clients.coracle.description'),
      pros: getArray('clientComparisonTable.clients.coracle.pros'),
      cons: getArray('clientComparisonTable.clients.coracle.cons'),
      urls: CLIENT_URLS.coracle,
      tags: [t('clientComparisonTable.tags.powerUser'), t('clientComparisonTable.tags.privacy')],
    },
  ], [t, locale]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPlatform =
        selectedPlatforms.size === 0 ||
        client.platforms.some((p) => selectedPlatforms.has(p));

      const matchesFeatures =
        selectedFeatures.size === 0 ||
        Array.from(selectedFeatures).every((feature) => {
          if (feature === 'wallet') return client.wallet;
          if (feature === 'media') return client.media;
          if (feature === 'longform') return client.longform;
          if (feature === 'privacy') return client.privacy;
          return true;
        });

      const matchesDifficulty =
        !difficultyFilter || client.difficulty === difficultyFilter;

      return matchesSearch && matchesPlatform && matchesFeatures && matchesDifficulty;
    });
  }, [clients, searchQuery, selectedPlatforms, selectedFeatures, difficultyFilter]);

  const togglePlatform = (platform: Platform) => {
    const newSet = new Set(selectedPlatforms);
    if (newSet.has(platform)) {
      newSet.delete(platform);
    } else {
      newSet.add(platform);
    }
    setSelectedPlatforms(newSet);
  };

  const toggleFeature = (feature: string) => {
    const newSet = new Set(selectedFeatures);
    if (newSet.has(feature)) {
      newSet.delete(feature);
    } else {
      newSet.add(feature);
    }
    setSelectedFeatures(newSet);
  };

  const getPlatformLabel = (platform: Platform) => t(`clientComparisonTable.platformLabels.${platform}`);
  const getDifficultyLabel = (diff: Difficulty) => t(`clientComparisonTable.difficultyLabels.${diff}`);
  const getFeatureLabel = (feature: string) => t(`clientComparisonTable.featureLabels.${feature}`);

  const exportData = () => {
    const yes = t('clientComparisonTable.csvExport.yes');
    const no = t('clientComparisonTable.csvExport.no');
    // A translated header can carry a comma, so quote every cell and double
    // any quote inside it, per RFC 4180.
    const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [
      [
        t('clientComparisonTable.csvExport.headers.name'),
        t('clientComparisonTable.csvExport.headers.platforms'),
        t('clientComparisonTable.csvExport.headers.difficulty'),
        getFeatureLabel('wallet'),
        getFeatureLabel('media'),
        getFeatureLabel('longform'),
        getFeatureLabel('privacy'),
      ].map(cell).join(','),
      ...filteredClients.map((c) => [
        c.name,
        c.platforms.map(getPlatformLabel).join('; '),
        getDifficultyLabel(c.difficulty),
        c.wallet ? yes : no,
        c.media ? yes : no,
        c.longform ? yes : no,
        c.privacy ? yes : no,
      ].map(cell).join(',')),
    ].join('\n');

    downloadFile(CSV_FILENAME, csv);
  };

  const difficultyColors: Record<Difficulty, string> = {
    beginner: 'text-success-700 dark:text-success-400 bg-success-50 dark:bg-success-950',
    intermediate: 'text-warning-800 dark:text-warning-300 border border-warning-200 dark:border-warning-900',
    advanced: 'text-error-800 dark:text-error-300 border border-error-200 dark:border-error-900',
  };

  return (
    <div className={cn("max-w-6xl mx-auto", className)}>
      {/* Search & Filters */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} aria-hidden="true" />
            <input
              type="text"
              aria-label={t('clientComparisonTable.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('clientComparisonTable.searchPlaceholder')}
              className="w-full ps-10 pe-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md text-body text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors hover:border-gray-400 dark:hover:border-gray-600"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-4 py-2.5 rounded-md font-medium transition-colors inline-flex items-center gap-2 text-body-sm",
                showFilters
                  ? "bg-primary-600 text-white"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <Filter className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              {t('clientComparisonTable.filters.button')}
              {(selectedPlatforms.size > 0 || selectedFeatures.size > 0 || difficultyFilter) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-caption font-semibold text-primary-text">
                  {selectedPlatforms.size + selectedFeatures.size + (difficultyFilter ? 1 : 0)}
                </span>
              )}
            </button>
            <button
              onClick={exportData}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-body-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              {t('clientComparisonTable.export')}
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4 animate-slide-down motion-reduce:animate-none">
              {/* Platform Filters */}
              <div>
                <p className="text-body-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('clientComparisonTable.filters.platform')}</p>
                <div className="flex flex-wrap gap-2">
                  {(['ios', 'android', 'web', 'desktop'] as Platform[]).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors inline-flex items-center gap-1.5",
                        selectedPlatforms.has(platform)
                          ? "bg-primary-600 text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                      )}
                    >
                      {PLATFORM_ICONS[platform]}
                      {getPlatformLabel(platform)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Filters */}
              <div>
                <p className="text-body-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('clientComparisonTable.filters.features')}</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'wallet', icon: <Wallet className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" /> },
                    { id: 'media', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                    { id: 'longform', icon: <FileText className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" /> },
                    { id: 'privacy', icon: <Shield className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" /> },
                  ].map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors inline-flex items-center gap-1.5",
                        selectedFeatures.has(feature.id)
                          ? "bg-primary-600 text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                      )}
                    >
                      {feature.icon}
                      {getFeatureLabel(feature.id)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <p className="text-body-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('clientComparisonTable.filters.difficulty')}</p>
                <div className="flex flex-wrap gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(difficultyFilter === diff ? null : diff)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors",
                        difficultyFilter === diff
                          ? "bg-primary-600 text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                      )}
                    >
                      {getDifficultyLabel(diff)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedPlatforms.size > 0 || selectedFeatures.size > 0 || difficultyFilter) && (
                <button
                  onClick={() => {
                    setSelectedPlatforms(new Set());
                    setSelectedFeatures(new Set());
                    setDifficultyFilter(null);
                  }}
                  className="text-body-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {t('clientComparisonTable.clearFilters')}
                </button>
              )}
            </div>
        )}
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={cn(
              "cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-900",
              "animate-slide-up motion-reduce:animate-none",
              expandedClient === client.id ? "border-primary-600 dark:border-primary-400" : "hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800"
            )}
            onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
          >
            {/* Card Header */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-h4 text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  {client.icon}
                </div>
                <h3 className="text-h3 text-gray-900 dark:text-white">{client.name}</h3>
              </div>

              {/* Platforms & Difficulty */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {client.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-caption text-gray-600 dark:border-gray-800 dark:text-gray-400"
                  >
                    {PLATFORM_ICONS[platform]}
                    {getPlatformLabel(platform)}
                  </span>
                ))}
                <span className={cn("px-2 py-1 rounded-full text-caption font-medium", difficultyColors[client.difficulty])}>
                  {getDifficultyLabel(client.difficulty)}
                </span>
              </div>

              {/* Description */}
              <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-3">{client.description}</p>

              {/* Key Features */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {client.wallet && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 border border-success-200 text-success-800 dark:border-success-900 dark:text-success-300 rounded text-caption">
                    <Wallet className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" /> {getFeatureLabel('wallet')}
                  </span>
                )}
                {client.media && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 border border-blue-200 text-blue-800 dark:border-blue-900 dark:text-blue-300 rounded text-caption">
                    <ImageIcon className="w-3 h-3" /> {getFeatureLabel('media')}
                  </span>
                )}
                {client.longform && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300 rounded text-caption">
                    <FileText className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" /> {getFeatureLabel('longform')}
                  </span>
                )}
                {client.privacy && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-caption text-gray-700 dark:border-gray-800 dark:text-gray-400">
                    <Shield className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" /> {getFeatureLabel('privacy')}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {client.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 border border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300 rounded-full text-caption"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Expand Indicator */}
              <div className="flex items-center justify-center mt-3 text-gray-400">
                {expandedClient === client.id ? (
                  <ChevronUp className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedClient === client.id && (
                <div className="border-t border-gray-200 dark:border-gray-800 animate-slide-down motion-reduce:animate-none">
                  <div className="p-4 space-y-4">
                    {/* Links */}
                    <div className="flex flex-wrap gap-2">
                      {client.urls.web && (
                        <a
                          href={client.urls.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-body-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Globe className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                          {t('clientComparisonTable.card.links.web')}
                          <ExternalLink className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                        </a>
                      )}
                      {client.urls.ios && (
                        <a
                          href={client.urls.ios}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-body-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Smartphone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                          {t('clientComparisonTable.card.links.ios')}
                          <ExternalLink className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                        </a>
                      )}
                      {client.urls.android && (
                        <a
                          href={client.urls.android}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-body-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Smartphone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                          {t('clientComparisonTable.card.links.android')}
                          <ExternalLink className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                        </a>
                      )}
                      {client.urls.desktop && (
                        <a
                          href={client.urls.desktop}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-body-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Monitor className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                          {t('clientComparisonTable.card.links.desktop')}
                          <ExternalLink className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                        </a>
                      )}
                    </div>

                    {/* Pros/Cons */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2 text-body-sm font-medium text-success-800 dark:text-success-300">{t('clientComparisonTable.card.pros')}</p>
                        <ul className="space-y-1">
                          {client.pros.slice(0, 3).map((pro, i) => (
                            <li key={i} className="text-caption text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-success-700 dark:text-success-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-2 text-body-sm font-medium text-error-800 dark:text-error-300">{t('clientComparisonTable.card.cons')}</p>
                        <ul className="space-y-1">
                          {client.cons.slice(0, 3).map((con, i) => (
                            <li key={i} className="text-caption text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                              <X className="w-3 h-3 text-error-700 dark:text-error-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" strokeWidth={1.5} aria-hidden="true" />
          <h3 className="text-h3 font-semibold text-gray-900 dark:text-white mb-2">{t('clientComparisonTable.noResults.title')}</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('clientComparisonTable.noResults.description')}
          </p>
        </div>
      )}
    </div>
  );
}
