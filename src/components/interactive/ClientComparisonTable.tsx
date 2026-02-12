import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Monitor,
  Globe,
  Star,
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
  Sparkles,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn, downloadFile } from '../../lib/utils';

type Platform = 'ios' | 'android' | 'web' | 'desktop';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface NostrClient {
  id: string;
  name: string;
  icon: string;
  platforms: Platform[];
  rating: number;
  difficulty: Difficulty;
  wallet: boolean;
  media: boolean;
  longform: boolean;
  privacy: boolean;
  userCount: string;
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

const CLIENTS: NostrClient[] = [
  {
    id: 'damus',
    name: 'Damus',
    icon: 'D',
    platforms: ['ios'],
    rating: 4.8,
    difficulty: 'beginner',
    wallet: true,
    media: true,
    longform: false,
    privacy: true,
    userCount: '100K+',
    description: 'The most popular iOS client with a polished UI and smooth experience.',
    pros: ['Beautiful UI', 'Easy to use', 'Active development', 'Great onboarding', 'Zaps support'],
    cons: ['iOS only', 'Limited desktop sync', 'No long-form content'],
    urls: { ios: 'https://apps.apple.com/app/damus/id1628663131' },
    tags: ['Beginner Friendly', 'Popular'],
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    icon: 'A',
    platforms: ['android'],
    rating: 4.7,
    difficulty: 'intermediate',
    wallet: true,
    media: true,
    longform: true,
    privacy: true,
    userCount: '50K+',
    description: 'A feature-rich Android client with excellent support for all Nostr features.',
    pros: ['Full-featured', 'Zaps support', 'Active community', 'Regular updates', 'Highly customizable'],
    cons: ['Can be overwhelming for beginners', 'Android only', 'Complex settings'],
    urls: { android: 'https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst' },
    tags: ['Power User', 'Feature Rich'],
  },
  {
    id: 'primal',
    name: 'Primal',
    icon: 'P',
    platforms: ['web', 'ios', 'android'],
    rating: 4.6,
    difficulty: 'beginner',
    wallet: true,
    media: true,
    longform: true,
    privacy: false,
    userCount: '30K+',
    description: 'A fast, modern client available on all platforms with excellent performance.',
    pros: ['All platforms', 'Fast loading', 'Great search', 'Beautiful design', 'Regular updates'],
    cons: ['Privacy concerns for some', 'Newer app', 'Some features still in development'],
    urls: { 
      web: 'https://primal.net',
      ios: 'https://apps.apple.com/app/primal/id1673134518',
      android: 'https://play.google.com/store/apps/details?id=net.primal.android'
    },
    tags: ['Beginner Friendly', 'Cross Platform'],
  },
  {
    id: 'iris',
    name: 'Iris',
    icon: 'I',
    platforms: ['web'],
    rating: 4.4,
    difficulty: 'beginner',
    wallet: false,
    media: true,
    longform: false,
    privacy: true,
    userCount: '20K+',
    description: 'A simple, no-signup web client perfect for getting started quickly.',
    pros: ['No download needed', 'Works instantly', 'Clean interface', 'Open source', 'Private'],
    cons: ['Web only', 'Limited advanced features', 'No wallet integration'],
    urls: { web: 'https://iris.to' },
    tags: ['Beginner Friendly', 'Web Only'],
  },
  {
    id: 'snort',
    name: 'Snort',
    icon: 'S',
    platforms: ['web'],
    rating: 4.3,
    difficulty: 'beginner',
    wallet: false,
    media: true,
    longform: true,
    privacy: true,
    userCount: '15K+',
    description: 'A web client focused on simplicity and performance.',
    pros: ['Lightning fast', 'Minimal UI', 'No bloat', 'Great for reading', 'Privacy focused'],
    cons: ['Web only', 'Fewer social features', 'No wallet'],
    urls: { web: 'https://snort.social' },
    tags: ['Minimal', 'Privacy'],
  },
  {
    id: 'coracle',
    name: 'Coracle',
    icon: 'C',
    platforms: ['desktop'],
    rating: 4.5,
    difficulty: 'advanced',
    wallet: true,
    media: true,
    longform: true,
    privacy: true,
    userCount: '10K+',
    description: 'A desktop client for power users with advanced features.',
    pros: ['Powerful features', 'Desktop optimized', 'Great for creators', 'Advanced filtering', 'Keyboard shortcuts'],
    cons: ['Desktop only', 'Steeper learning curve', 'Not mobile friendly'],
    urls: { desktop: 'https://coracle.social' },
    tags: ['Power User', 'Desktop'],
  },
  {
    id: 'current',
    name: 'Current',
    icon: 'Cu',
    platforms: ['ios'],
    rating: 4.4,
    difficulty: 'intermediate',
    wallet: true,
    media: true,
    longform: true,
    privacy: true,
    userCount: '8K+',
    description: 'iOS client with excellent Nostr Wallet Connect integration.',
    pros: ['Best wallet support', 'NWC integration', 'Power user features', 'Clean UI'],
    cons: ['More complex', 'iOS only', 'Learning curve'],
    urls: { ios: 'https://apps.apple.com/app/current-nostr-client/id1668517032' },
    tags: ['Power User', 'Wallet Focused'],
  },
  {
    id: 'habla',
    name: 'Habla',
    icon: 'H',
    platforms: ['web'],
    rating: 4.2,
    difficulty: 'beginner',
    wallet: true,
    media: true,
    longform: true,
    privacy: false,
    userCount: '5K+',
    description: 'Long-form content focused client with newsletter support.',
    pros: ['Great for articles', 'Newsletter support', 'Clean writing interface', 'Monetization'],
    cons: ['Web only', 'Smaller user base', 'Limited social features'],
    urls: { web: 'https://habla.news' },
    tags: ['Long Form', 'Writers'],
  },
  {
    id: 'nostur',
    name: 'Nostur',
    icon: 'N',
    platforms: ['ios'],
    rating: 4.3,
    difficulty: 'intermediate',
    wallet: true,
    media: true,
    longform: false,
    privacy: true,
    userCount: '12K+',
    description: 'A feature-rich iOS client with a focus on usability.',
    pros: ['Great UI', 'Fast', 'Good relay management', 'Active dev'],
    cons: ['iOS only', 'Some learning required'],
    urls: { ios: 'https://apps.apple.com/app/nostur/id1672780508' },
    tags: ['iOS', 'Feature Rich'],
  },
  {
    id: 'plebstr',
    name: 'Plebstr',
    icon: 'Pl',
    platforms: ['android'],
    rating: 4.1,
    difficulty: 'beginner',
    wallet: false,
    media: true,
    longform: false,
    privacy: true,
    userCount: '8K+',
    description: 'A simple Android client for beginners.',
    pros: ['Easy to use', 'Clean design', 'Good performance'],
    cons: ['Fewer features', 'Android only', 'No wallet'],
    urls: { android: 'https://play.google.com/store/apps/details?id=com.plebstr.client' },
    tags: ['Beginner Friendly', 'Android'],
  },
];

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  ios: <Smartphone className="w-4 h-4" />,
  android: <Smartphone className="w-4 h-4" />,
  web: <Globe className="w-4 h-4" />,
  desktop: <Monitor className="w-4 h-4" />,
};

const PLATFORM_LABELS: Record<Platform, string> = {
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
  desktop: 'Desktop',
};

const DIFFICULTY_LABELS: Record<Difficulty, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'text-success-500 bg-success-500/10' },
  intermediate: { label: 'Intermediate', color: 'text-warning-500 bg-warning-500/10' },
  advanced: { label: 'Advanced', color: 'text-error-500 bg-error-500/10' },
};

export function ClientComparisonTable({ className }: ClientComparisonTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set());
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter clients
  const filteredClients = useMemo(() => {
    return CLIENTS.filter((client) => {
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
    }).sort((a, b) => b.rating - a.rating);
  }, [searchQuery, selectedPlatforms, selectedFeatures, difficultyFilter]);

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

  const exportData = () => {
    const csv = [
      ['Name', 'Platforms', 'Rating', 'Difficulty', 'Wallet', 'Media', 'Long-form', 'Privacy'].join(','),
      ...filteredClients.map((c) => [
        c.name,
        c.platforms.join(';'),
        c.rating,
        c.difficulty,
        c.wallet ? 'Yes' : 'No',
        c.media ? 'Yes' : 'No',
        c.longform ? 'Yes' : 'No',
        c.privacy ? 'Yes' : 'No',
      ].join(',')),
    ].join('\n');

    downloadFile('nostr-clients.csv', csv);
  };

  return (
    <div className={cn("max-w-6xl mx-auto", className)}>
      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-4 py-2.5 rounded-xl font-medium transition-all inline-flex items-center gap-2 text-sm",
                showFilters
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedPlatforms.size > 0 || selectedFeatures.size > 0 || difficultyFilter) && (
                <span className="w-5 h-5 bg-white text-purple-500 rounded-full text-xs flex items-center justify-center font-bold">
                  {selectedPlatforms.size + selectedFeatures.size + (difficultyFilter ? 1 : 0)}
                </span>
              )}
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-all inline-flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
            >
              {/* Platform Filters */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Platform</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(PLATFORM_LABELS) as Platform[]).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1.5",
                        selectedPlatforms.has(platform)
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      {PLATFORM_ICONS[platform]}
                      {PLATFORM_LABELS[platform]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Filters */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-3.5 h-3.5" /> },
                    { id: 'media', label: 'Media', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                    { id: 'longform', label: 'Long-form', icon: <FileText className="w-3.5 h-3.5" /> },
                    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-3.5 h-3.5" /> },
                  ].map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1.5",
                        selectedFeatures.has(feature.id)
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      {feature.icon}
                      {feature.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(difficultyFilter === diff ? null : diff)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                        difficultyFilter === diff
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      {DIFFICULTY_LABELS[diff].label}
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
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <motion.div
            key={client.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all cursor-pointer",
              expandedClient === client.id ? "ring-2 ring-purple-500" : "hover:border-purple-300 dark:hover:border-purple-700"
            )}
            onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
          >
            {/* Card Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {client.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{client.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-3.5 h-3.5" />
                      {client.userCount}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">{client.rating}</span>
                </div>
              </div>

              {/* Platforms & Difficulty */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {client.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs"
                  >
                    {PLATFORM_ICONS[platform]}
                    {PLATFORM_LABELS[platform]}
                  </span>
                ))}
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", DIFFICULTY_LABELS[client.difficulty].color)}>
                  {DIFFICULTY_LABELS[client.difficulty].label}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{client.description}</p>

              {/* Key Features */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {client.wallet && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                    <Wallet className="w-3 h-3" /> Wallet
                  </span>
                )}
                {client.media && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                    <ImageIcon className="w-3 h-3" /> Media
                  </span>
                )}
                {client.longform && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs">
                    <FileText className="w-3 h-3" /> Long-form
                  </span>
                )}
                {client.privacy && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 rounded text-xs">
                    <Shield className="w-3 h-3" /> Privacy
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {client.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Expand Indicator */}
              <div className="flex items-center justify-center mt-3 text-gray-400">
                {expandedClient === client.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedClient === client.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4 space-y-4">
                    {/* Links */}
                    <div className="flex flex-wrap gap-2">
                      {client.urls.web && (
                        <a
                          href={client.urls.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          Web
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {client.urls.ios && (
                        <a
                          href={client.urls.ios}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          <Smartphone className="w-4 h-4" />
                          iOS
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {client.urls.android && (
                        <a
                          href={client.urls.android}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          <Smartphone className="w-4 h-4" />
                          Android
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {client.urls.desktop && (
                        <a
                          href={client.urls.desktop}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          <Monitor className="w-4 h-4" />
                          Desktop
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Pros/Cons */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Pros</p>
                        <ul className="space-y-1">
                          {client.pros.slice(0, 3).map((pro, i) => (
                            <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Cons</p>
                        <ul className="space-y-1">
                          {client.cons.slice(0, 3).map((con, i) => (
                            <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                              <X className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No clients found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </div>
  );
}
