import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKey(key: string, maxLength: number = 20): string {
  if (key.length <= maxLength * 2 + 3) return key;
  return `${key.slice(0, maxLength)}...${key.slice(-maxLength)}`;
}

export function formatNpub(npub: string, showFull = false): string {
  if (showFull) return npub;
  if (npub.length <= 20) return npub;
  return `${npub.slice(0, 12)}...${npub.slice(-8)}`;
}

export function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function generateEntropyAnimation(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return defaultValue;
  }
}
