import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge has to be told that the named type steps are font sizes.
// Without this it files `text-h3` and `text-caption` under the same group as
// `text-gray-900`, so `cn("text-body-sm", "text-gray-600")` silently returns
// only the last one — the size or the colour disappears, and which one you lose
// depends on the order the strings happen to be in. That hit 24 call sites the
// moment the type scale landed: chips whose label reverted to inherited size,
// a wordmark that lost its colour. Named steps live in tailwind.config.js
// `fontSize`; keep the two lists in step.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'h1',
            'h2',
            'h3',
            'h4',
            'lead',
            'body',
            'body-sm',
            'caption',
            'micro',
          ],
        },
      ],
    },
  },
});

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
