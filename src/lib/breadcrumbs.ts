// BreadcrumbList JSON-LD builder.
//
// Google reads BreadcrumbList to replace the raw URL in a result with a
// readable trail, which is the one rich result this site's content actually
// qualifies for (FAQ rich results have been restricted to authoritative
// government and health sites since 2023, and HowTo was retired entirely).
// It also gives answer engines an explicit parent-child map of the site, which
// a flat 141-URL sitemap does not.
//
// Trails are built from real URLs only — every `item` here must be a page that
// returns 200, so a locale that does not ship a route must not appear in one.
import { siteConfig } from '../config/site';

export interface Crumb {
  /** Display name. Localize it: this string is what the SERP renders. */
  name: string;
  /** Site-relative path, e.g. "/pl/guides/". Trailing slash matches the canonicals. */
  path: string;
}

/**
 * @param crumbs Trail WITHOUT the home node — it is prepended for you.
 */
export function breadcrumbList(crumbs: Crumb[]) {
  const trail: Crumb[] = [{ name: siteConfig.name, path: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, siteConfig.url).toString(),
    })),
  };
}
