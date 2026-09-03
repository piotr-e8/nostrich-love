import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';

export interface TocHeading {
  /** 2 or 3. Deeper headings are dropped before the list reaches this component. */
  depth: number;
  /** The `id` rehype-slug put on the rendered heading. Non-ASCII in six locales. */
  slug: string;
  text: string;
}

interface TocNode extends TocHeading {
  children: TocHeading[];
}

interface TableOfContentsProps {
  headings: TocHeading[];
  className?: string;
}

/** Distance from the top of the viewport at which a heading counts as "reached". */
function stickyHeaderOffset(): number {
  const header = document.querySelector('header[role="banner"]');
  return (header?.getBoundingClientRect().height ?? 0) + 16;
}

/**
 * "On this page" for guide pages.
 *
 * One instance serves both layouts. Below xl it is a collapsed disclosure (a
 * 44px row); the panel that opens is capped and scrolls inside itself, because
 * an earlier attempt at this shipped a 320px block that covered a phone screen.
 * At xl it is a sticky column beside the article and the disclosure button is
 * display:none, which also takes it out of the accessibility tree, so the
 * aria-expanded state it carries never contradicts what is on screen.
 *
 * Third-level headings are shown only for the section the reader is currently
 * in. Guides run from 6 to 45 headings, and listing every one of them turns the
 * longest guides' contents into a second article.
 */
export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const { t } = useTranslation();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const tree = useMemo<TocNode[]>(() => {
    const nodes: TocNode[] = [];
    for (const heading of headings) {
      if (heading.depth === 2 || nodes.length === 0) {
        nodes.push({ ...heading, children: [] });
      } else {
        nodes[nodes.length - 1].children.push(heading);
      }
    }
    return nodes;
  }, [headings]);

  const slugsInOrder = useMemo(
    () => tree.flatMap((node) => [node.slug, ...node.children.map((child) => child.slug)]),
    [tree],
  );

  // Scroll spy. Position-based rather than IntersectionObserver: a heading is
  // "current" once its top has passed under the sticky header, which is the
  // same rule a reader applies by eye, and it stays correct for sections
  // shorter than the viewport.
  useEffect(() => {
    if (slugsInOrder.length === 0) return;
    let frame = 0;

    const compute = () => {
      frame = 0;
      const offset = stickyHeaderOffset();
      let current: string | null = null;
      for (const slug of slugsInOrder) {
        const el = document.getElementById(slug);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = slug;
        else break;
      }
      // Sections that end at the bottom of the document can never scroll far
      // enough to win on their own.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        for (let i = slugsInOrder.length - 1; i >= 0; i--) {
          if (document.getElementById(slugsInOrder[i])) {
            current = slugsInOrder[i];
            break;
          }
        }
      }
      setActiveSlug(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [slugsInOrder]);

  const activeSectionSlug = useMemo(() => {
    if (!activeSlug) return null;
    const node = tree.find(
      (n) => n.slug === activeSlug || n.children.some((child) => child.slug === activeSlug),
    );
    return node?.slug ?? null;
  }, [activeSlug, tree]);

  const goTo = useCallback((event: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    const el = document.getElementById(slug);
    // No target means the anchor is stale; let the browser do whatever it can.
    if (!el) return;
    event.preventDefault();

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = el.getBoundingClientRect().top + window.scrollY - stickyHeaderOffset();
    window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });

    // Move the keyboard caret to the section as well, otherwise Tab continues
    // from the link and the reader is back at the top of the page.
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    try {
      window.history.replaceState(null, '', `#${slug}`);
    } catch {
      // Some embedded browsers refuse replaceState; the scroll already happened.
    }
    setActiveSlug(slug);
    setOpen(false);
  }, []);

  if (tree.length === 0) return null;

  // The rail is the whole design: a hairline the reader's position moves along.
  // Purple marks the current entry because that is the one nav state the accent
  // exists for; everything else is gray and only the border changes on hover.
  const linkClass = (slug: string, nested: boolean) =>
    cn(
      'block border-s-2 py-1.5 pe-2 text-body-sm transition-colors',
      nested ? 'ps-6' : 'ps-3',
      activeSlug === slug
        ? 'border-primary-600 font-medium text-primary-text dark:border-primary-400 dark:text-primary-400'
        : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-100',
    );

  return (
    <nav
      aria-label={t('tableOfContents.ariaLabel')}
      className={cn(
        'rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900',
        className,
      )}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          event.currentTarget.querySelector('button')?.focus();
        }
      }}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-body-sm font-semibold text-gray-900 dark:text-gray-100 xl:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{t('tableOfContents.title')}</span>
        {/* The flip still states open/closed; the tween on it does not, and
            transition-transform is out under VISUAL_SYSTEM.md §4. */}
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500', open && 'rotate-180')}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      <p className="hidden px-4 pt-4 pb-2 text-micro font-semibold uppercase text-gray-500 dark:text-gray-400 xl:block">
        {t('tableOfContents.title')}
      </p>

      <div
        id={panelId}
        className={cn(
          'overflow-y-auto px-2 pb-3 xl:block xl:max-h-[calc(100vh-11rem)] xl:pb-4',
          open ? 'block max-h-[60vh]' : 'hidden',
        )}
      >
        <ol className="space-y-0.5">
          {tree.map((node) => (
            <li key={node.slug}>
              <a
                href={`#${node.slug}`}
                className={linkClass(node.slug, false)}
                aria-current={activeSlug === node.slug ? 'location' : undefined}
                onClick={(event) => goTo(event, node.slug)}
              >
                {node.text}
              </a>
              {node.children.length > 0 && activeSectionSlug === node.slug && (
                <ol className="space-y-0.5">
                  {node.children.map((child) => (
                    <li key={child.slug}>
                      <a
                        href={`#${child.slug}`}
                        className={linkClass(child.slug, true)}
                        aria-current={activeSlug === child.slug ? 'location' : undefined}
                        onClick={(event) => goTo(event, child.slug)}
                      >
                        {child.text}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
