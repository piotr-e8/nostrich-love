import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export interface GuideWithPrerequisites {
  slug: string;
  title: string;
  description?: string;
  estimatedTime?: string;
  prerequisites: string[];
}

/**
 * Load all guides with their prerequisite information
 */
export async function loadGuidesWithPrerequisites(): Promise<GuideWithPrerequisites[]> {
  const allGuides = await getCollection('guides');
  const englishGuides = allGuides.filter(guide => guide.slug.startsWith('en/'));
  
  return englishGuides.map(guide => ({
    slug: guide.slug.replace('en/', ''),
    title: guide.data.title,
    description: guide.data.description,
    estimatedTime: guide.data.estimatedTime,
    prerequisites: guide.data.prerequisites || [],
  }));
}

/**
 * Get prerequisite data for a specific guide
 */
export async function getGuidePrerequisites(
  guideSlug: string
): Promise<GuideWithPrerequisites[]> {
  const allGuides = await loadGuidesWithPrerequisites();
  const guide = allGuides.find(g => g.slug === guideSlug);
  
  if (!guide || !guide.prerequisites.length) {
    return [];
  }
  
  return guide.prerequisites
    .map(prereqSlug => allGuides.find(g => g.slug === prereqSlug))
    .filter((g): g is GuideWithPrerequisites => g !== undefined);
}

/**
 * Check if a guide has any prerequisites
 */
export function hasPrerequisites(guide: CollectionEntry<'guides'>): boolean {
  const prereqs = guide.data.prerequisites;
  return Array.isArray(prereqs) && prereqs.length > 0;
}

/**
 * Get all incomplete prerequisite guides for a user
 */
export async function getIncompletePrerequisites(
  guideSlug: string,
  isGuideCompleted: (slug: string) => boolean
): Promise<GuideWithPrerequisites[]> {
  const allPrereqs = await getGuidePrerequisites(guideSlug);
  return allPrereqs.filter(prereq => !isGuideCompleted(prereq.slug));
}
