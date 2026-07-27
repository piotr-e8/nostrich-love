import React, { useState, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import {
  splitLocale,
  localePath,
  stripLocale,
  isLocale,
  hasLocalizedVersions,
  DEFAULT_LOCALE,
} from "../i18n/paths";

interface LanguageSwitcherProps {
  className?: string;
}

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const path = window.location.pathname;
    const { locale } = splitLocale(path);
    setCurrentLang(locale);

    // Only the guides exist in every locale. On a guides page served in the
    // default locale, honour a previously saved preference.
    if (locale === DEFAULT_LOCALE && hasLocalizedVersions(path)) {
      const savedLang = localStorage.getItem('preferredLanguage');
      if (isLocale(savedLang) && savedLang !== DEFAULT_LOCALE) {
        setCurrentLang(savedLang);
        window.location.href = localePath(path, savedLang);
      }
    }
  }, []);

  const switchLanguage = (langCode: string) => {
    if (!isLocale(langCode)) return;

    const currentPath = window.location.pathname;
    localStorage.setItem('preferredLanguage', langCode);

    // Guides are the only translated content; everything else is English-only,
    // so switching there just drops any stale locale prefix.
    const newPath = hasLocalizedVersions(currentPath)
      ? localePath(currentPath, langCode)
      : stripLocale(currentPath);

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
