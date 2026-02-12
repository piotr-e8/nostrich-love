/**
 * SimulatorShell - Base Container Component
 * Wraps all simulators with common layout and styling
 */

import React from 'react';
import type { SimulatorShellProps } from '../types';
import { cn } from '../../../utils/cn';

/**
 * SimulatorShell - Base container for all Nostr client simulators
 * 
 * Provides:
 * - Consistent mobile-first responsive layout
 * - Platform-specific theming (iOS, Android, Web, Desktop)
 * - Safe area handling for mobile
 * - Base typography and colors
 */
export function SimulatorShell({ 
  children, 
  config, 
  className 
}: SimulatorShellProps) {
  const isMobile = config.platform === 'ios' || config.platform === 'android';
  
  return (
    <div 
      className={cn(
        // Base styles
        'simulator-shell relative w-full h-full overflow-hidden',
        'bg-gray-50 dark:bg-gray-900',
        
        // Platform-specific base styles
        config.platform === 'ios' && 'ios-simulator font-sans',
        config.platform === 'android' && 'android-simulator font-sans',
        config.platform === 'web' && 'web-simulator font-sans',
        config.platform === 'desktop' && 'desktop-simulator font-sans',
        
        // Mobile-specific styles
        isMobile && [
          'max-w-md mx-auto',
          'border-x border-gray-200 dark:border-gray-800',
          'shadow-2xl',
        ],
        
        className
      )}
      style={{
        '--simulator-primary': config.primaryColor,
        '--simulator-secondary': config.secondaryColor,
      } as React.CSSProperties}
      data-simulator={config.id}
      data-platform={config.platform}
    >
      {/* Status bar (mobile only) */}
      {isMobile && (
        <div className="simulator-status-bar h-6 bg-black text-white text-xs flex items-center justify-between px-4 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="simulator-content relative flex flex-col h-full">
        {children}
      </div>
      
      {/* Safe area indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 right-0 p-1 text-[10px] text-gray-400 opacity-50 pointer-events-none">
          {config.id}
        </div>
      )}
    </div>
  );
}

export default SimulatorShell;
