import React, { useState, useEffect } from "react";

interface GuidesLinkProps {
  className?: string;
  children: React.ReactNode;
}

export function GuidesLink({ className, children }: GuidesLinkProps) {
  const [guidesHref, setGuidesHref] = useState("/en/guides");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check URL first
    const path = window.location.pathname;
    if (path.startsWith("/de/")) {
      setGuidesHref("/de/guides");
    } else if (path.startsWith("/pl/")) {
      setGuidesHref("/pl/guides");
    } else if (path.startsWith("/es/")) {
      setGuidesHref("/es/guides");
    } else if (path.startsWith("/en/")) {
      setGuidesHref("/en/guides");
    } else {
      // Check localStorage for saved preference
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang === 'de') {
        setGuidesHref("/de/guides");
      } else if (savedLang === 'pl') {
        setGuidesHref("/pl/guides");
      } else if (savedLang === 'es') {
        setGuidesHref("/es/guides");
      } else {
        setGuidesHref("/en/guides");
      }
    }
  }, []);

  // During SSR/hydration, render with default href
  // suppressHydrationWarning is needed because href changes after mount based on URL
  if (!mounted) {
    return (
      <a href="/en/guides" className={className} suppressHydrationWarning>
        {children}
      </a>
    );
  }

  return (
    <a href={guidesHref} className={className} suppressHydrationWarning>
      {children}
    </a>
  );
}

export default GuidesLink;
