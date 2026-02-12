/**
 * useParentTheme Hook
 * Syncs simulator theme with the parent site's theme
 * Watches for changes to the html.dark class
 */

import { useState, useEffect } from 'react';

export function useParentTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial check
    setIsDark(document.documentElement.classList.contains('dark'));

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const hasDarkClass = document.documentElement.classList.contains('dark');
          setIsDark(hasDarkClass);
        }
      });
    });

    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return isDark ? 'dark' : 'light';
}

export default useParentTheme;
