/**
 * SEO Types
 */

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  /** Structured data emitted as a JSON-LD script tag. A page may pass several
   *  schema objects (e.g. WebPage + FAQPage) — JSON.stringify serializes the
   *  array form as-is, which Google accepts. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export interface PageSEO {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
}
