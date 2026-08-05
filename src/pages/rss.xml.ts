// RSS feed for the English guides.
//
// English only: un-prefixed /guides/<slug> URLs are the canonical versions
// (house URL scheme; other locales are prefixed alternates of the same
// content, and a 7-locale feed would be 84% duplicates for any one reader).
//
// <pubDate> is emitted only for guides whose frontmatter carries a real date
// (`published`, or `lastUpdated`/`updated` as the fallback). RSS 2.0 items are
// valid without one, and a build-time or git-derived stand-in would mark every
// item "new" on every deploy — so an undated guide still ships undated.
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
    items: guides.map((g) => {
      const pubDate = g.data.published ?? g.data.lastUpdated ?? g.data.updated;
      return {
        title: g.data.title,
        description: g.data.description ?? '',
        link: `/guides/${g.slug.replace('en/', '')}/`,
        // Number.isNaN guard: a malformed frontmatter date must not emit an
        // "Invalid Date" pubDate, which breaks the whole feed for readers.
        ...(pubDate && !Number.isNaN(pubDate.getTime()) ? { pubDate } : {}),
      };
    }),
    customData: '<language>en</language>',
  });
}
