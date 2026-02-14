/**
 * Simulator Navigation Component
 * Horizontal tab bar for switching between Nostr client simulators
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  damusConfig, 
  amethystConfig, 
  primalConfig, 
  snortConfig, 
  yakihonneConfig,
  coracleConfig,
  gossipConfig,
} from '../../simulators/shared/configs';
import { SimulatorClient, type SimulatorConfig } from '../../simulators/shared/types';

interface SimulatorNavProps {
  currentClient: SimulatorClient;
  className?: string;
}

// Define all simulator navigation items with their configs
const simulatorNavItems: { client: SimulatorClient; config: SimulatorConfig }[] = [
  { client: SimulatorClient.DAMUS, config: damusConfig },
  { client: SimulatorClient.AMETHYST, config: amethystConfig },
  { client: SimulatorClient.PRIMAL, config: primalConfig },
  { client: SimulatorClient.SNORT, config: snortConfig },
  { client: SimulatorClient.YAKIHONNE, config: yakihonneConfig },
  { client: SimulatorClient.CORACLE, config: coracleConfig },
  { client: SimulatorClient.GOSSIP, config: gossipConfig },
];

export function SimulatorNavigation({ currentClient, className }: SimulatorNavProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Check scroll position to show/hide scroll buttons
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Get color class based on client config
  const getClientColorClass = (config: SimulatorConfig, isActive: boolean): string => {
    if (isActive) {
      // Active state - use the client's primary color
      switch (config.id) {
        case SimulatorClient.DAMUS:
          return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 ring-2 ring-purple-500/20';
        case SimulatorClient.AMETHYST:
          return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-purple-400 dark:border-purple-600 ring-2 ring-purple-600/20';
        case SimulatorClient.PRIMAL:
          return 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700 ring-2 ring-orange-500/20';
        case SimulatorClient.SNORT:
          return 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 ring-2 ring-teal-500/20';
        case SimulatorClient.YAKIHONNE:
          return 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700 ring-2 ring-pink-500/20';
        case SimulatorClient.CORACLE:
          return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20';
        case SimulatorClient.GOSSIP:
          return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 ring-2 ring-green-500/20';
        default:
          return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
      }
    } else {
      // Inactive state - subtle hover effect
      return 'bg-white dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600';
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Navigation Tabs */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-2 scroll-smooth justify-center"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {simulatorNavItems.map(({ client, config }) => {
          const isActive = client === currentClient;
          const href = `/simulators/${config.id.toLowerCase()}`;

          return (
            <a
              key={client}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
                getClientColorClass(config, isActive)
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <img 
                src={config.icon} 
                alt={`${config.name} logo`}
                className="w-6 h-6 rounded-md object-cover"
              />
              <span>{config.name}</span>
              {isActive && (
                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to get config for a specific client
export function getSimulatorNavConfig(client: SimulatorClient): SimulatorConfig | undefined {
  const item = simulatorNavItems.find(item => item.client === client);
  return item?.config;
}

export default SimulatorNavigation;
