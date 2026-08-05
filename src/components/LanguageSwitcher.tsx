import React, { useState, useEffect, useRef, useId } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import {
  splitLocale,
  localePath,
  stripLocale,
  isLocale,
  localizedLocales,
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();

  useEffect(() => {
    setMounted(true);

    const path = window.location.pathname;
    const { locale } = splitLocale(path);
    setCurrentLang(locale);

    // On a localized route served in the default locale, honour a previously
    // saved preference — but only when that locale is actually built for THIS
    // route (the glossary ships in 4 locales, guides in 7; redirecting a zh
    // reader to /zh/glossary/ would land on a 404).
    if (locale === DEFAULT_LOCALE) {
      const savedLang = localStorage.getItem('preferredLanguage');
      if (
        isLocale(savedLang) &&
        savedLang !== DEFAULT_LOCALE &&
        localizedLocales(path).includes(savedLang)
      ) {
        setCurrentLang(savedLang);
        window.location.href = localePath(path, savedLang);
      }
    }
  }, []);

  // When the list opens, move focus to the currently selected language.
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = Math.max(
        0,
        languages.findIndex((lang) => lang.code === currentLang),
      );
      optionRefs.current[selectedIndex]?.focus();
    }
  }, [isOpen, currentLang]);

  const switchLanguage = (langCode: string) => {
    if (!isLocale(langCode)) return;

    const currentPath = window.location.pathname;
    localStorage.setItem('preferredLanguage', langCode);

    // Target the picked locale only when THIS route is built in it
    // (guides: all seven; glossary: en/pl/es/de). Otherwise fall back to the
    // English version by dropping any stale locale prefix — never link a 404.
    const newPath = localizedLocales(currentPath).includes(langCode)
      ? localePath(currentPath, langCode)
      : stripLocale(currentPath);

    window.location.href = newPath;
  };

  const closeList = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const count = languages.length;
    const activeIndex = optionRefs.current.findIndex(
      (el) => el === document.activeElement,
    );
    const focusOption = (index: number) => optionRefs.current[index]?.focus();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusOption(activeIndex < 0 ? 0 : (activeIndex + 1) % count);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusOption(activeIndex < 0 ? count - 1 : (activeIndex - 1 + count) % count);
        break;
      case "Home":
        event.preventDefault();
        focusOption(0);
        break;
      case "End":
        event.preventDefault();
        focusOption(count - 1);
        break;
      case "Escape":
        event.preventDefault();
        closeList();
        break;
    }
  };

  // Close the list when focus leaves the component (e.g. Tab away).
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (
      isOpen &&
      (!(next instanceof Node) || !wrapperRef.current?.contains(next))
    ) {
      setIsOpen(false);
    }
  };

  if (!mounted) {
    return (
      <button
        className={cn(
          "p-2 rounded-lg text-gray-600 dark:text-gray-400",
          className,
        )}
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" aria-hidden="true" />
      </button>
    );
  }

  const currentLanguage =
    languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <button
        ref={triggerRef}
        onClick={() => (isOpen ? closeList() : setIsOpen(true))}
        // Keep focus where it is on mousedown: in Safari a click does not
        // focus buttons, so without this the option focused on open would
        // blur (relatedTarget: null), handleBlur would close the list, and
        // the click would toggle it straight back open.
        onMouseDown={(event) => event.preventDefault()}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={`Change language, current: ${currentLanguage.label}`}
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline" aria-hidden="true">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown
          className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            id={listboxId}
            role="listbox"
            aria-label="Select language"
            // Prevent the mousedown default so clicking an option never blurs
            // the focused option first — in Safari that blur (relatedTarget:
            // null) would unmount the list before the click could register.
            onMouseDown={(event) => event.preventDefault()}
            className="absolute end-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg z-50 overflow-hidden"
          >
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={currentLang === lang.code}
                tabIndex={-1}
                onClick={() => {
                  switchLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-start text-sm transition-colors",
                  currentLang === lang.code
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <span className="text-lg" aria-hidden="true">{lang.flag}</span>
                <span lang={lang.code}>{lang.label}</span>
                {currentLang === lang.code && (
                  <span className="ms-auto text-primary" aria-hidden="true">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
