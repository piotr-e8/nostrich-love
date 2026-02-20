import React, { useState, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect current language from URL
    const path = window.location.pathname;
    const isGuidesPage = path.includes('/guides/') || path.endsWith('/guides');
    
    if (path.startsWith("/pl/")) {
      setCurrentLang("pl");
      // If we're on a non-guides page with /pl/ prefix, redirect back to English
      if (!isGuidesPage && path !== '/pl/') {
        window.location.href = path.replace(/^\/pl/, '') || '/';
        return;
      }
    } else if (path.startsWith("/es/")) {
      setCurrentLang("es");
      // If we're on a non-guides page with /es/ prefix, redirect back to English
      if (!isGuidesPage && path !== '/es/') {
        window.location.href = path.replace(/^\/es/, '') || '/';
        return;
      }
    } else if (path.startsWith("/en/")) {
      setCurrentLang("en");
    } else {
      // Check if there's a saved preference in localStorage
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && ['en', 'pl', 'es'].includes(savedLang)) {
        setCurrentLang(savedLang);
        // Only redirect to locale-prefixed URL if we're on a guides page
        if (savedLang !== 'en' && isGuidesPage) {
          window.location.href = `/${savedLang}${path}`;
        }
      } else {
        setCurrentLang("en");
      }
    }
  }, []);

  const switchLanguage = (langCode: string) => {
    const currentPath = window.location.pathname;
    let newPath: string;

    // Save preference
    localStorage.setItem('preferredLanguage', langCode);

    // Check if we're on a guides page (the only translated content)
    const isGuidesPage = currentPath.includes('/guides/') || currentPath.endsWith('/guides');

    if (isGuidesPage) {
      // For guides, use locale-prefixed URLs
      // Remove any existing locale prefix
      const pathWithoutLocale = currentPath.replace(/^\/(en|pl|es)(\/|$)/, '/') || '/';

      if (langCode === "en") {
        newPath = `/en${pathWithoutLocale}`;
      } else {
        newPath = `/${langCode}${pathWithoutLocale}`;
      }
    } else {
      // For all other pages, stay on English version
      // Remove any locale prefix if present
      newPath = currentPath.replace(/^\/(pl|es)\//, '/');
    }

    window.location.href = newPath;
  };

  if (!mounted) {
    return (
      <button
        className={cn(
          "p-2 rounded-lg text-gray-600 dark:text-gray-400",
          className,
        )}
      >
        <Globe className="w-5 h-5" />
      </button>
    );
  }

  const currentLanguage =
    languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown
          className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg z-50 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  switchLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                  currentLang === lang.code
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
                {currentLang === lang.code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
