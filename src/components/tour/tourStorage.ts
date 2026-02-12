/**
 * Tour Local Storage Service
 * Handles persistence of tour progress
 */

import { getPrivacySettings } from '../../lib/progressService';

const STORAGE_PREFIX = 'nostr-tour-';

export interface TourProgress {
  completed: boolean;
  skipped: boolean;
  lastStep: number;
  completedAt?: string;
  skippedAt?: string;
}

export function getTourProgress(tourId: string): TourProgress | null {
  if (typeof window === 'undefined') return null;
  
  const key = `${STORAGE_PREFIX}${tourId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  
  return null;
}

export function setTourProgress(
  tourId: string, 
  progress: Partial<TourProgress>
): void {
  if (typeof window === 'undefined') return;
  
  const key = `${STORAGE_PREFIX}${tourId}`;
  const existing = getTourProgress(tourId);
  
  const updated: TourProgress = {
    completed: false,
    skipped: false,
    lastStep: 0,
    ...existing,
    ...progress,
  };
  
  localStorage.setItem(key, JSON.stringify(updated));
}

export function markTourCompleted(tourId: string): void {
  setTourProgress(tourId, {
    completed: true,
    skipped: false,
    lastStep: -1,
    completedAt: new Date().toISOString(),
  });
}

export function markTourSkipped(tourId: string, lastStep: number): void {
  setTourProgress(tourId, {
    completed: false,
    skipped: true,
    lastStep,
    skippedAt: new Date().toISOString(),
  });
}

export function resetTourProgress(tourId: string): void {
  if (typeof window === 'undefined') return;
  
  const key = `${STORAGE_PREFIX}${tourId}`;
  localStorage.removeItem(key);
}

export function hasCompletedTour(tourId: string): boolean {
  const progress = getTourProgress(tourId);
  return progress?.completed ?? false;
}

export function hasSkippedTour(tourId: string): boolean {
  const progress = getTourProgress(tourId);
  return progress?.skipped ?? false;
}

export function shouldAutoStartTour(tourId: string): boolean {
  // Check if tours are globally enabled in privacy settings
  const privacySettings = getPrivacySettings();
  if (!privacySettings.toursEnabled) {
    return false;
  }

  // Check if this specific tour has been completed or skipped
  const progress = getTourProgress(tourId);
  return !progress?.completed && !progress?.skipped;
}
