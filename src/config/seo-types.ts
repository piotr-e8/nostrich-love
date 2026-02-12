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
}

export interface PageSEO {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
}
