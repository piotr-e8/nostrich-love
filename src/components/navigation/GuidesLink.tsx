import React, { useState, useEffect } from "react";
import {
  guidesIndexPath,
  splitLocale,
  isLocale,
  DEFAULT_LOCALE,
} from "../../i18n/paths";

interface GuidesLinkProps {
  className?: string;
  children: React.ReactNode;
}

// This link renders on every page, so its SSR value is what crawlers index:
// it must be the canonical, un-prefixed English path.
const DEFAULT_HREF = guidesIndexPath(DEFAULT_LOCALE);

export function GuidesLink({ className, children }: GuidesLinkProps) {
  const [guidesHref, setGuidesHref] = useState(DEFAULT_HREF);

  useEffect(() => {
    const { locale } = splitLocale(window.location.pathname);

    if (locale !== DEFAULT_LOCALE) {
      setGuidesHref(guidesIndexPath(locale));
      return;
    }

    // Un-prefixed page: honour a saved preference, if there is one.
    const savedLang = localStorage.getItem("preferredLanguage");
    if (isLocale(savedLang)) {
      setGuidesHref(guidesIndexPath(savedLang));
    }
  }, []);

  // suppressHydrationWarning: href is recalculated after mount from the URL
  return (
    <a href={guidesHref} className={className} suppressHydrationWarning>
      {children}
    </a>
  );
}

export default GuidesLink;
