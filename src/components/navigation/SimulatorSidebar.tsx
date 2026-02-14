/**
 * Simulator Sidebar Navigation Component
 * Collapsible sidebar for switching between Nostr client simulators
 * Saves vertical space by moving navigation to the side
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Menu, Play, RotateCcw, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  damusConfig, 
  amethystConfig, 
  primalConfig, 
  snortConfig, 
  yakihonneConfig,
  coracleConfig,
  gossipConfig,
  keychatConfig,
  olasConfig,
} from '../../simulators/shared/configs';
import { SimulatorClient, type SimulatorConfig } from '../../simulators/shared/types';
import { hasCompletedTour, hasSkippedTour, resetTourProgress } from '../tour/tourStorage';
import type { TourConfig } from '../tour/types';

interface SimulatorSidebarProps {
  currentClient: SimulatorClient;
  className?: string;
  onToggle?: (isExpanded: boolean) => void;
}

interface SimulatorGroup {
  label: string;
  clients: { client: SimulatorClient; config: SimulatorConfig }[];
}

// Tour ID mapping for each simulator
const tourIdMap: Record<SimulatorClient, string> = {
  [SimulatorClient.DAMUS]: 'damus-tour',
  [SimulatorClient.AMETHYST]: 'amethyst-tour',
  [SimulatorClient.PRIMAL]: 'primal-tour',
  [SimulatorClient.SNORT]: 'snort-tour',
  [SimulatorClient.YAKIHONNE]: 'yakihonne-tour',
  [SimulatorClient.CORACLE]: 'coracle-tour',
  [SimulatorClient.GOSSIP]: 'gossip-tour',
  [SimulatorClient.KEYCHAT]: 'keychat-tour',
  [SimulatorClient.OLAS]: 'olas-tour',
};

// Group simulators by platform
const simulatorGroups: SimulatorGroup[] = [
  {
    label: 'iOS',
    clients: [
      { client: SimulatorClient.DAMUS, config: damusConfig },
      { client: SimulatorClient.YAKIHONNE, config: yakihonneConfig },
      { client: SimulatorClient.OLAS, config: olasConfig },
    ],
  },
  {
    label: 'Android',
    clients: [
      { client: SimulatorClient.AMETHYST, config: amethystConfig },
      { client: SimulatorClient.KEYCHAT, config: keychatConfig },
    ],
  },
  {
    label: 'Web',
    clients: [
      { client: SimulatorClient.PRIMAL, config: primalConfig },
      { client: SimulatorClient.SNORT, config: snortConfig },
      { client: SimulatorClient.CORACLE, config: coracleConfig },
    ],
  },
  {
    label: 'Desktop',
    clients: [
      { client: SimulatorClient.GOSSIP, config: gossipConfig },
    ],
  },
];

// Get color class based on client config
const getClientColorClass = (config: SimulatorConfig, isActive: boolean): string => {
  if (isActive) {
    switch (config.id) {
      case SimulatorClient.DAMUS:
        return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case SimulatorClient.AMETHYST:
        return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-purple-400 dark:border-purple-600';
      case SimulatorClient.PRIMAL:
        return 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case SimulatorClient.SNORT:
        return 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700';
      case SimulatorClient.YAKIHONNE:
        return 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700';
      case SimulatorClient.CORACLE:
        return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700';
      case SimulatorClient.GOSSIP:
        return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
      case SimulatorClient.KEYCHAT:
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case SimulatorClient.OLAS:
        return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
    }
  } else {
    return 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200';
  }
};

export function SimulatorSidebar({ currentClient, className, onToggle }: SimulatorSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tourStatus, setTourStatus] = useState<'new' | 'completed' | 'skipped'>('new');

  // Get tour ID for current simulator
  const tourId = tourIdMap[currentClient];

  // Check tour status
  const checkTourStatus = useCallback(() => {
    if (hasCompletedTour(tourId)) {
      setTourStatus('completed');
    } else if (hasSkippedTour(tourId)) {
      setTourStatus('skipped');
    } else {
      setTourStatus('new');
    }
  }, [tourId]);

  // Check status on mount and when client changes
  useEffect(() => {
    checkTourStatus();
  }, [checkTourStatus]);

  // Listen for tour state changes
  useEffect(() => {
    const handleStorageChange = () => {
      checkTourStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkTourStatus]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  // Find current group for highlighting
  const currentGroup = simulatorGroups.find(group => 
    group.clients.some(({ client }) => client === currentClient)
  );

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16",
        className
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={cn(
          "flex items-center justify-center h-12 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
          isExpanded ? "px-4 justify-between" : "justify-center"
        )}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? (
          <>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Simulators</span>
            <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </>
        ) : (
          <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {/* Simulator List */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {simulatorGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {/* Group Label - only shown when expanded */}
            {isExpanded && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {group.label}
              </div>
            )}
            
            {/* Group Clients */}
            <div className="space-y-1 px-2">
              {group.clients.map(({ client, config }) => {
                const isActive = client === currentClient;
                const href = `/simulators/${config.id.toLowerCase()}`;

                return (
                  <a
                    key={client}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg transition-all duration-200",
                      isExpanded ? "px-3 py-2.5" : "justify-center py-2.5",
                      getClientColorClass(config, isActive),
                      isActive && "font-medium shadow-sm border"
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    title={isExpanded ? undefined : config.name}
                  >
                    <img 
                      src={config.icon} 
                      alt={`${config.name} logo`}
                      className={cn(
                        "rounded-md object-cover flex-shrink-0",
                        isExpanded ? "w-7 h-7" : "w-8 h-8"
                      )}
                    />
                    {isExpanded && (
                      <span className="text-sm truncate">{config.name}</span>
                    )}
                    {isActive && isExpanded && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tour Button at Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
        <button
          id="sidebarTourButton"
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200",
            "bg-purple-600 hover:bg-purple-700 text-white",
            isExpanded ? "px-3" : "px-2"
          )}
          title={tourStatus === 'completed' ? 'Retake Tour' : tourStatus === 'skipped' ? 'Resume Tour' : 'Start Tour'}
          onClick={() => {
            // Reset tour progress and dispatch start event
            resetTourProgress(tourId);
            setTourStatus('new');
            window.dispatchEvent(new CustomEvent(`start-${tourId}`));
          }}
        >
          {tourStatus === 'completed' || tourStatus === 'skipped' ? (
            <RotateCcw className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Play className="w-4 h-4 flex-shrink-0" />
          )}
          {isExpanded && (
            <span className="text-sm font-medium whitespace-nowrap">
              {tourStatus === 'completed' ? 'Retake Tour' : tourStatus === 'skipped' ? 'Resume Tour' : 'Start Tour'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default SimulatorSidebar;
