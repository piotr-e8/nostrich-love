/**
 * StreakBannerWrapper
 * 
 * Wrapper component that loads streak data from localStorage and displays the StreakBanner
 */

import React, { useState, useEffect } from 'react';
import { StreakBanner } from './StreakBanner';

interface GamificationData {
  progress?: {
    streakDays?: number;
    lastActive?: number;
  };
  streakDays?: number;
}

const DISMISS_KEY = 'nostrich-streak-banner-dismissed';

// Helper to check if two dates are the same day (ignoring time)
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export function StreakBannerWrapper() {
  const [streakDays, setStreakDays] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const loadStreakData = () => {
      try {
        const data = localStorage.getItem('nostrich-gamification-v1');
        const dismissedData = localStorage.getItem(DISMISS_KEY);
        
        if (data) {
          const parsed: GamificationData = JSON.parse(data);
          const days = parsed.progress?.streakDays || parsed.streakDays || 0;
          setStreakDays(days);
          
          // Determine if banner should be visible
          let shouldShow = days > 0;
          
          // Check if banner was dismissed today
          if (shouldShow && dismissedData) {
            const dismissedDate = new Date(dismissedData);
            const today = new Date();
            
            if (isSameDay(dismissedDate, today)) {
              // Banner was dismissed today, don't show it
              shouldShow = false;
            }
          }
          
          setIsVisible(shouldShow);
        }
      } catch (e) {
        console.error('Error loading streak data:', e);
      }
    };

    loadStreakData();

    // Listen for storage changes
    window.addEventListener('storage', loadStreakData);
    
    // Listen for custom streak update events
    const handleStreakUpdate = () => loadStreakData();
    window.addEventListener('streak-updated', handleStreakUpdate);

    return () => {
      window.removeEventListener('storage', loadStreakData);
      window.removeEventListener('streak-updated', handleStreakUpdate);
    };
  }, []);

  // Handle banner dismissal - stores the date in localStorage
  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, new Date().toISOString());
      setIsVisible(false);
    } catch (e) {
      console.error('Error saving dismiss state:', e);
    }
  };

  return (
    <StreakBanner
      streakDays={streakDays}
      isVisible={isVisible}
      position="top"
      onDismiss={handleDismiss}
    />
  );
}

export default StreakBannerWrapper;
