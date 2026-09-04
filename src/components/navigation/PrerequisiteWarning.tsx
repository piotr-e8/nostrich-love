import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { checkPrerequisites } from '../../lib/progressService';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { guidePath } from "../../i18n/paths";
import type { Locale } from '../../config/locales';

export interface PrerequisiteWarningProps {
  currentGuideId: string;
  currentGuideTitle: string;
  prerequisites: Array<{
    slug: string;
    title: string;
    estimatedTime?: string;
  }>;
  lang?: Locale;
  className?: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const STORAGE_KEY_PREFIX = 'nostrich-prereq-warning-dismissed-';

export function PrerequisiteWarning({
  currentGuideId,
  currentGuideTitle,
  prerequisites,
  lang = 'en',
  className,
  onDismiss,
  dismissible = true,
}: PrerequisiteWarningProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [incompletePrereqs, setIncompletePrereqs] = useState<typeof prerequisites>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if warning was previously dismissed
    const dismissedKey = `${STORAGE_KEY_PREFIX}${currentGuideId}`;
    const isDismissed = typeof window !== 'undefined' && localStorage.getItem(dismissedKey) === 'true';
    
    if (isDismissed) {
      setIsVisible(false);
      return;
    }

    // Check which prerequisites are incomplete
    const prereqSlugs = prerequisites.map(p => p.slug);
    const { incomplete } = checkPrerequisites(currentGuideId, prereqSlugs);
    
    const incompleteData = prerequisites.filter(p => incomplete.includes(p.slug));
    setIncompletePrereqs(incompleteData);
    setIsVisible(incompleteData.length > 0);
  }, [currentGuideId, prerequisites]);

  const handleDismiss = () => {
    setIsVisible(false);
    
    // Store dismissal in localStorage
    if (typeof window !== 'undefined') {
      const dismissedKey = `${STORAGE_KEY_PREFIX}${currentGuideId}`;
      localStorage.setItem(dismissedKey, 'true');
    }
    
    onDismiss?.();
  };

  const calculateTotalTime = () => {
    let totalMinutes = 0;
    incompletePrereqs.forEach(prereq => {
      if (prereq.estimatedTime) {
        const match = prereq.estimatedTime.match(/(\d+)/);
        if (match) {
          totalMinutes += parseInt(match[1], 10);
        }
      }
    });
    return totalMinutes;
  };

  if (!isVisible || incompletePrereqs.length === 0) {
    return null;
  }

  const totalTime = calculateTotalTime();

  return (
    <div
      role="alert"
      aria-live="polite"
      // Callout's recipe, verbatim (VISUAL_SYSTEM.md §4 + §5): rounded-lg, a
      // flat semantic ground, no gradient, no backdrop-blur. This banner is the
      // first block on 12 of 16 guides and it sat one screen above migrated
      // callouts wearing the old house style — 16px radius, a peach-to-orange
      // gradient, blur(4px), a 40px amber tile behind the icon.
      // `not-prose` marks the component boundary (§6). The island tag already
      // does that job here, but the guard costs nothing and survives someone
      // dropping this into MDX without a client directive.
      className={cn(
        'not-prose relative rounded-lg border p-4',
        'border-warning-200 bg-warning-50 text-warning-900',
        'dark:border-warning-900 dark:bg-warning-950 dark:text-warning-100',
        className
      )}
    >
      <div className="flex gap-3">
        {/* No tile behind it: §5 forbids a coloured badge under an icon. The
            0.5 of margin is what puts the glyph's top edge on the heading's
            cap height rather than on the line box, which sits ~3px higher. */}
        <AlertTriangle
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning-600 dark:text-warning-400"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <h3 className="text-h4 font-semibold">
            {t('prerequisiteWarning.title')}
          </h3>
          <p className="mt-1 text-body-sm text-warning-800 dark:text-warning-200">
            {t('prerequisiteWarning.description')
              .replace('{count}', String(incompletePrereqs.length))
              .replace('{singular}', incompletePrereqs.length === 1 ? t('prerequisiteWarning.singular') : t('prerequisiteWarning.plural'))
              .replace('{itOrThem}', incompletePrereqs.length === 1 ? t('prerequisiteWarning.it') : t('prerequisiteWarning.them'))}
          </p>
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="-me-1 -mt-1 flex-shrink-0 self-start rounded-md p-1 text-warning-700 transition-colors hover:bg-warning-100 dark:text-warning-300 dark:hover:bg-warning-900"
            aria-label={t('prerequisiteWarning.dismiss')}
          >
            <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* The rows sit at the container's full width, not inside the heading's
          text column. On a 375px screen the column costs a row 32px of the 261
          it has, and the row is the part the reader is meant to act on. */}
      <ol className="mt-4 list-none space-y-2 ps-0">
        {incompletePrereqs.slice(0, isExpanded ? undefined : 3).map((prereq, index) => (
          <li key={prereq.slug}>
            <a
              href={guidePath(prereq.slug, lang)}
              // The card recipe (§4). Hover moves colour only — no
              // transition-property: all, nothing scales.
              // `no-underline` is belt and braces. The underline that used to
              // run under the title, the clock chip and the numeral came from
              // `.prose a` in globals.css; that rule now carries the boundary
              // guard, so it no longer reaches in here. This keeps the row a
              // card if anything ever gets past the guard.
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 no-underline',
                'border-warning-200 bg-white',
                'dark:border-warning-800 dark:bg-warning-900',
                'transition-colors',
                'hover:border-warning-400 hover:bg-warning-100',
                'dark:hover:border-warning-700 dark:hover:bg-warning-800'
              )}
            >
              <span
                // warning-800 on warning-100, 6.4:1. It was warning-600 on a
                // near-white tint, 3.2:1, which fails AA for 13px text. The
                // dark ground is 950, not 800: 800 is the row's own hover
                // colour, so the numeral dissolved into the row on hover.
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-warning-100 text-caption font-semibold text-warning-800 dark:bg-warning-950 dark:text-warning-100"
                aria-hidden="true"
              >
                {index + 1}
              </span>

              {/* Title over chip, not title beside chip: side by side, the clock
                  ate 77px of the 195 a row gets at 375px and every title wrapped
                  to four lines. */}
              <span className="min-w-0 flex-1">
                <span className="block text-body-sm font-medium text-gray-900 dark:text-gray-100">
                  {prereq.title}
                </span>
                {prereq.estimatedTime && (
                  // Both steps darker/lighter than the usual gray-500/gray-400.
                  // The row's hover ground is warning-100 in light (gray-500
                  // measures 4.34:1 there, under AA) and warning-900 in dark, a
                  // warm brown (gray-400 measures 3.57:1). These read 6.80 and
                  // 6.19, and they hold on the resting ground too.
                  <span className="mt-0.5 flex items-center gap-1.5 text-caption text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    {prereq.estimatedTime}
                  </span>
                )}
              </span>

              <ArrowRight
                // Same ground, same reason: the system's decorative gray-500
                // reads 1.89:1 here and vanishes.
                className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-400 rtl:rotate-180"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ol>

      {incompletePrereqs.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 w-full rounded-md py-2 text-body-sm font-medium text-warning-800 transition-colors hover:bg-warning-100 dark:text-warning-200 dark:hover:bg-warning-900"
        >
          {isExpanded
            ? t('prerequisiteWarning.showLess')
            : t('prerequisiteWarning.showMore').replace('{count}', String(incompletePrereqs.length - 3))}
        </button>
      )}

      <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-warning-200 pt-4 dark:border-warning-900 sm:flex-row sm:items-center">
        {totalTime > 0 && (
          <span className="flex items-center gap-2 text-body-sm text-warning-800 dark:text-warning-200">
            <Clock className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span>{t('prerequisiteWarning.timeEstimate').replace('{minutes}', String(totalTime))}</span>
          </span>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-warning-800 hover:bg-warning-100 dark:text-warning-200 dark:hover:bg-warning-900"
          >
            {t('prerequisiteWarning.continueAnyway')}
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<BookOpen className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />}
            onClick={() => {
              window.location.href = guidePath(incompletePrereqs[0].slug, lang);
            }}
          >
            {t('prerequisiteWarning.startFirst')}
          </Button>
        </div>
      </div>
    </div>
  );
}
