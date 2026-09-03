import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark' || value === 'system';

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

/** Maps the user's preference onto the theme that should actually be applied. */
const resolveTheme = (theme: Theme): ResolvedTheme =>
  theme === 'system' ? getSystemTheme() : theme;

interface DarkModeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function DarkModeToggle({ className, showLabel = false }: DarkModeToggleProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (isTheme(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(resolveTheme(savedTheme));
    } else {
      // Check system preference
      setTheme('system');
      applyTheme(getSystemTheme());
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newTheme: ResolvedTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    applyTheme(resolveTheme(newTheme));
  };

  if (!mounted) {
    return (
      <div className={cn('h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800', className)} />
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel && (
        <span className="text-body-sm text-gray-600 dark:text-gray-400">Theme</span>
      )}
      <div className="flex rounded-md border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
        <button
          onClick={() => handleThemeChange('light')}
          className={cn(
            'flex items-center justify-center rounded-md p-1.5 transition-colors',
            theme === 'light'
              ? 'bg-white text-primary-text dark:bg-gray-800 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          )}
          aria-label="Light mode"
        >
          <Sun className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={cn(
            'flex items-center justify-center rounded-md p-1.5 transition-colors',
            theme === 'dark'
              ? 'bg-white text-primary-text dark:bg-gray-800 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          )}
          aria-label="Dark mode"
        >
          <Moon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          onClick={() => handleThemeChange('system')}
          className={cn(
            'flex items-center justify-center rounded-md p-1.5 transition-colors',
            theme === 'system'
              ? 'bg-white text-primary-text dark:bg-gray-800 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          )}
          aria-label="System preference"
        >
          <Monitor className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// Simple toggle button variant
export function DarkModeToggleSimple({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <button className={cn('rounded-md p-2', className)} aria-label="Toggle theme">
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'rounded-md p-2 transition-colors',
        'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        'dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}
