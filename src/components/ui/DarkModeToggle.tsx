import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';

type Theme = 'light' | 'dark' | 'system';

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
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme('system');
      applyTheme(systemDark ? 'dark' : 'light');
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

  const applyTheme = (newTheme: 'light' | 'dark') => {
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
    
    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemDark ? 'dark' : 'light');
    } else {
      applyTheme(newTheme);
    }
  };

  if (!mounted) {
    return (
      <div className={cn('h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800', className)} />
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
      )}
      <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={() => handleThemeChange('light')}
          className={cn(
            'flex items-center justify-center rounded-md p-1.5 transition-all duration-200',
            theme === 'light'
              ? 'bg-white text-amber-500 shadow-sm dark:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          )}
          aria-label="Light mode"
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={cn(
            'flex items-center justify-center rounded-md p-1.5 transition-all duration-200',
            theme === 'dark'
              ? 'bg-white text-primary-600 shadow-sm dark:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          )}
          aria-label="Dark mode"
        >
          <Moon className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleThemeChange('system')}
          className={cn(
            'flex items-center justify-center rounded-md p-1.5 transition-all duration-200',
            theme === 'system'
              ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          )}
          aria-label="System preference"
        >
          <Monitor className="h-4 w-4" />
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
      <button className={cn('rounded-lg p-2', className)} aria-label="Toggle theme">
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'rounded-lg p-2 transition-colors duration-200',
        'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        'dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
