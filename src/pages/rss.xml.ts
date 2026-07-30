// RSS feed for the English guides.
//
// English only: un-prefixed /guides/<slug> URLs are the canonical versions
// (house URL scheme; other locales are prefixed alternates of the same
// content, and a 7-locale feed would be 84% duplicates for any one reader).
//
// No <pubDate> on purpose: zero guides carry machine-readable dates today
// (`updated:` exists in the schema but no EN guide sets it), and RSS 2.0
// items are valid without one. Fabricating build-time dates would mark every
// item "new" on every deploy. If `updated:` frontmatter lands later, map it
// to pubDate conditionally here.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { siteConfig } from '../config/site';

export async function GET(context: APIContext) {
  const guides = await getCollection('guides', (g) => g.slug.startsWith('en/'));

  // `priority` frontmatter is the curated reading order (1 = start here).
  // Slug tiebreak keeps the feed byte-stable regardless of FS enumeration.
  guides.sort(
    (a, b) =>
      (a.data.priority ?? 999) - (b.data.priority ?? 999) ||
      a.slug.localeCompare(b.slug)
  );

  return rss({
    title: `${siteConfig.name} — Nostr Beginner Guides`,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    items: guides.map((g) => ({
      title: g.data.title,
      description: g.data.description ?? '',
      link: `/guides/${g.slug.replace('en/', '')}/`,
    })),
    customData: '<language>en</language>',
  });
}
