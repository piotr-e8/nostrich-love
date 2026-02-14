/**
 * StreakBannerWrapper
 * 
 * Wrapper component that loads streak data from localStorage and displays the StreakBanner
 */

import React, { useState, useEffect } from 'react';
import { StreakBanner } from './StreakBanner';
import { getStreakInfo } from '../../utils/gamificationEngine';

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
    // Load streak data
    const loadStreakData = () => {
      try {
        const dismissedData = localStorage.getItem(DISMISS_KEY);
        const { streakDays } = getStreakInfo();
        
        setStreakDays(streakDays);
        
        // Determine if banner should be visible
        let shouldShow = streakDays > 0;
        
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
      } catch (e) {
        console.error('Error loading streak data:', e);
      }
    };

    loadStreakData();

    // Listen for gamification updates
    window.addEventListener('gamification-updated', loadStreakData);

    return () => {
      window.removeEventListener('gamification-updated', loadStreakData);
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
