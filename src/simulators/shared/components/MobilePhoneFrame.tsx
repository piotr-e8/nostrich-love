/**
 * MobilePhoneFrame - Shared mobile device frame component
 * Provides consistent mobile phone appearance with proper aspect ratio
 */

import React from 'react';
import { cn } from '../../../utils/cn';

export interface MobilePhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  platform?: 'ios' | 'android';
  showStatusBar?: boolean;
}

/**
 * MobilePhoneFrame - Wraps simulators in a realistic mobile phone frame
 * 
 * Features:
 * - Fixed 9:19.5 aspect ratio (iPhone 14 Pro dimensions)
 * - Device bezel styling with rounded corners
 * - Centered positioning that stays fixed on scroll
 * - Internal content scrolling only
 * - Platform-specific status bars (iOS/Android)
 */
export function MobilePhoneFrame({
  children,
  className,
  platform = 'ios',
  showStatusBar = true,
}: MobilePhoneFrameProps) {
  return (
    <div className="mobile-phone-frame-wrapper flex items-center justify-center h-full w-full p-4">
      {/* Phone Frame Container */}
      <div
        className={cn(
          // Phone bezel/frame
          'relative',
          'w-full max-w-[375px]',
          'bg-gray-900',
          'rounded-[50px]',
          'p-3',
          'shadow-2xl',
          'border-4 border-gray-800',
          
          // Fixed aspect ratio (9:19.5 for modern phones)
          'aspect-[9/19.5]',
          'max-h-[80vh]',
          
          // Prevent scrolling of the frame itself
          'overflow-hidden',
          
          className
        )}
      >
        {/* Screen Container */}
        <div className="relative w-full h-full bg-white dark:bg-gray-900 rounded-[40px] overflow-hidden">
          {/* Notch (iOS) or Punch Hole (Android) */}
          {platform === 'ios' ? (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-[20px] z-50" />
          ) : (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-gray-800 rounded-full z-50" />
          )}

          {/* Status Bar */}
          {showStatusBar && (
            <div
              className={cn(
                'absolute top-0 left-0 right-0 h-[44px] z-40',
                'flex items-center justify-between px-6',
                'text-xs font-semibold',
                platform === 'ios' 
                  ? 'text-black dark:text-white pt-2' 
                  : 'text-black dark:text-white'
              )}
            >
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          {/* Content Area - Scrollable */}
          <div 
            className={cn(
              'absolute inset-0',
              'overflow-y-auto overflow-x-hidden',
              'scrollbar-hide',
              showStatusBar && 'pt-[44px]'
            )}
          >
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-gray-400/50 dark:bg-gray-600/50 rounded-full z-40" />
        </div>

        {/* Side Buttons (Visual only) */}
        <div className="absolute -left-1 top-[120px] w-1 h-8 bg-gray-700 rounded-l" />
        <div className="absolute -left-1 top-[180px] w-1 h-12 bg-gray-700 rounded-l" />
        <div className="absolute -left-1 top-[220px] w-1 h-12 bg-gray-700 rounded-l" />
        <div className="absolute -right-1 top-[160px] w-1 h-16 bg-gray-700 rounded-r" />
      </div>
    </div>
  );
}

export default MobilePhoneFrame;
